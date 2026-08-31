'use client';

import { useMemo, useRef, useState } from 'react';
import type { SiteContent } from '@/src/content';

type ContentKey = keyof SiteContent;
type JsonObject = Record<string, unknown>;

const modules: Array<{ id: ContentKey; label: string; description: string }> = [
  { id: 'hero', label: 'Beranda', description: 'Headline, foto utama, dan tombol pembuka.' },
  { id: 'about', label: 'Tentang FMO', description: 'Cerita brand dan statistik utama.' },
  { id: 'specialists', label: 'Tim Specialist', description: 'Profil, foto, jabatan, dan Instagram.' },
  { id: 'packages', label: 'Packages', description: 'Kapasitas, benefit, dan paket aktif.' },
  { id: 'workflow', label: 'Workflow', description: 'Tahapan Phase One dan Phase Two.' },
  { id: 'guardian', label: 'Wedding Day Guardian', description: 'Peran tim keluarga dan vendor.' },
  { id: 'services', label: 'Other Services', description: 'Layanan tambahan dan gambar pendukung.' },
  { id: 'stories', label: 'Stories', description: 'Portfolio perayaan terpilih.' },
  { id: 'testimonial', label: 'Testimonial', description: 'Kutipan dan identitas pasangan.' },
  { id: 'faq', label: 'FAQ', description: 'Pertanyaan yang sering diajukan.' },
  { id: 'closing', label: 'CTA Penutup', description: 'Ajakan konsultasi di akhir halaman.' },
  { id: 'gallery', label: 'Gallery', description: 'Foto koleksi dan pilihan halaman depan.' },
  { id: 'business', label: 'Informasi Bisnis', description: 'Kontak, media sosial, alamat, dan musik.' },
  { id: 'seo', label: 'SEO & Sharing', description: 'Judul Google, deskripsi, dan gambar share.' },
];

const labels: Record<string, string> = {
  title: 'Judul', accent: 'Teks aksen', eyebrow: 'Label kecil', description: 'Deskripsi', lead: 'Paragraf pembuka',
  primaryCta: 'Tombol utama', secondaryCta: 'Tombol kedua', linkLabel: 'Label tautan', image: 'Gambar', imageAlt: 'Alt text gambar',
  value: 'Nilai', label: 'Label', name: 'Nama', role: 'Jabatan', instagram: 'Instagram', active: 'Tampilkan di website',
  id: 'ID paket', kicker: 'Label paket', guests: 'Kapasitas tamu', note: 'Ringkasan', features: 'Benefit', question: 'Pertanyaan',
  answer: 'Jawaban', quote: 'Isi testimoni', couple: 'Nama pasangan', buttonLabel: 'Label tombol', src: 'File gambar', featured: 'Tampilkan di halaman depan',
  whatsapp: 'Nomor WhatsApp', tiktok: 'TikTok', address: 'Alamat', availability: 'Area layanan', footerDescription: 'Deskripsi footer',
  music: 'File musik', musicEnabled: 'Aktifkan musik', shareImage: 'Gambar share', alt: 'Alt text',
};

const sectionLabels: Record<string, string> = { phaseOne: 'Phase One', phaseTwo: 'Phase Two', family: 'Panitia keluarga', vendors: "Vendor's team", statistics: 'Statistik' };
const longFields = new Set(['description', 'lead', 'answer', 'quote', 'note', 'footerDescription']);
const mediaFields = new Set(['image', 'src', 'shareImage', 'music']);
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export default function AdminDashboard({ initialContent, adminName, adminEmail }: { initialContent: SiteContent; adminName: string; adminEmail: string }) {
  const [content, setContent] = useState(() => clone(initialContent));
  const [activeModule, setActiveModule] = useState<ContentKey>('hero');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [dirty, setDirty] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const activeMeta = useMemo(() => modules.find((item) => item.id === activeModule)!, [activeModule]);

  const updateModule = (value: unknown) => {
    setContent((current) => ({ ...current, [activeModule]: value }));
    setDirty(true);
    setStatus('idle');
  };

  const save = async () => {
    setStatus('saving');
    try {
      const response = await fetch('/api/admin/content', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ content }) });
      if (!response.ok) throw new Error('save_failed');
      const result = await response.json() as { content: SiteContent };
      setContent(result.content);
      setDirty(false);
      setStatus('saved');
    } catch { setStatus('error'); }
  };

  return (
    <main className="admin-shell">
      <aside className={`admin-sidebar ${mobileNav ? 'is-open' : ''}`}>
        <div className="admin-brand"><img src="/logo.png" alt="FMO" /><div><strong>Content Studio</strong><span>Admin dashboard</span></div></div>
        <nav aria-label="Modul konten">
          {modules.map((item) => <button type="button" className={item.id === activeModule ? 'is-active' : ''} onClick={() => { setActiveModule(item.id); setMobileNav(false); }} key={item.id}><span>{item.label}</span><small>{item.description}</small></button>)}
        </nav>
        <div className="admin-user"><span>{adminName}</span><small>{adminEmail}</small><a href="/signout-with-chatgpt?return_to=/admin" target="_top">Keluar</a></div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <button className="admin-menu" type="button" onClick={() => setMobileNav((value) => !value)} aria-label="Buka menu">☰</button>
          <div><span>FMO Content Studio</span><h1>{activeMeta.label}</h1><p>{activeMeta.description}</p></div>
          <div className="admin-actions"><a href="/" target="_blank">Preview website ↗</a><button type="button" onClick={save} disabled={!dirty || status === 'saving'}>{status === 'saving' ? 'Menyimpan…' : 'Simpan perubahan'}</button></div>
        </header>
        {status === 'saved' && <div className="admin-notice success" role="status">Perubahan sudah dipublikasikan ke website.</div>}
        {status === 'error' && <div className="admin-notice error" role="alert">Perubahan belum tersimpan. Coba kembali.</div>}
        <div className="admin-editor">
          <ModuleEditor value={content[activeModule]} onChange={updateModule} moduleId={activeModule} />
        </div>
      </section>
    </main>
  );
}

function ModuleEditor({ value, onChange, moduleId }: { value: unknown; onChange: (value: unknown) => void; moduleId: ContentKey }) {
  if (Array.isArray(value)) return <CollectionEditor value={value} onChange={onChange} title={modules.find((item) => item.id === moduleId)?.label || ''} />;
  const object = value as JsonObject;
  const nestedKeys = Object.keys(object).filter((key) => Array.isArray(object[key]) && typeof (object[key] as unknown[])[0] === 'object');
  const primitiveKeys = Object.keys(object).filter((key) => !nestedKeys.includes(key));
  return <div className="admin-module"><div className="admin-card"><h2>Konten utama</h2><div className="admin-field-grid">{primitiveKeys.map((key) => <ContentField key={key} fieldKey={key} value={object[key]} onChange={(next) => onChange({ ...object, [key]: next })} />)}</div></div>{nestedKeys.map((key) => <CollectionEditor key={key} title={sectionLabels[key] || labels[key] || key} value={object[key] as JsonObject[]} onChange={(next) => onChange({ ...object, [key]: next })} />)}</div>;
}

function CollectionEditor({ value, onChange, title }: { value: JsonObject[]; onChange: (value: JsonObject[]) => void; title: string }) {
  const add = () => {
    const template = value[0] ? Object.fromEntries(Object.entries(value[0]).map(([key, entry]) => [key, Array.isArray(entry) ? [] : typeof entry === 'boolean' ? true : ''])) : { title: '', description: '', active: true };
    onChange([...value, template]);
  };
  const update = (index: number, key: string, next: unknown) => onChange(value.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: next } : item));
  const move = (index: number, direction: number) => { const target = index + direction; if (target < 0 || target >= value.length) return; const next = [...value]; [next[index], next[target]] = [next[target], next[index]]; onChange(next); };
  return <section className="admin-card admin-collection"><div className="admin-card__heading"><div><h2>{title}</h2><p>{value.length} item</p></div><button type="button" onClick={add}>+ Tambah item</button></div><div className="admin-item-list">{value.map((item, index) => <article className="admin-item" key={`${title}-${index}`}><header><strong>{String(item.title || item.name || item.question || item.label || `Item ${index + 1}`)}</strong><div><button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Naikkan urutan">↑</button><button type="button" onClick={() => move(index, 1)} disabled={index === value.length - 1} aria-label="Turunkan urutan">↓</button><button type="button" className="danger" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}>Hapus</button></div></header><div className="admin-field-grid">{Object.entries(item).map(([key, entry]) => <ContentField fieldKey={key} value={entry} onChange={(next) => update(index, key, next)} key={key} />)}</div></article>)}</div></section>;
}

function ContentField({ fieldKey, value, onChange }: { fieldKey: string; value: unknown; onChange: (value: unknown) => void }) {
  if (typeof value === 'boolean') return <label className="admin-toggle"><input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} /><span>{labels[fieldKey] || fieldKey}</span></label>;
  if (Array.isArray(value)) return <label className="admin-field admin-field--wide"><span>{labels[fieldKey] || fieldKey}</span><textarea value={value.join('\n')} onChange={(event) => onChange(event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))} rows={Math.max(4, value.length)} /><small>Satu item per baris.</small></label>;
  if (mediaFields.has(fieldKey)) return <MediaField fieldKey={fieldKey} value={String(value ?? '')} onChange={onChange} />;
  const common = { value: String(value ?? ''), onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value) };
  return <label className={`admin-field ${longFields.has(fieldKey) ? 'admin-field--wide' : ''}`}><span>{labels[fieldKey] || fieldKey}</span>{longFields.has(fieldKey) ? <textarea {...common} rows={4} /> : <input {...common} disabled={fieldKey === 'id'} />}{fieldKey === 'id' && <small>ID paket dikunci agar tautan dan rekomendasi tetap aman.</small>}</label>;
}

function MediaField({ fieldKey, value, onChange }: { fieldKey: string; value: string; onChange: (value: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const upload = async (file?: File) => {
    if (!file) return;
    setUploading(true); setError(false);
    try {
      const preparedFile = await prepareUpload(file);
      const body = new FormData(); body.append('file', preparedFile);
      const response = await fetch('/api/admin/media', { method: 'POST', body });
      if (!response.ok) throw new Error('upload_failed');
      const result = await response.json() as { url: string }; onChange(result.url);
    } catch { setError(true); } finally { setUploading(false); }
  };
  return <div className="admin-field admin-field--wide admin-media"><span>{labels[fieldKey] || fieldKey}</span><div>{value && fieldKey !== 'music' && <img src={value} alt="Preview media" />}<label><input value={value} onChange={(event) => onChange(event.target.value)} /><button type="button" onClick={() => inputRef.current?.click()}>{uploading ? 'Mengoptimalkan…' : 'Pilih file'}</button><input ref={inputRef} type="file" hidden accept={fieldKey === 'music' ? 'audio/mpeg' : 'image/jpeg,image/png,image/webp,image/avif'} onChange={(event) => upload(event.target.files?.[0])} /></label>{error && <small className="error-text">Upload gagal. Gambar akan dioptimalkan otomatis; file audio maksimum 900 KB.</small>}</div></div>;
}

async function prepareUpload(file: File) {
  if (!file.type.startsWith('image/')) {
    if (file.size > 900_000) throw new Error('file_too_large');
    return file;
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82));
  if (!blob || blob.size > 950_000) throw new Error('image_too_large');
  return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp' });
}
