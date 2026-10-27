'use client';

import React, { useState, useEffect } from 'react';
import {
  AvatarEnergyConfig,
  EnergyLevelPreset,
} from '@/types/avatar';
import {
  CANONICAL_ENERGY_PRESETS,
  DEFAULT_ENERGY_CONFIG,
  calculateDerivedParameters,
  calculateAudioReactiveEnergy,
  DerivedIdleParameters,
} from '@/utils/avatarEnergyModulator';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  Zap,
  Flame,
  Volume2,
  Sliders,
  Sparkles,
  Wind,
  Eye,
  Compass,
  Check,
  Save,
  RotateCcw,
  Activity,
  Layers,
  Radio,
} from 'lucide-react';

interface AvatarEnergyModulatorPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function AvatarEnergyModulatorPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
}: AvatarEnergyModulatorPanelProps) {
  const { avatars, updateAvatar } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId) || avatars[0];

  const initialConfig: AvatarEnergyConfig =
    currentAvatar?.rigging?.energyConfig || DEFAULT_ENERGY_CONFIG;

  const [config, setConfig] = useState<AvatarEnergyConfig>(initialConfig);
  const [simulatedVuLevel, setSimulatedVuLevel] = useState<number>(0);
  const [isSimulatingAudio, setIsSimulatingAudio] = useState<boolean>(false);

  // Simulação de oscilação natural de áudio / VU meter
  useEffect(() => {
    if (!isSimulatingAudio) {
      setSimulatedVuLevel(0);
      return;
    }

    const interval = setInterval(() => {
      // Flutuação orgânica de volume de fala entre 20% e 85%
      const randVu = Math.floor(25 + Math.random() * 60);
      setSimulatedVuLevel(randVu);
    }, 180);

    return () => clearInterval(interval);
  }, [isSimulatingAudio]);

  // Energia efetiva (base + boost de áudio)
  const effectiveEnergy = config.audioReactive
    ? calculateAudioReactiveEnergy(config.energyLevel, simulatedVuLevel, config.sensitivity)
    : config.energyLevel;

  const derived: DerivedIdleParameters = calculateDerivedParameters(effectiveEnergy);

  const handleSelectPreset = (presetKey: EnergyLevelPreset) => {
    const p = CANONICAL_ENERGY_PRESETS[presetKey];
    setConfig({
      ...config,
      energyLevel: p.energyLevel,
      preset: p.id,
    });
    toast.info(`Nível de Energia: ${p.label}`, `${p.energyLevel}% de vitalidade ativa.`);
  };

  // Aplica e sincroniza simultaneamente todos os 3 módulos do avatar
  const handleApplyAndSyncAllSubsystems = () => {
    if (!currentAvatar) return;

    updateAvatar(avatarId, {
      rigging: {
        ...currentAvatar.rigging,
        idleMotionIntensity: effectiveEnergy,
        energyConfig: config,
        breathingConfig: {
          bpm: derived.bpm,
          amplitudeYPercent: derived.breathingAmplitudeYPercent,
          shoulderExpansionXPercent: derived.shoulderExpansionXPercent,
          anchorPoint: currentAvatar?.rigging?.breathingConfig?.anchorPoint || 'center_bottom',
          preset: 'custom',
          isActive: true,
        },
        eyeBlinkConfig: {
          intervalMin: derived.blinkIntervalMin,
          intervalMax: derived.blinkIntervalMax,
          blinkDurationMs: derived.blinkDurationMs,
          doubleBlinkProbability: derived.doubleBlinkProbability,
          preset: 'custom',
          isActive: true,
        },
        headTiltConfig: {
          maxRollDeg: derived.headTiltMaxRollDeg,
          maxPitchDeg: derived.headTiltMaxPitchDeg,
          maxYawDeg: derived.headTiltMaxYawDeg,
          transitionDurationSeconds: derived.headTiltTransitionSeconds,
          dwellTimeSeconds: derived.headTiltDwellSeconds,
          preset: 'custom',
          isActive: true,
        },
      },
    });

    toast.success(
      'Ecossistema Sincronizado!',
      `Respiração (${derived.bpm} BPM), Piscadas (${derived.blinkDurationMs}ms) e Head Tilts (Roll ±${derived.headTiltMaxRollDeg}º) modulados em ${effectiveEnergy}%.`
    );
  };

  const currentPresetDef = CANONICAL_ENERGY_PRESETS[config.preset] || CANONICAL_ENERGY_PRESETS.custom;

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.15)]">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Modulador de Dinâmica e Frequência por Nível de Energia
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30">
                Fase 7 · Etapa 066
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Controle mestre de vitalidade (0 a 100%) que orquestra respiração, piscadas e inclinações simultâneas
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsSimulatingAudio(!isSimulatingAudio)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              isSimulatingAudio
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                : 'bg-obsidian-900 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            {isSimulatingAudio ? 'VU Simulado ON' : 'Simular Áudio'}
          </button>

          <button
            onClick={handleApplyAndSyncAllSubsystems}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-obsidian-950 font-bold text-xs shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            Sincronizar Todos os Módulos
          </button>
        </div>
      </div>

      {/* Master Energy Slider com Gradiente Térmico */}
      <div className="p-5 rounded-2xl bg-obsidian-900/60 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-slate-200">
              Nível Mestre de Energia & Expressividade:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-orange-300">
              {config.energyLevel}% Base
            </span>
            {config.audioReactive && simulatedVuLevel > 0 && (
              <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                +{(effectiveEnergy - config.energyLevel)}% VU Boost ({effectiveEnergy}%)
              </span>
            )}
          </div>
        </div>

        {/* Slider Master com Trilha de Gradiente */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={config.energyLevel}
            onChange={(e) =>
              setConfig({
                ...config,
                energyLevel: Number(e.target.value),
                preset: 'custom',
              })
            }
            className="w-full h-3 bg-gradient-to-r from-blue-600 via-cyan-500 via-amber-500 to-rose-600 rounded-lg appearance-none cursor-pointer accent-white shadow-inner"
          />
          <div className="flex justify-between text-[9px] text-slate-400 font-mono pt-1">
            <span>0% (Repouso Zen)</span>
            <span>25% (Calmo)</span>
            <span>50% (Equilibrado)</span>
            <span>75% (Entusiasmado)</span>
            <span>100% (Hiperativo)</span>
          </div>
        </div>

        {/* 4 Presets de Nível de Energia */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {(Object.keys(CANONICAL_ENERGY_PRESETS) as EnergyLevelPreset[])
            .filter((k) => k !== 'custom')
            .map((presetKey) => {
              const p = CANONICAL_ENERGY_PRESETS[presetKey];
              const isSelected = config.preset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(presetKey)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? `${p.badgeColor} ${p.borderColor} ${p.color} shadow-[0_0_12px_rgba(249,115,22,0.2)]`
                      : 'bg-obsidian-950 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold block">{p.label}</span>
                    <span className="text-[10px] font-mono font-bold block opacity-90">
                      {p.energyLevel}% Energia
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 mt-2 line-clamp-2">
                    {p.description}
                  </span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Reatividade Acústica Dinâmica (Simulador de Áudio) */}
      <div className="p-4 rounded-xl bg-obsidian-900/40 border border-white/5 space-y-3 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-cyber-cyan" />
            <span className="text-slate-200 font-bold">
              Reatividade Acústica Dinâmica (V5 Sound / Microfone)
            </span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.audioReactive}
              onChange={(e) => setConfig({ ...config, audioReactive: e.target.checked })}
              className="accent-cyber-cyan rounded"
            />
            <span className="text-[11px] text-slate-300">Modular com a Voz</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Sensibilidade ao Volume:</span>
              <span className="text-cyber-cyan font-bold font-mono">Nível {config.sensitivity}</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={config.sensitivity}
              onChange={(e) => setConfig({ ...config, sensitivity: Number(e.target.value) })}
              className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">VU Meter Instantâneo:</span>
              <span className="text-amber-400 font-mono font-bold">{simulatedVuLevel}% dBFS</span>
            </div>
            <div className="w-full bg-obsidian-950 rounded-full h-2.5 overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-150"
                style={{ width: `${simulatedVuLevel}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard dos 3 Subsistemas Modulados em Tempo Real */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1: Respiração */}
        <div className="p-3.5 rounded-xl bg-obsidian-900/60 border border-white/5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-cyan-300 font-bold pb-1.5 border-b border-white/5">
            <span className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5" />
              Respiração Modulada
            </span>
            <span className="font-mono text-[10px]">{derived.bpm} BPM</span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Ciclo Completo:</span>
              <span className="font-mono text-slate-200">{(60 / derived.bpm).toFixed(1)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Elevação Torácica:</span>
              <span className="font-mono text-slate-200">{derived.breathingAmplitudeYPercent}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Expansão Ombros:</span>
              <span className="font-mono text-slate-200">{derived.shoulderExpansionXPercent}%</span>
            </div>
          </div>
        </div>

        {/* Card 2: Piscadas */}
        <div className="p-3.5 rounded-xl bg-obsidian-900/60 border border-white/5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-purple-300 font-bold pb-1.5 border-b border-white/5">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              Piscadas Moduladas
            </span>
            <span className="font-mono text-[10px]">{derived.blinkDurationMs}ms</span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Janela de Intervalo:</span>
              <span className="font-mono text-slate-200">{derived.blinkIntervalMin}s a {derived.blinkIntervalMax}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Velocidade da Pálpebra:</span>
              <span className="font-mono text-slate-200">{derived.blinkDurationMs}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Piscadas Duplas:</span>
              <span className="font-mono text-purple-300 font-bold">{(derived.doubleBlinkProbability * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Card 3: Head Tilts */}
        <div className="p-3.5 rounded-xl bg-obsidian-900/60 border border-white/5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-indigo-300 font-bold pb-1.5 border-b border-white/5">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Head Tilts Modulados
            </span>
            <span className="font-mono text-[10px]">±{derived.headTiltMaxRollDeg}º</span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Velocidade de Transição:</span>
              <span className="font-mono text-slate-200">{derived.headTiltTransitionSeconds}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tempo de Permanência:</span>
              <span className="font-mono text-slate-200">{derived.headTiltDwellSeconds}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Amplitude Roll / Yaw:</span>
              <span className="font-mono text-indigo-300 font-bold">±{derived.headTiltMaxRollDeg}º / ±{derived.headTiltMaxYawDeg}º</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
