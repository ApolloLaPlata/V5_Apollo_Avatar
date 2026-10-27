'use client';

import React, { useState } from 'react';
import EyeLevelCalibrationTool from '@/components/avatar/EyeLevelCalibrationTool';
import { 
  ScanEye, 
  Eye, 
  EyeOff, 
  Maximize2, 
  ZoomIn, 
  Layers, 
  Sparkles, 
  Grid,
  CheckCircle2,
  Sliders,
  Crosshair
} from 'lucide-react';

interface AngleViewConfig {
  id: string;
  label: string;
  angleDeg: number;
  description: string;
  sampleCropOffset: string; // for css background-position in preview
}

const CANONICAL_ANGLES: AngleViewConfig[] = [
  { id: 'front', label: 'Frontal', angleDeg: 0, description: 'Rosto neutro frontal direto no nível dos olhos', sampleCropOffset: '0% center' },
  { id: 'three_quarter', label: '3/4 Esquerda', angleDeg: 45, description: 'Rotação a 45º exibindo maçã do rosto e queixo', sampleCropOffset: '33% center' },
  { id: 'profile', label: 'Perfil Lateral', angleDeg: 90, description: 'Silhueta pura a 90º com linha do nariz e orelha', sampleCropOffset: '66% center' },
  { id: 'back', label: 'Costas', angleDeg: 180, description: 'Vista traseira a 180º com caimento de cabelo e roupas', sampleCropOffset: '100% center' },
];

interface TurnaroundGridViewerProps {
  sheetImageUrl?: string | null;
  characterName?: string;
}

export default function TurnaroundGridViewer({
  sheetImageUrl,
  characterName = 'Personagem Ativo',
}: TurnaroundGridViewerProps) {
  const [showRulers, setShowRulers] = useState(true);
  const [showSymmetry, setShowSymmetry] = useState(true);
  const [showCalibrator, setShowCalibrator] = useState(false);
  const [eyeLevelOffset, setEyeLevelOffset] = useState<number>(25);
  const [selectedAngle, setSelectedAngle] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // High quality default fallback turnaround demo if no image is uploaded
  const activeImage = sheetImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20">
            <ScanEye className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              Visualizador Grid 4 Ângulos 360º
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan">
                4 x 90º Rig
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              Inspeção anatômica de réguas e linha de horizonte unificada
            </p>
          </div>
        </div>

        {/* Toggle Controls for Guidelines */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRulers(!showRulers)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
              showRulers
                ? 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/30'
                : 'bg-obsidian-950 text-slate-400 border-white/10 hover:text-slate-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Réguas {showRulers ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSymmetry(!showSymmetry)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
              showSymmetry
                ? 'bg-luxury-gold/15 text-luxury-gold border-luxury-gold/30'
                : 'bg-obsidian-950 text-slate-400 border-white/10 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simetria {showSymmetry ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCalibrator(!showCalibrator)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
              showCalibrator
                ? 'bg-cyber-cyan text-obsidian-950 font-bold shadow-glow-cyan'
                : 'bg-obsidian-950 text-slate-400 border-white/10 hover:text-slate-200'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Calibrar Linha dos Olhos</span>
          </button>
        </div>
      </div>

      {/* Expandable Eye Level Calibration Tool */}
      {showCalibrator && (
        <EyeLevelCalibrationTool
          currentOffset={eyeLevelOffset}
          onOffsetChange={setEyeLevelOffset}
        />
      )}

      {/* 4 Viewports Grid with Shared Horizontal Anatomical Rulers */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-obsidian-950 p-2">
        {/* Anatomical Ruler Lines (Absolute Across All 4 Viewports) */}
        {showRulers && (
          <div className="absolute inset-x-0 inset-y-2 pointer-events-none z-20 flex flex-col justify-between py-6 opacity-85">
            {/* Dynamic Laser Eye-level Line */}
            <div 
              className="absolute inset-x-0 border-b-2 border-cyber-cyan flex items-center justify-between px-3 shadow-[0_0_12px_rgba(0,229,255,0.7)] transition-all duration-100"
              style={{ top: `${eyeLevelOffset}%` }}
            >
              <span className="text-[9px] font-mono text-cyber-cyan bg-obsidian-950/90 px-1 rounded shadow border border-cyber-cyan/30">
                MIRA LASER DOS OLHOS ({eyeLevelOffset.toFixed(1)}%)
              </span>
              <span className="text-[9px] font-mono text-cyber-cyan bg-obsidian-950/90 px-1 rounded shadow border border-cyber-cyan/30">
                Horizonte Travado
              </span>
            </div>

            {/* Nose Tip Line */}
            <div className="relative w-full border-b border-cyber-cyan/25 flex items-center justify-start px-3">
              <span className="text-[8px] font-mono text-cyber-cyan/70 bg-obsidian-950/90 px-1 rounded">
                Pontas Nariz / Orelha (-0.25)
              </span>
            </div>

            {/* Jaw / Chin Line */}
            <div className="relative w-full border-b border-luxury-gold/40 flex items-center justify-start px-3">
              <span className="text-[8px] font-mono text-luxury-gold bg-obsidian-950/90 px-1 rounded">
                Queixo / Mandíbula (-0.50)
              </span>
            </div>

            {/* Shoulder Line */}
            <div className="relative w-full border-b border-emerald-500/35 flex items-center justify-start px-3">
              <span className="text-[8px] font-mono text-emerald-400 bg-obsidian-950/90 px-1 rounded">
                Linha Clavícula / Ombros (-1.0)
              </span>
            </div>
          </div>
        )}

        {/* The 4 Angle Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 relative z-10">
          {CANONICAL_ANGLES.map((angle) => {
            const isSelected = selectedAngle === angle.id;

            return (
              <div
                key={angle.id}
                onClick={() => setSelectedAngle(isSelected ? null : angle.id)}
                className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer bg-obsidian-900 ${
                  isSelected
                    ? 'border-cyber-cyan ring-2 ring-cyber-cyan/50 shadow-glow-cyan'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                {/* Image Viewport */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-obsidian-950 flex items-center justify-center">
                  <img
                    src={activeImage}
                    alt={angle.label}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{
                      filter: angle.id === 'back' ? 'brightness(0.85) contrast(1.1)' : undefined,
                    }}
                  />

                  {/* Symmetry Vertical Center Guide */}
                  {showSymmetry && (
                    <div className="absolute inset-y-0 left-1/2 w-px bg-luxury-gold/50 pointer-events-none shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  )}

                  {/* Top Angle Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-obsidian-950/90 border border-white/10 text-[9px] font-mono font-bold text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
                    {angle.label} ({angle.angleDeg}º)
                  </div>
                </div>

                {/* Bottom Panel Description */}
                <div className="p-2.5 bg-obsidian-950/90 border-t border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold text-slate-200">{angle.label}</span>
                    <span className="text-cyber-cyan">{angle.angleDeg}º Offset</span>
                  </div>
                  <p className="text-[9px] text-slate-400 line-clamp-1">
                    {angle.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Status */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Alinhamento horizontal unificado garantido pela Holding V5 Apollo
        </span>
        <span>Resolução Sugerida: 4096 x 1024 px (1:4)</span>
      </div>
    </div>
  );
}
