'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  AvatarConversationState,
  AvatarFsmConfig,
} from '@/types/avatar';
import {
  CANONICAL_FSM_STATES,
  DEFAULT_FSM_CONFIG,
  calculateFsmInterpolation,
  FsmInterpolationSnapshot,
  generateCleanFsmIntegrationSnippet,
} from '@/utils/avatarStateMachine';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  Workflow,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Save,
  Sliders,
  Sparkles,
  Code,
  Activity,
  ArrowRight,
  Mic,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';

interface AvatarStateMachinePanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function AvatarStateMachinePanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
}: AvatarStateMachinePanelProps) {
  const { avatars, updateAvatar } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId) || avatars[0];

  const initialConfig: AvatarFsmConfig =
    currentAvatar?.rigging?.fsmConfig || DEFAULT_FSM_CONFIG;

  const [config, setConfig] = useState<AvatarFsmConfig>(initialConfig);
  const [currentState, setCurrentState] = useState<AvatarConversationState>('idle_rest');
  const [transitionProgress, setTransitionProgress] = useState<number>(1.0);
  const [isSimulatingCycle, setIsSimulatingCycle] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showCodeSnippet, setShowCodeSnippet] = useState<boolean>(false);

  const cycleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calcula valores de interpolação instantâneos
  const snapshot: FsmInterpolationSnapshot = calculateFsmInterpolation(
    currentState,
    transitionProgress
  );

  // Executa uma simulação completa de fala conversacional
  const handleSimulateSpeechCycle = () => {
    if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
    setIsSimulatingCycle(true);

    // 1. Transição para Pre-Speech (Inalação preparatória)
    setCurrentState('pre_speech');
    setTransitionProgress(0);

    const preStart = performance.now();
    const preInterval = setInterval(() => {
      const elapsed = performance.now() - preStart;
      const prog = Math.min(1.0, elapsed / config.preSpeechDurationMs);
      setTransitionProgress(prog);

      if (prog >= 1.0) {
        clearInterval(preInterval);
      }
    }, 20);

    // 2. Transição para Speaking após preSpeechDurationMs
    cycleTimeoutRef.current = setTimeout(() => {
      setCurrentState('speaking');
      setTransitionProgress(1.0);

      // 3. Permanece falando por 2.8 segundos simulando síntese de voz
      cycleTimeoutRef.current = setTimeout(() => {
        // 4. Transição para Post-Speech (Conclusão e relaxamento)
        setCurrentState('post_speech');
        setTransitionProgress(0);

        const postStart = performance.now();
        const postInterval = setInterval(() => {
          const elapsed = performance.now() - postStart;
          const prog = Math.min(1.0, elapsed / config.postSpeechDurationMs);
          setTransitionProgress(prog);

          if (prog >= 1.0) {
            clearInterval(postInterval);
          }
        }, 20);

        // 5. Retorno suave ao repouso Idle Rest
        cycleTimeoutRef.current = setTimeout(() => {
          setCurrentState('idle_rest');
          setTransitionProgress(1.0);
          setIsSimulatingCycle(false);
          toast.success(
            'Ciclo FSM Concluído!',
            'Transição suave repouso -> fala -> repouso executada com 100% de fluidez.'
          );
        }, config.postSpeechDurationMs);
      }, 2800);
    }, config.preSpeechDurationMs);
  };

  // Interrupção Imediata (Barge-In)
  const handleBargeIn = () => {
    if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
    setCurrentState('idle_rest');
    setTransitionProgress(1.0);
    setIsSimulatingCycle(false);
    toast.error('Barge-In Acionado!', 'Fala interrompida e avatar retornado ao estado de escuta idle.');
  };

  const handleManualState = (state: AvatarConversationState) => {
    if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
    setIsSimulatingCycle(false);
    setCurrentState(state);
    setTransitionProgress(1.0);
  };

  const handleSaveToAvatar = () => {
    if (!currentAvatar) return;
    updateAvatar(avatarId, {
      rigging: {
        ...currentAvatar.rigging,
        fsmConfig: config,
      },
    });
    toast.success('Configurações Salvas!', 'Parâmetros da FSM registrados no Rigging DNA.');
  };

  const handleCopyCode = () => {
    const snippet = generateCleanFsmIntegrationSnippet(config);
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    toast.success('Controlador Copiado!', 'Classe V5AvatarFSM copiada para a área de transferência.');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const activeDef = CANONICAL_FSM_STATES[currentState];

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Máquina de Estados de Transição Suave (Avatar State Transition Machine)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                Fase 7 · Etapa 065
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Interpolação contínua entre Repouso, Inalação Pré-Fala, Discurso e Conclusão sem cortes visuais
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSimulateSpeechCycle}
            disabled={isSimulatingCycle}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] ${
              isSimulatingCycle
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-obsidian-950'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            {isSimulatingCycle ? 'Ciclo em Andamento...' : 'Simular Fala Completa'}
          </button>

          <button
            onClick={handleBargeIn}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-rose-300 hover:text-white hover:border-rose-500/40 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            Barge-in (Interromper)
          </button>

          <button
            onClick={() => setShowCodeSnippet(!showCodeSnippet)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-cyber-cyan/40 transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-cyber-cyan" />
            {showCodeSnippet ? 'Ocultar JS' : 'Ver FSM JS'}
          </button>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-amber-400/40 transition-colors"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                Copiar FSM
              </>
            )}
          </button>

          <button
            onClick={handleSaveToAvatar}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 hover:border-white/30 text-slate-200 text-xs font-bold transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            Salvar FSM
          </button>
        </div>
      </div>

      {/* Diagrama Visual de Nós da FSM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(CANONICAL_FSM_STATES) as AvatarConversationState[]).map((stateKey, idx) => {
          const item = CANONICAL_FSM_STATES[stateKey];
          const isCurrent = currentState === stateKey;

          return (
            <div
              key={item.state}
              onClick={() => handleManualState(stateKey)}
              className={`p-3.5 rounded-xl border cursor-pointer relative overflow-hidden transition-all ${
                isCurrent
                  ? `${item.badgeColor} ${item.borderColor} shadow-[0_0_15px_rgba(245,158,11,0.2)] scale-[1.02]`
                  : 'bg-obsidian-900/60 border-white/5 hover:border-white/20'
              }`}
            >
              {isCurrent && (
                <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-bl bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,1)]" />
              )}

              <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs">
                <span className={`font-bold ${isCurrent ? item.textColor : 'text-slate-200'}`}>
                  {item.label}
                </span>
                {idx < 3 ? (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                ) : (
                  <RotateCcw className="w-3 h-3 text-slate-500 hidden sm:block" />
                )}
              </div>

              <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[9px]">
                <span className="text-slate-400">Ação Biomecânica:</span>
                <span className="text-slate-300 font-bold truncate max-w-[120px]">
                  {item.state === 'idle_rest'
                    ? 'Respiração 100%'
                    : item.state === 'pre_speech'
                    ? `${config.preSpeechDurationMs}ms`
                    : item.state === 'speaking'
                    ? 'Visemas ON'
                    : `${config.postSpeechDurationMs}ms`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monitor de Interpolação Biométrica em Tempo Real */}
      <div className="p-4 rounded-xl bg-obsidian-900/60 border border-white/5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-200 font-bold">
              Telemetria de Interpolação Suave em Execução
            </span>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${activeDef.badgeColor} ${activeDef.borderColor} ${activeDef.textColor}`}>
            ● {activeDef.label}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-obsidian-950 border border-white/5 space-y-1">
            <span className="text-slate-400 text-[10px] block">Abertura Labial (Mouth Ratio)</span>
            <span className="text-sm font-mono font-bold text-amber-300">
              {(snapshot.mouthOpenRatio * 100).toFixed(0)}%
            </span>
            <div className="w-full bg-obsidian-900 rounded-full h-1 mt-1">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-75"
                style={{ width: `${snapshot.mouthOpenRatio * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-obsidian-950 border border-white/5 space-y-1">
            <span className="text-slate-400 text-[10px] block">Amortecimento de Respiração</span>
            <span className="text-sm font-mono font-bold text-cyan-300">
              {(snapshot.breathingDamping * 100).toFixed(0)}%
            </span>
            <div className="w-full bg-obsidian-900 rounded-full h-1 mt-1">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-75"
                style={{ width: `${snapshot.breathingDamping * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-obsidian-950 border border-white/5 space-y-1">
            <span className="text-slate-400 text-[10px] block">Liberdade de Head Tilt</span>
            <span className="text-sm font-mono font-bold text-indigo-300">
              {(snapshot.headTiltWeight * 100).toFixed(0)}%
            </span>
            <div className="w-full bg-obsidian-900 rounded-full h-1 mt-1">
              <div
                className="bg-indigo-400 h-full rounded-full transition-all duration-75"
                style={{ width: `${snapshot.headTiltWeight * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-obsidian-950 border border-white/5 space-y-1">
            <span className="text-slate-400 text-[10px] block">Status de Supressão Ocular</span>
            <span className={`text-sm font-mono font-bold ${snapshot.blinkingSuppressed ? 'text-amber-400' : 'text-emerald-400'}`}>
              {snapshot.blinkingSuppressed ? 'Piscadas Suprimidas' : 'Piscadas Normais'}
            </span>
            <span className="text-[9px] text-slate-400 block truncate">
              Visema: {snapshot.activeVisemeName}
            </span>
          </div>
        </div>
      </div>

      {/* Sliders de Calibração das Transições */}
      <div className="p-4 rounded-xl bg-obsidian-900/40 border border-white/5 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-white/5 text-slate-300 font-bold">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            Parâmetros Fisiológicos de Duração & Amortecimento
          </span>
          <span className="text-[10px] text-slate-400">Total ciclo ~3.4s</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Slider 1: Duração Pre-Speech */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Duração da Inalação Pré-Fala (Pre-Speech):</span>
              <span className="text-amber-300 font-bold font-mono">{config.preSpeechDurationMs} ms</span>
            </div>
            <input
              type="range"
              min={100}
              max={500}
              step={10}
              value={config.preSpeechDurationMs}
              onChange={(e) =>
                setConfig({
                  ...config,
                  preSpeechDurationMs: Number(e.target.value),
                })
              }
              className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>100ms (Rápido)</span>
              <span>220ms (Fisiológico)</span>
              <span>500ms (Dramático)</span>
            </div>
          </div>

          {/* Slider 2: Duração Post-Speech */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Duração do Relaxamento Pós-Fala (Post-Speech):</span>
              <span className="text-purple-300 font-bold font-mono">{config.postSpeechDurationMs} ms</span>
            </div>
            <input
              type="range"
              min={150}
              max={600}
              step={10}
              value={config.postSpeechDurationMs}
              onChange={(e) =>
                setConfig({
                  ...config,
                  postSpeechDurationMs: Number(e.target.value),
                })
              }
              className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>150ms (Imediato)</span>
              <span>320ms (Orgânico)</span>
              <span>600ms (Suave)</span>
            </div>
          </div>

          {/* Slider 3: Amortecimento de Respiração */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Amortecimento Torácico durante a Fala:</span>
              <span className="text-cyan-300 font-bold font-mono">
                {(config.breathingDampingFactor * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min={0.1}
              max={0.8}
              step={0.05}
              value={config.breathingDampingFactor}
              onChange={(e) =>
                setConfig({
                  ...config,
                  breathingDampingFactor: Number(e.target.value),
                })
              }
              className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>10% (Tórax quase fixo)</span>
              <span>35% (Padrão Fonatório)</span>
              <span>80% (Respiração Intensa)</span>
            </div>
          </div>

          {/* Slider 4: Peso de Interpolação Labial */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Peso de Suavização Labial (Blend Weight):</span>
              <span className="text-emerald-300 font-bold font-mono">
                {(config.mouthBlendWeight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1.0}
              step={0.05}
              value={config.mouthBlendWeight}
              onChange={(e) =>
                setConfig({
                  ...config,
                  mouthBlendWeight: Number(e.target.value),
                })
              }
              className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>10% (Linear)</span>
              <span>85% (Curva Sigmoide)</span>
              <span>100% (Instantâneo)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualizador de Código JS da FSM */}
      {showCodeSnippet && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-amber-400" />
              Classe JavaScript Autocontida da FSM para o V5 Broadcaster (:3008)
            </span>
            <span className="text-[10px] text-slate-400">Compatível com Node.js e Navegador</span>
          </div>
          <pre className="p-4 rounded-xl bg-obsidian-950 border border-amber-500/20 text-amber-200 text-xs overflow-x-auto max-h-60 scrollbar-thin font-mono selection:bg-amber-500 selection:text-obsidian-950">
            {generateCleanFsmIntegrationSnippet(config)}
          </pre>
        </div>
      )}
    </div>
  );
}
