'use client';

import React, { useState, useMemo } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  UgcProductItem,
  UgcPoseType,
  MINED_PRODUCTS_V5_FINDERS,
  CANONICAL_UGC_POSES,
  compileUgcProductPrompts,
  exportUgcPosePackageJson,
  UgcPosePackage,
} from '@/utils/ugcProductPoseEngine';
import {
  ShoppingBag,
  Sparkles,
  Hand,
  Layers,
  Copy,
  Check,
  Download,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Package,
  TrendingUp,
  Tag,
  Camera,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

interface UgcProductPoseGeneratorPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function UgcProductPoseGeneratorPanel({
  avatarId,
  avatarName,
}: UgcProductPoseGeneratorPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const targetName = currentAvatar?.name || avatarName || 'Maya Vance';

  const [selectedProductId, setSelectedProductId] = useState<string>('prod_earbuds_tws');
  const [selectedPoseId, setSelectedPoseId] = useState<UgcPoseType>('holding_palm_flat');
  const [copiedSingle, setCopiedSingle] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const selectedProduct = useMemo(() => {
    return (
      MINED_PRODUCTS_V5_FINDERS.find((p) => p.id === selectedProductId) ||
      MINED_PRODUCTS_V5_FINDERS[0]
    );
  }, [selectedProductId]);

  const ugcPackage: UgcPosePackage = useMemo(() => {
    return compileUgcProductPrompts(selectedProduct, currentAvatar);
  }, [selectedProduct, currentAvatar]);

  const activePrompt = useMemo(() => {
    return ugcPackage.prompts.find((p) => p.poseId === selectedPoseId) || ugcPackage.prompts[0];
  }, [ugcPackage.prompts, selectedPoseId]);

  const activePoseDef = CANONICAL_UGC_POSES[selectedPoseId];

  const handleCopySingle = () => {
    navigator.clipboard.writeText(activePrompt.positivePrompt);
    setCopiedSingle(true);
    setTimeout(() => setCopiedSingle(false), 2000);
  };

  const handleCopyAll = () => {
    const text = ugcPackage.prompts
      .map(
        (p) =>
          `[POSE UGC: ${p.poseTitle.toUpperCase()}]\n` +
          `PRODUTO: ${p.productName} (${p.category})\n` +
          `OBJETIVO: ${p.conversionRole}\n` +
          `PROMPT POSITIVO:\n${p.positivePrompt}\n\n` +
          `PROMPT NEGATIVO:\n${p.negativePrompt}\n`
      )
      .join('\n----------------------------------------\n\n');

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(0,229,255,0.08)] space-y-6">
      {/* Header do Painel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            Fase 9 · Etapa 088 · Conector V5 Finders
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Gerador de Poses de Apresentador UGC (V5 Finders)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Geração de poses de alta conversão segurando produtos minerados, com interação de mãos anatomicamente blindada contra deformações.
          </p>
        </div>

        {/* Badges de Telemetria e Ações Globais */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-obsidian-950 border border-emerald-500/30 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-400">Blindagem de Dedos</div>
              <div className="text-xs font-bold text-emerald-400">100% Anti-Glitch</div>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-obsidian-950 border border-cyber-cyan/30 flex items-center gap-2.5">
            <Package className="w-4 h-4 text-cyber-cyan" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-400">Poses Canônicas</div>
              <div className="text-xs font-bold text-cyber-cyan">6 Formatos UGC</div>
            </div>
          </div>

          <button
            onClick={() => exportUgcPosePackageJson(ugcPackage)}
            className="px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-400/40 text-purple-300 hover:bg-purple-500/25 transition-all text-xs font-mono font-semibold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Exportar JSON (.v5ugcposes)
          </button>
        </div>
      </div>

      {/* Seletor de Produtos Minerados do V5 Finders */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Produtos Minerados em Alta no V5 Finders (Ofertas Virais):
          </span>
          <span className="text-slate-500 text-[11px]">Shopee · AliExpress · TikTok Shop</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {MINED_PRODUCTS_V5_FINDERS.map((prod) => {
            const isSelected = selectedProductId === prod.id;
            return (
              <button
                key={prod.id}
                onClick={() => setSelectedProductId(prod.id)}
                className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyber-cyan/15 border-cyber-cyan shadow-[0_0_15px_rgba(0,229,255,0.15)] ring-1 ring-cyber-cyan'
                    : 'bg-obsidian-950 border-white/5 hover:border-white/20 text-slate-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 uppercase">
                      {prod.category.replace('_', ' ')}
                    </span>
                    <span className="text-emerald-400 font-bold">{prod.minedPriceBrl.split(' ')[1]}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">{prod.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {prod.keyFeature}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 text-[10px] font-mono text-cyber-cyan flex items-center justify-between">
                  <span>Marca: {prod.brandPlaceholder}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Galeria de Poses Canônicas UGC */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold flex items-center gap-1.5">
            <Hand className="w-4 h-4 text-cyber-cyan" />
            Catálogo de Poses UGC de Apresentador:
          </span>
          <button
            onClick={handleCopyAll}
            className="text-cyber-cyan hover:underline flex items-center gap-1"
          >
            {copiedAll ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copiedAll ? 'Copiado!' : 'Copiar Todas as 6 Poses'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {Object.values(CANONICAL_UGC_POSES).map((pose) => {
            const isSelected = selectedPoseId === pose.id;
            return (
              <button
                key={pose.id}
                onClick={() => setSelectedPoseId(pose.id)}
                className={`p-3 rounded-lg border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyber-cyan/20 border-cyber-cyan shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                    : 'bg-obsidian-950 border-white/5 hover:border-white/20 text-slate-400'
                }`}
              >
                <div>
                  <div className="text-[10px] font-mono text-cyber-cyan font-bold mb-1">
                    UGC #{pose.id.split('_')[0].toUpperCase()}
                  </div>
                  <div className="text-xs font-bold text-slate-200 line-clamp-2">
                    {pose.title}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-white/5 text-[9px] font-mono text-slate-500 uppercase">
                  9:16 Vertical
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ficha da Pose & Inspetor de Prompt */}
      <div className="bg-obsidian-950 border border-cyber-cyan/20 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan text-xs font-mono font-bold">
                POSE CANÔNICA UGC
              </span>
              <h3 className="text-base font-bold text-white">{activePoseDef.title}</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Produto: <strong className="text-white">{selectedProduct.name}</strong> ({selectedProduct.minedPriceBrl})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySingle}
              className="px-3.5 py-1.5 rounded-lg bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/25 transition-all text-xs font-mono font-semibold flex items-center gap-1.5"
            >
              {copiedSingle ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSingle ? 'Copiado!' : 'Copiar Prompt Positivo'}
            </button>
          </div>
        </div>

        {/* Travas Anti-Glitch e Interação das Mãos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-obsidian-900 p-3.5 rounded-lg border border-white/5 space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-cyber-cyan font-bold block">
              Interação Física das Mãos:
            </span>
            <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
              {activePoseDef.handInteraction}
            </p>
          </div>

          <div className="bg-obsidian-900 p-3.5 rounded-lg border border-white/5 space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
              Travas Anti-Glitch de Dedos (Anti-Morphing):
            </span>
            <ul className="text-slate-300 space-y-1 list-disc list-inside text-[11px] font-mono">
              {activePoseDef.antiFingerGlitchConstraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Prompt Positivo Compilado */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Prompt Positivo Injetado (Flux 1.0 Dev / SDXL LoRA / Wan 2.1):
            </span>
            <span className="font-mono text-slate-500 text-[11px]">1080x1920 (9:16) · UGC Standard</span>
          </div>
          <pre className="p-3 bg-obsidian-900 rounded-lg text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed border border-white/5 select-all">
            {activePrompt.positivePrompt}
          </pre>
        </div>

        {/* Prompt Negativo de Mãos */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
            Filtro Negativo Anti-Deformação de Mãos e Produto:
          </span>
          <pre className="p-2.5 bg-obsidian-900/70 rounded-lg text-[11px] font-mono text-rose-300/80 whitespace-pre-wrap leading-relaxed border border-rose-900/20 select-all">
            {activePrompt.negativePrompt}
          </pre>
        </div>
      </div>
    </div>
  );
}
