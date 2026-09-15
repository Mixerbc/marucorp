<?php
/**
 * Vista pública de un Insight / blog.
 * Uso: insight.php?slug=mi-articulo
 */
require __DIR__ . '/admin/lib.php';

$slug = trim((string) ($_GET['slug'] ?? ''));
$article = $slug !== '' ? blog_find($slug) : null;

if (!$article || ($article['status'] ?? '') !== 'published') {
    http_response_code(404);
    echo '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>No encontrado</title></head><body style="font-family:sans-serif;padding:2rem"><h1>Artículo no encontrado</h1><p><a href="insights-empresariales.html">Volver a Insights</a></p></body></html>';
    exit;
}

$title = (string) $article['title'];
$lead = (string) ($article['lead'] ?: $article['excerpt'] ?? '');
$category = (string) ($article['category'] ?? '');
$minutes = (int) ($article['readingMinutes'] ?? 5);
$cover = (string) ($article['coverImage'] ?? '');
$sections = $article['sections'] ?? [];
$coverUrl = $cover !== '' ? ltrim($cover, '/') : '';
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="img/favicon.png" type="image/png">
  <title><?= blog_h($title) ?> | Insights — MARU CORP</title>
  <meta name="description" content="<?= blog_h($lead) ?>">
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/brand-premium.css">
  <link rel="stylesheet" href="css/insights-page.css?v=70">
  <link rel="stylesheet" href="css/header.css?v=70">
  <link rel="stylesheet" href="css/custom-cursor.css">
  <link rel="stylesheet" href="css/pages-enhanced.css?v=68">
  <link rel="stylesheet" href="css/page-layout.css?v=3">
  <link rel="stylesheet" href="css/inner-pages.css?v=67">
  <link rel="stylesheet" href="css/responsive.css?v=70">
  <style>
    .article-cover {
      max-width: 880px;
      margin: 0 auto 1.5rem;
      border-radius: 1rem;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 16px 36px rgba(0,0,0,0.2);
    }
    .article-cover img {
      display: block;
      width: 100%;
      height: auto;
      max-height: 420px;
      object-fit: cover;
    }
  </style>
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
      <a href="index.html" class="logo logo--brand">
        <span class="logo-mark"><img src="img/favicon.png" alt=""></span>
        <span class="logo-text">
          <span class="logo-text-name"><strong>MARU</strong> CORP</span>
          <span class="logo-text-tag">Control empresarial integrado</span>
        </span>
      </a>
      <nav class="main-nav" aria-label="Navegación principal">
        <a href="index.html">Inicio</a>
        <a href="supervision-empresarial.html">Supervisión Empresarial</a>
        <a href="prevencion-fiscal-laboral.html">Prevención Fiscal y Laboral</a>
        <a href="operacion-integrada.html">Operación Integrada</a>
        <a href="diagnostico-empresarial.html">Diagnóstico Empresarial</a>
        <a href="insights-empresariales.html" class="is-active">Insights Empresariales</a>
      </nav>
      <a href="agendar-diagnostico.html#formulario" class="btn btn-gold header-cta">Agendar Diagnóstico <span class="arrow">→</span></a>
      <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span><span></span></button>
      </div>
    </div>
    <nav class="mobile-nav" aria-label="Menú móvil">
      <div class="mobile-nav-links">
        <a href="index.html">Inicio</a>
        <a href="supervision-empresarial.html">Supervisión Empresarial</a>
        <a href="prevencion-fiscal-laboral.html">Prevención Fiscal y Laboral</a>
        <a href="operacion-integrada.html">Operación Integrada</a>
        <a href="diagnostico-empresarial.html">Diagnóstico Empresarial</a>
        <a href="insights-empresariales.html">Insights Empresariales</a>
      </div>
      <a href="agendar-diagnostico.html#formulario" class="btn btn-gold mobile-nav-cta">Agendar Diagnóstico <span class="arrow">→</span></a>
    </nav>
  </header>

  <main class="page-main">
    <section class="page-hero page-hero--rich page-hero--compact">
      <div class="page-hero-bg" aria-hidden="true">
        <div class="page-hero-orb page-hero-orb--1"></div>
      </div>
      <div class="container">
        <nav class="article-breadcrumb reveal" aria-label="Ruta de navegación">
          <a href="insights-empresariales.html">Insights Empresariales</a>
        </nav>
        <header class="article-header reveal">
          <div class="article-header__meta">
            <span class="article-header__category"><?= blog_h($category) ?></span>
            <span class="article-header__time">Lectura estimada: <?= $minutes ?> min</span>
          </div>
          <h1><?= blog_h($title) ?></h1>
          <?php if ($lead !== ''): ?>
            <p class="article-header__lead"><?= blog_h($lead) ?></p>
          <?php endif; ?>
        </header>
      </div>
    </section>

    <section class="article-content">
      <div class="container">
        <?php if ($coverUrl): ?>
          <figure class="article-cover reveal">
            <img src="<?= blog_h($coverUrl) ?>" alt="<?= blog_h($title) ?>" loading="lazy">
          </figure>
        <?php endif; ?>
        <article class="article-prose reveal">
          <?php foreach ($sections as $section): ?>
            <?php if (!empty($section['heading'])): ?>
              <h2><?= blog_h((string) $section['heading']) ?></h2>
            <?php endif; ?>
            <?php if (!empty($section['content'])): ?>
              <?php foreach (preg_split("/\n{2,}/", (string) $section['content']) as $para): ?>
                <?php if (trim($para) !== ''): ?>
                  <p><?= nl2br(blog_h(trim($para))) ?></p>
                <?php endif; ?>
              <?php endforeach; ?>
            <?php endif; ?>
          <?php endforeach; ?>
        </article>
        <p class="article-back reveal"><a href="insights-empresariales.html">← Volver a Insights Empresariales</a></p>
      </div>
    </section>

    <section class="insights-cta" aria-labelledby="cta-title">
      <div class="container insights-cta-inner reveal">
        <h2 id="cta-title">Agenda un Diagnóstico Empresarial</h2>
        <p>Evalúa el estado de control de tu operación con nuestro equipo. Sin compromiso.</p>
        <a href="agendar-diagnostico.html#formulario" class="btn btn-gold">Agendar Diagnóstico Empresarial <span class="arrow">→</span></a>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-bottom">
        <p>Todos los derechos reservados © <span id="year"></span> | Editado por Disidente Creativo</p>
      </div>
    </div>
  </footer>
  <script>document.getElementById('year').textContent = new Date().getFullYear();</script>
  <script src="js/main.js"></script>
  <script src="js/custom-cursor.js"></script>
</body>
</html>
