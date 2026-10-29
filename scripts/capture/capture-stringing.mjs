// Captures the stringer-side screens for the /stringers page: the admin bench, intake,
// string shelf, a stringer's assigned jobs and a player's job tracking.
// Needs a FRESH mock-mode dev server (state is in memory). See README.md.
import { mkdirSync } from 'fs';
import { execFileSync } from 'child_process';
import { chromium, newPhone, login, settle, adminApi, setSession, BASE } from './lib.mjs';

const OUT = new URL('../../public/media/screens/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const only = process.argv.slice(2);
const shots = [];

async function shot(page, name) {
  if (only.length && !only.includes(name)) return;
  await settle(page, 1200);
  await page.screenshot({ path: `${OUT}${name}.png` });
  shots.push(name);
  console.log('captured', name);
}

// Leave room under the sticky app header after scrollIntoView.
const clearHeader = (p) => p.evaluate(() => window.scrollBy(0, -72));
const tab = (p, name) => p.locator(`button.rail-tab[aria-label="${name}"]`).click().then(() => settle(p));
const vancouverDate = (offsetDays) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver' }).format(new Date(Date.now() + offsetDays * 864e5));

const browser = await chromium.launch();
const api = await adminApi(browser);

// 1. Shop open, prices, shelf and stock.
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
const today = vancouverDate(0);
const buy = (label, unit, units, metresPerUnit, totalCostCents) =>
  api.call('POST', '/api/stringing/stock', { label, catalogId: strings[label], unit, units, metresPerUnit, totalCostCents, date: vancouverDate(-20) });
await buy('Yonex BG65', 'reel', 1, 200, 16000);      // ~20 sets: In stock
await buy('Yonex Aerobite', 'reel', 1, 200, 24000);  // In stock
await buy('Yonex BG80', 'set', 3, 10, 3300);         // 3 sets, one used below: Low
await buy('Yonex Exbolt 63', 'set', 1, 10, 1400);    // 1 set, used below: Out

// 2. Members.
const members = await api.call('GET', '/api/members');
const list = Array.isArray(members) ? members : members.members || [];
const id = (name) => list.find((m) => m.name === name)?.id;

// 3. A lived-in bench: every status, one due today, one late.
const job = async (name, racketLabel, stringLabel, mains, crosses, status, readyIn, priceCents) => {
  const r = await api.call('POST', '/api/stringing/jobs', {
    memberId: id(name), memberName: name, racketLabel, stringLabel,
    tensionMains: mains, tensionCrosses: crosses, status, readyBy: vancouverDate(readyIn), priceCents,
  });
  return r.job;
};
// Created oldest-first: the bench lists newest first, so the varied ones land above the fold.
const jobs = {};
jobs.sindhu = await job('Sindhu', 'Astrox 88D Pro', 'Yonex BG65', 25, 26, 'picked_up', -3, 2000);
jobs.kento = await job('Kento', 'Arcsaber 11 Pro', 'Yonex Exbolt 63', 27, 28, 'ready', 2, 2800);
jobs.akane = await job('Akane', 'Nanoflare 800', 'Yonex BG65', 24, 25, 'strung', 1, 2000);
jobs.carolina = await job('Carolina', 'Thruster F', 'Yonex Aerobite', 25, 26, 'received', -1, 2600);
jobs.viktor = await job('Viktor', 'Astrox 99 Pro', 'Yonex BG80', 26, 27, 'requested', 0, 2400);
jobs.lin = await job('Lin', 'Astrox 88D Pro', 'Yonex Aerobite', 25, 26, 'strung', 1, 2600);
// A job PATCH names the player (the store's partition key) alongside the change.
const patchJob = (j, data) => api.call('PATCH', `/api/stringing/jobs/${j.id}`, { memberId: j.memberId, ...data });
await patchJob(jobs.carolina, { prioritized: true });

// 4. Lin as a player, BEFORE she can string: someone who can string is shown the stringer view instead.
{
  const ctx = await newPhone(browser); const p = await ctx.newPage();
  await login(p, 'Lin', '2468');
  await tab(p, 'Stringing');
  // The card folds its job rows away; open it so the racket and its stage show.
  const fold = p.locator('button[aria-expanded="false"]', { hasText: /stringing service/i }).first();
  if (await fold.count()) { await fold.click(); await settle(p); }
  await p.evaluate(() => window.scrollTo(0, 0));
  await shot(p, 'stringing-tracking');
  await ctx.close();
}

// Now Lin can string (not an admin), and two jobs are hers.
await api.call('PATCH', '/api/members', { id: id('Lin'), canString: true });
for (const j of [jobs.viktor, jobs.akane]) await patchJob(j, { stringerId: id('Lin') });

// 5. Admin: bench, intake, shelf.
{
  const ctx = await newPhone(browser); const p = await ctx.newPage();
  p.on('dialog', (d) => d.accept());
  await login(p, 'Grant', '1130');
  await tab(p, 'Profile');
  await p.getByText('Admin tools').click(); await settle(p);
  await p.getByText('Stringing bench').or(p.getByText('Stringing jobs')).locator('visible=true').first().click(); await settle(p);
  await shot(p, 'stringer-bench');

  // Intake for a returning player: their racket and string come up as suggestions.
  await p.getByRole('button', { name: /Add job/ }).locator('visible=true').first().click(); await settle(p);
  await p.getByLabel(/search/i).locator('visible=true').first().fill('Akane').catch(() => {});
  await settle(p, 600);
  await p.getByText('Akane', { exact: true }).locator('visible=true').first().click(); await settle(p);
  await p.getByRole('group', { name: /Akane/ }).first().getByRole('button').first().click().catch(() => {});
  await p.getByRole('group', { name: /Akane/ }).nth(1).getByRole('button').first().click().catch(() => {});
  await settle(p);
  await p.evaluate(() => window.scrollTo(0, 0));
  await shot(p, 'stringer-intake');
  await p.locator('button[aria-label^="Back"]:visible').first().click(); await settle(p);

  // Strings, stock, prices & holes.
  await p.getByText('Strings, stock, prices & holes').locator('visible=true').first().click(); await settle(p);
  await shot(p, 'stringer-shelf');
  await ctx.close();
}

// 6. Lin as a stringer: only the jobs assigned to her, no prices.
{
  const ctx = await newPhone(browser); const p = await ctx.newPage();
  await login(p, 'Lin', '2468');
  await tab(p, 'Stringing');
  await p.getByRole('tab', { name: 'Stringing jobs' }).or(p.getByRole('button', { name: 'Stringing jobs' })).first().click(); await settle(p);
  await p.evaluate(() => window.scrollTo(0, 0));
  await shot(p, 'stringer-assigned');
  await ctx.close();
}

await api.close();
await browser.close();
for (const name of shots) {
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', `${OUT}${name}.png`, '-c:v', 'libwebp', '-quality', '82', `${OUT}${name}.webp`]);
}
console.log(`done: ${shots.length} screens -> ${OUT}`);
