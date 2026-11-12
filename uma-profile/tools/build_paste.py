#!/usr/bin/env python3
"""
build_paste.py — emit the two-panel paste files.

Janitor renders the About Me box as Markdown. A blank line ends an HTML block,
and a line indented four or more spaces becomes a code block, which is why
indented markup shows up on the profile as literal <div class="..."> text.
The delivered paste is therefore ONE line: no indentation, no blank lines,
and the stylesheet compressed to a single unbroken run.
"""

import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'src' / 'bio.html'
OUT = ROOT / 'dist'
ROOT_PASTE = ROOT.parent / 'JANITOR-PASTE.txt'


def css_minify(css: str) -> str:
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    css = re.sub(r'\s+', ' ', css)
    css = re.sub(r'\s*([{};:,>])\s*', r'\1', css)
    css = css.replace(';}', '}').replace('; }', '}')
    return css.strip()


def html_one_line(html: str) -> str:
    html = re.sub(r'<!--.*?-->', '', html, flags=re.S)
    parts = [ln.strip() for ln in html.split('\n')]
    return ' '.join(p for p in parts if p)


def main() -> None:
    src = SRC.read_text()
    m = re.search(r'<style>(.*?)</style>', src, re.S)
    if not m:
        raise SystemExit('no <style> block found')
    pretty_css = m.group(1).strip()
    pretty_html = src[m.end():].strip()

    css = css_minify(pretty_css)
    html = html_one_line(pretty_html)

    # everything the editor receives, on a single line
    paste = '<style>' + css + '</style> ' + html

    OUT.mkdir(exist_ok=True)
    (OUT / 'PASTE-CSS.txt').write_text(pretty_css + '\n')
    (OUT / 'PASTE-HTML.txt').write_text(pretty_html + '\n')
    (OUT / 'PASTE-ALL.pretty.txt').write_text(
        '<style>\n' + pretty_css + '\n</style>\n\n' + pretty_html + '\n')
    (OUT / 'PASTE-ALL.txt').write_text(paste + '\n')
    ROOT_PASTE.write_text(paste + '\n')

    # the invariant that keeps the markdown parser out of our markup
    assert '\n' not in paste, 'paste must be one line'
    assert not re.search(r'(^|\n)\s{4,}', paste)
    print(f'paste {len(paste)} chars, 1 line · css {len(css)} · markup {len(html)}')


if __name__ == '__main__':
    main()
