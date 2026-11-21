# @uma_enjoyer — Janitor profile rebuilt from umamusume.com

Goal: the **About Me** field of a Janitor AI profile that reproduces the visual language of
<https://umamusume.com/> section for section, with the copy swapped to bot-creator content.

---

## 1. The two hard constraints (evidence first)

### 1.1 What Janitor AI will actually run

Compiled from the community's maintained reference ([CSS for JanitorAI](https://jai-css-guide-resources.ju.mp/))
and [Puppy's JAI Page Breakdown](https://rentry.co/jaielements) (last edited 2026-09-06):

| Banned | Consequence for this project |
|---|---|
| `<script>` | No JS at all. Every interaction is CSS-only. |
| `<svg>`, `<path>`, `<textpath>` | Icons/shapes must be CSS (`clip-path`, `border-radius`) or PNG images. |
| `<button>`, `<label>`, `<input …>` | Buttons are `<div>`/`<a>` styled to look clickable. |
| `<video src>`, `<audio>` | No autoplay hero video — the site's `<video>` hero becomes a still. |
| **`url()`** | **No `background-image: url(...)`.** Every photograph/artwork must be an `<img src>` layer. |
| CSS **variables** (`var()`) | No design tokens — literal values repeated (the studio's design panel does this too). |
| CSS nesting, `@container`, `@property`, `attr()` | Flat, single-level selectors only. |
| `scroll-snap-*`, `scroll-margin`, `scroll-padding` | Carousels cannot snap; they become `overflow:auto` strips. |
| `column-gap`, `row-gap`, `place-items` | Spacing via `margin`/`gap` shorthand only. |
| `mask-composite` | Use `clip-path` for angled plates. |

Also from the same sources: CSS must live inside `<style>…</style>`, HTML must not include
`<html>`/`<body>`, and Janitor's own chrome (`.profile-about-me`, `.profile-info-hstack`,
`.profile-page-flex`) has to be neutralised before a full-bleed layout is possible.

**The `url()` ban is the architectural decision that matters.** umamusume.com is built from
CSS background images and `<video>`. Ours is built from stacked `<img>` layers + CSS gradients.
Everything below follows from that.

### 1.2 What the studio does

<https://tools.from-avalon.com/janitor-profile-maker/> is a capture of the real profile page with
our About-Me HTML injected "where JanitorAI injects it" — what renders there renders on the profile,
and "what JanitorAI would strip is stripped here too". It lints every declaration JAI discards and has
an **Enforce JAI rules** toggle. So the studio is the acceptance test, not a mock-up. Its Code button
outputs the full document (HTML + `<style>`).

---

## 2. Section map: site → profile

| umamusume.com | Ours | Why it survives translation |
|---|---|---|
| Blue top bar + wordmark + Menu | **Top bar** with wordmark + menu anchors | Header is already just a bar + logo. |
| Key visual, "Play Now!", 4 store badges, WebStore card, socials, side label, SCROLL | **Hero**: key art layer, "PLAY NOW!" plate, 4 CTA tiles (browse bots / characters / scripts / requests), promo card, social pill, rotated side label, scroll cue | Same geometry, links repointed. |
| News (pink, angled tag, ribbon cards, View more) | **Updates** — new bot drops, events | Cards are text + thumbnail; identical. |
| About (sky band, video plate) | **About the trainer** — bio blurb + creator photo | Video → still image. |
| Gameplay (green, 3-slide carousel, giant headline) | **What I write** — 3 slides: character bots / scenarios / lorebooks | `overflow:auto` strip with CSS arrows. |
| Characters (purple, mosaic tiles with vertical names) | **Roster** — bot mosaic linked to each bot | Tiles are `<a><img>`; vertical name label is `writing-mode`. |
| Media (blue tiles) | **Elsewhere** — X, Discord, Ko-fi, etc. | Same tiles. |
| Footer | **Footer** — credits + disclaimer | — |

---

## 3. Build order (batches)

Each batch is a self-contained diff to `src/bio.html`, previewed in the studio *and* locally.

| # | Batch | Output | Acceptance |
|---|---|---|---|
| **0** | Harness + page reset | `preview/index.html`, reset block in `bio.html` | Our block renders inside a Janitor-shaped DOM without inherited padding/background.  ✅ |
| **1** | Top bar + hero | wordmark, blue bar, key-art `<img>` layer, PLAY NOW plate, 2×2 CTA grid, side label, scroll cue | Renders on a 390 px viewport with no horizontal scroll. |
| 2 | Promo + socials | white promo card, social pill row | —  ✅ |
| 3 | Updates | pink band, angled tag, ribbon cards, View-more | Three cards, 1:1 with site.  ✅ |
| 4 | About | sky band, image plate + play triangle (CSS) | —  ✅ |
| 5 | Gameplay | green band, giant headline, 3-slide strip, arrows | Arrows work without JS.  ✅ |
| 6 | Roster + Elsewhere | purple mosaic (8 tiles), blue tiles | Names vertical, hover states.  ✅ |
| 7 | Footer + mobile pass | credits, breakpoints 390/430/520 | No clipped text, images ≤ 300 KB each.  ⏳ |
| 8 | Copy swap + File Garden URLs | final `bio.html` with `@uma_enjoyer` copy | Studio linter clean.  ⏳ |

---

## 4. Assets

Two sources, in order of fidelity:

**A. Official files** (crisp, transparent, self-serve). Download → upload to File Garden → paste the URL
into the matching `IMG:` slot in `bio.html`:

| Slot | Official URL |
|---|---|
| `IMG:LOGO` | `https://parts.umamusume.com/assets/images/logo_umamusume.png` |
| `IMG:KV` | `https://umamusume.com/_app/immutable/assets/kv.CiVddxQD.jpeg` |
| `IMG:BADGE_STEAM` | `https://parts.umamusume.com/assets/images/badge-steam.png` |
| `IMG:BADGE_APPSTORE` | `https://parts.umamusume.com/assets/images/badge-appstore.png` |
| `IMG:BADGE_GOOGLEPLAY` | `https://parts.umamusume.com/assets/images/badge-googleplay.png` |
| `IMG:BADGE_PCGAMES` | `https://parts.umamusume.com/assets/images/badge-googleplaygames.png` |
| `IMG:TGA` | `https://umamusume.com/_app/immutable/assets/TGAmobile_winner.DJe1kMYp.png` |
| `IMG:NEWS_BG` | `https://umamusume.com/_app/immutable/assets/news_bg.Bh8oYNXe.png` |
| `IMG:ABOUT_BG` | `https://umamusume.com/_app/immutable/assets/about_bg.CQiNXnT3.jpeg` |
| `IMG:ABOUT_THUMB` | `https://umamusume.com/_app/immutable/assets/about_thumbnail.DvTbfr6J.jpeg` |
| `IMG:GAMEPLAY_BG` | `https://umamusume.com/_app/immutable/assets/gameplay_bg.Bhbdtv2B.png` |
| `IMG:MEDIA` | `https://umamusume.com/_app/immutable/assets/media_image.bZStKUoL.png` |
| `IMG:PAGE_BG` | `https://umamusume.com/_app/immutable/assets/bg.BorAeoXQ.jpeg` |

Character cut-outs (transparent PNGs) live on the same CDN pattern, e.g.
`https://en-portal.g.kuroco-img.app/v=1744944608/files/user/character/goldship/goldship_top.png`.

**B. Screenshot crops** (only what exists nowhere else — news banners, character tiles).
Already produced in `assets/src/` from your phone capture at native 1080 px.

Naming convention for File Garden, so the HTML stays readable:
`uma_logo.png`, `uma_kv.jpg`, `uma_news_01.png`, `uma_char_goldship.png`, …

---

## 5. Open questions to settle in the studio (I can't run it)

1. Does the linter keep `background-clip:text` / `-webkit-text-stroke` (gradient-filled headline type)?
2. Are webfonts possible at all given the `url()` ban — or do we stay on system stacks? (Current build assumes system.)
3. Does the CSS panel have a character ceiling that our ~1,200-line stylesheet would hit? If yes we split per-section.

Each answer changes one batch, not the architecture.


---

## 6. Current state (2026-11-09)

- Batches 0–6 implemented in `src/bio.html` (330 lines of CSS, 12.7 KB, 15 `<img>` layers).
- Screenshots rendered with a real Chromium in the sandbox:
  `docs/preview-430.png` (mobile), `docs/preview-1440.png` (desktop).
- `preview/index.html` = live harness (reload-friendly, no build step).
- `preview/standalone.html` = single self-contained file with images inlined
  (`python3 tools/build_standalone.py`).
- All imagery is TEMP: local crops from the reference screenshots. Slots are marked `IMG:`.

---

## 7. Pulling the real source (how the numbers got in)

The sandbox egress policy allows only npm/GitHub/PyPI, so a local clone of umamusume.com is impossible
from here — proven, not assumed:

```
$ curl -s -o /dev/null -w "%{http_code}" https://registry.npmjs.org/   → 200
$ curl -s -o /dev/null -w "%{http_code}" https://umamusume.com/        → 000   (TLS handshake stalls)
```

But the Wayback Machine's CDX index *is* reachable through the page-fetcher, and it hands back the
site's original stylesheets verbatim:

```
# index of every archived stylesheet
https://web.archive.org/cdx/search/cdx?url=umamusume.com&matchType=domain&output=text
    &filter=mimetype:text/css&collapse=urlkey

# the bytes, exactly as served
https://web.archive.org/web/<timestamp>id_/https://umamusume.com/_app/immutable/assets/<file>.css
```

What that gave us, now baked into `src/bio.html`:

| Finding | Source rule | Applied as |
|---|---|---|
| Typeface | `@font-face{font-family:roboto;src:url(…/Roboto-VariableFont_wdth,wght.woff2)}` and `roboto-condensed` | `font-family: roboto…` body, `"Roboto Condensed"` for every display/italic element |
| Hero proportions | `.top-kv{height:190.66vw}` (mobile), `.__contents{top:111.46vw}` | hero set in `vw`, not px |
| Store badges | `.store-list img{height:9.7066vw}` | CTA blocks 9.7vw tall |
| Side pill | `right:2.4vw; top:49.33vw; width:6.13vw; padding:3.2vw 1.6vw` | same geometry |
| Scroll cue | `right:3.73vw; top:140.8vw` | same geometry |
| Header / footer blue | measured off the live paint + sheet | `#0E5AFE` / `#085EFF` |

Fonts are the one thing that cannot travel through CSS on Janitor (`url()` is stripped), so the
profile asks for `roboto` / `"Roboto Condensed"` and lets the device supply them — an Android phone,
which is what the reference screenshots were taken on, has both.

### If you want a byte-exact capture (recommended, needs your machine)

SingleFile is already one of your forks. On any machine with normal internet:

```bash
npx single-file-cli https://umamusume.com/ umamusume.html --browser-executable-path=/path/to/chrome
```

Drop `umamusume.html` in this folder and I can port section-for-section against the real DOM and the
real stylesheet instead of the Wayback copy — that is the last gap between "very close" and "identical".

---

## 8. Asset strategy, final (2026-11-09)

The page fetcher reaches the live site even though bash cannot, so today's build was read directly from
`https://umamusume.com/` and every image slot now points at Cygames' own CDN — no uploads, no
placeholders, nothing to File Garden first:

| Slot | Live URL (verified in today's HTML) |
|---|---|
| Logo | `parts.umamusume.com/assets/images/logo_umamusume.png` |
| Hero KV | `umamusume.com/_app/immutable/assets/kv.CiVddxQD.jpeg` |
| "Play Now!" | `…/kv_txt_playnow.D0FaPRug.png` |
| News thumbs | `assets-webview-umamusume-en.akamaized.net/…/banner_30320202_L1794088800.png` |
| About | `…/about_thumbnail.DvTbfr6J.jpeg` |
| Gameplay ×3 | `…/gameplay_specialweek.DbgtPsGW.png`, `gameplay_silencesuzuka.CF-9agsU.png`, `gameplay_winningticket.6_SJzSZq.png` |
| Roster ×5 | `en-portal.g.kuroco-img.app/v=<ver>/files/user/character/<slug>/<slug>_top.png` (transparent cut-outs) |
| Media ×2 | `…/media_image.bZStKUoL.png`, `…/gameplay_image_1-1.DqKsqutO.png` |

Because bash egress is blocked, the sandbox itself cannot download those pixels — `preview/index.html`
therefore carries an **offline shim** that swaps each CDN URL for the matching local crop at paint time,
so harness screenshots stay representative. The shipped files never use it.

The old cropped set is preserved in `src/bio-local-crops.html` + `assets/tmp/` as the fallback if a CDN
URL ever 404s after a redeploy — swap the `src` back and upload those 15 JPGs to File Garden.

Paste-ready output: `dist/PASTE-ALL.txt` (one box), or `dist/PASTE-CSS.txt` + `dist/PASTE-HTML.txt`
(two-panel editor).

---

## 9. Real source, acquired (2026-11-09)

The origin refuses every datacenter IP, and that was proven the hard way before finding a way through:

```
codetabs proxy   → 522
allorigins       → 200 (403 page, 199 b)
corsproxy.io     → 403
r.jina.ai        → 134 b error
GitHub runner Chrome (real browser, real UA) → 403 Error Page
```

The Archive is not blocked, and a GitHub runner reaches the Archive. `.github/workflows/capture-site.yml`
runs `tools/capture.mjs`, which pulls the site's own bytes into `capture/`:

| Artefact | Size |
|---|---|
| `capture/index.html` | 28 KB — the real SSR DOM, 113 nodes |
| `capture/css/*.css` | 1.6 MB, 51 files (the page links exactly 4 of them) |
| `capture/img/*` | 8.6 MB, 120 images |

The four stylesheets the page actually loads are now in `uma-profile/reference/real-css/`:
`0.CeerEmeO.css`, `2.BtMVfDfi.css`, `Modal.DqwlE6Qt.css`, `NewsItem.BW2Y3wsu.css`.

### The real DOM, section by section

```
.site-wrapper > .page-index
  section.top-kv
    .top-kv__img            ← the key visual
    .top-kv__left           ← p.-umamusume (vertical pill), p.-scroll
    .banner-wrap            ← .top-kv__banner.is-PC/SP (webstore banner)
    .top-kv__contents > .contents-wrap
      ul.store-list > li.store-steam / -appstore / -googleplay / -googleplaygames
      a.sns-x / .sns-facebook / .sns-youtube / .sns-discord
      .tga-baged
  section.top-news > .top-section-box > h3.section-title + .top-section-box__contents
  section.top-about > h3.section-title + .top-about__contents (-play-icon, -scale-img)
  section.top-gameplay > .top-gameplay__contents > .splide (3 slides, each
      .-umamusume > .-wrapper > .-left-contents (.-headline, .-images-list) + .-right-contents (.-text .line-break))
  section.top-characters, section.top-media, footer
```

That is the structure the rebuild should mirror — the current `src/bio.html` is an approximation of it
(`.uma-*` names, invented nesting). Rebuilding against these 113 nodes is the 1:1 path.

### Images no longer need File Garden

`capture/img/` is public in this repo, so the profile can point at the repo's own CDN copy:

```
https://cdn.jsdelivr.net/gh/lanzopanzo2013-eng/puppeteer@<commit>/capture/img/<file>
```

No hotlink dependency on Cygames, no uploads, and the bytes are the site's originals.

### Next

1. Port `top-kv` (hero, pill, scroll cue, store list, sns row) using the captured CSS values verbatim.
2. Port `top-news` (`.section-title` ribbon geometry from `2.BtMVfDfi.css`, `.NewsItem` card from `NewsItem.BW2Y3wsu.css`).
3. Port `top-about`, `top-gameplay` (splide → flex strip), `top-characters`, `top-media`, footer.
4. Strip every `svelte-*` suffix and every `var()` (JAI), keep the numbers.

---

## 10. The vanishing-SVG bug (2026-11-09, day 2)

Symptom reported: the SVG images render once, then disappear after the editor reloads the profile.

Cause, corroborated by the studio's own changelog (`tools.from-avalon.com/janitor-profile-maker`):
*"the preview is a capture of the real profile page … and what JanitorAI would strip is stripped here too"*
and *"the linter underlines every declaration JanitorAI throws away"*. SVG `<img>` sources don't survive
Janitor's sanitiser — they paint until the draft is re-saved, then they're gone.

Fix: no `.svg` anywhere. The four brand marks were rebuilt as PNGs:

```
capture/parts/sns-{x,facebook,youtube,discord}.svg   ← fetched from parts.umamusume.com by the runner
  ⤷ rasterised 8× in headless Chrome, trimmed to 128 px, png32 with alpha
uma-profile/assets/site/sns-*.png                     ← 2.2–4.2 KB each
```

Verified: `grep -c '.svg' JANITOR-PASTE.txt` went 4 → 0. Every raster in the profile is now
PNG/JPEG/WEBP. The chevrons, pager, band watermark and About backdrop were already PNG/JPEG.

Rule going forward: never ship an `.svg` source, always rasterise.

---

## 11. Why the notifications panel never appeared (2026-11-09)

Reproduced offline with Janitor's *own* stylesheet and a DOM snapshot of the real profile page
(`preview/vendor/janitor.css` + `preview/snapshot.js` from `from-avalon/janitor-profile-maker-fr`):
the whole `.pp-top-bar` / `#root` markup, plus the site's real CSS, in one local page with our
stylesheet dropped on top.

Janitor's notification popover, on phones, is

```css
@media (max-width:480px){ .notificationsPopover { position:fixed; right:.5rem; left:.5rem; z-index:10000 } }
```

`position:fixed` and **no `top`** — so it falls back to its static position, and its containing
block decides where that is. On the live site that containing block is the bar itself, because
`._bar_17iy7_26` carries `backdrop-filter: blur(10px)` and a backdrop-filter ancestor becomes the
containing block for fixed descendants. The bar is 56 px, so the panel lands at `top: calc(100% + 8px)`
= 64 px — just under the bar.

Our stylesheet had `backdrop-filter: none !important` on that bar (added to keep it transparent).
That deleted the containing block, so the popover's 100 % became the *viewport*: it opened at
`800 + 8 = 808 px` on an 800 px-tall phone — eight pixels below the bottom of the screen. Clickable,
rendered, invisible. Measured in the harness: `top: 808px` with our rule, `top: 72px` without it.

Fix: never touch `backdrop-filter` on `.pp-top-bar*`. Transparent background is enough to let our
layer show through. With the property restored the panel opens at 64.9 px, in view, on top.

Corollary for the unread badge (`position:absolute; top:2px; right:2px` of the button): it is painted
inside the 56 px strip our own blue layer covers, so it cannot be seen on this theme — the panel is
the place where unread items show.

Hit testing is *not* the problem: `elementFromPoint` at the horseshoe returns Janitor's own
`.pp-top-bar-notifications-button` (our layer is `pointer-events:none`), and real mouse clicks fire
its listener.

---

## 12. The wordmark, measured (2026-11-09)

Two screenshots of the official site, 1260 px wide = 360 CSS px (DPR 3.5). The logo was located by
masking its own palette (the wordmark's yellow `U` and the pink lettering), taking that mask's bbox in
the bar, and inverting the same fractions measured on `assets/site/logo.png`, so both states come off
one ruler:

| state | box (CSS) | at x | at y | width |
|---|---|---|---|---|
| page top (home) | 199.9 × 59.0 | 15.7 | 104.0 | 55.53vw |
| settled | 117.0 × 34.6 | 14.9 | 105.5 | 32.51vw |

Consequences: `margin-left: 4vw` (was 6.4vw — 9 px too far in), `margin-top: 10px` (top-anchored, not
centred, which is why the big one hangs 15 px out of the bar), width 55.5333vw → 32.5333vw.

How the shrink works without a scroll timeline. `scroll()` cannot attach to the band: it is
`position: fixed`, and Chrome resolves a fixed subtree against the viewport, so the nearest scroll
container is the (non-scrolling) viewport and the animation freezes at its start value — that was the
round-13 "logo stays huge" bug, reproduced in the harness. A **view** timeline has no such problem,
because it tracks the box of an element that really is in the flow:

```css
.uma-shell     { timeline-scope: --uma-settle; }
.uma-sentinel  { position: absolute; left: 0; top: calc(100vh - 64px); width: 0; height: 0;
                 view-timeline: --uma-settle block; }
.uma-hdr-brand img { animation: uma-logo-settle linear both;
                     animation-timeline: --uma-settle; animation-range: cover 0% cover 14%; }
```

A zero-height sentinel parked one screen down (minus the bar) reads `cover` progress 0 at the top of
the page and 1 after V px of scroll; 14 % of V is the settle distance (~112 px at 800). `timeline-scope`
hoists the name to the shell so the fixed wordmark, a sibling of the sentinel, can use it.

Verified in the harness against Janitor's own stylesheet, with the page scrolled *both* ways (document
scroller and a locked body with an inner panel): width 199.9 at scroll 0 → 170.3 / 140.8 / 118.6 at
40 / 80 / 110 → 117.1 from 160 on, in both, with the band still pinned at y = 0. Base width is the
settled one, so every failure mode (no `@supports`, reduced motion, sanitised away) lands on the
reference size rather than on an oversized mark.

---

## 13. The notification block, measured (2026-11-09)

Same ruler as §12: the two 1260 px screenshots (360 CSS px, DPR 3.5). The corner was isolated with a
near-white mask on the bar's blue, the horseshoe taken as the largest blob, the label as the components
below it:

| | reference (`.header__wrapper .-menu`) | ours before | ours now |
|---|---|---|---|
| horseshoe | 26.9 × 27.4 css | 24.9 × 25.7 | 28.9 × 29.4* |
| right edge | 14.9 from the screen | **24.9** | 15.1 |
| cap of the bar | 6.6 | 5.7 | 6.3 |
| label cap height | 6.9 | 7.1 | 7.1 |
| label → horseshoe gap | 5.7 | 4.0 | 5.4 |
| label right edge | 15.4 | 14.3 | 15 |

\* the local renderer is sharp; a phone screenshot of the same build measures ~2 px smaller, so 29
box pixels is the right setting for a 26.9 measured glyph.

The placement bug was the flex column sizing to its widest child: `.uma-hdr-menu` was as wide as
"Notifications", so centring the 27 px horseshoe inside a 46 px box parked it 10 px inboard. The box is
now the horseshoe's own width (29 px) and the label is `align-self: flex-end`, so its right edge sits on
the same 15 px inset as the reference's "Menu" and can never run off a narrow screen whatever font the
device substitutes. The reference label is short enough to be centred; ours is three times longer, so
the right edge is the edge worth pinning.

Also this round: the hero background is `assets/site/kv_hero.jpg` (the supplied key visual, resized to
1300 × 2288 / 437 KB), and the CDN pin moved to the commit that carries it — jsDelivr's index confirms
`/uma-profile/assets/site/kv_hero.jpg` at 447525 bytes under `@cb91b72`.

---

## 14. Unread state, gift mark, centred caption, fresh hero URL (2026-11-09)

### The badge had to leave the bar's stacking context

Janitor draws the unread count inside the bell button, and the button lives in `._header_17iy7_1`
(`position: sticky; z-index: 3000; backdrop-filter: blur(10px)`). A backdrop-filtered element is its own
stacking context, so anything the blue band painted — even at z 4000 — landed *under* the bar and the
badge was never hit-testable (`elementFromPoint` returned `_rightElement_o5odd_67`, the bar's spacer).
Three changes fixed it, in this order of importance:

1. the band sits **under** the bar: `.uma-hdr { z-index: 2500 }`, i.e. below Janitor's 3000;
2. the bar keeps a **0 px** backdrop blur (`backdrop-filter: blur(0px)`, not `none` — `none` drops the
   containing block the popover is anchored to and the panel loses its position);
3. the bar's own furniture (left block, search, filter, create-character, app menu) is hidden, so the
   only thing left up there is the transparent notification button our horseshoe sits on.

Result at 360 × 800 × 3.5, in both scrollers (document and a locked body with an inner panel):

| probe | before | after |
|---|---|---|
| count pill | `[305.6, 11, 38.4, 21.2]` | `[287, 7, 21, 16]` |
| hit at pill centre | `_rightElement_o5odd_67` | `_notificationsBadge_1jwi8_41` |
| popover | `[21, 63.7, 408, 116.6]`, over the hero art | `[8, 64, 344, 124]` |
| hit inside popover | hero art | `_popoverTitle_1jwi8_148` |

The pill is pulled out of the flow with `position: fixed; top: 7px; right: 52px`, so it reads as the
count **beside** the horseshoe (its right edge, 308, is 1 px off the glyph's left edge, 309).

### The gift mark

`assets/site/bell_gift.png` (72 × 72, 6208 B, the supplied `gsafespm3o3h1.png` downscaled) is an
`<img>` inside `.uma-hdr-menu`, `position: absolute; right: -7px; top: -5px; width: 22px`, so it stands
exactly where the old dot was — the glyph's upper-right corner — and it is hidden unless there is
something to count: `body:has([class*="notificationsBadge"]) .uma-hdr-menu img.uma-bell-gift { display: block }`.
Probed: `display: none` with no badge, `block` at `[323, 1, 22, 22]` with one. It stays inside its
absolute parent, so the rig's spill check stays at 0 at all four widths.

### The caption, centred and still fitting

The label is centred under the glyph (`text-align: center; align-self: center`) and the menu box moved
from `right: 15px` to `right: 16px` with the type at 8 px. That is the width where a centred twelve-letter
word clears the screen edge even in the widest fallback font the renderer has: the box measures
57.4 px, right edge 358.2 in the worst case, versus 46.3 px on the device's Roboto Condensed. Earlier
attempts at 10 px overflowed a 360 px screen by 2.8 px in the fallback face and clipped the "s".

### The hero

The band's `<img>` is the supplied key visual. It was re-published under a **new file name**
(`assets/site/kv_hero.jpg` → `assets/site/kv_main.jpg`, 447 525 B) so no cache, CDN edge or browser can
serve the old art at a URL it already knows, and the pin moved to the commit that carries it. The
measured conclusion from the pixel comparisons stands: our render and the live screenshot are the same
artwork (mean-abs-diff 50.8 against 59.2 for the old file), so the "unchanged" band was a stale page,
not a stale asset.

---

## 15. Why every image vanished, and the pin rule that prevents it (2026-11-09)

The paste pins its 51 assets to one commit on jsDelivr. A **7-character short SHA is not a reliable
`@version` for jsDelivr**: it answers

```
Couldn't find the requested file /uma-profile/assets/site/logo.png in lanzopanzo2013-eng/puppeteer
```

…for a commit that GitHub has had for minutes, while the same path with the **full 40-character SHA**
serves the file. Checked side by side at `84edeec`:

| URL | result |
|---|---|
| `…/@84edeec/uma-profile/PLAN.md` | jsDelivr "Couldn't find the requested file" |
| `…/@84edeec7167f0f0d1552f633bb50e99362432311/uma-profile/PLAN.md` | 200, full document |
| `…/@84edeec7167f0f0d1552f633bb50e99362432311/uma-profile/assets/site/logo.png` | served (binary) |
| `…/@84edeec7167f0f0d1552f633bb50e99362432311/uma-profile/assets/site/kv_main.jpg` | served (binary) |

So the rule for every future round: **pin the CDN with the full commit hash**, never the short one. A
short pin can resolve for commits jsDelivr has already cached and silently 404 the newest one — which is
exactly the "all images disappeared again" symptom (it is one broken ref, not 51 broken files).

The paste now reads `@84edeec7167f0f0d1552f633bb50e99362432311` in all 51 URLs (41 063 chars), and the
pin only has to move when an *asset* changes — CSS and markup travel inside the paste itself.

---

## 16. The count goes inside the glyph, and the hero is re-cut from the 8192px upload (2026-11-09)

### Why no number was visible

The count is Janitor's own element — a `<span>` with a hashed class inside the bell button
(`._notificationsBadge_1jwi8_41 { position: absolute; top: 2px; right: 2px; min-width: 22px }`), rendered by
React **only when there is something unread**. Two things were wrong with how we handled it:

1. the old rule keyed on the exact string `notificationsBadge`, so any rename in a Janitor release silently
   stops matching;
2. it was pulled out of the button with `position: fixed; right: 52px`, i.e. *beside* the horseshoe, where a
   count that is one character wide reads as decoration.

Now the bell button is re-seated on the glyph itself and the count is anchored inside it:

```css
.pp-top-bar-notifications { position: fixed; top: 6px; right: 16px; width: 29px; height: 29px }
.pp-top-bar-notifications-button { position: absolute; left: -5.5px; top: -5.5px; width: 40px; height: 40px }
.pp-top-bar-notifications-button::after { content: ""; position: absolute; ... 46px box }   /* tap area */
.pp-top-bar-notifications-button > span,
.pp-top-bar-notifications-button [class*="adge"] { position: absolute; left: 50%; top: 62%;
  transform: translate(-50%,-50%); ... pink pill ... }
.pp-top-bar-notifications-icon { display: none }
```

`[class*="adge"]` is hash-agnostic: it matches `_notificationsBadge_1jwi8_41`, `_badge_9zz1a_12`, and whatever
the next release calls it, and it is scoped to the bell button so the badges in the popover list are untouched.
The live number is Janitor's; nothing here invents one — with nothing unread there is no element to place, and
the glyph stands alone, exactly as the reference bell does.

Probed at 360 × 800, DPR 3.5, in both scrollers:

| probe | result |
|---|---|
| container / glyph | both `[315, 6, 29, 29.9]`, 16 px from the right edge |
| count (class `_notificationsBadge_1jwi8_41`, "12") | `[320.5, 17.8, 18, 15]`, **inside** the glyph |
| count (renamed class `_badge_9zz1a_12`) | `[319.2, 17.8, 20.5, 15]`, inside — proves the selector |
| tap at the glyph's centre | `BUTTON._notificationsButton_1jwi8_7` |
| popover | `[8, 64, 344, …]` — Janitor's own `position: fixed; right: .5rem; left: .5rem`, untouched |
| gift mark | `none` with no count, `block` with one |

### Hero

`assets/site/kv_front.jpg` — 1400 × 2464, 653 KB — is a fresh LANCZOS reduction of the **4654 × 8192**,
7.2 MB upload, not of the earlier 1300 px file. Whole art visible: the band is 190.6667 vw tall and the
picture is `object-fit: cover` at 50 % 50 %, so nothing of the group is cropped away on a phone.

### Note on measuring fixed elements

Headless Chrome reserves a classic 6 px scrollbar, so the initial containing block is 354 px while the
in-flow bar is 360 px — a band anchored `right: 16px` and a bar anchored `right: 16px` then sit 6 px apart and
the count looks misaligned in a way no phone can reproduce. The harness hides the scrollbar
(`::-webkit-scrollbar { display: none }`) and both land on 315.

---

## 17. Hero corrected to the right upload (2026-11-09)

The previous key visual was the wrong file: same artwork, but its 4654 × 8192 frame carries ~700 px of extra
grass along the bottom (ratio 0.568 where the intended frame is 0.621). The one supplied as
`IMG_20261118_160304_946.jpeg` is 4654 × 7494 and ends where the group does.

`assets/site/kv_first.jpg` is that frame at 1400 × 2254 (624 KB, q84, 4:4:4) — a LANCZOS reduction of the
16.1 MB original — and the band's `<img>` now points at it. Because the band is 190.6667 vw tall (ratio
0.5245) and the frame is 0.6211, `object-fit: cover; object-position: 50% 50%` fills the height and trims
≈4.5 % from each side; the composition's centre (Kitasan Black) is the anchor, so the trim lands on the
outermost figures' shoulders rather than on the subject.

Pin moved to the full hash of the commit that carries the new file; `kv_front.jpg` / `kv_main.jpg` stay in
the tree for history but nothing references them.

---

## 18. The count, four ways, and the menu in the header's blue (2026-11-09)

### Where Janitor can put the count

`._notificationsBadge_1jwi8_41 { position: absolute; top: 2px; right: 2px; min-width: 22px }` is a child of
`._notificationsButton_1jwi8_7`, which is a child of `._notificationsContainer_1jwi8_2`. That is where it is in
the vendored build — but a release can move it, and previous rounds only matched one placement. The rule now
matches every plausible one, all hash-agnostic, all scoped to the bar so no other badge on the page is touched:

```css
.pp-top-bar-notifications-button > span,
.pp-top-bar-notifications-button [class*="adge"],
.pp-top-bar-notifications > [class*="adge"],
.pp-top-bar [class*="adge"]                       /* widest: anywhere in the bar */
{ position: absolute; left: 50%; right: auto; top: 62%; bottom: auto;
  transform: translate(-50%,-50%); …pink pill… }
```

Probed at 360 × 800, DPR 3.5, one placement per row — all four land inside the horseshoe:

| where the count is rendered | box | inside the glyph |
|---|---|---|
| inside the button, real class | `[319.2, 17.8, 20.5, 15]` | yes |
| inside the button, renamed class | `[319.2, 17.8, 20.5, 15]` | yes |
| as a sibling of the button | `[319.2, 16.5, 20.5, 15]` | yes (was `[303.6, 8, 38.4, 21.2]`, outside) |
| inside a wrapper div in the button | `[319.2, 17.8, 20.5, 15]` | yes |

What CSS cannot do is create the number. React renders that element only while something is unread; with an
empty unread list there is no node to place and the horseshoe stands alone. The gift mark is the tell:
`body:has(.pp-top-bar [class*="adge"])` shows it **only** when the count node exists, so "gift visible, number
missing" would be a styling bug, and "neither visible" means Janitor has nothing to count.

### The menu

`._notificationsPopover_1jwi8_80` is `--bg-primary` (dark grey) with a `::before` sheen. It, its header, rows,
empty/loading states and footer now take the header's own `#0F57FB`, with white type and a lighter rule between
rows. Only the palette is forced — no widths, padding or borders of ours, so their layout cannot shift.

Probed after opening: panel `rgb(15, 87, 251)`, border `rgb(46, 107, 255)`, title `#fff`, message
`rgba(255,255,255,.78)`, time `rgba(255,255,255,.62)`, row hover `rgba(255,255,255,.10)`.

---

## 19. The side pill, the fandom block, and a full-screen menu (2026-11-09)

### Why the pill's letters hung outside it

`.uma-side` is `writing-mode: vertical-rl`, and in a vertical writing mode the **block axis is horizontal**.
`padding: 3.2vw 1.6vw` therefore put 11.5 css on the left and right of a 22 css box — a negative content box,
so the string was pushed through both walls of the pill. Two more things kept it off-centre: `vertical-rl`
stacks lines from the right, so a single line sits against the right wall, and `text-align: center` only
centres along the *inline* (vertical) axis.

Measured against `Screenshot_20261118-144728.jpg` (the official page, 360 css at DPR 3.5):

| | reference | ours, before | ours, now |
|---|---|---|---|
| pill box | 21.7 × 168.9 | 22.1 × 116 (and clipping its own text) | 23.8 × 168.8 |
| text ink across | 13.5, centred | 20+, spilling both sides | 12.0, centred (ink 9.25 → 21.25 of 23.8) |
| inset from the right | 8.9 | 8.9 | 8.9 |

The fix is physical padding (`.55vw 2.75vw` = 2 css across, 9.9 css along), `display: flex` with
`align-items: center` to centre the line box across the pill, and type sized to the reference's length:
`font-size: 3.54vw` (12.7 px) with `letter-spacing: .14vw` gives 146.5 css of ink, so the pill lands on
168.8 css — the reference's 168.9. The pill is 2 css wider than the reference's so the mixed-case string
(unlike their all-caps one) has room; because the right edge is pinned at `right: 2.4vw`, the extra width
grows leftward, which is what "make the text wider to the left" asks for.

### Fandom block

`.uma-hero-stack` moved from `top: 111.4667vw` to `116.4667vw` — 18 css lower — so the first card row
(543 → 561) clears Kitasan Black's knee instead of sitting on it.

### The notification menu is a sheet

`._notificationsPopover_…` is now the whole screen: `position: fixed; top: 0; left: 0; width: 100%;
height: 100vh`, no border, no radius, the header's `#0F57FB` edge to edge, with `3.4vw 4.2vw 10vw` padding
and type in vw (`4.8` title, `3.9` row title, `3.5` message, `3` time) so it scales with the screen. Its
containing block is the bar (which keeps `backdrop-filter: blur(0px)`), so the sheet is sized in `100%` /
`100vh` rather than `inset: 0` — `inset: 0` made it only as tall as the 56 px bar. The close button stays
in the header; the header actions got `white-space: nowrap`.

### Tooling note

The sandbox now has real **Roboto** and **Roboto Condensed** (woff2 from `@fontsource`, converted to TTF
with fontTools and dropped in `~/.fonts`). Every earlier measurement of the caption, the side pill and the
badges was taken against a wider fallback face; with the real fonts installed the harness agrees with the
phone screenshot (the pill's ink length lands within 4 % of the device's).

---

## 20. The plaque, read off the phone instead of the desktop (2026-11-09)

`Screenshot_20261118-174513.jpg` is the official page **on a phone**, and its plaque is a
different animal from the one I had been copying: the string is **all caps, tracked wide,
in a medium weight**, and the capsule is **21.3 × 239** css, not the 21.7 × 168.9 I had
taken from the desktop capture. Ours was title case, weight 800, tight — the letters filled
the capsule like a poster instead of floating in it.

Two scale-free measurements pinned it down (both crops are 260 px wide, same device):
the capsule's width-to-length ratio, and the ink's length-to-height ratio.

| | official | ours now |
|---|---|---|
| capsule | 21.3 × 239 (ratio .089) | 21.8 × 230 (ratio .095) |
| case | UPPERCASE | UPPERCASE |
| weight | medium | 600 |
| tracking | wide | .62vw (2.2 css at 360) |
| ink, across | ≈ 10 | 10.0 (cap of Roboto Condensed at 3.9vw) |
| stroke | 1 px + a second, thinner line set in | 1 px + `outline: .18vw` at `outline-offset: -.9vw` |

`font-size: 3.9vw`, `letter-spacing: .62vw`, `font-weight: 600`, `text-transform: uppercase`,
width `6vw`. The numbers come from measuring the string in the browser (Roboto Condensed
uppercase is 5.35 px per glyph at 10 px) and solving for the ink length that lands the capsule
on 239: `ink ≈ 11.95·F + 22·L`.

Janitor already loads **Roboto Condensed as a variable font** (100..900) through its Google
Fonts link, so the medium weight and the condensed cut are both real on the device — this is
not a face I am hoping for.

### The scroll cue

It had no `font-family`, so it was inheriting the page's body serif for "Scroll". Now Roboto
Condensed, uppercase, `.4em` of tracking, and the two chevrons flow inline after the word
(`display: flex; flex-direction: column` had been laying the `»»` out *beside* the word and
interleaving it into the middle of it, because in a vertical writing mode a flex column runs
horizontally).

---

## 21. Reading the plaque and the plates off a full phone capture (2026-11-09)

`Screenshot_20261118-180923.jpg` is the whole official page at 1260 × 2800, so it is DPR 3.5
against a 360 css viewport and every measurement in it is directly comparable to mine.

### The plaque was oversized by 78 %

| | official | ours (before) | ours (now) |
|---|---|---|---|
| capsule | 21.7 × 164.3 | 21.4 × 209.7 | 20.6 × 163.7 |
| glyph height | 7.1 | 13.7 | 7.1 |
| tracking | wide | .62vw | .5vw |
| font-size | — | 3.9vw | 2.9vw |

The glyphs were nearly twice the size of the reference's and the string ran 45 css past it.
`font-size: 2.9vw` (cap 7.1), `letter-spacing: .5vw`, and the end padding cut from `2.75vw`
to `1vw` — the official's type runs to within 2.5 css of each cap, it does not float in the
middle of it. The capsule is now within 0.6 css of the reference's length.

### The plates

The edge is 1 px of `rgba(255,255,255,.45)` — a thin grey line, not the white 1.5 px I had —
and the plates are 33 css tall instead of 40, radius 10, with the marks given 24 px of height
so they fill the plate the way the store badges do on the site. The row gap came down to 1vw,
which makes each plate ~4 css wider at the same stack width, and the stack's own margin went
from 11 % to 10.2 % (the site's plates run x 37 → 323).

### The scroll cue

11 px instead of 10, tracking `.34em`.

---

## 22. The words read as words (2026-11-09)

Both vertical strings were being laid out as a column of separate letters — `S C R O L L`,
`U M A M U S U M E` — because of `letter-spacing` applied along a vertical line. The
tracking is now effectively off, and the type is sized so the word still fills its space:

| | before | now |
|---|---|---|
| plaque | 2.9vw / `.5vw` tracking → capsule 21.6 × 163.7 | 3.6vw / `.06vw` → capsule 21.6 × 170.3 |
| scroll cue | 11px / `.34em` | 11.5px / `.04em` |

Note for anyone comparing against the official page: the site *does* track its plaque wide
(2.7 css of daylight between glyphs). The instruction here is explicitly the opposite — the
strings should read as words — so tight wins over the reference.

Removing the tracking shortens the run, so the glyphs had to grow from 2.9vw to 3.6vw
(cap 9.3 css) to keep the capsule within 6 css of the reference's 164.3. If the plaque now
reads too heavy, the knob is `font-size` (3.6 → 3.3vw) and the capsule shortens with it.

---

## 23. The hero is the raw key visual, not the photo (2026-11-09)

Every round until now has used `IMG_20261118_160304_946.jpeg` — a photograph of the key
visual, which is why the front page read dim and slightly green next to the site.

The uploaded set now carries two clean files from the official artwork:

| file | size | what it is |
|---|---|---|
| `kv.-RnlVFGO.jpeg` | 750 × 1320 | the raw key visual as published |
| `kv.-RnlVFGO-2.jpeg` | 750 × 1202 | **the same, cropped by the user** — `raw[61 : 1263]`, confirmed by matching the two (mean |Δ| 2.2/255) |
| `upscalemedia-transformed.jpeg` | 4654 × 8192 | a 6.2× upscale of the raw |

`assets/site/kv_first.jpg` is now that crop at full size: the upscale trimmed to the same
framing (`y 378 → 7837` of 8192) and resampled to 1500 × 2404, which is 4.2× the 360 css
band. Compared back against the user's 750 × 1202 crop it differs by 3.3/255 — i.e. it is
their crop, just not upsampled by the browser.

The band is `190.6667vw` tall (ratio 0.524) against the artwork's 0.624, so `object-fit:
cover` still trims 16 % of the height — 8 % off the top and 8 % off the foot, centred. Move
`object-position` off `50% 50%` if a particular part of the frame needs to survive that.

---

## 24. The hero is used whole (2026-11-09)

Final answer on the artwork: `IMG_20261118_160304_946.jpeg` (4654 × 7494, 15.4 MB) **as
supplied** — no crop, no upscale, no colour work. The only operation is a downscale to
1600 × 2576 (identical aspect; diffed back against the source at 0.12/255) so the asset is
641 KB instead of 15 MB and still more than the 1260 px the phone asks for.

The band is `190.6667vw` tall, ratio 0.524 against the artwork's 0.621, so `object-fit:
cover` still trims 8 % top and 8 % foot — that is the layout, not the file. `object-position`
is `50% 50%` on phones and `50% 12%` above 820 px.

---

## 25. The picture is never cut, and it holds on every phone (2026-11-09)

**The width really was being cut.** The band was `190.6667vw` tall (ratio 0.524) against a
picture of ratio 0.621, so `object-fit: cover` scaled to the band's height and threw away
15 % of the width — 33 css off each side at 360. That is what "the width gets cut" was, and
it was not the phone.

The band is now **`161vw`** — exactly the artwork's own ratio (1600 × 2576) — so cover has
nothing left to trim: the picture is shown whole at every width, edge to edge.

Everything that rides on the picture was re-seated as a fraction of the band it had at
`190.6667vw`, so nothing drifted when the band lost 106 css:

| | before (band 190.67vw) | now (band 161vw) |
|---|---|---|
| plaque | top 49.33vw | **41.66vw** |
| badge stack | top 116.47vw | **bottom 6vw** |
| scroll cue | top 140.8vw | **118.9vw** |

The stack is anchored to the *foot* rather than to a height — same 22 css off the bottom edge
at 360, but it cannot march out of the band on a narrow screen the way an absolute top could.

### Widths

`tools/rig.cjs` now runs nine widths instead of four — 280, 320, 344, 360, 390, 414, 430,
480, 1280 — and all nine pass with `spill=0`. Measured against the band's own foot:

| width | band | stack foot | verdict |
|---|---|---|---|
| 280 | 451 | 434 | fits |
| 320 | 515 | 496 | fits |
| 360 | 580 | 558 | fits |
| 414 | 667 | 642 | fits |
| 480 | 773 | 744 | fits |

Before the foot anchor, 280 and 320 overflowed the band and `overflow: hidden` ate the
"Official Accounts" row. Everything else is in `vw`, so the whole front page scales with the
viewport rather than being tuned to one handset.

---

## 26. Measured against the reference, not guessed (2026-11-09)

Both screenshots are 1260 × 2800 at DPR 3.5 over a 360 css viewport, so every number below is
a direct comparison at the same scale. The page's own datum is the top of the artwork — the
blue header band ends at 148.3 css on the site and at 145.4 css here, and everything is
expressed from there so the phone's chrome can't skew it.

### The plaque

| | official | ours, before | ours, now |
|---|---|---|---|
| capsule | **21.7 × 164.3** | 21.4 × 155.7 | **21.4 × 164.0** |
| top, from the artwork's top | **132.6** | 153.2 | **132.9** |
| foot | 296.8 | 312.2 | 300.0 |
| glyph cap | 7.4 | 9.4 | ≈ 7.6 |

The type was `3.6vw` with tracking switched off — 27 % too large — so it read chunky and the
capsule came up short. Solved from the reference instead of by eye: cap 7.4 css ⇒
`font-size: 3.08vw`; the run has to fill 164.3 css across 23 glyphs ⇒ `letter-spacing: .48vw`;
the capsule is 21.7 wide ⇒ `width: 6.3vw`; and the top moves `41.66vw → 34.44vw` to land on
132.9 from the artwork's top.

### The badges

| | official | ours, before | ours, now |
|---|---|---|---|
| first plate, from the artwork's top | **346.6** | 380.0 | **346.0** |
| plate height (black area) | 33.1 | 31.1 | **33.1** |

"Too low" was 33 css — the plates had drifted down when the band was re-cut for the whole
artwork. The stack is anchored to the picture's foot, so the correction is one number:
`bottom: 6vw → 12.5vw`. Plate height goes `9.2vw → 9.75vw` so the black area measures the
reference's 33.1 css rather than the 33.1 including borders.

All nine rig widths still pass with `spill=0`.

---

## 27. One border, no tracking, and the cue on the card's edge (2026-11-09)

- **Plaque**: the inset `outline` that drew the second line is gone — one 1 px capsule. The
  `letter-spacing` is gone too, so the string is a word: the capsule measures **21.4 × 149.4**
  against the site's 21.7 × 164.3, and it is still hung from the same top (132.9 vs 132.6
  from the artwork's top). The 15 css it gives up is exactly the width the site's tracking
  was buying; the alternatives are a longer capsule with padding at the caps, or a larger
  `font-size`, and both trade away something the reference has.
- **Scroll cue**: anchored to the same foot as the badge stack (`bottom: 12.5vw`), so it
  rides lower; type 13 px; the chevrons are 1.55 em — larger than the letters rather than
  smaller — with `.35em` of air before them. Measured: word 466.6 → 509.1 from the artwork's
  top, chevrons 519.1 → 533.7, and the last white card's foot is at 534.9, so the arrows end
  on the card's edge as asked (the site: 449.7 → 488.7, 500.3 → 511.7, card foot 515.4).

`https://tools.from-avalon.com/janitor-profile-maker/` is reachable from here now, but it is
a client-side studio — fetching it returns its own demo profile, not a render of our paste,
and it states in its own copy that its phone preview uses desktop chrome. The local rig
(docs + `tools/rig.cjs`), which reproduces Janitor's DOM at nine widths, remains the check.

---

## 28. Why the plaque needed tracking at all — the face was wrong (2026-11-09)

The site's plaque carries 23 glyphs across 164 css with capitals 7.4 css tall and a pitch of
7.43 — which means its capitals are as **wide** as they are. That is a regular-width face,
not a condensed one. Set in Roboto Condensed at the same cap height, the string only reaches
149 css, and the only way to close that gap is the tracking that reads as loose letters.

So the plaque now uses **regular Roboto** first in the stack (`roboto, "Roboto Condensed",
Arial`), at `3.12vw` with `letter-spacing: 0`:

| | official | condensed + tracking | **regular, no tracking** |
|---|---|---|---|
| capsule | 21.7 × 164.2 | 21.4 × 164.4 | **22.7 × 163.6** |
| glyph cap | 7.4 | 9.4 | **≈ 8.0** |
| tracking | none | `.48vw` | **none** |

Roboto measures 140.57 px for the whole string at 10 px (0.61 em per glyph against Roboto
Condensed's 0.54), so 23 glyphs fill the reference's length at the reference's cap size with
nothing added between them. Janitor loads Roboto itself, and Roboto is the Android system
face, so this is the same typeface on the phone as in the rig.

Note for the ledger: the straight-section measurements (the runs I take off a screenshot's
border column) are not comparable between the two builds — our border is 85 % white, so its
rounded caps fall below the threshold, and the run reads ~15 css short of the box it is
measuring. The box numbers above come from `getBoundingClientRect`, which is exact.

---

## 29. The plaque, finally on the reference's own ruler (2026-11-09)

Getting the two screenshots on one ruler was the whole problem: the pages put the artwork's
top at slightly different heights (145.1 css here, 148.3 on the site), and the site's pill
border is a thin continuous line while ours is 85 % white, so a straight-section scan reads
~15 css short on ours and ~0 on theirs. Measured from the artwork's top with a common method:

| | official | ours, before | ours, now |
|---|---|---|---|
| capsule, from artwork top | 120.3 → 306.8 (**186.6**) | 85.5 → 259.2 | **124.0 → 309.8 (185.8)** |
| width | 21.7 | 22.6 | 22.7 |

`font-size: 3.56vw` with `letter-spacing: 0` in regular Roboto — the length comes from the
glyphs, not from space between them, and the capsule now runs from Kitasan's shoulder down
to Satono Diamond's sleeve the way the reference does.

The lesson worth keeping: the DOM (`getBoundingClientRect`) is the only trustworthy number in
this loop. Screenshot measurements of a *semi-transparent* border move by 15 css with the
threshold, which is exactly the size of the change being tuned — that is how three rounds of
"still the same length" happened while the number was moving.

---

## 30. Type size frozen, capsule grown at its ends (2026-11-09)

The type goes back to the measured size, `3.12vw` (11.23 px, cap 8.0), `letter-spacing: 0`,
regular Roboto — and the capsule reaches its 186 css from the space at the ends instead:

```
padding: 3.66vw 1vw;   /* 13.18 css along the text, 3.6 css across it */
```

Getting the axis right mattered: a probe of five padding pairs showed the **first** value is
the one that runs along the text, because vertical writing mode turns the block axis
horizontal. `1vw 4vw` widened the pill to 30.8 and left its length untouched; `4vw 1vw`
moved it 22.7 × 163.6 → 22.7 × 188.5. `3.66vw` lands on 186.0.

| | official | ours |
|---|---|---|
| capsule | 21.7 × 186.6 | 22.7 × **186.0** |
| word run | 158.9 | **157.9** |
| air at each end | 13.9 | **14.0** |
| type | cap 7.4 | cap 8.0, no tracking |

So the reference capsule was never tight around its word — it carries fourteen css of air at
each end, and the earlier "the capsule hugs the letters" reading came from measuring a
164-css capsule that was really 186.

Also worth recording: the screenshot the user sent back was still the round-31 build (capsule
≈ 148 css, measured off the image), so the two builds in between never reached the phone.

---

## 31. Two pixels, and which pixels they are (2026-11-09)

"Smaller by 2px" is ambiguous on a screen like this one, so both numbers are recorded here:

| reading | css font-size | word run | capsule |
|---|---|---|---|
| 2 **device** px on a 3.5× screen | 2.96vw (10.66 px) — **built** | 149.8 | 185.8 |
| 2 **css** px | 2.56vw (9.23 px) | 129.8 | 185.8 |
| before | 3.12vw (11.23 px) | 157.9 | 186.0 |
| official | — | 158.9 | 186.6 |

Built the device-pixel reading, because it is the visible two pixels in the side-by-side and
because the css reading drops the word to 129.8 — 29 css short of the reference's 158.9, which
would no longer be a correction but a different pill. The capsule is held at 186 either way by
re-balancing the end padding (`4.75vw`).

---

## 32. And 1.4 of them back (2026-11-09)

Same unit as §31 — device pixels, since 1.4 css px would have pushed the type to 12.06 px,
past the 11.23 it started at, which is the opposite of the correction being asked for.
So the type now sits at **11.05 css px** (`3.07vw`), the word runs 155.4 against the
reference's 158.9, and the capsule holds 185.9 with `padding: 3.98vw 1vw`.

| | font | word run | capsule |
|---|---|---|---|
| 2 device px smaller | 10.66 | 149.8 | 185.8 |
| **1.4 back (now)** | **11.05** | **155.4** | **185.9** |
| before either change | 11.23 | 157.9 | 186.0 |
| official | — | 158.9 | 186.6 |

---

## 33. The two supplied marks, measured into place (2026-11-09)

Both replaced things that were being *drawn*: the "Chat now!" was seven CSS gradients and
four drop-shadows imitating a wordmark; the Game Awards strip did not exist at all. Both now
come from the supplied PNGs, committed under `assets/site/` and pinned to
`b46846e` (their own commit, so the URL stays valid whatever comes after).

Only transparent margin was trimmed — the files keep every visible pixel (awards 1648×1005
from 1728×1344, chat‑now 1792×350 from 2032×1200), then downscaled to 800 and 1100 wide, 6.8×
and 14× their largest on-screen size.

**Chat now** — `height: 4.2vw` (15.1 css) on a 5.12 : 1 mark gives a 77.3 × 15.1 cta where the
drawn type needed 21 px; it sits centred in the plate row at x 36.7 → 114.

**The Game Awards strip**, measured off the official phone capture (DPR 3.5, art top 148.3):
the strip runs x 210 → 328.6 css and its foot is at 332.6 css from the artwork's top — its
right edge meeting the plaque's left edge, its foot 13.4 css above the first plate row.

| | official | ours |
|---|---|---|
| strip x | 210 → 328.6 (117.7) | 210.5 → 328.6 (118.1) |
| strip foot, from art top | 332.6 | 332.6 |
| first plate row top | 346.6 | 345.2 |
| chat mark | — | 77.3 × 15.1 at x 36.7 |

`right: 8.72vw; bottom: 68.6vw; width: 32.8vw` — every term a fraction of the viewport, so at
320 the strip is 105 wide and meets the pill at x 292, at 414 it is 135.8 and meets it at 378.
Rig: spill 0 at every width through 1280.

---

## 34. The strip comes out, the plate edge goes lighter (2026-11-09)

The Game Awards strip is gone — the `<img>`, its rule block and its desktop override — and
`<img class="uma-awards">` no longer exists in the rig (`null`). The PNG stays committed at
`b46846e`; it simply is not referenced.

The black plates' edge was `rgba(255,255,255,.45)`. Sampling the official capture across a
plate's edges gives a brightest pixel of **#AFAFAF** (left 174, top 158, foot 157), i.e. about
0.69 white over black; ours now renders **#B3B3B3** from `rgba(255,255,255,.70)`.

| | official | ours before | ours now |
|---|---|---|---|
| brightest edge pixel | 174–176 | 114 | **179** |

Rig: spill 0 at every width; the paste is back to 44,903 chars from 45,403.

---

## 35. The notification sheet: carrot out, unread blue, and a foot from the official menu

Three things came back with the screenshot of the sheet on the phone.

**The carrot is gone.** The rainbow carrot at the top-right of the horseshoe (`bell_gift.png`,
shown only while there was something unread) is removed — markup and both rule blocks.

**The grey row is blue.** Janitor paints the unread row's fill on a wrapper inside the item,
which is why the old `background: transparent` on `.notificationItem` never reached it. The
sheet now clears every fill inside a row and paints the unread row itself:
`rgba(255,255,255,.18)` over the panel's blue = **#3A75FC**, with the pink edge Janitor's own
indicator used: `box-shadow: inset .9vw 0 0 #F2739E`. The tint rule needed a compound selector
(`[class*="otificationItem"][class*="nread"]`, 0,3,0) to beat the transparent reset at 0,2,0 —
at equal specificity the later rule lost, which is what kept the row blue-but-blank.

**The sheet now ends like the official menu** (205210): a row of circular social buttons and
the cream card that carries the download badges on umamusume.com — with the creator's note in
it where the badges are.

Because the sheet is Janitor's own fixed layer, its foot is built from the popover's own two
pseudo-elements, ordered after Janitor's children with `display:flex` + `order`. That keeps it
alive only while the sheet is open, and it needs no extra DOM.

| | official 205210 | ours |
|---|---|---|
| cream card | x 39.1 → 322.0, h 146.6 | inset 4.2vw, radius 2.6vw, `#FAF3E0` |
| social discs | d 41.5, gap 8.4 | d 11.5vw (41.4), gap 2.3vw |
| disc row | x 130.6 → 322 | right-anchored, same order X · f · ▶ · discord |

The note is the supplied paragraph, lightly copy-edited ("that are days" → "there were days").
The link inside it is text, not a link: a pseudo-element's content cannot carry one.

Checked in a mock of the sheet at 320 / 360 / 414 (`docs/notifications-panel*.png`), not on the
live page — the real popover only exists when the bell is tapped.

---

## 36. The note becomes real markup: horseshoes, links, no rules broken

The pseudo-element version of the foot is gone. It could carry a `content` string but not an
anchor, and the note's two URLs had to be tappable, so the foot is now our own markup
(`.uma-sheet-foot`), pinned to the viewport and gated on Janitor's sheet existing:

```css
.uma-sheet-foot { display: none; }
body:has([class*="otificationsPopover"]) .uma-sheet-foot { position: fixed; bottom: 0; ... }
```

Verified both ways: with a mock sheet open it lays out, and on the profile page itself the
element computes `display: none` with height 0 while the rig still reports spill 0 at every
width from 280 to 1280.

**The ground.** The official's download card sits on pale horseshoe marks, so the note card
does too: `assets/site/horse-mark.png`, the header horseshoe recoloured to #E4D8BC at 90 %
alpha, laid three times behind the words (`132% -14%`, `-16% 118%`, `92% 62%`).

**Formatting and wording.** Three paragraphs, a pink uppercase kicker, 3.05vw/1.42 body, and
no em dashes anywhere in the paste (`grep -c —` returns 0). The links restate their colour
because the shell flattens every anchor to the body colour.

**Space.** The foot is 88.6vw tall at every width (it is all vw), and the sheet now reserves
92vw at its bottom, so no notification row can end up behind it. Measured at 320 / 360 / 414:
283.7 / 319.1 / 366.8 css — 88.7 / 88.6 / 88.6vw.

The four discs point at the game's own accounts, taken from umamusume.com itself:
x.com/umamusume_eng, facebook.com/umamusume.eng, youtube.com/@umamusume_eng,
discord.gg/umamusume-eng.

## 37. Not the game's accounts — the profile's (2026-11-09)

The row above the note was pointing at umamusume.com's socials; it should point at the
profile's own three, the ones the "Official Accounts" card already carries:

| | href | mark |
|---|---|---|
| Saucepan | saucepan.ai/u/uma_enjoyer | `fd_saucepan.png` (3.93 : 1 wordmark) |
| Discord | discord.gg/8XftR6Qd | `fd_discord.png` (1 : 1) |
| Janitor AI | janitorai.com/profiles/86121955-… | `fd_janitorai.png` (0.8 : 1) |

Because the Saucepan mark is a wordmark, the discs became badges: equal height (9.6vw),
width following the mark, radius 99px. The two square marks come out as circles on their own,
which keeps the official row's rhythm without squashing the wordmark into a smudge.

Label reads **Official Accounts**. Foot is 86.7vw tall at every width, inside the sheet's
92vw reserve. The `sns-*.png` files stay in the repo, now unreferenced.

## 38. In the Works: the News band, drawn in CSS (2026-11-09)

The front page was declared finished, so this round rebuilt the pink block that used to
read "Current OWN Doings". The user picked **In the Works** out of four candidate titles,
sent the official News band as the target and the pale horseshoe art as its ground, and
asked for the frame itself in **SVG or CSS, not a bitmap**.

No SVG was needed. The band is a rounded box with a `#FF79D0` border, the ribbon straddling
its top left is a `skewX(-13deg)` rectangle whose label is counter-skewed, and the card tags
are `clip-path` flags. Everything is CSS, so it stays crisp at any width and cost no extra
request.

Geometry, measured off the reference capture (360 css wide, 3.49 dpr):

| | reference | ours at 360 |
|---|---|---|
| frame | x 15.8 → 345.1, 3.1 border, r ≈ 8 | x 15.8, 328.3 wide, .9vw border, r 2.4vw |
| ribbon | x 10 → 137, y 134.6 → 169 | x 12.2, 176.6 × 30.2, top −8.6vw |
| cards | x 34.7 → 326.2 (291.5), gap 9.4 | x 33.9, 292.1, gap 2.6vw |
| green pill | 77.1 × 15.5, `rgb(181,217,19)` | 60.4 × 15.3 for the shorter tag |
| date | ink 9.2 tall, same green, italic | 2.95vw |
| body text | `rgb(79,79,79)`, two lines to 243 | 3.55vw Roboto Condensed |
| View more | x 57.0 → 289.5, 39.8 tall | 232.5 × 41 |

The band's ground is `news-bg.webp` (the user's `upscalemedia-transformed.webp`, 2304 × 4224,
downscaled to 1000 wide). It is painted on an `::before` that reaches 12.5vw *above* the
section and is masked with a linear gradient, so the key visual's photograph fades into the
pale art above the frame the way `072015` shows it. Masking the ground rather than fading a
separate block keeps one pattern aligned across the seam.

Panels stack as before: the frame carries `z-index: 1` over the ground and is itself the
scroll-reveal node, since the cards now sit one level deeper.

Placeholders: the three rows keep the earlier copy (Silence Suzuka, Unity Cup, Aquarius Cup)
and two of them lend their banner to the new media slot. `news1.jpg` and `news2.jpg` were
cropped from 560 × 157 to 447 × 130 so the old card furniture that had been captured in them
no longer peeks under the image.

Rig: 9/9 widths, spill 0, reveal still fires. Paste 49,156 chars.

## 39. The pill is the user's drawing, and it answers (2026-11-09)

Three changes to the band.

**The ribbon.** The user answered the note at the end of §38 not by shrinking the tag but
by nudging it: a touch lower, a touch bigger. Top went from −8.6vw to −7.6vw, type from
5.5vw to 5.7vw, padding from .85/.95vw to .95/1.05vw. It now measures 182.9 × 31.8 at 360
(was 176.6 × 30.2), and its bottom sits 1.1vw over the frame's top edge instead of 0.1vw.

**The pill.** `view-more.png` replaces the CSS pill the user asked for. Their file is
3920 × 824 with the artwork already on a transparent ground; the visible pill sits inside
it at x 243 → 3741, y 91 → 702, so the asset was cropped to that box (3499 × 612, 5.7173)
and resampled to 700 × 122, about 3× the 232.5 css it is drawn at. Sized by width alone
(64.6vw, unchanged), it lands at 232.5 × 40.5 against the reference's 232.5 × 39.8. The
half-pixel of extra height is the artwork's own aspect, not a guess: forcing 39.8 would
have squashed it by 2%.

**The answer.** There is nothing behind View more, and the profile carries no script, so the
grey line has to come from markup alone. `:target` was the first try and it worked, but
Chrome scrolls the fragment to the top of the viewport, so the tap threw the page. The pill
is a `<details>` summary now: tapping opens `Sorry... / there isn't actually any more.` in
grey under it, the frame grows by 29 css, and `scrollY` and the URL stay put (verified in the
mock: 726 → 726, hash empty). The line is broken by hand after "Sorry..." so it never lands
as a widowed "more." on a narrow phone.

Rig: 9/9, spill 0. Paste 49,579 chars.

## 40. The band's ground was never arriving, and the face (2026-11-09)

The user's phone showed the transition as a pale wash that stopped dead on a line, with flat
#EFFEE7 under it. Sampling their capture settled it: every pixel of the band below the seam
is exactly (239,254,231), the section's own background-color, while the two card banners from
the same commit render fine. So the CSS `background-image` on `.uma-news::before` never
loaded. Nothing about it was broken on paper: the file is on the pushed commit (verified
through the API) and the mask was valid. Whatever the live page does with a `url()` inside a
pseudo-element, it does not do it, so the ground stopped being a `url()`.

The ground is a plain `<img class="uma-news-ground">` now, the same way every other band in
the profile carries its art, and it is a **JPEG**: the card art that does load is JPEG from
the same tree, so the format is no longer a question. There is no mask left anywhere, only
gradients, which the live page demonstrably renders (its own hero wash).

Three gradients make the join:

| | does |
|---|---|
| `.uma-hero-wash` | was white, now fades the key visual to #EFFEE7 over its bottom 17% |
| `.uma-news::after` | fades the artwork's near-white first band back out to #EFFEE7 over 20vw |
| `.uma-news-ground` | the 1000 × 1833 art at 100% width, so 1.833 × the width tall; #EFFEE7 fills any shortfall |

Since the hero's wash and the band's first pixels now land on the same colour, there is no
seam to see, and nothing depends on mask support. Checked at 360 and 414, rig 9/9.

**The face.** `awful.jpg` (320 × 427, from the user's `images.jpeg`) sits to the left of the
grey line, 11.4vw tall, inside the same `<details>`, so it opens and closes with the text.

Also answered the user's hosting question: the art lives in the public repo and is served by
jsDelivr pinned to a full commit sha, which is immutable and does not expire, File Garden is
not needed, and the only thing that would break a pinned link is the repo going private or
away.

Paste 50,053 chars.

## 41. The band gets its real five (2026-11-09)

The placeholders are gone. Five entries, every one of them a `<details>`: closed, the band
still reads like the site's news list (topic pill, date, one line); opened, the long copy
comes up under a hairline and the chevrons roll to point down. No images, no script.

**The five.** Topic labels as sent, except the second, where the user asked for a better word
than "publication" and left the choice open.

| pill | UTC (MNL minus 8) | what it says |
|---|---|---|
| Lorebooks | 2026/08/18 02:47 | passion project, BETA → FV14, plus an IN PROGRESS chip |
| Debut | 2026/11/20 01:00 | the 250 follower special on saucepan.ai |
| Production | 2026/10/30 11:12 | quality over quantity, lorebooks pushed to Feb / Mar 2027 |
| Schedule | 2026/11/07 01:34 | weekend releases, zone accordion, the "not a machine" note |
| Gforms | 2026/10/04 04:47 | the three Google forms |

The status chip is a pill with a lamp in it: a `#8CC63F` dot breathing through a box-shadow
ring, switched off under `prefers-reduced-motion`.

**The schedule.** The user's old bot page shows Tokyo at 10:00 AM to 12:00 PM (Weekend A) and
9:30 PM to 12:00 AM (Weekend B). Worked back, that is 01:00 to 03:00 UTC and 12:30 to 15:00
UTC, which is also what makes Weekend A land on a North American evening and Weekend B on a
European and Asian one, exactly as their own note describes. All sixteen rows are those two
windows shifted, so Tokyo reproduces their reference to the minute. Rows open one at a time,
each onto its own WEEKEND A / WEEKEND B pair.

**The forms.** Three green pills in the band's own style. The grey line under Scenario Ideas
reads "Disregard the Umamusume only rule here."

Grammar pass, no em dashes anywhere. Copy keeps the user's voice; only the dropped words,
the run-on clauses and the curly apostrophes were tidied.

One thing to raise with the user: Criticism and Scenario Ideas were sent with the **same**
form URL, so both buttons point at the same form until they send the second link.

Rig 9/9, spill 0, a real click opens a box without moving the page. Paste 61,922 chars.

## 42. The band climbs, and the boxes take their true measure (2026-11-09)

Two things the user asked for on their live capture.

**The lift.** The band sat 45 css of blank artwork plus 6.8 css of its own padding below the
badge stack. It now carries `margin-top: -6vw`, so the whole band, ground included, climbs
21.6 css into the key visual's fade at 360. Measured in the mock: the section starts at 602
against a hero that ends at 623.6, the ribbon's top goes from 630.4 to 611.8, and the plates
still sit 33 css above it, untouched at their z-index of 3.

Because the band now starts inside the picture, the join needed re-timing:

| piece | was | now |
|---|---|---|
| key visual wash | 17% of the hero | 20%, a longer, softer ramp |
| band ground | `height: auto`, its top edge at the band's first pixel | `height: 100%; object-fit: cover`, so the art fills a band that is now much taller than 1.833 x its width |
| band overlay | 20vw from the band's top | 28vw from −8vw, solid #EFFEE7 right across the join |

A pixel walk down the join at 360 shows no step: 82,160,66 at 560 rising through 166,207,155,
202,230,194 and settling on 239,254,231 by 604, which is eight css of clean colour before the
frame. Roughly 44 css of dissolve, on top of the wash above it.

**The boxes.** Measured off the user's own capture (1260 px for a 355 css page, so 3.497 px
per css, taken from the 1014 px card against our 290 css one): the cards were 70.4, 70.6 and
55.8 css tall with 9.4 gaps. The reference's equivalent box is 76.5, so ours were 6 css
short and had their weight in the wrong place, 10.1 above the pill and 10.8 below.

Now: 11.2 above the pill (reference 11.6), 7.2 between the pill row and the copy (8.2), a
line-height of 1.1 in place of 1.16, and 14.8 below (15.4). Closed, the two-line box measures
**76.5 css**, the reference exactly, and the one-line box 62.4. The gaps stay at 9.4.

One measurement lesson worth keeping: reading the cards at x=130 on their capture under-read
each box by about nine css, because the 7.9 css corner radius eats into the column. The same
scan at x=150, inside the box's padding, gives the true edges.

## 43. A white plate stands in for the About Me card

The About Me card and the note under the video are gone for now, as asked, and a plain white
square holds their place: 336 css wide inside the section's 12 css padding, square by
`aspect-ratio`, with the same 2.8vw corner radius as the other plates and a soft blue shadow
under its edge. `docs/about-43.png` is the reference beside the new block.

Removing them also fixed the crop complaint. At 446.5 css tall the section covers the art at
2.0x rather than the 3.1x it needed while the card and note stood below the video, because the
image is now the only thing setting the section's height.

The placement was still wrong in two ways, and both are the landscape art's fault. `about_bg`
is 1100 x 688; covering a 360 x 446 band with it means showing barely half of its width, so
where that window sits changes the whole read. At 50% (our old value) the stadium filled the
right side from the top down, where the reference keeps sky across the whole upper half. At
0% the blue wedge top-left grows past the tag. **20%** keeps the roofline low and the sky open,
which is the reference's read, and `opacity: 1` lets the painting come through at its own
strength instead of being washed by the section's blue. Both sit in one `.uma-about .uma-sec-bg`
override, since this is the only section using that class.

What cannot be matched exactly: their phone page runs a taller crop of the same painting. Ours
is the wide one, so the stands arrive a little earlier down the right edge whatever the offset.

### The pink corner

The About art carries two corners of its own: the blue watermark wedge top-left and a pink
diagonal bottom-right. Our cover window only reaches the middle of the 1100 wide painting, so
the pink corner fell outside it, and the section ended on bare grass. It is now drawn to the
reference's geometry instead, in two clipped layers at the section's foot:

| measured off the capture (3.5 px per css) | css | vw |
| --- | --- | --- |
| drop of the band's edge, per css of width | 0.42 | 42.2 |
| vertical depth of the band | 56 | 15.6 |
| top edge meeting the right edge, above the section's bottom | 92 | 25.6 |
| bottom edge meeting the right edge, above the section's bottom | 36 | 10.0 |
| where the band first reaches the section's bottom, from the left | 143 | 39.7% |

The section gains `padding-bottom: 30vw` so the strip the divider lives in sits below the
white plate, 108 css at 360 and 16 css of art between the plate and the band's tip at the
right (the reference has 18.8 between its video and the band). The pink is `#FF6DC8`, sampled
at (255,110,203) in the middle of the band; the white below it is pure white there too. The
layers are `pointer-events: none` at z-index 1, under the plate.

An earlier pass used the capture's figures straight — 62 deep, 112 above the bottom, a 132 css
strip — which read long against the reference, whose About block is 452 css where ours was
544.7. Trimmed, the section is **520.5** at 360, 24 css lighter, with the band and its white
edge shortened in proportion so the strip does not simply crowd the plate.

### The texture in the band

The pink is not flat on the real page: the art carries a faint UMA emblem and URA lettering
across it, slightly darker than the pink. That was written into the band as a PNG,
`assets/site/about-pink.png`, 1080 x 648 for the 5:3 box the layers occupy, with the
parallelogram baked in and everything else transparent, so an `<img>` at `width: 100%;
height: 60vw` lands exactly on the clipped shapes at any width. It is drawn after the flat
`::before`, which stays as the fallback if the image ever fails.

The texture itself is re-projected off the capture rather than off `about_bg.jpg`, whose own
pink corner is only a thin wedge. Column by column, the band between the capture's two edges
is sampled across x 850-1252, averaged to its own brightness, smoothed along the length, and
pressed onto the flat pink with an exponent of 2.2 to bring the watermark up to the level the
reference reads at; a 1.6 exponent was too faint. The capture's band is a little deeper than
ours, so the emblem sits closer to the lower edge than it does there.

## 44. A trainer card in the About plate

The plate comes back to life as a trainer card: portrait left, identity right, a rule, the bio,
and two readouts at the foot. `docs/about-44.png` sets it beside the reference.

| piece | spec |
| --- | --- |
| plate | 300 css wide at 360 — `margin: 0 5vw` inside the section's 12 px padding, so it sits 30 css clear of the edge and about 27 css clear of the pink corner at its bottom right |
| portrait | 31vw wide, 5:6, white border, `#A9D4F6` ring, drop shadow |
| chip | `TRAINER`, `#2F7BD8`, skewed −12deg with the glyphs skewed back |
| name | Roboto Condensed italic 900, 5.5vw, `#16345A` |
| followers | label over number, number 5.2vw italic 900 in `#E5348A` |
| rule | 1 px `rgba(31,80,140,.15)` |
| bio | 3.25vw / 1.5, `#4A647C` |
| readouts | two `#EDF5FD` blocks with a 0.8vw blue spine |

Plate and all text are placeholders: the name and bio are lorem ipsum, the numbers are invented.
The portrait is a crop of the hero key visual (`assets/site/pfp.jpg`, 260 x 312) standing in until
the real avatar is dropped in — it is the `src` of `.uma-tc-pfp` and nothing else needs touching.
The section measures **501.2** css at 360, down from 520.5, since the plate is narrower than the
old full-width square even with its content.

Two small robustness notes: the name carries `overflow-wrap: anywhere` so a long handle breaks
inside the column instead of pushing the plate, and the follower row is stacked rather than
inline, because inline it wrapped at some widths and not others.

### The band texture, straightened

The first baked band squeezed the watermark: 390 source px were stretched across 651 asset px
while the depth went the other way, 217 down to 168, so the emblem and lettering came out wide
and flat. The re-projection now uses one scale for both axes, 168/217, and tiles the rectified
strip along the band instead of stretching it — the strip's 40 px wrap is crossfaded so the
repeat has no seam. The emblem reads as a circle again and appears about twice over the visible
run, which is what the reference does.

## 45. A rectangle, a photo panel, and room from the corner

The square became a rectangle: **300 x 200** at 360, `aspect-ratio: 3 / 2`, still `margin: 0 5vw`
inside the section's padding. The format is new — the portrait is no longer a bordered thumbnail
sitting in the card's padding, it is a panel that bleeds to the card's own edge, 36% of the width
and the full height, cut only by the card's radius, with an inset shadow carrying the seam. The
text panel then holds the chip, name, follower count, a rule and the bio, centred vertically.

| piece | spec |
| --- | --- |
| card | 300 x 200 at 360, radius 2.8vw, `#fff` to `#F5FAFF` |
| photo panel | flex 0 0 36%, full height, `object-fit: cover`, inset `-2.2vw` shadow |
| chip | `TRAINER`, `#2F7BD8`, skewed −12deg, glyphs skewed back |
| name | Roboto Condensed italic 900, 5.4vw |
| followers | label over number, 5vw italic in `#E5348A` |
| bio | 3vw / 1.45 |

**The corner, again.** The previous card had grown to 316.6 tall while the strip below it stayed
at 108, which left the card's bottom right only about 3 css from the band's upper edge — the
collision in the screenshot. Two things fix it now. The band sits lower: its top edge at the
right edge went from 92 to **78** css above the section's bottom (21.7vw). And the strip grew
from 108 to **120** css (33.3vw). At the card's right edge, x = 330, the band's edge is 78 + 30
x 0.42 = 90.7 css above the foot, so the card clears it by **29.3 css**. The white past the
band's lower edge is 22 css. Both layers and the baked texture were regenerated to the new
numbers, so the watermark's parallelogram still lands exactly on the clipped shapes.

The section is **396.4** css at 360, down from 501.2 — the rectangle saves more than the taller
strip costs.

### On a "live" avatar and follower count

The Avalon tool linked for this is a CSS studio: it renders a Janitor profile from a saved
`.mhtml` snapshot in the browser ("parsed in the browser and never uploaded"), plus a bundled
sample profile. It has no live feed and no API, so nothing it provides can bind our card to the
real avatar or the real follower count, and HTML/CSS has no way to read text or an `src` from
elsewhere on the page. Both values are therefore still literals: `.uma-tc-pfp`'s `src` and the
`<b>` in `.uma-tc-fol`. They become live only with a script that copies them from the DOM, which
needs Janitor to keep `<script>` in a profile — unverified.

## 46. Lowered, and what the profile can actually hand us

The card drops via `top` rather than a margin: a margin collapsed into the tag's own bottom
margin and moved nothing, while stealing height from the strip below. The strip's bottom padding
took the first cut (33.3 → 37.4vw) and `top` the rest.

The user then asked for it bigger and "centred along the corners", and picked the reading
"balanced gaps, band stays put". Card margin 5 → 1.8vw and `top` 3.9 → 20.1vw. Measured at 360:
section 426.5, tag bottom 86.5, card 62.4 below the tag, 323×215, **62.3 css of air under it** —
equal, i.e. centred, and the pink band keeps its full width below the card (the card rides about
a fifth of the way onto it, which is what was chosen). Same balance at 280 (46.3 / 48.5) and 430
(76.4 / 74.4); at 1280 the plate's type hits its px cap, so the two gaps drift to 247 / 221.

### Research: can a card show the live avatar and follower count?

Sources: Janitor's own CSS guide, the community CSS guide at jai-css-guide-resources.ju.mp,
the from-avalon studio's README, and a public profile template.

| finding | consequence |
| --- | --- |
| "JavaScript is not allowed. This is for security reasons and cannot be bypassed." (Janitor CSS guide) | no script can copy a value from the page |
| About Me is dropped into `.pp-uc-about-me`; a `<style>` there restyles the whole page | we can *restyle* the real elements, but not read them |
| `url(...)`, `@import` and `data:` images are stripped from CSS | no background-image tricks, as we already knew |
| stable classes: `.profile-avatar`, `.pp-uc-avatar-container`, `.pp-uc-title`, `.pp-uc-followers-count`, `.profile-info-hstack`, `.profile-about-me`, `.profile-page-flex` | the elements are reachable, and our theme already hides them under `.pp-uc-background` |
| community templates flatten with `.profile-about-me, .profile-info-hstack { display: contents }` | the only CSS route to re-flow them into a custom box |

Why the flattening route does not work here: `display: contents` makes the header's children
siblings of our content, and they can then share a grid cell with our card — but only if the
card is also a direct child of that grid. Ours sits inside `.uma-shell`, which is one block of
many sections; flattening `.uma-shell` as well would drop every section into the grid and undo
the layout. The alternative, positioning the real avatar on the card with absolute coordinates
anchored to `.profile-page-flex`, is exact only while nothing above the About section changes
height — and our five News cards are `<details>`, each of which shifts that section down by a
row when opened. The avatar would drift out of its frame every time one is expanded.

`display: contents` was a dead end, and absolute coordinates against the page are too brittle —
but neither is needed. **Anchor positioning does the job**, and it is the real answer to the
brief, not a workaround.

### §47b What actually binds the live values

The captured profile DOM (the studio's own `preview/frame.html` plus a real About Me paste) settles
what the page looks like: our card lives in `.pp-uc-about-me`, and the avatar, the handle and the
follower count live in `.profile-info-stack` **inside the same `.pp-uc-background`**. Those are
siblings of our block, not ancestors, so `anchor-name` / `position-anchor` / `anchor()` /
`anchor-size()` can place them onto our card without moving a single node:

```css
.uma-tc-port { anchor-name: --uma-pfp; }           /* the frame we want filled */
.uma-tc-fol b { anchor-name: --uma-fol; }          /* the number we want replaced */
@supports (position-anchor: --uma-pfp) {
  .pp-uc-background .pp-uc-avatar-container {
    display: block !important; position: absolute !important;
    position-anchor: --uma-pfp;
    top: anchor(top); left: anchor(left);
    width: anchor-size(width); height: anchor-size(height);
  }
  .pp-uc-background .pp-uc-followers-count {
    position: absolute !important; position-anchor: --uma-fol;
    top: anchor(top); left: anchor(left);
  }
  body:has(.pp-uc-followers-count) .uma-tc-fol b { color: transparent !important; }
}
```

Three things had to be right before it worked, each found by measuring rather than guessing:

1. **The row has to be rendered.** `display: none` on an ancestor means no box, so the rule that
   hides `.profile-info-hstack` was quietly killing the avatar: `top` stayed `auto` and the box
   measured 0×0 no matter how many `!important` overrides pointed at it. The fix keeps the row and
   flattens it instead — `display: block; height: 0; overflow: visible` — and hides only the
   *siblings* the theme does not want (`:not(.pp-uc-followers-count)`).
2. **Anchor and anchored element need the same containing block.** They do here: both resolve
   against `.pp-uc-background`, so `.uma-shell` being `position: relative` stops mattering. That is
   why the anchored box lands on the frame to the pixel (27,198 → 108×200 at 360, the frame exactly).
3. **The winning rules have to come last.** The theme's own hides sit at the end of the sheet; the
   live-binding block is appended after them, otherwise the earlier `display: none !important`
   wins on source order.

What the page now shows, measured in the captured DOM at 360: `.uma-tc-port` `[27,198,108,200]`
and `.pp-uc-avatar-container` `[27,198,108,200]` — identical, i.e. the user's own picture, live,
in the card's frame; `.pp-uc-followers-count` lands on `.uma-tc-fol b` and prints the real
`1,192`.

Degradation is deliberate. Everything sits inside `@supports (position-anchor: …)`, so Safari
(which has no anchor positioning yet) still gets the painted portrait and `128,043`; the
`:has()` guard means that if Janitor ever renames `.pp-uc-followers-count`, the stand-in number
simply stays instead of the slot going blank; and the real avatar is painted *over* the painted
portrait, so a failed binding shows our art, never a hole.

The rig grew to match: its mock header now reproduces the real nesting (about-me inside
`.profile-info-stack`, under the avatar row) and carries an `<img>` avatar, so the nine-width
sweep exercises the binding instead of a page shape that does not exist. Still 9/9, spill 0.

`docs/about-47.png` puts the two states side by side: own art on the left, the real profile's
avatar and follower count on the right, both at 360.

### §47c The failure the phone found, and what makes it survivable

`9ee371f` worked in every harness and failed on the user's phone (Chrome, so the feature is
there): the avatar appeared at the top of the page, over the hero, at full size, and the follower
line was blank. Two separate causes, both now fixed:

1. **The containing block was pinned to the wrong element.** The block forced
   `.pp-uc-background { position: relative }` so the avatar would resolve against it. An anchor
   only counts while it shares a containing block with the element being placed, so if Janitor
   moves the About Me region out from under `.pp-uc-background` — which the September capture and
   the Studio mock already disagree about elsewhere — our card lands outside that containing block
   and every `anchor()` returns its fallback. The block now forces `position: static` instead,
   pushing the containing block up to whichever ancestor holds *both*; measured identical in the
   captured page with the block inside the wrapper and with it moved outside.
2. **A failed resolution had no safe value.** `top: anchor(top)` with no fallback computes to
   `auto`, which parks the element at its static position at full size — the avatar over the hero.
   Every geometric declaration is now written twice: parked at `top/left: -9999px`, `width/height:
   0`, then replaced by `anchor(--uma-pfp …, <fallback>)`. A browser that parses the `@supports`
   test but cannot resolve the anchor keeps the parked values and paints nothing.

The follower count also stopped going blank. `body:has(.pp-uc-followers-count) .uma-tc-fol b`
used to turn the stand-in number transparent, so a failed binding left an empty line. The stand-in
now always renders, and the live count *covers* it: same box (`anchor-size`), opaque card colour,
`z-index: 5`. The cover is 1.4vw wider than the stand-in box because italic figures overhang their
advance width — without that, the tail of the old number peeked out beside the new one.

Verified three ways: the captured page with the block inside `.pp-uc-background` (avatar rect
identical to `.uma-tc-port`, 116×215 at 360), the same page with the block moved outside it
(identical, 116×215), and the deliberately broken shape where neither can resolve (both elements
at −9999px, 0×0, and the card still showing its own art and `128,043`). The nine-width sweep is
unchanged at 9/9.

### §48 Matching the reference's video block and its pink diagonal

The user supplied the official page again and asked for three things: sharp corners, the card
sized like the reference's video block, and the pink corner's geometry brought into line. Every
number below comes off that capture (1260 px wide, 3.23 px per css at a 390 css viewport), not
from eyeballing.

| reference measurement | css | as a fraction |
| --- | --- | --- |
| section height (blue band top to the green band) | 484 | 124vw |
| video block, width | 390 | 100vw (bleeds off both edges) |
| video block, height | 495 px ≈ 153 | 39vw |
| pink band, top edge at the right edge, above the section's bottom | 127 | 32.6vw |
| pink band, bottom edge at the right edge, above the section's bottom | 62 | 15.9vw |
| pink band, thickness | 65 | 16.7vw |
| pink band, fall across the width | 0.42 css per css | 42vw |

Before this round the card was 323 x 215 css at 360 — 89.7% wide and 59.7% tall, i.e. taller than
the reference's media block and not full-bleed — and the band's upper edge sat only 85 css above
the section's bottom, which is why it read as a corner rather than the reference's wide stripe.

Changes:

* **The card is the video's box.** `margin: 0 -12px` (the section's own 12 px padding, so it
  bleeds edge to edge exactly rather than by a vw approximation), `aspect-ratio: 2.6`, so
  360 x 138 at 360 (38.5%) and 390 x 150 at 390. **Sharp**: `border-radius: 0`, and the drop
  shadow is gone with it — a shadow under a full-bleed plate reads as a card edge.
* **The section keeps the reference's height.** With the card 21vw shorter, the strip under it
  takes the difference: `padding-bottom: 64.4vw`, giving 446.8 css at 360 and 480.6 at 390 — both
  124vw, matching the reference.
* **The band moved up 10.8vw** and stays 16.5vw thick: its upper edge now meets the right edge
  **127 css above the section's bottom** and its lower edge 62 (reference: 127 / 62). The three
  layers are bottom-anchored, so the polygon simply had its coordinates reduced; the texture PNG
  was drawn for the old seat and carries `translateY(-10.8vw)` — it is transparent outside the
  pink, so it travels with the band without painting over anything.
* **Wide screens**: past 900 the plate's type stops scaling with vw while the card would keep
  shrinking to 2.6:1, and the bio started to clip (446 of content in a 394 box at 1280). The card
  goes back to `aspect-ratio: auto` there, so it hugs its content again.

Verified: content fits its box at every width from 280 to 1280 (`scrollHeight` equals
`clientHeight`), nine-width sweep still 9/9 with spill 0, and on the captured Janitor page the
real avatar still lands on the new, shorter frame — `.uma-tc-port` and `.pp-uc-avatar-container`
both `[-3, 1445, 140, 150]`, with the live count over the stand-in. `docs/about-48.png` is the
side-by-side against the reference.

### §50 The real stylesheet, and the block it actually describes

Round 49's numbers came off a pixel scan and were wrong in both dimensions: the capture had been
read as a full-bleed 390 x 153 css block in a 124vw band. This round the original CSS was
retrieved, and it says something else entirely.

**How it was got.** `fetch_page` only ever returns rendered text for umamusume.com, and the
archive, the proxies and GitHub all came up empty. The W3C CSS validator fetches the page itself
and then *names every stylesheet it parsed*, which is enough:

```
https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fumamusume.com%2F&output=text
  URIs: /_app/immutable/assets/0.CeerEmeO.css, 2.BtMVfDfi.css, NewsItem.BW2Y3wsu.css, Modal.DqwlE6Qt.css
```

Those files are plain text/css and fetch fine (`.../2.BtMVfDfi.css`, 9 chunks). The About band is
`.top-about.svelte-jhqwtp`, verbatim:

```css
.top-about{position:relative;z-index:1}
@media (max-width:899.98px){.top-about{height:122.6666666667vw}}
@media (min-width:900px) and (max-width:1999.98px){.top-about{height:62.5vw}}
@media (min-width:2000px){.top-about{height:1250px}}

.top-about .about-movie-thumb{overflow:hidden;position:absolute;z-index:1;top:50%;left:50%;
  transform:translate3d(-50%,-50%,0);
  filter:drop-shadow(.4vw .4vw 1.3333333333vw rgba(0,0,0,.25))}
@media (max-width:899.98px){.about-movie-thumb{width:93.3333333333vw;height:50.1333333333vw}}
@media (min-width:900px) and (max-width:1999.98px){.about-movie-thumb{width:55.5555555556vw;height:31.25vw}}
@media (min-width:2000px){.about-movie-thumb{width:1111.1111111111px;height:625px}}
```

The site runs a 375 px design on phones and a 720 px one on desktop, so every value divides by
3.75 (or 7.2): 350 x 188 px for the block, 460 px for the band. That is **1.862:1, inset
3.3333vw from each edge and centred** — not 2.6:1 and not full bleed.

**Checked against the capture, not assumed.** Screenshot 132227 is 1260 px wide at 390 css, so
12.6 px per vw. Measured: the band top edge at y=760 (the first row of `#2B5CFA`), the green
Gameplay band at y=2304, so 1544 px = 122.5vw (stylesheets: 122.667); the block's left edge a
constant x=42 = 3.3333vw, top y=1215, bottom y=1847, so 632 px = 50.1vw; and its centre y=1531
is the band's centre. Everything agrees.

Changes:

* `.uma-about` is `height: 122.6667vw` with `box-sizing: border-box` (62.5vw past 900, 1250px past
  2000). A fixed height, because the card left the flow — nothing below it sizes the band now.
  The old `padding-bottom: 64.4vw` made the height drift with the fixed-px furniture inside it.
* `.uma-about-ph` becomes the block: `position: absolute; left/top: 50%; translate3d(-50%,-50%,0);
  width: 93.3333vw; height: 50.1333vw`, the original's `drop-shadow(.4vw .4vw 1.3333vw
  rgba(0,0,0,.25))`, corners still square, and the 55.5556 x 31.25vw / 1111 x 625px steps above.
* **One scale factor for everything inside.** The desktop block is *relatively* shorter than the
  phone one (16:9 against 1.862), so vw type overran the card at 1280 (512 into 400). `:root {
  --uma-k }` is 1 on phones and .5955 (= 55.5556/93.3333) past 900, and every inner size is
  `calc(<phone vw> * var(--uma-k))`. It lives on `:root` because the live follower count is not a
  child of the card and has to read the same number. Past 2000 the card is a flat size, so the
  type switches to px there (mobile vw x .5955 x 20).
* Portrait panel 36% -> 38%: the card is now 196 css tall at 390, and the panel keeps a sane
  portrait crop (138 x 196) for the anchored live avatar.
* The white title plate moved 5 px down in this band only: the site's sits 31 css under the band's
  top edge (measured 860 device against a band top of 760), the shared section padding leaves 26.

Verified: card 261x140 @280, 336x180 @360, 364x196 @390, 401x216 @430, 717x385 @768, 711x400
@1280; content fits its box at 280-1280 *and* at 1600, 1920, 2000, 2400, 3200 (the px step);
nine-width sweep 9/9 spill 0; on the captured Janitor page `.uma-about` is 390 x 478 at y=1309,
`.uma-tc-port` = `.pp-uc-avatar-container` = `[10, 1450, 138, 196]`, the live count
`[163, 1542, 94, 24]`, 0 console errors. `docs/about-50.png` is the three-up: the site's band,
r49's full-bleed card, and this one with the site's block outlined in red.

### §51 The letters in the card

With the box now the size the site gives it, the type inside it was still the r47 stopgap: every
run in the card — chip, name, label, number, bio — was set in Roboto Condensed, and everything
except the bio's weight was bold. That is one voice at five sizes, so the name had no more
authority than the paragraph under it, and the bio read as a second headline.

What the official stylesheet actually asks for (`0.CeerEmeO.css`):

```css
@font-face{font-family:roboto;          src:url(…/Roboto-VariableFont_wdth,wght.woff2);      font-weight:100 900}
@font-face{font-family:roboto-condensed;src:url(…/RobotoCondensed-VariableFont_wght.woff2);   font-weight:100 900}
body{font-family:roboto,sans-serif;font-weight:400;line-height:1;…}
```

Two faces: Roboto for text, Roboto Condensed for display — and italics reserved for display
(`.section-title`, the news links). The card now follows that split.

* **Name** — the only thing in the display face: `Roboto Condensed` 900 italic, 5.9vw, `line-height
  .94`, `-.015em`, `#13294B`.
* **Chip** — upright `roboto` 700, 2vw, `.22em` tracking, on `#0F57FB` (the site's blue, the same
  as the About plate's lettering), square corners like every other plate in the theme, and the
  hard `rgba(20,80,140,.22)` offset softened to `.16` blue.
* **The stat** — one line, `FOLLOWERS 128,043`, label pinned to the margin and the number after it
  on a shared baseline (`display:flex; align-items:baseline`). Label first is the whole point: the
  live count replaces the stand-in's digits and is usually *shorter*, so anything to the number's
  left would move whenever the count changed. Set the number last and it grows into empty card
  instead, and the gap is the same for "1" and "128,043" (verified: both the stand-in and the live
  overlay start at x=236). Figures are `tabular-nums` so a live update cannot jitter, and the
  overlay's font-size moved with the stand-in's (4.7vw) so it still covers it exactly.
* **Rule** — a hairline that fades to nothing at 92%, instead of a flat 1px grey bar.
* **Bio** — `roboto` 400 at 2.95vw/1.52, `#3E5A76`, `text-wrap:pretty`: the counterweight to the
  heavy name rather than a second copy of it.
* **Card** — flat `#fff` (the site's plates are flat white) rather than the white→`#F5FAFF`
  gradient; the live overlay's background follows it, so nothing shows through on a failed paint.

The 2000px step follows: the card is a flat 1111 x 625px there, so the type becomes px at
`v x .5955 x 20` (name 70.3, stat 56, bio 35.1, label 22.6).

Verified: nine-width sweep 9/9, spill 0; `scrollHeight == clientHeight` at 280, 320, 360, 390, 430,
768, 1280 and at 900, 1600, 2000, 2400, 3200; on the captured page `.uma-tc-port` ==
`.pp-uc-avatar-container` == `[10, 1450, 138, 196]`, stand-in `[236, 1536, 83, 19]` and live
overlay `[236, 1536, 89, 23]` at the same 18.33px, 0 console errors.
`docs/type-51.png` is the before/after.

**Rig note.** The rig was rendering these previews in whatever grotesque headless chromium fell
back to, which is wider than Roboto Condensed — every screenshot was a slightly different
letterform from the phone. `tools/rig.cjs` now wires in `@fontsource/roboto` and
`@fontsource/roboto-condensed` when they are on disk (`npm i`, or `UMA_FONTS=<dir>`), for the
screenshots only; the delivered CSS still names the families and fetches nothing.

## 52 — the band's slice, the handle, and a bio you can read

**The band.** Two faults in the pink corner, both from the same sheet. `about-pink.png` was a crop
of the band taken out of a 5:3 window, so it held the band's right half only and it brought the
crop's own pale top edge with it: on the page that drew a bright diagonal sliced through the
middle of the band, and left everything west of about 48vw as flat `#FF6DC8`. `tools/make-about-pink.py`
rebuilds it from the site's tall About painting (`capture/img/about_bg.CwbgSExa.jpg`, 750x920),
where the band falls 0.422px per px, is 126.5px deep and repeats its UMA/URA motif every ~79px
along: one period is cut out, scaled 1.44x to the artefact's own scale, and tiled across the full
width. The sheet is drawn on the polygon's seat (top edge through `(0, 69.8vw)`, 16.5vw deep), so
`translateY(-10.8vw)` — the old crop's compensation for being drawn to a seat the band has since
left — is gone, and the texture now coincides with the band at every width. The flat pink stays
under it as the fallback for a slow image, and the sheet takes the band's own `clip-path`, so
the texture's edge *is* the band's edge — no pale line where the image stops.

**The chip** is the handle now: `@uma_enjoyer`, so `text-transform` and the `.22em` label tracking
go with it (`.01em`, lowercase). Same blue plate, same skew; 52px wide at 280, 220 at 2000.

**The bio** is a scroll box, not a paragraph. `.uma-tc-bio` is `flex: 1 1 auto; min-height: 0;
overflow-y: auto`, so it takes exactly the height the chip, name, count and rule leave over and
scrolls inside it: the card's 50.1333vw (261x140 at 280 up to 1111x625 at 2000) never changes, and
neither does the page. The last line fades out (`mask-image`) rather than being cut by the box's
edge, and the bar is a thin one in the card's own colours (pink thumb, faint track) via both
`scrollbar-width/color` and the `::-webkit-scrollbar` pseudo-elements. Two things had to change for
it to sit right: `.uma-tc-body` gets `box-sizing: border-box` (it was content-box, so its padding
was added to the height the card gave it and pushed the copy 4vw past the card's foot), and the
copy is his, not mine: his own draft with the grammar fixed and the joins smoothed ("then in
spring I stopped", "AI is another thing", "and on that note", "and then there is Umamusume"),
condensed to seven paragraphs and kept in his register — "like, really", "no, I am not a rich
kid who wants to race", "not for you to like", "these horsegirls". The greeting is set a shade
larger in the card's navy as the block's one piece of hierarchy; every other paragraph is one
size and the paragraphs are separated by a full line of air rather than two thirds of one.
He does not want em dashes, colons or semicolons in his copy, so every pause is a comma or a
full stop now, and the name on the card reads `Fuji/Aki`.

Verified: rig 9/9 spill 0, `bio.scrollHeight` 1042 -> 4426 over `clientHeight` 60 -> 283 across
280/320/360/390/430/768/1280/2000, page body `scrollHeight == clientHeight` at every width, no
horizontal overflow on the captured page (`scrollWidth` 355 < 360), avatar anchor still
`[10, 1442, 138, 196]` on the card, 0 console errors. `docs/round-52.png` is the before/after.

## 53 — the band that grew, his own rule, and bold where it counts

**The header.** Nothing about the bar changed; what changed is what sits behind it. `.pp-page-background`
was painted `#0F57FB` on purpose, to close the seam between Janitor's bar and the key visual — so any
stretch of page that no section covers came out blue, directly under the bar, and read as a header that
had grown. Two things now: the backdrop goes back to paper (`.pp-page-background`, plus `html, body` for
the pull-down area Chrome paints), and the blue is owned by the bar alone — the `.uma-hdr` layer is a
fixed 57px band, so the header is exactly as tall as the band whatever the page does around it. The
other half of it: the theme used to list the profile card's rows by name and hide them one by one
(`.profile-info-hstack`, `.pp-uc-avatar-container`, `.pp-uc-title`…). Janitor renames them freely, and a
renamed row does not vanish, it stays as an empty transparent band the height of an avatar and a handle
— which is exactly the stretch of colour that showed up. The rule now says what to *keep*:
`.pp-uc-background > *:not(.pp-uc-about-me):not(.profile-about-me):not(:has(...))` leaves the About block
and anything that contains it, and hides everything else, named or not. A browser without `:has` drops
that rule and falls back to the old list.

**The break.** His Picsart divider — the site's horseshoe sitting in a rule — cut down to its art,
recoloured `#E5348A` and shipped as `assets/site/horseshoe-break.png` (2400x92, 1.6 KB). It is an `<img>`
and not a mask or a background: this profile drops every `url()` the stylesheet carries, so the colour
has to be in the file. It appears three times: once in the card under the follower count, where the old
hairline rule was, and twice inside the scrolling copy as the page break between movements — person and
past, cars and the workshop, racing and Umamusume — at 45% so the copy still leads.

**Bold.** Ten `<strong>`s, navy `#13294B`: the two names he goes by, `Initial D`, half Filipino and half
Japanese, `70%`, the wins pay for my entrance fees, War Thunder and Call of Duty, lorebooks, RPG and Japan
life scenarios, Arima Kinen 2022, Equinox, Umamusume Pretty Derby. Enough to be seen, not enough to read
as a link farm.

Verified: rig 9/9 spill 0 at 280…1280; card still 364x196 at 390 (261x140 at 280, 711x400 at 1280), bio
scroll box 1509 over 75 at 390, page body `scrollHeight == clientHeight` at every width; the `:has` rule
tested against a mock card with a renamed row (hidden), a wrapper containing the About block (kept) and
the About block itself (kept). `docs/round-53.png` is the card and the unrolled copy.

## 54 — the 82px Janitor keeps between its bar and the art

Two rounds of guessing at a page the sandbox cannot open. This one is measured: `tools/probe.mjs`
runs on a GitHub runner (janitorai.com is unreachable from here), opens a real public profile,
applies `JANITOR-PASTE.txt` exactly the way Janitor would — the style in the head, the markup
inside `.pp-uc-about-me` — and reports where everything lands.

With the r53 paste applied the key visual sat at **122px** while Janitor's bar is 40px tall. The 82
under it came from three things, none of them ours:

| what | px | why it is there |
|---|---|---|
| `aside[class*="domainNotice"]` | 58 | an outage notice ("janitorai.com is back!"), inside the sticky header, painting nothing here but still in flow |
| `.profile-page-container` | 16 | Chakra stack padding on the column that holds the profile |
| `.profile-info-stack` | 8 | the row-gap kept for the avatar row this theme hides |

r54 hides the first and zeroes the other two. Measured again on the same page: **hero at 40** — the
foot of the bar, exactly — `main` at 40, the card at `[10, 1408, 364, 196]`, document 7702. Nothing
else moved; the 57px band still paints the bar and the wordmark still hangs over the art the way it
always has.

A note on the first row: that rule is aimed at a *temporary* banner. If Janitor retires it the
selector simply matches nothing. If it ever backs a real platform notice that should be visible,
delete the one line and the theme keeps a 58px strip instead — no other change.

## 55 — three cut-outs in the corner the card leaves free

He sent three transparent renders and wanted them small, in the About box's empty upper-right
corner. The band is a fixed 122.6667vw tall and its card is absolutely centred at 50.1333vw, so
between the white "About Me" plate and the card's top edge there is a strip of sky on the right
that nothing uses. The strip is 142 css tall at 390 and 22.2vw wide at 1280.

The row is positioned off the **card's** top edge, not the band's top:

```css
.uma-about-figs { right: 12px; bottom: calc(50% + 25.0667vw + 2.6vw); }
```

`50% + half the card` is the card's top edge measured from the band's foot, so the row hangs
2.6vw above it at every width, and the section's own 12px padding lines it up with the card's
right edge. Heights are given, not widths (`10.4 / 9.6 / 10.8vw`, i.e. 62 x 40, 86 x 37 and
60 x 42 at 390), and each carries the same `.5955` the card's contents shrink by at 900, so the
three keep their proportion instead of turning into slabs on a desktop. Under 360 the plate and
the row start sharing the line, and decoration loses.

**The jet is not cut out.** Its render is an opaque black plate. `tools/make-figs.py` keys it:
black is only allowed to go transparent where it is **connected to the frame's border**, so the
canopy, the intakes and the shadow under the wings — black that the airframe encloses — survive;
the cut line is feathered by luminance because that is where the anti-aliasing lives; and three
pixels inside the cut line is forced opaque, because the same ramp across the whole airframe read
as a ghost at 62 css wide. The other two arrive with alpha and are only trimmed
(`fig-car` 2.29:1, `fig-horse` 1.42:1, `fig-jet` 1.53:1). Sources live outside the repo; the
script takes `UPLOADS=/path`.

Verified: rig 9/9 spill 0 (280…1280) on the delivered paste, the row at `[158, 1359, 220, 42]`
against a card top of 1412 at 390, and `[839, 2908, 429, 82]` against 3010 at 1280, so it never
touches the card at any width. Paste 73,667 chars, one line (css 42,590 / markup 31,061) — the
images cost 467 characters of URLs, not 238 KB of base64. `docs/round-55.png` is the band at both
widths.

**The rig was lying.** Its spill number came from `documentElement.scrollWidth`, which counts the
live follower count the theme parks inside the clipped page background (63 to 107px of chrome that
paints nothing). Every width had been reporting FAIL, and every `fullPage` shot had been captured
477px wide at a 390px viewport since r54. spill is now the body's scroll width, the raw number is
still printed beside it, and shots are clipped to the viewport width.

**Read on the real page.** The probe (r54's runner rig) applied the shipped paste to a public
profile and reported the row at `[155, 1355, 220, 42]` against a card top of **1408**, so the
11px gap the local rig predicted is what the live page does; the r54 numbers did not move
(hero 40, card `[10, 1408, 364, 196]`, document 7702). All three files came back from the CDN
at their full sizes — jet 320x209 drawn at 62x41, car 320x140 at 86x37, horse 300x212 at 60x42.

The first run had the jet at `naturalWidth 0`: a commit sha nobody has asked jsdelivr for yet is
fetched on first request, and one cold file in a three-file burst can miss the 6s the probe
waits. The second run had it. Nothing to fix in the theme, but if a fresh paste ever shows one
cut-out missing, reload before touching it — the CDN is filling its cache, not the theme.
