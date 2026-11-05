'use client';

import React, { useState } from 'react';
import { Avatar, ChannelBinding } from '@/types/avatar';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  X,
  Tv,
  Check,
  Youtube,
  Instagram,
  Radio,
  ShoppingBag,
  GraduationCap,
  Sparkles,
  Layers,
} from 'lucide-react';

interface ChannelBindingModalProps {
  avatar: Avatar;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChannelBindingModal({
  avatar,
  isOpen,
  onClose,
}: ChannelBindingModalProps) {
  const { updateAvatar } = useAvatarStore();

  const currentBinding = avatar.channelBinding || {
    id: `ch_${Date.now()}`,
    channelName: `${avatar.name} Oficial`,
    channelType: 'instagram_creator',
    channelHandle: `@${avatar.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.v5`,
    targetAudience: 'Público consumidor de conteúdo digital 18-35 anos',
    contentPillar: avatar.tagline,
    publicationFrequency: 'daily',
    totalVideosProduced: 12,
    totalAudiosSynthesized: 34,
    totalTurnaroundAngles: 4,
  };

  const [channelName, setChannelName] = useState(currentBinding.channelName);
  const [channelHandle, setChannelHandle] = useState(currentBinding.channelHandle);
  const [channelType, setChannelType] = useState<ChannelBinding['channelType']>(currentBinding.channelType);
  const [targetAudience, setTargetAudience] = useState(currentBinding.targetAudience);
  const [contentPillar, setContentPillar] = useState(currentBinding.contentPillar);
  const [publicationFrequency, setPublicationFrequency] = useState<ChannelBinding['publicationFrequency']>(
    currentBinding.publicationFrequency
  );

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedBinding: ChannelBinding = {
      ...currentBinding,
      channelName: channelName.trim() || `${avatar.name} Oficial`,
      channelHandle: channelHandle.trim().startsWith('@') ? channelHandle.trim() : `@${channelHandle.trim()}`,
      channelType,
      targetAudience: targetAudience.trim(),
      contentPillar: contentPillar.trim(),
      publicationFrequency,
    };

    updateAvatar(avatar.id, {
      channelBinding: updatedBinding,
    });

    toast.success(
      'Canal Vinculado Atualizado!',
      `${avatar.name} agora está oficialmente vinculado ao canal ${updatedBinding.channelName}.`
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-obsidian-950 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Vincular Canal & Emissora</h3>
              <p className="text-xs text-slate-400">
                Conecte <strong className="text-cyber-cyan">{avatar.name}</strong> a um canal oficial de publicação.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          {/* Tipo de Plataforma / Canal */}
          <div className="space-y-1.5">
            <label className="font-mono text-slate-300 block">Tipo de Canal / Formato:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'instagram_creator', label: 'Instagram Creator', icon: Instagram },
                { id: 'dark_youtube', label: 'Dark YouTube', icon: Youtube },
                { id: 'tiktok_ugc', label: 'TikTok UGC', icon: ShoppingBag },
                { id: 'radio_24h', label: 'Rádio 24h / Live', icon: Radio },
                { id: 'educational', label: 'Educacional', icon: GraduationCap },
                { id: 'vsl_sales', label: 'VSL / Vendas', icon: Sparkles },
              ].map((plat) => {
                const Icon = plat.icon;
                const isSelected = channelType === plat.id;
                return (
                  <button
                    key={plat.id}
                    type="button"
                    onClick={() => setChannelType(plat.id as any)}
                    className={`p-2 rounded-xl border flex items-center gap-2 transition-all text-left ${
                      isSelected
                        ? 'bg-purple-600/25 border-purple-400 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{plat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nome do Canal & Handle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-slate-300 block mb-1">Nome do Canal:</label>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="Ex: Maya Vance • Tech & IA"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyber-cyan"
              />
            </div>

            <div>
              <label className="font-mono text-slate-300 block mb-1">Handle / @ do Canal:</label>
              <input
                type="text"
                value={channelHandle}
                onChange={(e) => setChannelHandle(e.target.value)}
                placeholder="Ex: @mayavance.ia"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyber-cyan"
              />
            </div>
          </div>

          {/* Pilar de Conteúdo */}
          <div>
            <label className="font-mono text-slate-300 block mb-1">Pilar Principal de Conteúdo:</label>
            <input
              type="text"
              value={contentPillar}
              onChange={(e) => setContentPillar(e.target.value)}
              placeholder="Ex: Tutoriais práticos de ferramentas de IA e dicas de produtividade"
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyber-cyan"
            />
          </div>

          {/* Público-Alvo & Frequência */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-slate-300 block mb-1">Público-Alvo:</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Ex: Criadores de conteúdo e profissionais de tecnologia"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyber-cyan"
              />
            </div>

            <div>
              <label className="font-mono text-slate-300 block mb-1">Frequência de Publicação:</label>
              <select
                value={publicationFrequency}
                onChange={(e) => setPublicationFrequency(e.target.value as any)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyber-cyan"
              >
                <option value="daily">Diária (7 vídeos por semana)</option>
                <option value="weekly">Semanal (2 a 3 vídeos por semana)</option>
                <option value="24_7_live">Transmissão 24/7 (Live Contínua)</option>
              </select>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Salvar Vínculo</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
