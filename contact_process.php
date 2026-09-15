<?php
/**
 * Procesamiento de formularios MARU CORP (Diagnóstico Empresarial / contacto).
 * Endpoint: conectar aquí cualquier webhook o CRM posterior sin cambiar el front.
 */
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

function field(string $key): string {
    return trim((string) ($_POST[$key] ?? ''));
}

$name = field('name');
$email = field('email');
$whatsapp = field('whatsapp') ?: field('subject');
$empresa = field('empresa');
$puesto = field('puesto');
$colaboradores = field('colaboradores') ?: field('tamano');
$area = field('area') ?: field('servicio');
$situacion = field('situacion') ?: field('message');
$fueraControl = field('fuera_control');
$formType = field('form_type') ?: 'diagnostico';
$honeypot = field('website');

if ($honeypot !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

if ($name === '' || $email === '' || $whatsapp === '' || $situacion === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Faltan campos obligatorios']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Correo inválido']);
    exit;
}

$waDigits = preg_replace('/\D+/', '', $whatsapp);
if (strlen($waDigits) < 10) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'WhatsApp inválido']);
    exit;
}

$to = 'contacto@marucorp.mx';
$subject = ($formType === 'diagnostico')
    ? 'Nueva solicitud de Diagnóstico Empresarial — MARU CORP'
    : 'Nuevo mensaje de contacto — MARU CORP';

$bodyLines = [
    'Tipo de formulario: ' . $formType,
    'Nombre: ' . $name,
    'Empresa: ' . ($empresa ?: '—'),
    'Puesto: ' . ($puesto ?: '—'),
    'Colaboradores: ' . ($colaboradores ?: '—'),
    'Área de mayor preocupación: ' . ($area ?: '—'),
    'WhatsApp: ' . $whatsapp,
    'Correo: ' . $email,
    '',
    'Situación a resolver:',
    $situacion,
];

if ($fueraControl !== '') {
    $bodyLines[] = '';
    $bodyLines[] = '¿Qué siente que hoy está fuera de control?:';
    $bodyLines[] = $fueraControl;
}

$bodyLines[] = '';
$bodyLines[] = 'Enviado desde: ' . ($_SERVER['HTTP_HOST'] ?? 'marucorp.mx');

$body = implode("\n", $bodyLines);
$headers = [
    'From: MARU CORP <noreply@marucorp.mx>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo enviar el correo']);
}
