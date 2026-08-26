import { useEffect, useRef, useState } from 'react';
import { FaInstagram, FaTiktok, FaWhatsapp, FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6';
import { HiArrowDownRight, HiArrowUpRight, HiCheck, HiChevronDown, HiOutlineXMark } from 'react-icons/hi2';

const workflow = [
  ['01', 'Konsultasi awal', 'Cerita tentang visi, kebutuhan, dan prioritas hari bahagiamu.'],
  ['02', 'Kurasi paket', 'Kami bantu memilih titik awal paket yang paling relevan.'],
  ['03', 'Private session', 'Sesi mendalam bersama investment advisor dan wedding specialist.'],
  ['04', 'Kurasi vendor', 'Pemilihan vendor berdasarkan gaya, kebutuhan, dan budget.'],
  ['05', 'Konsep & quotation', 'Rencana menyeluruh dan rincian biaya transparan per item.'],
  ['06', 'Vendor secured', 'Down payment dan penguncian tanggal seluruh vendor pilihan.'],
];

const preparation = ['Bride & Groom Meeting', 'Attire Fitting', 'Moodboard Photo & Video', 'Moodboard Decoration', 'Food Tasting', 'Family Meeting', 'Technical Meeting', 'Wedding Day'];

const packageOptions = [
  { id: '100', guests: '100', title: 'Intimate', note: 'Hangat, personal, dan penuh makna.', features: ['Venue & catering', 'Decoration & styling', 'Documentation', 'Wedding organizer'] },
  { id: '350', guests: '350', title: 'Signature', note: 'Perayaan lengkap dengan detail yang terasa personal.', features: ['Curated vendor team', 'Full planning assistance', 'Guest experience', 'Wedding day management'], featured: true },
  { id: '500', guests: '500', title: 'Celebration', note: 'Dirancang untuk perayaan besar yang tetap terasa intim.', features: ['Venue & catering', 'Custom decoration', 'Entertainment', 'End-to-end coordination'] },
  { id: '1000', guests: '1.000', title: 'Grand', note: 'Skala besar, sistematis, dan tetap effortless.', features: ['Multi-vendor operation', 'Guest flow management', 'Technical production', 'Full specialist team'] },
];

const faqs = [
  ['Apakah aku bisa memilih vendor di luar list FMO?', 'Bisa. Pernikahan ini tentang ceritamu. Di private consultation session, kami akan membantu kurasi, kalkulasi, serta menjabarkan setiap selisih harga secara transparan—tanpa biaya tersembunyi.'],
  ['Bisakah paket ditambah layanan khusus?', 'Tentu. Kirab adat, photobooth, wedding effect, atau kebutuhan personal lain dapat diracik sesuai konsep dan prioritas perayaanmu.'],
  ['Bagaimana sistem termin pembayarannya?', 'Kami menyediakan Flexi Installment Plan hingga 4 kali pembayaran dan Smart Express Plan dalam 2 kali pembayaran. Skema akan disesuaikan dengan timeline dan cash flow-mu.'],
  ['Ke mana pembayaran dilakukan?', 'Kamu dapat memilih one-gate payment melalui manajemen FMO atau direct payment ke vendor. Semua pembayaran selalu dilengkapi invoice resmi.'],
  ['Apakah FMO menerima dua acara dalam sehari?', 'Tidak. Prinsip kami adalah 1 Day, 1 Client. Seluruh energi dan fokus tim inti didedikasikan hanya untuk satu pasangan pada hari tersebut.'],
  ['Apakah FMO melayani di luar Bandung?', 'Ya. Ceritakan kota dan rencana venue-mu saat konsultasi; tim kami akan memetakan kebutuhan perjalanan serta operasionalnya.'],
];

const chatIntro = { sender: 'bot', text: 'Halo Kak! Selamat atas rencana hari bahagianya. 🤍\n\nKira-kira, pernikahannya akan dilaksanakan di daerah mana?' };

const smoothScroll = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

function Header({ onConsult }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-lock', menuOpen);
    return () => document.body.classList.remove('menu-lock');
  }, [menuOpen]);

  const navigate = (event, id) => {
    event.preventDefault();
    setMenuOpen(false);
    smoothScroll(id);
  };

  return (
    <header className={`site-header ${scrolled || menuOpen ? 'site-header--scrolled' : ''}`}>
      <a className="brand" href="#home" onClick={(event) => navigate(event, '#home')} aria-label="FMO Wedding Specialist home">
        <img src="/logo.png" alt="FMO Wedding Specialist" />
      </a>
      <button className={`menu-toggle ${menuOpen ? 'menu-toggle--open' : ''}`} type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label="Buka menu navigasi">
        <span /><span />
      </button>
      <nav className={menuOpen ? 'main-nav main-nav--open' : 'main-nav'} aria-label="Navigasi utama">
        <a href="#about" onClick={(event) => navigate(event, '#about')}>Tentang</a>
        <a href="#workflow" onClick={(event) => navigate(event, '#workflow')}>Workflow</a>
        <a href="#packages" onClick={(event) => navigate(event, '#packages')}>Packages</a>
        <a href="#specialists" onClick={(event) => navigate(event, '#specialists')}>Specialists</a>
        <a href="#stories" onClick={(event) => navigate(event, '#stories')}>Stories</a>
        <button type="button" className="nav-cta" onClick={() => { setMenuOpen(false); onConsult(); }}>Konsultasi <HiArrowUpRight /></button>
      </nav>
    </header>
  );
}

function AudioControl() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      try { await audioRef.current.play(); } catch { return; }
    } else {
      audioRef.current.pause();
    }
  };

  return (
    <>
      <audio ref={audioRef} loop src="/music/Sebusur%20Pelangi.mp3" preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
      <button className="audio-control" type="button" onClick={toggle} aria-label={playing ? 'Hentikan musik' : 'Putar musik'}>
        {playing ? <FaVolumeHigh /> : <FaVolumeXmark />}
        <span>{playing ? 'Music on' : 'Music off'}</span>
      </button>
    </>
  );
}

function PackageCard({ item, onConsult }) {
  return (
    <article className={`package-card ${item.featured ? 'package-card--featured' : ''}`}>
      {item.featured && <span className="package-card__badge">Most selected</span>}
      <p className="package-card__kicker">Up to <strong>{item.guests}</strong> guests</p>
      <h3>{item.title}</h3>
      <p className="package-card__note">{item.note}</p>
      <ul>{item.features.map((feature) => <li key={feature}><HiCheck /> {feature}</li>)}</ul>
      <button type="button" onClick={() => onConsult(item.id)}>Explore package <HiArrowUpRight /></button>
    </article>
  );
}

function Consultation({ isOpen, onClose, preset }) {
  const [step, setStep] = useState(1);
  const [messages, setMessages] = useState([chatIntro]);
  const [form, setForm] = useState({ city: '', event: preset || '', date: '', venue: '' });
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
  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, step]);

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
    replyLater('Lovely choice. Jenis acara dan kisaran jumlah tamu yang Kakak bayangkan seperti apa?', 2);
  };

  const selectEvent = (event) => {
    if (step !== 2) return;
    setForm((current) => ({ ...current, event }));
    setMessages((current) => [...current, { sender: 'user', text: event }]);
    setStep(0);
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
      replyLater('Apakah sudah ada venue impian? Ketik nama venue, atau jawab “Belum ada”.', 4);
    } else {
      setForm((current) => ({ ...current, venue: value }));
      setStep(0);
      replyLater('Terima kasih, Kak. Informasi awalnya sudah lengkap. Yuk lanjutkan bersama Wedding Specialist kami di WhatsApp.', 5);
    }
  };

  const sendWhatsApp = () => {
    const message = `Halo FMO Wedding Specialist,\n\nSaya ingin berkonsultasi tentang rencana pernikahan:\n• Kota: ${form.city}\n• Acara: ${form.event}\n• Tanggal/bulan: ${form.date}\n• Venue: ${form.venue}\n\nMohon panduannya untuk langkah selanjutnya. Terima kasih.`;
    window.open(`https://wa.me/6281221212877?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;
  return (
    <div className="consult-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="consult" role="dialog" aria-modal="true" aria-labelledby="consult-title">
        <header className="consult__header">
          <div><span className="status-dot" /><p id="consult-title">FMO Consultation</p><small>Wedding specialist online</small></div>
          <button type="button" onClick={onClose} aria-label="Tutup konsultasi"><HiOutlineXMark /></button>
        </header>
        <div className="consult__messages" aria-live="polite">
          {messages.map((message, index) => <p className={`message message--${message.sender}`} key={`${message.sender}-${index}`}>{message.text}</p>)}
          {step === 1 && <div className="quick-options">{['Bandung', 'Cimahi', 'Bandung Barat', 'Kota lain'].map((city) => <button key={city} type="button" onClick={() => selectCity(city)}>{city}</button>)}</div>}
          {step === 2 && <div className="quick-options">{['Akad di masjid', 'Intimate · ≤250 tamu', 'Akad & resepsi · 250–500', 'Grand · ±1.000 tamu'].map((event) => <button key={event} type="button" onClick={() => selectEvent(event)}>{event}</button>)}</div>}
          {step === 5 && <button className="whatsapp-button" type="button" onClick={sendWhatsApp}><FaWhatsapp /> Lanjut ke WhatsApp</button>}
          <div ref={endRef} />
        </div>
        {(step === 3 || step === 4) && <form className="consult__input" onSubmit={submitText}><label className="sr-only" htmlFor="consult-message">Balasan</label><input id="consult-message" autoFocus value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ketik balasan..." /><button type="submit" disabled={!input.trim()}><HiArrowUpRight /></button></form>}
      </section>
    </div>
  );
}

function App() {
  const [consultOpen, setConsultOpen] = useState(false);
  const [packagePreset, setPackagePreset] = useState('');
  const openConsult = (preset = '') => { setPackagePreset(preset); setConsultOpen(true); };

  return (
    <>
      <Header onConsult={() => openConsult()} />
      <main>
        <section className="hero" id="home">
          <div className="hero__image" aria-hidden="true" /><div className="hero__veil" />
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

        <section className="promise">
          <div className="promise__photo"><img src="/assets/page_20_img_1.jpeg" alt="Pasangan merayakan pertunangan mereka" loading="lazy" /></div>
          <div className="promise__content"><p className="eyebrow">The FMO promise</p><h2>Satu hari.<br />Satu pasangan.<br /><em>Total focus.</em></h2><div className="promise__points"><article><span>01</span><div><h3>1 Day, 1 Client</h3><p>Tidak ada double booking. Seluruh tim inti hadir untuk satu perayaan.</p></div></article><article><span>02</span><div><h3>Transparent by design</h3><p>RAB terbuka per item, tanpa biaya tersembunyi dan tanpa kejutan.</p></div></article><article><span>03</span><div><h3>Always personal</h3><p>Satu specialist mendampingimu sejak diskusi pertama hingga hari-H.</p></div></article></div></div>
        </section>

        <section className="workflow-section" id="workflow">
          <div className="shell"><div className="section-heading section-heading--light"><div><p className="eyebrow">Our process</p><h2>A clear path to<br /><em>your perfect day.</em></h2></div><p>Setiap langkah dibuat transparan agar kamu selalu tahu apa yang sedang dikerjakan, diputuskan, dan dipersiapkan.</p></div>
          <div className="workflow-grid">{workflow.map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
          <div className="preparation"><p className="eyebrow">After vendors are secured</p><h3>Preparation, together.</h3><div>{preparation.map((item, index) => <span key={item}><b>{String(index + 1).padStart(2, '0')}</b>{item}</span>)}</div></div></div>
        </section>

        <section className="specialists shell" id="specialists">
          <div className="section-heading"><div><p className="eyebrow eyebrow--dark">Meet your team</p><h2>Your personal<br /><em>wedding specialists.</em></h2></div><p>Lebih dari wedding planner—partner yang memahami keinginanmu sekaligus menguasai detail teknisnya.</p></div>
          <div className="specialist-grid"><a href="https://instagram.com/byzackyjalaluddin" target="_blank" rel="noreferrer" className="specialist"><div><img src="/assets/page_8_img_3.jpeg" alt="Zacky Jalaluddin, FMO Wedding Specialist" loading="lazy" /></div><span>Founder · Wedding Specialist</span><h3>Zacky Jalaluddin</h3><p>@byzackyjalaluddin <HiArrowUpRight /></p></a><a href="https://instagram.com/byfauziahwindi" target="_blank" rel="noreferrer" className="specialist specialist--offset"><div><img src="/assets/page_8_img_5.jpeg" alt="Fauziah Windi, FMO Wedding Specialist" loading="lazy" /></div><span>Wedding Specialist</span><h3>Fauziah Windi</h3><p>@byfauziahwindi <HiArrowUpRight /></p></a></div>
        </section>

        <section className="packages" id="packages"><div className="shell"><div className="section-heading"><div><p className="eyebrow eyebrow--dark">Curated starting points</p><h2>Pilih skala,<br /><em>personalisasi ceritanya.</em></h2></div><p>Setiap paket adalah titik awal. Vendor, konsep, dan layanan tetap dapat disesuaikan dalam private consultation session.</p></div><div className="package-grid">{packageOptions.map((item) => <PackageCard key={item.id} item={item} onConsult={openConsult} />)}</div><div className="mosque-package"><div><p className="eyebrow">A meaningful beginning</p><h3>Akad di Masjid</h3><p>Perayaan akad yang khidmat, hangat, dan tertata—dengan opsi hampers box atau makan di tempat.</p></div><button type="button" onClick={() => openConsult('Akad di Masjid')}>Explore this package <HiArrowUpRight /></button></div></div></section>

        <section className="stories" id="stories"><div className="story-photo"><img src="/assets/page_21_img_1.jpeg" alt="Pasangan FMO di hari pernikahan" loading="lazy" /></div><div className="story-copy"><p className="eyebrow">Real couples · Real stories</p><div className="quote-mark">“</div><blockquote>Pelayanan FMO luar biasa dari awal sampai akhir acara. Semuanya berjalan lancar dan sesuai dengan apa yang direncanakan.</blockquote><p className="story-author">Fathimah & Hisaan <span>· FMO Couple</span></p><div className="story-nav" aria-hidden="true"><span>01</span><div><i /></div><span>03</span></div></div></section>

        <section className="faq shell" id="faq"><div className="faq__heading"><p className="eyebrow eyebrow--dark">Questions, answered</p><h2>Hal yang sering<br /><em>ditanyakan.</em></h2><p>Belum menemukan jawabanmu? Wedding Specialist kami siap membantu lewat konsultasi personal.</p><button type="button" className="button button--forest" onClick={() => openConsult()}>Tanya specialist <HiArrowUpRight /></button></div><div className="faq__list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>{String(index + 1).padStart(2, '0')}</span>{question}<HiChevronDown /></summary><p>{answer}</p></details>)}</div></section>

        <section className="closing"><div className="closing__image" aria-hidden="true" /><div className="closing__veil" /><div className="closing__content shell"><p className="eyebrow">Begin your story</p><h2>Let’s make your day<br /><em>expertly yours.</em></h2><p>Mulai dari obrolan sederhana. Ceritakan impianmu, kami bantu menyusun jalannya.</p><button className="button button--gold" type="button" onClick={() => openConsult()}>Jadwalkan konsultasi <HiArrowUpRight /></button></div></section>
      </main>

      <footer><div className="shell footer__top"><div className="footer__brand"><img src="/logo.png" alt="FMO Wedding Specialist" /><p>Wedding planning yang personal, transparan, dan sepenuh hati.</p></div><div><p className="footer__label">Explore</p><a href="#about">Tentang FMO</a><a href="#workflow">Workflow</a><a href="#packages">Packages</a><a href="#faq">FAQ</a></div><div><p className="footer__label">Connect</p><a href="https://instagram.com/fmo_weddingspecialist" target="_blank" rel="noreferrer"><FaInstagram /> Instagram</a><a href="https://tiktok.com/@fmo_weddingspecialist" target="_blank" rel="noreferrer"><FaTiktok /> TikTok</a><a href="https://wa.me/6281221212877" target="_blank" rel="noreferrer"><FaWhatsapp /> WhatsApp</a></div><div><p className="footer__label">Based in</p><p>Bandung, West Java<br />Available beyond the city.</p></div></div><div className="shell footer__bottom"><span>© {new Date().getFullYear()} FMO Wedding Specialist</span><span>expertly <em>yours.</em></span></div></footer>

      <AudioControl />
      <button className="floating-consult" type="button" onClick={() => openConsult()} aria-label="Buka konsultasi"><FaWhatsapp /><span>Konsultasi</span></button>
      {consultOpen && <Consultation isOpen onClose={() => setConsultOpen(false)} preset={packagePreset} />}
    </>
  );
}

export default App;
