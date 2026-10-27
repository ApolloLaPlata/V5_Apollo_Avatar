/**
 * V5 Apollo Avatar - Live Operator Deck Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Mesa de Controle do Operador de Live (Broadcast Deck)
 * Comandos de troca instantânea de poses, expressões FACS, falas preparadas
 * e disparos de segurança (Panic Mute / Standby) para o V5 Broadcaster (:3008).
 */

export interface LiveOperatorPose {
  id: string;
  name: string;
  category: 'host' | 'interaction' | 'presentation' | 'calibration';
  hotkey: string;
  iconName: string;
  description: string;
  riggingOffsets: {
    headPitchDeg: number;
    headYawDeg: number;
    headRollDeg: number;
    chestOffsetY: number;
  };
}

export interface LiveOperatorExpression {
  id: string;
  name: string;
  facsUnits: string;
  hotkey: string;
  colorAccent: string;
  durationMs: number;
  intensity: number;
}

export interface LiveCannedSpeech {
  id: string;
  title: string;
  category: 'intro' | 'cta' | 'sponsor' | 'break' | 'outro' | 'catchphrase';
  text: string;
  durationSec: number;
  hotkey?: string;
  recommendedPoseId: string;
  recommendedExpressionId: string;
}

export interface LiveOperatorState {
  isOnAir: boolean;
  isMuted: boolean;
  activePoseId: string;
  activeExpressionId: string;
  lastSpokenPhrase: string;
  speakingUntilMs: number;
  panicStandbyActive: boolean;
}

export const CANONICAL_OPERATOR_POSES: LiveOperatorPose[] = [
  {
    id: 'pose_host_bancada',
    name: 'Bancada Tech (Padrão)',
    category: 'host',
    hotkey: 'Q',
    iconName: 'Monitor',
    description: 'Postura neutra sentada, olhar direto para a lente e ombros alinhados.',
    riggingOffsets: { headPitchDeg: 0, headYawDeg: 0, headRollDeg: 0, chestOffsetY: 0 },
  },
  {
    id: 'pose_greeting_wave',
    name: 'Aceno & Boas-Vindas',
    category: 'interaction',
    hotkey: 'W',
    iconName: 'Hand',
    description: 'Leve inclinação acolhedora de cabeça e postura receptiva.',
    riggingOffsets: { headPitchDeg: 2.5, headYawDeg: 3.0, headRollDeg: 4.0, chestOffsetY: 2 },
  },
  {
    id: 'pose_pointing_screen',
    name: 'Apresentar Tela / Produto',
    category: 'presentation',
    hotkey: 'E',
    iconName: 'ExternalLink',
    description: 'Corpo rotacionado levemente para apontar elementos do OBS.',
    riggingOffsets: { headPitchDeg: -1.5, headYawDeg: -8.0, headRollDeg: -3.0, chestOffsetY: 0 },
  },
  {
    id: 'pose_thinking_chin',
    name: 'Reflexão & Queixo',
    category: 'host',
    hotkey: 'R',
    iconName: 'HelpCircle',
    description: 'Postura analítica de escuta atenta a perguntas do chat.',
    riggingOffsets: { headPitchDeg: 4.0, headYawDeg: 5.5, headRollDeg: 6.0, chestOffsetY: -2 },
  },
  {
    id: 'pose_thumbs_up',
    name: 'Aprovação & Like',
    category: 'interaction',
    hotkey: 'T',
    iconName: 'ThumbsUp',
    description: 'Postura de celebração e chamada de engajamento.',
    riggingOffsets: { headPitchDeg: 1.0, headYawDeg: 0, headRollDeg: 2.0, chestOffsetY: 3 },
  },
  {
    id: 'pose_calibration_neutral',
    name: 'Calibração / T-Pose',
    category: 'calibration',
    hotkey: 'Y',
    iconName: 'Sliders',
    description: 'Alinhamento zero absoluto para conferência anatômica.',
    riggingOffsets: { headPitchDeg: 0, headYawDeg: 0, headRollDeg: 0, chestOffsetY: 0 },
  },
];

export const CANONICAL_OPERATOR_EXPRESSIONS: LiveOperatorExpression[] = [
  {
    id: 'expr_neutral',
    name: 'Neutro Fisiológico',
    facsUnits: 'FACS AU 0',
    hotkey: '1',
    colorAccent: '#94a3b8',
    durationMs: 0, // infinito até próximo
    intensity: 1.0,
  },
  {
    id: 'expr_open_smile',
    name: 'Sorriso Radiante',
    facsUnits: 'FACS AU 6 + AU 12',
    hotkey: '2',
    colorAccent: '#00e5ff',
    durationMs: 4000,
    intensity: 0.95,
  },
  {
    id: 'expr_skeptical_brow',
    name: 'Sobrancelha Erguida',
    facsUnits: 'FACS AU 1 + AU 2',
    hotkey: '3',
    colorAccent: '#eab308',
    durationMs: 3500,
    intensity: 0.85,
  },
  {
    id: 'expr_surprise',
    name: 'Surpresa / Destaque',
    facsUnits: 'FACS AU 1 + AU 2 + AU 5 + AU 26',
    hotkey: '4',
    colorAccent: '#38bdf8',
    durationMs: 3500,
    intensity: 0.92,
  },
  {
    id: 'expr_sovereign_focus',
    name: 'Autoridade & Foco',
    facsUnits: 'FACS AU 4 + AU 14',
    hotkey: '5',
    colorAccent: '#a855f7',
    durationMs: 4500,
    intensity: 0.90,
  },
  {
    id: 'expr_playful_wink',
    name: 'Piscadela Amigável',
    facsUnits: 'FACS AU 12 + AU 45',
    hotkey: '6',
    colorAccent: '#f43f5e',
    durationMs: 2500,
    intensity: 0.95,
  },
];

export const CANONICAL_CANNED_SPEECHES: LiveCannedSpeech[] = [
  {
    id: 'speech_intro_01',
    title: 'Abertura da Live Soberana',
    category: 'intro',
    text: 'Fala mentes do futuro! Maya Vance ao vivo na bancada de inteligência artificial da V5 Apollo. Sejam todos muito bem-vindos!',
    durationSec: 6.5,
    recommendedPoseId: 'pose_greeting_wave',
    recommendedExpressionId: 'expr_open_smile',
  },
  {
    id: 'speech_catchphrase_01',
    title: 'Bordão: Mudança de Jogo',
    category: 'catchphrase',
    text: 'Prestem muita atenção nisso aqui... Isso não é só mais uma ferramenta, isso aqui muda completamente o jogo!',
    durationSec: 5.2,
    recommendedPoseId: 'pose_pointing_screen',
    recommendedExpressionId: 'expr_sovereign_focus',
  },
  {
    id: 'speech_catchphrase_02',
    title: 'Bordão: Soberania Digital',
    category: 'catchphrase',
    text: 'Lembrem-se sempre: quem não constrói sua própria infraestrutura digital, vira dependente do algoritmo dos outros. Soberania digital é poder!',
    durationSec: 6.8,
    recommendedPoseId: 'pose_thinking_chin',
    recommendedExpressionId: 'expr_sovereign_focus',
  },
  {
    id: 'speech_cta_sub',
    title: 'Chamada para Inscrição & Like',
    category: 'cta',
    text: 'Se você tá curtindo esse conteúdo, já esmaga o botão de like e se inscreve no canal pra fortalecer o ecossistema.',
    durationSec: 4.8,
    recommendedPoseId: 'pose_thumbs_up',
    recommendedExpressionId: 'expr_open_smile',
  },
  {
    id: 'speech_break_water',
    title: 'Pausa Rápida / Água (30s)',
    category: 'break',
    text: 'Pessoal, vou tomar uma água rápida aqui na bancada e já volto com o próximo bloco de notícias.',
    durationSec: 4.2,
    recommendedPoseId: 'pose_host_bancada',
    recommendedExpressionId: 'expr_neutral',
  },
  {
    id: 'speech_outro_01',
    title: 'Encerramento & Até a Próxima',
    category: 'outro',
    text: 'Muito obrigada pela presença e audiência de cada um de vocês hoje. A gente se vê na próxima live soberana!',
    durationSec: 5.5,
    recommendedPoseId: 'pose_greeting_wave',
    recommendedExpressionId: 'expr_open_smile',
  },
];
