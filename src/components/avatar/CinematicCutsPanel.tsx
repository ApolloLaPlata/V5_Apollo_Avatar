'use client';

import React, { useState, useMemo } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  CutType,
  CameraCutSpec,
  CANONICAL_CUT_SPECS,
  DEFAULT_SHORT_CUT_SEQUENCE,
  CutSequenceItem,
  compileCutSequence,
  exportCutsSequenceJson,
} from '@/utils/cinematicCutsEngine';
import {
  Scissors,
  Sparkles,
  Camera,
  Layers,
  Copy,
  Check,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Play,
  RotateCw,
  ZoomIn,
  Move,
  Film,
  Music,
  Sliders,
  ChevronRight,
  Eye,
} from 'lucide-react';

interface CinematicCutsPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function CinematicCutsPanel({
  avatarId,
  avatarName,
}: CinematicCutsPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const targetName = currentAvatar?.name || avatarName || 'Maya Vance';
  const avatarImage = currentAvatar?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  const [sequence, setSequence] = useState<CutSequenceItem[]>(DEFAULT_SHORT_CUT_SEQUENCE);
  const [selectedCutIndex, setSelectedCutIndex] = useState<number>(0);

  const [copiedSingle, setCopiedSingle] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const cutPackage = useMemo(() => {
    return compileCutSequence(sequence, currentAvatar);
  }, [sequence, currentAvatar]);

  const activeCut = cutPackage.cuts[selectedCutIndex] || cutPackage.cuts[0];
  const activeSpec = CANONICAL_CUT_SPECS[activeCut.cutSpecId] || CANONICAL_CUT_SPECS.reset_bust;

  const handleCopySingle = () => {
    navigator.clipboard.writeText(activeCut.positivePrompt);
    setCopiedSingle(true);
    setTimeout(() => setCopiedSingle(false), 2000);
  };

  const handleCopyAll = () => {
    const text = cutPackage.cuts
      .map(
        (c) =>
          `[TOMADA #${c.order} - ${c.title} (${c.durationSeconds}s)]\n` +
          `ZOOM: ${c.zoomFactor}x | LENTE: ${c.focalLength} | LINHA DOS OLHOS: ${c.eyeLineAnchorY}%\n` +
          `PROMPT: ${c.positivePrompt}\n` +
          `NEGATIVO: ${c.negativePrompt}\n`
      )
      .join('\n----------------------------------------\n\n');

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(0,229,255,0.08)] space-y-6">
      {/* Header do Painel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <Scissors className="w-3.5 h-3.5" />
            Fase 9 · Etapa 084 · Conector V5 Prisma / Edit
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Tabela de Cortes & Ângulos para Shorts
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Jump Cuts, Punch-Ins (1.25x / 1.4x) e Swings angulares calibrados com Ancoramento de Olhos (Eye-Line Lock) para evitar deformações faciais (anti-morphing).
          </p>
        </div>

        {/* Telemetria e Ações Globais */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-obsidian-950 border border-emerald-500/30 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-400">Smoothness Index</div>
              <div className="text-xs font-bold text-emerald-400">{cutPackage.overallSmoothnessIndex}% Seguro</div>
            </div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-obsidian-950 border border-cyber-cyan/30 flex items-center gap-2">
            <Film className="w-4 h-4 text-cyber-cyan" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-400">Duração Sequência</div>
              <div className="text-xs font-bold text-cyber-cyan">
                {cutPackage.totalDurationSeconds}s ({cutPackage.totalCuts} Cortes)
              </div>
            </div>
          </div>

          <button
            onClick={() => exportCutsSequenceJson(cutPackage)}
            className="px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-400/40 text-purple-300 hover:bg-purple-500/25 transition-all text-xs font-mono font-semibold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Exportar JSON (.v5cuts)
          </button>
        </div>
      </div>

      {/* Timeline Interativa da Sequência de Cortes */}
      <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200 flex items-center gap-2">
            <Film className="w-4 h-4 text-cyber-cyan" />
            Sequência de Cortes para Short Viral (Timeline 14s)
          </span>
          <button
            onClick={handleCopyAll}
            className="text-cyber-cyan hover:underline font-mono text-[11px] flex items-center gap-1"
          >
            {copiedAll ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copiedAll ? 'Copiado!' : 'Copiar Todos os Prompts'}
          </button>
        </div>

        {/* Blocos de Cortes na Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {cutPackage.cuts.map((cut, idx) => {
            const isSelected = selectedCutIndex === idx;
            return (
              <button
                key={cut.order}
                onClick={() => setSelectedCutIndex(idx)}
                className={`p-3 rounded-lg border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyber-cyan/20 border-cyber-cyan shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                    : 'bg-obsidian-900 border-white/5 hover:border-white/20 text-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className={`font-bold ${isSelected ? 'text-cyber-cyan' : 'text-slate-300'}`}>
                      Corte #{cut.order}
                    </span>
                    <span className="text-slate-500">{cut.durationSeconds}s</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {cut.title.split(':')[0]}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-cyber-cyan font-bold">{cut.zoomFactor}x</span>
                  <span className={cut.morphRiskScore < 3 ? 'text-emerald-400' : 'text-amber-400'}>
                    Risco: {cut.morphRiskScore}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulador Visual do Corte e Detalhes Técnicos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Visual: Enquadramento Mobile 9:16 (5 Colunas) */}
        <div className="lg:col-span-5 bg-obsidian-950 border border-white/10 rounded-xl p-5 flex flex-col items-center justify-center space-y-3">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/5">
            <span className="font-mono flex items-center gap-1.5 text-slate-200">
              <Smartphone className="w-4 h-4 text-cyber-cyan" />
              Simulador 9:16 (1080x1920)
            </span>
            <span className="text-[11px] font-mono text-purple-400">
              Zoom: <strong>{activeCut.zoomFactor}x</strong>
            </span>
          </div>

          {/* Moldura do Celular */}
          <div className="relative w-56 h-[390px] rounded-2xl overflow-hidden border-2 border-slate-700 bg-obsidian-900 shadow-2xl flex items-center justify-center">
            {/* Foto do Avatar com Zoom e Rotação Dinâmicos */}
            <div
              className="w-full h-full relative transition-all duration-300 overflow-hidden flex items-center justify-center"
              style={{
                transform: `scale(${activeCut.zoomFactor}) rotate(${activeSpec.tiltDegrees}deg)`,
              }}
            >
              <img
                src={avatarImage}
                alt={targetName}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Guia Visual da Linha dos Olhos (Eye-Line Anchor Guide) */}
            <div
              className="absolute left-0 right-0 border-t border-dashed border-cyber-cyan pointer-events-none z-10 flex items-center justify-between px-2"
              style={{ top: `${activeCut.eyeLineAnchorY}%` }}
            >
              <span className="text-[9px] font-mono bg-obsidian-950/90 text-cyber-cyan px-1 rounded shadow">
                Eye-Line Lock {activeCut.eyeLineAnchorY}%
              </span>
              <span className="text-[9px] font-mono bg-obsidian-950/90 text-cyber-cyan px-1 rounded shadow">
                Foco Fixo
              </span>
            </div>

            {/* Margens Seguras (Safe Zones) para Shorts */}
            <div className="absolute top-3 left-3 right-3 text-center pointer-events-none">
              <span className="px-2 py-0.5 rounded bg-black/60 text-[9px] font-mono text-slate-300 border border-white/10">
                Safe Zone: Títulos & Hooks
              </span>
            </div>

            <div className="absolute bottom-4 left-3 right-3 text-center pointer-events-none">
              <span className="px-2 py-0.5 rounded bg-black/60 text-[9px] font-mono text-amber-300 border border-white/10">
                Safe Zone: Legendas & CTA
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center font-mono">
            A linha pontilhada ciano fixa a altura pupilar exata para transições imperceptíveis.
          </p>
        </div>

        {/* Coluna de Especificações & Prompt (7 Colunas) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card de Ficha do Corte */}
          <div className="bg-obsidian-950 border border-cyber-cyan/20 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyber-cyan font-bold tracking-wider">
                  TOMADA #{activeCut.order} · {activeSpec.id.toUpperCase()}
                </span>
                <h3 className="text-base font-bold text-white">{activeCut.title}</h3>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-slate-400">Duração Sugerida:</span>
                <div className="text-sm font-bold text-emerald-400 font-mono">
                  {activeCut.durationSeconds}s
                </div>
              </div>
            </div>

            {/* Metadados Técnicos de Câmera */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-obsidian-900 p-2.5 rounded-lg border border-white/5">
                <span className="text-slate-500 text-[10px]">Lente Virtual:</span>
                <div className="text-slate-200 font-bold truncate">{activeCut.focalLength}</div>
              </div>

              <div className="bg-obsidian-900 p-2.5 rounded-lg border border-white/5">
                <span className="text-slate-500 text-[10px]">Fator de Zoom:</span>
                <div className="text-cyber-cyan font-bold">{activeCut.zoomFactor}x</div>
              </div>

              <div className="bg-obsidian-900 p-2.5 rounded-lg border border-white/5">
                <span className="text-slate-500 text-[10px]">Linha de Olhos Y:</span>
                <div className="text-purple-300 font-bold">{activeCut.eyeLineAnchorY}%</div>
              </div>
            </div>

            {/* Aplicação Ideal e Dica Sonora */}
            <div className="text-xs space-y-1.5 pt-1">
              <p className="text-slate-300 leading-relaxed">
                <strong className="text-slate-100">Aplicação Ideal:</strong> {activeSpec.idealApplication}
              </p>
              <div className="flex items-center gap-2 text-purple-300 text-[11px] bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                <Music className="w-3.5 h-3.5 shrink-0" />
                <span>
                  <strong>Áudio Cue (V5 Sound):</strong> {sequence[selectedCutIndex]?.soundCueAction}
                </span>
              </div>
            </div>

            {/* Regras de Anti-Deformação */}
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                Travas Anti-Morphing Ativas:
              </span>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {activeSpec.antiMorphingConstraints.map((constraint, i) => (
                  <li key={i}>{constraint}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Prompt Positivo Compilado */}
          <div className="bg-obsidian-950 border border-white/10 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Prompt Positivo Injetado com Física de Câmera:
              </span>
              <button
                onClick={handleCopySingle}
                className="px-2.5 py-1 rounded bg-cyber-cyan/15 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/25 transition-all text-xs font-mono font-semibold flex items-center gap-1"
              >
                {copiedSingle ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedSingle ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <pre className="p-3 bg-obsidian-900 rounded-lg text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed border border-white/5 select-all">
              {activeCut.positivePrompt}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
