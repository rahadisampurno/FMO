import type { Metadata } from 'next';
import '@/src/index.css';
import './admin.css';

export const metadata: Metadata = {
  title: 'FMO Wedding Specialist',
  description: 'Wedding planning yang personal, transparan, dan sepenuh hati.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
