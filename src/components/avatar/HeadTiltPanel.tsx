'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HeadTiltConfig } from '@/types/avatar';
import {
  HeadTiltPose,
  CANONICAL_HEAD_TILT_PRESETS,
  DEFAULT_HEAD_TILT_CONFIG,
  calculateRandomHeadPose,
  generate3DTransformStyle,
  generateCleanHeadTiltCssSnippet,
} from '@/utils/headTiltEngine';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  Compass,
  Play,
  Pause,
  Copy,
  Check,
  Save,
  Sliders,
  Sparkles,
  Code,
  Activity,
  RotateCcw,
  User,
  Zap,
} from 'lucide-react';

interface HeadTiltPanelProps {
  avatarId?: string;
  avatarName?: string;
  avatarUrl?: string;
}

export default function HeadTiltPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
  avatarUrl = '/sample-avatar.png',
}: HeadTiltPanelProps) {
  const { avatars, updateAvatar } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId) || avatars[0];

  const initialConfig: HeadTiltConfig =
    currentAvatar?.rigging?.headTiltConfig || DEFAULT_HEAD_TILT_CONFIG;

  const [config, setConfig] = useState<HeadTiltConfig>(initialConfig);
  const [isActive, setIsActive] = useState<boolean>(initialConfig.isActive);
  const [currentPose, setCurrentPose] = useState<HeadTiltPose>({ pitch: 0, yaw: 0, roll: 0 });
  const [poseLabel, setPoseLabel] = useState<string>('Repouso Central');
  const [copiedCss, setCopiedCss] = useState<boolean>(false);
  const [showCssSnippet, setShowCssSnippet] = useState<boolean>(false);

  const loopTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Loop de micro-movimentos autônomos
  useEffect(() => {
    if (!isActive) {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
      setCurrentPose({ pitch: 0, yaw: 0, roll: 0 });
      setPoseLabel('Pausado (Neutro)');
      return;
    }

    let isMounted = true;

    const runPoseCycle = () => {
      if (!isMounted) return;

      const nextPose = calculateRandomHeadPose(config);
      setCurrentPose(nextPose);

      // Rotula a pose atual com base nos ângulos dominantes
      if (Math.abs(nextPose.roll) > config.maxRollDeg * 0.6) {
        setPoseLabel(nextPose.roll > 0 ? 'Escuta Ativa (Tilt Direito)' : 'Escuta Ativa (Tilt Esquerdo)');
      } else if (Math.abs(nextPose.yaw) > config.maxYawDeg * 0.6) {
        setPoseLabel(nextPose.yaw > 0 ? 'Olhar Curioso (Direita)' : 'Olhar Curioso (Esquerda)');
      } else if (nextPose.pitch > config.maxPitchDeg * 0.5) {
        setPoseLabel('Queixo Elevado (Confiança)');
      } else {
        setPoseLabel('Atenção Central');
      }

      const totalDwellMs = (config.transitionDurationSeconds + config.dwellTimeSeconds) * 1000;
      loopTimerRef.current = setTimeout(runPoseCycle, totalDwellMs);
    };

    runPoseCycle();

    return () => {
      isMounted = false;
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    };
  }, [isActive, config]);

  const handleSelectPreset = (
    presetKey: 'listening_empathy' | 'analytical_curious' | 'confident_sovereign' | 'neutral_idle'
  ) => {
    const p = CANONICAL_HEAD_TILT_PRESETS[presetKey];
    setConfig({
      maxPitchDeg: p.maxPitchDeg,
      maxYawDeg: p.maxYawDeg,
      maxRollDeg: p.maxRollDeg,
      transitionDurationSeconds: p.transitionDurationSeconds,
      dwellTimeSeconds: p.dwellTimeSeconds,
      preset: p.id,
      isActive,
    });
    toast.info(`Preset Ativado: ${p.label}`, `Roll ±${p.maxRollDeg}º · Pitch ±${p.maxPitchDeg}º`);
  };

  const handleManualPose = (pitch: number, yaw: number, roll: number, label: string) => {
    if (loopTimerRef.current) clearTimeout(loopTimerRef.current);
    setCurrentPose({ pitch, yaw, roll });
    setPoseLabel(label);
    toast.info(`Pose Manual: ${label}`, `Pitch: ${pitch}º, Yaw: ${yaw}º, Roll: ${roll}º`);
  };

  const handleSaveToAvatar = () => {
    if (!currentAvatar) return;
    updateAvatar(avatarId, {
      rigging: {
        ...currentAvatar.rigging,
        headTiltConfig: {
          ...config,
          isActive,
        },
      },
    });
    toast.success(
      'Micro-movimentos Salvos!',
      `Head Tilts (Roll ±${config.maxRollDeg}º) registrados no Rigging DNA.`
    );
  };

  const handleCopyCss = () => {
    const snippet = generateCleanHeadTiltCssSnippet(config);
    navigator.clipboard.writeText(snippet);
    setCopiedCss(true);
    toast.success('CSS Copiado!', 'Keyframes de micro-movimento copiados para a área de transferência.');
    setTimeout(() => setCopiedCss(false), 2000);
  };

  const transformStyle = generate3DTransformStyle(
    currentPose,
    config.transitionDurationSeconds,
    800
  );

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Micro-movimentos de Cabeça (Head Tilts & Micro-Inclinações)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
                Fase 7 · Etapa 063
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Inclinações naturais nos 3 eixos (Pitch/Yaw/Roll) simulando escuta empática e atenção soberana
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              isActive
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30'
                : 'bg-obsidian-900 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Flutuação Ativa (3D)
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Pausado
              </>
            )}
          </button>

          <button
            onClick={() => handleManualPose(0, 0, 0, 'Central')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-indigo-400/40 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Resetar Ângulos
          </button>

          <button
            onClick={() => setShowCssSnippet(!showCssSnippet)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-indigo-400/40 transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-cyber-cyan" />
            {showCssSnippet ? 'Ocultar CSS' : 'Ver CSS Puro'}
          </button>

          <button
            onClick={handleCopyCss}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-indigo-400/40 transition-colors"
          >
            {copiedCss ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                Copiar CSS
              </>
            )}
          </button>

          <button
            onClick={handleSaveToAvatar}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            Salvar no Avatar
          </button>
        </div>
      </div>

      {/* Main Grid: 3D Viewport & Gyroscope + Parametric Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3D Perspective Head Viewport */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-obsidian-900/60 border border-white/5 relative overflow-hidden">
          {/* Subtle 3D Perspective Grid Background */}
          <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

          {/* Current Posture Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
              {poseLabel}
            </span>
          </div>

          {/* 3D Transform Avatar Head Frame */}
          <div className="relative w-44 h-56 sm:w-52 sm:h-64 flex items-center justify-center py-4">
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={transformStyle}
            >
              {avatarUrl && avatarUrl !== '/sample-avatar.png' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={avatarName}
                  className="max-h-full max-w-full object-contain rounded-2xl drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] border border-white/10"
                />
              ) : (
                <div className="w-40 h-52 rounded-2xl bg-gradient-to-b from-indigo-950/40 via-obsidian-900 to-obsidian-950 border border-indigo-500/30 flex flex-col items-center justify-center p-4 text-center shadow-xl">
                  <User className="w-16 h-16 text-indigo-400/60 mb-3" />
                  <span className="text-xs font-bold text-slate-200">{avatarName}</span>
                  <span className="text-[10px] text-slate-400 mt-1">3D Head Mesh</span>
                </div>
              )}
            </div>
          </div>

          {/* 3-Axis Gyroscope Readout */}
          <div className="w-full mt-2 p-3 rounded-xl bg-obsidian-950 border border-white/5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px] pb-1 border-b border-white/5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                Giroscópio Cervical em Tempo Real:
              </span>
              <span className="text-[10px] text-indigo-300 font-mono">
                Transição: {config.transitionDurationSeconds}s
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="p-2 rounded-lg bg-obsidian-900 border border-white/5">
                <span className="text-slate-400 block">Pitch (Nod X)</span>
                <strong className={`font-mono block text-xs ${currentPose.pitch >= 0 ? 'text-indigo-300' : 'text-cyan-300'}`}>
                  {currentPose.pitch > 0 ? `+${currentPose.pitch}` : currentPose.pitch}º
                </strong>
                <span className="text-[9px] text-slate-400">{currentPose.pitch >= 0 ? 'Queixo p/ cima' : 'Queixo p/ baixo'}</span>
              </div>

              <div className="p-2 rounded-lg bg-obsidian-900 border border-white/5">
                <span className="text-slate-400 block">Yaw (Turn Y)</span>
                <strong className={`font-mono block text-xs ${currentPose.yaw >= 0 ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {currentPose.yaw > 0 ? `+${currentPose.yaw}` : currentPose.yaw}º
                </strong>
                <span className="text-[9px] text-slate-400">{currentPose.yaw >= 0 ? 'Olhar à Direita' : 'Olhar à Esquerda'}</span>
              </div>

              <div className="p-2 rounded-lg bg-obsidian-900 border border-white/5">
                <span className="text-slate-400 block">Roll (Tilt Z)</span>
                <strong className={`font-mono block text-xs ${currentPose.roll >= 0 ? 'text-purple-300' : 'text-rose-300'}`}>
                  {currentPose.roll > 0 ? `+${currentPose.roll}` : currentPose.roll}º
                </strong>
                <span className="text-[9px] text-slate-400">{currentPose.roll >= 0 ? 'Tilt Direita' : 'Tilt Esquerda'}</span>
              </div>
            </div>

            {/* Quick Trigger Buttons */}
            <div className="pt-2 flex items-center justify-between gap-1">
              <button
                onClick={() => handleManualPose(-1.0, 1.5, 3.2, 'Escuta Empática')}
                className="flex-1 py-1 px-1.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-[10px] text-center"
              >
                👂 Escuta (+Roll)
              </button>
              <button
                onClick={() => handleManualPose(1.2, 2.5, -2.0, 'Análise Curiosa')}
                className="flex-1 py-1 px-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 text-[10px] text-center"
              >
                🧐 Análise (+Yaw)
              </button>
              <button
                onClick={() => handleManualPose(2.0, 0.5, 0.5, 'Postura Soberana')}
                className="flex-1 py-1 px-1.5 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-[10px] text-center"
              >
                👑 Soberano (+Pitch)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Presets & Parametric Sliders */}
        <div className="lg:col-span-7 space-y-5">
          {/* Presets Canônicos */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Presets Biomecânicos Canônicos
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                Object.keys(CANONICAL_HEAD_TILT_PRESETS) as Array<
                  keyof typeof CANONICAL_HEAD_TILT_PRESETS
                >
              ).map((presetKey) => {
                const p = CANONICAL_HEAD_TILT_PRESETS[presetKey];
                const isSelected = config.preset === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(presetKey)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-indigo-500/15 border-indigo-500 text-slate-100 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                        : 'bg-obsidian-900/60 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-bold block">{p.label}</span>
                      <span className="text-[10px] text-indigo-400 font-mono font-bold block">
                        Tilt ±{p.maxRollDeg}º
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

          {/* Sliders Paramétricos */}
          <div className="p-4 rounded-xl bg-obsidian-900/50 border border-white/5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/5 text-slate-300 font-bold">
              <span className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                Limites Angulares dos 3 Eixos de Rotação
              </span>
              <span className="text-[11px] text-indigo-300 font-mono">
                {config.transitionDurationSeconds}s transição
              </span>
            </div>

            {/* Slider 1: Max Roll (Tilt Z) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Inclinação Lateral Orelha-Ombro (Max Roll Z):</span>
                <span className="text-purple-300 font-bold font-mono">±{config.maxRollDeg.toFixed(1)}º</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={6.0}
                step={0.5}
                value={config.maxRollDeg}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    maxRollDeg: Number(e.target.value),
                    preset: 'custom',
                  })
                }
                className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>0.5º (Quase rígido)</span>
                <span>3.0º (Escuta Natural)</span>
                <span>6.0º (Expressividade Máxima)</span>
              </div>
            </div>

            {/* Slider 2: Max Pitch (Nod X) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Inclinação Vertical do Queixo (Max Pitch X):</span>
                <span className="text-indigo-300 font-bold font-mono">±{config.maxPitchDeg.toFixed(1)}º</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={4.0}
                step={0.5}
                value={config.maxPitchDeg}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    maxPitchDeg: Number(e.target.value),
                    preset: 'custom',
                  })
                }
                className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-indigo-400"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>0.5º (Sutil)</span>
                <span>2.0º (Natural)</span>
                <span>4.0º (Amplo)</span>
              </div>
            </div>

            {/* Slider 3: Max Yaw (Turn Y) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Rotação Horizontal do Olhar (Max Yaw Y):</span>
                <span className="text-emerald-300 font-bold font-mono">±{config.maxYawDeg.toFixed(1)}º</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={5.0}
                step={0.5}
                value={config.maxYawDeg}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    maxYawDeg: Number(e.target.value),
                    preset: 'custom',
                  })
                }
                className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>0.5º (Fixado à frente)</span>
                <span>2.5º (Varredura Natural)</span>
                <span>5.0º (Olhar Lateral Amplo)</span>
              </div>
            </div>

            {/* Sliders 4 e 5 em Grid: Duração e Permanência */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Tempo de Transição:</span>
                  <span className="text-cyan-300 font-bold font-mono">
                    {config.transitionDurationSeconds.toFixed(1)}s
                  </span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={5.0}
                  step={0.2}
                  value={config.transitionDurationSeconds}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      transitionDurationSeconds: Number(e.target.value),
                      preset: 'custom',
                    })
                  }
                  className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Tempo de Permanência (Dwell):</span>
                  <span className="text-amber-300 font-bold font-mono">
                    {config.dwellTimeSeconds.toFixed(1)}s
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={5.0}
                  step={0.5}
                  value={config.dwellTimeSeconds}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      dwellTimeSeconds: Number(e.target.value),
                      preset: 'custom',
                    })
                  }
                  className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualizador de CSS Puro Opcional */}
      {showCssSnippet && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              Snippet CSS 3D Limpo para Animação Autônoma de Head Tilt
            </span>
            <span className="text-[10px] text-slate-400">Zero dependência de CPU / 100% acelerado por GPU</span>
          </div>
          <pre className="p-4 rounded-xl bg-obsidian-950 border border-indigo-500/20 text-indigo-200 text-xs overflow-x-auto max-h-60 scrollbar-thin font-mono selection:bg-indigo-500 selection:text-obsidian-950">
            {generateCleanHeadTiltCssSnippet(config)}
          </pre>
        </div>
      )}
    </div>
  );
}
