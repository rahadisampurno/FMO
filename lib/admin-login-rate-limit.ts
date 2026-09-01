import type { RowDataPacket } from 'mysql2';
import { ensureDatabaseSchema, getDatabase } from '@/lib/database';

const MAX_FAILURES = 5;
const WINDOW_SECONDS = 15 * 60;

type LoginAttemptRow = RowDataPacket & { failures: number; blocked_until: number; updated_at: number };

export async function checkLoginRateLimit(request: Request) {
  try {
    await ensureDatabaseSchema();
    const loginKey = await requestKey(request);
    const now = Math.floor(Date.now() / 1000);
    const [rows] = await getDatabase().execute<LoginAttemptRow[]>(
      'SELECT failures, blocked_until, updated_at FROM admin_login_attempts WHERE login_key = ? LIMIT 1',
      [loginKey],
    );
    const row = rows[0];
    if (row?.blocked_until && row.blocked_until > now) return { allowed: false, loginKey, retryAfter: row.blocked_until - now };
    return { allowed: true, loginKey, retryAfter: 0 };
  } catch {
    return { allowed: true, loginKey: '', retryAfter: 0 };
  }
}

export async function recordFailedLogin(loginKey: string) {
  if (!loginKey) return;
  try {
    await ensureDatabaseSchema();
    const now = Math.floor(Date.now() / 1000);
    await getDatabase().execute(`INSERT INTO admin_login_attempts (login_key, failures, blocked_until, updated_at)
      VALUES (?, 1, 0, ?)
      ON DUPLICATE KEY UPDATE
        blocked_until = CASE
          WHEN blocked_until > ? THEN blocked_until
          WHEN ? - updated_at <= ? AND failures + 1 >= ? THEN ? + ?
          ELSE 0
        END,
        failures = CASE
          WHEN blocked_until > ? THEN failures
          WHEN ? - updated_at > ? THEN 1
          ELSE failures + 1
        END,
        updated_at = ?`,
      [loginKey, now, now, now, WINDOW_SECONDS, MAX_FAILURES, now, WINDOW_SECONDS, now, now, WINDOW_SECONDS, now]);
  } catch { /* Login remains available if the limiter store is temporarily unavailable. */ }
}

export async function clearLoginFailures(loginKey: string) {
  if (!loginKey) return;
  try {
    await ensureDatabaseSchema();
    await getDatabase().execute('DELETE FROM admin_login_attempts WHERE login_key = ?', [loginKey]);
  } catch { /* Best effort cleanup. */ }
}

async function requestKey(request: Request) {
  const forwarded = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(forwarded));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
