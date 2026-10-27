/**
 * V5 Apollo Avatar - 360º Turnaround Model Sheet Prompt Compiler
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * High-precision prompt engineering formula for single-sheet 4-angle consistency
 */

import { LightingPreset } from '@/types/avatar';

export interface TurnaroundCompilerParams {
  characterName: string;
  ethnicityAgeGender?: string;
  physicalTraits: string;
  clothing: string;
  lightingPreset?: LightingPreset;
  qualityModifier?: 'cinematic_8k' | 'hyperreal_studio' | 'clean_3d_render';
  seed?: number;
  backdropColor?: 'neutral_gray' | 'pure_white' | 'dark_studio';
}

export interface TurnaroundCompiledOutput {
  masterPrompt: string;
  negativePrompt: string;
  angleDirectives: {
    front: string;
    threeQuarter: string;
    profile: string;
    back: string;
  };
  lightingDirective: string;
  technicalSpecs: string;
  tokenCountEstimate: number;
}

export function compileTurnaroundPrompt(params: TurnaroundCompilerParams): TurnaroundCompiledOutput {
  const {
    characterName,
    ethnicityAgeGender = '',
    physicalTraits,
    clothing,
    lightingPreset = 'softbox',
    qualityModifier = 'hyperreal_studio',
    seed,
    backdropColor = 'neutral_gray',
  } = params;

  // 1. Identity & Subject Directives
  const subjectParts: string[] = [];
  if (characterName) subjectParts.push(`Character portrait model sheet of ${characterName}`);
  else subjectParts.push('Character turnaround model sheet');
  if (ethnicityAgeGender) subjectParts.push(ethnicityAgeGender);
  if (physicalTraits) subjectParts.push(physicalTraits);
  const subjectSegment = subjectParts.join(', ');

  // 2. Attire Lock Directive
  const attireSegment = clothing
    ? `Identical attire across all angles: ${clothing}, strict clothing consistency with identical fabric textures, stitching, and color values`
    : 'Identical neutral studio attire across all 4 angles with locked fabric details';

  // 3. Four Canonical Angles Specification
  const angleDirectives = {
    front: 'Angle 1: Full-body front view facing directly forward at camera eye-level with neutral expression',
    threeQuarter: 'Angle 2: Full-body three-quarter view turned 45 degrees left with identical facial bone structure',
    profile: 'Angle 3: Full-body side profile view turned exactly 90 degrees showing clean jawline and silhouette',
    back: 'Angle 4: Full-body back view turned 180 degrees showing complete back of head, hairstyle, and reverse clothing details',
  };

  const sheetLayout = `Single continuous horizontal composition displaying 4 synchronized full-body views in perfect row alignment: [${angleDirectives.front}], [${angleDirectives.threeQuarter}], [${angleDirectives.profile}], [${angleDirectives.back}]. Perfectly uniform height, equal head-to-toe scale ratio, and shared horizon line across all 4 panels.`;

  // 4. Lighting & Environment
  const LIGHTING_MAP: Record<LightingPreset, string> = {
    softbox: 'diffuse 360-degree softbox studio lighting, minimal harsh shadows, even illumination across face and garments',
    rembrandt: 'classic Rembrandt studio lighting with subtle triangular cheek illumination and soft fill',
    ring_light: 'clean central ring-light illumination with crisp facial contours and uniform eye catchlights',
    volumetric_neon: 'subtle dual-tone volumetric edge highlights (cyan and warm amber) over neutral rim lighting',
    natural_sunlight: 'balanced neutral 5500K daylight simulation with soft overhead diffusion',
  };

  const lightingDirective = LIGHTING_MAP[lightingPreset] || LIGHTING_MAP.softbox;

  const BACKDROP_MAP = {
    neutral_gray: 'seamless clean studio backdrop in 18% neutral gray (#808080) with subtle floor gradient',
    pure_white: 'infinite clean pure white studio cyc wall backdrop with zero environmental clutter',
    dark_studio: 'deep matte charcoal studio background with subtle floor reflection',
  };

  const backdropDirective = BACKDROP_MAP[backdropColor];

  // 5. Technical & Quality Presets
  const QUALITY_MAP = {
    hyperreal_studio: 'ultra-high-end studio photography, shot on Hasselblad H6D-100c with HC 100mm f/2.2 lens, photorealistic skin pores, 8k resolution, raw photo quality',
    cinematic_8k: 'cinematic anamorphic 8k capture, Arri Alexa 65 sensor, hyper-detailed textile micro-textures, masterclass color grading',
    clean_3d_render: 'clean Octane render, sub-surface scattering skin shaders, 3D rigging character turn-sheet, mathematically aligned ortho-guidelines',
  };

  const technicalSpecs = `${QUALITY_MAP[qualityModifier]}, flawless anatomical symmetry, zero distortion`;

  // 6. Master Prompt Compilation
  const masterPromptParts = [
    subjectSegment,
    attireSegment,
    sheetLayout,
    lightingDirective,
    backdropDirective,
    technicalSpecs,
  ];

  if (seed) {
    masterPromptParts.push(`--seed ${seed}`);
  }

  const masterPrompt = masterPromptParts.join('. ') + '.';

  // 7. Negative Guardrails
  const negativePrompt = [
    'disjointed angles',
    'different people in panels',
    'changing clothes or colors between views',
    'inconsistent height',
    'asymmetrical facial structure',
    'distorted fingers or hands',
    'missing limbs',
    'cluttered background',
    'shadow mismatch',
    'lens flare',
    'cartoonish distortion',
    'watermark',
    'signature',
    'bad anatomy',
    'low resolution',
    'blurry faces',
  ].join(', ');

  // Rough token estimation (~4 chars per token)
  const tokenCountEstimate = Math.round(masterPrompt.length / 4);

  return {
    masterPrompt,
    negativePrompt,
    angleDirectives,
    lightingDirective,
    technicalSpecs,
    tokenCountEstimate,
  };
}
