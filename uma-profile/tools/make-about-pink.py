#!/usr/bin/env python3
"""
make-about-pink.py — build assets/site/about-pink-full.png, the pink band's texture.

The old sheet (about-pink.png) is a 5:3 crop of the band that only ever held the band's
right-hand half, and it carried the crop's own pale top edge with it. On the page that
read as a pink band with a bright diagonal sliced through it and a texture that stopped
half way across.

The real band is in the site's tall About painting, capture/img/about_bg.CwbgSExa.jpg
(750x920). There it runs at the same 0.422 fall, 126.5px deep, with the UMA/URA motif
repeating every ~79px along it. This script cuts one clean period out of it, scales it to
the band the CSS draws — 16.5vw deep on a 100vw x 60vw plate, i.e. 178px in a 1080px-wide
sheet — and tiles it across the full width on the band's exact seat, so the whole band is
textured and nothing sits on top of it. Outside the band the sheet is transparent.

    python3 tools/make-about-pink.py
"""
import pathlib

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT.parent / 'capture' / 'img' / 'about_bg.CwbgSExa.jpg'
OUT = ROOT / 'assets' / 'site' / 'about-pink-full.png'

SLOPE = 0.422                 # the band falls 0.422px per px to the left, in the source
TOP0 = 1001.4                 # the source band's top edge, at x = 0
SRC_DEPTH = 126.5             # the source band's depth
PERIOD = 79.0                 # one repeat of the motif, along the band, in source px
SCALE = 1.44                  # source px -> sheet px (2px/design px -> 2.88px/design px)

SHEET_W, SHEET_H = 1080, 648  # 100vw x 60vw
SEAT_X0, SEAT_Y0 = 540.0, 642.0   # a point on the band's top edge, in the sheet
DEPTH = 178.2                 # the band's depth in the sheet: 16.5vw
ARC = (1 + SLOPE ** 2) ** 0.5


def main():
    src = Image.open(SRC).convert('RGB')
    W, H = src.size
    px = np.asarray(src).astype(float)

    # 1. one period of band, straightened: u along the band's arc, v across it
    v0, v1 = 5, SRC_DEPTH - 4                       # drop the pale top edge and the foot
    u0 = 600.0                                      # a stretch that sits inside the painting
    u = u0 + np.arange(int(round(PERIOD * ARC)))
    v = np.arange(int(round(v1 - v0)))
    uu, vv = np.meshgrid(u, v, indexing='xy')
    x = uu / ARC
    y = TOP0 - SLOPE * x + v0 + vv
    tile = px[np.clip(y.round().astype(int), 0, H - 1),
              np.clip(x.round().astype(int), 0, W - 1), :]
    print(f'tile {tile.shape[1]}x{tile.shape[0]} source px, one period')

    # 2. scale it to the band the CSS draws, and tile it across the sheet's full width
    tw = int(round(tile.shape[1] * SCALE))
    th = int(round(DEPTH))
    tile_img = Image.fromarray(np.clip(tile, 0, 255).astype('uint8'))
    tile_img = tile_img.resize((tw, th), Image.LANCZOS)
    tile = np.asarray(tile_img).astype(float)

    strip = np.empty((th, SHEET_W + tw, 3))
    for i in range(0, strip.shape[1], tw):
        n = min(tw, strip.shape[1] - i)
        strip[:, i:i + n] = tile[:, :n]
    # make the wrap seamless: cross-fade the tail back over the head
    fade = 40
    head = strip[:, :fade].copy()
    tail = strip[:, -fade:].copy()
    for k in range(fade):
        t = k / (fade - 1)
        strip[:, k] = tail[:, k] * (1 - t) + head[:, k] * t
    strip = strip[:, :SHEET_W]

    # 3. paint it into the sheet on the band's seat, transparent everywhere else
    ys, xs = np.mgrid[0:SHEET_H, 0:SHEET_W]
    top = SEAT_Y0 - SLOPE * (xs - SEAT_X0)
    vv = ys - top
    inside = (vv >= 0) & (vv < th)
    out = np.zeros((SHEET_H, SHEET_W, 4))
    out[ys[inside], xs[inside], :3] = strip[np.clip(vv[inside].round().astype(int), 0, th - 1),
                                            xs[inside]]
    out[inside, 3] = 255

    Image.fromarray(np.clip(out, 0, 255).astype('uint8')).save(OUT)
    print('wrote', OUT.relative_to(ROOT), Image.open(OUT).size)


if __name__ == '__main__':
    main()
