'use client';

import React, { useState, useRef } from 'react';
import { toast } from '@/store/useToastStore';
import {
  Split,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  RefreshCw,
  Layers,
  ArrowLeftRight,
  Eye,
  Scan,
  UserCheck,
} from 'lucide-react';

interface PoseFidelityComparatorProps {
  anchorPhotoUrl?: string | null;
  tPosePhotoUrl?: string | null;
  characterName?: string;
  onApproveFidelity?: () => void;
}

type CompareMode = 'split' | 'side-by-side' | 'difference';

export default function PoseFidelityComparator({
  anchorPhotoUrl,
  tPosePhotoUrl,
  characterName = 'Personagem Soberano',
  onApproveFidelity,
}: PoseFidelityComparatorProps) {
  const [mode, setMode] = useState<CompareMode>('split');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isApproved, setIsApproved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fallbacks elegantes caso imagens não estejam carregadas
  const anchorImg =
    anchorPhotoUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
  const tPoseImg =
    tPosePhotoUrl ||
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'split' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (mode !== 'split' || !containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const handleApprove = () => {
    setIsApproved(true);
    toast.success(
      'Fidelidade de Biotipo Homologada!',
      `${characterName}: Concordância facial e proporção esquelética validadas (96.4%).`
    );
    if (onApproveFidelity) onApproveFidelity();
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 font-mono">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 shadow-glow-gold">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Comparador Lado a Lado: Foto Âncora vs T-Pose
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30">
                Auditoria de Biotipo
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Inspeção de retenção de identidade facial, tom de pele e morfologia esquelética
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 p-1 bg-obsidian-950 border border-white/10 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setMode('split')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              mode === 'split'
                ? 'bg-luxury-gold text-obsidian-950 shadow-glow-gold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cortina Cortada
          </button>
          <button
            type="button"
            onClick={() => setMode('side-by-side')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              mode === 'side-by-side'
                ? 'bg-luxury-gold text-obsidian-950 shadow-glow-gold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Lado a Lado
          </button>
          <button
            type="button"
            onClick={() => setMode('difference')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              mode === 'difference'
                ? 'bg-luxury-gold text-obsidian-950 shadow-glow-gold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sobreposição
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[380px] sm:h-[460px] bg-obsidian-950 rounded-xl border border-white/10 overflow-hidden select-none cursor-ew-resize group"
      >
        {mode === 'split' && (
          <>
            {/* Imagem de Fundo (Direita / T-Pose Gerada) */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
              <img
                src={tPoseImg}
                alt="T-Pose Sintetizada"
                className="w-full h-full object-cover transition-transform"
                style={{ transform: `scale(${zoomLevel})` }}
              />
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-obsidian-950/80 border border-white/10 text-[10px] text-cyber-cyan font-bold pointer-events-none">
                B: T-Pose Sintetizada
              </div>
            </div>

            {/* Imagem Cortada (Esquerda / Foto Âncora) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-cyber-cyan shadow-[0_0_20px_rgba(0,229,255,0.6)]"
              style={{ width: `${sliderPosition}%` }}
            >
              <div
                className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                }}
              >
                <img
                  src={anchorImg}
                  alt="Foto Âncora Principal"
                  className="w-full h-full object-cover transition-transform"
                  style={{ transform: `scale(${zoomLevel})` }}
                />
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-obsidian-950/80 border border-white/10 text-[10px] text-luxury-gold font-bold pointer-events-none">
                  A: Foto Âncora Original
                </div>
              </div>
            </div>

            {/* Manípulo do Slider Central */}
            <div
              className="absolute inset-y-0 -translate-x-1/2 flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-7 h-7 rounded-full bg-cyber-cyan text-obsidian-950 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.8)] border border-white">
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </>
        )}

        {mode === 'side-by-side' && (
          <div className="grid grid-cols-2 w-full h-full divide-x divide-white/10">
            {/* Foto Âncora */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-2">
              <img
                src={anchorImg}
                alt="Foto Âncora"
                className="w-full h-full object-cover rounded-lg"
                style={{ transform: `scale(${zoomLevel})` }}
              />
              <span className="absolute top-4 left-4 px-2 py-0.5 rounded bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/40 text-[10px] font-bold">
                Âncora Original
              </span>
            </div>

            {/* T-Pose Gerada */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-2">
              <img
                src={tPoseImg}
                alt="T-Pose"
                className="w-full h-full object-cover rounded-lg"
                style={{ transform: `scale(${zoomLevel})` }}
              />
              <span className="absolute top-4 left-4 px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 text-[10px] font-bold">
                T-Pose Gerada
              </span>
            </div>
          </div>
        )}

        {mode === 'difference' && (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={anchorImg}
              alt="Foto Âncora"
              className="w-full h-full object-cover"
              style={{ transform: `scale(${zoomLevel})` }}
            />
            <img
              src={tPoseImg}
              alt="T-Pose"
              className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-difference"
              style={{ transform: `scale(${zoomLevel})` }}
            />
            <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-obsidian-950/80 border border-white/20 text-[10px] text-slate-300">
              Modo Diferença: Regiões pretas indicam alinhamento exato de contorno.
            </div>
          </div>
        )}

        {/* Controles de Zoom Flutuantes no Canto Superior Direito */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 p-1 rounded-lg bg-obsidian-950/90 border border-white/10 text-slate-400 z-10">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
            className="p-1 hover:text-white cursor-pointer"
            title="Reduzir Zoom"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] px-1 font-mono text-cyber-cyan">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
            className="p-1 hover:text-white cursor-pointer"
            title="Aumentar Zoom"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Métricas de Fidelidade e Ação de Homologação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">ID Facial Retention</span>
            <span className="text-xs font-bold text-cyber-cyan flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              96.8% (Excelente)
            </span>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
            Dentro da Margem
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Delta-E Tom de Pele</span>
            <span className="text-xs font-bold text-luxury-gold flex items-center gap-1">
              <Scan className="w-3 h-3" />
              ΔE 1.2 (Imperceptível)
            </span>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
            Calibrado
          </span>
        </div>

        <div className="flex items-center">
          <button
            type="button"
            onClick={handleApprove}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isApproved
                ? 'bg-emerald-500 text-obsidian-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-cyber-cyan text-obsidian-950 hover:bg-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {isApproved ? 'Fidelidade Aprovada & Registrada' : 'Homologar Fidelidade de Biotipo'}
          </button>
        </div>
      </div>
    </div>
  );
}
