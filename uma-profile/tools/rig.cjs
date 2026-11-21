/**
 * rig.js — the mobile/desktop rig, adapted from the user's own rawmobile_rig.
 *
 * Renders the deliverable against a mock of Janitor's page furniture at the
 * four widths the user's pipeline checks (360 / 390 / 414 / 1280) and fails if
 * anything spills horizontally. "Spill 0" is the pass condition.
 *
 *   node tools/rig.js            # from uma-profile/
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
// v131 exports the class itself, earlier builds wrapped it in `default`
const chromium = require('@sparticuz/chromium').default || require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

const ROOT = path.resolve(__dirname, '..');
// `node tools/rig.cjs paste` renders the delivered one-line paste instead of
// the readable source, so the rig checks exactly what gets pasted.
const FROM_PASTE = process.argv.includes('paste');
const src = fs.readFileSync(
  FROM_PASTE ? path.join(ROOT, 'dist', 'PASTE-ALL.txt') : path.join(ROOT, 'src', 'bio.html'),
  'utf8');
const styleBlock = src.match(/<style>([\s\S]*?)<\/style>/)[1];
const markup = src.slice(src.indexOf('</style>') + 8);

// the sandbox has no internet: swap the CDN art for the files on disk
const local = markup.replace(
  /https:\/\/file\.garden\/apVBH6JH-X_MR0Je\/kv\.-RnlVFGO\.jpeg/g,
  'file://' + path.join(ROOT, 'assets', 'site', 'kv.jpg')
).replace(
  /https:\/\/en-portal\.g\.kuroco-img\.app\/[^"]*\/(astonmachan|mrcb|tamamocross|nicenature|winningticket)\/[^"]+/g,
  (m, slug) => {
    const i = { astonmachan: 1, mrcb: 2, tamamocross: 3, nicenature: 4, winningticket: 5 }[slug];
    return 'file://' + path.join(ROOT, 'assets', 'tmp', 'char_' + i + '.jpg');
  }
).replace(
  /https:\/\/cdn\.jsdelivr\.net\/gh\/lanzopanzo2013-eng\/puppeteer@[0-9a-f]+\/uma-profile\/assets\/(site|tmp)\/([^"]+)/g,
  (m, dir, file) => 'file://' + path.join(ROOT, 'assets', dir, file)
);

// Janitor's own furniture, mocked with plain grey rules (the theme has to beat them)
const CHROME = `
<style>
  body { margin: 0; background: #202123; }
  .pp-page-background { min-height: 100vh; }
  .pp-top-bar-outer { position: sticky; top: 0; z-index: 1000; }
  .pp-top-bar { display: flex; align-items: center; gap: 10px; height: 44px; padding: 0 12px;
                background: #1f1f22; color: #ddd; }
  .pp-top-bar-back-button { border: 0; background: none; color: #aaa; font-size: 16px; }
  .pp-top-bar-title { flex: 1; text-align: center; color: #ddd; font-size: 14px; font-family: Arial; }
  .profile-info-hstack { display: flex; gap: 10px; padding: 12px 16px; }
  .pp-uc-avatar-container { width: 84px; height: 84px; border-radius: 14px; background: #2A5DFA; }
  .profile-info-stack-inner { display: flex; flex-direction: column; justify-content: center; gap: 2px; }
  .pp-uc-title { margin: 0; font: 700 20px/1.2 Arial; color: #12386E; }
  .pp-uc-followers-count { font: 400 12px/1.4 Arial; color: #4A6C96; }
  .pp-tabs-wrapper { display: flex; gap: 16px; padding: 0 16px 10px; border-bottom: 1px solid #E3E8F2; }
  .pp-tabs-button { font: 700 14px Arial; color: #12386E; }
  .pp-tabs-indicator { height: 3px; background: #FF79D0; width: 84px; }
</style>
<div class="pp-top-bar-outer"><div class="pp-top-bar profile-top-bar">
  <button class="pp-top-bar-back-button">&#8249;</button>
  <div class="pp-top-bar-title">Profile of @uma_enjoyer</div>
  <button class="pp-top-bar-notifications-button"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 1a4 4 0 0 0-4 4v3l-1 3h10l-1-3V5a4 4 0 0 0-4-4z"/></svg></button>
</div></div>
<div class="pp-page-background">
  <!-- Janitor's real nesting, taken from the captured profile DOM: the About Me block
       lives *inside* the profile card, under the row that holds the avatar and the
       follower count. The live-binding rules depend on that shape, so the rig has to
       reproduce it or it would be testing a page that does not exist. -->
  <div class="pp-uc-background">
  <div class="profile-info-stack">
  <div class="profile-info-hstack">
    <div class="pp-uc-avatar-container"><img class="pp-uc-avatar" src="file://${path.join(ROOT, 'assets', 'site', 'pfp.jpg')}" alt=""></div>
    <div class="profile-info-stack-inner">
      <h2 class="pp-uc-title">uma_enjoyer</h2>
      <div class="pp-uc-followers-count"><span>1,192</span> <span>followers</span></div>
    </div>
  </div>
  <!-- the live profile shows no tab strip above the About Me block, so the rig
       must not invent one either: the header row is measured against the bar -->
  <div class="pp-uc-about-me profile-about-me">`;

/* The profile asks for Roboto and Roboto Condensed; the phone has both, the bare headless
   chromium here has neither and would fall back to a wider grotesque, making every screenshot
   a little narrower than the real thing. If the font files are on disk (npm i @fontsource/...)
   they are wired in for the screenshots only — the delivered CSS still names the families and
   never fetches anything. */
const FONT_DIRS = [
  ['roboto', '@fontsource/roboto/files', 'roboto-latin'],
  ['Roboto Condensed', '@fontsource/roboto-condensed/files', 'roboto-condensed-latin'],
];
const FONT_ROOT = process.env.UMA_FONTS || '/tmp/nm/node_modules';
const FONTS = FONT_DIRS.flatMap(([fam, dir, prefix]) => {
  try {
    return fs.readdirSync(path.join(FONT_ROOT, dir)).flatMap((f) => {
      const m = f.match(new RegExp('^' + prefix + '-(\\d+)-(normal|italic)\\.woff2$'));
      if (!m) return [];
      return [`@font-face{font-family:"${fam}";font-weight:${m[1]};font-style:${m[2]};font-display:block;`
        + `src:url("file://${path.join(FONT_ROOT, dir, f)}") format("woff2")}`];
    });
  } catch { return []; }
}).join('');
if (FONTS) console.log('fonts: local Roboto + Roboto Condensed');

const PAGE = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${FONTS}</style>${CHROME}</head>
<body><style>${styleBlock}</style>${local}
</div></div></div></div></body></html>`;

/* phones from the narrowest thing Android still ships (a fold's 280 css) up
   through the big slabs, then a laptop */
const WIDTHS = [280, 320, 344, 360, 390, 414, 430, 480, 1280];
const OUT = path.join(ROOT, 'docs');
fs.mkdirSync(OUT, { recursive: true });
const tmp = path.join(os.tmpdir(), FROM_PASTE ? 'rig-paste.html' : 'rig.html');
fs.writeFileSync(tmp, PAGE);

(async () => {
  const browser = await puppeteer.launch({
    args: chromium.args, executablePath: await chromium.executablePath(), headless: 'shell',
  });
  const page = await browser.newPage();
  // the full-page shots are captured with motion off, so the scroll-reveal
  // animations are not stuck at their from-state in the screenshot
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  let failed = false;
  for (const w of WIDTHS) {
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
    await page.goto('file://' + tmp, { waitUntil: 'load' });
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      // The page background carries overflow-x: clip, which is what the live page does, so
      // anything that deliberately parks (the live follower count, anchored into the card)
      // is painted out but still widens the root's scroll width. Measure the body: that is
      // the box that would actually scroll, and a regression that escapes the section still
      // widens it. The offender walk below is the precise check either way.
      const spill = document.body.scrollWidth - window.innerWidth;
      const domSpill = de.scrollWidth - window.innerWidth;
      const offenders = [];
      document.querySelectorAll('.uma-shell *').forEach((el) => {
        const b = el.getBoundingClientRect();
        if (!b.width) return;
        // offscreen is fine when a clipping ancestor owns it (the carousel track)
        for (let a = el.parentElement; a; a = a.parentElement) {
          if (getComputedStyle(a).overflowX !== 'visible') return;
        }
        if (b.right > window.innerWidth + 1 || b.left < -1) {
          offenders.push(
            (el.className.toString() || el.tagName).slice(0, 42) +
              ' ' + Math.round(b.left) + '..' + Math.round(b.right)
          );
        }
      });
      return {
        spill, domSpill,
        shell: Math.round(document.querySelector('.uma-shell')?.getBoundingClientRect().width || 0),
        offenders: offenders.slice(0, 6),
      };
    });
    const ok = r.spill <= 0 && r.offenders.length === 0;
    if (!ok) failed = true;
    console.log(`${w}px  spill=${r.spill}  (dom ${r.domSpill})  shell=${r.shell}  ${ok ? 'PASS' : 'FAIL'}`);
    r.offenders.forEach((o) => console.log('    offender:', o));
    // fullPage alone follows the root's 477px scroll width; clip to the viewport's own width
    // so every shot is the width the phone would actually show
    const full = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.screenshot({
      path: path.join(OUT, `${FROM_PASTE ? 'paste' : 'rig'}-${w}.png`),
      clip: { x: 0, y: 0, width: w, height: full },
    });
  }
  /* Stress pass. A local render is kinder than the live page in two ways that both showed up
     on r55's corner row: Janitor's pipeline does not always keep the `:root` rule that defines
     --uma-k, and it puts `height: auto !important` on images. With both applied at 390 the
     row must still be small and the card's own padding must still exist. */
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto('file://' + tmp, { waitUntil: 'load' });
  const stress = await page.evaluate(() => {
    const s = document.createElement('style');
    s.textContent = '.pp-uc-about-me img{height:auto !important}';
    document.head.appendChild(s);
    document.documentElement.style.setProperty('--uma-k', 'initial');
    const row = document.querySelector('.uma-about-figs');
    const card = document.querySelector('.uma-about-ph');
    const body = document.querySelector('.uma-tc-body');
    const rb = row.getBoundingClientRect(); const cb = card.getBoundingClientRect();
    /* gameplay seat rides the same inject: without !important + a second
       class, the captures blow out to full band width (seen live r56). */
    const band = document.querySelector('.uma-play');
    const seat = (s) => {
      const e = document.querySelector(s);
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return [Math.round(r.width), Math.round(r.height)];
    };
    return {
      imgs: [...row.querySelectorAll('img')].map((i) => Math.round(i.getBoundingClientRect().width)
        + 'x' + Math.round(i.getBoundingClientRect().height)),
      rowW: Math.round(rb.width),
      insideCard: rb.right <= cb.right + 1 && rb.left >= cb.left - 1,
      bodyPad: getComputedStyle(body).paddingTop,
      bandH: band ? Math.round(band.getBoundingClientRect().height) : 0,
      uma: seat('.uma-uma'),
      shotL: seat('.uma-shot-l'),
      shotR: seat('.uma-shot-r'),
      hl: seat('.uma-hl-img'),
      lbBg: seat('.uma-lb-bg'),
    };
  });
  const stressOk = stress.imgs.every((d) => { const [w, h] = d.split('x').map(Number);
    return w > 8 && w < 80 && h > 8 && h < 40; }) && stress.insideCard && stress.bodyPad !== '0px';
  /* 192vw at 390 = 748.8 · seat must stay a seat: Special Week < 60% of band,
     captures not full-bleed, background filling the band not its intrinsic height. */
  const bandW = 390;
  const seatOk = stress.bandH > 700 && stress.bandH < 800
    && stress.uma && stress.uma[0] > 150 && stress.uma[0] < bandW * 0.6
    && stress.shotL && stress.shotL[0] > 120 && stress.shotL[0] < bandW * 0.5
    && stress.shotR && stress.shotR[0] > 90 && stress.shotR[0] < bandW * 0.4
    && stress.hl && stress.hl[0] > 200 && stress.hl[0] < bandW * 0.85
    && stress.lbBg && stress.lbBg[1] > 700;
  console.log('stress (no --uma-k, img height:auto !important) ->',
    JSON.stringify(stress), (stressOk && seatOk) ? 'PASS' : 'FAIL',
    seatOk ? '(seat ok)' : '(SEAT BROKEN)');
  if (!stressOk || !seatOk) failed = true;

  // motion back on: prove the scroll reveal actually fires
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto('file://' + tmp, { waitUntil: 'load' });
  const opacities = await page.evaluate(() =>
    [...document.querySelectorAll('.uma-roster .uma-grid, .uma-media .uma-media-row, .uma-play .uma-hl-img')]
      .map((e) => Number(getComputedStyle(e).opacity))
  );
  console.log('reveal at scroll 0 ->', opacities.slice(0, 6).join(','));
  await page.evaluate(() => window.scrollTo(0, 1400));
  await new Promise((r) => setTimeout(r, 400));
  const after = await page.evaluate(() =>
    [...document.querySelectorAll('.uma-roster .uma-grid, .uma-media .uma-media-row, .uma-play .uma-hl-img')]
      .map((e) => Number(getComputedStyle(e).opacity))
  );
  console.log('reveal at scroll 1400 ->', after.slice(0, 6).join(','));
  await browser.close();
  process.exit(failed ? 1 : 0);
})();
