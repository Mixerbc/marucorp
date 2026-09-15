<?php
// Compatibilidad: /admin/login.php → /admin/
require __DIR__ . '/lib.php';
admin_start_session();
header('Location: ./', true, 302);
exit;
