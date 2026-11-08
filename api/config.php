<?php
/*
 * config.php : pengaturan server (hanya dibaca oleh api.php, isinya tidak pernah tampil di website).
 *
 * WAJIB: ganti 'admin_password' di bawah sebelum website dipakai. Selama masih berisi
 * GANTI-KATA-SANDI-INI, login admin sengaja ditolak.
 *
 * Kata sandi boleh berupa teks biasa, atau hash bcrypt kalau kamu mau lebih aman
 * (buat hash dengan perintah:  php -r "echo password_hash('kata-sandimu', PASSWORD_DEFAULT);" ).
 */
return array(
    'admin_password' => 'admin123',

    // Batas ukuran satu foto yang diunggah (MB). Foto dari panel admin sudah dikecilkan otomatis, jadi 4 MB cukup.
    'max_upload_mb' => 4,

    // Batas ukuran data teks website (MB). Data teks biasanya hanya puluhan KB.
    'max_json_mb' => 3,
);
