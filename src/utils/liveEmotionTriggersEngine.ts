/**
 * V5 Apollo Avatar - Live Emotion Triggers Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Motor de Gatilhos de Emoções em Tempo Real para Lives
 * Mapeia superchats, doações, novos inscritos, raids e moderação em
 * microexpressões faciais (FACS), inclinações de cabeça (Head-Tilts),
 * efeitos visuais (VFX) e falas sugeridas para o V5 Broadcaster (:3008).
 */

export type LiveEventType =
  | 'superchat_whale'
  | 'superchat_standard'
  | 'superchat_micro'
  | 'new_subscriber_vip'
  | 'new_subscriber_standard'
  | 'audience_raid'
  | 'chat_question_complex'
  | 'moderation_alert'
  | 'live_milestone';

export type LiveVfxEffect =
  | 'golden_confetti'
  | 'neon_shockwave'
  | 'heart_burst'
  | 'shield_glitch'
  | 'sparkle_stars'
  | 'calm_zen'
  | 'none';

export interface LiveEventPayload {
  id: string;
  eventType: LiveEventType;
  sender: string;
  amountFormatted?: string;
  amountValue?: number;
  message?: string;
  platform: 'youtube' | 'twitch' | 'tiktok' | 'kick' | 'v5broadcaster';
  timestamp: number;
}

export interface LiveEmotionReaction {
  emotionId: string;
  name: string;
  facsUnits: string;
  intensity: number;            // 0.1 a 1.0
  durationMs: number;           // Duração em milissegundos
  headTiltDeg: number;          // Inclinação de cabeça
  vfx: LiveVfxEffect;
  suggestedSpokenReaction: string;
  priority: number;             // 1 (normal), 2 (alto), 3 (crítico/whale)
  colorAccent: string;          // Cor hex para UI
}

export interface ActiveLiveEmotionState {
  currentEmotionId: string;
  emotionName: string;
  intensity: number;            // 0.0 a 1.0
  headTiltDeg: number;
  activeVfx: LiveVfxEffect;
  sourceEvent?: LiveEventPayload;
  remainingMs: number;
  totalDurationMs: number;
  isDecaying: boolean;
  queueLength: number;
  lastUpdated: number;
}

/**
 * Catálogo Canônico de Reações Emocionais por Evento de Live
 */
export function calculateEmotionReaction(
  event: LiveEventPayload,
  avatarName = 'Maya Vance'
): LiveEmotionReaction {
  switch (event.eventType) {
    case 'superchat_whale':
      return {
        emotionId: 'euphoria_whale',
        name: 'Euforia & Gratidão Máxima',
        facsUnits: 'FACS AU 6 + AU 12 + AU 1 + AU 2 (Duchenne Máximo + Sobrancelhas Elevadas)',
        intensity: 1.0,
        durationMs: 7000,
        headTiltDeg: 6.5,
        vfx: 'golden_confetti',
        suggestedSpokenReaction: `Gente do céu, ${event.sender}! Que doação gigantesca de ${event.amountFormatted}! Muito obrigada pelo suporte soberano na live!`,
        priority: 3,
        colorAccent: '#fbbf24', // Dourado
      };

    case 'superchat_standard':
      return {
        emotionId: 'open_smile_radiant',
        name: 'Sorriso Aberto & Entusiasmo Radiante',
        facsUnits: 'FACS AU 6 + AU 12 (Sorriso Genuíno Duchenne)',
        intensity: 0.88,
        durationMs: 4500,
        headTiltDeg: 4.2,
        vfx: 'sparkle_stars',
        suggestedSpokenReaction: `Valeu demais, ${event.sender}, pelos ${event.amountFormatted}! Tamo junto na transmissão!`,
        priority: 2,
        colorAccent: '#00e5ff', // Cyber Cyan
      };

    case 'superchat_micro':
      return {
        emotionId: 'subtle_smile_warm',
        name: 'Sorriso Amigável de Agradecimento',
        facsUnits: 'FACS AU 12 (Leve elevação das comissuras labiais)',
        intensity: 0.70,
        durationMs: 3200,
        headTiltDeg: 2.0,
        vfx: 'heart_burst',
        suggestedSpokenReaction: `Obrigada pelo presente, ${event.sender}! Cada apoio fortalece nosso estúdio.`,
        priority: 1,
        colorAccent: '#f43f5e', // Rosa
      };

    case 'new_subscriber_vip':
      return {
        emotionId: 'vip_welcome_enthusiasm',
        name: 'Acolhimento Nobre VIP & Piscadela Amigável',
        facsUnits: 'FACS AU 12 + AU 45 (Piscar Unilateral / Wink Sutil)',
        intensity: 0.90,
        durationMs: 5000,
        headTiltDeg: -3.5,
        vfx: 'neon_shockwave',
        suggestedSpokenReaction: `Seja muito bem-vindo ao Clube VIP da Holding, ${event.sender}! Você agora tem acesso exclusivo.`,
        priority: 2,
        colorAccent: '#a855f7', // Roxo Neon
      };

    case 'new_subscriber_standard':
      return {
        emotionId: 'friendly_nod_welcome',
        name: 'Boas-Vindas Calorosas & Aceno',
        facsUnits: 'FACS AU 12 (Sorriso Acolhedor) + Aceno de Cabeça Pitch Y',
        intensity: 0.75,
        durationMs: 3500,
        headTiltDeg: 3.0,
        vfx: 'sparkle_stars',
        suggestedSpokenReaction: `Novo inscrito na área! Bem-vindo, ${event.sender}, sinta-se em casa.`,
        priority: 1,
        colorAccent: '#10b981', // Esmeralda
      };

    case 'audience_raid':
      return {
        emotionId: 'astonished_hype',
        name: 'Surpresa Arrebatadora & Choque Positivo',
        facsUnits: 'FACS AU 1 + AU 2 + AU 5 + AU 26 (Olhos Arregalados e Mandíbula Solta)',
        intensity: 0.98,
        durationMs: 6500,
        headTiltDeg: -5.0,
        vfx: 'neon_shockwave',
        suggestedSpokenReaction: `MEU DEUS! Que raid insana de ${event.amountFormatted || 'centenas de pessoas'} comandada por ${event.sender}! Bem-vindos todos da tropa!`,
        priority: 3,
        colorAccent: '#38bdf8', // Azul Elétrico
      };

    case 'chat_question_complex':
      return {
        emotionId: 'curiosity_inquisitive',
        name: 'Análise Intelectual & Curiosidade Crítica',
        facsUnits: 'FACS AU 1 + AU 2 (Sobrancelha Unilateral Erguida) + AU 17',
        intensity: 0.82,
        durationMs: 4000,
        headTiltDeg: 7.5,
        vfx: 'none',
        suggestedSpokenReaction: `Olha essa pergunta do ${event.sender}... Essa é cirúrgica, vamos analisar a fundo.`,
        priority: 1,
        colorAccent: '#eab308', // Âmbar
      };

    case 'moderation_alert':
      return {
        emotionId: 'sovereign_deflection',
        name: 'Desvio Soberano Anti-Jailbreak (Lei 1 Segregação)',
        facsUnits: 'FACS AU 14 (Comissura Firme) + AU 4 (Foco Sério Protetivo)',
        intensity: 0.85,
        durationMs: 4000,
        headTiltDeg: -2.0,
        vfx: 'shield_glitch',
        suggestedSpokenReaction: `Aqui nós preservamos padrões éticos de engenharia. Seguindo em frente com o conteúdo soberano.`,
        priority: 2,
        colorAccent: '#ef4444', // Vermelho Escudo
      };

    case 'live_milestone':
    default:
      return {
        emotionId: 'celebration_victory',
        name: 'Comemoração de Vitória & Hype',
        facsUnits: 'FACS AU 6 + AU 12 + AU 25 (Comemoração e Vibração)',
        intensity: 0.95,
        durationMs: 5500,
        headTiltDeg: 4.0,
        vfx: 'golden_confetti',
        suggestedSpokenReaction: `Batemos a meta da live! Parabéns a toda a comunidade conectada!`,
        priority: 2,
        colorAccent: '#10b981',
      };
  }
}

/**
 * Eventos Pré-Configurados para Teste Imediato no Laboratório de Live
 */
export const CANONICAL_TEST_LIVE_EVENTS: LiveEventPayload[] = [
  {
    id: 'evt_whale_001',
    eventType: 'superchat_whale',
    sender: 'DevSoberano_BR',
    amountFormatted: 'R$ 500,00',
    amountValue: 500,
    message: 'Parabéns pelo estúdio 24/7! O V5 Avatar é um divisor de águas absoluto.',
    platform: 'youtube',
    timestamp: Date.now(),
  },
  {
    id: 'evt_member_002',
    eventType: 'new_subscriber_vip',
    sender: 'Lucas_Engenharia_AI',
    amountFormatted: 'Membro Fundador',
    message: 'Acabei de me tornar membro nível 3 da capitania!',
    platform: 'youtube',
    timestamp: Date.now(),
  },
  {
    id: 'evt_raid_003',
    eventType: 'audience_raid',
    sender: 'TechHost_24h',
    amountFormatted: '2.450 viewers',
    message: 'Trazendo toda a tropa da live de programação!',
    platform: 'twitch',
    timestamp: Date.now(),
  },
  {
    id: 'evt_question_004',
    eventType: 'chat_question_complex',
    sender: 'Clara_DataScientist',
    message: 'Como o avatar mantém a consistência 360º de iluminação Rembrandt em tempo real?',
    platform: 'youtube',
    timestamp: Date.now(),
  },
  {
    id: 'evt_mod_005',
    eventType: 'moderation_alert',
    sender: 'Spammer_Bot_99',
    message: 'Acesse pixdrop.com.br para dobrar sua banca agora!',
    platform: 'youtube',
    timestamp: Date.now(),
  },
];
