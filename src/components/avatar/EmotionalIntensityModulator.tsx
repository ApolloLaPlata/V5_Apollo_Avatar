'use client';

import React, { useState } from 'react';
import {
  ModulatedEmotionId,
  MODULATED_EMOTION_BASES,
  getIntensityTier,
  compileModulatedIntensityPrompt,
} from '@/utils/emotionalIntensityEngine';
import { toast } from '@/store/useToastStore';
import {
  Sliders,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  Smile,
  Zap,
  Activity,
  Gauge,
  Flame,
} from 'lucide-react';

interface EmotionalIntensityModulatorProps {
  characterName?: string;
  onIntensityChange?: (emotionId: ModulatedEmotionId, percent: number, prompt: string) => void;
}

export default function EmotionalIntensityModulator({
  characterName = 'Personagem Soberano',
  onIntensityChange,
}: EmotionalIntensityModulatorProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<ModulatedEmotionId>('smile');
  const [intensity, setIntensity] = useState<number>(65);
  const [copied, setCopied] = useState(false);

  const tier = getIntensityTier(intensity);
  const { positivePrompt, negativePrompt } = compileModulatedIntensityPrompt(
    selectedEmotion,
    characterName,
    intensity
  );

  const handleSliderChange = (val: number) => {
    setIntensity(val);
    const compiled = compileModulatedIntensityPrompt(selectedEmotion, characterName, val);
    if (onIntensityChange) {
      onIntensityChange(selectedEmotion, val, compiled.positivePrompt);
    }
  };

  const handleEmotionSelect = (id: ModulatedEmotionId) => {
    setSelectedEmotion(id);
    const compiled = compileModulatedIntensityPrompt(id, characterName, intensity);
    if (onIntensityChange) {
      onIntensityChange(id, intensity, compiled.positivePrompt);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(positivePrompt);
    setCopied(true);
    toast.success(
      'Prompt Modulado Copiado!',
      `${intensity}% de expressividade (${tier.tierName} com peso ${tier.weightMultiplier}x).`
    );
    setTimeout(() => setCopied(false), 2000);
  };

  // Cálculo paramétrico do arco da boca e sobrancelhas no SVG
  const smileFactor = (intensity / 100) * 20; // 2 a 20 px de curva
  const browShift = selectedEmotion === 'curiosity' ? -8 : (intensity / 100) * 4;

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-5 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 shadow-glow-gold">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Slider de Intensidade Emocional (Modulador 10% - 100%)
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold border"
                style={{
                  backgroundColor: `${tier.colorToken}20`,
                  color: tier.colorToken,
                  borderColor: `${tier.colorToken}40`,
                }}
              >
                {tier.tierName}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Controle de dosagem de atenção (0.25x a 1.40x) para evitar caricaturas ou rigidez artificial
            </p>
          </div>
        </div>

        {/* Emoção Selector Pills */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-obsidian-950 border border-white/10 rounded-xl text-xs">
          {(Object.keys(MODULATED_EMOTION_BASES) as ModulatedEmotionId[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => handleEmotionSelect(id)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                selectedEmotion === id
                  ? 'bg-luxury-gold text-obsidian-950 shadow-glow-gold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {MODULATED_EMOTION_BASES[id].name.split('&')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Controles de Slider e Morphing Visual (Esquerda / 5 cols) & Prompt Compilado (Direita / 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Coluna 1: Slider Interativo & Simulador de Expressão (5 cols) */}
        <div className="lg:col-span-5 bg-obsidian-950 p-4 rounded-xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyber-cyan" />
              Nível de Expressividade
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className="text-sm font-extrabold font-mono"
                style={{ color: tier.colorToken }}
              >
                {intensity}%
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                ({tier.weightMultiplier}x)
              </span>
            </div>
          </div>

          {/* Slider Principal com visual Dark Luxury */}
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={intensity}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-luxury-gold bg-white/10"
          />

          {/* Presets Rápidos */}
          <div className="grid grid-cols-4 gap-1.5 text-center text-[9px] font-bold">
            {[
              { val: 20, label: '20% Sutil' },
              { val: 45, label: '45% Natural' },
              { val: 75, label: '75% Marcante' },
              { val: 100, label: '100% Clímax' },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => handleSliderChange(p.val)}
                className={`py-1.5 rounded-lg border transition-all cursor-pointer ${
                  intensity === p.val
                    ? 'border-luxury-gold bg-luxury-gold/20 text-luxury-gold shadow-glow-gold'
                    : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Visualizador de Morfologia Facial SVG */}
          <div className="p-3 rounded-lg bg-black/60 border border-white/5 flex items-center gap-4">
            <div className="w-16 h-16 shrink-0 bg-obsidian-900 rounded-full border border-white/10 flex items-center justify-center p-2">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Rosto Base */}
                <circle cx="50" cy="50" r="45" fill="#0A101D" stroke="#00E5FF" strokeWidth="2" />
                {/* Olhos */}
                <ellipse cx="35" cy="40" rx="4" ry={selectedEmotion === 'surprise' ? 6 : 4} fill="#00E5FF" />
                <ellipse cx="65" cy="40" rx="4" ry={selectedEmotion === 'surprise' ? 6 : 4} fill="#00E5FF" />
                {/* Sobrancelhas Paramétricas */}
                <line
                  x1="28"
                  y1={32 - browShift}
                  x2="42"
                  y2={34}
                  stroke="#D4AF37"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="58"
                  y1={34}
                  x2="72"
                  y2={32 - (selectedEmotion === 'curiosity' ? -browShift : browShift)}
                  stroke="#D4AF37"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Boca com Curvatura Paramétrica */}
                <path
                  d={`M 32,65 Q 50,${65 + (selectedEmotion === 'surprise' ? smileFactor * 1.5 : smileFactor)} 68,65`}
                  fill={selectedEmotion === 'surprise' ? '#1E0A0A' : 'none'}
                  stroke="#D4AF37"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="text-[10px] space-y-0.5">
              <div className="font-bold text-slate-200">{tier.tierName}</div>
              <p className="text-slate-400 leading-tight">{tier.description}</p>
              <div className="text-[9px] text-cyber-cyan pt-1">
                Uso: {tier.recommendedUse}
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 2: Prompts com Pesos de Atenção (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-luxury-gold flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Prompt com Peso de Atenção Calibrado ({tier.weightMultiplier}x)
              </span>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-luxury-gold text-obsidian-950 font-bold text-xs hover:bg-yellow-400 transition-colors cursor-pointer shadow-glow-gold"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado!' : 'Copiar Prompt'}
              </button>
            </div>
            <p className="text-[11px] text-slate-300 bg-white/[0.02] p-3 rounded-lg border border-white/5 leading-relaxed font-sans">
              "{positivePrompt}"
            </p>
          </div>

          <div className="p-3 rounded-xl bg-obsidian-950 border border-white/5 text-[10px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-300 block flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyber-cyan" />
              Equilíbrio de Ancoragem Neutra
            </span>
            <p className="text-[9px] text-slate-500 leading-relaxed font-sans">
              Em intensidades abaixo de 35%, o motor injeta automaticamente tokens de ancoragem neutra para que o modelo de difusão não alucine trejeitos faciais fora do biotipo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
