// Records the four "A week in BPM" clips the site scrubs with scroll position.
// Two runs, each on a FRESH mock-mode dev server (state is in memory):
//   node record-week.mjs a   -> step-1 (sign-ups open), step-2 (tap Join), step-3 (cancel your spot)
//   node record-week.mjs b   -> step-4 (the bill arrives, "I've sent it")
// Each clip is encoded all-intra so the browser can seek to any frame instantly while scrubbing.
import { mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { execFileSync } from 'child_process';
import { chromium, newPhone, login, settle, adminApi, setSession, DEMO_PLAYERS } from './lib.mjs';

const OUT = new URL('../../public/media/week/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const run = process.argv[2];
if (!['a', 'b'].includes(run)) throw new Error('usage: node record-week.mjs a|b');

const MAX_SECONDS = 4;
const ff = (...args) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' });

async function recorder(ctx, page) {
  const cdp = await ctx.newCDPSession(page);
  let frames = [];
  let dir;
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    if (dir) {
      const file = join(dir, `f${String(frames.length).padStart(5, '0')}.jpg`);
      writeFileSync(file, Buffer.from(data, 'base64'));
      frames.push({ file, t: metadata.timestamp });
    }
    await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  return {
    async start() {
      dir = mkdtempSync(join(tmpdir(), 'bpm-week-'));
      frames = [];
      await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 780, maxHeight: 1688, everyNthFrame: 1 });
      await page.waitForTimeout(150);
    },
    async stop(name) {
      const endT = Date.now() / 1000;
      await cdp.send('Page.stopScreencast');
      const d = dir;
      dir = undefined;
      await encode(name, frames, endT, d);
      rmSync(d, { recursive: true, force: true });
    },
  };
}

async function encode(name, frames, endT, dir) {
  // Screencast only emits on change; hold each frame until the next one, and the last until stop.
  const lines = [];
  frames.forEach((f, i) => {
    const next = frames[i + 1]?.t ?? Math.max(f.t + 0.04, endT);
    lines.push(`file '${f.file}'`, `duration ${Math.max(0.01, next - f.t).toFixed(3)}`);
  });
  lines.push(`file '${frames.at(-1).file}'`);
  const list = join(dir, 'list.txt');
  writeFileSync(list, lines.join('\n'));
  const raw = endT - frames[0].t;
  const speed = raw > MAX_SECONDS ? raw / MAX_SECONDS : 1;
  const vf = [
    `setpts=PTS/${speed.toFixed(4)}`,
    'fps=24',
    // 0.75x of the 780x1688 capture, rounded to even sides for yuv420p.
    'scale=584:1264:flags=lanczos',
  ].join(',');
  const mp4 = `${OUT}${name}.mp4`;
  let crf = 26;
  for (;;) {
    ff('-f', 'concat', '-safe', '0', '-i', list, '-vf', vf, '-an', '-c:v', 'libx264', '-preset', 'slow',
      '-crf', String(crf), '-g', '1', '-keyint_min', '1', '-sc_threshold', '0', '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart', mp4);
    if (statSync(mp4).size <= 1.2 * 1024 * 1024 || crf >= 36) break;
    crf += 2;
  }
  ff('-i', mp4, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '80', `${OUT}${name}-first.webp`);
  ff('-sseof', '-0.05', '-i', mp4, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '80', `${OUT}${name}-last.webp`);
  console.log(name, `raw ${raw.toFixed(1)}s, speed x${speed.toFixed(2)}, crf ${crf}, ${(statSync(mp4).size / 1024).toFixed(0)} KB`);
}

const centre = (loc) => loc.evaluate((el) => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));

const browser = await chromium.launch();
const api = await adminApi(browser);
await setSession(api);

if (run === 'a') {
  // Fill all 12 spots, put two on the waitlist, then free one spot so Lin's sign-up takes the last place.
  for (const name of DEMO_PLAYERS.slice(0, 11)) await api.call('POST', '/api/players', { name });
  const placeholder = await api.call('POST', '/api/players', { name: 'Alex' });
  for (const name of DEMO_PLAYERS.slice(11, 13)) await api.call('POST', '/api/players', { name, waitlist: true });
  const placeholderId = placeholder?.id ?? placeholder?.player?.id;
  if (!placeholderId) throw new Error(`no id for placeholder: ${JSON.stringify(placeholder).slice(0, 200)}`);
  await api.call('DELETE', '/api/players', { purgeOne: placeholderId });

  const ctx = await newPhone(browser);
  const p = await ctx.newPage();
  p.on('dialog', (d) => d.accept());
  await login(p, 'Lin', '2468');
  await p.evaluate(() => window.scrollTo(0, 0));
  await settle(p, 1200);
  const rec = await recorder(ctx, p);
  const signUp = p.getByRole('button', { name: /Sign up for this week/ });

  // Step 1: Home, then the sign-up card comes to the middle and the button is pressed.
  await rec.start();
  await p.waitForTimeout(350);
  await centre(signUp);
  await p.waitForTimeout(1300);
  const box = await signUp.boundingBox();
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await p.mouse.down();
  await p.waitForTimeout(450);
  await rec.stop('step-1');

  // Step 2: release = tap. Shuttle burst, open the roster, scroll to you and the waitlist.
  await rec.start();
  await p.mouse.up();
  await p.waitForTimeout(2300);
  await p.getByText(/others have signed up/).first().click();
  await p.waitForTimeout(700);
  await centre(p.getByText(/^waitlist$/i).locator('visible=true').last());
  await p.waitForTimeout(1500);
  await rec.stop('step-2');

  // Step 3: from the signed-up card, cancel your spot and confirm.
  await p.keyboard.press('Escape').catch(() => {});
  await p.evaluate(() => window.scrollTo(0, 0));
  await settle(p, 800);
  const cancel = p.getByText("Can't make it? Cancel my spot").locator('visible=true').first();
  await cancel.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await settle(p, 800);
  await rec.start();
  await p.waitForTimeout(300);
  await cancel.click();
  await p.waitForTimeout(900);
  const late = p.getByRole('button', { name: 'Cancel anyway' });
  if (await late.isVisible().catch(() => false)) { await late.click(); await p.waitForTimeout(700); }
  await p.getByRole('button', { name: 'Cancel my spot', exact: true }).locator('visible=true').last().click();
  await p.waitForTimeout(1800);
  await rec.stop('step-3');
  await ctx.close();
}

if (run === 'b') {
  for (const name of DEMO_PLAYERS.slice(0, 11)) await api.call('POST', '/api/players', { name });
  // Lin signs up off camera.
  {
    const ctx = await newPhone(browser); const p = await ctx.newPage();
    await login(p, 'Lin', '2468');
    await p.getByRole('button', { name: /Sign up for this week/ }).click();
    await settle(p, 2000);
    await ctx.close();
  }
  // The organiser closes sign-ups and sends the bill, off camera.
  {
    const ctx = await newPhone(browser); const p = await ctx.newPage();
    p.on('dialog', (d) => d.accept());
    await login(p, 'Grant', '1130');
    await p.locator('button.rail-tab[aria-label="Profile"]').click(); await settle(p);
    await p.getByText('Admin tools').click(); await settle(p);
    await p.getByRole('switch', { name: 'Sign-ups open' }).or(p.getByLabel('Sign-ups open')).first().click(); await settle(p);
    await p.getByRole('button', { name: 'Finalize cost' }).click(); await settle(p, 2500);
    await ctx.close();
  }
  // Step 4: Lin's balance shows what's owed; tap "I've sent it".
  const ctx = await newPhone(browser);
  const p = await ctx.newPage();
  await login(p, 'Lin', '2468');
  const bal = p.locator('button[aria-expanded]', { hasText: /balance/i }).first();
  await bal.waitFor({ timeout: 30000 });
  if ((await bal.getAttribute('aria-expanded')) !== 'true') { await bal.click(); await settle(p); }
  await p.evaluate(() => window.scrollTo(0, 0));
  await settle(p, 800);
  const rec = await recorder(ctx, p);
  await rec.start();
  await p.waitForTimeout(300);
  await bal.evaluate((el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  await p.waitForTimeout(1300);
  await p.getByRole('button', { name: /I.ve sent it/ }).locator('visible=true').first().click();
  await p.waitForTimeout(1700);
  await rec.stop('step-4');
  await ctx.close();
}

await api.close();
await browser.close();
