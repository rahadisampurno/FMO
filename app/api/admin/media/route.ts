import { env } from 'cloudflare:workers';
import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin-auth';

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'audio/mpeg']);

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'file_required' }, { status: 400 });
  if (!allowedTypes.has(file.type) || file.size > 950_000) return NextResponse.json({ error: 'invalid_file' }, { status: 400 });
  const extension = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'bin';
  const key = `${file.type.startsWith('audio/') ? 'audio' : 'images'}/${crypto.randomUUID()}.${extension}`;
  await env.FILES.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type }, customMetadata: { uploadedBy: user.email } });
  return NextResponse.json({ ok: true, url: `/api/media/${key}` });
}
