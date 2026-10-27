'use client';

import React, { useState, useEffect } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  LiveOperatorPose,
  LiveOperatorExpression,
  LiveCannedSpeech,
  LiveOperatorState,
  CANONICAL_OPERATOR_POSES,
  CANONICAL_OPERATOR_EXPRESSIONS,
  CANONICAL_CANNED_SPEECHES,
} from '@/utils/liveOperatorDeckEngine';
import {
  Radio,
  Sliders,
  Tv,
  Mic,
  MicOff,
  Flame,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  ShieldAlert,
  Play,
  RotateCcw,
  CheckCircle2,
  Monitor,
  Hand,
  ExternalLink,
  HelpCircle,
  ThumbsUp,
  Activity,
  Layers,
  Keyboard,
  Clock,
  MessageSquare,
} from 'lucide-react';

interface LiveOperatorDeckPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function LiveOperatorDeckPanel({
  avatarId,
  avatarName,
}: LiveOperatorDeckPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const targetName = currentAvatar?.name || avatarName || 'Maya Vance';
  const avatarImage = currentAvatar?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  const [operatorState, setOperatorState] = useState<LiveOperatorState>({
    isOnAir: true,
    isMuted: false,
    activePoseId: 'pose_host_bancada',
    activeExpressionId: 'expr_neutral',
    lastSpokenPhrase: 'Aguardando comando de fala...',
    speakingUntilMs: 0,
    panicStandbyActive: false,
  });

  const [customSpeechText, setCustomSpeechText] = useState('');
  const [activeSpeechTimer, setActiveSpeechTimer] = useState<number | null>(null);

  const activePose = CANONICAL_OPERATOR_POSES.find((p) => p.id === operatorState.activePoseId) || CANONICAL_OPERATOR_POSES[0];
  const activeExpr = CANONICAL_OPERATOR_EXPRESSIONS.find((e) => e.id === operatorState.activeExpressionId) || CANONICAL_OPERATOR_EXPRESSIONS[0];

  // Escuta de Hotkeys Globais no Deck
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Evita disparar se digitando no input de texto
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toUpperCase();

      // Poses: Q, W, E, R, T, Y
      const poseMatch = CANONICAL_OPERATOR_POSES.find((p) => p.hotkey === key);
      if (poseMatch) {
        setOperatorState((prev) => ({ ...prev, activePoseId: poseMatch.id }));
      }

      // Expressões: 1, 2, 3, 4, 5, 6
      const exprMatch = CANONICAL_OPERATOR_EXPRESSIONS.find((ex) => ex.hotkey === e.key);
      if (exprMatch) {
        setOperatorState((prev) => ({ ...prev, activeExpressionId: exprMatch.id }));
      }

      // Mute: M
      if (key === 'M') {
        setOperatorState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectPose = (pose: LiveOperatorPose) => {
    setOperatorState((prev) => ({ ...prev, activePoseId: pose.id, panicStandbyActive: false }));
  };

  const handleSelectExpression = (expr: LiveOperatorExpression) => {
    setOperatorState((prev) => ({ ...prev, activeExpressionId: expr.id, panicStandbyActive: false }));
  };

  const handleFireSpeech = (speech: LiveCannedSpeech) => {
    if (operatorState.isMuted || operatorState.panicStandbyActive) return;

    // Dispara fala e alinha pose/expressão recomendada
    setOperatorState((prev) => ({
      ...prev,
      lastSpokenPhrase: speech.text,
      activePoseId: speech.recommendedPoseId,
      activeExpressionId: speech.recommendedExpressionId,
      speakingUntilMs: Date.now() + speech.durationSec * 1000,
    }));

    if (activeSpeechTimer) clearTimeout(activeSpeechTimer);
    const timer = window.setTimeout(() => {
      setOperatorState((prev) => ({
        ...prev,
        speakingUntilMs: 0,
        activeExpressionId: 'expr_neutral',
      }));
    }, speech.durationSec * 1000);
    setActiveSpeechTimer(timer);
  };

  const handleFireCustomSpeech = () => {
    if (!customSpeechText.trim() || operatorState.isMuted) return;

    setOperatorState((prev) => ({
      ...prev,
      lastSpokenPhrase: customSpeechText,
      speakingUntilMs: Date.now() + 4500,
    }));

    if (activeSpeechTimer) clearTimeout(activeSpeechTimer);
    const timer = window.setTimeout(() => {
      setOperatorState((prev) => ({ ...prev, speakingUntilMs: 0 }));
    }, 4500);
    setActiveSpeechTimer(timer);
    setCustomSpeechText('');
  };

  const handlePanicStandby = () => {
    if (activeSpeechTimer) clearTimeout(activeSpeechTimer);
    setOperatorState((prev) => ({
      ...prev,
      isMuted: true,
      activePoseId: 'pose_host_bancada',
      activeExpressionId: 'expr_neutral',
      lastSpokenPhrase: '[PANIC STANDBY ATIVADO - ÁUDIO E MOVIMENTO CORTADOS]',
      speakingUntilMs: 0,
      panicStandbyActive: true,
    }));
  };

  const isSpeakingNow = operatorState.speakingUntilMs > Date.now();

  return (
    <section className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(0,229,255,0.06)] relative overflow-hidden">
      {/* Glow Superior */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-80" />

      {/* Header com Status do Operador */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase">
            <Tv className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            Fase 8 · Conector de Live V5 Broadcaster · Etapa 077
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-3">
            <Sliders className="w-6 h-6 text-cyber-cyan" />
            Painel de Controle de Operador de Live (Broadcast Deck)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Mesa de corte em tempo real estilo Stream Deck para troca rápida de poses, expressões
            FACS, bordões canônicos e falas preparadas com atalhos de teclado (Hotkeys).
          </p>
        </div>

        {/* Master Controls: ON AIR + PANIC STANDBY */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOperatorState((prev) => ({ ...prev, isOnAir: !prev.isOnAir }))}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-black tracking-wider flex items-center gap-2 transition-all ${
              operatorState.isOnAir
                ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-pulse'
                : 'bg-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            {operatorState.isOnAir ? '🔴 NO AR (ON AIR)' : '⚪ STANDBY'}
          </button>

          <button
            onClick={handlePanicStandby}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Corta áudio imediatamente e reseta para repouso seguro"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            PANIC MUTE
          </button>
        </div>
      </div>

      {/* Barra de Status ao Vivo: Pose Atual, Expressão e Estado Vocal */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6">
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center shrink-0">
            <Tv className="w-4 h-4 text-cyber-cyan" />
          </div>
          <div className="truncate">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Pose Atual</div>
            <div className="text-xs font-bold font-mono text-slate-200 truncate">
              {activePose.name} <span className="text-cyber-cyan">[{activePose.hotkey}]</span>
            </div>
          </div>
        </div>

        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-3 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: `${activeExpr.colorAccent}15`,
              borderColor: `${activeExpr.colorAccent}40`,
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: activeExpr.colorAccent }} />
          </div>
          <div className="truncate">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Expressão FACS</div>
            <div
              className="text-xs font-bold font-mono truncate"
              style={{ color: activeExpr.colorAccent }}
            >
              {activeExpr.name} <span className="opacity-75">[{activeExpr.hotkey}]</span>
            </div>
          </div>
        </div>

        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-3 flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
              isSpeakingNow
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-white/5 border-white/10 text-slate-500'
            }`}
          >
            <Activity className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Canal Vocal</div>
            <div
              className={`text-xs font-bold font-mono ${
                isSpeakingNow ? 'text-emerald-400 animate-pulse' : 'text-slate-400'
              }`}
            >
              {isSpeakingNow ? 'FALANDO EM CENA...' : 'REOUSO / ESPERA'}
            </div>
          </div>
        </div>

        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-3 flex items-center justify-between">
          <div className="truncate">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Mute de Áudio</div>
            <div
              className={`text-xs font-bold font-mono ${
                operatorState.isMuted ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {operatorState.isMuted ? 'ÁUDIO MUTADO' : 'ÁUDIO ABERTO'}
            </div>
          </div>
          <button
            onClick={() => setOperatorState((prev) => ({ ...prev, isMuted: !prev.isMuted }))}
            className={`p-2 rounded-lg border transition-colors ${
              operatorState.isMuted
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
            title="Alternar Mute [M]"
          >
            {operatorState.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Grid Principal: Mesa de Poses vs Mesa de Expressões */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Mesa 1: Poses Corporais (Stream Deck Poses) */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyber-cyan" />
              Mesa de Corte de Poses (Stream Deck)
            </span>
            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
              <Keyboard className="w-3 h-3 text-cyber-cyan" /> Teclas Q-W-E-R-T-Y
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CANONICAL_OPERATOR_POSES.map((pose) => {
              const isSelected = operatorState.activePoseId === pose.id;
              return (
                <button
                  key={pose.id}
                  onClick={() => handleSelectPose(pose)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyber-cyan bg-cyber-cyan/15 shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 text-cyber-cyan">
                      [{pose.hotkey}]
                    </span>
                    <span className="text-[9px] font-mono uppercase text-slate-500">
                      {pose.category}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-200 mt-2 truncate">
                    {pose.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {pose.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mesa 2: Expressões Faciais FACS */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyber-cyan" />
              Mesa de Expressões FACS Instantâneas
            </span>
            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
              <Keyboard className="w-3 h-3 text-cyber-cyan" /> Teclas 1 a 6
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CANONICAL_OPERATOR_EXPRESSIONS.map((expr) => {
              const isSelected = operatorState.activeExpressionId === expr.id;
              return (
                <button
                  key={expr.id}
                  onClick={() => handleSelectExpression(expr)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'shadow-lg'
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20'
                  }`}
                  style={{
                    borderColor: isSelected ? expr.colorAccent : undefined,
                    backgroundColor: isSelected ? `${expr.colorAccent}20` : undefined,
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${expr.colorAccent}25`,
                        color: expr.colorAccent,
                      }}
                    >
                      [{expr.hotkey}]
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      {expr.facsUnits.split('(')[0]}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-200 mt-2 truncate">
                    {expr.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                    Intensidade: {(expr.intensity * 100).toFixed(0)}%
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Seção de Falas Preparadas e Bordões Canônicos */}
      <div className="mt-6 bg-obsidian-950/80 border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyber-cyan" />
            Deck de Falas Preparadas & Bordões da Holding ({CANONICAL_CANNED_SPEECHES.length})
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Disparo com alinhamento de pose e expressão automática
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {CANONICAL_CANNED_SPEECHES.map((speech) => (
            <div
              key={speech.id}
              className="bg-obsidian-900/90 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between space-y-2 hover:border-cyber-cyan/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 truncate">
                    {speech.title}
                  </span>
                  <span className="text-[10px] font-mono text-cyber-cyan bg-cyan-500/10 px-1.5 py-0.5 rounded">
                    {speech.durationSec}s
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 italic line-clamp-2 mt-1">
                  &quot;{speech.text}&quot;
                </p>
              </div>

              <button
                onClick={() => handleFireSpeech(speech)}
                disabled={isSpeakingNow}
                className="w-full py-1.5 px-3 rounded-lg bg-cyber-cyan/15 hover:bg-cyber-cyan/25 border border-cyber-cyan/30 text-cyber-cyan font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
              >
                <Play className="w-3.5 h-3.5" /> Falar na Transmissão
              </button>
            </div>
          ))}
        </div>

        {/* Input de Fala Customizada / Improviso */}
        <div className="pt-2 border-t border-white/5 space-y-1.5">
          <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-cyber-cyan" />
            Fala de Improviso em Tempo Real (TTS & Lip-Sync):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={`Digite a frase para ${targetName} falar imediatamente...`}
              value={customSpeechText}
              onChange={(e) => setCustomSpeechText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFireCustomSpeech();
              }}
              className="flex-1 bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyber-cyan font-sans"
            />
            <button
              onClick={handleFireCustomSpeech}
              disabled={isSpeakingNow || !customSpeechText.trim()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" /> Disparar Fala
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
