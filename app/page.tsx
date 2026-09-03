import type { Metadata } from 'next';
import { headers } from 'next/headers';
import App from '@/src/App';
import { readSiteContent } from '@/lib/content-store';
import { withMediaVersion } from '@/lib/media-url';

export const dynamic = 'force-dynamic';

const canonicalOrigin = new URL('https://fmoweddingspecialist.com');
const trustedOrigins = new Map([
  [canonicalOrigin.host, canonicalOrigin],
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
    openGraph: { title: content.seo.title, description: content.seo.description, url: '/', images: [withMediaVersion(content.seo.shareImage)] },
    twitter: { card: 'summary_large_image', title: content.seo.title, description: content.seo.description, images: [withMediaVersion(content.seo.shareImage)] },
  };
}

export default async function HomePage() {
  const content = await readSiteContent();
  return <App initialContent={content} />;
}
