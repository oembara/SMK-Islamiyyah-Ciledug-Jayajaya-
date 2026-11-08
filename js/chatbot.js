/* =====================================================================
   CHATBOT TANYA-JAWAB (berbasis aturan dan kata kunci, tanpa server/AI)
   ---------------------------------------------------------------------
   Cara kerja:
   1. Pertanyaan dinormalkan (huruf kecil, tanpa tanda baca, singkatan umum
      seperti "gmn", "brp", "pmb" disamakan) lalu dipecah menjadi kata.
   2. Setiap topik (intent) punya daftar kata kunci. Skor: frasa cocok = 3,
      kata persis = 2, awalan kata = 1.6, salah ketik ringan = 1.2.
   3. Topik berskor tertinggi (minimal 1.2) menjawab. Jawabannya dirangkai
      dari DATA situs (PPDB, jurusan, ekskul, kontak, FAQ), jadi otomatis
      ikut berubah saat admin mengedit konten.
   4. Admin bisa menambah jawaban sendiri lewat menu "Chatbot (Tanya Jawab)".
   Variabel data (CFG, PPDB, JURUSAN, ...) dan fungsi pembantu (ESC, qa, hrefOf,
   parseDeadline, openDaftar, waChat) berasal dari js/app.js.
   ===================================================================== */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const STORE = 'smk_bot', OPENK = 'smk_bot_open', TEASEK = 'smk_bot_tease';
  const REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ss = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { } } };

  /* ---------- 1. Normalisasi & pencocokan ---------- */
  const ALIAS = {
    gimana: 'bagaimana', gmn: 'bagaimana', gmna: 'bagaimana', dmn: 'dimana', dimn: 'dimana', brp: 'berapa', brapa: 'berapa', kpn: 'kapan',
    tdk: 'tidak', yg: 'yang', dgn: 'dengan', utk: 'untuk', sy: 'saya', thx: 'terima kasih', makasih: 'terima kasih', trims: 'terima kasih',
    terimakasih: 'terima kasih', mksh: 'terima kasih', tks: 'terima kasih', pmb: 'ppdb', psb: 'ppdb', spmb: 'ppdb', wa: 'whatsapp', whatsap: 'whatsapp',
    telp: 'telepon', tlp: 'telepon', hp: 'telepon', nomor: 'telepon', no: 'telepon', regist: 'daftar', registrasi: 'daftar', mendaftar: 'daftar',
    pendaftaran: 'daftar', mendaftarkan: 'daftar', daftarkan: 'daftar', persyaratan: 'syarat', ketentuan: 'syarat', ekstrakurikuler: 'ekskul',
    extrakurikuler: 'ekskul', ekstra: 'ekskul', ektrakurikuler: 'ekskul', alumni: 'alumni', lokasi: 'alamat', letak: 'alamat', maps: 'alamat', peta: 'alamat',
    ngundur: 'unduh', download: 'unduh', mengunduh: 'unduh', unduhan: 'unduh', formulir: 'formulir', form: 'formulir', beasiswa: 'beasiswa',
    bea: 'beasiswa', spp: 'spp', hai: 'halo', hello: 'halo', hi: 'halo', hay: 'halo', assalamualaikum: 'halo', assalamu: 'halo', salam: 'halo', permisi: 'halo',
    magang: 'pkl', prakerin: 'pkl', ok: 'oke', okey: 'oke', okay: 'oke', thanks: 'terima kasih', bye: 'sampai jumpa', dadah: 'sampai jumpa', cs: 'admin', operator: 'admin',
    petugas: 'admin', panitia: 'admin', manusia: 'admin', lab: 'laboratorium', bengkel: 'laboratorium'
  };
  const STOP = new Set(['yang', 'di', 'ke', 'dari', 'dan', 'atau', 'itu', 'ini', 'apa', 'apakah', 'bagaimana', 'kapan', 'dimana', 'berapa', 'siapa', 'kenapa', 'mengapa',
    'bisa', 'boleh', 'ada', 'untuk', 'dengan', 'pada', 'saya', 'aku', 'kak', 'min', 'admin', 'mau', 'ingin', 'tanya', 'tolong', 'dong', 'ya', 'sih', 'nih', 'tuh', 'sekolah',
    'adalah', 'agar', 'apa', 'saja', 'para', 'oleh', 'akan', 'sudah', 'telah', 'juga', 'kami', 'kita', 'anda', 'kalau', 'jika', 'bila', 'harus', 'perlu', 'dapat']);
  const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const toks = s => norm(s).split(' ').filter(Boolean).flatMap(w => (ALIAS[w] || w).split(' '));
  const kws = list => list.map(toks).filter(k => k.length);
  function lev(a, b, max) {   // jarak edit, berhenti lebih awal bila melebihi max
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i]; let min = i;
      for (let j = 1; j <= b.length; j++) { cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); if (cur[j] < min) min = cur[j]; }
      if (min > max) return max + 1; prev = cur;
    }
    return prev[b.length];
  }
  const near = (a, b) => { const L = Math.min(a.length, b.length); if (L < 5) return false; const m = L >= 8 ? 2 : 1; return lev(a, b, m) <= m; };
  function scoreKw(list, T, J) {
    let s = 0;
    for (const k of list) {
      if (k.length > 1) { if (J.includes(' ' + k.join(' ') + ' ')) s += 3; continue; }
      const w = k[0];
      if (T.includes(w)) s += 2;
      else if (w.length >= 5 && T.some(t => t.length >= 5 && (t.startsWith(w) || w.startsWith(t)))) s += 1.6;
      else if (T.some(t => near(t, w))) s += 1.2;
    }
    return s;
  }

  /* ---------- 2. Pembantu penyusun jawaban ---------- */
  const bul = a => a.map(x => '• ' + x).join('\n');
  const num = a => a.map((x, i) => (i + 1) + '. ' + x).join('\n');
  const L = (t, h) => ({ t, h });
  const C = (t, q, a) => ({ t, q: q || t, a });
  const TOPIK = [C('Info PPDB', 'info ppdb'), C('Syarat pendaftaran', 'syarat pendaftaran'), C('Alur pendaftaran', 'alur pendaftaran'), C('Biaya dan beasiswa', 'biaya dan beasiswa'),
    C('Jurusan', 'jurusan'), C('Ekstrakurikuler', 'ekstrakurikuler'), C('Alamat dan kontak', 'alamat dan kontak')];
  const pick = (arr, n) => arr.filter(x => x.id !== undefined ? x.aktif !== false : true).slice(0, n);
  const short = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s; };
  const faqBy = cat => (PPDB.faq || []).filter(x => x && x.aktif !== false && x.q && (x.kategori || 'Umum') === cat);
  function faqAnswer(cat, T, topikLain) {   // tampilkan butir FAQ yang paling relevan dengan pertanyaan
    const items = faqBy(cat);
    if (!items.length) return null;
    const sc = items.map(x => { const ft = toks(x.q + ' ' + x.a).filter(w => !STOP.has(w) && w.length > 2); return [x, T.filter(t => t.length > 2 && !STOP.has(t) && ft.some(f => f === t || near(f, t))).length]; });
    const top = Math.max(...sc.map(s => s[1]));
    const chosen = top > 0 ? sc.filter(s => s[1] === top).map(s => s[0]).slice(0, 2) : items.slice(0, 3);
    return { t: chosen.map(x => `**${x.q}**\n${x.a}`).join('\n\n'), c: [...topikLain, C('Hubungi panitia', 'hubungi admin')] };
  }
  const rupa = ms => { const d = Math.floor(ms / 864e5); return d >= 1 ? d + ' hari lagi' : 'kurang dari 1 hari lagi'; };

  /* ---------- 3. Daftar topik (intent) ---------- */
  function buildIntents() {
    const J = Object.entries(JURUSAN || {}), E = (EKSKUL || []);
    const I = [];
    const add = (id, k, a, o) => I.push(Object.assign({ id, k: kws(k), a, q0: k[0] }, o));

    add('halo', ['halo', 'selamat pagi', 'selamat siang', 'selamat sore', 'selamat malam', 'selamat'],
      () => ({ t: `Halo! Saya asisten virtual ${CFG.namaLengkap}. Saya bisa membantu seputar PPDB, jurusan, ekstrakurikuler, dan kontak sekolah. Silakan pilih topik atau ketik pertanyaanmu.`, c: TOPIK }), { max: 4 });
    add('terimakasih', ['terima kasih', 'makasih', 'oke', 'siap', 'baik', 'sip', 'mantap'], () => ({ t: 'Sama-sama! Kalau ada pertanyaan lain, silakan tanya kapan saja.', c: TOPIK.slice(0, 4) }), { max: 4 });
    add('pamit', ['sampai jumpa', 'dadah', 'selesai', 'sudah cukup', 'cukup'], () => ({ t: 'Terima kasih sudah berkunjung. Sampai jumpa dan semoga sukses!' }), { max: 4 });
    add('siapa', ['kamu siapa', 'siapa kamu', 'siapa anda', 'bot', 'robot', 'chatbot', 'asisten', 'manusia atau'], () => ({ t: `Saya asisten virtual otomatis ${CFG.namaLengkap}. Jawaban saya disusun dari data resmi di website ini. Untuk hal yang tidak saya ketahui, silakan hubungi panitia lewat WhatsApp.`, c: TOPIK.slice(0, 4) }), { max: 5 });

    add('admin', ['admin', 'hubungi admin', 'bicara langsung', 'chat langsung', 'orang sungguhan', 'telepon panitia', 'hubungi panitia', 'komplain', 'keluhan', 'saran'],
      () => ({ t: 'Baik, kamu bisa melanjutkan percakapan langsung dengan panitia lewat WhatsApp. Pertanyaan terakhirmu akan ikut terkirim sebagai pesan awal.', c: [C('Chat WhatsApp panitia', '', 'wa')] }));

    add('syarat', ['syarat', 'berkas', 'dokumen', 'kelengkapan', 'fotokopi', 'akta', 'kartu keluarga', 'ijazah', 'pas foto', 'apa yang harus disiapkan', 'bawa apa', 'yang dibawa'], () => {
      const b = (PPDB.berkas || []);
      return { t: `**Berkas persyaratan PPDB ${PPDB.tahun}**\n` + (b.length ? bul(b.map(x => x.nama + (x.ket ? ` (${x.ket})` : ''))) : 'Daftar berkas belum tersedia, silakan hubungi panitia.') + (PPDB.catatan ? '\n\n' + PPDB.catatan : ''),
        l: [L('Lihat halaman PPDB', 'ppdb.html'), L('Unduh formulir', 'unduhan.html')], c: [C('Alur pendaftaran', 'alur pendaftaran'), C('Biaya dan beasiswa', 'biaya dan beasiswa'), C('Info PPDB', 'info ppdb')] };
    });
    add('alur', ['alur', 'cara daftar', 'langkah', 'tahapan', 'prosedur', 'bagaimana daftar', 'cara mendaftar', 'tata cara', 'mulai daftar', 'proses'], () => ({
      t: `**Alur pendaftaran PPDB ${PPDB.tahun}**\n` + ((PPDB.alur || []).length ? num(PPDB.alur) : 'Alur belum tersedia, silakan hubungi panitia.'),
      l: [L('Halaman PPDB', 'ppdb.html')], c: [C('Daftar sekarang', '', 'daftar'), C('Syarat pendaftaran', 'syarat pendaftaran'), C('Biaya dan beasiswa', 'biaya dan beasiswa')] }));
    add('ppdb', ['ppdb', 'daftar', 'penerimaan', 'siswa baru', 'murid baru', 'gelombang', 'jadwal', 'kapan', 'buka', 'tutup', 'deadline', 'batas', 'pengumuman', 'daftar ulang', 'kuota', 'tahun ajaran', 'info daftar'], () => {
      const st = PPDB.status, t = typeof parseDeadline === 'function' ? parseDeadline(PPDB.deadline) : null, sisa = t && st !== 'Ditutup' && t > Date.now() ? ` Batas waktu: ${rupa(t - Date.now())}.` : '';
      return { t: `**PPDB ${PPDB.tahun}**: pendaftaran saat ini **${st}**.${sisa}\n\n` + ((PPDB.jadwal || []).length ? bul(PPDB.jadwal) : (PPDB.intro || '')),
        l: [L('Halaman PPDB', 'ppdb.html')], c: [st === 'Ditutup' ? C('Hubungi panitia', 'hubungi admin') : C('Daftar sekarang', '', 'daftar'), C('Syarat pendaftaran', 'syarat pendaftaran'), C('Alur pendaftaran', 'alur pendaftaran'), C('Biaya dan beasiswa', 'biaya dan beasiswa')] };
    });
    add('biaya', ['biaya', 'bayar', 'pembayaran', 'spp', 'uang pangkal', 'uang gedung', 'seragam', 'gratis', 'cicil', 'cicilan', 'iuran', 'bebas biaya', 'biaya masuk'],
      T => faqAnswer('Biaya', T, [C('Beasiswa', 'beasiswa'), C('Syarat pendaftaran', 'syarat pendaftaran')]) || { t: 'Rincian biaya resmi ditetapkan panitia. Silakan hubungi panitia PPDB untuk informasi terbaru.', c: [C('Hubungi panitia', 'hubungi admin'), C('Info PPDB', 'info ppdb')] });
    add('beasiswa', ['beasiswa', 'kip', 'kartu indonesia pintar', 'keringanan', 'tahfiz', 'tahfidz', 'hafidz', 'yatim', 'dhuafa', 'tidak mampu', 'bantuan biaya', 'beasiswa prestasi', 'potongan'],
      T => faqAnswer('Beasiswa', T, [C('Biaya', 'biaya pendaftaran'), C('Syarat pendaftaran', 'syarat pendaftaran')]) || { t: 'Informasi beasiswa dapat ditanyakan langsung ke panitia PPDB.', c: [C('Hubungi panitia', 'hubungi admin')] });

    // jurusan tertentu (kata unik dari namanya + singkatan)
    const freq = {}; J.forEach(([, j]) => new Set(toks(j.name)).forEach(w => freq[w] = (freq[w] || 0) + 1));
    J.forEach(([id, j]) => add('jur:' + id, [j.singkatan, j.name, ...toks(j.name).filter(w => freq[w] === 1 && w.length >= 4)], () => ({
      t: `**${j.name} (${j.singkatan})**\n${j.tagline || ''}\n\n${short(j.desc, 260)}\n\n**Kompetensi:**\n${bul((j.kompetensi || []).slice(0, 4))}` + ((j.karier || []).length ? `\n\n**Prospek karier:** ${(j.karier || []).slice(0, 4).join(', ')}.` : ''),
      l: [L('Detail jurusan ' + j.singkatan, hrefOf('jurusan/' + id))], c: [C('Jurusan lain', 'jurusan'), C('Syarat pendaftaran', 'syarat pendaftaran'), C('Fasilitas', 'fasilitas')] })));
    add('jurusan', ['jurusan', 'program keahlian', 'keahlian', 'kompetensi keahlian', 'prodi', 'bidang', 'pilihan jurusan', 'jurusan apa', 'apa saja jurusan'], () => ({
      t: `**Program keahlian di ${CFG.namaLengkap}**\n` + bul(J.map(([, j]) => `**${j.singkatan}**, ${j.name}: ${j.tagline || ''}`)),
      l: [L('Semua jurusan', 'jurusan.html')], c: [...J.map(([, j]) => C(j.singkatan, j.singkatan)), C('Fasilitas', 'fasilitas')] }));

    // ekskul tertentu
    const ef = {}; E.forEach(e => new Set(toks(e.name)).forEach(w => ef[w] = (ef[w] || 0) + 1));
    E.forEach(e => add('eks:' + e.id, [e.name, ...toks(e.name).filter(w => ef[w] === 1 && w.length >= 4)], () => ({
      t: `**${e.name}**\n${e.desc || ''}` + (e.jadwal ? `\n\n**Jadwal:** ${e.jadwal}` : ''), l: [L('Lihat ekstrakurikuler', 'ekskul.html')], c: [C('Ekstrakurikuler lain', 'ekstrakurikuler'), C('Info PPDB', 'info ppdb')] })));
    add('ekskul', ['ekskul', 'kegiatan siswa', 'minat bakat', 'organisasi', 'osis', 'olahraga', 'seni'], () => ({
      t: '**Ekstrakurikuler**\n' + bul(E.map(e => e.name + (e.jadwal ? ` (${e.jadwal})` : ''))), l: [L('Semua ekstrakurikuler', 'ekskul.html')], c: E.slice(0, 4).map(e => C(e.name, e.name)) }));

    add('prestasi', ['prestasi', 'juara', 'lomba', 'penghargaan', 'medali', 'lks', 'kejuaraan', 'piala', 'menang'], () => ({
      t: '**Prestasi terbaru**\n' + bul((PRESTASI || []).slice(0, 4).map(p => `${p.title}${p.tingkat ? ` (${p.tingkat}${p.tahun ? ', ' + p.tahun : ''})` : ''}`)), l: [L('Semua prestasi', 'prestasi.html')], c: [C('Kegiatan', 'kegiatan sekolah'), C('Jurusan', 'jurusan')] }));
    add('kegiatan', ['kegiatan', 'acara', 'agenda', 'berita', 'dokumentasi', 'event', 'kunjungan'], () => ({
      t: '**Kegiatan terbaru**\n' + bul((KEGIATAN || []).slice(0, 4).map(k => `${k.title}${k.tanggal ? ' (' + k.tanggal + ')' : ''}`)), l: [L('Semua kegiatan', 'kegiatan.html')], c: [C('Prestasi', 'prestasi'), C('Ekstrakurikuler', 'ekstrakurikuler')] }));

    add('kontak', ['alamat', 'telepon', 'kontak', 'hubungi', 'email', 'surel', 'jam buka', 'jam operasional', 'jam layanan', 'buka jam', 'whatsapp', 'dimana sekolah', 'sekolah dimana', 'letak sekolah', 'rute'], () => ({
      t: `**${CFG.namaLengkap}**\n` + bul([`Alamat: ${CFG.alamat}`, `Telepon: ${CFG.telepon}`, `Email: ${CFG.email}`, CFG.jam ? `Jam operasional: ${CFG.jam}` : null].filter(Boolean)),
      l: [L('Buka di Google Maps', 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(CFG.alamat)), L('Halaman kontak', 'kontak.html')], c: [C('Chat WhatsApp panitia', '', 'wa'), C('Info PPDB', 'info ppdb')] }));
    add('profil', ['profil', 'tentang', 'sejarah', 'visi', 'misi', 'akreditasi', 'terakreditasi', 'npsn', 'kepala sekolah', 'jumlah siswa', 'jumlah guru', 'status sekolah'], () => ({
      t: `**${CFG.namaLengkap}**\nTerakreditasi **${CFG.akreditasi}**, dengan ${CFG.jumlahSiswa} siswa aktif dan ${CFG.jumlahGuru} guru dan tenaga pendidik.\n\n**Visi:** ${CFG.visi}\n\n**Misi:**\n${bul(CFG.misi || [])}`,
      l: [L('Tentang kami', 'profil.html')], c: [C('Jurusan', 'jurusan'), C('Info PPDB', 'info ppdb')] }));
    add('unduh', ['unduh', 'formulir', 'surat', 'surat izin', 'surat pernyataan', 'berkas unduhan', 'pusat berkas', 'template', 'form pkl', 'jurnal'], () => {
      const cats = {}; (UNDUHAN || []).filter(x => x.aktif !== false).forEach(x => cats[x.kategori || 'Lainnya'] = (cats[x.kategori || 'Lainnya'] || 0) + 1);
      return { t: '**Pusat Berkas**\nDokumen dan formulir resmi sekolah tersedia di halaman Unduhan:\n' + bul(Object.entries(cats).map(([k, n]) => `${k} (${n} berkas)`)), l: [L('Buka Pusat Berkas', 'unduhan.html')], c: [C('Syarat pendaftaran', 'syarat pendaftaran'), C('Info PPDB', 'info ppdb')] };
    });
    add('pkl', ['pkl', 'industri', 'mitra', 'kerja', 'lulusan', 'alumni', 'karier', 'karir', 'dunia kerja', 'penempatan', 'lowongan'], () => ({
      t: `Sekolah bekerja sama dengan **${CFG.mitra}** mitra industri untuk PKL dan penyaluran lulusan. Sekitar **${CFG.statKerja || '-'}** lulusan terserap di dunia kerja.\n\nProspek karier tiap jurusan:\n` + bul(J.map(([, j]) => `**${j.singkatan}**: ${(j.karier || []).slice(0, 3).join(', ')}`)),
      l: [L('Lihat jurusan', 'jurusan.html'), L('Formulir PKL', 'unduhan.html')], c: [C('Jurusan', 'jurusan'), C('Info PPDB', 'info ppdb')] }));
    add('fasilitas', ['fasilitas', 'laboratorium', 'ruang praktik', 'perpustakaan', 'masjid', 'musala', 'kantin', 'gedung', 'sarana', 'prasarana', 'komputer'], () => ({
      t: '**Fasilitas per jurusan**\n' + bul(J.map(([, j]) => `**${j.singkatan}**: ${(j.fasilitas || []).slice(0, 3).join(', ')}`)), l: [L('Galeri fasilitas', 'profil.html')], c: [C('Jurusan', 'jurusan'), C('Info PPDB', 'info ppdb')] }));

    // jawaban buatan admin: prioritas sedikit lebih tinggi
    (typeof CHATBOT !== 'undefined' ? CHATBOT || [] : []).filter(x => x && x.aktif !== false && x.jawaban).forEach(x => {
      const words = String(x.kata || '').split(/[,\n]/).map(s => s.trim()).filter(Boolean);
      add('cb:' + x.id, words.length ? words : toks(x.tanya).filter(w => !STOP.has(w)), () => customAnswer(x.jawaban), { p: 1 });
    });
    return I;
  }
  // Jawaban admin: **tebal**, baris baru, dan tautan [teks](halaman.html) menjadi tombol
  function customAnswer(raw) {
    const links = []; const text = String(raw).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, h) => { links.push(L(t, h)); return ''; }).replace(/[ \t]+\n/g, '\n').trim();
    return { t: text, l: links, c: TOPIK.slice(0, 4) };
  }

  /* ---------- 4. Pencarian jawaban ---------- */
  const MIN = 1.2;
  function answer(q) {
    const T = toks(q), J = ' ' + T.join(' ') + ' ';
    if (!T.length) return fallback();
    let best = null, bs = 0; const scored = [];
    buildIntents().forEach(it => {
      let s = scoreKw(it.k, T, J) + (it.p || 0) * (scoreKw(it.k, T, J) > 0 ? 1 : 0);
      if (it.max && T.length > it.max) s *= .3;
      scored.push([it, s]);
      if (s > bs + 1e-9) { bs = s; best = it; }
    });
    if (!best || bs < MIN) {
      // cadangan: cocokkan dengan FAQ PPDB berdasarkan kata-kata pertanyaannya
      const hit = (PPDB.faq || []).filter(x => x && x.aktif !== false && x.q).map(x => {
        const ft = toks(x.q + ' ' + x.a).filter(w => !STOP.has(w) && w.length > 2); return [x, T.filter(t => t.length > 2 && !STOP.has(t) && ft.some(f => f === t)).length];
      }).sort((a, b) => b[1] - a[1])[0];
      if (hit && hit[1] >= 2) return { t: `**${hit[0].q}**\n${hit[0].a}`, c: [C('Info PPDB', 'info ppdb'), C('Hubungi panitia', 'hubungi admin')] };
      return fallback();
    }
    const res = best.a(T);
    // pertanyaan memuat dua topik: tawarkan topik kedua sebagai chip pertama
    const second = scored.filter(([it, s]) => it.id !== best.id && LBL[it.id] && s >= 3 && s >= bs * .6).sort((a, b) => b[1] - a[1])[0];
    if (second && LBL[best.id]) res.c = [C(LBL[second[0].id], second[0].q0), ...(res.c || []).filter(c => c.t !== LBL[second[0].id])].slice(0, 6);
    return res;
  }
  const LBL = { ppdb: 'Info PPDB', syarat: 'Syarat pendaftaran', alur: 'Alur pendaftaran', biaya: 'Biaya', beasiswa: 'Beasiswa', jurusan: 'Jurusan', ekskul: 'Ekstrakurikuler',
    prestasi: 'Prestasi', kegiatan: 'Kegiatan', kontak: 'Alamat dan kontak', profil: 'Profil sekolah', unduh: 'Pusat Berkas', pkl: 'PKL dan lulusan', fasilitas: 'Fasilitas' };
  function fallback() {
    return { t: 'Maaf, saya belum menemukan jawabannya. Coba pakai kata kunci lain (misalnya "syarat", "jadwal", "TKJ", "alamat"), pilih salah satu topik di bawah, atau tanyakan langsung ke panitia.', c: [...TOPIK.slice(0, 5), C('Chat WhatsApp panitia', '', 'wa')], miss: true };
  }

  /* ---------- 5. Tampilan ---------- */
  const ICON_CHAT = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.5-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h7M8.5 14h4"/></svg>';
  const ICON_X = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const ICON_SEND = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>';
  const safeHref = h => { h = String(h || '').trim(); return /^(javascript|data|vbscript):/i.test(h) ? '#' : h; };
  const fmt = t => ESC(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');

  let log, panel, input, fab, hist = [], busy = false, lastQ = '';
  function save() { ss.set(STORE, JSON.stringify(hist.slice(-30))); }
  function scroll() { log.scrollTop = log.scrollHeight; }
  function clearChips() { log.querySelectorAll('.cb-chips').forEach(e => e.remove()); }
  function draw(m, animate) {
    const el = document.createElement('div'); el.className = 'cb-m ' + (m.r === 'u' ? 'user' : 'bot') + (animate ? ' in' : '');
    const links = (m.l || []).map(l => { const h = safeHref(l.h), ext = /^https?:\/\//i.test(h); return `<a class="cb-l" href="${qa(h)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${ESC(l.t)}<span aria-hidden="true">→</span></a>`; }).join('');
    el.innerHTML = `<div class="cb-b">${fmt(m.t)}${links ? `<div class="cb-ls">${links}</div>` : ''}</div>`;
    clearChips(); log.appendChild(el);
    if (m.c && m.c.length) {
      const ch = document.createElement('div'); ch.className = 'cb-chips';
      m.c.forEach(c => { const b = document.createElement('button'); b.type = 'button'; b.className = 'cb-chip'; b.textContent = c.t; b.onclick = () => c.a ? act(c.a) : ask(c.q, c.t); ch.appendChild(b); });
      log.appendChild(ch);
    }
    scroll();
  }
  function push(m) { hist.push(m); save(); draw(m, true); }
  function act(a) { if (a === 'wa') waChat(lastQ); else if (a === 'daftar') { close(); openDaftar(); } }
  function typing(on) {
    const old = log.querySelector('.cb-typing'); if (old) old.remove();
    if (on) { const t = document.createElement('div'); t.className = 'cb-m bot cb-typing'; t.setAttribute('aria-label', 'Mengetik'); t.innerHTML = '<div class="cb-b"><i></i><i></i><i></i></div>'; clearChips(); log.appendChild(t); scroll(); }
  }
  function ask(q, shown) {
    q = String(q || '').trim(); if (!q || busy) return;
    busy = true; lastQ = q; push({ r: 'u', t: shown || q }); typing(true);
    const res = answer(q);
    setTimeout(() => { typing(false); push(Object.assign({ r: 'b' }, res)); busy = false; if (!panel.hidden) input.focus({ preventScroll: true }); }, REDUCE ? 150 : 450 + Math.min(res.t.length * 3, 650));
  }
  function open() {
    panel.hidden = false; fab.querySelector('.cb-btn').setAttribute('aria-expanded', 'true'); ss.set(OPENK, '1'); closeTease(); scroll();
    setTimeout(() => input.focus({ preventScroll: true }), 60);
  }
  function close() { panel.hidden = true; const b = fab.querySelector('.cb-btn'); b.setAttribute('aria-expanded', 'false'); ss.set(OPENK, '0'); }
  function closeTease() { const t = $('cb-tease'); if (t) t.hidden = true; ss.set(TEASEK, '1'); }

  window.initChatbot = function () {
    if ($('cb-fab')) return;
    fab = document.createElement('div'); fab.className = 'cb-fab'; fab.id = 'cb-fab';
    fab.innerHTML = `<section class="cb-panel" id="cb-panel" role="dialog" aria-label="Asisten virtual ${qa(CFG.namaLengkap)}" hidden>
        <header class="cb-hd"><div class="cb-av">${ICON_CHAT.replace(/width="26" height="26"/, 'width="22" height="22"')}</div>
          <div class="cb-who"><b>Asisten Virtual</b><span>${ESC(CFG.namaLengkap)}</span></div>
          <button type="button" class="cb-x" id="cb-x" aria-label="Tutup chat">${ICON_X}</button></header>
        <div class="cb-log" id="cb-log" role="log" aria-live="polite"></div>
        <form class="cb-form" id="cb-form" autocomplete="off"><input id="cb-in" type="text" maxlength="200" placeholder="Tulis pertanyaanmu..." aria-label="Tulis pertanyaan"><button type="submit" class="cb-send" aria-label="Kirim">${ICON_SEND}</button></form>
        <footer class="cb-foot">Jawaban otomatis. Butuh bantuan langsung? <button type="button" id="cb-wa">Chat panitia via WhatsApp</button></footer>
      </section>
      <div class="cb-row">
        <div class="cb-tease" id="cb-tease" hidden><button type="button" class="cb-tease-t" id="cb-tease-t">Ada pertanyaan? Tanya kami</button><button type="button" class="cb-tease-x" id="cb-tease-x" aria-label="Tutup">${ICON_X}</button></div>
        <button type="button" class="cb-btn" aria-label="Buka asisten virtual" aria-expanded="false">${ICON_CHAT}</button>
      </div>`;
    document.body.appendChild(fab);
    panel = $('cb-panel'); log = $('cb-log'); input = $('cb-in');
    // riwayat percakapan bertahan selama sesi (pindah halaman tidak menghapusnya)
    try { hist = JSON.parse(ss.get(STORE) || '[]'); } catch (e) { hist = []; }
    if (!hist.length) hist = [{ r: 'b', t: `Halo! Saya asisten virtual ${CFG.namaLengkap}. Tanyakan seputar PPDB, jurusan, ekstrakurikuler, atau kontak sekolah, atau pilih topik di bawah.`, c: TOPIK }];
    hist.forEach((m, i) => { if (i < hist.length - 1) { const k = Object.assign({}, m); delete k.c; draw(k, false); } else draw(m, false); });
    fab.querySelector('.cb-btn').onclick = () => panel.hidden ? open() : close();
    $('cb-x').onclick = () => { close(); fab.querySelector('.cb-btn').focus(); };
    $('cb-wa').onclick = () => waChat(lastQ);
    $('cb-tease-t').onclick = open; $('cb-tease-x').onclick = closeTease;
    $('cb-form').onsubmit = e => { e.preventDefault(); const v = input.value; input.value = ''; ask(v); };
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden && !document.getElementById('modal')) { close(); fab.querySelector('.cb-btn').focus(); } });
    if (ss.get(OPENK) === '1') { panel.hidden = false; fab.querySelector('.cb-btn').setAttribute('aria-expanded', 'true'); scroll(); }
    else if (ss.get(TEASEK) !== '1') {
      setTimeout(() => { const t = $('cb-tease'); if (t && panel.hidden) t.hidden = false; }, 6000);
      setTimeout(closeTease, 18000);
    }
  };
  window.cbOpen = () => { if (panel) open(); };
  window.cbAnswer = answer;   // untuk pengujian
})();
