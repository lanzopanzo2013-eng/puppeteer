// The origin 403s every datacenter IP (verified: 4 proxies + GitHub runners).
// The Internet Archive holds the site, and a runner can reach the Archive, so we
// pull the real bytes from there: HTML, every stylesheet, and the artwork.
import fs from 'node:fs/promises';
import path from 'node:path';

const OUT = 'capture';
const SNAPSHOT = '2026';           // newest capture year
const CDX = 'https://web.archive.org/cdx/search/cdx';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function get(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 capture' }, redirect: 'follow' });
      if (res.ok) return Buffer.from(await res.arrayBuffer());
      if (res.status === 404) return null;
      console.log(`    ${res.status} retry ${i + 1}: ${url.slice(0, 90)}`);
    } catch (e) { console.log(`    err ${e.message}: ${url.slice(0, 70)}`); }
    await sleep(1500 * (i + 1));
  }
  return null;
}

async function cdx(match, filter) {
  const q = `${CDX}?url=${encodeURIComponent('umamusume.com' + match)}&matchType=prefix`
    + `&output=json&collapse=urlkey&filter=${filter}&limit=400`;
  const buf = await get(q);
  if (!buf) return [];
  try {
    const rows = JSON.parse(buf.toString());
    return rows.slice(1).map(r => ({ ts: r[1], url: r[2], mime: r[3], size: r[4] }));
  } catch { return []; }
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });

  // 1. the page itself
  console.log('page');
  const html = await get(`https://web.archive.org/web/${SNAPSHOT}id_/https://umamusume.com/`);
  if (html) { await fs.writeFile(`${OUT}/index.html`, html); console.log(`  html ${html.length}b`); }

  // 2. stylesheets
  console.log('css');
  const cssRows = await cdx('/_app/immutable/assets/', 'mimetype:text/css');
  console.log(`  index lists ${cssRows.length}`);
  await fs.mkdir(`${OUT}/css`, { recursive: true });
  let n = 0;
  for (const r of cssRows) {
    const dest = `${OUT}/css/${r.url.split('/').pop().replace(/[^\w.-]/g, '_')}`;
    const buf = await get(`https://web.archive.org/web/${r.ts}id_/${r.url}`);
    if (buf && buf.length > 100) { await fs.writeFile(dest, buf); n++; console.log(`  ${r.url.split('/').pop()} ${buf.length}b`); }
    await sleep(400);
  }
  console.log(`  saved ${n} stylesheets`);

  // 3. artwork
  console.log('img');
  const imgRows = await cdx('/_app/immutable/assets/', 'mimetype:image/.*');
  await fs.mkdir(`${OUT}/img`, { recursive: true });
  let m = 0;
  for (const r of imgRows.slice(0, 120)) {
    const base = r.url.split('/').pop().replace(/[^\w.-]/g, '_');
    const dest = `${OUT}/img/${base}`;
    const buf = await get(`https://web.archive.org/web/${r.ts}id_/${r.url}`);
    if (buf && buf.length > 200) { await fs.writeFile(dest, buf); m++; }
    await sleep(300);
  }
  console.log(`  saved ${m} images`);

  // 4. every asset the stylesheets point at (decoration svgs, icons, fonts)
  console.log('css-referenced assets');
  await fs.mkdir(`${OUT}/assets`, { recursive: true });
  const cssFiles = await fs.readdir(`${OUT}/css`).catch(() => []);
  const refs = new Set();
  for (const f of cssFiles) {
    const t = await fs.readFile(`${OUT}/css/${f}`, 'utf8').catch(() => '');
    for (const m of t.matchAll(/url\((?:["']?)(\.?\/?[A-Za-z0-9_.\-]+\.(?:svg|png|jpe?g|webp))(?:["']?)\)/g)) {
      refs.add(m[1].replace(/^\.\//, '').replace(/^\//, ''));
    }
  }
  console.log(`  ${refs.size} unique asset refs`);
  let a = 0;
  for (const r of refs) {
    const dest = `${OUT}/assets/${r}`;
    const buf = await get(`https://web.archive.org/web/${SNAPSHOT}id_/https://umamusume.com/_app/immutable/assets/${r}`);
    if (buf && buf.length > 50) { await fs.writeFile(dest, buf); a++; console.log(`  ${r} ${buf.length}b`); }
    await sleep(300);
  }
  console.log(`  saved ${a} assets`);

  // 5. brand marks and badges from the parts CDN (SVG sources, for PNG conversion)
  console.log('parts cdn');
  await fs.mkdir(`${OUT}/parts`, { recursive: true });
  const PARTS = [
    'sns-x.svg', 'sns-facebook.svg', 'sns-youtube.svg', 'sns-discord.svg',
    'logo_umamusume.png', 'app_icon.png',
    'badge-steam.png', 'badge-appstore.png', 'badge-googleplay.png', 'badge-googleplaygames.png',
  ];
  let pn = 0;
  for (const f of PARTS) {
    const buf = await get(`https://parts.umamusume.com/assets/images/${f}`);
    if (buf && buf.length > 50) { await fs.writeFile(`${OUT}/parts/${f}`, buf); pn++; console.log(`  ${f} ${buf.length}b`); }
    else console.log(`  ${f} — not fetched`);
    await sleep(400);
  }
  console.log(`  saved ${pn} parts`);

  const listing = await fs.readdir(`${OUT}/img`).catch(() => []);
  await fs.writeFile(`${OUT}/files.txt`, listing.join('\n') + '\n');
  console.log('DONE');
}

main().catch(async e => {
  await fs.mkdir(OUT, { recursive: true });
  await fs.writeFile(`${OUT}/ERROR.txt`, String(e && e.stack || e));
  process.exit(0);
});
