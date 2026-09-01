import type { RowDataPacket } from 'mysql2';
import { ensureDatabaseSchema, getDatabase } from '@/lib/database';
import { defaultContent, mergeSiteContent, type SiteContent } from '@/src/content';

const contentId = 'main';

type SiteContentRow = RowDataPacket & { payload: string };

export async function readSiteContent(): Promise<SiteContent> {
  try {
    await ensureDatabaseSchema();
    const [rows] = await getDatabase().execute<SiteContentRow[]>('SELECT payload FROM site_content WHERE id = ? LIMIT 1', [contentId]);
    return rows[0]?.payload ? mergeSiteContent(JSON.parse(rows[0].payload)) : mergeSiteContent(defaultContent);
  } catch {
    return mergeSiteContent(defaultContent);
  }
}

export async function writeSiteContent(content: SiteContent, updatedBy: string) {
  await ensureDatabaseSchema();
  const normalized = mergeSiteContent(content);
  const now = new Date().toISOString();
  await getDatabase().execute(`INSERT INTO site_content (id, payload, version, updated_at, updated_by)
    VALUES (?, ?, 1, ?, ?)
    ON DUPLICATE KEY UPDATE payload = ?, version = version + 1, updated_at = ?, updated_by = ?`,
    [contentId, JSON.stringify(normalized), now, updatedBy, JSON.stringify(normalized), now, updatedBy]);
  return { content: normalized, updatedAt: now };
}
