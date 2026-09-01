import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/database';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    await checkDatabaseConnection();
    return NextResponse.json({ status: 'ok' }, { headers: { 'cache-control': 'no-store' } });
  } catch {
    return NextResponse.json({ status: 'unhealthy' }, { status: 503, headers: { 'cache-control': 'no-store' } });
  }
}
