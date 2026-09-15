import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]

HERO_OLD = re.compile(
    r'<section class="page-hero[^"]*">.*?</section>',
    re.DOTALL,
)
INTRO = re.compile(r'\s*<div class="page-intro">.*?</div>\s*', re.DOTALL)
JUMP = re.compile(
    r'\s*<nav class="page-jump"[^>]*>.*?</nav>\s*',
    re.DOTALL,
)


def extract_hero(block: str) -> dict:
    badge = re.search(r'class="page-badge">([^<]+)<', block)
    icon = re.search(r'<img src="(img/[^"]+)"', block)
    h1 = re.search(r'<h1>([^<]+)</h1>', block)
    lead = re.search(r'class="lead">([^<]+)<', block)
    metrics = re.findall(
        r'(?:hero-mini-card|service-metric)"?><strong>([^<]*)</strong><span>([^<]*)</span>',
        block,
    )
    jard = "page-hero--jard" if "jard" in block.lower() or "jardiner" in (h1.group(1) if h1 else "") else ""
    return {
        "badge": badge.group(1).strip() if badge else "",
        "icon": icon.group(1) if icon else "img/favicon.png",
        "h1": h1.group(1).strip() if h1 else "",
        "lead": lead.group(1).strip() if lead else "",
        "metrics": metrics[:3],
        "jard": jard,
    }


def build_hero(data: dict) -> str:
    extra = f" {data['jard']}" if data.get("jard") else ""
    metrics_html = "\n".join(
        f'            <div class="service-metric"><strong>{a}</strong><span>{b}</span></div>'
        for a, b in data["metrics"]
    )
    return f"""    <section class="page-hero page-hero--rich page-hero--service{extra}">
      <div class="page-hero-bg" aria-hidden="true">
        <div class="page-hero-orb page-hero-orb--1"></div>
        <div class="page-hero-orb page-hero-orb--2"></div>
      </div>
      <div class="container">
        <div class="service-hero">
          <header class="service-hero-head">
            <div class="service-hero-icon" aria-hidden="true">
              <img src="{data['icon']}" alt="">
            </div>
            <div class="service-hero-titles">
              <span class="page-badge">{data['badge']}</span>
              <h1>{data['h1']}</h1>
            </div>
          </header>
          <p class="lead">{data['lead']}</p>
          <div class="page-hero-actions">
            <a href="contacto.html" class="btn btn-gold">Agenda una asesoría</a>
            <a href="index.html#servicios" class="btn btn-secondary">Ver los 7 servicios</a>
          </div>
          <div class="service-hero-metrics" aria-label="Destacados del servicio">
{metrics_html}
          </div>
        </div>
      </div>
    </section>"""


def build_tabs(jump_html: str) -> str:
    links = re.findall(r'<a href="(#[^"]+)">([^<]+)</a>', jump_html)
    if not links:
        return ""
    items = "\n".join(
        f'        <a href="{href}" class="service-tab">{label}</a>' for href, label in links
    )
    return f"""    <nav class="service-tabs" aria-label="Secciones">
      <div class="container service-tabs-inner">
{items}
      </div>
    </nav>

    <div class="service-shell">
"""


def fix_legal_markup(text: str) -> str:
    text = text.replace(
        "                </div>\n              </div>\n            </section>\n      </div>\n    </section>",
        "        </div>\n      </div>\n    </section>",
    )
    return text


for path in sorted(root.glob("serv*.html")):
    text = path.read_text(encoding="utf-8")
    orig = text

    text = text.replace('<main class="page-main">', '<main class="page-main page-main--service">')
    text = text.replace("<main class=\"page-main\">", '<main class="page-main page-main--service">')

    hero_m = HERO_OLD.search(text)
    if hero_m:
        data = extract_hero(hero_m.group(0))
        if data["h1"]:
            text = text[: hero_m.start()] + build_hero(data) + text[hero_m.end() :]

    text = INTRO.sub("\n", text)

    jump_m = JUMP.search(text)
    tabs = build_tabs(jump_m.group(0)) if jump_m else ""
    if jump_m:
        text = JUMP.sub("\n" + tabs, text, count=1)

    text = text.replace(
        '<section class="page-block',
        '<section class="service-section page-block',
    )

    if '<div class="service-shell">' in text and "page-services-nav" in text:
        text = text.replace(
            "\n    <section class=\"page-services-nav",
            "\n    </div>\n\n    <section class=\"service-related page-services-nav",
            1,
        )

    text = fix_legal_markup(text)

    if text.count("catalog-item") >= 5:
        text = text.replace(
            'class="service-catalog reveal-stagger"',
            'class="service-catalog service-catalog--many reveal-stagger"',
            1,
        )

    # Fix jard broken class if still present
    text = text.replace("page-hero--richpage-hero--jard", "page-hero--service page-hero--jard")
    text = re.sub(r'\n\s*<section class="cta-section', '\n\n    <section class="cta-section', text)

    if text != orig:
        path.write_text(text, encoding="utf-8")
        print("ok", path.name)
