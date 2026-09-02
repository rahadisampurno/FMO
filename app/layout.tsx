import type { Metadata } from 'next';
import '@/src/index.css';
import './admin.css';

export const metadata: Metadata = {
  title: 'FMO Wedding Specialist',
  description: 'Wedding planning yang personal, transparan, dan sepenuh hati.',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-fmo-v2.svg', type: 'image/svg+xml' },
      { url: '/favicon-32-v2.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon-32-v2.png',
    apple: [{ url: '/apple-touch-icon-v2.png', sizes: '180x180', type: 'image/png' }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
