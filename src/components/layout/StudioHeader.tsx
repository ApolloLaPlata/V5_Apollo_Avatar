'use client';

import React from 'react';
import Apollo5RocketLogo from '@/components/ui/Apollo5RocketLogo';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  Plus,
  Radio,
  Layers,
  Sparkles,
  HelpCircle,
  Send,
  Music,
  Clapperboard,
  DollarSign,
  ExternalLink,
  Gamepad2,
  ShoppingBag
} from 'lucide-react';

const APOLLO_BRIDGE_LINKS = [
  { name: 'Broadcaster Live', port: ':3008', url: 'http://localhost:3008', icon: Radio, color: 'text-sky-400 border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20' },
  { name: 'Games 9:16', port: ':3012', url: 'http://localhost:3012', icon: Gamepad2, color: 'text-pink-400 border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20' },
  { name: 'Sound Studio', port: ':3005', url: 'http://localhost:3005', icon: Music, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20' },
  { name: 'Poster Social', port: ':3011', url: 'http://localhost:3011', icon: Send, color: 'text-rose-400 border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20' },
  { name: 'Pocket Director', port: ':3007', url: 'http://localhost:3007', icon: Clapperboard, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20' },
  { name: 'Finders', port: ':3001', url: 'http://localhost:3001', icon: ShoppingBag, color: 'text-rose-400 border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20' },
  { name: 'AutoBlog', port: ':3002', url: 'http://localhost:3002', icon: Sparkles, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20' },
  { name: 'Finance Hub', port: ':3009', url: 'http://localhost:3009', icon: DollarSign, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20' },
  { name: 'Tools', port: ':3014', url: 'http://localhost:3014', icon: Layers, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20' },
];

interface StudioHeaderProps {
  onOpenCreateModal?: () => void;
}

export default function StudioHeader({ onOpenCreateModal }: StudioHeaderProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const selectedAvatar = avatars.find((a) => a.id === selectedAvatarId);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-obsidian-950/85 backdrop-blur-xl">
      {/* Apollo Bridge Holding Federation Bar */}
      <div className="border-b border-white/5 bg-black/40 px-4 sm:px-6 py-1.5 flex items-center justify-between text-[11px] overflow-x-auto gap-3">
        <div className="flex items-center gap-2 font-mono text-slate-400 shrink-0">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-slate-300">Apollo Bridge (Holding V5):</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {APOLLO_BRIDGE_LINKS.map((b) => {
            const Icon = b.icon;
            return (
              <a
                key={b.name}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[10px] font-mono font-semibold transition-all ${b.color}`}
              >
                <Icon className="w-3 h-3" />
                <span>{b.name}</span>
                <span className="opacity-70">{b.port}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-50" />
              </a>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Apollo5RocketLogo size="sm" showText={true} />
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-[10px] font-mono text-cyber-cyan font-bold uppercase tracking-wider">
            Capitania #12 · :3010
          </span>
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
