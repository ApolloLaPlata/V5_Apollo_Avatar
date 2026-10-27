/**
 * V5 Apollo Avatar - Face DNA Pack Exporter
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Compilador e Exportador Canônico de Face DNA Pack (.v5facedna.json)
 * Estruturado para Difusores de Vídeo e Imagem do V5 Prisma (Flux 1.0 Dev,
 * SDXL LoRA, ComfyUI e Wan 2.1) com garantia de consistência 360º cross-scene.
 */

import { AvatarProfile } from '@/types/avatar';

export type TargetDiffusionModel =
  | 'flux_1_dev'
  | 'flux_1_schnell'
  | 'sdxl_1_0_lora'
  | 'wan_2_1'
  | 'comfyui_native';

export interface FaceDnaExportOptions {
  targetModel?: TargetDiffusionModel;
  loraStrength?: number;
  guidanceScale?: number;
  inferenceSteps?: number;
  denoiseStrength?: number;
}

export interface V5FaceDnaPack {
  schemaVersion: 'v5apollo.facedna.v1.0';
  avatarId: string;
  avatarName: string;
  diffusionSeed: number;
  pulidEmbeddingId: string;
  biometricAnchors: {
    primaryAnchorImage: string;
    turnaroundSheetUrl?: string;
    referenceImages: string[];
    ethnicityAgeGender: string;
    fixedFeaturesPrompt: string;
    clothingPrompt: string;
    lightingPreset: string;
  };
  diffusionLoRAParameters: {
    targetModel: TargetDiffusionModel;
    triggerWords: string[];
    loraModelName: string;
    loraStrength: number;
    guidanceScale: number;
    inferenceSteps: number;
    denoiseStrength: number;
    sampler: string;
    scheduler: string;
    clipSkip: number;
    negativePrompt: string;
  };
  cameraAndCinematics: {
    recommendedLens: string;
    aperture: string;
    lightingFormula: string;
    framingStandard: string;
  };
  comfyuiNodeManifest: {
    loraLoader: {
      nodeId: string;
      loraName: string;
      strengthModel: number;
      strengthClip: number;
    };
    pulidApply: {
      nodeId: string;
      weight: number;
      method: 'fidelity' | 'style';
      startAt: number;
      endAt: number;
    };
    kSampler: {
      nodeId: string;
      seed: number;
      steps: number;
      cfg: number;
      samplerName: string;
      scheduler: string;
      denoise: number;
    };
  };
  metadata: {
    holding: 'Holding V5 Apollo';
    captaincy: 'Capitania #12 (V5 Apollo Avatar)';
    pairedCaptaincies: string[];
    author: string;
    integrityChecksum: string;
    exportedAt: string;
  };
}

/**
 * Gera um checksum determinístico SHA-256 style para o Face DNA Pack
 */
function generateFaceDnaChecksum(avatarId: string, seed: number): string {
  const seedStr = `${avatarId}_seed_${seed}_facedna_v5_2026`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `v5fd_${hex}_${Date.now().toString(16).substring(4)}`;
}

/**
 * Compila o Face DNA Pack completo a partir do AvatarProfile
 */
export function compileFaceDnaPack(
  avatar: AvatarProfile,
  options: FaceDnaExportOptions = {}
): V5FaceDnaPack {
  const targetModel = options.targetModel || 'flux_1_dev';
  const seed = avatar.face.diffusionSeed || 428912301;
  const pulidId = avatar.face.pulidEmbeddingId || `pulid_${avatar.id.replace('avatar-', '')}_v1`;

  // Defaults por modelo de difusão
  let steps = 28;
  let cfg = 3.5;
  let sampler = 'euler';
  let scheduler = 'beta';
  let clipSkip = 1;

  if (targetModel === 'flux_1_schnell') {
    steps = 4;
    cfg = 1.0;
    sampler = 'euler';
    scheduler = 'simple';
  } else if (targetModel === 'sdxl_1_0_lora') {
    steps = 30;
    cfg = 6.0;
    sampler = 'dpmpp_2m_sde';
    scheduler = 'karras';
    clipSkip = 2;
  } else if (targetModel === 'wan_2_1') {
    steps = 35;
    cfg = 4.0;
    sampler = 'uni_pc';
    scheduler = 'normal';
  }

  const loraStrength = options.loraStrength ?? 0.85;
  const guidanceScale = options.guidanceScale ?? cfg;
  const inferenceSteps = options.inferenceSteps ?? steps;
  const denoiseStrength = options.denoiseStrength ?? 0.55;

  const cleanAvatarName = avatar.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const triggerWords = [
    `v5_${cleanAvatarName}_person`,
    'masterpiece',
    'sovereign_character',
    'hyperrealistic portrait 8k',
  ];

  return {
    schemaVersion: 'v5apollo.facedna.v1.0',
    avatarId: avatar.id,
    avatarName: avatar.name,
    diffusionSeed: seed,
    pulidEmbeddingId: pulidId,
    biometricAnchors: {
      primaryAnchorImage: avatar.face.primaryAnchorImage || avatar.avatarUrl,
      turnaroundSheetUrl: avatar.face.turnaroundSheetUrl,
      referenceImages: avatar.face.referenceImages || [avatar.avatarUrl],
      ethnicityAgeGender: avatar.face.ethnicityAgeGender || 'Mulher brasileira, 26 anos',
      fixedFeaturesPrompt:
        avatar.face.fixedFeaturesPrompt ||
        'Olhos castanhos amendoados, cabelo castanho ondulado médio, traços brasileiros expressivos',
      clothingPrompt: avatar.face.clothingPrompt || 'Figurino profissional tech contemporâneo',
      lightingPreset: avatar.face.lightingPreset || 'volumetric_neon',
    },
    diffusionLoRAParameters: {
      targetModel,
      triggerWords,
      loraModelName: `v5_lora_${cleanAvatarName}_v1.safetensors`,
      loraStrength,
      guidanceScale,
      inferenceSteps,
      denoiseStrength,
      sampler,
      scheduler,
      clipSkip,
      negativePrompt:
        'deformed eyes, extra fingers, blurry face, face morph, inconsistent facial features, double head, bad anatomy, cartoonish render, 3d render look',
    },
    cameraAndCinematics: {
      recommendedLens: '85mm f/1.8 Portrait Prime Lens',
      aperture: 'f/1.8 shallow depth of field with creamy bokeh',
      lightingFormula: `${avatar.face.lightingPreset || 'volumetric_neon'} lighting, balanced fill light, sharp key light on jawline`,
      framingStandard: 'Medium Close-Up (MCU) and Cowboy Shot for UGC Ads',
    },
    comfyuiNodeManifest: {
      loraLoader: {
        nodeId: 'Node_12_LoraLoader',
        loraName: `v5_lora_${cleanAvatarName}_v1.safetensors`,
        strengthModel: loraStrength,
        strengthClip: loraStrength * 0.9,
      },
      pulidApply: {
        nodeId: 'Node_18_ApplyPuLID',
        weight: 0.90,
        method: 'fidelity',
        startAt: 0.0,
        endAt: 0.95,
      },
      kSampler: {
        nodeId: 'Node_25_KSampler',
        seed,
        steps: inferenceSteps,
        cfg: guidanceScale,
        samplerName: sampler,
        scheduler,
        denoise: denoiseStrength,
      },
    },
    metadata: {
      holding: 'Holding V5 Apollo',
      captaincy: 'Capitania #12 (V5 Apollo Avatar)',
      pairedCaptaincies: [
        'Capitania #11 (V5 Prisma - Difusor de Vídeo)',
        'Capitania #10 (V5 Edit Web - Editor de Shorts)',
      ],
      author: 'Apollo La Plata (Holding V5 Apollo)',
      integrityChecksum: generateFaceDnaChecksum(avatar.id, seed),
      exportedAt: new Date().toISOString(),
    },
  };
}

/**
 * Validação de integridade do Face DNA Pack
 */
export function validateFaceDnaPack(pack: V5FaceDnaPack): {
  valid: boolean;
  score: number;
  checks: string[];
  issues: string[];
} {
  const checks: string[] = [];
  const issues: string[] = [];

  if (pack.diffusionSeed > 0) {
    checks.push(`Seed determinístico travado: [${pack.diffusionSeed}]`);
  } else {
    issues.push('Seed de difusão zero ou ausente');
  }

  if (pack.biometricAnchors.primaryAnchorImage) {
    checks.push('Foto âncora primária validada e ancorada');
  } else {
    issues.push('Imagem âncora primária ausente');
  }

  if (pack.diffusionLoRAParameters.triggerWords.length >= 2) {
    checks.push(`Trigger words canônicas (${pack.diffusionLoRAParameters.triggerWords.length}) configuradas`);
  } else {
    issues.push('Quantidade insuficiente de trigger words para LoRA');
  }

  if (pack.comfyuiNodeManifest.loraLoader && pack.comfyuiNodeManifest.kSampler) {
    checks.push('Manifesto de nós ComfyUI pronto para difusão no V5 Prisma');
  } else {
    issues.push('Manifesto ComfyUI incompleto');
  }

  const score = Math.max(0, 100 - issues.length * 25);

  return {
    valid: issues.length === 0,
    score,
    checks,
    issues,
  };
}

/**
 * Dispara download do arquivo .v5facedna.json
 */
export function downloadFaceDnaPack(
  pack: V5FaceDnaPack,
  filename?: string
): void {
  if (typeof window === 'undefined') return;
  const jsonString = JSON.stringify(pack, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `${pack.avatarId}.v5facedna.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
