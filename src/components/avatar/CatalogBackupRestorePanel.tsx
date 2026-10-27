'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  generateCatalogBackup,
  exportCatalogBackupFile,
  parseAndValidateCatalogBackup,
  applyCatalogRestore,
  saveLocalSnapshot,
  loadLocalSnapshots,
  RestoreStrategy,
  RestoreValidationResult,
  LocalSnapshotItem,
} from '@/utils/catalogBackupEngine';
import { toast } from '@/store/useToastStore';
import {
  Database,
  Download,
  Upload,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  History,
  RotateCcw,
  Check,
  Layers,
  FileCode,
  Users,
  HardDrive,
  Save,
  Trash2,
} from 'lucide-react';

export default function CatalogBackupRestorePanel() {
  const { avatars, selectedAvatarId, selectAvatar } = useAvatarStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [restoreStrategy, setRestoreStrategy] = useState<RestoreStrategy>('merge');
  const [validationResult, setValidationResult] = useState<RestoreValidationResult | null>(null);
  const [snapshots, setSnapshots] = useState<LocalSnapshotItem[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setSnapshots(loadLocalSnapshots());
  }, []);

  const handleExportBackup = () => {
    setIsExporting(true);
    try {
      const payload = generateCatalogBackup(avatars, selectedAvatarId);
      exportCatalogBackupFile(payload);
      setFeedbackMessage(`Backup de ${avatars.length} personagens exportado com sucesso!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error('Erro no Backup', `Erro ao exportar backup: ${msg}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = parseAndValidateCatalogBackup(text);
      setValidationResult(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error('Erro de Restauração', `Falha ao ler arquivo de backup: ${msg}`);
    }
  };

  const handleApplyRestore = () => {
    if (!validationResult || !validationResult.payload) return;

    const restoredAvatars = applyCatalogRestore(
      validationResult.payload,
      restoreStrategy,
      avatars
    );

    // Atualiza a store global diretamente
    useAvatarStore.setState({ avatars: restoredAvatars });
    if (restoredAvatars[0]) {
      selectAvatar(restoredAvatars[0].id);
    }

    setFeedbackMessage(
      `Catálogo restaurado com sucesso! ${restoredAvatars.length} personagens ativos na store.`
    );
    setValidationResult(null);
  };

  const handleCreateSnapshot = () => {
    const updated = saveLocalSnapshot(`Ponto de Restauração`, avatars);
    setSnapshots(updated);
    setFeedbackMessage('Snapshot local salvo com sucesso no navegador!');
  };

  const handleRestoreSnapshot = (snap: LocalSnapshotItem) => {
    useAvatarStore.setState({ avatars: snap.avatars });
    if (snap.avatars[0]) {
      selectAvatar(snap.avatars[0].id);
    }
    setFeedbackMessage(`Catálogo revertido para "${snap.name}" (${snap.avatarCount} personagens)!`);
  };

  return (
    <div className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(0,229,255,0.08)] space-y-6">
      {/* Header do Painel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <Database className="w-3.5 h-3.5" />
            Fase 10 · Etapa 095 · Backup & Restauração Completa em 1 Clique
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Backup & Restauração Geral do Catálogo
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Exportação do catálogo inteiro de atores virtuais da holding em JSON canônico e restauração em 1 clique com suporte a snapshots locais.
          </p>
        </div>

        {/* Badges de Telemetria e Ação Rápida */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-obsidian-950 border border-cyber-cyan/30 flex items-center gap-2.5">
            <Users className="w-4 h-4 text-cyber-cyan" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-400">Total Personagens</div>
              <div className="text-xs font-bold text-cyber-cyan font-mono">{avatars.length} Ativos</div>
            </div>
          </div>

          <button
            onClick={handleExportBackup}
            disabled={isExporting}
            className="px-5 py-2.5 rounded-xl bg-cyber-cyan text-obsidian-950 hover:bg-cyber-cyan/90 transition-all text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.25)]"
          >
            <Download className="w-4 h-4" />
            Criar Backup Geral (1-Clique)
          </button>
        </div>
      </div>

      {/* Mensagem de Feedback */}
      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {feedbackMessage}
          </span>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grade Principal: Restauração de Arquivo + Snapshots Locais */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna 1: Importar e Restaurar Arquivo de Backup (7 Colunas) */}
        <div className="lg:col-span-7 bg-obsidian-950 border border-white/10 rounded-xl p-5 space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 text-slate-200 font-bold">
            <span className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyber-cyan" />
              Restaurar Catálogo a partir de Arquivo
            </span>
            <span className="text-[10px] text-slate-500">.v5catalog.json</span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.v5catalog.json"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 rounded-xl border-2 border-dashed border-white/10 hover:border-cyber-cyan/50 hover:bg-obsidian-900 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-2"
          >
            <FileCode className="w-8 h-8 text-cyber-cyan opacity-80" />
            <span className="font-bold text-white text-xs">
              Selecione o arquivo de backup (.v5catalog.json)
            </span>
            <span className="text-[10px] text-slate-500">
              Clique aqui para abrir o seletor de arquivos do computador
            </span>
          </div>

          {/* Estratégia de Restauração */}
          <div className="space-y-2 pt-2">
            <label className="text-slate-400 block text-[11px]">Estratégia de Resolução de Conflitos:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRestoreStrategy('merge')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  restoreStrategy === 'merge'
                    ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan font-bold shadow-[0_0_10px_rgba(0,229,255,0.15)]'
                    : 'bg-obsidian-900 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-xs mb-0.5">Mesclar (Merge)</div>
                <div className="text-[10px] opacity-80">Preserva personagens atuais e adiciona os novos</div>
              </button>

              <button
                onClick={() => setRestoreStrategy('overwrite')}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  restoreStrategy === 'overwrite'
                    ? 'bg-rose-500/15 border-rose-400 text-rose-300 font-bold shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                    : 'bg-obsidian-900 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-xs mb-0.5">Substituir Catálogo</div>
                <div className="text-[10px] opacity-80">Limpa a base atual e carrega exatamente o backup</div>
              </button>
            </div>
          </div>

          {/* Resultado da Validação do Backup Selecionado */}
          {validationResult && (
            <div className="p-4 rounded-xl bg-obsidian-900 border border-cyber-cyan/30 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-white font-bold">
                <span>Backup Validado com Sucesso</span>
                <span className="text-cyber-cyan">{validationResult.avatarsCount} Personagens Encontrados</span>
              </div>

              <div className="text-[11px] text-slate-400">
                Nichos: <strong className="text-slate-200">{validationResult.niches.join(', ') || 'Gerais'}</strong>
              </div>

              <button
                onClick={handleApplyRestore}
                className="w-full py-2.5 rounded-lg bg-cyber-cyan text-obsidian-950 font-bold hover:bg-cyber-cyan/90 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.2)]"
              >
                <Check className="w-4 h-4" />
                Aplicar Restauração Agora ({restoreStrategy === 'merge' ? 'Mesclar' : 'Substituir Tudo'})
              </button>
            </div>
          )}
        </div>

        {/* Coluna 2: Snapshots Locais Rápidos no Navegador (5 Colunas) */}
        <div className="lg:col-span-5 bg-obsidian-950 border border-white/10 rounded-xl p-5 space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 text-slate-200 font-bold">
            <span className="flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400" />
              Pontos de Restauração Locais
            </span>
            <button
              onClick={handleCreateSnapshot}
              className="text-[11px] text-cyber-cyan hover:underline flex items-center gap-1"
            >
              <Save className="w-3 h-3" /> Salvar Snapshot
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Snapshots são cópias de segurança salvas instantaneamente no navegador para rollback em caso de testes rápidos.
          </p>

          <div className="space-y-2">
            {snapshots.length === 0 ? (
              <div className="p-4 rounded-lg bg-obsidian-900/60 border border-white/5 text-center text-slate-500 text-[11px]">
                Nenhum snapshot local salvo ainda. Clique em "Salvar Snapshot" acima para criar um ponto de retorno.
              </div>
            ) : (
              snapshots.map((snap) => (
                <div
                  key={snap.id}
                  className="p-3 rounded-lg bg-obsidian-900 border border-white/5 flex items-center justify-between hover:border-white/15 transition-all"
                >
                  <div>
                    <div className="font-bold text-slate-200">{snap.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(snap.createdAt).toLocaleTimeString()} · {snap.avatarCount} personagens
                    </div>
                  </div>

                  <button
                    onClick={() => handleRestoreSnapshot(snap)}
                    className="px-2.5 py-1 rounded bg-purple-500/15 border border-purple-400/30 text-purple-300 hover:bg-purple-500/25 transition-all text-[11px] font-bold flex items-center gap-1"
                    title="Restaurar este estado"
                  >
                    <RotateCcw className="w-3 h-3" /> Reverter
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
