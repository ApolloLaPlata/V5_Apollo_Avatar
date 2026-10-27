/**
 * V5 Apollo Avatar - Dynamic Energy Level Modulator
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Modulador de Dinâmica e Frequência de Micro-Movimentos por Nível de Energia (0% a 100%).
 * Controla e orquestra simultaneamente:
 * 1. Frequência respiratória e amplitude torácica (BPM 8 a 26)
 * 2. Cadência de piscadas e probabilidade de piscada dupla (120ms a 280ms)
 * 3. Velocidade e amplitude de micro-inclinações de cabeça (Head Tilts Roll ±1.5º a ±5.5º)
 * 4. Reatividade acústica dinâmica (VU meter que eleva a energia na fala e decai no silêncio)
 */

import { AvatarEnergyConfig, EnergyLevelPreset } from '@/types/avatar';

export interface DerivedIdleParameters {
  bpm: number;
  breathingAmplitudeYPercent: number;
  shoulderExpansionXPercent: number;
  blinkIntervalMin: number;
  blinkIntervalMax: number;
  blinkDurationMs: number;
  doubleBlinkProbability: number;
  headTiltTransitionSeconds: number;
  headTiltDwellSeconds: number;
  headTiltMaxRollDeg: number;
  headTiltMaxPitchDeg: number;
  headTiltMaxYawDeg: number;
}

export interface EnergyPresetItem {
  id: EnergyLevelPreset;
  label: string;
  energyLevel: number;
  color: string;
  badgeColor: string;
  borderColor: string;
  description: string;
}

export const CANONICAL_ENERGY_PRESETS: Record<EnergyLevelPreset, EnergyPresetItem> = {
  zen: {
    id: 'zen',
    label: 'Zen / Noturno',
    energyLevel: 15,
    color: 'text-blue-400',
    badgeColor: 'bg-blue-500/15',
    borderColor: 'border-blue-500/30',
    description: 'Cadência lenta e meditativa, ideal para transmissões noturnas de rádio do Broadcaster e ASMR.',
  },
  executive: {
    id: 'executive',
    label: 'Executivo / Focado',
    energyLevel: 40,
    color: 'text-cyber-cyan',
    badgeColor: 'bg-cyan-500/15',
    borderColor: 'border-cyber-cyan/30',
    description: 'Postura firme e controlada, ideal para apresentadores de notícias do V5 Auto Blog e tutoriais.',
  },
  creator: {
    id: 'creator',
    label: 'Criador / Entusiasmado',
    energyLevel: 70,
    color: 'text-amber-400',
    badgeColor: 'bg-amber-500/15',
    borderColor: 'border-amber-500/30',
    description: 'Alta expressividade e dinamismo, ideal para criadores de UGC do Fines, YouTube Shorts e Reels.',
  },
  streamer: {
    id: 'streamer',
    label: 'Streamer Hiperativo',
    energyLevel: 95,
    color: 'text-rose-400',
    badgeColor: 'bg-rose-500/15',
    borderColor: 'border-rose-500/30',
    description: 'Reatividade máxima em tempo real com micro-movimentos rápidos, ideal para lives interativas com chat.',
  },
  custom: {
    id: 'custom',
    label: 'Personalizado',
    energyLevel: 50,
    color: 'text-purple-400',
    badgeColor: 'bg-purple-500/15',
    borderColor: 'border-purple-500/30',
    description: 'Calibração manual contínua de 0% a 100%.',
  },
};

export const DEFAULT_ENERGY_CONFIG: AvatarEnergyConfig = {
  energyLevel: 50,
  preset: 'executive',
  audioReactive: true,
  sensitivity: 3,
};

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * Math.max(0, Math.min(1, t));
}

/**
 * Deriva matematicamente todos os parâmetros dos 3 subsistemas a partir do nível de energia
 */
export function calculateDerivedParameters(energyLevel: number): DerivedIdleParameters {
  const t = Math.max(0, Math.min(100, energyLevel)) / 100;

  // 1. Respiração: mais energia = mais BPM e maior expansão
  const bpm = Math.round(lerp(8, 26, t));
  const breathingAmplitudeYPercent = Number(lerp(0.4, 2.2, t).toFixed(1));
  const shoulderExpansionXPercent = Number(lerp(0.5, 2.8, t).toFixed(1));

  // 2. Piscadas: mais energia = mais frequente, menor duração e mais piscadas duplas
  const blinkIntervalMin = Number(lerp(3.8, 1.4, t).toFixed(1));
  const blinkIntervalMax = Number(lerp(8.0, 3.2, t).toFixed(1));
  const blinkDurationMs = Math.round(lerp(270, 130, t));
  const doubleBlinkProbability = Number(lerp(0.04, 0.32, t).toFixed(2));

  // 3. Head Tilts: mais energia = transições mais rápidas, menor tempo de pausa e maiores ângulos
  const headTiltTransitionSeconds = Number(lerp(3.8, 1.2, t).toFixed(1));
  const headTiltDwellSeconds = Number(lerp(4.0, 0.8, t).toFixed(1));
  const headTiltMaxRollDeg = Number(lerp(1.5, 5.5, t).toFixed(1));
  const headTiltMaxPitchDeg = Number(lerp(1.0, 3.8, t).toFixed(1));
  const headTiltMaxYawDeg = Number(lerp(1.0, 4.5, t).toFixed(1));

  return {
    bpm,
    breathingAmplitudeYPercent,
    shoulderExpansionXPercent,
    blinkIntervalMin,
    blinkIntervalMax,
    blinkDurationMs,
    doubleBlinkProbability,
    headTiltTransitionSeconds,
    headTiltDwellSeconds,
    headTiltMaxRollDeg,
    headTiltMaxPitchDeg,
    headTiltMaxYawDeg,
  };
}

/**
 * Calcula a elevação dinâmica de energia por reatividade de áudio (VU Meter 0 a 100%)
 */
export function calculateAudioReactiveEnergy(
  baseEnergy: number,
  vuLevel: number,
  sensitivity: number
): number {
  const boost = (vuLevel / 100) * (sensitivity * 7);
  return Math.min(100, Math.round(baseEnergy + boost));
}
