'use client';

import React, { useState } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import { 
  Cpu, 
  Dices, 
  Lock, 
  Unlock, 
  Sliders, 
  Copy, 
  Check, 
  Sparkles, 
  Flame, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export type DiffusionEngine = 'flux_schnell' | 'flux_dev' | 'sdxl_lora' | 'minimax_image';

export interface DiffusionConfig {
  engine: DiffusionEngine;
  seed: number;
  isSeedLocked: boolean;
  steps: number;
  guidanceScale: number; // CFG
  sampler: string;
  loraStrength: number;
  denoiseStrength: number;
}

interface DiffusionParamsInspectorProps {
  onConfigChange?: (config: DiffusionConfig) => void;
}

export default function DiffusionParamsInspector({
  onConfigChange,
}: DiffusionParamsInspectorProps) {
  const { avatars, selectedAvatarId, updateAvatar } = useAvatarStore();
  const selectedAvatar = avatars.find((a) => a.id === selectedAvatarId);

  const initialSeed = selectedAvatar?.face.diffusionSeed || 428912301;

  const [config, setConfig] = useState<DiffusionConfig>({
    engine: 'flux_dev',
    seed: initialSeed,
    isSeedLocked: true,
    steps: 28,
    guidanceScale: 3.5,
    sampler: 'FlowMatch Euler',
    loraStrength: 0.85,
    denoiseStrength: 0.45,
  });

  const [copiedPayload, setCopiedPayload] = useState(false);

  const updateConfig = (updates: Partial<DiffusionConfig>) => {
    const updated = { ...config, ...updates };
    setConfig(updated);
    if (onConfigChange) onConfigChange(updated);

    if (updates.seed !== undefined && selectedAvatar) {
      updateAvatar(selectedAvatar.id, {
        face: {
          ...selectedAvatar.face,
          diffusionSeed: updates.seed,
        },
      });
    }
  };

  const handleRandomizeSeed = () => {
    const newSeed = Math.floor(Math.random() * 4294967295);
    updateConfig({ seed: newSeed });
    toast.info('Seed Aleatória Forjada', `Nova semente de difusão: ${newSeed}`);
  };

  const handleCopyApiPayload = () => {
    const payload = JSON.stringify(
      {
        model: config.engine,
        seed: config.seed,
        steps: config.steps,
        guidance_scale: config.guidanceScale,
        sampler: config.sampler,
        lora_weights: {
          face_dna_consistency: config.loraStrength,
        },
        denoise: config.denoiseStrength,
      },
      null,
      2
    );
    navigator.clipboard.writeText(payload);
    setCopiedPayload(true);
    toast.success('Payload JSON Copiado!', 'Estrutura pronta para chamada na API Central.');
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              Inspetor de Seeds & Parâmetros de Difusão
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan">
                Flux / SDXL LoRA
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              Controle de amostragem determinística para consistência fotográfica
            </p>
          </div>
        </div>

        {/* Engine Selector Pills */}
        <div className="flex items-center p-1 bg-obsidian-950 border border-white/10 rounded-xl text-[10px]">
          <button
            type="button"
            onClick={() => updateConfig({ engine: 'flux_dev', steps: 28, guidanceScale: 3.5 })}
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              config.engine === 'flux_dev'
                ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Flux.1 Dev
          </button>
          <button
            type="button"
            onClick={() => updateConfig({ engine: 'flux_schnell', steps: 4, guidanceScale: 1.0 })}
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              config.engine === 'flux_schnell'
                ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Schnell (Turbo)
          </button>
          <button
            type="button"
            onClick={() => updateConfig({ engine: 'sdxl_lora', steps: 35, guidanceScale: 6.5 })}
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              config.engine === 'sdxl_lora'
                ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SDXL LoRA
          </button>
        </div>
      </div>

      {/* Seed Controls Row */}
      <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 flex items-center gap-1.5 font-bold">
            <Lock className="w-3.5 h-3.5 text-luxury-gold" /> Seed Imutável (Trava de Rosto):
          </span>
          <span className="text-[10px] text-slate-500">
            {config.isSeedLocked ? 'Trava Ativa (Determinístico)' : 'Semente Flutuante'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={config.seed}
            onChange={(e) => updateConfig({ seed: parseInt(e.target.value) || 0 })}
            className="flex-1 bg-obsidian-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyber-cyan font-bold focus:outline-none focus:border-cyber-cyan"
          />

          <button
            type="button"
            onClick={handleRandomizeSeed}
            title="Sortear Nova Semente"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-colors cursor-pointer"
          >
            <Dices className="w-4 h-4 text-cyber-cyan" />
            <span className="hidden sm:inline">Aleatória</span>
          </button>

          <button
            type="button"
            onClick={() => updateConfig({ isSeedLocked: !config.isSeedLocked })}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              config.isSeedLocked
                ? 'bg-luxury-gold/15 text-luxury-gold border-luxury-gold/30'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
            title={config.isSeedLocked ? 'Desbloquear Semente' : 'Travar Semente'}
          >
            {config.isSeedLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sampling Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Steps */}
        <div className="p-3 rounded-xl bg-obsidian-950/70 border border-white/5 space-y-1.5">
          <div className="flex justify-between text-slate-300">
            <span>Passos (Steps):</span>
            <strong className="text-cyber-cyan">{config.steps}</strong>
          </div>
          <input
            type="range"
            min="4"
            max="50"
            value={config.steps}
            onChange={(e) => updateConfig({ steps: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-obsidian-850 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
          />
          <span className="text-[9px] text-slate-500 block">Qualidade de Amostragem</span>
        </div>

        {/* Guidance / CFG */}
        <div className="p-3 rounded-xl bg-obsidian-950/70 border border-white/5 space-y-1.5">
          <div className="flex justify-between text-slate-300">
            <span>CFG / Guidance:</span>
            <strong className="text-luxury-gold">{config.guidanceScale.toFixed(1)}</strong>
          </div>
          <input
            type="range"
            min="1.0"
            max="8.0"
            step="0.1"
            value={config.guidanceScale}
            onChange={(e) => updateConfig({ guidanceScale: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-obsidian-850 rounded-lg appearance-none cursor-pointer accent-luxury-gold"
          />
          <span className="text-[9px] text-slate-500 block">Aderência Estrita ao Prompt</span>
        </div>

        {/* LoRA Consistency */}
        <div className="p-3 rounded-xl bg-obsidian-950/70 border border-white/5 space-y-1.5">
          <div className="flex justify-between text-slate-300">
            <span>Força LoRA Face:</span>
            <strong className="text-emerald-400">{(config.loraStrength * 100).toFixed(0)}%</strong>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.2"
            step="0.05"
            value={config.loraStrength}
            onChange={(e) => updateConfig({ loraStrength: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-obsidian-850 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <span className="text-[9px] text-slate-500 block">Fidelidade ao Face DNA</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-1 text-[11px]">
        <span className="text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Sampler: <strong className="text-slate-300">{config.sampler}</strong>
        </span>

        <button
          type="button"
          onClick={handleCopyApiPayload}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-colors cursor-pointer"
        >
          {copiedPayload ? <Check className="w-3.5 h-3.5 text-cyber-cyan" /> : <Copy className="w-3.5 h-3.5" />}
          {copiedPayload ? 'JSON Copiado!' : 'Copiar Payload JSON'}
        </button>
      </div>
    </div>
  );
}
