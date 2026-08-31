import { NextResponse } from 'next/server';
import { expiredAdminSessionCookie } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const response = NextResponse.redirect(new URL('/admin/login', origin), 303);
  response.cookies.set(expiredAdminSessionCookie(origin.startsWith('https://')));
  return response;
}
