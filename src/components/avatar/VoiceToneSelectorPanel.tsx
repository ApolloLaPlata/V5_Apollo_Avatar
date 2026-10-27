'use client';

import React, { useState } from 'react';
import { VoiceTone } from '@/types/avatar';
import {
  CANONICAL_VOICE_TONES,
  VoiceToneProfile,
  getVoiceToneProfile,
  compileToneSSML,
  applyVoiceToneModifiers,
} from '@/utils/voiceToneEngine';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  Radio,
  Sparkles,
  Zap,
  Volume2,
  CheckCircle2,
  Sliders,
  Copy,
  Check,
  Code,
  Flame,
  Moon,
  Shield,
  HeartHandshake,
  Glasses,
  Play,
  RotateCw,
} from 'lucide-react';

interface VoiceToneSelectorPanelProps {
  avatarId?: string;
  avatarName?: string;
  currentTone?: VoiceTone;
}

export default function VoiceToneSelectorPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
  currentTone = 'energetic',
}: VoiceToneSelectorPanelProps) {
  const { avatars, updateAvatar } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId);

  const selectedTone = currentAvatar?.voice?.tone || currentTone;
  const [autoSyncParams, setAutoSyncParams] = useState<boolean>(true);
  const [showSSML, setShowSSML] = useState<boolean>(false);
  const [copiedSSML, setCopiedSSML] = useState<boolean>(false);
  const [previewingTone, setPreviewingTone] = useState<VoiceTone | null>(null);

  const activeProfile = getVoiceToneProfile(selectedTone);
  const toneKeys = Object.keys(CANONICAL_VOICE_TONES) as VoiceTone[];

  const handleSelectTone = (tone: VoiceTone) => {
    if (!currentAvatar) return;

    const profile = getVoiceToneProfile(tone);
    const updatedVoice = {
      ...currentAvatar.voice,
      tone,
    };

    if (autoSyncParams) {
      updatedVoice.pitch = profile.recommendedPitchDelta;
      updatedVoice.speed = profile.recommendedSpeedMultiplier;
      updatedVoice.stability = profile.recommendedStability;
    }

    updateAvatar(avatarId, { voice: updatedVoice });

    toast.success(
      `Tonalidade Aplicada: ${profile.name.split(' / ')[0]}`,
      `Entonação vocal de ${avatarName} ajustada para o canal ${profile.channelTarget}.`
    );
  };

  const handleSimulatePlay = (tone: VoiceTone, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewingTone(tone);
    const profile = getVoiceToneProfile(tone);

    toast.info(
      `Sintetizando Preview: ${profile.name}`,
      `Simulando inflexão fonética com ênfase em ${profile.frequencyEmphasis}.`
    );

    setTimeout(() => {
      setPreviewingTone(null);
    }, 2400);
  };

  const ssmlCode = compileToneSSML(activeProfile.samplePhrase, selectedTone);

  const handleCopySSML = () => {
    navigator.clipboard.writeText(ssmlCode);
    setCopiedSSML(true);
    toast.success('SSML Copiado!', 'Marcação acústica XML copiada para a área de transferência.');
    setTimeout(() => setCopiedSSML(false), 2000);
  };

  const getToneIcon = (tone: VoiceTone) => {
    switch (tone) {
      case 'energetic':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'calm':
        return <Glasses className="w-4 h-4 text-cyan-400" />;
      case 'authoritative':
        return <Shield className="w-4 h-4 text-indigo-400" />;
      case 'friendly':
        return <HeartHandshake className="w-4 h-4 text-emerald-400" />;
      case 'hypnotic':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'night':
        return <Moon className="w-4 h-4 text-cyber-cyan" />;
      case 'whisper':
        return <Volume2 className="w-4 h-4 text-pink-400" />;
      default:
        return <Radio className="w-4 h-4 text-cyber-gold" />;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Seletor de Tonalidade Emocional Vocal (Vocal Tone Matrix)
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${activeProfile.color} bg-white/5 border-white/10`}>
                {activeProfile.name.split(' / ')[0]} Ativo
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Inflexão psicológica, ressonância e prosódia vocal calibrada para os canais de distribuição da Holding
            </p>
          </div>
        </div>

        {/* Controles de Topo */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-colors">
            <input
              type="checkbox"
              checked={autoSyncParams}
              onChange={(e) => setAutoSyncParams(e.target.checked)}
              className="rounded border-white/20 text-purple-500 focus:ring-purple-400 h-3.5 w-3.5 bg-black/40"
            />
            <span className="text-[11px]">Sincronizar Sliders Acústicos</span>
          </label>

          <button
            onClick={() => setShowSSML(!showSSML)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors ${
              showSSML
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showSSML ? 'Ocultar SSML' : 'Ver SSML'}</span>
          </button>
        </div>
      </div>

      {/* Grid de 6+ Tonalidades Vocais Canônicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {toneKeys.map((toneKey) => {
          const profile = CANONICAL_VOICE_TONES[toneKey];
          const isSelected = selectedTone === toneKey;
          const isPreviewing = previewingTone === toneKey;

          return (
            <div
              key={toneKey}
              onClick={() => handleSelectTone(toneKey)}
              className={`p-4 rounded-xl border text-xs cursor-pointer transition-all duration-200 relative group flex flex-col justify-between ${
                isSelected
                  ? `bg-gradient-to-br ${profile.bgGradient} ${profile.borderColor} border-2 shadow-[0_0_20px_rgba(255,255,255,0.06)]`
                  : 'bg-black/35 border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="space-y-2">
                {/* Topo do Card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-black/40 border border-white/10">
                      {getToneIcon(toneKey)}
                    </div>
                    <span className="font-bold text-slate-100">{profile.name}</span>
                  </div>

                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      Ativo
                    </span>
                  )}
                </div>

                {/* Subtítulo & Canal Alvo */}
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-sans italic">{profile.subtitle}</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5 shrink-0">
                    {profile.channelTarget}
                  </span>
                </div>

                {/* Descrição Acústica */}
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {profile.description}
                </p>

                {/* Frase de Exemplo */}
                <div className="p-2.5 rounded-lg bg-black/50 border border-white/5 text-[11px] text-slate-300 italic relative">
                  &ldquo;{profile.samplePhrase}&rdquo;
                </div>
              </div>

              {/* Rodapé do Card com Parâmetros e Botão de Play */}
              <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-slate-500">Parâmetros:</span>
                  <span className="font-bold text-slate-300">
                    {profile.recommendedPitchDelta > 0 ? `+${profile.recommendedPitchDelta}` : profile.recommendedPitchDelta}st
                  </span>
                  <span>·</span>
                  <span className="font-bold text-slate-300">
                    {profile.recommendedSpeedMultiplier}x
                  </span>
                  <span>·</span>
                  <span className="font-bold text-slate-300">
                    {Math.round(profile.recommendedStability * 100)}% est.
                  </span>
                </div>

                <button
                  onClick={(e) => handleSimulatePlay(toneKey, e)}
                  disabled={isPreviewing}
                  className={`p-1.5 rounded-lg border flex items-center gap-1 transition-colors ${
                    isPreviewing
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 animate-pulse'
                      : 'bg-white/5 hover:bg-white/15 border-white/10 text-slate-300 hover:text-white'
                  }`}
                  title="Simular áudio de exemplo"
                >
                  {isPreviewing ? (
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span className="text-[10px]">{isPreviewing ? 'Tocando' : 'Ouvir'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawer de Código SSML */}
      {showSSML && (
        <div className="p-4 rounded-xl bg-black/75 border border-white/15 space-y-2 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
            <span className="text-slate-300 font-bold flex items-center gap-2">
              <Code className="w-4 h-4 text-purple-400" />
              Marcação SSML (Speech Synthesis Markup Language) - Inflexão: {activeProfile.name}
            </span>
            <button
              onClick={handleCopySSML}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-xs transition-colors"
            >
              {copiedSSML ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar SSML</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Padrão XML para envio direto aos endpoints de inferência do V5 Sound com modulação dinâmica de contorno acústico.
          </p>
          <pre className="text-[11px] text-purple-300/90 overflow-x-auto p-3 bg-black/60 rounded-lg max-h-48 scrollbar-thin">
            {ssmlCode}
          </pre>
        </div>
      )}
    </div>
  );
}
