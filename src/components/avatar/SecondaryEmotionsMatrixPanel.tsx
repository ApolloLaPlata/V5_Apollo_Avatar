'use client';

import React, { useState } from 'react';
import {
  SecondaryEmotionType,
  CANONICAL_SECONDARY_EMOTIONS,
  compileSecondaryEmotionPrompt,
} from '@/utils/secondaryEmotionsMatrix';
import { toast } from '@/store/useToastStore';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  HelpCircle,
  Zap,
  HeartHandshake,
  ShieldAlert,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  Sliders,
  Compass,
  Flame,
  CheckCircle2,
  Activity,
} from 'lucide-react';

interface SecondaryEmotionsMatrixPanelProps {
  avatarId?: string;
  characterName?: string;
  onEmotionSelected?: (emotion: SecondaryEmotionType, positivePrompt: string) => void;
}

export default function SecondaryEmotionsMatrixPanel({
  avatarId = 'avatar-default',
  characterName = 'Personagem Soberano',
  onEmotionSelected,
}: SecondaryEmotionsMatrixPanelProps) {
  const [selectedEmotion, setSelectedEmotion] =
    useState<SecondaryEmotionType>('curiosity_doubt');
  const [intensity, setIntensity] = useState<number>(100);
  const [copied, setCopied] = useState(false);
  const { updateAvatar, avatars } = useAvatarStore();

  const emotionList = Object.values(CANONICAL_SECONDARY_EMOTIONS);
  const { positivePrompt, negativePrompt, profile } = compileSecondaryEmotionPrompt(
    selectedEmotion,
    characterName,
    intensity
  );

  const handleSelect = (type: SecondaryEmotionType) => {
    setSelectedEmotion(type);
    const compiled = compileSecondaryEmotionPrompt(type, characterName, intensity);
    if (onEmotionSelected) {
      onEmotionSelected(type, compiled.positivePrompt);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(positivePrompt);
    setCopied(true);
    toast.success(
      'Prompt Secundário Copiado!',
      `Expressão "${profile.name}" compilada com ${intensity}% de intensidade e inclinação de cabeça ${profile.headTiltDeg}º.`
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
          ...(current.face.expressions || []),
          { expression: selectedEmotion, promptModifier: positivePrompt },
        ],
      },
    });
    toast.success('DNA Emocional Secundário Salvo', `Expressão ${profile.name} gravada no avatar.`);
  };

  const getEmotionIcon = (type: SecondaryEmotionType) => {
    switch (type) {
      case 'curiosity_doubt':
        return <HelpCircle className="w-5 h-5 text-cyber-cyan" />;
      case 'enthusiasm_hype':
        return <Zap className="w-5 h-5 text-luxury-gold" />;
      case 'warm_empathy':
        return <HeartHandshake className="w-5 h-5 text-emerald-400" />;
      case 'stern_authority':
        return <ShieldAlert className="w-5 h-5 text-red-400" />;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-5 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 shadow-glow-gold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Matriz de Emoções Secundárias & Engajamento Social
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30">
                4 Emoções Dinâmicas
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Calibração de expressões contextuais para hooks, engajamento ao vivo, empatia e autoridade executiva
            </p>
          </div>
        </div>

        {/* Slider de Intensidade */}
        <div className="flex items-center gap-3 p-2 bg-obsidian-950 border border-white/10 rounded-xl text-xs">
          <Sliders className="w-4 h-4 text-luxury-gold" />
          <span className="text-slate-400 text-[10px]">Intensidade:</span>
          <input
            type="range"
            min="50"
            max="120"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-24 accent-luxury-gold bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-luxury-gold font-bold font-mono text-[11px] w-10 text-right">
            {intensity}%
          </span>
        </div>
      </div>

      {/* Grid: 4 Cartões de Emoções Secundárias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {emotionList.map((item) => {
          const isSelected = selectedEmotion === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between select-none ${
                isSelected
                  ? 'border-luxury-gold bg-luxury-gold/10 shadow-glow-gold ring-1 ring-luxury-gold/50'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2">
                  <div className="p-1.5 rounded-lg bg-obsidian-950 border border-white/10">
                    {getEmotionIcon(item.id)}
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-luxury-gold" />
                  ) : (
                    <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
                      Tilt: {item.headTiltDeg > 0 ? `+${item.headTiltDeg}º` : `${item.headTiltDeg}º`}
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-100 mt-1 line-clamp-1">
                  {item.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.tagline}
                </p>
              </div>

              {/* Índice de Acolhimento / Warmth */}
              <div className="pt-3 mt-3 border-t border-white/5 space-y-1">
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>Acolhimento (Warmth):</span>
                  <span className="text-luxury-gold font-bold">{item.warmthIndex}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-luxury-gold rounded-full transition-all"
                    style={{ width: `${item.warmthIndex}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Painel de Inspeção Detalhado da Emoção Secundária Ativa */}
      <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Coluna 1: Microexpressões e Papel Social (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-luxury-gold flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              {profile.name}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono">
              Papel: {profile.socialRole}
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
              Microexpressões & Dinâmica Facial:
            </span>
            <ul className="space-y-1 text-[11px] text-slate-300">
              {profile.microExpressions.map((me, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                  {me}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-[10px] text-slate-400">
            <strong className="text-slate-300 block">Cenário Recomendado:</strong>
            {profile.recommendedUse}
          </div>
        </div>

        {/* Coluna 2: Prompts Compilados e Salvamento (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-2">
            <span className="text-[10px] font-bold text-luxury-gold flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Prompt Secundário Compilado ({intensity}% Intensidade):
            </span>
            <p className="text-[11px] text-slate-200 font-sans leading-relaxed line-clamp-3">
              "{positivePrompt}"
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={handleCopyPrompt}
              className="flex-1 py-2.5 px-3 rounded-xl bg-luxury-gold text-obsidian-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-yellow-400 transition-colors cursor-pointer shadow-glow-gold"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado!' : 'Copiar Prompt Secundário'}
            </button>

            <button
              type="button"
              onClick={handleSaveToProfile}
              className="py-2.5 px-3 rounded-xl bg-white/5 text-slate-200 border border-white/10 hover:border-luxury-gold hover:text-luxury-gold font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Vincular ao DNA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
