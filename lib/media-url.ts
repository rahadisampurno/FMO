const mediaCacheVersion = '20260903b';

export function withMediaVersion(url: string) {
  if (!url.startsWith('/api/media/')) return url;
  return `${url}${url.includes('?') ? '&' : '?'}v=${mediaCacheVersion}`;
}
