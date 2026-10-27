import { NextResponse } from 'next/server';
import {
  validateBroadcasterToken,
  validateBroadcasterOrigin,
  validateReplayTimestamp,
  processBroadcasterAction,
  BroadcasterWebhookPayload,
  DEFAULT_BROADCASTER_ALLOWED_ORIGINS,
} from '@/utils/broadcasterWebhookEngine';

function getCorsHeaders(origin: string | null) {
  const isAllowed = origin && (
    DEFAULT_BROADCASTER_ALLOWED_ORIGINS.includes(origin) ||
    origin.startsWith('http://localhost:') ||
    origin.startsWith('http://127.0.0.1:')
  );

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin! : '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-v5-broadcaster-token, x-v5-timestamp',
    'Access-Control-Max-Age': '86400',
    'V5-Sovereign-Service': 'V5 Apollo Avatar Kernel',
    'V5-Capitania': '12',
  };
}

/**
 * OPTIONS /api/webhook/broadcaster
 * Preflight CORS handler para comunicações vindas do V5 Broadcaster (:3008)
 */
export async function OPTIONS(req: Request) {
  const origin = req.headers.get('origin');
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

/**
 * GET /api/webhook/broadcaster
 * Healthcheck e Verificação de Handshake Passivo
 */
export async function GET(req: Request) {
  const origin = req.headers.get('origin');
  const headers = getCorsHeaders(origin);

  return NextResponse.json(
    {
      status: 'online',
      service: 'V5 Apollo Avatar - Broadcaster Inbound Webhook',
      version: '1.0.0',
      capitania: 12,
      holding: 'Holding V5 Apollo',
      port: 3010,
      pairedPort: 3008,
      timestamp: Date.now(),
      supportedActions: [
        'live_handshake',
        'speech_trigger',
        'emotion_trigger',
        'pose_trigger',
        'live_status',
        'chat_message',
      ],
      allowedOrigins: DEFAULT_BROADCASTER_ALLOWED_ORIGINS,
      security: {
        authRequired: true,
        supportedMethods: ['Bearer Token', 'x-v5-broadcaster-token'],
        antiReplayWindowSeconds: 300,
      },
    },
    { status: 200, headers }
  );
}

/**
 * POST /api/webhook/broadcaster
 * Receptor de Eventos de Live do V5 Broadcaster com validação de token e origem
 */
export async function POST(req: Request) {
  const startTime = Date.now();
  const origin = req.headers.get('origin') || req.headers.get('referer');
  const corsHeaders = getCorsHeaders(origin);

  // 1. Validação de Origem (CORS e Anti-Spoofing)
  const originValidation = validateBroadcasterOrigin(origin);
  if (!originValidation.valid) {
    return NextResponse.json(
      {
        success: false,
        error: `Origem não autorizada: [${origin}]. Apenas instâncias homologadas da Holding V5 Apollo (:3008) possuem permissão.`,
        diagnostics: {
          providedOrigin: origin,
          securityPassed: false,
        },
      },
      { status: 403, headers: corsHeaders }
    );
  }

  // 2. Extração e Validação do Token de Autenticação
  const authHeader = req.headers.get('authorization');
  const customTokenHeader = req.headers.get('x-v5-broadcaster-token');
  const tokenCandidate = customTokenHeader || authHeader;

  const tokenValidation = validateBroadcasterToken(tokenCandidate);
  if (!tokenValidation.valid) {
    return NextResponse.json(
      {
        success: false,
        error: tokenValidation.reason,
        diagnostics: {
          authMethod: tokenValidation.method,
          securityPassed: false,
        },
      },
      { status: 401, headers: corsHeaders }
    );
  }

  // 3. Leitura e Validação do Payload JSON
  let body: BroadcasterWebhookPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Corpo da requisição inválido. Esperado payload JSON.',
      },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Payload JSON inválido. Esperado um objeto.',
      },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!body.action || !body.avatarId) {
    return NextResponse.json(
      {
        success: false,
        error: 'Campos obrigatórios ausentes: "action" e "avatarId" são requeridos no payload.',
      },
      { status: 400, headers: corsHeaders }
    );
  }

  // 4. Validação de Carimbo de Data/Hora (Anti-Replay Attack)
  const timestampHeader = req.headers.get('x-v5-timestamp');
  const rawTimestamp = timestampHeader || body.timestamp;
  const replayValidation = validateReplayTimestamp(rawTimestamp);

  if (!replayValidation.valid) {
    return NextResponse.json(
      {
        success: false,
        error: replayValidation.reason,
        diagnostics: {
          deltaMs: replayValidation.deltaMs,
          securityPassed: false,
        },
      },
      { status: 400, headers: corsHeaders }
    );
  }

  // 5. Roteamento e Processamento da Ação
  const responseData = processBroadcasterAction(body);

  // Adiciona diagnósticos de segurança para rastreabilidade
  responseData.diagnostics = {
    origin: originValidation.normalizedOrigin,
    authMethod: tokenValidation.method,
    tokenPrefix: tokenCandidate ? `${tokenCandidate.slice(0, 10)}...` : 'unknown',
    securityPassed: true,
    replayDeltaMs: replayValidation.deltaMs,
  };
  responseData.latencyMs = Math.max(1, Date.now() - startTime);

  return NextResponse.json(responseData, {
    status: 200,
    headers: corsHeaders,
  });
}
