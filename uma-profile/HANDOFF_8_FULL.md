# HANDOFF_8_FULL.md — everything about the Janitor AI profile theme

**Repo:** `lanzopanzo2013-eng/puppeteer` · **branch:** `arena/aa88f095-puppeteer` · **HEAD:** `3b88ab7`
**Deliverable:** one one-line paste at `JANITOR-PASTE.txt`, 73,711 chars (css 42,565 / markup 31,130).
**Rule for the whole project:** measure before changing anything. When the sandbox can't see the page, run the probe (below) instead of guessing. Every round: change → rebuild → rig → proof image → commit → push.

## 1. What the theme is

A recreation of the Umamusume Pretty Derby site as a Janitor AI profile: key visual, About Me card, three "page break" horseshoe dividers, Lorebooks carousel, gameplay block, favourite characters, fandoms, media, and a live follower count rescued out of Janitor's own header row. Built **CSS + HTML only** — the profile field takes no JavaScript.

## 2. The delivery mechanics (this is the part that bites)

1. **The About Me box is Markdown.** A blank line ends an HTML block; four leading spaces become a code block. So the paste must be **one line, zero indentation, no blank lines**. `build_paste.py` asserts this.
2. **No JavaScript.** Every interaction is CSS: `:target` page states, `:has()` whitelisting, `anchor()` positioning, scroll containers.
3. **`url()` is dropped from profile CSS.** All art must be `<img src>`. Base64 works but inflates the paste — three small stickers cost 467 chars as CDN links vs 238 KB as base64.
4. **Art is pinned to a commit sha:**
   `https://cdn.jsdelivr.net/gh/lanzopanzo2013-eng/puppeteer@<sha>/uma-profile/assets/site/<file>`
   jsdelivr lags unpushed commits, and cold-fetches a brand-new sha on first request — if a fresh paste is missing one image, reload before touching anything.
5. **Two editors, two panels.** Janitor's profile editor gives a CSS panel and an HTML panel: `dist/PASTE-CSS.txt` and `dist/PASTE-HTML.txt`. `JANITOR-PASTE.txt` is the combined single line for the one-box path.
6. **The field is big but not infinite** — the current paste is ~74 k chars and goes in fine.

## 3. What the live page does to the CSS (learnt the hard way)

- **`:root { … }` rules are not reliably kept.** Any custom property may be missing, which makes every `calc(… * var(--x))` an invalid declaration and the property falls back. **Always write `var(--x, 1)`**, and for anything whose failure is visible (image sizes) write the value out per breakpoint instead of deriving it.
- **Images get `height: auto !important` somewhere in their pipeline.** A plain `height` loses. For any image whose size matters: `!important`, one specificity step above a reset (`.uma-about-ph .uma-about-figs img`, not `.uma-about-figs img`), and `width`/`height` attributes at drawn size as the last resort.
- **Absolutely positioned descendants escape `overflow-x: clip`** on `pp-page-background`, so a runaway element widens `documentElement.scrollWidth` and drags the centred card off screen. Measure `body.scrollWidth` for real overflow and treat a widening page as a symptom, not a cause.
- **Janitor renames classes freely.** Rules are written as *keep what you need* (`:not(:has(...))` whitelist) rather than *hide what you don't*; a renamed row then can't survive as an empty band.

**Measured Janitor geometry (390 css, logged-out, mobile UA):** `pp-top-bar` 0–40 sticky · `aside[class*="domainNotice"]` 40–98 (the 58px outage banner) · `.profile-page-container` 16px padding · `.profile-info-stack` 8px row-gap · `.pp-uc-about-me` is the About box · `pp-page-background` fixed, `overflow-x: clip`. r54 hides the first and zeroes the other two; after that the key visual starts at exactly 40 and the card lands `[10, 1408, 364, 196]` with the document at 7702.

## 4. Design system

- **Everything in vw against the mobile design**, with `--uma-k` = 1 on phones and `.5955` at ≥900 so the card (93.3333vw → 55.5556vw) draws the same design at any width. At ≥2000 the card is a flat 1111.1111 × 625 px and the internals switch to px.
- `.uma-about` is 122.6667vw / 62.5vw / 1250px tall; the card is 93.3333 × 50.1333vw, absolutely centred, `display:flex; overflow:hidden`.
- Section padding `26px 12px 30px`; plates are skewed −15°, italic Roboto Condensed 700/900.
- Palette: navy `#13294B`, pink `#E5348A`, sky `#4BA8F5`, muted `#3E5A76` / `#4A6C96`, paper `#fff`.
- **No `url()`, no masks, no filters-as-masks** — colour lives in the PNG.

## 5. Tooling

**`uma-profile/src/bio.html`** — the single source. Style block first, then the markup.

**`tools/build_paste.py`** → `dist/PASTE-{CSS,HTML,ALL,ALL.pretty}.txt` and the root `JANITOR-PASTE.txt`.

**`tools/build_standalone.py`** → `preview/standalone.html`.

**`tools/rig.cjs`** — renders the source (or `node tools/rig.cjs paste` for the delivered line) against a mock of Janitor's furniture at **280 / 320 / 344 / 360 / 390 / 414 / 430 / 480 / 1280**, and fails on horizontal spill or any element outside a clipping ancestor. It also: runs a **stress pass** (deletes `--uma-k`, applies `img{height:auto !important}`, and requires the corner row to stay 34×22 / 51×22 / 32×22 inside the card with the body's padding intact), and checks the scroll-reveal actually fires. Run it as:

```
NODE_PATH=/tmp/nm2/node_modules UMA_FONTS=/tmp/nm2/node_modules \
LD_LIBRARY_PATH=/tmp/lib/lib node tools/rig.cjs paste
```

**`tools/probe.mjs` + `.github/workflows/probe-janitor.yml`** — the eyes. janitorai.com is unreachable from the sandbox, so a GitHub runner loads a real public profile, injects the paste exactly as Janitor would (style in head, markup inside `.pp-uc-about-me`), and logs geometry, the ancestor chain, try-the-fix trials, and per-image load status to `probe/log.txt`. Trigger:

```
date -u > .capture/probe && git add .capture/probe && git commit -m probe && \
GIT_TERMINAL_PROMPT=0 git -c http.postBuffer=52428800 push origin arena/aa88f095-puppeteer
gh run list --workflow=probe-janitor.yml
git fetch origin arena/aa88f095-puppeteer && git merge --ff-only FETCH_HEAD
```
Only `probe/log.txt` is committed back; PNGs/HTML/JSON are gitignored. **Known blind spot:** the probe injects the paste directly, so it does *not* reproduce what Janitor's editor pipeline does to it — that is why the r55 size failure only showed on the user's phone.

**Asset builders** (sources live outside the repo; pass `UPLOADS=/path`):
- `tools/make-figs.py` → `fig-jet/car/horse.png`. Keys the jet off its opaque black plate: black only goes transparent where it is **connected to the frame border**, the cut line is feathered by luminance, and 3px inside the line is forced opaque so dark panels don't read as ghosts. Then trims to ink and scales.
- `tools/make-about-pink.py` → `about-pink-full.png`, cut and tiled from the official tall About painting in `capture/img/about_bg.CwbgSExa.jpg`.

**Rebuilding the sandbox toolchain (it resets every session):**
```
pip3 install --break-system-packages pillow numpy scipy
mkdir -p /tmp/nm2 && cd /tmp/nm2 && npm init -y && \
  npm i @sparticuz/chromium@131 puppeteer-core@23 @fontsource/roboto @fontsource/roboto-condensed
node -e "const fs=require('fs'),z=require('zlib'),t=require('tar-fs');
 z.createReadStream('node_modules/@sparticuz/chromium/bin/al2023.tar.br')
  .pipe(z.createBrotliDecompress()).pipe(t.extract('/tmp/lib'))"
```
`rig.cjs` needs `require('@sparticuz/chromium').default || require('@sparticuz/chromium')` (v131 dropped the `.default` wrapper) and `LD_LIBRARY_PATH=/tmp/lib/lib` or it dies on `libnss3.so`. Attachments land in `/tmp/arena-coding-uploads/` and vanish with the session — copy anything you need into `assets/` in the same turn.

## 6. The copy rules (his voice — do not paraphrase)

- Never "gooner"/no explicit content. The shipped line is his own: *"I am weak when it comes to smut … if you are a smut-focused person, I am not for you to like."*
- **No em dashes, no colons, no semicolons** in the bio copy.
- Privacy: don't name the religion, no identifying detail, father's death stays vague (*"he passed away, just recently"* + a family-privacy sentence).
- **His original draft is the base.** Only grammar and sentence joins may change — he rejected a paraphrase outright ("it honestly sounds different to me").
- "Cleaner format" means the *design*, not shorter copy.
- Bold where logical: ten `<strong>`s (his two names, `Initial D`, half Filipino half Japanese, `70%`, *the wins pay for my entrance fees*, War Thunder and Call of Duty, lorebooks/RPG/Japan life scenarios, Arima Kinen 2022, Equinox, Umamusume Pretty Derby).

## 7. Round history

- **r52** card geometry and the scroll box · **r53** header band (fixed 57px, own the blue, keep-don't-hide whitelist), his Picsart horseshoe as the page break, ten bolds.
- **r54** the 82px strip: 58px outage banner + 16px page padding + 8px stack gap, all Janitor's, all removed → hero at 40.
- **r55** three small cut-outs in the About card's empty upper-right corner (34×22 / 51×22 / 32×22 at 390, `--uma-k`-scaled), built by `make-figs.py`. Two failed passes first: they were put in the band instead of the card, then drew at natural size on his phone (the `:root`/`height:auto !important` bugs above). All 29 `--uma-k` reads now carry `1` fallbacks; the row is plain vw at three breakpoints.

## 8. Queued: the Lorebooks / Gameplay section (page 1 only)

Section `.uma-play` (`id="scripts"`) — green band, "The Lorebooks" plate, "Train your Umamusume!" headline, a `:target`-driven carousel of three `.uma-slide`s with round `.uma-arrow` buttons.

Wanted, in his words:
1. Our band is **shorter than the reference** (`Screenshot_20261121-094329.jpg` = official; `Screenshot_20261121-140125.jpg` = ours). Background is right, it must be **lengthened**, matching the reference's proportions.
2. **Page 1 only** for now. Place `Picsart_26-11-21_13-57-43-080.jpg` as the large left capture and `Picsart_26-11-21_13-58-17-167.jpg` as the **smaller right** one, seated as the reference has them.
3. `muse-image_b_Change_the_text_to__ (1).png` replaces the "Train your Umamusume!" line, in the same seat.
4. `gameplay_specialweek.Bs46ZC7q.png` (Special Week cut-out) goes **behind the "Test The Lorebooks!" plate**.
5. **Arrows: no circular button** behind the glyph.
6. **Scrolling:** hand-swiping must work and the movement must animate — a real scroll container (`overflow-x:auto`, `scroll-snap-type:x mandatory`, `scroll-behavior:smooth`, snap points on the phone frame) with the arrows as anchor links into it, replacing the instant `:target` page swap. Verify the snap lands exactly on the frame at 360/390/414/430 and that the arrows move one slide per press without JavaScript.
7. Also attached and unplaced: `Picsart_26-11-21_09-49-36-478.png` (white tilted card with horseshoe watermarks and a green edge).

## 9. Do not repeat

- Don't theorise about heights — measure with the probe.
- Don't measure screenshots with PIL for geometry; the probe gives real CSS px.
- Don't rely on a bare `var(--x)` or a plain `height` on an image.
- Don't commit `docs/paste-*.png` every round — nine full-page screenshots are ~20 MB and that is what filled this workspace's snapshot. Gitignore them or keep one small proof sheet.
- Runner traps: detached-HEAD push needs `HEAD:<branch>`; `npm i puppeteer` inside the repo fails (`object is not extensible`) — install in `/tmp/pw`; `gh run view --log-failed` EOFs, use `gh api …/jobs`; artifacts aren't downloadable, read the bot's commit.
- Never switch branches; push only `arena/aa88f095-puppeteer`.

---

## §10 — Round 1 done (page-1 band, committed this session)

Delivered in `src/bio.html` gameplay block + `assets/site/lb1-*`:

- Band is the official **192vw / 62.5vw / 1250px** (height hooks at 900/2000, full-bleed padding zeroed at 820).
- **Page-1 seat** matches `ref-official.jpg`: Special Week (`lb1-uma.png`) top-right behind the headline; `lb1-headline.png` replaces "Train your Umamusume!"; `lb1-left.jpg` larger left capture, `lb1-right.jpg` smaller right; white plate `lb1-plate.png` + caption at the bottom. Geometry verified at 390px (uma 178.8..390 × 0..253.5, hl y156, shotL 41.7..207.3, shotR 225.8..355.5, card y569, pager bottom 4vw).
- **Real scroll strip**: `.uma-viewport` = `overflow-x:auto` + `scroll-behavior:smooth` + `scroll-snap-type:x mandatory` + snap-align start on each slide. Slides use `overflow:clip` (not hidden — hidden made each page a nested scroll container that swallowed the pan). Images inside slides get `user-drag:none` so mousedown pans instead of native image-drag.
- **Arrows live inside each slide** (no `:has()` state machine): each page carries its own prev/next chevrons + pager with the correct active horseshoe. Arrow rule is `background:none; border-radius:0` — no circle.
- Verified at 390: touch swipe → frame1 → frame2 (lands dead on 390/780); wheel pans + snaps; arrow cycle g1→g2→g3→g1 all land on frames; rig `paste` spill=0 at 280..1280 + stress PASS.
- Paste **74,947** chars (under 75k). CDN sha for page-1 art: `64770b6e760a5b3b82cc43115ca9784ac9f3dfbb`.
- Rig needs (this sandbox): `NODE_PATH=/tmp/nm2/node_modules UMA_FONTS=/tmp/nm2/node_modules LD_LIBRARY_PATH=/tmp/al2/lib:/tmp/al2023/lib node tools/rig.cjs paste` (from `uma-profile/`).

**Still open:** pages 2–3 are simple centered cards (intentional — page 1 first). Desktop (900+) uses the same % seat scaled into 62.5vw; official desktop is a different two-column layout if we ever want parity. `scroll-snap-*` is on the PLAN banned list but is required by §8.6 and survived the rig — if Janitor strips it, free `overflow-x` pan still works, arrows still glide via `scroll-behavior:smooth`.
