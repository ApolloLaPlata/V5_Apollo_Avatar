'use client';

import React, { useState, useEffect } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  BroadcasterActionType,
  BroadcasterWebhookPayload,
  BroadcasterAuditLogEntry,
  generateBroadcasterLiveToken,
  dispatchLocalBroadcasterWebhook,
  DEFAULT_BROADCASTER_ALLOWED_ORIGINS,
  MASTER_HOLDING_BROADCASTER_KEY,
} from '@/utils/broadcasterWebhookEngine';
import {
  Radio,
  RadioTower,
  ShieldCheck,
  ShieldAlert,
  Key,
  Copy,
  Check,
  Send,
  Terminal,
  Activity,
  Zap,
  RefreshCw,
  Server,
  Globe,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Eye,
  EyeOff,
  Code2,
} from 'lucide-react';

interface BroadcasterWebhookPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function BroadcasterWebhookPanel({
  avatarId,
  avatarName,
}: BroadcasterWebhookPanelProps) {
  const { avatars, selectedAvatarId, updateAvatar } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const targetId = currentAvatar?.id || 'avatar-maya-vance';
  const targetName = currentAvatar?.name || avatarName || 'Avatar Soberano V5';

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [selectedAction, setSelectedAction] = useState<BroadcasterActionType>('live_handshake');
  const [speechText, setSpeechText] = useState('Boa noite a todos na live! Maya Vance no ar.');
  const [selectedEmotion, setSelectedEmotion] = useState('joy');
  const [selectedPose, setSelectedPose] = useState('greeting_wave');
  const [viewerCount, setViewerCount] = useState(1280);
  const [auditLogs, setAuditLogs] = useState<BroadcasterAuditLogEntry[]>([]);
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'fetch' | 'node'>('fetch');
  const [endpointHealth, setEndpointHealth] = useState<{
    tested: boolean;
    healthy: boolean;
    latencyMs: number;
    msg: string;
  }>({
    tested: false,
    healthy: false,
    latencyMs: 0,
    msg: 'Aguardando verificação',
  });

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://avatar.v5apollo.com';
  const webhookUrl = `${baseUrl}/api/webhook/broadcaster`;
  const liveToken =
    currentAvatar?.channel?.broadcasterLiveToken ||
    `v5b_live_${targetId.replace('avatar-', '')}_8849`;
  const allowedOrigins =
    currentAvatar?.channel?.allowedOrigins || DEFAULT_BROADCASTER_ALLOWED_ORIGINS;

  // Carrega log inicial simulado
  useEffect(() => {
    if (auditLogs.length === 0) {
      setAuditLogs([
        {
          id: 'log_boot_001',
          timestamp: new Date(Date.now() - 1000 * 60 * 2).toLocaleTimeString(),
          direction: 'inbound',
          action: 'live_handshake',
          status: 200,
          origin: 'http://localhost:3008',
          tokenUsed: liveToken.substring(0, 14) + '...',
          payload: {
            action: 'live_handshake',
            avatarId: targetId,
            timestamp: Date.now() - 1000 * 60 * 2,
            data: { viewerCount: 850, isOnline: true },
          },
          response: {
            success: true,
            eventId: 'evt_init_boot',
            action: 'live_handshake',
            timestamp: Date.now() - 1000 * 60 * 2,
            latencyMs: 3,
            message: `Handshake com V5 Broadcaster homologado para [${targetName}].`,
          },
          latencyMs: 3,
        },
      ]);
    }
  }, [targetId, targetName, liveToken, auditLogs.length]);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRegenerateToken = () => {
    const newToken = generateBroadcasterLiveToken(targetId);
    updateAvatar(targetId, {
      channel: {
        ...currentAvatar?.channel,
        broadcasterLiveToken: newToken,
      },
    });
  };

  const handleHealthcheck = async () => {
    const start = Date.now();
    try {
      const res = await fetch(webhookUrl, { method: 'GET' });
      const data = await res.json();
      const latency = Date.now() - start;
      if (res.ok && data.status === 'online') {
        setEndpointHealth({
          tested: true,
          healthy: true,
          latencyMs: latency,
          msg: `Online (${latency}ms) - Handshake disponível`,
        });
      } else {
        setEndpointHealth({
          tested: true,
          healthy: false,
          latencyMs: latency,
          msg: 'Resposta inesperada do endpoint',
        });
      }
    } catch (err: unknown) {
      setEndpointHealth({
        tested: true,
        healthy: false,
        latencyMs: Date.now() - start,
        msg: err instanceof Error ? err.message : 'Falha na conexão local',
      });
    }
  };

  const handleDispatchEvent = async (simulateAttack = false, simulateReplay = false) => {
    setIsDispatching(true);
    const timestamp = simulateReplay ? Date.now() - 1000 * 60 * 10 : Date.now(); // 10 min atrás
    const tokenToUse = simulateAttack ? 'v5b_invalid_hacked_token_xyz' : liveToken;

    const payload: BroadcasterWebhookPayload = {
      action: selectedAction,
      avatarId: targetId,
      timestamp,
      nonce: Math.random().toString(36).substring(2, 8),
      data: {
        text: selectedAction === 'speech_trigger' ? speechText : undefined,
        emotion: selectedAction === 'emotion_trigger' ? selectedEmotion : undefined,
        intensity: 0.9,
        poseName: selectedAction === 'pose_trigger' ? selectedPose : undefined,
        viewerCount: selectedAction === 'live_status' ? viewerCount : undefined,
        isOnline: true,
      },
    };

    const result = await dispatchLocalBroadcasterWebhook(
      webhookUrl,
      payload,
      tokenToUse,
      simulateAttack ? 'http://malicious-site.com' : 'http://localhost:3008'
    );

    const newLog: BroadcasterAuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      direction: 'outbound_test',
      action: selectedAction,
      status: result.status as 200 | 400 | 401 | 403 | 500,
      origin: simulateAttack ? 'http://malicious-site.com' : 'http://localhost:3008',
      tokenUsed: tokenToUse.substring(0, 14) + '...',
      payload,
      response: result.data,
      latencyMs: result.data.latencyMs || 4,
    };

    setAuditLogs((prev) => [newLog, ...prev.slice(0, 19)]);
    setIsDispatching(false);
  };

  const curlSnippet = `curl -X POST "${webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${liveToken}" \\
  -H "x-v5-broadcaster-token: ${liveToken}" \\
  -H "x-v5-timestamp: ${Date.now()}" \\
  -H "Origin: http://localhost:3008" \\
  -d '{"action":"live_handshake","avatarId":"${targetId}","timestamp":${Date.now()}}'`;

  const fetchSnippet = `await fetch("${webhookUrl}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${liveToken}",
    "x-v5-broadcaster-token": "${liveToken}",
    "x-v5-timestamp": Date.now().toString(),
    "Origin": "http://localhost:3008"
  },
  body: JSON.stringify({
    action: "${selectedAction}",
    avatarId: "${targetId}",
    timestamp: Date.now(),
    data: { ${selectedAction === 'speech_trigger' ? `text: "${speechText}"` : `emotion: "${selectedEmotion}"`} }
  })
});`;

  const nodeSnippet = `import axios from 'axios';

const res = await axios.post('${webhookUrl}', {
  action: '${selectedAction}',
  avatarId: '${targetId}',
  timestamp: Date.now(),
  data: { isOnline: true }
}, {
  headers: {
    'Authorization': 'Bearer ${liveToken}',
    'x-v5-broadcaster-token': '${liveToken}',
    'x-v5-timestamp': Date.now().toString(),
    'Origin': 'http://localhost:3008'
  }
});
console.log('Avatar Response:', res.data);`;

  return (
    <section className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(0,229,255,0.06)] relative overflow-hidden">
      {/* Glow Superior */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-80" />

      {/* Header com Status do Hub */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase">
            <RadioTower className="w-3.5 h-3.5 animate-pulse text-cyber-cyan" />
            Fase 8 · Conector de Live V5 Broadcaster · Etapa 071
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-3">
            <Server className="w-6 h-6 text-cyber-cyan" />
            Servidor de Webhook de Entrada Seguro (:3008 &rarr; :3010)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Porta de enlace segura para transmissão 24/7. Validação estrita de Bearer Token,
            whitelist de Origin CORS e proteção contra replay attacks.
          </p>
        </div>

        {/* Status de Conexão com o Broadcaster */}
        <div className="flex items-center gap-3 bg-obsidian-950 px-4 py-2.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-500">
                Hub Inbound Status
              </div>
              <div className="text-xs font-bold text-emerald-400 font-mono">
                ESCUTANDO :3010/api/webhook/broadcaster
              </div>
            </div>
          </div>
          <button
            onClick={handleHealthcheck}
            className="px-2.5 py-1 rounded-lg bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 text-cyber-cyan text-[11px] font-mono flex items-center gap-1.5 transition-all"
            title="Verificar saúde da rota de webhook"
          >
            <RefreshCw className="w-3 h-3" />
            Testar GET
          </button>
        </div>
      </div>

      {/* Alerta de Resultado do Healthcheck */}
      {endpointHealth.tested && (
        <div
          className={`mt-4 p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${
            endpointHealth.healthy
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {endpointHealth.healthy ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
            <span>
              Verificação do Webhook Route: <strong>{endpointHealth.msg}</strong>
            </span>
          </div>
          <span className="text-[11px] opacity-75">
            Porta Local :3010 &harr; V5 Broadcaster :3008
          </span>
        </div>
      )}

      {/* Grid Principal: Credenciais, Endpoint e Parâmetros */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Coluna 1: Endpoint & Token de Autenticação */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-cyber-cyan" />
              Credenciais & Endpoint
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyber-cyan border border-cyber-cyan/20">
              Soberano
            </span>
          </div>

          {/* Endpoint URL */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400">Endpoint Webhook HTTP POST</label>
            <div className="flex items-center gap-2 bg-obsidian-900 border border-white/10 rounded-lg p-2">
              <span className="font-mono text-xs text-cyber-cyan truncate flex-1 select-all">
                {webhookUrl}
              </span>
              <button
                onClick={() => copyToClipboard(webhookUrl, 'url')}
                className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-slate-200 transition-colors"
                title="Copiar URL"
              >
                {copiedKey === 'url' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Token de Acesso do Avatar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono text-slate-400">
                Broadcaster Live Token (Bearer)
              </label>
              <button
                onClick={() => setShowToken(!showToken)}
                className="text-[10px] text-slate-400 hover:text-cyber-cyan flex items-center gap-1 font-mono"
              >
                {showToken ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showToken ? 'Ocultar' : 'Exibir'}
              </button>
            </div>
            <div className="flex items-center gap-2 bg-obsidian-900 border border-white/10 rounded-lg p-2">
              <span className="font-mono text-xs text-emerald-400 truncate flex-1 select-all">
                {showToken
                  ? liveToken
                  : liveToken.substring(0, 10) + '••••••••••••••••••••••••'}
              </span>
              <button
                onClick={() => copyToClipboard(liveToken, 'token')}
                className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-slate-200 transition-colors"
                title="Copiar Token"
              >
                {copiedKey === 'token' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleRegenerateToken}
                className="text-[11px] text-slate-400 hover:text-cyber-cyan font-mono flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Regenerar Token Canônico
              </button>
              <span className="text-[10px] text-slate-500 font-mono">
                Avatar: <strong>{targetName}</strong>
              </span>
            </div>
          </div>

          {/* Master Key da Holding */}
          <div className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span>Chave Mestra da Holding:</span>
              <button
                onClick={() => copyToClipboard(MASTER_HOLDING_BROADCASTER_KEY, 'master')}
                className="text-cyber-cyan hover:underline"
              >
                {copiedKey === 'master' ? 'Copiada!' : 'Copiar'}
              </button>
            </div>
            <div className="font-mono text-[11px] text-slate-300 truncate">
              {MASTER_HOLDING_BROADCASTER_KEY}
            </div>
          </div>

          {/* Origens Homologadas */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-cyber-cyan" />
              Origens Autorizadas (CORS Whitelist)
            </label>
            <div className="space-y-1">
              {allowedOrigins.slice(0, 4).map((org, i) => (
                <div
                  key={i}
                  className="text-[11px] font-mono bg-obsidian-900/60 px-2.5 py-1 rounded border border-white/5 text-slate-300 flex items-center justify-between"
                >
                  <span className="truncate">{org}</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 ml-2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna 2: Despachante & Simulador de Eventos de Live */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyber-cyan" />
              Simulador de Disparos de Live
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Interativo
            </span>
          </div>

          {/* Seleção de Ação */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400">Tipo de Evento Broadcaster</label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value as BroadcasterActionType)}
              className="w-full bg-obsidian-900 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyber-cyan"
            >
              <option value="live_handshake">🤝 live_handshake (Sincronização Inicial)</option>
              <option value="speech_trigger">🗣️ speech_trigger (Gatilho de Fala em Cena)</option>
              <option value="emotion_trigger">🎭 emotion_trigger (Troca de Expressão)</option>
              <option value="pose_trigger">🧍 pose_trigger (Troca de Pose Corporal)</option>
              <option value="live_status">📡 live_status (Atualização de Audiência/Status)</option>
              <option value="chat_message">💬 chat_message (Interação de Chat)</option>
            </select>
          </div>

          {/* Parâmetros Condicionais */}
          {selectedAction === 'speech_trigger' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400">Texto da Fala</label>
              <textarea
                value={speechText}
                onChange={(e) => setSpeechText(e.target.value)}
                rows={2}
                className="w-full bg-obsidian-900 border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyber-cyan"
              />
            </div>
          )}

          {selectedAction === 'emotion_trigger' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400">Expressão Alvo</label>
              <div className="grid grid-cols-3 gap-2">
                {['joy', 'surprise', 'focused', 'smug', 'intense', 'calm'].map((em) => (
                  <button
                    key={em}
                    onClick={() => setSelectedEmotion(em)}
                    className={`px-2 py-1.5 rounded text-[11px] font-mono capitalize border ${
                      selectedEmotion === em
                        ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedAction === 'pose_trigger' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400">Pose Alvo</label>
              <div className="grid grid-cols-2 gap-2">
                {['greeting_wave', 'pointing_display', 'thinking_pose', 't_pose'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPose(p)}
                    className={`px-2 py-1.5 rounded text-[11px] font-mono border ${
                      selectedPose === p
                        ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan font-bold'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedAction === 'live_status' && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-slate-400">
                Audiência Conectada ({viewerCount.toLocaleString()} viewers)
              </label>
              <input
                type="range"
                min="0"
                max="10000"
                step="50"
                value={viewerCount}
                onChange={(e) => setViewerCount(parseInt(e.target.value, 10))}
                className="w-full accent-cyber-cyan"
              />
            </div>
          )}

          {/* Botões de Ação de Teste */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => handleDispatchEvent(false, false)}
              disabled={isDispatching}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.25)] disabled:opacity-50"
            >
              {isDispatching ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Disparar Webhook Homologado (200 OK)
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDispatchEvent(true, false)}
                disabled={isDispatching}
                className="py-1.5 px-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors"
                title="Testar rejeição com token não autorizado"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                Testar Ataque 401
              </button>
              <button
                onClick={() => handleDispatchEvent(false, true)}
                disabled={isDispatching}
                className="py-1.5 px-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors"
                title="Testar rejeição de carimbo de data expirado"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Testar Replay 400
              </button>
            </div>
          </div>
        </div>

        {/* Coluna 3: Código de Integração Pronto */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyber-cyan" />
              Snippet de Integração
            </h3>
            <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10">
              {(['fetch', 'curl', 'node'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCodeTab(tab)}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                    activeCodeTab === tab
                      ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex-1">
            <pre className="bg-obsidian-900 border border-white/10 rounded-lg p-3 text-[11px] font-mono text-cyan-200/90 overflow-x-auto h-48 select-all whitespace-pre-wrap">
              {activeCodeTab === 'fetch' && fetchSnippet}
              {activeCodeTab === 'curl' && curlSnippet}
              {activeCodeTab === 'node' && nodeSnippet}
            </pre>
            <button
              onClick={() =>
                copyToClipboard(
                  activeCodeTab === 'fetch'
                    ? fetchSnippet
                    : activeCodeTab === 'curl'
                    ? curlSnippet
                    : nodeSnippet,
                  'snippet'
                )
              }
              className="absolute top-2 right-2 p-1.5 bg-obsidian-950/80 hover:bg-white/10 rounded border border-white/10 text-slate-300 transition-colors"
              title="Copiar código"
            >
              {copiedKey === 'snippet' ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>

          <p className="text-[10px] text-slate-500 font-mono">
            Copie e cole este código diretamente nos scripts de cena do{' '}
            <span className="text-cyber-cyan font-bold">V5 Broadcaster (:3008)</span> ou nós do{' '}
            <span className="text-slate-300 font-bold">n8n / OBS Browser Source</span>.
          </p>
        </div>
      </div>

      {/* Tabela de Telemetria e Logs em Tempo Real */}
      <div className="mt-6 bg-obsidian-950/90 border border-white/10 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyber-cyan" />
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Auditoria de Tráfego de Webhook em Tempo Real ({auditLogs.length} eventos)
            </h3>
          </div>
          <button
            onClick={() => setAuditLogs([])}
            className="text-[11px] font-mono text-slate-500 hover:text-slate-300 transition-colors"
          >
            Limpar Logs
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                <th className="py-2 px-3">Hora</th>
                <th className="py-2 px-3">Ação</th>
                <th className="py-2 px-3">Origem</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Latência</th>
                <th className="py-2 px-3">Mensagem do Kernel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2 px-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2 px-3 font-bold text-cyber-cyan whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-2 px-3 text-slate-400 truncate max-w-[140px]">{log.origin}</td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 200
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : log.status === 401
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {log.status === 200 ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      {log.status} {log.status === 200 ? 'OK' : 'REJECT'}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-400 whitespace-nowrap">{log.latencyMs}ms</td>
                  <td className="py-2 px-3 text-slate-300 truncate max-w-[260px]">
                    {(log.response as { message?: string; error?: string })?.message ||
                      (log.response as { error?: string })?.error ||
                      'Processado'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
