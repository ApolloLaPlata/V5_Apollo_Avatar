/**
 * V5 Apollo Avatar — Motor de Guias de Proporção Anatômica
 * Holding V5 Apollo · Capitania #12 (V5 Avatar)
 *
 * Cálculo de cânones de proporção humana (7.0, 7.5, 8.0 e 8.5 cabeças),
 * linhas anatômicas de referência (ombros, peitoral, cintura, púbis, joelhos)
 * e compilação de diretivas anatômicas para difusão homogênea.
 */

export type HeadCanon = 7.0 | 7.5 | 8.0 | 8.5;

export type BiotypeCategory = 'mesomorph' | 'ectomorph' | 'endomorph' | 'athletic' | 'fashion_slim';

export interface AnatomicalLandmark {
  headIndex: number;
  label: string;
  subLabel: string;
  percentage: number; // 0 a 100% da altura da figura
  isMajorAxis?: boolean;
}

export interface CanonProfile {
  canon: HeadCanon;
  name: string;
  description: string;
  idealFor: string;
  landmarks: AnatomicalLandmark[];
  shoulderToWaistRatio: number; // Rácio ombro / cintura
}

export const CANONICAL_HEAD_CANONS: Record<HeadCanon, CanonProfile> = {
  7.0: {
    canon: 7.0,
    name: 'Realista / Compacto (7 Cabeças)',
    description: 'Proporção comum do cotidiano e atores naturais.',
    idealFor: 'Avatares de suporte, UGC realista, apresentadores casuais',
    shoulderToWaistRatio: 1.35,
    landmarks: [
      { headIndex: 0, label: 'Topo do Crânio', subLabel: 'Vértice superior', percentage: 0 },
      { headIndex: 1, label: 'Base do Queixo', subLabel: 'Fim da cabeça', percentage: 14.28, isMajorAxis: true },
      { headIndex: 2, label: 'Linha dos Mamilos', subLabel: 'Tórax médio', percentage: 28.57 },
      { headIndex: 3, label: 'Cintura e Cotovelos', subLabel: 'Linha umbilical', percentage: 42.85, isMajorAxis: true },
      { headIndex: 4, label: 'Articulação Coxofemoral', subLabel: 'Meio do corpo / Púbis', percentage: 57.14, isMajorAxis: true },
      { headIndex: 5, label: 'Abaixo dos Joelhos', subLabel: 'Platô tibial', percentage: 71.42 },
      { headIndex: 6, label: 'Meio das Canelas', subLabel: 'Gastrocnêmio distal', percentage: 85.71 },
      { headIndex: 7, label: 'Planta dos Pés', subLabel: 'Linha de solo', percentage: 100, isMajorAxis: true },
    ],
  },
  7.5: {
    canon: 7.5,
    name: 'Canônico Humano Clássico (7.5 Cabeças)',
    description: 'Padrão acadêmico de proporção anatômica de estúdio.',
    idealFor: 'VTubers realistas, avatares corporativos, apresentadores premium',
    shoulderToWaistRatio: 1.48,
    landmarks: [
      { headIndex: 0, label: 'Topo do Crânio', subLabel: 'Vértice superior', percentage: 0 },
      { headIndex: 1, label: 'Base do Queixo', subLabel: 'Fim da cabeça', percentage: 13.33, isMajorAxis: true },
      { headIndex: 2, label: 'Linha Peitoral', subLabel: 'Mamilos e axila inferior', percentage: 26.66 },
      { headIndex: 3, label: 'Cintura Natural', subLabel: 'Linha umbilical e cotovelos', percentage: 40.0, isMajorAxis: true },
      { headIndex: 3.75, label: 'Púbis / Meio Anatômico', subLabel: 'Divisão exata 50%', percentage: 50.0, isMajorAxis: true },
      { headIndex: 5, label: 'Linha Infra-Patelar', subLabel: 'Base do joelho', percentage: 73.33 },
      { headIndex: 6.5, label: 'Canela Inferior', subLabel: 'Maléolo superior', percentage: 86.66 },
      { headIndex: 7.5, label: 'Planta dos Pés', subLabel: 'Linha de solo', percentage: 100, isMajorAxis: true },
    ],
  },
  8.0: {
    canon: 8.0,
    name: 'Editorial / Fashion & Heroico (8 Cabeças)',
    description: 'Padrão da alta costura, concept art e modelos fotográficos.',
    idealFor: 'Avatares de luxo, moda, influenciadores de alta estética, cinema',
    shoulderToWaistRatio: 1.618, // Proporção Áurea Perfeita (Phi)
    landmarks: [
      { headIndex: 0, label: 'Topo do Crânio', subLabel: 'Vértice superior', percentage: 0 },
      { headIndex: 1, label: 'Base do Queixo', subLabel: '1ª Cabeça', percentage: 12.5, isMajorAxis: true },
      { headIndex: 2, label: 'Linha Peitoral', subLabel: '2ª Cabeça (Mamilos)', percentage: 25.0 },
      { headIndex: 3, label: 'Cintura e Cotovelos', subLabel: '3ª Cabeça (Umbigo)', percentage: 37.5, isMajorAxis: true },
      { headIndex: 4, label: 'Linha Púbica / Meio do Corpo', subLabel: '4ª Cabeça (Fêmur)', percentage: 50.0, isMajorAxis: true },
      { headIndex: 5, label: 'Ponta dos Dedos em Repouso', subLabel: '5ª Cabeça (Meio da coxa)', percentage: 62.5 },
      { headIndex: 6, label: 'Base dos Joelhos', subLabel: '6ª Cabeça (Patela)', percentage: 75.0, isMajorAxis: true },
      { headIndex: 7, label: 'Base dos Gastrocnêmios', subLabel: '7ª Cabeça (Tornozelo)', percentage: 87.5 },
      { headIndex: 8, label: 'Planta dos Pés', subLabel: '8ª Cabeça (Linha de Solo)', percentage: 100, isMajorAxis: true },
    ],
  },
  8.5: {
    canon: 8.5,
    name: 'Escultural / Hiper-Estilizado (8.5 Cabeças)',
    description: 'Morfologia de heróis gregos, atletas de elite e deuses digitais.',
    idealFor: 'Gamer stream, personagens de ação, animações cinemáticas',
    shoulderToWaistRatio: 1.75,
    landmarks: [
      { headIndex: 0, label: 'Topo do Crânio', subLabel: 'Vértice superior', percentage: 0 },
      { headIndex: 1, label: 'Base do Queixo', subLabel: '1ª Cabeça', percentage: 11.76, isMajorAxis: true },
      { headIndex: 2, label: 'Peitoral Definido', subLabel: '2ª Cabeça', percentage: 23.53 },
      { headIndex: 3, label: 'Cintura Esculpida', subLabel: '3ª Cabeça', percentage: 35.29, isMajorAxis: true },
      { headIndex: 4.25, label: 'Linha Púbica / Centro 50%', subLabel: 'Ponto focal de rig', percentage: 50.0, isMajorAxis: true },
      { headIndex: 6, label: 'Joelhos Alongados', subLabel: 'Articulação distal', percentage: 76.47, isMajorAxis: true },
      { headIndex: 8.5, label: 'Base dos Pés', subLabel: 'Linha de solo', percentage: 100, isMajorAxis: true },
    ],
  },
};

/**
 * Compila a diretiva textual de proporções anatômicas para injeção no prompt de difusão.
 */
export function compileAnatomicalDirective(
  canon: HeadCanon,
  biotype: BiotypeCategory = 'mesomorph',
  gender: 'female' | 'male' | 'androgynous' = 'androgynous',
  includeGoldenRatio: boolean = true
): string {
  const profile = CANONICAL_HEAD_CANONS[canon];

  const biotypeDescriptions: Record<BiotypeCategory, string> = {
    mesomorph: 'athletic balanced muscular build, toned physique, natural posture',
    ectomorph: 'slender elongated limbs, lean silhouette, refined graceful posture',
    endomorph: 'soft rounded contour, solid robust build, grounded posture',
    athletic: 'high-definition athletic musculature, sculpted shoulders and core, dynamic balance',
    fashion_slim: 'high-fashion runway slender build, elongated legs, minimalist silhouette',
  };

  const genderSpecifics = {
    female: 'feminine anatomical curvature, subtle hourglass waist ratio, graceful shoulders',
    male: 'masculine V-taper torso, broad clavicle structure, defined pelvic line',
    androgynous: 'harmonious androgynous proportions, balanced silhouette, neoclassical aesthetics',
  };

  const goldenRatioToken = includeGoldenRatio
    ? 'golden ratio (1.618:1) shoulder-to-waist harmonic proportions'
    : 'balanced anatomical ratios';

  return `masterpiece anatomical model sheet, ${profile.canon} heads tall proportions canon, ${profile.name.toLowerCase()}, ${biotypeDescriptions[biotype]}, ${genderSpecifics[gender]}, ${goldenRatioToken}, strictly symmetrical joints, anatomical precision, biomechanically correct skeletal alignment, 8k resolution studio character blueprint.`;
}
