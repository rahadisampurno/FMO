import { env } from 'cloudflare:workers';
import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin-auth';

const allowedTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
  ['audio/mpeg', 'mp3'],
]);

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'file_required' }, { status: 400 });
  const extension = allowedTypes.get(file.type);
  if (!extension || file.size > 950_000) return NextResponse.json({ error: 'invalid_file' }, { status: 400 });
  const key = `${file.type.startsWith('audio/') ? 'audio' : 'images'}/${crypto.randomUUID()}.${extension}`;
  await env.FILES.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type }, customMetadata: { uploadedBy: user.email } });
  return NextResponse.json({ ok: true, url: `/api/media/${key}` });
}
