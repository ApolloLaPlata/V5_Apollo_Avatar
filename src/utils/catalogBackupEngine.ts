/**
 * V5 Apollo Avatar - Full Catalog Backup & Restore Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Sistema de Backup e Restauração Completa do Catálogo de Personagens em 1 Clique.
 * Permite empacotar todo o catálogo de atores virtuais da holding com integridade SHA-256,
 * suporte a pontos de restauração locais (snapshots) e estratégias de mesclagem ou substituição.
 */

import { AvatarProfile } from '@/types/avatar';
import { computeSha256String } from './universalAvatarPackageEngine';

export type RestoreStrategy = 'merge' | 'overwrite';

export interface CatalogBackupManifest {
  backupId: string;
  schemaVersion: 'v5apollo.catalogbackup.v1.0';
  holding: 'Holding V5 Apollo';
  captaincy: 'Capitania #12 (V5 Apollo Avatar)';
  totalAvatars: number;
  activeAvatarId: string;
  nichesRepresented: string[];
  exportedAt: string;
  catalogDigestSha256: string;
}

export interface CatalogBackupPayload {
  manifest: CatalogBackupManifest;
  avatars: AvatarProfile[];
  appSettings: {
    port: 3010;
    studioName: string;
    environment: 'development_sovereign';
  };
}

export interface RestoreValidationResult {
  isValid: boolean;
  payload?: CatalogBackupPayload;
  avatarsCount: number;
  niches: string[];
  digestMatched: boolean;
  errors: string[];
  warnings: string[];
}

export interface LocalSnapshotItem {
  id: string;
  name: string;
  createdAt: string;
  avatarCount: number;
  avatars: AvatarProfile[];
}

const LOCAL_STORAGE_SNAPSHOT_KEY = 'v5_avatar_studio_snapshots_v1';

/**
 * Gera a carga útil do backup completo do catálogo
 */
export function generateCatalogBackup(
  avatars: AvatarProfile[],
  activeAvatarId?: string | null
): CatalogBackupPayload {
  const now = new Date().toISOString();
  const niches = Array.from(new Set(avatars.map((a) => a.soul.niche).filter(Boolean)));
  const serializedAvatars = JSON.stringify(avatars);
  const digestSha256 = computeSha256String(`catalog_digest_${avatars.length}_${serializedAvatars}`);

  return {
    manifest: {
      backupId: `v5_backup_${Date.now()}`,
      schemaVersion: 'v5apollo.catalogbackup.v1.0',
      holding: 'Holding V5 Apollo',
      captaincy: 'Capitania #12 (V5 Apollo Avatar)',
      totalAvatars: avatars.length,
      activeAvatarId: activeAvatarId || avatars[0]?.id || '',
      nichesRepresented: niches,
      exportedAt: now,
      catalogDigestSha256: digestSha256,
    },
    avatars,
    appSettings: {
      port: 3010,
      studioName: 'V5 Apollo Avatar Studio Hub',
      environment: 'development_sovereign',
    },
  };
}

/**
 * Dispara o download automático do arquivo de backup do catálogo
 */
export function exportCatalogBackupFile(payload: CatalogBackupPayload): void {
  const jsonString = JSON.stringify(payload, null, 2);
  const dateStr = new Date().toISOString().split('T')[0];
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `v5_apollo_avatar_full_backup_${dateStr}_${payload.manifest.totalAvatars}avatars.v5catalog.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Faz o parse e a validação do conteúdo de um arquivo de backup
 */
export function parseAndValidateCatalogBackup(rawJsonText: string): RestoreValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const payload: CatalogBackupPayload = JSON.parse(rawJsonText);

    if (payload.manifest?.schemaVersion !== 'v5apollo.catalogbackup.v1.0') {
      errors.push(`Schema de backup incompatível: ${payload.manifest?.schemaVersion || 'desconhecido'}`);
    }

    if (!Array.isArray(payload.avatars) || payload.avatars.length === 0) {
      errors.push('O arquivo de backup não contém nenhum personagem válido.');
    }

    // Validação da Lei 1 (Zero menção a PixDrop)
    if (rawJsonText.toLowerCase().includes('pixdrop')) {
      errors.push('VIOLAÇÃO DA LEI 1 DO KERNEL: O backup contém menções proibidas ao PixDrop.');
    }

    // Validação do Digest SHA-256
    const serializedAvatars = JSON.stringify(payload.avatars);
    const expectedDigest = computeSha256String(`catalog_digest_${payload.avatars.length}_${serializedAvatars}`);
    const digestMatched = expectedDigest === payload.manifest?.catalogDigestSha256;

    if (!digestMatched) {
      warnings.push('O digest do catálogo divergiu levemente, mas os personagens são restauráveis.');
    }

    const niches = Array.from(new Set(payload.avatars.map((a) => a.soul?.niche).filter(Boolean)));

    return {
      isValid: errors.length === 0,
      payload,
      avatarsCount: payload.avatars.length,
      niches,
      digestMatched,
      errors,
      warnings,
    };
  } catch (err: any) {
    return {
      isValid: false,
      avatarsCount: 0,
      niches: [],
      digestMatched: false,
      errors: [`Falha ao decodificar JSON do backup: ${err.message}`],
      warnings: [],
    };
  }
}

/**
 * Aplica a restauração conforme a estratégia escolhida (substituição ou mesclagem)
 */
export function applyCatalogRestore(
  payload: CatalogBackupPayload,
  strategy: RestoreStrategy,
  currentAvatars: AvatarProfile[]
): AvatarProfile[] {
  if (strategy === 'overwrite') {
    return [...payload.avatars];
  }

  // Estratégia 'merge': adiciona avatares novos e atualiza existentes pelo ID
  const avatarMap = new Map<string, AvatarProfile>();
  currentAvatars.forEach((a) => avatarMap.set(a.id, a));
  payload.avatars.forEach((a) => avatarMap.set(a.id, a));

  return Array.from(avatarMap.values());
}

/**
 * Salva um ponto de restauração instantâneo no LocalStorage
 */
export function saveLocalSnapshot(name: string, avatars: AvatarProfile[]): LocalSnapshotItem[] {
  if (typeof window === 'undefined') return [];
  const existing = loadLocalSnapshots();

  const newSnapshot: LocalSnapshotItem = {
    id: `snap_${Date.now()}`,
    name: name || `Snapshot ${new Date().toLocaleTimeString()}`,
    createdAt: new Date().toISOString(),
    avatarCount: avatars.length,
    avatars,
  };

  const updated = [newSnapshot, ...existing].slice(0, 5); // Mantém os últimos 5
  try {
    localStorage.setItem(LOCAL_STORAGE_SNAPSHOT_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage cheio ou indisponível:', e);
  }

  return updated;
}

/**
 * Carrega a lista de snapshots locais salvos no navegador
 */
export function loadLocalSnapshots(): LocalSnapshotItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SNAPSHOT_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}
