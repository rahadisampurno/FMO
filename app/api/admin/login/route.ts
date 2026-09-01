import { NextResponse } from 'next/server';
import { adminSessionCookie, createAdminSession, publicOrigin, safeReturnTo, verifyAdminCredentials } from '@/lib/admin-auth';
import { checkLoginRateLimit, clearLoginFailures, recordFailedLogin } from '@/lib/admin-login-rate-limit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const origin = publicOrigin(request);
  const rateLimit = await checkLoginRateLimit(request);
  if (!rateLimit.allowed) {
    const response = NextResponse.redirect(new URL('/admin/login?error=locked', origin), 303);
    response.headers.set('retry-after', String(rateLimit.retryAfter));
    response.headers.set('cache-control', 'no-store');
    return response;
  }
  const form = await request.formData();
  const username = String(form.get('username') || '');
  const password = String(form.get('password') || '');
  const returnTo = safeReturnTo(String(form.get('return_to') || '/admin'));
  if (!await verifyAdminCredentials(username, password)) {
    await recordFailedLogin(rateLimit.loginKey);
    const response = NextResponse.redirect(new URL(`/admin/login?error=1&return_to=${encodeURIComponent(returnTo)}`, origin), 303);
    response.headers.set('cache-control', 'no-store');
    return response;
  }
  await clearLoginFailures(rateLimit.loginKey);
  const response = NextResponse.redirect(new URL(returnTo, origin), 303);
  response.cookies.set(adminSessionCookie(await createAdminSession(username), origin.startsWith('https://')));
  response.headers.set('cache-control', 'no-store');
  return response;
}
