/**
 * V5 Apollo Avatar - Parametric T-Pose Prompt Compiler
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Generates mathematically aligned T-Pose sheets for 3D rigging and virtual clothing fitting
 */

export type RiggingTarget = 'mixamo' | 'unreal_engine_5' | 'blender_armature' | 'v5_broadcaster_vtuber';

export interface TPoseCompilerParams {
  characterName: string;
  ethnicityAgeGender?: string;
  physicalTraits: string;
  clothingFit?: 'fitted_rigging_attire' | 'custom_character_attire' | 'neutral_undergarment';
  customClothing?: string;
  riggingTarget?: RiggingTarget;
  background?: 'pure_white' | 'neutral_gray' | 'chroma_green';
  seed?: number;
}

export interface TPoseCompiledOutput {
  masterPrompt: string;
  negativePrompt: string;
  jointDirectives: string[];
  riggingSpecs: string;
  tokenCount: number;
}

export function compileTPosePrompt(params: TPoseCompilerParams): TPoseCompiledOutput {
  const {
    characterName,
    ethnicityAgeGender = '',
    physicalTraits,
    clothingFit = 'fitted_rigging_attire',
    customClothing = '',
    riggingTarget = 'v5_broadcaster_vtuber',
    background = 'neutral_gray',
    seed,
  } = params;

  // 1. Subject Header
  const subjectParts: string[] = [];
  if (characterName) subjectParts.push(`Full-body anatomical T-pose model sheet of ${characterName}`);
  else subjectParts.push('Full-body neutral T-pose character model sheet');
  if (ethnicityAgeGender) subjectParts.push(ethnicityAgeGender);
  if (physicalTraits) subjectParts.push(physicalTraits);
  const subjectStr = subjectParts.join(', ');

  // 2. Exact T-Pose Pose Directives
  const poseDirective = 'neutral symmetrical T-pose, both arms outstretched horizontally at exactly 90 degrees parallel to the floor, palms facing forward with five fingers naturally spaced and clearly visible, legs straight shoulder-width apart pointing forward, head facing directly forward at camera eye-level with neutral facial expression';

  // 3. Clothing Fit Directives
  let attireDirective = '';
  if (clothingFit === 'fitted_rigging_attire') {
    attireDirective = 'wearing sleek form-fitting neutral charcoal athletic rigging wear, clean outlines showcasing anatomical joint positions (shoulders, elbows, wrists, hips, knees, ankles)';
  } else if (clothingFit === 'neutral_undergarment') {
    attireDirective = 'clean anatomical base layer, bare arms and legs for precise bone skinning and vertex weight mapping';
  } else {
    attireDirective = customClothing 
      ? `wearing ${customClothing}, fabric adjusted naturally for outstretched T-pose with zero bunching under armpits` 
      : 'wearing clean character attire in neutral T-pose fit';
  }

  // 4. Background and Lighting
  const BG_MAP = {
    neutral_gray: 'solid 18% neutral gray infinity studio cyc backdrop (#808080) with zero cast shadows',
    pure_white: 'infinite clean pure white studio background with soft floor contact shadow',
    chroma_green: 'seamless flat chroma green screen (#00FF00) background for instant background removal',
  };
  const bgDirective = BG_MAP[background];

  const lightingDirective = 'uniform flat orthographic studio lighting, shadowless illumination beneath arms and between legs, crisp contour edges for segmentation';

  // 5. Rigging Target Notes
  const RIG_MAP: Record<RiggingTarget, string> = {
    v5_broadcaster_vtuber: 'optimized for 2D/3D viseme syncing, clean separate arm and head layers for OBS live broadcasting',
    blender_armature: 'orthographic front view calibration, standard A-Pose to T-Pose retargeting alignment',
    unreal_engine_5: 'compatible with UE5 Mannequin skeletal mesh standard bone proportions',
    mixamo: 'Mixamo auto-rigger compatible with clearly exposed wrist, elbow, groin and chin keypoints',
  };
  const riggingSpecs = RIG_MAP[riggingTarget];

  // 6. Master Prompt Assembly
  const masterParts = [
    subjectStr,
    poseDirective,
    attireDirective,
    bgDirective,
    lightingDirective,
    'full body shot from head to toes with comfortable margin at top and bottom, ultra-sharp focus, photorealistic 8k render, orthographic projection aesthetic',
  ];

  if (seed) {
    masterParts.push(`--seed ${seed}`);
  }

  const masterPrompt = masterParts.join('. ') + '.';

  // 7. Rigging Negative Guardrails
  const negativePrompt = [
    'bent elbows',
    'arms lowered',
    'hands in pockets',
    'clenched fists',
    'interlocking fingers',
    'dynamic pose',
    'crossed legs',
    'asymmetrical posture',
    'perspective distortion',
    'foreshortening',
    'shadows covering armpits',
    'cropped feet',
    'cropped head',
    'motion blur',
    'multiple people',
    'bad anatomy',
    'distorted fingers',
  ].join(', ');

  const jointDirectives = [
    'Articulação dos Ombros: 90º cravados sem elevação de trapézio',
    'Articulação dos Cotovelos: Braços retos em hiperextensão zero',
    'Articulação dos Pulsos: Palmas voltadas para frente, dedos relaxados e separados',
    'Articulação do Quadril & Joelhos: Pernas retas com vão limpo entre as coxas',
    'Articulação dos Tornozelos: Pés paralelos apontando para a câmera',
  ];

  return {
    masterPrompt,
    negativePrompt,
    jointDirectives,
    riggingSpecs,
    tokenCount: Math.round(masterPrompt.length / 4),
  };
}
