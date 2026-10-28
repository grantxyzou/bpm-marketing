// Captures phone screenshots of the bpm. app for the marketing site.
// Needs a FRESH mock-mode dev server (state is in memory). See README.md.
import { mkdirSync } from 'fs';
import { execFileSync } from 'child_process';
import { chromium, newPhone, login, settle, adminApi, setSession, BASE, DEMO_PLAYERS } from './lib.mjs';

const OUT = new URL('../../public/media/screens/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const only = process.argv.slice(2);
const shots = [];

async function shot(page, name, { top = true } = {}) {
  if (only.length && !only.includes(name)) return;
  if (top) await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page, 1200);
  const path = `${OUT}${name}.png`;
  await page.screenshot({ path });
  shots.push(name);
  console.log('captured', name);
}

const tab = (p, name) => p.locator(`button.rail-tab[aria-label="${name}"]`).click().then(() => settle(p));
const statsTab = (p, name) => p.getByRole('tab', { name, exact: true }).or(p.getByRole('button', { name, exact: true })).first().click().then(() => settle(p));

// The AI read needs ANTHROPIC_API_KEY; without it the card shows an error. Hide it rather than show it.
async function hideAiError(p) {
  await p.evaluate(() => {
    for (const el of document.querySelectorAll('body *')) {
      if (el.childElementCount === 0 && el.textContent.trim() === "Couldn't load your read.") {
        let box = el;
        while (box.parentElement && !box.textContent.includes('Try again')) box = box.parentElement;
        box.style.display = 'none';
      }
    }
  });
}

async function stats(p, suffix = '') {
  await tab(p, 'Stats');
  const consent = p.getByRole('button', { name: 'Show me where I sit' });
  if (await consent.isVisible().catch(() => false)) { await consent.click(); await settle(p); }
  await hideAiError(p);
  await statsTab(p, 'Equipment'); await shot(p, `stats-gear${suffix}`);
  if (suffix) return;
  await statsTab(p, 'Play'); await shot(p, 'stats-play');
  await statsTab(p, 'Learn'); await shot(p, 'stats-learn');
}

const browser = await chromium.launch();
const api = await adminApi(browser);

// 1. Demo data: generic venue/time, open stringing shop, 7 players signed up.
await setSession(api);
await api.call('PATCH', '/api/stringing/shop', { open: true });
await api.call('PATCH', '/api/stringing/pricing', {
  services: [
    { label: 'Restring', priceCents: 2000 },
    { label: 'Restring with your own string', priceCents: 1500 },
    { label: 'Grip replacement', priceCents: 500 },
  ],
});
const strings = { 'Yonex BG65': 'string-yx-bg65', 'Yonex BG80': 'string-yx-bg80', 'Yonex Aerobite': 'string-yx-abite', 'Yonex Exbolt 63': 'string-yx-ex63' };
await api.call('PATCH', '/api/stringing/strings', {
  strings: Object.keys(strings), links: strings,
  prices: { 'Yonex BG65': 2000, 'Yonex BG80': 2400, 'Yonex Aerobite': 2600, 'Yonex Exbolt 63': 2800 },
});
for (const name of DEMO_PLAYERS.slice(0, 7)) await api.call('POST', '/api/players', { name });

// 2. Signed-out welcome.
{
  const ctx = await newPhone(browser); const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await shot(p, 'welcome');
  await ctx.close();
}

// 3. Player (Lin) before signing up, dark.
{
  const ctx = await newPhone(browser); const p = await ctx.newPage();
  await login(p, 'Lin', '2468');
  await shot(p, 'home-signup');
  await stats(p);
  await tab(p, 'Stringing');
  await p.getByText('Submit a request').click(); await settle(p);
  await p.locator('select:visible').first().selectOption({ label: 'Astrox 88D Pro' }).catch(() => {});
  await p.getByText('Yonex Aerobite', { exact: true }).first().click().catch(() => {});
  await shot(p, 'stringing', { top: false });
  await p.keyboard.press('Escape'); await p.getByRole('button', { name: 'Close' }).first().click().catch(() => {});
  await settle(p);
  await tab(p, 'Profile');
  await shot(p, 'profile');
  await ctx.close();
}

// 4. Light theme versions.
{
  const ctx = await newPhone(browser, { theme: 'light' }); const p = await ctx.newPage();
  await login(p, 'Lin', '2468');
  await shot(p, 'home-signup-light');
  await stats(p, '-light');
  await ctx.close();
}

// 5. Lin signs up, the session fills, two land on the waitlist.
{
  const ctx = await newPhone(browser); const p = await ctx.newPage();
  await login(p, 'Lin', '2468');
  await p.getByRole('button', { name: /Sign up for this week/ }).click();
  await settle(p, 2500);
  for (const name of DEMO_PLAYERS.slice(7, 11)) await api.call('POST', '/api/players', { name });
  for (const name of DEMO_PLAYERS.slice(11, 13)) await api.call('POST', '/api/players', { name, waitlist: true });
  await p.reload({ waitUntil: 'networkidle' }); await settle(p);
  await p.getByText(/others have signed up/).first().click(); await settle(p);
  await p.getByText(/waitlist/i).locator('visible=true').last().evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await shot(p, 'roster-waitlist', { top: false });
  await ctx.close();
}

// 6. Organiser (Grant): Command Center, invite, close sign-ups, send the bill.
{
  const ctx = await newPhone(browser); const p = await ctx.newPage();
  p.on('dialog', (d) => d.accept());
  await login(p, 'Grant', '1130');
  await tab(p, 'Profile');
  await p.getByText('Admin tools').click(); await settle(p);
  await shot(p, 'admin-command-center');
  await p.getByText('Invite someone').locator('visible=true').first().click(); await settle(p);
  await p.getByRole('button', { name: 'Create an invite' }).click(); await settle(p);
  await shot(p, 'admin-invite', { top: false });
  await p.locator('button[aria-label^="Back"]:visible').first().click(); await settle(p);
  await p.getByRole('switch', { name: 'Sign-ups open' }).or(p.getByLabel('Sign-ups open')).first().click(); await settle(p);
  await p.getByRole('button', { name: 'Finalize cost' }).click(); await settle(p, 2500);
  // The share sheet needs an e-transfer recipient; show the sent bill and who has paid instead.
  await p.locator('[role="dialog"] button[aria-label="Close"]:visible, [role="dialog"] button:has-text("close"):visible').first().click().catch(() => {});
  await settle(p);
  await p.getByText(/^this week$/i).locator('visible=true').first().evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await shot(p, 'admin-send-the-bill', { top: false });
  await ctx.close();
}

// 7. Player balance after the bill.
{
  const ctx = await newPhone(browser); const p = await ctx.newPage();
  await login(p, 'Lin', '2468');
  const bal = p.locator('button[aria-expanded]', { hasText: /balance/i }).first();
  await bal.waitFor({ timeout: 30000 });
  if ((await bal.getAttribute('aria-expanded')) !== 'true') { await bal.click(); await settle(p); }
  await bal.evaluate((el) => el.scrollIntoView({ block: 'start' })); await settle(p);
  await shot(p, 'balance', { top: false });
  await ctx.close();
}

// 8. A new organiser starting a club.
{
  const ctx = await newPhone(browser); const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.getByRole('button', { name: 'Sign up' }).click(); await settle(p);
  await p.getByRole('button', { name: /Start your own group/ }).click(); await settle(p);
  await p.getByLabel('Your name').fill('Alex');
  await p.getByLabel('Email').fill('alex@example.com');
  await p.getByLabel('Password').fill('demo-password-123');
  await p.getByRole('button', { name: 'Create it' }).click(); await settle(p);
  await p.getByLabel('Group name').fill('Sunday Smashers');
  await p.getByLabel('Your name in this group').fill('Alex');
  await p.locator('input:focus').blur().catch(() => {});
  await shot(p, 'create-club');
  await ctx.close();
}

await api.close();
await browser.close();

// WebP copies (quality 82) next to each PNG.
for (const name of shots) {
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', `${OUT}${name}.png`, '-c:v', 'libwebp', '-quality', '82', `${OUT}${name}.webp`]);
}
console.log(`done: ${shots.length} screens -> ${OUT}`);
