/* =====================================================================
   lang.js: FITUR GANTI BAHASA  Indonesia (ID)  <->  English (EN)
   ---------------------------------------------------------------------
   File ini berdiri sendiri. Tidak ada kode lama yang diubah; cukup dipasang
   dengan satu baris  <script src="js/lang.js"></script>  di tiap halaman publik
   (sesudah chatbot.js). Untuk mencabut fitur, hapus baris itu.

   Cara kerja:
   1. Tombol "ID / EN" ditambahkan otomatis ke navbar. Pilihan bahasa disimpan
      di browser (localStorage "smk_lang"), jadi tetap berlaku di semua halaman.
   2. Saat bahasa = EN, setiap teks yang tampil (menu, judul, isi halaman,
      placeholder, aria-label, pesan chatbot, dst) dicocokkan dengan KAMUS di
      bawah, lalu diganti ke bahasa Inggris. Teks yang belum ada di kamus
      dibiarkan tetap bahasa Indonesia (tidak error).
   3. MutationObserver memantau halaman, sehingga konten yang dirender belakangan
      oleh app.js / chatbot.js (berita, modal, balasan bot) ikut diterjemahkan.
   4. Saat kembali ke ID, semua teks asli dikembalikan.

   MENAMBAH / MENGUBAH TERJEMAHAN
   - Konten baru dari admin.html (jurusan, prestasi, kegiatan, FAQ, dst) belum ada
     terjemahannya. Tambahkan satu baris di objek KAMUS:  "teks Indonesia": "English text",
     (teks Indonesia harus sama persis dengan yang tampil di web).
   - Teks yang mengandung angka / nama yang berubah-ubah diatur lewat POLA (regex).
   - Pesan WhatsApp ke panitia sengaja tetap berbahasa Indonesia.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- 1. Status bahasa ---------- */
  const KEY = 'smk_lang';
  let LANG = 'id';
  try { const s = localStorage.getItem(KEY); if (s === 'en' || s === 'id') LANG = s; } catch (e) { }

  /* ---------- 2. KAMUS Indonesia -> English (cocok persis) ---------- */
  const KAMUS = {
    /* --- navigasi, tombol umum --- */
    "Beranda": "Home", "Tentang Kami": "About Us", "Jurusan": "Majors", "Prestasi": "Achievements",
    "Ekstrakurikuler": "Extracurriculars", "Kegiatan": "Activities", "Unduhan": "Downloads", "Kontak": "Contact",
    "Semua Jurusan": "All Majors", "Semua Ekstrakurikuler": "All Extracurriculars", "Semua Prestasi": "All Achievements",
    "Semua Kegiatan": "All Activities", "Semua Ekskul": "All Extracurriculars",
    "Ganti mode terang atau gelap": "Switch between light and dark mode",
    "Navigasi cepat": "Quick navigation", "Tutup": "Close", "Unduh": "Download", "Semua": "All",
    "← Beranda": "← Home", "← Jurusan": "← Majors", "← Semua Jurusan": "← All Majors", "← Prestasi": "← Achievements",
    "← Semua Prestasi": "← All Achievements", "← Ekstrakurikuler": "← Extracurriculars", "← Semua Ekskul": "← All Extracurriculars",
    "← Kegiatan": "← Activities", "← Semua Kegiatan": "← All Activities", "Kembali ke Beranda": "Back to Home",

    /* --- beranda --- */
    "Menyiapkan Lulusan Terampil, Berdaya Saing, dan Berakhlak Mulia": "Preparing Skilled, Competitive Graduates of Noble Character",
    "Sekolah menengah kejuruan dengan tiga program keahlian unggulan, membekali siswa dengan kompetensi siap kerja dan nilai-nilai keislaman dalam setiap proses belajarnya.":
      "A vocational high school with three outstanding skills programs, equipping students with job-ready competencies and Islamic values throughout their learning.",
    "Lihat Jurusan": "View Majors", "Akreditasi": "Accreditation", "Lulusan Terserap Kerja": "Graduates Employed",
    "Mitra Industri": "Industry Partners", "Siswa Aktif": "Active Students", "Program Keahlian": "Skills Programs",
    "Pendaftaran Siswa Baru Segera Dibuka": "New Student Registration Opens Soon",
    "Pendaftaran Siswa Baru Telah Dibuka": "New Student Registration Is Now Open",
    "Segera dibuka": "Opening soon", "Dibuka": "Open", "Ditutup": "Closed", "Pra-Daftar": "Pre-Register", "Daftar Cepat": "Quick Register",
    "Persyaratan dan alur": "Requirements and process",
    "Dipercaya mitra industri tempat siswa PKL dan alumni bekerja": "Trusted by the industry partners where our students intern and our alumni work",
    "Tentang kami": "About us", "Sekolah kejuruan yang tumbuh bersama industri": "A vocational school that grows together with industry",
    "Pendidikan yang memadukan kompetensi teknis, praktik langsung, dan nilai keislaman.": "Education that combines technical competence, hands-on practice, and Islamic values.",
    "Profil Sekolah": "School Profile",
    "Kurikulum Berbasis Industri": "Industry-Based Curriculum",
    "Materi ajar disusun bersama mitra industri agar relevan dengan kebutuhan dunia kerja saat ini.": "Course materials are developed with industry partners to stay relevant to today’s workplace needs.",
    "Guru Berpengalaman": "Experienced Teachers",
    "Tenaga pengajar profesional yang aktif mengikuti pelatihan dan sertifikasi kompetensi.": "Professional teachers who actively take part in training and competency certification.",
    "Fasilitas Praktik Lengkap": "Complete Practice Facilities",
    "Laboratorium dan bengkel praktik yang mendukung pembelajaran langsung sesuai jurusan.": "Laboratories and workshops that support hands-on learning for each major.",
    "Program keahlian": "Skills programs", "Lihat Detail Jurusan": "View Major Details",
    "Jurusan sebelumnya": "Previous major", "Jurusan berikutnya": "Next major",
    "Cerita alumni": "Alumni stories", "Mereka Sudah Membuktikannya": "They Have Proven It",
    "Praktik langsung di lab dan PKL membuat saya siap kerja begitu lulus.": "Hands-on practice in the lab and during my internship made me job-ready as soon as I graduated.",
    "Guru-guru membimbing sampai portofolio saya layak dilirik industri.": "My teachers guided me until my portfolio was good enough to catch the industry’s attention.",
    "Ilmu dari bengkel sekolah terpakai setiap hari di tempat kerja.": "What I learned in the school workshop is used every day at work.",
    "PT Contoh Teknologi": "Sample Technology Co.", "Desainer Grafis": "Graphic Designer", "Studio Contoh Kreatif": "Sample Creative Studio",
    "Teknisi Servis": "Service Technician", "Bengkel Contoh Motor": "Sample Motor Workshop",
    "Prestasi terbaru": "Latest achievements", "Kebanggaan Sekolah": "The School’s Pride",
    "Kegiatan sekolah": "School activities", "Dokumentasi Terbaru": "Latest Documentation",
    "Kembangkan Minat & Bakat": "Develop Your Interests & Talents",
    "Info dan pengumuman": "Info and announcements", "Poster Terbaru": "Latest Posters",
    "Poster sebelumnya": "Previous poster", "Poster berikutnya": "Next poster", "Selengkapnya": "Read more",
    "PPDB 2027/2028 Telah Dibuka": "PPDB 2027/2028 Is Now Open",
    "Daftarkan putra-putri Anda sekarang. Kuota terbatas.": "Register your children now. Limited quota.",
    "Tiga Program Keahlian Unggulan": "Three Outstanding Skills Programs",
    "TKJ, DKV, dan TBSM: belajar langsung di laboratorium dan bengkel praktik.": "TKJ, DKV, and TBSM: learn hands-on in laboratories and practice workshops.",
    "Tempat Pengumuman Sekolah": "School Announcements Spot",
    "Poster ini nonaktif. Aktifkan lewat admin, lalu ganti teks atau unggah gambar posternya.": "This poster is inactive. Activate it via the admin panel, then change the text or upload the poster image.",
    "Daftar Sekarang": "Register Now",
    "Virtual tour": "Virtual tour", "Video Profil Sekolah": "School Profile Video", "Tur Fasilitas Lab dan Bengkel Praktik": "Lab and Workshop Facilities Tour",
    "Putar video": "Play video", "Tonton di YouTube": "Watch on YouTube", "Video profil": "Profile video",
    "Video YouTube tidak bisa diputar dari file lokal.": "YouTube videos can’t be played from a local file.",
    "Putar langsung di YouTube, atau buka website lewat alamat hosting / localhost.": "Play it directly on YouTube, or open the website through a hosting address / localhost.",
    "Video tidak tampil?": "Video not showing?", "Buka di YouTube": "Open on YouTube",
    "Belum ada data jurusan.": "No major data yet.",

    /* --- footer --- */
    "Sekolah Menengah Kejuruan": "Vocational High School",
    "Mencetak lulusan yang kompeten, mandiri, dan berakhlak mulia melalui pendidikan kejuruan berbasis industri.": "Producing competent, independent graduates of noble character through industry-based vocational education.",
    "Hubungi Kami": "Contact Us", "Telepon": "Phone", "Jam layanan": "Service hours", "Login Admin": "Admin Login",

    /* --- chatbot: antarmuka --- */
    "Asisten Virtual": "Virtual Assistant", "Tutup chat": "Close chat", "Tulis pertanyaanmu...": "Type your question...",
    "Tulis pertanyaan": "Type a question", "Kirim": "Send", "Jawaban otomatis. Butuh bantuan langsung?": "Automated answers. Need direct help?",
    "Chat panitia via WhatsApp": "Chat with the committee via WhatsApp", "Ada pertanyaan? Tanya kami": "Have a question? Ask us",
    "Buka asisten virtual": "Open virtual assistant", "Mengetik": "Typing",

    /* --- chatbot: topik, tautan, jawaban tetap --- */
    "Info PPDB": "PPDB info", "Syarat pendaftaran": "Registration requirements", "Alur pendaftaran": "Registration process",
    "Biaya dan beasiswa": "Fees and scholarships", "Alamat dan kontak": "Address and contact", "Jurusan lain": "Other majors",
    "Fasilitas": "Facilities", "Chat WhatsApp panitia": "Chat with the committee on WhatsApp", "Hubungi panitia": "Contact the committee",
    "Daftar sekarang": "Register now", "Beasiswa": "Scholarships", "Biaya": "Fees", "Ekstrakurikuler lain": "Other extracurriculars",
    "PKL dan lulusan": "PKL and graduates", "Profil sekolah": "School profile", "Pusat Berkas": "File Center",
    "Lihat halaman PPDB": "View the PPDB page", "Unduh formulir": "Download forms", "Halaman PPDB": "PPDB page",
    "Semua jurusan": "All majors", "Lihat ekstrakurikuler": "View extracurriculars", "Semua ekstrakurikuler": "All extracurriculars",
    "Semua prestasi": "All achievements", "Semua kegiatan": "All activities", "Buka di Google Maps": "Open in Google Maps",
    "Halaman kontak": "Contact page", "Buka Pusat Berkas": "Open the File Center", "Lihat jurusan": "View majors",
    "Formulir PKL": "PKL form", "Galeri fasilitas": "Facilities gallery",
    "Kompetensi:": "Competencies:", "Prospek karier:": "Career prospects:", "Jadwal:": "Schedule:", "Visi:": "Vision:", "Misi:": "Mission:",
    "Kegiatan terbaru": "Latest activities", "Fasilitas per jurusan": "Facilities by major",
    "Prospek karier tiap jurusan:": "Career prospects for each major:",
    "Dokumen dan formulir resmi sekolah tersedia di halaman Unduhan:": "Official school documents and forms are available on the Downloads page:",
    "Sama-sama! Kalau ada pertanyaan lain, silakan tanya kapan saja.": "You’re welcome! If you have any other questions, feel free to ask anytime.",
    "Terima kasih sudah berkunjung. Sampai jumpa dan semoga sukses!": "Thank you for visiting. See you, and good luck!",
    "Baik, kamu bisa melanjutkan percakapan langsung dengan panitia lewat WhatsApp. Pertanyaan terakhirmu akan ikut terkirim sebagai pesan awal.":
      "Sure, you can continue the conversation directly with the committee via WhatsApp. Your last question will be sent along as the first message.",
    "Daftar berkas belum tersedia, silakan hubungi panitia.": "The document list isn’t available yet, please contact the committee.",
    "Alur belum tersedia, silakan hubungi panitia.": "The process isn’t available yet, please contact the committee.",
    "Rincian biaya resmi ditetapkan panitia. Silakan hubungi panitia PPDB untuk informasi terbaru.": "Official fee details are set by the committee. Please contact the PPDB committee for the latest information.",
    "Informasi beasiswa dapat ditanyakan langsung ke panitia PPDB.": "Information about scholarships can be asked directly to the PPDB committee.",
    "Maaf, saya belum menemukan jawabannya. Coba pakai kata kunci lain (misalnya \"syarat\", \"jadwal\", \"TKJ\", \"alamat\"), pilih salah satu topik di bawah, atau tanyakan langsung ke panitia.":
      "Sorry, I haven’t found the answer yet. Try other keywords (for example “requirements”, “schedule”, “TKJ”, “address”), pick one of the topics below, or ask the committee directly.",
    "Alamat": "Address", "Jam operasional": "Operating hours", "Jam Operasional": "Operating Hours",

    /* --- profil --- */
    "Sejarah singkat": "A brief history", "Berdiri untuk Mencetak Generasi Kejuruan yang Kompeten": "Founded to Produce a Competent Generation of Vocational Graduates",
    "SMK Islamiyah Ciledug berdiri dengan komitmen menyelenggarakan pendidikan kejuruan yang memadukan kompetensi teknis dan nilai keislaman. Sejak awal berdiri, sekolah terus mengembangkan program keahlian yang relevan dengan kebutuhan dunia usaha dan dunia industri di sekitar Ciledug dan sekitarnya.":
      "SMK Islamiyah Ciledug was founded with a commitment to providing vocational education that combines technical competence and Islamic values. Since its founding, the school has continued to develop skills programs that are relevant to the needs of businesses and industries in and around Ciledug.",
    "Guru dan Tenaga Pendidik": "Teachers and Education Staff", "Alumni Bekerja": "Working Alumni",
    "Terakreditasi BAN-S/M": "Accredited by BAN-S/M", "Visi & misi": "Vision & mission",
    "Arah dan Tujuan Pendidikan Kami": "Our Educational Direction and Goals", "Gedung sekolah": "School building",
    "Visi dan misi sekolah": "School vision and mission",
    "Menjadi SMK unggulan yang menghasilkan lulusan kompeten, mandiri, dan berakhlak mulia.": "To become a leading vocational school that produces competent, independent graduates of noble character.",
    "Menyelenggarakan pembelajaran kejuruan berbasis kompetensi industri": "Delivering vocational learning based on industry competencies",
    "Menanamkan nilai-nilai keislaman dalam setiap aktivitas sekolah": "Instilling Islamic values in every school activity",
    "Membangun kemitraan aktif dengan dunia usaha dan dunia industri": "Building active partnerships with businesses and industry",
    "Mengembangkan potensi, minat, dan bakat siswa secara menyeluruh": "Developing students’ potential, interests, and talents holistically",
    "Fasilitas sekolah": "School facilities", "Lingkungan Belajar yang Mendukung": "A Supportive Learning Environment",
    "Laboratorium Komputer & Jaringan": "Computer & Network Laboratory", "Studio Desain Multimedia": "Multimedia Design Studio",
    "Bengkel Praktik Otomotif": "Automotive Practice Workshop", "Perpustakaan Digital": "Digital Library",
    "Masjid Sekolah": "School Mosque", "Lapangan Olahraga": "Sports Field",
    "Mengenal lebih dekat SMK Islamiyah Ciledug": "Get to know SMK Islamiyah Ciledug better",

    /* --- jurusan: umum --- */
    "Pilih jurusan untuk melihat detail lengkap kompetensi dan prospek karier": "Choose a major to see full details on competencies and career prospects",
    "Kode Jurusan": "Major Code", "Durasi": "Duration", "3 Tahun": "3 Years", "Sertifikasi": "Certification", "Uji Kompetensi": "Competency Test",
    "Jenjang": "Level", "SMK Kelas X–XII": "Vocational High School, Grades X–XII",
    "Kompetensi yang Dipelajari": "Competencies Learned", "Fasilitas & Praktik": "Facilities & Practice",
    "Kegiatan Jurusan": "Major Activities", "Prospek Karier": "Career Prospects", "Tanya Info Pendaftaran": "Ask About Registration",

    /* --- jurusan: TKJ --- */
    "Teknik Komputer dan Jaringan": "Computer and Network Engineering",
    "Membangun, mengelola, dan mengamankan jaringan serta sistem komputer.": "Building, managing, and securing networks and computer systems.",
    "Program keahlian TKJ membekali siswa dengan kemampuan merakit komputer, merancang jaringan LAN/WAN, administrasi server, hingga dasar keamanan siber — disiapkan untuk kebutuhan industri teknologi informasi yang terus berkembang.":
      "The TKJ skills program equips students with the ability to assemble computers, design LAN/WAN networks, administer servers, and understand cybersecurity basics — preparing them for the needs of the ever-growing information technology industry.",
    "Instalasi & perawatan hardware komputer": "Computer hardware installation & maintenance",
    "Perancangan dan konfigurasi jaringan": "Network design and configuration",
    "Administrasi server dan sistem operasi": "Server and operating system administration",
    "Dasar keamanan jaringan (cyber security)": "Network security fundamentals (cyber security)",
    "Pemrograman dasar dan troubleshooting": "Basic programming and troubleshooting",
    "Lab komputer & jaringan ber-AC": "Air-conditioned computer & network lab",
    "Rak server dan perangkat mikrotik": "Server racks and MikroTik devices",
    "Akses internet fiber untuk praktik": "Fiber internet access for practice",
    "Ruang simulasi data center mini": "Mini data center simulation room",
    "Praktik kerja industri (PKL) di perusahaan IT": "Industry internship (PKL) at IT companies",
    "Sertifikasi kompetensi jaringan": "Network competency certification",
    "Kunjungan industri ke data center": "Industry visit to a data center",
    "Kompetisi LKS bidang IT Network Systems": "LKS competition in IT Network Systems",
    "Teknisi jaringan": "Network technician", "Technopreneur bidang IT": "IT technopreneur",

    /* --- jurusan: DKV --- */
    "Desain Komunikasi Visual": "Visual Communication Design",
    "Menciptakan karya visual, branding, dan konten multimedia yang komunikatif.": "Creating visual works, branding, and multimedia content that communicate effectively.",
    "Program keahlian DKV mengasah kepekaan estetika dan keterampilan teknis siswa dalam desain grafis, ilustrasi, fotografi, dan produksi multimedia — mempersiapkan kreator visual untuk industri kreatif digital.":
      "The DKV skills program sharpens students’ aesthetic sense and technical skills in graphic design, illustration, photography, and multimedia production — preparing visual creators for the digital creative industry.",
    "Desain grafis & tipografi": "Graphic design & typography", "Ilustrasi digital dan manual": "Digital and manual illustration",
    "Fotografi dan videografi dasar": "Basic photography and videography", "Branding dan identitas visual": "Branding and visual identity",
    "Produksi konten multimedia & animasi": "Multimedia content & animation production",
    "Studio desain dengan komputer grafis": "Design studio with graphics computers", "Studio foto mini & pencahayaan": "Mini photo studio & lighting",
    "Ruang produksi multimedia": "Multimedia production room", "Perangkat drawing tablet": "Drawing tablet devices",
    "Praktik kerja industri di agensi kreatif": "Industry internship at creative agencies", "Pameran karya siswa tahunan": "Annual student work exhibition",
    "Proyek desain untuk UMKM lokal": "Design projects for local small businesses", "Kompetisi desain grafis & fotografi": "Graphic design & photography competitions",
    "Videografer / Editor": "Videographer / Editor", "Ilustrator lepas": "Freelance illustrator",

    /* --- jurusan: TBSM --- */
    "Teknik dan Bisnis Sepeda Motor": "Motorcycle Engineering and Business",
    "Menguasai perawatan, perbaikan, dan bisnis layanan sepeda motor modern.": "Mastering the maintenance, repair, and service business of modern motorcycles.",
    "Program keahlian TBSM mencetak teknisi yang cakap dalam perawatan mesin, kelistrikan, dan teknologi sepeda motor terbaru, sekaligus memahami sisi bisnis layanan otomotif dan wirausaha bengkel.":
      "The TBSM skills program produces technicians skilled in engine maintenance, electrical systems, and the latest motorcycle technology, while also understanding the business side of automotive services and workshop entrepreneurship.",
    "Perawatan dan perbaikan mesin motor": "Motorcycle engine maintenance and repair", "Sistem kelistrikan kendaraan": "Vehicle electrical systems",
    "Teknologi motor injeksi & matic": "Fuel-injection & automatic motorcycle technology",
    "Manajemen bengkel dan layanan pelanggan": "Workshop management and customer service", "Dasar kewirausahaan otomotif": "Automotive entrepreneurship basics",
    "Bengkel praktik dengan unit motor terkini": "Practice workshop with up-to-date motorcycle units", "Peralatan diagnostik injeksi": "Fuel-injection diagnostic equipment",
    "Area praktik kelistrikan": "Electrical practice area", "Ruang teori otomotif": "Automotive theory room",
    "Praktik kerja industri di dealer resmi": "Industry internship at authorized dealers", "Sertifikasi kompetensi otomotif": "Automotive competency certification",
    "Servis motor gratis untuk masyarakat": "Free motorcycle servicing for the community", "Kompetisi LKS bidang otomotif": "LKS competition in automotive",
    "Teknisi sepeda motor": "Motorcycle technician", "Wirausaha bengkel": "Workshop entrepreneur", "Staf dealer otomotif": "Automotive dealer staff",

    /* --- prestasi --- */
    "Prestasi Sekolah": "School Achievements", "Capaian siswa dan sekolah di berbagai ajang kompetisi": "Achievements of students and the school in various competitions",
    "Kategori": "Category", "Akademik": "Academic", "Non-Akademik": "Non-Academic", "Sekolah": "School", "Umum": "General",
    "Belum ada prestasi pada filter ini.": "No achievements match this filter.", "Tingkat": "Level", "Tahun": "Year",
    "Deskripsi Prestasi": "Achievement Description", "Provinsi": "Province", "Nasional": "National", "Kota": "City",
    "Juara 1 LKS Network Systems": "1st Place, LKS Network Systems", "Juara 2 Desain Poster Nasional": "2nd Place, National Poster Design",
    "Juara 1 Kontes Modifikasi Motor Irit": "1st Place, Fuel-Efficient Motorcycle Modification Contest",
    "Sekolah Adiwiyata Tingkat Kota": "City-Level Adiwiyata School", "Juara 3 Debat Bahasa Inggris": "3rd Place, English Debate",
    "Juara Harapan 1 Fotografi Jurnalistik": "1st Honorable Mention, Photojournalism",
    "Tim TKJ meraih posisi pertama pada Lomba Kompetensi Siswa bidang Network Systems Administration tingkat provinsi.": "The TKJ team took first place in the provincial Student Competency Competition in Network Systems Administration.",
    "Karya poster kampanye lingkungan dari siswa DKV meraih juara 2 dalam kompetisi desain tingkat nasional.": "An environmental campaign poster by DKV students won 2nd place in a national design competition.",
    "Tim TBSM menang dalam kontes efisiensi bahan bakar sepeda motor hasil modifikasi siswa.": "The TBSM team won a fuel-efficiency contest for motorcycles modified by students.",
    "Penghargaan atas komitmen sekolah dalam pengelolaan lingkungan dan program hijau berkelanjutan.": "An award for the school’s commitment to environmental management and sustainable green programs.",
    "Tim debat sekolah meraih juara 3 dalam kompetisi debat bahasa Inggris antar SMK se-provinsi.": "The school debate team won 3rd place in an inter-vocational-school English debate competition at the provincial level.",
    "Karya foto jurnalistik siswa DKV mendapat penghargaan pada festival fotografi tingkat kota.": "A photojournalism work by DKV students received an award at a city-level photography festival.",
    "Pencapaian ini menjadi motivasi bagi siswa lain untuk terus mengasah kemampuan dan berani berkompetisi di berbagai ajang, baik tingkat kota, provinsi, maupun nasional.":
      "This achievement motivates other students to keep honing their skills and to dare to compete in various events, whether at the city, provincial, or national level.",

    /* --- ekstrakurikuler --- */
    "Wadah pengembangan minat dan bakat siswa di luar jam akademik": "A place to develop students’ interests and talents outside academic hours",
    "Tentang Kegiatan": "About the Activity", "Galeri Kegiatan": "Activity Gallery",
    "Tari Tradisional Saman": "Saman Traditional Dance", "Palang Merah Remaja (PMR)": "Youth Red Cross (PMR)",
    "Paskibra": "Paskibra (Flag Raising Squad)", "Pramuka": "Pramuka (Scouts)", "Basket": "Basketball",
    "Melestarikan seni tari tradisional Saman dengan latihan kekompakan gerak dan ketukan bersama tim.": "Preserving the traditional Saman dance through practice in synchronized movement and rhythm with the team.",
    "Melatih kesiapsiagaan pertolongan pertama, kesehatan, dan kepedulian sosial di lingkungan sekolah.": "Training first-aid readiness, health awareness, and social care within the school environment.",
    "Membentuk kedisiplinan dan kepemimpinan melalui latihan baris-berbaris dan pengibaran bendera.": "Building discipline and leadership through marching drills and flag-raising practice.",
    "Membentuk kemandirian, kerja sama, dan jiwa kepemimpinan melalui kegiatan kepramukaan rutin.": "Building independence, teamwork, and leadership through regular scouting activities.",
    "Mengasah kemampuan bermusik dan kekompakan formasi dalam grup marching band sekolah.": "Sharpening musical skills and formation teamwork in the school marching band.",
    "Melatih seni bela diri tradisional Indonesia, kedisiplinan fisik, dan mental siswa.": "Training in traditional Indonesian martial arts, physical discipline, and students’ mental strength.",
    "Wadah bakat olahraga bola basket, melatih kekompakan tim melalui latihan dan pertandingan rutin.": "An outlet for basketball talent, building teamwork through regular practice and matches.",
    "Melatih kekompakan tim dan kebugaran melalui latihan dan pertandingan futsal antar sekolah.": "Building teamwork and fitness through futsal practice and inter-school matches.",
    "Kegiatan ini terbuka untuk seluruh siswa dari seluruh jurusan dan dibimbing langsung oleh pembina yang berpengalaman di bidangnya.":
      "This activity is open to all students from all majors and is guided directly by experienced mentors in the field.",

    /* --- kegiatan --- */
    "Kegiatan Sekolah": "School Activities", "Berita dan dokumentasi kegiatan siswa, guru, dan sekolah": "News and documentation of activities by students, teachers, and the school",
    "Belum ada kegiatan pada filter ini.": "No activities match this filter.", "Galeri Foto": "Photo Gallery",
    "Upacara Peringatan Hari Kemerdekaan": "Independence Day Commemoration Ceremony", "Kunjungan Industri Jurusan TKJ": "TKJ Major Industry Visit",
    "Pameran Karya Siswa DKV": "DKV Student Work Exhibition", "Lomba Kompetensi Siswa (LKS) Tingkat Provinsi": "Provincial-Level Student Competency Competition (LKS)",
    "Bakti Sosial dan Servis Motor Gratis": "Community Service and Free Motorcycle Servicing", "Seminar Kewirausahaan dan Dunia Kerja": "Entrepreneurship and World of Work Seminar",
    "Seluruh siswa dan guru mengikuti upacara bendera dalam rangka HUT Kemerdekaan Republik Indonesia.": "All students and teachers took part in a flag ceremony for the anniversary of Indonesia’s Independence.",
    "Upacara berlangsung khidmat di lapangan sekolah, diikuti oleh seluruh siswa, guru, dan staf. Petugas upacara terdiri dari siswa terpilih dari berbagai jurusan sebagai bentuk apresiasi atas prestasi dan kedisiplinan mereka sepanjang tahun ajaran.":
      "The ceremony was held solemnly on the school field, attended by all students, teachers, and staff. The ceremony officers were selected students from various majors, as recognition of their achievements and discipline throughout the school year.",
    "Siswa TKJ mengunjungi salah satu perusahaan penyedia layanan data center di Jakarta.": "TKJ students visited a company providing data center services in Jakarta.",
    "Kegiatan ini bertujuan memberikan gambaran nyata dunia kerja di bidang teknologi jaringan. Siswa berkesempatan melihat langsung ruang server, sistem keamanan data center, serta berdiskusi dengan praktisi industri mengenai peluang karier di bidang IT.":
      "This activity aims to give a real picture of the working world in network technology. Students had the chance to see server rooms and data center security systems firsthand, and to discuss career opportunities in IT with industry practitioners.",
    "Karya-karya terbaik siswa jurusan DKV dipamerkan dalam acara tahunan sekolah.": "The best works by DKV students were exhibited at the school’s annual event.",
    "Pameran menampilkan poster, ilustrasi, fotografi, dan karya multimedia hasil proyek akhir siswa. Acara ini juga dihadiri oleh orang tua dan tamu undangan dari industri kreatif setempat sebagai bentuk apresiasi terhadap karya siswa.":
      "The exhibition showcased posters, illustrations, photography, and multimedia works from students’ final projects. Parents and invited guests from the local creative industry also attended as a form of appreciation for the students’ work.",
    "Perwakilan sekolah dari tiga jurusan mengikuti ajang LKS tingkat provinsi.": "School representatives from three majors took part in the provincial-level LKS.",
    "Sekolah mengirimkan perwakilan terbaik dari jurusan TKJ, DKV, dan TBSM untuk berkompetisi di tingkat provinsi. Persiapan dilakukan melalui pelatihan intensif bersama pembimbing dan alumni yang berpengalaman.":
      "The school sent its best representatives from the TKJ, DKV, and TBSM majors to compete at the provincial level. Preparation was carried out through intensive training with experienced mentors and alumni.",
    "Siswa TBSM memberikan layanan servis motor gratis bagi warga sekitar sekolah.": "TBSM students provided free motorcycle servicing for residents around the school.",
    "Kegiatan ini menjadi ajang praktik nyata sekaligus pengabdian kepada masyarakat. Warga sekitar sekolah dapat memanfaatkan layanan servis ringan secara gratis yang dikerjakan langsung oleh siswa di bawah pengawasan guru pembimbing.":
      "This activity became a chance for real practice as well as service to the community. Residents around the school could take advantage of free light servicing carried out directly by students under the supervision of their mentor teachers.",
    "Menghadirkan alumni dan praktisi industri untuk berbagi pengalaman kepada siswa kelas akhir.": "Bringing in alumni and industry practitioners to share their experiences with final-year students.",
    "Seminar ini bertujuan membekali siswa kelas akhir dengan wawasan mengenai dunia kerja maupun peluang berwirausaha setelah lulus, lengkap dengan sesi tanya jawab dan berbagi pengalaman dari alumni yang telah sukses di bidangnya.":
      "This seminar aims to equip final-year students with insights into the working world and entrepreneurial opportunities after graduation, complete with a Q&A session and shared experiences from alumni who have succeeded in their fields.",

    /* --- kontak --- */
    "Kami siap membantu pertanyaan seputar pendaftaran dan informasi sekolah": "We’re ready to help with questions about registration and school information",
    "Hubungi via WhatsApp": "Contact via WhatsApp",

    /* --- PPDB --- */
    "Batas waktu pendaftaran gelombang ini telah berakhir": "The registration deadline for this wave has ended",
    "Pendaftaran ditutup dalam": "Registration closes in", "Hari": "Days", "Jam": "Hours", "Menit": "Minutes", "Detik": "Seconds",
    "Daftar Cepat Sekarang": "Quick Register Now", "Biaya & Beasiswa": "Fees & Scholarships", "Biaya & beasiswa": "Fees & scholarships",
    "Selamat datang calon siswa baru! Ikuti alur pendaftaran berikut, siapkan berkas persyaratan, lalu daftar secara online atau lewat WhatsApp panitia.":
      "Welcome, prospective new students! Follow the registration steps below, prepare the required documents, then register online or via the committee’s WhatsApp.",
    "Pendaftaran saat ini": "Registration status:", "segera dibuka": "opening soon", "dibuka": "open", "ditutup": "closed",
    ". Kamu tetap bisa mempelajari alur dan persyaratannya lebih dulu.": ". You can still review the process and requirements first.",
    "Jurusan yang tersedia:": "Available majors:", "Alur Pendaftaran": "Registration Process", "Jadwal": "Schedule",
    "Siapkan berkas persyaratan (lihat daftar di bawah)": "Prepare the required documents (see the list below)",
    "Isi formulir pendaftaran online, atau kirim data awal lewat WhatsApp panitia": "Fill in the online registration form, or send your initial details via the committee’s WhatsApp",
    "Unggah atau serahkan berkas persyaratan": "Upload or submit the required documents",
    "Verifikasi berkas oleh panitia PPDB": "Document verification by the PPDB committee",
    "Lihat pengumuman hasil seleksi, lalu lakukan daftar ulang": "Check the selection results, then complete re-registration",
    "Ada pertanyaan seputar pendaftaran? Hubungi panitia PPDB melalui kontak sekolah.": "Questions about registration? Contact the PPDB committee through the school’s contact details.",
    "Persyaratan": "Requirements", "Berkas yang Perlu Disiapkan": "Documents to Prepare",
    "Formulir pendaftaran": "Registration form", "Diisi lengkap oleh calon siswa dan orang tua/wali": "Completed in full by the prospective student and parent/guardian",
    "Fotokopi ijazah atau SKL SMP/MTs": "Photocopy of junior high (SMP/MTs) diploma or certificate of graduation (SKL)",
    "Dilegalisir, 1 lembar": "Legalized, 1 copy", "Fotokopi rapor semester 1–5": "Photocopy of report cards, semesters 1–5", "Dilegalisir": "Legalized",
    "Fotokopi Kartu Keluarga": "Photocopy of Family Card (KK)", "1 lembar": "1 copy", "Fotokopi akta kelahiran": "Photocopy of birth certificate",
    "Pas foto 3x4": "3x4 passport photo", "4 lembar, latar merah": "4 copies, red background",
    "Surat pernyataan orang tua/wali": "Parent/guardian statement letter", "Bermaterai, format sesuai ketentuan sekolah": "Stamped (with duty stamp), format per school requirements",
    "Pertanyaan yang Sering Diajukan": "Frequently Asked Questions", "Topik": "Topic",
    "Apa saja komponen biaya masuk?": "What are the components of the admission fees?",
    "Umumnya terdiri dari biaya pendaftaran, uang pangkal, seragam, dan perlengkapan praktik. Nominal resmi diisi panitia lewat admin; hubungi panitia PPDB untuk rincian terbaru.":
      "Generally consisting of the registration fee, entrance fee, uniforms, and practice equipment. Official amounts are filled in by the committee via the admin panel; contact the PPDB committee for the latest details.",
    "Bagaimana pembayaran SPP dan apakah bisa dicicil?": "How is tuition (SPP) paid, and can it be paid in installments?",
    "SPP dibayar setiap bulan. Skema cicilan uang pangkal dapat dikonsultasikan langsung dengan panitia PPDB.": "Tuition (SPP) is paid monthly. Installment schemes for the entrance fee can be discussed directly with the PPDB committee.",
    "Apakah tersedia keringanan untuk pemegang KIP?": "Is there a fee reduction for KIP holders?",
    "Calon siswa pemegang Kartu Indonesia Pintar (KIP) dapat mengajukan keringanan biaya. Siapkan fotokopi KIP dan serahkan saat verifikasi berkas.":
      "Prospective students holding a Kartu Indonesia Pintar (KIP, Smart Indonesia Card) can apply for a fee reduction. Prepare a photocopy of the KIP and submit it during document verification.",
    "Bagaimana syarat beasiswa prestasi?": "What are the requirements for the achievement scholarship?",
    "Siswa berprestasi akademik maupun non-akademik (dibuktikan sertifikat atau piagam) dapat dipertimbangkan mendapat potongan biaya.":
      "Students with academic or non-academic achievements (proven by certificates or awards) may be considered for fee discounts.",
    "Apakah ada beasiswa Tahfiz?": "Is there a Tahfiz scholarship?",
    "Calon siswa penghafal Al-Qur'an dapat mengikuti tes tahfiz. Besar keringanan menyesuaikan capaian hafalan.":
      "Prospective students who memorize the Qur’an can take a tahfiz test. The amount of the reduction depends on how much they have memorized.",
    "Apakah bisa mendaftar lewat WhatsApp?": "Can I register via WhatsApp?",
    "Bisa. Klik tombol Daftar Cepat, isi data singkat, dan pesan otomatis terkirim ke WhatsApp panitia.": "Yes. Click the Quick Register button, fill in a few details, and a message is sent automatically to the committee’s WhatsApp.",
    "Belum menemukan jawabannya?": "Haven’t found the answer?", "Tanya panitia lewat WhatsApp": "Ask the committee via WhatsApp",
    "Pilih Cara Mendaftar": "Choose How to Register", "1. Formulir Online": "1. Online Form",
    "Isi data lengkap dan unggah berkas persyaratan lewat formulir resmi sekolah. Cara paling lengkap dan paling rapi untuk panitia.":
      "Fill in your full details and upload the required documents through the school’s official form. The most complete and tidiest way for the committee.",
    "Pendaftaran belum dibuka": "Registration is not open yet", "Buka Formulir Pendaftaran": "Open Registration Form",
    "Formulir belum tersedia": "Form not available yet",
    "Tautan formulir belum diatur oleh admin. Sementara, gunakan opsi WhatsApp.": "The form link hasn’t been set by the admin. For now, please use the WhatsApp option.",
    "2. Daftar Lewat WhatsApp": "2. Register via WhatsApp",
    "Isi data awal di bawah, lalu kirim ke WhatsApp panitia. Berkas bisa dikirim menyusul di chat yang sama.": "Fill in your initial details below, then send them to the committee’s WhatsApp. Documents can be sent later in the same chat.",
    "Nama calon siswa": "Prospective student’s name", "Nama lengkap": "Full name", "Asal sekolah": "School of origin",
    "SMP/MTs asal": "Previous junior high school (SMP/MTs)", "Pilihan jurusan": "Major of choice", "No. HP orang tua/wali": "Parent/guardian phone number",
    "Kirim ke WhatsApp Panitia": "Send to the Committee via WhatsApp", "Daftar persyaratan belum diisi.": "The requirements list hasn’t been filled in yet.",

    /* --- modal Daftar Cepat + pesan --- */
    "Isi 4 data singkat, lalu pesan otomatis terkirim ke WhatsApp panitia.": "Fill in 4 short details, then a message is sent automatically to the committee’s WhatsApp.",
    "Pendaftaran belum dibuka, tapi kamu tetap bisa mengirim pra-pendaftaran ke panitia.": "Registration isn’t open yet, but you can still send a pre-registration to the committee.",
    "Nama lengkap calon siswa": "Prospective student’s full name", "Nama sesuai ijazah": "Name as on diploma", "No. WhatsApp aktif": "Active WhatsApp number",
    "Asal SMP/MTs": "Previous school (SMP/MTs)", "Nama sekolah asal": "Name of previous school", "Data terkirim": "Details sent",
    "Jika WhatsApp belum terbuka, tekan tombol di bawah. Panitia akan menghubungi nomor yang kamu isi.": "If WhatsApp hasn’t opened, press the button below. The committee will contact the number you entered.",
    "Buka WhatsApp": "Open WhatsApp", "Nama minimal 3 huruf.": "Name must be at least 3 letters.",
    "Nomor WhatsApp tidak valid (9–15 digit).": "Invalid WhatsApp number (9–15 digits).", "Isi asal sekolah.": "Please enter your previous school.",
    "Nomor WhatsApp panitia belum diisi admin. Data kamu sudah tersimpan di browser ini.": "The committee’s WhatsApp number hasn’t been set by the admin. Your details are saved in this browser.",
    "Nomor WhatsApp belum diisi. Isi lewat admin.html, menu Pengaturan Umum.": "The WhatsApp number hasn’t been set. Fill it in via admin.html, General Settings menu.",
    "Nomor WhatsApp panitia belum diisi. Isi lewat admin.html, menu Pengaturan Umum.": "The committee’s WhatsApp number hasn’t been set. Fill it in via admin.html, General Settings menu.",

    /* --- unduhan --- */
    "Dokumen dan formulir resmi sekolah yang bisa diunduh siswa maupun orang tua": "Official school documents and forms that students and parents can download",
    "Cari berkas, mis. surat izin atau PKL": "Search files, e.g. permission letter or PKL", "Cari berkas": "Search files",
    "Surat & Pernyataan": "Letters & Statements", "PKL / Prakerin": "PKL / Work Placement", "Administrasi": "Administration", "Lainnya": "Other",
    "Segera tersedia": "Coming soon", "Surat Izin Tidak Masuk Sekolah": "Absence Permission Letter",
    "Format surat izin dari orang tua/wali siswa.": "Permission letter template from the student’s parent/guardian.",
    "Surat Pernyataan Orang Tua/Wali": "Parent/Guardian Statement Letter", "Surat pernyataan bermaterai sesuai ketentuan sekolah.": "Stamped statement letter per school requirements.",
    "Formulir Pendaftaran PKL": "PKL Registration Form", "Diisi siswa kelas XI sebelum penempatan Praktik Kerja Lapangan.": "To be filled in by Grade XI students before placement for field work practice (PKL).",
    "Jurnal Harian PKL": "PKL Daily Journal", "Lembar catatan kegiatan harian selama PKL.": "Daily activity log sheet during PKL.",
    "Formulir Perubahan Data Siswa": "Student Data Change Form", "Untuk memperbarui data diri atau data orang tua di sekolah.": "For updating personal or parent data at school.",
    "Surat Permohonan Legalisir": "Legalization Request Letter", "Permohonan legalisir ijazah atau dokumen akademik.": "Request for legalization of a diploma or academic documents.",
    "Tidak ada berkas yang cocok. Coba kata kunci lain atau pilih kategori Semua.": "No matching files. Try other keywords or choose the All category.",
    "Belum ada berkas yang tersedia saat ini.": "No files are available at the moment.",
    "Tidak menemukan berkas yang dicari?": "Can’t find the file you’re looking for?",
    "Hubungi bagian tata usaha, kami bantu sediakan dokumen yang Anda perlukan.": "Contact the administration office and we’ll help provide the documents you need."
  };

  /* ---------- 3. Alat bantu ---------- */
  const DICT = Object.create(null); Object.keys(KAMUS).forEach(k => { DICT[k.replace(/\s+/g, ' ').trim()] = KAMUS[k]; });
  const KEYS = Object.keys(DICT).filter(k => k.length >= 24);   // untuk teks terpotong "…"
  const norm = s => String(s).replace(/\s+/g, ' ').trim();
  const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

  const DAY = { Senin: 'Monday', Selasa: 'Tuesday', Rabu: 'Wednesday', Kamis: 'Thursday', Jumat: 'Friday', Sabtu: 'Saturday', Minggu: 'Sunday' };
  const MON = { Januari: 'January', Februari: 'February', Maret: 'March', April: 'April', Mei: 'May', Juni: 'June', Juli: 'July', Agustus: 'August', September: 'September', Oktober: 'October', November: 'November', Desember: 'December' };
  const DAYRE = '(?:Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu)', MONRE = '(?:Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)';
  function fixCal(s) {   // nama bulan & hari, format jam
    let r = s.replace(new RegExp('(\\b\\d{1,2}\\s+)?\\b(' + MONRE.slice(3, -1) + ')\\b(\\s+\\d{4})?', 'g'), (m, a, mon, y) => (a || y) ? (a || '') + MON[mon] + (y || '') : m);
    if (new RegExp('^' + DAYRE + '\\b').test(r)) {
      r = r.replace(new RegExp('\\b(' + DAYRE.slice(3, -1) + ')\\b', 'g'), d => DAY[d]).replace(/(\d{1,2})\.(\d{2})/g, '$1:$2').replace(/\bWIB\b/, 'WIB (UTC+7)');
    }
    return r;
  }
  const plural = (n, w) => n + ' ' + w + (+n === 1 ? '' : 's');
  const T = (s, d) => { const r = tx(s, d); return r == null ? s : r; };   // terjemah atau biarkan

  /* ---------- 4. POLA (teks dengan bagian yang berubah-ubah) ---------- */
  const STATUS = { 'Segera dibuka': 'Opening soon', 'Dibuka': 'Open', 'Ditutup': 'Closed' };
  const POLA = [
    [/^Jadwal: (.+)$/, m => 'Schedule: ' + T(m[1])],
    [/^Jurusan (.+)$/, m => 'Major: ' + T(m[1])],
    [/^Detail jurusan (.+)$/, m => m[1] + ' major details'],
    [/^Diperbarui (.+)$/, m => 'Updated ' + T(m[1])],
    [/^Unduh (.+)$/, m => 'Download ' + T(m[1])],
    [/^(\d+) berkas$/, m => plural(m[1], 'file')],
    [/^(\d+) ditampilkan$/, m => m[1] + ' shown'],
    [/^(\d+) dari (\d+)$/, m => m[1] + ' of ' + m[2]],
    [/^Ke jurusan (\d+)$/, m => 'Go to major ' + m[1]],
    [/^(\d+) hari lagi$/, m => plural(m[1], 'day') + ' left'],
    [/^kurang dari 1 hari lagi$/, () => 'less than 1 day left'],
    [/^(\d+) Jurusan Unggulan$/, m => m[1] + ' Featured Majors'],
    [/^Nama Alumni (\d+)$/, m => 'Alumni Name ' + m[1]],
    [/^Mitra Industri (\d+)$/, m => 'Industry Partner ' + m[1]],
    [/^Alumni (\d{4})(?: · (.+))?$/, m => 'Class of ' + m[1] + (m[2] ? ' · ' + T(m[2]) : '')],
    [/^PPDB (\S+) · (Segera dibuka|Dibuka|Ditutup)$/, m => 'PPDB ' + m[1] + ' · ' + STATUS[m[2]]],
    [/^Daftar PPDB (\S+)$/, m => 'Register for PPDB ' + m[1]],
    [/^PPDB (\S+) Telah Dibuka$/, m => 'PPDB ' + m[1] + ' Is Now Open'],
    [/^Penerimaan Peserta Didik Baru (.+)$/, m => 'New Student Admissions at ' + m[1]],
    [/^Terakreditasi (\S+)$/, m => 'Accredited ' + m[1]],
    [/^Akreditasi (\S+):$/, m => 'Accreditation ' + m[1] + ':'],
    [/^© (\d{4}) (.+?)\. Hak cipta dilindungi\.$/, m => '© ' + m[1] + ' ' + m[2] + '. All rights reserved.'],
    [/^Asisten virtual (.+)$/, m => m[1] + ' virtual assistant'],
    [/^Buka submenu (.+)$/, m => 'Open ' + T(m[1]) + ' submenu'],
    [/^Gelombang (\d+) (ditutup|dibuka) dalam$/, m => 'Wave ' + m[1] + (m[2] === 'ditutup' ? ' closes in' : ' opens in')],
    [/^Gelombang (\d+): (.+)$/, m => 'Wave ' + m[1] + ': ' + fixCal(m[2])],
    [/^Pengumuman hasil seleksi: (.+)$/, m => 'Selection results announcement: ' + fixCal(m[1])],
    [/^Daftar ulang: (.+)$/, m => 'Re-registration: ' + fixCal(m[1])],
    [/^Lebih nyaman datang langsung\? (.+?)\. Jam layanan: (.+)\.$/, m => 'Prefer to come in person? ' + m[1] + '. Service hours: ' + T(m[2]) + '.'],
    /* chatbot */
    [/^Berkas persyaratan PPDB (.+)$/, m => 'PPDB ' + m[1] + ' admission requirements'],
    [/^Alur pendaftaran PPDB (.+)$/, m => 'PPDB ' + m[1] + ' registration process'],
    [/^Program keahlian di (.+)$/, m => 'Skills programs at ' + m[1]],
    [/^Halo! Saya asisten virtual (.+?)\. Saya bisa membantu seputar PPDB, jurusan, ekstrakurikuler, dan kontak sekolah\. Silakan pilih topik atau ketik pertanyaanmu\.$/,
      m => 'Hello! I’m the virtual assistant of ' + m[1] + '. I can help with PPDB, majors, extracurriculars, and school contact details. Please pick a topic or type your question.'],
    [/^Halo! Saya asisten virtual (.+?)\. Tanyakan seputar PPDB, jurusan, ekstrakurikuler, atau kontak sekolah, atau pilih topik di bawah\.$/,
      m => 'Hello! I’m the virtual assistant of ' + m[1] + '. Ask about PPDB, majors, extracurriculars, or school contact details, or pick a topic below.'],
    [/^Saya asisten virtual otomatis (.+?)\. Jawaban saya disusun dari data resmi di website ini\. Untuk hal yang tidak saya ketahui, silakan hubungi panitia lewat WhatsApp\.$/,
      m => 'I’m the automated virtual assistant of ' + m[1] + '. My answers are compiled from the official data on this website. For anything I don’t know, please contact the committee via WhatsApp.'],
    [/^Terakreditasi \*\*(.+?)\*\*, dengan (.+?) siswa aktif dan (.+?) guru dan tenaga pendidik\.$/,
      m => 'Accredited **' + m[1] + '**, with ' + m[2] + ' active students and ' + m[3] + ' teachers and education staff.'],
    [/^Sekolah bekerja sama dengan \*\*(.+?)\*\* mitra industri untuk PKL dan penyaluran lulusan\. Sekitar \*\*(.+?)\*\* lulusan terserap di dunia kerja\.$/,
      m => 'The school partners with **' + m[1] + '** industry partners for internships (PKL) and graduate placement. About **' + m[2] + '** of graduates are employed in the workforce.'],
    /* "Nama (KODE)" dan "teks (keterangan)" */
    [/^(.+) \(([A-Z]{2,6})\)$/, m => { const a = tx(m[1]); return a == null ? null : a + ' (' + m[2] + ')'; }],
    [/^(.+) \(([^()]+)\)$/, m => { const a = tx(m[1]), b = tx(m[2]); return (a == null && b == null) ? null : (a == null ? m[1] : a) + ' (' + (b == null ? m[2] : b) + ')'; }],
    [/^(.+) (\d{1,2})$/, m => { const a = tx(m[1]); return a == null ? null : a + ' ' + m[2]; }]   // alt galeri: "Nama 1"
  ];

  /* ---------- 5. Mesin terjemah ---------- */
  function truncated(n) {   // teks terpotong "…" (ringkasan kartu): terjemahkan versi lengkap lalu potong
    if (n.charAt(n.length - 1) !== '…') return null;
    const base = n.slice(0, -1).trimEnd(); if (base.length < 20) return null;
    for (const k of KEYS) {
      if (k.length > base.length && k.indexOf(base) === 0) {
        const en = DICT[k]; let cut = Math.round(en.length * base.length / k.length);
        if (cut >= en.length) return en;
        const sp = en.lastIndexOf(' ', cut); if (sp > 10) cut = sp;
        return en.slice(0, cut).replace(/[\s,;:.\-–]+$/, '') + '…';
      }
    }
    return null;
  }
  function tx(s, depth) {   // -> terjemahan (string) atau null bila tidak ada yang cocok
    depth = depth || 0;
    const n = norm(s); if (!n || !/[A-Za-z]{2}/.test(n)) return null;
    if (has(DICT, n)) return DICT[n];
    for (let i = 0; i < POLA.length; i++) { const m = POLA[i][0].exec(n); if (m) { const r = POLA[i][1](m); if (r != null) return r; } }
    const t = truncated(n); if (t) return t;
    if (depth < 2) {
      // beberapa kalimat sekaligus
      const sen = n.match(/(?:[^.!?]|[.!?](?!\s|$))+[.!?]*\s*/g);   // titik di antara angka (09.00) bukan akhir kalimat
      if (sen && sen.length > 1) {
        let any = false; const out = sen.map(x => { const r = tx(x, depth + 1); if (r != null) any = true; return r == null ? x.trim() : r; });
        if (any) return out.join(' ');
      }
      // kalimat tunggal berakhir titik (mis. daftar "a, b, c."): coba tanpa titik
      if (n.slice(-1) === '.') { const r = tx(n.slice(0, -1), depth + 1); if (r != null) return r + '.'; }
      // pemisah: " · "  ": "  ", "
      const seps = [' | ', ' · ', ': ', ', '];
      for (const sp of seps) {
        const i = n.indexOf(sp); if (i < 0) continue;
        const parts = sp === ': ' ? [n.slice(0, i), n.slice(i + 2)] : n.split(sp);
        let any = false; const out = parts.map(x => { const r = tx(x, depth + 1); if (r != null) any = true; return r == null ? x : r; });
        if (any) return out.join(sp);
      }
    }
    const f = fixCal(n); if (f !== n) return f;
    return null;
  }

  /* ---------- 6. Chatbot: balasan bot (teks multi-baris dengan **tebal**) ---------- */
  function trChatLine(line) {
    if (!line.trim()) return line;
    let m;
    if ((m = /^(• |\d+\. )(.*)$/.exec(line))) return m[1] + trChatLine(m[2]);
    if (line.indexOf('**') < 0) { const whole = tx(line); if (whole != null) return whole; }
    if ((m = /^\*\*PPDB (.+?)\*\*: pendaftaran saat ini \*\*(.+?)\*\*\.(?: Batas waktu: (.+)\.)?$/.exec(line)))
      return '**PPDB ' + m[1] + '**: registration is currently **' + (STATUS[m[2]] || m[2]) + '**.' + (m[3] ? ' Deadline: ' + T(m[3]) + '.' : '');
    if ((m = /^\*\*([^*]+?)\*\*, (.+?): (.*)$/.exec(line))) return '**' + m[1] + '**, ' + T(m[2]) + ': ' + T(m[3]);        // **TKJ**, Nama: tagline
    if ((m = /^\*\*([^*]+:)\*\*(?: (.*))?$/.exec(line))) return '**' + T(m[1]) + '**' + (m[2] ? ' ' + T(m[2]) : '');       // **Visi:** isi
    if ((m = /^\*\*([^*]+?)\*\*: (.*)$/.exec(line))) return '**' + m[1] + '**: ' + T(m[2]);                                 // **TKJ**: a, b, c
    if ((m = /^\*\*([^*]+)\*\*$/.exec(line))) return '**' + T(m[1]) + '**';                                                  // **Judul**
    if ((m = /^(Alamat|Telepon|Email|Jam operasional): (.*)$/.exec(line))) return T(m[1]) + ': ' + T(m[2]);
    return T(line);
  }
  const trChat = s => s.split('\n').map(trChatLine).join('\n');
  const esc = t => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const BUBBLES = new Set();
  function botBubble(b) {
    const kids = [].slice.call(b.childNodes).filter(n => !(n.nodeType === 1 && n.classList.contains('cb-ls')));
    if (!kids.length || b.__tr) return;
    let s = ''; kids.forEach(n => { s += n.nodeType === 3 ? n.nodeValue : n.nodeName === 'B' ? '**' + n.textContent + '**' : n.nodeName === 'BR' ? '\n' : n.textContent; });
    const out = trChat(s); if (out === s) return;
    b.__orig = kids.map(n => n.cloneNode(true)); b.__tr = true; BUBBLES.add(b);
    const tmp = document.createElement('div'); tmp.innerHTML = esc(out).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
    const ref = kids[0]; while (tmp.firstChild) b.insertBefore(tmp.firstChild, ref);
    kids.forEach(n => n.remove());
  }
  function restoreBubbles() {
    BUBBLES.forEach(b => {
      if (!b.__tr) return;
      const ls = b.querySelector('.cb-ls');
      [].slice.call(b.childNodes).forEach(n => { if (n !== ls) n.remove(); });
      b.__orig.forEach(n => b.insertBefore(n, ls || null));
      b.__tr = false;
    });
    BUBBLES.clear();
  }

  /* ---------- 7. Mesin DOM: teks, atribut, judul tab ---------- */
  const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
  const TEXTS = new Map(), ATTRMAP = new Map();
  let ECHO = {}; try { ECHO = JSON.parse(sessionStorage.getItem('smk_lang_echo') || '{}'); } catch (e) { }
  const inBotBubble = p => { const b = p.closest && p.closest('.cb-m.bot .cb-b'); return b && !p.closest('.cb-ls'); };

  function ctxFix(s, p) {   // kata yang artinya bergantung tempat
    if (norm(s) === 'Jurusan' && p.closest && p.closest('.info-card, .flt-l')) return 'Major';
    return null;
  }
  function doText(n) {
    const v = n.nodeValue; if (!v || !/[A-Za-z]{2}/.test(v)) return;
    const p = n.parentNode; if (!p || /^(SCRIPT|STYLE|TEXTAREA|NOSCRIPT)$/.test(p.nodeName)) return;
    if (p.closest && p.closest('[data-notr]')) return;
    const rec = TEXTS.get(n); if (rec && rec.t === v) return;
    if (inBotBubble(p)) return;
    let r = null;
    if (p.closest && p.closest('.cb-m.user') && has(ECHO, norm(v))) r = ECHO[norm(v)];
    if (r == null) r = ctxFix(v, p);
    if (r == null) r = tx(v);
    if (r == null) return;
    const out = v.match(/^\s*/)[0] + r + v.match(/\s*$/)[0];
    if (out === v) return;
    TEXTS.set(n, { o: v, t: out }); n.nodeValue = out;
  }
  function doAttrs(el) {
    if (el.closest && el.closest('[data-notr]')) return;
    for (let i = 0; i < ATTRS.length; i++) {
      const a = ATTRS[i]; if (!el.hasAttribute(a)) continue;
      const v = el.getAttribute(a), rec = ATTRMAP.get(el) && ATTRMAP.get(el)[a]; if (rec && rec.t === v) continue;
      const r = tx(v); if (r == null || r === v) continue;
      let o = ATTRMAP.get(el); if (!o) ATTRMAP.set(el, o = {}); o[a] = { o: v, t: r }; el.setAttribute(a, r);
    }
  }
  function doTree(root) {
    if (!root) return;
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1) return;
    if (root.matches && root.matches('.cb-m.bot .cb-b')) botBubble(root);
    else if (root.querySelectorAll) root.querySelectorAll('.cb-m.bot .cb-b').forEach(botBubble);
    const w = document.createTreeWalker(root, 1 | 4, null);
    let n = w.currentNode;
    while (n) {
      if (n.nodeType === 1) { if (!/^(SCRIPT|STYLE)$/.test(n.nodeName)) doAttrs(n); } else doText(n);
      n = w.nextNode();
    }
    // pencarian berkas (kotak cari di halaman Unduhan) ikut mencocokkan teks Inggris
    (root.querySelectorAll ? [].slice.call(root.querySelectorAll('.dl-card[data-q]')) : []).forEach(el => {
      if (!el.dataset.qo) el.dataset.qo = el.dataset.q;
      el.dataset.q = el.dataset.qo + ' ' + el.textContent.replace(/\s+/g, ' ').toLowerCase();
    });
  }
  function doTitle() { const ti = document.querySelector('title'); if (ti) doTree(ti); }
  function undoAll() {
    TEXTS.forEach((rec, n) => { if (n.isConnected && n.nodeValue === rec.t) n.nodeValue = rec.o; }); TEXTS.clear();
    ATTRMAP.forEach((o, el) => { for (const a in o) if (el.isConnected && el.getAttribute(a) === o[a].t) el.setAttribute(a, o[a].o); }); ATTRMAP.clear();
    restoreBubbles();
    document.querySelectorAll('.dl-card[data-qo]').forEach(el => { el.dataset.q = el.dataset.qo; delete el.dataset.qo; });
  }

  /* ---------- 8. Pengamat perubahan DOM ---------- */
  let obs = null;
  function watch() {
    if (obs) return;
    obs = new MutationObserver(list => {
      if (LANG !== 'en') return;
      obs.disconnect();
      try {
        list.forEach(r => {
          if (r.type === 'childList') r.addedNodes.forEach(n => doTree(n));
          else if (r.type === 'characterData') doText(r.target);
          else if (r.type === 'attributes') doAttrs(r.target);
        });
      } finally { arm(); }
    });
    arm();
  }
  const arm = () => obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });

  /* ---------- 9. Tombol ID / EN ---------- */
  const CSS = '.lang-toggle{width:auto!important;min-width:40px;padding:0 10px;margin-right:8px;gap:4px;font:700 12.5px/1 var(--font,system-ui,sans-serif);letter-spacing:.04em}' +
    '.lang-toggle i{font-style:normal;opacity:.45}.lang-toggle span{opacity:.55}.lang-toggle span.on{opacity:1;color:var(--gold,#FFC72C)}' +
    'html[data-theme="light"] .lang-toggle span.on, :root:not([data-theme="dark"]) .lang-toggle span.on{color:var(--accent,#213C9B)}' +
    '@media(max-width:1040px){.lang-toggle{margin-right:6px;padding:0 8px}}';
  function paintBtn() {
    const b = document.getElementById('lang-toggle'); if (!b) return;
    b.querySelector('.lt-id').classList.toggle('on', LANG === 'id'); b.querySelector('.lt-en').classList.toggle('on', LANG === 'en');
    const lbl = LANG === 'en' ? 'Switch language to Indonesian' : 'Ganti bahasa ke English';
    b.setAttribute('aria-label', lbl); b.title = lbl; b.setAttribute('aria-pressed', String(LANG === 'en'));
  }
  function buildBtn() {
    if (document.getElementById('lang-toggle')) return;
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const tools = document.querySelector('.nav-tools'); if (!tools) return;
    const b = document.createElement('button'); b.type = 'button'; b.id = 'lang-toggle'; b.className = 'theme-toggle lang-toggle'; b.setAttribute('data-notr', '');
    b.innerHTML = '<span class="lt-id">ID</span><i>/</i><span class="lt-en">EN</span>';
    b.onclick = () => setLang(LANG === 'en' ? 'id' : 'en');
    tools.insertBefore(b, tools.firstChild); paintBtn();
  }

  /* ---------- 10. Ganti bahasa ---------- */
  function setLang(l, silent) {
    LANG = l === 'en' ? 'en' : 'id';
    if (!silent) { try { localStorage.setItem(KEY, LANG); } catch (e) { } }
    document.documentElement.lang = LANG;
    if (obs) obs.disconnect();
    if (LANG === 'en') { doTree(document.body); doTitle(); } else undoAll();
    if (obs) arm(); else watch();
    paintBtn();
  }

  /* ---------- 11. Chatbot: pertanyaan berbahasa Inggris -> kata kunci bahasa Indonesia ---------- */
  const FRASA = [['how much', 'berapa'], ['how to', 'cara'], ['how do i', 'cara'], ['how can i', 'cara'], ['where is', 'dimana'], ['tuition fee', 'biaya spp'],
    ['opening hours', 'jam operasional'], ['office hours', 'jam operasional'], ['open hours', 'jam operasional'], ['re-registration', 'daftar ulang'],
    ['reregistration', 'daftar ulang'], ['new students', 'siswa baru'], ['new student', 'siswa baru'], ['thank you', 'terima kasih'], ['see you', 'sampai jumpa'],
    ['talk to', 'bicara langsung'], ['speak to', 'bicara langsung'], ['contact admin', 'hubungi admin'], ['study program', 'program keahlian'],
    ['career prospects', 'karier'], ['job prospects', 'karier'], ['school fees', 'biaya'], ['phone number', 'telepon'], ['good morning', 'selamat pagi'],
    ['good afternoon', 'selamat siang'], ['good evening', 'selamat sore']];
  const KATA = { hello: 'halo', hi: 'halo', hey: 'halo', greetings: 'halo', thanks: 'terima kasih', thank: 'terima kasih', bye: 'sampai jumpa', goodbye: 'sampai jumpa',
    who: 'siapa', bot: 'bot', robot: 'robot', assistant: 'asisten', admin: 'admin', staff: 'admin', human: 'admin', person: 'admin', committee: 'panitia',
    requirement: 'syarat', requirements: 'syarat', documents: 'dokumen', document: 'dokumen', papers: 'dokumen', register: 'daftar', registration: 'daftar',
    registering: 'daftar', apply: 'daftar', application: 'daftar', enroll: 'daftar', enrollment: 'daftar', admission: 'ppdb', admissions: 'ppdb', ppdb: 'ppdb',
    steps: 'alur', step: 'langkah', process: 'alur', procedure: 'prosedur', schedule: 'jadwal', when: 'kapan', deadline: 'deadline', wave: 'gelombang',
    date: 'jadwal', dates: 'jadwal', open: 'buka', close: 'tutup', closed: 'tutup', announcement: 'pengumuman', quota: 'kuota', cost: 'biaya', costs: 'biaya',
    fee: 'biaya', fees: 'biaya', tuition: 'spp', price: 'biaya', pay: 'bayar', payment: 'pembayaran', installment: 'cicilan', installments: 'cicilan',
    uniform: 'seragam', free: 'gratis', scholarship: 'beasiswa', scholarships: 'beasiswa', discount: 'keringanan', waiver: 'keringanan',
    major: 'jurusan', majors: 'jurusan', department: 'jurusan', departments: 'jurusan', program: 'program keahlian', programs: 'program keahlian',
    extracurricular: 'ekskul', extracurriculars: 'ekskul', club: 'ekskul', clubs: 'ekskul', sports: 'olahraga', activities: 'kegiatan', activity: 'kegiatan',
    achievements: 'prestasi', achievement: 'prestasi', awards: 'penghargaan', award: 'penghargaan', competition: 'lomba', winners: 'juara', events: 'acara',
    event: 'acara', news: 'berita', address: 'alamat', location: 'alamat', where: 'dimana', phone: 'telepon', call: 'telepon', contact: 'kontak', email: 'email',
    hours: 'jam operasional', whatsapp: 'whatsapp', map: 'alamat', profile: 'profil', about: 'tentang', history: 'sejarah', vision: 'visi', mission: 'misi',
    accreditation: 'akreditasi', accredited: 'akreditasi', download: 'unduh', downloads: 'unduh', form: 'formulir', forms: 'formulir', letter: 'surat',
    internship: 'pkl', apprenticeship: 'pkl', industry: 'industri', partners: 'mitra', partner: 'mitra', career: 'karier', careers: 'karier', jobs: 'kerja',
    job: 'kerja', alumni: 'alumni', graduates: 'lulusan', facilities: 'fasilitas', facility: 'fasilitas', laboratory: 'laboratorium', lab: 'laboratorium',
    school: 'sekolah', library: 'perpustakaan', mosque: 'masjid', canteen: 'kantin', building: 'gedung', students: 'jumlah siswa', teachers: 'jumlah guru' };
  const STOPEN = new Set('a an the is are am do does can could would will i you we me my your our what which of to for in on at and or there have has any please tell give want need know like it this that be'.split(' '));
  function enToId(q) {
    let s = ' ' + String(q).toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
    FRASA.forEach(p => { s = s.split(' ' + p[0] + ' ').join(' ' + p[1] + ' '); });
    const out = s.trim().split(' ').filter(Boolean).map(w => has(KATA, w) ? KATA[w] : (STOPEN.has(w) ? '' : w)).filter(Boolean);
    return out.join(' ') || String(q);
  }
  document.addEventListener('submit', e => {   // fase capture: berjalan sebelum handler chatbot
    if (LANG !== 'en' || !e.target || e.target.id !== 'cb-form') return;
    const inp = document.getElementById('cb-in'); if (!inp || !inp.value.trim()) return;
    const orig = inp.value.trim(), mapped = enToId(orig);
    if (norm(mapped) !== norm(orig)) {
      ECHO[norm(mapped)] = orig; try { sessionStorage.setItem('smk_lang_echo', JSON.stringify(ECHO)); } catch (x) { }
      inp.value = mapped;
    }
  }, true);

  /* ---------- 12. alert(): pesan peringatan ikut diterjemahkan ---------- */
  const _alert = window.alert;
  window.alert = function (msg) { return _alert.call(window, LANG === 'en' ? T(String(msg)) : msg); };

  /* ---------- 13. Mulai ---------- */
  function init() {
    buildBtn();
    document.documentElement.lang = LANG;
    if (LANG === 'en') { doTree(document.body); doTitle(); }
    watch();
  }
  window.SMKLang = { set: setLang, get: () => LANG, tx: s => T(s), kamus: KAMUS };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
