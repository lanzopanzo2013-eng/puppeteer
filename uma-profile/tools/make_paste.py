#!/usr/bin/env python3
"""make_paste.py — superseded by build_paste.py.

There used to be two builders writing JANITOR-PASTE.txt with different
minifiers and, worse, *different* dist/PASTE-ALL.txt contents (this one wrote
the pretty multi-line file under that name — pasting that into the markdown
About box turns every indented line into a code block). build_paste.py is the
canonical builder named in the handoff: it emits the one-line paste and keeps
PASTE-ALL.txt as the same one-liner.

    python3 tools/build_paste.py
"""
import runpy
import pathlib
import sys

target = pathlib.Path(__file__).resolve().parent / 'build_paste.py'
print(f'make_paste.py is a wrapper now — running {target.name}', file=sys.stderr)
runpy.run_path(str(target), run_name='__main__')
