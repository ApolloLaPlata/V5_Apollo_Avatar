'use client';

import React, { useState } from 'react';
import {
  CANONICAL_16_ATLAS_SLOTS,
  buildAtlasManifest,
  composeFacialSpriteSheet,
  AtlasFrameDefinition,
} from '@/utils/facialSpriteSheetComposer';
import { toast } from '@/store/useToastStore';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  Grid,
  Download,
  Copy,
  Check,
  Sparkles,
  Layers,
  FileCode,
  ShieldCheck,
  RefreshCw,
  Eye,
  Maximize2,
} from 'lucide-react';

interface SpriteSheetComposerPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function SpriteSheetComposerPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
}: SpriteSheetComposerPanelProps) {
  const [dimension, setDimension] = useState<2048 | 4096>(2048);
  const [bgTransparent, setBgTransparent] = useState<boolean>(true);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('expr_neutral');
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [composedUrl, setComposedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const { updateAvatar } = useAvatarStore();

  const manifest = buildAtlasManifest(avatarId, avatarName, dimension);
  const activeSlot =
    CANONICAL_16_ATLAS_SLOTS.find((s) => s.id === selectedSlotId) ||
    CANONICAL_16_ATLAS_SLOTS[0];
  const activeFrameData = manifest.frames[activeSlot.id];

  const handleCompose = async () => {
    try {
      setIsComposing(true);
      const url = await composeFacialSpriteSheet(dimension, bgTransparent);
      setComposedUrl(url);
      toast.success(
        'Sprite Sheet Renderizado!',
        `Atlas 4x4 (${dimension}x${dimension}px) compilado com 16 quadros (9 Expressões + 7 Visemas).`
      );
    } catch (err: any) {
      toast.error('Erro na Composição', err.message || 'Falha ao renderizar atlas.');
    } finally {
      setIsComposing(false);
    }
  };

  const handleDownloadPng = () => {
    if (!composedUrl) return;
    const a = document.createElement('a');
    a.href = composedUrl;
    a.download = `${avatarName.toLowerCase().replace(/\s+/g, '_')}_atlas_${dimension}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Download Concluído', 'Arquivo PNG do Atlas salvo com sucesso.');
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(manifest, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${avatarName.toLowerCase().replace(/\s+/g, '_')}_atlas_${dimension}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Download Concluído', 'Manifesto de coordenadas JSON salvo.');
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    setCopied(true);
    toast.success('Atlas JSON Copiado!', '16 nós UV prontos para colar no Broadcaster ou Prisma.');
    setTimeout(() => setCopied(false), 2000);
  };

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
              Gerador de Sprite Sheet Consolidado & Atlas JSON (4x4)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30">
                16 Quadros: 9 Expressões + 7 Visemas
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Atlas unificado TexturePacker padrão RGBA 32-bit para animação em tempo real no V5 Broadcaster (:3008)
            </p>
          </div>
        </div>

        {/* Resolução Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-obsidian-950 border border-white/10 rounded-xl text-xs">
          {[2048, 4096].map((res) => (
            <button
              key={res}
              type="button"
              onClick={() => setDimension(res as 2048 | 4096)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                dimension === res
                  ? 'bg-cyber-cyan text-obsidian-950 shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {res === 2048 ? '2K Studio' : '4K Master'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Viewport da Grade 4x4 (Esquerda / 7 cols) & Inspetor UV e Downloads (Direita / 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Grade 4x4 Interativa do Atlas */}
        <div className="lg:col-span-7 bg-obsidian-950 p-4 rounded-xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/5">
            <span className="text-cyber-cyan font-bold flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5" />
              Layout do Atlas 4x4 ({dimension}x{dimension}px)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Célula: {dimension / 4}x{dimension / 4}px
            </span>
          </div>

          {/* Grid 4x4 de Células */}
          <div className="grid grid-cols-4 gap-1.5 aspect-square max-w-[420px] mx-auto bg-black/60 p-2 rounded-xl border border-white/10">
            {CANONICAL_16_ATLAS_SLOTS.map((slot) => {
              const isSelected = selectedSlotId === slot.id;
              return (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`relative aspect-square rounded-lg overflow-hidden border transition-all cursor-pointer group ${
                    isSelected
                      ? 'border-cyber-cyan ring-2 ring-cyber-cyan/50 shadow-[0_0_12px_rgba(0,229,255,0.4)] z-10'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img
                    src={slot.imageUrl}
                    alt={slot.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Tag do Tipo */}
                  <span
                    className={`absolute top-1 left-1 text-[7px] font-mono px-1 rounded font-bold uppercase ${
                      slot.type === 'expression'
                        ? 'bg-cyber-cyan/80 text-obsidian-950'
                        : 'bg-luxury-gold/80 text-obsidian-950'
                    }`}
                  >
                    {slot.type === 'expression' ? 'EXP' : 'VIS'}
                  </span>

                  <span className="absolute bottom-1 inset-x-1 text-[8px] font-mono text-slate-200 truncate">
                    {slot.name}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={bgTransparent}
                onChange={(e) => setBgTransparent(e.target.checked)}
                className="accent-cyber-cyan"
              />
              Fundo Transparente (Canal Alpha RGBA)
            </label>

            <button
              type="button"
              onClick={handleCompose}
              disabled={isComposing}
              className="py-1.5 px-3 rounded-lg bg-cyber-cyan text-obsidian-950 font-bold flex items-center gap-1.5 hover:bg-cyan-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isComposing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isComposing ? 'Compilando...' : 'Compor Sprite Sheet'}
            </button>
          </div>
        </div>

        {/* Inspetor UV e Exportador JSON TexturePacker (5 cols) */}
        <div className="lg:col-span-5 space-y-4 bg-obsidian-950 p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-luxury-gold" />
              Inspetor de Coordenadas UV
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-luxury-gold/20 text-luxury-gold font-bold">
              {activeSlot.type === 'expression' ? 'Expressão Facial' : 'Visema de Fala'}
            </span>
          </div>

          {/* Dados do Slot Ativo */}
          <div className="space-y-1.5 text-xs">
            <div className="font-bold text-slate-100">{activeSlot.name}</div>
            <div className="text-[10px] text-slate-400 font-mono">
              Key: <strong className="text-cyber-cyan">{activeSlot.id}</strong>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] font-mono">
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-slate-500 block">X, Y (Pixels):</span>
                <span className="text-cyber-cyan font-bold">
                  {activeFrameData.frame.x}, {activeFrameData.frame.y}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-slate-500 block">Largura / Altura:</span>
                <span className="text-luxury-gold font-bold">
                  {activeFrameData.frame.w} x {activeFrameData.frame.h}
                </span>
              </div>
            </div>
          </div>

          {/* Snippet do JSON TexturePacker */}
          <div className="p-2.5 rounded-lg bg-black/70 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[9px] text-slate-400">
              <span>TexturePacker JSON Format:</span>
              <button
                type="button"
                onClick={handleCopyJson}
                className="hover:text-cyber-cyan flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-cyber-cyan" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copiado' : 'Copiar JSON'}
              </button>
            </div>
            <pre className="text-[9px] text-slate-300 overflow-x-auto max-h-[110px] p-1 font-mono">
              {JSON.stringify(
                {
                  [activeSlot.id]: activeFrameData,
                },
                null,
                2
              )}
            </pre>
          </div>

          {/* Ações de Download */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={!composedUrl}
              className="w-full py-2.5 px-3 rounded-xl bg-cyber-cyan text-obsidian-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-cyan-300 transition-colors cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Baixar Sprite Sheet PNG ({dimension}px)
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="w-full py-2 px-3 rounded-xl bg-white/5 text-slate-200 border border-white/10 hover:border-luxury-gold hover:text-luxury-gold font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileCode className="w-4 h-4" />
              Baixar Manifesto de Coordenadas (.json)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
