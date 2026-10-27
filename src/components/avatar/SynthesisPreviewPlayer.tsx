'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VoiceEngine, VisemeType } from '@/types/avatar';
import {
  CANONICAL_QUICK_SCRIPTS,
  QuickSpeechScript,
  compileSpeechTimeline,
  getCurrentVisemeAtTime,
  getCurrentWordIndex,
  SynthesisTimeline,
} from '@/utils/synthesisPreviewEngine';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Repeat,
  Activity,
  Layers,
  Clock,
  Mic,
  MessageSquare,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface SynthesisPreviewPlayerProps {
  avatarId?: string;
  avatarName?: string;
  avatarUrl?: string;
}

export default function SynthesisPreviewPlayer({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
  avatarUrl,
}: SynthesisPreviewPlayerProps) {
  const { avatars } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId);

  const currentEngine = currentAvatar?.voice?.engine || 'qwen-tts';
  const speedFactor = currentAvatar?.voice?.speed || 1.0;
  const pitchSemitones = currentAvatar?.voice?.pitch || 0;

  const [scriptText, setScriptText] = useState<string>(CANONICAL_QUICK_SCRIPTS[0].text);
  const [timeline, setTimeline] = useState<SynthesisTimeline>(() =>
    compileSpeechTimeline(CANONICAL_QUICK_SCRIPTS[0].text, speedFactor, currentEngine)
  );

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentTimeSecRef = useRef<number>(0);
  currentTimeSecRef.current = currentTimeSec;

  // Limpeza de síntese de voz nativa no unmount do componente para prevenir áudio órfão
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Recalcula timeline quando o texto, velocidade ou motor mudar
  useEffect(() => {
    const updated = compileSpeechTimeline(scriptText, speedFactor, currentEngine);
    setTimeline(updated);
    if (!isPlaying) {
      setCurrentTimeSec(0);
      pausedAtRef.current = 0;
    }
  }, [scriptText, speedFactor, currentEngine]);

  // Loop de Animação e Sincronização Temporal
  useEffect(() => {
    if (!isPlaying) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp - pausedAtRef.current * 1000;
      }

      const elapsedSec = (timestamp - startTimeRef.current) / 1000;

      if (elapsedSec >= timeline.totalDurationSec) {
        if (isLooping) {
          startTimeRef.current = timestamp;
          setCurrentTimeSec(0);
          pausedAtRef.current = 0;
          requestRef.current = requestAnimationFrame(animate);
        } else {
          setIsPlaying(false);
          setCurrentTimeSec(timeline.totalDurationSec);
          pausedAtRef.current = 0;
          startTimeRef.current = null;
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
        }
      } else {
        setCurrentTimeSec(elapsedSec);
        pausedAtRef.current = elapsedSec;
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, timeline.totalDurationSec, isLooping]);

  // Efeito de visualização em Canvas (VU Meter / Barras de Espectro Acústico)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const barCount = 32;

    const renderSpectrum = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < barCount; i++) {
        const x = (i * canvas.width) / barCount;
        const barWidth = canvas.width / barCount - 2;

        let height = 4;
        if (isPlaying) {
          // Dinâmica de onda desacoplada do re-render React via ref
          const curTime = currentTimeSecRef.current;
          const freqMultiplier = Math.sin(curTime * 8 + i * 0.4) * 0.5 + 0.5;
          const noise = Math.random() * 0.25;
          height = Math.max(4, (freqMultiplier + noise) * (canvas.height - 8));
        }

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#00e5ff');
        gradient.addColorStop(0.6, '#ffd700');
        gradient.addColorStop(1, '#ff0055');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - height, barWidth, height);
      }

      if (isPlaying) {
        animId = requestAnimationFrame(renderSpectrum);
      }
    };

    renderSpectrum();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  // Controle de Play/Pause com suporte à síntese do navegador (Web Speech API)
  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
    } else {
      setIsPlaying(true);
      startTimeRef.current = null;

      // Síntese vocal nativa do navegador sincronizada
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && !isMuted) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(scriptText);
        utterance.lang = 'pt-BR';
        utterance.rate = Math.max(0.5, Math.min(2.0, speedFactor));
        // Pitch entre 0 e 2 (default 1)
        const browserPitch = Math.max(0.2, Math.min(2.0, 1 + pitchSemitones / 12));
        utterance.pitch = browserPitch;

        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTimeSec(0);
    pausedAtRef.current = 0;
    startTimeRef.current = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSeek = (newTime: number) => {
    setCurrentTimeSec(newTime);
    pausedAtRef.current = newTime;
    startTimeRef.current = null;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSelectQuickScript = (script: QuickSpeechScript) => {
    handleReset();
    setScriptText(script.text);
    toast.info('Script Carregado', `Texto preenchido com "${script.title}".`);
  };

  // Visema e palavra ativa no instante atual
  const activeViseme = getCurrentVisemeAtTime(timeline, currentTimeSec);
  const activeWordIndex = getCurrentWordIndex(timeline, currentTimeSec);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  const getVisemeColor = (v: VisemeType) => {
    switch (v) {
      case 'silence':
        return 'text-slate-500 bg-slate-800/40 border-slate-700';
      case 'MBP':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'FV':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'LDT':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'A_I':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'O_U':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'E':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default:
        return 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/30';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Player de Preview de Síntese Vocal & Lip-Sync
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30">
                {currentEngine.toUpperCase()}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Simulação de fala em tempo real com teleprompter fonético (Karaokê) e sincronização de visemas para {avatarName}
            </p>
          </div>
        </div>

        {/* Métricas de Latência */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>Latência: <strong className="text-slate-200">~{timeline.simulatedInferenceLatencyMs}ms</strong></span>
            <span>·</span>
            <span>RTF: <strong className="text-cyber-gold">{timeline.realTimeFactor}x</strong></span>
          </div>
        </div>
      </div>

      {/* Seletor de Scripts Rápidos */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-bold text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
            Scripts Canônicos de Teste de Fala:
          </span>
          <span className="text-[11px] text-slate-500">Clique para carregar e testar o tempo de fala</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CANONICAL_QUICK_SCRIPTS.map((script) => (
            <button
              key={script.id}
              onClick={() => handleSelectQuickScript(script)}
              className={`p-2 rounded-xl text-left border text-xs transition-colors ${
                scriptText === script.text
                  ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan shadow-[0_0_10px_rgba(0,229,255,0.15)] font-bold'
                  : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="text-[11px] truncate">{script.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input de Texto Personalizado */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <label className="flex items-center gap-1.5 font-bold text-slate-300">
            <MessageSquare className="w-3.5 h-3.5 text-cyber-gold" />
            Roteiro de Fala para Síntese:
          </label>
          <span className="text-[10px] text-slate-500">
            {scriptText.length} caracteres · {scriptText.trim().split(/\s+/).filter(Boolean).length} palavras
          </span>
        </div>
        <textarea
          rows={2}
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
          placeholder="Digite qualquer frase em português para simulação imediata..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan text-slate-100 text-xs font-mono resize-none"
        />
      </div>

      {/* Monitor de Karaokê (Word-by-Word Lip Sync) & Visema Dinâmico */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Painel do Karaokê (3 colunas) */}
        <div className="lg:col-span-3 p-4 rounded-xl bg-black/60 border border-white/10 space-y-3 flex flex-col justify-between min-h-[140px]">
          <div className="flex items-center justify-between text-[11px] pb-2 border-b border-white/10 text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-slate-300">
              <Activity className="w-3.5 h-3.5 text-cyber-cyan" />
              Teleprompter Acústico Sincronizado:
            </span>
            <span>
              {activeWordIndex >= 0
                ? `Palavra ${activeWordIndex + 1} de ${timeline.tokens.length}`
                : 'Pronto para reprodução'}
            </span>
          </div>

          {/* Nuvem de Palavras com Destaque Ativo */}
          <div className="flex flex-wrap gap-2 text-sm font-sans leading-relaxed py-1">
            {timeline.tokens.map((token, idx) => {
              const isCurrent = idx === activeWordIndex;
              const isPast = currentTimeSec > token.endTimeSec;

              return (
                <span
                  key={token.id}
                  className={`px-2 py-0.5 rounded-md transition-all duration-150 ${
                    isCurrent
                      ? 'bg-cyber-cyan text-obsidian-950 font-bold shadow-[0_0_12px_rgba(0,229,255,0.8)] scale-105'
                      : isPast
                      ? 'text-slate-400 opacity-90'
                      : 'text-slate-600'
                  }`}
                >
                  {token.word}
                </span>
              );
            })}
          </div>

          {/* Visualizador de Espectro Canvas */}
          <div className="pt-2">
            <canvas
              ref={canvasRef}
              width={600}
              height={36}
              className="w-full h-9 rounded bg-black/40 border border-white/5"
            />
          </div>
        </div>

        {/* Visema & Mouth Shape Monitor (1 coluna) */}
        <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex flex-col items-center justify-between text-center space-y-3">
          <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-cyber-gold" />
            Visema Atual
          </div>

          {/* Círculo do Visema com Radar */}
          <div className="relative flex items-center justify-center">
            <div
              className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-150 ${getVisemeColor(
                activeViseme
              )} ${isPlaying ? 'scale-105 shadow-[0_0_20px_rgba(0,229,255,0.3)]' : ''}`}
            >
              <span className="text-xl font-bold font-mono tracking-wider">
                {activeViseme}
              </span>
              <span className="text-[8px] uppercase tracking-wider opacity-80">
                {activeViseme === 'silence' ? 'Silêncio' : 'Visema Ativo'}
              </span>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono">
            {activeViseme === 'MBP' && 'Oclusão Labial / P, B, M'}
            {activeViseme === 'FV' && 'Labiodental / F, V'}
            {activeViseme === 'LDT' && 'Língua no Palato / L, D, T'}
            {activeViseme === 'A_I' && 'Boca Aberta / A, I'}
            {activeViseme === 'O_U' && 'Arredondamento / O, U'}
            {activeViseme === 'E' && 'Abertura Média / E'}
            {activeViseme === 'silence' && 'Posição de Repouso'}
          </div>
        </div>
      </div>

      {/* Barra de Progresso / Scrubber */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{formatTime(currentTimeSec)}</span>
          <span className="text-slate-500 font-bold">
            {Math.round((currentTimeSec / Math.max(0.1, timeline.totalDurationSec)) * 100)}%
          </span>
          <span>{formatTime(timeline.totalDurationSec)}</span>
        </div>

        <input
          type="range"
          min="0"
          max={timeline.totalDurationSec || 1}
          step="0.05"
          value={currentTimeSec}
          onChange={(e) => handleSeek(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
        />
      </div>

      {/* Controles de Reprodução */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-white/10 gap-3">
        {/* Botões Centrais */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-obsidian-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-cyber-cyan hover:bg-cyan-300 text-obsidian-950 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Ouvir Síntese</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs border border-white/10 transition-colors"
            title="Reiniciar fala para o início"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>

          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs border transition-colors ${
              isLooping
                ? 'bg-cyber-gold/20 border-cyber-gold text-cyber-gold'
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
            }`}
            title="Repetir em loop"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Loop</span>
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2.5 rounded-xl border text-xs transition-colors ${
              isMuted
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
            title={isMuted ? 'Desmutar áudio' : 'Mutar áudio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Informações de Velocidade e PPM */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-500">Velocidade:</span>
            <strong className="text-cyber-cyan">{speedFactor.toFixed(2)}x</strong>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-500">Estimativa:</span>
            <strong className="text-cyber-gold">~{timeline.estimatedWpm} PPM</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
