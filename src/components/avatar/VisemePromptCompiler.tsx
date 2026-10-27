'use client';

import React, { useState } from 'react';
import { VisemeType } from '@/types/avatar';
import {
  compileVisemePrompt,
  estimatePhraseVisemeSequence,
  DentalFinish,
  DENTAL_GUARDRAILS,
} from '@/utils/visemePromptCompiler';
import { CANONICAL_VISEMES_CATALOG } from '@/utils/visemesEngine';
import { toast } from '@/store/useToastStore';
import {
  Smile,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  Camera,
  Layers,
  Wand2,
  Volume2,
  FileText,
  CheckCircle2,
} from 'lucide-react';

interface VisemePromptCompilerProps {
  characterName?: string;
  onCompiled?: (positive: string, negative: string) => void;
}

export default function VisemePromptCompiler({
  characterName = 'Personagem Soberano',
  onCompiled,
}: VisemePromptCompilerProps) {
  const [visemeType, setVisemeType] = useState<VisemeType>('A_I');
  const [dentalFinish, setDentalFinish] = useState<DentalFinish>('natural_enamel');
  const [lipMoisture, setLipMoisture] = useState<'subtle_matte' | 'natural_sheen' | 'glossy_studio'>(
    'natural_sheen'
  );
  const [cameraAngle, setCameraAngle] = useState<'close_up_face' | 'macro_lips' | 'medium_portrait'>(
    'close_up_face'
  );
  const [testPhrase, setTestPhrase] = useState('Bem-vindos ao ecossistema soberano V5 Apollo Avatar');
  const [copiedPositive, setCopiedPositive] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);

  const { positivePrompt, negativePrompt, visemeMeta } = compileVisemePrompt({
    characterName,
    visemeType,
    dentalFinish,
    lipMoisture,
    cameraAngle,
  });

  const phraseSequence = estimatePhraseVisemeSequence(testPhrase);

  const handleCopyPositive = () => {
    navigator.clipboard.writeText(positivePrompt);
    setCopiedPositive(true);
    toast.success(
      'Prompt Positivo de Visema Copiado!',
      `Diretiva com fidelidade odontológica para "${visemeMeta.name}".`
    );
    setTimeout(() => setCopiedPositive(false), 2000);
  };

  const handleCopyNegative = () => {
    navigator.clipboard.writeText(negativePrompt);
    setCopiedNegative(true);
    toast.success(
      'Prompt Negativo Odontológico Copiado!',
      'Salvaguardas anti-alucinação de dentes e boca ativas.'
    );
    setTimeout(() => setCopiedNegative(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-5 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 shadow-glow-gold">
            <Smile className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Compilador de Prompts para Visemas & Realismo Dental
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30">
                Anti-Dentes Mutantes
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Geração de prompts cirúrgicos para articulação labial, cavidade oral e esmalte dental translúcido
            </p>
          </div>
        </div>

        {/* Viseme Pill Switcher */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-obsidian-950 border border-white/10 rounded-xl text-xs">
          {(Object.keys(CANONICAL_VISEMES_CATALOG) as VisemeType[]).map((vt) => (
            <button
              key={vt}
              type="button"
              onClick={() => setVisemeType(vt)}
              className={`px-2.5 py-1.2 rounded-lg font-bold transition-all cursor-pointer ${
                visemeType === vt
                  ? 'bg-luxury-gold text-obsidian-950 shadow-glow-gold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {vt}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Controles Parâmetros Odontológicos (Esquerda) e Prompts Compilados (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Coluna 1: Ajustes Odontológicos & Sequenciador de Frase (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Acabamento do Esmalte Dental */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 block">
              Acabamento Odontológico do Esmalte:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'natural_enamel', label: 'Esmalte Natural' },
                { id: 'hollywood_bright', label: 'Branco Hollywood' },
                { id: 'warm_realistic', label: 'Orgânico Quente' },
              ].map((df) => (
                <button
                  key={df.id}
                  type="button"
                  onClick={() => setDentalFinish(df.id as DentalFinish)}
                  className={`py-2 px-2 rounded-xl border text-center font-bold text-[10px] transition-all cursor-pointer ${
                    dentalFinish === df.id
                      ? 'border-luxury-gold bg-luxury-gold/15 text-luxury-gold shadow-glow-gold'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {df.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hidratação dos Lábios */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 block">
              Hidratação / Brilho dos Lábios:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { id: 'subtle_matte', label: 'Fosco Calmo' },
                { id: 'natural_sheen', label: 'Brilho Natural' },
                { id: 'glossy_studio', label: 'Gloss de Estúdio' },
              ].map((lm) => (
                <button
                  key={lm.id}
                  type="button"
                  onClick={() => setLipMoisture(lm.id as any)}
                  className={`py-2 px-2 rounded-xl border text-center font-bold text-[10px] transition-all cursor-pointer ${
                    lipMoisture === lm.id
                      ? 'border-cyber-cyan bg-cyber-cyan/15 text-cyber-cyan'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sequenciador Heurístico de Frase para Visemas */}
          <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5 text-cyber-cyan">
                <Wand2 className="w-3.5 h-3.5" />
                Sequenciador de Fala → Visemas
              </span>
              <span className="text-[9px] text-slate-500">Estimativa Fonética</span>
            </div>

            <input
              type="text"
              value={testPhrase}
              onChange={(e) => setTestPhrase(e.target.value)}
              placeholder="Digite uma frase falada..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyber-cyan font-sans"
            />

            {/* Chips de Visemas gerados da frase */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {phraseSequence.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setVisemeType(item.viseme)}
                  className={`px-2 py-1 rounded-md text-[10px] border flex items-center gap-1 transition-colors cursor-pointer ${
                    visemeType === item.viseme
                      ? 'border-luxury-gold bg-luxury-gold/20 text-luxury-gold font-bold'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-sans font-medium text-slate-300">{item.word}</span>
                  <span className="text-cyber-cyan font-mono font-bold text-[9px]">
                    [{item.viseme}]
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna 2: Prompts Positivo e Negativo Compilados (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Prompt Positivo */}
          <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyber-cyan flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Prompt Positivo de Visema (Com Realismo Dental)
              </span>
              <button
                type="button"
                onClick={handleCopyPositive}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyber-cyan text-obsidian-950 font-bold text-xs hover:bg-cyan-300 transition-colors cursor-pointer shadow-[0_0_10px_rgba(0,229,255,0.3)]"
              >
                {copiedPositive ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedPositive ? 'Copiado!' : 'Copiar Positivo'}
              </button>
            </div>
            <p className="text-[11px] text-slate-300 bg-white/[0.02] p-3 rounded-lg border border-white/5 leading-relaxed font-sans">
              "{positivePrompt}"
            </p>
          </div>

          {/* Salvaguardas Odontológicas Negativas */}
          <div className="p-4 rounded-xl bg-obsidian-950 border border-red-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Prompt Negativo Odontológico (Anti-Dentes Mutantes)
              </span>
              <button
                type="button"
                onClick={handleCopyNegative}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 text-slate-200 border border-white/15 hover:bg-white/15 font-bold text-xs transition-colors cursor-pointer"
              >
                {copiedNegative ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedNegative ? 'Copiado!' : 'Copiar Negativo'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 bg-red-500/[0.03] p-3 rounded-lg border border-red-500/10 leading-relaxed font-sans">
              "{negativePrompt}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
