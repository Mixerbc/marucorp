import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
pat = re.compile(
    r'(<section class="page-hero page-hero--rich page-hero--service[^"]*">)\s*'
    r'<div class="page-hero-orb page-hero-orb--2"></div>\s*</div>\s*',
)

for f in root.glob("serv*.html"):
    text = f.read_text(encoding="utf-8")
    new = pat.sub(r"\1\n      ", text)
    if new != text:
        f.write_text(new, encoding="utf-8")
        print("fixed", f.name)
