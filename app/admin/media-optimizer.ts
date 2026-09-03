const acceptedStoredImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
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

function canvasToWebp(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
}

async function loadImage(file: File): Promise<LoadedImage> {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(file, { imageOrientation: 'from-image' });
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = 'async';
    image.src = objectUrl;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function prepareMediaUpload(file: File): Promise<PreparedMedia> {
  if (!file.type.startsWith('image/')) {
    if (file.type !== 'audio/mpeg') throw new Error('unsupported_file');
    if (file.size > MAX_AUDIO_BYTES) throw new Error('audio_too_large');
    return { file, optimized: false };
  }

  if (file.size > MAX_SOURCE_IMAGE_BYTES) throw new Error('source_too_large');

  let image: LoadedImage;
  try {
    image = await loadImage(file);
  } catch {
    throw new Error('image_decode_failed');
  }

  try {
    if (!image.width || !image.height) throw new Error('image_decode_failed');

    const initialSize = calculateContainDimensions(image.width, image.height);
    if (
      acceptedStoredImageTypes.has(file.type) &&
      file.size <= TARGET_IMAGE_BYTES &&
      initialSize.width === image.width &&
      initialSize.height === image.height
    ) {
      return { file, width: image.width, height: image.height, optimized: false };
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) throw new Error('image_processing_failed');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    let outputWidth = initialSize.width;
    let outputHeight = initialSize.height;
    let smallestResult: { blob: Blob; width: number; height: number } | null = null;

    while (Math.max(outputWidth, outputHeight) >= 960) {
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(image, 0, 0, outputWidth, outputHeight);

      const qualitySteps = Math.max(outputWidth, outputHeight) === 960
        ? [...preferredImageQualitySteps, ...fallbackImageQualitySteps]
        : preferredImageQualitySteps;
      for (const quality of qualitySteps) {
        const blob = await canvasToWebp(canvas, quality);
        if (!blob || blob.type !== 'image/webp') continue;
        if (!smallestResult || blob.size < smallestResult.blob.size) {
          smallestResult = { blob, width: outputWidth, height: outputHeight };
        }
        if (blob.size <= TARGET_IMAGE_BYTES) {
          const baseName = file.name.replace(/\.[^.]+$/, '') || 'fmo-image';
          return {
            file: new File([blob], `${baseName}.webp`, { type: 'image/webp', lastModified: Date.now() }),
            width: outputWidth,
            height: outputHeight,
            optimized: true,
          };
        }
      }

      const currentMaxEdge = Math.max(outputWidth, outputHeight);
      const nextMaxEdge = Math.max(960, Math.round(currentMaxEdge * 0.85));
      const resizeScale = nextMaxEdge / currentMaxEdge;
      const nextWidth = Math.max(1, Math.round(outputWidth * resizeScale));
      const nextHeight = Math.max(1, Math.round(outputHeight * resizeScale));
      if (nextWidth === outputWidth && nextHeight === outputHeight) break;
      outputWidth = nextWidth;
      outputHeight = nextHeight;
    }

    if (smallestResult && smallestResult.blob.size <= 950_000) {
      const baseName = file.name.replace(/\.[^.]+$/, '') || 'fmo-image';
      return {
        file: new File([smallestResult.blob], `${baseName}.webp`, { type: 'image/webp', lastModified: Date.now() }),
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
