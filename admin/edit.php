<?php
require __DIR__ . '/lib.php';
admin_require_login();

$cfg = admin_config();
$data = blogs_load();
$id = (string) ($_GET['id'] ?? '');
$article = $id !== '' ? blog_find($id) : null;
$isEdit = is_array($article);
$errors = [];

if (!$isEdit) {
    $article = [
        'id' => '',
        'slug' => '',
        'title' => '',
        'category' => $data['categories'][0] ?? 'Supervisión empresarial',
        'lead' => '',
        'excerpt' => '',
        'readingMinutes' => 5,
        'status' => 'draft',
        'coverImage' => '',
        'sections' => [
            ['heading' => '', 'content' => ''],
        ],
    ];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!admin_verify_csrf($_POST['csrf'] ?? null)) {
        $errors[] = 'Token de seguridad inválido. Recarga la página.';
    } else {
        $title = trim((string) ($_POST['title'] ?? ''));
        $slug = trim((string) ($_POST['slug'] ?? ''));
        $category = trim((string) ($_POST['category'] ?? ''));
        $lead = trim((string) ($_POST['lead'] ?? ''));
        $excerpt = trim((string) ($_POST['excerpt'] ?? ''));
        $status = ($_POST['status'] ?? 'draft') === 'published' ? 'published' : 'draft';
        $readingMinutes = max(1, (int) ($_POST['readingMinutes'] ?? 5));
        $removeImage = !empty($_POST['remove_image']);

        $headings = $_POST['section_heading'] ?? [];
        $contents = $_POST['section_content'] ?? [];
        $sections = [];
        if (is_array($headings) && is_array($contents)) {
            $count = max(count($headings), count($contents));
            for ($i = 0; $i < $count; $i++) {
                $h = trim((string) ($headings[$i] ?? ''));
                $c = trim((string) ($contents[$i] ?? ''));
                if ($h === '' && $c === '') {
                    continue;
                }
                $sections[] = ['heading' => $h, 'content' => $c];
            }
        }

        if ($title === '') {
            $errors[] = 'El título es obligatorio.';
        }
        if ($category === '') {
            $errors[] = 'La categoría es obligatoria.';
        }
        if ($excerpt === '') {
            $excerpt = $lead;
        }
        if ($lead === '') {
            $lead = $excerpt;
        }
        if ($slug === '') {
            $slug = blog_slugify($title);
        } else {
            $slug = blog_slugify($slug);
        }

        $coverImage = (string) ($article['coverImage'] ?? '');
        if ($removeImage && $coverImage !== '') {
            $old = dirname(__DIR__) . '/' . ltrim($coverImage, '/');
            if (is_file($old)) {
                @unlink($old);
            }
            $coverImage = '';
        }

        if (!empty($_FILES['cover']['name']) && is_uploaded_file($_FILES['cover']['tmp_name'])) {
            $file = $_FILES['cover'];
            if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
                $errors[] = 'No se pudo subir la imagen.';
            } elseif (($file['size'] ?? 0) > 3 * 1024 * 1024) {
                $errors[] = 'La imagen no debe superar 3 MB.';
            } else {
                $mime = null;
                if (class_exists('finfo')) {
                    $finfo = new finfo(FILEINFO_MIME_TYPE);
                    $mime = $finfo->file($file['tmp_name']);
                }
                $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                $map = [
                    'image/jpeg' => 'jpg',
                    'image/png' => 'png',
                    'image/webp' => 'webp',
                    'image/gif' => 'gif',
                ];
                $extMap = ['jpg' => 'jpg', 'jpeg' => 'jpg', 'png' => 'png', 'webp' => 'webp', 'gif' => 'gif'];
                if ($mime && isset($map[$mime])) {
                    $saveExt = $map[$mime];
                } elseif (isset($extMap[$ext])) {
                    $saveExt = $extMap[$ext];
                } else {
                    $errors[] = 'Formato de imagen no permitido. Usa JPG, PNG, WEBP o GIF.';
                    $saveExt = null;
                }
                if ($saveExt) {
                    $uploadDir = $cfg['uploads_dir'];
                    if (!is_dir($uploadDir)) {
                        mkdir($uploadDir, 0755, true);
                    }
                    $filename = $slug . '-' . date('YmdHis') . '.' . $saveExt;
                    $dest = $uploadDir . DIRECTORY_SEPARATOR . $filename;
                    if (!move_uploaded_file($file['tmp_name'], $dest)) {
                        $errors[] = 'Error al guardar la imagen.';
                    } else {
                        if ($coverImage !== '') {
                            $old = dirname(__DIR__) . '/' . ltrim($coverImage, '/');
                            if (is_file($old)) {
                                @unlink($old);
                            }
                        }
                        $coverImage = $cfg['uploads_url'] . '/' . $filename;
                    }
                }
            }
        }

        if (!$errors) {
            $articleId = $isEdit ? (string) $article['id'] : bin2hex(random_bytes(8));
            $slug = blog_unique_slug($slug, $articleId);
            $now = date('c');
            $newArticle = [
                'id' => $articleId,
                'slug' => $slug,
                'title' => $title,
                'category' => $category,
                'lead' => $lead,
                'excerpt' => $excerpt,
                'readingMinutes' => $readingMinutes,
                'status' => $status,
                'coverImage' => $coverImage,
                'sections' => $sections ?: [['heading' => 'Contenido', 'content' => '']],
                'createdAt' => $isEdit ? ($article['createdAt'] ?? $now) : $now,
                'updatedAt' => $now,
            ];

            $found = false;
            foreach ($data['articles'] as $i => $item) {
                if (($item['id'] ?? '') === $articleId) {
                    $data['articles'][$i] = $newArticle;
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                array_unshift($data['articles'], $newArticle);
            }

            if (!in_array($category, $data['categories'], true)) {
                $data['categories'][] = $category;
            }

            blogs_save($data);
            $_SESSION['flash'] = $isEdit ? 'Blog actualizado.' : 'Blog creado.';
            header('Location: ./');
            exit;
        }

        $article = array_merge($article, [
            'title' => $title,
            'slug' => $slug,
            'category' => $category,
            'lead' => $lead,
            'excerpt' => $excerpt,
            'readingMinutes' => $readingMinutes,
            'status' => $status,
            'coverImage' => $coverImage,
            'sections' => $sections ?: [['heading' => '', 'content' => '']],
        ]);
    }
}

$sections = $article['sections'] ?? [['heading' => '', 'content' => '']];
if (!$sections) {
    $sections = [['heading' => '', 'content' => '']];
}
$coverUrl = !empty($article['coverImage']) ? '../' . ltrim((string) $article['coverImage'], '/') : '';
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= $isEdit ? 'Editar' : 'Nuevo' ?> blog — Admin MARU CORP</title>
  <link rel="stylesheet" href="../css/admin.css">
</head>
<body class="admin-app">
  <header class="admin-top">
    <div>
      <p class="admin-kicker">MARU CORP · Admin</p>
      <h1><?= $isEdit ? 'Editar blog' : 'Nuevo blog' ?></h1>
    </div>
    <div class="admin-top-actions">
      <a class="admin-btn" href="index.php">← Volver</a>
    </div>
  </header>

  <?php if ($errors): ?>
    <div class="admin-flash admin-flash--error">
      <?php foreach ($errors as $err): ?>
        <p><?= blog_h($err) ?></p>
      <?php endforeach; ?>
    </div>
  <?php endif; ?>

  <form class="admin-form" method="post" enctype="multipart/form-data">
    <input type="hidden" name="csrf" value="<?= blog_h(admin_csrf_token()) ?>">

    <section class="admin-card">
      <h2>Datos principales</h2>
      <div class="admin-grid-2">
        <div class="admin-field">
          <label for="title">Título *</label>
          <input type="text" id="title" name="title" required value="<?= blog_h((string) $article['title']) ?>">
        </div>
        <div class="admin-field">
          <label for="slug">Slug (URL)</label>
          <input type="text" id="slug" name="slug" value="<?= blog_h((string) ($article['slug'] ?? '')) ?>" placeholder="se-genera-del-titulo">
        </div>
      </div>
      <div class="admin-grid-2">
        <div class="admin-field">
          <label for="category">Categoría *</label>
          <input list="categoryList" id="category" name="category" required value="<?= blog_h((string) $article['category']) ?>">
          <datalist id="categoryList">
            <?php foreach ($data['categories'] as $cat): ?>
              <option value="<?= blog_h((string) $cat) ?>"></option>
            <?php endforeach; ?>
          </datalist>
        </div>
        <div class="admin-field">
          <label for="readingMinutes">Minutos de lectura</label>
          <input type="number" id="readingMinutes" name="readingMinutes" min="1" max="60" value="<?= (int) $article['readingMinutes'] ?>">
        </div>
      </div>
      <div class="admin-grid-2">
        <div class="admin-field">
          <label for="status">Estado</label>
          <select id="status" name="status">
            <option value="draft" <?= ($article['status'] ?? '') === 'draft' ? 'selected' : '' ?>>Borrador</option>
            <option value="published" <?= ($article['status'] ?? '') === 'published' ? 'selected' : '' ?>>Publicado</option>
          </select>
        </div>
      </div>
      <div class="admin-field">
        <label for="excerpt">Extracto (listado) *</label>
        <textarea id="excerpt" name="excerpt" rows="3" required><?= blog_h((string) ($article['excerpt'] ?? '')) ?></textarea>
      </div>
      <div class="admin-field">
        <label for="lead">Entrada / lead del artículo</label>
        <textarea id="lead" name="lead" rows="3"><?= blog_h((string) ($article['lead'] ?? '')) ?></textarea>
      </div>
    </section>

    <section class="admin-card">
      <h2>Imagen de portada</h2>
      <div class="admin-cover">
        <div class="admin-cover-preview<?= $coverUrl ? '' : ' is-empty' ?>" id="coverPreview">
          <?php if ($coverUrl): ?>
            <img src="<?= blog_h($coverUrl) ?>" alt="Portada actual" id="coverPreviewImg">
          <?php else: ?>
            <span id="coverPreviewText">Sin imagen</span>
            <img src="" alt="" id="coverPreviewImg" hidden>
          <?php endif; ?>
        </div>
        <div class="admin-field">
          <label for="cover">Subir imagen (JPG, PNG, WEBP, GIF · máx. 3 MB)</label>
          <input type="file" id="cover" name="cover" accept="image/jpeg,image/png,image/webp,image/gif">
          <?php if ($coverUrl): ?>
            <label class="admin-check">
              <input type="checkbox" name="remove_image" value="1"> Quitar imagen actual
            </label>
          <?php endif; ?>
        </div>
      </div>
    </section>

    <section class="admin-card">
      <div class="admin-card-head">
        <h2>Contenido del blog</h2>
        <button type="button" class="admin-btn" id="addSection">+ Sección</button>
      </div>
      <p class="admin-help">Agrega bloques de título + párrafo. Puedes crear varias secciones.</p>
      <div id="sections" class="admin-sections">
        <?php foreach ($sections as $i => $section): ?>
          <div class="admin-section">
            <div class="admin-section-head">
              <strong>Sección <?= $i + 1 ?></strong>
              <button type="button" class="admin-btn admin-btn--small admin-btn--danger js-remove-section">Quitar</button>
            </div>
            <div class="admin-field">
              <label>Subtítulo / H2</label>
              <input type="text" name="section_heading[]" value="<?= blog_h((string) ($section['heading'] ?? '')) ?>">
            </div>
            <div class="admin-field">
              <label>Texto</label>
              <textarea name="section_content[]" rows="5"><?= blog_h((string) ($section['content'] ?? '')) ?></textarea>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </section>

    <div class="admin-form-actions">
      <button type="submit" class="admin-btn admin-btn--primary"><?= $isEdit ? 'Guardar cambios' : 'Crear blog' ?></button>
      <a class="admin-btn" href="index.php">Cancelar</a>
    </div>
  </form>

  <template id="sectionTemplate">
    <div class="admin-section">
      <div class="admin-section-head">
        <strong>Nueva sección</strong>
        <button type="button" class="admin-btn admin-btn--small admin-btn--danger js-remove-section">Quitar</button>
      </div>
      <div class="admin-field">
        <label>Subtítulo / H2</label>
        <input type="text" name="section_heading[]" value="">
      </div>
      <div class="admin-field">
        <label>Texto</label>
        <textarea name="section_content[]" rows="5"></textarea>
      </div>
    </div>
  </template>

  <script src="../js/admin.js"></script>
</body>
</html>
