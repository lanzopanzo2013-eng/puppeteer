// Probe: apply the delivered paste to a real Janitor profile from a GitHub runner and measure
// where the theme actually lands. janitorai.com is unreachable from the sandbox, so a runner
// does the reading; the numbers and screenshots are committed back.
import fs from 'node:fs/promises';
import puppeteer from 'puppeteer';

const OUT = process.env.OUT || 'probe';
const ROOT = process.env.GITHUB_WORKSPACE || process.cwd();
const PROFILE = process.env.PROFILE
  || 'https://janitorai.com/profiles/97048214-6734-4671-8ee4-eb018151280c_profile-of-shxou-huang';
const UA = 'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) '
  + 'Chrome/126.0.0.0 Mobile Safari/537.36';
const log = (...a) => console.log(...a);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const MEASURE = () => {
  const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect();
    return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
  const hdr = document.querySelector('header.pp-top-header');
  const bar = document.querySelector('.pp-top-bar');
  const notice = document.querySelector('[class*="domainNotice"]');
  const main = document.querySelector('main');
  const about = document.querySelector('.pp-uc-about-me');
  return {
    header: r(hdr), bar: r(bar), notice: r(notice), main: r(main), about: r(about),
    shell: r(document.querySelector('.uma-shell')),
    umaHdr: r(document.querySelector('.uma-hdr')),
    hero: r(document.querySelector('.uma-hero')),
    card: r(document.querySelector('.uma-about-ph')),
    docH: document.documentElement.scrollHeight,
    innerH: window.innerHeight,
  };
};

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const paste = await fs.readFile(`${ROOT}/JANITOR-PASTE.txt`, 'utf8');
  const css = paste.match(/<style>([\s\S]*?)<\/style>/)[1];
  const markup = paste.slice(paste.indexOf('</style>') + 8);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
  });
  const page = await browser.newPage();
  await page.setUserAgent(UA);
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: false, hasTouch: false });

  log('== profile', PROFILE);
  let ok = false;
  for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
    try {
      await page.goto(PROFILE, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForSelector('.pp-uc-about-me', { timeout: 30000 });
      ok = true;
    } catch (e) {
      log(`attempt ${attempt} failed: ${e.message.slice(0, 120)}; url now`, page.url());
      await fs.writeFile(`${OUT}/fail-${attempt}.html`, (await page.content()).slice(0, 200000));
      await wait(6000);
    }
  }
  await wait(7000);
  if (!ok) { log('could not load a profile'); await browser.close(); return; }

  const before = await page.evaluate(MEASURE);
  log('before', JSON.stringify(before));

  // apply the deliverable exactly as Janitor would: the style in the head, the markup inside
  // the About Me box
  await page.evaluate((cssText, html) => {
    const s = document.createElement('style'); s.id = 'uma-paste'; s.textContent = cssText;
    document.head.appendChild(s);
    document.querySelector('.pp-uc-about-me').innerHTML = html;
  }, css, markup);
  await wait(6000);

  const after = await page.evaluate(MEASURE);
  log('after ', JSON.stringify(after));

  // r55: the three cut-outs are the first art on this page that points at a brand new commit,
  // so ask the CDN for them here, where there is a real network, and say what came back
  const figs = await page.evaluate(() => {
    const row = document.querySelector('.uma-about-figs');
    const card = document.querySelector('.uma-about-ph');
    const b = row ? row.getBoundingClientRect() : null;
    const c = card ? card.getBoundingClientRect() : null;
    return {
      row: b ? [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)] : null,
      cardTop: c ? Math.round(c.y) : null,
      imgs: [...document.querySelectorAll('.uma-about-figs img')].map((i) => ({
        cls: (i.className || '').toString(), loaded: i.complete && i.naturalWidth > 0,
        nat: i.naturalWidth + 'x' + i.naturalHeight,
        drawn: Math.round(i.getBoundingClientRect().width) + 'x' + Math.round(i.getBoundingClientRect().height),
      })),
    };
  });
  log('figs  ', JSON.stringify(figs));
  await page.screenshot({ path: `${OUT}/applied-top.png` });
  await page.evaluate(() => window.scrollTo(0, 300));
  await wait(400);
  await page.screenshot({ path: `${OUT}/applied-300.png` });

  // the chain from Janitor's content box down to the key visual, with the computed padding
  const chain = await page.evaluate(() => {
    const out = [];
    let el = document.querySelector('.uma-shell');
    for (; el && el !== document.body; el = el.parentElement) {
      const b = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      out.push({ cls: (el.className || '').toString().slice(0, 60), top: Math.round(b.top),
        h: Math.round(b.height), pad: cs.paddingTop, mar: cs.marginTop, disp: cs.display });
    }
    return out.reverse();
  });
  log('chain (outermost first):');
  chain.forEach((c) => log('  ', c.cls, 'top', c.top, 'h', c.h, 'pad', c.pad, 'mar', c.mar, c.disp));

  // try the fix in place, measuring at scroll 0 after every addition
  const trials = [
    ['baseline', ''],
    ['notice hidden', '[class*="domainNotice"]{display:none !important}'],
    ['+ page container padding', '.profile-page-container{padding-top:0 !important;padding-bottom:0 !important}'],
    ['+ info stack gap', '.profile-info-stack{row-gap:0 !important;gap:0 !important}'],
    ['+ about margins', '.pp-uc-about-me{margin-top:0 !important;margin-bottom:0 !important;padding-top:0 !important}'],
    ['+ shell pull', '.uma-shell{margin-top:0 !important}'],
  ];
  let css2 = '';
  for (const [name, rule] of trials) {
    css2 += rule;
    const m = await page.evaluate((rules) => {
      let s = document.getElementById('probe-trials');
      if (!s) { s = document.createElement('style'); s.id = 'probe-trials'; document.head.appendChild(s); }
      s.textContent = rules;
      window.scrollTo(0, 0);
      const b = (sel) => { const e = document.querySelector(sel); if (!e) return null;
        const r = e.getBoundingClientRect(); return [Math.round(r.top), Math.round(r.height)]; };
      return { hero: b('.uma-hero'), hdr: b('.uma-hdr'), header: b('header.pp-top-header'),
        main: b('main'), card: b('.uma-about-ph'), docH: document.documentElement.scrollHeight };
    }, css2);
    await wait(500);
    log('trial', name, JSON.stringify(m));
  }
  await wait(500);
  await page.screenshot({ path: `${OUT}/fixed-top.png` });

  // and again with the outage banner taken out, since it is temporary
  await page.evaluate(() => { const n = document.querySelector('[class*="domainNotice"]'); if (n) n.remove(); });
  await wait(600);
  const noNotice = await page.evaluate(MEASURE);
  log('no notice', JSON.stringify(noNotice));

  // what sits between the header and the key visual: every box in that strip
  const strip = await page.evaluate(() => {
    const out = [];
    const hb = document.querySelector('header.pp-top-header').getBoundingClientRect().bottom;
    const hero = document.querySelector('.uma-hero');
    const heroTop = hero ? hero.getBoundingClientRect().top + window.scrollY : 0;
    document.querySelectorAll('body *').forEach((el) => {
      const b = el.getBoundingClientRect();
      const t = b.top + window.scrollY;
      if (b.height > 4 && t >= hb - 2 && t < heroTop && b.width > 100) {
        out.push({ tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 70),
          top: Math.round(t), h: Math.round(b.height), bg: getComputedStyle(el).backgroundColor,
          pos: getComputedStyle(el).position });
      }
    });
    return { headerBottom: Math.round(hb), heroTop: Math.round(heroTop), boxes: out.slice(0, 40) };
  });
  await fs.writeFile(`${OUT}/strip.json`, JSON.stringify(strip, null, 1));
  log('strip', JSON.stringify(strip.headerBottom), JSON.stringify(strip.heroTop));
  strip.boxes.forEach((b) => log('  ', b.tag, b.cls, b.top, b.h, b.bg, b.pos));

  await browser.close();
}
main().catch((e) => { console.log('FATAL', e.message, e.stack?.split('\n')[1]); process.exit(1); });
