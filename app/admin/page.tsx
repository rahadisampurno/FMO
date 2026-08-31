import { requireAdmin } from '@/lib/admin-auth';
import { readSiteContent } from '@/lib/content-store';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await requireAdmin('/admin');
  const content = await readSiteContent();
  return <AdminDashboard initialContent={content} adminName={user.displayName} adminEmail={user.email} />;
}
