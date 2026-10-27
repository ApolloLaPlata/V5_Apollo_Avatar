'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  ObsConnectionStatus,
  ObsWebSocketConfig,
  ObsTelemetryPacket,
  ObsSceneDescriptor,
  DEFAULT_OBS_WS_CONFIG,
  ObsAvatarWebSocketBridge,
} from '@/utils/obsWebSocketConnectorEngine';
import {
  Radio,
  Wifi,
  WifiOff,
  Activity,
  Layers,
  Monitor,
  Eye,
  EyeOff,
  Terminal,
  Zap,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  RefreshCw,
  Sliders,
  Settings2,
  Tv,
} from 'lucide-react';

interface ObsWebSocketConnectorPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function ObsWebSocketConnectorPanel({
  avatarId,
  avatarName,
}: ObsWebSocketConnectorPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];
  const targetName = currentAvatar?.name || avatarName || 'Maya Vance';

  const [config, setConfig] = useState<ObsWebSocketConfig>(DEFAULT_OBS_WS_CONFIG);
  const [status, setStatus] = useState<ObsConnectionStatus>('disconnected');
  const [telemetry, setTelemetry] = useState<ObsTelemetryPacket | null>(null);
  const [sceneState, setSceneState] = useState<ObsSceneDescriptor>({
    sceneName: 'CENA_01_AVATAR_BANCADA',
    sceneIndex: 0,
    isProgramScene: true,
    isStudioMode: false,
    avatarSourceVisible: true,
    audioMuted: false,
  });

  const bridgeRef = useRef<ObsAvatarWebSocketBridge | null>(null);

  // Instancia bridge na montagem
  useEffect(() => {
    const bridge = new ObsAvatarWebSocketBridge(config);
    bridgeRef.current = bridge;

    const unsubscribe = bridge.subscribe((newStatus, newTelemetry) => {
      setStatus(newStatus);
      if (newTelemetry) {
        setTelemetry(newTelemetry);
      }
      setSceneState({ ...bridge.sceneState });
    });

    return () => {
      unsubscribe();
      bridge.disconnect();
    };
  }, []);

  const handleConnectReal = () => {
    if (!bridgeRef.current) return;
    bridgeRef.current.connect();
  };

  const handleStartSimulation = () => {
    if (!bridgeRef.current) return;
    bridgeRef.current.startSimulatedLoop();
  };

  const handleDisconnect = () => {
    if (!bridgeRef.current) return;
    bridgeRef.current.disconnect();
    setTelemetry(null);
  };

  const handleSwitchScene = (name: string) => {
    if (!bridgeRef.current) return;
    bridgeRef.current.switchScene(name);
  };

  const handleToggleVisibility = () => {
    if (!bridgeRef.current) return;
    bridgeRef.current.toggleSourceVisibility();
  };

  const logs = bridgeRef.current ? bridgeRef.current.logs : [];

  return (
    <section className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(0,229,255,0.06)] relative overflow-hidden">
      {/* Glow Superior */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-80" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase">
            <Radio className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
            Fase 8 · Conector de Live V5 Broadcaster · Etapa 075
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-3">
            <Wifi className="w-6 h-6 text-cyber-cyan" />
            Conector WebSocket Local de Baixa Latência (OBS Studio v5 / :4455)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Sincronização bidirecional de cenas, visibilidade do Browser Source e telemetria de
            transformações a 60 FPS com latência RTT inferior a 5ms.
          </p>
        </div>

        {/* Status de Conexão WebSocket */}
        <div className="flex items-center gap-3 bg-obsidian-950 px-4 py-2.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <span
              className={`relative flex h-3 w-3 ${
                status !== 'disconnected' ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  status === 'connected'
                    ? 'bg-emerald-400'
                    : status === 'simulated_live'
                    ? 'bg-purple-400'
                    : 'bg-slate-500'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  status === 'connected'
                    ? 'bg-emerald-500'
                    : status === 'simulated_live'
                    ? 'bg-purple-500'
                    : 'bg-slate-500'
                }`}
              ></span>
            </span>
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-500">OBS WS Status</div>
              <div
                className={`text-xs font-bold font-mono ${
                  status === 'connected'
                    ? 'text-emerald-400'
                    : status === 'simulated_live'
                    ? 'text-purple-400'
                    : 'text-slate-400'
                }`}
              >
                {status === 'connected'
                  ? 'OBS REAL CONECTADO'
                  : status === 'simulated_live'
                  ? 'SIMULAÇÃO 60 FPS ATIVA'
                  : status === 'connecting'
                  ? 'CONECTANDO...'
                  : 'DESCONECTADO'}
              </div>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyber-cyan border border-cyber-cyan/20">
            Porta :4455
          </span>
        </div>
      </div>

      {/* Grid de Cards: Telemetria em Tempo Real, Controles de Cena e Configuração */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Card 1: Telemetria de Transmissão (RTT & Transforms) */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyber-cyan" />
                Telemetria de Sinal (<span className="text-cyber-cyan">{telemetry?.fps || 60} FPS</span>)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                RTT: {telemetry ? `${telemetry.rttMs} ms` : '1.8 ms'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Pacotes Transmitidos:</span>
                <span className="text-cyber-cyan font-bold">{telemetry?.seq || 0} pkts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Visema Sincronizado:</span>
                <span className="text-emerald-400 font-bold">
                  {telemetry?.activeViseme || 'silence'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Head Tilt Euler (P/Y/R):</span>
                <span className="text-slate-200">
                  {telemetry
                    ? `${telemetry.headTiltEuler.pitch}º / ${telemetry.headTiltEuler.yaw}º / ${telemetry.headTiltEuler.roll}º`
                    : '0.0º / 0.0º / 0.0º'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Oscilação Tórax (Y):</span>
                <span className="text-slate-200">
                  {telemetry ? `${telemetry.breathingY}%` : '0.0%'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Fonte no OBS:</span>
                <span
                  className={`font-bold ${
                    sceneState.avatarSourceVisible ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {sceneState.avatarSourceVisible ? 'VISÍVEL EM PROGRAMA' : 'OCULTA'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleToggleVisibility}
              className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 border transition-all ${
                sceneState.avatarSourceVisible
                  ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  : 'bg-rose-500/20 border-rose-500 text-rose-300'
              }`}
            >
              {sceneState.avatarSourceVisible ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" /> Ocultar Avatar no OBS
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" /> Exibir Avatar no OBS
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 2: Sincronização de Cenas do OBS */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                <Monitor className="w-4 h-4 text-cyber-cyan" />
                Cena Ativa no OBS Studio
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Programa
              </span>
            </div>

            <div className="mt-3 p-3 bg-obsidian-900 border border-white/10 rounded-lg space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Nome da Cena:</div>
              <div className="text-xs font-bold text-cyber-cyan font-mono truncate">
                {sceneState.sceneName}
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <label className="text-[11px] font-mono text-slate-400">
                Troca Rápida de Cena (Broadcaster Dispatch):
              </label>
              <div className="space-y-1.5">
                {[
                  'CENA_01_AVATAR_BANCADA',
                  'CENA_02_REACT_PODCAST',
                  'CENA_03_TELA_INTEIRA_UGC',
                ].map((scName) => (
                  <button
                    key={scName}
                    onClick={() => handleSwitchScene(scName)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] font-mono border transition-all truncate flex items-center justify-between ${
                      sceneState.sceneName === scName
                        ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan font-bold'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{scName}</span>
                    {sceneState.sceneName === scName && (
                      <CheckCircle2 className="w-3 h-3 text-cyber-cyan" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Parâmetros do Socket & Disparadores */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-cyber-cyan" />
                Configuração do Socket
              </span>
              <span className="text-[10px] font-mono text-slate-500">v5 Protocol</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Host</label>
                <input
                  type="text"
                  value={config.host}
                  onChange={(e) => setConfig({ ...config, host: e.target.value })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded px-2 py-1 text-slate-200 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Porta</label>
                <input
                  type="number"
                  value={config.port}
                  onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value, 10) })}
                  className="w-full bg-obsidian-900 border border-white/10 rounded px-2 py-1 text-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <label className="text-[10px] text-slate-400">Nome da Fonte no OBS</label>
              <input
                type="text"
                value={config.sourceName}
                onChange={(e) => setConfig({ ...config, sourceName: e.target.value })}
                className="w-full bg-obsidian-900 border border-white/10 rounded px-2 py-1 text-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {status === 'disconnected' ? (
              <>
                <button
                  onClick={handleConnectReal}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] font-mono"
                >
                  <Wifi className="w-4 h-4" /> Conectar OBS Studio (:4455)
                </button>
                <button
                  onClick={handleStartSimulation}
                  className="w-full py-2 px-3 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" /> Iniciar Loop Simulado 60 FPS
                </button>
              </>
            ) : (
              <button
                onClick={handleDisconnect}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Square className="w-3.5 h-3.5" /> Desconectar Bridge WebSocket
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Terminal de Auditoria de Mensagens WebSocket em Tempo Real */}
      <div className="mt-6 bg-obsidian-950/90 border border-white/10 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyber-cyan" />
            Terminal de Eventos WebSocket OBS Studio ({logs.length} registros)
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Bidirecional · Latência &lt; 5ms
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                <th className="py-2 px-3">Hora</th>
                <th className="py-2 px-3">Fluxo</th>
                <th className="py-2 px-3">Tipo de Evento</th>
                <th className="py-2 px-3">Detalhes do Pacote</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-slate-500 text-xs">
                    Nenhum pacote trafegado. Conecte ao OBS ou inicie a simulação para inspecionar.
                  </td>
                </tr>
              ) : (
                logs.map((lg) => (
                  <tr key={lg.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-1.5 px-3 text-slate-400 whitespace-nowrap">{lg.timestamp}</td>
                    <td className="py-1.5 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          lg.direction === 'inbound'
                            ? 'bg-cyan-500/10 text-cyber-cyan border border-cyber-cyan/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {lg.direction === 'inbound' ? 'IN ← OBS' : 'OUT → OBS'}
                      </span>
                    </td>
                    <td className="py-1.5 px-3 font-bold text-slate-200">{lg.eventType}</td>
                    <td className="py-1.5 px-3 text-slate-400 truncate max-w-[320px]">
                      {JSON.stringify(lg.details)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
