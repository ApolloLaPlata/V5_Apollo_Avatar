/**
 * V5 Apollo Avatar - UGC Product Pose Generator Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Gerador de Poses de Apresentador UGC com Produtos Minerados do V5 Finders.
 * Conecta os personagens virtuais aos produtos de afiliados de alta conversão, gerando
 * poses com interação manual natural (segurando produto, unboxing, demonstração e comparação)
 * com travas anti-deformação de dedos e consistência biométrica.
 */

import { AvatarProfile } from '@/types/avatar';

export type ProductCategory =
  | 'tech_gadget'
  | 'beauty_skincare'
  | 'health_wellness'
  | 'home_lifestyle'
  | 'fashion_accessories';

export type UgcPoseType =
  | 'holding_palm_flat'
  | 'presenting_close_lens'
  | 'pointing_product_index'
  | 'unboxing_curiosity'
  | 'lifestyle_in_use'
  | 'side_by_side_comparison';

export interface UgcProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  brandPlaceholder: string;
  keyFeature: string;
  minedPriceBrl: string;
  visualDescriptionPrompt: string;
  recommendedPose: UgcPoseType;
}

export interface UgcPoseDefinition {
  id: UgcPoseType;
  title: string;
  handInteraction: string;
  facialExpression: string;
  cameraPerspective: string;
  conversionRole: string;
  antiFingerGlitchConstraints: string[];
}

export interface CompiledUgcPrompt {
  poseId: UgcPoseType;
  poseTitle: string;
  productName: string;
  category: ProductCategory;
  conversionRole: string;
  positivePrompt: string;
  negativePrompt: string;
  recommendedAspect: '9:16 vertical';
  resolution: { width: number; height: number };
}

export interface UgcPosePackage {
  packageId: string;
  avatarId: string;
  avatarName: string;
  product: UgcProductItem;
  totalPrompts: number;
  prompts: CompiledUgcPrompt[];
  schemaVersion: 'v5apollo.ugcposes.v1.0';
  generatedAt: string;
}

/**
 * Produtos em alta minerados pelo radar do V5 Finders
 */
export const MINED_PRODUCTS_V5_FINDERS: UgcProductItem[] = [
  {
    id: 'prod_earbuds_tws',
    name: 'Fone ANC Espacial TWS Titan Pro',
    category: 'tech_gadget',
    brandPlaceholder: 'TitanSound Audio',
    keyFeature: 'Cancelamento Ativo de Ruído 45dB e acabamento em alumínio fosco grafite',
    minedPriceBrl: 'R$ 149,90 (Afiliado Shopee/AliExpress)',
    visualDescriptionPrompt:
      'matte graphite metallic wireless earbud charging case held elegantly, subtle cyan LED indicator light glowing, sleek ergonomic earbuds',
    recommendedPose: 'holding_palm_flat',
  },
  {
    id: 'prod_copper_serum',
    name: 'Serum Facial Peptídeo de Cobre Puro',
    category: 'beauty_skincare',
    brandPlaceholder: 'Lumina Derma Lab',
    keyFeature: 'Frasco conta-gotas de vidro âmbar com sérum azul cobalto bioluminescente',
    minedPriceBrl: 'R$ 89,90 (TikTok Shop / Amazon)',
    visualDescriptionPrompt:
      'amber glass dropper bottle with luxurious deep cobalt blue liquid serum, minimalist matte white label with gold embossed typography',
    recommendedPose: 'presenting_close_lens',
  },
  {
    id: 'prod_mini_projector',
    name: 'Mini Projetor Laser 4K Portátil',
    category: 'tech_gadget',
    brandPlaceholder: 'AuraBeam Studio',
    keyFeature: 'Cilindro giratório compacto de 180º que cabe na palma da mão',
    minedPriceBrl: 'R$ 289,00 (Achadinhos Viral)',
    visualDescriptionPrompt:
      'compact cylindrical portable laser projector in matte white and aerospace grey, small optical lens in front, palm-sized sleek device',
    recommendedPose: 'unboxing_curiosity',
  },
  {
    id: 'prod_portable_blender',
    name: 'Liquidificador Portátil Turbo USB-C',
    category: 'home_lifestyle',
    brandPlaceholder: 'VitaPulse Blend',
    keyFeature: 'Copo de vidro borossilicato com 6 lâminas e alça de silicone verde sálvia',
    minedPriceBrl: 'R$ 79,90 (Shopee Viral)',
    visualDescriptionPrompt:
      'modern pastel sage green portable blender bottle filled with fresh strawberry smoothie, clear borosilicate glass, stainless steel base',
    recommendedPose: 'lifestyle_in_use',
  },
];

export const CANONICAL_UGC_POSES: Record<UgcPoseType, UgcPoseDefinition> = {
  holding_palm_flat: {
    id: 'holding_palm_flat',
    title: 'Apresentação em Palma Aberta (Palma Plana)',
    handInteraction:
      'open right hand extended forward at chest height with product resting cleanly on palm, fingers relaxed and naturally curved, zero finger overlap',
    facialExpression: 'friendly approachable smile, welcoming eye contact, genuine UGC creator enthusiasm',
    cameraPerspective: 'vertical bust shot, 9:16 mobile composition, natural daylight illumination',
    conversionRole: 'Abertura de anúncio UGC e demonstração de escala de tamanho na mão real.',
    antiFingerGlitchConstraints: [
      'Exatamente 5 dedos anatomicamente corretos',
      'Polegar em posição de repouso sem oclusão forçada',
      'Unhas naturais e limpas sem distorções de renderização',
    ],
  },
  presenting_close_lens: {
    id: 'presenting_close_lens',
    title: 'Macro Aproximado na Lente (Depth Layering)',
    handInteraction:
      'two fingers gently pinching the product holding it directly towards camera lens in sharp foreground focus, avatar face smiling softly in background bokeh',
    facialExpression: 'warm proud smile, eyes looking towards the product details, soft focus background presence',
    cameraPerspective: 'dramatic split-depth portrait, foreground product occupying lower 40% of frame, shallow f/1.8 bokeh on avatar',
    conversionRole: 'Exibição de textura, acabamento premium e prova de autenticidade.',
    antiFingerGlitchConstraints: [
      'Pinça delicada entre indicador e polegar',
      'Linha do horizonte da mão nítida sem fusão de pele com o plástico do produto',
    ],
  },
  pointing_product_index: {
    id: 'pointing_product_index',
    title: 'Apontando para o Recurso-Chave (Point & Highlight)',
    handInteraction:
      'left hand holding product steadily, right hand index finger pointing directly at the main feature of the product with precision',
    facialExpression: 'excited intrigued expression, raised eyebrows, dynamic instructive focus',
    cameraPerspective: 'vertical medium close-up, dynamic eye-level angle, clean studio lighting',
    conversionRole: 'Quebra de objeção técnica e destaque do diferencial competitivo.',
    antiFingerGlitchConstraints: [
      'Dedo indicador estendido com falanges bem definidas',
      'Ponta do dedo não encosta no produto para evitar deformação de malha',
    ],
  },
  unboxing_curiosity: {
    id: 'unboxing_curiosity',
    title: 'Momento Unboxing & Descoberta Espontânea',
    handInteraction:
      'both hands opening the minimalist product packaging, fingers delicately lifting the lid or device with care',
    facialExpression: 'genuine pleasant surprise, eyes sparkling in awe, authentic spontaneous discovery look',
    cameraPerspective: 'slight high-angle 15-degree lookdown into hands, warm domestic home lighting',
    conversionRole: 'Simulação da experiência de compra e prazer do primeiro toque.',
    antiFingerGlitchConstraints: [
      'Ambas as mãos simétricas com 10 dedos totais',
      'Sem duplicação de membros ou dedos extras nas laterais da embalagem',
    ],
  },
  lifestyle_in_use: {
    id: 'lifestyle_in_use',
    title: 'Produto em Uso Ativo no Cotidiano',
    handInteraction:
      'avatar naturally interacting with product in active use (e.g. putting earbud in ear or pressing button on device) with effortless fluidity',
    facialExpression: 'delighted satisfaction, comfortable relaxed demeanor, aspirational lifestyle presence',
    cameraPerspective: 'natural lifestyle vlog shot, authentic room background with natural window lighting',
    conversionRole: 'Prova social viva do produto resolvendo uma dor no dia a dia.',
    antiFingerGlitchConstraints: [
      'Ponto de contato entre pele e produto perfeitamente separado',
      'Sem sombras falsas nos dedos',
    ],
  },
  side_by_side_comparison: {
    id: 'side_by_side_comparison',
    title: 'Comparativo Lado a Lado (Melhor vs Pior)',
    handInteraction:
      'right hand proudly holding the mined premium product high with a thumbs-up gesture; left hand holding a dull generic competitor low with dismissive body language',
    facialExpression: 'triumphant confident smile looking at right product, slightly amused dismissive smirk toward left product',
    cameraPerspective: 'wide bust shot, both hands clearly visible on left and right borders of 9:16 mobile frame',
    conversionRole: 'Aceleração de decisão de compra contra produtos concorrentes fracos.',
    antiFingerGlitchConstraints: [
      'Duas mãos completas com posturas opostas bem definidas',
      'Contraste de iluminação positivo no produto patrocinado',
    ],
  },
};

export const UGC_GLOBAL_NEGATIVE_PROMPT =
  'extra fingers, fused fingers, deformed hands, mutated limbs, missing fingers, malformed nails, distorted product logo, warped plastic, floating product, bad anatomy, lowres, blurry hands, oversaturated, cartoon, 3d render plastic';

/**
 * Compila o lote completo de poses UGC para o produto selecionado
 */
export function compileUgcProductPrompts(
  product: UgcProductItem = MINED_PRODUCTS_V5_FINDERS[0],
  avatar?: AvatarProfile
): UgcPosePackage {
  const avatarName = avatar?.name || 'Maya Vance';
  const avatarId = avatar?.id || 'maya_vance_soberana';
  const triggerWord = avatar
    ? `v5_${avatar.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_person`
    : 'v5_maya_vance_person';

  const compiledPrompts: CompiledUgcPrompt[] = Object.values(CANONICAL_UGC_POSES).map((pose) => {
    const positiveParts = [
      `photorealistic 8k UGC advertisement video still, 9:16 vertical smartphone format`,
      `featuring authentic creator [${triggerWord}], ${avatarName}`,
      `presenting product: (${product.visualDescriptionPrompt}:1.25), product brand (${product.brandPlaceholder})`,
      `hand pose: (${pose.handInteraction}:1.2), flawless anatomical hands, perfect fingers`,
      `acting and face: ${pose.facialExpression}`,
      `camera and lighting: ${pose.cameraPerspective}, bright natural softbox fill light, pristine product highlights`,
      `conversion intent: ${pose.conversionRole}`,
      `commercial advertising quality, masterpiece, 1080x1920 mobile screen optimized`,
    ];

    return {
      poseId: pose.id,
      poseTitle: pose.title,
      productName: product.name,
      category: product.category,
      conversionRole: pose.conversionRole,
      positivePrompt: positiveParts.join(', '),
      negativePrompt: UGC_GLOBAL_NEGATIVE_PROMPT,
      recommendedAspect: '9:16 vertical',
      resolution: { width: 1080, height: 1920 },
    };
  });

  return {
    packageId: `ugc_pack_${Date.now()}`,
    avatarId,
    avatarName,
    product,
    totalPrompts: compiledPrompts.length,
    prompts: compiledPrompts,
    schemaVersion: 'v5apollo.ugcposes.v1.0',
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Exporta o pacote UGC para arquivo JSON
 */
export function exportUgcPosePackageJson(pkg: UgcPosePackage): void {
  const jsonString = JSON.stringify(pkg, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${pkg.avatarName.toLowerCase().replace(/\s+/g, '_')}_${pkg.product.id}_ugc_poses.v5ugcposes.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
