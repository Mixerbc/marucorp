<?php
/**
 * Entrada del admin: marucorp.com/admin
 * Si no hay sesión → login. Si hay sesión → listado de blogs.
 */
require __DIR__ . '/lib.php';
admin_start_session();

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password']) && !admin_is_logged_in()) {
    $password = (string) ($_POST['password'] ?? '');
    if (admin_login($password)) {
        header('Location: ./');
        exit;
    }
    $error = 'Contraseña incorrecta.';
}

if (!admin_is_logged_in()) {
    ?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin — MARU CORP</title>
  <link rel="stylesheet" href="../css/admin.css">
</head>
<body class="admin-login">
  <form class="admin-login-card" method="post" action="./" autocomplete="current-password">
    <p class="admin-kicker">MARU CORP</p>
    <h1>Panel de Insights</h1>
    <p class="admin-sub">Administra blogs, imágenes y contenido.</p>
    <?php if ($error): ?>
      <p class="admin-alert"><?= blog_h($error) ?></p>
    <?php endif; ?>
    <label for="password">Contraseña</label>
    <input type="password" id="password" name="password" required autofocus>
    <button type="submit" class="admin-btn admin-btn--primary">Entrar</button>
  </form>
</body>
</html>
    <?php
    exit;
}

$data = blogs_load();
$articles = $data['articles'];
usort($articles, function ($a, $b) {
    return strcmp((string) ($b['updatedAt'] ?? ''), (string) ($a['updatedAt'] ?? ''));
});

$flash = $_SESSION['flash'] ?? '';
unset($_SESSION['flash']);
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Blogs — Admin MARU CORP</title>
  <link rel="stylesheet" href="../css/admin.css">
</head>
<body class="admin-app">
  <header class="admin-top">
    <div>
      <p class="admin-kicker">MARU CORP · Admin</p>
      <h1>Insights / Blogs</h1>
    </div>
    <div class="admin-top-actions">
      <a class="admin-btn admin-btn--primary" href="edit.php">+ Nuevo blog</a>
      <a class="admin-btn" href="logout.php">Salir</a>
    </div>
  </header>

  <?php if ($flash): ?>
    <p class="admin-flash"><?= blog_h($flash) ?></p>
  <?php endif; ?>

  <section class="admin-panel">
    <div class="admin-panel-head">
      <h2>Todos los artículos (<?= count($articles) ?>)</h2>
      <a href="../insights-empresariales.html" target="_blank" rel="noopener">Ver sitio →</a>
    </div>

    <?php if (!$articles): ?>
      <p class="admin-empty">Aún no hay blogs. Crea el primero.</p>
    <?php else: ?>
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Título</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Actualizado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($articles as $article): ?>
              <?php
                $img = (string) ($article['coverImage'] ?? '');
                $imgUrl = $img !== '' ? '../' . ltrim($img, '/') : '';
                $updated = !empty($article['updatedAt']) ? date('d/m/Y H:i', strtotime($article['updatedAt'])) : '—';
              ?>
              <tr>
                <td>
                  <div class="admin-thumb<?= $imgUrl ? '' : ' is-empty' ?>">
                    <?php if ($imgUrl): ?>
                      <img src="<?= blog_h($imgUrl) ?>" alt="">
                    <?php else: ?>
                      <span>Sin imagen</span>
                    <?php endif; ?>
                  </div>
                </td>
                <td>
                  <strong><?= blog_h((string) $article['title']) ?></strong>
                  <small><?= blog_h((string) ($article['slug'] ?? '')) ?></small>
                </td>
                <td><?= blog_h((string) ($article['category'] ?? '')) ?></td>
                <td>
                  <span class="admin-status admin-status--<?= blog_h((string) ($article['status'] ?? 'draft')) ?>">
                    <?= blog_h((string) ($article['status'] ?? 'draft')) ?>
                  </span>
                </td>
                <td><?= blog_h($updated) ?></td>
                <td class="admin-actions">
                  <a class="admin-btn admin-btn--small" href="edit.php?id=<?= urlencode((string) $article['id']) ?>">Editar</a>
                  <a class="admin-btn admin-btn--small" href="<?= blog_h(blog_public_url($article)) ?>" target="_blank" rel="noopener">Ver</a>
                  <form method="post" action="delete.php" onsubmit="return confirm('¿Eliminar este blog?');">
                    <input type="hidden" name="csrf" value="<?= blog_h(admin_csrf_token()) ?>">
                    <input type="hidden" name="id" value="<?= blog_h((string) $article['id']) ?>">
                    <button type="submit" class="admin-btn admin-btn--small admin-btn--danger">Eliminar</button>
                  </form>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    <?php endif; ?>
  </section>
</body>
</html>
