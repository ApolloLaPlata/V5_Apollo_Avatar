export type AvatarType = 'influencer' | 'actor' | 'streamer' | 'mascot' | 'support_agent';

export interface FaceDNA {
  referenceImages: string[];
  turnaroundSheetUrl?: string; // Multi-ângulo 360º
  tPoseSheetUrl?: string;      // T-Pose neutra
  expressionSheetUrl?: string; // Expressões faciais
  pulidEmbeddingId?: string;
  clothingPrompt: string;
  fixedFeaturesPrompt: string;
  ethnicityAgeGender: string;
}

export interface VoiceDNA {
  sampleAudioUrl?: string;
  v5SoundVoiceId?: string; // ID da voz clonada no V5 Sound
  engine: 'qwen-tts' | 'xtts' | 'cosyvoice';
  tone: 'energetic' | 'calm' | 'authoritative' | 'friendly' | 'whisper';
  speed: number;
}

export interface SoulDNA {
  bio: string;
  niche: string;
  personalityTraits: string[];
  catchphrases: string[];
  forbiddenTopics: string[];
  systemPrompt: string;
  knowledgeBaseDocs?: string[];
}

export interface InteractiveChannel {
  webhookSecret?: string;
  webhookUrl?: string; // Endpoint para conectar com ManyChat/n8n
  allowedOrigins?: string[];
  totalConversations?: number;
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
  syncedSites: {
    broadcaster: boolean;
    prisma: boolean;
    sound: boolean;
    edit: boolean;
    finders: boolean;
  };
}
