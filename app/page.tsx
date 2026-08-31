import type { Metadata } from 'next';
import App from '@/src/App';
import { readSiteContent } from '@/lib/content-store';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const content = await readSiteContent();
  return {
    title: content.seo.title,
    description: content.seo.description,
    openGraph: { title: content.seo.title, description: content.seo.description, images: [content.seo.shareImage] },
    twitter: { card: 'summary_large_image', title: content.seo.title, description: content.seo.description, images: [content.seo.shareImage] },
  };
}

export default async function HomePage() {
  const content = await readSiteContent();
  return <App initialContent={content} />;
}
