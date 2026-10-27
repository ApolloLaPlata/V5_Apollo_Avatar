'use client';

import React, { useState } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import { 
  Crosshair, 
  Sliders, 
  Check, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle,
  Sparkles,
  MoveVertical
} from 'lucide-react';

interface EyeLevelCalibrationToolProps {
  currentOffset?: number; // percentage 10% to 50% from top
  onOffsetChange?: (offset: number) => void;
}

export default function EyeLevelCalibrationTool({
  currentOffset = 25,
  onOffsetChange,
}: EyeLevelCalibrationToolProps) {
  const { avatars, selectedAvatarId, updateAvatar } = useAvatarStore();
  const selectedAvatar = avatars.find((a) => a.id === selectedAvatarId);

  const initialVal = selectedAvatar?.face.eyeLevelOffset || currentOffset;
  const [offsetPercent, setOffsetPercent] = useState<number>(initialVal);
  const [headRatio, setHeadRatio] = useState<number>(7.5); // standard 7.5 heads high
  const [isCalibrated, setIsCalibrated] = useState(false);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setOffsetPercent(val);
    if (onOffsetChange) onOffsetChange(val);
    setIsCalibrated(false);
  };

  const handleSaveCalibration = () => {
    if (selectedAvatar) {
      updateAvatar(selectedAvatar.id, {
        face: {
          ...selectedAvatar.face,
          eyeLevelOffset: offsetPercent,
        },
      });
      setIsCalibrated(true);
      toast.success(
        'Calibração Salva!',
        `Linha dos olhos fixada em ${offsetPercent.toFixed(1)}% com proporção ${headRatio} cabeças.`
      );
    }
  };

  const handleReset = () => {
    setOffsetPercent(25);
    setHeadRatio(7.5);
    if (onOffsetChange) onOffsetChange(25);
    setIsCalibrated(false);
    toast.info('Calibração Redefinida', 'Valores de horizonte retornaram ao padrão de estúdio.');
  };

  return (
    <div className="p-4 rounded-xl bg-obsidian-950/90 border border-cyber-cyan/30 shadow-[0_0_15px_rgba(0,229,255,0.1)] space-y-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-cyber-cyan animate-spin-slow" />
          <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Calibrador de Linha dos Olhos (Eye-Level Laser)
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-cyber-cyan/15 text-cyber-cyan text-[10px] font-bold border border-cyber-cyan/30">
          Horizonte: {offsetPercent.toFixed(1)}%
        </span>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        Ajuste a mira a laser horizontal para travar o nível exato das pupilas nos 4 ângulos simultaneamente, evitando desníveis em renderizações 360º.
      </p>

      {/* Interactive Controls Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Eye Level Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span className="flex items-center gap-1">
              <MoveVertical className="w-3 h-3 text-cyber-cyan" /> Altura dos Olhos:
            </span>
            <strong className="text-cyber-cyan">{offsetPercent}%</strong>
          </div>
          <input
            type="range"
            min="10"
            max="45"
            step="0.5"
            value={offsetPercent}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-obsidian-850 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
          />
          <div className="flex justify-between text-[9px] text-slate-500">
            <span>10% (Topo Rosto)</span>
            <span>25% (Padrão Áureo)</span>
            <span>45% (Plano Busto)</span>
          </div>
        </div>

        {/* Head Proportion Canon */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span>Cânone Anatômico:</span>
            <strong className="text-luxury-gold">{headRatio} Cabeças</strong>
          </div>
          <div className="flex items-center gap-2">
            {[7, 7.5, 8].map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => setHeadRatio(ratio)}
                className={`flex-1 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                  headRatio === ratio
                    ? 'bg-luxury-gold/20 text-luxury-gold border-luxury-gold/40'
                    : 'bg-obsidian-900 text-slate-400 border-white/10 hover:text-slate-200'
                }`}
              >
                {ratio === 7 ? '7 (Heroico)' : ratio === 7.5 ? '7.5 (Realista)' : '8 (Editorial)'}
              </button>
            ))}
          </div>
          <span className="text-[9px] text-slate-500 block">
            Escala fotográfica proporcional de corpo inteiro
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
        <button
          type="button"
          onClick={handleReset}
          className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" /> Restaurar 25%
        </button>

        <button
          type="button"
          onClick={handleSaveCalibration}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            isCalibrated
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-cyber-cyan text-obsidian-950 hover:bg-cyan-300 shadow-glow-cyan'
          }`}
        >
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          {isCalibrated ? 'Calibração Gravada!' : 'Gravar Calibração no DNA'}
        </button>
      </div>
    </div>
  );
}
