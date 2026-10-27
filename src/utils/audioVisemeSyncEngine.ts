/**
 * V5 Apollo Avatar - Audio Viseme Sync Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Módulo de Sincronização Acústica em Tempo Real (Áudio -> Visemas)
 * Análise de formantes espectrais (F1, F2, Frequências de Fricção) e amplitude RMS
 * para classificação e troca suave de boca a 60 FPS com latência < 15ms.
 */

import { VisemeType } from '@/types/avatar';
import { CANONICAL_VISEMES_CATALOG } from './visemesEngine';

export interface AudioSyncConfig {
  noiseGateDb: number;        // Threshold de corte de ruído (-60dB a -20dB, default: -45dB)
  speechGain: number;         // Multiplicador de sensibilidade (1.0x a 4.0x, default: 1.8x)
  smoothingAlpha: number;     // Fator de suavização EMA (0.1 a 0.9, default: 0.65)
  minVisemeHoldMs: number;    // Retenção mínima da boca antes de alternar (20ms a 120ms, default: 45ms)
  autoDecayToSilence: boolean;// Decai suavemente para silence quando energia cessa
  fftSize: number;            // Tamanho da janela FFT (512 amostras = 256 bandas de frequência)
}

export const DEFAULT_AUDIO_SYNC_CONFIG: AudioSyncConfig = {
  noiseGateDb: -45,
  speechGain: 1.8,
  smoothingAlpha: 0.65,
  minVisemeHoldMs: 45,
  autoDecayToSilence: true,
  fftSize: 512,
};

export interface LiveLipSyncState {
  activeViseme: VisemeType;
  previousViseme: VisemeType;
  confidence: number;         // 0.0 a 1.0
  rmsDb: number;              // -100 a 0 dB
  rmsLinear: number;          // 0.0 a 1.0
  formantF1Energy: number;    // Energia em 300 - 1000 Hz (Abertura mandibular)
  formantF2Energy: number;    // Energia em 1000 - 2800 Hz (Estiramento labial / sorriso)
  frictionEnergy: number;     // Energia em 2800 - 7500 Hz (Consoantes fricativas e sibilantes)
  mouthOpen: number;          // Abertura vertical normalizada (0.0 a 1.0)
  mouthStretch: number;       // Estiramento horizontal normalizado (0.0 a 1.0)
  mouthPucker: number;        // Bico / projeção labial normalizada (0.0 a 1.0)
  latencyMs: number;
  isSpeaking: boolean;
  sampleTime: number;
}

export interface AcousticProfilePreset {
  id: string;
  name: string;
  description: string;
  config: AudioSyncConfig;
}

export const CANONICAL_ACOUSTIC_PRESETS: AcousticProfilePreset[] = [
  {
    id: 'studio_clean',
    name: 'Estúdio Tratado & Podcast',
    description: 'Ambiente silencioso com microfone condensador direcional e isolamento acústico.',
    config: {
      noiseGateDb: -48,
      speechGain: 1.7,
      smoothingAlpha: 0.60,
      minVisemeHoldMs: 40,
      autoDecayToSilence: true,
      fftSize: 512,
    },
  },
  {
    id: 'live_streamer',
    name: 'Live Streamer & OBS (Padrão Broadcaster)',
    description: 'Equilíbrio dinâmico para transmissões ao vivo com música de fundo sutil.',
    config: {
      noiseGateDb: -42,
      speechGain: 2.0,
      smoothingAlpha: 0.68,
      minVisemeHoldMs: 50,
      autoDecayToSilence: true,
      fftSize: 512,
    },
  },
  {
    id: 'energetic_ugc',
    name: 'Apresentador Enérgico & UGC Rápido',
    description: 'Transições rápidas e alta sensibilidade para fala acelerada em vídeos curtos.',
    config: {
      noiseGateDb: -38,
      speechGain: 2.3,
      smoothingAlpha: 0.50,
      minVisemeHoldMs: 30,
      autoDecayToSilence: true,
      fftSize: 512,
    },
  },
  {
    id: 'noisy_room',
    name: 'Ambiente Ruidoso / Microfone Embutido',
    description: 'Portão de ruído agressivo para eliminar digitação e eco de ventiladores.',
    config: {
      noiseGateDb: -32,
      speechGain: 2.4,
      smoothingAlpha: 0.75,
      minVisemeHoldMs: 60,
      autoDecayToSilence: true,
      fftSize: 512,
    },
  },
];

/**
 * Classificador acústico em tempo real para espectro FFT e amplitude RMS
 */
export function classifyAcousticSpectrum(
  freqData: Uint8Array,
  timeDomainData: Uint8Array,
  sampleRate: number,
  config: AudioSyncConfig,
  previousState?: LiveLipSyncState
): LiveLipSyncState {
  const startTime = Date.now();

  // 1. Cálculo de Amplitude RMS a partir do domínio do tempo
  let sumSquares = 0;
  for (let i = 0; i < timeDomainData.length; i++) {
    const normalized = (timeDomainData[i] - 128) / 128;
    sumSquares += normalized * normalized;
  }
  const rms = Math.sqrt(sumSquares / timeDomainData.length);
  const rawDb = rms > 0.00001 ? 20 * Math.log10(rms) : -100;
  const rmsDb = Math.max(-100, Math.min(0, rawDb));
  const rmsLinear = Math.min(1.0, rms * config.speechGain);

  const isSpeaking = rmsDb > config.noiseGateDb;

  // 2. Se abaixo do portão de ruído, decai para silêncio
  if (!isSpeaking) {
    const alpha = config.smoothingAlpha;
    const mouthOpen = previousState ? previousState.mouthOpen * alpha : 0;
    const mouthStretch = previousState ? previousState.mouthStretch * alpha : 0.5;
    const mouthPucker = previousState ? previousState.mouthPucker * alpha : 0;

    return {
      activeViseme: 'silence',
      previousViseme: previousState?.activeViseme || 'silence',
      confidence: 0.98,
      rmsDb,
      rmsLinear: 0,
      formantF1Energy: 0,
      formantF2Energy: 0,
      frictionEnergy: 0,
      mouthOpen: Math.max(0, mouthOpen < 0.01 ? 0 : mouthOpen),
      mouthStretch: Math.max(0.2, mouthStretch),
      mouthPucker: Math.max(0, mouthPucker < 0.01 ? 0 : mouthPucker),
      latencyMs: Math.max(1, Date.now() - startTime),
      isSpeaking: false,
      sampleTime: Date.now(),
    };
  }

  // 3. Decomposição de Bandas Espectrais (Formantes Vocais)
  // Largura de cada bin de frequência
  const binWidth = sampleRate / (freqData.length * 2);

  let f1Sum = 0;
  let f1Count = 0;
  let f2Sum = 0;
  let f2Count = 0;
  let highFrictionSum = 0;
  let highFrictionCount = 0;

  for (let i = 0; i < freqData.length; i++) {
    const freq = i * binWidth;
    const val = freqData[i] / 255;

    if (freq >= 280 && freq <= 1000) {
      f1Sum += val;
      f1Count++;
    } else if (freq > 1000 && freq <= 2800) {
      f2Sum += val;
      f2Count++;
    } else if (freq > 2800 && freq <= 7500) {
      highFrictionSum += val;
      highFrictionCount++;
    }
  }

  const formantF1 = f1Count > 0 ? (f1Sum / f1Count) * config.speechGain : 0;
  const formantF2 = f2Count > 0 ? (f2Sum / f2Count) * config.speechGain : 0;
  const friction = highFrictionCount > 0 ? (highFrictionSum / highFrictionCount) * config.speechGain : 0;

  // 4. Classificação Heurística do Visema Correspondente
  let detectedViseme: VisemeType = 'A_I';
  let confidence = 0.85;

  if (friction > 0.45 && friction > formantF1 * 1.1) {
    // Alta fricção sonora: consoantes 'F', 'V', 'S', 'T'
    if (formantF1 < 0.25) {
      detectedViseme = 'FV'; // Dente no lábio inferior
      confidence = 0.90;
    } else {
      detectedViseme = 'LDT'; // Língua nos dentes / alveolar
      confidence = 0.88;
    }
  } else if (formantF1 > 0.40 && formantF1 >= formantF2 * 0.9) {
    // F1 dominante: mandíbula aberta, vogais abertas 'A', 'I'
    detectedViseme = 'A_I';
    confidence = 0.92;
  } else if (formantF2 > 0.38 && formantF2 > formantF1 * 1.05) {
    // F2 dominante: estiramento de lábios em sorriso 'E', 'É'
    detectedViseme = 'E';
    confidence = 0.89;
  } else if (formantF1 > 0.25 && formantF2 < 0.30) {
    // F1 presente com F2 atenuado (lip rounding): vogais arredondadas 'O', 'U'
    detectedViseme = 'O_U';
    confidence = 0.91;
  } else if (rmsLinear < 0.22 && formantF1 < 0.20 && friction < 0.20) {
    // Transiente de baixa energia pré-explosão: oclusiva bilabial 'M', 'B', 'P'
    detectedViseme = 'MBP';
    confidence = 0.82;
  } else {
    // Fallback fonético proporcional
    detectedViseme = 'A_I';
    confidence = 0.75;
  }

  // 5. Suavização Temporal (Anti-Jitter)
  const meta = CANONICAL_VISEMES_CATALOG[detectedViseme];
  const targetOpen = meta.geometry.verticalAperture * rmsLinear;
  const targetStretch = meta.geometry.horizontalStretch;
  const targetPucker = meta.geometry.lipPucker;

  const alpha = config.smoothingAlpha;
  const mouthOpen = previousState ? previousState.mouthOpen * alpha + targetOpen * (1 - alpha) : targetOpen;
  const mouthStretch = previousState ? previousState.mouthStretch * alpha + targetStretch * (1 - alpha) : targetStretch;
  const mouthPucker = previousState ? previousState.mouthPucker * alpha + targetPucker * (1 - alpha) : targetPucker;

  const latencyMs = Math.max(1, Date.now() - startTime);

  return {
    activeViseme: detectedViseme,
    previousViseme: previousState?.activeViseme || 'silence',
    confidence,
    rmsDb,
    rmsLinear,
    formantF1Energy: Math.min(1.0, formantF1),
    formantF2Energy: Math.min(1.0, formantF2),
    frictionEnergy: Math.min(1.0, friction),
    mouthOpen: Math.max(0, Math.min(1.0, mouthOpen)),
    mouthStretch: Math.max(0, Math.min(1.0, mouthStretch)),
    mouthPucker: Math.max(0, Math.min(1.0, mouthPucker)),
    latencyMs,
    isSpeaking: true,
    sampleTime: Date.now(),
  };
}

/**
 * Cria nós de Web Audio API para análise de microfone ou stream de áudio
 */
export class WebAudioVisemeAnalyzer {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private isRunning = false;

  public async startMicrophone(fftSize = 512): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }

      this.sourceNode = this.audioCtx.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = fftSize;
      this.analyser.smoothingTimeConstant = 0.4;

      this.sourceNode.connect(this.analyser);
      this.isRunning = true;
      return true;
    } catch {
      this.stop();
      return false;
    }
  }

  public getAudioData(
    freqData: Uint8Array,
    timeData: Uint8Array
  ): { sampleRate: number } | null {
    if (!this.analyser || !this.audioCtx) return null;
    (this.analyser as unknown as { getByteFrequencyData: (arr: Uint8Array) => void }).getByteFrequencyData(freqData);
    (this.analyser as unknown as { getByteTimeDomainData: (arr: Uint8Array) => void }).getByteTimeDomainData(timeData);
    return { sampleRate: this.audioCtx.sampleRate };
  }

  public stop(): void {
    if (this.sourceNode) {
      try { this.sourceNode.disconnect(); } catch { /* ignore */ }
      this.sourceNode = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioCtx) {
      try { this.audioCtx.close(); } catch { /* ignore */ }
      this.audioCtx = null;
    }
    this.analyser = null;
    this.isRunning = false;
  }

  public get isActive(): boolean {
    return this.isRunning;
  }
}
