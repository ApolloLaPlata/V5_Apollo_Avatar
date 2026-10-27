'use client';

import React, { useState } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  createV5AvatarZipPackage,
  downloadV5AvatarZip,
  ZipPackagingProgress,
  ZipPackagingResult,
} from '@/utils/v5AvatarZipPacker';
import {
  Archive,
  Download,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileArchive,
  FolderTree,
  FileText,
  Layers,
  Cpu,
  Check,
  Sliders,
  AlertCircle,
  FileCode,
  Folder,
} from 'lucide-react';

interface V5AvatarZipPackerPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function V5AvatarZipPackerPanel({
  avatarId,
  avatarName,
}: V5AvatarZipPackerPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const targetName = currentAvatar?.name || avatarName || 'Maya Vance';

  const [isPacking, setIsPacking] = useState(false);
  const [progress, setProgress] = useState<ZipPackagingProgress | null>(null);
  const [lastResult, setLastResult] = useState<ZipPackagingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [includeConnectors, setIncludeConnectors] = useState(true);
  const [compressionLevel, setCompressionLevel] = useState(6);

  const handleStartPacking = async () => {
    if (!currentAvatar || isPacking) return;

    try {
      setErrorMessage(null);
      setIsPacking(true);
      setProgress({
        stage: 'Iniciando compilação do pacote soberano...',
        percent: 5,
        currentFile: 'init',
      });

      const result = await downloadV5AvatarZip(
        currentAvatar,
        {
          includeConnectors,
          compressionLevel,
        },
        (p) => {
          setProgress(p);
        }
      );

      setLastResult(result);
    } catch (err: unknown) {
      console.error('Erro ao empacotar .v5avatar:', err);
      const msg = err instanceof Error ? err.message : 'Falha desconhecida ao gerar pacote ZIP.';
      setErrorMessage(msg);
    } finally {
      setIsPacking(false);
    }
  };

  return (
    <div className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(0,229,255,0.08)] space-y-6">
      {/* Header do Painel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <Archive className="w-3.5 h-3.5" />
            Fase 10 · Etapa 092 · Empacotador ZIP Client-Side
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Empacotador ZIP Portátil (.v5avatar)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Geração instantânea no navegador de arquivo binário comprimido (.v5avatar) contendo todos os 4 pilares, imagens, áudios e conectores de capitanias.
          </p>
        </div>

        {/* Botão Principal de Download */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleStartPacking}
            disabled={isPacking}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.25)] ${
              isPacking
                ? 'bg-cyber-cyan/30 text-cyber-cyan cursor-wait'
                : 'bg-cyber-cyan text-obsidian-950 hover:bg-cyber-cyan/90 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isPacking ? (
              <>
                <Cpu className="w-4 h-4 animate-spin text-obsidian-950" />
                <span>Empacotando... {progress?.percent || 0}%</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Gerar & Baixar Pacote (.v5avatar)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Barra de Progresso em Tempo Real */}
      {isPacking && progress && (
        <div className="bg-obsidian-950 border border-cyber-cyan/40 rounded-xl p-4 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyber-cyan font-bold flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 animate-spin" />
              {progress.stage}
            </span>
            <span className="text-white font-bold">{progress.percent}%</span>
          </div>

          <div className="w-full h-2 bg-obsidian-900 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-cyber-cyan to-purple-500 transition-all duration-200"
              style={{ width: `${progress.percent}%` }}
            />
          </div>

          <div className="text-[10px] font-mono text-slate-500 truncate">
            Processando: <span className="text-slate-300">{progress.currentFile}</span>
          </div>
        </div>
      )}

      {/* Erro no Empacotamento */}
      {errorMessage && (
        <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-4 space-y-1 text-xs font-mono text-rose-300 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Falha ao gerar o pacote .v5avatar</span>
          </div>
          <p className="text-[11px] text-slate-300 pl-6">{errorMessage}</p>
        </div>
      )}

      {/* Relatório do Último Pacote Gerado */}
      {lastResult && (
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-emerald-400 font-bold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Pacote Soberano Gerado & Baixado com Sucesso!
            </span>
            <span className="text-[10px] text-slate-400">
              {new Date(lastResult.createdAt).toLocaleTimeString()}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300 pt-1">
            <div>
              <span className="text-[10px] text-slate-500 block">Arquivo Gerado:</span>
              <strong className="text-white truncate block">{lastResult.fileName}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Tamanho Comprimido:</span>
              <strong className="text-cyber-cyan">{lastResult.sizeFormatted}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Arquivos no ZIP:</span>
              <strong className="text-purple-300">{lastResult.filesCount} arquivos</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Root SHA-256:</span>
              <strong className="text-emerald-400 truncate block">
                {lastResult.rootChecksumSha256.slice(0, 14)}...
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Árvore de Diretórios do Pacote e Opções de Compressão */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Árvore de Arquivos do Pacote (7 Colunas) */}
        <div className="lg:col-span-7 bg-obsidian-950 border border-white/10 rounded-xl p-5 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 text-slate-300 font-bold">
            <span className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-cyber-cyan" />
              Estrutura de Arquivos no Pacote .v5avatar (ZIP)
            </span>
            <span className="text-[10px] text-slate-500">Padrão V5 Apollo</span>
          </div>

          <div className="space-y-1.5 text-slate-300 pl-2">
            <div className="flex items-center gap-2 text-cyber-cyan font-bold">
              <Folder className="w-4 h-4" />
              <span>{targetName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_sovereign_identity.v5avatar</span>
            </div>

            <div className="pl-6 space-y-1 text-slate-400">
              <div className="flex items-center gap-2 text-white">
                <FileCode className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>v5avatar.json</span>
                <span className="text-[10px] text-slate-500">(Schema universal completo)</span>
              </div>

              <div className="flex items-center gap-2 text-white">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>manifest.json</span>
                <span className="text-[10px] text-slate-500">(Metadados & Checksum SHA-256)</span>
              </div>

              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>checksums.sha256</span>
                <span className="text-[10px] text-slate-500">(Hash individual de cada arquivo)</span>
              </div>

              {/* Pasta DNA */}
              <div className="pt-1">
                <div className="flex items-center gap-1.5 text-purple-400 font-semibold">
                  <Folder className="w-3.5 h-3.5" />
                  <span>dna/</span>
                </div>
                <div className="pl-5 space-y-0.5 text-slate-400 text-[11px]">
                  <div>├── face_dna.json (Âncoras, Turnaround 360, Seeds)</div>
                  <div>├── voice_dna.json (Voice ID, Parâmetros Qwen-TTS)</div>
                  <div>├── soul_dna.json (Bio, Big Five, RAG Knowledge)</div>
                  <div>└── interactive_channel.json (Webhooks & OBS)</div>
                </div>
              </div>

              {/* Pasta Connectors */}
              <div className="pt-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Folder className="w-3.5 h-3.5" />
                  <span>connectors/</span>
                </div>
                <div className="pl-5 space-y-0.5 text-slate-400 text-[11px]">
                  <div>├── v5_broadcaster_vtuber.json (Capitania #08)</div>
                  <div>├── v5_prisma_diffusion.json (Capitania #01)</div>
                  <div>├── v5_sound_voice_clone.json (Capitania #03)</div>
                  <div>└── v5_autoblog_author.json (Capitania #10)</div>
                </div>
              </div>

              {/* Pasta Assets */}
              <div className="pt-1">
                <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
                  <Folder className="w-3.5 h-3.5" />
                  <span>assets/</span>
                </div>
                <div className="pl-5 space-y-0.5 text-slate-400 text-[11px]">
                  <div>└── README_ASSETS.txt (Manifesto de Ativos Físicos)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Opções de Empacotamento (5 Colunas) */}
        <div className="lg:col-span-5 bg-obsidian-950 border border-white/10 rounded-xl p-5 space-y-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-200 font-bold border-b border-white/5 pb-2">
            <Sliders className="w-4 h-4 text-cyber-cyan" />
            <span>Configurações do Empacotador</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-obsidian-900 border border-white/5">
              <div>
                <span className="font-bold text-white block">Incluir Conectores:</span>
                <span className="text-[11px] text-slate-400">
                  Arquivos prontos para Broadcaster, Prisma, Sound e Auto Blog.
                </span>
              </div>
              <input
                type="checkbox"
                checked={includeConnectors}
                onChange={(e) => setIncludeConnectors(e.target.checked)}
                className="w-4 h-4 accent-cyber-cyan rounded cursor-pointer"
              />
            </div>

            <div className="p-3 rounded-lg bg-obsidian-900 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Nível de Compressão (DEFLATE):</span>
                <span className="text-cyber-cyan font-bold">Nível {compressionLevel}</span>
              </div>
              <input
                type="range"
                min="1"
                max="9"
                step="1"
                value={compressionLevel}
                onChange={(e) => setCompressionLevel(Number(e.target.value))}
                className="w-full accent-cyber-cyan cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Rápido (1)</span>
                <span>Equilibrado (6)</span>
                <span>Máximo (9)</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-cyber-cyan/5 border border-cyber-cyan/20 text-slate-300 space-y-1">
              <span className="font-bold text-cyber-cyan flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Portabilidade Soberana
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                O arquivo gerado é 100% autossuficiente e pode ser importado em qualquer instância do V5 Apollo Avatar na porta :3010 para restaurar o personagem por completo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
