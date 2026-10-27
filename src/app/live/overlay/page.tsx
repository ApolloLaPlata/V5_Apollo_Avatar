'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAvatarStore } from '@/store/useAvatarStore';
import { CANONICAL_VISEMES_CATALOG } from '@/utils/visemesEngine';
import { VisemeType } from '@/types/avatar';
import { Activity, ShieldCheck, Sparkles } from 'lucide-react';

function LiveOverlayContent() {
  const searchParams = useSearchParams();
  const { avatars } = useAvatarStore();

  const avatarId = searchParams.get('avatarId') || 'avatar-maya-vance';
  const targetFps = parseInt(searchParams.get('fps') || '60', 10);
  const chroma = searchParams.get('chroma') || 'transparent';
  const mode = searchParams.get('mode') || 'full';
  const debugParam = searchParams.get('debug') === '1';
  const glowParam = searchParams.get('glow') !== 'false';

  const [isDebugVisible, setIsDebugVisible] = useState(debugParam);
  const currentAvatar = avatars.find((a) => a.id === avatarId) || avatars[0];

  const avatarName = currentAvatar?.name || 'Maya Vance';
  const avatarImage = currentAvatar?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  // Estados de animação em tempo real
  const [breathingY, setBreathingY] = useState(0);
  const [headTilt, setHeadTilt] = useState({ pitch: 0, yaw: 0, roll: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [activeViseme, setActiveViseme] = useState<VisemeType>('silence');
  const [mouthOpenFactor, setMouthOpenFactor] = useState(0);
  const [fpsActual, setFpsActual] = useState(targetFps);

  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(Date.now());
  const nextBlinkTimeRef = useRef(Date.now() + 3000);

  // Toggle de debug por tecla 'D'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        setIsDebugVisible((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Loop de Animação 60 FPS com Aceleração por Hardware
  useEffect(() => {
    let animId: number;

    const renderLoop = () => {
      const now = Date.now();
      const timeSec = now / 1000;

      // 1. Respiração Orgânica
      const breath = Math.sin(timeSec * 2.1) * 0.9;
      setBreathingY(breath);

      // 2. Micro-movimentos de Cabeça
      const pitch = Math.sin(timeSec * 0.7) * 2.1;
      const yaw = Math.cos(timeSec * 0.5) * 3.2;
      const roll = Math.sin(timeSec * 0.4) * 2.8;
      setHeadTilt({ pitch, yaw, roll });

      // 3. Piscar Estocástico
      if (now >= nextBlinkTimeRef.current) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 160);
        const randomNext = 2500 + Math.random() * 3500; // 2.5s a 6.0s
        nextBlinkTimeRef.current = now + randomNext;
      }

      // 4. Ciclo Fisiológico de Fala / Visemas
      const cycle = Math.floor(timeSec * 3) % 10;
      if (cycle === 0) {
        setActiveViseme('A_I');
        setMouthOpenFactor(0.7);
      } else if (cycle === 2) {
        setActiveViseme('E');
        setMouthOpenFactor(0.5);
      } else if (cycle === 4) {
        setActiveViseme('O_U');
        setMouthOpenFactor(0.6);
      } else if (cycle === 6) {
        setActiveViseme('LDT');
        setMouthOpenFactor(0.3);
      } else {
        setActiveViseme('silence');
        setMouthOpenFactor(0.0);
      }

      // Medição de FPS real
      frameCountRef.current++;
      if (now - lastFpsTimeRef.current >= 1000) {
        setFpsActual(frameCountRef.current);
        frameCountRef.current = 0;
        lastFpsTimeRef.current = now;
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Fundo dinâmico conforme chroma
  let bgColorClass = 'bg-transparent';
  if (chroma === 'green') bgColorClass = 'bg-[#00ff00]';
  if (chroma === 'blue') bgColorClass = 'bg-[#0000ff]';

  return (
    <div
      id="obs-transparent-overlay-root"
      className={`relative w-screen h-screen overflow-hidden flex items-end justify-center select-none ${bgColorClass}`}
      style={{
        backgroundColor: chroma === 'transparent' ? 'transparent' : undefined,
      }}
    >
      {/* Estilo Global Injetado para Forçar Fundo Transparente no OBS */}
      <style>{`
        html, body {
          background: transparent !important;
          background-color: transparent !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
      `}</style>

      {/* Container Principal do Avatar com Aceleração por GPU */}
      <div
        id="v5-avatar-live-viewport"
        className={`relative transition-transform duration-100 ease-out ${
          mode === 'corner'
            ? 'w-[480px] h-[640px] mb-4 mr-4'
            : 'max-w-3xl w-full h-[92vh]'
        }`}
        style={{
          transform: `translate3d(0, ${breathingY * 6}px, 0) rotateZ(${headTilt.roll}deg) rotateX(${headTilt.pitch}deg) rotateY(${headTilt.yaw}deg)`,
          transformOrigin: 'bottom center',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        {/* Glow de Borda Opcional */}
        {glowParam && (
          <div className="absolute inset-0 rounded-3xl pointer-events-none filter drop-shadow-[0_0_25px_rgba(0,229,255,0.25)]" />
        )}

        {/* Imagem Base do Avatar */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <img
            src={avatarImage}
            alt={avatarName}
            className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
            style={{
              filter: isBlinking ? 'brightness(0.98)' : 'none',
            }}
          />

          {/* Efeito Sutil de Piscar */}
          {isBlinking && (
            <div className="absolute top-[28%] left-[38%] right-[38%] h-4 bg-obsidian-950/60 rounded-full blur-[1px] pointer-events-none" />
          )}

          {/* Camada Labial do Visema Ativo */}
          {mouthOpenFactor > 0.05 && (
            <div
              className="absolute top-[39%] left-[45%] w-[10%] h-[5%] rounded-full bg-rose-950/90 border border-cyber-cyan/50 shadow-[0_0_8px_rgba(0,229,255,0.4)] pointer-events-none transition-all duration-75 flex items-center justify-center overflow-hidden"
              style={{
                transform: `scaleY(${mouthOpenFactor * 1.3}) scaleX(${1 + (activeViseme === 'E' ? 0.4 : 0)})`,
              }}
            >
              {/* Dentes Superiores */}
              {(activeViseme === 'E' || activeViseme === 'A_I') && (
                <div className="w-[80%] h-1 bg-white/90 rounded-sm mb-auto" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* HUD de Diagnósticos do Operador de Live (Pressione 'D' para alternar) */}
      {isDebugVisible && (
        <div className="absolute top-4 left-4 bg-obsidian-950/85 backdrop-blur-md border border-cyber-cyan/40 p-3 rounded-xl font-mono text-xs text-slate-300 space-y-1 shadow-[0_0_20px_rgba(0,0,0,0.8)] z-50">
          <div className="text-[10px] text-cyber-cyan font-bold uppercase flex items-center gap-1.5 border-b border-white/10 pb-1">
            <Activity className="w-3 h-3 text-cyber-cyan" />
            OBS Overlay Telemetry · {avatarName}
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">FPS Real:</span>
            <span className="text-emerald-400 font-bold">{fpsActual} FPS</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Hardware Accel:</span>
            <span className="text-cyber-cyan font-bold">translateZ(0) ON</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Visema Ativo:</span>
            <span className="text-slate-200">{activeViseme}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Head Tilt Euler:</span>
            <span className="text-slate-300">{headTilt.roll.toFixed(1)}º</span>
          </div>
          <div className="text-[9px] text-slate-500 pt-1 border-t border-white/5">
            Pressione [D] para ocultar este HUD no OBS
          </div>
        </div>
      )}
    </div>
  );
}

export default function LiveOverlayPage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen bg-transparent flex items-center justify-center text-cyber-cyan font-mono text-xs">
          Carregando V5 Avatar OBS Overlay...
        </div>
      }
    >
      <LiveOverlayContent />
    </Suspense>
  );
}
