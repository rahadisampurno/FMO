import type { Metadata } from 'next';
import { headers } from 'next/headers';
import App from '@/src/App';
import { readSiteContent } from '@/lib/content-store';

export const dynamic = 'force-dynamic';

const canonicalOrigin = new URL('https://darkred-gorilla-538357.hostingersite.com');
const trustedOrigins = new Map([
  [canonicalOrigin.host, canonicalOrigin],
  ['fmo-wedding-specialist.rahadi-rahasia.chatgpt.site', new URL('https://fmo-wedding-specialist.rahadi-rahasia.chatgpt.site')],
]);

export async function generateMetadata(): Promise<Metadata> {
  const content = await readSiteContent();
  const requestHeaders = await headers();
  const requestHost = (requestHeaders.get('x-forwarded-host') || requestHeaders.get('host') || '').split(',')[0].trim().toLowerCase();
  const metadataBase = trustedOrigins.get(requestHost) || canonicalOrigin;
  return {
    metadataBase,
    title: content.seo.title,
    description: content.seo.description,
    alternates: { canonical: '/' },
    openGraph: { title: content.seo.title, description: content.seo.description, url: '/', images: [content.seo.shareImage] },
    twitter: { card: 'summary_large_image', title: content.seo.title, description: content.seo.description, images: [content.seo.shareImage] },
  };
}

export default async function HomePage() {
  const content = await readSiteContent();
  return <App initialContent={content} />;
}
