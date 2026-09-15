import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]

METRICS = {
    "servconta.html": [
        ("+8", "Servicios contables integrados"),
        ("100%", "Enfoque en cumplimiento"),
        ("24/7", "Respaldo de especialistas"),
    ],
    "servlegal.html": [
        ("6+", "Áreas de práctica legal"),
        ("STPS", "Defensa ante inspecciones"),
        ("360°", "Asesoría integral"),
    ],
    "servfiscal.html": [
        ("SAT", "Defensa y cumplimiento"),
        ("0", "Sorpresas fiscales"),
        ("Pro", "Prevención de riesgos"),
    ],
    "servnom.html": [
        ("4", "Pasos del proceso"),
        ("CFDI", "Timbrado de recibos"),
        ("0", "Errores en pagos"),
    ],
    "servmark.html": [
        ("Digital", "Redes y campañas"),
        ("Marca", "Branding corporativo"),
        ("ROI", "Resultados medibles"),
    ],
    "servsis.html": [
        ("Red", "Infraestructura segura"),
        ("IT", "Optimización de sistemas"),
        ("Tech", "Equipos empresariales"),
    ],
    "servjard.html": [
        ("Verde", "Imagen corporativa"),
        ("4", "Servicios especializados"),
        ("Pro", "Mantenimiento continuo"),
    ],
}

metrics_block_re = re.compile(
    r'(<div class="service-hero-metrics" aria-label="Destacados del servicio">)\s*(</div>)',
    re.DOTALL,
)
stray_divs = re.compile(r"</section>\s*</div>\s*</div>\s*<nav class=\"service-tabs\"")


def metrics_html(pairs):
    lines = "\n".join(
        f'            <div class="service-metric"><strong>{a}</strong><span>{b}</span></div>'
        for a, b in pairs
    )
    return f"\n{lines}\n          "


for name, pairs in METRICS.items():
    path = root / name
    text = path.read_text(encoding="utf-8")
    text = metrics_block_re.sub(r"\1" + metrics_html(pairs) + r"\2", text, count=1)
    text = stray_divs.sub("</section>\n    <nav class=\"service-tabs\"", text, count=1)
    path.write_text(text, encoding="utf-8")
    print("fixed", name)
