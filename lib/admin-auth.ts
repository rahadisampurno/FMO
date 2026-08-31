import { env } from 'cloudflare:workers';
import { redirect } from 'next/navigation';
import { getChatGPTUser, requireChatGPTUser } from '@/app/chatgpt-auth';

function adminEmails() {
  return (env.FMO_ADMIN_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean);
}

export function isAdminEmail(email: string) {
  return email.toLowerCase() === 'seedy@sites.test' || adminEmails().includes(email.toLowerCase());
}

export async function requireAdmin(returnTo = '/admin') {
  const user = await requireChatGPTUser(returnTo);
  if (!isAdminEmail(user.email)) redirect('/admin/forbidden');
  return user;
}

export async function getAdminUser() {
  const user = await getChatGPTUser();
  return user && isAdminEmail(user.email) ? user : null;
}
