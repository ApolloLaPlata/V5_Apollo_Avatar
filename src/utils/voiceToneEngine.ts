/**
 * V5 Apollo Avatar - Voice Tone Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Seletor e Modulador de Tonalidade Emocional Vocal para Síntese V5 Sound.
 * Tonalidades Canônicas: Enérgico, Calmo, Autoritário, Amigável, Hipnótico, Noturno (e Sussurrado/ASMR).
 */

import { VoiceTone } from '@/types/avatar';
import { VoiceParameters } from './voiceParametersEngine';

export interface VoiceToneProfile {
  id: VoiceTone;
  name: string;
  subtitle: string;
  description: string;
  intendedUse: string;
  channelTarget: string;
  samplePhrase: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  frequencyEmphasis: string;
  recommendedPitchDelta: number; // Semitons sugeridos
  recommendedSpeedMultiplier: number;
  recommendedStability: number;
  ssmlTag: {
    pitch: string;
    rate: string;
    emphasis: 'strong' | 'moderate' | 'reduced' | 'none';
    contour: string;
  };
}

export const CANONICAL_VOICE_TONES: Record<VoiceTone, VoiceToneProfile> = {
  energetic: {
    id: 'energetic',
    name: 'Enérgico / Entusiasmado',
    subtitle: 'Alto impacto, retenção rápida & dinamismo',
    description: 'Projeção vocal para frente, ataques rápidos nas consoantes e entonação ascendente que gera curiosidade imediata.',
    intendedUse: 'Vídeos de UGC (Fines Shopee/TikTok), anúncios em carrossel e abertura de canais.',
    channelTarget: 'Instagram Reels & TikTok',
    samplePhrase: 'Você não vai acreditar no que esse produto é capaz de fazer em menos de 10 segundos!',
    color: 'text-amber-400',
    bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    borderColor: 'border-amber-500/30 hover:border-amber-500/60',
    frequencyEmphasis: 'Picos em 2.8 kHz - 5 kHz (Presença e Brilho)',
    recommendedPitchDelta: 1.5,
    recommendedSpeedMultiplier: 1.20,
    recommendedStability: 0.65,
    ssmlTag: {
      pitch: '+8%',
      rate: '118%',
      emphasis: 'strong',
      contour: '(0%, +15%) (50%, +5%) (100%, +20%)',
    },
  },
  calm: {
    id: 'calm',
    name: 'Calmo / Reflexivo',
    subtitle: 'Didática serena, empatia & conforto',
    description: 'Respiração audível controlada, cadência estável sem pressa e finalização de frases com modulação suave descendente.',
    intendedUse: 'Aulas introdutórias, tutoriais técnicos densos, saúde, finanças e onboarding.',
    channelTarget: 'Cursos Hotmart & YouTube Long-form',
    samplePhrase: 'Respire fundo. A partir de agora, cada passo que dermos juntos será claro e objetivo.',
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
    borderColor: 'border-cyan-500/30 hover:border-cyan-500/60',
    frequencyEmphasis: 'Equilíbrio suave em 500 Hz - 2 kHz (Conforto Auditivo)',
    recommendedPitchDelta: -0.5,
    recommendedSpeedMultiplier: 0.95,
    recommendedStability: 0.88,
    ssmlTag: {
      pitch: '-3%',
      rate: '94%',
      emphasis: 'moderate',
      contour: '(0%, 0%) (60%, -2%) (100%, -5%)',
    },
  },
  authoritative: {
    id: 'authoritative',
    name: 'Autoritário / Noticiário',
    subtitle: 'Gravidade institucional, credibilidade & rigor',
    description: 'Ressonância peitoral marcante, dicção estrita sem gírias e pausas milimétricas antes de números e dados cruciais.',
    intendedUse: 'Comunicados oficiais da Holding, relatórios de mercado, notícias diárias e podcasts analíticos.',
    channelTarget: 'V5 Auto Blog & YouTube Notícias',
    samplePhrase: 'Os relatórios deste trimestre confirmam a soberania tecnológica da nossa infraestrutura.',
    color: 'text-indigo-400',
    bgGradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
    borderColor: 'border-indigo-500/30 hover:border-indigo-500/60',
    frequencyEmphasis: 'Frequência fundamental 85 Hz - 180 Hz (Corpo e Peso)',
    recommendedPitchDelta: -2.0,
    recommendedSpeedMultiplier: 1.05,
    recommendedStability: 0.94,
    ssmlTag: {
      pitch: '-7%',
      rate: '102%',
      emphasis: 'strong',
      contour: '(0%, -5%) (80%, -8%) (100%, -12%)',
    },
  },
  friendly: {
    id: 'friendly',
    name: 'Amigável / Conversacional',
    subtitle: 'Calor humano, proximidade & naturalidade',
    description: 'Tom acolhedor com micro-sorrisos vocais perceptíveis nos harmônicos e entonações que convidam à interação.',
    intendedUse: 'Directs automatizados de Instagram, chats interativos e SAC humanizado de IA.',
    channelTarget: 'WhatsApp & Instagram Direct',
    samplePhrase: 'Oi! Que bom ter você por aqui. Me conta, como posso te ajudar hoje?',
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
    frequencyEmphasis: 'Harmônicos de calor 1.2 kHz - 3 kHz',
    recommendedPitchDelta: 0.5,
    recommendedSpeedMultiplier: 1.00,
    recommendedStability: 0.78,
    ssmlTag: {
      pitch: '+3%',
      rate: '100%',
      emphasis: 'moderate',
      contour: '(0%, +5%) (40%, 0%) (100%, +8%)',
    },
  },
  hypnotic: {
    id: 'hypnotic',
    name: 'Hipnótico / Sedutor',
    subtitle: 'Ressonância profunda, ritmo envolvente & mistério',
    description: 'Vocal fry sutil nas caudas de palavras, sustentação de silêncios estratégicos e proximidade de microfone de condensador.',
    intendedUse: 'Narrativas imersivas, ficção científica, audiobooks de mistério e trailers.',
    channelTarget: 'V5 Broadcaster Cinema & Podcasts',
    samplePhrase: 'Feche os olhos por um instante... e imagine um mundo onde as fronteiras digitais não existem mais.',
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
    borderColor: 'border-purple-500/30 hover:border-purple-500/60',
    frequencyEmphasis: 'Graves aveludados 60 Hz - 140 Hz com compressão ótica',
    recommendedPitchDelta: -2.5,
    recommendedSpeedMultiplier: 0.88,
    recommendedStability: 0.82,
    ssmlTag: {
      pitch: '-10%',
      rate: '88%',
      emphasis: 'moderate',
      contour: '(0%, -2%) (50%, -10%) (100%, -15%)',
    },
  },
  night: {
    id: 'night',
    name: 'Noturno / Madrugada',
    subtitle: 'Voz de rádio FM 24h, intimista & aveludada',
    description: 'Baixa dinâmica de volume, ritmo desacelerado e ambiência calorosa com efeito Ducking perfeito para trilha Lo-Fi.',
    intendedUse: 'Host da rádio 24h ao vivo do V5 Broadcaster e transmissões no horário da madrugada (00h-06h).',
    channelTarget: 'V5 Broadcaster Rádio 24h OBS',
    samplePhrase: 'Mais uma madrugada fria que começa aqui na V5 Apollo Radio... fiquem confortáveis, a música não para.',
    color: 'text-cyber-cyan',
    bgGradient: 'from-cyber-cyan/10 via-cyber-cyan/5 to-transparent',
    borderColor: 'border-cyber-cyan/30 hover:border-cyber-cyan/60',
    frequencyEmphasis: 'Equalização Warm Tube (Realce em 120 Hz e atenuação acima de 8 kHz)',
    recommendedPitchDelta: -3.0,
    recommendedSpeedMultiplier: 0.85,
    recommendedStability: 0.85,
    ssmlTag: {
      pitch: '-12%',
      rate: '85%',
      emphasis: 'reduced',
      contour: '(0%, -5%) (70%, -10%) (100%, -12%)',
    },
  },
  whisper: {
    id: 'whisper',
    name: 'Sussurrado / ASMR',
    subtitle: 'Ar puro nas cordas vocais, máxima intimidade',
    description: 'Sem fonação completa das pregas vocais; predomínio de ar comprimido e sensações binaurais estereofônicas.',
    intendedUse: 'Conteúdos sensoriais de ASMR, relaxamento profundo e segredos revelados.',
    channelTarget: 'YouTube ASMR & Relax',
    samplePhrase: 'Ouça com atenção... esse é o segredo que ninguém tinha coragem de revelar até agora.',
    color: 'text-pink-400',
    bgGradient: 'from-pink-500/10 via-pink-500/5 to-transparent',
    borderColor: 'border-pink-500/30 hover:border-pink-500/60',
    frequencyEmphasis: 'Filtro passa-alta em 300 Hz com realce de ar em 10 kHz - 14 kHz',
    recommendedPitchDelta: 0.0,
    recommendedSpeedMultiplier: 0.80,
    recommendedStability: 0.60,
    ssmlTag: {
      pitch: '0%',
      rate: '80%',
      emphasis: 'none',
      contour: '(0%, 0%) (100%, 0%)',
    },
  },
};

/**
 * Retorna o perfil completo da tonalidade vocal
 */
export function getVoiceToneProfile(tone: VoiceTone): VoiceToneProfile {
  return CANONICAL_VOICE_TONES[tone] || CANONICAL_VOICE_TONES.energetic;
}

/**
 * Modula parâmetros acústicos de acordo com a tonalidade selecionada
 */
export function applyVoiceToneModifiers(
  baseParams: VoiceParameters,
  tone: VoiceTone
): VoiceParameters {
  const profile = getVoiceToneProfile(tone);
  return {
    pitchSemitones: profile.recommendedPitchDelta,
    speed: profile.recommendedSpeedMultiplier,
    stability: profile.recommendedStability,
    temperature: baseParams.temperature,
  };
}

/**
 * Gera código SSML estruturado com tags acústicas para o V5 Sound / Qwen-TTS
 */
export function compileToneSSML(text: string, tone: VoiceTone): string {
  const profile = getVoiceToneProfile(tone);
  const { pitch, rate, emphasis } = profile.ssmlTag;

  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="pt-BR">
  <prosody pitch="${pitch}" rate="${rate}">
    <emphasis level="${emphasis}">
      ${text}
    </emphasis>
  </prosody>
</speak>`;
}
