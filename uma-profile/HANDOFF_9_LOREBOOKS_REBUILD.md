# HANDOFF 9 — Lorebooks Page 1 rebuild (copy reference 094329 to the small details)

**STATUS — R59 PAGE-1 PARITY SHIPPED (2026-11-22, branch `arena/fd37cb2f-puppeteer`)**: the user compared reference `123836` (official Gameplay band) against ours `193108` and asked for an image-to-image diagnosis grounded in the official CSS (`capture/css/2.BtMVfDfi.css`), then fixes. Diagnosis + fixes:

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
