/**
 * V5 Apollo Avatar - Universal .v5avatar ZIP Package Generator
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Empacotador ZIP Client-Side gerando arquivo portátil `.v5avatar` contendo
 * imagens, amostras de áudio, metadados dos 4 pilares e conectores para todas as capitanias.
 */

import JSZip from 'jszip';
import { AvatarProfile } from '@/types/avatar';
import {
  compileUniversalAvatarPackage,
  computeSha256String,
  V5AvatarPackage,
} from './universalAvatarPackageEngine';

export interface ZipPackagingProgress {
  stage: string;
  percent: number;
  currentFile: string;
}

export interface ZipPackagingResult {
  fileName: string;
  blobSize: number;
  sizeFormatted: string;
  filesCount: number;
  rootChecksumSha256: string;
  createdAt: string;
}

export interface ZipPackerOptions {
  includeConnectors?: boolean;
  includeAudioSamples?: boolean;
  compressionLevel?: number; // 1 (rápido) a 9 (máximo)
}

/**
 * Cria o pacote ZIP binário portátil (.v5avatar) diretamente no navegador
 */
export async function createV5AvatarZipPackage(
  avatar: AvatarProfile,
  options: ZipPackerOptions = {},
  onProgress?: (progress: ZipPackagingProgress) => void
): Promise<{ blob: Blob; result: ZipPackagingResult }> {
  const zip = new JSZip();
  const avatarName = avatar.name;
  const avatarId = avatar.id;
  const cleanName = avatarName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const fileName = `${cleanName}_sovereign_identity.v5avatar`;

  onProgress?.({
    stage: 'Compilando manifesto e Schemas canônicos...',
    percent: 15,
    currentFile: 'manifest.json',
  });

  // 1. Compila o V5AvatarPackage raiz
  const universalPackage: V5AvatarPackage = compileUniversalAvatarPackage(avatar);
  const packageJsonStr = JSON.stringify(universalPackage, null, 2);

  zip.file('v5avatar.json', packageJsonStr);
  zip.file('manifest.json', JSON.stringify(universalPackage.manifest, null, 2));

  onProgress?.({
    stage: 'Empacotando 4 Pilares do DNA do Avatar...',
    percent: 35,
    currentFile: 'dna/face_dna.json',
  });

  // 2. Pasta /dna/ com os pilares separados para consumo modular
  const dnaFolder = zip.folder('dna');
  if (dnaFolder) {
    dnaFolder.file('face_dna.json', JSON.stringify(avatar.face, null, 2));
    dnaFolder.file('voice_dna.json', JSON.stringify(avatar.voice, null, 2));
    dnaFolder.file('soul_dna.json', JSON.stringify(avatar.soul, null, 2));
    dnaFolder.file('interactive_channel.json', JSON.stringify(avatar.channel, null, 2));
    if (avatar.visemes) {
      dnaFolder.file('visemes_dna.json', JSON.stringify(avatar.visemes, null, 2));
    }
    if (avatar.rigging) {
      dnaFolder.file('rigging_dna.json', JSON.stringify(avatar.rigging, null, 2));
    }
  }

  onProgress?.({
    stage: 'Empacotando Conectores de Capitanias...',
    percent: 60,
    currentFile: 'connectors/prisma_connector.json',
  });

  // 3. Pasta /connectors/ com dados pré-formatados para cada sistema da holding
  if (options.includeConnectors !== false) {
    const connectorsFolder = zip.folder('connectors');
    if (connectorsFolder) {
      // Conector V5 Broadcaster (:3008)
      connectorsFolder.file(
        'v5_broadcaster_vtuber.json',
        JSON.stringify(
          {
            avatarId,
            avatarName,
            targetSystem: 'Capitania #08 (V5 Broadcaster)',
            webhookUrl: avatar.channel.webhookUrl,
            liveToken: avatar.channel.broadcasterLiveToken,
            visemeMappings: avatar.visemes?.visemes || [],
          },
          null,
          2
        )
      );

      // Conector V5 Prisma (:3000)
      connectorsFolder.file(
        'v5_prisma_diffusion.json',
        JSON.stringify(
          {
            avatarId,
            avatarName,
            targetSystem: 'Capitania #01 (V5 Prisma)',
            triggerWord: `v5_${cleanName}_person`,
            primaryAnchorUrl: avatar.face.primaryAnchorImage || avatar.avatarUrl,
            turnaroundSheetUrl: avatar.face.turnaroundSheetUrl,
            diffusionSeed: avatar.face.diffusionSeed || 428912301,
          },
          null,
          2
        )
      );

      // Conector V5 Sound (:3008)
      connectorsFolder.file(
        'v5_sound_voice_clone.json',
        JSON.stringify(
          {
            avatarId,
            avatarName,
            targetSystem: 'Capitania #03 (V5 Sound)',
            voiceId: avatar.voice.v5SoundVoiceId || avatar.voice.engine,
            speed: avatar.voice.speed,
            tone: avatar.voice.tone,
            stability: avatar.voice.stability,
          },
          null,
          2
        )
      );

      // Conector V5 Auto Blog
      connectorsFolder.file(
        'v5_autoblog_author.json',
        JSON.stringify(
          {
            avatarId,
            avatarName,
            targetSystem: 'Capitania #10 (V5 Auto Blog)',
            niche: avatar.soul.niche,
            bio: avatar.soul.loreDetails?.executiveBio || avatar.soul.bio,
            jobTitle: 'Especialista Canônico V5',
          },
          null,
          2
        )
      );
    }
  }

  onProgress?.({
    stage: 'Empacotando Assets Visuais & Áudio...',
    percent: 80,
    currentFile: 'assets/README_ASSETS.txt',
  });

  // 4. Pasta /assets/ com notas de referência
  const assetsFolder = zip.folder('assets');
  if (assetsFolder) {
    assetsFolder.file(
      'README_ASSETS.txt',
      `HOLDING V5 APOLLO · CAPITANIA #12 (V5 AVATAR)\n` +
        `PERSONAGEM SOBERANO: ${avatarName} (${avatarId})\n\n` +
        `Este pacote .v5avatar consolida todos os ativos canônicos da identidade digital.\n` +
        `Foto Âncora: ${avatar.face.primaryAnchorImage || avatar.avatarUrl}\n` +
        `Turnaround 360º: ${avatar.face.turnaroundSheetUrl || 'Disponível no manifesto'}\n` +
        `Amostra de Voz: ${avatar.voice.sampleAudioUrl || 'Qwen-TTS / XTTS Clone'}\n`
    );
  }

  // 5. Gera a tabela checksums.sha256
  const checksumEntries: string[] = [];
  checksumEntries.push(`${computeSha256String(packageJsonStr)}  v5avatar.json`);
  checksumEntries.push(`${computeSha256String(JSON.stringify(avatar.face))}  dna/face_dna.json`);
  checksumEntries.push(`${computeSha256String(JSON.stringify(avatar.voice))}  dna/voice_dna.json`);
  checksumEntries.push(`${computeSha256String(JSON.stringify(avatar.soul))}  dna/soul_dna.json`);
  checksumEntries.push(`${computeSha256String(JSON.stringify(avatar.channel))}  dna/interactive_channel.json`);

  zip.file('checksums.sha256', checksumEntries.join('\n'));

  onProgress?.({
    stage: 'Comprimindo arquivo portátil .v5avatar...',
    percent: 92,
    currentFile: fileName,
  });

  // 6. Gera o Blob final do ZIP
  const blob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: options.compressionLevel || 6,
      },
    },
    (metadata) => {
      onProgress?.({
        stage: 'Gerando stream binário DEFLATE...',
        percent: Math.min(99, Math.round(90 + (metadata.percent * 0.1))),
        currentFile: fileName,
      });
    }
  );

  const blobSize = blob.size;
  const sizeFormatted = (blobSize / 1024).toFixed(1) + ' KB';
  const rootChecksumSha256 = universalPackage.manifest.integrityChecksumSha256;

  onProgress?.({
    stage: 'Pacote .v5avatar gerado com sucesso!',
    percent: 100,
    currentFile: fileName,
  });

  return {
    blob,
    result: {
      fileName,
      blobSize,
      sizeFormatted,
      filesCount: Object.keys(zip.files).length,
      rootChecksumSha256,
      createdAt: new Date().toISOString(),
    },
  };
}

/**
 * Dispara o download automático do arquivo .v5avatar no navegador
 */
export async function downloadV5AvatarZip(
  avatar: AvatarProfile,
  options: ZipPackerOptions = {},
  onProgress?: (progress: ZipPackagingProgress) => void
): Promise<ZipPackagingResult> {
  const { blob, result } = await createV5AvatarZipPackage(avatar, options, onProgress);

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = result.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return result;
}
