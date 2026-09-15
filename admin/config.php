<?php
/**
 * Config admin MARU CORP (público en el repo).
 * La contraseña real va en config.local.php (no se sube a GitHub).
 */
return [
    // Copia config.local.example.php → config.local.php y define tu password
    'password' => 'CAMBIAR_ESTA_CLAVE',
    'session_name' => 'maru_admin_sess',
    'blogs_file' => dirname(__DIR__) . '/data/blogs.json',
    'uploads_dir' => dirname(__DIR__) . '/uploads/blogs',
    'uploads_url' => 'uploads/blogs',
];
