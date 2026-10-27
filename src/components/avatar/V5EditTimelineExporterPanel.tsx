'use client';

import React, { useState, useMemo } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  TimelineMarker,
  TimelineExportPackage,
  DEFAULT_TIMELINE_SCRIPT,
  compileTimelineMetadata,
  exportToV5EditJson,
  exportToEdlCsv,
  exportToVtt,
} from '@/utils/v5EditTimelineExporter';
import {
  SlidersHorizontal,
  Sparkles,
  Download,
  Copy,
  Check,
  Clock,
  Layers,
  Mic,
  Wind,
  Flame,
  Film,
  FileCode,
  FileSpreadsheet,
  FileText,
  Maximize2,
  CheckCircle2,
  Play,
  Scissors,
} from 'lucide-react';

interface V5EditTimelineExporterPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function V5EditTimelineExporterPanel({
  avatarId,
  avatarName,
}: V5EditTimelineExporterPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const targetName = currentAvatar?.name || avatarName || 'Maya Vance';

  const [fps, setFps] = useState<number>(30);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string>('marker_speech_1');
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  const timelinePkg: TimelineExportPackage = useMemo(() => {
    return compileTimelineMetadata(DEFAULT_TIMELINE_SCRIPT, currentAvatar, fps);
  }, [currentAvatar, fps]);

  const activeMarker: TimelineMarker = useMemo(() => {
    return (
      timelinePkg.markers.find((m) => m.id === selectedMarkerId) ||
      timelinePkg.markers[0]
    );
  }, [timelinePkg.markers, selectedMarkerId]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(timelinePkg, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const getMarkerIcon = (type: TimelineMarker['type']) => {
    switch (type) {
      case 'speech_segment':
        return <Mic className="w-3.5 h-3.5 text-cyber-cyan" />;
      case 'breath_inhale':
      case 'breath_exhale':
      case 'dramatic_pause':
        return <Wind className="w-3.5 h-3.5 text-sky-400" />;
      case 'kinetic_emphasis':
        return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      case 'b_roll_insert':
      case 'jump_cut_cue':
        return <Film className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(0,229,255,0.08)] space-y-6">
      {/* Header do Painel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Fase 9 · Etapa 087 · Conector V5 Edit Web (:3001)
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Exportador de Metadados de Timeline para V5 Edit
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Geração de trilhas de marcadores de fala, respiração, ênfase cinética e cortes para inserção automática de legendas e cortes dinâmicos.
          </p>
        </div>

        {/* Badges de Telemetria e Ações Globais */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-obsidian-950 border border-cyber-cyan/30 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-cyber-cyan" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-400">Duração / Frames</div>
              <div className="text-xs font-bold text-cyber-cyan">
                {timelinePkg.totalDurationSeconds}s ({Math.round(timelinePkg.totalDurationSeconds * fps)}f @ {fps}fps)
              </div>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-obsidian-950 border border-purple-500/30 flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-purple-400" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-400">Total Marcadores</div>
              <div className="text-xs font-bold text-purple-400">
                {timelinePkg.markersCount} Marcadores (4 Trilhas)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => exportToV5EditJson(timelinePkg)}
              className="px-3 py-2 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/25 transition-all text-xs font-mono font-semibold flex items-center gap-1.5"
              title="Exportar JSON nativo para V5 Edit Web"
            >
              <Download className="w-3.5 h-3.5" />
              .v5timeline.json
            </button>

            <button
              onClick={() => exportToEdlCsv(timelinePkg)}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all text-xs font-mono flex items-center gap-1.5"
              title="Exportar CSV para Premiere / DaVinci"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              CSV/EDL
            </button>

            <button
              onClick={() => exportToVtt(timelinePkg)}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all text-xs font-mono flex items-center gap-1.5"
              title="Exportar legendas WebVTT"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              VTT
            </button>
          </div>
        </div>
      </div>

      {/* Seletor de FPS da Timeline */}
      <div className="flex items-center justify-between bg-obsidian-950/70 p-3 rounded-xl border border-white/5 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Capitania Destino:</span>
          <span className="px-2.5 py-0.5 rounded bg-cyber-cyan/15 text-cyber-cyan font-bold border border-cyber-cyan/30">
            Capitania #02 (V5 Edit Web · Porta :3001)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Framerate Base:</span>
          {[24, 30, 60].map((rate) => (
            <button
              key={rate}
              onClick={() => setFps(rate)}
              className={`px-2.5 py-1 rounded text-xs transition-all border ${
                fps === rate
                  ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan font-bold'
                  : 'bg-obsidian-900 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {rate} FPS
            </button>
          ))}
        </div>
      </div>

      {/* Visualizador Multi-Trilha Estilo NLE (Timeline Display) */}
      <div className="bg-obsidian-950 border border-white/10 rounded-xl p-5 space-y-4 overflow-hidden">
        <div className="flex items-center justify-between text-xs font-mono border-b border-white/5 pb-2">
          <span className="text-slate-400 font-bold flex items-center gap-1.5">
            <Film className="w-4 h-4 text-cyber-cyan" />
            Visualizador de Trilhas Multi-Pista V5 Edit (0s a {timelinePkg.totalDurationSeconds}s)
          </span>
          <span className="text-[11px] text-slate-500">
            Clique em qualquer bloco para inspecionar os parâmetros exatos
          </span>
        </div>

        {/* Régua de Tempo */}
        <div className="relative h-6 bg-obsidian-900/90 rounded border border-white/5 flex items-center px-2 text-[10px] font-mono text-slate-500 justify-between select-none">
          <span>00:00.00 (F:0)</span>
          <span>00:04.00</span>
          <span>00:08.00</span>
          <span>00:12.00</span>
          <span>00:16.00</span>
          <span>{timelinePkg.totalDurationSeconds}s (F:{Math.round(timelinePkg.totalDurationSeconds * fps)})</span>
        </div>

        {/* 4 Trilhas Gráficas */}
        <div className="space-y-2.5">
          {timelinePkg.tracks.map((track) => {
            const trackMarkers = timelinePkg.markers.filter((m) => m.trackIndex === track.trackIndex);
            return (
              <div key={track.trackIndex} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 font-bold" style={{ color: track.colorHex }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: track.colorHex }} />
                    Trilha #{track.trackIndex}: {track.trackName}
                  </span>
                  <span className="text-slate-500">{track.markerCount} eventos</span>
                </div>

                {/* Linha da Trilha com Blocos Proporcionais */}
                <div className="relative h-9 bg-obsidian-900/60 rounded-lg border border-white/5 overflow-hidden p-1 flex items-center">
                  {trackMarkers.map((m) => {
                    const leftPct = (m.timeStartMs / timelinePkg.totalDurationMs) * 100;
                    const widthPct = Math.max(
                      1.5,
                      ((m.timeEndMs - m.timeStartMs) / timelinePkg.totalDurationMs) * 100
                    );
                    const isSelected = selectedMarkerId === m.id;

                    return (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMarkerId(m.id)}
                        className={`absolute h-7 rounded px-2 text-left truncate text-[10px] font-mono transition-all flex items-center gap-1 border ${
                          isSelected
                            ? 'ring-2 ring-white shadow-lg z-20 font-bold'
                            : 'hover:brightness-125 z-10'
                        }`}
                        style={{
                          left: `${leftPct}%`,
                          width: `${widthPct}%`,
                          backgroundColor: `${m.colorHex}25`,
                          borderColor: m.colorHex,
                          color: m.colorHex,
                        }}
                        title={`${m.label} (${(m.timeStartMs / 1000).toFixed(2)}s - ${(m.timeEndMs / 1000).toFixed(2)}s)`}
                      >
                        {getMarkerIcon(m.type)}
                        <span className="truncate">{m.metadata.emphasisWord || m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inspetor Detalhado do Marcador Selecionado */}
      <div className="bg-obsidian-950 border border-cyber-cyan/20 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono border"
              style={{
                backgroundColor: `${activeMarker.colorHex}20`,
                borderColor: activeMarker.colorHex,
                color: activeMarker.colorHex,
              }}
            >
              {getMarkerIcon(activeMarker.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 font-bold">
                  {activeMarker.id.toUpperCase()}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                  style={{
                    backgroundColor: `${activeMarker.colorHex}20`,
                    color: activeMarker.colorHex,
                  }}
                >
                  {activeMarker.type.toUpperCase()}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">{activeMarker.label}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="px-3.5 py-1.5 rounded-lg bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/25 transition-all text-xs font-mono font-semibold flex items-center gap-1.5"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedJson ? 'Copiado!' : 'Copiar Pacote JSON'}
            </button>
          </div>
        </div>

        {/* Grade de Parâmetros de Timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-obsidian-900 p-3 rounded-lg border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500">Início (Timecode):</span>
            <div className="text-cyber-cyan font-bold">
              {(activeMarker.timeStartMs / 1000).toFixed(2)}s (Frame {activeMarker.frameStart30fps})
            </div>
          </div>

          <div className="bg-obsidian-900 p-3 rounded-lg border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500">Fim (Timecode):</span>
            <div className="text-cyber-cyan font-bold">
              {(activeMarker.timeEndMs / 1000).toFixed(2)}s (Frame {activeMarker.frameEnd30fps})
            </div>
          </div>

          <div className="bg-obsidian-900 p-3 rounded-lg border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500">Duração do Marcador:</span>
            <div className="text-emerald-400 font-bold">
              {((activeMarker.timeEndMs - activeMarker.timeStartMs) / 1000).toFixed(2)}s (
              {activeMarker.frameEnd30fps - activeMarker.frameStart30fps}f)
            </div>
          </div>

          <div className="bg-obsidian-900 p-3 rounded-lg border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500">Preset Cinético / Tipo:</span>
            <div className="text-purple-300 font-bold truncate">
              {activeMarker.metadata.captionAnimationPreset ||
                activeMarker.metadata.breathType ||
                activeMarker.metadata.suggestedCutAngle ||
                'Standard'}
            </div>
          </div>
        </div>

        {/* Detalhes de Conteúdo / Diálogo */}
        {activeMarker.metadata.dialogueText && (
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">
              Texto Integral do Diálogo (Alinhamento Fonético):
            </span>
            <p className="p-3 bg-obsidian-900 rounded-lg text-xs font-mono text-slate-200 border border-white/5">
              "{activeMarker.metadata.dialogueText}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
