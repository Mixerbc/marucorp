<?php
require __DIR__ . '/lib.php';
admin_require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !admin_verify_csrf($_POST['csrf'] ?? null)) {
    http_response_code(400);
    exit('Solicitud inválida');
}

$id = (string) ($_POST['id'] ?? '');
$data = blogs_load();
$next = [];
$deletedImage = '';

foreach ($data['articles'] as $article) {
    if (($article['id'] ?? '') === $id) {
        $deletedImage = (string) ($article['coverImage'] ?? '');
        continue;
    }
    $next[] = $article;
}

$data['articles'] = $next;
blogs_save($data);

if ($deletedImage !== '') {
    $path = dirname(__DIR__) . '/' . ltrim(str_replace(['..', '\\'], '', $deletedImage), '/');
    if (is_file($path) && strpos(str_replace('\\', '/', realpath($path) ?: ''), '/uploads/blogs') !== false) {
        @unlink($path);
    }
}

$_SESSION['flash'] = 'Blog eliminado.';
header('Location: ./');
exit;
