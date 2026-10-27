'use client';

import React, { useState } from 'react';
import { 
  compileAPosePrompt, 
  APoseCompilerParams, 
  GarmentDrapeStyle 
} from '@/utils/aPoseCompiler';
import { toast } from '@/store/useToastStore';
import { 
  Accessibility, 
  Copy, 
  Check, 
  ShieldAlert, 
  Sparkles, 
  Wind, 
  Zap, 
  Layers,
  Shirt
} from 'lucide-react';

interface APoseCompilerPanelProps {
  characterName: string;
  physicalTraits: string;
  customClothing?: string;
  seed?: number;
  onGenerateClick?: (prompt: string) => void;
  isGenerating?: boolean;
}

export default function APoseCompilerPanel({
  characterName,
  physicalTraits,
  customClothing,
  seed,
  onGenerateClick,
  isGenerating = false,
}: APoseCompilerPanelProps) {
  const [drapeStyle, setDrapeStyle] = useState<GarmentDrapeStyle>('natural_streetwear');
  const [armAngle, setArmAngle] = useState<45 | 35 | 50>(45);
  const [background, setBackground] = useState<APoseCompilerParams['background']>('neutral_gray');
  const [activeTab, setActiveTab] = useState<'prompt' | 'drape' | 'negative'>('prompt');
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const compiled = compileAPosePrompt({
    characterName,
    physicalTraits,
    customClothing,
    drapeStyle,
    armAngle,
    background,
    seed,
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    toast.success('Prompt Copiado!', `${label} pronto para colagem.`);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20">
            <Accessibility className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              Compilador Paramétrico de A-Pose ({armAngle}º Caimento)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan">
                Drape Engine
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              Braços a {armAngle}º para caimento orgânico de tecidos sem tensão nas axilas
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 bg-obsidian-950 border border-white/10 rounded-xl text-[10px]">
          <button
            type="button"
            onClick={() => setActiveTab('prompt')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'prompt'
                ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Prompt A-Pose
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('drape')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'drape'
                ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Física Tecidos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('negative')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'negative'
                ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Anti-Tensão
          </button>
        </div>
      </div>

      {/* Configuration Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Drape Style */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 block font-bold">
            Estilo de Caimento:
          </label>
          <select
            value={drapeStyle}
            onChange={(e) => setDrapeStyle(e.target.value as GarmentDrapeStyle)}
            className="w-full bg-obsidian-950 border border-white/10 rounded-lg p-2 text-[11px] text-slate-200 focus:outline-none focus:border-cyber-cyan cursor-pointer"
          >
            <option value="natural_streetwear">Streetwear & Moletom Natural</option>
            <option value="heavy_coat_tailoring">Alfaiataria / Sobretudo Pesado</option>
            <option value="flowing_lightweight">Tecido Leve & Fluido</option>
            <option value="tactical_structured">Tático Estruturado / Cordura</option>
          </select>
        </div>

        {/* Arm Angle */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 block font-bold">
            Ângulo dos Braços:
          </label>
          <div className="flex items-center gap-1.5 pt-0.5">
            {[35, 45, 50].map((deg) => (
              <button
                key={deg}
                type="button"
                onClick={() => setArmAngle(deg as any)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  armAngle === deg
                    ? 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/40'
                    : 'bg-obsidian-950 text-slate-400 border-white/10 hover:text-slate-200'
                }`}
              >
                {deg}º
              </button>
            ))}
          </div>
        </div>

        {/* Background Cyc */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 block font-bold">
            Fundo do Estúdio:
          </label>
          <select
            value={background}
            onChange={(e) => setBackground(e.target.value as any)}
            className="w-full bg-obsidian-950 border border-white/10 rounded-lg p-2 text-[11px] text-slate-200 focus:outline-none focus:border-cyber-cyan cursor-pointer"
          >
            <option value="neutral_gray">Cinza Neutro 18% (#808080)</option>
            <option value="pure_white">Branco Puro Infinito</option>
            <option value="dark_studio">Charcoal Studio Escuro</option>
          </select>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'prompt' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/5 text-xs text-slate-200 leading-relaxed max-h-40 overflow-y-auto">
            {compiled.masterPrompt}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyber-cyan" />
              Gravidade realista e rugas naturais preservadas
            </span>
            <button
              type="button"
              onClick={() => handleCopy(compiled.masterPrompt, 'Prompt A-Pose')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-cyan/15 hover:bg-cyber-cyan/25 text-cyber-cyan font-mono text-xs font-bold border border-cyber-cyan/30 transition-all cursor-pointer"
            >
              {copiedLabel === 'Prompt A-Pose' ? <Check className="w-3.5 h-3.5 text-cyber-cyan" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLabel === 'Prompt A-Pose' ? 'Copiado!' : 'Copiar Prompt A-Pose'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'drape' && (
        <div className="space-y-2">
          {compiled.drapeDirectives.map((drape, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-obsidian-950/80 border border-white/5 flex items-center gap-2.5 text-xs"
            >
              <Wind className="w-3.5 h-3.5 text-cyber-cyan shrink-0" />
              <span className="text-slate-300 text-[11px] leading-relaxed">
                {drape}
              </span>
            </div>
          ))}
          <p className="text-[10px] text-slate-500 pt-1">
            * {compiled.anatomicalSpecs}
          </p>
        </div>
      )}

      {activeTab === 'negative' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-obsidian-950 border border-rose-500/20 text-xs text-rose-300 leading-relaxed">
            {compiled.negativePrompt}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-rose-400/80 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              Elimina braços colados no tronco, tecidos tensionados e poses de ação
            </span>
            <button
              type="button"
              onClick={() => handleCopy(compiled.negativePrompt, 'Prompt Negativo A-Pose')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-mono text-xs font-bold border border-rose-500/30 transition-all cursor-pointer"
            >
              {copiedLabel === 'Prompt Negativo A-Pose' ? <Check className="w-3.5 h-3.5 text-rose-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLabel === 'Prompt Negativo A-Pose' ? 'Copiado!' : 'Copiar Negativo'}
            </button>
          </div>
        </div>
      )}

      {/* Generator Trigger */}
      {onGenerateClick && (
        <div className="pt-2 border-t border-white/5">
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => onGenerateClick(compiled.masterPrompt)}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-xs shadow-glow-cyan transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 fill-obsidian-950" />
            {isGenerating ? 'Renderizando A-Pose...' : `Gerar A-Pose (${armAngle}º) para Roupas Soltas`}
          </button>
        </div>
      )}
    </div>
  );
}
