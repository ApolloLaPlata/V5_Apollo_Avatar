'use client';

import React, { useState } from 'react';
import {
  generateReleaseManifest,
  MILESTONE_PHASES,
  VersionReleaseManifest,
} from '@/utils/versionMilestoneEngine';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Download,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Rocket,
  Globe,
  Terminal,
} from 'lucide-react';

export default function MilestoneVersion100Banner() {
  const [manifest] = useState<VersionReleaseManifest>(generateReleaseManifest);
  const [isPhasesExpanded, setIsPhasesExpanded] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const handleDownloadManifest = () => {
    const jsonStr = JSON.stringify(manifest, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `v5_apollo_avatar_release_manifest_v1.0.0.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(manifest.systemIntegritySha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-cyber-cyan/50 bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950 p-6 shadow-glow-cyan">
      {/* Luzes de fundo */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyber-cyan/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Conteúdo Principal */}
      <div className="relative z-10 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 text-xs font-mono font-black uppercase tracking-wider bg-gradient-to-r from-cyber-cyan to-amber-400 text-black rounded-full shadow-md flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5" />
                MARCO HISTÓRICO: VERSÃO 1.0.0
              </span>
              <span className="text-xs font-mono text-cyber-cyan font-bold">
                Tag Oficial: v1.0.0-soberano
              </span>
            </div>

            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Award className="w-7 h-7 text-amber-400 shrink-0" />
              <span>V5 Apollo Avatar · 100 Ferramentas Ativas & Operacionais</span>
            </h2>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Agência Central de Identidades Digitais & Registro Civil de Personagens Soberanos da Holding V5 Apollo.
              Todos os 4 pilares (Face DNA, Voice DNA, Soul DNA e Interactive Channel) 100% integrados na porta local <code className="text-cyber-cyan font-mono">:3010</code>.
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleDownloadManifest}
              className="px-4 py-2 bg-gradient-to-r from-cyber-cyan to-electric-indigo text-black font-bold text-xs font-mono rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-cyber-cyan/20"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Manifesto v1.0.0</span>
            </button>

            <button
              type="button"
              onClick={handleCopyHash}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono rounded-xl transition-all flex items-center gap-1.5"
              title="Copiar Digest Criptográfico SHA-256 do Sistema"
            >
              {copiedHash ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Hash Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-cyber-cyan" />
                  <span>Hash SHA-256</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Grade de Métricas da Release */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-black/50 border border-white/10 p-3 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Ferramentas</span>
            <p className="text-xl font-bold text-cyber-cyan mt-0.5">100 / 100</p>
            <span className="text-[10px] text-slate-500">100% operacionais</span>
          </div>

          <div className="bg-black/50 border border-white/10 p-3 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Fases Mestre</span>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">10 Fases</p>
            <span className="text-[10px] text-slate-500">todas homologadas</span>
          </div>

          <div className="bg-black/50 border border-white/10 p-3 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Capitania & Porta</span>
            <p className="text-xl font-bold text-purple-400 mt-0.5">#12 (:3010)</p>
            <span className="text-[10px] text-slate-500">desenvolvimento soberano</span>
          </div>

          <div className="bg-black/50 border border-white/10 p-3 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Lei Inviolável</span>
            <p className="text-xl font-bold text-amber-400 mt-0.5">0% PixDrop</p>
            <span className="text-[10px] text-slate-500">segregação garantida</span>
          </div>
        </div>

        {/* Toggle para Ver Todas as 10 Fases */}
        <div className="border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => setIsPhasesExpanded(!isPhasesExpanded)}
            className="w-full flex items-center justify-between text-xs font-mono text-slate-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyber-cyan" />
              <strong>Grade de Homologação das 10 Fases (Etapas 001 a 100)</strong>
            </span>
            {isPhasesExpanded ? (
              <ChevronUp className="w-4 h-4 text-cyber-cyan" />
            ) : (
              <ChevronDown className="w-4 h-4 text-cyber-cyan" />
            )}
          </button>

          {isPhasesExpanded && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {MILESTONE_PHASES.map((p) => (
                <div
                  key={p.phaseNumber}
                  className="bg-black/40 border border-white/10 p-3 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      Fase {p.phaseNumber}: {p.phaseName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 10 Ferramentas
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 text-[10px] font-mono text-slate-400">
                    {p.keyHighlights.map((h, i) => (
                      <span key={i} className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
