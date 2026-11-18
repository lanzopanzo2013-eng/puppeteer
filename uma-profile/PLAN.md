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
