/**
 * V5 Apollo Avatar — Compilador de Prompts para Visemas (Dental Realism Engine)
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 *
 * Compilação de diretivas de difusão de alta precisão para boca aberta natural,
 * anatomia oral, salivação/brilho especular sutil e salvaguardas odontológicas anti-alucinação.
 */

import { VisemeType } from '@/types/avatar';
import { CANONICAL_VISEMES_CATALOG, VisemeMetadata } from '@/utils/visemesEngine';

export type DentalFinish = 'natural_enamel' | 'hollywood_bright' | 'warm_realistic';

export interface VisemeCompilerOptions {
  characterName: string;
  visemeType: VisemeType;
  dentalFinish: DentalFinish;
  lipMoisture: 'subtle_matte' | 'natural_sheen' | 'glossy_studio';
  cameraAngle: 'close_up_face' | 'macro_lips' | 'medium_portrait';
}

export const DENTAL_GUARDRAILS = {
  positiveCore: 'pristine human dentition, anatomically correct central incisors, realistic translucent enamel micro-texture, delicate healthy pink gums, accurate dental arch, natural oral cavity depth with photorealistic soft tongue placement, subtle wet specular highlights on teeth and lips',
  negativeCore: 'extra teeth, duplicate teeth, fused teeth, jagged teeth, vampire fangs, yellow decay, missing teeth, rotting teeth, warped gums, deformed tongue, monster mouth, gaping unnatural black hole, plastic denture look, asymmetrical mouth tear, distorted lips',
};

/**
 * Mapeia texto em português ou inglês para uma sequência estimada de visemas canônicos
 */
export function estimatePhraseVisemeSequence(
  phrase: string
): Array<{ word: string; viseme: VisemeType; phonemeKey: string }> {
  const words = phrase.toLowerCase().replace(/[^a-záàâãéèêíïóôõöúç\s]/g, '').split(/\s+/).filter(Boolean);

  return words.map((word) => {
    // Heurística de fonema dominante na palavra
    if (/^[mbp]/.test(word) || /[mbp]$/.test(word)) {
      return { word, viseme: 'MBP', phonemeKey: '/m/, /b/, /p/' };
    }
    if (/^[fv]/.test(word) || /[fv]/.test(word)) {
      return { word, viseme: 'FV', phonemeKey: '/f/, /v/' };
    }
    if (/[oouôõ]/.test(word) && !/[aáã]/.test(word)) {
      return { word, viseme: 'O_U', phonemeKey: '/o/, /u/' };
    }
    if (/[eéêií]/.test(word) && !/[aáã]/.test(word)) {
      return { word, viseme: 'E', phonemeKey: '/e/, /i/' };
    }
    if (/[ldtnsz]/.test(word) && word.length > 3) {
      return { word, viseme: 'LDT', phonemeKey: '/l/, /d/, /t/' };
    }
    if (/[aáàã]/.test(word)) {
      return { word, viseme: 'A_I', phonemeKey: '/a/, /ai/' };
    }
    return { word, viseme: 'silence', phonemeKey: 'rest' };
  });
}

/**
 * Compila o prompt positivo e negativo para um visema específico
 */
export function compileVisemePrompt(options: VisemeCompilerOptions): {
  positivePrompt: string;
  negativePrompt: string;
  visemeMeta: VisemeMetadata;
} {
  const meta = CANONICAL_VISEMES_CATALOG[options.visemeType];

  const dentalDescriptions: Record<DentalFinish, string> = {
    natural_enamel: 'natural human tooth enamel with subtle color variations, realistic translucent edges',
    hollywood_bright: 'clean white aligned teeth with radiant studio dental finish, immaculate smile',
    warm_realistic: 'warm tone realistic teeth with organic human texture, natural gum line',
  };

  const moistureDescriptions = {
    subtle_matte: 'natural soft matte lip surface, calm lip tone',
    natural_sheen: 'subtle realistic lip moisture and delicate specular reflection',
    glossy_studio: 'studio hydration lip sheen, crisp vermilion border definition',
  };

  const cameraDescriptions = {
    close_up_face: 'cinematic close-up portrait of face',
    macro_lips: 'macro detail shot focusing on lips, teeth articulation and speaking mouth',
    medium_portrait: 'medium bust portrait framing speaking character',
  };

  const positivePrompt = `${cameraDescriptions[options.cameraAngle]} of ${options.characterName}, ${meta.promptDescription}, ${DENTAL_GUARDRAILS.positiveCore}, ${dentalDescriptions[options.dentalFinish]}, ${moistureDescriptions[options.lipMoisture]}, 8k resolution, photorealistic skin and lip pore texture, sharp dental photography, masterpiece.`;

  const negativePrompt = `${DENTAL_GUARDRAILS.negativeCore}, blurry, lowres, overexposed teeth, flat 3d render.`;

  return { positivePrompt, negativePrompt, visemeMeta: meta };
}
