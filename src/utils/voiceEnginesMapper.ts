/**
 * V5 Apollo Avatar — Mapeador de Motores de Síntese Vocal (Voice Engine Mapper)
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 *
 * Mapeamento de perfis técnicos, latência de inferência, custo de VRAM e
 * compatibilidade dos motores neurais do V5 Sound: Qwen-TTS, XTTS-v2 e CosyVoice.
 */

import { VoiceEngine } from '@/types/avatar';

export interface VoiceEngineProfile {
  id: VoiceEngine;
  name: string;
  tagline: string;
  architecture: string;
  averageLatencyMs: number;
  realTimeFactor: number; // RTF < 1.0 é mais rápido que tempo real
  nativeSampleRateHz: number;
  streamingSupported: boolean;
  zeroShotCloningQuality: 'Excepcional' | 'Muito Alta' | 'Cinemática Expressiva';
  vramFootprintGb: number;
  targetCapitanias: string[];
  bestUseCases: string;
  handshakePayload: {
    engineId: string;
    protocol: 'websocket_stream' | 'rest_batch';
    bufferChunkMs: number;
  };
}

export const CANONICAL_VOICE_ENGINES: Record<VoiceEngine, VoiceEngineProfile> = {
  'qwen-tts': {
    id: 'qwen-tts',
    name: 'Qwen-TTS (Qwen2-Audio Foundation)',
    tagline: 'Prosódia natural brasileira e alta fidelidade conversacional',
    architecture: 'Large Audio LLM + Neural Vocoder (24kHz)',
    averageLatencyMs: 240,
    realTimeFactor: 0.28,
    nativeSampleRateHz: 24000,
    streamingSupported: true,
    zeroShotCloningQuality: 'Muito Alta',
    vramFootprintGb: 6.5,
    targetCapitanias: ['#07_V5_BROADCASTER', '#13_V5_POSTER', '#08_V5_PRISMA'],
    bestUseCases: 'Lives de VTuber, assistentes de chat dinâmicos e vídeos de UGC rápidos',
    handshakePayload: {
      engineId: 'engine_qwen_tts_v1',
      protocol: 'websocket_stream',
      bufferChunkMs: 80,
    },
  },
  xtts: {
    id: 'xtts',
    name: 'XTTS-v2 Multi-Language',
    tagline: 'Clonagem multilíngue com respirações e estabilidade em textos longos',
    architecture: 'Tortoise/VITS Hybrid + Multi-Speaker Embedding',
    averageLatencyMs: 580,
    realTimeFactor: 0.65,
    nativeSampleRateHz: 24000,
    streamingSupported: false,
    zeroShotCloningQuality: 'Excepcional',
    vramFootprintGb: 4.8,
    targetCapitanias: ['#09_V5_EDIT', '#01_V5_SOUND', '#11_V5_AUTOBLOG'],
    bestUseCases: 'Vídeos longos de YouTube, audiolivros, cursos Hotmart/PLR e documentários',
    handshakePayload: {
      engineId: 'engine_xtts_v2_core',
      protocol: 'rest_batch',
      bufferChunkMs: 250,
    },
  },
  cosyvoice: {
    id: 'cosyvoice',
    name: 'CosyVoice-2 Streaming',
    tagline: 'Ultra-baixa latência streaming com modulação emocional expressiva',
    architecture: 'Super-aligned Flow Matching + Diffusion Vocoder (48kHz)',
    averageLatencyMs: 160,
    realTimeFactor: 0.18,
    nativeSampleRateHz: 48000,
    streamingSupported: true,
    zeroShotCloningQuality: 'Cinemática Expressiva',
    vramFootprintGb: 8.0,
    targetCapitanias: ['#07_V5_BROADCASTER', '#09_V5_EDIT', '#05_V5_GAMES'],
    bestUseCases: 'Streaming de VTubers em tempo real, risos e interjeições teatrais',
    handshakePayload: {
      engineId: 'engine_cosyvoice_stream_v2',
      protocol: 'websocket_stream',
      bufferChunkMs: 40,
    },
  },
};
