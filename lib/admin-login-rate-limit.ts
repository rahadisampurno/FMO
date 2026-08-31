import { env } from 'cloudflare:workers';

const MAX_FAILURES = 5;
const WINDOW_SECONDS = 15 * 60;

async function ensureTable() {
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS admin_login_attempts (
    login_key TEXT PRIMARY KEY NOT NULL,
    failures INTEGER DEFAULT 0 NOT NULL,
    blocked_until INTEGER DEFAULT 0 NOT NULL,
    updated_at INTEGER NOT NULL
  )`).run();
}

export async function checkLoginRateLimit(request: Request) {
  try {
    await ensureTable();
    const loginKey = await requestKey(request);
    const now = Math.floor(Date.now() / 1000);
    const row = await env.DB.prepare('SELECT failures, blocked_until, updated_at FROM admin_login_attempts WHERE login_key = ?')
      .bind(loginKey).first<{ failures: number; blocked_until: number; updated_at: number }>();
    if (row?.blocked_until && row.blocked_until > now) return { allowed: false, loginKey, retryAfter: row.blocked_until - now };
    return { allowed: true, loginKey, retryAfter: 0 };
  } catch {
    return { allowed: true, loginKey: '', retryAfter: 0 };
  }
}

export async function recordFailedLogin(loginKey: string) {
  if (!loginKey) return;
  try {
    await ensureTable();
    const now = Math.floor(Date.now() / 1000);
    await env.DB.prepare(`INSERT INTO admin_login_attempts (login_key, failures, blocked_until, updated_at)
      VALUES (?, 1, 0, ?)
      ON CONFLICT(login_key) DO UPDATE SET
        failures = CASE
          WHEN admin_login_attempts.blocked_until > ? THEN admin_login_attempts.failures
          WHEN ? - admin_login_attempts.updated_at > ? THEN 1
          ELSE admin_login_attempts.failures + 1
        END,
        blocked_until = CASE
          WHEN admin_login_attempts.blocked_until > ? THEN admin_login_attempts.blocked_until
          WHEN ? - admin_login_attempts.updated_at <= ? AND admin_login_attempts.failures + 1 >= ? THEN ? + ?
          ELSE 0
        END,
        updated_at = ?`)
      .bind(loginKey, now, now, now, WINDOW_SECONDS, now, now, WINDOW_SECONDS, MAX_FAILURES, now, WINDOW_SECONDS, now).run();
  } catch { /* Login remains available if the limiter store is temporarily unavailable. */ }
}

export async function clearLoginFailures(loginKey: string) {
  if (!loginKey) return;
  try { await env.DB.prepare('DELETE FROM admin_login_attempts WHERE login_key = ?').bind(loginKey).run(); } catch { /* Best effort cleanup. */ }
}

async function requestKey(request: Request) {
  const forwarded = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(forwarded));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
