/**
 * V5 Apollo Avatar - Type Definitions
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Strict typing across all 4 pillars: Face DNA, Voice DNA, Soul DNA & Interactive Channel
 */

export type AvatarType = 
  | 'influencer' 
  | 'actor' 
  | 'streamer' 
  | 'mascot' 
  | 'support_agent' 
  | 'custom';

export type LightingPreset = 
  | 'rembrandt' 
  | 'ring_light' 
  | 'softbox' 
  | 'volumetric_neon' 
  | 'natural_sunlight';

export type TurnaroundAngle = 
  | 'front' 
  | 'three_quarters_left' 
  | 'three_quarters_right' 
  | 'profile_left' 
  | 'profile_right' 
  | 'back';

export interface FaceDNA {
  primaryAnchorImage?: string;
  referenceImages: string[];
  turnaroundSheetUrl?: string; // Multi-ângulo 360º
  tPoseSheetUrl?: string;      // T-Pose neutra
  aPoseSheetUrl?: string;      // A-Pose relaxada
  expressionSheetUrl?: string; // Expressões faciais
  pulidEmbeddingId?: string;
  clothingPrompt: string;
  fixedFeaturesPrompt: string;
  ethnicityAgeGender: string;
  lightingPreset?: LightingPreset;
  diffusionSeed?: number;
  eyeLevelOffset?: number;
}

export type VoiceEngine = 'qwen-tts' | 'xtts' | 'cosyvoice';

export type VoiceTone = 
  | 'energetic' 
  | 'calm' 
  | 'authoritative' 
  | 'friendly' 
  | 'whisper' 
  | 'hypnotic' 
  | 'night';

export interface VoiceDNA {
  sampleAudioUrl?: string;
  v5SoundVoiceId?: string; // ID da voz clonada no V5 Sound
  engine: VoiceEngine;
  tone: VoiceTone;
  speed: number;
  pitch?: number;
  stability?: number;
  temperature?: number;
  phoneticPangramsTested?: string[];
}

export type ArchetypeCategory = 
  | 'hero' 
  | 'sage' 
  | 'creator' 
  | 'ruler' 
  | 'caregiver' 
  | 'jester' 
  | 'rebel' 
  | 'everyman';

export interface CatchphraseItem {
  phrase: string;
  weight: number; // 1 (raro) a 5 (recorrente)
}

export interface SoulDNA {
  archetype?: ArchetypeCategory;
  bio: string;
  niche: string;
  personalityTraits: string[];
  catchphrases: string[];
  weightedCatchphrases?: CatchphraseItem[];
  forbiddenTopics: string[];
  systemPrompt: string;
  knowledgeBaseDocs?: string[];
  retentionAuditScore?: number;
}

export type VisemeType = 
  | 'silence' 
  | 'A_I' 
  | 'E' 
  | 'O_U' 
  | 'MBP' 
  | 'FV' 
  | 'LDT';

export interface VisemeMapping {
  viseme: VisemeType;
  spriteUrl?: string;
  coord?: { x: number; y: number; w: number; h: number };
}

export interface VisemesDNA {
  visemes: VisemeMapping[];
  spriteSheetUrl?: string;
  mouthOpenFactor?: number;
}

export interface RiggingDNA {
  jointCoordinates?: Record<string, { x: number; y: number }>;
  breathingCycleSeconds?: number;
  blinkIntervalMin?: number;
  blinkIntervalMax?: number;
  idleMotionIntensity?: number;
}

export interface InteractiveChannel {
  webhookSecret?: string;
  webhookUrl?: string; // Endpoint para conectar com ManyChat/n8n/Broadcaster
  allowedOrigins?: string[];
  totalConversations?: number;
  broadcasterLiveToken?: string;
  isLiveActive?: boolean;
  lastSyncTimestamp?: string;
}

export interface AvatarProfile {
  id: string;
  name: string;
  tagline: string;
  type: AvatarType;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
  face: FaceDNA;
  voice: VoiceDNA;
  soul: SoulDNA;
  channel: InteractiveChannel;
  visemes?: VisemesDNA;
  rigging?: RiggingDNA;
  syncedSites: {
    broadcaster: boolean;
    prisma: boolean;
    sound: boolean;
    edit: boolean;
    finders: boolean;
  };
}

export interface ArchetypePreset {
  id: string;
  name: string;
  type: AvatarType;
  archetype: ArchetypeCategory;
  description: string;
  recommendedTone: VoiceTone;
  suggestedTraits: string[];
  defaultClothing: string;
  sampleBio: string;
}
