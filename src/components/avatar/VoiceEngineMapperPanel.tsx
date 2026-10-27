'use client';

import React, { useState } from 'react';
import { VoiceEngine } from '@/types/avatar';
import {
  CANONICAL_VOICE_ENGINES,
  VoiceEngineProfile,
} from '@/utils/voiceEnginesMapper';
import { toast } from '@/store/useToastStore';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  Cpu,
  Radio,
  Zap,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Gauge,
  Workflow,
} from 'lucide-react';

interface VoiceEngineMapperPanelProps {
  avatarId?: string;
  avatarName?: string;
  currentEngine?: VoiceEngine;
}

export default function VoiceEngineMapperPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
  currentEngine = 'qwen-tts',
}: VoiceEngineMapperPanelProps) {
  const [selectedEngine, setSelectedEngine] = useState<VoiceEngine>(currentEngine);
  const [isSimulatingPing, setIsSimulatingPing] = useState<boolean>(false);
  const [simulatedPing, setSimulatedPing] = useState<number | null>(null);

  const { updateAvatar, avatars } = useAvatarStore();
  const engines = Object.values(CANONICAL_VOICE_ENGINES);
  const activeEngine = CANONICAL_VOICE_ENGINES[selectedEngine];

  const handleSelectEngine = (eng: VoiceEngine) => {
    setSelectedEngine(eng);
    const current = avatars.find((a) => a.id === avatarId);
    if (!current) return;

    updateAvatar(avatarId, {
      voice: {
        ...current.voice,
        engine: eng,
      },
    });

    toast.success(
      'Motor de Voz Atualizado!',
      `${CANONICAL_VOICE_ENGINES[eng].name} selecionado para síntese vocal do avatar.`
    );
  };

  const handleSimulateLatency = () => {
    setIsSimulatingPing(true);
    setSimulatedPing(null);

    const targetLatency = activeEngine.averageLatencyMs;
    // Variação orgânica de ±10%
    const actualDelay = Math.round(targetLatency * (0.9 + Math.random() * 0.2));

    setTimeout(() => {
      setIsSimulatingPing(false);
      setSimulatedPing(actualDelay);
      toast.info(
        `Teste de Latência: ${activeEngine.name}`,
        `Ping de inferência medido: ${actualDelay}ms (RTF: ${activeEngine.realTimeFactor}x).`
      );
    }, actualDelay);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-5 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Mapeador de Motores de Síntese Vocal (V5 Sound Engines)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30">
                {activeEngine.name.split(' ')[0]} Ativo
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Perfis de latência, arquitetura neural e roteamento de síntese para o ecossistema V5 Apollo
            </p>
          </div>
        </div>

        {/* Botão de Teste de Ping */}
        <button
          type="button"
          onClick={handleSimulateLatency}
          disabled={isSimulatingPing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-950 border border-white/15 text-slate-300 text-xs font-bold hover:border-cyber-cyan hover:text-cyber-cyan transition-all cursor-pointer disabled:opacity-50"
        >
          <Zap className={`w-3.5 h-3.5 ${isSimulatingPing ? 'text-luxury-gold animate-bounce' : 'text-cyber-cyan'}`} />
          {isSimulatingPing ? 'Medindo Ping...' : 'Simular Latência'}
        </button>
      </div>

      {/* Grid: 3 Cartões de Motores de Voz */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {engines.map((eng) => {
          const isSelected = selectedEngine === eng.id;
          return (
            <div
              key={eng.id}
              onClick={() => handleSelectEngine(eng.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between select-none ${
                isSelected
                  ? 'border-cyber-cyan bg-cyber-cyan/10 shadow-[0_0_15px_rgba(0,229,255,0.2)] ring-1 ring-cyber-cyan/50'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2">
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      eng.streamingSupported
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30'
                    }`}
                  >
                    {eng.streamingSupported ? 'WebSocket Stream' : 'Batch REST'}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-cyber-cyan" />}
                </div>

                <h4 className="text-xs font-bold text-slate-100">{eng.name}</h4>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {eng.tagline}
                </p>
              </div>

              {/* Indicador de Latência e VRAM */}
              <div className="pt-3 mt-3 border-t border-white/5 space-y-1.5 text-[10px]">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> Latência Média:
                  </span>
                  <span
                    className={`font-bold font-mono ${
                      eng.averageLatencyMs <= 200
                        ? 'text-emerald-400'
                        : eng.averageLatencyMs <= 300
                        ? 'text-cyber-cyan'
                        : 'text-luxury-gold'
                    }`}
                  >
                    ~{eng.averageLatencyMs}ms
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-slate-500" /> Real-Time Factor:
                  </span>
                  <span className="text-slate-300 font-mono font-bold">
                    {eng.realTimeFactor}x RTF
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Painel de Especificações Técnicas do Motor Selecionado */}
      <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Coluna 1: Arquitetura & Uso Recomendado (6 cols) */}
        <div className="lg:col-span-6 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyber-cyan flex items-center gap-1.5">
              <Workflow className="w-4 h-4" />
              Roteamento do Motor: {activeEngine.name}
            </span>
            {simulatedPing !== null && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Ping: {simulatedPing}ms
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center gap-1 text-slate-400">
              <span>Arquitetura:</span>
              <strong className="text-slate-200">{activeEngine.architecture}</strong>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span>Fidelidade de Clonagem:</span>
              <strong className="text-luxury-gold">{activeEngine.zeroShotCloningQuality}</strong>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-[10px] text-slate-400">
            <strong className="text-slate-300 block">Melhor Aplicação na Holding:</strong>
            {activeEngine.bestUseCases}
          </div>
        </div>

        {/* Coluna 2: Handshake do V5 Sound & Capitanias Alvo (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Capitanias Alvo Integradas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeEngine.targetCapitanias.map((cap, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-cyber-cyan border border-white/10 font-mono"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Dados de Handshake JSON */}
          <div className="p-2.5 rounded-lg bg-black/60 border border-white/5 space-y-1 text-[10px] font-mono">
            <span className="text-slate-500 block text-[9px]">V5 Sound Handshake Protocol:</span>
            <div className="flex justify-between text-slate-300">
              <span>Protocolo:</span>
              <span className="text-cyber-cyan font-bold">{activeEngine.handshakePayload.protocol}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Buffer Chunk:</span>
              <span className="text-luxury-gold font-bold">{activeEngine.handshakePayload.bufferChunkMs}ms</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>VRAM Alocada:</span>
              <span className="text-slate-300 font-bold">{activeEngine.vramFootprintGb} GB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
