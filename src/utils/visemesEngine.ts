/**
 * V5 Apollo Avatar — Motor de Visemas Canônicos da Fala (Visemes Engine)
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 *
 * Mapeamento acústico-visual de fonemas para 7 visemas canônicos da fala humana,
 * compatível com padrões Rhubarb Lip Sync, Oculus Lipsync e V5 Broadcaster (:3008).
 */

import { VisemeType } from '@/types/avatar';

export interface MouthGeometry {
  verticalAperture: number; // 0.0 (fechado) a 1.0 (abertura máxima)
  horizontalStretch: number; // 0.0 (estreito) a 1.0 (sorriso esticado)
  lipPucker: number; // 0.0 (plano) a 1.0 (bico / 'O')
  upperTeethVisibility: number; // 0.0 a 1.0
  lowerTeethVisibility: number; // 0.0 a 1.0
  tongueVisibility: number; // 0.0 a 1.0
}

export interface VisemeMetadata {
  type: VisemeType;
  code: string;
  name: string;
  phonemes: string[];
  rhubarbCode: 'X' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
  oculusCode: string;
  geometry: MouthGeometry;
  biomechanicalDescription: string;
  promptDescription: string;
  svgPath: {
    outerLip: string;
    innerMouth: string;
    teeth?: string;
    tongue?: string;
  };
}

export const CANONICAL_VISEMES_CATALOG: Record<VisemeType, VisemeMetadata> = {
  silence: {
    type: 'silence',
    code: 'VISEME_00_REST',
    name: 'Silêncio / Repouso Neutro',
    phonemes: ['pau', 'sil', 'pausa'],
    rhubarbCode: 'X',
    oculusCode: 'viseme_sil',
    geometry: {
      verticalAperture: 0.0,
      horizontalStretch: 0.5,
      lipPucker: 0.0,
      upperTeethVisibility: 0.0,
      lowerTeethVisibility: 0.0,
      tongueVisibility: 0.0,
    },
    biomechanicalDescription: 'Lábios relaxados em oclusão suave sem tensão muscular, mandíbula em repouso neutro.',
    promptDescription: 'mouth completely closed in natural relaxed neutral state, soft lips touching gently, no teeth showing, calm resting facial expression',
    svgPath: {
      outerLip: 'M 15,25 Q 50,22 85,25 Q 50,27 15,25 Z',
      innerMouth: 'M 20,25 Q 50,25 80,25',
    },
  },
  A_I: {
    type: 'A_I',
    code: 'VISEME_01_AH_AI',
    name: 'A / I (Abertura Vertical Ampla)',
    phonemes: ['a', 'ah', 'ai', 'aa', 'ae', 'ay'],
    rhubarbCode: 'D',
    oculusCode: 'viseme_aa',
    geometry: {
      verticalAperture: 0.9,
      horizontalStretch: 0.6,
      lipPucker: 0.1,
      upperTeethVisibility: 0.8,
      lowerTeethVisibility: 0.5,
      tongueVisibility: 0.4,
    },
    biomechanicalDescription: 'Abertura vertical ampla com queda mandibular acentuada, arco dos dentes superiores e dorso da língua visíveis.',
    promptDescription: 'open mouth articulating wide "AH" vowel sound, dropped jaw, upper teeth clearly visible, realistic oral cavity depth, photorealistic tongue tip',
    svgPath: {
      outerLip: 'M 20,18 Q 50,10 80,18 Q 85,38 50,45 Q 15,38 20,18 Z',
      innerMouth: 'M 26,20 Q 50,14 74,20 Q 76,36 50,40 Q 24,36 26,20 Z',
      teeth: 'M 30,20 Q 50,20 70,20 L 68,24 Q 50,25 32,24 Z',
      tongue: 'M 36,35 Q 50,31 64,35 Q 50,41 36,35 Z',
    },
  },
  E: {
    type: 'E',
    code: 'VISEME_02_EE_EH',
    name: 'E (Sorriso Esticado / Fresta Dental)',
    phonemes: ['e', 'ee', 'eh', 'ey', 'i'],
    rhubarbCode: 'B',
    oculusCode: 'viseme_E',
    geometry: {
      verticalAperture: 0.35,
      horizontalStretch: 0.95,
      lipPucker: 0.0,
      upperTeethVisibility: 0.95,
      lowerTeethVisibility: 0.7,
      tongueVisibility: 0.2,
    },
    biomechanicalDescription: 'Comissuras labiais tracionadas lateralmente pelo músculo risório, abertura horizontal acentuada com dentes semicerrados.',
    promptDescription: 'mouth slightly open articulating "EE" sound, wide stretched lips showing upper and lower front teeth with narrow gap, studio high-definition dental texture',
    svgPath: {
      outerLip: 'M 10,24 Q 50,17 90,24 Q 50,33 10,24 Z',
      innerMouth: 'M 18,24 Q 50,21 82,24 Q 50,30 18,24 Z',
      teeth: 'M 22,23 Q 50,23 78,23 L 78,27 Q 50,28 22,27 Z',
    },
  },
  O_U: {
    type: 'O_U',
    code: 'VISEME_03_OH_OO',
    name: 'O / U (Arredondado / Bico Protuberante)',
    phonemes: ['o', 'oh', 'u', 'oo', 'w', 'ou'],
    rhubarbCode: 'E',
    oculusCode: 'viseme_oh',
    geometry: {
      verticalAperture: 0.75,
      horizontalStretch: 0.2,
      lipPucker: 0.95,
      upperTeethVisibility: 0.15,
      lowerTeethVisibility: 0.0,
      tongueVisibility: 0.1,
    },
    biomechanicalDescription: 'Contração concêntrica do músculo orbicular da boca formando orifício arredondado estendido para frente.',
    promptDescription: 'rounded protruding circular "O" mouth shape speaking "OH" vowel, puckered lips with dark oral cavity depth, subtle rim highlight on lips',
    svgPath: {
      outerLip: 'M 35,16 Q 50,12 65,16 Q 73,28 65,40 Q 50,44 35,40 Q 27,28 35,16 Z',
      innerMouth: 'M 40,20 Q 50,17 60,20 Q 64,28 60,36 Q 50,39 40,36 Q 36,28 40,20 Z',
      teeth: 'M 44,20 Q 50,20 56,20 L 55,22 Q 50,22 45,22 Z',
    },
  },
  MBP: {
    type: 'MBP',
    code: 'VISEME_04_M_B_P',
    name: 'M / B / P (Oclusão Bilabial Total)',
    phonemes: ['m', 'b', 'p'],
    rhubarbCode: 'A',
    oculusCode: 'viseme_PP',
    geometry: {
      verticalAperture: 0.0,
      horizontalStretch: 0.45,
      lipPucker: 0.1,
      upperTeethVisibility: 0.0,
      lowerTeethVisibility: 0.0,
      tongueVisibility: 0.0,
    },
    biomechanicalDescription: 'Pressão recíproca entre os lábios superior e inferior criando selamento hermético antes da explosão consonantal.',
    promptDescription: 'tightly pressed bilabial lips articulating "M" or "P" consonant, lips folded inward with subtle compression crease, closed mouth speech posture',
    svgPath: {
      outerLip: 'M 16,25 Q 50,20 84,25 Q 50,30 16,25 Z',
      innerMouth: 'M 22,25 L 78,25',
    },
  },
  FV: {
    type: 'FV',
    code: 'VISEME_05_F_V',
    name: 'F / V (Labiodental Incisivo)',
    phonemes: ['f', 'v', 'ph'],
    rhubarbCode: 'G',
    oculusCode: 'viseme_FF',
    geometry: {
      verticalAperture: 0.25,
      horizontalStretch: 0.6,
      lipPucker: 0.2,
      upperTeethVisibility: 0.9,
      lowerTeethVisibility: 0.0,
      tongueVisibility: 0.0,
    },
    biomechanicalDescription: 'Bordas dos dentes incisivos centrais superiores repousam sobre o vermelhão do lábio inferior recolhido.',
    promptDescription: 'labiodental mouth position articulating "F" or "V" sound, upper incisor teeth resting gently on retracted lower lip, crisp dental sharpness',
    svgPath: {
      outerLip: 'M 18,22 Q 50,18 82,22 Q 78,32 50,33 Q 22,32 18,22 Z',
      innerMouth: 'M 25,23 Q 50,22 75,23 Q 50,30 25,23 Z',
      teeth: 'M 28,21 Q 50,21 72,21 L 70,27 Q 50,28 30,27 Z',
    },
  },
  LDT: {
    type: 'LDT',
    code: 'VISEME_06_L_D_T',
    name: 'L / D / T / N (Línguo-Alveolar / Ponta da Língua)',
    phonemes: ['l', 'd', 't', 'n', 's', 'z', 'th'],
    rhubarbCode: 'C',
    oculusCode: 'viseme_TH',
    geometry: {
      verticalAperture: 0.45,
      horizontalStretch: 0.7,
      lipPucker: 0.0,
      upperTeethVisibility: 0.85,
      lowerTeethVisibility: 0.4,
      tongueVisibility: 0.85,
    },
    biomechanicalDescription: 'Boca semiaberta com a ponta da língua elevada tocando a papila incisiva ou face lingual dos dentes superiores.',
    promptDescription: 'mouth slightly open articulating "L" or "T" consonant sound, tongue tip clearly visible behind upper front teeth, speaking action shot, micro dental focus',
    svgPath: {
      outerLip: 'M 18,20 Q 50,14 82,20 Q 78,36 50,38 Q 22,36 18,20 Z',
      innerMouth: 'M 24,22 Q 50,18 76,22 Q 72,32 50,34 Q 28,32 24,22 Z',
      teeth: 'M 28,21 Q 50,21 72,21 L 70,25 Q 50,26 30,25 Z',
      tongue: 'M 40,26 Q 50,22 60,26 Q 55,31 45,31 Z',
    },
  },
};

/**
 * Converte a tabela canônica em payload JSON pronto para o motor de Lip-Sync do V5 Broadcaster
 */
export function buildBroadcasterVisemesManifest(avatarId: string, avatarName: string) {
  return {
    format: 'v5_broadcaster_visemes_v1',
    targetCapitania: '#07_V5_BROADCASTER',
    avatarId,
    avatarName,
    visemeCount: Object.keys(CANONICAL_VISEMES_CATALOG).length,
    visemes: Object.values(CANONICAL_VISEMES_CATALOG).map((v) => ({
      type: v.type,
      code: v.code,
      name: v.name,
      rhubarbCode: v.rhubarbCode,
      oculusCode: v.oculusCode,
      geometry: v.geometry,
      phonemes: v.phonemes,
    })),
    meta: {
      generatedAt: new Date().toISOString(),
      standard: 'Rhubarb LipSync 9-Code / Oculus 15-Viseme Hybrid',
    },
  };
}
