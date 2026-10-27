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

export interface FaceExpressionItem {
  expression: string;
  promptModifier: string;
}

export interface FaceDNA {
  primaryAnchorImage?: string;
  referenceImages: string[];
  turnaroundSheetUrl?: string; // Multi-ângulo 360º
  tPoseSheetUrl?: string;      // T-Pose neutra
  aPoseSheetUrl?: string;      // A-Pose relaxada
  expressionSheetUrl?: string; // Expressões faciais
  expressions?: FaceExpressionItem[];
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
  | 'everyman'
  | 'magician'
  | 'explorer';

export interface BigFiveTraits {
  openness: number;         // 0 a 100 (Abertura a Experiências)
  conscientiousness: number;// 0 a 100 (Conscienciosidade / Disciplina)
  extraversion: number;     // 0 a 100 (Extroversão / Projeção Social)
  agreeableness: number;    // 0 a 100 (Amabilidade / Empatia)
  emotionalStability: number; // 0 a 100 (Estabilidade Emocional / Resiliência)
}

export interface CatchphraseItem {
  phrase: string;
  weight: number; // 1 (raro) a 5 (marca registrada recorrente)
  context?: 'intro' | 'cta' | 'punchline' | 'transition' | 'outro';
}

export interface VocabularyItem {
  term: string;
  category: 'jargon' | 'technical' | 'slang' | 'analogy';
  meaning: string;
  weight: number; // 1 (sutil) a 5 (muito frequente)
}

export interface RAGKnowledgeItem {
  id: string;
  title: string;
  category: 'product_catalog' | 'holding_rule' | 'technical_faq' | 'personal_fact' | 'pricing_policy';
  content: string;
  tags: string[];
  lastUpdated: string;
  sourceUrl?: string;
}

export interface GuardrailItem {
  id: string;
  topic: string;
  category: 'holding_law' | 'legal_compliance' | 'brand_safety' | 'jailbreak_defense' | 'niche_specific';
  severity: 'critical' | 'high' | 'moderate';
  refusalStrategy: 'silent_redirect' | 'polite_refusal' | 'sovereign_deflection';
  sampleDeflectionPhrase: string;
  isLocked?: boolean;
}

export interface AvatarLoreDetails {
  bio?: string;                 // Biografia sintética consolidada
  originStory: string;          // História de origem canônica do personagem
  marketAuthority: string;      // Conquistas, credenciais e prova de autoridade
  toneOfVoiceGuideline: string; // Regras de cadência, vocabulário e metáforas
  coreBeliefs: string[];        // 3 a 5 princípios inabaláveis que guiam as decisões
  executiveBio?: string;        // Bio para o box de autor do V5 Auto Blog
  socialBio?: string;           // Bio concisa para Instagram / Twitter (até 160 caracteres)
}

export interface SoulDNA {
  archetype?: ArchetypeCategory;
  mbti?: string;
  bigFive?: BigFiveTraits;
  bio: string;
  niche: string;
  loreDetails?: AvatarLoreDetails;
  personalityTraits: string[];
  catchphrases: string[];
  weightedCatchphrases?: CatchphraseItem[];
  vocabularyTerms?: VocabularyItem[];
  forbiddenTopics: string[];
  structuredGuardrails?: GuardrailItem[];
  systemPrompt: string;
  knowledgeBaseDocs?: string[];
  structuredKnowledgeBase?: RAGKnowledgeItem[];
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
