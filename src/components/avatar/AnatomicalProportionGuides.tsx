'use client';

import React, { useState } from 'react';
import {
  HeadCanon,
  BiotypeCategory,
  CANONICAL_HEAD_CANONS,
  compileAnatomicalDirective,
} from '@/utils/anatomicalProportionEngine';
import { toast } from '@/store/useToastStore';
import {
  Ruler,
  User,
  Sparkles,
  Sliders,
  Copy,
  Check,
  Eye,
  EyeOff,
  MoveVertical,
  Activity,
  Layers,
  ShieldCheck,
  Compass,
} from 'lucide-react';

interface AnatomicalProportionGuidesProps {
  onDirectiveChange?: (directive: string) => void;
  previewImageUrl?: string | null;
}

export default function AnatomicalProportionGuides({
  onDirectiveChange,
  previewImageUrl,
}: AnatomicalProportionGuidesProps) {
  const [selectedCanon, setSelectedCanon] = useState<HeadCanon>(8.0);
  const [biotype, setBiotype] = useState<BiotypeCategory>('athletic');
  const [gender, setGender] = useState<'female' | 'male' | 'androgynous'>('androgynous');
  const [showCenterAxis, setShowCenterAxis] = useState(true);
  const [showRulerLabels, setShowRulerLabels] = useState(true);
  const [showGoldenRatio, setShowGoldenRatio] = useState(true);
  const [guideOpacity, setGuideOpacity] = useState(70);
  const [copied, setCopied] = useState(false);

  const canonProfile = CANONICAL_HEAD_CANONS[selectedCanon];
  const compiledDirective = compileAnatomicalDirective(
    selectedCanon,
    biotype,
    gender,
    showGoldenRatio
  );

  const handleCanonSelect = (canon: HeadCanon) => {
    setSelectedCanon(canon);
    if (onDirectiveChange) {
      onDirectiveChange(compileAnatomicalDirective(canon, biotype, gender, showGoldenRatio));
    }
  };

  const handleCopyDirective = () => {
    navigator.clipboard.writeText(compiledDirective);
    setCopied(true);
    toast.success(
      'Diretiva Anatômica Copiada!',
      `Cânone de ${selectedCanon} cabeças compilado para o prompt de difusão.`
    );
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-5 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Sistema de Guias de Proporção Anatômica
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30">
                {selectedCanon} Cabeças
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Calibração métrica de biotipo, cabeças de altura, simetria sagital e proporção áurea (Phi)
            </p>
          </div>
        </div>

        {/* Cânone Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-obsidian-950 border border-white/10 rounded-xl text-xs">
          {([7.0, 7.5, 8.0, 8.5] as HeadCanon[]).map((canon) => (
            <button
              key={canon}
              type="button"
              onClick={() => handleCanonSelect(canon)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedCanon === canon
                  ? 'bg-cyber-cyan text-obsidian-950 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {canon} H
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Preview com Réguas Interativas à Esquerda & Controles Paramétricos à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna Visual: Manequim / Imagem com Linhas de Proporção SVG (5 cols) */}
        <div className="lg:col-span-5 bg-obsidian-950 rounded-xl p-4 border border-white/10 flex flex-col items-center">
          <div className="flex items-center justify-between w-full pb-2 mb-2 border-b border-white/5 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-cyber-cyan font-bold">
              <MoveVertical className="w-3.5 h-3.5" />
              Eixo Cefalocaudal ({selectedCanon} Segmentos)
            </span>
            <span className="text-[10px] text-slate-500">Escala 1:1 Normalizada</span>
          </div>

          {/* Canvas / Viewport com Manequim e Guias */}
          <div className="relative w-full aspect-[9/16] max-w-[280px] bg-gradient-to-b from-obsidian-900 via-obsidian-950 to-black rounded-lg border border-white/10 overflow-hidden flex items-center justify-center">
            {/* Imagem de Fundo (se houver) ou Silhueta Vetorial */}
            {previewImageUrl ? (
              <img
                src={previewImageUrl}
                alt="Avatar Reference"
                className="absolute inset-0 w-full h-full object-contain opacity-70"
              />
            ) : (
              /* Silhueta Anatômica Neutra T-Pose SVG */
              <svg
                viewBox="0 0 200 400"
                className="absolute inset-0 w-full h-full object-contain opacity-25 text-slate-400"
                fill="currentColor"
              >
                {/* Cabeça */}
                <ellipse cx="100" cy="30" rx="14" ry="18" />
                {/* Pescoço */}
                <rect x="94" y="48" width="12" height="12" rx="2" />
                {/* Tronco */}
                <path d="M 70 60 L 130 60 L 122 150 L 115 190 L 85 190 L 78 150 Z" />
                {/* Braços T-Pose estendidos */}
                <rect x="15" y="62" width="60" height="12" rx="4" />
                <rect x="125" y="62" width="60" height="12" rx="4" />
                {/* Pernas */}
                <rect x="83" y="195" width="14" height="185" rx="5" />
                <rect x="103" y="195" width="14" height="185" rx="5" />
              </svg>
            )}

            {/* Linha Central Sagital de Simetria */}
            {showCenterAxis && (
              <div
                className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-cyber-cyan/50 -translate-x-1/2 pointer-events-none"
                style={{ opacity: guideOpacity / 100 }}
              >
                <div className="absolute top-2 left-1 text-[8px] text-cyber-cyan bg-obsidian-950/80 px-1 rounded">
                  Eixo 0
                </div>
              </div>
            )}

            {/* Linhas Horizontais Paramétricas dos Segmentos Anatômicos */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ opacity: guideOpacity / 100 }}
            >
              {canonProfile.landmarks.map((mark, idx) => (
                <div
                  key={idx}
                  className="absolute left-0 right-0 flex items-center"
                  style={{ top: `${mark.percentage}%` }}
                >
                  <div
                    className={`w-full h-[1px] ${
                      mark.isMajorAxis
                        ? 'bg-cyber-cyan shadow-[0_0_8px_rgba(0,229,255,0.7)]'
                        : 'bg-white/20 border-t border-dashed border-white/30'
                    }`}
                  />
                  {showRulerLabels && (
                    <span
                      className={`absolute right-1 -top-2 text-[8px] font-mono px-1 py-0.2 rounded ${
                        mark.isMajorAxis
                          ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/40'
                          : 'bg-obsidian-950/90 text-slate-400'
                      }`}
                    >
                      {mark.headIndex}H · {mark.label}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Proporção Áurea (Phi 1.618) - Ombro vs Cintura */}
            {showGoldenRatio && (
              <div
                className="absolute inset-x-4 top-[24%] bottom-[50%] border border-luxury-gold/40 rounded-sm pointer-events-none flex items-center justify-center"
                style={{ opacity: guideOpacity / 100 }}
              >
                <span className="text-[8px] text-luxury-gold bg-obsidian-950/90 px-1 rounded border border-luxury-gold/30">
                  Φ 1.618 (Ombro/Cintura)
                </span>
              </div>
            )}
          </div>

          {/* Status do Cânone Ativo */}
          <div className="w-full mt-3 p-2 rounded-lg bg-white/[0.02] border border-white/5 text-center">
            <span className="text-[11px] text-cyber-cyan font-bold block">
              {canonProfile.name}
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5">
              {canonProfile.description}
            </span>
          </div>
        </div>

        {/* Coluna Controles Paramétricos & Diretivas de Prompt (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Informações de Biotipo e Fisiologia */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyber-cyan" />
              Morfologia & Biotipo Estrutural
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'athletic', label: 'Atlético', sub: 'Musculatura Definida' },
                { id: 'fashion_slim', label: 'Fashion Slim', sub: 'Longilíneo Pasarela' },
                { id: 'mesomorph', label: 'Mesomorfo', sub: 'Equilíbrio Clássico' },
                { id: 'ectomorph', label: 'Ectomorfo', sub: 'Fino / Ebelto' },
                { id: 'endomorph', label: 'Endomorfo', sub: 'Robusto / Curvilíneo' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBiotype(item.id as BiotypeCategory)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    biotype === item.id
                      ? 'border-cyber-cyan bg-cyber-cyan/10 text-white shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Gênero / Estrutura da Silhueta */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-luxury-gold" />
              Curvatura da Silhueta
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'female', label: 'Feminino (Ampulheta)' },
                { id: 'male', label: 'Masculino (V-Taper)' },
                { id: 'androgynous', label: 'Andrógino (Harmônico)' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGender(g.id as any)}
                  className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                    gender === g.id
                      ? 'border-luxury-gold bg-luxury-gold/10 text-luxury-gold shadow-glow-gold'
                      : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles de Camadas de Guia e Opacidade */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyber-cyan" />
                Camadas de Inspeção e Opacidade
              </span>
              <span className="text-[10px] text-cyber-cyan font-mono">{guideOpacity}%</span>
            </div>

            {/* Slider de Opacidade */}
            <input
              type="range"
              min="20"
              max="100"
              value={guideOpacity}
              onChange={(e) => setGuideOpacity(Number(e.target.value))}
              className="w-full accent-cyber-cyan bg-obsidian-950 h-1.5 rounded-lg appearance-none cursor-pointer"
            />

            {/* Toggles Interativos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCenterAxis(!showCenterAxis)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10px] border transition-colors cursor-pointer ${
                  showCenterAxis
                    ? 'border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan'
                    : 'border-white/10 text-slate-500'
                }`}
              >
                <span>Eixo Sagital</span>
                {showCenterAxis ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>

              <button
                type="button"
                onClick={() => setShowRulerLabels(!showRulerLabels)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10px] border transition-colors cursor-pointer ${
                  showRulerLabels
                    ? 'border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan'
                    : 'border-white/10 text-slate-500'
                }`}
              >
                <span>Rótulos (H)</span>
                {showRulerLabels ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>

              <button
                type="button"
                onClick={() => setShowGoldenRatio(!showGoldenRatio)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10px] border transition-colors cursor-pointer ${
                  showGoldenRatio
                    ? 'border-luxury-gold/40 bg-luxury-gold/10 text-luxury-gold'
                    : 'border-white/10 text-slate-500'
                }`}
              >
                <span>Proporção Áurea</span>
                {showGoldenRatio ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Diretiva Anatômica Compilada para Prompt */}
          <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-cyber-cyan" />
                Diretiva de Difusão Anatômica Homologada
              </span>
              <button
                type="button"
                onClick={handleCopyDirective}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyber-cyan text-obsidian-950 text-[10px] font-bold hover:bg-cyan-300 transition-colors cursor-pointer shadow-[0_0_10px_rgba(0,229,255,0.3)]"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copiado!' : 'Copiar Diretiva'}
              </button>
            </div>
            <p className="text-[11px] text-slate-300 bg-white/[0.03] p-2 rounded-lg border border-white/5 leading-relaxed font-sans">
              "{compiledDirective}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
