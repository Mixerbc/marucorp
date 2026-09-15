import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]

BANNER_START = re.compile(
    r'<section class="page-hero page-hero--rich page-hero--service[^"]*">',
)
SHELL_START = '<div class="service-shell">'

BG_BLOCK = re.compile(
    r'\s*<div class="page-hero-bg" aria-hidden="true">.*?</div>\s*',
    re.DOTALL,
)

WRAP_HEAD = """    <div class="service-banner">
      <div class="service-banner-bg" aria-hidden="true">
        <div class="page-hero-orb page-hero-orb--1"></div>
        <div class="page-hero-orb page-hero-orb--2"></div>
      </div>
"""


def wrap_file(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    if 'class="service-banner"' in text:
        return

    m = BANNER_START.search(text)
    if not m:
        print("skip hero", path.name)
        return

    shell_idx = text.find(SHELL_START, m.start())
    if shell_idx < 0:
        print("skip shell", path.name)
        return

    inner = text[m.start() : shell_idx]
    inner = BG_BLOCK.sub("\n      ", inner, count=1)

    wrapped = WRAP_HEAD + inner + "    </div>\n\n    "
    text = text[: m.start()] + wrapped + text[shell_idx:]
    path.write_text(text, encoding="utf-8")
    print("ok", path.name)


for f in sorted(root.glob("serv*.html")):
    wrap_file(f)
