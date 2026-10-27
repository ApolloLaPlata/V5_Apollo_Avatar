'use client';

import React, { useState, useEffect, useId } from 'react';
import {
  IdleBreathingConfig,
} from '@/types/avatar';
import {
  CANONICAL_BREATHING_PRESETS,
  DEFAULT_BREATHING_CONFIG,
  bpmToCycleSeconds,
  generateBreathingKeyframesCss,
  generateCleanCssEmbedSnippet,
  getAnchorPointCss,
  calculateBreathingPhase,
} from '@/utils/idleBreathingEngine';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  Wind,
  Play,
  Pause,
  Copy,
  Check,
  Save,
  Sliders,
  Sparkles,
  Layers,
  Code,
  Activity,
  User,
  Zap,
} from 'lucide-react';

interface IdleBreathingPanelProps {
  avatarId?: string;
  avatarName?: string;
  avatarUrl?: string;
}

export default function IdleBreathingPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
  avatarUrl = '/sample-avatar.png',
}: IdleBreathingPanelProps) {
  const { avatars, updateAvatar } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId) || avatars[0];

  const uniqueId = useId().replace(/:/g, '');
  const keyframeName = `v5-breathing-${uniqueId}`;

  const initialConfig: IdleBreathingConfig =
    currentAvatar?.rigging?.breathingConfig || DEFAULT_BREATHING_CONFIG;

  const [config, setConfig] = useState<IdleBreathingConfig>(initialConfig);
  const [isPlaying, setIsPlaying] = useState<boolean>(initialConfig.isActive);
  const [copiedCss, setCopiedCss] = useState<boolean>(false);
  const [showCssSnippet, setShowCssSnippet] = useState<boolean>(false);

  // Telemetria em tempo real do ciclo respiratório
  const [telemetry, setTelemetry] = useState({
    phase: 'inspiração' as 'inspiração' | 'ápice' | 'expiração' | 'repouso',
    progress: 0,
    sineNormalized: 0,
  });

  useEffect(() => {
    if (!isPlaying) return;

    let animFrame: number;
    const updateLoop = () => {
      const now = performance.now();
      const current = calculateBreathingPhase(now, config.bpm);
      setTelemetry(current);
      animFrame = requestAnimationFrame(updateLoop);
    };

    animFrame = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying, config.bpm]);

  const cycleDuration = bpmToCycleSeconds(config.bpm);
  const keyframesCss = generateBreathingKeyframesCss(config, keyframeName);
  const anchorCss = getAnchorPointCss(config.anchorPoint);

  const handleSelectPreset = (presetKey: 'calm' | 'focused' | 'energetic' | 'deep') => {
    const p = CANONICAL_BREATHING_PRESETS[presetKey];
    setConfig({
      bpm: p.bpm,
      amplitudeYPercent: p.amplitudeYPercent,
      shoulderExpansionXPercent: p.shoulderExpansionXPercent,
      anchorPoint: p.anchorPoint,
      preset: p.id,
      isActive: isPlaying,
    });
    toast.info(`Preset Ativado: ${p.label}`, `${p.bpm} BPM · Ciclo de ${bpmToCycleSeconds(p.bpm)}s`);
  };

  const handleSaveToAvatar = () => {
    if (!currentAvatar) return;
    updateAvatar(avatarId, {
      rigging: {
        ...currentAvatar.rigging,
        breathingCycleSeconds: cycleDuration,
        breathingConfig: {
          ...config,
          isActive: isPlaying,
        },
      },
    });
    toast.success('Parâmetros Salvos!', `Loop de respiração (${config.bpm} BPM) salvo no Rigging DNA.`);
  };

  const handleCopyCss = () => {
    const snippet = generateCleanCssEmbedSnippet(config);
    navigator.clipboard.writeText(snippet);
    setCopiedCss(true);
    toast.success('CSS Copiado!', 'Keyframes e seletores copiados para a área de transferência.');
    setTimeout(() => setCopiedCss(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Injeção Dinâmica dos Keyframes CSS no Head */}
      <style dangerouslySetInnerHTML={{ __html: keyframesCss }} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyber-cyan border border-cyber-cyan/30 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Motor de Loop de Respiração Suave (Idle Breathing Engine)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyber-cyan font-bold border border-cyber-cyan/30">
                Fase 7 · Etapa 061
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Deformação torácica procedural em CSS Keyframes para vida orgânica contínua no navegador e OBS
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              isPlaying
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                : 'bg-obsidian-900 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Animando (60 FPS)
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Pausado
              </>
            )}
          </button>

          <button
            onClick={() => setShowCssSnippet(!showCssSnippet)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-cyber-cyan/40 transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-cyber-cyan" />
            {showCssSnippet ? 'Ocultar CSS' : 'Ver CSS Puro'}
          </button>

          <button
            onClick={handleCopyCss}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-cyber-cyan/40 transition-colors"
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-xs shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            Salvar no Avatar
          </button>
        </div>
      </div>

      {/* Main Grid: Previewer & Telemetry + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Animated Avatar Viewport */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-obsidian-900/60 border border-white/5 relative overflow-hidden group">
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 bg-radial-gradient from-cyber-cyan/5 via-transparent to-transparent pointer-events-none" />

          {/* Avatar Container com Animação CSS Ativa */}
          <div className="relative w-48 h-64 sm:w-56 sm:h-72 flex items-center justify-center">
            {/* Base Shadow animada proporcional à elevação torácica */}
            <div
              className="absolute bottom-2 w-32 h-4 rounded-full bg-cyan-500/20 blur-md transition-all duration-300"
              style={{
                transform: isPlaying
                  ? `scale(${1 - telemetry.sineNormalized * 0.15})`
                  : 'scale(1)',
                opacity: isPlaying ? 0.4 + telemetry.sineNormalized * 0.3 : 0.4,
              }}
            />

            {/* Avatar Frame com Animação de Keyframes */}
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={{
                transformOrigin: anchorCss,
                animation: isPlaying
                  ? `${keyframeName} ${cycleDuration}s infinite ease-in-out`
                  : 'none',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
              }}
            >
              {avatarUrl && avatarUrl !== '/sample-avatar.png' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={avatarName}
                  className="max-h-full max-w-full object-contain rounded-xl drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
                />
              ) : (
                <div className="w-40 h-56 rounded-2xl bg-gradient-to-b from-cyan-950/40 via-obsidian-900 to-obsidian-950 border border-cyber-cyan/30 flex flex-col items-center justify-center p-4 text-center shadow-xl">
                  <User className="w-16 h-16 text-cyber-cyan/60 mb-3" />
                  <span className="text-xs font-bold text-slate-200">{avatarName}</span>
                  <span className="text-[10px] text-slate-400 mt-1">Silhouette Preview</span>
                </div>
              )}
            </div>

            {/* Retículo de Alinhamento de Âncora */}
            <div
              className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400 border border-white pointer-events-none shadow-[0_0_8px_rgba(0,229,255,1)]"
              style={{
                bottom:
                  config.anchorPoint === 'center_bottom'
                    ? '8px'
                    : config.anchorPoint === 'waist_center'
                    ? '35%'
                    : '60%',
                left: 'calc(50% - 5px)',
              }}
              title={`Ponto de Âncora: ${config.anchorPoint}`}
            />
          </div>

          {/* Telemetria do Ciclo Respiratório em Tempo Real */}
          <div className="w-full mt-4 p-3 rounded-xl bg-obsidian-950 border border-white/5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyber-cyan" />
                Fase Respiratória:
              </span>
              <span className="font-bold uppercase text-cyber-cyan tracking-wider">
                {isPlaying ? telemetry.phase : 'PAUSADO'} ({telemetry.progress}%)
              </span>
            </div>

            {/* Barra de Progresso Senoidal do Pulmão */}
            <div className="w-full bg-obsidian-900 rounded-full h-2 overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-75"
                style={{
                  width: `${telemetry.progress}%`,
                  opacity: isPlaying ? 1 : 0.4,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>Ciclo: <strong className="text-slate-200">{cycleDuration}s</strong></span>
              <span>Expansão: <strong className="text-slate-200">{telemetry.sineNormalized * 100}%</strong></span>
              <span>BPM: <strong className="text-cyber-cyan">{config.bpm}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column: Parametric Controls & Presets */}
        <div className="lg:col-span-7 space-y-5">
          {/* Presets Fisiológicos Canônicos */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
              Presets Fisiológicos Canônicos
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(CANONICAL_BREATHING_PRESETS) as Array<keyof typeof CANONICAL_BREATHING_PRESETS>).map(
                (presetKey) => {
                  const p = CANONICAL_BREATHING_PRESETS[presetKey];
                  const isSelected = config.preset === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPreset(presetKey)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyber-cyan text-slate-100 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                          : 'bg-obsidian-900/60 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold block">{p.label}</span>
                        <span className="text-[10px] text-cyber-cyan font-mono font-bold block">
                          {p.bpm} BPM
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 mt-2 line-clamp-2">
                        {p.description}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Sliders Paramétricos */}
          <div className="p-4 rounded-xl bg-obsidian-900/50 border border-white/5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/5 text-slate-300 font-bold">
              <span className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-cyber-cyan" />
                Modulação Paramétrica de Frequência & Deformação
              </span>
              <span className="text-[11px] text-cyber-cyan font-mono">
                {cycleDuration}s por ciclo
              </span>
            </div>

            {/* Slider 1: Frequência BPM */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Frequência Respiratória (BPM):</span>
                <span className="text-cyber-cyan font-bold font-mono">{config.bpm} BPM</span>
              </div>
              <input
                type="range"
                min={6}
                max={30}
                step={1}
                value={config.bpm}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    bpm: Number(e.target.value),
                    preset: 'custom',
                  })
                }
                className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>6 BPM (Profundo/Lento)</span>
                <span>14 BPM (Padrão Humano)</span>
                <span>30 BPM (Ofegante)</span>
              </div>
            </div>

            {/* Slider 2: Amplitude Vertical Y */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Elevação Torácica Vertical (Amplitude Y):</span>
                <span className="text-cyan-300 font-bold font-mono">
                  {config.amplitudeYPercent.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min={0.2}
                max={2.5}
                step={0.1}
                value={config.amplitudeYPercent}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    amplitudeYPercent: Number(e.target.value),
                    preset: 'custom',
                  })
                }
                className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>0.2% (Quase imperceptível)</span>
                <span>0.9% (Equilibrado)</span>
                <span>2.5% (Dramático)</span>
              </div>
            </div>

            {/* Slider 3: Expansão de Ombros X */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Expansão Lateral dos Ombros (Escala X):</span>
                <span className="text-blue-300 font-bold font-mono">
                  {config.shoulderExpansionXPercent.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min={0.2}
                max={3.0}
                step={0.1}
                value={config.shoulderExpansionXPercent}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    shoulderExpansionXPercent: Number(e.target.value),
                    preset: 'custom',
                  })
                }
                className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>0.2% (Micro-expansão)</span>
                <span>1.2% (Orgânico)</span>
                <span>3.0% (Amplo)</span>
              </div>
            </div>

            {/* Seletor de Ponto de Ancoragem */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Ponto de Ancoragem Anatômica (transform-origin):</span>
                <span className="text-purple-300 font-bold font-mono">{anchorCss}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'center_bottom', label: 'Pés / Base', desc: 'center bottom' },
                  { id: 'waist_center', label: 'Cintura / Quadril', desc: 'center 65%' },
                  { id: 'chest_center', label: 'Tórax / Coração', desc: 'center 40%' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      setConfig({
                        ...config,
                        anchorPoint: item.id as IdleBreathingConfig['anchorPoint'],
                        preset: 'custom',
                      })
                    }
                    className={`p-2 rounded-lg border text-center transition-all ${
                      config.anchorPoint === item.id
                        ? 'bg-purple-500/20 border-purple-500 text-purple-200'
                        : 'bg-obsidian-950 border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className="text-[9px] text-slate-400 block font-mono">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualizador de CSS Embed Opcional */}
      {showCssSnippet && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-cyber-cyan" />
              Snippet CSS Limpo para OBS Overlay / Web Embedding
            </span>
            <span className="text-[10px] text-slate-400">Sem dependência de JS em produção</span>
          </div>
          <pre className="p-4 rounded-xl bg-obsidian-950 border border-cyber-cyan/20 text-cyber-cyan/90 text-xs overflow-x-auto max-h-60 scrollbar-thin font-mono selection:bg-cyber-cyan selection:text-obsidian-950">
            {generateCleanCssEmbedSnippet(config)}
          </pre>
        </div>
      )}
    </div>
  );
}
