# -*- coding: utf-8 -*-
"""Genera páginas de artículos en insights/."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "insights"
OUT.mkdir(exist_ok=True)

ARTICLES = [
    {
        "slug": "5-senales-perdiendo-control-operativo",
        "title": "5 señales de que tu empresa está perdiendo control operativo",
        "excerpt": "Cuando las áreas funcionan sin supervisión transversal, la dirección pierde visibilidad. Estas señales indican que tu empresa necesita una capa de control.",
        "category": "Supervisión empresarial",
        "read_time": "5 min",
        "sections": [
            ("Introducción", "Una empresa puede tener ventas activas, personal contratado y proveedores cumpliendo entregables, y aun así perder control operativo. El problema no siempre es visible de inmediato: se acumula en procesos desconectados, reportes fragmentados y decisiones tomadas sin información consolidada."),
            ("1. La dirección descubre problemas tarde", "Si te enteras de un riesgo fiscal, laboral o administrativo cuando ya generó impacto — multa, conflicto o revisión — es señal de que no existe supervisión transversal. La dirección debería tener alertas tempranas, no sorpresas."),
            ("2. Cada proveedor reporta por su cuenta", "Contador, abogado, nómina y administración entregan información por separado. Nadie conecta esos reportes para darte una lectura integrada del negocio."),
            ("3. Errores recurrentes en las mismas áreas", "Cuando los mismos fallos se repiten en nómina, cumplimiento o documentación, el problema no es puntual: es estructural. Falta seguimiento y puntos de control."),
            ("4. El dueño resuelve temas operativos", "Si la dirección general termina atendiendo tareas que deberían estar estructuradas, la empresa depende de una sola persona como único punto de control."),
            ("5. Crecimiento sin estructura formal", "Más operación, más personal y más proveedores — pero sin una lógica de coordinación. El crecimiento acelerado sin supervisión es una de las causas más frecuentes de descontrol."),
            ("Qué hacer", "La supervisión empresarial no sustituye a la dirección: le da visibilidad para decidir mejor. Si reconoces varias de estas señales, un diagnóstico preventivo puede ayudarte a evaluar el estado real de control de tu operación."),
        ],
    },
    {
        "slug": "varios-proveedores-riesgos-administrativos",
        "title": "Por qué tener varios proveedores puede aumentar tus riesgos administrativos",
        "excerpt": "Contratar especialistas por área no garantiza control. Sin coordinación central, los riesgos administrativos pueden multiplicarse en lugar de reducirse.",
        "category": "Operación integrada",
        "read_time": "6 min",
        "sections": [
            ("El mito del especialista aislado", "Muchas empresas creen que contratar al mejor contador, al mejor abogado laboral y al mejor proveedor de nómina es suficiente. En la práctica, cada uno optimiza su área sin necesariamente alinearla con el resto."),
            ("Duplicidad y vacíos", "Con varios proveedores sin coordinación pueden coexistir tareas duplicadas y, al mismo tiempo, áreas que nadie supervisa. La contabilidad puede no coincidir con la nómina; el fiscal puede no reflejar la operación real."),
            ("Información fragmentada", "Cada proveedor entrega reportes parciales. La dirección recibe piezas del rompecabezas, pero no una visión integrada. Eso dificulta detectar riesgos antes de que escalen."),
            ("Responsabilidad difusa", "Cuando algo falla, cada proveedor señala al otro. Sin un punto central de coordinación, nadie asume la supervisión transversal que la empresa necesita."),
            ("La alternativa: operación integrada", "MARU CORP no reemplaza especialistas: los coordina bajo una estructura de control. La operación integrada conecta administración, contabilidad, fiscal, nómina y procesos para reducir riesgos y dar claridad a la dirección."),
        ],
    },
    {
        "slug": "errores-invisibles-nomina",
        "title": "Errores invisibles en nómina que pueden afectar a empresas en crecimiento",
        "excerpt": "La nómina conecta laboral, fiscal e IMSS. Errores que parecen menores pueden acumular exposición significativa en empresas que crecen rápido.",
        "category": "Prevención fiscal y laboral",
        "read_time": "5 min",
        "sections": [
            ("Nómina: más que un cálculo quincenal", "La nómina no es solo pagar salarios. Es el punto donde convergen obligaciones laborales, fiscales y de seguridad social. Cuando crece el personal sin estructura, los errores se vuelven invisibles hasta una auditoría."),
            ("Errores frecuentes", "Movimientos afiliatorios tardíos, prestaciones mal registradas, incidencias sin documentación, diferencias entre nómina y contabilidad, y cuotas de IMSS o INFONAVIT no conciliadas son fallos comunes en empresas en expansión."),
            ("Por qué pasan desapercibidos", "Mientras no haya revisión de autoridad, los errores se acumulan. Cada quincena parece cumplida, pero las diferencias crecen en silencio."),
            ("Impacto real", "Multas, diferencias en auditorías, conflictos laborales y contingencias fiscales pueden originarse en una nómina mal supervisada. El costo supera con creces el de prevenir."),
            ("Prevención coordinada", "Supervisar nómina como parte de un sistema — conectada con contabilidad, fiscal y legal — permite detectar desviaciones antes de que se conviertan en contingencias."),
        ],
    },
    {
        "slug": "revisar-antes-problema-laboral",
        "title": "Qué revisar antes de que un problema laboral se convierta en contingencia",
        "excerpt": "Un checklist preventivo para evaluar contratos, nómina, prestaciones e IMSS antes de que un conflicto laboral genere costos mayores.",
        "category": "Prevención fiscal y laboral",
        "read_time": "6 min",
        "sections": [
            ("La prevención laboral empieza antes del conflicto", "Muchos problemas laborales no aparecen de un día para otro. Se originan en contratos incompletos, prácticas inconsistentes y documentación deficiente que nadie revisa de forma sistemática."),
            ("Contratos y relaciones laborales", "Verifica que cada relación laboral tenga contrato vigente, definición clara de prestaciones y políticas alineadas a la normativa. Contratos desactualizados son una de las fuentes más comunes de contingencia."),
            ("Nómina e incidencias", "Permisos, faltas, horas extra y ajustes deben tener respaldo documental. Sin trazabilidad, cualquier conflicto se complica."),
            ("IMSS e INFONAVIT", "Altas, bajas y modificaciones salariales deben estar en plazo. Cuotas conciliadas con la nómina real. Retenciones de INFONAVIT con seguimiento activo."),
            ("Expedientes y cumplimiento", "Cada colaborador debe tener expediente completo. Obligaciones ante STPS, reparto de utilidades y registros internos deben estar al día."),
            ("Siguiente paso", "Si no tienes claridad sobre el estado de estos puntos, un diagnóstico preventivo puede identificar brechas antes de que generen conflictos costosos."),
        ],
    },
    {
        "slug": "empresa-necesita-supervision",
        "title": "Cómo saber si tu empresa necesita supervisión empresarial",
        "excerpt": "Criterios claros para evaluar si tu empresa opera con suficiente visibilidad o necesita una capa de control transversal.",
        "category": "Supervisión empresarial",
        "read_time": "4 min",
        "sections": [
            ("Supervisión no es lo mismo que contratar servicios", "Tener contador, abogado y nómina no equivale a tener supervisión empresarial. La supervisión observa cómo se conectan las áreas críticas y alerta a la dirección antes de que los errores escalen."),
            ("Señales de que la necesitas", "Tu empresa puede necesitar supervisión si: descubres problemas tarde, no tienes visión consolidada, los errores se repiten, el dueño es el único punto de control, o creces sin estructura formal de seguimiento."),
            ("Para quién es", "Empresas en crecimiento con múltiples áreas activas, varios proveedores, operación compleja y dirección que necesita visibilidad — no más tareas administrativas."),
            ("Qué aporta MARU CORP", "Una capa de control directivo que conecta administración, contabilidad, fiscal, nómina, legal, procesos y operación. No sustituye a la dirección: le da mayor claridad para decidir."),
        ],
    },
    {
        "slug": "crecimiento-desordenado-empresas-medianas",
        "title": "Crecimiento desordenado: el riesgo silencioso de las empresas medianas",
        "excerpt": "Escalar ventas y operación sin estructura de control es uno de los riesgos más subestimados. Analizamos por qué ocurre y cómo prevenirlo.",
        "category": "Supervisión empresarial",
        "read_time": "6 min",
        "sections": [
            ("El éxito comercial puede ocultar desorden operativo", "Las empresas medianas suelen crecer en ventas y personal más rápido de lo que estructuran su control interno. Mientras facturan más, acumulan riesgos invisibles en fiscal, laboral y administración."),
            ("Síntomas del crecimiento desordenado", "Más proveedores sin coordinación, procesos informales que ya no escalan, dirección absorbida por lo operativo, y falta de indicadores para tomar decisiones con anticipación."),
            ("El costo del silencio", "Los riesgos no desaparecen: se acumulan. Una revisión fiscal, auditoría de IMSS o conflicto laboral puede revelar años de desalineación que nadie supervisó."),
            ("Estructurar sin frenar el crecimiento", "La supervisión empresarial y la operación integrada permiten crecer con orden: conectando áreas, definiendo puntos de control y dando visibilidad a la dirección sin detener la operación."),
        ],
    },
    {
        "slug": "servicios-administrativos-vs-control-empresarial",
        "title": "Diferencia entre contratar servicios administrativos y tener control empresarial",
        "excerpt": "Contratar servicios resuelve tareas. El control empresarial da visibilidad, coordinación y prevención. Son enfoques distintos con resultados muy diferentes.",
        "category": "Operación integrada",
        "read_time": "5 min",
        "sections": [
            ("Servicios administrativos: tareas puntuales", "Un despacho contable, un proveedor de nómina o un abogado laboral resuelven entregables de su especialidad. Cumplen su función, pero no necesariamente supervisan cómo encaja en la operación total."),
            ("Control empresarial: visión transversal", "El control empresarial observa la conexión entre áreas. Detecta cuando fiscal, laboral y administración dejan de alinearse. Alerta a la dirección antes de que los errores escalen."),
            ("Comparación práctica", "Servicios: declaras, pagas nómina, firmas contratos. Control: verificas que todo esté alineado, que no haya brechas entre áreas y que la dirección tenga información consolidada para decidir."),
            ("Posicionamiento MARU CORP", "No somos un proveedor administrativo más. Somos la estructura que integra, supervisa y coordina las áreas críticas bajo una lógica de control directivo."),
        ],
    },
    {
        "slug": "conectar-contabilidad-nomina-administracion",
        "title": "La importancia de conectar contabilidad, nómina y administración",
        "excerpt": "Cuando estas tres áreas operan aisladas, la empresa pierde trazabilidad, acumula errores y la dirección pierde claridad sobre su operación real.",
        "category": "Operación integrada",
        "read_time": "5 min",
        "sections": [
            ("Tres áreas, un mismo flujo de información", "Contabilidad, nómina y administración comparten datos constantemente: movimientos de personal, gastos, provisiones, cumplimiento y documentación. Cuando operan en silos, la información se fragmenta."),
            ("Consecuencias de la desconexión", "Registros contables que no reflejan la nómina real, gastos administrativos sin respaldo, provisiones laborales incorrectas y reportes que no coinciden entre sí."),
            ("Beneficios de la integración", "Trazabilidad completa, menos errores, cumplimiento coordinado y reportes confiables para la dirección. La operación integrada elimina duplicidad y mejora el seguimiento."),
            ("Cómo lograrlo", "Requiere una estructura de coordinación — no solo buenos proveedores por separado. MARU CORP conecta estas áreas bajo supervisión transversal y puntos de control definidos."),
        ],
    },
    {
        "slug": "riesgos-fiscales-procesos-desordenados",
        "title": "Riesgos fiscales que nacen de procesos internos mal coordinados",
        "excerpt": "No todos los riesgos fiscales vienen del SAT. Muchos se originan en procesos administrativos desordenados, documentación incompleta y falta de seguimiento entre áreas.",
        "category": "Prevención fiscal y laboral",
        "read_time": "6 min",
        "sections": [
            ("El origen invisible del riesgo fiscal", "Las empresas suelen pensar en riesgo fiscal como multas o revisiones del SAT. Pero muchos problemas nacen antes: en procesos internos mal coordinados que nadie supervisa."),
            ("Ejemplos frecuentes", "CFDI sin respaldo operativo, discrepancias entre contabilidad y declaraciones, retenciones mal calculadas, operaciones sin sustento documental e incumplimientos acumulados sin calendario de control."),
            ("La raíz: falta de coordinación", "Cuando contabilidad, fiscal y administración no comparten la misma lógica de operación, los errores se acumulan. Cada área cumple parcialmente, pero el sistema falla."),
            ("Prevención integrada", "Detectar estos puntos antes de una revisión requiere visión transversal. La prevención fiscal y laboral de MARU CORP busca esas brechas en la operación, no solo en las declaraciones."),
        ],
    },
    {
        "slug": "dueno-unico-punto-control",
        "title": "Por qué el dueño no debería ser el único punto de control de la empresa",
        "excerpt": "Cuando toda la operación depende del dueño para resolver desconexiones, la empresa tiene un cuello de botella estructural que limita su crecimiento.",
        "category": "Supervisión empresarial",
        "read_time": "5 min",
        "sections": [
            ("El dueño como filtro de todo", "En muchas empresas medianas, el dueño o director general es quien detecta errores, coordina proveedores, resuelve conflictos y toma decisiones operativas. Funciona al inicio, pero no escala."),
            ("Riesgos de centralizar el control", "Cuellos de botella, decisiones retrasadas, información que no fluye, dependencia excesiva de una persona y imposibilidad de crecer con orden."),
            ("Control no es hacer todo", "El control empresarial distribuye responsabilidades, define puntos de seguimiento y da visibilidad a la dirección sin que el dueño tenga que resolver cada desconexión."),
            ("Supervisión como capa de apoyo", "MARU CORP actúa como capa de control que conecta áreas críticas. La dirección mantiene la decisión final, pero deja de ser el único punto donde se detectan y corrigen errores."),
        ],
    },
]

HEADER = """<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="../img/favicon.png" type="image/png">
  <title>{title} | Insights — MARU CORP</title>
  <meta name="description" content="{excerpt}">
  <link rel="stylesheet" href="../css/styles.css">
  <link rel="stylesheet" href="../css/brand-premium.css">
  <link rel="stylesheet" href="../css/insights-page.css">
  <link rel="stylesheet" href="../css/header.css">
  <link rel="stylesheet" href="../css/custom-cursor.css">
  <link rel="stylesheet" href="../css/pages-enhanced.css">
  <link rel="stylesheet" href="../css/page-layout.css">
  <link rel="stylesheet" href="../css/inner-pages.css">
  <link rel="stylesheet" href="../css/responsive.css">
</head>
<body class="page-inner page-article">
  <div class="inner-ambient" aria-hidden="true">
    <span class="inner-blob inner-blob--1"></span>
    <span class="inner-blob inner-blob--2"></span>
    <span class="inner-blob inner-blob--3"></span>
  </div>
  <header class="site-header" id="siteHeader">
    <div class="header-shell">
      <div class="header-inner">
      <a href="../index.html" class="logo logo--brand">
        <span class="logo-mark"><img src="../img/favicon.png" alt=""></span>
        <span class="logo-text">
          <span class="logo-text-name"><strong>MARU</strong> CORP</span>
          <span class="logo-text-tag">Control empresarial integrado</span>
        </span>
      </a>
      <nav class="main-nav" aria-label="Navegación principal">
        <a href="../index.html" class="nav-link">Inicio</a>
        <a href="../supervision-empresarial.html" class="nav-link">Supervisión Empresarial</a>
        <a href="../prevencion-fiscal-laboral.html" class="nav-link">Prevención Fiscal y Laboral</a>
        <a href="../operacion-integrada.html" class="nav-link">Operación Integrada</a>
        <a href="../diagnostico-empresarial.html" class="nav-link">Diagnóstico Empresarial</a>
        <a href="../insights-empresariales.html" class="nav-link active">Insights Empresariales</a>
      </nav>
      <a href="../agendar-diagnostico.html" class="btn btn-gold btn-sm header-cta">Agendar Diagnóstico <span class="arrow">→</span></a>
      <button type="button" class="nav-toggle" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span><span></span></button>
      </div>
    </div>
    <nav class="mobile-nav" aria-label="Menú móvil">
      <div class="mobile-nav-links">
      <a href="../index.html">Inicio</a>
      <a href="../supervision-empresarial.html">Supervisión Empresarial</a>
      <a href="../prevencion-fiscal-laboral.html">Prevención Fiscal y Laboral</a>
      <a href="../operacion-integrada.html">Operación Integrada</a>
      <a href="../diagnostico-empresarial.html">Diagnóstico Empresarial</a>
      <a href="../insights-empresariales.html" class="active">Insights Empresariales</a>
      </div>
      <a href="../agendar-diagnostico.html" class="btn btn-gold mobile-nav-cta">Agendar Diagnóstico <span class="arrow">→</span></a>
    </nav>
  </header>

  <main class="page-main">
    <section class="page-hero page-hero--rich page-hero--compact">
      <div class="page-hero-bg" aria-hidden="true">
        <div class="page-hero-orb page-hero-orb--1"></div>
      </div>
      <div class="container">
        <nav class="article-breadcrumb reveal" aria-label="Ruta de navegación">
          <a href="../insights-empresariales.html">Insights Empresariales</a>
        </nav>
        <header class="article-header reveal">
          <div class="article-header__meta">
            <span class="article-header__category">{category}</span>
            <span class="article-header__time">Lectura estimada: {read_time}</span>
          </div>
          <h1>{title}</h1>
          <p class="article-header__lead">{excerpt}</p>
        </header>
      </div>
    </section>

    <section class="article-content">
      <div class="container">
        <article class="article-prose reveal">
{body}
        </article>
        <p class="article-back reveal"><a href="../insights-empresariales.html">← Volver a Insights Empresariales</a></p>
      </div>
    </section>

    <section class="insights-cta" aria-labelledby="cta-title">
      <div class="container insights-cta-inner reveal">
        <h2 id="cta-title">Agenda un Diagnóstico Empresarial</h2>
        <p>Evalúa el estado de control de tu operación con nuestro equipo. Sin compromiso.</p>
        <a href="../agendar-diagnostico.html" class="btn btn-gold">Agendar Diagnóstico Empresarial <span class="arrow">→</span></a>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="../img/logo.png" alt="MARU CORP">
          <p class="tagline">Operación, supervisión y control estratégico.</p>
          <p>Integramos, operamos y supervisamos áreas fiscales, laborales, administrativas y operativas bajo una misma estructura.</p>
        </div>
        <div class="footer-col">
          <h4>Navegación</h4>
          <a href="../index.html">Inicio</a>
          <a href="../supervision-empresarial.html">Supervisión Empresarial</a>
          <a href="../prevencion-fiscal-laboral.html">Prevención Fiscal y Laboral</a>
          <a href="../operacion-integrada.html">Operación Integrada</a>
          <a href="../diagnostico-empresarial.html">Diagnóstico Empresarial</a>
          <a href="../insights-empresariales.html">Insights Empresariales</a>
          <a href="../agendar-diagnostico.html">Agendar Diagnóstico</a>
        </div>
        <div class="footer-col">
          <h4>Áreas operativas</h4>
          <a href="../servconta.html">Contables</a>
          <a href="../servlegal.html">Legales</a>
          <a href="../servfiscal.html">Fiscales</a>
          <a href="../servnom.html">Nómina</a>
          <a href="../servmark.html">Marketing</a>
          <a href="../servsis.html">Sistemas</a>
          <a href="../servjard.html">Jardinería</a>
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
  </footer>
  <a href="https://wa.me/524422402238?text=Hola%2C%20quiero%20hablar%20con%20un%20asesor%20de%20MARU%20CORP" class="whatsapp-float" aria-label="Hablar con un asesor por WhatsApp" target="_blank" rel="noopener">
    <span class="whatsapp-float__ring" aria-hidden="true"></span>
    <span class="whatsapp-float__ring whatsapp-float__ring--delay" aria-hidden="true"></span>
    <img src="../img/whatsapp.svg" alt="" width="30" height="30" class="whatsapp-float__icon">
    <span class="whatsapp-float__label">¿Chateamos?</span>
  </a>
  <script>document.getElementById('year').textContent = new Date().getFullYear();</script>
  <script src="../js/main.js"></script>
  <script src="../js/custom-cursor.js"></script>
</body>
</html>
"""


def build_body(sections):
    parts = []
    for heading, text in sections:
        if heading in ("Introducción",):
            parts.append(f"          <p>{text}</p>")
        else:
            parts.append(f"          <h2>{heading}</h2>\n          <p>{text}</p>")
    return "\n".join(parts)


def card_html(a, index):
    return f"""          <article class="article-card reveal">
            <div class="article-card__visual" aria-hidden="true"></div>
            <div class="article-card__body">
              <div class="article-card__meta">
                <span class="article-card__category">{a['category']}</span>
                <span class="article-card__time">{a['read_time']} de lectura</span>
              </div>
              <h2>{a['title']}</h2>
              <p class="article-card__excerpt">{a['excerpt']}</p>
              <a href="insights/{a['slug']}.html" class="article-card__link">Leer más <span aria-hidden="true">→</span></a>
            </div>
          </article>"""


def main():
    for a in ARTICLES:
        html = HEADER.format(
            title=a["title"],
            excerpt=a["excerpt"],
            category=a["category"],
            read_time=a["read_time"],
            body=build_body(a["sections"]),
        )
        path = OUT / f"{a['slug']}.html"
        path.write_text(html, encoding="utf-8")
        print("wrote", path.name)

    cards = "\n".join(card_html(a, i) for i, a in enumerate(ARTICLES))
    listing_path = ROOT / "insights-empresariales.html"
    text = listing_path.read_text(encoding="utf-8")
    # We'll replace main content manually via separate update
    print("articles:", len(ARTICLES))


if __name__ == "__main__":
    main()
