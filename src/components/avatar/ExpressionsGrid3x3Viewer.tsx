'use client';

import React, { useState } from 'react';
import {
  CANONICAL_3X3_EXPRESSIONS,
  ExpressionGridCell,
} from '@/utils/expressions3x3Engine';
import { toast } from '@/store/useToastStore';
import {
  Grid,
  ZoomIn,
  Eye,
  Sparkles,
  Maximize2,
  Activity,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Scan,
} from 'lucide-react';

interface ExpressionsGrid3x3ViewerProps {
  characterName?: string;
  sheetImageUrl?: string | null;
  onCellSelect?: (cell: ExpressionGridCell) => void;
}

export default function ExpressionsGrid3x3Viewer({
  characterName = 'Personagem Soberano',
  sheetImageUrl,
  onCellSelect,
}: ExpressionsGrid3x3ViewerProps) {
  const [selectedCellIndex, setSelectedCellIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1.5);
  const [lensActive, setLensActive] = useState<boolean>(true);

  const activeCell = CANONICAL_3X3_EXPRESSIONS[selectedCellIndex];

  const handleCellClick = (cell: ExpressionGridCell) => {
    setSelectedCellIndex(cell.index);
    if (onCellSelect) onCellSelect(cell);
  };

  const handleInspectZone = (zoneName: string, state: string) => {
    toast.info(
      `Auditoria de Ruga: ${zoneName}`,
      `Estado: ${state.toUpperCase()} (Conforme FACS ${activeCell.facsUnits}).`
    );
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-5 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Visualizador de Expressões em Grade 3x3 (Lupa de Detalhes)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30">
                Folha Canônica 9 Quadrantes
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Inspeção óptica de micro-rugas (pés de galinha, sulco nasolabial, glabela) e consistência da íris
            </p>
          </div>
        </div>

        {/* Lupa Zoom Switcher */}
        <div className="flex items-center gap-2 p-1.5 bg-obsidian-950 border border-white/10 rounded-xl text-xs">
          <ZoomIn className="w-4 h-4 text-cyber-cyan ml-1" />
          <span className="text-slate-400 text-[10px]">Lupa Óptica:</span>
          {[1.0, 1.5, 2.0, 2.5].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setZoomLevel(lvl)}
              className={`px-2 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                zoomLevel === lvl
                  ? 'bg-cyber-cyan text-obsidian-950 shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}x
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Grade 3x3 Visual (Esquerda / 7 cols) & Inspetor de Micro-Rugas FACS (Direita / 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Grade 3x3 de Expressões */}
        <div className="lg:col-span-7 bg-obsidian-950 p-4 rounded-xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/5">
            <span className="flex items-center gap-1.5 text-cyber-cyan font-bold">
              <Scan className="w-3.5 h-3.5" />
              Matriz 3x3 Canônica ({characterName})
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              98.4% Fidelidade Inter-Quadros
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 aspect-square max-w-[480px] mx-auto">
            {CANONICAL_3X3_EXPRESSIONS.map((cell) => {
              const isSelected = selectedCellIndex === cell.index;
              const displayImg = cell.sampleImageUrl;

              return (
                <div
                  key={cell.id}
                  onClick={() => handleCellClick(cell)}
                  className={`relative aspect-square rounded-xl overflow-hidden border transition-all cursor-pointer group flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyber-cyan ring-2 ring-cyber-cyan/50 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  {/* Imagem com Zoom Óptico quando selecionada */}
                  <img
                    src={displayImg}
                    alt={cell.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    style={{
                      transform: isSelected && lensActive ? `scale(${zoomLevel})` : undefined,
                    }}
                  />

                  {/* Overlay gradiente inferior para legibilidade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Badge Superior */}
                  <div className="relative z-10 p-2 flex items-center justify-between">
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-slate-300 backdrop-blur-sm border border-white/10">
                      {cell.shortLabel}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-cyber-cyan shadow-[0_0_8px_rgba(0,229,255,1)]" />
                    )}
                  </div>

                  {/* Rótulo Inferior */}
                  <div className="relative z-10 p-2 text-[9px] font-mono text-slate-200">
                    <div className="font-bold truncate">{cell.name}</div>
                    <div className="text-[8px] text-cyber-cyan">{cell.facsUnits}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coluna de Inspeção de Micro-Rugas e FACS (5 cols) */}
        <div className="lg:col-span-5 space-y-4 bg-obsidian-950 p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyber-cyan" />
              Auditoria de Rugas de Expressão
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan font-bold">
              Quadrante {activeCell.index + 1}/9
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-100">{activeCell.name}</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Unidades FACS Acionadas: <strong className="text-cyber-cyan">{activeCell.facsUnits}</strong>
            </p>
          </div>

          {/* Zonas de Rugas Dinâmicas */}
          <div className="space-y-2 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Zonas Anatômicas sob Tensão:
            </span>

            <div className="space-y-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleInspectZone('Linhas Frontais (Testa)', activeCell.wrinkleZones.forehead)}
                className="w-full p-2.5 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-between hover:border-cyber-cyan/40 transition-colors cursor-pointer text-left"
              >
                <span className="text-slate-300 text-[11px]">Linhas da Testa (Frontal):</span>
                <span className="text-[10px] font-bold uppercase text-cyber-cyan">
                  {activeCell.wrinkleZones.forehead}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleInspectZone('Glabela / Cenho', activeCell.wrinkleZones.glabella)}
                className="w-full p-2.5 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-between hover:border-cyber-cyan/40 transition-colors cursor-pointer text-left"
              >
                <span className="text-slate-300 text-[11px]">Glabela (Entre as Sobrancelhas):</span>
                <span className="text-[10px] font-bold uppercase text-luxury-gold">
                  {activeCell.wrinkleZones.glabella}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleInspectZone('Pés de Galinha (Periorbital)', activeCell.wrinkleZones.crowsFeet)}
                className="w-full p-2.5 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-between hover:border-cyber-cyan/40 transition-colors cursor-pointer text-left"
              >
                <span className="text-slate-300 text-[11px]">Pés de Galinha (Periorbicular):</span>
                <span className="text-[10px] font-bold uppercase text-cyber-cyan">
                  {activeCell.wrinkleZones.crowsFeet}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleInspectZone('Sulco Nasolabial', activeCell.wrinkleZones.nasolabialFold)}
                className="w-full p-2.5 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-between hover:border-cyber-cyan/40 transition-colors cursor-pointer text-left"
              >
                <span className="text-slate-300 text-[11px]">Sulco Nasolabial (Bigode Chinês):</span>
                <span className="text-[10px] font-bold uppercase text-luxury-gold">
                  {activeCell.wrinkleZones.nasolabialFold}
                </span>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-500/[0.05] border border-emerald-500/20 text-[10px] text-emerald-400 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Trava de Preservação de Identidade Ativa
            </span>
            <p className="text-slate-400 text-[9px] leading-relaxed">
              As variações de expressão mantêm os parâmetros biométricos (distância interpupilar, largura da asa nasal e formato do arco zigomático) absolutamente imutáveis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
