import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
skip = {"blog.html", "blog2.html"} | {f"tema{i}.html" for i in range(1, 11)}

nav_pat = re.compile(
    r'\n\s*<a href="blog\.html" class="nav-link(?: active)?">Blog</a>',
)
footer_pat = re.compile(r'\n\s*<a href="blog\.html">Blog</a>')
inline_pat = re.compile(r'<a href="blog\.html">Blog</a>')

for f in sorted(root.glob("*.html")):
    if f.name in skip:
        continue
    text = f.read_text(encoding="utf-8")
    orig = text
    text = nav_pat.sub("", text)
    text = footer_pat.sub("", text)
    text = inline_pat.sub("", text)
    if text != orig:
        f.write_text(text, encoding="utf-8")
        print("updated", f.name)

for name in sorted(skip):
    p = root / name
    if p.exists():
        p.unlink()
        print("deleted", name)
