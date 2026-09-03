import { detectBlobMediaType } from '@/lib/media-type';

const preferredImageQualitySteps = [0.9, 0.84, 0.78];
const fallbackImageQualitySteps = [0.72, 0.66, 0.58];

export const MAX_SOURCE_IMAGE_BYTES = 30_000_000;
export const MAX_IMAGE_EDGE = 2400;
export const TARGET_IMAGE_BYTES = 880_000;
export const MAX_AUDIO_BYTES = 900_000;

export type PreparedMedia = {
  file: File;
  width?: number;
  height?: number;
  optimized: boolean;
};

type LoadedImage = CanvasImageSource & { width: number; height: number; close?: () => void };

export function calculateContainDimensions(width: number, height: number, maxEdge = MAX_IMAGE_EDGE) {
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function formatFileSize(bytes: number) {
  if (bytes < 1_000_000) return `${Math.max(1, Math.round(bytes / 1_000))} KB`;
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

type EncodedImage = {
  blob: Blob;
  contentType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';
  extension: 'jpg' | 'png' | 'webp' | 'avif';
};

async function encodeCanvas(canvas: HTMLCanvasElement, quality: number): Promise<EncodedImage[]> {
  const candidates: EncodedImage[] = [];
  const preferredBlob = await canvasToBlob(canvas, 'image/webp', quality);
  const preferredType = preferredBlob ? await detectBlobMediaType(preferredBlob) : null;
  if (preferredBlob && preferredType?.kind === 'image') {
    candidates.push({
      blob: preferredBlob,
      contentType: preferredType.contentType,
      extension: preferredType.extension,
    });
  }
  if (preferredType?.contentType === 'image/webp') return candidates;

  const jpegCanvas = document.createElement('canvas');
  jpegCanvas.width = canvas.width;
  jpegCanvas.height = canvas.height;
  const jpegContext = jpegCanvas.getContext('2d', { alpha: false });
  if (!jpegContext) return candidates;
  jpegContext.fillStyle = '#ffffff';
  jpegContext.fillRect(0, 0, jpegCanvas.width, jpegCanvas.height);
  jpegContext.drawImage(canvas, 0, 0);
  const jpegBlob = await canvasToBlob(jpegCanvas, 'image/jpeg', quality);
  const jpegType = jpegBlob ? await detectBlobMediaType(jpegBlob) : null;
  if (jpegBlob && jpegType?.contentType === 'image/jpeg') {
    candidates.push({ blob: jpegBlob, contentType: 'image/jpeg', extension: 'jpg' });
  }
  return candidates;
}

async function loadImage(file: File): Promise<LoadedImage> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      try {
        return await createImageBitmap(file);
      } catch {
        // Continue with the image element decoder for files with legacy metadata.
      }
    }
  }

  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = 'async';
  image.src = objectUrl;
  await image.decode().catch(() => {
    URL.revokeObjectURL(objectUrl);
    throw new Error('image_decode_failed');
  });
  return Object.assign(image, { close: () => URL.revokeObjectURL(objectUrl) });
}

export async function prepareMediaUpload(file: File): Promise<PreparedMedia> {
  const detectedType = await detectBlobMediaType(file);
  if (!detectedType) {
    throw new Error(file.type.startsWith('image/') ? 'image_decode_failed' : 'unsupported_file');
  }
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'fmo-media';

  if (detectedType.kind === 'audio') {
    if (file.size > MAX_AUDIO_BYTES) throw new Error('audio_too_large');
    const normalizedAudio = file.type === detectedType.contentType
      ? file
      : new File([file], `${baseName}.${detectedType.extension}`, {
        type: detectedType.contentType,
        lastModified: file.lastModified,
      });
    return { file: normalizedAudio, optimized: normalizedAudio !== file };
  }

  if (file.size > MAX_SOURCE_IMAGE_BYTES) throw new Error('source_too_large');

  const normalizedFile = file.type === detectedType.contentType
    ? file
    : new File([file], `${baseName}.${detectedType.extension}`, {
      type: detectedType.contentType,
      lastModified: file.lastModified,
    });

  let image: LoadedImage;
  try {
    image = await loadImage(normalizedFile);
  } catch {
    throw new Error('image_decode_failed');
  }

  try {
    if (!image.width || !image.height) throw new Error('image_decode_failed');

    const initialSize = calculateContainDimensions(image.width, image.height);
    if (
      normalizedFile.size <= TARGET_IMAGE_BYTES &&
      initialSize.width === image.width &&
      initialSize.height === image.height
    ) {
      return {
        file: normalizedFile,
        width: image.width,
        height: image.height,
        optimized: normalizedFile !== file,
      };
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) throw new Error('image_processing_failed');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    let outputWidth = initialSize.width;
    let outputHeight = initialSize.height;
    let smallestResult: EncodedImage & { width: number; height: number } | null = null;

    while (true) {
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(image, 0, 0, outputWidth, outputHeight);

      const qualitySteps = Math.max(outputWidth, outputHeight) <= 960
        ? [...preferredImageQualitySteps, ...fallbackImageQualitySteps]
        : preferredImageQualitySteps;
      for (const quality of qualitySteps) {
        const candidates = await encodeCanvas(canvas, quality);
        for (const candidate of candidates) {
          if (!smallestResult || candidate.blob.size < smallestResult.blob.size) {
            smallestResult = { ...candidate, width: outputWidth, height: outputHeight };
          }
          if (candidate.blob.size <= TARGET_IMAGE_BYTES) {
            return {
              file: new File([candidate.blob], `${baseName}.${candidate.extension}`, {
                type: candidate.contentType,
                lastModified: Date.now(),
              }),
              width: outputWidth,
              height: outputHeight,
              optimized: true,
            };
          }
        }
      }

      const currentMaxEdge = Math.max(outputWidth, outputHeight);
      if (currentMaxEdge <= 960) break;
      const nextMaxEdge = Math.max(960, Math.round(currentMaxEdge * 0.85));
      const resizeScale = nextMaxEdge / currentMaxEdge;
      const nextWidth = Math.max(1, Math.round(outputWidth * resizeScale));
      const nextHeight = Math.max(1, Math.round(outputHeight * resizeScale));
      if (nextWidth === outputWidth && nextHeight === outputHeight) break;
      outputWidth = nextWidth;
      outputHeight = nextHeight;
    }

    if (smallestResult && smallestResult.blob.size <= 950_000) {
      return {
        file: new File([smallestResult.blob], `${baseName}.${smallestResult.extension}`, {
          type: smallestResult.contentType,
          lastModified: Date.now(),
        }),
        width: smallestResult.width,
        height: smallestResult.height,
        optimized: true,
      };
    }
    throw new Error('image_processing_failed');
  } finally {
    image.close?.();
  }
}

export function getMediaUploadError(error: unknown) {
  const code = error instanceof Error ? error.message : '';
  if (code === 'source_too_large') return 'Ukuran foto asli maksimal 30 MB. Resolusi akan disesuaikan otomatis.';
  if (code === 'audio_too_large') return 'File audio maksimal 900 KB.';
  if (code === 'unsupported_file') return 'Format file belum didukung.';
  if (code === 'image_decode_failed') return 'Foto tidak dapat dibaca. Gunakan JPG, PNG, WebP, atau AVIF yang valid.';
  if (code === 'unauthorized') return 'Sesi admin berakhir. Silakan masuk kembali lalu ulangi upload.';
  if (code === 'file_too_large') return 'Hasil optimasi masih terlalu besar. Silakan coba foto lain.';
  if (code === 'storage_unavailable') return 'Penyimpanan sedang tidak tersedia. Coba kembali beberapa saat lagi.';
  return 'Upload gagal. Periksa koneksi lalu coba lagi.';
}
