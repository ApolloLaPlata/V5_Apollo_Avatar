/**
 * V5 Apollo Avatar - V5 Edit Web Timeline Metadata Exporter
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Exportador de Metadados de Timeline para o V5 Edit Web (Capitania #02 · :3001).
 * Gera trilhas de marcadores síncronos de fala, respiração, ênfase cinética e cortes
 * para acelerar a pós-produção e inserção de legendas dinâmicas no editor não-linear.
 */

import { AvatarProfile } from '@/types/avatar';

export type MarkerType =
  | 'speech_segment'
  | 'breath_inhale'
  | 'breath_exhale'
  | 'dramatic_pause'
  | 'kinetic_emphasis'
  | 'b_roll_insert'
  | 'jump_cut_cue';

export interface TimelineMarker {
  id: string;
  trackIndex: number; // 0 = Fala, 1 = Respiração, 2 = Ênfase Cinética, 3 = Cortes / B-Roll
  trackName: string;
  type: MarkerType;
  timeStartMs: number;
  timeEndMs: number;
  frameStart30fps: number;
  frameEnd30fps: number;
  label: string;
  colorHex: string;
  metadata: {
    dialogueText?: string;
    emphasisWord?: string;
    captionAnimationPreset?: 'bounce_pop' | 'glow_scale' | 'color_flash' | 'subtle_reveal';
    breathType?: 'micro_inhale' | 'deep_prep' | 'exhale_relief';
    suggestedCutAngle?: string;
    bRollKeyword?: string;
  };
}

export interface ScriptSegmentInput {
  text: string;
  emphasisWords: string[];
  approxDurationSeconds: number;
  hasInhalePrep?: boolean;
  suggestedBRoll?: string;
}

export interface TimelineExportPackage {
  schemaVersion: 'v5apollo.timeline.v1.0';
  projectId: string;
  projectName: string;
  avatarId: string;
  avatarName: string;
  totalDurationMs: number;
  totalDurationSeconds: number;
  fps: number;
  markersCount: number;
  tracks: Array<{
    trackIndex: number;
    trackName: string;
    colorHex: string;
    markerCount: number;
  }>;
  markers: TimelineMarker[];
  targetCaptaincy: 'Capitania #02 (V5 Edit Web)';
  exportedAt: string;
}

export const DEFAULT_TIMELINE_SCRIPT: ScriptSegmentInput[] = [
  {
    text: 'Se você ainda perde horas criando conteúdo manual, pare agora.',
    emphasisWords: ['horas', 'manual', 'pare agora'],
    approxDurationSeconds: 3.2,
    hasInhalePrep: true,
    suggestedBRoll: 'Tela de computador com trabalho estressante manual',
  },
  {
    text: 'Nós construímos o V5 Avatar para unificar consistência 360 e clones de voz.',
    emphasisWords: ['V5 Avatar', 'consistência 360', 'clones de voz'],
    approxDurationSeconds: 3.8,
    hasInhalePrep: true,
    suggestedBRoll: 'Turnaround 360 do avatar girando suavemente',
  },
  {
    text: 'A IA assume os takes mais difíceis, preservando cada traço da sua identidade.',
    emphasisWords: ['takes mais difíceis', 'sua identidade'],
    approxDurationSeconds: 3.5,
    hasInhalePrep: false,
    suggestedBRoll: 'Gráfico de fidelidade biométrica FVI 99%',
  },
  {
    text: 'O resultado é escala pura com zero perda de autoridade de marca.',
    emphasisWords: ['escala pura', 'zero perda', 'autoridade'],
    approxDurationSeconds: 3.0,
    hasInhalePrep: true,
    suggestedBRoll: 'Dashboard de métricas de crescimento exponencial',
  },
  {
    text: 'Toque no link abaixo e ative o seu avatar soberano agora mesmo.',
    emphasisWords: ['link abaixo', 'avatar soberano', 'agora mesmo'],
    approxDurationSeconds: 3.0,
    hasInhalePrep: true,
    suggestedBRoll: 'Página de registro civil de personagens :3010',
  },
];

/**
 * Compila os metadados da timeline gerando marcadores milimétricos com frames calculados a 30fps
 */
export function compileTimelineMetadata(
  segments: ScriptSegmentInput[] = DEFAULT_TIMELINE_SCRIPT,
  avatar?: AvatarProfile,
  fps: number = 30
): TimelineExportPackage {
  const avatarName = avatar?.name || 'Maya Vance';
  const avatarId = avatar?.id || 'maya_vance_soberana';

  const markers: TimelineMarker[] = [];
  let currentTimeMs = 0;

  segments.forEach((seg, segIndex) => {
    // 1. Marcador de Respiração Preparatória (Inhale) antes da frase (se aplicável)
    if (seg.hasInhalePrep) {
      const inhaleDurationMs = 280; // Respiração rápida de 280ms
      const inhaleStart = currentTimeMs;
      const inhaleEnd = inhaleStart + inhaleDurationMs;

      markers.push({
        id: `marker_breath_${segIndex + 1}`,
        trackIndex: 1,
        trackName: 'Respiração & Pausas',
        type: 'breath_inhale',
        timeStartMs: inhaleStart,
        timeEndMs: inhaleEnd,
        frameStart30fps: Math.round((inhaleStart / 1000) * fps),
        frameEnd30fps: Math.round((inhaleEnd / 1000) * fps),
        label: 'Inalação Micro (Vocal Prep)',
        colorHex: '#38bdf8',
        metadata: {
          breathType: 'micro_inhale',
        },
      });

      currentTimeMs = inhaleEnd;
    }

    // 2. Marcador Principal de Fala (Track 0)
    const speechDurationMs = Math.round(seg.approxDurationSeconds * 1000);
    const speechStart = currentTimeMs;
    const speechEnd = speechStart + speechDurationMs;

    markers.push({
      id: `marker_speech_${segIndex + 1}`,
      trackIndex: 0,
      trackName: 'Diálogo & Fala (Voice DNA)',
      type: 'speech_segment',
      timeStartMs: speechStart,
      timeEndMs: speechEnd,
      frameStart30fps: Math.round((speechStart / 1000) * fps),
      frameEnd30fps: Math.round((speechEnd / 1000) * fps),
      label: `Frase ${segIndex + 1}: "${seg.text.slice(0, 30)}..."`,
      colorHex: '#00e5ff',
      metadata: {
        dialogueText: seg.text,
      },
    });

    // 3. Marcadores de Ênfase Cinética para Legendas Dinâmicas (Track 2)
    const words = seg.text.split(' ');
    const timePerWord = speechDurationMs / Math.max(1, words.length);

    seg.emphasisWords.forEach((emphWord, emphIdx) => {
      // Localiza a posição aproximada da palavra na frase
      const wordPosition = seg.text.indexOf(emphWord);
      const ratio = wordPosition >= 0 ? wordPosition / seg.text.length : emphIdx * 0.3;
      const emphStart = Math.round(speechStart + ratio * speechDurationMs);
      const emphEnd = Math.min(speechEnd, emphStart + 450); // Pico de 450ms

      markers.push({
        id: `marker_emph_${segIndex + 1}_${emphIdx + 1}`,
        trackIndex: 2,
        trackName: 'Legendas Cinéticas & Ênfase',
        type: 'kinetic_emphasis',
        timeStartMs: emphStart,
        timeEndMs: emphEnd,
        frameStart30fps: Math.round((emphStart / 1000) * fps),
        frameEnd30fps: Math.round((emphEnd / 1000) * fps),
        label: `Ênfase: "${emphWord}"`,
        colorHex: '#f59e0b',
        metadata: {
          emphasisWord: emphWord,
          captionAnimationPreset: emphIdx % 2 === 0 ? 'bounce_pop' : 'glow_scale',
        },
      });
    });

    // 4. Marcador de Sugestão de B-Roll ou Corte (Track 3)
    if (seg.suggestedBRoll) {
      const bRollStart = Math.round(speechStart + speechDurationMs * 0.4);
      const bRollEnd = Math.round(bRollStart + 1600); // 1.6s de B-Roll

      markers.push({
        id: `marker_broll_${segIndex + 1}`,
        trackIndex: 3,
        trackName: 'Cortes & B-Roll V5',
        type: 'b_roll_insert',
        timeStartMs: bRollStart,
        timeEndMs: bRollEnd,
        frameStart30fps: Math.round((bRollStart / 1000) * fps),
        frameEnd30fps: Math.round((bRollEnd / 1000) * fps),
        label: `B-Roll: ${seg.suggestedBRoll}`,
        colorHex: '#a855f7',
        metadata: {
          bRollKeyword: seg.suggestedBRoll,
          suggestedCutAngle: 'jump_cut_punch_in',
        },
      });
    }

    // 5. Pausa dramática entre frases
    const pauseDurationMs = 250;
    const pauseStart = speechEnd;
    const pauseEnd = pauseStart + pauseDurationMs;

    markers.push({
      id: `marker_pause_${segIndex + 1}`,
      trackIndex: 1,
      trackName: 'Respiração & Pausas',
      type: 'dramatic_pause',
      timeStartMs: pauseStart,
      timeEndMs: pauseEnd,
      frameStart30fps: Math.round((pauseStart / 1000) * fps),
      frameEnd30fps: Math.round((pauseEnd / 1000) * fps),
      label: 'Pausa de Retenção (250ms)',
      colorHex: '#64748b',
      metadata: {
        breathType: 'exhale_relief',
      },
    });

    currentTimeMs = pauseEnd;
  });

  const tracks = [
    { trackIndex: 0, trackName: 'Diálogo & Fala (Voice DNA)', colorHex: '#00e5ff', markerCount: 0 },
    { trackIndex: 1, trackName: 'Respiração & Pausas', colorHex: '#38bdf8', markerCount: 0 },
    { trackIndex: 2, trackName: 'Legendas Cinéticas & Ênfase', colorHex: '#f59e0b', markerCount: 0 },
    { trackIndex: 3, trackName: 'Cortes & B-Roll V5', colorHex: '#a855f7', markerCount: 0 },
  ];

  tracks.forEach((t) => {
    t.markerCount = markers.filter((m) => m.trackIndex === t.trackIndex).length;
  });

  return {
    schemaVersion: 'v5apollo.timeline.v1.0',
    projectId: `v5edit_proj_${Date.now()}`,
    projectName: `${avatarName} - Short Viral Timeline`,
    avatarId,
    avatarName,
    totalDurationMs: currentTimeMs,
    totalDurationSeconds: Number((currentTimeMs / 1000).toFixed(2)),
    fps,
    markersCount: markers.length,
    tracks,
    markers,
    targetCaptaincy: 'Capitania #02 (V5 Edit Web)',
    exportedAt: new Date().toISOString(),
  };
}

/**
 * Exporta pacote para JSON canônico do V5 Edit Web
 */
export function exportToV5EditJson(pkg: TimelineExportPackage): void {
  const jsonString = JSON.stringify(pkg, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${pkg.avatarName.toLowerCase().replace(/\s+/g, '_')}_timeline_markers.v5timeline.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exporta marcadores para formato EDL / CSV compatível com NLEs (Premiere / DaVinci)
 */
export function exportToEdlCsv(pkg: TimelineExportPackage): void {
  const headers = ['Marker_ID', 'Track', 'Type', 'Start_Timecode', 'End_Timecode', 'Duration_Sec', 'Label', 'Comment'];
  const rows = pkg.markers.map((m) => {
    const startTc = formatMsToTimecode(m.timeStartMs, pkg.fps);
    const endTc = formatMsToTimecode(m.timeEndMs, pkg.fps);
    const durSec = ((m.timeEndMs - m.timeStartMs) / 1000).toFixed(2);
    const comment = m.metadata.dialogueText || m.metadata.emphasisWord || m.metadata.bRollKeyword || '';
    return [
      m.id,
      m.trackName,
      m.type,
      startTc,
      endTc,
      durSec,
      `"${m.label.replace(/"/g, '""')}"`,
      `"${comment.replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${pkg.avatarName.toLowerCase().replace(/\s+/g, '_')}_markers_nle.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exporta trilha de legendas dinâmicas como WebVTT
 */
export function exportToVtt(pkg: TimelineExportPackage): void {
  const speechMarkers = pkg.markers.filter((m) => m.type === 'speech_segment');
  const vttLines = ['WEBVTT', ''];

  speechMarkers.forEach((m, idx) => {
    const startVtt = formatMsToVtt(m.timeStartMs);
    const endVtt = formatMsToVtt(m.timeEndMs);
    vttLines.push(String(idx + 1));
    vttLines.push(`${startVtt} --> ${endVtt}`);
    vttLines.push(m.metadata.dialogueText || m.label);
    vttLines.push('');
  });

  const blob = new Blob([vttLines.join('\n')], { type: 'text/vtt' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${pkg.avatarName.toLowerCase().replace(/\s+/g, '_')}_subtitles.vtt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatMsToTimecode(ms: number, fps: number): string {
  const totalSeconds = ms / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const frames = Math.floor((totalSeconds % 1) * fps);

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
    String(frames).padStart(2, '0'),
  ].join(':');
}

function formatMsToVtt(ms: number): string {
  const totalSeconds = ms / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const millis = Math.floor(ms % 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
}
