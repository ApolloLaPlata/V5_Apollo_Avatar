'use client';

import React, { useState } from 'react';
import {
  PoseExportItem,
  ExportResolution,
  BackgroundMode,
  composePoseSheet,
  RESOLUTION_DIMENSIONS,
} from '@/utils/poseSheetExporter';
import { toast } from '@/store/useToastStore';
import {
  Download,
  Layers,
  Sparkles,
  Image as ImageIcon,
  Check,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Maximize2,
  Grid,
  Columns,
  RefreshCw,
} from 'lucide-react';

interface PoseSheetExporterPanelProps {
  avatarName?: string;
  tPoseUrl?: string | null;
  aPoseUrl?: string | null;
  productPoseUrl?: string | null;
  authorPoseUrl?: string | null;
}

export default function PoseSheetExporterPanel({
  avatarName = 'Personagem Soberano',
  tPoseUrl,
  aPoseUrl,
  productPoseUrl,
  authorPoseUrl,
}: PoseSheetExporterPanelProps) {
  const fallbackImg =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

  const defaultPoses: PoseExportItem[] = [
    { id: 't_pose', name: 'T-Pose Neutra 90º', imageUrl: tPoseUrl || fallbackImg },
    { id: 'a_pose', name: 'A-Pose Relaxada 45º', imageUrl: aPoseUrl || fallbackImg },
    { id: 'fines_ugc', name: 'Vitrine Produto Fines', imageUrl: productPoseUrl || fallbackImg },
    { id: 'author_bio', name: 'Braços Cruzados (Autor)', imageUrl: authorPoseUrl || fallbackImg },
  ];

  const [selectedPoseIds, setSelectedPoseIds] = useState<string[]>([
    't_pose',
    'a_pose',
    'fines_ugc',
    'author_bio',
  ]);
  const [resolution, setResolution] = useState<ExportResolution>('2k');
  const [bgMode, setBgMode] = useState<BackgroundMode>('transparent_alpha');
  const [layout, setLayout] = useState<'horizontal_strip' | 'grid_2x2'>('horizontal_strip');
  const [includeWatermark, setIncludeWatermark] = useState(true);
  const [isComposing, setIsComposing] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  const togglePoseSelection = (id: string) => {
    setSelectedPoseIds((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((p) => p !== id) : prev) : [...prev, id]
    );
  };

  const handleComposeSheet = async () => {
    try {
      setIsComposing(true);
      const activePoses = defaultPoses.filter((p) => selectedPoseIds.includes(p.id));

      const composedUrl = await composePoseSheet(activePoses, {
        resolution,
        bgMode,
        includeWatermark,
        avatarName,
        layout,
      });

      setPreviewDataUrl(composedUrl);
      toast.success(
        'Folha Composta com Sucesso!',
        `Renderizada em ${resolution.toUpperCase()} (${layout === 'horizontal_strip' ? 'Tira Horizontal' : 'Grid 2x2'}).`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao renderizar folha.';
      toast.error('Erro na Composição', msg);
    } finally {
      setIsComposing(false);
    }
  };

  const handleDownload = () => {
    if (!previewDataUrl) return;
    const a = document.createElement('a');
    a.href = previewDataUrl;
    a.download = `${avatarName.toLowerCase().replace(/\s+/g, '_')}_poses_${resolution}_${bgMode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Download Concluído', 'Folha de poses PNG em alta resolução exportada.');
  };

  const currentDims = RESOLUTION_DIMENSIONS[resolution][layout];

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-5 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Exportador de Folha de Poses (Alta Resolução & Canal Alpha)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30">
                {currentDims.width}x{currentDims.height}px
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Composição com fundo transparente nativo (PNG RGBA 32-bit) para OBS Broadcaster e V5 Edit
            </p>
          </div>
        </div>

        {/* Resolução Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-obsidian-950 border border-white/10 rounded-xl text-xs">
          {(['1080p', '2k', '4k'] as ExportResolution[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setResolution(r)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                resolution === r
                  ? 'bg-cyber-cyan text-obsidian-950 shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Configurações (Esquerda / 5 cols) e Viewport de Preview / Download (Direita / 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Controles de Composição (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Seleção de Poses a Incluir */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-300 block">
              Poses a Incluir na Folha ({selectedPoseIds.length} selecionadas):
            </span>
            <div className="space-y-1.5">
              {defaultPoses.map((pose) => {
                const isSelected = selectedPoseIds.includes(pose.id);
                return (
                  <button
                    key={pose.id}
                    type="button"
                    onClick={() => togglePoseSelection(pose.id)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyber-cyan bg-cyber-cyan/10 text-white font-bold'
                        : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <span>{pose.name}</span>
                    {isSelected ? (
                      <CheckCircle2 className="w-4 h-4 text-cyber-cyan" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-white/20" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modo de Fundo (Canal Alpha / Studio) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-300 block">Fundo da Folha:</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'transparent_alpha', label: 'Transparente (Alpha)' },
                { id: 'obsidian_dark', label: 'Escuro Obsidian' },
                { id: 'studio_cyan', label: 'Estúdio Ciano' },
                { id: 'pure_white', label: 'Branco Comercial' },
              ].map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setBgMode(bg.id as BackgroundMode)}
                  className={`py-2 px-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                    bgMode === bg.id
                      ? 'border-luxury-gold bg-luxury-gold/15 text-luxury-gold shadow-glow-gold'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Formato de Layout */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-300 block">Layout da Folha:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLayout('horizontal_strip')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  layout === 'horizontal_strip'
                    ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan'
                    : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200'
                }`}
              >
                <Columns className="w-4 h-4" />
                Tira Horizontal
              </button>

              <button
                type="button"
                onClick={() => setLayout('grid_2x2')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  layout === 'grid_2x2'
                    ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan'
                    : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid className="w-4 h-4" />
                Grade 2x2
              </button>
            </div>
          </div>

          {/* Botão de Renderização via Offscreen Canvas */}
          <button
            type="button"
            onClick={handleComposeSheet}
            disabled={isComposing}
            className="w-full py-3 px-4 rounded-xl bg-cyber-cyan text-obsidian-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-cyan-300 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.3)] disabled:opacity-50"
          >
            {isComposing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isComposing ? 'Renderizando Canvas Offscreen...' : 'Renderizar Folha de Poses'}
          </button>
        </div>

        {/* Viewport de Pré-Visualização da Folha & Ações de Download (7 cols) */}
        <div className="lg:col-span-7 bg-obsidian-950 rounded-xl p-4 border border-white/10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <span className="text-slate-300 font-bold flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyber-cyan" />
              Preview da Folha Composta
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {bgMode === 'transparent_alpha' ? 'Canal Alpha Ativo (Xadrez)' : 'Fundo Opaco'}
            </span>
          </div>

          {/* Área de Visualização com Grid Xadrez de Transparência */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10 flex items-center justify-center bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-obsidian-900">
            {previewDataUrl ? (
              <img
                src={previewDataUrl}
                alt="Folha de Poses Composta"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center p-6 space-y-2">
                <Layers className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  Nenhuma folha renderizada no momento.
                </p>
                <p className="text-[10px] text-slate-500">
                  Selecione as opções à esquerda e clique em "Renderizar Folha de Poses".
                </p>
              </div>
            )}
          </div>

          {/* Ações de Download e Metadados */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[10px] text-slate-400">
              Formato: <strong className="text-cyber-cyan">PNG 32-bit (RGBA)</strong> · Resolução:{' '}
              <strong className="text-luxury-gold">{currentDims.width}x{currentDims.height}</strong>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!previewDataUrl}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-luxury-gold text-obsidian-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all cursor-pointer shadow-glow-gold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Baixar Folha PNG ({resolution.toUpperCase()})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
