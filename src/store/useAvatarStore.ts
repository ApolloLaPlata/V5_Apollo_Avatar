/**
 * V5 Apollo Avatar - Global Avatar Store
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Zustand Reactive Store with LocalStorage Persistence
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AvatarProfile, AvatarType } from '@/types/avatar';

export type StudioViewMode = 
  | 'turnaround' 
  | 't-pose' 
  | 'a-pose' 
  | 'expression' 
  | 'voice' 
  | 'soul' 
  | 'live'
  | 'ecosystem'
  | 'all';

export const INITIAL_CANONICAL_AVATARS: AvatarProfile[] = [
  {
    id: 'avatar-maya-vance',
    name: 'Maya Vance',
    tagline: 'Apresentadora Tech & Reviewer de Inteligência Artificial',
    type: 'influencer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-26T12:00:00Z',
    updatedAt: '2026-10-26T12:00:00Z',
    face: {
      primaryAnchorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      referenceImages: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
      ],
      clothingPrompt: 'Jaqueta bomber futurista ciano e preta com detalhes luminosos',
      fixedFeaturesPrompt: 'Olhos castanhos claros amendoados, cabelo castanho ondulado médio com mechas sutis, traços brasileiros expressivos',
      ethnicityAgeGender: 'Mulher brasileira, 26 anos',
      lightingPreset: 'volumetric_neon',
      diffusionSeed: 428912301
    },
    voice: {
      engine: 'qwen-tts',
      tone: 'energetic',
      speed: 1.05,
      pitch: 1.0,
      stability: 0.85,
      v5SoundVoiceId: 'voice_maya_vance_br_v1'
    },
    soul: {
      archetype: 'creator',
      bio: 'Especialista em descomplicar ferramentas de IA para o público do Instagram e YouTube. Comunicativa, dinâmica e apaixonada por tecnologia soberana.',
      niche: 'Tecnologia & IA',
      personalityTraits: ['Espontânea', 'Carismática', 'Didática', 'Curiosa'],
      catchphrases: [
        'Fala, mentes do futuro!',
        'Isso aqui muda completamente o jogo.',
        'Soberania digital é poder.'
      ],
      forbiddenTopics: ['Política partidária', 'Conselhos financeiros duvidosos', 'Pirataria'],
      systemPrompt: 'Você é Maya Vance, criadora de conteúdo e apresentadora oficial da V5 Apollo. Responda de forma ágil, calorosa e tecnicamente impecável.'
    },
    channel: {
      totalConversations: 1420,
      allowedOrigins: ['https://broadcaster.v5apollo.com', 'https://prisma.v5apollo.com', 'http://localhost:3008', 'http://127.0.0.1:3008', 'http://localhost:3010'],
      isLiveActive: false,
      broadcasterLiveToken: 'v5b_live_maya_vance_8849'
    },
    syncedSites: {
      broadcaster: true,
      prisma: true,
      sound: true,
      edit: true,
      finders: true
    }
  },
  {
    id: 'avatar-professor-arthur',
    name: 'Professor Arthur',
    tagline: 'Narrador Pedagógico para Histórias & VSLs Científicas',
    type: 'actor',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-26T14:30:00Z',
    updatedAt: '2026-10-26T14:30:00Z',
    face: {
      primaryAnchorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      referenceImages: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
      ],
      clothingPrompt: 'Blazer cinza chumbo clássico sobre camisa social branca sem gravata',
      fixedFeaturesPrompt: 'Homem maduro de 48 anos, barba grisalha alinhada, olhar sereno, óculos de aro fino titânio',
      ethnicityAgeGender: 'Homem caucasiano latino, 48 anos',
      lightingPreset: 'rembrandt',
      diffusionSeed: 81923019
    },
    voice: {
      engine: 'xtts',
      tone: 'authoritative',
      speed: 0.95,
      pitch: 0.98,
      stability: 0.92,
      v5SoundVoiceId: 'voice_arthur_narrator_v2'
    },
    soul: {
      archetype: 'sage',
      bio: 'Narrador e pensador com vasta bagagem acadêmica. Especializado em documentários, canais dark de história, filosofia e VSLs de alta retenção.',
      niche: 'Educação & VSL',
      personalityTraits: ['Profundo', 'Reflexivo', 'Confiável', 'Elegante'],
      catchphrases: [
        'Mas a verdadeira pergunta que devemos fazer é...',
        'A história não se repete, mas frequentemente rima.',
        'Observem com atenção o detalhe sutil.'
      ],
      forbiddenTopics: ['Linguagem vulgar', 'Gírias passageiras', 'Promessas milagrosas'],
      systemPrompt: 'Você é o Professor Arthur, narrador da V5 Apollo. Seu tom é pausado, culto, seguro e magneticamente envolvente.'
    },
    channel: {
      totalConversations: 630,
      allowedOrigins: ['https://edit.v5apollo.com', 'http://localhost:3008', 'http://127.0.0.1:3008', 'http://localhost:3010'],
      isLiveActive: false,
      broadcasterLiveToken: 'v5b_live_arthur_narrator_4412'
    },
    syncedSites: {
      broadcaster: true,
      prisma: true,
      sound: true,
      edit: true,
      finders: false
    }
  }
];

export interface AvatarState {
  avatars: AvatarProfile[];
  selectedAvatarId: string | null;
  activeMode: StudioViewMode;
  searchQuery: string;
  filterType: AvatarType | 'all';

  // Actions
  addAvatar: (avatar: AvatarProfile) => void;
  updateAvatar: (id: string, updates: Partial<AvatarProfile>) => void;
  deleteAvatar: (id: string) => void;
  selectAvatar: (id: string | null) => void;
  setActiveMode: (mode: StudioViewMode) => void;
  setSearchQuery: (query: string) => void;
  setFilterType: (type: AvatarType | 'all') => void;
  duplicateAvatar: (id: string) => AvatarProfile | null;
  resetToDefaults: () => void;
}

export const useAvatarStore = create<AvatarState>()(
  devtools(
    persist(
      (set, get) => ({
        avatars: INITIAL_CANONICAL_AVATARS,
        selectedAvatarId: 'avatar-maya-vance',
        activeMode: 'turnaround',
        searchQuery: '',
        filterType: 'all',

        addAvatar: (avatar) =>
          set((state) => ({
            avatars: [avatar, ...state.avatars],
            selectedAvatarId: avatar.id,
          })),

        updateAvatar: (id, updates) =>
          set((state) => ({
            avatars: state.avatars.map((av) =>
              av.id === id
                ? {
                    ...av,
                    ...updates,
                    updatedAt: new Date().toISOString(),
                    face: updates.face ? { ...av.face, ...updates.face } : av.face,
                    voice: updates.voice ? { ...av.voice, ...updates.voice } : av.voice,
                    soul: updates.soul ? { ...av.soul, ...updates.soul } : av.soul,
                    channel: updates.channel ? { ...av.channel, ...updates.channel } : av.channel,
                    syncedSites: updates.syncedSites ? { ...av.syncedSites, ...updates.syncedSites } : av.syncedSites,
                  }
                : av
            ),
          })),

        deleteAvatar: (id) =>
          set((state) => {
            const remaining = state.avatars.filter((av) => av.id !== id);
            return {
              avatars: remaining,
              selectedAvatarId:
                state.selectedAvatarId === id
                  ? remaining[0]?.id || null
                  : state.selectedAvatarId,
            };
          }),

        selectAvatar: (id) => set({ selectedAvatarId: id }),

        setActiveMode: (activeMode) => set({ activeMode }),

        setSearchQuery: (searchQuery) => set({ searchQuery }),

        setFilterType: (filterType) => set({ filterType }),

        duplicateAvatar: (id) => {
          const current = get().avatars.find((av) => av.id === id);
          if (!current) return null;

          const duplicated: AvatarProfile = {
            ...current,
            id: `avatar-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: `${current.name} (Cópia)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            avatars: [duplicated, ...state.avatars],
            selectedAvatarId: duplicated.id,
          }));

          return duplicated;
        },

        resetToDefaults: () =>
          set({
            avatars: INITIAL_CANONICAL_AVATARS,
            selectedAvatarId: 'avatar-maya-vance',
            activeMode: 'turnaround',
            searchQuery: '',
            filterType: 'all',
          }),
      }),
      {
        name: 'v5_apollo_avatar_storage',
        onRehydrateStorage: () => (state, error) => {
          if (error || !state || !Array.isArray(state.avatars) || state.avatars.length === 0) {
            console.warn('Reidratação nula ou inválida do localStorage. Restaurando catálogo canônico soberano.');
            if (state) {
              state.avatars = INITIAL_CANONICAL_AVATARS;
              state.selectedAvatarId = INITIAL_CANONICAL_AVATARS[0]?.id || null;
            }
          }
        },
      }
    ),
    { name: 'V5 Avatar Global Store' }
  )
);
