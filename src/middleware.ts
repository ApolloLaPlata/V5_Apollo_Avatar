import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};

// Rate limiter em memória
const ipRateMap = new Map<string, { count: number; resetAt: number }>();

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // 1. Preflight CORS
  if (req.method === 'OPTIONS') {
    return NextResponse.next();
  }

  // 2. Rate Limiting em rotas de API e webhook
  if (pathname.startsWith('/api')) {
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = (forwarded ? forwarded.split(',')[0].trim() : realIp?.trim()) || '127.0.0.1';

    const limit = pathname.startsWith('/api/webhook') ? 30 : 60;
    const now = Date.now();
    const rateKey = `${ip}:${pathname.startsWith('/api/webhook') ? 'webhook' : 'api'}`;
    const record = ipRateMap.get(rateKey);

    if (!record || now >= record.resetAt) {
      ipRateMap.set(rateKey, { count: 1, resetAt: now + 60000 });
    } else {
      record.count++;
      if (record.count > limit) {
        return NextResponse.json(
          {
            success: false,
            error: 'Taxa de requisições excedida. Aguarde alguns segundos.',
            code: 'AVATAR_RATE_LIMIT_EXCEEDED',
            retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000),
          },
          {
            status: 429,
            headers: {
              'Retry-After': Math.ceil((record.resetAt - now) / 1000).toString(),
              'X-Shield': 'v5-avatar-rate-limiter-v1',
            },
          }
        );
      }
    }
  }

  const res = NextResponse.next();
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Se não for rota de overlay do OBS, aplica SAMEORIGIN
  if (!pathname.startsWith('/live/overlay')) {
    res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  }

  return res;
}
