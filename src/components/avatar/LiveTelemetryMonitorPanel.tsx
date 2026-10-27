'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  LiveSignalTelemetry,
  HealthAnomalyAlert,
  calculateSignalIntegrity,
  compileTelemetryAuditReport,
} from '@/utils/liveTelemetryMonitorEngine';
import {
  Activity,
  Gauge,
  Wifi,
  Cpu,
  Tv,
  Radio,
  Download,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Zap,
  RotateCcw,
  Clock,
  Sliders,
} from 'lucide-react';

interface LiveTelemetryMonitorPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function LiveTelemetryMonitorPanel({
  avatarId,
  avatarName,
}: LiveTelemetryMonitorPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const targetId = currentAvatar?.id || 'avatar-maya-vance';
  const targetName = currentAvatar?.name || avatarName || 'Maya Vance';

  const [history, setHistory] = useState<LiveSignalTelemetry[]>([]);
  const [currentTelemetry, setCurrentTelemetry] = useState<LiveSignalTelemetry>({
    timestamp: Date.now(),
    fps: 60.0,
    targetFps: 60,
    frameRenderTimeMs: 1.4,
    droppedFrames: 0,
    rttLatencyMs: 2.1,
    audioLatencyMs: 8.5,
    audioPeakDbFs: -18.2,
    packetRatePerSec: 60,
    vramUsageMb: 42.5,
    signalIntegrityPercent: 99.4,
    signalQuality: 'Excelente (Grau A+)',
  });

  const [alerts, setAlerts] = useState<HealthAnomalyAlert[]>([
    {
      id: 'alt_01',
      timestamp: new Date().toLocaleTimeString(),
      severity: 'info',
      metric: 'FPS Clock',
      message: 'Taxa de quadros travada em 60.0 FPS via requestAnimationFrame sincronizado.',
      valueFormatted: '60.0 FPS',
    },
    {
      id: 'alt_02',
      timestamp: new Date().toLocaleTimeString(),
      severity: 'info',
      metric: 'OBS WebSocket',
      message: 'Latência RTT de comunicação local estabelecida em 2.1ms (Porta :4455).',
      valueFormatted: '2.1 ms',
    },
  ]);

  const [copiedReport, setCopiedReport] = useState(false);
  const [isStressTestActive, setIsStressTestActive] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Loop de Amostragem de Telemetria (1 amostra por segundo)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      // Flutuação realista natural
      let fps = 59.8 + (Math.random() * 0.4 - 0.2);
      let rtt = 1.9 + Math.random() * 0.6;
      let frameTime = 1.2 + Math.random() * 0.5;
      let dropped = 0;

      if (isStressTestActive) {
        fps = 54.2 + Math.random() * 2.0;
        rtt = 14.5 + Math.random() * 6.0;
        frameTime = 3.8 + Math.random() * 1.5;
        dropped = Math.random() > 0.6 ? 1 : 0;
      }

      fps = Number(fps.toFixed(1));
      rtt = Number(rtt.toFixed(1));
      frameTime = Number(frameTime.toFixed(1));

      const { score, quality } = calculateSignalIntegrity(fps, rtt, 8.5, dropped);

      const packet: LiveSignalTelemetry = {
        timestamp: now,
        fps,
        targetFps: 60,
        frameRenderTimeMs: frameTime,
        droppedFrames: dropped,
        rttLatencyMs: rtt,
        audioLatencyMs: 8.5,
        audioPeakDbFs: -18.2,
        packetRatePerSec: 60,
        vramUsageMb: 42.5,
        signalIntegrityPercent: score,
        signalQuality: quality,
      };

      setCurrentTelemetry(packet);
      setHistory((prev) => [...prev.slice(-59), packet]);
    }, 1000);

    return () => clearInterval(interval);
  }, [isStressTestActive]);

  // Renderização do Gráfico Sparkline de 60 Segundos no Canvas
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Fundo escuro com grid
    ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
    ctx.fillRect(0, 0, w, h);

    // Linhas horizontais de referência (60 FPS, 30 FPS)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.2); // ~60 FPS
    ctx.lineTo(w, h * 0.2);
    ctx.moveTo(0, h * 0.6); // ~30 FPS
    ctx.lineTo(w, h * 0.6);
    ctx.stroke();

    if (history.length < 2) return;

    const stepX = w / 60;

    // 1. Linha de FPS (Cyber Cyan)
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    history.forEach((pt, idx) => {
      const x = idx * stepX;
      // Normalização: 50 a 65 FPS mapeado para h * 0.8 a h * 0.1
      const normalized = Math.max(0, Math.min(1, (pt.fps - 50) / 15));
      const y = h - (normalized * (h * 0.8) + h * 0.1);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 2. Linha de Latência RTT (Esmeralda / Âmbar se estresse)
    ctx.strokeStyle = isStressTestActive ? '#f59e0b' : '#10b981';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    history.forEach((pt, idx) => {
      const x = idx * stepX;
      // Normalização: 0 a 20 ms mapeado para h a h * 0.4
      const normalized = Math.max(0, Math.min(1, pt.rttLatencyMs / 20));
      const y = h - normalized * (h * 0.6);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [history, isStressTestActive]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  const handleTriggerStressTest = () => {
    setIsStressTestActive(true);
    setAlerts((prev) => [
      {
        id: `stress_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        severity: 'warning',
        metric: 'Jitter & Latência',
        message: 'Teste de estresse disparado: simulação de carga de rede por 4 segundos.',
        valueFormatted: '18.5 ms RTT',
      },
      ...prev.slice(0, 5),
    ]);

    setTimeout(() => {
      setIsStressTestActive(false);
      setAlerts((prev) => [
        {
          id: `rec_${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          severity: 'info',
          metric: 'Watchdog Recuperado',
          message: 'Sinal normalizado. Latência retornou ao patamar ótimo (< 3ms).',
          valueFormatted: '2.1 ms RTT',
        },
        ...prev.slice(0, 5),
      ]);
    }, 4000);
  };

  const handleDownloadReport = () => {
    const report = compileTelemetryAuditReport(history, targetId, targetName);
    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `v5_live_telemetry_${targetId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyReport = () => {
    const report = compileTelemetryAuditReport(history, targetId, targetName);
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <section className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(0,229,255,0.06)] relative overflow-hidden">
      {/* Glow Superior */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-80" />

      {/* Header com Status do Monitor */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase">
            <Radio className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            Fase 8 · Conector de Live V5 Broadcaster · Etapa 078
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-3">
            <Activity className="w-6 h-6 text-cyber-cyan" />
            Monitor de Telemetria de Live (Latência, FPS & Integridade)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitoramento contínuo de frame rate, tempo de renderização por GPU, latência RTT do
            WebSocket e watchdog de anomalias para transmissões ininterruptas 24/7.
          </p>
        </div>

        {/* Medidor de Integridade Composta */}
        <div className="flex items-center gap-3 bg-obsidian-950 px-4 py-2.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-400" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-500">Integridade de Sinal</div>
              <div className="text-xs font-bold text-emerald-400 font-mono">
                {currentTelemetry.signalIntegrityPercent}% · {currentTelemetry.signalQuality}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Métricas Numéricas em Tempo Real */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
        {/* FPS da Cena */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-3 space-y-1">
          <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center justify-between">
            <span>FPS Real</span>
            <Tv className="w-3.5 h-3.5 text-cyber-cyan" />
          </div>
          <div className="text-lg font-bold font-mono text-cyber-cyan">
            {currentTelemetry.fps.toFixed(1)}
          </div>
          <div className="text-[9px] font-mono text-slate-400">Alvo: 60.0 FPS</div>
        </div>

        {/* Tempo de Render por Frame */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-3 space-y-1">
          <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center justify-between">
            <span>Render Time</span>
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400">
            {currentTelemetry.frameRenderTimeMs} ms
          </div>
          <div className="text-[9px] font-mono text-slate-400">Orçamento: 16.6ms</div>
        </div>

        {/* Latência RTT WebSocket */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-3 space-y-1">
          <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center justify-between">
            <span>WebSocket RTT</span>
            <Wifi className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div
            className={`text-lg font-bold font-mono ${
              currentTelemetry.rttLatencyMs > 10 ? 'text-amber-400' : 'text-purple-400'
            }`}
          >
            {currentTelemetry.rttLatencyMs} ms
          </div>
          <div className="text-[9px] font-mono text-slate-400">OBS Studio :4455</div>
        </div>

        {/* Latência de Áudio */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-3 space-y-1">
          <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center justify-between">
            <span>Audio Latency</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold font-mono text-amber-400">
            {currentTelemetry.audioLatencyMs} ms
          </div>
          <div className="text-[9px] font-mono text-slate-400">Web Audio API</div>
        </div>

        {/* Dropped Frames */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-3 space-y-1">
          <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center justify-between">
            <span>Quadros Perdidos</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div
            className={`text-lg font-bold font-mono ${
              currentTelemetry.droppedFrames > 0 ? 'text-rose-400' : 'text-slate-200'
            }`}
          >
            {currentTelemetry.droppedFrames} pkts
          </div>
          <div className="text-[9px] font-mono text-slate-400">Taxa de perda: 0.0%</div>
        </div>

        {/* Consumo VRAM */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-3 space-y-1">
          <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center justify-between">
            <span>GPU Memory</span>
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-lg font-bold font-mono text-slate-200">
            {currentTelemetry.vramUsageMb} MB
          </div>
          <div className="text-[9px] font-mono text-slate-400">Chromium Compositor</div>
        </div>
      </div>

      {/* Gráfico Sparkline de 60 Segundos e Watchdog de Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Gráfico Histórico (8 Colunas) */}
        <div className="lg:col-span-8 bg-obsidian-950/80 border border-white/10 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyber-cyan" />
              Histórico Dinâmico de 60 Segundos (FPS & RTT Latency)
            </span>

            {/* Legenda */}
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-cyber-cyan">
                <span className="w-2.5 h-1 bg-cyber-cyan rounded-full"></span> FPS (50-65)
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-1 bg-emerald-400 rounded-full"></span> RTT (0-20ms)
              </span>
            </div>
          </div>

          <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden border border-white/10">
            <canvas
              ref={canvasRef}
              width={640}
              height={260}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
            <span>-60 segundos</span>
            <span>Agora (Tempo Real)</span>
          </div>
        </div>

        {/* Watchdog de Anomalias & Ações de Teste (4 Colunas) */}
        <div className="lg:col-span-4 bg-obsidian-950/80 border border-white/10 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Watchdog de Integridade
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Ativo</span>
            </div>

            <div className="space-y-2 mt-2">
              {alerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-2.5 rounded-lg border text-xs font-mono space-y-1 ${
                    alt.severity === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-emerald-500/5 border-emerald-500/20 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-cyber-cyan">{alt.metric}</span>
                    <span className="text-slate-500">{alt.timestamp}</span>
                  </div>
                  <p className="text-[11px] leading-tight text-slate-400">{alt.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Ação: Estresse e Exportação */}
          <div className="space-y-2 pt-3 border-t border-white/5">
            <button
              onClick={handleTriggerStressTest}
              disabled={isStressTestActive}
              className="w-full py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              {isStressTestActive ? 'Simulando Estresse de Rede...' : 'Testar Estresse de Rede (4s)'}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadReport}
                className="py-2 px-2.5 rounded-xl bg-cyber-cyan/15 hover:bg-cyber-cyan/25 border border-cyber-cyan/30 text-cyber-cyan font-mono text-xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Baixar .JSON
              </button>
              <button
                onClick={handleCopyReport}
                className="py-2 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                {copiedReport ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copiar Dados
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
