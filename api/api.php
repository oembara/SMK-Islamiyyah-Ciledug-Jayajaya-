<?php
/*
 * api.php : backend kecil untuk website SMK Islamiyah Ciledug
 *
 * Fungsi:
 *   - menyimpan seluruh data website (jurusan, prestasi, PPDB, poster, dst) di database SQLite
 *     (file data/site.sqlite, dibuat otomatis; kalau SQLite tidak tersedia memakai file data/kv.json)
 *   - menerima foto dari panel admin dan menyimpannya di folder uploads/
 *   - login admin (kata sandi ada di config.php)
 *
 * Kebutuhan hosting: PHP 7.3 atau lebih baru (hampir semua hosting sudah memenuhi). Tidak perlu membuat
 * database sendiri. Taruh folder api/ ini sejajar dengan index.html (folder data/ dan uploads/ dibuat otomatis di sebelah index.html).
 */
error_reporting(E_ALL);
ini_set('display_errors', '0');

define('DATA_DIR', dirname(__DIR__) . '/data');
define('UP_DIR', dirname(__DIR__) . '/uploads');
define('DEFAULT_PW', 'GANTI-KATA-SANDI-INI');
define('COOKIE_NAME', 'smk_admin');
define('SESSION_DAYS', 7);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function out($data, $code = 200)
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function fail($msg, $code = 400)
{
    out(array('ok' => false, 'error' => $msg), $code);
}

/* ---------------- konfigurasi ---------------- */
function cfg()
{
    static $c = null;
    if ($c === null) {
        $c = array('admin_password' => DEFAULT_PW, 'max_upload_mb' => 4, 'max_json_mb' => 3);
        $f = __DIR__ . '/config.php';
        if (is_file($f)) {
            $u = include $f;
            if (is_array($u)) {
                $c = array_merge($c, $u);
            }
        }
    }
    return $c;
}

/* ---------------- folder + file pengaman ---------------- */
function ensure_dirs()
{
    $problems = array();
    foreach (array(DATA_DIR, UP_DIR) as $d) {
        if (!is_dir($d)) {
            @mkdir($d, 0755, true);
        }
        if (!is_dir($d) || !is_writable($d)) {
            $problems[] = 'Folder ' . basename($d) . '/ tidak bisa ditulis. Atur izin folder ke 755 (atau 775) lewat File Manager.';
        }
    }
    if (is_dir(DATA_DIR) && !is_file(DATA_DIR . '/.htaccess')) {
        @file_put_contents(DATA_DIR . '/.htaccess', "<IfModule mod_authz_core.c>\nRequire all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\nOrder allow,deny\nDeny from all\n</IfModule>\n");
        @file_put_contents(DATA_DIR . '/index.html', '');
    }
    if (is_dir(UP_DIR) && !is_file(UP_DIR . '/.htaccess')) {
        @file_put_contents(UP_DIR . '/.htaccess', "Options -Indexes\n<IfModule mod_php.c>\nphp_flag engine off\n</IfModule>\n<IfModule mod_php7.c>\nphp_flag engine off\n</IfModule>\n<FilesMatch \"\\.(php|php3|php4|php5|php7|phtml|phar|pl|py|cgi|sh|exe)$\">\n<IfModule mod_authz_core.c>\nRequire all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\nOrder allow,deny\nDeny from all\n</IfModule>\n</FilesMatch>\n");
        @file_put_contents(UP_DIR . '/index.html', '');
    }
    return $problems;
}

/* ---------------- penyimpanan key-value (SQLite, cadangan: file JSON) ---------------- */
function db()
{
    static $pdo = false;
    if ($pdo !== false) {
        return $pdo;
    }
    $pdo = null;
    if (extension_loaded('pdo_sqlite') && is_dir(DATA_DIR) && is_writable(DATA_DIR)) {
        try {
            $pdo = new PDO('sqlite:' . DATA_DIR . '/site.sqlite');
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->exec('PRAGMA busy_timeout = 5000');
            $pdo->exec('CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL, updated_at INTEGER NOT NULL)');
        } catch (Exception $e) {
            error_log('SQLite gagal: ' . $e->getMessage());
            $pdo = null;
        }
    }
    return $pdo;
}
function kv_file_read()
{
    $f = DATA_DIR . '/kv.json';
    if (!is_file($f)) {
        return array();
    }
    $j = json_decode((string) file_get_contents($f), true);
    return is_array($j) ? $j : array();
}
function kv_get($k)
{
    $pdo = db();
    if ($pdo) {
        $s = $pdo->prepare('SELECT v FROM kv WHERE k = ?');
        $s->execute(array($k));
        $v = $s->fetchColumn();
        return $v === false ? null : (string) $v;
    }
    $a = kv_file_read();
    return isset($a[$k]) ? (string) $a[$k] : null;
}
function kv_set($k, $v)
{
    $pdo = db();
    if ($pdo) {
        $s = $pdo->prepare('REPLACE INTO kv (k, v, updated_at) VALUES (?, ?, ?)');
        $s->execute(array($k, $v, time()));
        return;
    }
    $f = DATA_DIR . '/kv.json';
    $fp = fopen($f, 'c+');
    if (!$fp) {
        throw new Exception('Tidak bisa menulis data');
    }
    flock($fp, LOCK_EX);
    $a = json_decode((string) stream_get_contents($fp), true);
    if (!is_array($a)) {
        $a = array();
    }
    $a[$k] = $v;
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, json_encode($a, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
}

/* ---------------- login berbasis token bertanda tangan (tanpa file sesi) ---------------- */
function secret()
{
    static $s = null;
    if ($s !== null) {
        return $s;
    }
    $f = DATA_DIR . '/secret.key';
    $s = is_file($f) ? trim((string) file_get_contents($f)) : '';
    if (strlen($s) < 32) {
        $s = bin2hex(random_bytes(32));
        @file_put_contents($f, $s, LOCK_EX);
        @chmod($f, 0600);
    }
    return $s;
}
function sign_key()
{
    // berubah kalau kata sandi diganti di config.php atau setelah logout, sehingga token lama otomatis tidak berlaku
    return hash('sha256', secret() . '|' . cfg()['admin_password'] . '|' . (string) kv_get('epoch'));
}
function make_token()
{
    $p = (time() + SESSION_DAYS * 86400) . '.' . bin2hex(random_bytes(8));
    return $p . '.' . hash_hmac('sha256', $p, sign_key());
}
function token_ok($t)
{
    if (!$t || !is_string($t)) {
        return false;
    }
    $x = explode('.', $t);
    if (count($x) !== 3 || (int) $x[0] < time()) {
        return false;
    }
    return hash_equals(hash_hmac('sha256', $x[0] . '.' . $x[1], sign_key()), $x[2]);
}
function authed()
{
    return isset($_COOKIE[COOKIE_NAME]) && token_ok($_COOKIE[COOKIE_NAME]);
}
function csrf_token()
{
    return hash_hmac('sha256', 'csrf|' . (isset($_COOKIE[COOKIE_NAME]) ? $_COOKIE[COOKIE_NAME] : ''), sign_key());
}
function is_https()
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
}
function set_auth_cookie($value, $expires)
{
    setcookie(COOKIE_NAME, $value, array(
        'expires' => $expires, 'path' => '/', 'secure' => is_https(), 'httponly' => true, 'samesite' => 'Lax'
    ));
    $_COOKIE[COOKIE_NAME] = $value;
}
function require_auth()
{
    if (!authed()) {
        fail('Sesi habis, silakan masuk lagi.', 401);
    }
    $h = isset($_SERVER['HTTP_X_CSRF_TOKEN']) ? $_SERVER['HTTP_X_CSRF_TOKEN'] : '';
    if (!hash_equals(csrf_token(), $h)) {
        fail('Token keamanan tidak cocok. Muat ulang halaman admin.', 403);
    }
}
function check_password($input)
{
    $stored = (string) cfg()['admin_password'];
    if ($stored === '' || $stored === DEFAULT_PW) {
        return false;
    }
    if (preg_match('/^\$(2y|2a|argon2id?)\$/', $stored)) {
        return password_verify($input, $stored);
    }
    return hash_equals($stored, $input);
}
function recent_fails($ip)
{
    $raw = kv_get('fail:' . sha1($ip));
    $a = $raw ? json_decode($raw, true) : array();
    $now = time();
    $out = array();
    foreach (is_array($a) ? $a : array() as $t) {
        if ($t > $now - 900) {
            $out[] = $t;
        }
    }
    return $out;
}

/* ---------------- pembersihan foto yang sudah tidak dipakai ---------------- */
function cleanup_uploads($json)
{
    preg_match_all('#uploads/([a-f0-9]{16}\.(?:jpg|png|webp))#', $json, $m);
    $keep = array_flip($m[1]);
    $files = glob(UP_DIR . '/*');
    foreach ($files ? $files : array() as $f) {
        $b = basename($f);
        if (!preg_match('/^[a-f0-9]{16}\.(jpg|png|webp)$/', $b) || isset($keep[$b])) {
            continue;
        }
        if (filemtime($f) < time() - 86400) { // beri tenggang 24 jam untuk foto yang baru diunggah tapi belum disimpan
            @unlink($f);
        }
    }
}

/* ---------------- routing ---------------- */
try {
    $action = isset($_GET['action']) ? $_GET['action'] : 'ping';
    $method = $_SERVER['REQUEST_METHOD'];

    if ($action === 'data') {
        // publik: dibaca semua pengunjung
        $v = is_dir(DATA_DIR) ? kv_get('site') : null;
        if ($v === null) {
            out(array('empty' => true));
        }
        echo $v;
        exit;
    }

    if ($action === 'ping') {
        $problems = ensure_dirs();
        $pw = (string) cfg()['admin_password'];
        if ($pw === '' || $pw === DEFAULT_PW) {
            $problems[] = 'Kata sandi admin belum diatur. Buka file config.php di hosting, ganti nilai admin_password, lalu muat ulang halaman ini.';
        }
        if (PHP_VERSION_ID < 70300) {
            $problems[] = 'Versi PHP di hosting (' . PHP_VERSION . ') terlalu lama. Butuh PHP 7.3 atau lebih baru.';
        }
        $a = authed();
        out(array(
            'ok' => true,
            'ready' => count($problems) === 0,
            'problems' => $problems,
            'storage' => db() ? 'sqlite' : 'file',
            'authed' => $a,
            'csrf' => $a ? csrf_token() : null
        ));
    }

    if ($method !== 'POST') {
        fail('Metode tidak didukung', 405);
    }

    if ($action === 'login') {
        ensure_dirs();
        $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '0';
        $fails = recent_fails($ip);
        if (count($fails) >= 5) {
            fail('Terlalu banyak percobaan gagal. Coba lagi sekitar 15 menit lagi.', 429);
        }
        $pw = (string) cfg()['admin_password'];
        if ($pw === '' || $pw === DEFAULT_PW) {
            fail('Kata sandi admin belum diatur di config.php.', 403);
        }
        $b = json_decode((string) file_get_contents('php://input'), true);
        $input = is_array($b) && isset($b['password']) ? (string) $b['password'] : '';
        if (!check_password($input)) {
            $fails[] = time();
            kv_set('fail:' . sha1($ip), json_encode($fails));
            usleep(600000);
            fail('Kata sandi salah.', 401);
        }
        kv_set('fail:' . sha1($ip), '[]');
        $tok = make_token();
        set_auth_cookie($tok, time() + SESSION_DAYS * 86400);
        out(array('ok' => true, 'csrf' => csrf_token()));
    }

    if ($action === 'logout') {
        require_auth();
        kv_set('epoch', (string) time()); // membatalkan semua token yang sudah beredar
        set_auth_cookie('', time() - 3600);
        out(array('ok' => true));
    }

    if ($action === 'save') {
        require_auth();
        $raw = (string) file_get_contents('php://input');
        $limit = (int) cfg()['max_json_mb'] * 1048576;
        if (strlen($raw) > $limit) {
            fail('Data terlalu besar (maks ' . (int) cfg()['max_json_mb'] . ' MB). Biasanya karena masih ada foto dalam bentuk teks base64; gunakan menu Impor supaya foto dipindah ke folder uploads.', 413);
        }
        $j = json_decode($raw);
        if (!is_object($j)) {
            fail('Format data tidak valid.');
        }
        foreach (array('settings', 'JURUSAN', 'PRESTASI', 'EKSKUL', 'KEGIATAN') as $k) {
            if (!isset($j->$k) || !(is_array($j->$k) || is_object($j->$k))) {
                fail('Data tidak lengkap: bagian ' . $k . ' hilang.');
            }
        }
        $clean = new stdClass();
        foreach (array('settings', 'JURUSAN', 'PRESTASI', 'EKSKUL', 'KEGIATAN', 'PPDB', 'POSTER') as $k) {
            if (isset($j->$k)) {
                $clean->$k = $j->$k;
            }
        }
        $json = json_encode($clean, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        kv_set('site', $json);
        cleanup_uploads($json);
        out(array('ok' => true, 'bytes' => strlen($json), 'updated' => time()));
    }

    if ($action === 'upload') {
        require_auth();
        if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            fail('Upload gagal. Coba lagi dengan file yang lebih kecil.');
        }
        $f = $_FILES['file'];
        if ($f['size'] > (int) cfg()['max_upload_mb'] * 1048576) {
            fail('Ukuran foto melebihi ' . (int) cfg()['max_upload_mb'] . ' MB.', 413);
        }
        $info = @getimagesize($f['tmp_name']);
        $map = array(IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp');
        if (!$info || !isset($map[$info[2]])) {
            fail('File harus berupa gambar JPG, PNG, atau WebP.');
        }
        ensure_dirs();
        $name = bin2hex(random_bytes(8)) . '.' . $map[$info[2]];
        if (!move_uploaded_file($f['tmp_name'], UP_DIR . '/' . $name)) {
            fail('Gagal menyimpan foto. Cek izin folder uploads/ (755).', 500);
        }
        @chmod(UP_DIR . '/' . $name, 0644);
        out(array('ok' => true, 'url' => 'uploads/' . $name));
    }

    fail('Aksi tidak dikenal', 404);
} catch (Throwable $e) {
    error_log('api.php: ' . $e->getMessage());
    fail('Terjadi kesalahan di server.', 500);
}
