// Capture umamusume.com from a GitHub runner: a real Chrome first (the block is
// fingerprint-sensitive), then public CORS proxies if the IP is refused outright.
import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const OUT = 'capture';
const SITE = 'https://umamusume.com/';
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome';

const PROXIES = [
  u => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
  u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  u => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  u => `https://r.jina.ai/${u}`,
];

async function ensure(dir) { await fs.mkdir(dir, { recursive: true }); }

async function tryProxies(url) {
  for (const make of PROXIES) {
    const proxied = make(url);
    try {
      const res = await fetch(proxied, { headers: { 'user-agent': 'Mozilla/5.0' }, redirect: 'follow' });
      const text = await res.text();
      if (res.ok && text && text.length > 500 && !/403 Error|Access Denied/i.test(text.slice(0, 400))) {
        console.log(`  proxy ok (${res.status}, ${text.length}b): ${proxied.slice(0, 70)}…`);
        return text;
      }
      console.log(`  proxy no: ${res.status} ${text.length}b ${proxied.slice(0, 60)}…`);
    } catch (e) { console.log(`  proxy err ${proxied.slice(0, 60)}: ${e.message}`); }
  }
  return null;
}

async function viaChrome() {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(SITE, { waitUntil: 'networkidle2', timeout: 90000 });
    const title = await page.title();
    const html = await page.content();
    console.log(`  chrome: title="${title}" html=${html.length}b`);
    if (/403|Access Denied|Forbidden/i.test(title) && html.length < 20000) return null;

    await ensure(`${OUT}/css`);
    // stylesheet text, fetched same-origin so CORS cannot bite
    const sheets = await page.evaluate(async () => {
      const out = [];
      for (const l of Array.from(document.querySelectorAll('link[rel="stylesheet"]'))) {
        const href = l.href;
        try { const t = await (await fetch(href)).text(); out.push({ href, text: t }); }
        catch (e) { out.push({ href, text: '' }); }
      }
      // inline <style> blocks too
      const inl = Array.from(document.querySelectorAll('style')).map(s => s.textContent);
      return { sheets: out, inline: inl };
    });
    let i = 0;
    for (const s of sheets.sheets) {
      const name = (s.href.split('/').pop() || `sheet${i}`).replace(/[^\w.-]/g, '_');
      await fs.writeFile(path.join(OUT, 'css', name), s.text || '');
      console.log(`    css ${name} ${s.text.length}b`);
      i++;
    }
    for (let j = 0; j < sheets.inline.length; j++) {
      await fs.writeFile(path.join(OUT, 'css', `inline-${j}.css`), sheets.inline[j] || '');
    }
    await fs.writeFile(path.join(OUT, 'index.html'), html);
    return html;
  } finally { await browser.close(); }
}

(async () => {
  await ensure(OUT);
  console.log('attempt 1: headless chrome');
  let html = null;
  try { html = await viaChrome(); } catch (e) { console.log('  chrome failed:', e.message); }

  if (!html) {
    console.log('attempt 2: public CORS proxies');
    html = await tryProxies(SITE);
    if (html) {
      await fs.writeFile(path.join(OUT, 'index.html'), html);
      const urls = [...html.matchAll(/\/_app\/immutable\/assets\/[^"' )]+\.css/g)].map(m => m[0]);
      const uniq = [...new Set(urls)].map(u => 'https://umamusume.com' + u);
      console.log(`  stylesheet urls: ${uniq.length}`);
      await ensure(`${OUT}/css`);
      for (const u of uniq) {
        const css = await tryProxies(u);
        const name = u.split('/').pop();
        if (css) { await fs.writeFile(path.join(OUT, 'css', name), css); console.log(`    css ${name} ${css.length}b`); }
      }
    }
  }

  if (!html) { console.log('CAPTURE FAILED'); process.exit(0); }
  const imgs = [...new Set([...html.matchAll(/https:\/\/[^"' )]+\.(?:png|jpe?g|webp|svg)/g)].map(m => m[0]))];
  await fs.writeFile(path.join(OUT, 'img-urls.txt'), imgs.join('\n') + '\n');
  console.log(`images referenced: ${imgs.length}`);
  console.log('DONE');
})();
