'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NaturalEyeBlinkConfig } from '@/types/avatar';
import {
  CANONICAL_EYE_BLINK_PRESETS,
  DEFAULT_EYE_BLINK_CONFIG,
  calculateNextBlinkInterval,
  calculateEyelidOpenFactor,
  generateCleanBlinkScriptSnippet,
} from '@/utils/naturalEyeBlinkEngine';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  Eye,
  Play,
  Pause,
  Copy,
  Check,
  Save,
  Sliders,
  Sparkles,
  Code,
  Activity,
  Zap,
  Clock,
  RotateCw,
} from 'lucide-react';

interface NaturalEyeBlinkPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function NaturalEyeBlinkPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
}: NaturalEyeBlinkPanelProps) {
  const { avatars, updateAvatar } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId) || avatars[0];

  const initialConfig: NaturalEyeBlinkConfig =
    currentAvatar?.rigging?.eyeBlinkConfig || DEFAULT_EYE_BLINK_CONFIG;

  const [config, setConfig] = useState<NaturalEyeBlinkConfig>(initialConfig);
  const [isActive, setIsActive] = useState<boolean>(initialConfig.isActive);
  const [eyelidFactor, setEyelidFactor] = useState<number>(1.0); // 1.0 = aberto, 0.02 = fechado
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [isDoubleBlink, setIsDoubleBlink] = useState<boolean>(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(3.5);
  const [totalBlinksCount, setTotalBlinksCount] = useState<number>(0);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [showScriptSnippet, setShowScriptSnippet] = useState<boolean>(false);

  // Refs de controle de ciclo
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const nextBlinkTargetRef = useRef<number>(Date.now() + 3500);

  // Executa uma piscada procedual com easing fisiológico
  const executeBlinkAnimation = (isSecondOfDouble = false) => {
    setIsBlinking(true);
    if (!isSecondOfDouble) {
      setTotalBlinksCount((prev) => prev + 1);
    }

    const startTime = performance.now();
    const duration = config.blinkDurationMs;

    const step = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      const factor = calculateEyelidOpenFactor(progress);
      setEyelidFactor(factor);

      if (progress < 100) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setEyelidFactor(1.0);
        setIsBlinking(false);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  // Dispara uma piscada completa (com suporte a piscada dupla)
  const triggerBlink = (forceDouble = false) => {
    const isDouble = forceDouble || Math.random() < config.doubleBlinkProbability;
    setIsDoubleBlink(isDouble);

    executeBlinkAnimation(false);

    if (isDouble) {
      setTimeout(() => {
        executeBlinkAnimation(true);
      }, config.blinkDurationMs + 120);
    }
  };

  // Loop autônomo com temporizador probabilístico
  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setEyelidFactor(1.0);
      setIsBlinking(false);
      return;
    }

    let intervalLoop: NodeJS.Timeout;

    const planNext = () => {
      const next = calculateNextBlinkInterval(config);
      nextBlinkTargetRef.current = Date.now() + next.delayMs;

      intervalLoop = setTimeout(() => {
        triggerBlink(next.isDouble);
        planNext();
      }, next.delayMs);
      timerRef.current = intervalLoop;
    };

    planNext();

    // Atualiza contagem regressiva visual a cada 100ms
    const countdownInterval = setInterval(() => {
      const remaining = Math.max(0, (nextBlinkTargetRef.current - Date.now()) / 1000);
      setCountdownSeconds(Number(remaining.toFixed(1)));
    }, 100);

    return () => {
      if (intervalLoop) clearTimeout(intervalLoop);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      clearInterval(countdownInterval);
    };
  }, [isActive, config]);

  const handleSelectPreset = (
    presetKey: 'natural_human' | 'focused_screen' | 'conversational' | 'relaxed'
  ) => {
    const p = CANONICAL_EYE_BLINK_PRESETS[presetKey];
    setConfig({
      intervalMin: p.intervalMin,
      intervalMax: p.intervalMax,
      blinkDurationMs: p.blinkDurationMs,
      doubleBlinkProbability: p.doubleBlinkProbability,
      preset: p.id,
      isActive,
    });
    toast.info(`Preset Ativado: ${p.label}`, `${p.intervalMin}s a ${p.intervalMax}s · ${p.blinkDurationMs}ms`);
  };

  const handleSaveToAvatar = () => {
    if (!currentAvatar) return;
    updateAvatar(avatarId, {
      rigging: {
        ...currentAvatar.rigging,
        blinkIntervalMin: config.intervalMin,
        blinkIntervalMax: config.intervalMax,
        blinkDurationMs: config.blinkDurationMs,
        eyeBlinkConfig: {
          ...config,
          isActive,
        },
      },
    });
    toast.success(
      'Parâmetros Salvos!',
      `Piscada Natural (${config.intervalMin}s-${config.intervalMax}s, ${config.blinkDurationMs}ms) salva no Rigging DNA.`
    );
  };

  const handleCopyScript = () => {
    const snippet = generateCleanBlinkScriptSnippet(config);
    navigator.clipboard.writeText(snippet);
    setCopiedScript(true);
    toast.success('Script Copiado!', 'Função de piscada procedural copiada para a área de transferência.');
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Sistema de Piscada de Olho Natural (Natural Eye Blink System)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
                Fase 7 · Etapa 062
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Distribuição probabilística de 2.5s a 6.0s com micro-reflexos de piscada dupla (12%) e física de pálpebra
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              isActive
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 hover:bg-purple-500/30'
                : 'bg-obsidian-900 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Piscando Automático
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Pausado
              </>
            )}
          </button>

          <button
            onClick={() => triggerBlink(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-purple-400/40 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            Piscar Agora
          </button>

          <button
            onClick={() => triggerBlink(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-amber-400/40 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Piscada Dupla
          </button>

          <button
            onClick={() => setShowScriptSnippet(!showScriptSnippet)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-purple-400/40 transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-cyber-cyan" />
            {showScriptSnippet ? 'Ocultar JS' : 'Ver Código'}
          </button>

          <button
            onClick={handleCopyScript}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-purple-400/40 transition-colors"
          >
            {copiedScript ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                Copiar JS
              </>
            )}
          </button>

          <button
            onClick={handleSaveToAvatar}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            Salvar no Avatar
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Eye Simulator + Parametric Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Realistic Dual Eye Live Viewport */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-obsidian-900/60 border border-white/5 relative overflow-hidden">
          {/* Status Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                isBlinking
                  ? isDoubleBlink
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-obsidian-950 text-slate-400 border-white/5'
              }`}
            >
              {isBlinking
                ? isDoubleBlink
                  ? '⚡ DUPLA PISCADA REFLEXIVA'
                  : '👁️ PISCANDO'
                : 'OLHOS ABERTOS'}
            </span>
          </div>

          {/* Eye Pair Visualizer */}
          <div className="py-8 flex items-center justify-center gap-6 sm:gap-8 w-full">
            {/* Olho Esquerdo */}
            <div className="relative w-28 h-20 sm:w-32 sm:h-24 bg-gradient-to-b from-slate-200 to-slate-100 rounded-full border-2 border-slate-700 shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden">
              {/* Íris e Pupila */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-900 flex items-center justify-center relative shadow-md">
                <div className="w-6 h-6 rounded-full bg-obsidian-950 flex items-center justify-center">
                  {/* Brilho Especular da Córnea */}
                  <div className="w-2.5 h-2.5 rounded-full bg-white/90 absolute top-2 right-2 blur-[0.3px]" />
                </div>
              </div>

              {/* Pálpebra Superior Móvel (Simulação de deformação física) */}
              <div
                className="absolute inset-x-0 top-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 origin-top transition-transform ease-out pointer-events-none border-b border-amber-900/40"
                style={{
                  height: '100%',
                  transform: `scaleY(${1 - eyelidFactor})`,
                }}
              >
                {/* Linha de Cílios Superiores */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-obsidian-950 shadow-sm" />
              </div>
            </div>

            {/* Olho Direito */}
            <div className="relative w-28 h-20 sm:w-32 sm:h-24 bg-gradient-to-b from-slate-200 to-slate-100 rounded-full border-2 border-slate-700 shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden">
              {/* Íris e Pupila */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-900 flex items-center justify-center relative shadow-md">
                <div className="w-6 h-6 rounded-full bg-obsidian-950 flex items-center justify-center">
                  {/* Brilho Especular da Córnea */}
                  <div className="w-2.5 h-2.5 rounded-full bg-white/90 absolute top-2 right-2 blur-[0.3px]" />
                </div>
              </div>

              {/* Pálpebra Superior Móvel */}
              <div
                className="absolute inset-x-0 top-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 origin-top transition-transform ease-out pointer-events-none border-b border-amber-900/40"
                style={{
                  height: '100%',
                  transform: `scaleY(${1 - eyelidFactor})`,
                }}
              >
                {/* Linha de Cílios Superiores */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-obsidian-950 shadow-sm" />
              </div>
            </div>
          </div>

          {/* Telemetria ao Vivo */}
          <div className="w-full mt-2 p-3 rounded-xl bg-obsidian-950 border border-white/5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                Próxima Piscada em:
              </span>
              <span className="font-bold text-purple-300 font-mono">
                {isActive ? `${countdownSeconds}s` : 'PAUSADO'}
              </span>
            </div>

            {/* Barra de Contagem Regressiva */}
            <div className="w-full bg-obsidian-900 rounded-full h-1.5 overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-100"
                style={{
                  width: `${Math.min(100, (countdownSeconds / config.intervalMax) * 100)}%`,
                  opacity: isActive ? 1 : 0.3,
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 pt-1 text-center">
              <div>
                <span>Abertura: </span>
                <strong className="text-slate-200 block font-mono">
                  {(eyelidFactor * 100).toFixed(0)}%
                </strong>
              </div>
              <div>
                <span>Duração: </span>
                <strong className="text-slate-200 block font-mono">
                  {config.blinkDurationMs}ms
                </strong>
              </div>
              <div>
                <span>Total de Piscadas: </span>
                <strong className="text-purple-300 block font-mono">
                  {totalBlinksCount}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Parametric Sliders & Presets */}
        <div className="lg:col-span-7 space-y-5">
          {/* Presets Canônicos */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Presets Fisiológicos Canônicos
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                Object.keys(CANONICAL_EYE_BLINK_PRESETS) as Array<
                  keyof typeof CANONICAL_EYE_BLINK_PRESETS
                >
              ).map((presetKey) => {
                const p = CANONICAL_EYE_BLINK_PRESETS[presetKey];
                const isSelected = config.preset === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(presetKey)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-purple-500/15 border-purple-500 text-slate-100 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                        : 'bg-obsidian-900/60 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-bold block">{p.label}</span>
                      <span className="text-[10px] text-purple-400 font-mono font-bold block">
                        {p.intervalMin}s - {p.intervalMax}s
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
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                Calibração Estatística da Frequência de Piscada
              </span>
              <span className="text-[11px] text-purple-300 font-mono">
                {config.intervalMin}s a {config.intervalMax}s
              </span>
            </div>

            {/* Slider 1: Intervalo Mínimo */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Intervalo Mínimo de Espera:</span>
                <span className="text-purple-300 font-bold font-mono">
                  {config.intervalMin.toFixed(1)} segundos
                </span>
              </div>
              <input
                type="range"
                min={1.0}
                max={4.0}
                step={0.1}
                value={config.intervalMin}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    intervalMin: Number(e.target.value),
                    preset: 'custom',
                  })
                }
                className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>1.0s (Hiperativo)</span>
                <span>2.5s (Padrão Humano)</span>
                <span>4.0s (Raro)</span>
              </div>
            </div>

            {/* Slider 2: Intervalo Máximo */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Intervalo Máximo de Espera:</span>
                <span className="text-purple-300 font-bold font-mono">
                  {config.intervalMax.toFixed(1)} segundos
                </span>
              </div>
              <input
                type="range"
                min={4.0}
                max={10.0}
                step={0.5}
                value={config.intervalMax}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    intervalMax: Number(e.target.value),
                    preset: 'custom',
                  })
                }
                className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>4.0s (Curto)</span>
                <span>6.0s (Padrão Humano)</span>
                <span>10.0s (Leitura concentrada)</span>
              </div>
            </div>

            {/* Slider 3: Duração da Piscada (ms) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Duração do Ciclo da Piscada (Fechamento/Reabertura):</span>
                <span className="text-cyan-300 font-bold font-mono">
                  {config.blinkDurationMs} ms
                </span>
              </div>
              <input
                type="range"
                min={120}
                max={320}
                step={10}
                value={config.blinkDurationMs}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    blinkDurationMs: Number(e.target.value),
                    preset: 'custom',
                  })
                }
                className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>120ms (Piscada relâmpago)</span>
                <span>180ms (Padrão Fisiológico)</span>
                <span>320ms (Sonolência/Lento)</span>
              </div>
            </div>

            {/* Slider 4: Probabilidade de Piscada Dupla */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Probabilidade de Piscada Dupla (Micro-reflexo):</span>
                <span className="text-amber-300 font-bold font-mono">
                  {(config.doubleBlinkProbability * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={0.35}
                step={0.01}
                value={config.doubleBlinkProbability}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    doubleBlinkProbability: Number(e.target.value),
                    preset: 'custom',
                  })
                }
                className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>0% (Desativado)</span>
                <span>12% (Padrão Fisiológico)</span>
                <span>35% (Altamente Reativo)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualizador de Código Script Opcional */}
      {showScriptSnippet && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-purple-400" />
              Snippet JavaScript Autocontido para Injeção no V5 Broadcaster / OBS
            </span>
            <span className="text-[10px] text-slate-400">Zero dependências externas</span>
          </div>
          <pre className="p-4 rounded-xl bg-obsidian-950 border border-purple-500/20 text-purple-200 text-xs overflow-x-auto max-h-60 scrollbar-thin font-mono selection:bg-purple-500 selection:text-obsidian-950">
            {generateCleanBlinkScriptSnippet(config)}
          </pre>
        </div>
      )}
    </div>
  );
}
