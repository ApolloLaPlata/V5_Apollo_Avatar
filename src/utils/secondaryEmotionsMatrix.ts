/**
 * V5 Apollo Avatar — Matriz de Emoções Secundárias (Secondary Emotions Matrix)
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 *
 * Mapeamento das 4 emoções secundárias e de engajamento social:
 * Dúvida/Curiosidade, Entusiasmo, Empatia Acolhedora e Autoridade Severa.
 * Integração com FACS, inclinação de cabeça (Head-Tilt) e salvaguardas de difusão.
 */

export type SecondaryEmotionType =
  | 'curiosity_doubt'
  | 'enthusiasm_hype'
  | 'warm_empathy'
  | 'stern_authority';

export interface SecondaryEmotionProfile {
  id: SecondaryEmotionType;
  name: string;
  tagline: string;
  facsUnits: string;
  headTiltDeg: number; // Inclinação da cabeça (-15º a +15º)
  socialRole: string;
  recommendedUse: string;
  microExpressions: string[];
  promptFormula: string;
  negativeGuardrail: string;
  warmthIndex: number; // 0 a 100
}

export const CANONICAL_SECONDARY_EMOTIONS: Record<
  SecondaryEmotionType,
  SecondaryEmotionProfile
> = {
  curiosity_doubt: {
    id: 'curiosity_doubt',
    name: 'Dúvida & Curiosidade Intelectual',
    tagline: 'Gesto analítico inquisitivo com sobrancelha erguida',
    facsUnits: 'FACS AU 1 (Unilateral) + AU 2 (Outer Brow) + AU 17 (Chin Raiser)',
    headTiltDeg: 8,
    socialRole: 'Investigador / Questionador',
    recommendedUse: 'Ganchos de curiosidade do V5 Prisma, perguntas ao chat na live do Broadcaster',
    microExpressions: [
      'Uma sobrancelha erguida assimetricamente com elegância',
      'Leve inclinação de cabeça a 8 graus demonstrando interesse',
      'Lábios comprimidos pensativos com comissura neutra',
      'Olhar focado e perspicaz investigando o interlocutor',
    ],
    promptFormula: 'curious inquisitive facial expression, one eyebrow raised with intellectual skepticism, slight head tilt angle, sharp analytical eyes searching for answers, thoughtful compressed lips, compelling mystery ambiance',
    negativeGuardrail: 'clueless, stupid face, goofy face, extreme frown, angry eyebrows, laughing',
    warmthIndex: 50,
  },
  enthusiasm_hype: {
    id: 'enthusiasm_hype',
    name: 'Entusiasmo Vibrante / Hype Máximo',
    tagline: 'Energia contagiante, olhos radiantes e excitação comercial',
    facsUnits: 'FACS AU 1 + AU 2 + AU 5 + AU 12 + AU 25 (Lips Part)',
    headTiltDeg: -4,
    socialRole: 'Apresentador Estrela / Promoter',
    recommendedUse: 'Apresentação de produtos no Fines, comemoração de metas e doações na live',
    microExpressions: [
      'Olhos bem abertos com brilho luminoso intenso',
      'Sorriso aberto expansivo com dentes visíveis',
      'Sobrancelhas arqueadas com empolgação eletrizante',
      'Micro-elevação de queixo projetando presença',
    ],
    promptFormula: 'hyper-enthusiastic ecstatic facial expression, vibrant excited eyes full of wonder and passion, wide ecstatic open smile, animated lively facial expression, radiant positive charisma, commercial hype energy',
    negativeGuardrail: 'screaming, frantic crazy eyes, psychotic grin, distorted wide mouth, terrified, angry',
    warmthIndex: 95,
  },
  warm_empathy: {
    id: 'warm_empathy',
    name: 'Empatia Acolhedora / Conforto Humano',
    tagline: 'Afeto genuíno, escuta ativa e carinho comunitário',
    facsUnits: 'FACS AU 1 (Inner Brow) + AU 12 (Soft Smile) + AU 24 (Lip Press)',
    headTiltDeg: 5,
    socialRole: 'Mentor / Suporte Humanizado',
    recommendedUse: 'Atendimento do V5 Poster, conversas acolhedoras, momentos de desabafo comunitário',
    microExpressions: [
      'Sobrancelhas mediais ligeiramente erguidas em compaixão',
      'Sorriso doce com lábios fechados em formato sereno',
      'Olhar suave, compreensivo e acolhedor',
      'Inclinação suave de cabeça transmitindo escuta ativa',
    ],
    promptFormula: 'deeply empathetic gentle facial expression, kind comforting eyes filled with genuine compassion, warm soft closed-lip smile, head slightly tilted in attentive caring listening, tender reassuring aura',
    negativeGuardrail: 'crying, tragic sadness, depression, cold stare, smirking, arrogant look',
    warmthIndex: 98,
  },
  stern_authority: {
    id: 'stern_authority',
    name: 'Autoridade Severa / Comando Inabalável',
    tagline: 'Gravidade de líder, segurança jurídica e soberania',
    facsUnits: 'FACS AU 4 + AU 7 + AU 17 + AU 23 (Lip Tightener)',
    headTiltDeg: 0,
    socialRole: 'Líder Soberano / Guardião',
    recommendedUse: 'Anúncios institucionais da Holding, avisos legais, tomadas de decisão firmes',
    microExpressions: [
      'Olhar firme e inabalável sem piscar',
      'Sobrancelhas baixas e retas denotando determinação',
      'Mandíbula travada com firmeza geométrica',
      'Zero assimetria: postura frontal de comando',
    ],
    promptFormula: 'stern authoritative resolute facial expression, commanding piercing gaze, firm clenched jaw, straight level eyebrows conveying absolute sovereign power, uncompromising leadership presence, solemn cinematic mood',
    negativeGuardrail: 'smiling, laughing, playful, confused, weak face, crying, frightened, screaming',
    warmthIndex: 15,
  },
};

/**
 * Compila o prompt de emoção secundária com intensidade paramétrica
 */
export function compileSecondaryEmotionPrompt(
  emotionType: SecondaryEmotionType,
  characterName: string = 'Character',
  intensityPercent: number = 100
): { positivePrompt: string; negativePrompt: string; profile: SecondaryEmotionProfile } {
  const profile = CANONICAL_SECONDARY_EMOTIONS[emotionType];
  const weight = (0.75 + (intensityPercent / 100) * 0.45).toFixed(2);

  const headTiltToken = profile.headTiltDeg !== 0
    ? `slight natural head tilt ${Math.abs(profile.headTiltDeg)} degrees ${profile.headTiltDeg > 0 ? 'right' : 'left'}`
    : 'strictly centered posture';

  const positivePrompt = `masterpiece expressive portrait of ${characterName}, (${profile.promptFormula}:${weight}), ${headTiltToken}, ${profile.microExpressions.join(', ')}, ${profile.facsUnits}, 8k uhd, editorial character portrait, hyperrealistic cinematic lighting.`;

  const negativePrompt = `${profile.negativeGuardrail}, unnatural expressions, bad eyes, distorted mouth, bad anatomy.`;

  return { positivePrompt, negativePrompt, profile };
}
