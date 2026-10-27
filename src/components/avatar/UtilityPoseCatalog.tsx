'use client';

import React, { useState } from 'react';
import {
  CANONICAL_UTILITY_POSES,
  UtilityPoseItem,
  PoseCategory,
  compileUtilityPosePrompt,
} from '@/utils/utilityPosesCatalog';
import { toast } from '@/store/useToastStore';
import {
  Hand,
  ShoppingBag,
  Sparkles,
  Copy,
  Check,
  ShieldCheck,
  Camera,
  Layers,
  ArrowUpRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';

interface UtilityPoseCatalogProps {
  characterName?: string;
  defaultAttire?: string;
  onPoseSelected?: (pose: UtilityPoseItem, compiledPrompt: string) => void;
}

export default function UtilityPoseCatalog({
  characterName = 'Personagem Soberano',
  defaultAttire = 'Traje executivo moderno com tecido refinado',
  onPoseSelected,
}: UtilityPoseCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<PoseCategory>('all');
  const [activePoseId, setActivePoseId] = useState<string>('holding_product_fines');
  const [customProduct, setCustomProduct] = useState('Smart Gadget V5 Fines 4K');
  const [customAttire, setCustomAttire] = useState(defaultAttire);
  const [copied, setCopied] = useState(false);

  const activePose =
    CANONICAL_UTILITY_POSES.find((p) => p.id === activePoseId) || CANONICAL_UTILITY_POSES[0];

  const filteredPoses =
    selectedCategory === 'all'
      ? CANONICAL_UTILITY_POSES
      : CANONICAL_UTILITY_POSES.filter((p) => p.category === selectedCategory);

  const { positivePrompt, negativePrompt } = compileUtilityPosePrompt(
    activePose,
    characterName,
    customAttire,
    customProduct
  );

  const handleSelectPose = (pose: UtilityPoseItem) => {
    setActivePoseId(pose.id);
    const compiled = compileUtilityPosePrompt(pose, characterName, customAttire, customProduct);
    if (onPoseSelected) {
      onPoseSelected(pose, compiled.positivePrompt);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(positivePrompt);
    setCopied(true);
    toast.success(
      'Prompt de Pose Copiado!',
      `Pose "${activePose.name}" compilada com salvaguardas anatômicas de mãos.`
    );
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-5 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 shadow-glow-gold">
            <Hand className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Catálogo de Poses Utilitárias (Fines & Auto Blog)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30">
                {CANONICAL_UTILITY_POSES.length} Poses Homologadas
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Poses funcionais para criativos de UGC do Fines, cards de autor do Autoblog e ganchos do V5 Prisma
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-obsidian-950 border border-white/10 rounded-xl text-xs">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'ugc_fines', label: 'UGC & Produtos' },
            { id: 'authority', label: 'Autoridade & Blog' },
            { id: 'storytelling', label: 'Storytelling' },
            { id: 'call_to_action', label: 'CTA' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as PoseCategory)}
              className={`px-2.5 py-1.2 rounded-lg font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-luxury-gold text-obsidian-950 shadow-glow-gold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Cartões de Pose (Esquerda / 7 cols) & Compilador Paramétrico de UGC (Direita / 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Lista de Poses */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredPoses.map((pose) => {
            const isSelected = activePoseId === pose.id;
            return (
              <div
                key={pose.id}
                onClick={() => handleSelectPose(pose)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between h-full ${
                  isSelected
                    ? 'border-luxury-gold bg-luxury-gold/10 shadow-[0_0_15px_rgba(212,175,55,0.15)] ring-1 ring-luxury-gold/30'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-1.5">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                      {pose.categoryLabel}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-luxury-gold" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 mt-1 line-clamp-1">
                    {pose.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {pose.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[9px] text-slate-500">
                  <span className="flex items-center gap-1 text-cyber-cyan">
                    <Camera className="w-3 h-3" />
                    {pose.cameraFraming}
                  </span>
                  <span className="text-luxury-gold font-bold">Selecionar</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compilador e Painel de Injeção de Produto (Direita) */}
        <div className="lg:col-span-5 space-y-4 bg-obsidian-950 p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-luxury-gold" />
              Injetor Comercial V5 Finders
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-luxury-gold/20 text-luxury-gold font-bold">
              UGC Ready
            </span>
          </div>

          {/* Campo de Produto do Fines */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 block font-bold">
              Produto Minerado (Fines / Shopee / Ali):
            </label>
            <input
              type="text"
              value={customProduct}
              onChange={(e) => setCustomProduct(e.target.value)}
              placeholder="ex: Massageador Cervical Portátil Ultra"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-luxury-gold font-sans"
            />
          </div>

          {/* Campo de Vestimenta */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 block font-bold">
              Traje do Personagem para o Criativo:
            </label>
            <input
              type="text"
              value={customAttire}
              onChange={(e) => setCustomAttire(e.target.value)}
              placeholder="ex: Camiseta preta minimalista e jaqueta jeans"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyber-cyan font-sans"
            />
          </div>

          {/* Preview do Prompt Compilado */}
          <div className="p-3 rounded-lg bg-black/50 border border-white/5 space-y-2">
            <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-luxury-gold" />
              Prompt Positivo Compilado:
            </span>
            <p className="text-[10px] text-slate-300 font-sans leading-relaxed line-clamp-4">
              "{positivePrompt}"
            </p>
          </div>

          {/* Salvaguardas Negativas Anti-Deformação de Mãos */}
          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
            <span className="text-[9px] text-emerald-400 block font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Filtro Anti-Deformação de Dedos Ativo
            </span>
            <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-2">
              Negative: {negativePrompt}
            </p>
          </div>

          {/* Botão de Cópia */}
          <button
            type="button"
            onClick={handleCopyPrompt}
            className="w-full py-2.5 px-3 rounded-xl bg-luxury-gold text-obsidian-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all cursor-pointer shadow-glow-gold"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Prompt Copiado!' : 'Copiar Prompt da Pose'}
          </button>
        </div>
      </div>
    </div>
  );
}
