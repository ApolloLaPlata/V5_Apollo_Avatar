'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  IdleSpritesheetManifest,
} from '@/types/avatar';
import {
  CANONICAL_SPRITESHEET_PRESETS,
  compileIdleSpritesheetAtlas,
  generateStepsAnimationCss,
  downloadAtlasPng,
  downloadManifestJson,
  SpritesheetGridPreset,
} from '@/utils/idleSpritesheetGenerator';
import { DEFAULT_BREATHING_CONFIG } from '@/utils/idleBreathingEngine';
import { DEFAULT_EYE_BLINK_CONFIG } from '@/utils/naturalEyeBlinkEngine';
import { DEFAULT_HEAD_TILT_CONFIG } from '@/utils/headTiltEngine';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  Film,
  Play,
  Pause,
  Download,
  Copy,
  Check,
  Save,
  Grid,
  Layers,
  Sparkles,
  Code,
  FileJson,
  Activity,
  Maximize2,
  Cpu,
} from 'lucide-react';

interface IdleSpritesheetGeneratorPanelProps {
  avatarId?: string;
  avatarName?: string;
  avatarUrl?: string;
}

export default function IdleSpritesheetGeneratorPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
  avatarUrl = '/sample-avatar.png',
}: IdleSpritesheetGeneratorPanelProps) {
  const { avatars, updateAvatar } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId) || avatars[0];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const avatarImgRef = useRef<HTMLImageElement | null>(null);

  const [selectedPresetId, setSelectedPresetId] = useState<'16_frames' | '24_frames' | '32_frames'>('24_frames');
  const [manifest, setManifest] = useState<IdleSpritesheetManifest | null>(
    currentAvatar?.rigging?.idleSpritesheetManifest || null
  );
  const [atlasDataUrl, setAtlasDataUrl] = useState<string | null>(
    currentAvatar?.rigging?.idleSpritesheetManifest?.atlasUrl || null
  );

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(true);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [copiedCss, setCopiedCss] = useState<boolean>(false);
  const [showCssSnippet, setShowCssSnippet] = useState<boolean>(false);

  const activePreset = CANONICAL_SPRITESHEET_PRESETS[selectedPresetId];

  // Carrega a imagem do avatar
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

  // Função de compilação do spritesheet
  const handleCompileAtlas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);

    setTimeout(() => {
      try {
        const breathingConfig =
          currentAvatar?.rigging?.breathingConfig || DEFAULT_BREATHING_CONFIG;
        const headTiltConfig =
          currentAvatar?.rigging?.headTiltConfig || DEFAULT_HEAD_TILT_CONFIG;
        const eyeBlinkConfig =
          currentAvatar?.rigging?.eyeBlinkConfig || DEFAULT_EYE_BLINK_CONFIG;

        const result = compileIdleSpritesheetAtlas(canvas, {
          totalFrames: activePreset.totalFrames,
          columns: activePreset.columns,
          rows: activePreset.rows,
          frameWidth: activePreset.frameWidth,
          frameHeight: activePreset.frameHeight,
          fps: activePreset.fps,
          breathingConfig,
          headTiltConfig,
          eyeBlinkConfig,
          avatarImage: avatarImgRef.current,
          avatarName: currentAvatar?.name || avatarName,
        });

        setManifest(result.manifest);
        setAtlasDataUrl(result.dataUrl);
        setIsGenerating(false);

        toast.success(
          'Spritesheet Gerado com Sucesso!',
          `${result.manifest.totalFrames} quadros compilados em ${result.manifest.atlasWidth}x${result.manifest.atlasHeight} px.`
        );
      } catch (err) {
        setIsGenerating(false);
        toast.error('Erro ao compilar spritesheet', String(err));
      }
    }, 150);
  };

  // Compila automaticamente no carregamento se ainda não existir
  useEffect(() => {
    if (!manifest && canvasRef.current) {
      handleCompileAtlas();
    }
  }, []);

  // Player em loop de preview do spritesheet
  useEffect(() => {
    if (!isPlayingPreview || !manifest) return;

    const intervalMs = (1 / manifest.fps) * 1000;
    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % manifest.totalFrames);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlayingPreview, manifest]);

  const handleDownloadPng = () => {
    if (!atlasDataUrl || !manifest) return;
    downloadAtlasPng(atlasDataUrl, currentAvatar?.name || avatarName, manifest.totalFrames);
    toast.success('Download Iniciado', 'Arquivo PNG do Atlas baixado.');
  };

  const handleDownloadJson = () => {
    if (!manifest) return;
    downloadManifestJson(manifest, currentAvatar?.name || avatarName);
    toast.success('Download Iniciado', 'Manifesto TexturePacker / JSON baixado.');
  };

  const handleCopyCss = () => {
    if (!manifest) return;
    const css = generateStepsAnimationCss(manifest);
    navigator.clipboard.writeText(css);
    setCopiedCss(true);
    toast.success('CSS Copiado!', 'Keyframes steps() copiados para a área de transferência.');
    setTimeout(() => setCopiedCss(false), 2000);
  };

  const handleSaveToAvatar = () => {
    if (!currentAvatar || !manifest) return;
    updateAvatar(avatarId, {
      rigging: {
        ...currentAvatar.rigging,
        idleSpritesheetManifest: manifest,
      },
    });
    toast.success('Salvo no Avatar Store!', 'Manifesto do spritesheet salvo no Rigging DNA.');
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Canvas invisível para compilação do Atlas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Gerador de Spritesheets de Animação Idle (Texture Atlas Generator)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Fase 7 · Etapa 067
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Exportação para OBS Browser Source, overlays leves e web (<strong className="text-emerald-400">&lt;0.1% CPU</strong>)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCompileAtlas}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-obsidian-950 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all active:scale-95"
          >
            <Grid className="w-3.5 h-3.5" />
            {isGenerating ? 'Compilando Atlas...' : 'Gerar Novo Atlas'}
          </button>

          <button
            onClick={handleDownloadPng}
            disabled={!atlasDataUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-emerald-400/40 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Baixar PNG
          </button>

          <button
            onClick={handleDownloadJson}
            disabled={!manifest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-emerald-400/40 transition-colors disabled:opacity-50"
          >
            <FileJson className="w-3.5 h-3.5 text-cyber-cyan" />
            Manifesto JSON
          </button>

          <button
            onClick={() => setShowCssSnippet(!showCssSnippet)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-emerald-400/40 transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-amber-400" />
            {showCssSnippet ? 'Ocultar CSS' : 'Ver CSS Steps()'}
          </button>

          <button
            onClick={handleCopyCss}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-emerald-400/40 transition-colors"
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 hover:border-white/30 text-slate-200 text-xs font-bold transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            Salvar no Avatar
          </button>
        </div>
      </div>

      {/* Seletor de Presets de Matriz */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(Object.keys(CANONICAL_SPRITESHEET_PRESETS) as Array<keyof typeof CANONICAL_SPRITESHEET_PRESETS>).map(
          (presetKey) => {
            const p = CANONICAL_SPRITESHEET_PRESETS[presetKey];
            const isSelected = selectedPresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPresetId(presetKey)}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500 text-slate-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-obsidian-900/60 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold block">{p.label}</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    {p.fps} FPS
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 leading-relaxed mt-1">
                  {p.description}
                </span>
              </button>
            );
          }
        )}
      </div>

      {/* Main Grid: Player em Loop + Filmstrip Sequencial */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Player de Preview do Sprite em Loop */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-obsidian-900/60 border border-white/5 space-y-4">
          <div className="flex items-center justify-between w-full text-xs pb-2 border-b border-white/5">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              Preview em Loop (CSS Steps)
            </span>
            <span className="text-[10px] text-emerald-300 font-mono font-bold">
              Quadro {currentFrameIndex + 1} de {manifest?.totalFrames || activePreset.totalFrames}
            </span>
          </div>

          {/* Viewport do Sprite Tile */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-obsidian-950 border border-emerald-500/30 overflow-hidden flex items-center justify-center shadow-xl">
            {atlasDataUrl && manifest ? (
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${atlasDataUrl})`,
                  backgroundSize: `${manifest.columns * 100}% ${manifest.rows * 100}%`,
                  backgroundPosition: `${-(currentFrameIndex % manifest.columns) * 100}% ${-(Math.floor(currentFrameIndex / manifest.columns)) * 100}%`,
                  imageRendering: '-webkit-optimize-contrast',
                }}
              />
            ) : (
              <div className="text-center text-slate-500 text-xs">
                <Grid className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                Atlas não compilado
              </div>
            )}
          </div>

          {/* Controles de Reprodução */}
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-obsidian-950 border border-white/10 text-xs text-slate-300 hover:text-white"
              >
                {isPlayingPreview ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {isPlayingPreview ? 'Pausar' : 'Play'}
              </button>

              <span className="text-[10px] text-slate-400 font-mono">
                Cadência: <strong className="text-emerald-400">{manifest?.fps || activePreset.fps} FPS</strong>
              </span>

              <span className="text-[10px] text-slate-400 font-mono">
                Duração: <strong className="text-slate-200">{manifest?.durationSeconds || 1.5}s</strong>
              </span>
            </div>

            {/* Scrubber de Quadro */}
            <input
              type="range"
              min={0}
              max={(manifest?.totalFrames || activePreset.totalFrames) - 1}
              value={currentFrameIndex}
              onChange={(e) => {
                setIsPlayingPreview(false);
                setCurrentFrameIndex(Number(e.target.value));
              }}
              className="w-full h-1.5 bg-obsidian-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>
        </div>

        {/* Right Column: Filmstrip Horizontal e Atlas Preview */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filmstrip Sequencial de Todos os Quadros */}
          <div className="p-4 rounded-xl bg-obsidian-900/60 border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-white/5">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyber-cyan" />
                Filmstrip dos {manifest?.totalFrames || activePreset.totalFrames} Quadros Sequenciais
              </span>
              <span className="text-[10px] text-slate-400">Clique para inspecionar</span>
            </div>

            {/* Lista com scroll horizontal */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {manifest?.frames.map((frame, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsPlayingPreview(false);
                    setCurrentFrameIndex(idx);
                  }}
                  className={`flex-shrink-0 w-16 h-20 rounded-lg border text-center p-1 flex flex-col justify-between transition-all ${
                    currentFrameIndex === idx
                      ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                      : 'bg-obsidian-950 border-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <span className="text-[9px] font-bold block">#{idx + 1}</span>
                  <div
                    className="w-full h-10 rounded border border-white/5 bg-obsidian-900"
                    style={{
                      backgroundImage: `url(${atlasDataUrl})`,
                      backgroundSize: `${manifest.columns * 100}% ${manifest.rows * 100}%`,
                      backgroundPosition: `${-(idx % manifest.columns) * 100}% ${-(Math.floor(idx / manifest.columns)) * 100}%`,
                    }}
                  />
                  <span className="text-[8px] font-mono block text-slate-400">{frame.timeSeconds}s</span>
                </button>
              ))}
            </div>
          </div>

          {/* Atlas Completo Compacto */}
          {atlasDataUrl && (
            <div className="p-4 rounded-xl bg-obsidian-900/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-white/5 text-slate-300">
                <span>Atlas Compilado ({manifest?.atlasWidth}x{manifest?.atlasHeight} px)</span>
                <span className="text-[10px] text-emerald-400 font-mono">PNG 32-bit</span>
              </div>
              <div className="max-h-48 overflow-y-auto rounded-lg border border-white/5 bg-obsidian-950 p-2 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={atlasDataUrl}
                  alt="Idle Spritesheet Atlas"
                  className="max-h-44 object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Snippet CSS Steps() */}
      {showCssSnippet && manifest && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              Snippet CSS Steps() para Embedding Instantâneo
            </span>
            <span className="text-[10px] text-emerald-400">Overhead inferior a 0.1% CPU</span>
          </div>
          <pre className="p-4 rounded-xl bg-obsidian-950 border border-emerald-500/20 text-emerald-200 text-xs overflow-x-auto max-h-60 scrollbar-thin font-mono selection:bg-emerald-500 selection:text-obsidian-950">
            {generateStepsAnimationCss(manifest)}
          </pre>
        </div>
      )}
    </div>
  );
}
