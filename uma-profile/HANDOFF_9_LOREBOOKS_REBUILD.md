# HANDOFF 9 — Lorebooks Page 1 rebuild (copy reference 094329 to the small details)

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
