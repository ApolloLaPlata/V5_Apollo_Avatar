/**
 * V5 Apollo Avatar — Modulador de Intensidade Emocional Paramétrica
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 *
 * Cálculo de pesos de atenção (attention weights de 0.25x a 1.40x) para modulação
 * de expressividade facial de 10% a 100%, combinando ancoragem neutra e micro-tensões FACS.
 */

export type ModulatedEmotionId =
  | 'smile'
  | 'focus'
  | 'curiosity'
  | 'surprise'
  | 'empathy'
  | 'authority';

export interface EmotionIntensityLevel {
  tierName: 'Microexpressão Sutil' | 'Moderada Conversacional' | 'Enfatizada Cinemática' | 'Plena Máxima / Clímax';
  colorToken: string;
  weightMultiplier: number;
  description: string;
  recommendedUse: string;
}

export function getIntensityTier(percent: number): EmotionIntensityLevel {
  if (percent <= 25) {
    return {
      tierName: 'Microexpressão Sutil',
      colorToken: '#00E5FF',
      weightMultiplier: Number((0.25 + (percent / 25) * 0.25).toFixed(2)), // 0.25x a 0.50x
      description: 'Tensão muscular quase imperceptível. Mantém 90% da calmaria neutra.',
      recommendedUse: 'Avatares corporativos, momentos de escuta em lives, poses analíticas.',
    };
  }
  if (percent <= 55) {
    return {
      tierName: 'Moderada Conversacional',
      colorToken: '#10B981',
      weightMultiplier: Number((0.55 + ((percent - 25) / 30) * 0.35).toFixed(2)), // 0.55x a 0.90x
      description: 'Expressão humana equilibrada e calorosa sem exageros anatômicos.',
      recommendedUse: 'Vídeos de YouTube, aulas online, diálogos naturais no V5 Prisma.',
    };
  }
  if (percent <= 80) {
    return {
      tierName: 'Enfatizada Cinemática',
      colorToken: '#D4AF37',
      weightMultiplier: Number((0.95 + ((percent - 55) / 25) * 0.25).toFixed(2)), // 0.95x a 1.20x
      description: 'Expressão marcante com forte apelo visual e dobras musculares nítidas.',
      recommendedUse: 'Criativos de UGC no Fines, ganchos de Shorts, thumbnails chamativas.',
    };
  }
  return {
    tierName: 'Plena Máxima / Clímax',
    colorToken: '#EC4899',
    weightMultiplier: Number((1.22 + ((percent - 80) / 20) * 0.18).toFixed(2)), // 1.22x a 1.40x
    description: 'Pico dramático ou eufórico com contração plena de todas as unidades FACS.',
    recommendedUse: 'Memes virais, celebrações de recorde na live do Broadcaster, clímax.',
  };
}

export const MODULATED_EMOTION_BASES: Record<
  ModulatedEmotionId,
  { name: string; coreTokens: string; neutralAnchorRatio: number }
> = {
  smile: {
    name: 'Sorriso & Simpatia',
    coreTokens: 'radiant friendly smile, lifted cheekbones, sparkling joyful eyes',
    neutralAnchorRatio: 0.8,
  },
  focus: {
    name: 'Foco & Concentração',
    coreTokens: 'intense analytical focus, sharp observant gaze, firm resolute lips',
    neutralAnchorRatio: 0.6,
  },
  curiosity: {
    name: 'Curiosidade & Dúvida',
    coreTokens: 'inquisitive arched eyebrow, slight head tilt, questioning contemplative eyes',
    neutralAnchorRatio: 0.7,
  },
  surprise: {
    name: 'Surpresa & Espanto',
    coreTokens: 'astonished wide eyes, raised eyebrows, parted mouth in revelation',
    neutralAnchorRatio: 0.5,
  },
  empathy: {
    name: 'Empatia & Acolhimento',
    coreTokens: 'gentle affectionate soft smile, compassionate comforting warm gaze',
    neutralAnchorRatio: 0.9,
  },
  authority: {
    name: 'Autoridade & Firmeza',
    coreTokens: 'sovereign commanding gaze, level level brows, impenetrable confident posture',
    neutralAnchorRatio: 0.7,
  },
};

/**
 * Compila o prompt com modulação matemática de intensidade
 */
export function compileModulatedIntensityPrompt(
  emotionId: ModulatedEmotionId,
  characterName: string = 'Character',
  intensityPercent: number = 50
): { positivePrompt: string; negativePrompt: string; tier: EmotionIntensityLevel } {
  const base = MODULATED_EMOTION_BASES[emotionId];
  const tier = getIntensityTier(intensityPercent);

  // Se a intensidade for baixa (<=35%), injeta o token neutro para ancorar o rosto
  const neutralAnchorToken =
    intensityPercent <= 35
      ? `(serene resting neutral facial structure:${(1.1 - intensityPercent / 50).toFixed(2)}), `
      : '';

  const positivePrompt = `masterpiece portrait of ${characterName}, ${neutralAnchorToken}(${base.coreTokens}:${tier.weightMultiplier}), perfectly rendered facial features, natural skin micro-creases, ${intensityPercent}% emotional intensity, 8k uhd, cinematic studio photography.`;

  const negativePrompt = `over-exaggerated emotion, grotesque face, distorted grimace, plastic skin, unnatural stiffness, mutated expression.`;

  return { positivePrompt, negativePrompt, tier };
}
