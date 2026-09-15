<?php

function admin_config(): array
{
    static $cfg;
    if (!$cfg) {
        $cfg = require __DIR__ . '/config.php';
        $local = __DIR__ . '/config.local.php';
        if (is_file($local)) {
            $cfg = array_merge($cfg, require $local);
        }
    }
    return $cfg;
}

function admin_start_session(): void
{
    $cfg = admin_config();
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_name($cfg['session_name']);
        session_start();
    }
}

function admin_is_logged_in(): bool
{
    admin_start_session();
    return !empty($_SESSION['admin_ok']);
}

function admin_require_login(): void
{
    if (!admin_is_logged_in()) {
        header('Location: ./');
        exit;
    }
}

function admin_login(string $password): bool
{
    admin_start_session();
    $cfg = admin_config();
    if (!hash_equals((string) $cfg['password'], $password)) {
        return false;
    }
    $_SESSION['admin_ok'] = true;
    $_SESSION['csrf'] = bin2hex(random_bytes(16));
    return true;
}

function admin_logout(): void
{
    admin_start_session();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}

function admin_csrf_token(): string
{
    admin_start_session();
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(16));
    }
    return $_SESSION['csrf'];
}

function admin_verify_csrf(?string $token): bool
{
    admin_start_session();
    return is_string($token) && !empty($_SESSION['csrf']) && hash_equals($_SESSION['csrf'], $token);
}

function blogs_load(): array
{
    $cfg = admin_config();
    $path = $cfg['blogs_file'];
    if (!is_file($path)) {
        return [
            'categories' => [
                'Supervisión empresarial',
                'Prevención fiscal y laboral',
                'Operación integrada',
            ],
            'articles' => [],
        ];
    }
    $raw = file_get_contents($path);
    $data = json_decode($raw ?: '{}', true);
    if (!is_array($data)) {
        $data = [];
    }
    $data['categories'] = $data['categories'] ?? [
        'Supervisión empresarial',
        'Prevención fiscal y laboral',
        'Operación integrada',
    ];
    $data['articles'] = $data['articles'] ?? [];
    return $data;
}

function blogs_save(array $data): bool
{
    $cfg = admin_config();
    $path = $cfg['blogs_file'];
    $dir = dirname($path);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    return file_put_contents($path, $json . "\n", LOCK_EX) !== false;
}

function blog_find(string $id): ?array
{
    $data = blogs_load();
    foreach ($data['articles'] as $article) {
        if (($article['id'] ?? '') === $id || ($article['slug'] ?? '') === $id) {
            return $article;
        }
    }
    return null;
}

function blog_slugify(string $text): string
{
    $text = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $text);
    $text = strtolower((string) $text);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    $text = trim((string) $text, '-');
    return $text !== '' ? $text : 'articulo-' . substr(bin2hex(random_bytes(3)), 0, 6);
}

function blog_unique_slug(string $slug, ?string $ignoreId = null): string
{
    $data = blogs_load();
    $base = $slug;
    $i = 2;
    while (true) {
        $exists = false;
        foreach ($data['articles'] as $article) {
            if (($article['slug'] ?? '') === $slug && ($article['id'] ?? '') !== $ignoreId) {
                $exists = true;
                break;
            }
        }
        if (!$exists) {
            return $slug;
        }
        $slug = $base . '-' . $i;
        $i++;
    }
}

function blog_h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function blog_public_url(array $article): string
{
    $slug = rawurlencode((string) ($article['slug'] ?? ''));
    return '../insight.php?slug=' . $slug;
}
