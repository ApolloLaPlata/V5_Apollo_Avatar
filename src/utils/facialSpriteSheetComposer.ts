/**
 * V5 Apollo Avatar — Compositor de Sprite Sheet Consolidado e Atlas JSON
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 *
 * Consolidação de 16 quadros (9 Expressões Faciais + 7 Visemas Canônicos)
 * em uma folha única Texture Atlas 4x4 (2048x2048 ou 4096x4096px)
 * acompanhada de manifesto JSON de coordenadas UV para o V5 Broadcaster (:3008) e V5 Edit.
 */

export interface AtlasFrameDefinition {
  id: string;
  name: string;
  type: 'expression' | 'viseme';
  row: number; // 0 a 3
  col: number; // 0 a 3
  imageUrl: string;
}

export interface AtlasManifestJson {
  meta: {
    app: 'V5 Apollo Avatar Atlas Generator';
    version: '1.0';
    avatarId: string;
    avatarName: string;
    format: 'RGBA8888';
    size: { w: number; h: number };
    gridCols: 4;
    gridRows: 4;
    totalFrames: 16;
    generatedAt: string;
  };
  frames: Record<
    string,
    {
      frame: { x: number; y: number; w: number; h: number };
      sourceSize: { w: number; h: number };
      spriteSourceSize: { x: number; y: number; w: number; h: number };
      pivot: { x: number; y: number };
      type: 'expression' | 'viseme';
    }
  >;
}

export const CANONICAL_16_ATLAS_SLOTS: AtlasFrameDefinition[] = [
  // Linha 0 (Expressões Base 1 a 4)
  { id: 'expr_neutral', name: 'Neutro Calmo', type: 'expression', row: 0, col: 0, imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { id: 'expr_subtle_smile', name: 'Sorriso Sutil', type: 'expression', row: 0, col: 1, imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
  { id: 'expr_open_smile', name: 'Sorriso Aberto', type: 'expression', row: 0, col: 2, imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
  { id: 'expr_serious_focus', name: 'Foco Sério', type: 'expression', row: 0, col: 3, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },

  // Linha 1 (Expressões Base e Secundárias 5 a 8)
  { id: 'expr_surprise', name: 'Surpresa Espanto', type: 'expression', row: 1, col: 0, imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80' },
  { id: 'expr_curiosity', name: 'Curiosidade Dúvida', type: 'expression', row: 1, col: 1, imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80' },
  { id: 'expr_enthusiasm', name: 'Entusiasmo Hype', type: 'expression', row: 1, col: 2, imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
  { id: 'expr_warm_empathy', name: 'Empatia Acolhedora', type: 'expression', row: 1, col: 3, imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },

  // Linha 2 (Expressão 9 + Visemas 1 a 3)
  { id: 'expr_stern_authority', name: 'Autoridade Severa', type: 'expression', row: 2, col: 0, imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
  { id: 'viseme_silence', name: 'Visema: Silêncio', type: 'viseme', row: 2, col: 1, imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  { id: 'viseme_A_I', name: 'Visema: A / I (Ah)', type: 'viseme', row: 2, col: 2, imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80' },
  { id: 'viseme_E', name: 'Visema: E (Ee)', type: 'viseme', row: 2, col: 3, imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },

  // Linha 3 (Visemas 4 a 7)
  { id: 'viseme_O_U', name: 'Visema: O / U (Oh)', type: 'viseme', row: 3, col: 0, imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
  { id: 'viseme_MBP', name: 'Visema: M / B / P', type: 'viseme', row: 3, col: 1, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { id: 'viseme_FV', name: 'Visema: F / V', type: 'viseme', row: 3, col: 2, imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
  { id: 'viseme_LDT', name: 'Visema: L / D / T', type: 'viseme', row: 3, col: 3, imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
];

/**
 * Gera o manifesto JSON TexturePacker para o atlas
 */
export function buildAtlasManifest(
  avatarId: string,
  avatarName: string,
  dimension: 2048 | 4096 = 2048
): AtlasManifestJson {
  const cellSize = dimension / 4;
  const framesDict: AtlasManifestJson['frames'] = {};

  CANONICAL_16_ATLAS_SLOTS.forEach((slot) => {
    const x = slot.col * cellSize;
    const y = slot.row * cellSize;

    framesDict[slot.id] = {
      frame: { x, y, w: cellSize, h: cellSize },
      sourceSize: { w: cellSize, h: cellSize },
      spriteSourceSize: { x: 0, y: 0, w: cellSize, h: cellSize },
      pivot: { x: 0.5, y: 0.5 },
      type: slot.type,
    };
  });

  return {
    meta: {
      app: 'V5 Apollo Avatar Atlas Generator',
      version: '1.0',
      avatarId,
      avatarName,
      format: 'RGBA8888',
      size: { w: dimension, h: dimension },
      gridCols: 4,
      gridRows: 4,
      totalFrames: 16,
      generatedAt: new Date().toISOString(),
    },
    frames: framesDict,
  };
}

/**
 * Compõe o sprite sheet 4x4 em alta resolução sobre Canvas HTML5
 */
export async function composeFacialSpriteSheet(
  dimension: 2048 | 4096 = 2048,
  bgTransparent: boolean = true
): Promise<string> {
  if (typeof window === 'undefined') return '';

  const canvas = document.createElement('canvas');
  canvas.width = dimension;
  canvas.height = dimension;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Não foi possível obter contexto 2D.');

  if (bgTransparent) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#05070B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const cellSize = dimension / 4;

  const loadImg = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        const fb = document.createElement('canvas');
        fb.width = cellSize;
        fb.height = cellSize;
        const fCtx = fb.getContext('2d');
        if (fCtx) {
          fCtx.fillStyle = '#0E1726';
          fCtx.fillRect(0, 0, cellSize, cellSize);
          fCtx.fillStyle = '#00E5FF';
          fCtx.font = 'bold 36px monospace';
          fCtx.textAlign = 'center';
          fCtx.fillText('V5 FRAME', cellSize / 2, cellSize / 2);
        }
        const fImg = new Image();
        fImg.src = fb.toDataURL();
        fImg.onload = () => resolve(fImg);
      };
      img.src = url;
    });

  const loadedImages = await Promise.all(
    CANONICAL_16_ATLAS_SLOTS.map((s) => loadImg(s.imageUrl))
  );

  loadedImages.forEach((img, idx) => {
    const slot = CANONICAL_16_ATLAS_SLOTS[idx];
    const x = slot.col * cellSize;
    const y = slot.row * cellSize;

    ctx.drawImage(img, x, y, cellSize, cellSize);

    // Borda tênue para demarcação de UV se não for transparente
    if (!bgTransparent) {
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, cellSize, cellSize);
    }
  });

  return canvas.toDataURL('image/png');
}
