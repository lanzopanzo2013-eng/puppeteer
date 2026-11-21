// Probe: open Janitor AI on a real public profile from a GitHub runner and dump what the page
// actually is — the DOM, the box model of everything in the first 600px, and a screenshot.
// Run from the sandbox this is impossible (janitorai.com is not reachable), so a runner does it.
import fs from 'node:fs/promises';
import puppeteer from 'puppeteer';

const OUT = process.env.OUT || 'probe';
const UA = 'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) '
  + 'Chrome/126.0.0.0 Mobile Safari/537.36';
const log = (...a) => console.log(...a);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled', '--lang=en-US'],
  });
  const page = await browser.newPage();
  await page.setUserAgent(UA);
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  page.on('response', (r) => { if (r.status() >= 400) log('http', r.status(), r.url().slice(0, 120)); });
  page.on('console', (m) => { const t = m.text(); if (t.length < 200) log('console:', t); });

  log('== home');
  try { await page.goto('https://janitorai.com/', { waitUntil: 'domcontentloaded', timeout: 60000 }); }
  catch (e) { log('home err', e.message); }
  await wait(9000);
  const homeHtml = await page.content();
  log('home html', homeHtml.length, 'title', await page.title());
  await fs.writeFile(`${OUT}/home.html`, homeHtml.slice(0, 400000));
  await page.screenshot({ path: `${OUT}/home.png` });

  const prof = await page.evaluate(() =>
    [...document.querySelectorAll('a[href*="/profiles/"]')].map((a) => a.getAttribute('href'))[0] || null);
  log('profile link', prof);
  if (!prof) { await browser.close(); return; }

  const url = prof.startsWith('http') ? prof : 'https://janitorai.com' + prof;
  log('== profile', url);
  try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); }
  catch (e) { log('profile err', e.message); }
  await wait(14000);
  const html = await page.content();
  log('profile html', html.length);
  await fs.writeFile(`${OUT}/profile.html`, html.slice(0, 900000));
  await page.screenshot({ path: `${OUT}/profile-top.png` });

  const tree = await page.evaluate(() => {
    const out = [];
    const walk = (el, depth) => {
      if (depth > 16 || out.length > 600) return;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.height > 0 && r.top < 700) {
        out.push({
          d: depth, tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 90),
          top: Math.round(r.top), h: Math.round(r.height), w: Math.round(r.width),
          disp: cs.display, pos: cs.position, bg: cs.backgroundColor,
          txt: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
        });
      }
      for (const c of el.children) walk(c, depth + 1);
    };
    walk(document.body, 0);
    return out;
  });
  await fs.writeFile(`${OUT}/top.json`, JSON.stringify(tree, null, 1));
  log('nodes', tree.length);

  // the About block, and the chain of ancestors it lives in
  const chain = await page.evaluate(() => {
    const all = [...document.querySelectorAll('*')];
    const hit = all.find((e) => /about me/i.test(e.textContent || '') && e.children.length < 12);
    if (!hit) return null;
    const out = [];
    for (let e = hit; e && e !== document.body; e = e.parentElement) {
      const r = e.getBoundingClientRect();
      out.push({ tag: e.tagName.toLowerCase(), cls: (e.className || '').toString().slice(0, 120),
        top: Math.round(r.top), h: Math.round(r.height) });
    }
    return out;
  });
  await fs.writeFile(`${OUT}/chain.json`, JSON.stringify(chain, null, 1));
  log('chain', JSON.stringify(chain));

  await browser.close();
}
main().catch((e) => { console.log('FATAL', e.message); process.exit(1); });
