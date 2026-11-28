# HANDOFF 9 — Lorebooks Page 1, Page 2 & Page 3 rebuild

**STATUS — R72 FINAL PAGE 2 & PAGE 3 DESCRIPTIONS (STATIC, CENTERED, NO SCROLL HINT) SHIPPED (2026-11-22, branch `arena/fd37cb2f-puppeteer`)**: replaced the placeholder gibberish on Page 2 (`#g2` / `.s2`) and Page 3 (`#g3` / `.s3`) with the user's final descriptions (`"Interact with a variety of unique Umamusume with the Lorebooks! Chat with it, and you just might learn more about Umamusume!"` and `"Up to 240+ sourced characters to chat with canon realistic personalities—watch them go all out as you tune in to the game's built in live RPG mode."`, stripping the leading `\u200e` LRM mark), removed `.uma-lb-more` and `.uma-lb-hint` from `.s2` and `.s3` (preserving Page 1's scrollable breakdown + `"you can scroll down to see more"` hint intact), and set `.uma-slide.s2 .uma-lb-note-t, .uma-slide.s3 .uma-lb-note-t` to `top: 0; bottom: 0; display: flex; align-items: center; overflow: hidden; touch-action: auto` across mobile & desktop so both static descriptions sit at exact `50.0%` vertical center matching `170209` and `170217` (`spill = 0` across `280px..1280px`, `stress PASS`).

**Previous status — R71 REMOVED BAKED CAROUSEL-BLEED WHITE CORNER ON `lb-bg2.jpg` & `lb-bg3.webp` SHIPPED (2026-11-22, branch `arena/fd37cb2f-puppeteer`)**: live screenshots `Screenshot_20261128-180144.jpg` (Page 2) and `Screenshot_20261128-180152.jpg` (Page 3) showed a small white triangular corner peeking out at the far left edge (`x = 0..3.6%W, y = 77%..82%H`) just above/left of `lb-card.png`'s green bar. Root cause: in `umamusume.com`'s horizontal Splide carousel, the previous slide's white card extends `3.6vw` past `100vw` (`right_top = 103.6vw`), so that overhanging right corner had been captured onto the left edge of `lb-bg2.jpg` (`x = 0..180, y = 7379..7864`) and `lb-bg3.webp` (`x = 0..73, y = 3355..3552`). Reconstructed both triangular patches + drop-shadow halos via 2D Laplace harmonic diffusion (`∇²u = 0` with Neumann `∂u/∂x = 0` at `x = 0`), committed & pushed the cleaned backgrounds (`d03270c4cac4227ecf0a47dccd88702241ddcbf9`), and rebuilt `JANITOR-PASTE.txt` (`spill = 0` across `280px..1280px`, `stress PASS`).

**Previous status — R70 LOREBOOKS PAGE 2 (`#g2`) & PAGE 3 (`#g3`) REBUILD SHIPPED (2026-11-22, branch `arena/fd37cb2f-puppeteer`)**: built full Lorebooks Page 2 and Page 3 matching official `umamusume.com` mobile Gameplay Slide 2 (`Screenshot_20261128-170209.jpg`) and Slide 3 (`Screenshot_20261128-170217.jpg`) grounded in Cygames' official `.top-gameplay.svelte-1hrm36a` CSS (`2.9r6p6YF7.css`) and `420@3x` (`1260px`) sub-pixel measurements:
1. **Committed & pinned 8 Page 2 & Page 3 artwork assets (`596228be57ffaae20d6522e4a3d42c1fe79c6e7d`)**:
   - Page 2: `lb-p2-suzuka.png` (`750×900` RGBA Silence Suzuka), `lb-p2-headline.png` (`2170×725` RGBA `"Forge lasting memories and experiences with the lorebooks!"`), `lb-p2-left.jpg` (`1140×2043` `4:4:4` q92), `lb-p2-right.jpg` (`1154×2048` `4:4:4` q92).
   - Page 3: `lb-p3-ticket.png` (`750×900` RGBA Winning Ticket, bottom-padded +2px from `750×898` to match exact `100vw×120vw` canvas), `lb-p3-headline.png` (`2078×316` RGBA `"And chat now!"`, with `3,308` royal-blue background-cutout remnant pixels cleaned and trimmed to symmetric `20px` transparent padding), `lb-p3-left.jpg` (`1146×2048` `4:4:4` q92), `lb-p3-right.jpg` (`1152×2047` `4:4:4` q92).
2. **Per-page character + headline layers (`.uma-hl.h1` / `.h2` / `.h3`) & official seat calibration**:
   - Both `lb-p2-suzuka.png` and `lb-p3-ticket.png` share Cygames' official `.-umamusume` seat (`top: -0.5333vw; left: 4vw; height: 120vw !important`), verified against `170209` (`MAD = 8.54 / 255`) and `170217` (`MAD = 8.48 / 255`).
   - Following official `.-left-contents { bottom: 47.4667vw }` + `.-images-list { margin-top: 3.2vw }` (anchoring visible headline bottom at `~65.1..65.4vw` across 1-line and 3-line headlines):
     - Page 2 `.uma-hl.h2 img.uma-lb-hl-img`: `top: 37.3vw; left: .27vw; width: 99vw !important; height: 34.4vw !important` → visible ink `x = 2.64..97.35vw, y = 41.67..65.30vw` vs `170209` `x = 2.54..97.22vw, y = 41.41..65.38vw`.
     - Page 3 `.uma-hl.h3 img.uma-lb-hl-img`: `top: 53.4vw; left: 8.85vw; width: 82.3vw !important; height: 12.51vw !important` → visible ink `x = 9.64..90.32vw, y = 54.19..65.08vw` vs `170217` `x = 9.60..90.24vw, y = 54.75..65.14vw`.
   - Desktop `>=900px`: `min-height: 92px; display: inline-flex; align-items: flex-end` on `.uma-hl` with `92px` 3-line `h2` / `36px` 1-line `h1,h3` keeps `.uma-play` at an exact constant `1037px` height across all 3 pages (`0px` layout shift). Added `scroll-margin-top: 57px` on `.uma-anchor` so `<` / `>` taps frame `.uma-play` flush beneath `.uma-hdr`.
3. **Captures + `lb-card.png` + scrollable placeholder gibberish on `.s2` & `.s3`**: populated `.s2` and `.s3` with `.uma-lb-shots` (`l` + `r`) and `.uma-lb-note` (`lb-card.png` + 3-line `.uma-lb-lead` + scrollable `.uma-lb-more` placeholder gibberish without `:` or `;` + one-shot `.uma-lb-hint`), verified `spill = 0` across `280px..1280px` on `#g1`, `#g2`, and `#g3`, `stress PASS`, and side-by-side parity against `170209` and `170217`.

**Previous status — R69 REPEATING SPLASH GIF WITH 1S WHITE PAUSE + EXACT 1.41S CURTAIN SWIPE SHIPPED (2026-11-22, branch `arena/fd37cb2f-puppeteer`)**: updated the splash screen per live feedback:
1. **Repeating `splash-loading.gif` with `1.00s` (`1000ms`) pure-white pause before repeating (`4a7b432616bef9cacfbb4118f58329f3f664d92f`)**: kept `NETSCAPE2.0` (`loop = 0`) intact so Chrome/SPA re-mounts never cache a dead ended GIF, while appending pure `#ffffff` Frame `#42` with `delay = 100 cs` (`1,000ms` = `1.00s`) after the `1,410ms` (`1.41s`) active animation (`2,410ms` total cycle; verified in Chromium: `ink_pixels = 5112` at `800ms`, `0` at `1850ms` during the `1s` pause, `5176` at `3100ms` on Loop #2).
2. **Exact `1.41s` white left-swipe start**: updated `.uma-splash` `animation` from `.55s 1.65s` to `.55s 1.41s cubic-bezier(.77, 0, .175, 1) forwards`, so the white background starts swiping left at `1.41s` (the exact active length of the GIF) and finishes hiding at `1.96s` — cleanly inside the `1.41s..2.41s` white pause window (`spill = 0` across `280px..1280px`, `stress PASS`).

**Previous status — R68 ONE-SHOT SPLASH SCREEN (`#loading` / `161636` PARITY) SHIPPED (2026-11-22, branch `arena/fd37cb2f-puppeteer`)**: built the full-viewport opening splash screen before moving to Lorebooks Page 2:
1. **Lossless single-play `splash-loading.gif` (`8d0dc304856446c7543f2a71b5d760b601e0ae0f`)**: performed lossless GIF89a binary surgery on `umamusume-loading.gif` (`498×498`, 42 frames, `1.41s`), stripping the 19-byte `NETSCAPE2.0` infinite-loop extension (`0` pixel diffs across all 42 original frames), setting GCT background index to `255` (`#ffffff`), and appending a pure `#ffffff` Frame `#42` so the GIF plays strictly once, clears Frame `#41`'s faint `RGB 233` remnant, and stops permanently on spotless `#ffffff` (`0` non-white pixels verified at `1.6s`, `2.2s`, `2.9s` in Chromium).
2. **Exact `161636` mobile & official desktop calibration (`.uma-splash` + `.uma-splash-gif`)**: fixed full-screen white curtain (`position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; height: 100dvh; z-index: 2147483647 !important; background: #fff; box-shadow: 0 20vh 0 0 #fff; pointer-events: none !important`, with `.pp-top-bar-notifications` lowered to `z-index: 2147483646 !important` so zero header/badge pixels bleed through during loading). Sized `.uma-splash .uma-splash-gif` to `width: 66.2vw !important; height: auto !important; margin: 7.7vw 0 0 -0.8vw !important` on mobile (`25.86vw` at `>=900px`, `517px` at `>=2000px`, matching Cygames' `#loading` breakpoints). Verified at `420@3x` (`1260×2346` viewport) vs `161636`: `x = 465..794` vs `465..795` (`0–1px` parity) and `"Now Loading..."` bottom `y = 1405` vs `1405` (`0px` parity).
3. **Left-shift exit (`@keyframes uma-splash-out`)**: right after the `1.41s` GIF finishes (`1.65s` delay covering cold CDN fetch), `.uma-splash` shifts the entire white background off the left side (`transform: translate3d(-100%, 0, 0)`) over `.55s` along Cygames' exact `cubic-bezier(.77, 0, .175, 1)` curve (`forwards`), flipping `visibility: hidden` at `100%` (`spill = 0` across `280px..1280px`, `stress PASS`).

**Previous status — R67 EXACT VERTICAL TEXT SEAT PARITY WITH 141322 SHIPPED (2026-11-22, branch `arena/fd37cb2f-puppeteer`)**: comparing live `141337` against official `141322` (`378px` = `30.00vw` panel at `1260px`), `141337`'s lead text sat `31px` (`2.46vw`) too high (`Top pad = 73px / 5.79vw, Center = 41.0%` vs `141322`'s `Top pad = 104px / 8.25vw, Bot pad = 107px / 8.49vw, Center = 49.5%`) because `.uma-lb-note-t` had `top: 4.8vw`. Lowered `.uma-lb-note-t` to `top: 7.52vw; bottom: 1.4vw` on mobile (`top: 26.5%; bottom: 6%` on `>=900px`) and dropped `.uma-lb-more::before` (no longer needed now that live `141337` confirmed anonymous `animation-timeline: scroll()` + `color: inherit` `999999s` latch works on live JanitorAI). Verified at `420@3x` (`1260px`) vs `141322`: `Top pad = 104px (8.25vw)`, `Bot pad = 108px (8.57vw)`, `Center = 49.5%` (`0px` / `0.0%` parity with `141322`), with `"you can scroll down to see more"` seated cleanly below Paragraph 1 (`rgba(110,110,115,.55)` → `rgba(0,0,0,0)` permanently after first scroll).

**Previous status — R66 SANITIZER-PROOF SCROLL HINT FIX SHIPPED (2026-11-22, branch `arena/fd37cb2f-puppeteer`)**: live JanitorAI testing showed `ef8a715`'s `.uma-lb-hint` did not disappear on scroll because JanitorAI's editor sanitizer strips custom `--*` timeline identifiers (`timeline-scope: --uma-lb-scr` / `scroll-timeline: --uma-lb-scr`), leaving an external `position:absolute` sibling completely static. Rebuilt `.uma-lb-hint` inside `.uma-lb-note-t` with a 3-layer sanitizer-proof architecture (zero `--*` custom idents):
1. **Pure CSS2/CSS3 geometric cover (cannot be stripped)**: moved `.uma-lb-hint` inside `.uma-lb-note-t` (`position: sticky; bottom: .2vw; z-index: 1`) behind `.uma-lb-more` (`position: relative; z-index: 3`, `::before` `linear-gradient(110.5deg, #fff 48%, #f9f9f9 52%)` over the middle `15%..85%` matching `lb-card.png` while preserving both side horseshoe watermarks). Scrolling down immediately slides `.uma-lb-more` over `.uma-lb-hint` even if all CSS4 animation-timeline rules are stripped.
2. **Pure CSS3 `:hover` / `:active` one-way latch**: `.uma-lb-more:hover + .uma-lb-hint, .uma-lb-more:active + .uma-lb-hint` sets `opacity: 0; transition: opacity 0s linear 0s` against base `transition: opacity .2s ease 999999s` (`san-1.png`: `4,450` hint pixels → `san-3.png` after scrolling & returning to `scrollTop = 0` with `animation-timeline` stripped: `0` hint pixels).
3. **Zero-`--*` `animation-timeline: scroll()` + `color: inherit` `999999s` latch**: because `.uma-lb-hint` is now a direct child of `.uma-lb-note-t`, anonymous `scroll()` binds directly to `.uma-lb-note-t` with zero custom `--*` names, latching `span` `color` to `rgba(0,0,0,0)` on pure touch flicks too.

**Previous status — R65 ONE-SHOT PURE-CSS SCROLL HINT SHIPPED (2026-11-22, branch `arena/fd37cb2f-puppeteer`)**: added `"you can scroll down to see more"` below the description text in 45% transparent gray (`rgba(110, 110, 115, .55)`), built as a **pure-CSS, JanitorAI-safe one-shot scroll latch** (zero JS, zero `<input>`, zero `@property`, zero `@container`, zero `var()`):
- `.uma-lb-note` sets `timeline-scope: --uma-lb-scr` and `.uma-lb-note-t` sets `scroll-timeline: --uma-lb-scr block`.
- `.uma-lb-hint` sits below `.uma-lb-note-t` (`bottom: 1.7vw` on mobile, `bottom: 6.5%` on `>=900px`) with `color: rgba(110, 110, 115, .55)` and `animation: uma-lb-hide linear` (`animation-range: 3px 100%`, `animation-duration: auto !important`) driving `color: rgba(110,110,115,0); opacity: 0` as soon as `scrollTop >= 3px`.
- Inner `.uma-lb-hint span` uses `color: inherit; transition: color .2s linear 999999s`: while the scroll animation is active (`scrollTop >= 3px`), animation tainting jumps `span`'s inherited color immediately to `rgba(0,0,0,0)`; when scrolled back to `scrollTop = 0`, leaving `animation-range` untaints `color` and triggers the `999,999s` (`11.5-day`) `transition-delay`, holding `span` permanently invisible (`0` ink pixels verified by PIL even after returning to `scrollTop = 0`, under both `prefers-reduced-motion: no-preference` and `reduce`, mobile `420@3x` and desktop `1280@1x`).

**Previous status — R64 PUNCTUATION CLEANUP + WIDER RIGHT MEASURE + SHORTER NOTE TYPE + BETA → B.E15 SHIPPED (2026-11-22, branch `arena/fd37cb2f-puppeteer`)**: shipped all four refinements requested by the user:
1. **Removed all `:` and `;`** from the 8 Lorebooks description paragraphs (`hasColon=false, hasSemicolon=false`), replacing semicolons/em-dash with clean conjunctions while preserving the user's wording.
2. **Extended `.uma-lb-note-t` rightward** (`left:20.29vw; width:75.2vw` inside `.uma-lb-note`, spanning `band 16.80..91.99vw` vs prior `17.03..86.37vw`, `+5.62vw` / `+71px` more right-side space at `1260px` while staying cleanly inside the slanted white edge; desktop `left:12.5%; right:5%` → `491px` vs `464px`).
3. **Made description text height a tiny bit shorter**: `font-size:3.58vw; line-height:1.37` (`-4.1%` from `3.7333vw` / `1.4`; desktop `min(1.46vw,29.2px)`) and `top:5.4vw; bottom:5.4vw` (`boxH=81px`, `p1H=62px`, `p2Top=82px` on `420px`; `boxH=93px, p1H=77px, p2Top=102px` on `1280px`, `scrollbarGutter=0`).
4. **In the Works (`#updates`)**: updated `"BETA -> FV14"` (`BETA &#8594; FV14`) to `"BETA → B.E15"` (`BETA &#8594; B.E15`).

**Previous status — R63 TIGHTER/WIDER GREEN-TAG LETTERING + FULL 8-PARAGRAPH FLAGSHIP DESCRIPTION SHIPPED (2026-11-22, branch `arena/fd37cb2f-puppeteer`)**: the user asked to tighten `"The Lorebooks"` spacing while widening the glyphs a tiny amount, and provided the real opening callout + 7 scrollable flagship description paragraphs (`L.E11`, `S.E12`, `E.E13`, `D.E14`, `B.E15`, provisional `Q1/Q2 2027` note) with light grammar cleanup. Shipped:

1. **`"The Lorebooks"` green bar tracking & glyph width**: tightened `.uma-play > .uma-tag-wrap .uma-tag` from `letter-spacing:.05em` to `letter-spacing:.005em; word-spacing:-.04em` and set `span` `transform: skew(15deg) scaleX(1.065)` (matrix product `skew(-15deg)·skew(15deg)·scaleX(1.065) = scaleX(1.065)` in screen space — pure `+6.5%` horizontal glyph widening with zero residual skew), applied on both mobile (`<900px`) and desktop (`>=900px`). At `420@3x` (`1260px`), the bar sits at `x=35..777` (`58.90vw` wide, symmetric `~80px / ~90px` inner green padding around the text and wide clearance before Special Week's head).
2. **8-paragraph scrollable description (`.uma-lb-note-t`)**: placed the opening callout (`"Test @uma_enjoyer's created Lorebooks..."`) followed by all 7 flagship/provisional paragraphs with light grammar/spelling/capitalization fixes preserving the user's wording. Seated `.uma-lb-note-t` at `top:4.4vw; bottom:4.4vw` on mobile (`top:21%; bottom:21%` on `>=900px`) with `.uma-lb-note-t p { margin:0 0 .85em }` so Paragraph 1 (`88px` inside `89px` viewport on `420px`) fills the initial card view cleanly with zero half-cut lines at `scrollTop=0`, and scrolling reveals Paragraphs 2–8 (`scrollHeight=1586px`, `maxScroll=1497px`, `scrollbarGutter=0`).

**Previous status — R62 OFFICIAL GREEN-TAG TYPE SCALE + SCROLLABLE NO-SCROLLBAR DESCRIPTION SHIPPED (2026-11-22, branch `arena/fd37cb2f-puppeteer`)**: after reviewing live `100828`, the user asked to (1) enlarge `"The Lorebooks"` text inside the green bar to match `"Gameplay"` in `123836`, and (2) replace the description with long placeholder gibberish that scrolls vertically with no visible scrollbar. Diagnosis & fixes:

1. **`"The Lorebooks"` green bar (`section-title` parity)**: `@media (max-width: 575.98px) { .uma-tag { font-size: 23px; padding: 8px 26px 9px; } }` (line 1578) was shrinking `.uma-tag` inside `.uma-play` from the official `7.4667vw` down to `23px` while adding an extra `26px` horizontal padding onto the plate. Scoped `.uma-play > .uma-tag-wrap .uma-tag` (`(0,3,0)`) to the exact `capture/css/2.BtMVfDfi.css` `.section-title` values (`height:9.6vw; padding:0; font-size:7.4667vw; letter-spacing:.05em`, `span` `padding:0 6.9333vw 0 6.1333vw`; desktop `>=900px` `height:min(4.1667vw,83px); font-size:min(3.0556vw,61px)`). Verified at `420@3x` (`1260px`) vs `123836`: text left `x=136` vs `139`, cap/ascender height `71px` (`5.63vw`) vs `"G"` `68px` (`5.40vw`), plate `x=35..834` (`43px` narrower than `100828`'s double-padded `877px` bar while text is `+36.3%` larger).
2. **Scrollable description with hidden scrollbar (`.uma-lb-note-t`)**: bounded `.uma-lb-note-t` cleanly inside the white panel (`top:5vw; bottom:5vw; left:55.19vw; transform:translateX(-50%); width:69.3333vw` on mobile; `top:16%; bottom:16%; left:13%; right:9%; display:block` on `>=900px`) with `overflow-y:auto; overflow-x:hidden; overscroll-behavior:contain; -webkit-overflow-scrolling:touch; touch-action:pan-y; scrollbar-width:none; -ms-overflow-style:none` + `.uma-lb-note-t::-webkit-scrollbar { display:none; width:0; height:0 }`, populated with multi-sentence placeholder gibberish (`scrollHeight=373px` vs `clientHeight=84px` on `420px`; `383px` vs `113px` on `1280px`, `scrollbarGutter=0`, `0` scrollbar pixels verified by PIL).

**Previous status — R61 RAW LB-BG1 + EXACT 123836 PANEL SEAT + HEADLINE HEIGHT/BOW CLEARANCE SHIPPED (2026-11-22, branch `arena/fd37cb2f-puppeteer`)**: comparing `094004` (r60 live) against `123836` (official Gameplay reference), the user noted that r59's background paste scars were still visible around the panel, asked to switch `lb-bg1.jpg` back to the raw pre-bake background with a cleanly resized `lb-card.png`, and asked to slightly increase the height of `"Test The Lorebooks!"` (widening it at most a tiny amount) while raising it above Special Week's purple thigh bow. Shipped (`f21c4f4` assets + code):

1. **Raw `lb-bg1.jpg` restored + `lb-card.png` sized to exact `123836` bounds (`f21c4f4`)**: restored `uma-profile/assets/site/lb-bg1.jpg` to the clean pre-bake `e04e0c7` cut (`upscalemedia-transformed (3).jpeg` trimmed to 1:1.92), eliminating the gray seam left of the lime bar and dark navy strip on the right. Without needing r60's smudge-covering `115.48vw` width, resized `Picsart_26-11-21_09-49-36-478.png` (`lb-card.png`) along its pure-white `-0.375` slant to `2700×756` (`107.14vw × 30.00vw`, `28.5 px` `#C0E740` stripe at `1260px`) seated at `top:79.52vw; left:-3.49vw` (`band 148.22..178.22vw`). Verified at `420@3x` (`1260px`) vs `123836`: lime stripe `x=95..122` vs `95..123`, right slanted edge `1259→1164` vs `1259→1165` (1-px parity), left green background RGB within 3–4 units of `123836`, right warm peach background RGB within 3–4 units of `123836`.
2. **`"Test The Lorebooks!"` height + vertical placement above Special Week's purple thigh bow**: `lb-p1-headline.png` (`2560×361`) has `18.8%` top and `14.4%` bottom transparent canvas padding (`y=68..309`), which previously pushed its visible letters+bar down to `58.38..66.80vw` (`8.49vw` tall) over the top of Special Week's purple thigh bow (`66.00..71.87vw`). Updated `.uma-play .uma-hl img.uma-lb-hl-img` (specificity `(0,3,1)`, beating Janitor's `.pp-uc-about-me img { height:auto !important }`) to `top:53.1vw; left:4.5vw; width:92.5vw !important; height:14.2vw !important`: visible height increases from `8.49vw` (`107 px`) to `9.52vw` (`120 px`, matching `123836`'s `9.37vw` / `118 px`), width increases by only `+2.5vw` (horizontally centered at `49.96vw`), and the lime bar bottom rises from `66.80vw` to `65.13vw` (`123836`: `65.29vw`, official `.-left-contents` `margin-top:3.2vw` above `68.7vw` captures), completely uncovering Special Week's purple thigh bow (`2,119 px` visible vs `123836`'s `2,150 px`). Desktop `>=900px` (`255×36` headline, `595×167` note) verified intact.

**Previous status — R60 CRISP PICSART PANEL + BIO UPDATE SHIPPED (2026-11-22, branch `arena/fd37cb2f-puppeteer`)**: the user compared `201949` (official) against `201511` (ours), noted the slanted panel/lime bar looked blurred and forced, asked to resize `Picsart_26-11-21_09-49-36-478.png` (`lb-card.png`) without touching the background (`lb-bg1.jpg`), and requested a bio clause change. Diagnosis (`capture/index.html` + pixel measurements at `1260px`):

1. **Root cause of the blur & forced look**: on `umamusume.com`, the slanted description box is a DOM `<div class="-frame"><picture><img>` inside `.-right-contents` (with `filter:drop-shadow(.4vw .4vw 1.3333vw rgba(0,0,0,.25))`), NOT band art. In r59 (`9c8d67f`), `.uma-play .uma-lb-note img` (`lb-card.png`) had been set to `display:none` on mobile so `201511` showed only the r59 JPEG bake in `lb-bg1.jpg` (`c09373f`), which had 7-px feathered top/bottom edges (`y=1404..1410` and `1773..1780`), no bottom drop-shadow, an 8-px soft lime edge, and a `24×60 px` white inpaint bleed (`x=68..94`) left of the lime bar.
2. **Picsart PNG resize (`654084f`, `lb-bg1.jpg` byte-identical `462fa299...`)**: `Picsart_26-11-21_09-49-36-478.png` (`4096×1670`, 2.43:1 PC frame, `-0.375` slant) shares the exact `20.5°` slant and horseshoe/trapezoid artwork as mobile `201949` (`3.21:1`), separated by a pure-white slanted seam (`x = 2195 − 0.375·(y−112)`, 0 watermark pixels). Resized via lossless LANCZOS + 9-slice along that pure-white seam + 4× supersampled vector alpha mask to `2910×774` (`115.48vw × 30.71vw`, `29 px` `#C0E740` stripe at `1260px`) and shown on mobile at `top:147.45vw..178.16vw` with `drop-shadow(.4vw .4vw 1.3333vw rgba(0,0,0,.25))`. Verified at `420@3x`: 1-px top/bottom/stripe edges, bottom shadow RGB `(149,151,162)` vs REF `(151,151,159)`, `0 px` white bleed, text seat unchanged (`51.70vw / 162.09vw`), desktop `595×158` intact.
3. **About Me bio**: updated the military clause to `"so I am capable of creating military-themed bots."` (`"upon"` → `"of"` grammar fix; dropped redundant `"which is one of my strengths in bot creation"` tail).

**Previous status — R59 PAGE-1 PARITY SHIPPED (2026-11-22, branch `arena/fd37cb2f-puppeteer`)**: the user compared reference `123836` (official Gameplay band) against ours `193108` and asked for an image-to-image diagnosis grounded in the official CSS (`capture/css/2.BtMVfDfi.css`), then fixes. Diagnosis + fixes:

1. **The white description panel is official band ART, not a DOM box** — `.-right-contents`/`.-text` carry no background. The fullsite capture has it at band rows 8085–8462 (x56..1235 = 93.7% wide, seat band-rel 148.2..178.1vw, lime stripe + horseshoe watermarks). Our `lb-bg1` was missing it (9.9% white in the panel zone). Baked it back from `reference/133324-fullsite.jpg` (band = rows 6218..8637, sheet offset −8 rows, scale 1246/1260) with the rendered description text inpainted (80,924 px), feathered edges — asset commit `c09373f`, pin updated in markup.
2. **Text seat → official rules**: `.-right-contents top:148vw font-size:3.7333vw` + `.-text width:69.3333vw` centred; implemented as the note block at stage-rel `top:93.4vw; left:51.7%` (band-rel ink centre 163.0vw), `font-size:3.7333vw` (the old `min(3.73vw,15px)` cap removed), `color:#141414` (`--color-text-gray`), lh 1.4 / ls .02em / 700 / Roboto.
3. **Special Week seat → official `.-umamusume`**: was `right:-10vw; height:102vw` (rendered x30.8..99.8 — 16% too far right, ~15% too small); now `left:4vw; top:-0.5333vw; height:120vw !important` (= the art's intrinsic 100vw width) — reproduces the reference figure at x35.6..90.2. Desktop ≥900 keeps its own centred 24vw seat.
4. **Desktop intact**: ≥900 restores `position:relative` note + `img display:block` (the img stays in markup for desktop only, `display:none` on the phone) + absolute text overlay at `min(1.528vw,30.56px)`; CSSOM probe confirms every changed base property is overridden at ≥900.
5. **Verified render-vs-reference (420 CSS @3x = 1260px, same detector both sides)**: panel x 4.5..97.9% / band-rel y 148.7..177.9 (REF 4.4..97.9 / 148.2..178.1); text ink x17.1%, centre 163.0vw (REF 17.2 / 163.0), 3 lines; SW skin+hair x35.2..90.6 / top 15.9vw (REF 35.6..90.2 / 16.4); arrow x91.9..97.9 ✓ identical; tag left 4.8% ✓; no SW art in the capture gap (3706 vs REF 3649 px, arrow only); no tag/head overlap. Captures (L-cap x11.0..53.7 both sides), pager, headline seat unchanged — headline art = the user's file by design.
6. Rig green: paste 73,369 chars/1 line, 9 widths spill=0, stress PASS, reveal 0.35→1. **Viewer caveat this round: `read_file` kept serving a stale `/tmp/sheet-r58-foot.jpg` for ~15 attempts — proofs are the numeric tables above.**

**Previous status — R58 BACKGROUNDS SHIPPED (2026-11-22, branch `arena/fd37cb2f-puppeteer`, HEAD `8761092`, pushed)**: the user's six-image round is in code. Assets first (`e04e0c7`): `about-bg.webp` 2816×3488 (About sky, replaces sky + CSS corners + textured pink band; profile card/bio kept), `news-bg.webp` 2304×4256 (In The Works ground), `lb-bg1.jpg` 1246×2392 (page 1), `lb-bg2.jpg` 4980×9562 (page 2, left `<` baked at x99–403 y4558–5022 = 5.04%/50.09% after band-cut), `lb-bg3.webp` 2272×4362 (page 3). All three Lorebooks sheets are cut to the band's 1:1.92 so `object-fit:cover` parks the baked `• Ω •` pagers at y≈97% and the glyphs at x≈5.0%/94.9%, y≈50% — the same seats work on the phone band and the 62.5vw desktop one. Code (`8761092`): corner/veil/arrow/pager CSS + pager markup deleted; four invisible `.uma-hit` anchors (16vw, `top:50%`, state-swapped via `:target`) sit over the baked glyphs; slide images narrowed to the 77.7% shots column so the wide page-3 photo keeps off the edge arrows; caption shadow strengthened. `:target` swap shows b1/b2/b3 per page; rig 9 widths spill=0 + stress + reveal all green. **Capture caveat**: puppeteer fullpage/`captureBeyondViewport` shots of `:target` pages reflow (sticky bar painted into the band top) — proof crops must come from scrolled viewport shots (`/tmp/vp-gN.png`), not fullpage. Pending: eyeball `/tmp/sheet-r58.jpg` (viewer serves one-turn-stale files).

**Previous status — REBUILT (r57, 2026-11-22)**: page 1 now copies 094329. Scroll-snap scrapped; `:target` page swap restored (g1/g2/g3 anchors at band top, pages `display:none` unless addressed). Official seats: tag 8vw/4vw, headline artwork 56vw/4.4vw/90vw wide, captures row 77.7% wide at 68.7vw (large left 54.83% / small right 40.93%, gap 4.25%, vertically centred), white card 85% wide at 148.3vw carrying the description text, pager bottom 3.3vw, glyph arrows at the captures' sides 106.7vw. Special Week `height:102vw; right:-10vw; top:-1vw` — her PNG has ~6% transparent margins, so the visible art lands at ~5vw–96vw like the reference. Note text lives in one `<span>` (a flex container with a bare `<b>` splits the line). Rig + stress PASS all widths; proof `docs/proof-lb.jpg`. **Section 3's pixel analysis below was based on a misread crop — §7.1/§7.2 geometry is superseded by this rebuild** (user-confirmed: reference image + official CSS, not the §7.1 structure).

Branch: `arena/04bd7464-puppeteer`. HEAD at handoff: `f05b863` (notifications/header fixes, pushed).
Working tree at handoff: clean except the reference screenshots + this handoff (untracked).

## 1. Task (user's words)

"Good fix, get back to Lorebooks page 1 again. Okay soo.. 064808 Is how ours looks like, much things wrong.
094329 Is the reference photo, as we can see, there are a lot of Misplacment.. Etc and etc comparing them both.
I want you to copy our reference Image down to the small details, or basically the website umamusume.com
you can try to get the original CSS code to help yourself too."

Plus: "FYI I will be allowing the arrow click thing where it loads the page for now, so scrap the idea we did
last time. Back to the normal one where when I click the arrow or just swipe the screen, the page actually
loads for the second page instead of keeping it in a scroll."

**⇒ Scrap the scroll-snap carousel. Restore the :target page-swap: clicking an arrow (or the pager) loads the
next page as a real page swap (display swap), and swipe also triggers the page load — not a scroll.**

## 2. What the reference is

`reference/094329-official.jpg` = 1260×2800 screenshot of the **umamusume.com Gameplay section** (the section the
Lorebooks band imitates). `reference/064808-ours.jpg` = 1260×2419, our current Lorebooks section.

The official page's Gameplay section has 3 game-mode cards; card 1 = "Training" (Special Week). Structure per card
(from the official page fetch + pixel analysis):
- a **title image** (`gameplay_specialweek.png`, 750×900 RGBA, uploaded at `/tmp/arena-coding-uploads/gameplay_specialweek.Bs46ZC7q.png`)
  — left side, tall; transparent corners (alpha 0 at corners), character art on a light bg.
- **two gameplay screenshots** — right side, stacked vertically (screenshot 1 on top, screenshot 2 below).
- a **description text** below the screenshots ("Lead your Umamusume to victory by choosing a training regimen…").

Uploaded assets that map to the official section:
- `gameplay_specialweek.Bs46ZC7q.png` (750×900) — the title image (Special Week character art).
- `muse-image_b_Change_the_text_to__ (1).png` (2560×361) — the user's "change the text to" headline artwork
  (white text + light-green (#C0E641-ish) + green (#3DA435-ish) accents, transparent corners).
- `Picsart_26-11-21_13-57-43-080.jpg` (2298×4096) and `Picsart_26-11-21_13-58-17-167.jpg` (2295×4096) —
  likely the two gameplay screenshots for page 1 (tall portrait crops).

## 3. Measured geometry of the OFFICIAL reference (094329, 1260 px wide)

Key rows/regions (from PIL pixel analysis):

- **Blue section header band**: y=144–337 (h≈194). This is the "Gameplay" title band on the site.
- **Card 1 region**: y≈340–790.
  - **Title image (left)**: titlebg (light yellow-green, ~227,253,144) spans x=0–500, y=341–779 (h≈439).
    The image has a light yellow-green background with the character art; green (60,167,51) shows where the
    art's own green is. Title image occupies the LEFT ~40% of the card, full card height.
  - **Screenshot 1 (right, top)**: light blue (~150,216,254), x≈527–1259, y≈342–452 (h≈111 at the top,
    the blue band runs y=342–452 in the right region).
  - **Screenshot 2 (right, bottom)**: peach (~255,231,203), x≈985–1070 area, y≈634–686 (h≈52).
  - **Description text**: dark pixels in the right region y≈570–620 (dark fraction rises 0.20→0.38 across
    y=570–610), i.e. the text sits BELOW screenshot 1 and ABOVE screenshot 2 in the right column.
  - Right column white card bg: whiteness rises y≈470–560 (0.19→0.45) — the white card behind screenshot 1.
- **Card 2 region** starts y≈790 (row 790 shows the transition; the next title/screenshot pair begins).
- **Card 3 region** around y≈1180–1580 (light-blue band y=1204–1254, etc.).

Section background: the Gameplay section sits on a **green** bg (60,167,51) — our `.uma-play` is already
`background:#3CA732` (close; official is ~#3CA733). The blue header band at the top of the section is the
site's section title bar.

## 4. Measured geometry of OURS (064808, 1260 px wide) — what's wrong

- Our Lorebooks section: blue header band y=0–~88 (h≈88, much shorter than official's 194), then the green
  section bg from y≈88 down.
- Our "title image" area: the `uma-lb-char` (Special Week cut-out) is centered behind the headline; the
  headline image (`lb-p1-headline.png`, 230×24) is the "Test The Lorebooks!" text.
- Our carousel: a scroll-snap `.uma-viewport` (700px max-width) with 3 slides — this is the thing to scrap.
- Our slides show: slide 1 = two `uma-lb-shots` (lb-p1-left.jpg 189×337, lb-p1-right.jpg 126×225) side by side;
  slide 2 = slide2.jpg; slide 3 = slide1.jpg; each with a `uma-slide-cap` caption.
- Misplacements vs reference: title image not on the left at full card height; screenshots not stacked on the
  right; description text not in the right column between the screenshots; no per-card structure matching the
  official's title-image-left + screenshots-right + text layout.

## 5. The scrap decision (user-confirmed)

User: "I will be allowing the arrow click thing where it loads the page for now, so scrap the idea we did last
time. Back to the normal one where when I click the arrow or just swipe the screen, the page actually loads for
the second page instead of keeping it in a scroll."

**⇒ Delete the scroll-snap carousel (`.uma-viewport` scroll-snap-type, `.uma-track` flex row, `scroll-snap-align`,
`scroll-behavior:smooth` on the viewport). Restore the page-swap: slides are stacked (display:none unless
:target), arrows + pager are `href="#sN"` anchors that swap the visible slide. Swipe → page load: the
:target anchor navigation handles clicks; for swipe, the previous approach used the anchor links (a swipe
cannot natively change :target without JS, but the user accepts the arrow-click page load; the "swipe" loads
the page means the page content swaps, which the :target mechanism provides).**

## 6. Current code locations in `uma-profile/src/bio.html`

- Gameplay/Lorebooks CSS block: ~lines 690–815 (`.uma-play`, `.uma-lb-bg`, `.uma-carousel`, `.uma-viewport`,
  `.uma-track`, `.uma-slide`, `.uma-slide-cap`, `.uma-hl`, `.uma-lb-char`, `.uma-lb-hl-img`, `.uma-lb-shots`,
  `.uma-ctl` arrow states, `.uma-pg` pager states).
- Lorebooks markup: ~lines 1967–2011 (`.uma-play` div with `uma-lb-bg`, `uma-tag-wrap`, `uma-hl`, the
  `uma-carousel` with 3 `uma-slide`s (#s1/#s2/#s3), `uma-ctl` arrow rows, `uma-pg` pager rows).

## 7. Rebuild plan (next turn — do in small steps, verify each)

1. **Replace the carousel markup** with the official card structure for page 1:
   - Title image (left): `gameplay_specialweek.png` as the left column, full card height.
   - Right column: screenshot 1 on top, description text below it, screenshot 2 at the bottom.
   - Use the uploaded assets (copy them into `uma-profile/assets/site/` with stable names, e.g.
     `lb1-title.png`, `lb1-shot1.jpg`, `lb1-shot2.jpg`).
2. **Rewrite the CSS** to match the measured geometry:
   - `.uma-play` band height: official card 1 is y=340–790 (h≈450) at 1260px width → ~35.7vw; the blue header
     band is 194px → ~15.4vw. Keep the green section bg `#3CA732`.
   - Left column ~40% width, right column ~60%, matching x=0–500 / x=527–1259.
   - Title image: object-fit contain/cover per the reference; the character art bg is light yellow-green.
   - Screenshots: stacked in the right column; screenshot 1 h≈111px (~8.8vw) at top, screenshot 2 h≈52px
     (~4vw) at bottom, description text between.
   - **Scrap all scroll-snap**; slides swap by `:target` (the existing `uma-ctl`/`uma-pg` :has() rules already
     do the swap — keep those, just change the slides from scroll items to swap items).
3. **Rebuild** `tools/build_paste.py` → `JANITOR-PASTE.txt`, `tools/build_standalone.py` → `preview/standalone.html`.
4. **Verify** with the rig (`tools/rig.cjs paste`) at the same widths; screenshot + pixel-compare against
   `reference/094329-official.jpg` (compare the card region y=340–790).
5. Commit on the current branch, push.

## 8. Assets to copy in (from /tmp/arena-coding-uploads/)

- `gameplay_specialweek.Bs46ZC7q.png` → `uma-profile/assets/site/lb1-title.png`
- `muse-image_b_Change_the_text_to__ (1).png` → `uma-profile/assets/site/lb1-headline.png`
- `Picsart_26-11-21_13-57-43-080.jpg` → `uma-profile/assets/site/lb1-shot1.jpg`
- `Picsart_26-11-21_13-58-17-167.jpg` → `uma-profile/assets/site/lb1-shot2.jpg`

## 9. Toolchain (verified working)

- `pip3 install --break-system-packages pillow numpy scipy brotli`
- In `/tmp/nm2`: `npm i @sparticuz/chromium@131 puppeteer-core@23 @fontsource/roboto @fontsource/roboto-condensed`
- Chromium libs: python3 `brotli.decompress` on `@sparticuz/chromium/bin/al2023.tar.br` +
  `tarfile.extractall('/tmp/lib')` → run with `LD_LIBRARY_PATH=/tmp/lib/lib`.
- Rig: `NODE_PATH=/tmp/nm2/node_modules UMA_FONTS=/tmp/nm2/node_modules LD_LIBRARY_PATH=/tmp/lib/lib node tools/rig.cjs paste`
- Probe pattern: read `src/bio.html`, split `<style>` + markup, rewrite jsdelivr asset URLs to `file://` local
  assets, render headless with mock Janitor chrome.

## 10. Do NOT redo / dead ends

- **Do not re-add the scroll-snap carousel** — user explicitly scrapped it.
- `bell_gift.png` is NOT the notifications button (that's done; don't touch).
- Header `pointer-events:none` overlay fix is committed (`f05b863`); don't revert it.
- No OCR in sandbox — decode screenshot text via PIL ASCII raster / pixel stats only.
- `**/docs/paste-*.png` is gitignored; rig PNGs (`docs/rig-*.png`) stay out of the commit (large).
