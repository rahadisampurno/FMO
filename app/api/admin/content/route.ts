import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin-auth';
import { readSiteContent, writeSiteContent } from '@/lib/content-store';
import type { SiteContent } from '@/src/content';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json({ content: await readSiteContent() });
}

export async function PUT(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => null) as { content?: SiteContent } | null;
  if (!body?.content || typeof body.content !== 'object') return NextResponse.json({ error: 'invalid_content' }, { status: 400 });
  const result = await writeSiteContent(body.content, user.email);
  return NextResponse.json({ ok: true, ...result });
}
