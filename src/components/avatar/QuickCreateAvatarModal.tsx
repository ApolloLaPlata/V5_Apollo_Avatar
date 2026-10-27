'use client';

import React, { useState } from 'react';
import { CANONICAL_ARCHETYPES, createAvatarFromArchetype, DetailedArchetypePreset } from '@/data/archetypes';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import { 
  X, 
  Sparkles, 
  User, 
  Mic, 
  ScanEye, 
  Bot, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  Flame,
  Zap
} from 'lucide-react';

interface QuickCreateAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickCreateAvatarModal({ isOpen, onClose }: QuickCreateAvatarModalProps) {
  const { addAvatar } = useAvatarStore();
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>(CANONICAL_ARCHETYPES[0].id);
  const [customName, setCustomName] = useState<string>('');

  if (!isOpen) return null;

  const selectedPreset = CANONICAL_ARCHETYPES.find((a) => a.id === selectedArchetypeId) || CANONICAL_ARCHETYPES[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newAvatar = createAvatarFromArchetype(selectedArchetypeId, customName.trim() || undefined);
    addAvatar(newAvatar);
    toast.success('Avatar Soberano Forjado!', `${newAvatar.name} registrado com sucesso no Registro Civil.`);
    setCustomName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-obsidian-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Forjar Novo Avatar Soberano
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30">
                  Capitania #12
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Selecione um arquétipo canônico para carregar instantaneamente os 4 pilares de DNA.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Archetype Selector Horizontal Grid */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              1. Selecione o Arquétipo Canônico
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {CANONICAL_ARCHETYPES.map((arch) => {
                const isSelected = arch.id === selectedArchetypeId;
                return (
                  <button
                    key={arch.id}
                    type="button"
                    onClick={() => setSelectedArchetypeId(arch.id)}
                    className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-cyber-cyan bg-cyber-cyan/15 shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                        : 'border-white/10 bg-obsidian-950/60 hover:border-white/25 hover:bg-white/5'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden mb-2 border border-white/10 relative">
                      <img 
                        src={arch.defaultImage} 
                        alt={arch.name} 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover" 
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-cyber-cyan/30 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 leading-tight line-clamp-1">
                      {arch.name.split(' (')[0]}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 capitalize mt-0.5">
                      {arch.archetype}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Archetype Preview Details Card */}
          <div className="p-4 rounded-2xl bg-obsidian-950/80 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <img
                src={selectedPreset.defaultImage}
                alt={selectedPreset.name}
                loading="lazy"
                decoding="async"
                className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0"
              />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-cyber-cyan">
                    {selectedPreset.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10 uppercase">
                    {selectedPreset.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedPreset.description}
                </p>
                <p className="text-[11px] text-slate-400 italic">
                  "{selectedPreset.sampleBio}"
                </p>
              </div>
            </div>

            {/* Pillar Snapshot */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-white/5 text-[10px] font-mono">
              <div className="p-2 rounded-lg bg-white/5 space-y-0.5">
                <span className="text-slate-500 block">Voz Motor</span>
                <span className="text-purple-300 font-bold">{selectedPreset.recommendedEngine.toUpperCase()}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 space-y-0.5">
                <span className="text-slate-500 block">Tom Vocal</span>
                <span className="text-amber-300 font-bold capitalize">{selectedPreset.recommendedTone}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 space-y-0.5">
                <span className="text-slate-500 block">Iluminação</span>
                <span className="text-cyber-cyan font-bold capitalize">{selectedPreset.lightingPreset.replace('_', ' ')}</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 space-y-0.5">
                <span className="text-slate-500 block">Bordão</span>
                <span className="text-emerald-300 truncate block">"{selectedPreset.catchphrases[0]}"</span>
              </div>
            </div>
          </div>

          {/* Form Configuration Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>2. Nome do Personagem</span>
              <span className="text-[10px] font-normal text-slate-500">Deixe em branco para usar o nome padrão</span>
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={`Ex: ${selectedPreset.name.split(' (')[0]}`}
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-white/10 bg-obsidian-900/60 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-xs shadow-glow-cyan transition-all cursor-pointer active:scale-95"
          >
            <Zap className="w-4 h-4 fill-obsidian-950" />
            Forjar Avatar Soberano
          </button>
        </div>
      </div>
    </div>
  );
}
