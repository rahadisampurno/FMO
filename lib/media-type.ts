type DetectedImageMediaType = {
  contentType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';
  extension: 'jpg' | 'png' | 'webp' | 'avif';
  kind: 'image';
};

type DetectedAudioMediaType = {
  contentType: 'audio/mpeg';
  extension: 'mp3';
  kind: 'audio';
};

export type DetectedMediaType = DetectedImageMediaType | DetectedAudioMediaType;

function matches(bytes: Uint8Array, signature: number[], offset = 0) {
  return signature.every((value, index) => bytes[offset + index] === value);
}

function ascii(bytes: Uint8Array, offset: number, length: number) {
  return String.fromCharCode(...bytes.slice(offset, offset + length));
}

export function detectMediaType(bytes: Uint8Array): DetectedMediaType | null {
  if (matches(bytes, [0xff, 0xd8, 0xff])) {
    return { contentType: 'image/jpeg', extension: 'jpg', kind: 'image' };
  }
  if (matches(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { contentType: 'image/png', extension: 'png', kind: 'image' };
  }
  if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') {
    return { contentType: 'image/webp', extension: 'webp', kind: 'image' };
  }
  if (ascii(bytes, 4, 4) === 'ftyp') {
    const brands = ascii(bytes, 8, Math.min(24, Math.max(0, bytes.length - 8)));
    if (brands.includes('avif') || brands.includes('avis')) {
      return { contentType: 'image/avif', extension: 'avif', kind: 'image' };
    }
  }
  if (ascii(bytes, 0, 3) === 'ID3' || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0)) {
    return { contentType: 'audio/mpeg', extension: 'mp3', kind: 'audio' };
  }
  return null;
}

export async function detectBlobMediaType(blob: Blob) {
  const header = new Uint8Array(await blob.slice(0, 32).arrayBuffer());
  return detectMediaType(header);
}
