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
