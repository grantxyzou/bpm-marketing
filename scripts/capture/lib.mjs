// Shared helpers for capturing bpm. app media from a local mock-mode dev server.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
export const { chromium } = require('playwright');

export const ORIGIN = process.env.ORIGIN || 'http://localhost:3100';
export const BASE = `${ORIGIN}/bpm`;
export const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true };

// Seed data names the owner's real club and venue; the marketing site must not.
const REWRITES = [
  [/BPM Core/g, 'Thursday Shuttlers'],
  [/Wing['’]s Badminton/g, 'Northside Community Centre'],
  [/11820 Horseshoe Way, Richmond/g, 'Courts 3 & 4'],
  [/https?:\/\/localhost:\d+\/bpm\//g, 'https://bpm.grantzou.com/bpm/'],
];

export const HIDE_CSS = `
nextjs-portal, [data-nextjs-toast], #__next-build-watcher,
[data-testid="dev-panel"], [data-dev-panel], .dev-panel,
[data-testid="preview-banner"], [data-install-banner] { display: none !important; }
*, *::before, *::after { caret-color: transparent !important; }
`;

export async function newPhone(browser, { theme = 'dark' } = {}) {
  const ctx = await browser.newContext({
    ...PHONE,
    colorScheme: theme,
    timezoneId: 'America/Vancouver',
    locale: 'en-CA',
  });
  // Rewrite API JSON only: fulfilling the HTML document breaks hydration.
  await ctx.route(`${ORIGIN}/bpm/api/**`, async (route) => {
    const res = await route.fetch();
    const ct = res.headers()['content-type'] || '';
    if (!/json|text\/plain/.test(ct)) return route.fulfill({ response: res });
    let body = await res.text();
    for (const [re, to] of REWRITES) body = body.replace(re, to);
    return route.fulfill({ response: res, body });
  });
  await ctx.addInitScript(({ theme, css, rewrites }) => {
    try { localStorage.setItem('badminton_theme', theme); localStorage.setItem('bpm_install_hint_dismissed', '1'); } catch {}
    const res = rewrites.map(([src, to]) => [new RegExp(src, 'g'), to]);
    const fix = (root) => {
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        let v = n.nodeValue, o = v;
        for (const [re, to] of res) v = v.replace(re, to);
        if (v !== o) n.nodeValue = v;
      }
    };
    document.addEventListener('DOMContentLoaded', () => {
      const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
      fix(document.body);
      new MutationObserver((ms) => ms.forEach((m) => {
        if (m.type === 'characterData') fix(m.target.parentNode || document.body);
        m.addedNodes.forEach((n) => n.nodeType === 1 ? fix(n) : n.nodeType === 3 && fix(n.parentNode));
      })).observe(document.body, { subtree: true, childList: true, characterData: true });
    });
  }, { theme, css: HIDE_CSS, rewrites: REWRITES.map(([re, to]) => [re.source, to]) });
  return ctx;
}

export async function login(page, name, pin) {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByLabel('Your name').fill(name);
  await page.getByLabel('PIN').fill(pin);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await settle(page);
}

export async function settle(page, ms = 1500) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForFunction(() => !document.querySelector('[aria-busy="true"], .skeleton, .animate-pulse'), null, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(ms);
}

// Next Thursday 19:30 Vancouver time, at least ~30h out so sign-ups stay open.
export function nextThursday() {
  const now = new Date();
  const d = new Date(now.getTime() + 30 * 3600e3);
  while (new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'America/Vancouver' }).format(d) !== 'Thu') d.setTime(d.getTime() + 24 * 3600e3);
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver' }).format(d);
  const off = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Vancouver', timeZoneName: 'longOffset' }).format(d).match(/GMT([+-]\d\d:\d\d)/)[1];
  return { start: `${ymd}T19:30:00${off}`, end: `${ymd}T21:30:00${off}`, deadline: `${ymd}T12:00:00${off}` };
}

export const DEMO_PLAYERS = ['Maya', 'Daniel', 'Priya', 'Sam', 'Jordan', 'Wei', 'Hannah', 'Omar', 'Tessa', 'Ken', 'Noor', 'Eli', 'Rosa'];

// Admin-authenticated API calls through a throwaway request context.
export async function adminApi(browser) {
  const ctx = await browser.newContext();
  const r = await ctx.request.post(`${BASE}/api/admin`, { data: { name: process.env.ADMIN_NAME || 'Grant', pin: process.env.ADMIN_PIN || '1130' } });
  if (!r.ok()) throw new Error(`admin login ${r.status()} ${await r.text()}`);
  const call = async (method, path, data) => {
    const res = await ctx.request.fetch(`${BASE}${path}`, { method, data });
    const text = await res.text();
    if (!res.ok()) console.warn(`${method} ${path} -> ${res.status()} ${text.slice(0, 200)}`);
    try { return JSON.parse(text); } catch { return text; }
  };
  return { call, close: () => ctx.close() };
}

export async function setSession(api) {
  const t = nextThursday();
  return api.call('PUT', '/api/session', {
    title: 'Thursday Badminton', locationName: 'Northside Community Centre', locationAddress: 'Courts 3 & 4',
    datetime: t.start, endDatetime: t.end, deadline: t.deadline, maxPlayers: 12, courts: 3, costPerCourt: 60,
  });
}
