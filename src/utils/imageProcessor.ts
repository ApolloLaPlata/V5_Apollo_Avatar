/**
 * V5 Apollo Avatar - Canvas Image Processor
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * HTML5 Canvas Image Preprocessing, Proportional Resizing (maxDim 1024px) & JPEG Compression
 */

export interface ProcessedImageResult {
  dataUrl: string;
  width: number;
  height: number;
  originalSize: number;
  processedSize: number;
  compressionRatio: number;
  mimeType: string;
}

export interface ImageProcessingOptions {
  maxDim?: number;
  quality?: number;
  mimeType?: 'image/jpeg' | 'image/png' | 'image/webp';
}

/**
 * Resizes and compresses an image file using an offscreen HTML5 Canvas
 */
export function processImageFile(
  file: File,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImageResult> {
  const {
    maxDim = 1024,
    quality = 0.8,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('O arquivo selecionado não é uma imagem válida.'));
    }

    const originalSize = file.size;
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Falha ao ler o arquivo de imagem.'));

    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();

      img.onerror = () => reject(new Error('Falha ao decodificar a imagem.'));

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Proportional resize preserving aspect ratio
        if (width > height && width > maxDim) {
          height = Math.round(height * (maxDim / width));
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round(width * (maxDim / height));
          height = maxDim;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          return reject(new Error('Contexto 2D do Canvas HTML5 indisponível.'));
        }

        // Fill background with neutral clean tone if converting to JPEG
        if (mimeType === 'image/jpeg') {
          ctx.fillStyle = '#0a0a0a';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL(mimeType, quality);
        
        // Approximate processed byte size from base64
        const stringLength = dataUrl.length - `data:${mimeType};base64,`.length;
        const processedSize = Math.round((stringLength * 3) / 4);
        const compressionRatio = Math.max(0, Math.round(((originalSize - processedSize) / originalSize) * 100));

        resolve({
          dataUrl,
          width,
          height,
          originalSize,
          processedSize,
          compressionRatio,
          mimeType,
        });
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes into human readable format
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
