'use client';

import React, { useState } from 'react';
import { 
  CANONICAL_FRAMING_SHOTS, 
  FramingShotScale, 
  AspectRatioTarget, 
  compileFramingPrompt 
} from '@/utils/cameraFramingMatrix';
import { toast } from '@/store/useToastStore';
import { 
  Camera, 
  Crop, 
  Sparkles, 
  Copy, 
  Check, 
  Layers, 
  Maximize2,
  Tv,
  Smartphone,
  Square
} from 'lucide-react';

interface CinematicFramingMatrixProps {
  onFramingSelect?: (compiledPrompt: string, scale: FramingShotScale, aspect: AspectRatioTarget) => void;
}

export default function CinematicFramingMatrix({
  onFramingSelect,
}: CinematicFramingMatrixProps) {
  const [selectedScale, setSelectedScale] = useState<FramingShotScale>('medium_bust');
  const [selectedAspect, setSelectedAspect] = useState<AspectRatioTarget>('9:16');
  const [copied, setCopied] = useState(false);

  const currentCompiled = compileFramingPrompt(selectedScale, selectedAspect);
  const activePreset = CANONICAL_FRAMING_SHOTS[selectedScale];

  const handleSelect = (scale: FramingShotScale) => {
    setSelectedScale(scale);
    const compiled = compileFramingPrompt(scale, selectedAspect);
    if (onFramingSelect) onFramingSelect(compiled, scale, selectedAspect);
  };

  const handleAspectChange = (aspect: AspectRatioTarget) => {
    setSelectedAspect(aspect);
    const compiled = compileFramingPrompt(selectedScale, aspect);
    if (onFramingSelect) onFramingSelect(compiled, selectedScale, aspect);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCompiled);
    setCopied(true);
    toast.success('Diretiva de Câmera Copiada!', `${activePreset.name} (--ar ${selectedAspect}) pronto.`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              Matriz de Enquadramentos Cinemáticos
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan">
                4 Escalas de Plano
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              Cortes padronizados para Shorts 9:16, YouTube 16:9 e Headshots
            </p>
          </div>
        </div>

        {/* Aspect Ratio Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-obsidian-950 border border-white/10 rounded-xl text-[10px]">
          <span className="text-slate-500 px-1.5">Formato:</span>
          {(['9:16', '16:9', '1:1', '4:5'] as AspectRatioTarget[]).map((ar) => (
            <button
              key={ar}
              type="button"
              onClick={() => handleAspectChange(ar)}
              className={`px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                selectedAspect === ar
                  ? 'bg-cyber-cyan text-obsidian-950 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {ar === '9:16' && <Smartphone className="w-3 h-3" />}
              {ar === '16:9' && <Tv className="w-3 h-3" />}
              {ar === '1:1' && <Square className="w-3 h-3" />}
              {ar}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Scale Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(CANONICAL_FRAMING_SHOTS) as FramingShotScale[]).map((key) => {
          const item = CANONICAL_FRAMING_SHOTS[key];
          const isSelected = selectedScale === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleSelect(key)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'border-cyber-cyan bg-cyber-cyan/15 ring-1 ring-cyber-cyan shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                  : 'border-white/10 bg-obsidian-950/70 hover:border-white/25 hover:bg-white/5'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 text-slate-400 uppercase">
                    {key.replace(/_/g, ' ')}
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-cyber-cyan text-obsidian-950 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <h5 className={`text-xs font-bold leading-tight ${isSelected ? 'text-cyber-cyan' : 'text-slate-200'}`}>
                  {item.name}
                </h5>

                <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">
                  {item.shortDesc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 space-y-0.5 text-[9px] text-slate-500">
                <div className="flex justify-between">
                  <span>Lente:</span>
                  <span className="text-slate-300 truncate">{item.recommendedLens.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span>DoF:</span>
                  <span className="text-luxury-gold truncate">{item.depthOfField.split(' ')[0]}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Compiled Prompt Preview & Copy */}
      <div className="p-3 rounded-xl bg-obsidian-950 border border-white/5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
            Diretiva de Enquadramento Injetada no Prompt:
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyber-cyan/15 hover:bg-cyber-cyan/25 text-cyber-cyan text-xs font-bold border border-cyber-cyan/30 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado!' : 'Copiar Diretiva'}
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-obsidian-900/90 p-2.5 rounded-lg border border-white/5">
          {currentCompiled}
        </p>

        {/* Destination Badges */}
        <div className="flex items-center gap-2 pt-1 flex-wrap text-[9px] text-slate-500">
          <span>Otimizado para:</span>
          {activePreset.bestForDestinations.map((dest, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/5">
              {dest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
