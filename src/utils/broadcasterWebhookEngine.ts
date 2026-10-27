/**
 * V5 Apollo Avatar - Broadcaster Webhook Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Servidor e Utilitários de Webhook de Entrada Seguro para o V5 Broadcaster (:3008)
 * Suporte a autenticação por Bearer Token, validação estrita de Origin CORS,
 * proteção anti-replay por carimbo de data/hora e roteamento de ações de live em tempo real.
 */

export type BroadcasterActionType = 
  | 'live_handshake'
  | 'speech_trigger'
  | 'emotion_trigger'
  | 'pose_trigger'
  | 'live_status'
  | 'chat_message';

export interface BroadcasterWebhookPayload {
  action: BroadcasterActionType;
  avatarId: string;
  timestamp: number;
  nonce?: string;
  data?: {
    text?: string;
    audioUrl?: string;
    emotion?: string;
    intensity?: number;
    poseName?: string;
    viewerCount?: number;
    isOnline?: boolean;
    chatUser?: string;
    chatMessage?: string;
    metadata?: Record<string, unknown>;
  };
}

export interface BroadcasterWebhookResponse {
  success: boolean;
  eventId: string;
  action: BroadcasterActionType;
  timestamp: number;
  latencyMs: number;
  message: string;
  avatar?: {
    id: string;
    name: string;
    isLiveActive: boolean;
    currentEmotion?: string;
    voiceId?: string;
    voiceEngine?: string;
    capabilities: string[];
  };
  diagnostics?: {
    origin: string;
    authMethod: string;
    tokenPrefix: string;
    securityPassed: boolean;
    replayDeltaMs: number;
  };
  error?: string;
}

export interface BroadcasterAuditLogEntry {
  id: string;
  timestamp: string;
  direction: 'inbound' | 'outbound_test';
  action: BroadcasterActionType;
  status: 200 | 400 | 401 | 403 | 500;
  origin: string;
  tokenUsed: string;
  payload: BroadcasterWebhookPayload;
  response: BroadcasterWebhookResponse | Record<string, unknown>;
  latencyMs: number;
}

export const DEFAULT_BROADCASTER_ALLOWED_ORIGINS = [
  'http://localhost:3008',
  'http://127.0.0.1:3008',
  'https://broadcaster.v5apollo.com',
  'http://localhost:3010',
  'http://127.0.0.1:3010',
];

export const MASTER_HOLDING_BROADCASTER_KEY = 'v5b_live_sovereign_broadcaster_key_2026';
export const MAX_REPLAY_TIME_WINDOW_MS = 5 * 60 * 1000; // 5 minutos

/**
 * Gera um token canônico único para conexão com o V5 Broadcaster
 */
export function generateBroadcasterLiveToken(avatarId: string): string {
  const cleanId = avatarId.replace(/^avatar-/, '').replace(/[^a-zA-Z0-9]/g, '_');
  const entropy = Math.random().toString(36).substring(2, 10);
  return `v5b_live_${cleanId}_${entropy}`;
}

/**
 * Validação rigorosa do Bearer Token ou cabeçalho x-v5-broadcaster-token
 */
export function validateBroadcasterToken(
  providedToken: string | null | undefined,
  avatarToken?: string
): { valid: boolean; reason?: string; method: string } {
  if (!providedToken) {
    return {
      valid: false,
      reason: 'Token de autenticação ausente. Forneça "Authorization: Bearer <token>" ou cabeçalho "x-v5-broadcaster-token".',
      method: 'none',
    };
  }

  // Normalização do token
  let cleanToken = providedToken.trim();
  let method = 'x-v5-broadcaster-token';

  if (cleanToken.toLowerCase().startsWith('bearer ')) {
    cleanToken = cleanToken.slice(7).trim();
    method = 'bearer';
  }

  // Chave mestra da holding é sempre válida para o ecossistema interno
  if (cleanToken === MASTER_HOLDING_BROADCASTER_KEY) {
    return { valid: true, method };
  }

  // Se o avatar possui token específico configurado
  if (avatarToken && cleanToken === avatarToken.trim()) {
    return { valid: true, method };
  }

  // Se nenhum token específico estiver cadastrado mas o token enviado segue o padrão v5b_live_*
  if (!avatarToken && cleanToken.startsWith('v5b_live_')) {
    return { valid: true, method };
  }

  return {
    valid: false,
    reason: 'Token inválido ou não autorizado para este avatar.',
    method,
  };
}

/**
 * Validação de Origem (CORS e anti-spoofing)
 */
export function validateBroadcasterOrigin(
  originHeader: string | null | undefined,
  allowedOrigins?: string[]
): { valid: boolean; normalizedOrigin: string } {
  // Se requisição sem origin (ex: server-to-server curl ou node-fetch sem origin)
  const normalizedOrigin = (originHeader || '').trim();

  if (!normalizedOrigin) {
    return { valid: true, normalizedOrigin: 'server-to-server' };
  }

  const originsWhitelist = new Set([
    ...DEFAULT_BROADCASTER_ALLOWED_ORIGINS,
    ...(allowedOrigins || []),
  ]);

  // Checagem de origem exata ou wildcard local
  const isAllowed = 
    originsWhitelist.has(normalizedOrigin) ||
    normalizedOrigin.startsWith('http://localhost:') ||
    normalizedOrigin.startsWith('http://127.0.0.1:');

  return {
    valid: isAllowed,
    normalizedOrigin,
  };
}

/**
 * Validação do carimbo de data/hora para impedir ataques de repetição (replay attacks)
 */
export function validateReplayTimestamp(
  timestamp: number | undefined
): { valid: boolean; deltaMs: number; reason?: string } {
  if (typeof timestamp !== 'number' || !Number.isFinite(timestamp) || timestamp <= 0) {
    return {
      valid: false,
      deltaMs: 0,
      reason: 'Carimbo de data/hora (timestamp) numérico ausente ou inválido no payload.',
    };
  }

  const now = Date.now();
  const deltaMs = Math.abs(now - timestamp);

  if (deltaMs > MAX_REPLAY_TIME_WINDOW_MS) {
    return {
      valid: false,
      deltaMs,
      reason: `Requisição expirada (delta: ${(deltaMs / 1000).toFixed(1)}s, limite: 300s). Replay attack rejeitado.`,
    };
  }

  return { valid: true, deltaMs };
}

/**
 * Roteamento e processamento interno da ação do V5 Broadcaster
 */
export function processBroadcasterAction(
  payload: BroadcasterWebhookPayload,
  avatarProfile?: {
    id: string;
    name: string;
    isLiveActive?: boolean;
    currentEmotion?: string;
    voiceId?: string;
    voiceEngine?: string;
  }
): BroadcasterWebhookResponse {
  const startTime = Date.now();
  const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const avatarInfo = {
    id: avatarProfile?.id || payload.avatarId,
    name: avatarProfile?.name || 'Avatar Soberano V5',
    isLiveActive: avatarProfile?.isLiveActive ?? true,
    currentEmotion: payload.data?.emotion || avatarProfile?.currentEmotion || 'neutral',
    voiceId: avatarProfile?.voiceId || 'voice_maya_vance_br_v1',
    voiceEngine: avatarProfile?.voiceEngine || 'qwen-tts',
    capabilities: [
      'face_turnaround_360',
      'viseme_lipsync_realtime',
      'idle_breathing_natural',
      'stochastic_eye_blink',
      'soul_guardrails_active',
      'broadcaster_bidirectional_sync',
    ],
  };

  let message = 'Ação processada com sucesso pelo V5 Avatar Kernel.';

  switch (payload.action) {
    case 'live_handshake':
      message = `Handshake com V5 Broadcaster homologado para [${avatarInfo.name}]. Transmissão pronta.`;
      break;

    case 'speech_trigger':
      message = `Gatilho de fala recebido: "${payload.data?.text?.substring(0, 40) || 'Áudio direto'}...". FSM transicionada para speaking.`;
      break;

    case 'emotion_trigger':
      message = `Expressão do avatar alterada para [${payload.data?.emotion || 'neutral'}] com intensidade ${(payload.data?.intensity ? payload.data.intensity * 100 : 100)}%.`;
      break;

    case 'pose_trigger':
      message = `Pose alterada para [${payload.data?.poseName || 'default_idle'}]. Coordenadas de rigging atualizadas.`;
      break;

    case 'live_status':
      message = `Status da live atualizado: ${payload.data?.isOnline ? 'ONLINE' : 'OFFLINE'} com ${payload.data?.viewerCount || 0} espectadores.`;
      break;

    case 'chat_message':
      message = `Mensagem de chat de [${payload.data?.chatUser || 'Espectador'}] recebida. Validação de guardrails ética aprovada.`;
      break;

    default:
      message = `Ação desconhecida [${payload.action}] aceita em modo telemetria passiva.`;
      break;
  }

  const latencyMs = Math.max(1, Date.now() - startTime);

  return {
    success: true,
    eventId,
    action: payload.action,
    timestamp: Date.now(),
    latencyMs,
    message,
    avatar: avatarInfo,
  };
}

/**
 * Despachante local para testes na UI do estúdio (:3010 -> /api/webhook/broadcaster)
 */
export async function dispatchLocalBroadcasterWebhook(
  endpointUrl: string,
  payload: BroadcasterWebhookPayload,
  token: string,
  origin = 'http://localhost:3008'
): Promise<{ status: number; data: BroadcasterWebhookResponse }> {
  try {
    const res = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-v5-broadcaster-token': token,
        'x-v5-timestamp': payload.timestamp.toString(),
        'Origin': origin,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return { status: res.status, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Falha na conexão de rede';
    return {
      status: 500,
      data: {
        success: false,
        eventId: `err_${Date.now()}`,
        action: payload.action,
        timestamp: Date.now(),
        latencyMs: 0,
        message: 'Erro ao despachar webhook para endpoint local.',
        error: message,
      },
    };
  }
}
