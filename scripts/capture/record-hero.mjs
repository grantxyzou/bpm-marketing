// Records the 10–15s hero loop: a player opens Home, signs up, and sees themselves on the roster.
// Uses a CDP screencast (2x frames) rather than Playwright's recordVideo, which records at 1x.
// Needs a FRESH mock-mode dev server (state is in memory). See README.md.
import { mkdtempSync, rmSync, statSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { execFileSync } from 'child_process';
import { chromium, newPhone, login, settle, adminApi, setSession, DEMO_PLAYERS } from './lib.mjs';

const OUT = new URL('../../public/media/', import.meta.url).pathname;
const raw = mkdtempSync(join(tmpdir(), 'bpm-hero-'));

const browser = await chromium.launch();
const api = await adminApi(browser);
await setSession(api);
for (const name of DEMO_PLAYERS.slice(0, 9)) await api.call('POST', '/api/players', { name });
await api.close();

const ctx = await newPhone(browser);
const p = await ctx.newPage();
await login(p, 'Lin', '2468');
await p.evaluate(() => window.scrollTo(0, 0));
await settle(p, 1500);

const cdp = await ctx.newCDPSession(p);
const frames = [];
cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
  const file = join(raw, `f${String(frames.length).padStart(5, '0')}.jpg`);
  writeFileSync(file, Buffer.from(data, 'base64'));
  frames.push({ file, t: metadata.timestamp });
  await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
});
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 780, maxHeight: 1688, everyNthFrame: 1 });

await p.waitForTimeout(2200);
await p.getByRole('button', { name: /Sign up for this week/ }).click();
await p.waitForTimeout(2800);
await p.getByText(/others have signed up/).first().click();
await p.waitForTimeout(800);
await p.getByText('Lin', { exact: true }).locator('visible=true').last()
  .evaluate((el) => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
await p.waitForTimeout(4300);
const endT = Date.now() / 1000;
await cdp.send('Page.stopScreencast');
await ctx.close();
await browser.close();

// Screencast only emits on change; hold each frame until the next one (and the last until the end).
const lines = [];
frames.forEach((f, i) => {
  const next = frames[i + 1]?.t ?? Math.max(f.t + 0.04, frames[0].t + (endT - frames[0].t));
  lines.push(`file '${f.file}'`, `duration ${Math.max(0.01, next - f.t).toFixed(3)}`);
});
lines.push(`file '${frames.at(-1).file}'`);
const list = join(raw, 'list.txt');
writeFileSync(list, lines.join('\n'));
const ff = (...args) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });
const vf = 'fps=30,scale=780:1688:force_original_aspect_ratio=decrease,pad=780:1688:(ow-iw)/2:(oh-ih)/2:color=0x100F0F';

ff('-f', 'concat', '-safe', '0', '-i', list, '-vf', vf, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '24',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${OUT}hero-loop.mp4`);
ff('-i', `${OUT}hero-loop.mp4`, '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '36', '-row-mt', '1', `${OUT}hero-loop.webm`);
ff('-ss', '0.2', '-i', `${OUT}hero-loop.mp4`, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '82', `${OUT}hero-poster.webp`);
rmSync(raw, { recursive: true, force: true });

for (const f of ['hero-loop.mp4', 'hero-loop.webm', 'hero-poster.webp']) {
  console.log(f, `${(statSync(`${OUT}${f}`).size / 1024).toFixed(0)} KB`);
}
console.log(`${frames.length} frames, ${(endT - frames[0].t).toFixed(1)}s`);
