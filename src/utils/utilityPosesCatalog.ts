/**
 * V5 Apollo Avatar — Catálogo de Poses Utilitárias
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 *
 * Biblioteca de poses funcionais para apresentação de produtos do V5 Finders (Fines),
 * cards de autor do V5 Auto Blog e narrativas dinâmicas do V5 Prisma / Edit.
 */

export type PoseCategory = 'all' | 'ugc_fines' | 'authority' | 'storytelling' | 'call_to_action';

export interface UtilityPoseItem {
  id: string;
  name: string;
  category: 'ugc_fines' | 'authority' | 'storytelling' | 'call_to_action';
  categoryLabel: string;
  description: string;
  idealFor: string;
  cameraFraming: string;
  promptDirective: string;
  handGuardrails: string;
}

export const CANONICAL_UTILITY_POSES: UtilityPoseItem[] = [
  {
    id: 'holding_product_fines',
    name: 'Segurando Produto Fines (Vitrine Comercial)',
    category: 'ugc_fines',
    categoryLabel: 'UGC & Produtos',
    description: 'Apresentação comercial com o produto apoiado na palma da mão ou seguro com delicadeza.',
    idealFor: 'Criativos de UGC, apresentadores do V5 Finders, vídeos de conversão Shopee/AliExpress',
    cameraFraming: 'Cowboy Medium Shot (Plano Médio)',
    promptDirective: 'holding and presenting a modern consumer product forward towards camera on open palm, product showcase gesture, natural confident hand grasp, clean finger grip, bright commercial studio lighting, friendly sales presenter smile',
    handGuardrails: 'photorealistic hands, perfectly formed 5 fingers, anatomically correct palm and thumb, no extra fingers, no fused fingers',
  },
  {
    id: 'pointing_cta',
    name: 'Apontando para CTA / Destaque Lateral',
    category: 'call_to_action',
    categoryLabel: 'Call to Action',
    description: 'Gesto indicativo dinâmico apontando para o lado onde entrarão badges de preço ou links.',
    idealFor: 'Vídeos de TikTok/Reels com caixas de texto flutuantes, banners com botão de compra',
    cameraFraming: 'Medium Bust (Busto Médio)',
    promptDirective: 'pointing index finger energetically towards the side of frame, clear directing gesture, engaging direct eye contact with viewer, dynamic presenter stance, crisp hand articulation',
    handGuardrails: 'sharp isolated index finger, clear folded remaining fingers, realistic knuckles, no deformed hand geometry',
  },
  {
    id: 'arms_crossed_authority',
    name: 'Braços Cruzados (Autoridade & Bio)',
    category: 'authority',
    categoryLabel: 'Autoridade & Blog',
    description: 'Postura firme e segura com braços cruzados na altura do peito, transmitindo credibilidade.',
    idealFor: 'Card de autor do V5 Auto Blog, apresentador de relatórios técnicos, perfil executivo',
    cameraFraming: 'Medium Close-up / Busto',
    promptDirective: 'confident arms crossed across chest, authoritative posture, relaxed shoulders, poised professional stance, firm trustworthy eye contact, high-end corporate editorial photography',
    handGuardrails: 'natural resting hands tucked along forearms, anatomically aligned elbows, no distorted limb overlap',
  },
  {
    id: 'thinking_pose',
    name: 'Mão no Queixo (Pose Pensativa / Curiosidade)',
    category: 'storytelling',
    categoryLabel: 'Storytelling',
    description: 'Mão apoiada suavemente no queixo ou maxilar com expressão de reflexão e análise.',
    idealFor: 'Intros de "Você sabia?", ganchos de curiosidade do V5 Prisma, tutoriais explicativos',
    cameraFraming: 'Close-up Rosto & Mão',
    promptDirective: 'thoughtful pose with hand gently resting near chin and jawline, curious contemplative expression, slight head tilt, expressive reflective eyes, editorial dramatic key light',
    handGuardrails: 'elegant relaxed hand against jaw, natural curved fingers, realistic skin fold contact, clean fingernails',
  },
  {
    id: 'welcoming_open_hands',
    name: 'Mãos Abertas (Boas-Vindas & Acolhimento)',
    category: 'ugc_fines',
    categoryLabel: 'UGC & Produtos',
    description: 'Ambas as mãos abertas com palmas voltadas para cima, convidando o público a interagir.',
    idealFor: 'Aberturas de lives no V5 Broadcaster, boas-vindas na landing page, apresentações calorosas',
    cameraFraming: 'Cowboy Medium Shot',
    promptDirective: 'warm welcoming gesture with both hands outstretched open-palmed towards audience, inviting posture, genuine radiant smile, open torso language, studio diffused softbox illumination',
    handGuardrails: 'symmetrical open palms, ten clearly visible fingers, realistic palm crease lines, clean fingers spacing',
  },
  {
    id: 'thumbs_up_approval',
    name: 'Polegar para Cima (Review & Aprovação)',
    category: 'ugc_fines',
    categoryLabel: 'UGC & Produtos',
    description: 'Gesto clássico de aprovação entusiasmada demonstrando que o produto é confiável.',
    idealFor: 'Testemunhais em vídeo, reviews sinceros de produtos minerados, validação de social proof',
    cameraFraming: 'Medium Bust (Busto Médio)',
    promptDirective: 'enthusiastic thumbs-up gesture near chest level, authentic satisfied expression, nodding in approval, crisp focus on face and thumb, lively social media review visual style',
    handGuardrails: 'well-defined upward thumb, tight solid fist, clean thumb nail, anatomical proportion matching wrist',
  },
];

/**
 * Compila o prompt utilitário completo combinando o personagem, vestimenta, produto customizado e salvaguardas.
 */
export function compileUtilityPosePrompt(
  pose: UtilityPoseItem,
  characterName: string = 'Character',
  clothingDescription: string = 'modern stylish outfit',
  customProduct: string = ''
): { positivePrompt: string; negativePrompt: string } {
  const productFragment = customProduct
    ? `featuring product: ${customProduct}, showcasing ${customProduct} with high clarity and commercial fidelity, `
    : '';

  const positive = `hyperrealistic commercial photography of ${characterName}, dressed in ${clothingDescription}, ${pose.promptDirective}, ${productFragment}${pose.handGuardrails}, ${pose.cameraFraming}, 8k uhd, sharp focus, masterwork commercial portrait.`;

  const negative = `bad hands, missing fingers, extra fingers, mutated hands, poorly drawn hands, fused fingers, distorted limb anatomy, blurry hands, deformed wrists, unnatural finger count.`;

  return { positivePrompt: positive, negativePrompt: negative };
}
