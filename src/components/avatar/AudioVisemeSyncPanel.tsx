'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  AudioSyncConfig,
  LiveLipSyncState,
  DEFAULT_AUDIO_SYNC_CONFIG,
  CANONICAL_ACOUSTIC_PRESETS,
  classifyAcousticSpectrum,
  WebAudioVisemeAnalyzer,
} from '@/utils/audioVisemeSyncEngine';
import { CANONICAL_VISEMES_CATALOG } from '@/utils/visemesEngine';
import { VisemeType } from '@/types/avatar';
import { toast } from '@/store/useToastStore';
import {
  Mic,
  MicOff,
  Sliders,
  Activity,
  Zap,
  Volume2,
  Radio,
  Play,
  Square,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Settings2,
  Gauge,
  Sparkles,
  VolumeX,
} from 'lucide-react';

interface AudioVisemeSyncPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function AudioVisemeSyncPanel({
  avatarId,
  avatarName,
}: AudioVisemeSyncPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];
  const targetName = currentAvatar?.name || avatarName || 'Avatar Soberano V5';

  const [isMicActive, setIsMicActive] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState('live_streamer');
  const [config, setConfig] = useState<AudioSyncConfig>(DEFAULT_AUDIO_SYNC_CONFIG);
  const [isSimulatingSpeech, setIsSimulatingSpeech] = useState(false);
  const [simulatedPhoneme, setSimulatedPhoneme] = useState<VisemeType | null>(null);
  const [copiedConfig, setCopiedConfig] = useState(false);

  // Estados em tempo real de lip-sync
  const [syncState, setSyncState] = useState<LiveLipSyncState>({
    activeViseme: 'silence',
    previousViseme: 'silence',
    confidence: 1.0,
    rmsDb: -60,
    rmsLinear: 0,
    formantF1Energy: 0,
    formantF2Energy: 0,
    frictionEnergy: 0,
    mouthOpen: 0,
    mouthStretch: 0.5,
    mouthPucker: 0,
    latencyMs: 3,
    isSpeaking: false,
    sampleTime: Date.now(),
  });

  const mouthCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const spectrumCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyzerRef = useRef<WebAudioVisemeAnalyzer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const previousStateRef = useRef<LiveLipSyncState>(syncState);

  // Instancia analisador de áudio e limpeza segura
  useEffect(() => {
    analyzerRef.current = new WebAudioVisemeAnalyzer();
    return () => {
      if (analyzerRef.current) {
        analyzerRef.current.stop();
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Altera preset
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = CANONICAL_ACOUSTIC_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setConfig({ ...found.config });
    }
  };

  // Alterna microfone ao vivo
  const handleToggleMic = async () => {
    if (!analyzerRef.current) return;

    if (isMicActive) {
      analyzerRef.current.stop();
      setIsMicActive(false);
    } else {
      const ok = await analyzerRef.current.startMicrophone(config.fftSize);
      if (ok) {
        setIsMicActive(true);
        toast.success('Microfone Ativado', 'Análise espectral em tempo real iniciada.');
      } else {
        toast.error('Erro no Microfone', 'Não foi possível acessar o microfone local. Verifique as permissões de áudio do navegador.');
      }
    }
  };

  // Desenha a boca no Canvas com interpolação suave
  const drawMouth = useCallback((state: LiveLipSyncState) => {
    const canvas = mouthCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Fundo com gradiente sutil
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
    bgGrad.addColorStop(0, 'rgba(10, 25, 47, 0.7)');
    bgGrad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Grid de referência
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();

    const cx = w / 2;
    const cy = h / 2;

    // Parâmetros geométricos interpolados
    const openH = Math.max(2, state.mouthOpen * 55);
    const stretchW = (state.mouthStretch - 0.5) * 35;
    const puckerNarrow = state.mouthPucker * 28;
    const halfWidth = Math.max(20, 60 + stretchW - puckerNarrow);

    // 1. Cavidade Interna da Boca (quando aberta)
    if (state.mouthOpen > 0.05) {
      ctx.fillStyle = '#1e0505';
      ctx.beginPath();
      ctx.ellipse(cx, cy, halfWidth, openH, 0, 0, Math.PI * 2);
      ctx.fill();

      // Dentes Superiores
      if (state.activeViseme === 'E' || state.activeViseme === 'A_I' || state.activeViseme === 'FV') {
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.roundRect(cx - halfWidth * 0.7, cy - openH * 0.9, halfWidth * 1.4, openH * 0.45, 4);
        ctx.fill();
      }

      // Língua
      if (state.activeViseme === 'A_I' || state.activeViseme === 'LDT') {
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.ellipse(cx, cy + openH * 0.4, halfWidth * 0.6, openH * 0.4, 0, 0, Math.PI);
        ctx.fill();
      }
    }

    // 2. Lábios Exteriores (Desenho com Bézier Paths)
    ctx.lineWidth = 4;
    ctx.strokeStyle = state.isSpeaking ? '#00e5ff' : '#64748b';
    ctx.shadowColor = state.isSpeaking ? 'rgba(0, 229, 255, 0.6)' : 'transparent';
    ctx.shadowBlur = state.isSpeaking ? 12 : 0;

    // Lábio Superior
    ctx.beginPath();
    ctx.moveTo(cx - halfWidth, cy);
    ctx.quadraticCurveTo(cx - halfWidth * 0.4, cy - openH * 0.6 - 4, cx, cy - openH * 0.4 - 2);
    ctx.quadraticCurveTo(cx + halfWidth * 0.4, cy - openH * 0.6 - 4, cx + halfWidth, cy);
    ctx.stroke();

    // Lábio Inferior
    ctx.beginPath();
    ctx.moveTo(cx - halfWidth, cy);
    ctx.quadraticCurveTo(cx, cy + openH + 4, cx + halfWidth, cy);
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;
  }, []);

  // Desenha o espectrograma FFT no Canvas
  const drawSpectrum = useCallback((freqData: Uint8Array, rmsDb: number) => {
    const canvas = spectrumCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Fundo
    ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
    ctx.fillRect(0, 0, w, h);

    const numBars = 36;
    const barWidth = (w - (numBars - 1) * 2) / numBars;

    for (let i = 0; i < numBars; i++) {
      const dataIdx = Math.floor((i / numBars) * (freqData.length * 0.75));
      const val = freqData[dataIdx] / 255;
      const barHeight = Math.max(2, val * (h - 20));

      const x = i * (barWidth + 2);
      const y = h - barHeight;

      // Cor por faixa de formante
      if (i < 10) {
        ctx.fillStyle = '#00e5ff'; // Formante F1 (Cyan)
      } else if (i < 22) {
        ctx.fillStyle = '#10b981'; // Formante F2 (Emerald)
      } else {
        ctx.fillStyle = '#f43f5e'; // High Friction (Rose)
      }

      ctx.fillRect(x, y, barWidth, barHeight);
    }

    // Linha de Noise Gate Threshold
    const gateRatio = Math.max(0, Math.min(1, (config.noiseGateDb + 60) / 60));
    const gateY = h - gateRatio * h;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, gateY);
    ctx.lineTo(w, gateY);
    ctx.stroke();
    ctx.setLineDash([]);
  }, [config.noiseGateDb]);

  // Loop de Análise em Tempo Real (60 FPS)
  useEffect(() => {
    const freqData = new Uint8Array(config.fftSize / 2);
    const timeData = new Uint8Array(config.fftSize);

    const renderLoop = () => {
      let currentState = previousStateRef.current;

      if (isMicActive && analyzerRef.current?.isActive) {
        const audioInfo = analyzerRef.current.getAudioData(freqData, timeData);
        if (audioInfo) {
          currentState = classifyAcousticSpectrum(
            freqData,
            timeData,
            audioInfo.sampleRate,
            config,
            previousStateRef.current
          );
        }
      } else if (simulatedPhoneme) {
        // Simulação procedural de fonema
        const meta = CANONICAL_VISEMES_CATALOG[simulatedPhoneme];
        const isQuiet = simulatedPhoneme === 'silence';
        currentState = {
          activeViseme: simulatedPhoneme,
          previousViseme: previousStateRef.current.activeViseme,
          confidence: 0.96,
          rmsDb: isQuiet ? -55 : -22,
          rmsLinear: isQuiet ? 0 : 0.85,
          formantF1Energy: meta.geometry.verticalAperture,
          formantF2Energy: meta.geometry.horizontalStretch,
          frictionEnergy: simulatedPhoneme === 'FV' || simulatedPhoneme === 'LDT' ? 0.8 : 0.1,
          mouthOpen: isQuiet ? 0 : meta.geometry.verticalAperture,
          mouthStretch: meta.geometry.horizontalStretch,
          mouthPucker: meta.geometry.lipPucker,
          latencyMs: 2,
          isSpeaking: !isQuiet,
          sampleTime: Date.now(),
        };

        // Popula espectro sintético
        for (let i = 0; i < freqData.length; i++) {
          freqData[i] = Math.floor(Math.random() * 80 + (currentState.isSpeaking ? 120 : 10));
        }
      } else {
        // Estado idle/silêncio estático com leve ruído de fundo
        currentState = {
          ...previousStateRef.current,
          activeViseme: 'silence',
          mouthOpen: Math.max(0, previousStateRef.current.mouthOpen * 0.85),
          mouthStretch: 0.5,
          mouthPucker: 0,
          rmsDb: -60,
          rmsLinear: 0,
          isSpeaking: false,
        };
        freqData.fill(5);
      }

      previousStateRef.current = currentState;
      setSyncState(currentState);
      drawMouth(currentState);
      drawSpectrum(freqData, currentState.rmsDb);

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isMicActive, simulatedPhoneme, config, drawMouth, drawSpectrum]);

  // Disparador de fala sintética usando SpeechSynthesis
  const handlePlaySyntheticSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      `Olá a todos na transmissão do V5 Broadcaster! Aqui é ${targetName}, demonstrando sincronização labial acústica em tempo real.`
    );
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;

    const phonemeSequence: VisemeType[] = [
      'O_U', 'LDT', 'A_I', 'E', 'A_I', 'O_U', 'MBP', 'A_I', 'FV', 'A_I', 'silence',
    ];
    let step = 0;

    setIsSimulatingSpeech(true);

    const interval = setInterval(() => {
      if (step < phonemeSequence.length) {
        setSimulatedPhoneme(phonemeSequence[step]);
        step++;
      } else {
        clearInterval(interval);
        setSimulatedPhoneme(null);
        setIsSimulatingSpeech(false);
      }
    }, 180);

    utterance.onend = () => {
      clearInterval(interval);
      setSimulatedPhoneme(null);
      setIsSimulatingSpeech(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleCopyConfig = () => {
    const jsonStr = JSON.stringify(
      {
        acousticProfile: selectedPresetId,
        config,
        calibratedFor: targetName,
        pairedPort: 3008,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
    navigator.clipboard.writeText(jsonStr);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  return (
    <section className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(0,229,255,0.06)] relative overflow-hidden">
      {/* Glow Superior */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-80" />

      {/* Header do Módulo */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase">
            <Radio className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            Fase 8 · Conector de Live V5 Broadcaster · Etapa 073
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-3">
            <Zap className="w-6 h-6 text-cyber-cyan" />
            Sincronizador de Áudio com Visemas (Real-Time Lip-Sync)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Troca de boca em tempo real a 60 FPS guiada por análise espectral de formantes (F1, F2,
            High Friction) e amplitude RMS com latência inferior a 15ms.
          </p>
        </div>

        {/* Status de Latência & FPS */}
        <div className="flex items-center gap-3 bg-obsidian-950 px-4 py-2.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-cyber-cyan" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-500">Acoustic Latency</div>
              <div className="text-xs font-bold text-cyber-cyan font-mono">
                {syncState.latencyMs}ms · 60 FPS LOCK
              </div>
            </div>
          </div>
          <span
            className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
              syncState.isSpeaking
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            {syncState.isSpeaking ? 'FALA DETECTADA' : 'EM REPOUSO'}
          </span>
        </div>
      </div>

      {/* Grid de Telas em Tempo Real: Boca + Espectrograma */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Tela 1: Mouth Morphing Canvas */}
        <div className="bg-obsidian-950/90 border border-white/10 rounded-xl p-5 space-y-3 flex flex-col items-center relative">
          <div className="w-full flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyber-cyan" />
              Morphing Labial em Tempo Real
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400">Visema Ativo:</span>
              <span className="px-2 py-0.5 rounded bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan font-mono font-bold text-xs shadow-[0_0_10px_rgba(0,229,255,0.3)]">
                {syncState.activeViseme}
              </span>
            </div>
          </div>

          <div className="relative w-full max-w-md aspect-[16/9] rounded-xl overflow-hidden border border-cyber-cyan/30 shadow-[0_0_20px_rgba(0,229,255,0.1)]">
            <canvas
              ref={mouthCanvasRef}
              width={400}
              height={225}
              className="w-full h-full object-contain"
            />
            {/* Overlay com Métricas */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] font-mono text-slate-400 bg-obsidian-950/80 px-3 py-1 rounded backdrop-blur border border-white/5">
              <span>Abertura: {(syncState.mouthOpen * 100).toFixed(0)}%</span>
              <span>Estiramento: {(syncState.mouthStretch * 100).toFixed(0)}%</span>
              <span>Bico: {(syncState.mouthPucker * 100).toFixed(0)}%</span>
              <span className="text-emerald-400 font-bold">
                Confiança: {(syncState.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="w-full text-center text-[11px] font-mono text-slate-400">
            {CANONICAL_VISEMES_CATALOG[syncState.activeViseme]?.name || 'Silêncio Neutro'}
          </div>
        </div>

        {/* Tela 2: Espectrograma FFT e RMS Meter */}
        <div className="bg-obsidian-950/90 border border-white/10 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyber-cyan" />
              Espectrograma FFT de Formantes
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400">RMS:</span>
              <span
                className={`text-xs font-mono font-bold ${
                  syncState.rmsDb > config.noiseGateDb ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {syncState.rmsDb.toFixed(1)} dB
              </span>
            </div>
          </div>

          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10">
            <canvas
              ref={spectrumCanvasRef}
              width={400}
              height={225}
              className="w-full h-full object-contain"
            />
            {/* Legenda de Formantes */}
            <div className="absolute top-2 left-2 flex gap-3 text-[9px] font-mono bg-obsidian-950/80 px-2 py-1 rounded border border-white/5">
              <span className="flex items-center gap-1 text-cyber-cyan">
                <span className="w-2 h-2 rounded-full bg-cyber-cyan"></span> F1 (300-1kHz)
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> F2 (1k-2.8kHz)
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span> Fricção (2.8k-7.5kHz)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Linha Amarela: Noise Gate (
              {config.noiseGateDb} dB)
            </span>
            <span className="text-slate-500">Janela FFT: {config.fftSize} amostras</span>
          </div>
        </div>
      </div>

      {/* Controles de Entrada de Áudio & Testes Instantâneos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Microfone ao Vivo */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
              <Mic className="w-4 h-4 text-cyber-cyan" />
              Microfone de Transmissão
            </span>
            <p className="text-[11px] text-slate-400">
              Captura do microfone local via Web Audio API com cancelamento de ruído e eco.
            </p>
          </div>

          <button
            onClick={handleToggleMic}
            className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              isMicActive
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse'
                : 'bg-cyber-cyan hover:bg-cyan-400 text-obsidian-950 shadow-[0_0_20px_rgba(0,229,255,0.25)]'
            }`}
          >
            {isMicActive ? (
              <>
                <MicOff className="w-4 h-4" /> Desativar Microfone
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" /> Ativar Microfone Local
              </>
            )}
          </button>
        </div>

        {/* Gerador de Fonemas Procedurais */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-4 space-y-2">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyber-cyan" />
            Injetor Procedural de Visemas
          </span>
          <p className="text-[10px] text-slate-400">
            Clique para testar a resposta imediata de cada fonema sem precisar falar:
          </p>

          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {(['silence', 'A_I', 'E', 'O_U', 'MBP', 'FV', 'LDT'] as VisemeType[]).map((vKey) => (
              <button
                key={vKey}
                onMouseDown={() => setSimulatedPhoneme(vKey)}
                onMouseUp={() => setSimulatedPhoneme(null)}
                className={`py-1.5 px-1 rounded text-[10px] font-mono border text-center transition-all ${
                  simulatedPhoneme === vKey
                    ? 'bg-cyber-cyan text-obsidian-950 font-bold border-cyber-cyan'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {vKey}
              </button>
            ))}
          </div>
        </div>

        {/* Síntese Vocal de Frase Canônica */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-4 space-y-2 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
              <Play className="w-4 h-4 text-cyber-cyan" />
              Frase Canônica de Teste
            </span>
            <p className="text-[10px] text-slate-400">
              Executa frase completa com fala sintética para validar a fluidez dos 7 visemas.
            </p>
          </div>

          <button
            onClick={handlePlaySyntheticSpeech}
            disabled={isSimulatingSpeech}
            className="w-full py-2.5 px-4 rounded-xl bg-obsidian-900 hover:bg-white/10 border border-cyber-cyan/40 text-cyber-cyan font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSimulatingSpeech ? (
              <>
                <Square className="w-4 h-4 animate-spin text-rose-400" /> Falando frase de teste...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Executar Frase de Live
              </>
            )}
          </button>
        </div>
      </div>

      {/* Painel Paramétrico de Ajustes Fisiológicos */}
      <div className="mt-6 bg-obsidian-950/80 border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyber-cyan" />
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Calibração de Acústica e Dinâmica Labial
            </h3>
          </div>

          {/* Seletor de Presets */}
          <div className="flex items-center gap-1.5 bg-obsidian-900 p-1 rounded-lg border border-white/10 overflow-x-auto">
            {CANONICAL_ACOUSTIC_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-all ${
                  selectedPresetId === p.id
                    ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.name.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders de Ajuste */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Noise Gate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Noise Gate:</span>
              <span className="text-cyber-cyan font-bold">{config.noiseGateDb} dB</span>
            </div>
            <input
              type="range"
              min="-60"
              max="-20"
              step="1"
              value={config.noiseGateDb}
              onChange={(e) => setConfig({ ...config, noiseGateDb: parseInt(e.target.value, 10) })}
              className="w-full accent-cyber-cyan"
            />
            <span className="text-[10px] text-slate-500 font-mono">Corta ruídos abaixo deste limiar</span>
          </div>

          {/* Sensibilidade / Ganho */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Sensibilidade:</span>
              <span className="text-cyber-cyan font-bold">{config.speechGain.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.1"
              value={config.speechGain}
              onChange={(e) => setConfig({ ...config, speechGain: parseFloat(e.target.value) })}
              className="w-full accent-cyber-cyan"
            />
            <span className="text-[10px] text-slate-500 font-mono">Multiplicador de amplitude</span>
          </div>

          {/* Suavização Anti-Jitter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Suavização EMA:</span>
              <span className="text-cyber-cyan font-bold">{(config.smoothingAlpha * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={config.smoothingAlpha}
              onChange={(e) => setConfig({ ...config, smoothingAlpha: parseFloat(e.target.value) })}
              className="w-full accent-cyber-cyan"
            />
            <span className="text-[10px] text-slate-500 font-mono">Evita tremor na troca de boca</span>
          </div>

          {/* Retenção Mínima */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Retenção de Visema:</span>
              <span className="text-cyber-cyan font-bold">{config.minVisemeHoldMs} ms</span>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              step="5"
              value={config.minVisemeHoldMs}
              onChange={(e) => setConfig({ ...config, minVisemeHoldMs: parseInt(e.target.value, 10) })}
              className="w-full accent-cyber-cyan"
            />
            <span className="text-[10px] text-slate-500 font-mono">Tempo mínimo em cada fonema</span>
          </div>
        </div>

        {/* Botão de Exportação de Configuração */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleCopyConfig}
            className="px-4 py-2 rounded-lg bg-obsidian-900 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs flex items-center gap-2 transition-colors"
          >
            {copiedConfig ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Configuração Copiada para o V5 Broadcaster!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copiar Configuração JSON para V5 Broadcaster (:3008)
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
