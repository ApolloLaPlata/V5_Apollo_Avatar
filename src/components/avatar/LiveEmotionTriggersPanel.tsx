'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  LiveEventType,
  LiveEventPayload,
  LiveEmotionReaction,
  LiveVfxEffect,
  calculateEmotionReaction,
  CANONICAL_TEST_LIVE_EVENTS,
} from '@/utils/liveEmotionTriggersEngine';
import {
  Zap,
  Sparkles,
  Heart,
  Crown,
  Radio,
  Flame,
  ShieldAlert,
  HelpCircle,
  RotateCcw,
  Play,
  CheckCircle2,
  Send,
  MessageSquare,
  Activity,
  Layers,
  Copy,
  Check,
} from 'lucide-react';

interface LiveEmotionTriggersPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function LiveEmotionTriggersPanel({
  avatarId,
  avatarName,
}: LiveEmotionTriggersPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const targetName = currentAvatar?.name || avatarName || 'Maya Vance';
  const avatarPhoto = currentAvatar?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  // Estado da reação ativa no momento
  const [activeReaction, setActiveReaction] = useState<LiveEmotionReaction | null>(null);
  const [currentEvent, setCurrentEvent] = useState<LiveEventPayload | null>(null);
  const [remainingTimeMs, setRemainingTimeMs] = useState(0);
  const [totalDurationMs, setTotalDurationMs] = useState(0);
  const [eventHistory, setEventHistory] = useState<Array<{
    id: string;
    event: LiveEventPayload;
    reaction: LiveEmotionReaction;
    time: string;
  }>>([]);

  // Formulário de evento customizado
  const [customSender, setCustomSender] = useState('SuperFã_Holding');
  const [customType, setCustomType] = useState<LiveEventType>('superchat_standard');
  const [customAmount, setCustomAmount] = useState('R$ 50,00');
  const [customMsg, setCustomMsg] = useState('Parabéns pela live, Maya! Sensacional!');
  const [copiedWebhookPayload, setCopiedWebhookPayload] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Disparo de Reação Emocional
  const triggerReaction = (event: LiveEventPayload) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const reaction = calculateEmotionReaction(event, targetName);
    setActiveReaction(reaction);
    setCurrentEvent(event);
    setRemainingTimeMs(reaction.durationMs);
    setTotalDurationMs(reaction.durationMs);

    // Registra no histórico
    setEventHistory((prev) => [
      {
        id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        event,
        reaction,
        time: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 7),
    ]);

    // Timer de decaimento suave
    const stepMs = 50;
    timerRef.current = setInterval(() => {
      setRemainingTimeMs((prev) => {
        if (prev <= stepMs) {
          if (timerRef.current) clearInterval(timerRef.current);
          setActiveReaction(null);
          setCurrentEvent(null);
          return 0;
        }
        return prev - stepMs;
      });
    }, stepMs);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleResetToNeutral = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActiveReaction(null);
    setCurrentEvent(null);
    setRemainingTimeMs(0);
  };

  const handleFireCustom = () => {
    const payload: LiveEventPayload = {
      id: `custom_${Date.now()}`,
      eventType: customType,
      sender: customSender,
      amountFormatted: customType.startsWith('superchat') ? customAmount : undefined,
      message: customMsg,
      platform: 'youtube',
      timestamp: Date.now(),
    };
    triggerReaction(payload);
  };

  const progressPercent = totalDurationMs > 0 ? (remainingTimeMs / totalDurationMs) * 100 : 0;

  const copyWebhookCode = () => {
    const sampleWebhook = {
      action: 'emotion_trigger',
      avatarId: currentAvatar.id,
      timestamp: Date.now(),
      data: {
        emotion: activeReaction ? activeReaction.emotionId : 'open_smile_radiant',
        intensity: activeReaction ? activeReaction.intensity : 0.9,
        sourceEvent: currentEvent || CANONICAL_TEST_LIVE_EVENTS[0],
      },
    };
    navigator.clipboard.writeText(JSON.stringify(sampleWebhook, null, 2));
    setCopiedWebhookPayload(true);
    setTimeout(() => setCopiedWebhookPayload(false), 2000);
  };

  return (
    <section className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(0,229,255,0.06)] relative overflow-hidden">
      {/* Glow Superior */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-80" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase">
            <Radio className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            Fase 8 · Conector de Live V5 Broadcaster · Etapa 074
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-cyber-cyan" />
            Sistema de Gatilhos de Emoções em Tempo Real (Live Reaction Matrix)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Disparadores dinâmicos de reações faciais FACS, head-tilts e partículas VFX ativados por
            Superchats, Inscrições VIP, Raids e Alertas de Moderação no{' '}
            <strong className="text-cyber-cyan">V5 Broadcaster (:3008)</strong>.
          </p>
        </div>

        {/* Status de Reação Ativa */}
        <div className="flex items-center gap-3 bg-obsidian-950 px-4 py-2.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <span
              className={`relative flex h-3 w-3 ${
                activeReaction ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  activeReaction ? 'bg-amber-400' : 'bg-slate-500'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  activeReaction ? 'bg-amber-500' : 'bg-slate-500'
                }`}
              ></span>
            </span>
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-500">Live Reaction</div>
              <div
                className="text-xs font-bold font-mono truncate max-w-[170px]"
                style={{ color: activeReaction ? activeReaction.colorAccent : '#94a3b8' }}
              >
                {activeReaction ? activeReaction.name : 'NEUTRO EM ESPERA'}
              </div>
            </div>
          </div>
          {activeReaction && (
            <button
              onClick={handleResetToNeutral}
              className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-[11px] font-mono flex items-center gap-1 transition-colors"
              title="Voltar ao repouso neutro imediatamente"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Grid Principal: Monitor Visual com Overlay VFX vs Controles Rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Coluna Visual: Preview do Avatar com Expressão Reativa e VFX (5 Colunas) */}
        <div className="lg:col-span-5 bg-obsidian-950/90 border border-white/10 rounded-xl p-5 space-y-4 flex flex-col items-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyber-cyan" />
              Expressão Facial em Cena
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {targetName} · 60 FPS
            </span>
          </div>

          {/* Viewport do Rosto com Transform 3D de Head-Tilt e Efeitos */}
          <div className="relative w-64 h-80 rounded-2xl overflow-hidden border border-cyber-cyan/30 shadow-[0_0_30px_rgba(0,229,255,0.15)] bg-obsidian-950 flex items-center justify-center">
            {/* Imagem do Avatar com Head-Tilt Dinâmico */}
            <div
              className="w-full h-full relative transition-transform duration-500 ease-out"
              style={{
                transform: `rotateZ(${activeReaction ? activeReaction.headTiltDeg : 0}deg) scale(${
                  activeReaction ? 1.04 : 1.0
                })`,
              }}
            >
              <img
                src={avatarPhoto}
                alt={targetName}
                className="w-full h-full object-cover"
              />

              {/* Tint Overlay Dinâmico por Emoção */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  backgroundColor: activeReaction ? activeReaction.colorAccent : 'transparent',
                  opacity: activeReaction ? 0.12 : 0,
                }}
              />
            </div>

            {/* Partículas / VFX Overlays */}
            {activeReaction?.vfx === 'golden_confetti' && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <div className="text-3xl animate-bounce">✨ 🪙 ✨ 👑 ✨</div>
              </div>
            )}
            {activeReaction?.vfx === 'heart_burst' && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <div className="text-3xl animate-pulse">💖 🌸 💖</div>
              </div>
            )}
            {activeReaction?.vfx === 'neon_shockwave' && (
              <div className="absolute inset-0 pointer-events-none border-4 border-cyber-cyan rounded-2xl animate-ping opacity-75" />
            )}
            {activeReaction?.vfx === 'shield_glitch' && (
              <div className="absolute inset-0 pointer-events-none border-2 border-rose-500 bg-rose-500/10 flex items-center justify-center">
                <ShieldAlert className="w-16 h-16 text-rose-500 animate-pulse opacity-80" />
              </div>
            )}

            {/* Badge de Emoção Ativa */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-center text-[10px] font-mono bg-obsidian-950/85 backdrop-blur px-2.5 py-1.5 rounded-lg border border-white/10">
              <span className="text-slate-300 truncate font-bold">
                {activeReaction ? activeReaction.name : 'Repouso Fisiológico'}
              </span>
              <span
                className="font-bold px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: activeReaction
                    ? `${activeReaction.colorAccent}20`
                    : 'rgba(255,255,255,0.05)',
                  color: activeReaction ? activeReaction.colorAccent : '#94a3b8',
                }}
              >
                {activeReaction ? `${(activeReaction.intensity * 100).toFixed(0)}%` : '0%'}
              </span>
            </div>

            {/* Barra de Progresso do Tempo Restante */}
            {activeReaction && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-obsidian-900">
                <div
                  className="h-full transition-all duration-75"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: activeReaction.colorAccent,
                  }}
                />
              </div>
            )}
          </div>

          {/* Balão de Fala Sugerida para o Host */}
          <div className="w-full bg-obsidian-900/90 border border-white/10 rounded-xl p-3 space-y-1 text-left relative">
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 text-cyber-cyan" />
              Fala Automática / Sugestão Vocal ({targetName}):
            </div>
            <p className="text-xs text-cyan-200/90 italic font-sans">
              &quot;
              {activeReaction
                ? activeReaction.suggestedSpokenReaction
                : `Olá a todos! Maya Vance pronta para as próximas interações do chat.`}
              &quot;
            </p>
          </div>
        </div>

        {/* Coluna de Disparadores Rápidos e Matriz de Eventos (7 Colunas) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Caixa de Gatilhos Rápidos Canônicos */}
          <div className="bg-obsidian-950/90 border border-white/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                <Flame className="w-4 h-4 text-cyber-cyan" />
                Gatilhos Rápidos de Live (Eventos Canônicos)
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Clique para simular
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CANONICAL_TEST_LIVE_EVENTS.map((evt) => {
                const reaction = calculateEmotionReaction(evt, targetName);
                const isCurrent = currentEvent?.id === evt.id;

                return (
                  <button
                    key={evt.id}
                    onClick={() => triggerReaction(evt)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isCurrent
                        ? 'border-cyber-cyan bg-cyber-cyan/15 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        {evt.eventType === 'superchat_whale' && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                        {evt.eventType === 'new_subscriber_vip' && <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                        {evt.eventType === 'audience_raid' && <Flame className="w-3.5 h-3.5 text-blue-400" />}
                        {evt.eventType === 'chat_question_complex' && <HelpCircle className="w-3.5 h-3.5 text-amber-400" />}
                        {evt.eventType === 'moderation_alert' && <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />}
                        {evt.sender}
                      </span>
                      {evt.amountFormatted && (
                        <span
                          className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: `${reaction.colorAccent}20`,
                            color: reaction.colorAccent,
                          }}
                        >
                          {evt.amountFormatted}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 truncate mt-1">
                      {evt.message || 'Disparo de evento de live'}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2 text-[10px] font-mono text-slate-500">
                      <span>Emoção: <strong className="text-slate-300">{reaction.name.split('&')[0]}</strong></span>
                      <span className="text-cyber-cyan font-bold">{reaction.durationMs / 1000}s</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Forja de Evento Customizado */}
          <div className="bg-obsidian-950/90 border border-white/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyber-cyan" />
                Criador de Evento Customizado de Live
              </span>
              <button
                onClick={copyWebhookCode}
                className="text-[11px] font-mono text-slate-400 hover:text-cyber-cyan flex items-center gap-1"
                title="Copiar estrutura JSON de webhook para disparar via código"
              >
                {copiedWebhookPayload ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copiedWebhookPayload ? 'Payload Copiado!' : 'Copiar Webhook JSON'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Usuário do Chat</label>
                <input
                  type="text"
                  value={customSender}
                  onChange={(e) => setCustomSender(e.target.value)}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyber-cyan font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Tipo de Evento</label>
                <select
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value as LiveEventType)}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyber-cyan font-mono"
                >
                  <option value="superchat_standard">💰 Superchat Padrão</option>
                  <option value="superchat_whale">👑 Superchat Whale (Alto)</option>
                  <option value="superchat_micro">🎁 Micro Presente / Bits</option>
                  <option value="new_subscriber_vip">💎 Membro VIP / Sub Tier 3</option>
                  <option value="new_subscriber_standard">👤 Novo Inscrito</option>
                  <option value="audience_raid">🚀 Raid de Audiência</option>
                  <option value="chat_question_complex">💡 Pergunta Complexa</option>
                  <option value="moderation_alert">🛡️ Alerta de Moderação</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Valor / Quantia</label>
                <input
                  type="text"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyber-cyan font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">Mensagem da Interação</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="flex-1 bg-obsidian-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyber-cyan"
                />
                <button
                  onClick={handleFireCustom}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  Disparar no Avatar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico Recente de Emoções Disparadas */}
      <div className="mt-6 bg-obsidian-950/80 border border-white/10 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyber-cyan" />
            Telemetria de Eventos Recentes Disparados ({eventHistory.length})
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Fila Prioritária de Live
          </span>
        </div>

        {eventHistory.length === 0 ? (
          <div className="text-center py-4 text-xs font-mono text-slate-500">
            Nenhum evento disparado ainda. Clique em um dos gatilhos acima para iniciar.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {eventHistory.map((item) => (
              <div
                key={item.id}
                className="py-2 flex items-center justify-between text-xs font-mono text-slate-300"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px]">{item.time}</span>
                  <span className="font-bold text-slate-200">{item.event.sender}</span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: `${item.reaction.colorAccent}20`,
                      color: item.reaction.colorAccent,
                    }}
                  >
                    {item.reaction.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span>FACS: {item.reaction.facsUnits.split('(')[0]}</span>
                  <span className="text-cyber-cyan font-bold">
                    {item.reaction.durationMs / 1000}s
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
