/**
 * V5 Apollo Avatar - Turnaround Sheet Composer
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Offscreen HTML5 Canvas compositor for consolidated 4-angle 4:1 turnaround sheets
 */

export interface ComposeTurnaroundOptions {
  width?: number; // default 4096 or 2048
  height?: number; // default 1024 or 512
  characterName: string;
  seed?: number;
  includeGuidelines?: boolean;
  includeMetadataBanner?: boolean;
  mimeType?: 'image/png' | 'image/jpeg' | 'image/webp';
  quality?: number;
}

export interface ComposeAngleInput {
  frontUrl: string;
  threeQuarterUrl: string;
  profileUrl: string;
  backUrl: string;
}

/**
 * Loads an image from URL/dataURL as an HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Falha ao carregar imagem para composição: ${src.slice(0, 40)}...`));
    img.src = src;
  });
}

/**
 * Composes a single consolidated 4-angle horizontal model sheet
 */
export async function composeTurnaroundSheet(
  angles: ComposeAngleInput,
  options: ComposeTurnaroundOptions
): Promise<{ dataUrl: string; width: number; height: number; sizeBytes: number }> {
  const {
    width = 2048,
    height = 512,
    characterName,
    seed,
    includeGuidelines = true,
    includeMetadataBanner = true,
    mimeType = 'image/jpeg',
    quality = 0.9,
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Contexto 2D do Canvas indisponível.');

  // 1. Studio Backdrop Base
  ctx.fillStyle = '#0a0d17';
  ctx.fillRect(0, 0, width, height);

  // 2. Load all 4 angle images in parallel
  const [imgFront, imgThreeQuarter, imgProfile, imgBack] = await Promise.all([
    loadImage(angles.frontUrl),
    loadImage(angles.threeQuarterUrl),
    loadImage(angles.profileUrl),
    loadImage(angles.backUrl),
  ]);

  const images = [
    { img: imgFront, label: 'FRONTAL (0º)' },
    { img: imgThreeQuarter, label: '3/4 ESQUERDA (45º)' },
    { img: imgProfile, label: 'PERFIL (90º)' },
    { img: imgBack, label: 'COSTAS (180º)' },
  ];

  const colWidth = width / 4;
  const bannerHeight = includeMetadataBanner ? Math.round(height * 0.08) : 0;
  const usableHeight = height - bannerHeight;

  // 3. Draw each column
  images.forEach((item, idx) => {
    const startX = idx * colWidth;

    // Draw image centered in column
    const imgAspect = item.img.width / item.img.height;
    let drawWidth = usableHeight * imgAspect;
    let drawHeight = usableHeight;

    if (drawWidth > colWidth) {
      drawWidth = colWidth;
      drawHeight = colWidth / imgAspect;
    }

    const offsetX = startX + (colWidth - drawWidth) / 2;
    const offsetY = bannerHeight + (usableHeight - drawHeight) / 2;

    ctx.drawImage(item.img, offsetX, offsetY, drawWidth, drawHeight);

    // Subtle Column Divider
    if (idx > 0) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(startX, 0);
      ctx.lineTo(startX, height);
      ctx.stroke();
    }

    // Angle Label at bottom
    ctx.fillStyle = 'rgba(0, 229, 255, 0.8)';
    ctx.font = `bold ${Math.round(height * 0.024)}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(item.label, startX + colWidth / 2, height - Math.round(height * 0.025));
  });

  // 4. Horizontal Guidelines
  if (includeGuidelines) {
    const eyeLevelY = bannerHeight + usableHeight * 0.25;
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(0, eyeLevelY);
    ctx.lineTo(width, eyeLevelY);
    ctx.stroke();
    ctx.setLineDash([]); // reset dash
  }

  // 5. Metadata Banner
  if (includeMetadataBanner) {
    ctx.fillStyle = 'rgba(2, 4, 10, 0.85)';
    ctx.fillRect(0, 0, width, bannerHeight);

    ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, bannerHeight);
    ctx.lineTo(width, bannerHeight);
    ctx.stroke();

    // Text specs
    ctx.fillStyle = '#f8fafc';
    ctx.font = `bold ${Math.round(bannerHeight * 0.45)}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(`V5 APOLLO AVATAR · ${characterName.toUpperCase()} · MODEL SHEET 360º`, 24, bannerHeight * 0.65);

    ctx.fillStyle = '#00e5ff';
    ctx.font = `bold ${Math.round(bannerHeight * 0.35)}px monospace`;
    ctx.textAlign = 'right';
    ctx.fillText(
      `CAPITANIA #12 · ${width}x${height}px · SEED: ${seed || 'AUTO'}`,
      width - 24,
      bannerHeight * 0.65
    );
  }

  const dataUrl = canvas.toDataURL(mimeType, quality);
  const stringLength = dataUrl.length - `data:${mimeType};base64,`.length;
  const sizeBytes = Math.round((stringLength * 3) / 4);

  return {
    dataUrl,
    width,
    height,
    sizeBytes,
  };
}
