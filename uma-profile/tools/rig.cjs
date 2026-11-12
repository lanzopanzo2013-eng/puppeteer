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
const chromium = require('@sparticuz/chromium').default;
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
</div></div>
<div class="pp-page-background">
  <div class="profile-info-hstack">
    <div class="pp-uc-avatar-container"></div>
    <div class="profile-info-stack-inner">
      <h2 class="pp-uc-title">uma_enjoyer</h2>
      <div class="pp-uc-followers-count"><span>1,192</span> <span>followers</span></div>
    </div>
  </div>
  <div class="pp-tabs-wrapper"><div class="pp-tabs-button">Characters</div><div class="pp-tabs-button">Scripts</div></div>
  <div class="pp-tabs-indicator"></div>
  <div class="pp-uc-about-me profile-about-me">`;

const PAGE = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">${CHROME}</head>
<body><div class="pp-uc-about-me profile-about-me"><style>${styleBlock}</style>${local}</div>
</div></div></body></html>`;

const WIDTHS = [360, 390, 414, 1280];
const OUT = path.join(ROOT, 'docs');
fs.mkdirSync(OUT, { recursive: true });
const tmp = path.join(os.tmpdir(), FROM_PASTE ? 'rig-paste.html' : 'rig.html');
fs.writeFileSync(tmp, PAGE);

(async () => {
  const browser = await puppeteer.launch({
    args: chromium.args, executablePath: await chromium.executablePath(), headless: 'shell',
  });
  const page = await browser.newPage();
  let failed = false;
  for (const w of WIDTHS) {
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
    await page.goto('file://' + tmp, { waitUntil: 'load' });
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      const spill = de.scrollWidth - window.innerWidth;
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
        spill,
        shell: Math.round(document.querySelector('.uma-shell')?.getBoundingClientRect().width || 0),
        offenders: offenders.slice(0, 6),
      };
    });
    const ok = r.spill <= 0 && r.offenders.length === 0;
    if (!ok) failed = true;
    console.log(`${w}px  spill=${r.spill}  shell=${r.shell}  ${ok ? 'PASS' : 'FAIL'}`);
    r.offenders.forEach((o) => console.log('    offender:', o));
    await page.screenshot({ path: path.join(OUT, `${FROM_PASTE ? 'paste' : 'rig'}-${w}.png`), fullPage: true });
  }
  await browser.close();
  process.exit(failed ? 1 : 0);
})();
