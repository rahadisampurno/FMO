import { NextResponse } from 'next/server';
import { adminSessionCookie, createAdminSession, safeReturnTo, verifyAdminCredentials } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const form = await request.formData();
  const username = String(form.get('username') || '');
  const password = String(form.get('password') || '');
  const returnTo = safeReturnTo(String(form.get('return_to') || '/admin'));
  const origin = new URL(request.url).origin;
  if (!await verifyAdminCredentials(username, password)) return NextResponse.redirect(new URL(`/admin/login?error=1&return_to=${encodeURIComponent(returnTo)}`, origin), 303);
  const response = NextResponse.redirect(new URL(returnTo, origin), 303);
  response.cookies.set(adminSessionCookie(await createAdminSession(username), origin.startsWith('https://')));
  return response;
}
