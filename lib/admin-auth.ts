import { env } from 'cloudflare:workers';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'fmo_admin_session';
const SESSION_SECONDS = 60 * 60 * 8;
const encoder = new TextEncoder();

type AdminUser = { email: string; displayName: string };

function runtimeEnv() {
  return env as unknown as Record<string, string | undefined>;
}

export function safeReturnTo(value?: string | null) {
  if (!value?.startsWith('/') || value.startsWith('//')) return '/admin';
  try {
    const url = new URL(value, 'https://app.local');
    if (url.origin !== 'https://app.local' || url.pathname.startsWith('/api/')) return '/admin';
    return `${url.pathname}${url.search}${url.hash}`;
  } catch { return '/admin'; }
}

export async function verifyAdminCredentials(username: string, password: string) {
  const configuredUsername = runtimeEnv().FMO_ADMIN_USERNAME?.trim().toLowerCase();
  const configuredHash = runtimeEnv().FMO_ADMIN_PASSWORD_HASH;
  if (!configuredUsername || !configuredHash || username.trim().toLowerCase() !== configuredUsername) return false;
  const [scheme, iterationsRaw, salt, expected] = configuredHash.split('$');
  const iterations = Number(iterationsRaw);
  if (scheme !== 'pbkdf2' || !iterations || !salt || !expected) return false;
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: fromBase64Url(salt), iterations }, key, 256);
  return constantTimeEqual(new Uint8Array(derived), fromBase64Url(expected));
}

export async function createAdminSession(username: string) {
  const secret = runtimeEnv().FMO_ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('admin_session_not_configured');
  const payload = toBase64Url(encoder.encode(JSON.stringify({ sub: username.trim().toLowerCase(), exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })));
  return `${payload}.${await sign(payload, secret)}`;
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  const username = await verifySession(token);
  return username ? { email: username, displayName: username.split('@')[0] || 'Admin FMO' } : null;
}

export async function requireAdmin(returnTo = '/admin') {
  const user = await getAdminUser();
  if (!user) redirect(`/admin/login?return_to=${encodeURIComponent(safeReturnTo(returnTo))}`);
  return user;
}

export function adminSessionCookie(value: string, secure: boolean) {
  return { name: COOKIE_NAME, value, httpOnly: true, secure, sameSite: 'strict' as const, path: '/', maxAge: SESSION_SECONDS };
}

export function expiredAdminSessionCookie(secure: boolean) {
  return { name: COOKIE_NAME, value: '', httpOnly: true, secure, sameSite: 'strict' as const, path: '/', maxAge: 0 };
}

async function verifySession(token?: string) {
  const secret = runtimeEnv().FMO_ADMIN_SESSION_SECRET;
  if (!token || !secret) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || !constantTimeEqual(fromBase64Url(signature), fromBase64Url(await sign(payload, secret)))) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as { sub?: string; exp?: number };
    const configuredUsername = runtimeEnv().FMO_ADMIN_USERNAME?.trim().toLowerCase();
    if (!data.sub || data.sub !== configuredUsername || !data.exp || data.exp <= Math.floor(Date.now() / 1000)) return null;
    return data.sub;
  } catch { return null; }
}

async function sign(payload: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toBase64Url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(payload))));
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
}

function toBase64Url(bytes: Uint8Array) {
  let value = '';
  for (const byte of bytes) value += String.fromCharCode(byte);
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  try {
    const binary = atob(normalized);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch { return new Uint8Array(); }
}
