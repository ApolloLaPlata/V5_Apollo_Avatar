/**
 * V5 Apollo Avatar - Canonical Environments Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Tabela e Compilador de Cenários e Ambientes Canônicos do Avatar.
 * Padroniza os 6 cenários oficiais da Holding V5 Apollo (Home office tech, auditório moderno,
 * estúdio escuro V5, externa urbana, podcast lounge e loft UGC) para garantir que qualquer cena
 * renderizada no V5 Prisma e editada no V5 Edit possua coerência de luz, bokeh e acústica.
 */

import { AvatarProfile } from '@/types/avatar';

export type EnvironmentCategory =
  | 'executive_tech'
  | 'indoor_studio'
  | 'keynote_stage'
  | 'outdoor_urban'
  | 'podcast_lounge'
  | 'lifestyle_loft';

export type BokehLevel = 'f/1.4 extreme blur' | 'f/1.8 cinematic bokeh' | 'f/2.8 subtle blur' | 'f/4.0 contextual';

export type TimeOfDay = 'daylight' | 'golden_hour' | 'cyber_night' | 'neutral_studio';

export interface CanonicalEnvironment {
  id: string;
  name: string;
  category: EnvironmentCategory;
  shortDescription: string;
  previewImageUrl: string;
  backgroundPrompt: string;
  lightingSetupPrompt: string;
  negativeEnvironmentPrompt: string;
  recommendedBokeh: BokehLevel;
  defaultTimeOfDay: TimeOfDay;
  colorTemperature: string;
  dominantPalette: string[];
  acousticProfile: {
    roomType: string;
    rt60DecaySeconds: number;
    recommendedReverbPreset: string;
    backgroundAmbienceAudioPrompt: string;
  };
  mobileCompositionSafeZones: {
    upperTextSafeMargin: string;
    lowerSubtitleMargin: string;
    optimalAvatarPlacement: 'center_bust' | 'rule_of_thirds_right' | 'rule_of_thirds_left';
  };
}

export interface EnvironmentPromptOptions {
  bokehLevel?: BokehLevel;
  timeOfDay?: TimeOfDay;
  addAtmosphericHaze?: boolean;
  lockCameraDepth?: boolean;
}

export const CANONICAL_ENVIRONMENTS: CanonicalEnvironment[] = [
  {
    id: 'home_office_tech',
    name: 'Home Office Tech de Elite',
    category: 'executive_tech',
    shortDescription: 'Escritório executivo minimalista de desenvolvedor/fundador com ripado de madeira acústica e monitores ultrawide desfocados.',
    previewImageUrl: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&q=80',
    backgroundPrompt:
      'background of luxurious high-end modern tech executive home office, dark walnut solid wood desk, blurred dual curved ultrawide monitors glowing with dark-mode code editor, elegant acoustic vertical wooden slat wall with hidden warm LED strip, small minimalist potted bonsai on shelving, extremely clean aesthetic',
    lightingSetupPrompt:
      '5200K clean natural white key light from 45 degrees, gentle warm backlighting from desk lamp, subtle cyan secondary edge rim light on shoulders, no harsh glare on screens',
    negativeEnvironmentPrompt:
      'messy desk, wires, cable clutter, cheap plastic furniture, bright colorful kid toys, food wrappers, dirty windows, low-resolution background',
    recommendedBokeh: 'f/1.8 cinematic bokeh',
    defaultTimeOfDay: 'daylight',
    colorTemperature: '5200K Natural White',
    dominantPalette: ['#1e1b18', '#382f2d', '#00e5ff', '#d4a373'],
    acousticProfile: {
      roomType: 'Estúdio Tratado com Ripado Acústico',
      rt60DecaySeconds: 0.18,
      recommendedReverbPreset: 'Short Dry Wooden Room (Decay 0.2s)',
      backgroundAmbienceAudioPrompt: 'Subtle high-end silent office ambient, zero hum, ultra-clean acoustic floor',
    },
    mobileCompositionSafeZones: {
      upperTextSafeMargin: '18% do topo livre para títulos e hooks dinâmicos',
      lowerSubtitleMargin: '22% da base livre para legendas automáticas',
      optimalAvatarPlacement: 'center_bust',
    },
  },
  {
    id: 'modern_auditorium',
    name: 'Auditório & Palco Keynote Futurista',
    category: 'keynote_stage',
    shortDescription: 'Palco de conferência global de tecnologia com painel LED curvo de partículas de dados em azul e arquibancada escura.',
    previewImageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    backgroundPrompt:
      'background of vast futuristic technology summit stage, massive curved LED video wall displaying subtle abstract dark cyan digital data particles, dark auditorium seats softly out of focus in the distance, stage floor with sleek glossy subtle reflection, atmospheric light beams slicing through haze',
    lightingSetupPrompt:
      'powerful stage spotlights framing character from above front, high contrast theatrical lighting, strong cool blue-cyan backlight rim outlining the silhouette, crisp face illumination',
    negativeEnvironmentPrompt:
      'empty high school gym, cheap projector screen, folding metal chairs, fluorescent flat lighting, blinding direct flare into camera lens',
    recommendedBokeh: 'f/2.8 subtle blur',
    defaultTimeOfDay: 'cyber_night',
    colorTemperature: '6000K Theatrical Cool',
    dominantPalette: ['#030712', '#0284c7', '#38bdf8', '#0ea5e9'],
    acousticProfile: {
      roomType: 'Auditório de Convenções com Sistema Line-Array',
      rt60DecaySeconds: 0.42,
      recommendedReverbPreset: 'Large Keynote Hall Reverb (Decay 0.45s, Predelay 18ms)',
      backgroundAmbienceAudioPrompt: 'Distant controlled low rumble of audience murmurs and subtle stage air circulation',
    },
    mobileCompositionSafeZones: {
      upperTextSafeMargin: '15% do topo livre para logos do evento e selo V5',
      lowerSubtitleMargin: '25% da base para terço inferior e legendas',
      optimalAvatarPlacement: 'rule_of_thirds_right',
    },
  },
  {
    id: 'dark_studio_v5',
    name: 'Dark Studio V5 Soberano',
    category: 'indoor_studio',
    shortDescription: 'Estúdio proprietário da Holding V5 Apollo com painéis pretos hexagonais, iluminação ciano 450nm e preenchimento âmbar.',
    previewImageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    backgroundPrompt:
      'background of official V5 Apollo flagship dark broadcast studio, matte obsidian acoustic soundproofing geometric panels, vertical recessed neon cyan neon light tube, dark glossy pedestal with holographic V5 logo floating faintly, absolute zero clutter, premium minimalist dark aesthetic',
    lightingSetupPrompt:
      'signature V5 multi-point studio lighting, deep cyan 450nm kicker rim light hitting left cheek and jaw, warm 3200K soft amber eye catchlight on right, pure black shadow falloff',
    negativeEnvironmentPrompt:
      'bright white walls, daylight, window, messy cables, ceiling fans, generic green screen spill, washed-out blacks',
    recommendedBokeh: 'f/1.4 extreme blur',
    defaultTimeOfDay: 'neutral_studio',
    colorTemperature: 'Dual-Color (Cyan 450nm / Amber 3200K)',
    dominantPalette: ['#020408', '#00e5ff', '#f59e0b', '#0f172a'],
    acousticProfile: {
      roomType: 'Cabine de Gravação Soberana Zero Reflexão (Dead Room)',
      rt60DecaySeconds: 0.08,
      recommendedReverbPreset: 'Anechoic Chamber Dry (Zero Early Reflections)',
      backgroundAmbienceAudioPrompt: 'Absolute digital silence, -96dB noise floor, high-fidelity vocal clarity',
    },
    mobileCompositionSafeZones: {
      upperTextSafeMargin: '20% do topo para stickers e reações de live',
      lowerSubtitleMargin: '20% da base para superchats e tickers',
      optimalAvatarPlacement: 'center_bust',
    },
  },
  {
    id: 'urban_outdoor',
    name: 'Externa Urbana Golden Hour',
    category: 'outdoor_urban',
    shortDescription: 'Avenida metropolitana contemporânea com arranha-céus espelhados, reflexos de pôr do sol e profundidade urbana.',
    previewImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    backgroundPrompt:
      'background of modern metropolitan downtown financial district, towering glass modern architectural facades reflecting golden hour sunset light, clean pedestrian boulevard blurred in background, distant blurred modern city life with elegant bokeh orbs, natural gentle evening breeze',
    lightingSetupPrompt:
      'warm golden hour direct sun skimming from rear right creating glowing hair rim light, soft large diffused daylight reflector filling the face naturally, high dynamic range exposure',
    negativeEnvironmentPrompt:
      'graffiti, dirty alleyway, trash cans, traffic jam chaos, ugly billboards, overcast gloomy sky, rain puddle glare',
    recommendedBokeh: 'f/1.8 cinematic bokeh',
    defaultTimeOfDay: 'golden_hour',
    colorTemperature: '3800K Golden Sun',
    dominantPalette: ['#f59e0b', '#ea580c', '#334155', '#e2e8f0'],
    acousticProfile: {
      roomType: 'Ambiente Aberto com Difusão Urbana Suave',
      rt60DecaySeconds: 0.12,
      recommendedReverbPreset: 'Open Air Urban Micro-Reflection (High Pass 120Hz)',
      backgroundAmbienceAudioPrompt: 'Gentle distant city hum, soft wind through glass towers, subtle distant bird chirp',
    },
    mobileCompositionSafeZones: {
      upperTextSafeMargin: '16% do topo para menção de localidade e geotag',
      lowerSubtitleMargin: '24% da base para CTA de conversão',
      optimalAvatarPlacement: 'rule_of_thirds_left',
    },
  },
  {
    id: 'podcast_lounge',
    name: 'Podcast Lounge Premium',
    category: 'podcast_lounge',
    shortDescription: 'Cenário de podcast e entrevista de alto padrão com poltronas de veludo, tijolos aparentes escuros e microfone profissional.',
    previewImageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
    backgroundPrompt:
      'background of exclusive high-end broadcast podcast studio, dark exposed loft brick wall, warm glowing Edison bulbs suspended in soft blur, premium midnight blue velvet armchair, matte black microphone boom arm with Shure SM7B slightly in foreground corner, wooden sound diffuser on the wall',
    lightingSetupPrompt:
      'warm moody intimate lighting, soft diffused china ball light overhead, gentle amber backglow, subtle tungsten color contrast',
    negativeEnvironmentPrompt:
      'cheap plastic mic stand, messy XLR cables everywhere, gamer RGB chair, fluorescent schoolroom light, empty bare walls',
    recommendedBokeh: 'f/1.8 cinematic bokeh',
    defaultTimeOfDay: 'neutral_studio',
    colorTemperature: '3200K Warm Tungsten',
    dominantPalette: ['#1c1917', '#78350f', '#b45309', '#1e293b'],
    acousticProfile: {
      roomType: 'Estúdio de Broadcast Broadcast com Difusor QRD',
      rt60DecaySeconds: 0.14,
      recommendedReverbPreset: 'Broadcast Vocal Studio (Decay 0.15s, Warm Low-End)',
      backgroundAmbienceAudioPrompt: 'Rich proximity-effect warmth, clean condenser mic response, zero environmental noise',
    },
    mobileCompositionSafeZones: {
      upperTextSafeMargin: '18% do topo para episódio e nome do convidado',
      lowerSubtitleMargin: '22% da base para citações transcritas',
      optimalAvatarPlacement: 'center_bust',
    },
  },
  {
    id: 'lifestyle_loft',
    name: 'Loft Criador Minimalista (UGC)',
    category: 'lifestyle_loft',
    shortDescription: 'Apartamento escandinavo iluminado com luz do sol matinal, plantas orgânicas e estética acolhedora para produtos UGC.',
    previewImageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    backgroundPrompt:
      'background of bright scandinavian modern aesthetic apartment loft, huge floor-to-ceiling clean window letting in soft diffused daylight, light blonde oak hardwood floors, a lush green monstera deliciosa plant in ceramic pot softly blurred, minimalist neutral beige linen sofa, spotless inviting lifestyle space',
    lightingSetupPrompt:
      'pure natural morning window light illuminating scene from side, large white bounce fill creating soft luminous skin tones, delicate organic shadows, welcoming authentic creator vibe',
    negativeEnvironmentPrompt:
      'cluttered room, unmade bed, clothes on floor, dark dingy corner, distorted window glass, cheap synthetic curtains',
    recommendedBokeh: 'f/2.8 subtle blur',
    defaultTimeOfDay: 'daylight',
    colorTemperature: '5400K Natural Daylight',
    dominantPalette: ['#f8fafc', '#e2e8f0', '#15803d', '#a1a1aa'],
    acousticProfile: {
      roomType: 'Sala Residencial com Cortinas Pesadas e Tapete',
      rt60DecaySeconds: 0.28,
      recommendedReverbPreset: 'Natural Domestic Living Room (Decay 0.3s)',
      backgroundAmbienceAudioPrompt: 'Pleasant gentle morning breeze outside window, absolute peaceful domestic quiet',
    },
    mobileCompositionSafeZones: {
      upperTextSafeMargin: '15% do topo para unboxing badge ou tag do produto',
      lowerSubtitleMargin: '25% da base para cupom e link de compra',
      optimalAvatarPlacement: 'center_bust',
    },
  },
];

/**
 * Compila o prompt final de ambiente combinando a identidade do Avatar com o cenário selecionado
 */
export function compileEnvironmentPrompt(
  environment: CanonicalEnvironment,
  avatar?: AvatarProfile,
  options: EnvironmentPromptOptions = {}
): string {
  const avatarName = avatar?.name || 'Maya Vance';
  const triggerWord = avatar
    ? `v5_${avatar.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_person`
    : 'v5_maya_vance_person';

  const bokeh = options.bokehLevel || environment.recommendedBokeh;
  const time = options.timeOfDay || environment.defaultTimeOfDay;

  let timePrompt = '';
  switch (time) {
    case 'golden_hour':
      timePrompt = 'golden hour sunset atmospheric lighting with warm directional rays';
      break;
    case 'cyber_night':
      timePrompt = 'night atmospheric scene with luminescent neon highlights';
      break;
    case 'daylight':
      timePrompt = 'crisp morning natural daylight ambience';
      break;
    default:
      timePrompt = 'controlled balanced studio lighting';
  }

  const parts = [
    `cinematic scene featuring [${triggerWord}], ${avatarName}`,
    `shot on location in (${environment.backgroundPrompt}:1.15)`,
    `lighting: (${environment.lightingSetupPrompt}:1.2), ${timePrompt}`,
    `lens aperture: ${bokeh}, clean subject isolation, razor-sharp focus on facial features`,
    `composition: 9:16 vertical framing, mobile safe margins respected`,
    options.addAtmosphericHaze ? 'subtle volumetric cinematic haze in background' : '',
    '8k uhd photorealistic, masterwork cinematic still',
  ].filter(Boolean);

  return parts.join(', ');
}

/**
 * Exporta o catálogo completo de cenários canônicos como JSON
 */
export function exportEnvironmentsCatalogJson(environments: CanonicalEnvironment[] = CANONICAL_ENVIRONMENTS): void {
  const payload = {
    schemaVersion: 'v5apollo.environments.v1.0',
    holding: 'Holding V5 Apollo',
    captaincy: 'Capitania #12 (V5 Apollo Avatar)',
    pairedCaptaincies: ['Capitania #01 (V5 Prisma)', 'Capitania #02 (V5 Edit Web)', 'Capitania #03 (V5 Sound)'],
    totalEnvironments: environments.length,
    environments,
    exportedAt: new Date().toISOString(),
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `v5_canonical_environments_catalog.v5environments.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
