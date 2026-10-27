/**
 * V5 Apollo Avatar - Character One-Sheet A4 / PDF Print Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Gerador de Ficha Técnica Executiva de Personagem para Impressão (A4 / PDF).
 * Consolida dados visuais, biométricos, vocais e psicológicos em formato executivo
 * pronto para arquivo físico, apresentação a clientes ou auditoria de estúdio.
 */

import { AvatarProfile } from '@/types/avatar';
import { computeSha256String } from './universalAvatarPackageEngine';

export interface CharacterSheetData {
  registrationId: string;
  avatarId: string;
  name: string;
  tagline: string;
  type: string;
  anchorPhotoUrl: string;
  turnaroundSheetUrl?: string;
  registrationDate: string;
  sha256Fingerprint: string;
  biometrics: {
    ethnicityAgeGender: string;
    clothingPrompt: string;
    fixedFeaturesPrompt: string;
    lightingPreset: string;
    diffusionSeed: number;
    triggerWord: string;
  };
  voiceSpecs: {
    engine: string;
    tone: string;
    speed: number;
    stability: number;
    v5SoundVoiceId: string;
  };
  soulProfile: {
    archetype: string;
    mbti: string;
    niche: string;
    bio: string;
    catchphrases: string[];
    forbiddenTopics: string[];
    personalityTraits: string[];
  };
  syncedCapitancies: Array<{
    name: string;
    port: string;
    status: 'Conectado' | 'Standby';
  }>;
}

/**
 * Compila os dados da ficha técnica executiva a partir do AvatarProfile
 */
export function compileCharacterSheetData(avatar: AvatarProfile): CharacterSheetData {
  const avatarId = avatar.id;
  const name = avatar.name;
  const cleanId = avatarId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
  const registrationId = `V5-REG-2026-${cleanId || '0891A'}`;

  const fingerprint = computeSha256String(`sheet_${avatarId}_${name}_${avatar.createdAt}`);

  return {
    registrationId,
    avatarId,
    name,
    tagline: avatar.tagline,
    type: avatar.type.toUpperCase(),
    anchorPhotoUrl: avatar.face.primaryAnchorImage || avatar.avatarUrl,
    turnaroundSheetUrl: avatar.face.turnaroundSheetUrl || avatar.avatarUrl,
    registrationDate: new Date(avatar.createdAt).toLocaleDateString('pt-BR'),
    sha256Fingerprint: fingerprint,
    biometrics: {
      ethnicityAgeGender: avatar.face.ethnicityAgeGender || 'Mulher contemporânea, 28 anos, traços refinados',
      clothingPrompt: avatar.face.clothingPrompt || 'Blazer alfaiataria preto fosco, camisa gola limpa minimalista',
      fixedFeaturesPrompt: avatar.face.fixedFeaturesPrompt || 'Olhos castanhos vivos, maxilar simétrico, pele natural',
      lightingPreset: (avatar.face.lightingPreset as string) || 'Clean Daylight Studio (5600K)',
      diffusionSeed: avatar.face.diffusionSeed || 428912301,
      triggerWord: `v5_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_person`,
    },
    voiceSpecs: {
      engine: avatar.voice.engine.toUpperCase(),
      tone: avatar.voice.tone.toUpperCase(),
      speed: avatar.voice.speed,
      stability: avatar.voice.stability ?? 0.85,
      v5SoundVoiceId: avatar.voice.v5SoundVoiceId || avatar.voice.engine,
    },
    soulProfile: {
      archetype: (avatar.soul.archetype || 'SAGE / RULER').toUpperCase(),
      mbti: avatar.soul.mbti || 'INTJ-A (Arquiteto Estrategista)',
      niche: avatar.soul.niche,
      bio: avatar.soul.loreDetails?.executiveBio || avatar.soul.bio,
      catchphrases: avatar.soul.catchphrases || ['"A consistência é a única soberania real no digital."'],
      forbiddenTopics: avatar.soul.forbiddenTopics || ['Menção a marcas concorrentes sem contrato', 'Gírias de baixo calão'],
      personalityTraits: avatar.soul.personalityTraits || ['Articulada', 'Autoritária', 'Empática', 'Metódica'],
    },
    syncedCapitancies: [
      { name: 'Capitania #01 (V5 Prisma)', port: ':3000', status: 'Conectado' },
      { name: 'Capitania #02 (V5 Edit Web)', port: ':3001', status: 'Conectado' },
      { name: 'Capitania #03 (V5 Sound)', port: ':3008', status: 'Conectado' },
      { name: 'Capitania #08 (V5 Broadcaster)', port: ':3008', status: 'Conectado' },
      { name: 'Capitania #10 (V5 Auto Blog)', port: ':3000', status: 'Conectado' },
    ],
  };
}

/**
 * Dispara o diálogo nativo de impressão A4 do navegador
 */
export function triggerA4Print(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}
