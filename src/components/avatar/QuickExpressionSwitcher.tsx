'use client';

import React, { useState, useEffect } from 'react';
import {
  CANONICAL_EXPRESSION_FRAMES,
  ExpressionFrame,
  calculateFacialDrift,
} from '@/utils/expressionSwitcherEngine';
import { toast } from '@/store/useToastStore';
import {
  ArrowLeftRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Check,
  CheckCircle2,
  Scan,
  Crosshair,
  Activity,
  Layers,
} from 'lucide-react';

interface QuickExpressionSwitcherProps {
  characterName?: string;
}

export default function QuickExpressionSwitcher({
  characterName = 'Personagem Soberano',
}: QuickExpressionSwitcherProps) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [cycleSpeedMs, setCycleSpeedMs] = useState<number>(1000); // 500ms, 1000ms, 2000ms
  const [showLaserReticle, setShowLaserReticle] = useState<boolean>(true);
  const [transitionMode, setTransitionMode] = useState<'hard' | 'crossfade'>('crossfade');
  const [isAudited, setIsAudited] = useState<boolean>(false);

  const frames = CANONICAL_EXPRESSION_FRAMES;
  const currentFrame = frames[currentFrameIndex];
  const baselineFrame = frames[0]; // Neutro como baseline
  const drift = calculateFacialDrift(currentFrame, baselineFrame);

  // Loop automático Flip-Book
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
    }, cycleSpeedMs);
    return () => clearInterval(interval);
  }, [isPlaying, cycleSpeedMs, frames.length]);

  const handleManualSelect = (idx: number) => {
    setIsPlaying(false);
    setCurrentFrameIndex(idx);
  };

  const handleApprove = () => {
    setIsAudited(true);
    toast.success(
      'Consistência Anatômica Homologada!',
      `${characterName}: Score de imutabilidade facial validado em ${drift.consistencyScore}%.`
    );
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-5 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Ferramenta de Troca Rápida de Expressão (Flip-Book Test)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30">
                Auditoria de Consistência
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Alternância instantânea entre 9 estados emocionais com retículo laser para detectar saltos anatômicos
            </p>
          </div>
        </div>

        {/* Controles de Loop Automático */}
        <div className="flex items-center gap-2 p-1.5 bg-obsidian-950 border border-white/10 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPlaying
                ? 'bg-luxury-gold text-obsidian-950 shadow-glow-gold'
                : 'bg-white/10 text-slate-200 hover:bg-white/15'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pausar Loop' : 'Iniciar Loop'}
          </button>

          {/* Velocidade */}
          <div className="flex items-center gap-1 text-[10px] pl-1 border-l border-white/10">
            {[500, 1000, 2000].map((ms) => (
              <button
                key={ms}
                type="button"
                onClick={() => setCycleSpeedMs(ms)}
                className={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
                  cycleSpeedMs === ms
                    ? 'bg-cyber-cyan text-obsidian-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ms / 1000}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Viewport Central com Réguas Laser (Esquerda / 6 cols) & Painel de Telemetria e Chips (Direita / 6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Viewport de Inspeção com Laser Reticle */}
        <div className="lg:col-span-6 bg-obsidian-950 p-4 rounded-xl border border-white/10 flex flex-col items-center">
          <div className="flex items-center justify-between w-full pb-2 mb-2 border-b border-white/5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-cyber-cyan font-bold">
              <Crosshair className="w-3.5 h-3.5" />
              Retículo Biométrico Ativo
            </span>
            <label className="flex items-center gap-1.5 text-[10px] cursor-pointer">
              <input
                type="checkbox"
                checked={showLaserReticle}
                onChange={(e) => setShowLaserReticle(e.target.checked)}
                className="accent-cyber-cyan"
              />
              Linhas Laser
            </label>
          </div>

          <div className="relative w-full aspect-square max-w-[340px] rounded-xl overflow-hidden border border-white/10 bg-black select-none">
            {/* Imagem da Expressão Ativa */}
            <img
              src={currentFrame.imageUrl}
              alt={currentFrame.name}
              className={`w-full h-full object-cover select-none pointer-events-none ${
                transitionMode === 'crossfade' ? 'transition-opacity duration-200' : ''
              }`}
            />

            {/* Linhas Laser Horizontais de Alinhamento */}
            {showLaserReticle && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Linha dos Olhos (Eye-level) */}
                <div
                  className="absolute left-0 right-0 h-[1px] bg-cyber-cyan shadow-[0_0_8px_rgba(0,229,255,0.8)] flex items-center justify-between px-2"
                  style={{ top: `${currentFrame.eyeLineY}%` }}
                >
                  <span className="text-[8px] bg-obsidian-950/90 text-cyber-cyan px-1 rounded -translate-y-2">
                    Olhos ({currentFrame.eyeLineY}%)
                  </span>
                </div>

                {/* Linha da Base Nasal */}
                <div
                  className="absolute left-0 right-0 h-[1px] bg-luxury-gold shadow-[0_0_8px_rgba(212,175,55,0.8)] flex items-center justify-between px-2"
                  style={{ top: `${currentFrame.noseLineY}%` }}
                >
                  <span className="text-[8px] bg-obsidian-950/90 text-luxury-gold px-1 rounded -translate-y-2">
                    Base Nasal ({currentFrame.noseLineY}%)
                  </span>
                </div>

                {/* Linha do Queixo */}
                <div
                  className="absolute left-0 right-0 h-[1px] bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)] flex items-center justify-between px-2"
                  style={{ top: `${currentFrame.chinLineY}%` }}
                >
                  <span className="text-[8px] bg-obsidian-950/90 text-pink-400 px-1 rounded -translate-y-2">
                    Queixo ({currentFrame.chinLineY}%)
                  </span>
                </div>

                {/* Eixo Vertical Central Sagital */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/20 -translate-x-1/2 border-l border-dashed border-white/40" />
              </div>
            )}

            {/* Overlay com Nome da Expressão */}
            <div className="absolute bottom-3 inset-x-3 p-2 rounded-lg bg-obsidian-950/80 backdrop-blur-sm border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">{currentFrame.name}</span>
                <span className="text-[9px] text-cyber-cyan font-mono">FACS: {currentFrame.facsCode}</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                {currentFrameIndex + 1}/{frames.length}
              </span>
            </div>
          </div>

          {/* Toggle de Modo de Transição */}
          <div className="w-full mt-3 flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span>Modo de Troca:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTransitionMode('crossfade')}
                className={`cursor-pointer ${transitionMode === 'crossfade' ? 'text-cyber-cyan font-bold' : 'text-slate-500'}`}
              >
                Crossfade (200ms)
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setTransitionMode('hard')}
                className={`cursor-pointer ${transitionMode === 'hard' ? 'text-cyber-cyan font-bold' : 'text-slate-500'}`}
              >
                Corte Seco (Hard)
              </button>
            </div>
          </div>
        </div>

        {/* Coluna 2: Seletor de Quadros e Telemetria de Desvio (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Chips das 9 Expressões para Troca Rápida */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-300 block">
              Selecione o Quadro para Teste Instantâneo:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {frames.map((frame, idx) => {
                const isSelected = currentFrameIndex === idx;
                return (
                  <button
                    key={frame.id}
                    type="button"
                    onClick={() => handleManualSelect(idx)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyber-cyan bg-cyber-cyan/15 text-white font-bold shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                        : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-[11px] truncate">{frame.name}</div>
                    <div className="text-[9px] text-slate-500 font-mono mt-0.5">{frame.facsCode}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Telemetria de Desvio Biométrico em Relação ao Neutro */}
          <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                Telemetria de Consistência Geométrica
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                {drift.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 block text-[9px]">Delta Olhos</span>
                <span className="text-cyber-cyan font-bold font-mono">Δ {drift.deltaEyePercent}%</span>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 block text-[9px]">Delta Nariz</span>
                <span className="text-luxury-gold font-bold font-mono">Δ {drift.deltaNosePercent}%</span>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-slate-400 block text-[9px]">Delta Queixo</span>
                <span className="text-pink-400 font-bold font-mono">Δ {drift.deltaChinPercent}%</span>
              </div>
            </div>

            {/* Score Geral */}
            <div className="p-3 rounded-lg bg-emerald-500/[0.05] border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Score de Imutabilidade Facial</span>
                <span className="text-base font-extrabold text-emerald-400 font-mono">
                  {drift.consistencyScore}%
                </span>
              </div>
              <button
                type="button"
                onClick={handleApprove}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isAudited
                    ? 'bg-emerald-500 text-obsidian-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'bg-cyber-cyan text-obsidian-950 hover:bg-cyan-300'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {isAudited ? 'Homologado' : 'Homologar Consistência'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
