import type { RowDataPacket } from 'mysql2';
import { ensureDatabaseSchema, getDatabase } from '@/lib/database';
import { detectMediaType } from '@/lib/media-type';

export const runtime = 'nodejs';

type MediaRow = RowDataPacket & { content_type: string; payload: Buffer; etag: string };

export async function GET(request: Request, context: { params: Promise<{ key: string[] }> }) {
  const { key } = await context.params;
  const mediaKey = key.join('/');
  if (!mediaKey || mediaKey.length > 255) return new Response('Not found', { status: 404 });
  try {
    await ensureDatabaseSchema();
    const [rows] = await getDatabase().execute<MediaRow[]>(
      'SELECT content_type, payload, etag FROM media_files WHERE media_key = ? LIMIT 1',
      [mediaKey],
    );
    const object = rows[0];
    if (!object) return new Response('Not found', { status: 404 });
    const detectedType = detectMediaType(object.payload.subarray(0, 32));
    const etag = `"${object.etag}"`;
    const headers = new Headers({
      'content-type': detectedType?.contentType || object.content_type,
      'content-length': String(object.payload.length),
      'etag': etag,
      'cache-control': 'public, max-age=31536000, immutable',
      'x-content-type-options': 'nosniff',
    });
    if (request.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers });
    return new Response(new Uint8Array(object.payload), { headers });
  } catch {
    return new Response('Storage unavailable', { status: 503, headers: { 'cache-control': 'no-store' } });
  }
}
