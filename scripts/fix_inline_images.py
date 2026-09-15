import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
pat = re.compile(
    r'(<header class="page-block-head">)\s*'
    r'(<figure class="service-inline-media reveal">.*?</figure>)\s*'
    r'(<span class="page-block-label">.*?</header>)',
    re.DOTALL,
)

for f in root.glob("serv*.html"):
    text = f.read_text(encoding="utf-8")
    new = pat.sub(r"\1\n          \3\n        \2", text)
    if new != text:
        f.write_text(new, encoding="utf-8")
        print("fixed", f.name)
