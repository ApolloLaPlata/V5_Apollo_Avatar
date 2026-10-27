/**
 * V5 Apollo Avatar - Natural Eye Blink Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Motor de Piscada de Olho Natural com Distribuição Probabilística.
 * Modula intervalos orgânicos entre 2.5s e 6.0s com micro-reflexos de piscada dupla (12%),
 * curvas fisiológicas assimétricas (fechamento rápido em ~60ms e abertura em ~120ms),
 * e compatibilidade universal com CSS Keyframes, Canvas e Webhooks do V5 Broadcaster.
 */

import { NaturalEyeBlinkConfig } from '@/types/avatar';

export interface EyeBlinkPresetItem {
  id: 'natural_human' | 'focused_screen' | 'conversational' | 'relaxed';
  label: string;
  intervalMin: number;
  intervalMax: number;
  blinkDurationMs: number;
  doubleBlinkProbability: number;
  description: string;
}

export const CANONICAL_EYE_BLINK_PRESETS: Record<
  'natural_human' | 'focused_screen' | 'conversational' | 'relaxed',
  EyeBlinkPresetItem
> = {
  natural_human: {
    id: 'natural_human',
    label: 'Humano Natural',
    intervalMin: 2.5,
    intervalMax: 6.0,
    blinkDurationMs: 180,
    doubleBlinkProbability: 0.12,
    description: 'Fisiologia humana padrão: intervalo de 2.5s a 6s com 12% de chance de piscadas duplas.',
  },
  focused_screen: {
    id: 'focused_screen',
    label: 'Foco na Tela / Leitura',
    intervalMin: 4.5,
    intervalMax: 9.0,
    blinkDurationMs: 140,
    doubleBlinkProbability: 0.05,
    description: 'Intervalos estendidos e piscadas rápidas de 140ms, típico de leitura atenta ou codificação.',
  },
  conversational: {
    id: 'conversational',
    label: 'Conversacional Expressivo',
    intervalMin: 2.0,
    intervalMax: 4.5,
    blinkDurationMs: 200,
    doubleBlinkProbability: 0.22,
    description: 'Maior frequência e expressividade empática com 22% de piscada dupla para lives e podcasts.',
  },
  relaxed: {
    id: 'relaxed',
    label: 'Relaxado / Noturno',
    intervalMin: 3.0,
    intervalMax: 7.0,
    blinkDurationMs: 280,
    doubleBlinkProbability: 0.15,
    description: 'Fechamento mais lento e suave de 280ms com repouso pós-piscada, ideal para madrugadas.',
  },
};

export const DEFAULT_EYE_BLINK_CONFIG: NaturalEyeBlinkConfig = {
  intervalMin: 2.5,
  intervalMax: 6.0,
  blinkDurationMs: 180,
  doubleBlinkProbability: 0.12,
  preset: 'natural_human',
  isActive: true,
};

/**
 * Calcula o próximo intervalo aleatório de piscada usando uma distribuição orgânica
 * (aproximação da curva normal/log-normal centrada entre intervalMin e intervalMax).
 */
export function calculateNextBlinkInterval(config: NaturalEyeBlinkConfig): {
  delaySeconds: number;
  delayMs: number;
  isDouble: boolean;
} {
  const min = Math.max(1.0, config.intervalMin);
  const max = Math.max(min + 0.5, config.intervalMax);

  // Amostragem com tendência central (Box-Muller simplificado para média ponderada)
  const u1 = Math.random();
  const u2 = Math.random();
  const normalApprox = (u1 + u2) / 2; // Centraliza a distribuição entre 0 e 1

  const delaySeconds = Number((min + normalApprox * (max - min)).toFixed(2));
  const isDouble = Math.random() < config.doubleBlinkProbability;

  return {
    delaySeconds,
    delayMs: Math.round(delaySeconds * 1000),
    isDouble,
  };
}

/**
 * Retorna o fator de abertura da pálpebra (0 = totalmente fechada, 1 = totalmente aberta)
 * baseado no progresso da animação (0% a 100%) respeitando a assimetria fisiológica.
 */
export function calculateEyelidOpenFactor(progressPercent: number): number {
  if (progressPercent <= 0 || progressPercent >= 100) return 1.0;

  // Fechamento rápido: 0% a 35% do tempo total
  if (progressPercent < 35) {
    const t = progressPercent / 35;
    // Curva cúbica acelerada para fechamento
    return Number((1 - Math.pow(t, 2)).toFixed(3));
  }

  // Platô de fechamento total: 35% a 50%
  if (progressPercent < 50) {
    return 0.02; // Deixa 2% para evitar colapso vetorial
  }

  // Reabertura suave: 50% a 100%
  const t = (progressPercent - 50) / 50;
  // Curva ease-out com desaceleração no final
  return Number((Math.sin((t * Math.PI) / 2)).toFixed(3));
}

/**
 * Gera os CSS Keyframes da piscada para aplicação via transform: scaleY
 */
export function generateEyeBlinkKeyframesCss(
  durationMs = 180,
  keyframeName = 'v5-eye-blink'
): string {
  return `@keyframes ${keyframeName} {
  0% {
    transform: scaleY(1);
    animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
  }
  35% {
    /* Olho quase fechado em alta velocidade (~60ms) */
    transform: scaleY(0.04);
    animation-timing-function: linear;
  }
  50% {
    /* Contato completo das pálpebras */
    transform: scaleY(0.02);
    animation-timing-function: cubic-bezier(0.0, 0.0, 0.2, 1);
  }
  85% {
    /* Reabertura elástica suave */
    transform: scaleY(0.92);
  }
  100% {
    transform: scaleY(1);
  }
}`;
}

/**
 * Gera um trecho limpo de script de piscada orgânica para integração em websites ou OBS Overlays
 */
export function generateCleanBlinkScriptSnippet(config: NaturalEyeBlinkConfig): string {
  return `/**
 * Holding V5 Apollo · Capitania #12
 * Procedural Eye Blinker (${config.intervalMin}s a ${config.intervalMax}s)
 */
function initV5EyeBlinker(eyeElementSelector = '.v5-avatar-eye') {
  const eyes = document.querySelectorAll(eyeElementSelector);
  const minDelay = ${config.intervalMin * 1000};
  const maxDelay = ${config.intervalMax * 1000};
  const duration = ${config.blinkDurationMs};
  const doubleChance = ${config.doubleBlinkProbability};

  function triggerBlink(isSecondOfDouble = false) {
    eyes.forEach(eye => {
      eye.style.transition = 'transform ' + (duration * 0.35) + 'ms cubic-bezier(0.4, 0, 0.2, 1)';
      eye.style.transform = 'scaleY(0.04)';
    });

    setTimeout(() => {
      eyes.forEach(eye => {
        eye.style.transition = 'transform ' + (duration * 0.5) + 'ms cubic-bezier(0, 0, 0.2, 1)';
        eye.style.transform = 'scaleY(1)';
      });
    }, duration * 0.45);
  }

  function scheduleNext() {
    const delay = minDelay + Math.random() * (maxDelay - minDelay);
    const isDouble = Math.random() < doubleChance;

    setTimeout(() => {
      triggerBlink();
      if (isDouble) {
        setTimeout(() => triggerBlink(true), duration + 120);
      }
      scheduleNext();
    }, delay);
  }

  scheduleNext();
}`;
}
