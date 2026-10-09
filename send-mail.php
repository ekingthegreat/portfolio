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

    // Escaped variables for formal HTML email
    $escapedName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $escapedEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $displaySubject = !empty($subject) ? $subject : 'General Opportunity / Inquiry';
    $escapedSubject = htmlspecialchars($displaySubject, ENT_QUOTES, 'UTF-8');
    $formattedDate = date('F j, Y \a\t g:i A') . ' (Local Server Time)';
    $formattedMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));
    $encodedReplySubject = rawurlencode("Re: {$displaySubject}");

    $htmlBody = "
    <!DOCTYPE html>
    <html lang='en'>
    <head>
      <meta charset='utf-8'>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'>
      <title>Portfolio Message - {$escapedName}</title>
      <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; background-color: #faf7f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
        @media screen and (max-width: 620px) {
          .email-container { width: 100% !important; margin: auto !important; padding: 12px !important; }
          .card-inner { padding: 20px 16px !important; }
        }
      </style>
    </head>
    <body style='margin:0; padding:28px 12px; background-color:#faf7f0; color:#1a1918; font-family:-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;'>

      <!-- Outer Canvas Table -->
      <table role='presentation' border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color:#faf7f0;'>
        <tr>
          <td align='center'>
            
            <!-- Main Container (max-width 600px) -->
            <table role='presentation' class='email-container' border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width:600px; margin:0 auto; text-align:left;'>
              
              <!-- BRAND TOP BAR -->
              <tr>
                <td style='padding:0 0 16px 0;'>
                  <table role='presentation' border='0' cellpadding='0' cellspacing='0' width='100%'>
                    <tr>
                      <td align='left' style='vertical-align:middle;'>
                        <!-- MBM Monogram Logo Badge matching portfolio nav -->
                        <span style='display:inline-block; background-color:#f4c430; border:2px solid #1a1918; border-radius:8px; padding:5px 12px; font-weight:800; font-size:16px; letter-spacing:1px; color:#1a1918; box-shadow:2px 3px 0 #2c2825;'>
                          MBM
                        </span>
                        <span style='font-size:13px; font-weight:700; color:#54504a; margin-left:10px; letter-spacing:0.5px; vertical-align:middle;'>
                          MICHAEL B. MARTINEZ
                        </span>
                      </td>
                      <td align='right' style='vertical-align:middle;'>
                        <span style='display:inline-block; background-color:#ffffff; border:1.5px solid #1a1918; border-radius:999px; padding:3px 12px; font-size:11px; font-weight:700; color:#1a1918; text-transform:uppercase; letter-spacing:0.5px; box-shadow:1px 2px 0 #2c2825;'>
                          Portfolio Inquiry
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- MAIN CARD CONTAINER -->
              <tr>
                <td>
                  <table role='presentation' border='0' cellpadding='0' cellspacing='0' width='100%' style='background-color:#ffffff; border:2.5px solid #1a1918; border-radius:16px; box-shadow:6px 8px 0px #2c2825; overflow:hidden;'>
                    
                    <!-- CARD HEADER BANNER -->
                    <tr>
                      <td style='background-color:#f4efe2; border-bottom:2px solid #1a1918; padding:22px 28px;'>
                        <span style='display:inline-block; background-color:#f4c430; border:1.5px solid #1a1918; border-radius:999px; padding:3px 10px; font-size:11px; font-weight:800; color:#1a1918; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;'>
                          &#9993; Official Contact Form Submission
                        </span>
                        <h1 style='margin:6px 0 4px 0; font-size:22px; line-height:1.3; font-weight:800; color:#1a1918;'>
                          You received a new message from your portfolio!
                        </h1>
                        <p style='margin:4px 0 0 0; font-size:13px; color:#54504a; line-height:1.4;'>
                          A prospective employer, recruiter, or collaborator submitted a message through your portfolio contact form.
                        </p>
                      </td>
                    </tr>

                    <!-- CARD BODY CONTENT -->
                    <tr>
                      <td class='card-inner' style='padding:26px 28px 20px 28px;'>

                        <!-- SENDER SUMMARY TABLE -->
                        <table role='presentation' border='0' cellpadding='0' cellspacing='0' width='100%' style='margin-bottom:20px; background-color:#fffdf8; border:1.5px solid #1a1918; border-radius:12px; overflow:hidden;'>
                          <tr>
                            <td style='padding:10px 14px; border-bottom:1px dashed #ded8cb; width:130px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#54504a;'>
                              Sender Name:
                            </td>
                            <td style='padding:10px 14px; border-bottom:1px dashed #ded8cb; font-size:14px; font-weight:700; color:#1a1918;'>
                              {$escapedName}
                            </td>
                          </tr>
                          <tr>
                            <td style='padding:10px 14px; border-bottom:1px dashed #ded8cb; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#54504a;'>
                              Email Address:
                            </td>
                            <td style='padding:10px 14px; border-bottom:1px dashed #ded8cb; font-size:14px; font-weight:600; color:#1a1918;'>
                              <a href='mailto:{$escapedEmail}' style='color:#2a75d3; text-decoration:underline;'>{$escapedEmail}</a>
                            </td>
                          </tr>
                          <tr>
                            <td style='padding:10px 14px; border-bottom:1px dashed #ded8cb; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#54504a;'>
                              Subject / Role:
                            </td>
                            <td style='padding:10px 14px; border-bottom:1px dashed #ded8cb; font-size:14px; font-weight:700; color:#1a1918;'>
                              {$escapedSubject}
                            </td>
                          </tr>
                          <tr>
                            <td style='padding:10px 14px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#54504a;'>
                              Timestamp:
                            </td>
                            <td style='padding:10px 14px; font-size:13px; color:#54504a;'>
                              {$formattedDate}
                            </td>
                          </tr>
                        </table>

                        <!-- SECTION LABEL -->
                        <div style='margin-bottom:8px;'>
                          <span style='font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.8px; color:#54504a;'>
                            Message Content:
                          </span>
                        </div>

                        <!-- MESSAGE BOX (Doodle/Sketchbook Quote Box) -->
                        <table role='presentation' border='0' cellpadding='0' cellspacing='0' width='100%' style='margin-bottom:24px; background-color:#fdfbf7; border:2px dashed #1a1918; border-left:5px solid #f4c430; border-radius:10px;'>
                          <tr>
                            <td style='padding:18px 20px; font-size:15px; line-height:1.65; color:#1a1918; word-break:break-word;'>
                              {$formattedMessage}
                            </td>
                          </tr>
                        </table>

                        <!-- ACTION BUTTON (REPLY DIRECTLY) -->
                        <table role='presentation' border='0' cellpadding='0' cellspacing='0' width='100%' style='margin-bottom:16px;'>
                          <tr>
                            <td align='center'>
                              <a href='mailto:{$escapedEmail}?subject={$encodedReplySubject}' style='display:inline-block; background-color:#f4c430; color:#1a1918; font-weight:800; font-size:15px; padding:13px 28px; border:2px solid #1a1918; border-radius:999px; text-decoration:none; box-shadow:3px 4px 0 #2c2825; letter-spacing:0.3px;'>
                                Reply directly to {$escapedName} &rarr;
                              </a>
                            </td>
                          </tr>
                        </table>

                      </td>
                    </tr>

                    <!-- CARD BOTTOM FOOTER STRIP -->
                    <tr>
                      <td style='background-color:#faf7f0; border-top:1.5px solid #1a1918; padding:16px 24px; text-align:center;'>
                        <p style='margin:0 0 4px 0; font-size:12px; color:#54504a; line-height:1.4;'>
                          You can hit <strong>Reply</strong> in your email client or click the button above to respond directly to <strong>{$escapedName}</strong> ({$escapedEmail}).
                        </p>
                        <p style='margin:0; font-size:11px; color:#8d887d;'>
                          Delivered via <strong>Michael Martinez Portfolio Contact Gateway</strong>
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>

              <!-- FOOTER SIGNATURE & LINKS -->
              <tr>
                <td style='padding:22px 0; text-align:center;'>
                  <p style='margin:0 0 8px 0; font-size:12px; color:#54504a;'>
                    <a href='https://ekingthegreat.github.io/portfolio' style='color:#1a1918; font-weight:700; text-decoration:underline; margin:0 6px;'>Portfolio</a> &bull;
                    <a href='https://github.com/ekingthegreat' style='color:#1a1918; font-weight:700; text-decoration:underline; margin:0 6px;'>GitHub</a> &bull;
                    <a href='https://linkedin.com/in/ekingthegreat' style='color:#1a1918; font-weight:700; text-decoration:underline; margin:0 6px;'>LinkedIn</a>
                  </p>
                  <p style='margin:0; font-size:11px; color:#8d887d;'>
                    Michael B. Martinez &bull; Software Engineering &bull; Ipil, Zamboanga Peninsula, Philippines
                  </p>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
    </html>
    ";

    $plainBody = "=== NEW PORTFOLIO CONTACT MESSAGE ===\n\n"
               . "From:    {$name}\n"
               . "Email:   {$email}\n"
               . "Subject: {$displaySubject}\n"
               . "Date:    {$formattedDate}\n\n"
               . "--- MESSAGE ---\n"
               . $message . "\n"
               . "---------------\n\n"
               . "Reply directly to this email or write to {$email}.\n"
               . "Portfolio: https://ekingthegreat.github.io/portfolio\n";

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
