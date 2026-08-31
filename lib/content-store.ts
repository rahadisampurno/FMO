import { env } from 'cloudflare:workers';
import { defaultContent, mergeSiteContent, type SiteContent } from '@/src/content';

const contentId = 'main';

async function ensureTable() {
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS site_content (
    id TEXT PRIMARY KEY NOT NULL,
    payload TEXT NOT NULL,
    version INTEGER DEFAULT 1 NOT NULL,
    updated_at TEXT NOT NULL,
    updated_by TEXT NOT NULL
  )`).run();
}

export async function readSiteContent(): Promise<SiteContent> {
  try {
    await ensureTable();
    const row = await env.DB.prepare('SELECT payload FROM site_content WHERE id = ?').bind(contentId).first<{ payload: string }>();
    return row?.payload ? mergeSiteContent(JSON.parse(row.payload)) : mergeSiteContent(defaultContent);
  } catch {
    return mergeSiteContent(defaultContent);
  }
}

export async function writeSiteContent(content: SiteContent, updatedBy: string) {
  await ensureTable();
  const normalized = mergeSiteContent(content);
  const now = new Date().toISOString();
  await env.DB.prepare(`INSERT INTO site_content (id, payload, version, updated_at, updated_by)
    VALUES (?, ?, 1, ?, ?)
    ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, version = site_content.version + 1,
      updated_at = excluded.updated_at, updated_by = excluded.updated_by`)
    .bind(contentId, JSON.stringify(normalized), now, updatedBy).run();
  return { content: normalized, updatedAt: now };
}
