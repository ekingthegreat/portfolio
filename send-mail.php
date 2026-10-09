<?php
/**
 * Portfolio Contact Form Handler - PHPMailer with Gmail SMTP
 * Michael Martinez Portfolio
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Suppress HTML display errors so JSON responses are never corrupted
ini_set('display_errors', '0');
ob_start();

// Set CORS and JSON response headers
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// =============================================================================
// CONFIGURATION - GMAIL SMTP
// =============================================================================
// Note: Gmail requires a 16-character App Password (NOT your regular password).
// How to generate:
// 1. Go to https://myaccount.google.com/security
// 2. Ensure "2-Step Verification" is ON.
// 3. Search "App Passwords" and create one named "Portfolio".
// 4. Paste the 16-character code below, or set GMAIL_APP_PASSWORD in a .env file:
define('GMAIL_USERNAME', 'michaelmrtnz10@gmail.com');
define('RECIPIENT_EMAIL', 'michaelmrtnz10@gmail.com');
define('RECIPIENT_NAME', 'Michael Martinez');

// Check for .env file or environment variable first (recommended to keep password off git)
$appPassword = 'YOUR_16_CHAR_APP_PASSWORD';
if (file_exists(__DIR__ . '/.env')) {
    $env = @parse_ini_file(__DIR__ . '/.env');
    if (!empty($env['GMAIL_APP_PASSWORD'])) {
        $appPassword = trim($env['GMAIL_APP_PASSWORD']);
    }
}
if ($appPassword === 'YOUR_16_CHAR_APP_PASSWORD' && getenv('GMAIL_APP_PASSWORD')) {
    $appPassword = getenv('GMAIL_APP_PASSWORD');
}

// Strip any whitespace from app password
$appPassword = str_replace(' ', '', $appPassword);
define('GMAIL_APP_PASSWORD', $appPassword);

// Require PHPMailer files
require_once __DIR__ . '/assets/vendor/PHPMailer/Exception.php';
require_once __DIR__ . '/assets/vendor/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/assets/vendor/PHPMailer/SMTP.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    if (ob_get_length()) ob_clean();
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed. Please submit the form directly.'
    ]);
    exit;
}

// Honeypot spam check (if bots fill the hidden field)
if (!empty($_POST['website_url'])) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Message received!'
    ]);
    exit;
}

// Sanitize & validate inputs
$name    = strip_tags(trim($_POST['name'] ?? ''));
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$subject = strip_tags(trim($_POST['subject'] ?? ''));
$message = trim($_POST['message'] ?? '');

if (empty($name)) {
    echo json_encode(['status' => 'error', 'message' => 'Please provide your name.']);
    exit;
}

if (!$email) {
    echo json_encode(['status' => 'error', 'message' => 'Please enter a valid email address.']);
    exit;
}

if (empty($message)) {
    echo json_encode(['status' => 'error', 'message' => 'Please enter your message.']);
    exit;
}

if (GMAIL_APP_PASSWORD === 'YOUR_16_CHAR_APP_PASSWORD') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Server setup note: Please configure your 16-character Gmail App Password in send-mail.php before sending.'
    ]);
    exit;
}

$mailSubject = !empty($subject) 
    ? "[Portfolio Contact] {$subject}" 
    : "[Portfolio Contact] New message from {$name}";

$mail = new PHPMailer(true);

try {
    // SMTP Server Settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = GMAIL_USERNAME;
    $mail->Password   = GMAIL_APP_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    // Recipients
    $mail->setFrom(GMAIL_USERNAME, "{$name} (Portfolio Inquirer)");
    $mail->addAddress(RECIPIENT_EMAIL, RECIPIENT_NAME);
    $mail->addReplyTo($email, $name);

    // Email Formatting
    $mail->isHTML(true);
    $mail->Subject = $mailSubject;

    $htmlBody = "
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset='utf-8'>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background:#f6f3eb; padding:20px; color:#1a1918; margin:0; }
        .card { background:#ffffff; border:2px solid #1a1918; border-radius:12px; max-width:600px; margin:0 auto; padding:24px; box-shadow:4px 5px 0 #2c2825; }
        .badge { display:inline-block; background:#f4c430; color:#1a1918; font-weight:bold; font-size:12px; padding:3px 10px; border-radius:999px; border:1px solid #1a1918; margin-bottom:12px; }
        h2 { margin:0 0 16px; font-size:20px; color:#1a1918; }
        .row { margin-bottom:10px; font-size:14px; }
        .label { font-weight:bold; color:#54504a; }
        .msg-box { background:#fdfbf7; border:1.5px dashed #54504a; border-radius:8px; padding:16px; margin-top:16px; white-space:pre-wrap; font-size:15px; line-height:1.5; color:#1a1918; }
        .footer { margin-top:20px; font-size:12px; color:#888; text-align:center; }
      </style>
    </head>
    <body>
      <div class='card'>
        <span class='badge'>New Portfolio Message</span>
        <h2>You received a message via your Portfolio website!</h2>
        <div class='row'><span class='label'>From:</span> " . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . "</div>
        <div class='row'><span class='label'>Email:</span> <a href='mailto:" . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . "'>" . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . "</a></div>
        <div class='row'><span class='label'>Subject:</span> " . htmlspecialchars($subject ?: 'General Inquiry', ENT_QUOTES, 'UTF-8') . "</div>
        <div class='row'><span class='label'>Received:</span> " . date('Y-m-d H:i:s') . "</div>
        
        <div class='msg-box'>" . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . "</div>
        
        <div class='footer'>
          You can reply directly to this email to respond to " . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . " (" . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . ").
        </div>
      </div>
    </body>
    </html>
    ";

    $plainBody = "New Portfolio Message\n\n"
               . "From: {$name}\n"
               . "Email: {$email}\n"
               . "Subject: " . ($subject ?: 'General Inquiry') . "\n"
               . "Date: " . date('Y-m-d H:i:s') . "\n\n"
               . "Message:\n"
               . "----------------------------------------\n"
               . $message . "\n"
               . "----------------------------------------\n\n"
               . "Reply directly to this email to reach the sender.";

    $mail->Body    = $htmlBody;
    $mail->AltBody = $plainBody;

    $mail->send();

    if (ob_get_length()) ob_clean();
    echo json_encode([
        'status' => 'success',
        'message' => "Thank you, {$name}! Your message has been sent successfully. I will get back to you shortly."
    ]);
} catch (Exception $e) {
    if (ob_get_length()) ob_clean();
    echo json_encode([
        'status' => 'error',
        'message' => "Message could not be sent. Mailer error: {$mail->ErrorInfo}"
    ]);
}
