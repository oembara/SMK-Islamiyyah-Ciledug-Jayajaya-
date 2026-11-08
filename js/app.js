    /* =====================================================================
       PETUNJUK GAMBAR: semua foto disimpan di folder  assets/  (sejajar dengan file index.html)
       Nama file mengikuti pola di bawah. Ekstensi boleh .jpg / .jpeg / .png / .webp.
       Kalau foto belum ada, otomatis tampil placeholder gradasi (tidak error).

         assets/logo.png                 logo di navbar
         assets/hero.jpg                 background beranda (diatur di CSS .hero)
         assets/profil/sekolah.jpg       foto di halaman Profil (bagian sejarah)
         assets/profil/visimisi.jpg      foto di halaman Profil (bagian visi & misi)
         assets/jurusan/tkj.jpg          foto utama jurusan (nama = kode jurusan huruf kecil: tkj, dkv, tbsm)
         assets/jurusan/tkj-1.jpg        galeri jurusan: -1, -2, -3
         assets/prestasi/1.jpg           foto prestasi (angka = id di data PRESTASI)
         assets/ekskul/1.jpg             foto ekskul (angka = id di data EKSKUL)
         assets/ekskul/1-1.jpg           galeri ekskul: -1 sampai -6
         assets/kegiatan/1.jpg           foto kegiatan (angka = id di data KEGIATAN)
         assets/kegiatan/1-1.jpg         galeri kegiatan: -1 sampai -6
       ===================================================================== */
    const P = {
      profil: 'assets/profil/sekolah',
      profilVisi: 'assets/profil/visimisi',
      jurusan: id => `assets/jurusan/${id}`,
      jurusanGaleri: (id, n) => `assets/jurusan/${id}-${n}`,
      prestasi: id => `assets/prestasi/${id}`,
      ekskul: id => `assets/ekskul/${id}`,
      ekskulGaleri: (id, n) => `assets/ekskul/${id}-${n}`,
      kegiatan: id => `assets/kegiatan/${id}`,
      kegiatanGaleri: (id, n) => `assets/kegiatan/${id}-${n}`
    };
    // Jumlah kotak galeri per halaman detail (kotak tanpa foto tampil sebagai placeholder gradasi)
    const GALERI_JUMLAH = { jurusan: 3, ekskul: 6, kegiatan: 6 };

    const IMG = (base, alt = '') => `<img class="ph" src="${base}.${IMG_EXT[0]}" data-base="${base}" data-i="0" alt="${alt}" loading="lazy" onerror="imgFallback(this)">`;
    const photoOf = (item, base, alt = '') => item && item.foto ? `<img class="ph" src="${item.foto}" alt="${alt}" loading="lazy" decoding="async">` : IMG(base, alt);
    const galeriOf = (item, fn, n, alt) => item && item.galeri && item.galeri.length
      ? `<div class="gallery">${item.galeri.map((src, k) => `<div><img class="ph" src="${src}" alt="${alt} ${k + 1}" loading="lazy" decoding="async"></div>`).join('')}</div>`
      : galeri(fn, n, alt);
    function jurVisual(id, k) { return JURUSAN_VISUAL[id] || { bg: ['bg1', 'bg2', 'bg3'][k % 3], icon: ic.net }; }
    const galeri = (fn, n, alt) => `<div class="gallery">${Array.from({ length: n }, (_, k) => `<div>${IMG(fn(k + 1), alt + ' ' + (k + 1))}</div>`).join('')}</div>`;

    /* ---------- DATA ---------- */
    // Data (jurusan, prestasi, ekskul, kegiatan, pengaturan) ada di data.js dan bisa diubah lewat admin.html
    let JURUSAN = SITE_DEFAULT.JURUSAN, PRESTASI = SITE_DEFAULT.PRESTASI, EKSKUL = SITE_DEFAULT.EKSKUL, KEGIATAN = SITE_DEFAULT.KEGIATAN, PPDB = SITE_DEFAULT.PPDB, POSTER = SITE_DEFAULT.POSTER, TESTIMONI = SITE_DEFAULT.TESTIMONI, MITRA = SITE_DEFAULT.MITRA, UNDUHAN = SITE_DEFAULT.UNDUHAN, CHATBOT = SITE_DEFAULT.CHATBOT, CFG = SITE_DEFAULT.settings;

    /* ---------- ICONS ---------- */
    const ic = {
      net: '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><circle cx="24" cy="10" r="4"/><circle cx="10" cy="34" r="4"/><circle cx="38" cy="34" r="4"/><path d="M24 14v8M24 22l-11 8M24 22l11 8"/></svg>',
      design: '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 40l7-2 20-20-5-5-20 20-2 7z"/><path d="M27 15l5 5"/></svg>',
      moto: '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="34" r="6"/><circle cx="36" cy="34" r="6"/><path d="M12 34l8-16h10l6 10M20 18h8"/></svg>',
      pin: '<svg viewBox="0 0 24 24" fill="none" stroke="#213C9B" stroke-width="2"><path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/></svg>',
      phone: '<svg viewBox="0 0 24 24" fill="none" stroke="#213C9B" stroke-width="2"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C9.4 21 3 14.6 3 6a2 2 0 0 1 2-2z"/></svg>',
      mail: '<svg viewBox="0 0 24 24" fill="none" stroke="#213C9B" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
      clock: '<svg viewBox="0 0 24 24" fill="none" stroke="#213C9B" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>'
    };

    /* ---------- DATA & PENGATURAN DARI ADMIN ---------- */
    function openWA() {
      const n = String(CFG.whatsapp || '').replace(/\D/g, '');
      if (n) window.open('https://wa.me/' + n, '_blank');
      else alert('Nomor WhatsApp belum diisi. Isi lewat admin.html, menu Pengaturan Umum.');
    }
    function applySettings() {
      const $ = id => document.getElementById(id);
      document.title = (PAGE_TITLE[document.body.dataset.page] ? PAGE_TITLE[document.body.dataset.page] + ' | ' : '') + CFG.namaLengkap;
      $('brand-b').innerHTML = CFG.namaSekolah; $('brand-s').innerHTML = CFG.subNama;
      $('ft-nama').innerHTML = CFG.namaLengkap; $('ft-alamat').innerHTML = CFG.alamat;
      $('ft-telp').innerHTML = CFG.telepon; $('ft-email').innerHTML = CFG.email;
      $('ft-copy').innerHTML = '© ' + new Date().getFullYear() + ' ' + CFG.namaLengkap + '. Hak cipta dilindungi.';
      $('tb-alamat').textContent = CFG.alamat; $('tb-telp').textContent = CFG.telepon; $('tb-email').textContent = CFG.email;
      $('ft-akr').textContent = CFG.akreditasi ? 'Terakreditasi ' + CFG.akreditasi : '';
      $('ft-npsn').textContent = CFG.npsn ? 'NPSN ' + CFG.npsn : '';
      if (CFG.jamLayanan) { $('ft-jam').textContent = CFG.jamLayanan; $('ft-jam-w').hidden = false; }
      $('ft-jur').innerHTML = Object.entries(JURUSAN).map(([id, j]) => `<a href="${hrefOf('jurusan/' + id)}">${j.name}</a>`).join('');
      if (CFG.logo) $('ft-logo').src = CFG.logo;
      if (CFG.logo) {
        let l = $('logo-img');
        if (!l) { l = document.createElement('img'); l.id = 'logo-img'; l.alt = 'Logo'; $('logo-fallback').before(l); }
        l.onerror = null; l.onload = () => { $('logo-fallback').style.display = 'none'; }; l.src = CFG.logo;
      }
      if (CFG.heroBg) document.documentElement.style.setProperty('--hero-custom', `url("${new URL(CFG.heroBg, document.baseURI).href}")`);
    }
    async function initData() {
      try {
        const { data } = await SiteStore.load();
        JURUSAN = data.JURUSAN; PRESTASI = data.PRESTASI; EKSKUL = data.EKSKUL; KEGIATAN = data.KEGIATAN; PPDB = data.PPDB; POSTER = data.POSTER; TESTIMONI = data.TESTIMONI; MITRA = data.MITRA; UNDUHAN = data.UNDUHAN; CHATBOT = data.CHATBOT; CFG = data.settings;
      } catch (e) { console.warn('Data admin gagal dimuat, memakai data bawaan', e); }
      applySettings();
    }

    /* ---------- ROUTER ---------- */
    const PAGE_FILE = {'home': 'index.html', 'profil': 'profil.html', 'jurusan': 'jurusan.html', 'prestasi': 'prestasi.html', 'ekskul': 'ekskul.html', 'kegiatan': 'kegiatan.html', 'kontak': 'kontak.html', 'ppdb': 'ppdb.html', 'unduhan': 'unduhan.html'};
    const PAGE_TITLE = {'profil': 'Profil Sekolah', 'jurusan': 'Program Keahlian', 'prestasi': 'Prestasi', 'ekskul': 'Ekstrakurikuler', 'kegiatan': 'Kegiatan', 'kontak': 'Kontak', 'ppdb': 'PPDB', 'unduhan': 'Pusat Berkas'};
    // 'jurusan/tkj' -> jurusan.html?id=tkj
    function hrefOf(r) { const [a, b] = String(r).split('/'); return (PAGE_FILE[a] || 'index.html') + (b ? '?id=' + encodeURIComponent(b) : ''); }
    function go(r) { location.href = hrefOf(r); }
    
    window.addEventListener('DOMContentLoaded', async () => { await initData(); buildDropdowns(); render(); initChrome(); });

    function render() {
      const route = document.body.dataset.page || 'home';
      const param = new URLSearchParams(location.search).get('id');
      document.getElementById('menu').classList.remove('open');
      closeDropdowns();
      document.querySelectorAll('nav.menu a').forEach(a => a.classList.toggle('active', a.dataset.r === route));
      const app = document.getElementById('app');
      const pages = {
        home: renderHome, profil: renderProfil, jurusan: () => param ? renderJurusanDetail(param) : renderJurusanList(),
        prestasi: () => param ? renderPrestasiDetail(param) : renderPrestasiList(),
        ekskul: () => param ? renderEkskulDetail(param) : renderEkskulList(),
        kegiatan: () => param ? renderKegiatanDetail(param) : renderKegiatanList(),
        kontak: renderKontak,
        ppdb: renderPPDB,
        unduhan: renderUnduhan
      };
      app.innerHTML = (pages[route] || renderHome)();
      window.scrollTo(0, 0);
      app.classList.remove('fadekey'); void app.offsetWidth; app.classList.add('fadekey');
      initJurusanSlider();
      initPosters();
      initCountdown();
      initCounters();
      initReveal();
    }

    /* ---------- COMPONENTS ---------- */
    const card = (thumbClass, iconSvg, title, desc, chips, onclick, imgHtml) => `
  <div class="card" onclick="${onclick}">
    <div class="thumb ${thumbClass}">${iconSvg}${imgHtml || ''}</div>
    <div class="body"><h3>${title}</h3><p>${desc}</p><div class="meta">${chips}</div></div>
  </div>`;

    /* ---------- SLIDESHOW JURUSAN (beranda) ---------- */
    // Isi slide diambil otomatis dari data JURUSAN di atas. Warna & ikon tiap slide diatur di sini:
    const JURUSAN_VISUAL = { tkj: { bg: 'bg1', icon: ic.net }, dkv: { bg: 'bg2', icon: ic.design }, tbsm: { bg: 'bg3', icon: ic.moto } };
    const CHEV_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
    const CHEV_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';

    function renderJurusanSlider() {
      const items = Object.entries(JURUSAN), n = items.length;
      if (!n) return '<p>Belum ada data jurusan.</p>';
      return `
      <div class="jsl" id="jsl" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Program keahlian">
        <div class="jsl-viewport"><div class="jsl-track">
          ${items.map(([id, j], k) => {
            const v = jurVisual(id, k);
            return `<article class="jsl-slide" role="group" aria-roledescription="slide" aria-label="${k + 1} dari ${n}">
              <div class="jsl-visual ${v.bg}">${v.icon}${photoOf(j, P.jurusan(id), j.name)}<span class="jsl-code">${j.singkatan}</span></div>
              <div class="jsl-info">
                <span class="chip kode">${j.singkatan}</span>
                <h3>${j.name}</h3>
                <p>${j.tagline}</p>
                <ul class="plain">${j.kompetensi.slice(0, 3).map(x => `<li>${x}</li>`).join('')}</ul>
                <div class="meta">${j.karier.slice(0, 3).map(x => `<span class="chip gold">${x}</span>`).join('')}</div>
                <button class="btn btn-navy" onclick="go('jurusan/${id}')">Lihat Detail Jurusan</button>
              </div>
            </article>`;
          }).join('')}
        </div></div>
        <button class="jsl-btn jsl-prev" aria-label="Jurusan sebelumnya">${CHEV_L}</button>
        <button class="jsl-btn jsl-next" aria-label="Jurusan berikutnya">${CHEV_R}</button>
        <div class="jsl-dots">${items.map((_, k) => `<button class="jsl-dot${k === 0 ? ' active' : ''}" aria-label="Ke jurusan ${k + 1}"></button>`).join('')}</div>
      </div>`;
    }

    function initJurusanSlider() {
      const root = document.getElementById('jsl'); if (!root) return;
      const track = root.querySelector('.jsl-track'), vp = root.querySelector('.jsl-viewport');
      const dots = root.querySelectorAll('.jsl-dot'), n = dots.length;
      let i = 0, startX = 0, dx = 0, drag = false, suppress = false;
      const set = (idx) => {
        i = (idx + n) % n;
        track.style.transition = ''; track.style.transform = `translateX(${-i * 100}%)`;
        dots.forEach((d, k) => d.classList.toggle('active', k === i));
      };
      root.querySelector('.jsl-prev').onclick = () => set(i - 1);
      root.querySelector('.jsl-next').onclick = () => set(i + 1);
      dots.forEach((d, k) => d.onclick = () => set(k));
      root.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') set(i - 1); if (e.key === 'ArrowRight') set(i + 1); });
      vp.addEventListener('pointerdown', e => { drag = true; startX = e.clientX; dx = 0; track.style.transition = 'none'; });
      vp.addEventListener('pointermove', e => {
        if (!drag) return;
        dx = e.clientX - startX;
        track.style.transform = `translateX(calc(${-i * 100}% + ${dx}px))`;
      });
      const end = () => {
        if (!drag) return; drag = false;
        if (Math.abs(dx) > 5) { suppress = true; setTimeout(() => suppress = false, 0); }
        set(Math.abs(dx) > 50 ? (dx < 0 ? i + 1 : i - 1) : i);
      };
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => vp.addEventListener(ev, end));
      vp.addEventListener('click', e => { if (suppress) { e.preventDefault(); e.stopPropagation(); } }, true);
    }

    /* ---------- DROPDOWN NAVBAR (Jurusan & Ekstrakurikuler) ---------- */
    // Isi dropdown diambil otomatis dari data JURUSAN dan EKSKUL, jadi kalau data ditambah, menu ikut bertambah.
    function closeDropdowns(except) {   // except: dropdown yang tetap dibiarkan (bila ada)
      document.querySelectorAll('.has-dd').forEach(d => { if (d !== except) { d.classList.remove('open'); d.querySelector('.dd-toggle').setAttribute('aria-expanded', 'false'); } });
    }
    // Hover hanya berlaku untuk mouse di layar desktop; layar sentuh dan drawer mobile tetap memakai tombol panah
    const canHover = () => matchMedia('(hover: hover) and (min-width: 1041px)').matches;
    function buildDropdowns() {
      const fill = (id, allLabel, allHash, items) => {
        document.getElementById(id).innerHTML = `<a href="${hrefOf(allHash)}" class="dd-all">${allLabel}</a>` +
          items.map(it => `<a href="${hrefOf(it.hash)}">${it.code ? `<span class="dd-code">${it.code}</span>` : ''}${it.label}</a>`).join('');
      };
      fill('dd-jurusan-list', 'Semua Jurusan', 'jurusan', Object.entries(JURUSAN).map(([id, j]) => ({ hash: 'jurusan/' + id, label: j.name, code: j.singkatan })));
      fill('dd-ekskul-list', 'Semua Ekstrakurikuler', 'ekskul', EKSKUL.map(e => ({ hash: 'ekskul/' + e.id, label: e.name })));
      document.querySelectorAll('.has-dd').forEach(dd => {
        const toggle = dd.querySelector('.dd-toggle');
        const setOpen = v => { dd.classList.toggle('open', v); toggle.setAttribute('aria-expanded', String(v)); };
        // Buka saat kursor masuk (jeda singkat 70 ms agar tidak berkedip saat kursor hanya lewat),
        // tutup 220 ms setelah kursor keluar dari menu DAN kotaknya (jeda memberi toleransi gerakan diagonal)
        dd.addEventListener('pointerenter', e => {
          if (e.pointerType !== 'mouse' || !canHover()) return;
          clearTimeout(dd._t);
          dd._t = setTimeout(() => { closeDropdowns(dd); dd.classList.remove('dd-hide'); setOpen(true); }, 70);
        });
        dd.addEventListener('pointerleave', e => {
          if (e.pointerType !== 'mouse' || !canHover()) return;
          clearTimeout(dd._t); dd.classList.remove('dd-hide');
          dd._t = setTimeout(() => setOpen(false), 220);
        });
        dd.addEventListener('keydown', e => { if (e.key === 'Escape' && dd.classList.contains('open')) { setOpen(false); toggle.focus(); } });
        toggle.addEventListener('click', e => {
          e.stopPropagation();
          if (e.detail > 0 && canHover() && dd.classList.contains('open')) return;   // klik mouse saat sudah terbuka karena hover: biarkan terbuka
          const willOpen = !dd.classList.contains('open');
          closeDropdowns(); dd.classList.remove('dd-hide');
          dd.classList.toggle('open', willOpen); toggle.setAttribute('aria-expanded', String(willOpen));
        });
        const hide = () => { dd.classList.remove('open'); dd.classList.add('dd-hide'); };
        dd.querySelector(':scope > a').addEventListener('click', hide);
        dd.querySelector('.dropdown').addEventListener('click', e => {
          if (!e.target.closest('a')) return;
          hide(); document.getElementById('menu').classList.remove('open');
        });
        dd.addEventListener('mouseleave', () => dd.classList.remove('dd-hide'));
      });
      document.addEventListener('click', closeDropdowns);
    }

    /* ---------- MODE TERANG / GELAP ---------- */
    function toggleTheme() {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('smk_theme', next); } catch (e) { }
    }

    /* ---------- POSTER BERANDA ---------- */
    // Poster diatur lewat admin.html menu Poster: tambah/ubah, unggah gambar, atur tautan, dan switch aktif/nonaktif.
    let ACTIVE_POSTERS = [];
    const qa = t => String(t == null ? '' : t).replace(/"/g, '&quot;');
    function renderPosters() {
      ACTIVE_POSTERS = (POSTER || []).filter(p => p.aktif !== false);
      if (!ACTIVE_POSTERS.length) return '';
      return `
  <section class="section"><div class="wrap">
    <div class="section-head"><div><span class="tag">Info dan pengumuman</span><h2 style="margin-top:8px">Poster Terbaru</h2></div></div>
    <div class="pst-wrap" id="pst">
      <button class="pst-btn pst-prev" aria-label="Poster sebelumnya" hidden>‹</button>
      <div class="pst-track">${ACTIVE_POSTERS.map((p, i) => {
        const warna = 'warna-' + String(p.warna || 'Biru').toLowerCase();
        const aksi = p.link ? `<span class="pbtn">${p.tombol || 'Selengkapnya'}</span>` : '';
        if (p.foto) return `
        <article class="poster ${warna}" onclick="openPoster(${i})">
          <div class="poster-media"><img src="${p.foto}" alt="${qa(p.judul)}" loading="lazy"></div>
          ${p.tampilTeks === false ? '' : `<div class="poster-cap"><h3>${p.judul}</h3>${p.keterangan ? `<p>${p.keterangan}</p>` : ''}${p.link ? `<span class="plink">${p.tombol || 'Selengkapnya'} →</span>` : ''}</div>`}
        </article>`;
        return `
        <article class="poster ${warna}" onclick="openPoster(${i})">
          <div class="poster-media"><div class="poster-txt"><h3>${p.judul}</h3>${p.keterangan ? `<p>${p.keterangan}</p>` : ''}${aksi}</div></div>
        </article>`;
      }).join('')}</div>
      <button class="pst-btn pst-next" aria-label="Poster berikutnya" hidden>›</button>
    </div>
  </div></section>`;
    }
    function openPoster(i) {
      const p = ACTIVE_POSTERS[i]; if (!p) return;
      const l = String(p.link || '').trim();
      if (l.startsWith('#')) go(l.slice(1));
      else if (l) { const u = safeUrl(l); if (u) window.open(u, '_blank', 'noopener'); }
      else if (p.foto) lightbox(p.foto, p.judul);
    }
    function lightbox(src, alt) {
      const bg = document.createElement('div'); bg.className = 'lightbox';
      bg.innerHTML = `<img src="${src}" alt="${qa(alt)}"><button aria-label="Tutup">×</button>`;
      const close = () => { bg.remove(); document.removeEventListener('keydown', onKey); };
      const onKey = e => { if (e.key === 'Escape') close(); };
      bg.onclick = close; document.addEventListener('keydown', onKey); document.body.appendChild(bg);
    }
    function initPosters() {
      const w = document.getElementById('pst'); if (!w) return;
      const tr = w.querySelector('.pst-track'), pv = w.querySelector('.pst-prev'), nx = w.querySelector('.pst-next');
      const upd = () => {
        const over = tr.scrollWidth > tr.clientWidth + 4;
        pv.hidden = !over || tr.scrollLeft < 4;
        nx.hidden = !over || tr.scrollLeft + tr.clientWidth >= tr.scrollWidth - 4;
      };
      const step = () => { const c = tr.querySelector('.poster'); return (c ? c.getBoundingClientRect().width : 280) + 20; };
      pv.onclick = () => tr.scrollBy({ left: -step(), behavior: 'smooth' });
      nx.onclick = () => tr.scrollBy({ left: step(), behavior: 'smooth' });
      tr.addEventListener('scroll', upd, { passive: true });
      window.removeEventListener('resize', window.__pstUpd); window.__pstUpd = upd; window.addEventListener('resize', upd);
      upd(); setTimeout(upd, 300);
    }

    /* ---------- PPDB ---------- */
    // Isi PPDB (status, jadwal, alur, berkas, tautan formulir) diatur lewat admin.html menu PPDB dan Berkas PPDB.
    const safeUrl = u => { u = String(u || '').trim(); return (/^(https?:\/\/|mailto:)/i.test(u) || /^[\w\-./ %]+$/.test(u)) ? u : ''; };
    // Kotak informasi PPDB di bawah pita statistik. Visual utamanya lencana logo sekolah + watermark logo yang sangat halus
    function ppdbFeature() {
      if (PPDB.status === 'Ditutup') return '';
      const buka = PPDB.status === 'Dibuka', logo = CFG.logo || 'assets/logo.png';
      return `<section class="ppdb-feature"><div class="ppdb-box">
        <img class="pf-wm" src="${logo}" alt="" aria-hidden="true" onerror="this.remove()">
        <div class="pf-badge"><div class="pf-ring"><img src="${logo}" alt="Logo ${CFG.namaLengkap}" onerror="this.remove()"></div></div>
        <div class="pf-body">
          <span class="status${buka ? '' : ' soon'}">PPDB ${PPDB.tahun} · ${buka ? 'Dibuka' : 'Segera dibuka'}</span>
          <h2>${buka ? 'Pendaftaran Siswa Baru Telah Dibuka' : 'Pendaftaran Siswa Baru Segera Dibuka'}</h2>
          <p>${(PPDB.jadwal && PPDB.jadwal[0]) || PPDB.intro}</p>
        </div>
        <div class="pf-act"><button class="btn btn-gold" onclick="openDaftar()">${buka ? 'Daftar Cepat' : 'Pra-Daftar'}</button><a class="pf-link" href="ppdb.html">Persyaratan dan alur <span aria-hidden="true">→</span></a></div>
      </div></section>`;
    }
    // Kirim data awal calon siswa ke WhatsApp panitia (nomor diatur di admin: Pengaturan Umum > Nomor WhatsApp)
    function daftarWA(ev) {
      ev.preventDefault();
      const v = id => (document.getElementById(id).value || '').trim();
      const n = String(CFG.whatsapp || '').replace(/\D/g, '');
      if (!n) { alert('Nomor WhatsApp panitia belum diisi. Isi lewat admin.html, menu Pengaturan Umum.'); return false; }
      const teks = `Halo panitia PPDB ${CFG.namaLengkap}, saya ingin mendaftar PPDB ${PPDB.tahun}.\n\nNama calon siswa: ${v('pp-nama')}\nAsal sekolah: ${v('pp-asal')}\nPilihan jurusan: ${v('pp-jur')}\nNo. HP orang tua/wali: ${v('pp-hp')}\n\nMohon informasi langkah selanjutnya. Terima kasih.`;
      window.open('https://wa.me/' + n + '?text=' + encodeURIComponent(teks), '_blank');
      return false;
    }
    /* ---------- PUSAT BERKAS (UNDUHAN) ---------- */
    // Link Google Drive "file/d/ID/view" otomatis diubah menjadi tautan unduh langsung; skema berbahaya (javascript:, data:) ditolak
    function dlHref(u) {
      u = String(u || '').trim(); if (!u || /^(javascript|data|vbscript):/i.test(u)) return '';
      const m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/) || u.match(/drive\.google\.com\/open\?id=([\w-]+)/);
      return m ? 'https://drive.google.com/uc?export=download&id=' + m[1] : u;
    }
    function dlExt(x) {
      if (x.jenis) return String(x.jenis).toUpperCase().slice(0, 5);
      const m = String(x.url || '').split(/[?#]/)[0].match(/\.([a-z0-9]{2,5})$/i);
      return m ? m[1].toUpperCase() : (x.url ? 'LINK' : 'FILE');
    }
    const dlTone = e => /^(PDF)$/.test(e) ? 'pdf' : /^(DOC|DOCX|ODT|RTF)$/.test(e) ? 'doc' : /^(XLS|XLSX|CSV|ODS)$/.test(e) ? 'xls' : /^(PPT|PPTX)$/.test(e) ? 'ppt' : 'oth';
    const DL_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-5-5m5 5l5-5M5 21h14"/></svg>';
    function dlCard(x) {
      const href = dlHref(x.url), ext = dlExt(x), kat = x.kategori || 'Lainnya';
      const ext_ = href && !/^https?:\/\//i.test(href);   // file di hosting sendiri: paksa unduh; tautan luar: buka tab baru
      const meta = [x.ukuran, x.tanggal && 'Diperbarui ' + x.tanggal].filter(Boolean).map(s => `<span>${s}</span>`).join('');
      const act = href
        ? `<a class="btn btn-navy dl-btn" href="${qa(href)}" ${ext_ ? 'download' : 'target="_blank" rel="noopener"'} aria-label="Unduh ${qa(x.judul)}">${DL_ICON}<span>Unduh</span></a>`
        : `<span class="dl-btn dl-soon">Segera tersedia</span>`;
      return `<article class="dl-card${href ? '' : ' soon'}" data-kat="${qa(kat)}" data-q="${qa((x.judul + ' ' + (x.deskripsi || '') + ' ' + kat + ' ' + ext).toLowerCase())}">
        <div class="dl-ico ${dlTone(ext)}" aria-hidden="true"><b>${ext}</b></div>
        <div class="dl-body"><h3>${x.judul}</h3>${x.deskripsi ? `<p>${x.deskripsi}</p>` : ''}${meta ? `<div class="dl-meta">${meta}</div>` : ''}</div>${act}</article>`;
    }
    function renderUnduhan() {
      const list = (UNDUHAN || []).filter(x => x && x.aktif !== false && x.judul);
      const cats = [...new Set(list.map(x => x.kategori || 'Lainnya'))];
      const groups = cats.map(c => { const it = list.filter(x => (x.kategori || 'Lainnya') === c); return `<section class="dl-group" data-group><h2 class="dl-gh">${c}<small>${it.length} berkas</small></h2><div class="dl-grid">${it.map(dlCard).join('')}</div></section>`; }).join('');
      return `
  <section class="detail-hero"><div class="wrap"><span class="crumb" onclick="go('home')">← Beranda</span><h1>Pusat Berkas</h1><p class="sub">Dokumen dan formulir resmi sekolah yang bisa diunduh siswa maupun orang tua</p></div></section>
  <section class="section alt">
    <div class="wrap" data-filterable>
      ${list.length ? `<div class="dl-bar">
        <label class="dl-find"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input class="dl-search" type="search" placeholder="Cari berkas, mis. surat izin atau PKL" aria-label="Cari berkas" autocomplete="off"></label>
        ${filterRow('kat', 'Kategori', list.map(x => x.kategori || 'Lainnya'))}
      </div>
      <p class="flt-count">${list.length} berkas</p>
      <div class="dl-groups">${groups}</div>
      <p class="flt-empty" hidden>Tidak ada berkas yang cocok. Coba kata kunci lain atau pilih kategori Semua.</p>` : `<p class="flt-empty">Belum ada berkas yang tersedia saat ini.</p>`}
      <div class="dl-help"><div><h3>Tidak menemukan berkas yang dicari?</h3><p>Hubungi bagian tata usaha, kami bantu sediakan dokumen yang Anda perlukan.</p></div><button class="btn btn-navy" onclick="go('kontak')">Hubungi Kami</button></div>
    </div>
  </section>`;
    }
    document.addEventListener('input', e => { if (e.target.classList && e.target.classList.contains('dl-search')) applyFilter(e.target.closest('[data-filterable]')); });

    function renderPPDB() {
      const open = PPDB.status === 'Dibuka';
      const cls = open ? 'open' : (PPDB.status === 'Segera dibuka' ? 'soon' : 'closed');
      const berkas = PPDB.berkas || [], formLink = safeUrl(PPDB.formUrl);
      const dis = open ? '' : ' disabled';
      return `
  <section class="detail-hero"><div class="wrap"><span class="crumb" onclick="go('home')">← Beranda</span>
    <h1>PPDB ${PPDB.tahun}</h1>
    <p class="sub">Penerimaan Peserta Didik Baru ${CFG.namaLengkap}<span class="pp-badge ${cls}">${PPDB.status}</span></p>
    ${countdownHTML()}
    <div class="pp-hero-cta"><button class="btn btn-gold" onclick="openDaftar()">Daftar Cepat Sekarang</button><a class="btn btn-outline" href="#faq-ppdb">Biaya &amp; Beasiswa</a></div></div></section>

  <section class="section alt"><div class="wrap">
    <p class="pp-intro">${PPDB.intro}</p>
    ${open ? '' : `<div class="pp-note">Pendaftaran saat ini <b>${PPDB.status.toLowerCase()}</b>. Kamu tetap bisa mempelajari alur dan persyaratannya lebih dulu.</div>`}
    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:16px; align-items:center"><span class="pp-muted">Jurusan yang tersedia:</span>${Object.entries(JURUSAN).map(([id, j]) => `<span class="chip" style="cursor:pointer" onclick="go('jurusan/${id}')">${j.singkatan}</span>`).join('')}</div>
    <div class="two-col" style="margin-top:28px">
      <div class="box"><h3>Alur Pendaftaran</h3><ol class="pp-steps">${(PPDB.alur || []).map(x => `<li>${x}</li>`).join('')}</ol></div>
      <div class="box"><h3>Jadwal</h3><ul class="plain">${(PPDB.jadwal || []).map(x => `<li>${x}</li>`).join('')}</ul>
        ${PPDB.catatan ? `<p style="margin-top:14px; font-size:14px">${PPDB.catatan}</p>` : ''}</div>
    </div>
  </div></section>

  <section class="section"><div class="wrap">
    <div class="section-head"><div><span class="tag">Persyaratan</span><h2 style="margin-top:8px">Berkas yang Perlu Disiapkan</h2></div></div>
    ${berkas.length ? `<div class="grid cols-3">${berkas.map(b => { const u = safeUrl(b.link); return `
      <div class="box pp-doc"><div class="pp-check">✓</div><div><h3>${b.nama}</h3>${b.ket ? `<p>${b.ket}</p>` : ''}${u ? `<a class="btn btn-navy" href="${u}" target="_blank" rel="noopener">Unduh</a>` : ''}</div></div>`; }).join('')}</div>` : '<p class="pp-muted">Daftar persyaratan belum diisi.</p>'}
  </div></section>

  <div id="faq-ppdb">${renderFAQ()}</div>

  <section class="section alt"><div class="wrap">
    <div class="section-head"><div><span class="tag">Daftar sekarang</span><h2 style="margin-top:8px">Pilih Cara Mendaftar</h2></div></div>
    <div class="two-col">
      <div class="box"><h3>1. Formulir Online</h3>
        <p style="font-size:14.5px">Isi data lengkap dan unggah berkas persyaratan lewat formulir resmi sekolah. Cara paling lengkap dan paling rapi untuk panitia.</p>
        <div style="margin-top:16px">${formLink && open ? `<a class="btn btn-gold" href="${formLink}" target="_blank" rel="noopener">Buka Formulir Pendaftaran</a>` : `<button class="btn btn-gold" disabled>${formLink ? 'Pendaftaran belum dibuka' : 'Formulir belum tersedia'}</button>`}</div>
        ${formLink ? '' : '<p class="pp-muted" style="margin-top:10px">Tautan formulir belum diatur oleh admin. Sementara, gunakan opsi WhatsApp.</p>'}</div>
      <div class="box"><h3>2. Daftar Lewat WhatsApp</h3>
        <p style="font-size:14.5px">Isi data awal di bawah, lalu kirim ke WhatsApp panitia. Berkas bisa dikirim menyusul di chat yang sama.</p>
        <form class="pp-form" onsubmit="return daftarWA(event)">
          <label>Nama calon siswa<input id="pp-nama" required${dis} placeholder="Nama lengkap"></label>
          <label>Asal sekolah<input id="pp-asal" required${dis} placeholder="SMP/MTs asal"></label>
          <label>Pilihan jurusan<select id="pp-jur"${dis}>${Object.values(JURUSAN).map(j => `<option>${j.name} (${j.singkatan})</option>`).join('')}</select></label>
          <label>No. HP orang tua/wali<input id="pp-hp" type="tel" required${dis} placeholder="08xxxxxxxxxx"></label>
          <button class="btn btn-navy" type="submit"${dis}>Kirim ke WhatsApp Panitia</button>
        </form></div>
    </div>
    <p class="pp-muted" style="margin-top:20px">Lebih nyaman datang langsung? ${CFG.alamat}. Jam layanan: ${CFG.jam}.</p>
  </div></section>`;
    }

    /* =====================================================================
       FITUR BARU: konversi PPDB, social proof, filter, widget, bottom nav
       ===================================================================== */
    const ESC = t => String(t == null ? '' : t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const waNum = () => String(CFG.whatsapp || '').replace(/\D/g, '');
    const WA_ICON = '<svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.8 2 6.8L3 29l6.6-1.9c1.9 1 4 1.6 6.4 1.6 7.2 0 13-5.7 13-12.8S23.200 3 16 3zm0 23.300c-2 0-3.900-.6-5.500-1.600l-.4-.2-3.900 1.100 1.100-3.800-.3-.4A10.200 10.200 0 0 1 5.700 15.800C5.700 10.200 10.300 5.700 16 5.700s10.300 4.500 10.300 10.100S21.700 26.300 16 26.300zm5.600-7.600c-.3-.2-1.800-.9-2.100-1s-.5-.2-.7.200-.8 1-1 1.200-.4.200-.7 0a8.300 8.300 0 0 1-4.100-3.600c-.3-.5.300-.5.900-1.600.1-.2 0-.4 0-.5l-1-2.300c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400s-1 1-1 2.500 1.100 2.900 1.200 3.100 2.100 3.300 5.200 4.600c1.900.8 2.700.9 3.600.8.600-.1 1.800-.7 2.100-1.400s.3-1.300.2-1.400-.3-.2-.6-.3z"/></svg>';

    /* ---------- MODAL UMUM ---------- */
    function openModal(html, cls = '') {
      closeModal();
      const m = document.createElement('div'); m.className = 'modal-bg'; m.id = 'modal';
      m.innerHTML = `<div class="modal ${cls}" role="dialog" aria-modal="true"><button class="modal-x" aria-label="Tutup" onclick="closeModal()">×</button>${html}</div>`;
      m.addEventListener('click', e => { if (e.target === m) closeModal(); });
      document.body.appendChild(m); document.body.classList.add('no-scroll');
      requestAnimationFrame(() => m.classList.add('in'));
      const f = m.querySelector('input,select,button:not(.modal-x)'); if (f && !cls.includes('vid')) setTimeout(() => f.focus(), 120);
    }
    function closeModal() { const m = document.getElementById('modal'); if (m) m.remove(); document.body.classList.remove('no-scroll'); }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    /* ---------- QUICK REGISTRATION ---------- */
    function openDaftar(jurId) {
      const open = PPDB.status === 'Dibuka';
      openModal(`
        <span class="tag">PPDB ${ESC(PPDB.tahun)}</span><h3>Daftar Cepat</h3>
        <p class="qr-sub">${open ? 'Isi 4 data singkat, lalu pesan otomatis terkirim ke WhatsApp panitia.' : 'Pendaftaran belum dibuka, tapi kamu tetap bisa mengirim pra-pendaftaran ke panitia.'}</p>
        <form class="qr-form" id="qr-form" onsubmit="return submitDaftar(event)" novalidate>
          <label>Nama lengkap calon siswa<input id="qr-nama" autocomplete="name" placeholder="Nama sesuai ijazah" required></label>
          <label>No. WhatsApp aktif<input id="qr-wa" type="tel" inputmode="tel" autocomplete="tel" placeholder="08xxxxxxxxxx" required></label>
          <label>Asal SMP/MTs<input id="qr-asal" placeholder="Nama sekolah asal" required></label>
          <label>Pilihan jurusan<select id="qr-jur">${Object.entries(JURUSAN).map(([id, j]) => `<option value="${qa(j.name)} (${qa(j.singkatan)})"${id === jurId ? ' selected' : ''}>${j.name} (${j.singkatan})</option>`).join('')}</select></label>
          <p class="qr-err" id="qr-err" role="alert"></p>
          <button class="btn btn-gold" type="submit">${WA_ICON.replace('width="28" height="28"', 'width="18" height="18"')} Kirim ke WhatsApp Panitia</button>
        </form>
        <div class="qr-ok" id="qr-ok" hidden><div class="qr-check">✓</div><h3>Data terkirim</h3><p>Jika WhatsApp belum terbuka, tekan tombol di bawah. Panitia akan menghubungi nomor yang kamu isi.</p><a class="btn btn-navy" id="qr-link" target="_blank" rel="noopener">Buka WhatsApp</a></div>`, 'qr');
    }
    function submitDaftar(ev) {
      ev.preventDefault();
      const v = id => (document.getElementById(id).value || '').trim(), err = document.getElementById('qr-err');
      const d = { nama: v('qr-nama'), wa: v('qr-wa'), asal: v('qr-asal'), jur: v('qr-jur'), waktu: new Date().toISOString() };
      const digits = d.wa.replace(/\D/g, '');
      if (d.nama.length < 3) { err.textContent = 'Nama minimal 3 huruf.'; return false; }
      if (digits.length < 9 || digits.length > 15) { err.textContent = 'Nomor WhatsApp tidak valid (9–15 digit).'; return false; }
      if (d.asal.length < 3) { err.textContent = 'Isi asal sekolah.'; return false; }
      err.textContent = '';
      try { const l = JSON.parse(localStorage.getItem('smk_pendaftar') || '[]'); l.push(d); localStorage.setItem('smk_pendaftar', JSON.stringify(l.slice(-50))); } catch (e) { }
      const n = waNum();
      if (!n) { err.textContent = 'Nomor WhatsApp panitia belum diisi admin. Data kamu sudah tersimpan di browser ini.'; return false; }
      const teks = `Halo panitia PPDB ${CFG.namaLengkap}, saya ingin mendaftar PPDB ${PPDB.tahun}.\n\nNama: ${d.nama}\nNo. WhatsApp: ${d.wa}\nAsal sekolah: ${d.asal}\nPilihan jurusan: ${d.jur}\n\nMohon informasi langkah selanjutnya. Terima kasih.`;
      const url = 'https://wa.me/' + n + '?text=' + encodeURIComponent(teks);
      window.open(url, '_blank', 'noopener');
      document.getElementById('qr-form').hidden = true; document.getElementById('qr-ok').hidden = false; document.getElementById('qr-link').href = url;
      return false;
    }

    /* ---------- COUNTDOWN PPDB ---------- */
    function parseDeadline(s) {
      s = String(s || '').trim(); if (!s) return null;
      if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}$/.test(s)) s = s.replace(' ', 'T') + ':00+07:00';   // dianggap WIB
      const t = new Date(s).getTime(); return isNaN(t) ? null : t;
    }
    function countdownHTML() {
      const t = parseDeadline(PPDB.deadline); if (!t || PPDB.status === 'Ditutup') return '';
      const u = (k, l) => `<div><b data-u="${k}">00</b><small>${l}</small></div>`;
      return `<div class="cd" data-cd="${t}"><span class="cd-l">${ESC(PPDB.deadlineLabel || 'Pendaftaran ditutup dalam')}</span><div class="cd-b">${u('d', 'Hari')}${u('h', 'Jam')}${u('m', 'Menit')}${u('s', 'Detik')}</div></div>`;
    }
    let _cdTimer;
    function initCountdown() {
      clearInterval(_cdTimer);
      const els = [...document.querySelectorAll('.cd[data-cd]')]; if (!els.length) return;
      const pad = n => String(n).padStart(2, '0');
      const tick = () => els.forEach(el => {
        let ms = +el.dataset.cd - Date.now();
        if (ms <= 0) { el.classList.add('done'); el.innerHTML = '<span class="cd-l">Batas waktu pendaftaran gelombang ini telah berakhir</span>'; return; }
        const s = Math.floor(ms / 1000), set = (k, val) => { const b = el.querySelector(`[data-u="${k}"]`); if (b) b.textContent = pad(val); };
        set('d', Math.floor(s / 86400)); set('h', Math.floor(s % 86400 / 3600)); set('m', Math.floor(s % 3600 / 60)); set('s', s % 60);
      });
      tick(); _cdTimer = setInterval(tick, 1000);
    }

    /* ---------- COUNT-UP ANGKA ---------- */
    function initCounters() {
      const els = [...document.querySelectorAll('[data-cu]')];
      const run = el => {
        const m = el.textContent.trim().match(/^(\D*?)(\d[\d.]*)(.*)$/); if (!m) return;
        const to = parseInt(m[2].replace(/\./g, ''), 10), t0 = performance.now(), dur = 1400;
        const step = now => { const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = m[1] + Math.round(to * e).toLocaleString('id-ID') + m[3]; if (k < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      };
      if (REDUCED || !('IntersectionObserver' in window)) return;
      const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { io.unobserve(x.target); run(x.target); } }), { threshold: .4 });
      els.forEach(el => io.observe(el));
    }
    const statNum = v => `<b data-cu>${ESC(v)}</b>`;

    /* ---------- MITRA MARQUEE ---------- */
    function renderMitra() {
      const list = (MITRA || []).filter(m => m && (m.foto || m.nama)); if (!list.length) return '';
      const rep = Math.max(1, Math.ceil(8 / list.length)), one = Array.from({ length: rep }, () => list).flat();
      const item = m => `<div class="mq-i" title="${qa(m.nama)}">${m.foto ? `<img src="${m.foto}" alt="${qa(m.nama)}" loading="lazy">` : `<span>${ESC(m.nama)}</span>`}</div>`;
      return `<section class="mq-sec"><div class="wrap"><p class="mq-t">Dipercaya mitra industri tempat siswa PKL dan alumni bekerja</p></div>
        <div class="mq" style="--mq-dur:${Math.max(24, one.length * 4)}s"><div class="mq-track">${one.map(item).join('')}<span class="mq-sp" aria-hidden="true"></span>${one.map(item).join('')}</div></div></section>`;
    }

    /* ---------- TESTIMONI ---------- */
    function renderTestimoni() {
      const list = (TESTIMONI || []).filter(x => x && x.aktif !== false && x.nama); if (!list.length) return '';
      const ini = n => n.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
      return `<section class="section alt"><div class="wrap">
        <div class="section-head"><div><span class="tag">Cerita alumni</span><h2 style="margin-top:8px">Mereka Sudah Membuktikannya</h2></div></div>
        <div class="testi-grid">${list.map(x => `<figure class="testi">
          <div class="testi-q">“</div><blockquote>${ESC(x.pesan)}</blockquote>
          <figcaption><div class="testi-av">${x.foto ? `<img src="${x.foto}" alt="${qa(x.nama)}" loading="lazy">` : ini(x.nama)}</div>
            <div><b>${ESC(x.nama)}</b><span>Alumni ${ESC(x.tahun)}${x.pekerjaan ? ' · ' + ESC(x.pekerjaan) : ''}</span></div></figcaption></figure>`).join('')}</div>
      </div></section>`;
    }

    /* ---------- VIDEO PROFIL / VIRTUAL TOUR ---------- */
    function videoInfo(u) {
      u = safeUrl(CFG.videoUrl); if (!u) return null;
      const y = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([\w-]{11})/);
      if (y) return { yt: y[1] };
      if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(u)) return { file: u };
      return null;
    }
    function renderVideo() {
      const v = videoInfo(); if (!v) return '';
      const bg = v.yt ? `style="background-image:url('https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg')"` : '';
      return `<section class="section"><div class="wrap">
        <div class="section-head"><div><span class="tag">Virtual tour</span><h2 style="margin-top:8px">${ESC(CFG.videoJudul || 'Video Profil Sekolah')}</h2></div></div>
        <button class="vid-card" ${bg} onclick="openVideo()" aria-label="Putar video"><span class="vid-play"><svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span></button>
      </div></section>`;
    }
    function openVideo() {
      const v = videoInfo(); if (!v) return;
      const watch = v.yt ? 'https://www.youtube.com/watch?v=' + v.yt : v.file;
      // YouTube menolak (Error 153) bila halaman pemuat tidak mengirim Referer/origin, misalnya saat website dibuka lewat file://
      // atau diblokir ekstensi privasi. Karena itu: kirim referrer eksplisit, kirim origin, dan selalu sediakan tautan cadangan.
      const lokal = location.protocol === 'file:';
      let player;
      if (v.yt && lokal) {
        player = `<div class="vid-local"><p><b>Video YouTube tidak bisa diputar dari file lokal.</b></p><p>Putar langsung di YouTube, atau buka website lewat alamat hosting / localhost.</p><a class="btn btn-gold" href="${watch}" target="_blank" rel="noopener">Tonton di YouTube</a></div>`;
      } else if (v.yt) {
        const o = encodeURIComponent(location.origin);
        player = `<iframe src="https://www.youtube-nocookie.com/embed/${v.yt}?autoplay=1&rel=0&playsinline=1&origin=${o}" title="Video profil" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
      } else {
        player = `<video src="${qa(v.file)}" controls autoplay playsinline></video>`;
      }
      openModal(`<div class="vid-frame">${player}</div>${v.yt ? `<p class="vid-alt">Video tidak tampil? <a href="${watch}" target="_blank" rel="noopener">Buka di YouTube</a></p>` : ''}`, 'vid');
    }

    /* ---------- ACCORDION + FILTER (tanpa reload) ---------- */
    function filterRow(attr, label, values) {
      values = [...new Set(values.filter(Boolean))]; if (values.length < 2) return '';
      return `<div class="flt" data-f="${attr}"><span class="flt-l">${label}</span><div class="flt-c"><button class="fchip on" data-v="*">Semua</button>${values.map(v => `<button class="fchip" data-v="${qa(v)}">${ESC(v)}</button>`).join('')}</div></div>`;
    }
    function applyFilter(root) {
      const act = {}; root.querySelectorAll('.flt').forEach(r => act[r.dataset.f] = r.querySelector('.fchip.on').dataset.v);
      let n = 0;
      const sIn = root.querySelector('.dl-search'), q = sIn ? sIn.value.trim().toLowerCase() : '';
      root.querySelectorAll('[data-kat]').forEach(it => {
        const ok = (!act.kat || act.kat === '*' || it.dataset.kat === act.kat) && (!act.jur || act.jur === '*' || it.dataset.jur === act.jur) && (!q || (it.dataset.q || '').includes(q));
        it.hidden = !ok; if (ok) { n++; it.classList.remove('fin'); void it.offsetWidth; it.classList.add('fin'); }
      });
      root.querySelectorAll('[data-group]').forEach(g => { g.hidden = !g.querySelector('[data-kat]:not([hidden])'); });   // sembunyikan kelompok yang kosong
      const e = root.querySelector('.flt-empty'); if (e) e.hidden = n > 0;
      const c = root.querySelector('.flt-count'); if (c) c.textContent = n + ' ditampilkan';
    }
    document.addEventListener('click', e => {
      const chip = e.target.closest('.fchip');
      if (chip) { const row = chip.closest('.flt'); row.querySelectorAll('.fchip').forEach(b => b.classList.toggle('on', b === chip)); applyFilter(chip.closest('[data-filterable]')); return; }
      const q = e.target.closest('.acc-q');
      if (q) { const it = q.parentElement, was = it.classList.contains('open'); it.parentElement.querySelectorAll('.acc-item.open').forEach(x => { x.classList.remove('open'); x.firstElementChild.setAttribute('aria-expanded', 'false'); }); if (!was) { it.classList.add('open'); q.setAttribute('aria-expanded', 'true'); } }
    });
    function renderFAQ() {
      const list = (PPDB.faq || []).filter(x => x && x.aktif !== false && x.q); if (!list.length) return '';
      const kat = x => x.kategori || 'Umum';
      return `<section class="section"><div class="wrap" style="max-width:860px" data-filterable>
        <div class="section-head"><div><span class="tag">Biaya &amp; beasiswa</span><h2 style="margin-top:8px">Pertanyaan yang Sering Diajukan</h2></div></div>
        ${filterRow('kat', 'Topik', list.map(kat))}
        <div class="acc">${list.map(x => `<div class="acc-item" data-kat="${qa(kat(x))}"><button class="acc-q" aria-expanded="false"><span>${ESC(x.q)}</span><i></i></button><div class="acc-a"><div><p>${ESC(x.a)}</p></div></div></div>`).join('')}</div>
        <p class="pp-muted" style="margin-top:16px">Belum menemukan jawabannya? <a href="#" onclick="openDaftar();return false" style="color:var(--accent);font-weight:700">Tanya panitia lewat WhatsApp</a>.</p>
      </div></section>`;
    }

    /* ---------- WHATSAPP MELAYANG + BOTTOM NAV ---------- */
    function initChrome() {
      const page = document.body.dataset.page || 'home';
      initChatbot();   // widget asisten virtual (js/chatbot.js)
      const it = (r, href, label, svg) => `<a href="${href}" class="${page === r ? 'on' : ''}${r === 'ppdb' ? ' hl' : ''}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${svg}</svg><span>${label}</span></a>`;
      const bn = document.createElement('nav'); bn.className = 'bnav'; bn.setAttribute('aria-label', 'Navigasi cepat');
      bn.innerHTML = it('home', 'index.html', 'Beranda', '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>')
        + it('jurusan', 'jurusan.html', 'Jurusan', '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11.500V16c0 1.500 2.700 3 6 3s6-1.500 6-3v-4.500"/>')
        + it('ppdb', 'ppdb.html', 'PPDB', '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>')
        + it('kontak', 'kontak.html', 'Kontak', '<path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2C9.400 21 3 14.600 3 6a2 2 0 0 1 2-2z"/>');
      document.body.appendChild(bn); document.body.classList.add('has-bnav');
      // Header mengecil saat digulir; top bar ikut tergulir keluar layar (navbar tetap menempel)
      const hd = document.querySelector('header.site'), tb = document.querySelector('.topbar');
      const setTb = () => document.documentElement.style.setProperty('--tb-h', (tb && tb.offsetHeight || 0) + 'px');
      setTb(); addEventListener('resize', setTb);
      const onScroll = () => hd.classList.toggle('scrolled', scrollY > 40); onScroll(); addEventListener('scroll', onScroll, { passive: true });
    }
    // Lanjut ke WhatsApp panitia; pertanyaan terakhir pengunjung (bila ada) ikut jadi pesan awal
    function waChat(pertanyaan) {
      const n = waNum(); if (!n) { alert('Nomor WhatsApp belum diisi. Isi lewat admin.html, menu Pengaturan Umum.'); return; }
      const awal = CFG.waSapaan || 'Halo, saya ingin bertanya tentang PPDB.';
      window.open('https://wa.me/' + n + '?text=' + encodeURIComponent(awal + (pertanyaan ? '\n\nPertanyaan saya: ' + pertanyaan : '')), '_blank', 'noopener');
    }

    /* ---------- PAGES ---------- */
    // GANTI BACKGROUND HOMEPAGE: background bagian hero diatur di CSS, cari ".hero" atau ketik "// GANTI BACKGROUND"
    /* ---------- KOMPONEN TATA LETAK ASIMETRIS ---------- */
    // Baris agenda: tanggal besar di kiri, judul di tengah, panah di kanan
    function agendaRow(k, attrs = '') {
      const m = String(k.tanggal || '').match(/^(\d{1,2})\s+(.+)$/);
      const day = m ? m[1] : '·', rest = m ? m[2] : (k.tanggal || '');
      const ex = String(k.excerpt || ''); const short = ex.length > 150 ? ex.slice(0, 150) + '…' : ex;
      return `<a class="agenda-row" ${attrs} href="${hrefOf('kegiatan/' + k.id)}"><time class="ag-date"><b>${day}</b><span>${rest}</span></time><div><h3>${k.title}</h3><p>${short}</p></div><span class="ag-arrow" aria-hidden="true">→</span></a>`;
    }
    // Baris jurusan zig-zag: foto bergantian kiri/kanan, kode jurusan besar sebagai watermark
    function jurRow(id, j, k) {
      const v = jurVisual(id, k);
      return `<article class="jur-row"><div class="jur-media"><div class="jsl-visual ${v.bg}">${v.icon}${photoOf(j, P.jurusan(id), j.name)}</div></div>
        <div class="jur-body"><span class="jur-code" aria-hidden="true">${j.singkatan}</span><span class="chip kode">${j.singkatan}</span><h2>${j.name}</h2><p>${j.tagline}</p>
        <ul class="plain">${(j.kompetensi || []).slice(0, 3).map(x => `<li>${x}</li>`).join('')}</ul>
        <button class="btn btn-navy" onclick="go('jurusan/${id}')">Lihat Detail Jurusan</button></div></article>`;
    }
    // Muncul pelan saat di-scroll (sekali saja); atribut dilepas setelah selesai agar transisi hover kartu tetap jalan
    function initReveal() {
      if (!('IntersectionObserver' in window) || REDUCED) return;
      const els = [...document.querySelectorAll('#app .section-head, #app .about-head, #app .about-list li, #app .card, #app .agenda-row, #app .jur-row, #app .testi, #app .box, #app .poster, #app .info-card, #app .acc-item')];
      document.documentElement.classList.add('js');
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const el = e.target; io.unobserve(el); el.classList.add('in'); setTimeout(() => el.removeAttribute('data-reveal'), 700); } }), { threshold: .12 });
      els.forEach((el, i) => { el.setAttribute('data-reveal', ''); el.style.setProperty('--i', i % 4); io.observe(el); });
    }

    function renderHome() {
      return `
  <section class="hero">
    <svg class="rays" viewBox="0 0 200 200"><g stroke="#FFC72C" stroke-width="2" opacity=".18">${Array.from({ length: 16 }).map((_, i) => `<line x1="100" y1="100" x2="${100 + 90 * Math.cos(i * Math.PI / 8)}" y2="${100 + 90 * Math.sin(i * Math.PI / 8)}"/>`).join('')}</g></svg>
    <div class="wrap">
      <div>
        <span class="tag" style="color:#FFC72C">${CFG.namaLengkap}</span>
        <h1>${CFG.heroJudul}</h1>
        <p class="lead">${CFG.heroDeskripsi}</p>
        <div class="cta">
          <button class="btn btn-gold" onclick="openDaftar()">Daftar PPDB ${PPDB.tahun}</button>
          <button class="btn btn-outline" onclick="go('jurusan')">Lihat Jurusan</button>
        </div>
      </div>
    </div>
  </section>

  <section class="statband"><div class="wrap">
    <div class="sb">${statNum(CFG.akreditasi)}<span>Akreditasi</span></div>
    <div class="sb">${statNum(CFG.statKerja || '90%')}<span>Lulusan Terserap Kerja</span></div>
    <div class="sb">${statNum(CFG.mitra)}<span>Mitra Industri</span></div>
    <div class="sb">${statNum(CFG.jumlahSiswa)}<span>Siswa Aktif</span></div>
    <div class="sb">${statNum(Object.keys(JURUSAN).length)}<span>Program Keahlian</span></div>
  </div></section>

  ${ppdbFeature()}

  ${renderMitra()}

  ${renderPosters()}

  <section class="section alt">
    <div class="wrap about">
      <div class="about-head"><span class="tag">Tentang kami</span><h2>Sekolah kejuruan yang tumbuh bersama industri</h2><p>Pendidikan yang memadukan kompetensi teknis, praktik langsung, dan nilai keislaman.</p><button class="btn btn-navy" onclick="go('profil')">Profil Sekolah</button></div>
      <ol class="about-list">
        <li><div><h3>Kurikulum Berbasis Industri</h3><p>Materi ajar disusun bersama mitra industri agar relevan dengan kebutuhan dunia kerja saat ini.</p></div></li>
        <li><div><h3>Guru Berpengalaman</h3><p>Tenaga pengajar profesional yang aktif mengikuti pelatihan dan sertifikasi kompetensi.</p></div></li>
        <li><div><h3>Fasilitas Praktik Lengkap</h3><p>Laboratorium dan bengkel praktik yang mendukung pembelajaran langsung sesuai jurusan.</p></div></li>
      </ol>
    </div>
  </section>

  ${renderVideo()}

  <section class="section">
    <div class="wrap">
      <div class="section-head"><div><span class="tag">Program keahlian</span><h2 style="margin-top:8px">${Object.keys(JURUSAN).length} Jurusan Unggulan</h2></div><button class="btn btn-navy" onclick="go('jurusan')">Semua Jurusan</button></div>
      ${renderJurusanSlider()}
    </div>
  </section>

  ${renderTestimoni()}

  <section class="section">
    <div class="wrap">
      <div class="section-head"><div><span class="tag">Prestasi terbaru</span><h2 style="margin-top:8px">Kebanggaan Sekolah</h2></div><button class="btn btn-navy" onclick="go('prestasi')">Semua Prestasi</button></div>
      <div class="feature-grid">
        ${PRESTASI.slice(0, 3).map(p => card('bg1', '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="2.2"><circle cx="24" cy="18" r="10"/><path d="M17 27l-4 13 11-6 11 6-4-13"/></svg>', p.title, p.desc.slice(0, 70) + '…', `<span class="chip">${p.tingkat}</span><span class="chip gold">${p.tahun}</span>`, `go('prestasi/${p.id}')`, photoOf(p, P.prestasi(p.id), p.title))).join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="section-head"><div><span class="tag">Kegiatan sekolah</span><h2 style="margin-top:8px">Dokumentasi Terbaru</h2></div><button class="btn btn-navy" onclick="go('kegiatan')">Semua Kegiatan</button></div>
      <div class="agenda">${KEGIATAN.slice(0, 4).map(k => agendaRow(k)).join('')}</div>
    </div>
  </section>

  <section class="section alt">
    <div class="wrap">
      <div class="section-head"><div><span class="tag">Ekstrakurikuler</span><h2 style="margin-top:8px">Kembangkan Minat & Bakat</h2></div><button class="btn btn-navy" onclick="go('ekskul')">Semua Ekskul</button></div>
      <div class="grid cols-3">
        ${EKSKUL.slice(0, 3).map(e => card('bg3', '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="2.2"><path d="M24 8l4.5 9.2 10.1 1.5-7.3 7.1 1.7 10-9-4.7-9 4.7 1.7-10-7.3-7.1 10.1-1.5z"/></svg>', e.name, e.desc.slice(0, 70) + '…', `<span class="chip">${e.jadwal}</span>`, `go('ekskul/${e.id}')`, photoOf(e, P.ekskul(e.id), e.name))).join('')}
      </div>
    </div>
  </section>`;
    }

    function renderProfil() {
      return `
  <section class="detail-hero"><div class="wrap"><span class="crumb" onclick="go('home')">← Beranda</span><h1>Profil Sekolah</h1><p class="sub">Mengenal lebih dekat SMK Islamiyah Ciledug</p></div></section>
  <section class="section alt">
    <div class="wrap">
      <div class="split">
        <div class="art">${photoOf({ foto: CFG.fotoProfil }, P.profil, 'Gedung sekolah')}<svg viewBox="0 0 120 120"><circle cx="60" cy="65" r="18" fill="#FFC72C"/><path d="M60 20c-10 13-10 19 0 28 10-9 10-15 0-28z" fill="#FFC72C"/><path d="M40 82c-4-8-4-14 0-20" stroke="#4FC3F7" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M80 82c4-8 4-14 0-20" stroke="#4FC3F7" stroke-width="3" fill="none" stroke-linecap="round"/></svg></div>
        <div>
          <span class="tag">Sejarah singkat</span>
          <h2 style="margin-top:8px">Berdiri untuk Mencetak Generasi Kejuruan yang Kompeten</h2>
          <p style="margin-top:14px">SMK Islamiyah Ciledug berdiri dengan komitmen menyelenggarakan pendidikan kejuruan yang memadukan kompetensi teknis dan nilai keislaman. Sejak awal berdiri, sekolah terus mengembangkan program keahlian yang relevan dengan kebutuhan dunia usaha dan dunia industri di sekitar Ciledug dan sekitarnya.</p>
          <div class="stat-row">
            <div class="stat"><b>${CFG.akreditasi}</b><span>Akreditasi</span></div>
            <div class="stat"><b>${CFG.jumlahSiswa}</b><span>Siswa Aktif</span></div>
            <div class="stat"><b>${CFG.jumlahGuru}</b><span>Guru dan Tenaga Pendidik</span></div>
            <div class="stat"><b>${Object.keys(JURUSAN).length}</b><span>Program Keahlian</span></div>
            <div class="stat"><b>${CFG.alumni}</b><span>Alumni Bekerja</span></div>
            <div class="stat"><b>${CFG.mitra}</b><span>Mitra Industri</span></div>
          </div>
          ${CFG.akreditasiKet ? `<p class="akr-note"><b style="color:var(--head)">Akreditasi ${CFG.akreditasi}:</b> ${CFG.akreditasiKet}</p>` : ''}
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="split rev">
        <div>
          <span class="tag">Visi & misi</span>
          <h2 style="margin-top:8px">Arah dan Tujuan Pendidikan Kami</h2>
          ${CFG.visi ? `<p style="margin-top:14px"><b style="color:var(--head)">Visi:</b> ${CFG.visi}</p>` : ''}
          ${(CFG.misi && CFG.misi.length) ? `<p style="margin-top:14px"><b style="color:var(--head)">Misi:</b></p>
          <ul class="plain" style="margin-top:10px">${CFG.misi.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}
        </div>
        <div class="art">${photoOf({ foto: CFG.fotoVisi }, P.profilVisi, 'Visi dan misi sekolah')}<svg viewBox="0 0 120 120"><rect x="20" y="30" width="80" height="60" rx="6" fill="none" stroke="#FFC72C" stroke-width="3"/><path d="M20 46h80" stroke="#4FC3F7" stroke-width="3"/><circle cx="35" cy="38" r="3" fill="#FFC72C"/><circle cx="45" cy="38" r="3" fill="#FFC72C"/></svg></div>
      </div>
    </div>
  </section>
  <section class="section alt">
    <div class="wrap">
      <span class="tag">Fasilitas sekolah</span>
      <h2 style="margin-top:8px; margin-bottom:26px">Lingkungan Belajar yang Mendukung</h2>
      <div class="grid cols-3">
        ${['Laboratorium Komputer & Jaringan', 'Studio Desain Multimedia', 'Bengkel Praktik Otomotif', 'Perpustakaan Digital', 'Masjid Sekolah', 'Lapangan Olahraga'].map(f => `<div class="box"><h3 style="font-size:15.5px">${f}</h3></div>`).join('')}
      </div>
      <div style="margin-top:34px; text-align:center"><button class="btn btn-navy" onclick="go('home')">Kembali ke Beranda</button></div>
    </div>
  </section>`;
    }

    function renderJurusanList() {
      return `
  <section class="detail-hero"><div class="wrap"><span class="crumb" onclick="go('home')">← Beranda</span><h1>Program Keahlian</h1><p class="sub">Pilih jurusan untuk melihat detail lengkap kompetensi dan prospek karier</p></div></section>
  <section class="section alt">
    <div class="wrap">
      <div class="jur-list">${Object.entries(JURUSAN).map(([id, j], k) => jurRow(id, j, k)).join('')}</div>
    </div>
  </section>`;
    }

    function renderJurusanDetail(id) {
      const j = JURUSAN[id]; if (!j) return renderJurusanList();
      return `
  <section class="detail-hero"><div class="wrap"><span class="crumb" onclick="go('jurusan')">← Jurusan</span><h1>${j.name}</h1><p class="sub">${j.tagline}</p></div></section>
  <section class="section alt" style="padding-top:20px">
    <div class="wrap">
      <div class="info-grid">
        <div class="info-card"><b>Kode Jurusan</b><span>${j.singkatan}</span></div>
        <div class="info-card"><b>Durasi</b><span>3 Tahun</span></div>
        <div class="info-card"><b>Sertifikasi</b><span>Uji Kompetensi</span></div>
        <div class="info-card"><b>Jenjang</b><span>SMK Kelas X–XII</span></div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="cover">${photoOf(j, P.jurusan(id), j.name)}</div>
      <p style="font-size:15.5px; max-width:760px; margin-bottom:34px">${j.desc}</p>
      <div class="two-col">
        <div class="box"><h3>Kompetensi yang Dipelajari</h3><ul class="plain">${j.kompetensi.map(k => `<li>${k}</li>`).join('')}</ul></div>
        <div class="box"><h3>Fasilitas & Praktik</h3><ul class="plain">${j.fasilitas.map(k => `<li>${k}</li>`).join('')}</ul>${galeriOf(j, n => P.jurusanGaleri(id, n), GALERI_JUMLAH.jurusan, j.name)}</div>
      </div>
      <div class="two-col" style="margin-top:22px">
        <div class="box"><h3>Kegiatan Jurusan</h3><ul class="plain">${j.kegiatan.map(k => `<li>${k}</li>`).join('')}</ul></div>
        <div class="box"><h3>Prospek Karier</h3><div class="meta" style="display:flex; flex-wrap:wrap; gap:8px">${j.karier.map(k => `<span class="chip gold">${k}</span>`).join('')}</div></div>
      </div>
      <div style="margin-top:34px; display:flex; gap:12px; flex-wrap:wrap"><button class="btn btn-navy" onclick="go('jurusan')">← Semua Jurusan</button><button class="btn btn-gold" onclick="go('kontak')">Tanya Info Pendaftaran</button></div>
    </div>
  </section>`;
    }

    function renderPrestasiList() {
      return `
  <section class="detail-hero"><div class="wrap"><span class="crumb" onclick="go('home')">← Beranda</span><h1>Prestasi Sekolah</h1><p class="sub">Capaian siswa dan sekolah di berbagai ajang kompetisi</p></div></section>
  <section class="section alt">
    <div class="wrap" data-filterable>
      ${filterRow('kat', 'Kategori', PRESTASI.map(p => p.kategori))}${filterRow('jur', 'Jurusan', PRESTASI.map(p => p.jur))}
      <p class="flt-count"></p>
      <div class="grid cols-3">
        ${PRESTASI.map(p => `<div class="fiw" data-kat="${qa(p.kategori || 'Umum')}" data-jur="${qa(p.jur || 'Umum')}">` + card('bg1', '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="2.2"><circle cx="24" cy="18" r="10"/><path d="M17 27l-4 13 11-6 11 6-4-13"/></svg>', p.title, p.desc.slice(0, 64) + '…', `<span class="chip">${p.tingkat}</span><span class="chip gold">${p.tahun}</span>`, `go('prestasi/${p.id}')`, photoOf(p, P.prestasi(p.id), p.title)) + '</div>').join('')}
      </div>
      <p class="flt-empty" hidden>Belum ada prestasi pada filter ini.</p>
    </div>
  </section>`;
    }

    function renderPrestasiDetail(id) {
      const p = PRESTASI.find(x => x.id == id); if (!p) return renderPrestasiList();
      return `
  <section class="detail-hero"><div class="wrap"><span class="crumb" onclick="go('prestasi')">← Prestasi</span><h1>${p.title}</h1><p class="sub">${p.kategori} · Jurusan ${p.jur}</p></div></section>
  <section class="section alt" style="padding-top:20px">
    <div class="wrap">
      <div class="info-grid">
        <div class="info-card"><b>Kategori</b><span>${p.kategori}</span></div>
        <div class="info-card"><b>Tingkat</b><span>${p.tingkat}</span></div>
        <div class="info-card"><b>Tahun</b><span>${p.tahun}</span></div>
        <div class="info-card"><b>Jurusan</b><span>${p.jur}</span></div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="cover" style="max-width:760px">${photoOf(p, P.prestasi(p.id), p.title)}</div>
      <div class="box" style="max-width:760px"><h3>Deskripsi Prestasi</h3><p style="margin-top:10px">${p.desc} Pencapaian ini menjadi motivasi bagi siswa lain untuk terus mengasah kemampuan dan berani berkompetisi di berbagai ajang, baik tingkat kota, provinsi, maupun nasional.</p></div>
      <div style="margin-top:30px"><button class="btn btn-navy" onclick="go('prestasi')">← Semua Prestasi</button></div>
    </div>
  </section>`;
    }

    function renderEkskulList() {
      return `
  <section class="detail-hero"><div class="wrap"><span class="crumb" onclick="go('home')">← Beranda</span><h1>Ekstrakurikuler</h1><p class="sub">Wadah pengembangan minat dan bakat siswa di luar jam akademik</p></div></section>
  <section class="section alt">
    <div class="wrap">
      <div class="grid cols-3">
        ${EKSKUL.map(e => card('bg3', '<svg viewBox="0 0 48 48" fill="none" stroke="#fff" stroke-width="2.2"><path d="M24 8l4.5 9.2 10.1 1.5-7.3 7.1 1.7 10-9-4.7-9 4.7 1.7-10-7.3-7.1 10.1-1.5z"/></svg>', e.name, e.desc.slice(0, 64) + '…', `<span class="chip">${e.jadwal}</span>`, `go('ekskul/${e.id}')`, photoOf(e, P.ekskul(e.id), e.name))).join('')}
      </div>
    </div>
  </section>`;
    }

    function renderEkskulDetail(id) {
      const e = EKSKUL.find(x => x.id == id); if (!e) return renderEkskulList();
      return `
  <section class="detail-hero"><div class="wrap"><span class="crumb" onclick="go('ekskul')">← Ekstrakurikuler</span><h1>${e.name}</h1><p class="sub">Jadwal: ${e.jadwal}</p></div></section>
  <section class="section alt">
    <div class="wrap">
      <div class="cover">${photoOf(e, P.ekskul(e.id), e.name)}</div>
      <div class="two-col">
        <div class="box"><h3>Tentang Kegiatan</h3><p style="margin-top:10px">${e.desc} Kegiatan ini terbuka untuk seluruh siswa dari seluruh jurusan dan dibimbing langsung oleh pembina yang berpengalaman di bidangnya.</p></div>
        <div class="box"><h3>Galeri Kegiatan</h3>${galeriOf(e, n => P.ekskulGaleri(e.id, n), GALERI_JUMLAH.ekskul, e.name)}</div>
      </div>
      <div style="margin-top:30px"><button class="btn btn-navy" onclick="go('ekskul')">← Semua Ekskul</button></div>
    </div>
  </section>`;
    }

    // Jurusan kegiatan: pakai isian admin; kalau kosong, dideteksi dari singkatan jurusan di judul/ringkasan (TKJ, DKV, dst)
    function jurOfKegiatan(k) {
      if (k.jur) return k.jur;
      const s = ` ${k.title} ${k.excerpt} `.toUpperCase();
      const hit = Object.values(JURUSAN).find(j => new RegExp('[^A-Z]' + String(j.singkatan).toUpperCase() + '[^A-Z]').test(s));
      return hit ? hit.singkatan : 'Umum';
    }
    function renderKegiatanList() {
      return `
  <section class="detail-hero"><div class="wrap"><span class="crumb" onclick="go('home')">← Beranda</span><h1>Kegiatan Sekolah</h1><p class="sub">Berita dan dokumentasi kegiatan siswa, guru, dan sekolah</p></div></section>
  <section class="section alt">
    <div class="wrap" style="max-width:920px" data-filterable>
      ${filterRow('kat', 'Kategori', KEGIATAN.map(k => k.kategori || 'Umum'))}${filterRow('jur', 'Jurusan', KEGIATAN.map(jurOfKegiatan))}
      <p class="flt-count"></p>
      <div class="agenda">${KEGIATAN.map(k => agendaRow(k, `data-kat="${qa(k.kategori || 'Umum')}" data-jur="${qa(jurOfKegiatan(k))}"`)).join('')}</div>
      <p class="flt-empty" hidden>Belum ada kegiatan pada filter ini.</p>
    </div>
  </section>`;
    }

    function renderKegiatanDetail(id) {
      const k = KEGIATAN.find(x => x.id == id); if (!k) return renderKegiatanList();
      return `
  <section class="detail-hero"><div class="wrap"><span class="crumb" onclick="go('kegiatan')">← Kegiatan</span><h1>${k.title}</h1><p class="sub">${k.tanggal}</p></div></section>
  <section class="section alt" style="padding-top:20px">
    <div class="wrap" style="max-width:760px">
      <div class="news-thumb" style="height:260px; margin-bottom:24px">${photoOf(k, P.kegiatan(k.id), k.title)}</div>
      <p style="font-size:15.5px">${k.content}</p>
      <h3 style="margin-top:30px; margin-bottom:14px; font-size:17px">Galeri Foto</h3>
      ${galeriOf(k, n => P.kegiatanGaleri(k.id, n), GALERI_JUMLAH.kegiatan, k.title)}
      <div style="margin-top:30px"><button class="btn btn-navy" onclick="go('kegiatan')">← Semua Kegiatan</button></div>
    </div>
  </section>`;
    }

    function renderKontak() {
  return `
<section class="detail-hero"><div class="wrap"><span class="crumb" onclick="go('home')">← Beranda</span><h1>Hubungi Kami</h1><p class="sub">Kami siap membantu pertanyaan seputar pendaftaran dan informasi sekolah</p></div></section>
<section class="section alt">
  <div class="wrap">
    <div class="contact-grid">
      <div>
        <div class="contact-item"><div class="icon-badge">${ic.pin}</div><div><h3 style="font-size:15.5px">Alamat</h3><p style="font-size:14px; margin-top:4px">${CFG.alamat}</p></div></div>
        <div class="contact-item"><div class="icon-badge">${ic.phone}</div><div><h3 style="font-size:15.5px">Telepon</h3><p style="font-size:14px; margin-top:4px">${CFG.telepon}</p></div></div>
        <div class="contact-item"><div class="icon-badge">${ic.mail}</div><div><h3 style="font-size:15.5px">Email</h3><p style="font-size:14px; margin-top:4px">${CFG.email}</p></div></div>
        <div class="contact-item"><div class="icon-badge">${ic.clock}</div><div><h3 style="font-size:15.5px">Jam Operasional</h3><p style="font-size:14px; margin-top:4px">${CFG.jam}</p></div></div>
        <div style="display:flex; gap:10px; margin-top:20px"><span class="chip">Instagram</span><span class="chip">YouTube</span><span class="chip">WhatsApp</span></div>
        <button class="btn btn-gold" style="margin-top:24px" onclick="openWA()">Hubungi via WhatsApp</button>
      </div>
      <div class="map-box" style="padding: 0; overflow: hidden; height: 100%; min-height: 280px;">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.274843031032!2d106.70442109999999!3d-6.227448799999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69fa190de1bca5%3A0xb3a7a35fa4c7636d!2sYayasan%20Pendidikan%20Dan%20Pembangunan%20Umat%20Islam%20(Yppui)!5e0!3m2!1sen!2sus!4v1790690980635!5m2!1sen!2sus" 
          width="100%" 
          height="100%" 
          style="border:0; width: 100%; height: 100%; min-height: 280px;" 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="strict-origin-when-cross-origin">
        </iframe>
      </div>
    </div>
  </div>
</section>`;
}
  
