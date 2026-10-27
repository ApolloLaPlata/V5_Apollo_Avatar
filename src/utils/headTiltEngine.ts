/**
 * V5 Apollo Avatar - Head Tilt & Micro-Movement Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Motor de Micro-Movimentos de Cabeça (Head Tilts & Micro-Inclinações).
 * Simula os 3 graus de liberdade biomecânicos da coluna cervical:
 * 1. Pitch (Nod / Eixo X): inclinação vertical (-4º a +4º)
 * 2. Yaw (Turn / Eixo Y): rotação horizontal (-5º a +5º)
 * 3. Roll (Tilt / Eixo Z): inclinação lateral orelha-ombro (-6º a +6º)
 * Unifica presets de escuta empática, análise e postura soberana com 3D CSS transforms.
 */

import { HeadTiltConfig } from '@/types/avatar';
import React from 'react';

export interface HeadTiltPose {
  pitch: number; // Eixo X (graus)
  yaw: number;   // Eixo Y (graus)
  roll: number;  // Eixo Z (graus)
}

export interface HeadTiltPresetItem {
  id: 'listening_empathy' | 'analytical_curious' | 'confident_sovereign' | 'neutral_idle';
  label: string;
  maxPitchDeg: number;
  maxYawDeg: number;
  maxRollDeg: number;
  transitionDurationSeconds: number;
  dwellTimeSeconds: number;
  description: string;
}

export const CANONICAL_HEAD_TILT_PRESETS: Record<
  'listening_empathy' | 'analytical_curious' | 'confident_sovereign' | 'neutral_idle',
  HeadTiltPresetItem
> = {
  listening_empathy: {
    id: 'listening_empathy',
    label: 'Escuta Empática',
    maxPitchDeg: 1.5,
    maxYawDeg: 2.0,
    maxRollDeg: 3.5,
    transitionDurationSeconds: 2.4,
    dwellTimeSeconds: 2.8,
    description: 'Inclinação de orelha ao ombro (+3.5º) e leve pitch. Demonstra atenção ativa e acolhimento.',
  },
  analytical_curious: {
    id: 'analytical_curious',
    label: 'Análise Curiosa',
    maxPitchDeg: 1.8,
    maxYawDeg: 3.0,
    maxRollDeg: 2.5,
    transitionDurationSeconds: 2.0,
    dwellTimeSeconds: 2.0,
    description: 'Yaw moderado (+3º) com Roll invertido (-2.5º). Demonstra raciocínio crítico e avaliação.',
  },
  confident_sovereign: {
    id: 'confident_sovereign',
    label: 'Postura Soberana',
    maxPitchDeg: 2.0,
    maxYawDeg: 1.5,
    maxRollDeg: 1.2,
    transitionDurationSeconds: 3.2,
    dwellTimeSeconds: 3.5,
    description: 'Queixo ligeiramente elevado (+1.5º) e roll contido. Postura de autoridade e liderança.',
  },
  neutral_idle: {
    id: 'neutral_idle',
    label: 'Flutuação Neutra',
    maxPitchDeg: 1.2,
    maxYawDeg: 1.8,
    maxRollDeg: 2.0,
    transitionDurationSeconds: 2.8,
    dwellTimeSeconds: 2.5,
    description: 'Micro-derivas orgânicas suaves nos 3 eixos a cada 4-6 segundos, sem fadiga visual.',
  },
};

export const DEFAULT_HEAD_TILT_CONFIG: HeadTiltConfig = {
  maxPitchDeg: 1.5,
  maxYawDeg: 2.0,
  maxRollDeg: 3.0,
  transitionDurationSeconds: 2.5,
  dwellTimeSeconds: 2.5,
  preset: 'listening_empathy',
  isActive: true,
};

/**
 * Calcula uma nova pose aleatória de cabeça respeitando os limites angulares da configuração
 */
export function calculateRandomHeadPose(config: HeadTiltConfig): HeadTiltPose {
  // Gera valores aleatórios centrados em 0 (-1 a +1)
  const randPitch = (Math.random() * 2 - 1) * config.maxPitchDeg;
  const randYaw = (Math.random() * 2 - 1) * config.maxYawDeg;
  const randRoll = (Math.random() * 2 - 1) * config.maxRollDeg;

  return {
    pitch: Number(randPitch.toFixed(1)),
    yaw: Number(randYaw.toFixed(1)),
    roll: Number(randRoll.toFixed(1)),
  };
}

/**
 * Mapeia uma pose tridimensional para propriedades CSS inline com perspectiva
 */
export function generate3DTransformStyle(
  pose: HeadTiltPose,
  transitionSeconds: number,
  perspectivePx = 800
): React.CSSProperties {
  return {
    transform: `perspective(${perspectivePx}px) rotateX(${pose.pitch}deg) rotateY(${pose.yaw}deg) rotateZ(${pose.roll}deg)`,
    transformOrigin: 'center 75%', // Base do pescoço / cervical
    transition: `transform ${transitionSeconds}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`,
    willChange: 'transform',
    backfaceVisibility: 'hidden',
  };
}

/**
 * Gera os CSS Keyframes dinâmicos para um loop infinito e orgânico de micro-inclinações
 */
export function generateHeadTiltKeyframesCss(
  config: HeadTiltConfig,
  keyframeName = 'v5-head-tilt-loop'
): string {
  const p = config.maxPitchDeg;
  const y = config.maxYawDeg;
  const r = config.maxRollDeg;

  return `@keyframes ${keyframeName} {
  0% {
    transform: perspective(800px) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }
  20% {
    /* Micro-inclinação de escuta à direita */
    transform: perspective(800px) rotateX(${(-p * 0.5).toFixed(1)}deg) rotateY(${(y * 0.7).toFixed(1)}deg) rotateZ(${r.toFixed(1)}deg);
  }
  45% {
    /* Platô com leve elevação de queixo e olhar ponderado */
    transform: perspective(800px) rotateX(${(p * 0.8).toFixed(1)}deg) rotateY(${(-y * 0.4).toFixed(1)}deg) rotateZ(${(-r * 0.3).toFixed(1)}deg);
  }
  70% {
    /* Micro-inclinação curiosa à esquerda */
    transform: perspective(800px) rotateX(${(-p * 0.3).toFixed(1)}deg) rotateY(${(-y * 0.8).toFixed(1)}deg) rotateZ(${(-r).toFixed(1)}deg);
  }
  100% {
    transform: perspective(800px) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }
}`;
}

/**
 * Gera um trecho limpo de CSS para integração em websites ou OBS Overlays
 */
export function generateCleanHeadTiltCssSnippet(
  config: HeadTiltConfig,
  selector = '.v5-avatar-head'
): string {
  const totalDuration = (config.transitionDurationSeconds * 4).toFixed(1);
  const keyframes = generateHeadTiltKeyframesCss(config, 'v5-head-tilt-loop');

  return `/* =======================================================
   Holding V5 Apollo · Capitania #12 (V5 Apollo Avatar)
   Motor de Micro-Movimentos de Cabeça (Head Tilts 3D)
   ======================================================= */

${keyframes}

${selector} {
  transform-origin: center 75%;
  animation: v5-head-tilt-loop ${totalDuration}s infinite ease-in-out;
  will-change: transform;
  backface-visibility: hidden;
}`;
}
