'use client';

import React, { useState } from 'react';
import {
  CANONICAL_SOCIAL_CHANNELS,
  CANONICAL_SCENARIOS,
  generateSocialReply,
  SocialChannel,
  SocialScenario,
} from '@/utils/socialRepliesEngine';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  MessageCircle,
  Send,
  Copy,
  Check,
  Sparkles,
  RotateCcw,
  Share2,
  ThumbsUp,
  Heart,
  MessageSquare,
  CheckCheck,
} from 'lucide-react';

interface SocialRepliesSimulatorPanelProps {
  avatarId?: string;
  avatarName?: string;
  avatarUrl?: string;
}

export default function SocialRepliesSimulatorPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
  avatarUrl,
}: SocialRepliesSimulatorPanelProps) {
  const { avatars } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId) || avatars[0];

  const [activeChannel, setActiveChannel] = useState<SocialChannel>('instagram_direct');
  const [userQuery, setUserQuery] = useState<string>(CANONICAL_SCENARIOS[1].userQuery);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const channelConfig = CANONICAL_SOCIAL_CHANNELS[activeChannel];

  const currentReply = generateSocialReply(currentAvatar, activeChannel, userQuery);

  const handleSelectScenario = (scen: SocialScenario) => {
    setActiveChannel(scen.targetChannel);
    setUserQuery(scen.userQuery);
    toast.info('Cenário Carregado', `Pergunta: "${scen.title}".`);
  };

  const handleCopyReply = () => {
    navigator.clipboard.writeText(currentReply.replyText);
    setCopiedText(true);
    toast.success('Resposta Copiada!', 'Texto pronto para envio nas redes sociais.');
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.info('Resposta Regenerada', 'Inflexão ajustada para as diretrizes da persona.');
    }, 350);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/30 shadow-[0_0_12px_rgba(236,72,153,0.15)]">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Simulador de Respostas Curtas para Redes Sociais
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${channelConfig.uiStyle.badgeColor}`}>
                {channelConfig.name}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Adaptação dinâmica de tamanho, tom e vocabulário para engajamento em Directs, YouTube e TikTok
            </p>
          </div>
        </div>

        {/* Botão de Copiar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReply}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs border border-white/10 transition-colors"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Resposta</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Seletor de Redes Sociais */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {(Object.keys(CANONICAL_SOCIAL_CHANNELS) as SocialChannel[]).map((chanKey) => {
          const cfg = CANONICAL_SOCIAL_CHANNELS[chanKey];
          const isSelected = activeChannel === chanKey;

          return (
            <button
              key={chanKey}
              onClick={() => setActiveChannel(chanKey)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                isSelected
                  ? `${cfg.uiStyle.badgeColor} border font-bold shadow-[0_0_10px_rgba(255,255,255,0.1)]`
                  : 'bg-black/30 text-slate-400 hover:text-slate-200 border border-white/10'
              }`}
            >
              <span>{cfg.name}</span>
            </button>
          );
        })}
      </div>

      {/* Cenários Rápidos de Simulação */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyber-gold" />
          Cenários Típicos de Dúvidas de Seguidores:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CANONICAL_SCENARIOS.map((scen) => (
            <button
              key={scen.id}
              onClick={() => handleSelectScenario(scen)}
              className={`p-2 rounded-lg text-left text-[11px] border transition-colors truncate ${
                userQuery === scen.userQuery
                  ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan font-bold'
                  : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/20'
              }`}
            >
              {scen.title}
            </button>
          ))}
        </div>
      </div>

      {/* Pergunta do Seguidor (Input) */}
      <div className="space-y-1.5">
        <label className="text-xs text-slate-300 font-bold flex items-center justify-between">
          <span>Mensagem ou Comentário Recebido:</span>
          <span className="text-[10px] text-slate-500 font-normal">Pressione Enter ou clique em Gerar</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Digite qualquer mensagem que um seguidor enviaria..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-slate-100 text-xs focus:border-pink-500 font-sans"
          />
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-xs font-bold border border-pink-500/40 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Gerando...' : 'Gerar'}</span>
          </button>
        </div>
      </div>

      {/* Mockup Visual de Chat da Rede Social */}
      <div className="p-5 rounded-2xl bg-black/70 border border-white/15 space-y-4">
        {/* Cabeçalho do Mockup */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-200">Simulação Live: {channelConfig.platform}</span>
          </div>
          <span className="text-[10px] text-slate-500">{channelConfig.toneGuideline}</span>
        </div>

        {/* Balão 1: Seguidor (Esquerda) */}
        <div className="flex items-start gap-2.5 max-w-[85%]">
          <div className="w-7 h-7 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
            @
          </div>
          <div className="p-3 rounded-2xl rounded-tl-sm bg-white/10 border border-white/10 text-xs text-slate-200 font-sans leading-relaxed">
            {userQuery}
          </div>
        </div>

        {/* Balão 2: Avatar (Direita) */}
        <div className="flex items-start gap-2.5 max-w-[88%] ml-auto flex-row-reverse">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={avatarName}
              className="w-8 h-8 rounded-full object-cover border border-pink-500/40 shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-xs font-bold text-pink-300 shrink-0">
              {avatarName.charAt(0)}
            </div>
          )}

          <div
            className={`p-3.5 rounded-2xl rounded-tr-sm text-xs font-sans leading-relaxed ${channelConfig.uiStyle.bgBubble} ${channelConfig.uiStyle.textBubble} shadow-lg`}
          >
            {isGenerating ? (
              <span className="animate-pulse text-slate-400">Digitando resposta...</span>
            ) : (
              currentReply.replyText
            )}
          </div>
        </div>

        {/* Rodapé com Métrica de Caracteres */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className={currentReply.withinLimit ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {currentReply.characterCount} / {channelConfig.maxRecommendedChars} caracteres
            </span>
            <span>·</span>
            <span className="text-slate-500">
              {currentReply.withinLimit ? '✓ Dentro do limite recomendado da plataforma' : '⚠️ Excede limite ideal'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-[10px]">
            <span>Densidade de Emojis: {channelConfig.emojiDensity.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
