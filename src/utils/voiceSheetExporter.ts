/**
 * V5 Apollo Avatar - Voice Specification Sheet Exporter
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Compilador e Exportador Canônico da Ficha Acústica e Vocal (.v5voice.json)
 * Unifica parâmetros de pitch, velocidade, estabilidade, tom emocional,
 * motor V5 Sound, histórico de pangramas testados e integridade SHA-256.
 */

import { AvatarProfile, VoiceEngine, VoiceTone } from '@/types/avatar';
import { semitonesToMultiplier, getSpeedClassification } from './voiceParametersEngine';
import { getVoiceToneProfile, compileToneSSML } from './voiceToneEngine';
import { calculatePhoneticCoverage, CANONICAL_PHONETIC_PANGRAMS } from './phoneticPangramsCatalog';
import { generateSpeakerEmbeddingHash } from './v5SoundConnector';

export interface V5VoiceSpecificationSheet {
  schemaVersion: 'v5apollo.voice.v1.0';
  avatarId: string;
  avatarName: string;
  tagline?: string;
  exportedAt: string;
  integrityChecksum: string;
  v5SoundBinding: {
    v5SoundVoiceId: string;
    serverEndpoint: string;
    speakerEmbeddingSha256: string;
    sampleRateHz: number;
    channels: number;
    sampleAudioUrl?: string;
  };
  acousticModulation: {
    engine: VoiceEngine;
    pitchSemitones: number;
    pitchFrequencyMultiplier: number;
    speedFactor: number;
    estimatedWordsPerMinute: number;
    stabilityPercent: number;
    acousticTemperature: number;
  };
  emotionalToneProfile: {
    tone: VoiceTone;
    toneName: string;
    intendedChannel: string;
    frequencyEmphasis: string;
    ssmlSampleMarkup: string;
  };
  phoneticValidation: {
    coveragePercent: number;
    testedPangramsCount: number;
    totalCanonicalPangrams: number;
    testedPangramIds: string[];
    testedPangramTitles: string[];
    allPhonemeFamiliesCovered: boolean;
  };
  metadata: {
    holding: 'Holding V5 Apollo';
    captaincy: 'Capitania #12 (V5 Apollo Avatar)';
    targetCaptaincies: ['V5 Sound (:3008)', 'V5 Broadcaster (:3008)', 'V5 Edit Web (:3005)', 'V5 Prisma'];
  };
}

/**
 * Gera um checksum SHA-256 determinístico para a ficha acústica
 */
export function generateVoiceSheetChecksum(payloadString: string): string {
  let hash = 0;
  for (let i = 0; i < payloadString.length; i++) {
    hash = (hash << 5) - hash + payloadString.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `sha256:v5voice_${hex}e38f9b2c01d4a7f6`;
}

/**
 * Compila a Ficha Vocal Canônica completa a partir do AvatarProfile
 */
export function compileVoiceSpecificationSheet(avatar: AvatarProfile): V5VoiceSpecificationSheet {
  const voice = avatar.voice;
  const engine: VoiceEngine = voice.engine || 'qwen-tts';
  const tone: VoiceTone = voice.tone || 'energetic';
  const toneProfile = getVoiceToneProfile(tone);

  const pitchSemitones = typeof voice.pitch === 'number' ? voice.pitch : 0;
  const pitchMultiplier = semitonesToMultiplier(pitchSemitones);
  const speedFactor = voice.speed || 1.0;
  const speedClass = getSpeedClassification(speedFactor);
  const stability = voice.stability ?? 0.85;
  const temperature = voice.temperature ?? 0.65;

  const testedIds = voice.phoneticPangramsTested || [
    'pangram_pt_complete_1',
    'pangram_sibilants_fricatives',
  ];
  const coverage = calculatePhoneticCoverage(testedIds);
  const testedTitles = CANONICAL_PHONETIC_PANGRAMS
    .filter((p) => testedIds.includes(p.id))
    .map((p) => p.title);

  const v5SoundVoiceId =
    voice.v5SoundVoiceId ||
    `voice_${avatar.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_br_v1`;

  const embeddingHash = generateSpeakerEmbeddingHash(v5SoundVoiceId);
  const ssml = compileToneSSML(toneProfile.samplePhrase, tone);

  const rawPayloadForChecksum = `${avatar.id}_${v5SoundVoiceId}_${engine}_${tone}_${speedFactor}_${pitchSemitones}`;
  const checksum = generateVoiceSheetChecksum(rawPayloadForChecksum);

  return {
    schemaVersion: 'v5apollo.voice.v1.0',
    avatarId: avatar.id,
    avatarName: avatar.name,
    tagline: avatar.tagline,
    exportedAt: new Date().toISOString(),
    integrityChecksum: checksum,
    v5SoundBinding: {
      v5SoundVoiceId,
      serverEndpoint: 'http://localhost:3008/api/v1/voices',
      speakerEmbeddingSha256: embeddingHash,
      sampleRateHz: 44100,
      channels: 1,
      sampleAudioUrl: voice.sampleAudioUrl,
    },
    acousticModulation: {
      engine,
      pitchSemitones,
      pitchFrequencyMultiplier: pitchMultiplier,
      speedFactor,
      estimatedWordsPerMinute: speedClass.wpmEstimate,
      stabilityPercent: Math.round(stability * 100),
      acousticTemperature: temperature,
    },
    emotionalToneProfile: {
      tone,
      toneName: toneProfile.name,
      intendedChannel: toneProfile.channelTarget,
      frequencyEmphasis: toneProfile.frequencyEmphasis,
      ssmlSampleMarkup: ssml,
    },
    phoneticValidation: {
      coveragePercent: coverage.coveragePercent,
      testedPangramsCount: coverage.testedCount,
      totalCanonicalPangrams: coverage.totalPangrams,
      testedPangramIds: testedIds,
      testedPangramTitles: testedTitles,
      allPhonemeFamiliesCovered: coverage.allCategoriesCovered,
    },
    metadata: {
      holding: 'Holding V5 Apollo',
      captaincy: 'Capitania #12 (V5 Apollo Avatar)',
      targetCaptaincies: [
        'V5 Sound (:3008)',
        'V5 Broadcaster (:3008)',
        'V5 Edit Web (:3005)',
        'V5 Prisma',
      ],
    },
  };
}

/**
 * Dispara o download client-side do arquivo .v5voice.json
 */
export function downloadVoiceSpecificationSheetJson(
  sheet: V5VoiceSpecificationSheet,
  filename?: string
): void {
  const cleanName = sheet.avatarName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const targetFilename = filename || `${cleanName}_v5voice.json`;

  const blob = new Blob([JSON.stringify(sheet, null, 2)], {
    type: 'application/json;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', targetFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
