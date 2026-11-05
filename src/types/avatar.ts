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

export interface IdleBreathingConfig {
  bpm: number;                       // Frequência em respirações por minuto (6 a 30)
  amplitudeYPercent: number;         // Elevação torácica vertical (0.2% a 2.5%)
  shoulderExpansionXPercent: number; // Expansão horizontal dos ombros/tórax (0.2% a 3.0%)
  anchorPoint: 'center_bottom' | 'chest_center' | 'waist_center';
  preset: 'calm' | 'focused' | 'energetic' | 'deep' | 'custom';
  isActive: boolean;
}

export interface NaturalEyeBlinkConfig {
  intervalMin: number;             // Intervalo mínimo em segundos (ex: 2.5s)
  intervalMax: number;             // Intervalo máximo em segundos (ex: 6.0s)
  blinkDurationMs: number;         // Duração do fechamento/reabertura em milissegundos (ex: 180ms)
  doubleBlinkProbability: number;  // Probabilidade de piscada dupla (0 a 0.35, ex: 0.12)
  preset: 'natural_human' | 'focused_screen' | 'conversational' | 'relaxed' | 'custom';
  isActive: boolean;
}

export interface HeadTiltConfig {
  maxPitchDeg: number;             // Inclinação vertical X em graus (-4º a +4º)
  maxYawDeg: number;               // Rotação horizontal Y em graus (-5º a +5º)
  maxRollDeg: number;              // Inclinação lateral Z (tilt orelha-ombro) em graus (-6º a +6º)
  transitionDurationSeconds: number;// Duração de transição suave entre poses (1.0s a 5.0s)
  dwellTimeSeconds: number;        // Tempo de permanência na pose antes do próximo micro-movimento (0.5s a 6.0s)
  preset: 'listening_empathy' | 'analytical_curious' | 'confident_sovereign' | 'neutral_idle' | 'custom';
  isActive: boolean;
}

export type AvatarConversationState = 
  | 'idle_rest'     // Repouso e espera ativa (loop idle 100%)
  | 'pre_speech'    // Inalação preparatória e alinhamento labial (150-300ms)
  | 'speaking'      // Discurso ativo e visemas fonéticos sincronizados
  | 'post_speech';  // Conclusão e retorno suave ao repouso (200-450ms)

export interface AvatarFsmConfig {
  preSpeechDurationMs: number;    // Duração da inalação preparatória (100 a 500ms)
  postSpeechDurationMs: number;   // Duração da transição pós-fala (150 a 600ms)
  breathingDampingFactor: number; // Redução do movimento torácico na fala (0.1 a 0.8)
  mouthBlendWeight: number;       // Peso de interpolação labial na transição (0.1 a 1.0)
  autoReturnToIdle: boolean;      // Retorna automaticamente a idle_rest após conclusão
  isInteractive: boolean;
}

export type EnergyLevelPreset = 'zen' | 'executive' | 'creator' | 'streamer' | 'custom';

export interface AvatarEnergyConfig {
  energyLevel: number;        // 0 a 100%
  preset: EnergyLevelPreset;
  audioReactive: boolean;
  sensitivity: number;        // 1 a 5
}

export interface IdleSpritesheetFrame {
  index: number;
  timeSeconds: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface IdleSpritesheetManifest {
  atlasUrl?: string;
  totalFrames: number;
  columns: number;
  rows: number;
  frameWidth: number;
  frameHeight: number;
  atlasWidth: number;
  atlasHeight: number;
  fps: number;
  durationSeconds: number;
  frames: IdleSpritesheetFrame[];
  generatedAt: string;
}

export interface RiggingDNA {
  jointCoordinates?: Record<string, { x: number; y: number }>;
  breathingCycleSeconds?: number;
  blinkIntervalMin?: number;
  blinkIntervalMax?: number;
  blinkDurationMs?: number;
  idleMotionIntensity?: number;
  breathingConfig?: IdleBreathingConfig;
  eyeBlinkConfig?: NaturalEyeBlinkConfig;
  headTiltConfig?: HeadTiltConfig;
  fsmConfig?: AvatarFsmConfig;
  energyConfig?: AvatarEnergyConfig;
  idleSpritesheetManifest?: IdleSpritesheetManifest;
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

export type Avatar = AvatarProfile;

export interface ChannelBinding {
  id: string;
  channelName: string;
  channelType: 'dark_youtube' | 'tiktok_ugc' | 'instagram_creator' | 'radio_24h' | 'vsl_sales' | 'educational' | 'podcaster';
  channelHandle: string;
  targetAudience: string;
  contentPillar: string;
  publicationFrequency: 'daily' | 'weekly' | '24_7_live';
  totalVideosProduced: number;
  totalAudiosSynthesized: number;
  totalTurnaroundAngles: number;
}

export interface AiGenerationHistoryItem {
  id: string;
  timestamp: string;
  model: 'flux_dev' | 'flux_schnell' | 'sdxl_lightning' | 'ideogram_v2' | 'wan_2_1';
  prompt: string;
  angle: 'front' | 'threeQuarter' | 'profile' | 'back' | 'custom';
  imageUrl: string;
  seed: number;
}

export interface VideoRenderItem {
  id: string;
  title: string;
  createdAt: string;
  duration: string;
  mode: 'full_swap' | 'face_relight' | 'motion_retarget';
  previewUrl: string;
  videoUrl: string;
}

export interface ViralScriptItem {
  id: string;
  title: string;
  hook: string;
  body: string;
  cta: string;
  targetDuration: string;
  niche: string;
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
  videoRenders?: VideoRenderItem[];
  scripts?: ViralScriptItem[];
  channelBinding?: ChannelBinding;
  aiGenerations?: AiGenerationHistoryItem[];
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
