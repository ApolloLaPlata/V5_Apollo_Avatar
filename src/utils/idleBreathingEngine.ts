/**
 * V5 Apollo Avatar - Idle Breathing Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Motor de Loop de Respiração Suave e Deformação Torácica Orgânica.
 * Gera CSS Keyframes dinâmicos, modula amplitude vertical (Y) e expansão
 * de ombros (X), suporta presets fisiológicos e exporta CSS puro para OBS/Web.
 */

import { IdleBreathingConfig } from '@/types/avatar';

export interface BreathingPresetItem {
  id: 'calm' | 'focused' | 'energetic' | 'deep';
  label: string;
  bpm: number;
  amplitudeYPercent: number;
  shoulderExpansionXPercent: number;
  anchorPoint: 'center_bottom' | 'chest_center' | 'waist_center';
  description: string;
}

export const CANONICAL_BREATHING_PRESETS: Record<'calm' | 'focused' | 'energetic' | 'deep', BreathingPresetItem> = {
  calm: {
    id: 'calm',
    label: 'Repouso Calmo',
    bpm: 12,
    amplitudeYPercent: 0.6,
    shoulderExpansionXPercent: 0.8,
    anchorPoint: 'waist_center',
    description: 'Cadência suave de 12 BPM com elevação sutil. Ideal para apresentadores institucionais e repouso.',
  },
  focused: {
    id: 'focused',
    label: 'Foco Atento',
    bpm: 15,
    amplitudeYPercent: 0.9,
    shoulderExpansionXPercent: 1.2,
    anchorPoint: 'center_bottom',
    description: 'Cadência de 15 BPM com presença firme de tela. Padrão para tutoriais e transmissões técnicas.',
  },
  energetic: {
    id: 'energetic',
    label: 'Energético / Dinâmico',
    bpm: 22,
    amplitudeYPercent: 1.5,
    shoulderExpansionXPercent: 1.8,
    anchorPoint: 'center_bottom',
    description: 'Cadência dinâmica de 22 BPM com alta expansão torácica. Ideal para UGC Shopee, games e lives.',
  },
  deep: {
    id: 'deep',
    label: 'Meditação Profunda',
    bpm: 8,
    amplitudeYPercent: 1.2,
    shoulderExpansionXPercent: 1.5,
    anchorPoint: 'chest_center',
    description: 'Cadência lenta de 8 BPM com respiração diafragmática profunda. Ideal para rádio noturna do Broadcaster.',
  },
};

export const DEFAULT_BREATHING_CONFIG: IdleBreathingConfig = {
  bpm: 14,
  amplitudeYPercent: 0.8,
  shoulderExpansionXPercent: 1.1,
  anchorPoint: 'center_bottom',
  preset: 'focused',
  isActive: true,
};

/**
 * Converte BPM (respirações por minuto) para duração do ciclo em segundos
 */
export function bpmToCycleSeconds(bpm: number): number {
  if (bpm <= 0) return 4.0;
  return Number((60 / bpm).toFixed(2));
}

/**
 * Mapeia o ponto de ancoragem para transform-origin CSS
 */
export function getAnchorPointCss(anchor: IdleBreathingConfig['anchorPoint']): string {
  switch (anchor) {
    case 'chest_center':
      return 'center 40%';
    case 'waist_center':
      return 'center 65%';
    case 'center_bottom':
    default:
      return 'center bottom';
  }
}

/**
 * Gera os CSS Keyframes dinâmicos para a animação de respiração orgânica
 */
export function generateBreathingKeyframesCss(
  config: IdleBreathingConfig,
  keyframeName = 'v5-idle-breathing'
): string {
  const scaleXMax = (1 + config.shoulderExpansionXPercent / 100).toFixed(4);
  const scaleYMax = (1 + (config.amplitudeYPercent * 0.7) / 100).toFixed(4);
  const translateYMax = (-config.amplitudeYPercent * 4).toFixed(2); // em pixels relativos

  return `@keyframes ${keyframeName} {
  0% {
    transform: translateY(0px) scale(1, 1);
    animation-timing-function: cubic-bezier(0.42, 0.0, 0.58, 1.0);
  }
  38% {
    /* Ápice da inspiração com leve elevação torácica e expansão de ombros */
    transform: translateY(${translateYMax}px) scale(${scaleXMax}, ${scaleYMax});
    animation-timing-function: cubic-bezier(0.33, 1.0, 0.68, 1.0);
  }
  48% {
    /* Micro-pausa pós-inspiração (platô natural do pulmão cheio) */
    transform: translateY(${translateYMax}px) scale(${scaleXMax}, ${scaleYMax});
    animation-timing-function: cubic-bezier(0.45, 0.05, 0.55, 0.95);
  }
  88% {
    /* Conclusão suave da expiração */
    transform: translateY(0.3px) scale(0.998, 0.999);
    animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1.0);
  }
  100% {
    /* Retorno à posição de repouso */
    transform: translateY(0px) scale(1, 1);
  }
}`;
}

/**
 * Gera um trecho CSS completo e autocontido para embedding em overlays OBS ou sites
 */
export function generateCleanCssEmbedSnippet(
  config: IdleBreathingConfig,
  selector = '.v5-avatar-idle-container'
): string {
  const duration = bpmToCycleSeconds(config.bpm);
  const keyframes = generateBreathingKeyframesCss(config, 'v5-idle-breathing');
  const anchor = getAnchorPointCss(config.anchorPoint);

  return `/* =======================================================
   Holding V5 Apollo · Capitania #12 (V5 Apollo Avatar)
   Motor de Loop de Respiração Idle Suave (${config.bpm} BPM)
   ======================================================= */

${keyframes}

${selector} {
  transform-origin: ${anchor};
  animation: v5-idle-breathing ${duration}s infinite ease-in-out;
  will-change: transform;
  backface-visibility: hidden;
}`;
}

/**
 * Calcula a fase respiratória instantânea para feedback no monitor de telemetria
 */
export function calculateBreathingPhase(
  timestampMs: number,
  bpm: number
): {
  phase: 'inspiração' | 'ápice' | 'expiração' | 'repouso';
  progress: number; // 0 a 100%
  sineNormalized: number; // 0 a 1
} {
  const cycleMs = (60 / bpm) * 1000;
  const elapsed = timestampMs % cycleMs;
  const progress = (elapsed / cycleMs) * 100;

  // Curva de respiração aproximada
  const sine = (Math.sin((elapsed / cycleMs) * 2 * Math.PI - Math.PI / 2) + 1) / 2;

  let phase: 'inspiração' | 'ápice' | 'expiração' | 'repouso' = 'repouso';
  if (progress < 40) {
    phase = 'inspiração';
  } else if (progress < 50) {
    phase = 'ápice';
  } else if (progress < 90) {
    phase = 'expiração';
  } else {
    phase = 'repouso';
  }

  return {
    phase,
    progress: Math.round(progress),
    sineNormalized: Number(sine.toFixed(3)),
  };
}
