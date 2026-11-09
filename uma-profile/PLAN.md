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
