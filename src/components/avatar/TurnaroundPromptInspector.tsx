'use client';

import React, { useState } from 'react';
import { compileTurnaroundPrompt, TurnaroundCompilerParams } from '@/utils/turnaroundCompiler';
import { toast } from '@/store/useToastStore';
import { 
  Film, 
  Copy, 
  Check, 
  ShieldAlert, 
  Sliders, 
  Eye, 
  Sparkles, 
  Layers, 
  Zap,
  Info
} from 'lucide-react';

interface TurnaroundPromptInspectorProps {
  params: TurnaroundCompilerParams;
  onGenerateClick?: () => void;
  isGenerating?: boolean;
}

export default function TurnaroundPromptInspector({
  params,
  onGenerateClick,
  isGenerating = false,
}: TurnaroundPromptInspectorProps) {
  const [activeTab, setActiveTab] = useState<'master' | 'negative' | 'angles'>('master');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const compiled = compileTurnaroundPrompt(params);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(label);
    toast.success('Prompt Copiado!', `${label} transferido para a área de transferência.`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
      {/* Header with Title and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              Compilador de Prompt Turnaround 360º
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan">
                ~{compiled.tokenCountEstimate} tokens
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              Fórmula de estúdio para 4 ângulos perfeitos (Frontal, 3/4, Perfil, Costas)
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 bg-obsidian-950 border border-white/10 rounded-xl text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('master')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'master'
                ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Prompt Mestre
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('angles')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'angles'
                ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4 Ângulos
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
            Guardrails Negativos
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'master' && (
        <div className="space-y-3">
          <div className="relative p-3.5 rounded-xl bg-obsidian-950 border border-white/5 font-mono text-xs text-slate-200 leading-relaxed max-h-48 overflow-y-auto">
            {compiled.masterPrompt}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyber-cyan" />
              Trava de vestimenta e iluminação embutida
            </span>
            <button
              type="button"
              onClick={() => handleCopy(compiled.masterPrompt, 'Prompt Mestre 360º')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-cyan/15 hover:bg-cyber-cyan/25 text-cyber-cyan font-mono text-xs font-bold border border-cyber-cyan/30 transition-all cursor-pointer"
            >
              {copiedType === 'Prompt Mestre 360º' ? <Check className="w-3.5 h-3.5 text-cyber-cyan" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedType === 'Prompt Mestre 360º' ? 'Copiado!' : 'Copiar Prompt Mestre'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'angles' && (
        <div className="space-y-2">
          {Object.entries(compiled.angleDirectives).map(([key, text], idx) => (
            <div
              key={key}
              className="p-2.5 rounded-xl bg-obsidian-950/80 border border-white/5 flex items-start gap-2.5 text-xs font-mono"
            >
              <span className="px-1.5 py-0.5 rounded bg-cyber-cyan/10 text-cyber-cyan font-bold text-[10px] shrink-0 border border-cyber-cyan/20">
                0{idx + 1}
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px] flex-1">
                {text}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'negative' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-obsidian-950 border border-rose-500/20 font-mono text-xs text-rose-300 leading-relaxed">
            {compiled.negativePrompt}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-rose-400/80 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              Bloqueia deformações, roupas trocadas e dedos corrompidos
            </span>
            <button
              type="button"
              onClick={() => handleCopy(compiled.negativePrompt, 'Prompt Negativo')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-mono text-xs font-bold border border-rose-500/30 transition-all cursor-pointer"
            >
              {copiedType === 'Prompt Negativo' ? <Check className="w-3.5 h-3.5 text-rose-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedType === 'Prompt Negativo' ? 'Copiado!' : 'Copiar Negativo'}
            </button>
          </div>
        </div>
      )}

      {/* Generator Action Button */}
      {onGenerateClick && (
        <div className="pt-2 border-t border-white/5">
          <button
            type="button"
            disabled={isGenerating}
            onClick={onGenerateClick}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-xs shadow-glow-cyan transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 fill-obsidian-950" />
            {isGenerating ? 'Enviando Ordem para Difusão H100...' : 'Disparar Geração 360º via API'}
          </button>
        </div>
      )}
    </div>
  );
}
