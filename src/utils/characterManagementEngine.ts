/**
 * V5 Apollo Avatar - Central Character Management Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Lógica de filtragem, busca, ordenação e agregação de telemetria
 * para o Dashboard Central de Gestão de Personagens.
 */

import { AvatarProfile, AvatarType } from '@/types/avatar';

export type SortField = 'name' | 'createdAt' | 'updatedAt' | 'conversations';
export type SortOrder = 'asc' | 'desc';
export type SyncFilterTarget = 'all' | 'broadcaster' | 'prisma' | 'sound' | 'edit' | 'finders';

export interface DashboardFilterOptions {
  searchTerm: string;
  selectedNiche: string;
  selectedType: string;
  selectedSyncTarget: SyncFilterTarget;
  liveOnly: boolean;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface CatalogStats {
  total: number;
  liveCount: number;
  uniqueNichesCount: number;
  syncedBroadcaster: number;
  syncedPrisma: number;
  syncedSound: number;
  syncedEdit: number;
  syncedFinders: number;
}

/**
 * Extrai todos os nichos únicos representados no catálogo
 */
export function extractUniqueNiches(avatars: AvatarProfile[]): string[] {
  const set = new Set<string>();
  for (const av of avatars) {
    if (av.soul?.niche) {
      set.add(av.soul.niche.trim());
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/**
 * Calcula métricas agregadas do catálogo
 */
export function computeCatalogStats(avatars: AvatarProfile[]): CatalogStats {
  let liveCount = 0;
  let syncedBroadcaster = 0;
  let syncedPrisma = 0;
  let syncedSound = 0;
  let syncedEdit = 0;
  let syncedFinders = 0;
  const nichesSet = new Set<string>();

  for (const av of avatars) {
    if (av.channel?.isLiveActive) liveCount++;
    if (av.syncedSites?.broadcaster) syncedBroadcaster++;
    if (av.syncedSites?.prisma) syncedPrisma++;
    if (av.syncedSites?.sound) syncedSound++;
    if (av.syncedSites?.edit) syncedEdit++;
    if (av.syncedSites?.finders) syncedFinders++;
    if (av.soul?.niche) nichesSet.add(av.soul.niche.trim());
  }

  return {
    total: avatars.length,
    liveCount,
    uniqueNichesCount: nichesSet.size,
    syncedBroadcaster,
    syncedPrisma,
    syncedSound,
    syncedEdit,
    syncedFinders,
  };
}

/**
 * Aplica filtros combinados e ordenação na lista de avatares
 */
export function filterAndSortAvatars(
  avatars: AvatarProfile[],
  options: DashboardFilterOptions
): AvatarProfile[] {
  const searchLower = options.searchTerm.trim().toLowerCase();

  const filtered = avatars.filter((av) => {
    // 1. Busca textual (nome, bio, tagline, nicho, prompt)
    if (searchLower) {
      const matchName = av.name.toLowerCase().includes(searchLower);
      const matchTagline = av.tagline?.toLowerCase().includes(searchLower);
      const matchBio = av.soul?.bio?.toLowerCase().includes(searchLower);
      const matchNiche = av.soul?.niche?.toLowerCase().includes(searchLower);
      const matchClothing = av.face?.clothingPrompt?.toLowerCase().includes(searchLower);

      if (!matchName && !matchTagline && !matchBio && !matchNiche && !matchClothing) {
        return false;
      }
    }

    // 2. Filtro de Nicho
    if (options.selectedNiche !== 'all') {
      if (av.soul?.niche !== options.selectedNiche) {
        return false;
      }
    }

    // 3. Filtro de Tipo
    if (options.selectedType !== 'all') {
      if (av.type !== options.selectedType) {
        return false;
      }
    }

    // 4. Filtro de Sincronia
    if (options.selectedSyncTarget !== 'all') {
      const synced = av.syncedSites?.[options.selectedSyncTarget];
      if (!synced) return false;
    }

    // 5. Filtro de Live Ativa
    if (options.liveOnly) {
      if (!av.channel?.isLiveActive) return false;
    }

    return true;
  });

  // Ordenação
  return filtered.sort((a, b) => {
    let comparison = 0;

    switch (options.sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'conversations': {
        const cA = a.channel?.totalConversations || 0;
        const cB = b.channel?.totalConversations || 0;
        comparison = cA - cB;
        break;
      }
      case 'updatedAt': {
        const tA = new Date(a.updatedAt || 0).getTime();
        const tB = new Date(b.updatedAt || 0).getTime();
        comparison = tA - tB;
        break;
      }
      case 'createdAt':
      default: {
        const tA = new Date(a.createdAt || 0).getTime();
        const tB = new Date(b.createdAt || 0).getTime();
        comparison = tA - tB;
        break;
      }
    }

    return options.sortOrder === 'desc' ? -comparison : comparison;
  });
}
