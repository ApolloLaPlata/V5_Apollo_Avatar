/**
 * V5 Apollo Avatar - Voice Parameters Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Motor de Modulação Paramétrica Acústica para Síntese Vocal V5 Sound.
 * Controles: Pitch (-12 a +12 semitons), Velocidade (0.5x - 2.0x),
 * Estabilidade (0.0 - 1.0) e Temperatura Sonora (0.1 - 1.0).
 */

import { VoiceEngine } from '@/types/avatar';

export interface VoiceParameters {
  pitchSemitones: number; // -12 a +12 st
  speed: number;          // 0.5x a 2.0x
  stability: number;      // 0.0 a 1.0
  temperature: number;    // 0.1 a 1.0
}

export interface VoiceParametricPreset {
  id: string;
  name: string;
  category: 'social' | 'broadcast' | 'education' | 'cinematic' | 'tech';
  description: string;
  parameters: VoiceParameters;
  recommendedEngine: VoiceEngine;
}

/**
 * Converte semitons musicais (-12 a +12) em fator multiplicador de frequência (0.5x a 2.0x)
 */
export function semitonesToMultiplier(st: number): number {
  return Number(Math.pow(2, st / 12).toFixed(3));
}

/**
 * Converte multiplicador de frequência em semitons
 */
export function multiplierToSemitones(mult: number): number {
  if (mult <= 0) return 0;
  return Number((12 * Math.log2(mult)).toFixed(1));
}

/**
 * Classificação semântica de Pitch (Tonalidade e Timbre)
 */
export function getPitchClassification(st: number): {
  label: string;
  timbre: string;
  color: string;
} {
  if (st <= -8) return { label: 'Sub-Grave Profundo', timbre: 'Baixo Profundo / Cinematic Trailer', color: 'text-indigo-400' };
  if (st <= -4) return { label: 'Grave Imponente', timbre: 'Voz Grave / Autoridade & Peso', color: 'text-blue-400' };
  if (st <= -1.5) return { label: 'Médio-Grave Aveludado', timbre: 'Barítono Aveludado / Rádio Noturna', color: 'text-cyan-400' };
  if (st >= -1.5 && st <= 1.5) return { label: 'Natural / Neutro', timbre: 'Timbre Original do Clone', color: 'text-emerald-400' };
  if (st <= 4) return { label: 'Médio-Agudo Vivo', timbre: 'Tenor / Mezzo-soprano Dinâmico', color: 'text-amber-400' };
  if (st <= 8) return { label: 'Agudo Energético', timbre: 'Voz Jovem / UGC Viral & Anúncios', color: 'text-orange-400' };
  return { label: 'Ultra Agudo', timbre: 'Alta Frequência / Personagem Cartunesco', color: 'text-rose-400' };
}

/**
 * Classificação semântica de Velocidade de Fala e Estimativa de PPM (Palavras Por Minuto)
 */
export function getSpeedClassification(speed: number): {
  label: string;
  wpmEstimate: number;
  useCase: string;
  color: string;
} {
  const baseWpm = 145; // Média padrão em PT-BR
  const wpmEstimate = Math.round(baseWpm * speed);

  if (speed <= 0.7) {
    return { label: 'Dramático Lento', wpmEstimate, useCase: 'Meditação, Poesia e Cenas Solenes', color: 'text-indigo-400' };
  }
  if (speed <= 0.9) {
    return { label: 'Calmo & Intimista', wpmEstimate, useCase: 'Histórias Noturnas e Podcasts Profundos', color: 'text-cyan-400' };
  }
  if (speed <= 1.1) {
    return { label: 'Cadência Natural', wpmEstimate, useCase: 'Aulas, Noticiário e Conversa Padrão', color: 'text-emerald-400' };
  }
  if (speed <= 1.35) {
    return { label: 'Dinâmico & Enérgico', wpmEstimate, useCase: 'Shorts, Reels, TikTok e Vendas UGC', color: 'text-amber-400' };
  }
  if (speed <= 1.65) {
    return { label: 'VSL Acelerada', wpmEstimate, useCase: 'Vídeos de Venda de Alta Conversão', color: 'text-orange-400' };
  }
  return { label: 'Ultra Rápido', wpmEstimate, useCase: 'Leitura de Termos / Estilo Disclaimer', color: 'text-rose-400' };
}

/**
 * Classificação semântica de Estabilidade Acústica (0.0 a 1.0)
 */
export function getStabilityClassification(stability: number): {
  label: string;
  description: string;
  color: string;
} {
  if (stability <= 0.3) {
    return {
      label: 'Expressividade Selvagem',
      description: 'Alta variação de entonação, suspiros e dinâmica emotiva imprevisível.',
      color: 'text-rose-400',
    };
  }
  if (stability <= 0.6) {
    return {
      label: 'Espontâneo & Orgânico',
      description: 'Variações naturais de conversa informal, ideal para criadores de conteúdo.',
      color: 'text-amber-400',
    };
  }
  if (stability <= 0.85) {
    return {
      label: 'Balanceado & Seguro',
      description: 'Ótima estabilidade tonal com expressividade suficiente para reter ouvintes.',
      color: 'text-emerald-400',
    };
  }
  return {
    label: 'Rigor Noticioso / Corporativo',
    description: 'Voz uniforme e estrita, minimizando artefatos e variações bruscas de tom.',
    color: 'text-cyber-cyan',
  };
}

/**
 * Classificação semântica da Temperatura Sonora (Acoustic Entropy 0.1 a 1.0)
 */
export function getTemperatureClassification(temp: number): {
  label: string;
  description: string;
  color: string;
} {
  if (temp <= 0.3) {
    return {
      label: 'Determinístico & Cirúrgico',
      description: 'Baixíssima aleatoriedade fonética. Perfeito para termos técnicos e dicção límpida.',
      color: 'text-blue-400',
    };
  }
  if (temp <= 0.65) {
    return {
      label: 'Equilíbrio Acústico',
      description: 'Variação microfonética que simula o trato vocal humano com autenticidade.',
      color: 'text-emerald-400',
    };
  }
  if (temp <= 0.85) {
    return {
      label: 'Vibrante & Caloroso',
      description: 'Maior liberdade fonética com nuances ricas de respiração e inflexão.',
      color: 'text-amber-400',
    };
  }
  return {
    label: 'Alta Entropia Dramática',
    description: 'Máxima expressividade para atuações teatrais intensas ou risos pontuais.',
    color: 'text-rose-400',
  };
}

/**
 * Presets Canônicos Paramétricos de Voz para o Ecossistema V5 Apollo
 */
export const CANONICAL_VOICE_PRESETS: VoiceParametricPreset[] = [
  {
    id: 'ugc_viral',
    name: 'UGC Viral (Fines Shopee/TikTok)',
    category: 'social',
    description: 'Ritmo acelerado, leve agudo jovem e expressividade alta para reter nos primeiros 3 segundos.',
    recommendedEngine: 'qwen-tts',
    parameters: {
      pitchSemitones: 1.5,
      speed: 1.25,
      stability: 0.65,
      temperature: 0.78,
    },
  },
  {
    id: 'news_authority',
    name: 'Apresentador & Noticiário de Autoridade',
    category: 'broadcast',
    description: 'Dicção cirúrgica, timbre firme e tom corporativo com mínima oscilação acústica.',
    recommendedEngine: 'xtts',
    parameters: {
      pitchSemitones: 0.0,
      speed: 1.05,
      stability: 0.88,
      temperature: 0.35,
    },
  },
  {
    id: 'night_radio',
    name: 'Rádio Noturna & Host Hipnótico',
    category: 'cinematic',
    description: 'Grave aveludado, ritmo lento e relaxante para o Broadcaster na programação das 00h-06h.',
    recommendedEngine: 'cosyvoice',
    parameters: {
      pitchSemitones: -3.0,
      speed: 0.88,
      stability: 0.82,
      temperature: 0.58,
    },
  },
  {
    id: 'hotmart_educator',
    name: 'Professor E-learning (Aulas Hotmart/PLR)',
    category: 'education',
    description: 'Clareza didática sem fadiga auditiva para vídeos longos de 15 a 45 minutos contínuos.',
    recommendedEngine: 'xtts',
    parameters: {
      pitchSemitones: 0.5,
      speed: 1.00,
      stability: 0.92,
      temperature: 0.40,
    },
  },
  {
    id: 'storyteller_dramatic',
    name: 'Storyteller & Narrador de Ficção',
    category: 'cinematic',
    description: 'Ampla faixa dinâmica com entonações teatrais e respirações orgânicas intensas.',
    recommendedEngine: 'qwen-tts',
    parameters: {
      pitchSemitones: -1.5,
      speed: 0.92,
      stability: 0.50,
      temperature: 0.85,
    },
  },
  {
    id: 'cyber_assistant',
    name: 'Cyber IA & Assistente Soberano',
    category: 'tech',
    description: 'Cadência perfeita, precisão sintética futurista e latência ultrabaixa para lives.',
    recommendedEngine: 'cosyvoice',
    parameters: {
      pitchSemitones: 1.0,
      speed: 1.15,
      stability: 0.96,
      temperature: 0.25,
    },
  },
];

/**
 * Avalia o risco de distorção acústica / clipping em função dos parâmetros escolhidos
 */
export function calculateAcousticDistortionRisk(params: VoiceParameters): {
  riskScore: number; // 0 a 100
  riskLevel: 'low' | 'moderate' | 'high';
  warnings: string[];
} {
  const warnings: string[] = [];
  let score = 10;

  // Pitch excessivo
  if (Math.abs(params.pitchSemitones) > 8) {
    score += 35;
    warnings.push(`Pitch de ${params.pitchSemitones > 0 ? '+' : ''}${params.pitchSemitones} st pode provocar formantes artificiais ("efeito esquilo" ou "monstro").`);
  } else if (Math.abs(params.pitchSemitones) > 4) {
    score += 15;
  }

  // Velocidade extrema
  if (params.speed > 1.6) {
    score += 30;
    warnings.push(`Velocidade de ${params.speed.toFixed(2)}x pode comprimir fonemas e causar perda de dicção nos visemas labiais.`);
  } else if (params.speed < 0.7) {
    score += 25;
    warnings.push(`Velocidade de ${params.speed.toFixed(2)}x pode provocar alongamento não natural de vogais.`);
  }

  // Estabilidade muito baixa combinada com temperatura alta
  if (params.stability < 0.35 && params.temperature > 0.8) {
    score += 30;
    warnings.push('Baixa estabilidade combinada com alta temperatura pode gerar alucinações de fonemas ou chiado no modelo neural.');
  }

  // Estabilidade muito alta com temperatura muito baixa
  if (params.stability > 0.92 && params.temperature < 0.25) {
    warnings.push('Parâmetros hiper-estáticos podem deixar a voz excessivamente robótica e sem expressividade humana.');
  }

  const riskScore = Math.min(100, score);
  let riskLevel: 'low' | 'moderate' | 'high' = 'low';
  if (riskScore >= 60) riskLevel = 'high';
  else if (riskScore >= 35) riskLevel = 'moderate';

  return { riskScore, riskLevel, warnings };
}

/**
 * Compila o payload estruturado para chamada de inferência no V5 Sound
 */
export function compileV5SoundVoicePayload(
  params: VoiceParameters,
  engine: VoiceEngine,
  voiceId?: string
): Record<string, unknown> {
  const pitchMultiplier = semitonesToMultiplier(params.pitchSemitones);
  
  return {
    engine,
    voice_id: voiceId || 'voice_default_v5',
    parameters: {
      pitch_shift_semitones: params.pitchSemitones,
      pitch_multiplier: pitchMultiplier,
      speed_factor: params.speed,
      stability_weight: params.stability,
      acoustic_temperature: params.temperature,
    },
    inference_config: {
      enable_anti_clipping: true,
      sample_rate: 44100,
      audio_format: 'wav',
      normalize_audio: true,
    },
    metadata: {
      compiled_at: new Date().toISOString(),
      source_system: 'V5_Apollo_Avatar_Studio_Port_3010',
    },
  };
}
