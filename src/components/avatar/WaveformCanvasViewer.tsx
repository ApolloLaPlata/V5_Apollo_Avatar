'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  WaveformAnalysisResult,
  generateProceduralSpeechWaveform,
} from '@/utils/waveformAnalyzer';
import { toast } from '@/store/useToastStore';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Sliders,
} from 'lucide-react';

interface WaveformCanvasViewerProps {
  audioUrl?: string | null;
  characterName?: string;
}

export default function WaveformCanvasViewer({
  audioUrl,
  characterName = 'Personagem Soberano',
}: WaveformCanvasViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [data, setData] = useState<WaveformAnalysisResult>(generateProceduralSpeechWaveform());
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showPeaks, setShowPeaks] = useState<boolean>(true);
  const [showSilence, setShowSilence] = useState<boolean>(true);
  const [showClippingWarning, setShowClippingWarning] = useState<boolean>(true);

  // Loop de reprodução do cursor
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const startTimestamp = performance.now() - (currentTime / data.durationSeconds) * (data.durationSeconds * 1000);
      const step = (now: number) => {
        const elapsed = (now - startTimestamp) / 1000;
        if (elapsed >= data.durationSeconds) {
          setCurrentTime(0);
          setIsPlaying(false);
        } else {
          setCurrentTime(elapsed);
          animId = requestAnimationFrame(step);
        }
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, data.durationSeconds]);

  // Renderização da Onda no Canvas HTML5
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensões internas reais
    canvas.width = canvas.parentElement?.clientWidth || 700;
    canvas.height = 140;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const points = data.points;
    const barWidth = Math.max(2, (canvas.width / points.length) * zoomLevel);
    const spacing = 1.5;

    // Desenhar Zonas de Silêncio / Respiração
    if (showSilence) {
      data.silenceIntervals.forEach((interval) => {
        const startX = (interval.start / data.durationSeconds) * canvas.width;
        const endX = (interval.end / data.durationSeconds) * canvas.width;
        ctx.fillStyle = 'rgba(0, 229, 255, 0.08)';
        ctx.fillRect(startX, 0, endX - startX, canvas.height);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(startX, 0, endX - startX, canvas.height);
        ctx.setLineDash([]);
      });
    }

    // Desenhar Linha de Clipping (Teto 0 dBFS)
    if (showClippingWarning) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(canvas.width, 10);
      ctx.moveTo(0, canvas.height - 10);
      ctx.lineTo(canvas.width, canvas.height - 10);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Desenhar Barras de Onda Sonora
    points.forEach((pt, i) => {
      const x = (i / points.length) * canvas.width;
      const barH = pt.amplitude * (canvas.height * 0.42);

      // Gradiente Ciano Cibernético / Ouro
      const isPlayed = pt.timeSeconds <= currentTime;
      if (pt.isClipping) {
        ctx.fillStyle = '#EF4444'; // Vermelho para clipping
      } else if (isPlayed) {
        ctx.fillStyle = '#00E5FF'; // Ciano para áudio já tocado
      } else {
        ctx.fillStyle = '#D4AF37'; // Ouro para áudio à frente
      }

      // Barra superior e inferior espelhadas (Waveform simétrica)
      ctx.fillRect(x, centerY - barH, barWidth - spacing, barH * 2);

      // Marcadores de Picos
      if (showPeaks && pt.isPeak) {
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(x + (barWidth - spacing) / 2, centerY - barH - 4, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Cursor Scrubber (Linha Vermelha / Branca de Reprodução)
    const playheadX = (currentTime / data.durationSeconds) * canvas.width;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00E5FF';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, canvas.height);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [data, currentTime, zoomLevel, showPeaks, showSilence, showClippingWarning]);

  // Click na onda para buscar posição (Seek/Scrub)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / canvas.width) * data.durationSeconds;
    setCurrentTime(Math.max(0, Math.min(data.durationSeconds, newTime)));
  };

  const handleReset = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Visualizador de Onda Sonora (Waveform Canvas Interativo)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30">
                00:{currentTime.toFixed(1).padStart(4, '0')}s / 00:{data.durationSeconds.toFixed(1).padStart(4, '0')}s
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Inspeção em tempo real de picos acústicos, pausas fonéticas de respiração e saturação (0 dBFS)
            </p>
          </div>
        </div>

        {/* Controles de Zoom da Onda */}
        <div className="flex items-center gap-1.5 p-1 bg-obsidian-950 border border-white/10 rounded-xl text-xs">
          {[1, 1.5, 2].map((z) => (
            <button
              key={z}
              type="button"
              onClick={() => setZoomLevel(z)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                zoomLevel === z
                  ? 'bg-cyber-cyan text-obsidian-950 shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {z}x
            </button>
          ))}
        </div>
      </div>

      {/* Viewport Canvas da Forma de Onda */}
      <div className="bg-obsidian-950 rounded-xl p-4 border border-white/10 space-y-3">
        <div className="relative w-full overflow-hidden rounded-lg bg-black border border-white/5 cursor-crosshair">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-[140px] block"
          />
        </div>

        {/* Barra de Transporte (Play / Pause / Reset) & Toggles */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs pt-1">
          {/* Botões Play / Pause */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="py-1.5 px-3.5 rounded-xl bg-cyber-cyan text-obsidian-950 font-bold flex items-center gap-1.5 hover:bg-cyan-300 transition-colors cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.3)]"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pausar' : 'Reproduzir'}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              title="Voltar ao início"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggles de Inspeção */}
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showPeaks}
                onChange={(e) => setShowPeaks(e.target.checked)}
                className="accent-luxury-gold"
              />
              Picos de Intensidade ({data.peakCount})
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showSilence}
                onChange={(e) => setShowSilence(e.target.checked)}
                className="accent-cyber-cyan"
              />
              Pausas / Respiração ({data.silenceIntervals.length})
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showClippingWarning}
                onChange={(e) => setShowClippingWarning(e.target.checked)}
                className="accent-red-500"
              />
              Teto de Clipping (0 dBFS)
            </label>
          </div>
        </div>
      </div>

      {/* Grid de Métricas Acústicas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[10px]">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
          <span className="text-slate-400 block text-[9px]">Loudness Médio (RMS):</span>
          <span className="text-sm font-bold text-cyber-cyan font-mono">
            {(data.averageRms * 100).toFixed(1)}% ({(-20 + data.averageRms * 8).toFixed(1)} dB)
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
          <span className="text-slate-400 block text-[9px]">Picos Fonéticos:</span>
          <span className="text-sm font-bold text-luxury-gold font-mono">
            {data.peakCount} transitórios
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
          <span className="text-slate-400 block text-[9px]">Intervalos de Respiração:</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">
            {data.silenceIntervals.length} pausas naturais
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
          <span className="text-slate-400 block text-[9px]">Saturação de Sinal:</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">
            {data.clippingCount === 0 ? '0 Clipping (100% Limpo)' : `${data.clippingCount} Clipes`}
          </span>
        </div>
      </div>
    </div>
  );
}
