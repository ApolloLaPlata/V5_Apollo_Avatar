'use client';

import React, { useState } from 'react';
import {
  BaseEmotionType,
  CANONICAL_BASE_EMOTIONS,
  compileBaseEmotionPrompt,
} from '@/utils/baseEmotionsMatrix';
import { toast } from '@/store/useToastStore';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  Smile,
  Zap,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  Sliders,
  Layers,
  Heart,
  Eye,
  CheckCircle2,
  Activity,
} from 'lucide-react';

interface BaseEmotionsMatrixPanelProps {
  avatarId?: string;
  characterName?: string;
  onEmotionSelected?: (emotion: BaseEmotionType, positivePrompt: string) => void;
}

export default function BaseEmotionsMatrixPanel({
  avatarId = 'avatar-default',
  characterName = 'Personagem Soberano',
  onEmotionSelected,
}: BaseEmotionsMatrixPanelProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<BaseEmotionType>('open_smile');
  const [intensity, setIntensity] = useState<number>(100);
  const [copied, setCopied] = useState(false);
  const { updateAvatar, avatars } = useAvatarStore();

  const emotionList = Object.values(CANONICAL_BASE_EMOTIONS);
  const { positivePrompt, negativePrompt, profile } = compileBaseEmotionPrompt(
    selectedEmotion,
    characterName,
    intensity
  );

  const handleSelect = (type: BaseEmotionType) => {
    setSelectedEmotion(type);
    const compiled = compileBaseEmotionPrompt(type, characterName, intensity);
    if (onEmotionSelected) {
      onEmotionSelected(type, compiled.positivePrompt);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(positivePrompt);
    setCopied(true);
    toast.success(
      'Prompt de Emoção Copiado!',
      `Expressão "${profile.name}" compilada com ${intensity}% de intensidade (FACS: ${profile.facsUnits}).`
    );
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToProfile = () => {
    const current = avatars.find((a) => a.id === avatarId);
    if (!current) return;
    updateAvatar(avatarId, {
      face: {
        ...current.face,
        expressions: [
          { expression: 'neutral', promptModifier: 'serene calm resting face' },
          { expression: selectedEmotion, promptModifier: positivePrompt },
        ],
      },
    });
    toast.success('DNA Emocional Atualizado', `Expressão ${profile.name} vinculada à store.`);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-5 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Matriz de Emoções Base do Personagem (FACS Standard)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30">
                5 Emoções Canônicas
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Calibração de microexpressões musculares (Action Units) para consistência emocional absoluta
            </p>
          </div>
        </div>

        {/* Slider de Intensidade da Expressão */}
        <div className="flex items-center gap-3 p-2 bg-obsidian-950 border border-white/10 rounded-xl text-xs">
          <Sliders className="w-4 h-4 text-cyber-cyan" />
          <span className="text-slate-400 text-[10px]">Intensidade:</span>
          <input
            type="range"
            min="50"
            max="120"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-24 accent-cyber-cyan bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-cyber-cyan font-bold font-mono text-[11px] w-10 text-right">
            {intensity}%
          </span>
        </div>
      </div>

      {/* Grid: 5 Cartões de Emoções Base */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {emotionList.map((item) => {
          const isSelected = selectedEmotion === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between select-none ${
                isSelected
                  ? 'border-cyber-cyan bg-cyber-cyan/10 shadow-[0_0_15px_rgba(0,229,255,0.2)] ring-1 ring-cyber-cyan/50'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-1.5">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
                    {item.facsUnits.split(' ')[0]} {item.facsUnits.split(' ')[1]}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-cyber-cyan" />}
                </div>

                <h4 className="text-xs font-bold text-slate-100 mt-1 line-clamp-1">
                  {item.name.split('/')[0]}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.tagline}
                </p>
              </div>

              {/* Tensão Facial */}
              <div className="pt-3 mt-3 border-t border-white/5 space-y-1">
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>Tensão Facial:</span>
                  <span className="text-cyber-cyan font-bold">{item.facialTensionPercent}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyber-cyan rounded-full transition-all"
                    style={{ width: `${item.facialTensionPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Painel do Inspetor da Emoção Ativa */}
      <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Coluna 1: Microexpressões e Recomendação (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyber-cyan flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              {profile.name}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-luxury-gold/20 text-luxury-gold font-bold">
              {profile.facsUnits}
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
              Microexpressões Anatômicas Acionadas:
            </span>
            <ul className="space-y-1 text-[11px] text-slate-300">
              {profile.microExpressions.map((me, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
                  {me}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-[10px] text-slate-400">
            <strong className="text-slate-300 block">Aplicação Recomendada:</strong>
            {profile.recommendedContext}
          </div>
        </div>

        {/* Coluna 2: Prompts Compilados e Ações (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-2">
            <span className="text-[10px] font-bold text-cyber-cyan flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Prompt de Expressão Compilado ({intensity}% Intensidade):
            </span>
            <p className="text-[11px] text-slate-200 font-sans leading-relaxed line-clamp-3">
              "{positivePrompt}"
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="flex-1 py-2.5 px-3 rounded-xl bg-cyber-cyan text-obsidian-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-cyan-300 transition-colors cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.3)]"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado!' : 'Copiar Prompt da Emoção'}
            </button>

            <button
              type="button"
              onClick={handleSaveToProfile}
              className="py-2.5 px-3 rounded-xl bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 hover:bg-luxury-gold/25 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Vincular ao DNA Facial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
