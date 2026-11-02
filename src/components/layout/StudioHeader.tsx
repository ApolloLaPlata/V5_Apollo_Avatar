'use client';

import React from 'react';
import Apollo5RocketLogo from '@/components/ui/Apollo5RocketLogo';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  Plus, Radio, Layers, Sparkles, HelpCircle
} from 'lucide-react';

interface StudioHeaderProps {
  onOpenCreateModal?: () => void;
}

export default function StudioHeader({ onOpenCreateModal }: StudioHeaderProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const selectedAvatar = avatars.find((a) => a.id === selectedAvatarId);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-obsidian-950/85 backdrop-blur-xl">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Apollo5RocketLogo size="sm" showText={true} />
          
        </div>

        {/* Center Nav / Links Rápidos */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-900/80 border border-white/10 rounded-xl text-xs font-medium">
          <a
            href="#studio"
            className="px-3.5 py-1.5 rounded-lg text-white bg-white/10 shadow-sm transition-all"
          >
            Estúdio 360°
          </a>
          <a
            href="#catalogo"
            className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all"
          >
            Catálogo ({avatars.length})
          </a>
          <a
            href="/live/overlay"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-cyan-400 transition-all flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5 text-blue-400" />
            <span>Overlay OBS</span>
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {selectedAvatar && (
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900/60 border border-white/10">
              <img
                src={selectedAvatar.avatarUrl}
                alt={selectedAvatar.name}
                className="w-5 h-5 rounded-full object-cover border border-white/20"
              />
              <span className="text-xs font-bold text-slate-200">{selectedAvatar.name}</span>
            </div>
          )}

          {onOpenCreateModal && (
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-obsidian-950 font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(0,229,255,0.25)] active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Novo Personagem</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
