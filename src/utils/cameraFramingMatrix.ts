/**
 * V5 Apollo Avatar - Cinematic Framing Matrix
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Formal camera shot scales & aspect ratios for multi-destination video and avatar rendering
 */

export type FramingShotScale = 'extreme_close_up' | 'medium_bust' | 'medium_shot' | 'full_body';
export type AspectRatioTarget = '9:16' | '16:9' | '1:1' | '4:5';

export interface FramingPreset {
  id: FramingShotScale;
  name: string;
  shortDesc: string;
  recommendedLens: string;
  depthOfField: string;
  framingDirectives: string;
  bestForDestinations: string[];
}

export const CANONICAL_FRAMING_SHOTS: Record<FramingShotScale, FramingPreset> = {
  extreme_close_up: {
    id: 'extreme_close_up',
    name: 'Close-up Rosto / Macro',
    shortDesc: 'Enquadramento focado em olhos, textura labial e microexpressões.',
    recommendedLens: '85mm f/1.4 Prime Portrait Lens',
    depthOfField: 'Ultra Rasa (f/1.8 com bokeh suave)',
    framingDirectives: 'extreme cinematic close-up portrait, framing tightly focused on eyes, nose, and lips, razor-sharp pupil reflections, macro skin texture, creamy shallow depth of field background bokeh',
    bestForDestinations: ['V5 Auto Blog (Headshot)', 'V5 Sound (Lip-sync)', 'Thumbnails'],
  },
  medium_bust: {
    id: 'medium_bust',
    name: 'Plano Médio Busto (Apresentador)',
    shortDesc: 'Do peito ao topo da cabeça. Corte canônico para apresentadores de teleprompter.',
    recommendedLens: '50mm f/1.8 Natural Lens',
    depthOfField: 'Moderada (f/2.8 foco limpo no torso)',
    framingDirectives: 'medium close-up bust shot framing, capturing from mid-chest to top of head, classic television news and studio presenter composition, balanced headroom margin',
    bestForDestinations: ['V5 Broadcaster (Live)', 'V5 Finders (UGC Review)', 'Instagram Reels'],
  },
  medium_shot: {
    id: 'medium_shot',
    name: 'Plano Americano / Cintura',
    shortDesc: 'Da cintura para cima. Exibe gesticulação com as mãos e produtos segurados.',
    recommendedLens: '35mm f/2.0 Editorial Lens',
    depthOfField: 'Média (f/4.0 ambiente contextual)',
    framingDirectives: 'medium shot / cowboy framing from waistline to head, both hands naturally gesturing within frame, clear torso and garment structure, dynamic lifestyle camera angle',
    bestForDestinations: ['V5 Finders (Demonstração)', 'V5 Edit (Diálogos)', 'TikTok Vertical'],
  },
  full_body: {
    id: 'full_body',
    name: 'Plano Geral / Corpo Inteiro',
    shortDesc: 'Da sola dos sapatos ao topo da cabeça com sombra de contato e chão visível.',
    recommendedLens: '35mm f/2.8 Architectural Lens',
    depthOfField: 'Profunda (f/8.0 foco em todo o corpo)',
    framingDirectives: 'full-length full-body wide shot, head to shoes fully visible inside the frame without clipping, feet firmly planted with realistic ground contact shadow, clean vertical composition',
    bestForDestinations: ['V5 Prisma (Cenas de Ação)', 'Rigging T-Pose/A-Pose', 'Moda & Figurino'],
  },
};

export function compileFramingPrompt(scale: FramingShotScale, aspect: AspectRatioTarget): string {
  const preset = CANONICAL_FRAMING_SHOTS[scale];
  return `${preset.framingDirectives}, shot on ${preset.recommendedLens}, ${preset.depthOfField}, aspect ratio --ar ${aspect}`;
}
