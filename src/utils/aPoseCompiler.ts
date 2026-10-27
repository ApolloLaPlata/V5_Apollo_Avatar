/**
 * V5 Apollo Avatar - Parametric A-Pose Prompt Compiler
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Generates natural 45-degree A-Pose sheets for realistic clothing drape and relaxed armatures
 */

export type GarmentDrapeStyle = 'natural_streetwear' | 'heavy_coat_tailoring' | 'flowing_lightweight' | 'tactical_structured';

export interface APoseCompilerParams {
  characterName: string;
  ethnicityAgeGender?: string;
  physicalTraits: string;
  customClothing?: string;
  drapeStyle?: GarmentDrapeStyle;
  armAngle?: 45 | 35 | 50; // default 45
  background?: 'neutral_gray' | 'pure_white' | 'dark_studio';
  seed?: number;
}

export interface APoseCompiledOutput {
  masterPrompt: string;
  negativePrompt: string;
  drapeDirectives: string[];
  anatomicalSpecs: string;
  tokenCount: number;
}

export function compileAPosePrompt(params: APoseCompilerParams): APoseCompiledOutput {
  const {
    characterName,
    ethnicityAgeGender = '',
    physicalTraits,
    customClothing = '',
    drapeStyle = 'natural_streetwear',
    armAngle = 45,
    background = 'neutral_gray',
    seed,
  } = params;

  // 1. Subject Header
  const subjectParts: string[] = [];
  if (characterName) subjectParts.push(`Full-body natural A-pose character sheet of ${characterName}`);
  else subjectParts.push('Full-body natural A-pose model sheet');
  if (ethnicityAgeGender) subjectParts.push(ethnicityAgeGender);
  if (physicalTraits) subjectParts.push(physicalTraits);
  const subjectStr = subjectParts.join(', ');

  // 2. Exact A-Pose Angle & Anatomy
  const poseDirective = `relaxed symmetrical A-pose, both arms extended downward at an exact ${armAngle}-degree angle away from the torso, elbows straight without bending, palms angled slightly inward at 45 degrees with relaxed separated fingers, feet placed shoulder-width apart pointing directly forward, head level with neutral confident expression`;

  // 3. Garment Drape Physics
  const DRAPE_MAP: Record<GarmentDrapeStyle, string> = {
    natural_streetwear: 'natural fabric gravity drape along the shoulders and chest, organic realistic cloth creases around armpits and sleeves without excessive stretching',
    heavy_coat_tailoring: 'heavy structured fabric drape, crisp shoulder line structure, lapels resting flat against chest with realistic gravity hanging',
    flowing_lightweight: 'delicate lightweight fabric falling with soft natural folds, relaxed silhouette avoiding artificial tension',
    tactical_structured: 'dense canvas and cordura fabric resting naturally with articulated seam geometry and relaxed tension',
  };

  const drapeDirective = customClothing 
    ? `wearing ${customClothing}, ${DRAPE_MAP[drapeStyle]}`
    : `wearing neutral relaxed model attire, ${DRAPE_MAP[drapeStyle]}`;

  // 4. Background and Lighting
  const BG_MAP = {
    neutral_gray: 'seamless 18% neutral gray infinity studio background (#808080) with clean contact ground shadow',
    pure_white: 'infinite pure white studio cyc wall with soft contact shadow under feet',
    dark_studio: 'matte dark studio cyc with gentle gradient floor illumination',
  };

  const bgDirective = BG_MAP[background];
  const lightingDirective = 'balanced softbox studio lighting, continuous illumination across shoulders and waistline, high-fidelity textile surface micro-details';

  // 5. Master Prompt Assembly
  const masterParts = [
    subjectStr,
    poseDirective,
    drapeDirective,
    bgDirective,
    lightingDirective,
    'full-body orthographic portrait, feet and head completely visible in frame, photorealistic 8k render, razor-sharp focus on fabric seams and anatomy',
  ];

  if (seed) {
    masterParts.push(`--seed ${seed}`);
  }

  const masterPrompt = masterParts.join('. ') + '.';

  // 6. Negative Guardrails
  const negativePrompt = [
    'arms at 90 degrees',
    'arms touching torso',
    'hands inside pockets',
    'bent elbows',
    'clenched hands',
    'asymmetrical pose',
    'twisted spine',
    'dynamic combat pose',
    'crossed legs',
    'fabric bunching or distortion under armpits',
    'cropped feet',
    'cropped head',
    'blurry textiles',
    'low resolution',
  ].join(', ');

  const drapeDirectives = [
    `Ângulo dos Braços: ${armAngle}º de abertura natural para caimento sem tensão`,
    'Linha dos Ombros: Trapézio relaxado sem elevação artificial',
    'Costura da Cava: Zero deformação de tecido sob as axilas',
    'Orientação das Palmas: 45º voltadas para dentro em postura anatômica de repouso',
    'Gravidade de Tecido: Rugas verticais realistas orientadas para o solo',
  ];

  return {
    masterPrompt,
    negativePrompt,
    drapeDirectives,
    anatomicalSpecs: `A-Pose ${armAngle}º calibrada para rigs VTuber e simuladores de tecido Marvellous Designer / Unreal Chaos Cloth`,
    tokenCount: Math.round(masterPrompt.length / 4),
  };
}
