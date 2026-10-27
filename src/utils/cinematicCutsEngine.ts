/**
 * V5 Apollo Avatar - Cinematic Cuts & Camera Angles Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Tabela e Compilador de Cortes e Ângulos de Câmera para Edição Dinâmica de Shorts.
 * Padroniza os Jump Cuts, Punch-ins, Ângulos Holandeses e Swings de Câmera no V5 Prisma e V5 Edit Web,
 * preservando o ancoramento de olhos e evitando deformações (morphing) durante cortes rápidos.
 */

import { AvatarProfile } from '@/types/avatar';

export type CutType =
  | 'punch_in_125'
  | 'punch_in_140'
  | 'reset_bust'
  | 'dutch_tilt_reaction'
  | 'lateral_swing_15'
  | 'low_angle_authority'
  | 'over_shoulder_screen';

export interface CameraCutSpec {
  id: CutType;
  title: string;
  zoomFactor: number; // 1.0 = base bust shot
  angleDegrees: number; // 0 = frontal
  tiltDegrees: number; // 0 = eye level, + = tilt up (low angle), - = tilt down
  focalLength: string;
  recommendedDurationRange: [number, number]; // [minSeconds, maxSeconds]
  idealApplication: string;
  promptFramingModifier: string;
  cameraMovementToken: string;
  antiMorphingConstraints: string[];
  eyeLineAnchorPercentY: number; // Altura percentual fixa dos olhos na tela 9:16 (ex: 38%)
}

export interface CutSequenceItem {
  order: number;
  cutSpecId: CutType;
  sceneLabel: string;
  durationSeconds: number;
  soundCueAction: string;
  promptOverride?: string;
}

export interface CompiledCutPrompt {
  order: number;
  cutSpecId: CutType;
  title: string;
  durationSeconds: number;
  zoomFactor: number;
  focalLength: string;
  eyeLineAnchorY: number;
  morphRiskScore: number; // 0 a 100 (quanto menor, mais seguro o corte)
  positivePrompt: string;
  negativePrompt: string;
}

export interface CinematicCutPackage {
  sequenceId: string;
  avatarId: string;
  avatarName: string;
  totalCuts: number;
  totalDurationSeconds: number;
  cuts: CompiledCutPrompt[];
  overallSmoothnessIndex: number;
  exportVersion: 'v5apollo.cuts.v1.0';
  exportedAt: string;
}

export const CANONICAL_CUT_SPECS: Record<CutType, CameraCutSpec> = {
  reset_bust: {
    id: 'reset_bust',
    title: 'Plano Base: Busto Frontal Neutro (1.0x)',
    zoomFactor: 1.0,
    angleDegrees: 0,
    tiltDegrees: 0,
    focalLength: '50mm standard prime',
    recommendedDurationRange: [2.0, 3.5],
    idealApplication: 'Abertura, explicações longas de conceitos e pontos de repouso visual do espectador.',
    promptFramingModifier: 'standard vertical bust shot, centered subject, eye-level lens, balanced headroom',
    cameraMovementToken: 'locked stationary tripod, zero tilt, pure stable front framing',
    antiMorphingConstraints: [
      'Preservar proporção exata de ombros a cabeça',
      'Distância interpupilar base (100% escala)',
      'Headroom padrão de 14% no topo da tela',
    ],
    eyeLineAnchorPercentY: 38,
  },
  punch_in_125: {
    id: 'punch_in_125',
    title: 'Jump Cut Punch-In Sutil (1.25x)',
    zoomFactor: 1.25,
    angleDegrees: 0,
    tiltDegrees: 0,
    focalLength: '65mm cinema lens',
    recommendedDurationRange: [1.2, 2.4],
    idealApplication: 'Ênfase em palavras-chave secundárias, início de lista de passos e quebras sutis de ritmo.',
    promptFramingModifier: 'medium close-up portrait, 1.25x optical punch-in, collarbone to top of head, eyes pinned at 38% vertical line',
    cameraMovementToken: 'instant jump punch-in, no zoom transition blur, eye-line perfectly pinned',
    antiMorphingConstraints: [
      'Ancorar centro dos olhos exatamente na mesma coordenada Y da cena anterior',
      'Mesma intensidade de iluminação na íris',
      'Sem distorção de perspectiva focal (65mm mantido)',
    ],
    eyeLineAnchorPercentY: 38,
  },
  punch_in_140: {
    id: 'punch_in_140',
    title: 'Jump Cut Punch-In Dramático (1.40x)',
    zoomFactor: 1.4,
    angleDegrees: 0,
    tiltDegrees: 0,
    focalLength: '85mm portrait telephoto',
    recommendedDurationRange: [0.8, 1.8],
    idealApplication: 'Punchline do hook, revelação do maior segredo, números chocantes e alertas urgentes.',
    promptFramingModifier: 'tight dramatic close-up, 1.4x magnification, face dominating vertical 9:16 frame, razor sharp iris texture',
    cameraMovementToken: 'high impact jump cut, extreme subject proximity, locked optical axis',
    antiMorphingConstraints: [
      'Não ultrapassar 1.4x para evitar clipping de queixo',
      'Garantir visibilidade dos lábios para lip-sync',
      'Mesma profundidade de campo suave no fundo',
    ],
    eyeLineAnchorPercentY: 36,
  },
  lateral_swing_15: {
    id: 'lateral_swing_15',
    title: 'Corte Angular Lateral 3/4 (15º Swing)',
    zoomFactor: 1.1,
    angleDegrees: 15,
    tiltDegrees: 0,
    focalLength: '50mm prime',
    recommendedDurationRange: [1.5, 3.0],
    idealApplication: 'Transição entre problema e solução, simulação de conversa em estúdio multi-câmera.',
    promptFramingModifier: 'dynamic 3/4 left angle portrait, 15 degree subtle profile perspective, subject looking toward camera right',
    cameraMovementToken: 'instant 2-camera switcher cut, 15 degree offset axis, seamless lighting parity',
    antiMorphingConstraints: [
      'Manter assimetrias faciais canônicas (sinais, marcas e cicatrizes)',
      'Preenchimento de luz contínuo no lado oposto da face',
      'Não alterar a inclinação vertical da cabeça',
    ],
    eyeLineAnchorPercentY: 38,
  },
  dutch_tilt_reaction: {
    id: 'dutch_tilt_reaction',
    title: 'Ângulo Holandês de Tensão (Dutch 6º)',
    zoomFactor: 1.15,
    angleDegrees: 0,
    tiltDegrees: 6,
    focalLength: '45mm wide-standard',
    recommendedDurationRange: [0.8, 1.5],
    idealApplication: 'Momentos de erro comum, quebra de objeção absurda ou choque de retenção.',
    promptFramingModifier: 'subtle 6-degree dutch angle canted frame, intentional kinetic tilt, high energy reaction pose',
    cameraMovementToken: 'snappy kinetic canted cut, visual pattern interruption, stabilized subject core',
    antiMorphingConstraints: [
      'Limitar inclinação a no máximo 8 graus para não parecer amador',
      'Manter linhas de ombro coerentes',
      'Retornar ao plano frontal logo na cena seguinte',
    ],
    eyeLineAnchorPercentY: 40,
  },
  low_angle_authority: {
    id: 'low_angle_authority',
    title: 'Câmera Baixa de Autoridade (+10º Tilt Up)',
    zoomFactor: 1.05,
    angleDegrees: 0,
    tiltDegrees: 10,
    focalLength: '40mm cinema lens',
    recommendedDurationRange: [2.0, 3.5],
    idealApplication: 'Chamada para ação final (CTA), desafio executivo, promessa de garantia e fechamento do vídeo.',
    promptFramingModifier: 'authoritative low-angle perspective, camera tilted 10 degrees upward, subject looking slightly down with supreme confidence',
    cameraMovementToken: 'grounded low camera rig, upward heroic perspective, commanding posture',
    antiMorphingConstraints: [
      'Evitar distorção excessiva de queixo ou narinas',
      'Manter iluminação de olhos ativa (sem olhos escuros)',
      'Ombros largos e abertos',
    ],
    eyeLineAnchorPercentY: 32,
  },
  over_shoulder_screen: {
    id: 'over_shoulder_screen',
    title: 'Corte Contextual Sobre o Ombro (OTS)',
    zoomFactor: 1.2,
    angleDegrees: 35,
    tiltDegrees: -8,
    focalLength: '35mm wide lens',
    recommendedDurationRange: [1.5, 2.8],
    idealApplication: 'Mostrando resultados na tela do computador, smartphone ou unboxing de produto do V5 Finders.',
    promptFramingModifier: 'over-the-shoulder perspective, foreground shoulder softly blurred, avatar head turned 30 degrees pointing at in-focus subject',
    cameraMovementToken: 'OTS camera perspective, high depth layering, focus pulled to focal point',
    antiMorphingConstraints: [
      'Fidelidade da silhueta da orelha e linha do maxilar',
      'Consistência do figurino no ombro de primeiro plano',
      'Bokeh proporcional na profundidade de campo',
    ],
    eyeLineAnchorPercentY: 42,
  },
};

/**
 * Sequência Canônica Padrão de 6 Cortes Dinâmicos para Shorts Virais de 15 Segundos
 */
export const DEFAULT_SHORT_CUT_SEQUENCE: CutSequenceItem[] = [
  {
    order: 1,
    cutSpecId: 'reset_bust',
    sceneLabel: 'Hook: Chamada de Atenção',
    durationSeconds: 2.5,
    soundCueAction: 'Whoosh sutil + impacto sonoro no primeiro segundo',
  },
  {
    order: 2,
    cutSpecId: 'punch_in_140',
    sceneLabel: 'Choque: Revelação do Dado Inédito',
    durationSeconds: 1.5,
    soundCueAction: 'Glitch sonoro seco de 80ms no corte',
  },
  {
    order: 3,
    cutSpecId: 'lateral_swing_15',
    sceneLabel: 'Explicação: Método e Solução',
    durationSeconds: 3.0,
    soundCueAction: 'Bass drop suave de transição',
  },
  {
    order: 4,
    cutSpecId: 'punch_in_125',
    sceneLabel: 'Demonstração: Detalhe do Ganho',
    durationSeconds: 2.0,
    soundCueAction: 'Click de interface sonora moderna',
  },
  {
    order: 5,
    cutSpecId: 'dutch_tilt_reaction',
    sceneLabel: 'Quebra de Objeção: "Sem Complicação"',
    durationSeconds: 1.5,
    soundCueAction: 'Record scratch invertido rápido',
  },
  {
    order: 6,
    cutSpecId: 'low_angle_authority',
    sceneLabel: 'CTA Final: Comente para Acesso Imediato',
    durationSeconds: 3.5,
    soundCueAction: 'Impacto cinemático orquestral de fechamento',
  },
];

/**
 * Compila a sequência completa de cortes de câmera gerando prompts para cada tomada
 */
export function compileCutSequence(
  sequence: CutSequenceItem[] = DEFAULT_SHORT_CUT_SEQUENCE,
  avatar?: AvatarProfile
): CinematicCutPackage {
  const avatarName = avatar?.name || 'Maya Vance';
  const avatarId = avatar?.id || 'maya_vance_soberana';
  const triggerWord = avatar
    ? `v5_${avatar.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_person`
    : 'v5_maya_vance_person';

  let totalDuration = 0;

  const compiledCuts: CompiledCutPrompt[] = sequence.map((item, index) => {
    const spec = CANONICAL_CUT_SPECS[item.cutSpecId] || CANONICAL_CUT_SPECS.reset_bust;
    totalDuration += item.durationSeconds;

    // Calcula risco de morphing com base na variação em relação ao corte anterior
    let morphRisk = 1.2; // base segura
    if (index > 0) {
      const prevSpec = CANONICAL_CUT_SPECS[sequence[index - 1].cutSpecId];
      const zoomDelta = Math.abs(spec.zoomFactor - prevSpec.zoomFactor);
      const angleDelta = Math.abs(spec.angleDegrees - prevSpec.angleDegrees);
      morphRisk = Number((1.5 + zoomDelta * 4 + angleDelta * 0.15).toFixed(1));
    }

    const positivePrompt = [
      `photorealistic 8k video frame, ${spec.promptFramingModifier}`,
      `character [${triggerWord}], exact same actor face`,
      `camera physics: ${spec.cameraMovementToken}, focal length ${spec.focalLength}`,
      `eye-line pinned at ${spec.eyeLineAnchorPercentY}% vertical safe guideline`,
      `scene context: ${item.sceneLabel}`,
      `natural micro-expressions, zero facial distortion, clean depth of field`,
      `composition: 9:16 vertical smartphone format, 1080x1920`,
    ].join(', ');

    const negativePrompt = [
      'facial morphing, warping features, melting skin, changing facial geometry',
      'drifting eye level, misaligned gaze, cross-eyed, uneven pupils',
      'costume inconsistency, sudden clothes change, warped ears',
      'lowres, blurry, compression artifacts, worst quality, cartoonish',
    ].join(', ');

    return {
      order: item.order,
      cutSpecId: spec.id,
      title: spec.title,
      durationSeconds: item.durationSeconds,
      zoomFactor: spec.zoomFactor,
      focalLength: spec.focalLength,
      eyeLineAnchorY: spec.eyeLineAnchorPercentY,
      morphRiskScore: morphRisk,
      positivePrompt,
      negativePrompt,
    };
  });

  const avgRisk = Number(
    (compiledCuts.reduce((acc, c) => acc + c.morphRiskScore, 0) / compiledCuts.length).toFixed(1)
  );
  const overallSmoothnessIndex = Number((100 - avgRisk * 2).toFixed(1));

  return {
    sequenceId: `v5_cuts_seq_${Date.now()}`,
    avatarId,
    avatarName,
    totalCuts: compiledCuts.length,
    totalDurationSeconds: Number(totalDuration.toFixed(1)),
    cuts: compiledCuts,
    overallSmoothnessIndex,
    exportVersion: 'v5apollo.cuts.v1.0',
    exportedAt: new Date().toISOString(),
  };
}

/**
 * Exporta o pacote de cortes cinemáticos como JSON para o V5 Edit Web / V5 Prisma
 */
export function exportCutsSequenceJson(pkg: CinematicCutPackage): void {
  const jsonString = JSON.stringify(pkg, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${pkg.avatarName.toLowerCase().replace(/\s+/g, '_')}_cinematic_cuts_v5edit.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
