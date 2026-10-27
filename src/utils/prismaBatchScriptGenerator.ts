/**
 * V5 Apollo Avatar - Prisma Batch Script Generator Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Gerador de Batch Prompts para o V5 Prisma (Capitania #01).
 * Converte roteiros narrativos em lotes de prompts com marcadores síncronos de pose,
 * expressão facial (FACS) e enquadramento para renderização cena-a-cena sem inconsistência.
 */

import { AvatarProfile } from '@/types/avatar';

export type ScriptTemplateType = 'saas_launch' | 'ugc_product_review' | 'mindset_trend_insight';

export interface ScriptSceneMarker {
  sceneId: string;
  order: number;
  timeStartSeconds: number;
  timeEndSeconds: number;
  durationSeconds: number;
  dialogueSnippet: string;
  poseTag: string;
  poseDescription: string;
  emotionTag: string;
  emotionDescription: string;
  cameraFraming: 'close_up' | 'bust_shot' | 'medium_shot' | 'over_the_shoulder';
  energyLevel: 'high_hook' | 'serious_authority' | 'triumphant' | 'instructive' | 'urgent_cta';
}

export interface PrismaBatchScene extends ScriptSceneMarker {
  positivePrompt: string;
  negativePrompt: string;
  targetResolution: { width: number; height: number };
  loraScale: number;
  motionStrength: number;
}

export interface PrismaBatchPackage {
  batchId: string;
  avatarId: string;
  avatarName: string;
  templateUsed: string;
  totalScenes: number;
  totalDurationSeconds: number;
  wordCount: number;
  averageWpm: number;
  scenes: PrismaBatchScene[];
  globalNegativePrompt: string;
  schemaVersion: 'v5apollo.prismabatch.v1.0';
  generatedAt: string;
}

export const SCRIPT_TEMPLATES: Record<
  ScriptTemplateType,
  {
    id: ScriptTemplateType;
    title: string;
    description: string;
    rawScriptLines: Array<{
      dialogue: string;
      pose: string;
      poseDesc: string;
      emotion: string;
      emotionDesc: string;
      framing: 'close_up' | 'bust_shot' | 'medium_shot' | 'over_the_shoulder';
      energy: 'high_hook' | 'serious_authority' | 'triumphant' | 'instructive' | 'urgent_cta';
    }>;
  }
> = {
  saas_launch: {
    id: 'saas_launch',
    title: 'Lançamento de Software SaaS (B2B High Ticket)',
    description: 'Roteiro de 7 cenas focado em problema operacional, descoberta de IA e CTA de trial.',
    rawScriptLines: [
      {
        dialogue: 'Se você ainda perde 3 horas por dia gerenciando processos manuais, pare tudo agora.',
        pose: 'leaning_forward_stop',
        poseDesc: 'Inclinando-se para frente com as duas mãos em sinal de pare imediato',
        emotion: 'intense_intrigue',
        emotionDesc: 'Olhar penetrante com sobrancelhas levemente arqueadas em choque controlado',
        framing: 'close_up',
        energy: 'high_hook',
      },
      {
        dialogue: 'O maior gargalo das agências digitais não é falta de leads. É a lentidão de entrega.',
        pose: 'pointing_chest_index',
        poseDesc: 'Apontando o dedo indicador na altura do tórax com postura firme',
        emotion: 'serious_authority',
        emotionDesc: 'Expressão sóbria de autoridade incontestável e foco inabalável',
        framing: 'bust_shot',
        energy: 'serious_authority',
      },
      {
        dialogue: 'Foi exatamente por isso que nós construímos o ecossistema soberano do V5 Apollo.',
        pose: 'hands_open_chest',
        poseDesc: 'Mãos abertas na altura do peito em gesto de acolhimento e solidez',
        emotion: 'triumphant',
        emotionDesc: 'Sorriso contido de triunfo e segurança absoluta',
        framing: 'medium_shot',
        energy: 'triumphant',
      },
      {
        dialogue: 'Em menos de 10 segundos, o agente analisa, compila e entrega a arquitetura completa.',
        pose: 'holding_three_fingers',
        poseDesc: 'Gesticulando contagem ágil com as mãos ilustrando velocidade',
        emotion: 'instructive',
        emotionDesc: 'Expressão didática, articulação verbal nítida e olhos vivos',
        framing: 'bust_shot',
        energy: 'instructive',
      },
      {
        dialogue: 'Você elimina 80% do retrabalho e foca apenas no fechamento de novos clientes.',
        pose: 'nodding_validation',
        poseDesc: 'Assentindo com a cabeça em profunda validação técnica',
        emotion: 'triumphant',
        emotionDesc: 'Sorriso confiante e relaxado de quem domina o mercado',
        framing: 'bust_shot',
        energy: 'triumphant',
      },
      {
        dialogue: 'Os primeiros 50 estúdios recebem a chave de ativação vitalícia sem mensalidade.',
        pose: 'offering_secret_gift',
        poseDesc: 'Palmas para cima oferecendo uma oportunidade restrita e rara',
        emotion: 'intense_intrigue',
        emotionDesc: 'Olhar cúmplice e conspiratório como quem entrega um segredo de ouro',
        framing: 'close_up',
        energy: 'urgent_cta',
      },
      {
        dialogue: 'Toque no botão abaixo agora mesmo e garanta sua vaga antes que o lote expire.',
        pose: 'pointing_downward_double',
        poseDesc: 'Apontando os dois indicadores para a base da tela em comando claro',
        emotion: 'welcoming_smile',
        emotionDesc: 'Sorriso caloroso de boas-vindas com energia contagiante',
        framing: 'bust_shot',
        energy: 'urgent_cta',
      },
    ],
  },
  ugc_product_review: {
    id: 'ugc_product_review',
    title: 'Review UGC de Produto Físico / Afiliado',
    description: 'Roteiro de 6 cenas para produtos minerados no V5 Finders com unboxing e cupom.',
    rawScriptLines: [
      {
        dialogue: 'Eu comprei esse gadget achando que era golpe, mas ele mudou a minha rotina inteira.',
        pose: 'holding_product_palm',
        poseDesc: 'Segurando o produto na palma da mão esquerda na altura do peito',
        emotion: 'astonished_eyes',
        emotionDesc: 'Olhos arregalados em admiração genuína e sorriso de surpresa',
        framing: 'bust_shot',
        energy: 'high_hook',
      },
      {
        dialogue: 'Todos os modelos concorrentes esquentam e quebram no segundo mês de uso.',
        pose: 'skeptical_headshake',
        poseDesc: 'Balançando a cabeça negativamente com leve careta de desaprovação',
        emotion: 'skeptical_smirk',
        emotionDesc: 'Sorriso irônico de ceticismo descartando as marcas baratas',
        framing: 'close_up',
        energy: 'serious_authority',
      },
      {
        dialogue: 'Mas esse aqui possui acabamento aeroespacial e bateria para 3 semanas direto.',
        pose: 'tapping_product_detail',
        poseDesc: 'Dando leves toques na carcaça do produto demonstrando resistência',
        emotion: 'triumphant',
        emotionDesc: 'Expressão de admiração e orgulho pela descoberta',
        framing: 'bust_shot',
        energy: 'instructive',
      },
      {
        dialogue: 'Dá uma olhada de perto na precisão milimétrica desse acabamento.',
        pose: 'presenting_close_camera',
        poseDesc: 'Aproximando o produto da lente da câmera mantendo rosto focado ao fundo',
        emotion: 'intense_intrigue',
        emotionDesc: 'Olhar atento acompanhando o detalhe do produto',
        framing: 'close_up',
        energy: 'instructive',
      },
      {
        dialogue: 'O fabricante liberou 40% de desconto no link exclusivo aqui da bio.',
        pose: 'cupping_mouth_secret',
        poseDesc: 'Mão em concha na lateral da boca revelando um cupom secreto',
        emotion: 'intense_intrigue',
        emotionDesc: 'Sorriso travesso de cumplicidade com o público',
        framing: 'bust_shot',
        energy: 'urgent_cta',
      },
      {
        dialogue: 'Corre porque o estoque promocional acaba ainda hoje!',
        pose: 'urgent_pointing_down',
        poseDesc: 'Apontando para o botão de compra com postura ágil',
        emotion: 'welcoming_smile',
        emotionDesc: 'Sorriso dinâmico com urgência saudável',
        framing: 'bust_shot',
        energy: 'urgent_cta',
      },
    ],
  },
  mindset_trend_insight: {
    id: 'mindset_trend_insight',
    title: 'Insight Viral de Tendência & Mindset',
    description: 'Roteiro educativo de 5 cenas para autoridade de nicho e retenção orgânica.',
    rawScriptLines: [
      {
        dialogue: '99% das pessoas estão usando inteligência artificial do jeito completamente errado.',
        pose: 'crossing_arms_firm',
        poseDesc: 'Braços cruzados com postura inabalável de mentor sênior',
        emotion: 'serious_authority',
        emotionDesc: 'Olhar firme e direto que quebra o padrão de rolagem no feed',
        framing: 'bust_shot',
        energy: 'high_hook',
      },
      {
        dialogue: 'Elas pedem textos genéricos em vez de alimentar modelos com dados canônicos.',
        pose: 'dismissive_hand_wave',
        poseDesc: 'Gesto de descarte suave com a mão direita indicando amadorismo',
        emotion: 'skeptical_smirk',
        emotionDesc: 'Leve sorriso de quem conhece os bastidores da alta tecnologia',
        framing: 'close_up',
        energy: 'serious_authority',
      },
      {
        dialogue: 'Quem domina consistência visual e identidade de marca lidera o mercado nos próximos 10 anos.',
        pose: 'raising_index_insight',
        poseDesc: 'Levantando o dedo indicador na altura dos olhos em momento de iluminação',
        emotion: 'triumphant',
        emotionDesc: 'Olhar visionário e confiante de liderança',
        framing: 'bust_shot',
        energy: 'instructive',
      },
      {
        dialogue: 'Eu documentei a metodologia inteira num manual prático de 4 passos.',
        pose: 'holding_open_notebook',
        poseDesc: 'Mãos em concha simulando segurar o manual de estratégias',
        emotion: 'welcoming_smile',
        emotionDesc: 'Sorriso acolhedor de quem compartilha conhecimento de alto valor',
        framing: 'medium_shot',
        energy: 'instructive',
      },
      {
        dialogue: 'Comente a palavra AVATAR aqui embaixo para eu te enviar o PDF agora.',
        pose: 'pointing_double_down',
        poseDesc: 'Apontando para o campo de comentários com energia de engajamento',
        emotion: 'welcoming_smile',
        emotionDesc: 'Sorriso aberto e magnético convidando o seguidor',
        framing: 'bust_shot',
        energy: 'urgent_cta',
      },
    ],
  },
};

export const PRISMA_GLOBAL_NEGATIVE_PROMPT =
  'distorted face, extra fingers, deformed hands, unnatural mouth movements, plastic skin, 3d render look, cartoonish, low resolution, blurry eyes, costume change, mismatched background, flickering lighting, bad anatomy';

/**
 * Compila um lote de prompts a partir de um template ou linhas de roteiro personalizadas
 */
export function generatePrismaBatchPackage(
  templateType: ScriptTemplateType = 'saas_launch',
  avatar?: AvatarProfile,
  wpm: number = 140,
  environmentTag: string = 'high-end tech home office'
): PrismaBatchPackage {
  const avatarName = avatar?.name || 'Maya Vance';
  const avatarId = avatar?.id || 'maya_vance_soberana';
  const triggerWord = avatar
    ? `v5_${avatar.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_person`
    : 'v5_maya_vance_person';

  const template = SCRIPT_TEMPLATES[templateType] || SCRIPT_TEMPLATES.saas_launch;

  let currentTimestamp = 0;
  let totalWords = 0;

  const scenes: PrismaBatchScene[] = template.rawScriptLines.map((line, idx) => {
    const wordCount = line.dialogue.trim().split(/\s+/).length;
    totalWords += wordCount;

    // Estima a duração em segundos baseada em palavras por minuto (WPM)
    const rawDuration = (wordCount / wpm) * 60;
    // Duração mínima de 1.8s e arredondamento em décimos
    const durationSeconds = Math.max(1.8, Number(rawDuration.toFixed(1)));
    const timeStartSeconds = Number(currentTimestamp.toFixed(1));
    const timeEndSeconds = Number((currentTimestamp + durationSeconds).toFixed(1));
    currentTimestamp = timeEndSeconds;

    // Enquadramento de câmera e física
    let framingTerm = 'vertical bust shot portrait';
    if (line.framing === 'close_up') framingTerm = 'tight expressive close-up portrait';
    if (line.framing === 'medium_shot') framingTerm = 'medium waist-up shot showing hands';
    if (line.framing === 'over_the_shoulder') framingTerm = 'over-the-shoulder contextual shot';

    // Compilação do Prompt Positivo para o V5 Prisma / Wan 2.1 / Flux
    const positivePrompt = [
      `cinematic video frame, ${framingTerm}, 9:16 aspect ratio 1080x1920`,
      `character [${triggerWord}], ${avatarName}, consistent face identity across all scenes`,
      `acting and pose: ${line.poseDesc} (${line.pose}:1.2)`,
      `facial expression: ${line.emotionDesc} (${line.emotion}:1.15), synchronized speech visemes`,
      `speaking script dialogue line: "${line.dialogue}"`,
      `environment: (${environmentTag}:1.1), subtle background bokeh, balanced softbox studio lighting`,
      `camera physics: stable tripod mount, razor-sharp iris reflections, 8k uhd photorealistic`,
    ].join(', ');

    return {
      sceneId: `scene_${String(idx + 1).padStart(2, '0')}`,
      order: idx + 1,
      timeStartSeconds,
      timeEndSeconds,
      durationSeconds,
      dialogueSnippet: line.dialogue,
      poseTag: line.pose,
      poseDescription: line.poseDesc,
      emotionTag: line.emotion,
      emotionDescription: line.emotionDesc,
      cameraFraming: line.framing,
      energyLevel: line.energy,
      positivePrompt,
      negativePrompt: PRISMA_GLOBAL_NEGATIVE_PROMPT,
      targetResolution: { width: 1080, height: 1920 },
      loraScale: 0.85,
      motionStrength: 0.65,
    };
  });

  return {
    batchId: `v5_prisma_batch_${Date.now()}`,
    avatarId,
    avatarName,
    templateUsed: template.title,
    totalScenes: scenes.length,
    totalDurationSeconds: Number(currentTimestamp.toFixed(1)),
    wordCount: totalWords,
    averageWpm: wpm,
    scenes,
    globalNegativePrompt: PRISMA_GLOBAL_NEGATIVE_PROMPT,
    schemaVersion: 'v5apollo.prismabatch.v1.0',
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Exporta o pacote do lote para o V5 Prisma em formato JSON canônico
 */
export function exportPrismaBatchJson(pkg: PrismaBatchPackage): void {
  const jsonString = JSON.stringify(pkg, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${pkg.avatarName.toLowerCase().replace(/\s+/g, '_')}_prisma_batch_script.v5prismabatch.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formata o roteiro com marcadores de pose/expressão para uso em teleprompter ou V5 Sound
 */
export function formatScriptWithMarkers(pkg: PrismaBatchPackage): string {
  return pkg.scenes
    .map(
      (s) =>
        `[${s.sceneId.toUpperCase()} | ${s.timeStartSeconds}s - ${s.timeEndSeconds}s | ${s.cameraFraming.toUpperCase()}]\n` +
        `[POSE: ${s.poseTag}] [EMOTION: ${s.emotionTag}]\n` +
        `FALA: "${s.dialogueSnippet}"\n`
    )
    .join('\n');
}
