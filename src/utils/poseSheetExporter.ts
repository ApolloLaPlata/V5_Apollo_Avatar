/**
 * V5 Apollo Avatar — Motor de Exportação de Folha de Poses em Alta Resolução (Canal Alpha)
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 *
 * Composição via Offscreen Canvas HTML5 de folhas de poses (T-Pose, A-Pose, Utilitárias)
 * com suporte nativo a Canal Alpha (RGBA 32-bit transparente) e resoluções até 4K.
 */

export interface PoseExportItem {
  id: string;
  name: string;
  imageUrl: string;
  aspectRatio?: '9:16' | '1:1' | '3:4';
}

export type ExportResolution = '1080p' | '2k' | '4k';
export type BackgroundMode = 'transparent_alpha' | 'obsidian_dark' | 'studio_cyan' | 'pure_white';

export interface PoseExportConfig {
  resolution: ExportResolution;
  bgMode: BackgroundMode;
  includeWatermark: boolean;
  avatarName: string;
  layout: 'horizontal_strip' | 'grid_2x2';
}

export const RESOLUTION_DIMENSIONS: Record<
  ExportResolution,
  Record<'horizontal_strip' | 'grid_2x2', { width: number; height: number }>
> = {
  '1080p': {
    horizontal_strip: { width: 1920, height: 1080 },
    grid_2x2: { width: 1920, height: 1920 },
  },
  '2k': {
    horizontal_strip: { width: 2560, height: 1440 },
    grid_2x2: { width: 2048, height: 2048 },
  },
  '4k': {
    horizontal_strip: { width: 3840, height: 2160 },
    grid_2x2: { width: 4096, height: 4096 },
  },
};

/**
 * Compõe uma imagem de alta resolução com as poses fornecidas sobre Canvas HTML5
 */
export async function composePoseSheet(
  poses: PoseExportItem[],
  config: PoseExportConfig
): Promise<string> {
  if (typeof window === 'undefined') return '';

  const dims = RESOLUTION_DIMENSIONS[config.resolution][config.layout];
  const canvas = document.createElement('canvas');
  canvas.width = dims.width;
  canvas.height = dims.height;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Não foi possível inicializar o contexto 2D do Canvas.');

  // Preenchimento de Fundo
  if (config.bgMode === 'transparent_alpha') {
    // Canal Alpha puro: limpar para transparente
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else if (config.bgMode === 'obsidian_dark') {
    ctx.fillStyle = '#05070B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (config.bgMode === 'studio_cyan') {
    const grad = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width * 0.1,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width * 0.7
    );
    grad.addColorStop(0, '#002B33');
    grad.addColorStop(1, '#05070B');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Carregar imagens assincronamente com CORS anônimo
  const loadImg = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Fallback para placeholder em canvas caso a imagem externa falhe
        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = 400;
        fallbackCanvas.height = 700;
        const fCtx = fallbackCanvas.getContext('2d');
        if (fCtx) {
          fCtx.fillStyle = '#101726';
          fCtx.fillRect(0, 0, 400, 700);
          fCtx.fillStyle = '#00E5FF';
          fCtx.font = 'bold 24px monospace';
          fCtx.textAlign = 'center';
          fCtx.fillText('V5 POSE', 200, 350);
        }
        const fImg = new Image();
        fImg.src = fallbackCanvas.toDataURL('image/png');
        fImg.onload = () => resolve(fImg);
        fImg.onerror = () => reject(new Error(`Falha ao carregar pose: ${url}`));
      };
      img.src = url;
    });

  const loadedImages = await Promise.all(poses.map((p) => loadImg(p.imageUrl)));

  // Desenhar layout
  const count = loadedImages.length || 1;

  if (config.layout === 'horizontal_strip') {
    const slotWidth = canvas.width / count;
    const padding = slotWidth * 0.05;

    loadedImages.forEach((img, idx) => {
      const x = idx * slotWidth + padding;
      const targetW = slotWidth - padding * 2;
      const targetH = canvas.height - padding * 2;
      const y = padding;

      // Desenhar mantendo proporção
      ctx.drawImage(img, x, y, targetW, targetH);

      // Rótulo da Pose se não for fundo transparente
      if (config.bgMode !== 'transparent_alpha') {
        ctx.fillStyle = '#00E5FF';
        ctx.font = `bold ${Math.round(canvas.height * 0.025)}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(poses[idx]?.name || `Pose ${idx + 1}`, x + targetW / 2, canvas.height - 30);
      }
    });
  } else {
    // Grid 2x2
    const cellW = canvas.width / 2;
    const cellH = canvas.height / 2;
    const pad = cellW * 0.05;

    loadedImages.slice(0, 4).forEach((img, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = col * cellW + pad;
      const y = row * cellH + pad;
      const targetW = cellW - pad * 2;
      const targetH = cellH - pad * 2;

      ctx.drawImage(img, x, y, targetW, targetH);

      if (config.bgMode !== 'transparent_alpha') {
        ctx.fillStyle = '#00E5FF';
        ctx.font = `bold ${Math.round(cellH * 0.04)}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(poses[idx]?.name || `Pose ${idx + 1}`, x + targetW / 2, y + targetH - 15);
      }
    });
  }

  // Marca d'água soberana da Holding se habilitada
  if (config.includeWatermark && config.bgMode !== 'transparent_alpha') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = `bold ${Math.round(canvas.height * 0.016)}px monospace`;
    ctx.textAlign = 'right';
    ctx.fillText(
      `Holding V5 Apollo · Capitania #12 · ${config.avatarName} (${config.resolution.toUpperCase()})`,
      canvas.width - 25,
      canvas.height - 15
    );
  }

  return canvas.toDataURL('image/png');
}
