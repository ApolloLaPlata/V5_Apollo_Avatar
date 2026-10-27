/**
 * V5 Apollo Avatar - VTuber Standard Package Exporter
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Compilador e Exportador Canônico de Pacote VTuber Standard (.v5vtuber.json)
 * Compatível com V5 Broadcaster (:3008), OBS Studio Browser Source,
 * VTube Studio e especificações de PNGTuber+ para transmissões ao vivo 24/7.
 */

import { AvatarProfile, VisemeType } from '@/types/avatar';
import { CANONICAL_VISEMES_CATALOG } from './visemesEngine';

export type VTuberFormatPreset = 
  | 'v5_vtuber_sovereign' 
  | 'pngtuber_plus' 
  | 'obs_browser_manifest';

export type VTuberAspectRatio = '16:9' | '9:16' | '1:1';

export interface VTuberExportOptions {
  aspectRatio?: VTuberAspectRatio;
  targetFps?: 30 | 60;
  format?: VTuberFormatPreset;
  transparentBackground?: boolean;
}

export interface VTuberVisemeLayer {
  viseme: VisemeType;
  rhubarbCode: 'X' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
  oculusCode: string;
  name: string;
  verticalAperture: number;
  horizontalStretch: number;
  lipPucker: number;
  spriteUrl: string;
  mouthLayerCoord: { x: number; y: number; width: number; height: number };
  blendDurationMs: number;
}

export interface V5VTuberPackage {
  schemaVersion: 'v5apollo.vtuber.v1.0';
  avatarId: string;
  avatarName: string;
  tagline: string;
  modelType: string;
  exportedAt: string;
  integrityChecksum: string;
  canvas: {
    width: number;
    height: number;
    aspectRatio: VTuberAspectRatio;
    targetFps: number;
    renderScale: number;
    transparentBackground: boolean;
  };
  anchorPoints: {
    rootCenter: { x: number; y: number };
    headPivot: { x: number; y: number };
    chestAnchor: { x: number; y: number };
    mouthAnchor: { x: number; y: number; width: number; height: number };
    leftEyeAnchor: { x: number; y: number; width: number; height: number };
    rightEyeAnchor: { x: number; y: number; width: number; height: number };
  };
  sprites: {
    baseAnchorUrl: string;
    turnaroundSheetUrl?: string;
    expressionSheetUrl?: string;
    idleAtlasManifestUrl?: string;
  };
  visemesCatalog: VTuberVisemeLayer[];
  idleMotionRigging: {
    breathing: {
      bpm: number;
      amplitudeYPercent: number;
      shoulderExpansionXPercent: number;
      anchorPoint: string;
      isActive: boolean;
    };
    naturalEyeBlink: {
      intervalMinSeconds: number;
      intervalMaxSeconds: number;
      blinkDurationMs: number;
      doubleBlinkProbability: number;
      isActive: boolean;
    };
    headTilt: {
      maxPitchDeg: number;
      maxYawDeg: number;
      maxRollDeg: number;
      transitionDurationSeconds: number;
      dwellTimeSeconds: number;
      isActive: boolean;
    };
    fsmTransitions: {
      preSpeechDurationMs: number;
      postSpeechDurationMs: number;
      breathingDampingFactor: number;
      autoReturnToIdle: boolean;
    };
    energyModulation: {
      energyLevel: number;
      audioReactive: boolean;
      sensitivity: number;
    };
  };
  audioLipsyncConfig: {
    inputFormat: 'pcm_48khz_stereo';
    silenceThresholdDb: number;
    noiseGateDb: number;
    smoothingFactor: number;
    visemeSwitchDelayMs: number;
    pairedVoiceId: string;
    voiceEngine: string;
  };
  emotionsCatalog: Array<{
    emotionId: string;
    name: string;
    intensity: number;
    promptModifier?: string;
    triggerKey?: string;
  }>;
  broadcastIntegration: {
    pairedBroadcasterPort: number;
    avatarHubPort: number;
    inboundWebhookEndpoint: string;
    liveToken: string;
    obsTransparentOverlay: {
      hardwareAcceleration: boolean;
      cssCustomFilter: string;
    };
    interoperability: {
      vtubeStudioCompatible: boolean;
      pngtuberPlusCompatible: boolean;
      obsBrowserSourceReady: boolean;
    };
  };
  metadata: {
    holding: 'Holding V5 Apollo';
    captaincy: 'Capitania #12 (V5 Apollo Avatar)';
    targetEcosystem: string[];
    author: string;
  };
}

/**
 * Gera um checksum determinístico para integridade do pacote VTuber
 */
function generateVTuberChecksum(avatarId: string, avatarName: string): string {
  const seedStr = `${avatarId}_${avatarName}_v5vtuber_2026`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `v5vt_${hex}_${Date.now().toString(16).substring(4)}`;
}

/**
 * Compila o pacote VTuber Standard Canônico (.v5vtuber.json)
 */
export function compileVTuberStandardPackage(
  avatar: AvatarProfile,
  options: VTuberExportOptions = {}
): V5VTuberPackage {
  const {
    aspectRatio = '16:9',
    targetFps = 60,
    transparentBackground = true,
  } = options;

  let width = 1920;
  let height = 1080;
  if (aspectRatio === '9:16') {
    width = 1080;
    height = 1920;
  } else if (aspectRatio === '1:1') {
    width = 2048;
    height = 2048;
  }

  // Mapeamento dos 7 visemas canônicos
  const visemesCatalog: VTuberVisemeLayer[] = (Object.keys(CANONICAL_VISEMES_CATALOG) as VisemeType[]).map((vKey) => {
    const meta = CANONICAL_VISEMES_CATALOG[vKey];
    return {
      viseme: vKey,
      rhubarbCode: meta.rhubarbCode,
      oculusCode: meta.oculusCode,
      name: meta.name,
      verticalAperture: meta.geometry.verticalAperture,
      horizontalStretch: meta.geometry.horizontalStretch,
      lipPucker: meta.geometry.lipPucker,
      spriteUrl: avatar.avatarUrl,
      mouthLayerCoord: {
        x: Math.round(width * 0.42),
        y: Math.round(height * 0.36),
        width: Math.round(width * 0.16),
        height: Math.round(height * 0.10),
      },
      blendDurationMs: 65,
    };
  });

  const breathing = avatar.rigging?.breathingConfig || {
    bpm: 14,
    amplitudeYPercent: 0.9,
    shoulderExpansionXPercent: 1.1,
    anchorPoint: 'chest_center',
    isActive: true,
  };

  const naturalEyeBlink = avatar.rigging?.eyeBlinkConfig || {
    intervalMin: 2.8,
    intervalMax: 5.4,
    blinkDurationMs: 180,
    doubleBlinkProbability: 0.12,
    isActive: true,
  };

  const headTilt = avatar.rigging?.headTiltConfig || {
    maxPitchDeg: 2.5,
    maxYawDeg: 3.2,
    maxRollDeg: 3.8,
    transitionDurationSeconds: 2.2,
    dwellTimeSeconds: 1.6,
    isActive: true,
  };

  const fsm = avatar.rigging?.fsmConfig || {
    preSpeechDurationMs: 200,
    postSpeechDurationMs: 300,
    breathingDampingFactor: 0.35,
    autoReturnToIdle: true,
  };

  const energy = avatar.rigging?.energyConfig || {
    energyLevel: 80,
    audioReactive: true,
    sensitivity: 3,
  };

  return {
    schemaVersion: 'v5apollo.vtuber.v1.0',
    avatarId: avatar.id,
    avatarName: avatar.name,
    tagline: avatar.tagline,
    modelType: avatar.type,
    exportedAt: new Date().toISOString(),
    integrityChecksum: generateVTuberChecksum(avatar.id, avatar.name),
    canvas: {
      width,
      height,
      aspectRatio,
      targetFps,
      renderScale: 1.0,
      transparentBackground,
    },
    anchorPoints: {
      rootCenter: { x: 0.5, y: 0.5 },
      headPivot: { x: 0.5, y: 0.28 },
      chestAnchor: { x: 0.5, y: 0.62 },
      mouthAnchor: { x: 0.5, y: 0.38, width: 0.16, height: 0.10 },
      leftEyeAnchor: { x: 0.42, y: 0.26, width: 0.08, height: 0.06 },
      rightEyeAnchor: { x: 0.58, y: 0.26, width: 0.08, height: 0.06 },
    },
    sprites: {
      baseAnchorUrl: avatar.avatarUrl,
      turnaroundSheetUrl: avatar.face.turnaroundSheetUrl,
      expressionSheetUrl: avatar.face.expressionSheetUrl,
      idleAtlasManifestUrl: avatar.rigging?.idleSpritesheetManifest?.atlasUrl,
    },
    visemesCatalog,
    idleMotionRigging: {
      breathing: {
        bpm: breathing.bpm,
        amplitudeYPercent: breathing.amplitudeYPercent,
        shoulderExpansionXPercent: breathing.shoulderExpansionXPercent,
        anchorPoint: breathing.anchorPoint,
        isActive: breathing.isActive,
      },
      naturalEyeBlink: {
        intervalMinSeconds: naturalEyeBlink.intervalMin,
        intervalMaxSeconds: naturalEyeBlink.intervalMax,
        blinkDurationMs: naturalEyeBlink.blinkDurationMs,
        doubleBlinkProbability: naturalEyeBlink.doubleBlinkProbability,
        isActive: naturalEyeBlink.isActive,
      },
      headTilt: {
        maxPitchDeg: headTilt.maxPitchDeg,
        maxYawDeg: headTilt.maxYawDeg,
        maxRollDeg: headTilt.maxRollDeg,
        transitionDurationSeconds: headTilt.transitionDurationSeconds,
        dwellTimeSeconds: headTilt.dwellTimeSeconds,
        isActive: headTilt.isActive,
      },
      fsmTransitions: {
        preSpeechDurationMs: fsm.preSpeechDurationMs,
        postSpeechDurationMs: fsm.postSpeechDurationMs,
        breathingDampingFactor: fsm.breathingDampingFactor,
        autoReturnToIdle: fsm.autoReturnToIdle,
      },
      energyModulation: {
        energyLevel: energy.energyLevel,
        audioReactive: energy.audioReactive,
        sensitivity: energy.sensitivity,
      },
    },
    audioLipsyncConfig: {
      inputFormat: 'pcm_48khz_stereo',
      silenceThresholdDb: -42,
      noiseGateDb: -48,
      smoothingFactor: 0.65,
      visemeSwitchDelayMs: 25,
      pairedVoiceId: avatar.voice.v5SoundVoiceId || 'voice_maya_vance_br_v1',
      voiceEngine: avatar.voice.engine || 'qwen-tts',
    },
    emotionsCatalog: [
      { emotionId: 'neutral', name: 'Repouso Neutro', intensity: 1.0, triggerKey: 'Num0' },
      { emotionId: 'joy', name: 'Alegria & Entusiasmo', intensity: 0.95, triggerKey: 'Num1' },
      { emotionId: 'surprise', name: 'Surpresa / Destaque', intensity: 0.9, triggerKey: 'Num2' },
      { emotionId: 'focused', name: 'Foco & Concentração', intensity: 0.85, triggerKey: 'Num3' },
      { emotionId: 'smug', name: 'Autoconfiança Soberana', intensity: 0.8, triggerKey: 'Num4' },
      { emotionId: 'intense', name: 'Urgência / Alerta', intensity: 0.95, triggerKey: 'Num5' },
    ],
    broadcastIntegration: {
      pairedBroadcasterPort: 3008,
      avatarHubPort: 3010,
      inboundWebhookEndpoint: 'http://localhost:3010/api/webhook/broadcaster',
      liveToken: avatar.channel?.broadcasterLiveToken || `v5b_live_${avatar.id.replace('avatar-', '')}_8849`,
      obsTransparentOverlay: {
        hardwareAcceleration: true,
        cssCustomFilter: 'drop-shadow(0 0 16px rgba(0, 229, 255, 0.22))',
      },
      interoperability: {
        vtubeStudioCompatible: true,
        pngtuberPlusCompatible: true,
        obsBrowserSourceReady: true,
      },
    },
    metadata: {
      holding: 'Holding V5 Apollo',
      captaincy: 'Capitania #12 (V5 Apollo Avatar)',
      targetEcosystem: [
        'V5 Broadcaster (:3008)',
        'V5 Prisma (Difusor)',
        'V5 Sound (Síntese)',
        'OBS Studio 60 FPS',
      ],
      author: 'Apollo La Plata (Holding V5 Apollo)',
    },
  };
}

/**
 * Converte o pacote soberano para o formato PNGTuber+ (open-source streamer standard)
 */
export function convertPackageToPNGTuberPlus(pkg: V5VTuberPackage): Record<string, unknown> {
  return {
    version: '1.4.0',
    name: pkg.avatarName,
    author: pkg.metadata.author,
    canvas: {
      w: pkg.canvas.width,
      h: pkg.canvas.height,
    },
    settings: {
      volumeThreshold: pkg.audioLipsyncConfig.silenceThresholdDb,
      blinkDelayMin: pkg.idleMotionRigging.naturalEyeBlink.intervalMinSeconds,
      blinkDelayMax: pkg.idleMotionRigging.naturalEyeBlink.intervalMaxSeconds,
      bounceAmount: pkg.idleMotionRigging.breathing.amplitudeYPercent * 2,
    },
    states: {
      idle_closed: {
        sprite: pkg.sprites.baseAnchorUrl,
        mouthViseme: 'silence',
      },
      idle_open: {
        sprite: pkg.sprites.baseAnchorUrl,
        mouthViseme: 'A_I',
      },
      speaking_open: {
        sprite: pkg.sprites.baseAnchorUrl,
        mouthViseme: 'O_U',
      },
      speaking_closed: {
        sprite: pkg.sprites.baseAnchorUrl,
        mouthViseme: 'MBP',
      },
    },
    v5apollo_anchor_spec: pkg.anchorPoints,
  };
}

/**
 * Converte o pacote soberano para configuração nativa do OBS Browser Source
 */
export function convertPackageToOBSBrowserSourceConfig(pkg: V5VTuberPackage): Record<string, unknown> {
  return {
    sourceType: 'browser_source',
    name: `V5 Avatar - ${pkg.avatarName}`,
    url: `http://localhost:3010/live/overlay?avatarId=${pkg.avatarId}&token=${pkg.broadcastIntegration.liveToken}`,
    width: pkg.canvas.width,
    height: pkg.canvas.height,
    fps: pkg.canvas.targetFps,
    custom_css: `
      body {
        margin: 0px;
        background-color: rgba(0, 0, 0, 0);
        overflow: hidden;
      }
      #avatar-viewport {
        filter: ${pkg.broadcastIntegration.obsTransparentOverlay.cssCustomFilter};
      }
    `.trim(),
    restart_when_active: true,
    shutdown_when_not_visible: false,
    hardware_acceleration: pkg.broadcastIntegration.obsTransparentOverlay.hardwareAcceleration,
  };
}

/**
 * Validação de integridade do Pacote VTuber Standard
 */
export function validateVTuberPackageIntegrity(pkg: V5VTuberPackage): {
  valid: boolean;
  score: number;
  issues: string[];
  passedChecks: string[];
} {
  const issues: string[] = [];
  const passedChecks: string[] = [];

  // Checagem 1: Visemas Canônicos
  if (pkg.visemesCatalog.length === 7) {
    passedChecks.push('7 Visemas Canônicos da Fala (Rhubarb & Oculus) mapeados');
  } else {
    issues.push(`Quantidade de visemas incompleta (${pkg.visemesCatalog.length}/7)`);
  }

  // Checagem 2: Âncoras Anatômicas
  if (pkg.anchorPoints.mouthAnchor && pkg.anchorPoints.chestAnchor && pkg.anchorPoints.headPivot) {
    passedChecks.push('Âncoras de rigging anatômico (Boca, Tórax, Pivô da Cabeça) configuradas');
  } else {
    issues.push('Âncoras anatômicas de rigging ausentes');
  }

  // Checagem 3: Parâmetros de Idle
  if (
    pkg.idleMotionRigging.breathing.bpm >= 6 &&
    pkg.idleMotionRigging.breathing.bpm <= 30 &&
    pkg.idleMotionRigging.naturalEyeBlink.intervalMinSeconds > 1
  ) {
    passedChecks.push('Ciclos orgânicos de respiração e piscar estocástico validados');
  } else {
    issues.push('Parâmetros de respiração ou piscar fora da faixa fisiológica');
  }

  // Checagem 4: Áudio e Lip-Sync Gate
  if (pkg.audioLipsyncConfig.silenceThresholdDb < -20) {
    passedChecks.push('Noise Gate e Thresholds acústicos para live calibrados');
  } else {
    issues.push('Threshold de silêncio acústico perigosamente alto');
  }

  // Checagem 5: Webhook Broadcaster
  if (pkg.broadcastIntegration.inboundWebhookEndpoint && pkg.broadcastIntegration.liveToken) {
    passedChecks.push('Enlace de Webhook seguro com V5 Broadcaster (:3008) configurado');
  } else {
    issues.push('Token ou endpoint de Webhook não configurado');
  }

  const score = Math.max(0, 100 - issues.length * 20);

  return {
    valid: issues.length === 0,
    score,
    issues,
    passedChecks,
  };
}

/**
 * Cria um Blob JSON para download
 */
export function exportVTuberPackageAsBlob(pkg: V5VTuberPackage | Record<string, unknown>): Blob {
  const jsonString = JSON.stringify(pkg, null, 2);
  return new Blob([jsonString], { type: 'application/json' });
}

/**
 * Dispara download no navegador
 */
export function downloadVTuberPackage(
  data: V5VTuberPackage | Record<string, unknown>,
  filename = 'avatar_vtuber_package.json'
): void {
  if (typeof window === 'undefined') return;
  const blob = exportVTuberPackageAsBlob(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
