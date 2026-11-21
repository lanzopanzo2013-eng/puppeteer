#!/usr/bin/env python3
"""
make-figs.py — build the three small stickers the About band puts in its free
upper-right corner: assets/site/fig-jet.png, fig-car.png, fig-horse.png.

The sources are the user's own renders (Picsart exports plus a race photo):

    jet    4096x2564  an Umamusume itasha Eurofighter, rendered on a *black* plate
    car    2940x1960  the Pacific Racing BMW M4 GT3, already cut out
    horse  1000x 666  a horse and jockey, already cut out

Two of them arrive with a real alpha channel and only need the empty margin
trimmed. The jet does not: it is opaque black outside the airframe, so the
script keys the plate out. Keying on brightness alone would also punch holes in
the dark parts of the jet (canopy, intakes, shadow under the wings), so the
black region is first flood-filled from the frame's border and only *that*
connected region is allowed to become transparent. Black that the airframe
encloses stays solid. The keyed edge is feathered by luminance, which is exactly
where the anti-aliasing lives, and the colour is un-premultiplied so the edge
does not keep a dark fringe over the light blue band.

Everything is then trimmed to its ink and scaled to a 2x of the biggest size the
CSS ever draws it at (the band's 900px breakpoint), so the phone gets a sharp
sticker without shipping a 4096px render.

    python3 tools/make-figs.py            # reads /tmp/arena-coding-uploads
    UPLOADS=/some/dir python3 tools/make-figs.py
"""
import os
import pathlib

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets' / 'site'
UP = pathlib.Path(os.environ.get('UPLOADS', '/tmp/arena-coding-uploads'))

SRC = {
    'jet': 'Picsart_26-11-21_08-49-43-440.png',
    'car': 'Picsart_26-11-21_08-49-03-428.png',
    'horse': 'UKyMib-HZQr_skt3xjKxvSoTJ-TkaT5_q8xfwDOg47VW5upNbZKN4hUsSFxzS3CZ7-'
             'TxJytkKR9uMinPX24ViQ.png',
}
# widest the sticker is drawn anywhere in the CSS is ~7.2vw of a 1280 viewport,
# so 2x of that is ~184px; 320 gives room for a 3x phone at the widest phone width
WIDTH = {'jet': 320, 'car': 320, 'horse': 300}

# the jet's plate: pure black, but a couple of levels of render noise sit on it
BLACK = 12


def luminance(rgb):
    return 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]


def key_black_plate(im):
    """Make the black plate behind an opaque render transparent."""
    a = np.asarray(im.convert('RGBA')).astype(np.float32)
    rgb, alpha = a[:, :, :3], a[:, :, 3] / 255.0
    lum = luminance(rgb)

    # only black that is reachable from the frame's edge is plate; black the
    # airframe encloses (canopy shadow, wheel wells) is part of the artwork
    seed = lum < BLACK
    lab, _ = ndimage.label(seed)
    border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    plate = np.isin(lab, border[border > 0])

    # feather the keyed edge by luminance: the anti-aliased rim is the only
    # place where the render is neither plate-black nor solid airframe
    edge = np.clip((lum - 2.0) / 14.0, 0.0, 1.0)
    keyed = np.where(plate, edge, 1.0) * alpha

    # the render is already composited on black, so it is premultiplied by the
    # new alpha; undo that or every feathered pixel keeps a dark rim
    safe = np.maximum(keyed, 1e-3)[:, :, None]
    colour = np.clip(rgb / safe, 0, 255)

    out = np.dstack([colour, keyed * 255.0]).round().clip(0, 255).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


def trim(im, pad=2):
    a = np.asarray(im)[:, :, 3]
    ys, xs = np.where(a > 8)
    box = (max(xs.min() - pad, 0), max(ys.min() - pad, 0),
           min(xs.max() + 1 + pad, im.width), min(ys.max() + 1 + pad, im.height))
    return im.crop(box)


def main():
    for name, file in SRC.items():
        src = UP / file
        if not src.exists():
            raise SystemExit(f'missing source: {src}')
        im = Image.open(src)
        im = key_black_plate(im) if name == 'jet' else im.convert('RGBA')
        im = trim(im)
        h = round(im.height * WIDTH[name] / im.width)
        im = im.resize((WIDTH[name], h), Image.LANCZOS)
        dest = OUT / f'fig-{name}.png'
        im.save(dest, optimize=True)
        print(f'{dest.relative_to(ROOT)}  {im.width}x{im.height}  '
              f'{dest.stat().st_size / 1024:.0f} kB  {im.width / im.height:.2f}:1')


if __name__ == '__main__':
    main()
