'use client';

import React, { useState } from 'react';
import {
  CANONICAL_VISEMES_CATALOG,
  VisemeMetadata,
  buildBroadcasterVisemesManifest,
} from '@/utils/visemesEngine';
import { VisemeType } from '@/types/avatar';
import { toast } from '@/store/useToastStore';
import {
  Mic,
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  Volume2,
  Sliders,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface VisemesCanonicalTableProps {
  avatarId?: string;
  avatarName?: string;
  onSelectViseme?: (viseme: VisemeMetadata) => void;
}

export default function VisemesCanonicalTable({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
  onSelectViseme,
}: VisemesCanonicalTableProps) {
  const [selectedType, setSelectedType] = useState<VisemeType>('A_I');
  const [copied, setCopied] = useState(false);

  const visemeList = Object.values(CANONICAL_VISEMES_CATALOG);
  const activeViseme = CANONICAL_VISEMES_CATALOG[selectedType];

  const handleSelect = (v: VisemeMetadata) => {
    setSelectedType(v.type);
    if (onSelectViseme) onSelectViseme(v);
  };

  const handleCopyManifest = () => {
    const manifest = buildBroadcasterVisemesManifest(avatarId, avatarName);
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    setCopied(true);
    toast.success(
      'Manifesto de Visemas Copiado!',
      `${visemeList.length} visemas canônicos prontos para o Lip-Sync do V5 Broadcaster (:3008).`
    );
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(activeViseme.promptDescription);
    toast.success('Prompt de Visema Copiado!', `Diretiva de boca para "${activeViseme.name}".`);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-5 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Tabela de Visemas Canônicos da Fala (Lip-Sync Engine)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30">
                7 Visemas Padrão Rhubarb / Oculus
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Mapeamento biomecânico de boca, lábios, dentes e língua para sincronia labial realista com V5 Sound & Broadcaster
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyManifest}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-950 border border-white/15 text-slate-300 text-xs font-bold hover:border-cyber-cyan hover:text-cyber-cyan transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-cyber-cyan" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Manifesto Copiado!' : 'Copiar Manifesto JSON'}
        </button>
      </div>

      {/* Grid: 7 Cards de Visemas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {visemeList.map((v) => {
          const isSelected = selectedType === v.type;
          return (
            <div
              key={v.type}
              onClick={() => handleSelect(v)}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between select-none ${
                isSelected
                  ? 'border-cyber-cyan bg-cyber-cyan/10 shadow-[0_0_15px_rgba(0,229,255,0.2)] ring-1 ring-cyber-cyan/50'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[9px] mb-1">
                  <span className="font-mono px-1 rounded bg-white/5 text-slate-400">
                    Rhubarb: {v.rhubarbCode}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />}
                </div>

                {/* Ilustração Vetorial da Geometria da Boca */}
                <div className="w-full aspect-square max-h-[64px] mx-auto my-1 flex items-center justify-center bg-obsidian-950 rounded-lg border border-white/5 p-1">
                  <svg viewBox="0 0 100 50" className="w-full h-full">
                    {/* Cavidade Oral / Fundo Escuro */}
                    <path
                      d={v.svgPath.innerMouth}
                      fill="#1E0A0A"
                      stroke="#4A0E17"
                      strokeWidth="1.5"
                    />
                    {/* Dentes */}
                    {v.svgPath.teeth && (
                      <path d={v.svgPath.teeth} fill="#F3F4F6" opacity="0.9" />
                    )}
                    {/* Língua */}
                    {v.svgPath.tongue && (
                      <path d={v.svgPath.tongue} fill="#EF4444" opacity="0.8" />
                    )}
                    {/* Contorno dos Lábios */}
                    <path
                      d={v.svgPath.outerLip}
                      fill="none"
                      stroke={isSelected ? '#00E5FF' : '#D4AF37'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="text-xs font-bold text-slate-200 truncate mt-1">
                  {v.name.split(' ')[0]}
                </div>
                <div className="text-[9px] text-slate-400 truncate">
                  {v.name.split('(')[1]?.replace(')', '') || v.type}
                </div>
              </div>

              {/* Badges de Fonemas */}
              <div className="flex flex-wrap items-center justify-center gap-1 mt-2 pt-2 border-t border-white/5">
                {v.phonemes.slice(0, 3).map((ph, idx) => (
                  <span
                    key={idx}
                    className="text-[8px] font-mono px-1 rounded bg-black/40 text-slate-400"
                  >
                    /{ph}/
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Painel de Inspeção Detalhada do Visema Ativo */}
      <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Coluna 1: Info e Descrição Biomecânica (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyber-cyan flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              {activeViseme.code}: {activeViseme.name}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-luxury-gold/20 text-luxury-gold font-bold">
              Oculus: {activeViseme.oculusCode}
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            {activeViseme.biomechanicalDescription}
          </p>

          <div className="pt-2 flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold">Fonemas Associados:</span>
            <div className="flex flex-wrap gap-1">
              {activeViseme.phonemes.map((ph, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-cyber-cyan border border-white/10"
                >
                  /{ph}/
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna 2: Métricas Geométricas e Prompt de Boca (5 cols) */}
        <div className="lg:col-span-5 space-y-3 p-3 rounded-lg bg-black/40 border border-white/5">
          {/* Barras de Geometria */}
          <div className="space-y-1.5 text-[10px]">
            <div className="flex justify-between text-slate-400">
              <span>Abertura Vertical (Jaw Drop):</span>
              <span className="text-cyber-cyan font-bold font-mono">
                {Math.round(activeViseme.geometry.verticalAperture * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyber-cyan rounded-full transition-all"
                style={{ width: `${activeViseme.geometry.verticalAperture * 100}%` }}
              />
            </div>

            <div className="flex justify-between text-slate-400 pt-1">
              <span>Visibilidade Dental Superior:</span>
              <span className="text-luxury-gold font-bold font-mono">
                {Math.round(activeViseme.geometry.upperTeethVisibility * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-luxury-gold rounded-full transition-all"
                style={{ width: `${activeViseme.geometry.upperTeethVisibility * 100}%` }}
              />
            </div>
          </div>

          {/* Botão de Cópia da Diretiva de Boca */}
          <button
            type="button"
            onClick={handleCopyPrompt}
            className="w-full py-2 px-3 rounded-lg bg-white/5 text-slate-200 border border-white/10 hover:border-cyber-cyan hover:text-cyber-cyan text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Copy className="w-3 h-3" />
            Copiar Diretiva de Boca para Prompt
          </button>
        </div>
      </div>
    </div>
  );
}
