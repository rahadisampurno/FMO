import { redirect } from 'next/navigation';
import { getAdminUser, safeReturnTo } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const returnTo = safeReturnTo(typeof params?.return_to === 'string' ? params.return_to : '/admin');
  if (await getAdminUser()) redirect(returnTo);
  const error = typeof params?.error === 'string' ? params.error : '';
  return <main className="admin-login"><section className="admin-login__card" aria-labelledby="admin-login-title"><img src="/logo.png" alt="FMO Wedding Specialist" /><span>FMO Content Studio</span><h1 id="admin-login-title">Admin login</h1><p>Masukkan akun Admin untuk mengelola konten website.</p><form action="/api/admin/login" method="post"><input type="hidden" name="return_to" value={returnTo} /><label><span>Username</span><input name="username" type="email" inputMode="email" autoComplete="username" maxLength={254} required autoFocus /></label><label><span>Password</span><input name="password" type="password" autoComplete="current-password" maxLength={256} required /></label>{error && <p className="admin-login__error" role="alert">{error === 'locked' ? 'Terlalu banyak percobaan. Coba kembali dalam 15 menit.' : 'Username atau password tidak sesuai.'}</p>}<button type="submit">Masuk ke dashboard</button></form><a href="/">← Kembali ke website</a></section></main>;
}
