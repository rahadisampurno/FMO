import { useEffect, useRef, useState } from 'react';
import { FaInstagram, FaTiktok, FaWhatsapp, FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6';
import { HiArrowDownRight, HiArrowUpRight, HiCheck, HiChevronDown, HiOutlineXMark } from 'react-icons/hi2';

const workflow = [
  ['01', 'Konsultasi awal', 'Bersama Customer Service.', 10, 10],
  ['02', 'Pemilihan paket', 'Titik awal yang paling relevan.', 40, 10],
  ['03', 'Private session', 'Booking sesi konsultasi personal.', 70, 10],
  ['04', 'Investment advisor', 'Konsultasi kebutuhan dan investasi.', 90, 28],
  ['05', 'Penentuan vendor', 'Kurasi berdasarkan gaya dan prioritas.', 70, 43],
  ['06', 'Penyusunan quotation', 'Rincian transparan per item.', 40, 43],
  ['07', 'Invoicing', 'Dokumen resmi dan terarah.', 10, 43],
  ['08', 'Down payment', 'Mengunci jadwal vendor pilihan.', 10, 60],
  ['09', "Vendor's booked", 'Seluruh vendor utama secured.', 25, 76],
  ['10', 'Pendalaman konsep', 'Bersama Wedding Specialist.', 25, 88],
];

const preparation = [
  ['Bride & Groom Meeting', 'Menyelaraskan visi, prioritas, dan keputusan bersama.'],
  ['Attire Fitting', 'Koordinasi ukuran, fitting, dan finalisasi busana.'],
  ['Moodboard Photo & Video', 'Menyusun arah visual untuk dokumentasi hari bahagia.'],
  ['Moodboard Decoration', 'Menerjemahkan karakter pasangan menjadi ruang perayaan.'],
  ['Food Tasting', 'Kurasi menu dan pengalaman jamuan untuk para tamu.'],
  ['Family Meeting', 'Menyatukan kebutuhan keluarga dan detail protokoler.'],
  ['Technical Meeting', 'Sinkronisasi seluruh vendor, venue, dan alur acara.'],
  ['Wedding Day', 'Satu tim, satu pasangan, dan total focus sepanjang hari.'],
];

const guardianRoles = {
  family: [
    ['Stage Manager', 'Mengarahkan pasangan, keluarga, dan pelaku acara di setiap rangkaian hingga sesi foto pelaminan.'],
    ["Family LO's", 'Menjadi penghubung utama antara keluarga besar, panitia keluarga, dan seluruh vendor.'],
    ['Checker', 'Memastikan jumlah tamu, suvenir, undangan VIP, hidangan, dan detail hitungan acara tetap akurat.'],
    ['Catering Checker', 'Mengantar dan mengatur tamu VIP saat bersalaman, berfoto, hingga menuju area bersantap.'],
    ['Queue Coordinator', 'Menjaga antrean salam dan foto tetap rapi, lancar, dan tidak menumpuk.'],
    ['VIP Concierge', 'Mendampingi tamu VIP menuju pelaminan dan area khusus dengan pelayanan personal.'],
  ],
  vendors: [
    ['Bride Assistant', 'Menjadi pendamping pribadi yang membantu kebutuhan pengantin dan menjaga ketenangan sepanjang acara.'],
    ['Frontliner', 'Menjadi pusat informasi di area penerima tamu sekaligus membantu tim usher mengatur kedatangan.'],
    ['Area Controller', 'Memastikan pelaminan, buffet, area duduk, dan seluruh zona acara selalu tertata.'],
    ['Photo Registrator', 'Mengatur antrean tamu yang ingin berfoto bersama agar sesi dokumentasi tersusun rapi.'],
    ['MC Advisor', 'Memastikan konsep dan alur acara dipahami MC secara utuh sebelum eksekusi.'],
    ['Content Creator', 'Mendokumentasikan momen-momen acara dalam konten real-time yang tetap selaras dengan cerita pernikahanmu.'],
  ],
};

const otherServices = [
  { id: '01', title: 'Engagement Event', label: 'Engagement', image: '/assets/page_20_img_1.jpeg', alt: 'Pasangan merayakan pertunangan', copy: 'Pengarahan acara lamaran atau engagement yang hangat, personal, dan memorable.' },
  { id: '02', title: 'Pengajian & Siraman', label: 'Pengajian · Siraman', image: '/assets/page_20_img_2.jpeg', alt: 'Prosesi pengajian dan siraman menjelang pernikahan', copy: 'Acara pra-nikah yang tertata, khidmat, dan penuh makna sesuai adat serta kebutuhan keluarga.' },
  { id: '03', title: 'After Party', label: 'After party', image: '/assets/page_20_img_3.jpeg', alt: 'Pasangan menikmati after party pernikahan', copy: 'Perayaan setelah akad dan resepsi untuk menikmati momen yang lebih lepas bersama orang-orang terdekat.' },
  { id: '04', title: 'Pre-wedding Companion', label: 'Pre-wedding', image: '/assets/page_20_img_4.jpeg', alt: 'Pasangan menjalani sesi pre-wedding di alam terbuka', copy: 'Pendamping pribadi yang membantu kebutuhan dan keputusan kecil agar sesi pre-wedding terasa lebih ringan.' },
];

const selectedMoments = [
  { id: '01', title: 'Intimate celebration', label: 'Personal & meaningful', image: '/assets/promise-couple-hd.webp', alt: 'Pasangan merayakan momen pertunangan yang intim', copy: 'Perayaan yang mengutamakan kedekatan, detail personal, dan pengalaman hangat bersama orang-orang terdekat.' },
  { id: '02', title: 'Classic wedding', label: 'Timeless & composed', image: '/assets/hero-wedding-hd.webp', alt: 'Pasangan pengantin FMO dalam perayaan bernuansa klasik', copy: 'Rangkaian hari bahagia yang tertata rapi dengan visual klasik, alur tenang, dan koordinasi yang menyeluruh.' },
  { id: '03', title: 'Joyful gathering', label: 'Warm & expressive', image: '/assets/closing-couple-hd.webp', alt: 'Pasangan pengantin menikmati perayaan bersama tamu', copy: 'Perayaan penuh energi yang tetap terasa personal karena setiap momen dan perpindahan acara telah dipersiapkan.' },
];

const packageComparison = [
  ['Guest scale', 'Up to 100', 'Up to 350', 'Up to 500', 'Up to 1.000'],
  ['Best for', 'Intimate moments', 'Signature celebration', 'Larger celebration', 'Grand-scale event'],
  ['Planning support', 'Essential', 'Full assistance', 'End-to-end', 'Full specialist team'],
  ['Vendor coordination', 'Curated essentials', 'Curated vendor team', 'Multi-vendor', 'Multi-vendor operation'],
  ['Wedding day management', 'Included', 'Included', 'Included', 'Included'],
];

const legalContent = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'Kami menghargai privasi setiap calon pasangan dan pengunjung website FMO.',
    sections: [
      ['Informasi yang diproses', 'Informasi kota, jenis acara, tanggal, venue, dan konteks konsultasi hanya digunakan untuk menyiapkan percakapan dengan Wedding Specialist.'],
      ['Penyimpanan lokal', 'Website dapat menyimpan preferensi musik dan status halaman pembuka pada perangkatmu agar pengalaman kunjungan terasa konsisten.'],
      ['WhatsApp dan layanan eksternal', 'Saat memilih melanjutkan ke WhatsApp, informasi yang kamu konfirmasi akan diteruskan melalui layanan WhatsApp dan tunduk pada kebijakan layanan tersebut.'],
      ['Kontrol pengguna', 'Kamu dapat menghapus data lokal website melalui pengaturan browser serta menghubungi FMO untuk pertanyaan terkait informasi konsultasi.'],
    ],
  },
  terms: {
    title: 'Terms of Use',
    intro: 'Website ini memberikan gambaran awal mengenai pendekatan, layanan, dan proses kerja FMO Wedding Specialist.',
    sections: [
      ['Informasi layanan', 'Rincian paket, vendor, jadwal, dan ketersediaan akan dikonfirmasi kembali melalui sesi konsultasi dan dokumen penawaran resmi.'],
      ['Materi visual', 'Foto dan materi visual digunakan untuk menggambarkan pengalaman serta karakter layanan FMO. Penggunaan kembali tanpa izin tidak diperkenankan.'],
      ['Perencanaan dan pembayaran', 'Ruang lingkup pekerjaan, termin pembayaran, perubahan, serta pembatalan mengikuti kesepakatan tertulis yang disetujui bersama client.'],
      ['Pembaruan', 'Informasi pada website dapat diperbarui untuk menyesuaikan layanan, ketersediaan, dan peningkatan pengalaman pengguna.'],
    ],
  },
};

function trackEvent(name, detail = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...detail });
  window.dispatchEvent(new CustomEvent('fmo:analytics', { detail: { name, ...detail } }));
}

const packageOptions = [
  { id: '100', guests: '100', title: 'Intimate', note: 'Hangat, personal, dan penuh makna.', features: ['Venue & catering', 'Decoration & styling', 'Documentation', 'Wedding organizer'] },
  { id: '350', guests: '350', title: 'Signature', note: 'Perayaan lengkap dengan detail yang terasa personal.', features: ['Curated vendor team', 'Full planning assistance', 'Guest experience', 'Wedding day management'], featured: true },
  { id: '500', guests: '500', title: 'Celebration', note: 'Dirancang untuk perayaan besar yang tetap terasa intim.', features: ['Venue & catering', 'Custom decoration', 'Entertainment', 'End-to-end coordination'] },
  { id: '1000', guests: '1.000', title: 'Grand', note: 'Skala besar, sistematis, dan tetap effortless.', features: ['Multi-vendor operation', 'Guest flow management', 'Technical production', 'Full specialist team'] },
];

const packageNavOptions = [['100', '100 pax'], ['350', '350 pax'], ['500', '500 pax'], ['1000', '1000 pax'], ['Akad di Masjid', 'Akad di Masjid']];

const faqs = [
  ['Apakah aku bisa memilih vendor di luar list FMO?', 'Bisa. Pernikahan ini tentang ceritamu. Di private consultation session, kami akan membantu kurasi, kalkulasi, serta menjabarkan setiap selisih harga secara transparan—tanpa biaya tersembunyi.'],
  ['Bisakah paket ditambah layanan khusus?', 'Tentu. Kirab adat, photobooth, wedding effect, atau kebutuhan personal lain dapat diracik sesuai konsep dan prioritas perayaanmu.'],
  ['Bagaimana sistem termin pembayarannya?', 'Kami menyediakan Flexi Installment Plan hingga 4 kali pembayaran dan Smart Express Plan dalam 2 kali pembayaran. Skema akan disesuaikan dengan timeline dan cash flow-mu.'],
  ['Ke mana pembayaran dilakukan?', 'Kamu dapat memilih one-gate payment melalui manajemen FMO atau direct payment ke vendor. Semua pembayaran selalu dilengkapi invoice resmi.'],
  ['Apakah FMO menerima dua acara dalam sehari?', 'Tidak. Prinsip kami adalah 1 Day, 1 Client. Seluruh energi dan fokus tim inti didedikasikan hanya untuk satu pasangan pada hari tersebut.'],
  ['Apakah FMO melayani di luar Bandung?', 'Ya. Ceritakan kota dan rencana venue-mu saat konsultasi; tim kami akan memetakan kebutuhan perjalanan serta operasionalnya.'],
];

const featureSlides = [
  {
    id: 'team',
    image: '/assets/fmo-team-restored.webp',
    width: 1122,
    height: 1402,
    alt: 'Tim inti FMO Wedding Specialist',
    caption: 'The people behind every meaningful celebration',
    eyebrow: 'Meet the people behind the calm',
    title: 'Ten years of experience,',
    accent: 'one devoted team.',
    copy: 'Dari perencanaan awal hingga momen terakhir di hari-H, tim kami bekerja sebagai satu kesatuan—rapi di belakang layar, hangat saat mendampingi.',
    stats: [['10+', 'core specialists\nin one team']],
  },
  {
    id: 'promise',
    image: '/assets/fmo-prologue-restored.webp',
    width: 1023,
    height: 1537,
    alt: 'Pengantin FMO dalam balutan veil membawa buket bunga',
    caption: 'Your only VIP · one day, one client',
    eyebrow: 'The FMO prologue',
    title: 'Hari bahagiamu terlalu berharga',
    accent: 'untuk dirayakan dengan cemas.',
    copy: 'Karena itu kami tidak menerima double booking. Seluruh energi tim hadir untuk satu pasangan, dengan perencanaan transparan dan pilihan pembayaran yang tetap kamu kendalikan.',
    stats: [['1:1', 'one day · one client'], ['100%', 'transparent planning']],
  },
];

const chatIntro = { sender: 'bot', text: 'Halo Kak! Selamat atas rencana hari bahagianya. 🤍\n\nKira-kira, pernikahannya akan dilaksanakan di daerah mana?' };

function Header({ onConsult, onPackage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [packagesOpen, setPackagesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 32); setPackagesOpen(false); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-lock', menuOpen);
    return () => document.body.classList.remove('menu-lock');
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && setPackagesOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const navigate = () => {
    document.body.classList.remove('menu-lock');
    setMenuOpen(false);
    setPackagesOpen(false);
  };

  const openPackage = (value) => {
    document.body.classList.remove('menu-lock');
    setMenuOpen(false);
    setPackagesOpen(false);
    onPackage(value);
  };

  const togglePackages = () => {
    if (window.matchMedia('(max-width: 760px)').matches) {
      document.body.classList.add('menu-lock');
      setMenuOpen(true);
    }
    setPackagesOpen((value) => !value);
  };

  return (
    <header className={`site-header ${scrolled || menuOpen ? 'site-header--scrolled' : ''} ${menuOpen ? 'site-header--menu-open' : ''}`}>
      <a className="brand" href="#home" onClick={navigate} aria-label="FMO Wedding Specialist home">
        <img src="/logo.webp" alt="FMO Wedding Specialist" width="2480" height="1748" />
      </a>
      <button className={`menu-toggle ${menuOpen ? 'menu-toggle--open' : ''}`} type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label="Buka menu navigasi">
        <span /><span />
      </button>
      <nav className={menuOpen ? 'main-nav main-nav--open' : 'main-nav'} aria-label="Navigasi utama">
        <a href="#about" onClick={navigate}>Tentang</a>
        <div className="nav-packages">
          <button className="nav-packages__trigger" type="button" onClick={togglePackages} aria-expanded={packagesOpen} aria-haspopup="menu">Packages <HiChevronDown /></button>
          <div className={`nav-packages__menu ${packagesOpen ? 'is-open' : ''}`} role="menu">
            {packageNavOptions.map(([value, label]) => <button type="button" role="menuitem" onClick={() => openPackage(value)} key={value}>{label}</button>)}
          </div>
        </div>
        <a href="#workflow" onClick={navigate}>Workflow</a>
        <a href="#specialists" onClick={navigate}>Specialists</a>
        <a href="#stories" onClick={navigate}>Stories</a>
        <button type="button" className="nav-cta" onClick={() => { setMenuOpen(false); onConsult(); }}>Konsultasi <HiArrowUpRight /></button>
      </nav>
    </header>
  );
}

function AudioControl() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [entered, setEntered] = useState(() => window.sessionStorage.getItem('fmo-entered') === '1');
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('entry-lock', !entered);
    return () => document.body.classList.remove('entry-lock');
  }, [entered]);

  useEffect(() => {
    if (!entered || window.localStorage.getItem('fmo-music') !== 'on') return;
    audioRef.current?.play().catch(() => setPlaying(false));
  }, [entered]);

  const enterWebsite = async () => {
    if (leaving) return;
    try {
      await audioRef.current?.play();
      window.localStorage.setItem('fmo-music', 'on');
    } catch { window.localStorage.setItem('fmo-music', 'off'); }
    window.sessionStorage.setItem('fmo-entered', '1');
    trackEvent('website_enter', { music: audioRef.current?.paused ? 'off' : 'on' });
    setLeaving(true);
    window.setTimeout(() => setEntered(true), 650);
  };

  const toggle = async () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        window.localStorage.setItem('fmo-music', 'on');
        trackEvent('music_toggle', { state: 'on' });
      } catch { return; }
    } else {
      audioRef.current.pause();
      window.localStorage.setItem('fmo-music', 'off');
      trackEvent('music_toggle', { state: 'off' });
    }
  };

  return (
    <>
      <audio ref={audioRef} loop src="/music/Sebusur%20Pelangi.mp3" preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      {!entered && (
        <div className={`entry-screen ${leaving ? 'entry-screen--leaving' : ''}`} role="dialog" aria-modal="true" aria-label="Selamat datang di FMO Wedding Specialist">
          <div className="entry-screen__content">
            <img src="/logo.webp" alt="FMO Wedding Specialist" width="410" height="289" />
            <button type="button" onClick={enterWebsite}>Enter Website</button>
          </div>
        </div>
      )}
      {entered && (
        <button className="audio-control" type="button" onClick={toggle} aria-label={playing ? 'Hentikan musik' : 'Putar musik'}>
          {playing ? <FaVolumeHigh /> : <FaVolumeXmark />}
          <span>{playing ? 'Music on' : 'Music off'}</span>
        </button>
      )}
    </>
  );
}

function PackageCard({ item, onOpen }) {
  return (
    <article className={`package-card ${item.featured ? 'package-card--featured' : ''}`}>
      {item.featured && <span className="package-card__badge">Most selected</span>}
      <p className="package-card__kicker">Up to <strong>{item.guests}</strong> guests</p>
      <h3>{item.title}</h3>
      <p className="package-card__note">{item.note}</p>
      <ul>{item.features.map((feature) => <li key={feature}><HiCheck /> {feature}</li>)}</ul>
      <button type="button" onClick={() => onOpen(item.id)}>Explore package <HiArrowUpRight /></button>
    </article>
  );
}

function PackageComparison({ onOpen }) {
  return (
    <div className="package-comparison" aria-labelledby="package-comparison-title">
      <div className="package-comparison__heading"><div><p className="eyebrow eyebrow--dark">Compare at a glance</p><h3 id="package-comparison-title">Temukan titik awal yang paling relevan.</h3></div><p>Setiap paket tetap dapat dipersonalisasi melalui private consultation bersama tim FMO.</p></div>
      <div className="package-comparison__scroll" tabIndex="0" aria-label="Tabel perbandingan paket, dapat digulir horizontal">
        <table>
          <caption className="sr-only">Perbandingan empat paket FMO berdasarkan kapasitas dan cakupan pendampingan</caption>
          <thead><tr><th scope="col">Focus</th>{packageOptions.map((item) => <th scope="col" key={item.id}>{item.title}<button type="button" onClick={() => onOpen(item.id)}>View package <HiArrowUpRight /></button></th>)}</tr></thead>
          <tbody>{packageComparison.map(([label, ...values]) => <tr key={label}><th scope="row">{label}</th>{values.map((value, index) => <td key={`${label}-${packageOptions[index].id}`}>{label === 'Wedding day management' && <HiCheck aria-hidden="true" />} {value}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}

function SelectedMoments({ onConsult }) {
  return (
    <section className="selected-moments" id="real-weddings">
      <div className="shell">
        <div className="section-heading"><div><p className="eyebrow eyebrow--dark">Selected celebrations</p><h2>Moments with meaning,<br /><em>planned with intention.</em></h2></div><p>Setiap perayaan memiliki skala dan karakter berbeda. Yang tetap sama adalah perhatian pada detail, alur yang tenang, dan pengalaman yang terasa personal.</p></div>
        <div className="moment-grid">{selectedMoments.map((moment, index) => <article className={index === 1 ? 'moment-card moment-card--wide' : 'moment-card'} key={moment.id}><div className="moment-card__image"><img src={moment.image} alt={moment.alt} loading="lazy" decoding="async" width="900" height="1100" /></div><div className="moment-card__copy"><span>{moment.id} · {moment.label}</span><h3>{moment.title}</h3><p>{moment.copy}</p></div></article>)}</div>
        <div className="selected-moments__cta"><p>Sudah punya gambaran suasana yang ingin diwujudkan?</p><button type="button" className="button button--forest" onClick={() => onConsult('Wedding inspiration')}>Ceritakan inspirasimu <HiArrowUpRight /></button></div>
      </div>
    </section>
  );
}

function LegalModal({ type, onClose }) {
  const content = legalContent[type];

  useEffect(() => {
    if (!content) return undefined;
    const onKey = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.classList.add('modal-lock');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('modal-lock');
    };
  }, [content, onClose]);

  if (!content) return null;
  return (
    <div className="legal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="legal-modal" role="dialog" aria-modal="true" aria-labelledby="legal-title">
        <header><div><span>FMO Wedding Specialist</span><h2 id="legal-title">{content.title}</h2></div><button type="button" onClick={onClose} aria-label={`Tutup ${content.title}`} autoFocus><HiOutlineXMark /></button></header>
        <div className="legal-modal__body"><p className="legal-modal__intro">{content.intro}</p>{content.sections.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}<small>Terakhir diperbarui: Agustus 2026. Dokumen final dapat disesuaikan kembali setelah informasi badan usaha dan kebijakan client dikonfirmasi.</small></div>
      </section>
    </div>
  );
}

function FeatureCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef(null);
  const slide = featureSlides[active];

  const move = (direction) => setActive((current) => (current + direction + featureSlides.length) % featureSlides.length);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const interval = window.setInterval(() => move(1), 7000);
    return () => window.clearInterval(interval);
  }, [paused]);

  const onTouchEnd = (event) => {
    if (touchStart.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(distance) > 48) move(distance < 0 ? 1 : -1);
    touchStart.current = null;
  };

  return (
    <section
      className={`team-feature team-feature--${slide.id}`}
      aria-label="Tentang tim dan komitmen FMO"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setPaused(false)}
      onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; setPaused(true); }}
      onTouchEnd={onTouchEnd}
    >
      <div className="team-feature__image">
        {featureSlides.map((item, index) => <img className={index === active ? 'is-active' : ''} src={item.image} alt={index === active ? item.alt : ''} width={item.width} height={item.height} loading="lazy" decoding="async" aria-hidden={index !== active} key={item.id} />)}
        <p className="team-feature__caption" key={slide.caption}>{slide.caption}</p>
      </div>
      <div className="team-feature__copy">
        <div className="team-feature__copy-inner" aria-live="polite" key={slide.id}>
          <span>{slide.eyebrow}</span>
          <h2>{slide.title}<br /><em>{slide.accent}</em></h2>
          <p>{slide.copy}</p>
          <div className="team-feature__stats">{slide.stats.map(([value, label]) => <div key={value}><strong>{value}</strong><small>{label}</small></div>)}</div>
        </div>
        <div className="team-feature__controls">
          <span className="team-feature__counter">0{active + 1} / 0{featureSlides.length}</span>
          <div className="team-feature__progress" aria-hidden="true">{featureSlides.map((item, index) => <i className={index === active ? 'is-active' : ''} key={item.id} />)}</div>
          <button type="button" onClick={() => move(-1)} aria-label="Slide sebelumnya">←</button>
          <button type="button" onClick={() => move(1)} aria-label="Slide berikutnya">→</button>
        </div>
      </div>
    </section>
  );
}

function Consultation({ isOpen, onClose, preset }) {
  const contextLabel = preset ? (/^\d+$/.test(preset) ? `Paket ${Number(preset).toLocaleString('id-ID')} pax` : preset) : '';
  const totalSteps = contextLabel ? 3 : 4;
  const [step, setStep] = useState(1);
  const [progressStep, setProgressStep] = useState(1);
  const [messages, setMessages] = useState([chatIntro]);
  const [form, setForm] = useState({ city: '', event: contextLabel, date: '', venue: '' });
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.classList.add('modal-lock');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('modal-lock');
    };
  }, [isOpen, onClose]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, step]);

  const replyLater = (text, nextStep) => {
    const timer = setTimeout(() => {
      setMessages((current) => [...current, { sender: 'bot', text }]);
      setStep(nextStep);
    }, 450);
    timers.current.push(timer);
  };

  const selectCity = (city) => {
    if (step !== 1) return;
    setForm((current) => ({ ...current, city }));
    setMessages((current) => [...current, { sender: 'user', text: city }]);
    setStep(0);
    setProgressStep(2);
    if (contextLabel) replyLater(`Baik, kami catat ketertarikannya pada ${contextLabel}. Kapan rencana tanggal atau bulan bahagianya?`, 3);
    else replyLater('Lovely choice. Jenis acara dan kisaran jumlah tamu yang Kakak bayangkan seperti apa?', 2);
  };

  const selectEvent = (event) => {
    if (step !== 2) return;
    setForm((current) => ({ ...current, event }));
    setMessages((current) => [...current, { sender: 'user', text: event }]);
    setStep(0);
    setProgressStep(3);
    replyLater('Kapan rencana tanggal atau bulan bahagianya?', 3);
  };

  const submitText = (event) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    setInput('');
    setMessages((current) => [...current, { sender: 'user', text: value }]);
    if (step === 3) {
      setForm((current) => ({ ...current, date: value }));
      setStep(0);
      setProgressStep(contextLabel ? 3 : 4);
      replyLater('Apakah sudah ada venue impian? Ketik nama venue, atau jawab “Belum ada”.', 4);
    } else {
      setForm((current) => ({ ...current, venue: value }));
      setStep(0);
      setProgressStep(totalSteps);
      replyLater('Terima kasih, Kak. Informasi awalnya sudah lengkap. Yuk lanjutkan bersama Wedding Specialist kami di WhatsApp.', 5);
    }
  };

  const sendWhatsApp = () => {
    const message = `Halo FMO Wedding Specialist,\n\nSaya ingin berkonsultasi tentang rencana pernikahan:\n• Kota: ${form.city}\n• Acara: ${form.event}\n• Tanggal/bulan: ${form.date}\n• Venue: ${form.venue}\n\nMohon panduannya untuk langkah selanjutnya. Terima kasih.`;
    trackEvent('consultation_whatsapp', { context: form.event || 'general', city: form.city });
    window.open(`https://wa.me/6281221212877?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;
  return (
    <div className="consult-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="consult" role="dialog" aria-modal="true" aria-labelledby="consult-title">
        <header className="consult__header">
          <div><span className="status-dot" /><p id="consult-title">FMO Consultation</p><small>Wedding specialist online</small></div>
          <button type="button" onClick={onClose} aria-label="Tutup konsultasi" autoFocus><HiOutlineXMark /></button>
        </header>
        <div className="consult__progress">
          <div><span>Brief awal</span><strong>{progressStep} / {totalSteps}</strong></div>
          <div role="progressbar" aria-label="Progres konsultasi" aria-valuemin="1" aria-valuemax={totalSteps} aria-valuenow={progressStep}><i style={{ '--consult-progress': `${(progressStep / totalSteps) * 100}%` }} /></div>
          {contextLabel && <p>Konteks: <strong>{contextLabel}</strong></p>}
        </div>
        <div className="consult__messages" aria-live="polite">
          {messages.map((message, index) => <p className={`message message--${message.sender}`} key={`${message.sender}-${index}`}>{message.text}</p>)}
          {step === 1 && <div className="quick-options">{['Bandung', 'Cimahi', 'Bandung Barat', 'Kota lain'].map((city) => <button key={city} type="button" onClick={() => selectCity(city)}>{city}</button>)}</div>}
          {step === 2 && <div className="quick-options">{['Akad di masjid', 'Intimate · ≤250 tamu', 'Akad & resepsi · 250–500', 'Grand · ±1.000 tamu'].map((event) => <button key={event} type="button" onClick={() => selectEvent(event)}>{event}</button>)}</div>}
          {step === 5 && <div className="consult__summary"><span>Ringkasan konsultasi</span><dl><div><dt>Kota</dt><dd>{form.city}</dd></div><div><dt>Acara</dt><dd>{form.event}</dd></div><div><dt>Waktu</dt><dd>{form.date}</dd></div><div><dt>Venue</dt><dd>{form.venue}</dd></div></dl><button className="whatsapp-button" type="button" onClick={sendWhatsApp}><FaWhatsapp /> Lanjut ke WhatsApp</button></div>}
          <div ref={endRef} />
        </div>
        {(step === 3 || step === 4) && <form className="consult__input" onSubmit={submitText}><label className="sr-only" htmlFor="consult-message">Balasan</label><input id="consult-message" autoFocus maxLength="120" value={input} onChange={(event) => setInput(event.target.value)} placeholder={step === 3 ? 'Contoh: Desember 2026' : 'Nama venue atau “Belum ada”'} /><button type="submit" disabled={!input.trim()} aria-label="Kirim balasan"><HiArrowUpRight /></button></form>}
      </section>
    </div>
  );
}

function PackageModal({ isOpen, onClose, packageSize, onConsult }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.classList.add('modal-lock');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('modal-lock');
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  let content;
  if (packageSize === 'Akad di Masjid') {
    content = (
      <>
        <img src="/packages/15_M.webp" alt="Akad Di Masjid 1" className="package-modal__image" decoding="async" />
        <img src="/packages/16_M.webp" alt="Akad Di Masjid 2" className="package-modal__image" loading="lazy" decoding="async" />
        <img src="/packages/17_M.webp" alt="Akad Di Masjid 3" className="package-modal__image" loading="lazy" decoding="async" />
        <img src="/packages/18_M.webp" alt="Akad Di Masjid 4" className="package-modal__image" loading="lazy" decoding="async" />
        <img src="/packages/19_M.webp" alt="Akad Di Masjid 5" className="package-modal__image" loading="lazy" decoding="async" />
      </>
    );
  } else {
    const letterMap = { '100': 'A', '350': 'B', '500': 'C', '1000': 'D' };
    const letter = letterMap[packageSize];
    if (letter) {
      const addonsFile = packageSize === '1000' ? '17_D.webp' : `17${letter}.webp`;
      content = (
        <>
          <img src="/slides/slide-14.webp" alt="Package Intro" className="package-modal__image" decoding="async" />
          <img src={`/packages/15${letter}.webp`} alt={`Package ${packageSize} pax part 1`} className="package-modal__image" loading="lazy" decoding="async" />
          <img src={`/packages/16${letter}.webp`} alt={`Package ${packageSize} pax part 2`} className="package-modal__image" loading="lazy" decoding="async" />

          <img src="/slides/slide-17.webp" alt="Package closing quote" className="package-modal__image" loading="lazy" decoding="async" />
          <img src={`/packages/${addonsFile}`} alt="Add-ons" className="package-modal__image" loading="lazy" decoding="async" />
        </>
      );
    }
  }

  return (
    <div className="package-modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="package-modal">
        <button className="package-modal__close" type="button" onClick={onClose} aria-label="Tutup"><HiOutlineXMark /></button>
        <div className="package-modal__scroll">
          {content}
          <div className="package-modal__cta">
            <button type="button" className="button button--gold" onClick={() => { onClose(); onConsult(packageSize); }}>
              Konsultasikan Paket Ini <HiArrowUpRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [consultOpen, setConsultOpen] = useState(false);
  const [packagePreset, setPackagePreset] = useState('');
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [legalOpen, setLegalOpen] = useState('');

  const openConsult = (preset = '') => {
    setPackagePreset(preset);
    setConsultOpen(true);
    trackEvent('consultation_open', { context: preset || 'general' });
  };
  const openPackage = (size) => {
    setSelectedPackage(size);
    setPackageModalOpen(true);
    trackEvent('package_open', { package: size });
  };

  useEffect(() => {
    const trackSection = () => trackEvent('section_view', { section: window.location.hash.replace('#', '') || 'home' });
    trackSection();
    window.addEventListener('hashchange', trackSection);
    return () => window.removeEventListener('hashchange', trackSection);
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('[data-workflow-reveal]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
      <Header onConsult={() => openConsult()} onPackage={openPackage} />
      <main id="main-content">
        <section className="hero" id="home">
          <div className="hero__image" aria-hidden="true"><img src="/assets/hero-wedding-hd.webp" srcSet="/assets/hero-wedding-840.webp 840w, /assets/hero-wedding-1280.webp 1280w, /assets/hero-wedding-hd.webp 1672w" sizes="100vw" alt="" width="1672" height="941" fetchPriority="high" decoding="async" /></div><div className="hero__veil" />
          <div className="hero__content shell">
            <p className="eyebrow">Wedding planning · Bandung & beyond</p>
            <h1>Hari bahagiamu,<br /><em>expertly yours.</em></h1>
            <p className="hero__copy">Perayaan yang terasa personal, direncanakan dengan tenang, dan dieksekusi sepenuh hati oleh satu tim yang selalu ada untukmu.</p>
            <div className="hero__actions"><button type="button" className="button button--gold" onClick={() => openConsult()}>Mulai Konsultasi <HiArrowUpRight /></button><a href="#about" className="text-link">Kenali FMO <HiArrowDownRight /></a></div>
          </div>
          <p className="hero__side-note">One day · One client · Total focus</p>
        </section>

        <section className="trust-strip" aria-label="Keunggulan FMO"><div className="shell">{[['10+', 'years of experience'], ['1:1', 'personal specialist'], ['100%', 'transparent planning']].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>

        <section className="intro shell" id="about">
          <div className="intro__heading"><p className="eyebrow eyebrow--dark">Established in 2016</p><h2>From wedding anxiety into a <em>seamless celebration.</em></h2></div>
          <div className="intro__story"><p className="intro__lead">Kami percaya hari bahagiamu terlalu berharga untuk dirayakan dengan rasa cemas dan penuh kerahasiaan.</p><p>FMO hadir sebagai partner yang menerjemahkan visi menjadi perayaan yang tertata. Dengan pendekatan transparan dan perhatian personal, setiap keputusan terasa lebih ringan.</p><a href="#workflow">Lihat cara kami bekerja <HiArrowDownRight /></a></div>
        </section>

        <FeatureCarousel />

        <section className="promise">
          <div className="promise__photo"><img src="/assets/promise-couple-hd.webp" srcSet="/assets/promise-couple-560.webp 560w, /assets/promise-couple-900.webp 900w, /assets/promise-couple-hd.webp 1024w" sizes="(max-width: 860px) 100vw, 50vw" alt="Pasangan merayakan pertunangan mereka" width="1024" height="1535" loading="lazy" decoding="async" /></div>
          <div className="promise__content"><p className="eyebrow">The FMO promise</p><h2>Satu hari.<br />Satu pasangan.<br /><em>Total focus.</em></h2><div className="promise__points"><article><span>01</span><div><h3>1 Day, 1 Client</h3><p>Tidak ada double booking. Seluruh tim inti hadir untuk satu perayaan.</p></div></article><article><span>02</span><div><h3>Transparent by design</h3><p>RAB terbuka per item, tanpa biaya tersembunyi dan tanpa kejutan.</p></div></article><article><span>03</span><div><h3>Always personal</h3><p>Satu specialist mendampingimu sejak diskusi pertama hingga hari-H.</p></div></article></div></div>
        </section>

        <section className="workflow-section" id="workflow">
          <div className="shell">
            <header className="workflow-phase-heading" data-workflow-reveal="up"><div><p>FMO Workflow</p><h2>Phase <em>one.</em></h2></div><span>Dari konsultasi pertama hingga seluruh vendor terkunci—setiap keputusan memiliki jalur yang jelas dan transparan.</span></header>
            <div className="workflow-route" data-workflow-reveal="route">
              <svg viewBox="0 0 1000 900" preserveAspectRatio="none" aria-hidden="true">
                <path className="workflow-route__track" d="M100 90 H700 C835 90 900 150 900 250 C900 335 820 390 700 390 H100 C30 390 30 485 100 540 C170 540 250 600 250 680 V810" />
                <path className="workflow-route__progress" pathLength="1" d="M100 90 H700 C835 90 900 150 900 250 C900 335 820 390 700 390 H100 C30 390 30 485 100 540 C170 540 250 600 250 680 V810" />
              </svg>
              {workflow.map(([number, title, copy, x, y], index) => <article className="workflow-step" data-workflow-reveal="step" style={{ '--route-x': `${x}%`, '--route-y': `${y}%`, '--reveal-delay': `${180 + index * 85}ms` }} key={number}><i /><div><span>{number}</span><h3>{title}</h3><p>{copy}</p></div></article>)}
            </div>
            <div className="workflow-phase-divider" data-workflow-reveal="divider"><span>Vendors secured</span></div>
            <header className="workflow-phase-heading workflow-phase-heading--two" data-workflow-reveal="up"><div><p>FMO Workflow</p><h2>Phase <em>two.</em></h2></div><span>Persiapan mendalam bersama specialist dan vendor hingga seluruh detail siap dieksekusi.</span></header>
            <div className="preparation-timeline" data-workflow-reveal="timeline">{preparation.map(([title, copy], index) => <article data-workflow-reveal={index % 2 === 0 ? 'from-left' : 'from-right'} style={{ '--reveal-delay': `${80 + (index % 2) * 100}ms` }} key={title}><i /><div><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{copy}</p></div></article>)}</div>
          </div>
        </section>

        <section className="specialists shell" id="specialists">
          <div className="section-heading"><div><p className="eyebrow eyebrow--dark">Meet your team</p><h2>Your personal<br /><em>wedding specialists.</em></h2></div><p>Lebih dari wedding planner—partner yang memahami keinginanmu sekaligus menguasai detail teknisnya.</p></div>
          <div className="specialist-grid"><a href="https://instagram.com/byzackyjalaluddin" target="_blank" rel="noreferrer" className="specialist"><div><img src="/assets/page_8_img_3.jpeg" alt="Zacky Jalaluddin, FMO Wedding Specialist" width="600" height="800" loading="lazy" decoding="async" /></div><span>Founder · Wedding Specialist</span><h3>Zacky Jalaluddin</h3><p>@byzackyjalaluddin <HiArrowUpRight /></p></a><a href="https://instagram.com/byfauziahwindi" target="_blank" rel="noreferrer" className="specialist specialist--offset"><div><img src="/assets/page_8_img_5.jpeg" alt="Fauziah Windi, FMO Wedding Specialist" width="636" height="800" loading="lazy" decoding="async" /></div><span>Wedding Specialist</span><h3>Fauziah Windi</h3><p>@byfauziahwindi <HiArrowUpRight /></p></a></div>
        </section>

        <section className="guardian" id="guardian">
          <div className="shell">
            <header className="guardian__heading">
              <p className="eyebrow eyebrow--dark">Your calm on the wedding day</p>
              <h2>Meet your<br /><em>Wedding Day Guardian.</em></h2>
              <p>Bukan sekadar mengoordinasikan tim. Wedding Director menyatukan keluarga dan seluruh vendor agar setiap elemen bergerak selaras—dari awal acara hingga momen terakhir.</p>
            </header>
            <div className="guardian__map">
              <div className="guardian__director">
                <span>The guardian at the center</span>
                <h3>Wedding Director</h3>
                <p>Wedding Specialist yang sudah mendampingimu sejak perencanaan, lalu memimpin seluruh eksekusi pada hari bahagia.</p>
              </div>
              <div className="guardian__branches">
                {Object.entries(guardianRoles).map(([group, roles], groupIndex) => (
                  <article className="guardian__group" key={group}>
                    <div className="guardian__group-title"><span>0{groupIndex + 1}</span><h3>{group === 'family' ? 'Panitia keluarga' : "Vendor's team"}</h3></div>
                    <div className="guardian__roles">
                      {roles.map(([title, copy], index) => <div className="guardian__role" key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h4>{title}</h4><p>{copy}</p></div></div>)}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="packages" id="packages"><div className="shell"><div className="section-heading"><div><p className="eyebrow eyebrow--dark">Curated starting points</p><h2>Pilih skala,<br /><em>personalisasi ceritanya.</em></h2></div><p>Setiap paket adalah titik awal. Vendor, konsep, dan layanan tetap dapat disesuaikan dalam private consultation session.</p></div><div className="package-grid">{packageOptions.map((item) => <PackageCard key={item.id} item={item} onOpen={openPackage} />)}</div><PackageComparison onOpen={openPackage} /><div className="mosque-package"><div><p className="eyebrow">A meaningful beginning</p><h3>Akad di Masjid</h3><p>Perayaan akad yang khidmat, hangat, dan tertata—dengan opsi hampers box atau makan di tempat.</p></div><button type="button" onClick={() => openPackage('Akad di Masjid')}>Explore this package <HiArrowUpRight /></button></div></div></section>

        <section className="other-services" id="services">
          <div className="shell">
            <div className="section-heading section-heading--light"><div><p className="eyebrow">Beyond the wedding day</p><h2>Other FMO<br /><em>services.</em></h2></div><p>Momen bermakna tidak hanya hadir di hari pernikahan. Tim yang sama dapat mendampingimu pada rangkaian perayaan sebelum dan sesudahnya.</p></div>
            <div className="service-grid">
              {otherServices.map((service) => <article className="service-card" key={service.id}><div className="service-card__image"><img src={service.image} alt={service.alt} loading="lazy" decoding="async" /><span>{service.label}</span></div><div className="service-card__copy"><span>{service.id}</span><h3>{service.title}</h3><p>{service.copy}</p><button type="button" onClick={() => openConsult(service.title)}>Diskusikan layanan <HiArrowUpRight /></button></div></article>)}
            </div>
          </div>
        </section>

        <SelectedMoments onConsult={openConsult} />

        <section className="stories" id="stories"><div className="story-photo"><img src="/assets/hero-wedding-hd.webp" srcSet="/assets/hero-wedding-840.webp 840w, /assets/hero-wedding-1280.webp 1280w, /assets/hero-wedding-hd.webp 1672w" sizes="(max-width: 860px) 100vw, 50vw" alt="Pasangan FMO di hari pernikahan" width="1672" height="941" loading="lazy" decoding="async" /></div><div className="story-copy"><p className="eyebrow">Real couples · Real stories</p><div className="quote-mark">“</div><blockquote>Pelayanan FMO luar biasa dari awal sampai akhir acara. Semuanya berjalan lancar dan sesuai dengan apa yang direncanakan.</blockquote><p className="story-author">Fathimah & Hisaan <span>· FMO Couple</span></p><div className="story-nav" aria-hidden="true"><span>01</span><div><i /></div><span>03</span></div></div></section>

        <section className="faq shell" id="faq"><div className="faq__heading"><p className="eyebrow eyebrow--dark">Questions, answered</p><h2>Hal yang sering<br /><em>ditanyakan.</em></h2><p>Belum menemukan jawabanmu? Wedding Specialist kami siap membantu lewat konsultasi personal.</p><button type="button" className="button button--forest" onClick={() => openConsult()}>Tanya specialist <HiArrowUpRight /></button></div><div className="faq__list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>{String(index + 1).padStart(2, '0')}</span>{question}<HiChevronDown /></summary><p>{answer}</p></details>)}</div></section>

        <section className="closing"><div className="closing__image" aria-hidden="true"><img src="/assets/closing-couple-hd.webp" srcSet="/assets/closing-couple-840.webp 840w, /assets/closing-couple-1280.webp 1280w, /assets/closing-couple-hd.webp 1672w" sizes="100vw" alt="" width="1672" height="941" loading="lazy" decoding="async" /></div><div className="closing__veil" /><div className="closing__content shell"><p className="eyebrow">Begin your story</p><h2>Let’s make your day<br /><em>expertly yours.</em></h2><p>Mulai dari obrolan sederhana. Ceritakan impianmu, kami bantu menyusun jalannya.</p><button className="button button--gold" type="button" onClick={() => openConsult()}>Jadwalkan konsultasi <HiArrowUpRight /></button></div></section>
      </main>

      <footer><div className="shell footer__top"><div className="footer__brand"><img src="/logo.webp" alt="FMO Wedding Specialist" width="2480" height="1748" /><p>Wedding planning yang personal, transparan, dan sepenuh hati.</p></div><div><p className="footer__label">Explore</p><a href="#about">Tentang FMO</a><a href="#workflow">Workflow</a><a href="#guardian">Wedding Day Guardian</a><a href="#packages">Packages</a><a href="#real-weddings">Selected celebrations</a><a href="#services">Other services</a><a href="#faq">FAQ</a></div><div><p className="footer__label">Connect</p><a href="https://instagram.com/fmo_weddingspecialist" target="_blank" rel="noreferrer"><FaInstagram /> Instagram</a><a href="https://tiktok.com/@fmo_weddingspecialist" target="_blank" rel="noreferrer"><FaTiktok /> TikTok</a><a href="https://wa.me/6281221212877" target="_blank" rel="noreferrer"><FaWhatsapp /> WhatsApp</a></div><div><p className="footer__label">Information</p><p>Bandung, West Java<br />Available beyond the city.</p><button type="button" onClick={() => setLegalOpen('privacy')}>Privacy Policy</button><button type="button" onClick={() => setLegalOpen('terms')}>Terms of Use</button></div></div><div className="shell footer__bottom"><span>© {new Date().getFullYear()} FMO Wedding Specialist</span><span>expertly <em>yours.</em></span></div></footer>

      <AudioControl />
      <button className="floating-consult" type="button" onClick={() => openConsult()} aria-label="Buka konsultasi"><FaWhatsapp /><span>Konsultasi</span></button>
      {consultOpen && <Consultation isOpen onClose={() => setConsultOpen(false)} preset={packagePreset} />}
      {packageModalOpen && <PackageModal isOpen onClose={() => setPackageModalOpen(false)} packageSize={selectedPackage} onConsult={openConsult} />}
      {legalOpen && <LegalModal type={legalOpen} onClose={() => setLegalOpen('')} />}
    </>
  );
}

export default App;
