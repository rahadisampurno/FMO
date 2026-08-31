'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FaInstagram, FaTiktok, FaWhatsapp, FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6';
import { HiArrowDownRight, HiArrowUpRight, HiCheck, HiChevronDown, HiOutlineXMark } from 'react-icons/hi2';
import { defaultContent, mergeSiteContent } from './content';

const SiteContentContext = createContext(defaultContent);
const useSiteContent = () => useContext(SiteContentContext);

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

const consultationEndpoint =
  import.meta.env.VITE_FMO_LEADS_ENDPOINT?.trim() ||
  'https://script.google.com/macros/s/AKfycbxG8rv0SrQhywcIMKFPP8yxHEudP_ibakIHPU5rDBYNwR1FeAKvxRJOvlLJ0A_-j-cH9Q/exec';

const consultationProfileKey = 'fmo-consultation-profile';

function isCompleteConsultationProfile(profile) {
  return profile && ['city', 'event', 'date', 'venue', 'phone'].every((field) => typeof profile[field] === 'string' && profile[field].trim());
}

function getStoredConsultationProfile() {
  if (typeof window === 'undefined') return null;

  try {
    const savedProfile = JSON.parse(window.localStorage.getItem(consultationProfileKey) || 'null');
    if (isCompleteConsultationProfile(savedProfile)) return savedProfile;

    // Migrate visitors who completed the form before persistent storage was enabled.
    const sessionProfile = JSON.parse(window.sessionStorage.getItem(consultationProfileKey) || 'null');
    if (!isCompleteConsultationProfile(sessionProfile)) return null;
    window.localStorage.setItem(consultationProfileKey, JSON.stringify(sessionProfile));
    return sessionProfile;
  } catch {
    return null;
  }
}

function getRecommendedPackageId(profile) {
  const savedPreference = profile?.packagePreferenceId;
  if (packageOptions.some((item) => item.id === savedPreference)) return savedPreference;

  const event = profile?.event?.toLowerCase() || '';
  if (event.includes('masjid')) return 'Akad di Masjid';
  if (event.includes('1.000') || event.includes('1000') || event.includes('grand')) return '1000';
  if (event.includes('250–500') || event.includes('250-500')) return '500';
  if (event.includes('≤250') || event.includes('intimate')) return '350';

  const guestCounts = [...event.matchAll(/\d[\d.]*/g)]
    .map(([value]) => Number(value.replaceAll('.', '')))
    .filter(Number.isFinite);
  const guestTarget = Math.max(0, ...guestCounts);
  return [['100', 100], ['350', 350], ['500', 500], ['1000', 1000]]
    .find(([, capacity]) => guestTarget <= capacity)?.[0] || '1000';
}

function createSubmissionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `fmo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function saveConsultationLead(form, submissionId) {
  if (!consultationEndpoint) throw new Error('endpoint_not_configured');

  const response = await fetch(consultationEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      submissionId,
      city: form.city,
      event: form.event,
      date: form.date,
      venue: form.venue,
      phone: form.phone,
      source: 'website-entry',
      submittedAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) throw new Error(`request_failed_${response.status}`);
  const result = await response.json().catch(() => ({ ok: true }));
  if (result.ok === false) throw new Error(result.error || 'save_failed');
  return result;
}

const packageOptions = [
  { id: 'Akad di Masjid', kicker: 'A meaningful beginning', title: 'Akad di Masjid', note: 'Prosesi sakral yang khidmat, hangat, dan tertata.', features: ['Mosque ceremony planning', 'Hampers or dine-in option', 'Family coordination', 'Wedding day management'] },
  { id: '100', guests: '100', title: 'Intimate', note: 'Hangat, personal, dan penuh makna.', features: ['Venue & catering', 'Decoration & styling', 'Documentation', 'Wedding organizer'] },
  { id: '350', guests: '350', title: 'Signature', note: 'Perayaan lengkap dengan detail yang terasa personal.', features: ['Curated vendor team', 'Full planning assistance', 'Guest experience', 'Wedding day management'] },
  { id: '500', guests: '500', title: 'Celebration', note: 'Dirancang untuk perayaan besar yang tetap terasa intim.', features: ['Venue & catering', 'Custom decoration', 'Entertainment', 'End-to-end coordination'] },
  { id: '1000', guests: '1.000', title: 'Grand', note: 'Skala besar, sistematis, dan tetap effortless.', features: ['Multi-vendor operation', 'Guest flow management', 'Technical production', 'Full specialist team'] },
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
  const { packages } = useSiteContent();
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
        <img src="/logo.png?v=20260827b" alt="FMO Wedding Specialist" width="800" height="564" />
      </a>
      <button className={`menu-toggle ${menuOpen ? 'menu-toggle--open' : ''}`} type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label="Buka menu navigasi">
        <span /><span />
      </button>
      <nav className={menuOpen ? 'main-nav main-nav--open' : 'main-nav'} aria-label="Navigasi utama">
        <a href="#about" onClick={navigate}>Tentang</a>
        <div className="nav-packages">
          <button className="nav-packages__trigger" type="button" onClick={togglePackages} aria-expanded={packagesOpen} aria-haspopup="menu">Packages <HiChevronDown /></button>
          <div className={`nav-packages__menu ${packagesOpen ? 'is-open' : ''}`} role="menu">
            {packages.filter((item) => item.active).map((item) => <button type="button" role="menuitem" onClick={() => openPackage(item.id)} key={item.id}>{item.title}</button>)}
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

function AudioControl({ onProfileSaved }) {
  const { business } = useSiteContent();
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [stage, setStage] = useState(() => getStoredConsultationProfile() ? 'entered' : 'welcome');
  const [leaving, setLeaving] = useState(false);
  const entered = stage === 'entered';

  useEffect(() => {
    document.body.classList.toggle('entry-lock', !entered);
    return () => document.body.classList.remove('entry-lock');
  }, [entered]);

  const enterWebsite = async () => {
    if (leaving) return;
    if (business.musicEnabled) {
      try {
        await audioRef.current?.play();
        window.localStorage.setItem('fmo-music', 'on');
      } catch { window.localStorage.setItem('fmo-music', 'off'); }
    }
    trackEvent('website_enter', { music: audioRef.current?.paused ? 'off' : 'on' });
    setLeaving(true);
    window.setTimeout(() => {
      setLeaving(false);
      setStage('consultation');
    }, 650);
  };

  const completeOnboarding = (form) => {
    try {
      window.localStorage.setItem(consultationProfileKey, JSON.stringify({
        ...form,
        completedAt: new Date().toISOString(),
        version: 1,
      }));
      window.sessionStorage.removeItem(consultationProfileKey);
    } catch { /* The gate still works when browser storage is unavailable. */ }
    onProfileSaved?.(form);
    trackEvent('onboarding_complete', { city: form.city, event: form.event });
    setStage('entered');
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
      <audio ref={audioRef} loop src={business.music} preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      {stage === 'welcome' && (
        <div className={`entry-screen ${leaving ? 'entry-screen--leaving' : ''}`} role="dialog" aria-modal="true" aria-label="Selamat datang di FMO Wedding Specialist">
          <div className="entry-screen__content">
            <img src="/logo.png?v=20260827b" alt="FMO Wedding Specialist" width="800" height="564" />
            <button type="button" onClick={enterWebsite}>Enter Website</button>
          </div>
        </div>
      )}
      {stage === 'consultation' && <Consultation isOpen required onComplete={completeOnboarding} />}
      {entered && business.musicEnabled && (
        <button className="audio-control" type="button" onClick={toggle} aria-label={playing ? 'Hentikan musik' : 'Putar musik'}>
          {playing ? <FaVolumeHigh /> : <FaVolumeXmark />}
          <span>{playing ? 'Music on' : 'Music off'}</span>
        </button>
      )}
    </>
  );
}

function PackageCard({ item, onOpen, featured = false }) {
  return (
    <article className={`package-card ${featured ? 'package-card--featured' : ''}`}>
      {featured && <span className="package-card__badge">Most selected</span>}
      <p className="package-card__kicker">{item.kicker || <>Up to <strong>{item.guests}</strong> guests</>}</p>
      <h3>{item.title}</h3>
      <p className="package-card__note">{item.note}</p>
      <ul>{item.features.map((feature) => <li key={feature}><HiCheck /> {feature}</li>)}</ul>
      <button type="button" onClick={() => onOpen(item.id)}>Explore package <HiArrowUpRight /></button>
    </article>
  );
}

function PackageComparison({ onOpen }) {
  const { packages } = useSiteContent();
  const visiblePackages = packages.filter((item) => item.active);
  return (
    <div className="package-comparison" aria-labelledby="package-comparison-title">
      <div className="package-comparison__heading"><div><p className="eyebrow eyebrow--dark">Compare at a glance</p><h3 id="package-comparison-title">Temukan titik awal yang paling relevan.</h3></div><p>Setiap paket tetap dapat dipersonalisasi melalui private consultation bersama tim FMO.</p></div>
      <div className="package-comparison__scroll" tabIndex="0" aria-label="Tabel perbandingan paket, dapat digulir horizontal">
        <table>
          <caption className="sr-only">Perbandingan lima paket FMO berdasarkan kapasitas dan cakupan pendampingan</caption>
          <thead><tr><th scope="col">Focus</th>{visiblePackages.map((item) => <th scope="col" key={item.id}>{item.title}<button type="button" onClick={() => onOpen(item.id)}>View package <HiArrowUpRight /></button></th>)}</tr></thead>
          <tbody>
            <tr><th scope="row">Guest scale</th>{visiblePackages.map((item) => <td key={`guests-${item.id}`}>{item.guests ? `Up to ${item.guests}` : 'Flexible'}</td>)}</tr>
            <tr><th scope="row">Best for</th>{visiblePackages.map((item) => <td key={`best-${item.id}`}>{item.note}</td>)}</tr>
            <tr><th scope="row">Included highlights</th>{visiblePackages.map((item) => <td key={`features-${item.id}`}>{item.features.slice(0, 2).join(' · ')}</td>)}</tr>
            <tr><th scope="row">Wedding day management</th>{visiblePackages.map((item) => <td key={`management-${item.id}`}><HiCheck aria-hidden="true" /> {item.features.some((feature) => feature.toLowerCase().includes('management')) ? 'Included' : 'Available'}</td>)}</tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PackagePreferenceModal({ currentPackageId, onClose, onSelect }) {
  const { packages } = useSiteContent();
  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.classList.add('modal-lock');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('modal-lock');
    };
  }, [onClose]);

  return (
    <div className="preference-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="preference-modal" role="dialog" aria-modal="true" aria-labelledby="preference-title">
        <header>
          <div><span>Personalized starting point</span><h2 id="preference-title">Ubah preferensi paket</h2></div>
          <button type="button" onClick={onClose} aria-label="Tutup pilihan preferensi"><HiOutlineXMark /></button>
        </header>
        <p>Pilih skala acara terbaru. Rekomendasi akan disimpan di browser ini dan badge <strong>Most selected</strong> langsung diperbarui.</p>
        <div className="preference-options">
          {packages.filter((item) => item.active).map((item) => ({ id: item.id, label: item.title, note: item.guests ? `Hingga ${item.guests} tamu. ${item.note}` : item.note })).map((option) => (
            <button className={option.id === currentPackageId ? 'is-selected' : ''} type="button" onClick={() => onSelect(option)} aria-pressed={option.id === currentPackageId} key={option.id}>
              <span>{option.id === currentPackageId ? 'Pilihan saat ini' : 'Pilih paket'}</span>
              <strong>{option.label}</strong>
              <small>{option.note}</small>
              <HiArrowUpRight />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function SelectedMoments({ onConsult }) {
  const { stories } = useSiteContent();
  const visibleStories = stories.filter((story) => story.active);
  return (
    <section className="selected-moments" id="real-weddings">
      <div className="shell">
        <div className="section-heading"><div><p className="eyebrow eyebrow--dark">Selected celebrations</p><h2>Moments with meaning,<br /><em>planned with intention.</em></h2></div><p>Setiap perayaan memiliki skala dan karakter berbeda. Yang tetap sama adalah perhatian pada detail, alur yang tenang, dan pengalaman yang terasa personal.</p></div>
        <div className="moment-grid">{visibleStories.map((moment, index) => <article className={index === 1 ? 'moment-card moment-card--wide' : 'moment-card'} key={`${moment.title}-${index}`}><div className="moment-card__image"><img src={moment.image} alt={moment.alt} loading="lazy" decoding="async" width="900" height="1100" /></div><div className="moment-card__copy"><span>{String(index + 1).padStart(2, '0')} · {moment.label}</span><h3>{moment.title}</h3><p>{moment.description}</p></div></article>)}</div>
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

function Consultation({ isOpen, onClose, preset = '', required = false, onComplete }) {
  const { business } = useSiteContent();
  const contextLabel = preset ? (/^\d+$/.test(preset) ? `Paket ${Number(preset).toLocaleString('id-ID')} pax` : preset) : '';
  const totalSteps = contextLabel ? 4 : 5;
  const [step, setStep] = useState(1);
  const [progressStep, setProgressStep] = useState(1);
  const [messages, setMessages] = useState([chatIntro]);
  const [form, setForm] = useState({ city: '', event: contextLabel, date: '', venue: '', phone: '' });
  const [input, setInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const submissionId = useRef(createSubmissionId());
  const endRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (event) => event.key === 'Escape' && !required && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.classList.add('modal-lock');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('modal-lock');
    };
  }, [isOpen, onClose, required]);

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
    } else if (step === 4) {
      setForm((current) => ({ ...current, venue: value }));
      setStep(0);
      setProgressStep(totalSteps);
      replyLater('Terakhir, boleh tuliskan nomor WhatsApp aktif yang dapat kami hubungi?', 5);
    } else {
      const normalizedPhone = value.replace(/[\s()-]/g, '');
      if (!/^(?:\+62|62|0)8\d{7,12}$/.test(normalizedPhone)) {
        setInput(value);
        setMessages((current) => [...current, { sender: 'bot', text: 'Nomornya belum terlihat valid. Gunakan format 08xxxxxxxxxx atau +628xxxxxxxxxx.' }]);
        return;
      }
      setForm((current) => ({ ...current, phone: normalizedPhone }));
      setStep(0);
      setProgressStep(totalSteps);
      replyLater('Terima kasih, Kak. Informasi awalnya sudah lengkap dan siap kami simpan dengan aman.', 6);
    }
  };

  const sendWhatsApp = () => {
    const message = `Halo FMO Wedding Specialist,\n\nSaya ingin berkonsultasi tentang rencana pernikahan:\n• Kota: ${form.city}\n• Acara: ${form.event}\n• Tanggal/bulan: ${form.date}\n• Venue: ${form.venue}\n• Nomor WhatsApp: ${form.phone}\n\nMohon panduannya untuk langkah selanjutnya. Terima kasih.`;
    const whatsappNumber = String(business.whatsapp || '').replace(/\D/g, '') || defaultContent.business.whatsapp;
    trackEvent('consultation_whatsapp', { context: form.event || 'general', city: form.city });
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const finishOnboarding = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError('');

    try {
      await saveConsultationLead(form, submissionId.current);
      trackEvent('consultation_brief_complete', { context: form.event || 'general', city: form.city, storage: 'google_sheets' });
      onComplete?.(form);
    } catch (error) {
      const configurationMissing = error instanceof Error && error.message === 'endpoint_not_configured';
      setSaveError(configurationMissing
        ? 'Penyimpanan konsultasi belum diaktifkan. Silakan hubungi administrator FMO.'
        : 'Data belum berhasil tersimpan. Periksa koneksi lalu coba lagi.');
      trackEvent('consultation_brief_save_failed', { reason: error instanceof Error ? error.message : 'unknown' });
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className={`consult-overlay ${required ? 'consult-overlay--required' : ''}`} onMouseDown={(event) => event.target === event.currentTarget && !required && onClose?.()}>
      <section className={`consult ${required ? 'consult--required' : ''}`} role="dialog" aria-modal="true" aria-labelledby="consult-title">
        <header className="consult__header">
          <div><span className="status-dot" /><p id="consult-title">FMO Consultation</p><small>{required ? 'Lengkapi brief untuk memasuki website' : 'Wedding specialist online'}</small></div>
          {!required && <button type="button" onClick={onClose} aria-label="Tutup konsultasi" autoFocus><HiOutlineXMark /></button>}
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
          {step === 6 && <div className="consult__summary"><span>Ringkasan konsultasi</span><dl><div><dt>Kota</dt><dd>{form.city}</dd></div><div><dt>Acara</dt><dd>{form.event}</dd></div><div><dt>Waktu</dt><dd>{form.date}</dd></div><div><dt>Venue</dt><dd>{form.venue}</dd></div><div><dt>WhatsApp</dt><dd>{form.phone}</dd></div></dl>{required ? <><button className="whatsapp-button" type="button" onClick={finishOnboarding} disabled={isSaving} aria-busy={isSaving}>{isSaving ? 'Menyimpan data…' : 'Masuk ke website'} {!isSaving && <HiArrowUpRight />}</button>{saveError && <p className="consult__save-error" role="alert">{saveError}</p>}</> : <button className="whatsapp-button" type="button" onClick={sendWhatsApp}><FaWhatsapp /> Lanjut ke WhatsApp</button>}</div>}
          <div ref={endRef} />
        </div>
        {(step === 3 || step === 4 || step === 5) && <form className="consult__input" onSubmit={submitText}><label className="sr-only" htmlFor="consult-message">Balasan</label><input id="consult-message" autoFocus type={step === 5 ? 'tel' : 'text'} inputMode={step === 5 ? 'tel' : 'text'} autoComplete={step === 5 ? 'tel' : 'off'} maxLength="120" value={input} onChange={(event) => setInput(event.target.value)} placeholder={step === 3 ? 'Contoh: Desember 2026' : step === 4 ? 'Nama venue atau “Belum ada”' : 'Contoh: 0812 3456 7890'} /><button type="submit" disabled={!input.trim()} aria-label="Kirim balasan"><HiArrowUpRight /></button></form>}
      </section>
    </div>
  );
}

function PackageModal({ isOpen, onClose, packageSize, onConsult }) {
  const { packages } = useSiteContent();
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

  const selectedPackage = packages.find((item) => item.id === packageSize);
  const visibleMedia = (selectedPackage?.media || []).filter((item) => item.active && item.src);

  return (
    <div className="package-modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="package-modal">
        <button className="package-modal__close" type="button" onClick={onClose} aria-label="Tutup"><HiOutlineXMark /></button>
        <div className="package-modal__scroll">
          <header className="package-modal__header"><span>FMO Package</span><h2>{selectedPackage?.title || 'Detail Paket'}</h2><p>{selectedPackage?.note || 'Pilih paket yang paling sesuai untuk memulai konsultasi personal bersama FMO.'}</p></header>
          {visibleMedia.length > 0 ? visibleMedia.map((item, index) => <PackageMedia key={`${item.src}-${index}`} item={item} index={index} />) : <div className="package-modal__empty"><strong>Detail paket sedang disiapkan.</strong><p>Silakan konsultasikan paket ini untuk mendapatkan informasi lengkap dari tim FMO.</p></div>}
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

function PackageMedia({ item, index }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="package-modal__media-error" role="status"><strong>File {index + 1} belum dapat ditampilkan.</strong><p>Admin dapat mengganti file ini dari Content Studio.</p></div>;
  return <img src={item.src} alt={item.alt || `Detail paket bagian ${index + 1}`} className="package-modal__image" loading={index === 0 ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />;
}

function GallerySection({ onOpen }) {
  const { gallery } = useSiteContent();
  const previewImages = gallery.filter((image) => image.featured).slice(0, 6);

  return (
    <section className="gallery-section" id="gallery">
      <div className="shell">
        <header className="gallery-section__heading">
          <div>
            <p className="eyebrow">The moments we hold</p>
            <h2>Stories, beautifully<br /><em>remembered.</em></h2>
          </div>
          <div>
            <p>Setiap perayaan meninggalkan cerita yang berbeda. Inilah sebagian momen yang pernah dipercayakan kepada FMO.</p>
            <button className="button gallery-section__button" type="button" onClick={onOpen}>Lihat semua koleksi <HiArrowUpRight /></button>
          </div>
        </header>
        <div className="gallery-preview">
          {previewImages.map((image, index) => (
            <button className={`gallery-preview__item gallery-preview__item--${index + 1}`} type="button" onClick={onOpen} aria-label={`Buka galeri dari foto ${index + 1}`} key={image.src}>
              <img src={image.src} width="1200" height="1500" alt={image.alt} loading="lazy" decoding="async" />
              <span>{String(index + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
        <div className="gallery-section__mobile-cta">
          <button className="button gallery-section__button" type="button" onClick={onOpen}>Lihat semua koleksi <HiArrowUpRight /></button>
        </div>
      </div>
    </section>
  );
}

function GalleryModal({ onClose }) {
  const { gallery } = useSiteContent();
  const fullGalleryImages = gallery;
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selectedImage = selectedIndex === null ? null : fullGalleryImages[selectedIndex];

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        if (selectedIndex !== null) setSelectedIndex(null);
        else onClose();
      }
      if (selectedIndex !== null && event.key === 'ArrowLeft') setSelectedIndex((selectedIndex - 1 + fullGalleryImages.length) % fullGalleryImages.length);
      if (selectedIndex !== null && event.key === 'ArrowRight') setSelectedIndex((selectedIndex + 1) % fullGalleryImages.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('modal-lock');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('modal-lock');
    };
  }, [onClose, selectedIndex, fullGalleryImages.length]);

  const showPrevious = () => setSelectedIndex((selectedIndex - 1 + fullGalleryImages.length) % fullGalleryImages.length);
  const showNext = () => setSelectedIndex((selectedIndex + 1) % fullGalleryImages.length);

  return (
    <div className="gallery-overlay">
      <section className="gallery-modal" role="dialog" aria-modal="true" aria-labelledby="gallery-title">
        <header className="gallery-modal__header">
          <div><span>FMO Wedding Gallery</span><h2 id="gallery-title">A collection of <em>beautiful stories.</em></h2></div>
          <div><p>{fullGalleryImages.length} moments</p><button type="button" onClick={onClose} aria-label="Tutup galeri" autoFocus><HiOutlineXMark /></button></div>
        </header>
        <div className="gallery-modal__scroll">
          <p className="gallery-modal__intro">Sebuah arsip kecil tentang cinta, keluarga, detail, dan perayaan yang kami jaga sepenuh hati.</p>
          <div className="gallery-collection">
            {fullGalleryImages.map((image, index) => (
              <button type="button" onClick={() => { setSelectedIndex(index); trackEvent('gallery_photo_open', { photo: index + 1 }); }} aria-label={`Perbesar foto ${index + 1}: ${image.alt}`} key={image.src}>
                <img src={image.src} width="1200" height="1500" alt={image.alt} loading="lazy" decoding="async" />
                <span>{String(index + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
          <div className="gallery-modal__footer"><span>FMO Wedding Specialist</span><p>Every story, <em>expertly yours.</em></p></div>
        </div>
      </section>
      {selectedImage && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`Foto ${selectedIndex + 1} dari ${fullGalleryImages.length}`} onMouseDown={(event) => event.target === event.currentTarget && setSelectedIndex(null)}>
          <button className="gallery-lightbox__close" type="button" onClick={() => setSelectedIndex(null)} aria-label="Tutup foto"><HiOutlineXMark /></button>
          <button className="gallery-lightbox__nav gallery-lightbox__nav--previous" type="button" onClick={showPrevious} aria-label="Foto sebelumnya">←</button>
          <figure><img src={selectedImage.src} alt={selectedImage.alt} /><figcaption><span>{String(selectedIndex + 1).padStart(3, '0')} / {fullGalleryImages.length}</span>{selectedImage.alt}</figcaption></figure>
          <button className="gallery-lightbox__nav gallery-lightbox__nav--next" type="button" onClick={showNext} aria-label="Foto berikutnya">→</button>
        </div>
      )}
    </div>
  );
}

function App({ initialContent = defaultContent }) {
  const siteContent = useMemo(() => mergeSiteContent(initialContent), [initialContent]);
  const [consultOpen, setConsultOpen] = useState(false);
  const [packagePreset, setPackagePreset] = useState('');
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [legalOpen, setLegalOpen] = useState('');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [recommendedPackageId, setRecommendedPackageId] = useState(() => getRecommendedPackageId(getStoredConsultationProfile()));
  const [preferenceOpen, setPreferenceOpen] = useState(false);

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
  const updatePackagePreference = (option) => {
    const profile = getStoredConsultationProfile();
    if (profile) {
      try {
        window.localStorage.setItem(consultationProfileKey, JSON.stringify({
          ...profile,
          packagePreferenceId: option.id,
          preferenceUpdatedAt: new Date().toISOString(),
        }));
      } catch { /* The recommendation still updates for the current visit. */ }
    }
    setRecommendedPackageId(option.id);
    setPreferenceOpen(false);
    trackEvent('package_preference_updated', { package: option.id });
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
    <SiteContentContext.Provider value={siteContent}>
    <>
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
      <Header onConsult={() => openConsult()} onPackage={openPackage} />
      <main id="main-content">
        <section className="hero" id="home">
          <div className="hero__image"><img src={siteContent.hero.image} alt={siteContent.hero.imageAlt} width="1920" height="1280" fetchPriority="high" decoding="async" /></div><div className="hero__veil" />
          <div className="hero__content shell">
            <p className="eyebrow">{siteContent.hero.eyebrow}</p>
            <h1>{siteContent.hero.title}<br /><em>{siteContent.hero.accent}</em></h1>
            <p className="hero__copy">{siteContent.hero.description}</p>
            <div className="hero__actions"><button type="button" className="button button--gold" onClick={() => openConsult()}>{siteContent.hero.primaryCta} <HiArrowUpRight /></button><a href="#about" className="text-link">{siteContent.hero.secondaryCta} <HiArrowDownRight /></a></div>
          </div>
          <p className="hero__side-note">One day · One client · Total focus</p>
        </section>

        <section className="trust-strip" aria-label="Keunggulan FMO"><div className="shell">{siteContent.about.statistics.map(({ value, label }) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>

        <section className="intro shell" id="about">
          <div className="intro__heading"><p className="eyebrow eyebrow--dark">{siteContent.about.eyebrow}</p><h2>{siteContent.about.title} <em>{siteContent.about.accent}</em></h2></div>
          <div className="intro__story"><p className="intro__lead">{siteContent.about.lead}</p><p>{siteContent.about.description}</p><a href="#workflow">{siteContent.about.linkLabel} <HiArrowDownRight /></a></div>
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
              {siteContent.workflow.phaseOne.slice(0, 10).map(({ title, description }, index) => { const [, , , x, y] = workflow[index]; const number = String(index + 1).padStart(2, '0'); return <article className="workflow-step" data-workflow-reveal="step" style={{ '--route-x': `${x}%`, '--route-y': `${y}%`, '--reveal-delay': `${180 + index * 85}ms` }} key={`${title}-${index}`}><i /><div><span>{number}</span><h3>{title}</h3><p>{description}</p></div></article>; })}
            </div>
            <div className="workflow-phase-divider" data-workflow-reveal="divider"><span>Vendors secured</span></div>
            <header className="workflow-phase-heading workflow-phase-heading--two" data-workflow-reveal="up"><div><p>FMO Workflow</p><h2>Phase <em>two.</em></h2></div><span>Persiapan mendalam bersama specialist dan vendor hingga seluruh detail siap dieksekusi.</span></header>
            <div className="preparation-timeline" data-workflow-reveal="timeline">{siteContent.workflow.phaseTwo.map(({ title, description }, index) => <article data-workflow-reveal={index % 2 === 0 ? 'from-left' : 'from-right'} style={{ '--reveal-delay': `${80 + (index % 2) * 100}ms` }} key={`${title}-${index}`}><i /><div><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{description}</p></div></article>)}</div>
          </div>
        </section>

        <section className="specialists shell" id="specialists">
          <div className="section-heading"><div><p className="eyebrow eyebrow--dark">Meet your team</p><h2>Your personal<br /><em>wedding specialists.</em></h2></div><p>Lebih dari wedding planner—partner yang memahami keinginanmu sekaligus menguasai detail teknisnya.</p></div>
          <div className="specialist-grid">{siteContent.specialists.filter((specialist) => specialist.active).map((specialist, index) => <a href={`https://instagram.com/${specialist.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className={index % 2 ? 'specialist specialist--offset' : 'specialist'} key={`${specialist.name}-${index}`}><div><img src={specialist.image} alt={`${specialist.name}, FMO Wedding Specialist`} width="636" height="800" loading="lazy" decoding="async" /></div><span>{specialist.role}</span><h3>{specialist.name}</h3><p>@{specialist.instagram.replace('@', '')} <HiArrowUpRight /></p></a>)}</div>
        </section>

        <section className="guardian" id="guardian">
          <div className="shell">
            <header className="guardian__heading">
              <p className="eyebrow eyebrow--dark">Your calm on the wedding day</p>
              <h2>{siteContent.guardian.title}</h2>
              <p>{siteContent.guardian.description}</p>
            </header>
            <div className="guardian__map">
              <div className="guardian__director">
                <span>The guardian at the center</span>
                <h3>Wedding Director</h3>
                <p>Wedding Specialist yang sudah mendampingimu sejak perencanaan, lalu memimpin seluruh eksekusi pada hari bahagia.</p>
              </div>
              <div className="guardian__branches">
                {Object.entries({ family: siteContent.guardian.family, vendors: siteContent.guardian.vendors }).map(([group, roles], groupIndex) => (
                  <article className="guardian__group" key={group}>
                    <div className="guardian__group-title"><span>0{groupIndex + 1}</span><h3>{group === 'family' ? 'Panitia keluarga' : "Vendor's team"}</h3></div>
                    <div className="guardian__roles">
                      {roles.map(({ title, description }, index) => <div className="guardian__role" key={`${title}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><div><h4>{title}</h4><p>{description}</p></div></div>)}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="packages" id="packages"><div className="shell"><div className="section-heading"><div><p className="eyebrow eyebrow--dark">Curated starting points</p><h2>Pilih skala,<br /><em>personalisasi ceritanya.</em></h2></div><div className="package-heading__aside"><p>Setiap paket adalah titik awal. Vendor, konsep, dan layanan tetap dapat disesuaikan dalam private consultation session.</p><button type="button" onClick={() => setPreferenceOpen(true)}>Ubah preferensi paket <HiArrowUpRight /></button></div></div><div className="package-grid">{siteContent.packages.filter((item) => item.active).map((item) => <PackageCard key={item.id} item={item} onOpen={openPackage} featured={item.id === recommendedPackageId} />)}</div><PackageComparison onOpen={openPackage} /><div className="mosque-package"><div><p className="eyebrow">A meaningful beginning</p><h3>Akad di Masjid</h3><p>Perayaan akad yang khidmat, hangat, dan tertata—dengan opsi hampers box atau makan di tempat.</p></div><button type="button" onClick={() => openPackage('Akad di Masjid')}>Explore this package <HiArrowUpRight /></button></div></div></section>

        <section className="other-services" id="services">
          <div className="shell">
            <div className="section-heading section-heading--light"><div><p className="eyebrow">Beyond the wedding day</p><h2>Other FMO<br /><em>services.</em></h2></div><p>Momen bermakna tidak hanya hadir di hari pernikahan. Tim yang sama dapat mendampingimu pada rangkaian perayaan sebelum dan sesudahnya.</p></div>
            <div className="service-grid">
              {siteContent.services.filter((service) => service.active).map((service, index) => <article className="service-card" key={`${service.title}-${index}`}><div className="service-card__image"><img src={service.image} alt={service.alt} loading="lazy" decoding="async" /><span>{service.label}</span></div><div className="service-card__copy"><span>{String(index + 1).padStart(2, '0')}</span><h3>{service.title}</h3><p>{service.description}</p><button type="button" onClick={() => openConsult(service.title)}>Diskusikan layanan <HiArrowUpRight /></button></div></article>)}
            </div>
          </div>
        </section>

        <SelectedMoments onConsult={openConsult} />

        <section className="stories" id="stories"><div className="story-photo"><img src={siteContent.testimonial.image} alt={`${siteContent.testimonial.couple}, FMO Couple`} width="1672" height="941" loading="lazy" decoding="async" /></div><div className="story-copy"><p className="eyebrow">Real couples · Real stories</p><div className="quote-mark">“</div><blockquote>{siteContent.testimonial.quote}</blockquote><p className="story-author">{siteContent.testimonial.couple} <span>· {siteContent.testimonial.label}</span></p><div className="story-nav" aria-hidden="true"><span>01</span><div><i /></div><span>01</span></div></div></section>

        <section className="faq shell" id="faq"><div className="faq__heading"><p className="eyebrow eyebrow--dark">Questions, answered</p><h2>Hal yang sering<br /><em>ditanyakan.</em></h2><p>Belum menemukan jawabanmu? Wedding Specialist kami siap membantu lewat konsultasi personal.</p><button type="button" className="button button--forest" onClick={() => openConsult()}>Tanya specialist <HiArrowUpRight /></button></div><div className="faq__list">{siteContent.faq.filter((item) => item.active).map(({ question, answer }, index) => <details key={`${question}-${index}`} open={index === 0}><summary><span>{String(index + 1).padStart(2, '0')}</span>{question}<HiChevronDown /></summary><p>{answer}</p></details>)}</div></section>

        <section className="closing"><div className="closing__image"><img src={siteContent.closing.image} alt="FMO wedding celebration" width="1672" height="941" loading="lazy" decoding="async" /></div><div className="closing__veil" /><div className="closing__content shell"><p className="eyebrow">{siteContent.closing.eyebrow}</p><h2>{siteContent.closing.title}<br /><em>{siteContent.closing.accent}</em></h2><p>{siteContent.closing.description}</p><button className="button button--gold" type="button" onClick={() => openConsult()}>{siteContent.closing.buttonLabel} <HiArrowUpRight /></button></div></section>
        <GallerySection onOpen={() => { setGalleryOpen(true); trackEvent('gallery_open'); }} />
      </main>

      <footer><div className="shell footer__top"><div className="footer__brand"><img src="/logo.png?v=20260827b" alt="FMO Wedding Specialist" width="800" height="564" /><p>{siteContent.business.footerDescription}</p></div><div><p className="footer__label">Explore</p><a href="#about">Tentang FMO</a><a href="#workflow">Workflow</a><a href="#guardian">Wedding Day Guardian</a><a href="#packages">Packages</a><a href="#real-weddings">Selected celebrations</a><a href="#services">Other services</a><a href="#gallery">Galeri</a><a href="#faq">FAQ</a></div><div><p className="footer__label">Connect</p><a href={`https://instagram.com/${siteContent.business.instagram.replace('@', '')}`} target="_blank" rel="noreferrer"><FaInstagram /> Instagram</a><a href={`https://tiktok.com/@${siteContent.business.tiktok.replace('@', '')}`} target="_blank" rel="noreferrer"><FaTiktok /> TikTok</a><a href={`https://wa.me/${siteContent.business.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"><FaWhatsapp /> WhatsApp</a></div><div><p className="footer__label">Information</p><p>{siteContent.business.address}<br />{siteContent.business.availability}</p><button type="button" onClick={() => setLegalOpen('privacy')}>Privacy Policy</button><button type="button" onClick={() => setLegalOpen('terms')}>Terms of Use</button></div></div><div className="shell footer__bottom"><span>© {new Date().getFullYear()} FMO Wedding Specialist</span><span>expertly <em>yours.</em></span></div></footer>

      <AudioControl onProfileSaved={(profile) => setRecommendedPackageId(getRecommendedPackageId(profile))} />
      <button className="floating-consult" type="button" onClick={() => openConsult()} aria-label="Buka konsultasi"><FaWhatsapp /><span>Konsultasi</span></button>
      {consultOpen && <Consultation isOpen onClose={() => setConsultOpen(false)} preset={packagePreset} />}
      {packageModalOpen && <PackageModal isOpen onClose={() => setPackageModalOpen(false)} packageSize={selectedPackage} onConsult={openConsult} />}
      {legalOpen && <LegalModal type={legalOpen} onClose={() => setLegalOpen('')} />}
      {galleryOpen && <GalleryModal onClose={() => setGalleryOpen(false)} />}
      {preferenceOpen && <PackagePreferenceModal currentPackageId={recommendedPackageId} onClose={() => setPreferenceOpen(false)} onSelect={updatePackagePreference} />}
    </>
    </SiteContentContext.Provider>
  );
}

export default App;
