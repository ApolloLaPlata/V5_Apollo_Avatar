'use client';

import React, { useState, useRef } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  unpackAndValidateV5Avatar,
  UnpackedAvatarResult,
  ImporterProgress,
} from '@/utils/v5AvatarZipImporter';
import { createV5AvatarZipPackage } from '@/utils/v5AvatarZipPacker';
import {
  UploadCloud,
  FileArchive,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FolderTree,
  FileCode,
  Check,
  UserCheck,
  RefreshCw,
  FolderOpen,
  ArrowRight,
} from 'lucide-react';

interface V5AvatarZipImporterPanelProps {
  onImportSuccess?: (avatarId: string) => void;
}

export default function V5AvatarZipImporterPanel({
  onImportSuccess,
}: V5AvatarZipImporterPanelProps) {
  const { avatars, addAvatar, selectAvatar } = useAvatarStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<ImporterProgress | null>(null);
  const [unpackedResult, setUnpackedResult] = useState<UnpackedAvatarResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleProcessFile = async (file: File | Blob) => {
    setIsProcessing(true);
    setImportSuccessMessage(null);
    setErrorMessage(null);
    setProgress({ stage: 'Iniciando leitura...', percent: 5 });

    try {
      const result = await unpackAndValidateV5Avatar(file, (p) => setProgress(p));
      setUnpackedResult(result);
      if (!result.isValid) {
        setErrorMessage(`O pacote contém ${result.validationErrors.length} inconsistência(s) de validação.`);
      }
    } catch (err: unknown) {
      console.error('Erro na descompactação:', err);
      const msg = err instanceof Error ? err.message : 'Arquivo inválido ou corrompido';
      setErrorMessage(msg);
      setUnpackedResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  // Teste Instantâneo: gera e descompacta o pacote do avatar selecionado
  const handleLoadDemoPackage = async () => {
    const sourceAvatar = avatars[0];
    if (!sourceAvatar) return;

    setIsProcessing(true);
    setImportSuccessMessage(null);
    setErrorMessage(null);
    setProgress({ stage: 'Gerando pacote de teste em memória...', percent: 20 });

    try {
      const { blob } = await createV5AvatarZipPackage(sourceAvatar);
      const result = await unpackAndValidateV5Avatar(blob, (p) => setProgress(p));
      setUnpackedResult(result);
      if (!result.isValid) {
        setErrorMessage(`O pacote de demonstração possui falhas de integridade.`);
      }
    } catch (err: unknown) {
      console.error('Erro ao gerar pacote de demonstração:', err);
      const msg = err instanceof Error ? err.message : 'Falha na demonstração';
      setErrorMessage(msg);
      setUnpackedResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInjectIntoStore = () => {
    if (!unpackedResult || !unpackedResult.profile || !unpackedResult.isValid) return;

    const imported = unpackedResult.profile;
    const exists = avatars.some((a) => a.id === imported.id);

    if (exists) {
      // Cria ID clone para não conflitar
      const clonedId = `${imported.id}_restored_${Date.now().toString().slice(-4)}`;
      const clonedProfile = {
        ...imported,
        id: clonedId,
        name: `${imported.name} (Restaurado)`,
      };
      addAvatar(clonedProfile);
      selectAvatar(clonedId);
      setImportSuccessMessage(`Personagem "${clonedProfile.name}" restaurado e ativado com sucesso!`);
      onImportSuccess?.(clonedId);
    } else {
      addAvatar(imported);
      selectAvatar(imported.id);
      setImportSuccessMessage(`Personagem "${imported.name}" restaurado e ativado com sucesso!`);
      onImportSuccess?.(imported.id);
    }
  };

  return (
    <div className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(0,229,255,0.08)] space-y-6">
      {/* Header do Painel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <UploadCloud className="w-3.5 h-3.5" />
            Fase 10 · Etapa 093 · Importador Universal de Pacotes
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Importador Universal de Pacotes (.v5avatar)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Descompactação no cliente, auditoria de integridade SHA-256 e restauração completa de todos os pilares de identidade soberana.
          </p>
        </div>

        {/* Botão de Teste Rápido */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLoadDemoPackage}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-400/40 text-purple-300 hover:bg-purple-500/25 transition-all text-xs font-mono font-semibold flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            Testar com Pacote Demonstrativo
          </button>
        </div>
      </div>

      {/* Zona de Drop / Upload */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center space-y-3 ${
          isDragOver
            ? 'bg-cyber-cyan/15 border-cyber-cyan shadow-[0_0_25px_rgba(0,229,255,0.25)] scale-[1.01]'
            : 'bg-obsidian-950/80 border-white/10 hover:border-cyber-cyan/50 hover:bg-obsidian-950'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".v5avatar,.zip,.json"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan shadow-[0_0_15px_rgba(0,229,255,0.15)]">
          <FileArchive className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-base font-bold text-white">
            Arraste e solte o arquivo <span className="text-cyber-cyan">.v5avatar</span> aqui
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Ou clique para selecionar do seu computador (Suporta arquivos .v5avatar, .zip ou .v5avatar.json)
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Validação criptográfica SHA-256 e blindagem soberana automáticas</span>
        </div>
      </div>

      {/* Feedback de Progresso da Descompactação */}
      {isProcessing && progress && (
        <div className="bg-obsidian-950 border border-cyber-cyan/30 rounded-xl p-4 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-cyber-cyan font-bold">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              {progress.stage}
            </span>
            <span>{progress.percent}%</span>
          </div>

          <div className="w-full h-1.5 bg-obsidian-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyber-cyan transition-all duration-150"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Mensagem de Erro / Inconsistência */}
      {errorMessage && (
        <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-4 text-xs font-mono text-rose-300 space-y-1 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-rose-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Aviso de Validação do Pacote</span>
          </div>
          <p className="text-[11px] text-slate-300 pl-6">{errorMessage}</p>
        </div>
      )}

      {/* Sucesso na Injeção */}
      {importSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {importSuccessMessage}
          </span>
          <span className="text-[11px] text-slate-400">Ativo no estúdio</span>
        </div>
      )}

      {/* Resultado da Descompactação & Validação */}
      {unpackedResult && (
        <div className="bg-obsidian-950 border border-cyber-cyan/20 rounded-xl p-5 sm:p-6 space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-cyber-cyan shrink-0">
                <img
                  src={unpackedResult.profile.avatarUrl}
                  alt={unpackedResult.profile.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{unpackedResult.profile.name}</h3>
                  {unpackedResult.checksumAuditPassed && unpackedResult.isValid ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-[10px] font-mono font-bold">
                      SHA-256 VERIFICADO
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-400/30 text-rose-400 text-[10px] font-mono font-bold">
                      FALHA DE VALIDAÇÃO
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {unpackedResult.profile.tagline} · Nicho:{' '}
                  <strong className="text-cyber-cyan">{unpackedResult.profile.soul.niche}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={handleInjectIntoStore}
              disabled={!unpackedResult.isValid}
              className={`px-4 py-2 rounded-xl transition-all text-xs font-mono font-bold flex items-center gap-1.5 ${
                unpackedResult.isValid
                  ? 'bg-cyber-cyan text-obsidian-950 hover:bg-cyber-cyan/90 shadow-[0_0_15px_rgba(0,229,255,0.2)] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              {unpackedResult.isValid ? 'Restaurar Personagem no Estúdio (1-Clique)' : 'Pacote Inválido para Restauração'}
            </button>
          </div>

          {/* Alertas de Erro de Validação */}
          {unpackedResult.validationErrors.length > 0 && (
            <div className="bg-rose-950/20 border border-rose-500/30 rounded-lg p-3 text-xs font-mono text-rose-300 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                Erros detectados no pacote:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
                {unpackedResult.validationErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Grade de Pilares Restaurados */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="bg-obsidian-900 p-3 rounded-lg border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Face DNA:</span>
              <div className="text-cyber-cyan font-bold truncate">
                Seed: {unpackedResult.profile.face.diffusionSeed || '428912301'}
              </div>
            </div>

            <div className="bg-obsidian-900 p-3 rounded-lg border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Voice DNA:</span>
              <div className="text-purple-300 font-bold truncate">
                ID: {unpackedResult.profile.voice.v5SoundVoiceId || unpackedResult.profile.voice.engine}
              </div>
            </div>

            <div className="bg-obsidian-900 p-3 rounded-lg border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Soul DNA:</span>
              <div className="text-amber-300 font-bold truncate">
                {unpackedResult.profile.soul.archetype || 'Arquiteto Soberano'}
              </div>
            </div>

            <div className="bg-obsidian-900 p-3 rounded-lg border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase">Interactive:</span>
              <div className="text-emerald-400 font-bold">
                {unpackedResult.profile.channel.isLiveActive ? 'Live Broadcaster' : 'Webhooks Prontos'}
              </div>
            </div>
          </div>

          {/* Arquivos Extraídos no Interior do Pacote */}
          {unpackedResult.unpackedFiles.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5 text-cyber-cyan" />
                Arquivos Extraídos do Pacote ({unpackedResult.unpackedFiles.length} arquivos):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 max-h-40 overflow-y-auto">
                {unpackedResult.unpackedFiles.map((f, i) => (
                  <div
                    key={i}
                    className="p-2 rounded bg-obsidian-900 border border-white/5 flex items-center justify-between"
                  >
                    <span className="truncate">{f.path}</span>
                    <span className="text-slate-500 text-[10px] shrink-0 ml-2">
                      {(f.sizeBytes / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
