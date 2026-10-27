/**
 * V5 Apollo Avatar — Matriz de Emoções Base do Personagem (Base Emotions Matrix)
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 *
 * Mapeamento das 5 emoções fundamentais humanas baseadas no sistema FACS (Facial Action Coding System),
 * com unidades de ação muscular, calibragem de microexpressões e diretivas para difusão homogênea.
 */

export type BaseEmotionType =
  | 'neutral'
  | 'open_smile'
  | 'subtle_smile'
  | 'serious_focus'
  | 'surprise';

export interface BaseEmotionProfile {
  id: BaseEmotionType;
  name: string;
  tagline: string;
  facsUnits: string; // Ex: AU 6 + AU 12
  energyLevel: 'neutro' | 'alto' | 'sutil' | 'foco';
  recommendedContext: string;
  microExpressions: string[];
  promptFormula: string;
  negativeGuardrail: string;
  facialTensionPercent: number;
}

export const CANONICAL_BASE_EMOTIONS: Record<BaseEmotionType, BaseEmotionProfile> = {
  neutral: {
    id: 'neutral',
    name: 'Neutro Calmo / Repouso Canônico',
    tagline: 'Linha de base relaxada para transições fluidas',
    facsUnits: 'FACS AU 0 (Baseline)',
    energyLevel: 'neutro',
    recommendedContext: 'Frame de ancoragem, telas de espera, transições neutras no Broadcaster',
    microExpressions: [
      'Sobrancelhas em arco natural relaxado',
      'Lábios em contato suave sem tensão',
      'Olhar focado e sereno na lente',
      'Simetria facial de repouso canônico',
    ],
    promptFormula: 'neutral relaxed facial expression, resting facial muscles, calm direct eye contact with camera, gentle closed mouth with soft resting lips, serene balanced face, clean studio portrait',
    negativeGuardrail: 'smiling, frowning, grimacing, exaggerated emotions, open mouth, squinting',
    facialTensionPercent: 0,
  },
  open_smile: {
    id: 'open_smile',
    name: 'Sorriso Aberto Radiante (Duchenne)',
    tagline: 'Alegria genuína, alta simpatia e conexão magnética',
    facsUnits: 'FACS AU 6 (Cheek Raiser) + AU 12 (Lip Corner Puller)',
    energyLevel: 'alto',
    recommendedContext: 'Criativos de UGC, apresentações de sucesso, hooks alegres no V5 Prisma',
    microExpressions: [
      'Elevação dos zigomáticos maiores',
      'Rugas suaves ao redor dos olhos (pés de galinha naturais)',
      'Arco dental superior visível e alinhado',
      'Brilho especular caloroso nos olhos',
    ],
    promptFormula: 'genuine radiant open smile, authentic Duchenne smile, cheeks lifted, natural crinkling around eyes showing happiness, clean upper teeth showing naturally, joyful sparkling eyes, vibrant warm aura',
    negativeGuardrail: 'creepy grin, stiff forced smile, crooked mouth, yellow teeth, joker mouth, closed lips',
    facialTensionPercent: 65,
  },
  subtle_smile: {
    id: 'subtle_smile',
    name: 'Sorriso Sutil / Charme & Ironia',
    tagline: 'Mistério, confiança refinada e empatia elegante',
    facsUnits: 'FACS AU 12 (Unilateral) + AU 14 (Dimpler)',
    energyLevel: 'sutil',
    recommendedContext: 'Cards de autor do AutoBlog, apresentação de relatórios executivos, storytelling',
    microExpressions: [
      'Leve elevação assimétrica de um canto do lábio',
      'Covinha sutil na bochecha ativa',
      'Olhar perspicaz e acolhedor',
      'Lábios fechados ou fresta milimétrica',
    ],
    promptFormula: 'subtle charismatic smirk, gentle knowing half-smile, confident playful glint in eyes, subtle cheek dimple, closed lips with slight upward curve at corners, sophisticated refined demeanor',
    negativeGuardrail: 'broad open smile, laughing, sad mouth, sneer, angry smirk, visible gums',
    facialTensionPercent: 30,
  },
  serious_focus: {
    id: 'serious_focus',
    name: 'Foco Sério / Autoridade Analítica',
    tagline: 'Gravidade intelectual, precisão técnica e comando',
    facsUnits: 'FACS AU 4 (Brow Lowerer) + AU 7 (Lid Tightener)',
    energyLevel: 'foco',
    recommendedContext: 'Vídeos de notícias, análises de mercado financeiro, avisos institucionais',
    microExpressions: [
      'Leve aproximação das sobrancelhas sem ruga excessiva',
      'Pálpebras inferiores ligeiramente tensas (olhar penetrante)',
      'Mandíbula firme e decidida',
      'Postura de atenção inabalável',
    ],
    promptFormula: 'intense focused serious facial expression, analytical determined gaze, slightly lowered eyebrows conveying deep concentration, firm jawline, sharp piercing eye contact, executive authoritative atmosphere',
    negativeGuardrail: 'smiling, laughing, happy, clownish, sad, crying, sleeping eyes, sleepy face',
    facialTensionPercent: 55,
  },
  surprise: {
    id: 'surprise',
    name: 'Surpresa / Descoberta Dinâmica',
    tagline: 'Espanto positivo, revelação e gancho visual instantâneo',
    facsUnits: 'FACS AU 1 + AU 2 (Brow Raiser) + AU 5 (Upper Lid) + AU 26 (Jaw Drop)',
    energyLevel: 'alto',
    recommendedContext: 'Thumbnails de vídeos no YouTube, ganchos de Shorts ("Você não vai acreditar nisso!")',
    microExpressions: [
      'Sobrancelhas arqueadas e elevadas na testa',
      'Abertura ampla dos olhos revelando esclera',
      'Boca semiaberta em formato de espanto',
      'Expressão de admiração ou choque positivo',
    ],
    promptFormula: 'surprised and astonished facial expression, wide open eyes in genuine wonder, arched raised eyebrows, slightly open dropped mouth in shock, captivating revelation look, dramatic dynamic emotion',
    negativeGuardrail: 'terrified, horror, crying, disgust, bored, sleepy, neutral calm face',
    facialTensionPercent: 85,
  },
};

/**
 * Compila a fórmula de prompt com o nome do personagem e nível de intensidade (10% a 100%)
 */
export function compileBaseEmotionPrompt(
  emotionType: BaseEmotionType,
  characterName: string = 'Character',
  intensityPercent: number = 100
): { positivePrompt: string; negativePrompt: string; profile: BaseEmotionProfile } {
  const profile = CANONICAL_BASE_EMOTIONS[emotionType];
  const weight = (0.7 + (intensityPercent / 100) * 0.5).toFixed(2); // Varia de 0.75x a 1.20x

  const positivePrompt = `masterpiece portrait photography of ${characterName}, (${profile.promptFormula}:${weight}), ${profile.microExpressions.join(', ')}, ${profile.facsUnits}, 8k uhd, cinematic portrait lighting, high micro-contrast skin texture, authentic human emotion.`;

  const negativePrompt = `${profile.negativeGuardrail}, unnatural emotion, cartoonish face, deformed eyes, bad teeth, bad anatomy, over-processed.`;

  return { positivePrompt, negativePrompt, profile };
}
