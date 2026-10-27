'use client';

import React, { memo, useCallback } from 'react';
import { AvatarProfile } from '@/types/avatar';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import { 
  ScanEye, 
  Mic, 
  Bot, 
  Copy, 
  Trash2, 
  Sparkles, 
  Check, 
  Radio, 
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface AvatarCardProps {
  avatar: AvatarProfile;
  isSelected?: boolean;
  onSelect?: () => void;
}

const AvatarCard = memo(function AvatarCard({ avatar, isSelected, onSelect }: AvatarCardProps) {
  const { duplicateAvatar, deleteAvatar, selectAvatar } = useAvatarStore();

  const handleSelect = useCallback(() => {
    if (onSelect) onSelect();
    else selectAvatar(avatar.id);
    toast.info('Avatar Selecionado', avatar.name, 2000);
  }, [onSelect, selectAvatar, avatar.id, avatar.name]);

  const handleDuplicate = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const dup = duplicateAvatar(avatar.id);
    if (dup) {
      toast.info('Avatar Clonado', `${dup.name} foi adicionado ao acervo.`, 2500);
    }
  }, [duplicateAvatar, avatar.id]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Tem certeza que deseja remover o avatar "${avatar.name}" do Registro Civil?`)) {
      deleteAvatar(avatar.id);
      toast.warning('Avatar Removido', `${avatar.name} foi excluído do acervo.`, 2500);
    }
  }, [deleteAvatar, avatar.id, avatar.name]);

  return (
    <div
      onClick={handleSelect}
      className={`glass-card relative rounded-2xl p-5 cursor-pointer group transition-all duration-300 ${
        isSelected
          ? 'ring-2 ring-cyber-cyan border-cyber-cyan/50 shadow-glow-cyan bg-obsidian-850/90'
          : 'hover:border-white/20 hover:bg-obsidian-900/90'
      }`}
    >
      {/* Holographic Top Flare */}
      <div className={`absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent ${
        isSelected ? 'via-cyber-cyan' : 'via-white/20 group-hover:via-cyber-cyan/60'
      } to-transparent transition-all duration-500`} />

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Avatar Image & Angle Anchor Preview */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-white/10 bg-obsidian-950 relative shadow-lg group-hover:shadow-glow-cyan transition-all">
            <img
              src={avatar.avatarUrl}
              alt={avatar.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {isSelected && (
              <div className="absolute inset-0 bg-cyber-cyan/10 pointer-events-none border-2 border-cyber-cyan rounded-xl" />
            )}
            {/* Status Live Tag */}
            {avatar.channel.isLiveActive && (
              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-rose-500 text-white font-mono text-[9px] font-black uppercase flex items-center gap-1 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                AO VIVO
              </span>
            )}
          </div>

          {/* Archetype Indicator */}
          {avatar.soul.archetype && (
            <span className="mt-1 block text-center text-[10px] font-mono text-slate-400 capitalize bg-white/5 py-0.5 rounded-md border border-white/5">
              {avatar.soul.archetype}
            </span>
          )}
        </div>

        {/* Content Details */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-bold text-base transition-colors truncate ${
                  isSelected ? 'text-cyber-cyan' : 'text-slate-100 group-hover:text-cyber-cyan'
                }`}>
                  {avatar.name}
                </h3>
                {isSelected && (
                  <span className="flex items-center text-[10px] text-cyber-cyan font-mono font-bold bg-cyber-cyan/10 px-2 py-0.5 rounded-full border border-cyber-cyan/30">
                    <Check className="w-3 h-3 mr-0.5" /> Selecionado
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-snug line-clamp-2 mt-0.5">
                {avatar.tagline}
              </p>
            </div>

            {/* Type Badge */}
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyber-cyan font-bold border border-cyan-500/20 uppercase shrink-0">
              {avatar.type}
            </span>
          </div>

          {/* Bio Preview */}
          <p className="text-[11px] text-slate-400/90 line-clamp-2 italic">
            "{avatar.soul.bio}"
          </p>

          {/* Core DNA Capabilities Badges */}
          <div className="pt-2 border-t border-white/5 grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400">
            {/* Voice Pillar */}
            <div className="flex items-center gap-1.5 bg-obsidian-950/60 px-2 py-1 rounded-md border border-white/5 truncate">
              <Mic className="w-3 h-3 text-purple-400 shrink-0" />
              <span className="truncate text-slate-300 font-medium">
                {avatar.voice.engine.toUpperCase()}
              </span>
            </div>

            {/* Face Turnaround Pillar */}
            <div className="flex items-center gap-1.5 bg-obsidian-950/60 px-2 py-1 rounded-md border border-white/5 truncate">
              <ScanEye className="w-3 h-3 text-cyber-cyan shrink-0" />
              <span className="truncate text-slate-300 font-medium">
                360º Sheet
              </span>
            </div>

            {/* Webhook Channel Pillar */}
            <div className="flex items-center gap-1.5 bg-obsidian-950/60 px-2 py-1 rounded-md border border-white/5 truncate">
              <Bot className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate text-slate-300 font-medium">
                {avatar.channel.totalConversations || 0} msgs
              </span>
            </div>
          </div>

          {/* Actions & Ecosystem Sync Footer */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
              <span>Sincronia:</span>
              <span className={avatar.syncedSites.broadcaster ? 'text-cyber-cyan' : 'text-slate-600'}>B</span>
              <span>·</span>
              <span className={avatar.syncedSites.prisma ? 'text-purple-400' : 'text-slate-600'}>P</span>
              <span>·</span>
              <span className={avatar.syncedSites.sound ? 'text-amber-400' : 'text-slate-600'}>S</span>
              <span>·</span>
              <span className={avatar.syncedSites.finders ? 'text-emerald-400' : 'text-slate-600'}>F</span>
            </div>

            {/* Card Buttons */}
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleDuplicate}
                title="Clonar Avatar"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDelete}
                title="Excluir Avatar"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AvatarCard;
