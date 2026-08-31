export const defaultContent = {
  seo: {
    title: 'FMO Wedding Specialist — Bandung & Beyond',
    description: 'Wedding planning yang personal, transparan, dan sepenuh hati untuk perayaan di Bandung dan beyond.',
    shareImage: '/og-fmo.png',
  },
  hero: {
    eyebrow: 'Wedding planning · Bandung & beyond',
    title: 'Hari bahagiamu,',
    accent: 'expertly yours.',
    description: 'Perayaan yang terasa personal, direncanakan dengan tenang, dan dieksekusi sepenuh hati oleh satu tim yang selalu ada untukmu.',
    primaryCta: 'Mulai Konsultasi',
    secondaryCta: 'Kenali FMO',
    image: '/assets/hero-hari-bahagia-hd.webp',
    imageAlt: 'Pasangan FMO pada hari bahagia mereka',
  },
  about: {
    eyebrow: 'Established in 2016',
    title: 'From wedding anxiety into a',
    accent: 'seamless celebration.',
    lead: 'Kami percaya hari bahagiamu terlalu berharga untuk dirayakan dengan rasa cemas dan penuh kerahasiaan.',
    description: 'FMO hadir sebagai partner yang menerjemahkan visi menjadi perayaan yang tertata. Dengan pendekatan transparan dan perhatian personal, setiap keputusan terasa lebih ringan.',
    linkLabel: 'Lihat cara kami bekerja',
    statistics: [
      { value: '10+', label: 'years of experience' },
      { value: '1:1', label: 'personal specialist' },
      { value: '100%', label: 'transparent planning' },
    ],
  },
  specialists: [
    { name: 'Zacky Jalaluddin', role: 'Founder · Wedding Specialist', image: '/assets/page_8_img_3.jpeg', instagram: 'byzackyjalaluddin', active: true },
    { name: 'Fauziah Windi', role: 'Wedding Specialist', image: '/assets/page_8_img_5.jpeg', instagram: 'byfauziahwindi', active: true },
  ],
  packages: [
    { id: 'Akad di Masjid', kicker: 'A meaningful beginning', guests: '', title: 'Akad di Masjid', note: 'Prosesi sakral yang khidmat, hangat, dan tertata.', features: ['Mosque ceremony planning', 'Hampers or dine-in option', 'Family coordination', 'Wedding day management'], media: [
      { src: '/packages/15_M.webp', alt: 'Detail paket Akad di Masjid bagian 1', active: true }, { src: '/packages/16_M.webp', alt: 'Detail paket Akad di Masjid bagian 2', active: true }, { src: '/packages/17_M.webp', alt: 'Detail paket Akad di Masjid bagian 3', active: true }, { src: '/packages/18_M.webp', alt: 'Detail paket Akad di Masjid bagian 4', active: true }, { src: '/packages/19_M.webp', alt: 'Detail paket Akad di Masjid bagian 5', active: true },
    ], active: true },
    { id: '100', kicker: '', guests: '100', title: 'Intimate', note: 'Hangat, personal, dan penuh makna.', features: ['Venue & catering', 'Decoration & styling', 'Documentation', 'Wedding organizer'], media: [
      { src: '/slides/slide-14.webp', alt: 'Pengantar paket Intimate', active: true }, { src: '/packages/15A.webp', alt: 'Detail paket Intimate bagian 1', active: true }, { src: '/packages/16A.webp', alt: 'Detail paket Intimate bagian 2', active: true }, { src: '/slides/slide-17.webp', alt: 'Penutup paket Intimate', active: true }, { src: '/packages/17A.webp', alt: 'Add-on paket Intimate', active: true },
    ], active: true },
    { id: '350', kicker: '', guests: '350', title: 'Signature', note: 'Perayaan lengkap dengan detail yang terasa personal.', features: ['Curated vendor team', 'Full planning assistance', 'Guest experience', 'Wedding day management'], media: [
      { src: '/slides/slide-14.webp', alt: 'Pengantar paket Signature', active: true }, { src: '/packages/15B.webp', alt: 'Detail paket Signature bagian 1', active: true }, { src: '/packages/16B.webp', alt: 'Detail paket Signature bagian 2', active: true }, { src: '/slides/slide-17.webp', alt: 'Penutup paket Signature', active: true }, { src: '/packages/17B.webp', alt: 'Add-on paket Signature', active: true },
    ], active: true },
    { id: '500', kicker: '', guests: '500', title: 'Celebration', note: 'Dirancang untuk perayaan besar yang tetap terasa intim.', features: ['Venue & catering', 'Custom decoration', 'Entertainment', 'End-to-end coordination'], media: [
      { src: '/slides/slide-14.webp', alt: 'Pengantar paket Celebration', active: true }, { src: '/packages/15C.webp', alt: 'Detail paket Celebration bagian 1', active: true }, { src: '/packages/16C.webp', alt: 'Detail paket Celebration bagian 2', active: true }, { src: '/slides/slide-17.webp', alt: 'Penutup paket Celebration', active: true }, { src: '/packages/17C.webp', alt: 'Add-on paket Celebration', active: true },
    ], active: true },
    { id: '1000', kicker: '', guests: '1.000', title: 'Grand', note: 'Skala besar, sistematis, dan tetap effortless.', features: ['Multi-vendor operation', 'Guest flow management', 'Technical production', 'Full specialist team'], media: [
      { src: '/slides/slide-14.webp', alt: 'Pengantar paket Grand', active: true }, { src: '/packages/15D.webp', alt: 'Detail paket Grand bagian 1', active: true }, { src: '/packages/16D.webp', alt: 'Detail paket Grand bagian 2', active: true }, { src: '/slides/slide-17.webp', alt: 'Penutup paket Grand', active: true }, { src: '/packages/17_D.webp', alt: 'Add-on paket Grand', active: true },
    ], active: true },
  ],
  workflow: {
    phaseOne: [
      { title: 'Konsultasi awal', description: 'Bersama Customer Service.' },
      { title: 'Pemilihan paket', description: 'Titik awal yang paling relevan.' },
      { title: 'Private session', description: 'Booking sesi konsultasi personal.' },
      { title: 'Investment advisor', description: 'Konsultasi kebutuhan dan investasi.' },
      { title: 'Penentuan vendor', description: 'Kurasi berdasarkan gaya dan prioritas.' },
      { title: 'Penyusunan quotation', description: 'Rincian transparan per item.' },
      { title: 'Invoicing', description: 'Dokumen resmi dan terarah.' },
      { title: 'Down payment', description: 'Mengunci jadwal vendor pilihan.' },
      { title: "Vendor's booked", description: 'Seluruh vendor utama secured.' },
      { title: 'Pendalaman konsep', description: 'Bersama Wedding Specialist.' },
    ],
    phaseTwo: [
      { title: 'Bride & Groom Meeting', description: 'Menyelaraskan visi, prioritas, dan keputusan bersama.' },
      { title: 'Attire Fitting', description: 'Koordinasi ukuran, fitting, dan finalisasi busana.' },
      { title: 'Moodboard Photo & Video', description: 'Menyusun arah visual untuk dokumentasi hari bahagia.' },
      { title: 'Moodboard Decoration', description: 'Menerjemahkan karakter pasangan menjadi ruang perayaan.' },
      { title: 'Food Tasting', description: 'Kurasi menu dan pengalaman jamuan untuk para tamu.' },
      { title: 'Family Meeting', description: 'Menyatukan kebutuhan keluarga dan detail protokoler.' },
      { title: 'Technical Meeting', description: 'Sinkronisasi seluruh vendor, venue, dan alur acara.' },
      { title: 'Wedding Day', description: 'Satu tim, satu pasangan, dan total focus sepanjang hari.' },
    ],
  },
  guardian: {
    title: 'Meet your Wedding Day Guardian.',
    description: 'Bukan sekadar mengoordinasikan tim. Wedding Director menyatukan keluarga dan seluruh vendor agar setiap elemen bergerak selaras—dari awal acara hingga momen terakhir.',
    family: [
      { title: 'Stage Manager', description: 'Mengarahkan pasangan, keluarga, dan pelaku acara di setiap rangkaian hingga sesi foto pelaminan.' },
      { title: "Family LO's", description: 'Menjadi penghubung utama antara keluarga besar, panitia keluarga, dan seluruh vendor.' },
      { title: 'Checker', description: 'Memastikan jumlah tamu, suvenir, undangan VIP, hidangan, dan detail hitungan acara tetap akurat.' },
      { title: 'Catering Checker', description: 'Mengantar dan mengatur tamu VIP saat bersalaman, berfoto, hingga menuju area bersantap.' },
      { title: 'Queue Coordinator', description: 'Menjaga antrean salam dan foto tetap rapi, lancar, dan tidak menumpuk.' },
      { title: 'VIP Concierge', description: 'Mendampingi tamu VIP menuju pelaminan dan area khusus dengan pelayanan personal.' },
    ],
    vendors: [
      { title: 'Bride Assistant', description: 'Menjadi pendamping pribadi yang membantu kebutuhan pengantin dan menjaga ketenangan sepanjang acara.' },
      { title: 'Frontliner', description: 'Menjadi pusat informasi di area penerima tamu sekaligus membantu tim usher mengatur kedatangan.' },
      { title: 'Area Controller', description: 'Memastikan pelaminan, buffet, area duduk, dan seluruh zona acara selalu tertata.' },
      { title: 'Photo Registrator', description: 'Mengatur antrean tamu yang ingin berfoto bersama agar sesi dokumentasi tersusun rapi.' },
      { title: 'MC Advisor', description: 'Memastikan konsep dan alur acara dipahami MC secara utuh sebelum eksekusi.' },
      { title: 'Content Creator', description: 'Mendokumentasikan momen-momen acara dalam konten real-time yang tetap selaras dengan cerita pernikahanmu.' },
    ],
  },
  services: [
    { title: 'Engagement Event', label: 'Engagement', image: '/assets/page_20_img_1.jpeg', alt: 'Pasangan merayakan pertunangan', description: 'Pengarahan acara lamaran atau engagement yang hangat, personal, dan memorable.', active: true },
    { title: 'Pengajian & Siraman', label: 'Pengajian · Siraman', image: '/assets/page_20_img_2.jpeg', alt: 'Prosesi pengajian dan siraman menjelang pernikahan', description: 'Acara pra-nikah yang tertata, khidmat, dan penuh makna sesuai adat serta kebutuhan keluarga.', active: true },
    { title: 'After Party', label: 'After party', image: '/assets/page_20_img_3.jpeg', alt: 'Pasangan menikmati after party pernikahan', description: 'Perayaan setelah akad dan resepsi untuk menikmati momen yang lebih lepas bersama orang-orang terdekat.', active: true },
    { title: 'Pre-wedding Companion', label: 'Pre-wedding', image: '/assets/page_20_img_4.jpeg', alt: 'Pasangan menjalani sesi pre-wedding di alam terbuka', description: 'Pendamping pribadi yang membantu kebutuhan dan keputusan kecil agar sesi pre-wedding terasa lebih ringan.', active: true },
  ],
  stories: [
    { title: 'Intimate celebration', label: 'Personal & meaningful', image: '/assets/promise-couple-hd.webp', alt: 'Pasangan merayakan momen pertunangan yang intim', description: 'Perayaan yang mengutamakan kedekatan, detail personal, dan pengalaman hangat bersama orang-orang terdekat.', active: true },
    { title: 'Classic wedding', label: 'Timeless & composed', image: '/assets/hero-wedding-hd.webp', alt: 'Pasangan pengantin FMO dalam perayaan bernuansa klasik', description: 'Rangkaian hari bahagia yang tertata rapi dengan visual klasik, alur tenang, dan koordinasi yang menyeluruh.', active: true },
    { title: 'Joyful gathering', label: 'Warm & expressive', image: '/assets/closing-couple-hd.webp', alt: 'Pasangan pengantin menikmati perayaan bersama tamu', description: 'Perayaan penuh energi yang tetap terasa personal karena setiap momen dan perpindahan acara telah dipersiapkan.', active: true },
  ],
  testimonial: {
    quote: 'Pelayanan FMO luar biasa dari awal sampai akhir acara. Semuanya berjalan lancar dan sesuai dengan apa yang direncanakan.',
    couple: 'Fathimah & Hisaan',
    label: 'FMO Couple',
    image: '/assets/closing-couple-hd.webp',
  },
  faq: [
    { question: 'Apakah aku bisa memilih vendor di luar list FMO?', answer: 'Bisa. Pernikahan ini tentang ceritamu. Di private consultation session, kami akan membantu kurasi, kalkulasi, serta menjabarkan setiap selisih harga secara transparan—tanpa biaya tersembunyi.', active: true },
    { question: 'Bisakah paket ditambah layanan khusus?', answer: 'Tentu. Kirab adat, photobooth, wedding effect, atau kebutuhan personal lain dapat diracik sesuai konsep dan prioritas perayaanmu.', active: true },
    { question: 'Bagaimana sistem termin pembayarannya?', answer: 'Kami menyediakan Flexi Installment Plan hingga 4 kali pembayaran dan Smart Express Plan dalam 2 kali pembayaran.', active: true },
    { question: 'Ke mana pembayaran dilakukan?', answer: 'Kamu dapat memilih one-gate payment melalui manajemen FMO atau direct payment ke vendor.', active: true },
    { question: 'Apakah FMO menerima dua acara dalam sehari?', answer: 'Tidak. Prinsip kami adalah 1 Day, 1 Client.', active: true },
    { question: 'Apakah FMO melayani di luar Bandung?', answer: 'Ya. Ceritakan kota dan rencana venue-mu saat konsultasi.', active: true },
  ],
  closing: {
    eyebrow: 'Begin your story',
    title: 'Let’s make your day',
    accent: 'expertly yours.',
    description: 'Mulai dari obrolan sederhana. Ceritakan impianmu, kami bantu menyusun jalannya.',
    buttonLabel: 'Jadwalkan konsultasi',
    image: '/assets/closing-couple-hd.webp',
  },
  gallery: Array.from({ length: 174 }, (_, index) => ({
    src: `/gallery/full/fmo-${String(index + 1).padStart(3, '0')}.webp`,
    alt: `Dokumentasi perayaan FMO ${String(index + 1).padStart(3, '0')}`,
    featured: index < 6,
  })),
  business: {
    whatsapp: '6281221212877',
    instagram: 'fmo_weddingspecialist',
    tiktok: 'fmo_weddingspecialist',
    address: 'Bandung, West Java',
    availability: 'Available beyond the city.',
    footerDescription: 'Wedding planning yang personal, transparan, dan sepenuh hati.',
    music: '/music/Sebusur%20Pelangi.mp3',
    musicEnabled: true,
  },
};

export type SiteContent = typeof defaultContent;

export function mergeSiteContent(value?: Partial<SiteContent> | null): SiteContent {
  if (!value) return structuredClone(defaultContent);
  return {
    ...structuredClone(defaultContent),
    ...value,
    seo: { ...defaultContent.seo, ...value.seo },
    hero: { ...defaultContent.hero, ...value.hero },
    about: { ...defaultContent.about, ...value.about },
    packages: (value.packages ?? defaultContent.packages).map((item) => {
      const fallback = defaultContent.packages.find((candidate) => candidate.id === item.id);
      return { ...fallback, ...item, media: item.media ?? fallback?.media ?? [] };
    }),
    workflow: {
      ...defaultContent.workflow,
      ...value.workflow,
      phaseOne: value.workflow?.phaseOne ?? defaultContent.workflow.phaseOne,
      phaseTwo: value.workflow?.phaseTwo ?? defaultContent.workflow.phaseTwo,
    },
    guardian: { ...defaultContent.guardian, ...value.guardian },
    testimonial: { ...defaultContent.testimonial, ...value.testimonial },
    closing: { ...defaultContent.closing, ...value.closing },
    business: { ...defaultContent.business, ...value.business },
  } as SiteContent;
}
