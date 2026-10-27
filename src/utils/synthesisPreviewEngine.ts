/**
 * V5 Apollo Avatar - Synthesis Preview Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Motor de Simulação de Síntese Vocal e Sincronização Temporal de Fonemas e Visemas.
 * Converte qualquer texto em uma timeline de palavras cronometradas (Karaokê)
 * e marcadores de visemas labiais sincronizados para visualização em tempo real.
 */

import { VisemeType, VoiceEngine } from '@/types/avatar';

export interface TimedSpeechToken {
  id: string;
  word: string;
  startTimeSec: number;
  endTimeSec: number;
  durationSec: number;
  dominantViseme: VisemeType;
  stressLevel: number; // 0.0 a 1.0
}

export interface SynthesisTimeline {
  text: string;
  tokens: TimedSpeechToken[];
  totalDurationSec: number;
  estimatedWpm: number;
  engine: VoiceEngine;
  speedFactor: number;
  simulatedInferenceLatencyMs: number;
  realTimeFactor: number;
}

export interface QuickSpeechScript {
  id: string;
  title: string;
  category: 'ugc' | 'news' | 'live' | 'vsl';
  text: string;
}

export const CANONICAL_QUICK_SCRIPTS: QuickSpeechScript[] = [
  {
    id: 'script_ugc_fines',
    title: 'Intro UGC (Fines Shopee)',
    category: 'ugc',
    text: 'Você ainda perde tempo limpando isso na mão? Olha esse achado do Fines que acabou de chegar!',
  },
  {
    id: 'script_news_blog',
    title: 'Plantão Notícias V5 Auto Blog',
    category: 'news',
    text: 'Plantão oficial de Inteligência Artificial: os novos modelos neurais soberanos acabam de ser homologados com sucesso.',
  },
  {
    id: 'script_live_broadcaster',
    title: 'Abertura de Live V5 Broadcaster',
    category: 'live',
    text: 'Muito boa noite a todos os ouvintes da nossa rádio 24 horas! Fiquem à vontade no chat, a transmissão está só começando.',
  },
  {
    id: 'script_vsl_conversion',
    title: 'Fechamento VSL de Alta Conversão',
    category: 'vsl',
    text: 'Clique no botão abaixo agora mesmo e garanta sua vaga soberana antes que as inscrições deste lote se encerrem.',
  },
];

/**
 * Deduz o visema dominante de uma palavra com base na fonética PT-BR
 */
export function estimateWordDominantViseme(word: string): VisemeType {
  const clean = word.toLowerCase().replace(/[^a-zãõáéíóúâêôç]/g, '');
  if (!clean || clean.length === 0) return 'silence';

  // Oclusão labial (p, b, m)
  if (/^[pbm]/.test(clean) || /[pbm]$/.test(clean) || /[pbm]{2}/.test(clean)) {
    return 'MBP';
  }

  // Labiodental (f, v)
  if (/^[fv]/.test(clean) || /[fv]/.test(clean)) {
    return 'FV';
  }

  // Língua/Dente/Alveolar (l, d, t, s, z, c, ç)
  if (/^[ldtszç]/.test(clean) || /[td]/.test(clean)) {
    return 'LDT';
  }

  // Arredondamento labial (o, u, ô, ó)
  if (/[ouóô]/.test(clean)) {
    return 'O_U';
  }

  // Vogal aberta / média (a, i, á, í, ã)
  if (/[aáã]/.test(clean)) {
    return 'A_I';
  }

  // Palatal / frontal (e, é, ê)
  if (/[eéê]/.test(clean)) {
    return 'E';
  }

  return 'A_I';
}

/**
 * Compila a timeline de fala a partir do texto e do fator de velocidade
 */
export function compileSpeechTimeline(
  text: string,
  speedFactor: number = 1.0,
  engine: VoiceEngine = 'qwen-tts'
): SynthesisTimeline {
  const sanitized = text.trim();
  if (!sanitized) {
    return {
      text: '',
      tokens: [],
      totalDurationSec: 0,
      estimatedWpm: 0,
      engine,
      speedFactor,
      simulatedInferenceLatencyMs: 0,
      realTimeFactor: 0.15,
    };
  }

  const rawWords = sanitized.split(/\s+/);
  const baseSecPerChar = 0.052 / Math.max(0.4, speedFactor); // Ajuste dinâmico por velocidade
  const punctuationPauseSec = 0.22 / Math.max(0.4, speedFactor);

  let accumulatedTime = 0.12; // Silêncio pré-fala inicial
  const tokens: TimedSpeechToken[] = [];

  rawWords.forEach((word, index) => {
    const hasPunctuation = /[.,!?;:]$/.test(word);
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    const charCount = Math.max(2, cleanWord.length);

    let wordDuration = charCount * baseSecPerChar;
    // Palavras curtas têm duração mínima audível
    if (wordDuration < 0.18) wordDuration = 0.18;

    const startTimeSec = Number(accumulatedTime.toFixed(3));
    accumulatedTime += wordDuration;

    // Pausa por pontuação
    if (hasPunctuation) {
      accumulatedTime += punctuationPauseSec;
    } else {
      accumulatedTime += 0.04; // Micro-espaço entre palavras
    }

    const endTimeSec = Number(accumulatedTime.toFixed(3));

    tokens.push({
      id: `token_${index}_${cleanWord}`,
      word,
      startTimeSec,
      endTimeSec,
      durationSec: Number((endTimeSec - startTimeSec).toFixed(3)),
      dominantViseme: estimateWordDominantViseme(cleanWord),
      stressLevel: hasPunctuation ? 0.9 : 0.5 + (charCount % 4) * 0.1,
    });
  });

  const totalDurationSec = Number((accumulatedTime + 0.15).toFixed(2));
  const estimatedWpm = Math.round((rawWords.length / totalDurationSec) * 60);

  // Latência estimada por motor
  let latencyMs = 240;
  let rtf = 0.18;
  if (engine === 'xtts') {
    latencyMs = 580;
    rtf = 0.32;
  } else if (engine === 'cosyvoice') {
    latencyMs = 160;
    rtf = 0.12;
  }

  return {
    text: sanitized,
    tokens,
    totalDurationSec,
    estimatedWpm,
    engine,
    speedFactor,
    simulatedInferenceLatencyMs: latencyMs,
    realTimeFactor: rtf,
  };
}

/**
 * Retorna o visema atual correspondente ao segundo exato da reprodução
 */
export function getCurrentVisemeAtTime(
  timeline: SynthesisTimeline,
  currentTimeSec: number
): VisemeType {
  if (currentTimeSec <= 0.05 || currentTimeSec >= timeline.totalDurationSec - 0.05) {
    return 'silence';
  }

  const token = timeline.tokens.find(
    (t) => currentTimeSec >= t.startTimeSec && currentTimeSec <= t.endTimeSec
  );

  return token ? token.dominantViseme : 'silence';
}

/**
 * Retorna o índice do token (palavra) atualmente em reprodução
 */
export function getCurrentWordIndex(
  timeline: SynthesisTimeline,
  currentTimeSec: number
): number {
  return timeline.tokens.findIndex(
    (t) => currentTimeSec >= t.startTimeSec && currentTimeSec <= t.endTimeSec
  );
}
