'use client';

import React, { useState } from 'react';
import { 
  CANONICAL_LENSES, 
  FocalLengthMm, 
  ApertureFStop, 
  compileOpticalDirective 
} from '@/utils/virtualLensEngine';
import { toast } from '@/store/useToastStore';
import { 
  Aperture, 
  Focus, 
  Sparkles, 
  Copy, 
  Check, 
  Eye, 
  Camera,
  Layers
} from 'lucide-react';

interface VirtualLensSelectorProps {
  onLensChange?: (focalLength: FocalLengthMm, aperture: ApertureFStop, compiled: string) => void;
}

export default function VirtualLensSelector({
  onLensChange,
}: VirtualLensSelectorProps) {
  const [focalLength, setFocalLength] = useState<FocalLengthMm>(85);
  const [aperture, setAperture] = useState<ApertureFStop>('f/1.4');
  const [copied, setCopied] = useState(false);

  const activeLens = CANONICAL_LENSES[focalLength];
  const compiledDirective = compileOpticalDirective(focalLength, aperture);

  const handleFocalSelect = (fl: FocalLengthMm) => {
    setFocalLength(fl);
    const compiled = compileOpticalDirective(fl, aperture);
    if (onLensChange) onLensChange(fl, aperture, compiled);
  };

  const handleApertureSelect = (ap: ApertureFStop) => {
    setAperture(ap);
    const compiled = compileOpticalDirective(focalLength, ap);
    if (onLensChange) onLensChange(focalLength, ap, compiled);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledDirective);
    setCopied(true);
    toast.success('Óptica Copiada!', `${focalLength}mm ${aperture} pronta para difusão.`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20">
            <Aperture className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              Seletor de Lentes e Distâncias Focais Virtuais
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-luxury-gold/20 text-luxury-gold">
                {focalLength}mm · {aperture}
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              Calibração de compressão facial, ângulo de visão e desfoque óptico (Bokeh)
            </p>
          </div>
        </div>

        {/* Aperture F-Stop Selector Pills */}
        <div className="flex items-center gap-1 p-1 bg-obsidian-950 border border-white/10 rounded-xl text-[10px]">
          {(['f/1.2', 'f/1.4', 'f/1.8', 'f/2.0', 'f/2.8', 'f/4.0', 'f/8.0'] as ApertureFStop[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => handleApertureSelect(f)}
              className={`px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                aperture === f
                  ? 'bg-luxury-gold text-obsidian-950 shadow-glow-gold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Lens Focal Length Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {([24, 35, 50, 85, 135] as FocalLengthMm[]).map((fl) => {
          const item = CANONICAL_LENSES[fl];
          const isSelected = focalLength === fl;

          return (
            <button
              key={fl}
              type="button"
              onClick={() => handleFocalSelect(fl)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'border-luxury-gold bg-luxury-gold/15 ring-1 ring-luxury-gold shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'border-white/10 bg-obsidian-950/70 hover:border-white/25 hover:bg-white/5'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`text-base font-black tracking-tight ${isSelected ? 'text-luxury-gold' : 'text-slate-100'}`}>
                    {fl}mm
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    {item.fieldOfViewDeg}º FOV
                  </span>
                </div>

                <h5 className="text-[11px] font-bold text-slate-300 leading-tight">
                  {item.name.split(' (')[0].replace(/^\d+mm\s*/, '')}
                </h5>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 space-y-0.5 text-[9px] text-slate-500">
                <span className="text-luxury-gold/90 font-bold block truncate">
                  {item.facialCompression.split(' ')[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Optical Characteristics & Prompt Directive */}
      <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/5 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Focus className="w-3.5 h-3.5 text-luxury-gold" />
            <span className="text-slate-300 font-bold">
              Comportamento Óptico ({focalLength}mm):
            </span>
            <span className="text-[10px] text-luxury-gold font-bold bg-luxury-gold/10 px-2 py-0.5 rounded-full border border-luxury-gold/20">
              {activeLens.facialCompression}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-luxury-gold/15 hover:bg-luxury-gold/25 text-luxury-gold text-xs font-bold border border-luxury-gold/30 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado!' : 'Copiar Óptica'}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          {activeLens.distortionCharacter}.
        </p>

        {/* Prompt string snippet */}
        <p className="text-xs text-slate-200 leading-relaxed bg-obsidian-900/90 p-2.5 rounded-lg border border-white/5">
          {compiledDirective}
        </p>
      </div>
    </div>
  );
}
