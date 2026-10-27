'use client';

import React, { useState } from 'react';
import { 
  compileTPosePrompt, 
  TPoseCompilerParams, 
  RiggingTarget 
} from '@/utils/tPoseCompiler';
import { toast } from '@/store/useToastStore';
import { 
  Accessibility, 
  Copy, 
  Check, 
  ShieldAlert, 
  Sparkles, 
  Layers, 
  Zap, 
  Bone,
  CheckCircle2
} from 'lucide-react';

interface TPoseCompilerPanelProps {
  characterName: string;
  physicalTraits: string;
  customClothing?: string;
  seed?: number;
  onGenerateClick?: (prompt: string) => void;
  isGenerating?: boolean;
}

export default function TPoseCompilerPanel({
  characterName,
  physicalTraits,
  customClothing,
  seed,
  onGenerateClick,
  isGenerating = false,
}: TPoseCompilerPanelProps) {
  const [clothingFit, setClothingFit] = useState<TPoseCompilerParams['clothingFit']>('fitted_rigging_attire');
  const [riggingTarget, setRiggingTarget] = useState<RiggingTarget>('v5_broadcaster_vtuber');
  const [background, setBackground] = useState<TPoseCompilerParams['background']>('neutral_gray');
  const [activeTab, setActiveTab] = useState<'prompt' | 'joints' | 'negative'>('prompt');
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const compiled = compileTPosePrompt({
    characterName,
    physicalTraits,
    clothingFit,
    customClothing,
    riggingTarget,
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
              Compilador Paramétrico de T-Pose Neutra (Rigging 90º)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan">
                {riggingTarget.toUpperCase().replace(/_/g, ' ')}
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              Anatomia calibrada com braços a 90º para rigging 2D/3D no V5 Broadcaster
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
            Prompt T-Pose
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('joints')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'joints'
                ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Articulações
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
            Anti-Deformação
          </button>
        </div>
      </div>

      {/* Configuration Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Clothing Fit */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 block font-bold">
            Vestimenta de Prova:
          </label>
          <select
            value={clothingFit}
            onChange={(e) => setClothingFit(e.target.value as TPoseCompilerParams['clothingFit'])}
            className="w-full bg-obsidian-950 border border-white/10 rounded-lg p-2 text-[11px] text-slate-200 focus:outline-none focus:border-cyber-cyan cursor-pointer"
          >
            <option value="fitted_rigging_attire">Traje Ajustado de Rigging</option>
            <option value="custom_character_attire">Roupas Padrão do Avatar</option>
            <option value="neutral_undergarment">Base Anatômica Neutra</option>
          </select>
        </div>

        {/* Rigging Target */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 block font-bold">
            Motor de Destino:
          </label>
          <select
            value={riggingTarget}
            onChange={(e) => setRiggingTarget(e.target.value as RiggingTarget)}
            className="w-full bg-obsidian-950 border border-white/10 rounded-lg p-2 text-[11px] text-slate-200 focus:outline-none focus:border-cyber-cyan cursor-pointer"
          >
            <option value="v5_broadcaster_vtuber">V5 Broadcaster (OBS VTuber)</option>
            <option value="blender_armature">Blender Armature</option>
            <option value="unreal_engine_5">Unreal Engine 5 Mannequin</option>
            <option value="mixamo">Mixamo Auto-Rigger</option>
          </select>
        </div>

        {/* Background Cyc */}
        <div className="space-y-1">
          <label className="text-[10px] text-slate-400 block font-bold">
            Fundo do Estúdio:
          </label>
          <select
            value={background}
            onChange={(e) => setBackground(e.target.value as TPoseCompilerParams['background'])}
            className="w-full bg-obsidian-950 border border-white/10 rounded-lg p-2 text-[11px] text-slate-200 focus:outline-none focus:border-cyber-cyan cursor-pointer"
          >
            <option value="neutral_gray">Cinza Neutro 18% (#808080)</option>
            <option value="pure_white">Branco Puro Infinito</option>
            <option value="chroma_green">Chroma Green Screen (#00FF00)</option>
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
              Palmas frontais, braços a 90º e pés paralelos garantidos
            </span>
            <button
              type="button"
              onClick={() => handleCopy(compiled.masterPrompt, 'Prompt T-Pose')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-cyan/15 hover:bg-cyber-cyan/25 text-cyber-cyan font-mono text-xs font-bold border border-cyber-cyan/30 transition-all cursor-pointer"
            >
              {copiedLabel === 'Prompt T-Pose' ? <Check className="w-3.5 h-3.5 text-cyber-cyan" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLabel === 'Prompt T-Pose' ? 'Copiado!' : 'Copiar Prompt T-Pose'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'joints' && (
        <div className="space-y-2">
          {compiled.jointDirectives.map((joint, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-obsidian-950/80 border border-white/5 flex items-center gap-2.5 text-xs"
            >
              <Bone className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
              <span className="text-slate-300 text-[11px] leading-relaxed">
                {joint}
              </span>
            </div>
          ))}
          <p className="text-[10px] text-slate-500 pt-1">
            * Compatibilidade: {compiled.riggingSpecs}
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
              Elimina braços caídos, punhos fechados e poses tortas
            </span>
            <button
              type="button"
              onClick={() => handleCopy(compiled.negativePrompt, 'Prompt Negativo T-Pose')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-mono text-xs font-bold border border-rose-500/30 transition-all cursor-pointer"
            >
              {copiedLabel === 'Prompt Negativo T-Pose' ? <Check className="w-3.5 h-3.5 text-rose-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLabel === 'Prompt Negativo T-Pose' ? 'Copiado!' : 'Copiar Negativo'}
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
            {isGenerating ? 'Forjando T-Pose no Cluster...' : 'Gerar T-Pose Neutra para Rigging'}
          </button>
        </div>
      )}
    </div>
  );
}
