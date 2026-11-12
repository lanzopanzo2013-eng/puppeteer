#!/usr/bin/env python3
"""make_paste.py — emit the copy-paste file in a form Janitor can actually parse.

Why this exists
---------------
The About Me field runs its content through a Markdown pass before it becomes
HTML. CommonMark turns a line that starts with four or more spaces into an
indented code block, and it ends an HTML block at a blank line. Our source is
readable, which means it is indented, which means whole sections of markup get
rendered to the user as literal text (the screen of green monospace tags).

So the delivered paste is minified: the <style> block is a single line and the
markup has no leading whitespace and no blank lines. The readable source stays
in src/bio.html; this script is the only thing that writes JANITOR-PASTE.txt.

    python3 tools/make_paste.py
"""
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src" / "bio.html"
OUT_ROOT = ROOT.parent / "JANITOR-PASTE.txt"
OUT_DIR = ROOT / "dist"


def split_source(text):
    m = re.search(r"<style>(.*?)</style>", text, re.S)
    css = m.group(1)
    html = text[m.end():]
    html = re.sub(r"^\s*<!--.*?-->\s*", "", html, flags=re.S)
    return css, html


def minify_css(css):
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)      # comments
    css = re.sub(r"\s+", " ", css)                        # one long line
    css = re.sub(r"\s*([{};,])\s*", r"\1", css)          # no space around structural chars
    css = re.sub(r":\s+", ":", css)                       # declaration colon
    css = re.sub(r";}", "}", css)
    return css.strip()


def minify_html(html):
    html = re.sub(r"<!--.*?-->", "", html, flags=re.S)    # comments carry no weight
    html = re.sub(r">\s+<", "><", html)                   # whitespace between tags
    html = re.sub(r"\s*\n\s*", " ", html)                 # any newline left over
    html = re.sub(r" {2,}", " ", html)                    # runs of spaces
    return html.strip()


def check(pasted_css, pasted_html):
    """Fail loudly if anything a Markdown pass could swallow survives."""
    problems = []
    for name, chunk in (("css", pasted_css), ("html", pasted_html)):
        for line in chunk.split("\n"):
            if line.startswith("    ") and line.strip():
                problems.append(f"{name}: 4-space indent -> indented code block")
            if not line.strip() and chunk is not pasted_css:
                problems.append(f"{name}: blank line -> ends the HTML block")
    if "\n" in pasted_html:
        problems.append("html: still multi-line")
    return problems


def markdown_guard(pasted):
    """Render the paste through a CommonMark pass and count what got eaten.

    This is the check that would have caught the green wall of text: any line
    indented four spaces becomes a code block, so tags come out escaped.
    """
    try:
        from markdown_it import MarkdownIt
    except ImportError:
        print("  (markdown-it-py not installed, skipping the CommonMark guard)")
        return
    out = MarkdownIt("commonmark", {"html": True}).render(pasted)
    escaped = len(re.findall(r"&lt;(div|img|span|a|p|style)\b", out))
    blocks = out.count("<pre><code>")
    status = "PASS" if escaped == 0 and blocks == 0 else "FAIL"
    print(f"  markdown guard: {status}  escaped tags={escaped}  code blocks={blocks}")
    if status == "FAIL":
        raise SystemExit("the paste would render as text on Janitor")


def main():
    css, html = split_source(SRC.read_text())
    pretty_css = css.strip()
    pretty_html = re.sub(r"^\s*<!--.*?-->\s*", "", html, flags=re.S).strip()

    m_css = minify_css(css)
    m_html = minify_html(html)

    problems = check(m_css, m_html)
    if problems:
        raise SystemExit("PASTE IS NOT MARKDOWN-SAFE:\n  " + "\n  ".join(problems))

    safe = "<style>" + m_css + "</style>" + m_html + "\n"
    markdown_guard(safe)
    OUT_DIR.mkdir(exist_ok=True)
    (OUT_DIR / "PASTE-ALL.txt").write_text("<style>\n" + pretty_css + "\n</style>\n\n" + pretty_html + "\n")
    (OUT_DIR / "PASTE-CSS.txt").write_text(pretty_css + "\n")
    (OUT_DIR / "PASTE-HTML.txt").write_text(pretty_html + "\n")
    (OUT_DIR / "PASTE-MIN.txt").write_text(safe)
    OUT_ROOT.write_text(safe)

    print(f"JANITOR-PASTE.txt  {len(safe):,} chars, 1 line")
    print(f"  style   {len(m_css):,} chars")
    print(f"  markup  {len(m_html):,} chars")
    print(f"  url()   {m_css.count('url(')}   <img>  {m_html.count('<img')}   svg  {safe.count('.svg')}")
    print(f"  readable copies: dist/PASTE-ALL.txt, PASTE-CSS.txt, PASTE-HTML.txt")


if __name__ == "__main__":
    main()
