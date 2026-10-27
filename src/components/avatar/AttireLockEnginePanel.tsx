'use client';

import React, { useState } from 'react';
import { 
  AttireLockSpec, 
  CANONICAL_ATTIRE_PRESETS, 
  compileAttireLockPrompt 
} from '@/utils/attireLockEngine';
import { toast } from '@/store/useToastStore';
import { 
  Shirt, 
  Lock, 
  Sparkles, 
  Palette, 
  Check, 
  ShieldCheck, 
  Layers, 
  Sliders 
} from 'lucide-react';

interface AttireLockEnginePanelProps {
  initialSpec?: AttireLockSpec;
  onChange?: (compiledPrompt: string, spec: AttireLockSpec) => void;
}

export default function AttireLockEnginePanel({
  initialSpec,
  onChange,
}: AttireLockEnginePanelProps) {
  const [spec, setSpec] = useState<AttireLockSpec>(
    initialSpec || CANONICAL_ATTIRE_PRESETS.techwear_cyber
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const updateSpec = (updates: Partial<AttireLockSpec>) => {
    const updated = { ...spec, ...updates };
    setSpec(updated);
    const compiled = compileAttireLockPrompt(updated);
    if (onChange) onChange(compiled, updated);
  };

  const loadPreset = (presetKey: string) => {
    const target = CANONICAL_ATTIRE_PRESETS[presetKey];
    if (target) {
      setSpec(target);
      const compiled = compileAttireLockPrompt(target);
      if (onChange) onChange(compiled, target);
      toast.success('Preset de Vestimenta Aplicado', `Look "${presetKey}" carregado com trava de cor.`);
    }
  };

  const currentCompiled = compileAttireLockPrompt(spec);

  return (
    <div className="p-4 rounded-xl bg-obsidian-950/80 border border-white/10 space-y-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shirt className="w-4 h-4 text-cyber-cyan" />
          <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Motor de Trava de Vestimenta (Attire Lock Engine)
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] text-cyber-cyan hover:underline cursor-pointer flex items-center gap-1"
        >
          <Sliders className="w-3 h-3" />
          {isExpanded ? 'Recolher Painel' : 'Personalizar Trava'}
        </button>
      </div>

      {/* Preset Fast Picker */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] text-slate-500">Presets de Figurino:</span>
        <button
          type="button"
          onClick={() => loadPreset('techwear_cyber')}
          className="px-2.5 py-1 rounded-lg bg-cyber-cyan/15 hover:bg-cyber-cyan/25 text-cyber-cyan text-[10px] font-bold border border-cyber-cyan/30 transition-colors cursor-pointer"
        >
          Techwear Cyber
        </button>
        <button
          type="button"
          onClick={() => loadPreset('classic_tailoring')}
          className="px-2.5 py-1 rounded-lg bg-luxury-gold/15 hover:bg-luxury-gold/25 text-luxury-gold text-[10px] font-bold border border-luxury-gold/30 transition-colors cursor-pointer"
        >
          Alfaiataria Sábia
        </button>
        <button
          type="button"
          onClick={() => loadPreset('casual_minimalist')}
          className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 transition-colors cursor-pointer"
        >
          Casual Linho UGC
        </button>
      </div>

      {/* Palette Color Swatches */}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-[10px] text-slate-500 flex items-center gap-1">
          <Palette className="w-3 h-3" /> Paleta Travada:
        </span>
        <div className="flex items-center gap-2">
          {spec.palette.map((color, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-obsidian-900 border border-white/10 text-[9px] text-slate-300"
              title={`${color.name}: ${color.hex}`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              <span>{color.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Form (Expandable) */}
      {isExpanded && (
        <div className="pt-3 border-t border-white/5 space-y-3 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                Parte Superior (Top Garment & Tecido):
              </label>
              <input
                type="text"
                value={spec.topGarment}
                onChange={(e) => updateSpec({ topGarment: e.target.value })}
                className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyber-cyan text-[11px]"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                Parte Inferior (Bottom Garment):
              </label>
              <input
                type="text"
                value={spec.bottomGarment}
                onChange={(e) => updateSpec({ bottomGarment: e.target.value })}
                className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyber-cyan text-[11px]"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                Calçados (Footwear):
              </label>
              <input
                type="text"
                value={spec.footwear}
                onChange={(e) => updateSpec({ footwear: e.target.value })}
                className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyber-cyan text-[11px]"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                Rigidez da Trava no Modelo:
              </label>
              <select
                value={spec.lockStrength}
                onChange={(e) => updateSpec({ lockStrength: e.target.value as AttireLockSpec['lockStrength'] })}
                className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyber-cyan text-[11px]"
              >
                <option value="flexible">Flexível (1.0x)</option>
                <option value="strict">Estrita (1.2x - Recomendado)</option>
                <option value="maximum">Máxima (1.35x - Trava Absoluta)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Compiled Lock Token Preview */}
      <div className="p-2.5 rounded-lg bg-obsidian-900/90 border border-white/5 flex items-start gap-2 text-[10px] text-slate-300">
        <Lock className="w-3.5 h-3.5 text-cyber-cyan shrink-0 mt-0.5" />
        <span className="leading-relaxed line-clamp-2">
          {currentCompiled}
        </span>
      </div>
    </div>
  );
}
