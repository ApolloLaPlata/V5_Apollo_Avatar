'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  IdleCanvasLayerToggles,
  IdleCanvasSceneState,
  renderIdleCanvasFrame,
} from '@/utils/idleCanvasRenderer';
import { DEFAULT_BREATHING_CONFIG } from '@/utils/idleBreathingEngine';
import { DEFAULT_EYE_BLINK_CONFIG, calculateNextBlinkInterval } from '@/utils/naturalEyeBlinkEngine';
import { DEFAULT_HEAD_TILT_CONFIG, calculateRandomHeadPose, HeadTiltPose } from '@/utils/headTiltEngine';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  Monitor,
  Play,
  Pause,
  Camera,
  Layers,
  Activity,
  Maximize2,
  Sparkles,
  Sliders,
  Eye,
  Wind,
  Compass,
  Cpu,
  RefreshCw,
  Check,
} from 'lucide-react';

interface IdleLiveCanvasViewerProps {
  avatarId?: string;
  avatarName?: string;
  avatarUrl?: string;
}

export default function IdleLiveCanvasViewer({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
  avatarUrl = '/sample-avatar.png',
}: IdleLiveCanvasViewerProps) {
  const { avatars } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId) || avatars[0];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Estados de Renderização e Controles
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [resolution, setResolution] = useState<{ w: number; h: number }>({ w: 480, h: 640 });
  const [toggles, setToggles] = useState<IdleCanvasLayerToggles>({
    breathing: true,
    blinking: true,
    headTilt: true,
    lightingGlow: true,
    wireframeHud: true,
    mirror: false,
  });

  // Telemetria 60 FPS
  const [fps, setFps] = useState<number>(60);
  const [frameTimeMs, setFrameTimeMs] = useState<number>(1.2);
  const [totalFrames, setTotalFrames] = useState<number>(0);

  // Estados dos subsistemas
  const [currentPose, setCurrentPose] = useState<HeadTiltPose>({ pitch: 0, yaw: 0, roll: 0 });
  const [eyelidProgress, setEyelidProgress] = useState<number>(100);

  // Imagem carregada do avatar (se disponível)
  const avatarImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (avatarUrl && avatarUrl !== '/sample-avatar.png') {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = avatarUrl;
      img.onload = () => {
        avatarImgRef.current = img;
      };
    } else {
      avatarImgRef.current = null;
    }
  }, [avatarUrl]);

  // Loop autônomo de Head Tilts para o Canvas
  useEffect(() => {
    if (!isPlaying || !toggles.headTilt) return;

    const headConfig = currentAvatar?.rigging?.headTiltConfig || DEFAULT_HEAD_TILT_CONFIG;
    let timer: NodeJS.Timeout;

    const nextTilt = () => {
      const pose = calculateRandomHeadPose(headConfig);
      setCurrentPose(pose);
      const dwellMs = (headConfig.transitionDurationSeconds + headConfig.dwellTimeSeconds) * 1000;
      timer = setTimeout(nextTilt, dwellMs);
    };

    nextTilt();
    return () => clearTimeout(timer);
  }, [isPlaying, toggles.headTilt, currentAvatar]);

  // Loop autônomo de Piscada para o Canvas
  useEffect(() => {
    if (!isPlaying || !toggles.blinking) return;

    const blinkConfig = currentAvatar?.rigging?.eyeBlinkConfig || DEFAULT_EYE_BLINK_CONFIG;
    let timer: NodeJS.Timeout;

    const scheduleNextBlink = () => {
      const next = calculateNextBlinkInterval(blinkConfig);
      timer = setTimeout(() => {
        const start = performance.now();
        const duration = blinkConfig.blinkDurationMs;

        const animStep = () => {
          const elapsed = performance.now() - start;
          const progress = Math.min(100, (elapsed / duration) * 100);
          setEyelidProgress(progress);

          if (progress < 100) {
            requestAnimationFrame(animStep);
          } else {
            setEyelidProgress(100);
          }
        };

        requestAnimationFrame(animStep);
        scheduleNextBlink();
      }, next.delayMs);
    };

    scheduleNextBlink();
    return () => clearTimeout(timer);
  }, [isPlaying, toggles.blinking, currentAvatar]);

  // Render Loop Principal a 60 FPS
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    let frameCounter = 0;
    let fpsTimer = performance.now();

    const loop = (timestamp: number) => {
      const startRender = performance.now();

      const breathingConfig =
        currentAvatar?.rigging?.breathingConfig || DEFAULT_BREATHING_CONFIG;
      const eyeBlinkConfig =
        currentAvatar?.rigging?.eyeBlinkConfig || DEFAULT_EYE_BLINK_CONFIG;
      const headTiltConfig =
        currentAvatar?.rigging?.headTiltConfig || DEFAULT_HEAD_TILT_CONFIG;

      const state: IdleCanvasSceneState = {
        breathingConfig,
        eyeBlinkConfig,
        headTiltConfig,
        toggles,
        currentPose,
        eyelidProgressPercent: eyelidProgress,
        avatarImage: avatarImgRef.current,
        avatarName: currentAvatar?.name || avatarName,
      };

      // Executa o pipeline de renderização
      renderIdleCanvasFrame(ctx, canvas.width, canvas.height, state, timestamp);

      const renderDuration = performance.now() - startRender;
      frameCounter++;

      // Atualiza telemetria a cada 500ms
      if (timestamp - fpsTimer >= 500) {
        const currentFps = Math.round((frameCounter * 1000) / (timestamp - fpsTimer));
        setFps(Math.min(60, currentFps));
        setFrameTimeMs(Number(renderDuration.toFixed(2)));
        setTotalFrames((prev) => prev + frameCounter);
        frameCounter = 0;
        fpsTimer = timestamp;
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, toggles, currentPose, eyelidProgress, currentAvatar, avatarName]);

  // Captura Snapshot PNG instantâneo do Canvas a 60 FPS
  const handleCaptureSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `avatar_idle_60fps_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.success(
      'Snapshot Capturado!',
      `Frame 60 FPS salvo com sucesso (${canvas.width}x${canvas.height} PNG).`
    );
  };

  const handleToggle = (key: keyof IdleCanvasLayerToggles) => {
    setToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Header com Telemetria de Frame Rate */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyber-cyan border border-cyber-cyan/30 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Visualizador ao Vivo do Avatar em Estado Idle (Multi-Layer Canvas 60 FPS)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {fps} FPS
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Composição unificada em tempo real: respiração senoidal, piscada estocástica e Head Tilts 3D
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              isPlaying
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-obsidian-900 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Executando
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Pausado
              </>
            )}
          </button>

          <button
            onClick={handleCaptureSnapshot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-cyber-cyan/40 transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-cyber-cyan" />
            Snapshot PNG
          </button>

          {/* Seletor de Resolução */}
          <div className="flex items-center gap-1 p-1 bg-obsidian-900 rounded-lg border border-white/10 text-[10px]">
            {[
              { label: '480x640', w: 480, h: 640 },
              { label: '512x512', w: 512, h: 512 },
              { label: '600x800', w: 600, h: 800 },
            ].map((res) => (
              <button
                key={res.label}
                onClick={() => setResolution({ w: res.w, h: res.h })}
                className={`px-2 py-0.5 rounded transition-all ${
                  resolution.w === res.w && resolution.h === res.h
                    ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {res.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Layout: Canvas Viewport + Layer Toggles & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Canvas Viewport */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 rounded-2xl bg-obsidian-950/80 border border-white/5 relative group">
          <canvas
            ref={canvasRef}
            width={resolution.w}
            height={resolution.h}
            className="max-h-[500px] w-auto max-w-full object-contain rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.8)] border border-white/5 bg-obsidian-950"
          />

          {/* Quick HUD Telemetry Strip */}
          <div className="w-full mt-3 flex items-center justify-between text-[10px] text-slate-400 px-2 font-mono">
            <span>Resolução: <strong className="text-slate-200">{resolution.w}x{resolution.h}</strong></span>
            <span>Render Time: <strong className="text-emerald-400">{frameTimeMs} ms</strong></span>
            <span>Frames Totais: <strong className="text-cyber-cyan">{totalFrames}</strong></span>
          </div>
        </div>

        {/* Right Column: Layer Toggles & Subsystem Monitors */}
        <div className="lg:col-span-5 space-y-4">
          {/* Toggles de Camadas do Canvas */}
          <div className="p-4 rounded-xl bg-obsidian-900/60 border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-200 font-bold pb-2 border-b border-white/5">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyber-cyan" />
                Camadas Biológicas & Overlays
              </span>
              <span className="text-[10px] text-slate-400">Ativação Independente</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleToggle('breathing')}
                className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                  toggles.breathing
                    ? 'bg-cyan-500/15 border-cyber-cyan text-slate-100'
                    : 'bg-obsidian-950 border-white/5 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Wind className="w-3 h-3 text-cyan-400" />
                  Respiração (Y/X)
                </span>
                <span className="text-[10px] font-bold">{toggles.breathing ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => handleToggle('blinking')}
                className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                  toggles.blinking
                    ? 'bg-purple-500/15 border-purple-500 text-slate-100'
                    : 'bg-obsidian-950 border-white/5 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3 h-3 text-purple-400" />
                  Piscada Natural
                </span>
                <span className="text-[10px] font-bold">{toggles.blinking ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => handleToggle('headTilt')}
                className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                  toggles.headTilt
                    ? 'bg-indigo-500/15 border-indigo-500 text-slate-100'
                    : 'bg-obsidian-950 border-white/5 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3 h-3 text-indigo-400" />
                  Head Tilts 3D
                </span>
                <span className="text-[10px] font-bold">{toggles.headTilt ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => handleToggle('wireframeHud')}
                className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                  toggles.wireframeHud
                    ? 'bg-amber-500/15 border-amber-500 text-slate-100'
                    : 'bg-obsidian-950 border-white/5 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-amber-400" />
                  HUD Ósseo
                </span>
                <span className="text-[10px] font-bold">{toggles.wireframeHud ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => handleToggle('lightingGlow')}
                className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                  toggles.lightingGlow
                    ? 'bg-blue-500/15 border-blue-500 text-slate-100'
                    : 'bg-obsidian-950 border-white/5 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  Glow de Fundo
                </span>
                <span className="text-[10px] font-bold">{toggles.lightingGlow ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => handleToggle('mirror')}
                className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                  toggles.mirror
                    ? 'bg-rose-500/15 border-rose-500 text-slate-100'
                    : 'bg-obsidian-950 border-white/5 text-slate-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 text-rose-400" />
                  Modo Espelho
                </span>
                <span className="text-[10px] font-bold">{toggles.mirror ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Telemetria Unificada em Tempo Real */}
          <div className="p-4 rounded-xl bg-obsidian-900/40 border border-white/5 space-y-3 text-xs">
            <span className="text-slate-300 font-bold block pb-1 border-b border-white/5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyber-cyan" />
              Sincronização Biológica em Tempo Real
            </span>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Head Tilt Atual (3D):</span>
                <span className="font-mono text-indigo-300 font-bold">
                  Roll: {currentPose.roll}º | Yaw: {currentPose.yaw}º | Pitch: {currentPose.pitch}º
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Pálpebras (Progresso Ciclo):</span>
                <span className="font-mono text-purple-300 font-bold">
                  {eyelidProgress < 100 ? `Fechamento: ${eyelidProgress.toFixed(0)}%` : 'Olhos Abertos'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Taxa de Atualização Estável:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  60.0 FPS (~16.6ms frame budget)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
