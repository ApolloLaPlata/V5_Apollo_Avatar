'use client';

import React from 'react';
import Apollo5RocketLogo from '@/components/ui/Apollo5RocketLogo';
import { useAvatarStore, StudioViewMode } from '@/store/useAvatarStore';
import { 
  ScanEye, 
  Accessibility, 
  Smile, 
  Mic, 
  BrainCircuit, 
  Radio, 
  Plus, 
  Sparkles,
  Layers,
  Activity,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface StudioHeaderProps {
  onOpenCreateModal?: () => void;
}

export default function StudioHeader({ onOpenCreateModal }: StudioHeaderProps) {
  const { 
    avatars, 
    selectedAvatarId, 
    activeMode, 
    setActiveMode,
    resetToDefaults 
  } = useAvatarStore();

  const selectedAvatar = avatars.find((a) => a.id === selectedAvatarId);

  const MODES: { id: StudioViewMode; label: string; icon: React.ElementType }[] = [
    { id: 'turnaround', label: 'Turnaround 360º', icon: ScanEye },
    { id: 't-pose', label: 'T-Pose & Rigging', icon: Accessibility },
    { id: 'expression', label: 'Expressões & Visemas', icon: Smile },
    { id: 'voice', label: 'DNA Vocal', icon: Mic },
    { id: 'soul', label: 'Soul & Lore', icon: BrainCircuit },
    { id: 'live', label: 'Conector Live OBS', icon: Radio },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 glass-panel">
      {/* Top Banner / Telemetry Row */}
      <div className="px-4 py-1.5 bg-obsidian-950/80 border-b border-white/5 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyber-cyan">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan -ml-3.5" />
            CAPITANIA #12 ATIVA · PORTA :3010
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
            <Activity className="w-3 h-3 text-cyber-cyan" />
            Soberania Digital: 100% Offline/Client-Side
          </span>
        </div>

        {/* Ecosystem Nodes Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/90 border border-white/5">
            <span className="text-slate-500">Holding:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Broadcaster
            </span>
            <span className="text-slate-700">·</span>
            <span className="text-cyan-400 font-bold">Prisma</span>
            <span className="text-slate-700">·</span>
            <span className="text-amber-400 font-bold">Sound</span>
          </div>
          <span className="hidden md:inline px-2 py-0.5 rounded bg-white/5 text-slate-300">
            {avatars.length} {avatars.length === 1 ? 'Personagem' : 'Personagens'}
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <Apollo5RocketLogo size="sm" />
          {selectedAvatar && (
            <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-white/10 text-xs">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-cyber-cyan/40 bg-slate-800">
                <img 
                  src={selectedAvatar.avatarUrl} 
                  alt={selectedAvatar.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-200 leading-tight">
                  {selectedAvatar.name}
                </span>
                <span className="text-[10px] text-cyber-cyan font-mono leading-tight">
                  {selectedAvatar.tagline.slice(0, 30)}...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* View Mode Navigation Pills */}
        <nav className="hidden lg:flex items-center p-1 bg-obsidian-950/90 border border-white/10 rounded-xl">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyber-cyan' : 'text-slate-400'}`} />
                {mode.label}
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {onOpenCreateModal && (
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-xs shadow-glow-cyan transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Novo Personagem</span>
            </button>
          )}

          <button
            onClick={() => {
              if (confirm('Deseja restaurar os personagens canônicos de fábrica?')) {
                resetToDefaults();
              }
            }}
            title="Restaurar Avatares Canônicos"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Mode Selector Row */}
      <div className="lg:hidden px-4 py-2 bg-obsidian-950 border-t border-white/5 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3 h-3" />
              {mode.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
