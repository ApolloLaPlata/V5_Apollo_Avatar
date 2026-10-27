/**
 * V5 Apollo Avatar - Universal .v5avatar ZIP Package Importer & Restorer
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Descompactador e Importador Universal de Pacotes `.v5avatar` (Client-Side).
 * Lê arquivos .v5avatar ou .v5avatar.json, descompacta com JSZip, valida a integridade
 * criptográfica SHA-256 e reconstrói o perfil do AvatarProfile para injeção na Store.
 */

import JSZip from 'jszip';
import { AvatarProfile, AvatarType } from '@/types/avatar';
import {
  V5AvatarPackage,
  validatePackageIntegrity,
  computeSha256String,
} from './universalAvatarPackageEngine';

export interface ImporterProgress {
  stage: string;
  percent: number;
  fileName?: string;
}

export interface UnpackedAvatarResult {
  isValid: boolean;
  profile: AvatarProfile;
  packageMetadata: V5AvatarPackage['manifest'];
  unpackedFiles: Array<{
    path: string;
    sizeBytes: number;
    sha256Hex: string;
  }>;
  checksumAuditPassed: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

/**
 * Descompacta e valida um arquivo .v5avatar ou JSON
 */
export async function unpackAndValidateV5Avatar(
  file: File | Blob,
  onProgress?: (progress: ImporterProgress) => void
): Promise<UnpackedAvatarResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const unpackedFiles: UnpackedAvatarResult['unpackedFiles'] = [];

  onProgress?.({ stage: 'Iniciando leitura do arquivo binário...', percent: 10 });

  let rawPackage: V5AvatarPackage | null = null;

  // Verifica se é um arquivo ZIP ou JSON bruto
  if (file.type === 'application/json' || (file instanceof File && file.name.endsWith('.json'))) {
    onProgress?.({ stage: 'Lendo pacote JSON direto...', percent: 40 });
    const text = await file.text();
    try {
      rawPackage = JSON.parse(text);
    } catch (e) {
      errors.push('Arquivo JSON corrompido ou mal formatado.');
    }
  } else {
    // Processamento de arquivo ZIP (.v5avatar)
    onProgress?.({ stage: 'Descompactando arquivo binário .v5avatar...', percent: 30 });
    try {
      const zip = await JSZip.loadAsync(file);

      // Mapeia todos os arquivos presentes no ZIP
      const fileNames = Object.keys(zip.files);
      for (const name of fileNames) {
        const zipEntry = zip.files[name];
        if (!zipEntry.dir) {
          const content = await zipEntry.async('string');
          unpackedFiles.push({
            path: name,
            sizeBytes: content.length,
            sha256Hex: computeSha256String(content),
          });
        }
      }

      onProgress?.({ stage: 'Localizando v5avatar.json raiz...', percent: 60 });

      // Procura pelo arquivo principal v5avatar.json
      const mainFile = zip.file('v5avatar.json') || zip.file('package.json');
      if (!mainFile) {
        errors.push('Arquivo essencial "v5avatar.json" não encontrado no interior do pacote .v5avatar.');
      } else {
        const jsonText = await mainFile.async('string');
        rawPackage = JSON.parse(jsonText);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Arquivo corrompido';
      errors.push(`Falha ao descompactar arquivo ZIP: ${msg}`);
    }
  }

  if (!rawPackage) {
    throw new Error(errors.join('; ') || 'Falha ao processar pacote .v5avatar.');
  }

  onProgress?.({ stage: 'Validando integridade criptográfica SHA-256...', percent: 80 });

  // Validação criptográfica de integridade
  const integrity = validatePackageIntegrity(rawPackage);
  if (!integrity.isValid) {
    errors.push(...integrity.errors);
  }

  // Verificação da Lei 1: Nenhuma menção a mercado cinza / PixDrop
  const serialized = JSON.stringify(rawPackage);
  if (serialized.toLowerCase().includes('pixdrop')) {
    errors.push('VIOLAÇÃO GRAVE DA LEI 1 DO KERNEL: O pacote contém referências proibidas ao PixDrop.');
  }

  onProgress?.({ stage: 'Reconstruindo perfil AvatarProfile soberano...', percent: 95 });

  // Reconstrói o AvatarProfile canônico
  const reconstructedProfile: AvatarProfile = {
    id: rawPackage.profile.id,
    name: rawPackage.profile.name,
    tagline: rawPackage.profile.tagline || 'Personagem Soberano V5',
    type: (rawPackage.profile.type as AvatarType) || 'influencer',
    avatarUrl: rawPackage.profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    createdAt: rawPackage.profile.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    face: rawPackage.dnaPillars.faceDna,
    voice: rawPackage.dnaPillars.voiceDna,
    soul: rawPackage.dnaPillars.soulDna,
    channel: rawPackage.dnaPillars.interactiveChannel,
    syncedSites: {
      broadcaster: true,
      prisma: true,
      sound: true,
      edit: true,
      finders: true,
    },
  };

  onProgress?.({ stage: 'Descompactação e restauração concluídas!', percent: 100 });

  return {
    isValid: errors.length === 0,
    profile: reconstructedProfile,
    packageMetadata: rawPackage.manifest,
    unpackedFiles,
    checksumAuditPassed: integrity.isValid,
    validationErrors: errors,
    validationWarnings: warnings,
  };
}
