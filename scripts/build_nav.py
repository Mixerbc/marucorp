# -*- coding: utf-8 -*-
"""Genera header/footer unificado y páginas del nuevo menú MARU CORP."""
import glob
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

NAV_ITEMS = [
    ('index.html', 'Inicio', 'inicio'),
    ('supervision-empresarial.html', 'Supervisión Empresarial', 'supervision'),
    ('prevencion-fiscal-laboral.html', 'Prevención Fiscal y Laboral', 'prevencion'),
    ('operacion-integrada.html', 'Operación Integrada', 'operacion'),
    ('diagnostico-empresarial.html', 'Diagnóstico Empresarial', 'diagnostico'),
    ('insights-empresariales.html', 'Insights Empresariales', 'insights'),
]

CTA_HREF = 'agendar-diagnostico.html'
CTA_LABEL = 'Agendar Diagnóstico'


def build_header(active_key):
    desktop_links = []
    mobile_links = []
    for href, label, key in NAV_ITEMS:
        cls = ' nav-link active' if key == active_key else ' nav-link'
        desktop_links.append(f'        <a href="{href}" class="{cls.strip()}">{label}</a>')
        mcls = ' class="active"' if key == active_key else ''
        mobile_links.append(f'      <a href="{href}"{mcls}>{label}</a>')

    cta_href = CTA_HREF
    if active_key == 'agendar':
        cta_href = '#datos'

    return f'''  <header class="site-header" id="siteHeader">
    <div class="header-shell">
      <div class="header-inner">
      <a href="index.html" class="logo logo--brand">
        <span class="logo-mark"><img src="img/favicon.png" alt=""></span>
        <span class="logo-text">
          <span class="logo-text-name"><strong>MARU</strong> CORP</span>
          <span class="logo-text-tag">Control empresarial integrado</span>
        </span>
      </a>
      <nav class="main-nav" aria-label="Navegación principal">
{chr(10).join(desktop_links)}
      </nav>
      <a href="{cta_href}" class="btn btn-gold btn-sm header-cta">{CTA_LABEL} <span class="arrow">→</span></a>
      <button type="button" class="nav-toggle" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span><span></span></button>
      </div>
    </div>
    <nav class="mobile-nav" aria-label="Menú móvil">
      <div class="mobile-nav-links">
{chr(10).join(mobile_links)}
      </div>
      <a href="{cta_href}" class="btn btn-gold mobile-nav-cta">{CTA_LABEL} <span class="arrow">→</span></a>
    </nav>
  </header>'''


def build_footer():
    nav_links = ''.join(f'          <a href="{href}">{label}</a>\n' for href, label, _ in NAV_ITEMS)
    return f'''  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="img/logo.png" alt="MARU CORP">
          <p class="tagline">Operación, supervisión y control estratégico.</p>
          <p>Integramos, operamos y supervisamos áreas fiscales, laborales, administrativas y operativas bajo una misma estructura.</p>
        </div>
        <div class="footer-col">
          <h4>Navegación</h4>
{nav_links}          <a href="{CTA_HREF}">{CTA_LABEL}</a>
        </div>
        <div class="footer-col">
          <h4>Áreas operativas</h4>
          <a href="servconta.html">Contables</a>
          <a href="servlegal.html">Legales</a>
          <a href="servfiscal.html">Fiscales</a>
          <a href="servnom.html">Nómina</a>
          <a href="servmark.html">Marketing</a>
          <a href="servsis.html">Sistemas</a>
          <a href="servjard.html">Jardinería</a>
        </div>
        <div class="footer-col">
          <h4>Contacto</h4>
          <p>Plaza de las Danzas #18, Col. Ejido Los Olvera, Querétaro. C.P. 76904</p>
          <p><a href="tel:+524422402238">442 240 2238</a></p>
          <p>Lunes a Viernes 9am – 6pm</p>
          <p><a href="mailto:contacto@marucorp.mx">contacto@marucorp.mx</a></p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>Todos los derechos reservados © <span id="year"></span> | Editado por Disidente Creativo</p>
        <div class="footer-social">
          <a href="https://www.facebook.com/marucorpqro/" aria-label="Facebook" target="_blank" rel="noopener">Facebook</a>
          <a href="https://www.instagram.com/maru_corp/" aria-label="Instagram" target="_blank" rel="noopener">Instagram</a>
        </div>
      </div>
    </div>
  </footer>'''


def whatsapp_float():
    return '''  <a href="https://wa.me/524422402238?text=Hola%2C%20quiero%20hablar%20con%20un%20asesor%20de%20MARU%20CORP" class="whatsapp-float" aria-label="Hablar con un asesor por WhatsApp" target="_blank" rel="noopener">
    <span class="whatsapp-float__ring" aria-hidden="true"></span>
    <span class="whatsapp-float__ring whatsapp-float__ring--delay" aria-hidden="true"></span>
    <img src="img/whatsapp.svg" alt="" width="30" height="30" class="whatsapp-float__icon">
    <span class="whatsapp-float__label">¿Chateamos?</span>
  </a>'''


def inner_page_shell(title, description, body_class, active_key, main_content, extra_css=None, extra_scripts=None):
    css_links = [
        'css/styles.css',
        'css/header.css',
        'css/custom-cursor.css',
        'css/pages-enhanced.css',
        'css/page-layout.css',
        'css/inner-pages.css',
        'css/responsive.css',
    ]
    if extra_css:
        css_links.extend(extra_css)
    css_block = '\n'.join(f'  <link rel="stylesheet" href="{c}">' for c in css_links)
    scripts = ['js/main.js', 'js/custom-cursor.js']
    if extra_scripts:
        scripts.extend(extra_scripts)
    script_block = '\n'.join(f'  <script src="{s}"></script>' for s in scripts)

    return f'''<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="img/favicon.png" type="image/png">
  <title>{title}</title>
  <meta name="description" content="{description}">
{css_block}
</head>
<body class="{body_class}">
  <div class="inner-ambient" aria-hidden="true">
    <span class="inner-blob inner-blob--1"></span>
    <span class="inner-blob inner-blob--2"></span>
    <span class="inner-blob inner-blob--3"></span>
  </div>
{build_header(active_key)}

{main_content}

{build_footer()}
{whatsapp_float()}
  <script>document.getElementById('year').textContent = new Date().getFullYear();</script>
{script_block}
</body>
</html>
'''


def hero_block(badge, h1, lead, primary_href, primary_label, secondary_href=None, secondary_label=None):
    secondary = ''
    if secondary_href and secondary_label:
        ext = ' target="_blank" rel="noopener"' if secondary_href.startswith('http') else ''
        secondary = f'\n            <a href="{secondary_href}" class="btn btn-secondary"{ext}>{secondary_label}</a>'
    return f'''    <section class="page-hero page-hero--rich">
      <div class="page-hero-bg" aria-hidden="true">
        <div class="page-hero-orb page-hero-orb--1"></div>
        <div class="page-hero-orb page-hero-orb--2"></div>
      </div>
      <div class="container page-hero-inner">
        <div class="page-hero-content reveal">
          <span class="page-badge">{badge}</span>
          <h1>{h1}</h1>
          <p class="lead">{lead}</p>
          <div class="page-hero-actions">
            <a href="{primary_href}" class="btn btn-primary">{primary_label} <span class="arrow">→</span></a>{secondary}
          </div>
        </div>
      </div>
    </section>'''


def cta_section(h2, p, href, label):
    return f'''    <section class="cta-section reveal">
      <div class="shape-gold" style="top:-40px;left:10%" aria-hidden="true"></div>
      <div class="container">
        <h2>{h2}</h2>
        <p>{p}</p>
        <a href="{href}" class="btn btn-gold">{label} <span class="arrow">→</span></a>
      </div>
    </section>'''


PAGES = {
    'supervision-empresarial.html': {
        'active': 'supervision',
        'title': 'Supervisión Empresarial | MARU CORP',
        'description': 'Supervisión continua de áreas fiscales, laborales, administrativas y operativas bajo una estructura de control empresarial con MARU CORP.',
        'body_class': 'page-inner page-supervision',
        'content': '''
  <main class="page-main">
''' + hero_block(
            'Supervisión Empresarial',
            'Supervisión continua para mantener el control',
            'Detectamos desviaciones, errores y riesgos antes de que afecten la operación. Supervisamos cada área crítica bajo una misma estructura de control.',
            'agendar-diagnostico.html',
            'Agendar Diagnóstico',
            'operacion-integrada.html',
            'Ver Operación Integrada',
        ) + '''
    <section class="section section--compact">
      <div class="container">
        <div class="section-header reveal">
          <span class="services-section-badge">Qué supervisamos</span>
          <h2>Visibilidad real para la dirección</h2>
          <p>La supervisión no es solo revisar papeles: es tener control operativo sobre lo que ocurre en cada área.</p>
        </div>
        <div class="benefits-grid reveal-stagger">
          <div class="benefit-card">
            <div class="benefit-icon" aria-hidden="true">◎</div>
            <h3>Seguimiento activo</h3>
            <p>Monitoreo continuo de cumplimiento, plazos y desviaciones en cada área.</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon" aria-hidden="true">◆</div>
            <h3>Puntos de control</h3>
            <p>Indicadores claros para detectar riesgos antes de que escalen.</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon" aria-hidden="true">✓</div>
            <h3>Reportes consolidados</h3>
            <p>Información unificada para que la dirección decida con tranquilidad.</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon" aria-hidden="true">★</div>
            <h3>Equipo multidisciplinario</h3>
            <p>Especialistas fiscal, laboral, administrativo y operativo coordinados.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section section--navy section--compact">
      <div class="container">
        <div class="section-header section-header--tight reveal">
          <h2>Supervisión integrada, no revisiones aisladas</h2>
        </div>
        <div class="why-grid reveal-stagger">
          <div class="why-item"><span class="why-check" aria-hidden="true">✓</span><p>Fiscal, laboral y administrativo bajo la misma estructura de seguimiento.</p></div>
          <div class="why-item"><span class="why-check" aria-hidden="true">✓</span><p>Alertas tempranas cuando una área se desconecta del resto.</p></div>
          <div class="why-item"><span class="why-check" aria-hidden="true">✓</span><p>Menos sorpresas para la dirección en auditorías o revisiones.</p></div>
          <div class="why-item"><span class="why-check" aria-hidden="true">✓</span><p>Procesos documentados y trazables en cada etapa.</p></div>
        </div>
      </div>
    </section>
''' + cta_section(
            '¿Necesitas supervisión estructurada?',
            'Agenda un Diagnóstico Empresarial y conocemos el estado actual de control de tu operación.',
            'agendar-diagnostico.html',
            'Agendar Diagnóstico',
        ) + '''
  </main>''',
    },
    'prevencion-fiscal-laboral.html': {
        'active': 'prevencion',
        'title': 'Prevención Fiscal y Laboral | MARU CORP',
        'description': 'Prevención de riesgos fiscales y laborales con supervisión integrada. Cumplimiento, defensa y control ante SAT, IMSS e INFONAVIT.',
        'body_class': 'page-inner page-prevencion',
        'content': '''
  <main class="page-main">
''' + hero_block(
            'Prevención Fiscal y Laboral',
            'Prevenir riesgos antes de que cuesten',
            'Supervisamos cumplimiento fiscal y laboral de forma integrada para reducir multas, contingencias y desconexión entre áreas.',
            'agendar-diagnostico.html',
            'Agendar Diagnóstico',
            'servfiscal.html',
            'Ver área fiscal',
        ) + '''
    <section class="section section--compact">
      <div class="container">
        <div class="section-header reveal">
          <span class="services-section-badge">Áreas de prevención</span>
          <h2>Control fiscal y laboral coordinado</h2>
          <p>Cuando fiscal y laboral operan desconectados, los riesgos se multiplican. Integramos ambas bajo supervisión.</p>
        </div>
        <div class="timeline reveal-stagger">
          <div class="timeline-step">
            <div class="timeline-num">1</div>
            <h3>Diagnóstico de riesgos</h3>
            <p>Identificamos brechas fiscales, laborales y de cumplimiento.</p>
          </div>
          <div class="timeline-step">
            <div class="timeline-num">2</div>
            <h3>Plan de prevención</h3>
            <p>Acciones correctivas y puntos de control priorizados.</p>
          </div>
          <div class="timeline-step">
            <div class="timeline-num">3</div>
            <h3>Supervisión continua</h3>
            <p>Seguimiento ante SAT, IMSS, INFONAVIT y obligaciones laborales.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section section--gray section--compact">
      <div class="container">
        <div class="section-header section-header--tight reveal">
          <h2>Áreas que integramos en la prevención</h2>
        </div>
        <nav class="related-pills reveal" aria-label="Áreas relacionadas">
          <a href="servfiscal.html"><img src="img/fiscal.png" alt="" width="20" height="20"> Fiscal</a>
          <a href="servlegal.html"><img src="img/legal.png" alt="" width="20" height="20"> Legal / Laboral</a>
          <a href="servnom.html"><img src="img/payroll.png" alt="" width="20" height="20"> Nómina</a>
          <a href="servconta.html"><img src="img/contabilidad2.png" alt="" width="20" height="20"> Contable</a>
        </nav>
      </div>
    </section>
''' + cta_section(
            '¿Tienes riesgos fiscales o laborales sin detectar?',
            'Solicita un Diagnóstico Empresarial y evaluamos tu exposición actual.',
            'agendar-diagnostico.html',
            'Agendar Diagnóstico',
        ) + '''
  </main>''',
    },
    'operacion-integrada.html': {
        'active': 'operacion',
        'title': 'Operación Integrada | MARU CORP',
        'description': 'Operación integrada de áreas fiscales, laborales, administrativas y operativas bajo una misma estructura empresarial con MARU CORP.',
        'body_class': 'page-inner page-operacion',
        'content': '''
  <main class="page-main">
''' + hero_block(
            'Operación Integrada',
            'Una sola estructura para todas tus áreas',
            'Operamos y coordinamos fiscal, laboral, administrativo, nómina, tecnología, comunicación e instalaciones bajo control unificado.',
            'agendar-diagnostico.html',
            'Agendar Diagnóstico',
            'supervision-empresarial.html',
            'Ver Supervisión Empresarial',
        ) + '''
    <section class="section section--compact" id="areas">
      <div class="container">
        <div class="section-header reveal">
          <span class="services-section-badge">7 áreas · una estructura</span>
          <h2>Áreas que operamos de forma integrada</h2>
          <p>Cada área deja de funcionar en silo y pasa a operar bajo la misma estructura de control.</p>
        </div>
        <nav class="related-pills reveal" aria-label="Áreas operativas">
          <a href="servconta.html"><img src="img/contabilidad2.png" alt="" width="20" height="20"> Contables</a>
          <a href="servlegal.html"><img src="img/legal.png" alt="" width="20" height="20"> Legales</a>
          <a href="servfiscal.html"><img src="img/fiscal.png" alt="" width="20" height="20"> Fiscales</a>
          <a href="servnom.html"><img src="img/payroll.png" alt="" width="20" height="20"> Nómina</a>
          <a href="servmark.html"><img src="img/marketing.png" alt="" width="20" height="20"> Marketing</a>
          <a href="servsis.html"><img src="img/sistemas.png" alt="" width="20" height="20"> Sistemas</a>
          <a href="servjard.html"><img src="img/jardineria.png" alt="" width="20" height="20"> Jardinería</a>
        </nav>
      </div>
    </section>
    <section class="section section--navy section--compact">
      <div class="container">
        <div class="section-header section-header--tight reveal">
          <h2>Por qué la operación integrada importa</h2>
        </div>
        <div class="why-grid reveal-stagger">
          <div class="why-item"><span class="why-check" aria-hidden="true">✓</span><p>Un solo punto de coordinación para todas las áreas críticas.</p></div>
          <div class="why-item"><span class="why-check" aria-hidden="true">✓</span><p>Menos errores por desconexión entre fiscal, laboral y administrativo.</p></div>
          <div class="why-item"><span class="why-check" aria-hidden="true">✓</span><p>Procesos alineados y visibles para la dirección.</p></div>
          <div class="why-item"><span class="why-check" aria-hidden="true">✓</span><p>Escalable conforme crece tu empresa.</p></div>
        </div>
      </div>
    </section>
''' + cta_section(
            '¿Tus áreas operan desconectadas?',
            'Conoce cómo MARU CORP puede integrar y operar tu estructura empresarial.',
            'agendar-diagnostico.html',
            'Agendar Diagnóstico',
        ) + '''
  </main>''',
    },
    'diagnostico-empresarial.html': {
        'active': 'diagnostico',
        'title': 'Diagnóstico Empresarial | MARU CORP',
        'description': 'El Diagnóstico Empresarial de MARU CORP evalúa desconexiones entre áreas, riesgos operativos y oportunidades de control integrado.',
        'body_class': 'page-inner page-diagnostico',
        'content': '''
  <main class="page-main">
''' + hero_block(
            'Diagnóstico Empresarial',
            'El primer paso para recuperar el control',
            'Evaluamos cómo operan tus áreas hoy, dónde hay desconexión y qué riesgos existen. Sin compromiso.',
            'agendar-diagnostico.html',
            'Agendar Diagnóstico',
            'https://wa.me/524422402238?text=Hola%2C%20quiero%20solicitar%20una%20Revisi%C3%B3n%20Estrat%C3%A9gica%20Inicial',
            'Solicitar Revisión Estratégica Inicial',
        ) + '''
    <section class="section section--compact">
      <div class="container">
        <div class="section-header reveal">
          <span class="services-section-badge">Qué incluye</span>
          <h2>Qué evaluamos en el diagnóstico</h2>
          <p>Un análisis estructurado para entender el estado de control de tu empresa.</p>
        </div>
        <div class="benefits-grid reveal-stagger">
          <div class="benefit-card">
            <div class="benefit-icon" aria-hidden="true">1</div>
            <h3>Mapa de áreas</h3>
            <p>Cómo operan fiscal, laboral, administrativo y operativo hoy.</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon" aria-hidden="true">2</div>
            <h3>Riesgos detectados</h3>
            <p>Brechas de cumplimiento, desconexiones y puntos críticos.</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon" aria-hidden="true">3</div>
            <h3>Recomendaciones</h3>
            <p>Propuesta de estructura de integración y supervisión.</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon" aria-hidden="true">4</div>
            <h3>Siguiente paso</h3>
            <p>Ruta clara para implementar control operativo integrado.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section section--gray section--compact">
      <div class="container">
        <div class="section-header section-header--tight reveal">
          <h2>Proceso del diagnóstico</h2>
        </div>
        <div class="timeline reveal-stagger">
          <div class="timeline-step">
            <div class="timeline-num">1</div>
            <h3>Conversación inicial</h3>
            <p>Conocemos tu empresa, tamaño y áreas actuales.</p>
          </div>
          <div class="timeline-step">
            <div class="timeline-num">2</div>
            <h3>Evaluación</h3>
            <p>Revisamos documentación y procesos clave.</p>
          </div>
          <div class="timeline-step">
            <div class="timeline-num">3</div>
            <h3>Informe y propuesta</h3>
            <p>Entregamos hallazgos y recomendaciones de estructura.</p>
          </div>
        </div>
      </div>
    </section>
''' + cta_section(
            '¿Listo para conocer el estado de tu operación?',
            'Agenda tu Diagnóstico Empresarial con nuestro equipo en Querétaro.',
            'agendar-diagnostico.html',
            'Agendar Diagnóstico',
        ) + '''
  </main>''',
    },
    'insights-empresariales.html': {
        'active': 'insights',
        'title': 'Insights Empresariales | MARU CORP',
        'description': 'Insights empresariales sobre control operativo, prevención de riesgos fiscales y laborales, y supervisión integrada para empresas en crecimiento.',
        'body_class': 'page-inner page-insights',
        'content': '''
  <main class="page-main">
''' + hero_block(
            'Insights Empresariales',
            'Conocimiento para decidir con control',
            'Artículos y análisis sobre operación empresarial, prevención de riesgos y supervisión integrada.',
            'agendar-diagnostico.html',
            'Agendar Diagnóstico',
        ) + '''
    <section class="section section--compact">
      <div class="container">
        <div class="section-header reveal">
          <span class="services-section-badge">Próximamente</span>
          <h2>Temas que abordaremos</h2>
          <p>Contenido estratégico para directivos y empresas en crecimiento.</p>
        </div>
        <div class="benefits-grid reveal-stagger">
          <article class="benefit-card">
            <div class="benefit-icon" aria-hidden="true">◆</div>
            <h3>Control operativo</h3>
            <p>Cómo evitar que las áreas trabajen desconectadas y pierdas visibilidad.</p>
          </article>
          <article class="benefit-card">
            <div class="benefit-icon" aria-hidden="true">◎</div>
            <h3>Riesgos fiscales</h3>
            <p>Señales de alerta y prevención antes de contingencias con el SAT.</p>
          </article>
          <article class="benefit-card">
            <div class="benefit-icon" aria-hidden="true">★</div>
            <h3>Cumplimiento laboral</h3>
            <p>Nómina, contratos e IMSS bajo supervisión integrada.</p>
          </article>
          <article class="benefit-card">
            <div class="benefit-icon" aria-hidden="true">✓</div>
            <h3>Crecimiento ordenado</h3>
            <p>Estructurar la operación conforme escala tu empresa.</p>
          </article>
        </div>
      </div>
    </section>
''' + cta_section(
            '¿Prefieres asesoría directa?',
            'Agenda un Diagnóstico Empresarial y resolvemos tus dudas con nuestro equipo.',
            'agendar-diagnostico.html',
            'Agendar Diagnóstico',
        ) + '''
  </main>''',
    },
}


def patch_existing_html(path, active_key):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    content = re.sub(
        r'  <header class="site-header" id="siteHeader">.*?</header>',
        build_header(active_key),
        content,
        count=1,
        flags=re.DOTALL,
    )
    content = re.sub(
        r'  <footer class="site-footer">.*?</footer>',
        build_footer(),
        content,
        count=1,
        flags=re.DOTALL,
    )
    content = content.replace('href="contacto.html"', 'href="agendar-diagnostico.html"')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Patched:', os.path.basename(path))


def create_agendar_from_contacto():
    src = os.path.join(ROOT, 'contacto.html')
    dst = os.path.join(ROOT, 'agendar-diagnostico.html')
    with open(src, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace(
        '<title>Contacto | MARU CORP — Agendar Diagnóstico Empresarial</title>',
        '<title>Agendar Diagnóstico | MARU CORP</title>',
    )
    content = content.replace(
        'class="page-inner page-contact"',
        'class="page-inner page-contact page-agendar"',
    )
    content = re.sub(
        r'  <header class="site-header" id="siteHeader">.*?</header>',
        build_header('agendar'),
        content,
        count=1,
        flags=re.DOTALL,
    )
    content = re.sub(
        r'  <footer class="site-footer">.*?</footer>',
        build_footer(),
        content,
        count=1,
        flags=re.DOTALL,
    )
    with open(dst, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Created: agendar-diagnostico.html')

    redirect = '''<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0; url=agendar-diagnostico.html">
  <link rel="canonical" href="agendar-diagnostico.html">
  <title>Redirigiendo…</title>
  <script>location.replace('agendar-diagnostico.html');</script>
</head>
<body><p><a href="agendar-diagnostico.html">Ir a Agendar Diagnóstico</a></p></body>
</html>
'''
    with open(src, 'w', encoding='utf-8') as f:
        f.write(redirect)
    print('Redirect: contacto.html → agendar-diagnostico.html')


def main():
    for filename, meta in PAGES.items():
        html = inner_page_shell(
            meta['title'],
            meta['description'],
            meta['body_class'],
            meta['active'],
            meta['content'],
        )
        out = os.path.join(ROOT, filename)
        with open(out, 'w', encoding='utf-8') as f:
            f.write(html)
        print('Created:', filename)

    create_agendar_from_contacto()

    patch_existing_html(os.path.join(ROOT, 'index.html'), 'inicio')
    for serv in glob.glob(os.path.join(ROOT, 'serv*.html')):
        patch_existing_html(serv, '')
    if os.path.exists(os.path.join(ROOT, 'somos.html')):
        patch_existing_html(os.path.join(ROOT, 'somos.html'), '')


if __name__ == '__main__':
    main()
