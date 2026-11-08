/* =====================================================================
   data.js: data bawaan website + penyimpanan untuk panel admin
   Dipakai oleh index.html (situs publik) dan admin.html (panel admin).
   Urutan pemuatan data di situs:
     1) draf hasil edit di admin (tersimpan di browser yang sama)
     2) file data.json (hasil "Unduh data.json" dari admin, diunggah ke hosting)
     3) data bawaan di bawah ini
   ===================================================================== */
(function () {
    const JURUSAN = {
      tkj: {
        name: "Teknik Komputer dan Jaringan", singkatan: "TKJ", tagline: "Membangun, mengelola, dan mengamankan jaringan serta sistem komputer.",
        desc: "Program keahlian TKJ membekali siswa dengan kemampuan merakit komputer, merancang jaringan LAN/WAN, administrasi server, hingga dasar keamanan siber — disiapkan untuk kebutuhan industri teknologi informasi yang terus berkembang.",
        kompetensi: ["Instalasi & perawatan hardware komputer", "Perancangan dan konfigurasi jaringan", "Administrasi server dan sistem operasi", "Dasar keamanan jaringan (cyber security)", "Pemrograman dasar dan troubleshooting"],
        fasilitas: ["Lab komputer & jaringan ber-AC", "Rak server dan perangkat mikrotik", "Akses internet fiber untuk praktik", "Ruang simulasi data center mini"],
        kegiatan: ["Praktik kerja industri (PKL) di perusahaan IT", "Sertifikasi kompetensi jaringan", "Kunjungan industri ke data center", "Kompetisi LKS bidang IT Network Systems"],
        karier: ["Teknisi jaringan", "IT Support / Helpdesk", "Network Administrator", "Technopreneur bidang IT"]
      },
      dkv: {
        name: "Desain Komunikasi Visual", singkatan: "DKV", tagline: "Menciptakan karya visual, branding, dan konten multimedia yang komunikatif.",
        desc: "Program keahlian DKV mengasah kepekaan estetika dan keterampilan teknis siswa dalam desain grafis, ilustrasi, fotografi, dan produksi multimedia — mempersiapkan kreator visual untuk industri kreatif digital.",
        kompetensi: ["Desain grafis & tipografi", "Ilustrasi digital dan manual", "Fotografi dan videografi dasar", "Branding dan identitas visual", "Produksi konten multimedia & animasi"],
        fasilitas: ["Studio desain dengan komputer grafis", "Studio foto mini & pencahayaan", "Ruang produksi multimedia", "Perangkat drawing tablet"],
        kegiatan: ["Praktik kerja industri di agensi kreatif", "Pameran karya siswa tahunan", "Proyek desain untuk UMKM lokal", "Kompetisi desain grafis & fotografi"],
        karier: ["Graphic Designer", "Videografer / Editor", "Content Creator", "Ilustrator lepas"]
      },
      tbsm: {
        name: "Teknik dan Bisnis Sepeda Motor", singkatan: "TBSM", tagline: "Menguasai perawatan, perbaikan, dan bisnis layanan sepeda motor modern.",
        desc: "Program keahlian TBSM mencetak teknisi yang cakap dalam perawatan mesin, kelistrikan, dan teknologi sepeda motor terbaru, sekaligus memahami sisi bisnis layanan otomotif dan wirausaha bengkel.",
        kompetensi: ["Perawatan dan perbaikan mesin motor", "Sistem kelistrikan kendaraan", "Teknologi motor injeksi & matic", "Manajemen bengkel dan layanan pelanggan", "Dasar kewirausahaan otomotif"],
        fasilitas: ["Bengkel praktik dengan unit motor terkini", "Peralatan diagnostik injeksi", "Area praktik kelistrikan", "Ruang teori otomotif"],
        kegiatan: ["Praktik kerja industri di dealer resmi", "Sertifikasi kompetensi otomotif", "Servis motor gratis untuk masyarakat", "Kompetisi LKS bidang otomotif"],
        karier: ["Teknisi sepeda motor", "Service Advisor", "Wirausaha bengkel", "Staf dealer otomotif"]
      }
    };
    const PRESTASI = [
      { id: 1, title: "Juara 1 LKS Network Systems", kategori: "Akademik", tingkat: "Provinsi", tahun: "2026", jur: "TKJ", desc: "Tim TKJ meraih posisi pertama pada Lomba Kompetensi Siswa bidang Network Systems Administration tingkat provinsi." },
      { id: 2, title: "Juara 2 Desain Poster Nasional", kategori: "Non-Akademik", tingkat: "Nasional", tahun: "2025", jur: "DKV", desc: "Karya poster kampanye lingkungan dari siswa DKV meraih juara 2 dalam kompetisi desain tingkat nasional." },
      { id: 3, title: "Juara 1 Kontes Modifikasi Motor Irit", kategori: "Non-Akademik", tingkat: "Kota", tahun: "2025", jur: "TBSM", desc: "Tim TBSM menang dalam kontes efisiensi bahan bakar sepeda motor hasil modifikasi siswa." },
      { id: 4, title: "Sekolah Adiwiyata Tingkat Kota", kategori: "Sekolah", tingkat: "Kota", tahun: "2025", jur: "Sekolah", desc: "Penghargaan atas komitmen sekolah dalam pengelolaan lingkungan dan program hijau berkelanjutan." },
      { id: 5, title: "Juara 3 Debat Bahasa Inggris", kategori: "Akademik", tingkat: "Provinsi", tahun: "2024", jur: "Umum", desc: "Tim debat sekolah meraih juara 3 dalam kompetisi debat bahasa Inggris antar SMK se-provinsi." },
      { id: 6, title: "Juara Harapan 1 Fotografi Jurnalistik", kategori: "Non-Akademik", tingkat: "Kota", tahun: "2024", jur: "DKV", desc: "Karya foto jurnalistik siswa DKV mendapat penghargaan pada festival fotografi tingkat kota." }
    ];
    const EKSKUL = [
      { id: 1, name: "Tari Tradisional Saman", desc: "Melestarikan seni tari tradisional Saman dengan latihan kekompakan gerak dan ketukan bersama tim.", jadwal: "Sabtu, 09.00–11.00" },
      { id: 2, name: "Palang Merah Remaja (PMR)", desc: "Melatih kesiapsiagaan pertolongan pertama, kesehatan, dan kepedulian sosial di lingkungan sekolah.", jadwal: "Senin, 14.00–15.30" },
      { id: 3, name: "Paskibra", desc: "Membentuk kedisiplinan dan kepemimpinan melalui latihan baris-berbaris dan pengibaran bendera.", jadwal: "Rabu, 15.00–17.00" },
      { id: 4, name: "Pramuka", desc: "Membentuk kemandirian, kerja sama, dan jiwa kepemimpinan melalui kegiatan kepramukaan rutin.", jadwal: "Jumat, 14.00–16.00" },
      { id: 5, name: "Marching Band", desc: "Mengasah kemampuan bermusik dan kekompakan formasi dalam grup marching band sekolah.", jadwal: "Selasa & Kamis, 15.00–17.00" },
      { id: 6, name: "Pencak Silat", desc: "Melatih seni bela diri tradisional Indonesia, kedisiplinan fisik, dan mental siswa.", jadwal: "Kamis, 15.30–17.30" },
      { id: 7, name: "Basket", desc: "Wadah bakat olahraga bola basket, melatih kekompakan tim melalui latihan dan pertandingan rutin.", jadwal: "Selasa, 15.30–17.30" },
      { id: 8, name: "Futsal", desc: "Melatih kekompakan tim dan kebugaran melalui latihan dan pertandingan futsal antar sekolah.", jadwal: "Rabu & Sabtu, 15.30–17.30" }
    ];
    const KEGIATAN = [
      { id: 1, kategori: "Non-Akademik", jur: "Sekolah", title: "Upacara Peringatan Hari Kemerdekaan", tanggal: "17 Agustus 2026", excerpt: "Seluruh siswa dan guru mengikuti upacara bendera dalam rangka HUT Kemerdekaan Republik Indonesia.", content: "Upacara berlangsung khidmat di lapangan sekolah, diikuti oleh seluruh siswa, guru, dan staf. Petugas upacara terdiri dari siswa terpilih dari berbagai jurusan sebagai bentuk apresiasi atas prestasi dan kedisiplinan mereka sepanjang tahun ajaran." },
      { id: 2, kategori: "Akademik", jur: "TKJ", title: "Kunjungan Industri Jurusan TKJ", tanggal: "3 September 2026", excerpt: "Siswa TKJ mengunjungi salah satu perusahaan penyedia layanan data center di Jakarta.", content: "Kegiatan ini bertujuan memberikan gambaran nyata dunia kerja di bidang teknologi jaringan. Siswa berkesempatan melihat langsung ruang server, sistem keamanan data center, serta berdiskusi dengan praktisi industri mengenai peluang karier di bidang IT." },
      { id: 3, kategori: "Non-Akademik", jur: "DKV", title: "Pameran Karya Siswa DKV", tanggal: "20 September 2026", excerpt: "Karya-karya terbaik siswa jurusan DKV dipamerkan dalam acara tahunan sekolah.", content: "Pameran menampilkan poster, ilustrasi, fotografi, dan karya multimedia hasil proyek akhir siswa. Acara ini juga dihadiri oleh orang tua dan tamu undangan dari industri kreatif setempat sebagai bentuk apresiasi terhadap karya siswa." },
      { id: 4, kategori: "Akademik", jur: "Umum", title: "Lomba Kompetensi Siswa (LKS) Tingkat Provinsi", tanggal: "5 Oktober 2026", excerpt: "Perwakilan sekolah dari tiga jurusan mengikuti ajang LKS tingkat provinsi.", content: "Sekolah mengirimkan perwakilan terbaik dari jurusan TKJ, DKV, dan TBSM untuk berkompetisi di tingkat provinsi. Persiapan dilakukan melalui pelatihan intensif bersama pembimbing dan alumni yang berpengalaman." },
      { id: 5, title: "Bakti Sosial dan Servis Motor Gratis", tanggal: "12 Oktober 2026", excerpt: "Siswa TBSM memberikan layanan servis motor gratis bagi warga sekitar sekolah.", content: "Kegiatan ini menjadi ajang praktik nyata sekaligus pengabdian kepada masyarakat. Warga sekitar sekolah dapat memanfaatkan layanan servis ringan secara gratis yang dikerjakan langsung oleh siswa di bawah pengawasan guru pembimbing." },
      { id: 6, title: "Seminar Kewirausahaan dan Dunia Kerja", tanggal: "28 Oktober 2026", excerpt: "Menghadirkan alumni dan praktisi industri untuk berbagi pengalaman kepada siswa kelas akhir.", content: "Seminar ini bertujuan membekali siswa kelas akhir dengan wawasan mengenai dunia kerja maupun peluang berwirausaha setelah lulus, lengkap dengan sesi tanya jawab dan berbagi pengalaman dari alumni yang telah sukses di bidangnya." }
    ];


  // PPDB (Penerimaan Peserta Didik Baru). Semua isi ini bisa diubah lewat admin.html menu PPDB dan Berkas PPDB.
  // Tanggal dan isi di bawah hanya CONTOH, silakan diganti sesuai jadwal resmi sekolah.
  const PPDB = {
    status: "Dibuka",
    tahun: "2027/2028",
    intro: "Selamat datang calon siswa baru! Ikuti alur pendaftaran berikut, siapkan berkas persyaratan, lalu daftar secara online atau lewat WhatsApp panitia.",
    jadwal: ["Gelombang 1: 1 November – 31 Desember 2026", "Gelombang 2: 1 Januari – 28 Februari 2027", "Pengumuman hasil seleksi: 15 Maret 2027", "Daftar ulang: 16–31 Maret 2027"],
    alur: ["Siapkan berkas persyaratan (lihat daftar di bawah)", "Isi formulir pendaftaran online, atau kirim data awal lewat WhatsApp panitia", "Unggah atau serahkan berkas persyaratan", "Verifikasi berkas oleh panitia PPDB", "Lihat pengumuman hasil seleksi, lalu lakukan daftar ulang"],
    formUrl: "",
    // Countdown di beranda & halaman PPDB. Format: 2026-12-31 23:59 (WIB). Kosongkan untuk menyembunyikan.
    deadline: "2026-12-31 23:59",
    deadlineLabel: "Gelombang 1 ditutup dalam",
    // FAQ Biaya & Beasiswa (accordion). Isi di bawah hanya CONTOH, ganti lewat admin.html menu FAQ PPDB.
    faq: [
      { id: 1, aktif: true, kategori: "Biaya", q: "Apa saja komponen biaya masuk?", a: "Umumnya terdiri dari biaya pendaftaran, uang pangkal, seragam, dan perlengkapan praktik. Nominal resmi diisi panitia lewat admin; hubungi panitia PPDB untuk rincian terbaru." },
      { id: 2, aktif: true, kategori: "Biaya", q: "Bagaimana pembayaran SPP dan apakah bisa dicicil?", a: "SPP dibayar setiap bulan. Skema cicilan uang pangkal dapat dikonsultasikan langsung dengan panitia PPDB." },
      { id: 3, aktif: true, kategori: "Beasiswa", q: "Apakah tersedia keringanan untuk pemegang KIP?", a: "Calon siswa pemegang Kartu Indonesia Pintar (KIP) dapat mengajukan keringanan biaya. Siapkan fotokopi KIP dan serahkan saat verifikasi berkas." },
      { id: 4, aktif: true, kategori: "Beasiswa", q: "Bagaimana syarat beasiswa prestasi?", a: "Siswa berprestasi akademik maupun non-akademik (dibuktikan sertifikat atau piagam) dapat dipertimbangkan mendapat potongan biaya." },
      { id: 5, aktif: true, kategori: "Beasiswa", q: "Apakah ada beasiswa Tahfiz?", a: "Calon siswa penghafal Al-Qur'an dapat mengikuti tes tahfiz. Besar keringanan menyesuaikan capaian hafalan." },
      { id: 6, aktif: true, kategori: "Umum", q: "Apakah bisa mendaftar lewat WhatsApp?", a: "Bisa. Klik tombol Daftar Cepat, isi data singkat, dan pesan otomatis terkirim ke WhatsApp panitia." }
    ],
    catatan: "Ada pertanyaan seputar pendaftaran? Hubungi panitia PPDB melalui kontak sekolah.",
    berkas: [
      { id: 1, nama: "Formulir pendaftaran", ket: "Diisi lengkap oleh calon siswa dan orang tua/wali", link: "" },
      { id: 2, nama: "Fotokopi ijazah atau SKL SMP/MTs", ket: "Dilegalisir, 1 lembar", link: "" },
      { id: 3, nama: "Fotokopi rapor semester 1–5", ket: "Dilegalisir", link: "" },
      { id: 4, nama: "Fotokopi Kartu Keluarga", ket: "1 lembar", link: "" },
      { id: 5, nama: "Fotokopi akta kelahiran", ket: "1 lembar", link: "" },
      { id: 6, nama: "Pas foto 3x4", ket: "4 lembar, latar merah", link: "" },
      { id: 7, nama: "Surat pernyataan orang tua/wali", ket: "Bermaterai, format sesuai ketentuan sekolah", link: "" }
    ]
  };

  // POSTER di beranda. Diatur lewat admin.html menu Poster (bisa dinyalakan/dimatikan satu per satu).
  // Tiga poster di bawah hanyalah CONTOH, silakan diedit atau dinonaktifkan.
  const POSTER = [
    { id: 1, aktif: true, judul: "PPDB 2027/2028 Telah Dibuka", keterangan: "Daftarkan putra-putri Anda sekarang. Kuota terbatas.", foto: "", link: "#ppdb", tombol: "Daftar Sekarang", warna: "Emas", tampilTeks: true },
    { id: 2, aktif: true, judul: "Tiga Program Keahlian Unggulan", keterangan: "TKJ, DKV, dan TBSM: belajar langsung di laboratorium dan bengkel praktik.", foto: "", link: "#jurusan", tombol: "Lihat Jurusan", warna: "Biru", tampilTeks: true },
    { id: 3, aktif: false, judul: "Tempat Pengumuman Sekolah", keterangan: "Poster ini nonaktif. Aktifkan lewat admin, lalu ganti teks atau unggah gambar posternya.", foto: "", link: "", tombol: "", warna: "Hijau", tampilTeks: true }
  ];

  const settings = {
    namaLengkap: "SMK Islamiyah Ciledug",
    namaSekolah: "SMK ISLAMIYAH",
    subNama: "CILEDUG",
    heroJudul: "Menyiapkan Lulusan Terampil, Berdaya Saing, dan Berakhlak Mulia",
    heroDeskripsi: "Sekolah menengah kejuruan dengan tiga program keahlian unggulan, membekali siswa dengan kompetensi siap kerja dan nilai-nilai keislaman dalam setiap proses belajarnya.",
    alumni: "250+",
    akreditasi: "A",
    akreditasiKet: "Terakreditasi BAN-S/M",
    jumlahSiswa: "500+",
    jumlahGuru: "40+",
    mitra: "5+",
    alamat: "Jl. Raden Fatah No. 36, Sudimara Barat, Kec. Ciledug, Kota Tangerang, Banten 15151",
    telepon: "(021) 730-4257",
    email: "smk.islamiyah13@gmail.com",
    jam: "Senin–Jumat, 07.00–15.30 WIB",
    whatsapp: "",
    visi: "Menjadi SMK unggulan yang menghasilkan lulusan kompeten, mandiri, dan berakhlak mulia.",
    misi: [
      "Menyelenggarakan pembelajaran kejuruan berbasis kompetensi industri",
      "Menanamkan nilai-nilai keislaman dalam setiap aktivitas sekolah",
      "Membangun kemitraan aktif dengan dunia usaha dan dunia industri",
      "Mengembangkan potensi, minat, dan bakat siswa secara menyeluruh"
    ],
    npsn: "",
    jamLayanan: "",
    statKerja: "90%",
    videoUrl: "",
    videoJudul: "Tur Fasilitas Lab dan Bengkel Praktik",
    waSapaan: "Halo, ada yang bisa kami bantu terkait PPDB?",
    logo: "",
    heroBg: "",
    fotoProfil: "",
    fotoVisi: ""
  };
  // TESTIMONI alumni dan MITRA industri. Isi di bawah hanya CONTOH, ganti lewat admin.html menu Testimoni Alumni / Mitra Industri.
  const TESTIMONI = [
    { id: 1, aktif: true, nama: "Nama Alumni 1", tahun: "2023", pekerjaan: "Network Engineer, PT Contoh Teknologi", pesan: "Praktik langsung di lab dan PKL membuat saya siap kerja begitu lulus.", foto: "" },
    { id: 2, aktif: true, nama: "Nama Alumni 2", tahun: "2022", pekerjaan: "Desainer Grafis, Studio Contoh Kreatif", pesan: "Guru-guru membimbing sampai portofolio saya layak dilirik industri.", foto: "" },
    { id: 3, aktif: true, nama: "Nama Alumni 3", tahun: "2024", pekerjaan: "Teknisi Servis, Bengkel Contoh Motor", pesan: "Ilmu dari bengkel sekolah terpakai setiap hari di tempat kerja.", foto: "" }
  ];
  const MITRA = ["Mitra Industri 1", "Mitra Industri 2", "Mitra Industri 3", "Mitra Industri 4", "Mitra Industri 5", "Mitra Industri 6"].map((nama, i) => ({ id: i + 1, nama, foto: "" }));

  // UNDUHAN (Pusat Berkas): dokumen dan formulir resmi. Contoh di bawah hanya kerangka; "url" sengaja kosong sampai file diisi
  // lewat admin.html > menu Unduhan (path file di folder unduhan/ atau link Google Drive).
  const UNDUHAN = [
    { id: 1, aktif: true, kategori: "Surat & Pernyataan", judul: "Surat Izin Tidak Masuk Sekolah", deskripsi: "Format surat izin dari orang tua/wali siswa.", url: "", jenis: "", ukuran: "", tanggal: "" },
    { id: 2, aktif: true, kategori: "Surat & Pernyataan", judul: "Surat Pernyataan Orang Tua/Wali", deskripsi: "Surat pernyataan bermaterai sesuai ketentuan sekolah.", url: "", jenis: "", ukuran: "", tanggal: "" },
    { id: 3, aktif: true, kategori: "PKL / Prakerin", judul: "Formulir Pendaftaran PKL", deskripsi: "Diisi siswa kelas XI sebelum penempatan Praktik Kerja Lapangan.", url: "", jenis: "", ukuran: "", tanggal: "" },
    { id: 4, aktif: true, kategori: "PKL / Prakerin", judul: "Jurnal Harian PKL", deskripsi: "Lembar catatan kegiatan harian selama PKL.", url: "", jenis: "", ukuran: "", tanggal: "" },
    { id: 5, aktif: true, kategori: "Administrasi", judul: "Formulir Perubahan Data Siswa", deskripsi: "Untuk memperbarui data diri atau data orang tua di sekolah.", url: "", jenis: "", ukuran: "", tanggal: "" },
    { id: 6, aktif: true, kategori: "Administrasi", judul: "Surat Permohonan Legalisir", deskripsi: "Permohonan legalisir ijazah atau dokumen akademik.", url: "", jenis: "", ukuran: "", tanggal: "" }
  ];

  // CHATBOT: jawaban tambahan buatan admin (menu "Chatbot (Tanya Jawab)"). Kosong secara bawaan; jawaban seputar PPDB, jurusan,
  // ekskul, kontak, dan FAQ sudah otomatis diambil dari data situs oleh js/chatbot.js.
  const CHATBOT = [];

  window.SITE_DEFAULT = { settings, JURUSAN, PRESTASI, EKSKUL, KEGIATAN, PPDB, POSTER, TESTIMONI, MITRA, UNDUHAN, CHATBOT };
})();

window.SiteStore = (function () {
  const DB = 'smk_cms', ST = 'kv', KEY = 'site';
  const clone = o => JSON.parse(JSON.stringify(o));

  function openDB() {
    return new Promise((res, rej) => {
      try {
        const r = indexedDB.open(DB, 1);
        r.onupgradeneeded = () => r.result.createObjectStore(ST);
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      } catch (e) { rej(e); }
    });
  }
  async function idbGet() {
    const db = await openDB();
    return new Promise((res, rej) => { const q = db.transaction(ST).objectStore(ST).get(KEY); q.onsuccess = () => res(q.result || null); q.onerror = () => rej(q.error); });
  }
  async function idbSet(v) {
    const db = await openDB();
    return new Promise((res, rej) => { const t = db.transaction(ST, 'readwrite'); t.objectStore(ST).put(v, KEY); t.oncomplete = () => res(); t.onerror = () => rej(t.error); });
  }
  async function idbDel() {
    const db = await openDB();
    return new Promise((res, rej) => { const t = db.transaction(ST, 'readwrite'); t.objectStore(ST).delete(KEY); t.oncomplete = () => res(); t.onerror = () => rej(t.error); });
  }
  async function getLocal() {
    try { return await idbGet(); } catch (e) {
      try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) { return null; }
    }
  }
  // Gabungkan data tersimpan dengan bawaan supaya field baru tidak pernah hilang
  function merge(d) {
    const base = clone(SITE_DEFAULT);
    if (!d) return base;
    return {
      settings: Object.assign(base.settings, d.settings || {}),
      JURUSAN: d.JURUSAN || base.JURUSAN,
      PRESTASI: d.PRESTASI || base.PRESTASI,
      EKSKUL: d.EKSKUL || base.EKSKUL,
      KEGIATAN: d.KEGIATAN || base.KEGIATAN,
      PPDB: Object.assign(base.PPDB, d.PPDB || {}),
      POSTER: d.POSTER || base.POSTER,
      TESTIMONI: d.TESTIMONI || base.TESTIMONI,
      MITRA: d.MITRA || base.MITRA,
      UNDUHAN: d.UNDUHAN || base.UNDUHAN,
      CHATBOT: d.CHATBOT || base.CHATBOT
    };
  }
  // MODE SERVER: kalau api.php ada di hosting, data dibaca dari database di server (langsung up-to-date).
  // Mengembalikan: objek data | null (server ada tapi masih kosong) | undefined (tidak ada server, pakai cara statis)
  // Hosting statis (Netlify, GitHub Pages, dll) tidak punya api.php: setelah terbukti tidak ada, jangan ditanya lagi di tiap halaman.
  const NOSRV = 'smk_nosrv';
  const noServer = () => { try { return sessionStorage.getItem(NOSRV) === '1'; } catch (e) { return false; } };
  const markNoServer = () => { try { sessionStorage.setItem(NOSRV, '1'); } catch (e) { } };
  async function fromServer() {
    if (noServer()) return undefined;
    try {
      const r = await fetch('api/api.php?action=data', { cache: 'no-store', credentials: 'same-origin' });
      if (!r.ok) { markNoServer(); return undefined; }
      const j = await r.json().catch(() => null);
      if (!j || typeof j !== 'object') { markNoServer(); return undefined; }
      return j.empty ? null : j;
    } catch (e) { return undefined; }   // gangguan jaringan sesaat: jangan ditandai "tidak ada server"
  }
  // data.json mulai diunduh begitu skrip ini jalan (paralel dengan permintaan lain), dan di-revalidate (304) bukan diunduh ulang
  let _filePromise = null;
  function fetchFile() { return fetch('content/data.json', { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).catch(() => null); }
  function prefetchFile() { _filePromise = fetchFile(); }
  function takeFile() { const p = _filePromise || fetchFile(); _filePromise = null; return p; }
  prefetchFile();
  async function load() {
    const srv = await fromServer();
    if (srv !== undefined) {
      return srv ? { data: merge(srv), source: 'server' } : { data: clone(SITE_DEFAULT), source: 'server-empty' };
    }
    const local = await getLocal();
    if (local) return { data: merge(local), source: 'draft' };
    const file = await takeFile();   // null bila file:// atau data.json belum ada: pakai bawaan
    if (file && typeof file === 'object') return { data: merge(file), source: 'file' };
    return { data: clone(SITE_DEFAULT), source: 'default' };
  }
  async function save(data) {
    try { await idbSet(data); }
    catch (e) { localStorage.setItem(KEY, JSON.stringify(data)); }
  }
  async function clearDraft() {
    try { await idbDel(); } catch (e) { }
    try { localStorage.removeItem(KEY); } catch (e) { }
  }
  return { load, save, clearDraft, clone, merge, getLocal };
})();
