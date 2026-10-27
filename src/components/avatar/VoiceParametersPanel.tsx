'use client';

import React, { useState, useEffect } from 'react';
import { VoiceEngine } from '@/types/avatar';
import {
  VoiceParameters,
  CANONICAL_VOICE_PRESETS,
  semitonesToMultiplier,
  multiplierToSemitones,
  getPitchClassification,
  getSpeedClassification,
  getStabilityClassification,
  getTemperatureClassification,
  calculateAcousticDistortionRisk,
  compileV5SoundVoicePayload,
  VoiceParametricPreset,
} from '@/utils/voiceParametersEngine';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  Sliders,
  Volume2,
  Gauge,
  Flame,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Code,
  Copy,
  Check,
  Zap,
  Music,
  Compass,
  Sparkles,
} from 'lucide-react';

interface VoiceParametersPanelProps {
  avatarId?: string;
  avatarName?: string;
  currentEngine?: VoiceEngine;
}

export default function VoiceParametersPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
  currentEngine = 'qwen-tts',
}: VoiceParametersPanelProps) {
  const { avatars, updateAvatar } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId);

  // Inicializa a partir do avatar na store
  const [params, setParams] = useState<VoiceParameters>(() => {
    const rawPitch = currentAvatar?.voice?.pitch;
    // Se pitch for fornecido como multiplicador (> 0.2 e <= 2.5), converte para semitons, senão assume 0 st
    let initialPitchSemitones = 0;
    if (typeof rawPitch === 'number') {
      if (rawPitch >= -12 && rawPitch <= 12 && rawPitch !== 1.0) {
        initialPitchSemitones = rawPitch;
      } else if (rawPitch > 0) {
        initialPitchSemitones = multiplierToSemitones(rawPitch);
      }
    }

    return {
      pitchSemitones: initialPitchSemitones,
      speed: currentAvatar?.voice?.speed ?? 1.0,
      stability: currentAvatar?.voice?.stability ?? 0.85,
      temperature: currentAvatar?.voice?.temperature ?? 0.65,
    };
  });

  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [showJsonPayload, setShowJsonPayload] = useState<boolean>(false);
  const [hasCopiedPayload, setHasCopiedPayload] = useState<boolean>(false);

  // Sincroniza se avatar mudar externamente
  useEffect(() => {
    if (currentAvatar?.voice) {
      const rawPitch = currentAvatar.voice.pitch;
      let semitones = 0;
      if (typeof rawPitch === 'number') {
        if (rawPitch >= -12 && rawPitch <= 12 && rawPitch !== 1.0) {
          semitones = rawPitch;
        } else if (rawPitch > 0) {
          semitones = multiplierToSemitones(rawPitch);
        }
      }

      setParams({
        pitchSemitones: semitones,
        speed: currentAvatar.voice.speed ?? 1.0,
        stability: currentAvatar.voice.stability ?? 0.85,
        temperature: currentAvatar.voice.temperature ?? 0.65,
      });
    }
  }, [currentAvatar?.id]);

  const updateStoreVoice = (newParams: VoiceParameters) => {
    if (!currentAvatar) return;
    updateAvatar(avatarId, {
      voice: {
        ...currentAvatar.voice,
        speed: newParams.speed,
        pitch: newParams.pitchSemitones,
        stability: newParams.stability,
        temperature: newParams.temperature,
      },
    });
  };

  const handleParamChange = (key: keyof VoiceParameters, value: number) => {
    setActivePresetId(null);
    const updated = { ...params, [key]: value };
    setParams(updated);
    updateStoreVoice(updated);
  };

  const handleApplyPreset = (preset: VoiceParametricPreset) => {
    setActivePresetId(preset.id);
    setParams(preset.parameters);
    updateStoreVoice(preset.parameters);
    toast.success(
      `Preset Aplicado: ${preset.name}`,
      `Parâmetros ajustados para ${preset.description}`
    );
  };

  const handleResetDefaults = () => {
    const defaults: VoiceParameters = {
      pitchSemitones: 0,
      speed: 1.0,
      stability: 0.85,
      temperature: 0.65,
    };
    setActivePresetId(null);
    setParams(defaults);
    updateStoreVoice(defaults);
    toast.info('Parâmetros Redefinidos', 'Valores acústicos restaurados para os padrões soberanos.');
  };

  // Classificações e cálculos
  const pitchMult = semitonesToMultiplier(params.pitchSemitones);
  const pitchClass = getPitchClassification(params.pitchSemitones);
  const speedClass = getSpeedClassification(params.speed);
  const stabilityClass = getStabilityClassification(params.stability);
  const tempClass = getTemperatureClassification(params.temperature);
  const riskAnalysis = calculateAcousticDistortionRisk(params);

  const payload = compileV5SoundVoicePayload(
    params,
    currentAvatar?.voice?.engine || currentEngine,
    currentAvatar?.voice?.v5SoundVoiceId
  );

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setHasCopiedPayload(true);
    toast.success('Payload Copiado!', 'JSON de parâmetros vocais transferido para a área de transferência.');
    setTimeout(() => setHasCopiedPayload(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-gold/10 text-cyber-gold border border-cyber-gold/30 shadow-[0_0_12px_rgba(255,215,0,0.15)]">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Controles Paramétricos de Voz (Acoustic Modulator)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-gold/20 text-cyber-gold font-bold border border-cyber-gold/30">
                {activePresetId ? 'Preset Ativo' : 'Manual Custom'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Ajuste fino de Pitch, Velocidade, Estabilidade e Temperatura Acústica para {avatarName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs border border-white/10 transition-colors"
            title="Restaurar valores neutros padrão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetar</span>
          </button>
          <button
            onClick={() => setShowJsonPayload(!showJsonPayload)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors ${
              showJsonPayload
                ? 'bg-cyber-cyan/20 border-cyber-cyan/40 text-cyber-cyan'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showJsonPayload ? 'Ocultar JSON' : 'Ver Payload'}</span>
          </button>
        </div>
      </div>

      {/* Seletor de Presets Canônicos */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-bold text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyber-gold" />
            Presets Acústicos Canônicos da Holding:
          </span>
          <span className="text-[11px] text-slate-500">6 estilos prontos para gravação e streaming</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {CANONICAL_VOICE_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`p-2.5 rounded-xl text-left border text-xs transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-cyber-gold/15 border-cyber-gold text-cyber-gold shadow-[0_0_12px_rgba(255,215,0,0.2)]'
                    : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/25 hover:bg-white/5'
                }`}
              >
                <div className="font-bold text-[11px] truncate flex items-center justify-between">
                  <span>{preset.name.split(' (')[0]}</span>
                  {isSelected && <Zap className="w-3 h-3 text-cyber-gold shrink-0 animate-pulse" />}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {preset.parameters.speed}x · {preset.parameters.pitchSemitones > 0 ? `+${preset.parameters.pitchSemitones}` : preset.parameters.pitchSemitones}st
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de 4 Sliders Paramétricos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Pitch / Tonalidade (-12 a +12 semitons) */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 relative group hover:border-cyber-gold/30 transition-colors">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-200">
              <Music className="w-4 h-4 text-cyber-gold" />
              Pitch / Tonalidade Vocal
            </span>
            <div className="flex items-center gap-2">
              <span className={`font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 ${pitchClass.color}`}>
                {params.pitchSemitones > 0 ? `+${params.pitchSemitones.toFixed(1)}` : params.pitchSemitones.toFixed(1)} st
              </span>
              <span className="text-[10px] text-slate-500">({pitchMult}x freq)</span>
            </div>
          </div>

          <input
            type="range"
            min="-12"
            max="12"
            step="0.5"
            value={params.pitchSemitones}
            onChange={(e) => handleParamChange('pitchSemitones', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyber-gold"
          />

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">-12 st (Grave)</span>
            <span className={`font-semibold ${pitchClass.color}`}>{pitchClass.label} ({pitchClass.timbre})</span>
            <span className="text-slate-500">+12 st (Agudo)</span>
          </div>
        </div>

        {/* 2. Velocidade de Fala (0.50x a 2.00x) */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 relative group hover:border-cyber-cyan/30 transition-colors">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-200">
              <Gauge className="w-4 h-4 text-cyber-cyan" />
              Velocidade / Cadência de Fala
            </span>
            <div className="flex items-center gap-2">
              <span className={`font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 ${speedClass.color}`}>
                {params.speed.toFixed(2)}x
              </span>
              <span className="text-[10px] text-slate-500">~{speedClass.wpmEstimate} PPM</span>
            </div>
          </div>

          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.05"
            value={params.speed}
            onChange={(e) => handleParamChange('speed', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
          />

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">0.50x (Lento)</span>
            <span className={`font-semibold ${speedClass.color}`}>{speedClass.label} · {speedClass.useCase}</span>
            <span className="text-slate-500">2.00x (Rápido)</span>
          </div>
        </div>

        {/* 3. Estabilidade Acústica (0.0 a 1.0) */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 relative group hover:border-emerald-500/30 transition-colors">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Estabilidade Acústica (Consistency)
            </span>
            <span className={`font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 ${stabilityClass.color}`}>
              {Math.round(params.stability * 100)}%
            </span>
          </div>

          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.01"
            value={params.stability}
            onChange={(e) => handleParamChange('stability', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">0% (Livre)</span>
            <span className={`font-semibold ${stabilityClass.color}`}>{stabilityClass.label}</span>
            <span className="text-slate-500">100% (Estrita)</span>
          </div>
          <p className="text-[10px] text-slate-500 truncate">{stabilityClass.description}</p>
        </div>

        {/* 4. Temperatura Sonora (0.10 a 1.00) */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 relative group hover:border-rose-500/30 transition-colors">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-slate-200">
              <Flame className="w-4 h-4 text-rose-400" />
              Temperatura Sonora (Acoustic Entropy)
            </span>
            <span className={`font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 ${tempClass.color}`}>
              {params.temperature.toFixed(2)}
            </span>
          </div>

          <input
            type="range"
            min="0.10"
            max="1.00"
            step="0.02"
            value={params.temperature}
            onChange={(e) => handleParamChange('temperature', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
          />

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">0.10 (Preciso)</span>
            <span className={`font-semibold ${tempClass.color}`}>{tempClass.label}</span>
            <span className="text-slate-500">1.00 (Criativo)</span>
          </div>
          <p className="text-[10px] text-slate-500 truncate">{tempClass.description}</p>
        </div>
      </div>

      {/* Monitor de Risco de Distorção Acústica */}
      <div className={`p-3.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        riskAnalysis.riskLevel === 'high'
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          : riskAnalysis.riskLevel === 'moderate'
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
      }`}>
        <div className="flex items-center gap-2.5">
          {riskAnalysis.riskLevel === 'high' ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : riskAnalysis.riskLevel === 'moderate' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <div>
            <span className="font-bold">Índice de Fidelidade Acústica: </span>
            <span>
              {riskAnalysis.riskLevel === 'low' && 'Excelente (Baixo risco de artefatos ou descompasso fonético).'}
              {riskAnalysis.riskLevel === 'moderate' && 'Atenção (Combinação requer verificação de clareza nos visemas).'}
              {riskAnalysis.riskLevel === 'high' && 'Alerta Crítico (Parâmetros extremos podem gerar formantes deformados).'}
            </span>
            {riskAnalysis.warnings.length > 0 && (
              <ul className="mt-1 list-disc list-inside text-[11px] opacity-90 space-y-0.5">
                {riskAnalysis.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center font-mono">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/40 border border-white/10">
            Score: {100 - riskAnalysis.riskScore}%
          </span>
        </div>
      </div>

      {/* Inspector de Payload JSON para o V5 Sound */}
      {showJsonPayload && (
        <div className="p-4 rounded-xl bg-black/70 border border-white/15 space-y-2 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
            <span className="text-slate-300 font-bold flex items-center gap-2">
              <Code className="w-4 h-4 text-cyber-cyan" />
              Payload de Inferência Neural (API V5 Sound - Port :3008)
            </span>
            <button
              onClick={handleCopyPayload}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-xs transition-colors"
            >
              {hasCopiedPayload ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar JSON</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-[11px] text-cyber-cyan/90 overflow-x-auto p-3 bg-black/50 rounded-lg max-h-48 scrollbar-thin">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
