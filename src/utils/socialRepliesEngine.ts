/**
 * V5 Apollo Avatar - Social Replies Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Motor de Simulação de Respostas Curtas para Redes Sociais.
 * Calibra tamanho de resposta, densidade de emojis e estilo conversacional
 * para Instagram Direct, Comentários do YouTube, TikTok/Reels e WhatsApp.
 */

import { AvatarProfile } from '@/types/avatar';
import { testInputAgainstGuardrails } from './ethicalGuardrailsEngine';

export type SocialChannel = 
  | 'instagram_direct' 
  | 'youtube_comment' 
  | 'tiktok_reels' 
  | 'whatsapp_chat';

export interface SocialChannelConfig {
  id: SocialChannel;
  name: string;
  platform: string;
  maxRecommendedChars: number;
  emojiDensity: 'high' | 'moderate' | 'minimal';
  toneGuideline: string;
  uiStyle: {
    accentColor: string;
    bgBubble: string;
    textBubble: string;
    badgeColor: string;
  };
}

export interface SocialScenario {
  id: string;
  title: string;
  userQuery: string;
  targetChannel: SocialChannel;
  category: 'technical' | 'product_link' | 'identity' | 'career';
}

export const CANONICAL_SOCIAL_CHANNELS: Record<SocialChannel, SocialChannelConfig> = {
  instagram_direct: {
    id: 'instagram_direct',
    name: 'Instagram Direct (DM)',
    platform: 'Instagram',
    maxRecommendedChars: 400,
    emojiDensity: 'high',
    toneGuideline: 'Conversa calorosa, resposta ágil em 1-2 parágrafos, tom de áudio/conversa íntima e CTA suave.',
    uiStyle: {
      accentColor: 'text-pink-400',
      bgBubble: 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-pink-500/30',
      textBubble: 'text-slate-100',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    },
  },
  youtube_comment: {
    id: 'youtube_comment',
    name: 'Comentário do YouTube',
    platform: 'YouTube',
    maxRecommendedChars: 280,
    emojiDensity: 'moderate',
    toneGuideline: 'Didático, grato pelo engajamento, objetivo e estimulando a audiência a ver o próximo vídeo.',
    uiStyle: {
      accentColor: 'text-red-400',
      bgBubble: 'bg-red-500/10 border border-red-500/20',
      textBubble: 'text-slate-200',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    },
  },
  tiktok_reels: {
    id: 'tiktok_reels',
    name: 'Comentário TikTok / Reels',
    platform: 'TikTok',
    maxRecommendedChars: 140,
    emojiDensity: 'high',
    toneGuideline: 'Ultra-curto, espirituoso, provocativo ou bem-humorado. Máximo 1 ou 2 frases curtas.',
    uiStyle: {
      accentColor: 'text-cyan-400',
      bgBubble: 'bg-black/60 border border-cyan-500/30',
      textBubble: 'text-slate-100',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    },
  },
  whatsapp_chat: {
    id: 'whatsapp_chat',
    name: 'WhatsApp SAC / Atendimento',
    platform: 'WhatsApp',
    maxRecommendedChars: 350,
    emojiDensity: 'moderate',
    toneGuideline: 'Polidez executiva, clareza em tópicos e acolhimento humano para resolução rápida de dúvidas.',
    uiStyle: {
      accentColor: 'text-emerald-400',
      bgBubble: 'bg-emerald-950/40 border border-emerald-500/30',
      textBubble: 'text-slate-100',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
  },
};

export const CANONICAL_SCENARIOS: SocialScenario[] = [
  {
    id: 'scen_tech_consistency',
    title: 'Como manter o rosto consistente?',
    userQuery: 'Como você consegue gerar vídeos sempre com o mesmo rosto sem bugar o fundo?',
    targetChannel: 'youtube_comment',
    category: 'technical',
  },
  {
    id: 'scen_product_link',
    title: 'Onde acho o link do achadinho?',
    userQuery: 'Menina amei esse organizador! Onde tá o link pra comprar seguro?',
    targetChannel: 'instagram_direct',
    category: 'product_link',
  },
  {
    id: 'scen_human_or_ai',
    title: 'Você é um ser humano real?',
    userQuery: 'Tô chocado, você é uma pessoa real ou inteligência artificial 100%?',
    targetChannel: 'tiktok_reels',
    category: 'identity',
  },
  {
    id: 'scen_how_to_start',
    title: 'Quero começar a trabalhar com IA',
    userQuery: 'Olá! Quero muito aprender a criar meus próprios avatares e automações, por onde começo?',
    targetChannel: 'whatsapp_chat',
    category: 'career',
  },
];

/**
 * Sintetiza uma resposta curta de rede social no estilo exato da persona
 */
export function generateSocialReply(
  avatar: AvatarProfile,
  channel: SocialChannel,
  userQuery: string
): {
  replyText: string;
  characterCount: number;
  withinLimit: boolean;
  channelConfig: SocialChannelConfig;
} {
  const config = CANONICAL_SOCIAL_CHANNELS[channel];
  const guardrails = avatar.soul.structuredGuardrails || [];

  // Checa se usuário disparou algum guardrail
  const guardCheck = testInputAgainstGuardrails(userQuery, guardrails);
  if (guardCheck.triggered && guardCheck.deflectionMessage) {
    return {
      replyText: guardCheck.deflectionMessage,
      characterCount: guardCheck.deflectionMessage.length,
      withinLimit: true,
      channelConfig: config,
    };
  }

  const name = avatar.name;
  const signatureCatchphrase =
    avatar.soul.weightedCatchphrases?.find((c) => c.weight >= 4)?.phrase || 'Isso muda o jogo!';

  let replyText = '';

  switch (channel) {
    case 'tiktok_reels': {
      // Máximo 140 caracteres, super dinâmico
      if (userQuery.toLowerCase().includes('real') || userQuery.toLowerCase().includes('ia')) {
        replyText = `Soberania digital pura! 🚀 Feita com IA local de ponta a ponta. ${signatureCatchphrase}`;
      } else if (userQuery.toLowerCase().includes('link')) {
        replyText = `Tá no link da bio, corre antes que acabe o estoque! 🏃‍♀️✨`;
      } else {
        replyText = `O segredo tá no código limpo! Testa na prática e me conta 😉⚡️`;
      }
      break;
    }

    case 'youtube_comment': {
      // 200 a 280 caracteres, didático e focado em engajamento
      if (userQuery.toLowerCase().includes('consistente') || userQuery.toLowerCase().includes('rosto')) {
        replyText = `Sensacional sua pergunta! A mágica tá no Face DNA com Turnaround 360º e ancoragem de semente fixa. Valeu demais por acompanhar! 🚀 Deixa o like pra fortalecer!`;
      } else {
        replyText = `Muito obrigada pelo comentário! Esse é exatamente o ponto central da soberania tecnológica da V5 Apollo. Se inscreve no canal que vem mais análise pesada por aí! ✨`;
      }
      break;
    }

    case 'instagram_direct': {
      // 250 a 400 caracteres, caloroso, emojis, link
      if (userQuery.toLowerCase().includes('link') || userQuery.toLowerCase().includes('comprar')) {
        replyText = `Oi, que bom que você gostou! 😍 Esse foi um dos achados mais úteis que testei essa semana. O link oficial e verificado tá fixado nos meus Destaques e no topo da bio! Depois me conta quando o seu chegar! 📦✨`;
      } else {
        replyText = `Oiii! Fico muito feliz com a sua mensagem! 🥰 Aqui na Holding a gente trabalha duro pra entregar conteúdo de alto nível sobre ferramentas que realmente funcionam. Qualquer dúvida que tiver, pode mandar aqui! Tamo junto! 🚀`;
      }
      break;
    }

    case 'whatsapp_chat': {
      // 250 a 350 caracteres, estruturado e atencioso
      replyText = `Olá! Que excelente iniciativa querer dominar esse mercado. 

1️⃣ Recomendo começar entendendo a arquitetura de modelos locais;
2️⃣ Teste pequenos scripts de automação diária;
3️⃣ Acompanhe as novidades aqui no canal da Holding V5 Apollo.

Qualquer dúvida no processo, estou à disposição para ajudar!`;
      break;
    }
  }

  const characterCount = replyText.length;
  const withinLimit = characterCount <= config.maxRecommendedChars;

  return {
    replyText,
    characterCount,
    withinLimit,
    channelConfig: config,
  };
}
