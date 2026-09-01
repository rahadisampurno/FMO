import { NextResponse } from 'next/server';
import { expiredAdminSessionCookie, publicOrigin } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const origin = publicOrigin(request);
  const response = NextResponse.redirect(new URL('/admin/login', origin), 303);
  response.cookies.set(expiredAdminSessionCookie(origin.startsWith('https://')));
  return response;
}
