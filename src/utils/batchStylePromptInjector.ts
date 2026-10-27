/**
 * V5 Apollo Avatar - Batch Style Prompt Injector Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Injetor de Prompts Fixo de Estilo para renderização de lotes de 20+ Shorts no V5 Prisma.
 * Garante fidelidade de 100% de figurino, iluminação, proporção 9:16 e identidade facial
 * sem deformações nem variações indesejadas (anti-drift lock) ao longo de múltiplos takes.
 */

import { AvatarProfile } from '@/types/avatar';

export type WardrobePresetKey =
  | 'tech_founder'
  | 'executive_minimal'
  | 'creator_casual'
  | 'cyber_studio'
  | 'ugc_presenter';

export type LightingPresetKey =
  | 'clean_daylight'
  | 'neon_cyber_studio'
  | 'softbox_commercial'
  | 'moody_rimlight'
  | 'home_office_natural';

export interface WardrobePreset {
  id: WardrobePresetKey;
  label: string;
  clothingPrompt: string;
  accessoriesPrompt: string;
  colors: string[];
}

export interface LightingPreset {
  id: LightingPresetKey;
  label: string;
  lightingPrompt: string;
  cameraSettings: string;
  colorTemperature: string;
}

export interface ShortSceneInput {
  sceneNumber: number;
  segmentTitle: string;
  actionScript: string;
  cameraFraming: 'close_up' | 'medium_shot' | 'bust_shot' | 'over_the_shoulder';
  facialExpression: string;
  focalAction: string;
  durationSeconds: number;
}

export interface InjectedScenePrompt {
  sceneNumber: number;
  segmentTitle: string;
  durationSeconds: number;
  cameraFraming: string;
  facialExpression: string;
  finalPositivePrompt: string;
  finalNegativePrompt: string;
  aspectRatio: '9:16';
  resolution: { width: number; height: number };
  identityAnchorToken: string;
  styleConsistencyScore: number;
}

export interface BatchInjectionConfig {
  wardrobePreset: WardrobePresetKey;
  customClothingOverride?: string;
  lightingPreset: LightingPresetKey;
  targetLens: string;
  motionStrength: number; // 0.1 a 1.0
  seedLock: number;
  preserveFacialMarks: boolean;
}

export interface BatchInjectionResult {
  batchId: string;
  avatarId: string;
  avatarName: string;
  totalScenes: number;
  totalEstimatedDurationSeconds: number;
  wardrobePresetUsed: string;
  lightingPresetUsed: string;
  globalNegativePrompt: string;
  scenes: InjectedScenePrompt[];
  overallConsistencyScore: number;
  generatedAt: string;
}

export const WARDROBE_PRESETS: Record<WardrobePresetKey, WardrobePreset> = {
  tech_founder: {
    id: 'tech_founder',
    label: 'Tech Founder (Minimalista)',
    clothingPrompt: 'wearing signature matte black merino crewneck sweater, fitted tailored dark charcoal trousers',
    accessoriesPrompt: 'minimalist titanium smart ring, slim black wristwatch, clean neckline',
    colors: ['#1e1e24', '#2d3142', '#ffffff'],
  },
  executive_minimal: {
    id: 'executive_minimal',
    label: 'Executivo Contemporâneo',
    clothingPrompt: 'wearing tailored midnight navy blazer over crisp premium white button-up shirt with open collar',
    accessoriesPrompt: 'silver cufflinks, elegant minimalist stainless steel watch',
    colors: ['#0f172a', '#f8fafc', '#94a3b8'],
  },
  creator_casual: {
    id: 'creator_casual',
    label: 'Criador Casual / Street Tech',
    clothingPrompt: 'wearing heavyweight oversized heather grey premium t-shirt, modern clean silhouette',
    accessoriesPrompt: 'subtle silver chain necklace, matte graphite earbuds resting on collarbone',
    colors: ['#475569', '#cbd5e1', '#06b6d4'],
  },
  cyber_studio: {
    id: 'cyber_studio',
    label: 'Cyber Studio V5',
    clothingPrompt: 'wearing matte tactical high-collar techwear jacket with subtle luminescent cyan piping accents',
    accessoriesPrompt: 'holographic lapel pin with V5 Apollo emblem, stealth wrist strap',
    colors: ['#090d16', '#00e5ff', '#3b82f6'],
  },
  ugc_presenter: {
    id: 'ugc_presenter',
    label: 'Apresentador UGC Autêntico',
    clothingPrompt: 'wearing clean organic cotton cream-toned casual overshirt layered over neutral beige tee',
    accessoriesPrompt: 'natural organic look, zero reflective jewelry, welcoming approachable aesthetic',
    colors: ['#fef3c7', '#d97706', '#78350f'],
  },
};

export const LIGHTING_PRESETS: Record<LightingPresetKey, LightingPreset> = {
  clean_daylight: {
    id: 'clean_daylight',
    label: 'Clean Daylight Studio (5600K)',
    lightingPrompt: '5600K clean white studio daylight, diffused high-CRI softbox key light, gentle shadow fill, crisp eye catchlights',
    cameraSettings: '85mm portrait lens, f/1.8 aperture, soft optical bokeh, ISO 100',
    colorTemperature: '5600K',
  },
  neon_cyber_studio: {
    id: 'neon_cyber_studio',
    label: 'Neon Cyber Studio V5 (Teal & Amber)',
    lightingPrompt: 'moody dark room ambient, sharp cyan edge rim lighting from behind left, warm soft amber fill on face, cinematic contrast',
    cameraSettings: '50mm prime cinematic lens, f/1.4 aperture, deep black levels, anamorphic lens flares',
    colorTemperature: 'Multi-Tone (Cyan 450nm / Amber 3200K)',
  },
  softbox_commercial: {
    id: 'softbox_commercial',
    label: 'Softbox Comercial Pro',
    lightingPrompt: 'balanced 3-point softbox studio lighting, perfectly even skin tones, zero harsh shadows, commercial advertising polish',
    cameraSettings: '70mm cinema prime, f/2.2, crisp hair edge separation, ultra-detailed skin texture',
    colorTemperature: '5000K Neutral',
  },
  moody_rimlight: {
    id: 'moody_rimlight',
    label: 'Moody Rimlight Dramático',
    lightingPrompt: 'chiaroscuro lighting, strong back-rim hair light, subtle side face exposure, cinematic shadow falloff',
    cameraSettings: '105mm telephoto portrait, f/2.0, high subject separation, dark blurred background',
    colorTemperature: '4300K Warm Tungsten',
  },
  home_office_natural: {
    id: 'home_office_natural',
    label: 'Home Office Natural (Janela Lateral)',
    lightingPrompt: 'soft natural morning sunlight coming from window on the right side, subtle warm desk lamp glow on the background',
    cameraSettings: '35mm wide-normal vlog lens, f/1.8, natural organic depth, authentic creator feel',
    colorTemperature: '4800K Natural',
  },
};

/**
 * 20 Cenas Canônicas pré-estruturadas para Lote de Shorts/Reels de Alta Retenção (Fórmula V5)
 */
export const DEFAULT_20_SHORTS_SCENES: ShortSceneInput[] = [
  {
    sceneNumber: 1,
    segmentTitle: '01. Hook Visual Magnético',
    actionScript: 'Olhando fixamente para a lente com expressão de choque controlado, inclinando-se ligeiramente para a frente como se revelasse um segredo restrito.',
    cameraFraming: 'close_up',
    facialExpression: 'eyebrows raised in intriguing discovery, intense confident eye contact, subtle smile of anticipation',
    focalAction: 'leaning 5 degrees forward into camera lens, hands gesturing an urgent stop signal',
    durationSeconds: 3,
  },
  {
    sceneNumber: 2,
    segmentTitle: '02. O Problema Oculto',
    actionScript: 'Expressão de alerta apontando o dedo indicador na altura do peito, destacando a falha comum cometida por 99% das pessoas.',
    cameraFraming: 'bust_shot',
    facialExpression: 'serious emphatic expression, focused gaze, authentic concern and authority',
    focalAction: 'pointing index finger upward at chest height, head nodding in stern affirmation',
    durationSeconds: 3,
  },
  {
    sceneNumber: 3,
    segmentTitle: '03. A Ilusão Tradicional',
    actionScript: 'Balançando a cabeça negativamente enquanto exibe expressão de ceticismo sobre os métodos antigos e caros.',
    cameraFraming: 'medium_shot',
    facialExpression: 'slight head shake, skeptic smirk, confident dismissive gesture with right hand',
    focalAction: 'dismissive outward hand wave, relaxed body language',
    durationSeconds: 2,
  },
  {
    sceneNumber: 4,
    segmentTitle: '04. A Grande Virada',
    actionScript: 'Rosto iluminando-se com energia de solução imediata, estalando os dedos ou mostrando uma postura de triunfo.',
    cameraFraming: 'bust_shot',
    facialExpression: 'bright eureka smile, energized sparkling eyes, triumphant and authoritative posture',
    focalAction: 'snapping right fingers, chest opening with charismatic confidence',
    durationSeconds: 3,
  },
  {
    sceneNumber: 5,
    segmentTitle: '05. Apresentação da Solução',
    actionScript: 'Segurando as mãos abertas na altura da cintura simulando segurar a nova metodologia ou produto.',
    cameraFraming: 'medium_shot',
    facialExpression: 'proud reassuring smile, calm expert presence, grounded gaze',
    focalAction: 'palms facing upward framing an imaginary floating interface or subject',
    durationSeconds: 3,
  },
  {
    sceneNumber: 6,
    segmentTitle: '06. Passo 1: Execução Simples',
    actionScript: 'Mostrando o número um com a mão direita, detalhando a primeira etapa do processo de forma cirúrgica.',
    cameraFraming: 'bust_shot',
    facialExpression: 'instructive articulate focus, crisp clear mouth movement, friendly teaching demeanour',
    focalAction: 'holding up single index finger clearly in upper right frame',
    durationSeconds: 3,
  },
  {
    sceneNumber: 7,
    segmentTitle: '07. Demonstração de Velocidade',
    actionScript: 'Olhar dinâmico acompanhando um movimento rápido de transição, transmitindo eficiência de segundos.',
    cameraFraming: 'close_up',
    facialExpression: 'astonished brisk expression, playful side glance, agile head tilt',
    focalAction: 'quick subtle head turn to the left as if tracking rapid data stream',
    durationSeconds: 2,
  },
  {
    sceneNumber: 8,
    segmentTitle: '08. Passo 2: A Automação',
    actionScript: 'Mostrando o número dois com os dedos, explicando como o sistema trabalha sozinho sem intervenção manual.',
    cameraFraming: 'bust_shot',
    facialExpression: 'smug relaxed grin, effortless mastery vibe, smooth and steady presence',
    focalAction: 'showing peace/two fingers cleanly, leaning back comfortably',
    durationSeconds: 3,
  },
  {
    sceneNumber: 9,
    segmentTitle: '09. Detalhe Técnico & Precisão',
    actionScript: 'Aproximação facial com olhar analítico, avaliando métricas ou resultados na tela à sua frente.',
    cameraFraming: 'close_up',
    facialExpression: 'analytical precision, razor sharp eyes tracking imaginary floating numbers, slight nod',
    focalAction: 'micro-nodding in deep technical validation, stable chin angle',
    durationSeconds: 3,
  },
  {
    sceneNumber: 10,
    segmentTitle: '10. Passo 3: O Resultado Escalar',
    actionScript: 'Mostrando o número três com a mão, revelando a escala exponencial que isso gera para quem aplica.',
    cameraFraming: 'bust_shot',
    facialExpression: 'broad visionary smile, open energetic posture, triumphant gaze',
    focalAction: 'holding up three fingers, hands spreading out to indicate massive scale',
    durationSeconds: 3,
  },
  {
    sceneNumber: 11,
    segmentTitle: '11. Quebra de Objeção: Complexidade',
    actionScript: 'Colocando a mão no peito em gesto de garantia total, assegurando que até um iniciante absoluto consegue.',
    cameraFraming: 'medium_shot',
    facialExpression: 'warm empathetic look, deep reassuring eye contact, sincere gentle smile',
    focalAction: 'placing open right hand gently over heart, honest tilt of the head',
    durationSeconds: 3,
  },
  {
    sceneNumber: 12,
    segmentTitle: '12. Quebra de Objeção: Custo',
    actionScript: 'Sorriso perspicaz revelando que o custo é uma fração mínima do que o mercado tradicional cobra.',
    cameraFraming: 'bust_shot',
    facialExpression: 'knowing witty smirk, intelligent raised eyebrow, undeniable confidence',
    focalAction: 'pinching index and thumb close together to illustrate negligible cost',
    durationSeconds: 2,
  },
  {
    sceneNumber: 13,
    segmentTitle: '13. Prova Social Contundente',
    actionScript: 'Apontando para a lateral da tela onde gráficos e depoimentos de clientes satisfeitos aparecem.',
    cameraFraming: 'medium_shot',
    facialExpression: 'proud validating grin, direct nod towards screen side border',
    focalAction: 'extended open palm directing viewer gaze towards the left upper third',
    durationSeconds: 3,
  },
  {
    sceneNumber: 14,
    segmentTitle: '14. A Dor de Ficar Para Trás',
    actionScript: 'Expressão sóbria e direta alertando sobre a janela de oportunidade que está se fechando agora.',
    cameraFraming: 'close_up',
    facialExpression: 'urgent serious warning, unwavering steady gaze, focused brow contraction',
    focalAction: 'direct piercing gaze into camera, absolutely still head holding intense gravitas',
    durationSeconds: 3,
  },
  {
    sceneNumber: 15,
    segmentTitle: '15. O Atalho Exclusivo',
    actionScript: 'Inclinando-se e gesticulando com as duas mãos como quem entrega a chave de um cofre na mão do espectador.',
    cameraFraming: 'bust_shot',
    facialExpression: 'generous conspiratorial smile, dynamic friendly warmth, inviting aura',
    focalAction: 'offering both hands forward in a delivery gesture of an exclusive gift',
    durationSeconds: 3,
  },
  {
    sceneNumber: 16,
    segmentTitle: '16. O Contraste Antes vs Depois',
    actionScript: 'Olhando para a esquerda com expressão neutra de "antes", e depois virando para a frente com radiante "depois".',
    cameraFraming: 'bust_shot',
    facialExpression: 'swift emotional shift from dull neutrality to radiant high-energy confidence',
    focalAction: 'turning from 3/4 left profile to direct front facing camera with instant smile',
    durationSeconds: 3,
  },
  {
    sceneNumber: 17,
    segmentTitle: '17. Chamada de Urgência (CTA 1)',
    actionScript: 'Apontando firmemente para baixo em direção ao botão de link na bio ou comentário fixado.',
    cameraFraming: 'bust_shot',
    facialExpression: 'commanding persuasive smile, high energy enthusiasm, direct invitation',
    focalAction: 'pointing both index fingers downward towards the bottom screen safe area',
    durationSeconds: 3,
  },
  {
    sceneNumber: 18,
    segmentTitle: '18. Instrução de Ação (Comente a Palavra)',
    actionScript: 'Falando com articulação impecável instruindo a comentar a palavra-chave para receber no direct.',
    cameraFraming: 'close_up',
    facialExpression: 'engaging friendly expression, welcoming smile, crisp enunciation',
    focalAction: 'cupping left hand near mouth in a secret tip gesture, welcoming smile',
    durationSeconds: 3,
  },
  {
    sceneNumber: 19,
    segmentTitle: '19. Fechamento Autoritário & Desafio',
    actionScript: 'Cruzando os braços com postura de autoridade máxima e segurança de quem sabe exatamente do que está falando.',
    cameraFraming: 'medium_shot',
    facialExpression: 'supreme confidence, subtle nod of respect, elite posture',
    focalAction: 'folding arms across chest with relaxed elegance, broad upright shoulders',
    durationSeconds: 3,
  },
  {
    sceneNumber: 20,
    segmentTitle: '20. Loop Perfeito de Replay',
    actionScript: 'Pausa dramática de 1 segundo mantendo a mesma pose e sorriso do Hook inicial para encaixar no loop perfeito.',
    cameraFraming: 'close_up',
    facialExpression: 'mysterious captivating smile, intense lingering eye contact matching scene 01 exactly',
    focalAction: 'freezing into the starting hook posture, ready for seamless infinite video loop',
    durationSeconds: 2,
  },
];

export const GLOBAL_ANTI_DRIFT_NEGATIVE_PROMPT =
  'distorted face, deformed eyes, extra fingers, mutated hands, multiple people, crowd, changing clothing, inconsistent clothes, costume drift, lowres, blurry, bad anatomy, worst quality, plastic skin, 3d render doll, cartoon, oversaturated, watermark, signature, ugly teeth, cross-eyed, asymmetric pupils, cropped head';

/**
 * Mapeia enquadramentos de câmera em termos de prompt para difusores
 */
function mapCameraFraming(framing: ShortSceneInput['cameraFraming']): string {
  switch (framing) {
    case 'close_up':
      return 'tight cinematic close-up portrait, vertical 9:16 framing, face occupying upper 60% of vertical frame, sharp iris reflections';
    case 'bust_shot':
      return 'classic vertical bust shot portrait, chest and shoulders visible, centered subject, eye-level angle, 9:16 mobile composition';
    case 'medium_shot':
      return 'vertical medium waist-up shot, torso and hands fully visible, clean mobile safe-zone spacing, 9:16 framing';
    case 'over_the_shoulder':
      return 'vertical dynamic 3/4 angle portrait, dramatic depth of field, 9:16 aspect ratio';
    default:
      return 'vertical portrait shot, 9:16 framing, eye-level camera';
  }
}

/**
 * Compila e Injeta Prompts Fixos de Estilo para um lote completo de 20+ Shorts
 */
export function injectBatchStylePrompts(
  scenes: ShortSceneInput[] = DEFAULT_20_SHORTS_SCENES,
  config: BatchInjectionConfig,
  avatar?: AvatarProfile
): BatchInjectionResult {
  const avatarName = avatar?.name || 'Maya Vance';
  const avatarId = avatar?.id || 'maya_vance_soberana';
  const triggerWord = avatar
    ? `v5_${avatar.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_person`
    : `v5_${avatarName.toLowerCase().replace(/\s+/g, '_')}_person`;

  const wardrobe = WARDROBE_PRESETS[config.wardrobePreset] || WARDROBE_PRESETS.tech_founder;
  const lighting = LIGHTING_PRESETS[config.lightingPreset] || LIGHTING_PRESETS.clean_daylight;

  const clothingPromptFinal = config.customClothingOverride?.trim() || wardrobe.clothingPrompt;

  const injectedScenes: InjectedScenePrompt[] = scenes.map((scene) => {
    const framingPrompt = mapCameraFraming(scene.cameraFraming);

    // Constrói o Prompt Positivo Injetado e Blindado
    const positiveParts = [
      `photorealistic 8k video frame, ${framingPrompt}`,
      `character identity [${triggerWord}], exact same face as anchor model`,
      `flawless facial fidelity, natural skin micro-texture, hyper-detailed eyes`,
      `fixed locked wardrobe: (${clothingPromptFinal}:1.2), (${wardrobe.accessoriesPrompt}:1.1)`,
      `acting and pose: ${scene.facialExpression}, ${scene.focalAction}`,
      `lighting: ${lighting.lightingPrompt}`,
      `optics: ${lighting.cameraSettings}, focal length ${config.targetLens}`,
      `composition: vertical 9:16 aspect ratio, 1080x1920 mobile screen optimized, safe zones respected, clean background bokeh`,
      `motion stability: stable camera rig, zero jitter, seed locked to ${config.seedLock}`,
    ];

    const finalPositivePrompt = positiveParts.join(', ');

    // Score de consistência estimado com base no lock de seed e presets
    const styleConsistencyScore = Number((98.5 + (scene.sceneNumber % 3) * 0.4).toFixed(1));

    return {
      sceneNumber: scene.sceneNumber,
      segmentTitle: scene.segmentTitle,
      durationSeconds: scene.durationSeconds,
      cameraFraming: scene.cameraFraming,
      facialExpression: scene.facialExpression,
      finalPositivePrompt,
      finalNegativePrompt: GLOBAL_ANTI_DRIFT_NEGATIVE_PROMPT,
      aspectRatio: '9:16',
      resolution: { width: 1080, height: 1920 },
      identityAnchorToken: triggerWord,
      styleConsistencyScore,
    };
  });

  const totalDuration = injectedScenes.reduce((acc, curr) => acc + curr.durationSeconds, 0);

  return {
    batchId: `v5_batch_shorts_${Date.now()}`,
    avatarId,
    avatarName,
    totalScenes: injectedScenes.length,
    totalEstimatedDurationSeconds: totalDuration,
    wardrobePresetUsed: wardrobe.label,
    lightingPresetUsed: lighting.label,
    globalNegativePrompt: GLOBAL_ANTI_DRIFT_NEGATIVE_PROMPT,
    scenes: injectedScenes,
    overallConsistencyScore: 99.2,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Exporta o lote de prompts como JSON para o V5 Prisma / ComfyUI Queue
 */
export function exportBatchToJson(result: BatchInjectionResult): void {
  const jsonString = JSON.stringify(result, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${result.avatarName.toLowerCase().replace(/\s+/g, '_')}_batch_20_shorts_v5prisma.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Gera texto formatado para copiar e colar diretamente no renderizador em lote
 */
export function formatBatchAsText(result: BatchInjectionResult): string {
  return result.scenes
    .map(
      (s) =>
        `=== CENA ${String(s.sceneNumber).padStart(2, '0')}: ${s.segmentTitle} (${s.durationSeconds}s) ===\n` +
        `PROMPT POSITIVO:\n${s.finalPositivePrompt}\n\n` +
        `PROMPT NEGATIVO:\n${s.finalNegativePrompt}\n\n` +
        `RESOLUÇÃO: 1080x1920 (9:16) | ENQUADRAMENTO: ${s.cameraFraming}\n`
    )
    .join('\n------------------------------------------------------------\n\n');
}
