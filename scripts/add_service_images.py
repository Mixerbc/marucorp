import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]

VISUALS = {
    "servconta.html": {
        "src": "img/blog/tema6.jpg",
        "alt": "Contabilidad y finanzas empresariales",
        "tag": "Contabilidad",
        "caption": "Información financiera clara para decidir con confianza",
        "extra_section_id": "beneficios",
        "extra_src": "img/blog/tema4.jpg",
        "extra_alt": "Gestión financiera empresarial",
    },
    "servlegal.html": {
        "src": "img/blog/tema2.jpg",
        "alt": "Asesoría legal para empresas",
        "tag": "Legal",
        "caption": "Respaldo jurídico en cada etapa de tu operación",
    },
    "servfiscal.html": {
        "src": "img/blog/tema7.jpg",
        "alt": "Asesoría fiscal y cumplimiento tributario",
        "tag": "Fiscal",
        "caption": "Cumplimiento ante el SAT con estrategia preventiva",
        "extra_section_id": "riesgos",
        "extra_src": "img/blog/tema8.jpg",
        "extra_alt": "Compliance y administración empresarial",
    },
    "servnom.html": {
        "src": "img/blog/tema1.jpg",
        "alt": "Administración de nómina empresarial",
        "tag": "Nómina",
        "caption": "Pagos correctos, a tiempo y sin contingencias",
        "extra_section_id": "proceso",
        "extra_src": "img/blog/tema10.jpg",
        "extra_alt": "Recursos humanos y talento en Pymes",
    },
    "servmark.html": {
        "src": "img/blog/tema3.jpg",
        "alt": "Marketing digital para Pymes",
        "tag": "Marketing",
        "caption": "Estrategias que conectan tu marca con clientes reales",
    },
    "servsis.html": {
        "src": "img/blog/tema9.jpg",
        "alt": "Sistemas y tecnología empresarial",
        "tag": "Tecnología",
        "caption": "Infraestructura digital segura y eficiente",
    },
    "servjard.html": {
        "src": "img/services/jardineria.jpg",
        "alt": "Jardinería y áreas verdes corporativas",
        "tag": "Jardinería",
        "caption": "Espacios verdes que proyectan profesionalismo",
    },
}

MARKER = '<div class="service-shell">'
VISUAL_MARKER = 'class="service-visual"'


def build_visual(data: dict) -> str:
    return f"""    <div class="service-visual">
      <div class="container">
        <figure class="service-visual-frame reveal">
          <img src="{data['src']}" alt="{data['alt']}" loading="lazy" width="1200" height="500">
          <figcaption class="service-visual-caption">
            <strong>{data['tag']}</strong>
            <span>{data['caption']}</span>
          </figcaption>
        </figure>
      </div>
    </div>

"""


def build_inline(data: dict) -> str:
    return f"""        <figure class="service-inline-media reveal">
          <img src="{data['extra_src']}" alt="{data['extra_alt']}" loading="lazy" width="800" height="450">
        </figure>
"""


for name, data in VISUALS.items():
    path = root / name
    if not path.exists():
        continue
    text = path.read_text(encoding="utf-8")
    orig = text

    if VISUAL_MARKER not in text and MARKER in text:
        text = text.replace(MARKER, build_visual(data) + MARKER, 1)

    extra_id = data.get("extra_section_id")
    if extra_id and 'class="service-inline-media"' not in text:
        pattern = (
            rf'(<section class="service-section page-block page-block--alt reveal" id="{extra_id}">\s*'
            rf'<div class="container">\s*'
            rf'<header class="page-block-head">)'
        )
        repl = r"\1\n" + build_inline(data)
        text, n = re.subn(pattern, repl, text, count=1)
        if n == 0:
            pattern2 = (
                rf'(<section class="service-section page-block reveal" id="{extra_id}">\s*'
                rf'<div class="container">\s*'
                rf'<header class="page-block-head">)'
            )
            text = re.sub(pattern2, r"\1\n" + build_inline(data), text, count=1)

    if text != orig:
        path.write_text(text, encoding="utf-8")
        print("ok", name)
