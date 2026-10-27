'use client';

import React, { useState } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  Monitor,
  Tv,
  Layers,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Square,
  Maximize2,
  Radio,
  Sliders,
  Cpu,
  Code2,
} from 'lucide-react';

interface ObsTransparentOverlayPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function ObsTransparentOverlayPanel({
  avatarId,
  avatarName,
}: ObsTransparentOverlayPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const targetId = currentAvatar?.id || 'avatar-maya-vance';
  const targetName = currentAvatar?.name || avatarName || 'Maya Vance';
  const avatarImage = currentAvatar?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  const [testBackground, setTestBackground] = useState<'checkerboard' | 'gameplay' | 'podcast' | 'chroma'>('checkerboard');
  const [overlayMode, setOverlayMode] = useState<'corner' | 'full' | 'portrait'>('corner');
  const [targetFps, setTargetFps] = useState<60 | 30>(60);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);

  const overlayUrl = `http://localhost:3010/live/overlay?avatarId=${targetId}&fps=${targetFps}&mode=${overlayMode}&glow=true`;

  const obsCustomCss = `body {
  background-color: rgba(0, 0, 0, 0);
  margin: 0px auto;
  overflow: hidden;
}

#v5-avatar-live-viewport {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyCss = () => {
    navigator.clipboard.writeText(obsCustomCss);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2000);
  };

  return (
    <section className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(0,229,255,0.06)] relative overflow-hidden">
      {/* Glow Superior */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-80" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase">
            <Radio className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            Fase 8 · Conector de Live V5 Broadcaster · Etapa 076
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-3">
            <Tv className="w-6 h-6 text-cyber-cyan" />
            Overlay Web Otimizado para OBS (Fundo Transparente & Hardware Accel)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Endpoint soberano <code className="text-cyber-cyan font-bold">/live/overlay</code> para
            Browser Source no OBS Studio a 60 FPS com aceleração por GPU, zero layout shift e fundo alpha transparente.
          </p>
        </div>

        {/* Status de Aceleração por Hardware */}
        <div className="flex items-center gap-3 bg-obsidian-950 px-4 py-2.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-500">GPU Compositing</div>
              <div className="text-xs font-bold text-emerald-400 font-mono">
                translateZ(0) ATIVO · 60 FPS
              </div>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Zero Chroma Key
          </span>
        </div>
      </div>

      {/* Grid: Simulador de Cena OBS vs Controles de URL e CSS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Simulador da Janela do OBS (7 Colunas) */}
        <div className="lg:col-span-7 bg-obsidian-950/90 border border-white/10 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
              <Monitor className="w-4 h-4 text-cyber-cyan" />
              Simulador do Canvas do OBS Studio (1920x1080)
            </span>

            {/* Seletor de Fundo de Teste */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-[10px] font-mono">
              {[
                { id: 'checkerboard', label: '🏁 Alpha' },
                { id: 'gameplay', label: '🎮 Game' },
                { id: 'podcast', label: '🎙️ Studio' },
                { id: 'chroma', label: '🟩 Green' },
              ].map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setTestBackground(bg.id as 'checkerboard' | 'gameplay' | 'podcast' | 'chroma')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    testBackground === bg.id
                      ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Simulado do OBS */}
          <div
            className={`relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 flex ${
              overlayMode === 'corner'
                ? 'items-end justify-end p-4'
                : overlayMode === 'portrait'
                ? 'items-center justify-center'
                : 'items-end justify-center'
            } transition-all`}
            style={{
              backgroundColor: testBackground === 'chroma' ? '#00ff00' : undefined,
              backgroundImage:
                testBackground === 'checkerboard'
                  ? 'repeating-conic-gradient(#1e293b 0% 25%, #0f172a 0% 50%) 50% / 20px 20px'
                  : testBackground === 'gameplay'
                  ? 'radial-gradient(circle at center, #1e1b4b 0%, #030712 100%)'
                  : testBackground === 'podcast'
                  ? 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #27272a 100%)'
                  : undefined,
            }}
          >
            {/* Elementos Simulados de Fundo (se Gameplay ou Podcast) */}
            {testBackground === 'gameplay' && (
              <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[10px] font-mono text-cyan-300/80 bg-obsidian-950/60 p-2 rounded w-fit">
                  <span>🔴 LIVE STREAM · 1080p60 · FPS: 144</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 bg-obsidian-950/60 p-2 rounded w-fit">
                  Gameplay Footage HUD Simulado
                </div>
              </div>
            )}

            {/* O Avatar Projetado com Fundo Transparente Absoluto */}
            <div
              className={`relative transition-all duration-300 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)] ${
                overlayMode === 'corner'
                  ? 'w-48 h-60'
                  : overlayMode === 'portrait'
                  ? 'w-44 h-full py-2'
                  : 'w-72 h-[90%]'
              }`}
            >
              <img
                src={avatarImage}
                alt={targetName}
                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]"
              />
            </div>

            {/* Badge de Overlay Ativo */}
            <div className="absolute top-3 right-3 text-[10px] font-mono bg-obsidian-950/85 px-2.5 py-1 rounded border border-cyber-cyan/30 text-cyber-cyan flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              OBS Browser Source 60 FPS
            </div>
          </div>

          {/* Seletores de Layout de Enquadramento */}
          <div className="flex items-center justify-between pt-1 text-xs font-mono">
            <span className="text-slate-400">Modo de Exibição:</span>
            <div className="flex gap-2">
              {[
                { id: 'corner', label: 'PIP Canto (Facecam)' },
                { id: 'full', label: 'Bancada Fullscreen' },
                { id: 'portrait', label: 'Vertical 9:16' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setOverlayMode(m.id as 'corner' | 'full' | 'portrait')}
                  className={`px-2.5 py-1 rounded text-[11px] border transition-all ${
                    overlayMode === m.id
                      ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan font-bold'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna de Configuração de URL e CSS para OBS (5 Colunas) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          {/* Caixa de URL do Browser Source */}
          <div className="bg-obsidian-950/90 border border-white/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyber-cyan" />
                URL da Fonte do Navegador (OBS)
              </span>
              <a
                href={overlayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono text-slate-400 hover:text-cyber-cyan flex items-center gap-1 transition-colors"
              >
                Abrir <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 bg-obsidian-900 border border-white/10 rounded-lg p-2.5">
                <span className="font-mono text-xs text-cyber-cyan truncate flex-1 select-all">
                  {overlayUrl}
                </span>
                <button
                  onClick={handleCopyUrl}
                  className="p-1.5 hover:bg-white/10 rounded text-slate-300 transition-colors"
                  title="Copiar URL para o OBS"
                >
                  {copiedUrl ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-[10px] font-mono text-slate-500">
              No OBS Studio: <strong>Adicionar Fonte &rarr; Navegador (Browser)</strong> e cole a URL acima com largura <strong>1920</strong> e altura <strong>1080</strong>.
            </p>
          </div>

          {/* Caixa de CSS Customizado para OBS */}
          <div className="bg-obsidian-950/90 border border-white/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyber-cyan" />
                CSS Personalizado para OBS Studio
              </span>
              <button
                onClick={handleCopyCss}
                className="text-[11px] font-mono text-slate-400 hover:text-cyber-cyan flex items-center gap-1 transition-colors"
              >
                {copiedCss ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copiar CSS
                  </>
                )}
              </button>
            </div>

            <pre className="bg-obsidian-900 border border-white/10 rounded-lg p-3 text-[11px] font-mono text-cyan-200/90 overflow-x-auto h-28 select-all whitespace-pre">
              {obsCustomCss}
            </pre>
          </div>

          {/* Checklist de Homologação OBS */}
          <div className="bg-obsidian-950/90 border border-white/10 rounded-xl p-4 space-y-2">
            <div className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Garantias de Engenharia para Live 24/7
            </div>
            <div className="space-y-1 text-[11px] font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Fundo 100% Alpha Transparente nativo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Aceleração por hardware GPU (translateZ 0)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Taxa travada em 60 FPS com zero layout shift</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
