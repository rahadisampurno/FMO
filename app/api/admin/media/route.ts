import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/admin-auth';
import { ensureDatabaseSchema, getDatabase } from '@/lib/database';

export const runtime = 'nodejs';

const allowedTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
  ['audio/mpeg', 'mp3'],
]);
const maxStoredFileSize = 950_000;
const maxRequestSize = 1_100_000;

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > maxRequestSize) {
    return NextResponse.json({ error: 'file_too_large' }, { status: 413 });
  }
  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'file_required' }, { status: 400 });
  const extension = allowedTypes.get(file.type);
  if (!extension) return NextResponse.json({ error: 'unsupported_file' }, { status: 415 });
  if (file.size > maxStoredFileSize) return NextResponse.json({ error: 'file_too_large' }, { status: 413 });
  const key = `${file.type.startsWith('audio/') ? 'audio' : 'images'}/${crypto.randomUUID()}.${extension}`;
  const payload = Buffer.from(await file.arrayBuffer());
  const etag = createHash('sha256').update(payload).digest('hex');
  try {
    await ensureDatabaseSchema();
    await getDatabase().execute(
      'INSERT INTO media_files (media_key, content_type, payload, etag, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [key, file.type, payload, etag, user.email, new Date().toISOString()],
    );
    return NextResponse.json({ ok: true, url: `/api/media/${key}` });
  } catch (error) {
    console.error(
      'Admin media upload failed',
      error instanceof Error ? error.message : 'unknown error',
    );
    return NextResponse.json({ error: 'storage_unavailable' }, { status: 503 });
  }
}
