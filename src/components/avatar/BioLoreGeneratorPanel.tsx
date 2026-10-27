'use client';

import React, { useState } from 'react';
import {
  CANONICAL_NICHES,
  CanonicalNicheOption,
  generateCanonicalLore,
} from '@/utils/bioLoreGenerator';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import { AvatarLoreDetails } from '@/types/avatar';
import {
  BookOpen,
  Feather,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  Award,
  Compass,
  MessageSquare,
  Globe,
  Share2,
} from 'lucide-react';

interface BioLoreGeneratorPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function BioLoreGeneratorPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
}: BioLoreGeneratorPanelProps) {
  const { avatars, updateAvatar } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId) || avatars[0];

  const currentNiche = currentAvatar?.soul?.niche || 'Tecnologia & Inteligência Artificial';
  const currentLore = currentAvatar?.soul?.loreDetails;

  // Se o avatar não possuir lore estruturado prévio, gera dinamicamente a partir dos metadados
  const initialLore = currentLore || generateCanonicalLore(
    avatarName,
    currentNiche,
    currentAvatar?.soul?.archetype,
    currentAvatar?.soul?.mbti
  );

  const [nicheInput, setNicheInput] = useState<string>(currentNiche);
  const [bioInput, setBioInput] = useState<string>(currentAvatar?.soul?.bio || initialLore.bio || '');
  const [originStory, setOriginStory] = useState<string>(initialLore.originStory);
  const [marketAuthority, setMarketAuthority] = useState<string>(initialLore.marketAuthority);
  const [toneGuideline, setToneGuideline] = useState<string>(initialLore.toneOfVoiceGuideline);
  const [coreBeliefs, setCoreBeliefs] = useState<string[]>(initialLore.coreBeliefs);
  const [executiveBio, setExecutiveBio] = useState<string>(initialLore.executiveBio || '');
  const [socialBio, setSocialBio] = useState<string>(initialLore.socialBio || '');

  const [newBeliefText, setNewBeliefText] = useState<string>('');
  const [copiedBioType, setCopiedBioType] = useState<string | null>(null);

  const handleSelectNiche = (nicheOption: CanonicalNicheOption) => {
    setNicheInput(nicheOption.name);
    const generated = generateCanonicalLore(
      avatarName,
      nicheOption.name,
      currentAvatar?.soul?.archetype,
      currentAvatar?.soul?.mbti
    );

    setBioInput(generated.bio);
    setOriginStory(generated.originStory);
    setMarketAuthority(generated.marketAuthority);
    setToneGuideline(generated.toneOfVoiceGuideline);
    setCoreBeliefs(generated.coreBeliefs);
    setExecutiveBio(generated.executiveBio || '');
    setSocialBio(generated.socialBio || '');

    if (currentAvatar) {
      updateAvatar(avatarId, {
        soul: {
          ...currentAvatar.soul,
          niche: nicheOption.name,
          bio: generated.bio,
          loreDetails: {
            originStory: generated.originStory,
            marketAuthority: generated.marketAuthority,
            toneOfVoiceGuideline: generated.toneOfVoiceGuideline,
            coreBeliefs: generated.coreBeliefs,
            executiveBio: generated.executiveBio,
            socialBio: generated.socialBio,
          },
        },
      });
    }

    toast.success('Nicho Atualizado!', `Lore regenerado para "${nicheOption.name}".`);
  };

  const handleSaveLore = () => {
    if (!currentAvatar) return;

    const lorePackage: AvatarLoreDetails = {
      originStory,
      marketAuthority,
      toneOfVoiceGuideline: toneGuideline,
      coreBeliefs,
      executiveBio,
      socialBio,
    };

    updateAvatar(avatarId, {
      soul: {
        ...currentAvatar.soul,
        niche: nicheInput,
        bio: bioInput,
        loreDetails: lorePackage,
      },
    });

    toast.success('Lore Salvo com Sucesso!', 'História de origem, autoridade e crenças sincronizadas.');
  };

  const handleRegenerateFromScratch = () => {
    const generated = generateCanonicalLore(
      avatarName,
      nicheInput,
      currentAvatar?.soul?.archetype,
      currentAvatar?.soul?.mbti
    );

    setBioInput(generated.bio);
    setOriginStory(generated.originStory);
    setMarketAuthority(generated.marketAuthority);
    setToneGuideline(generated.toneOfVoiceGuideline);
    setCoreBeliefs(generated.coreBeliefs);
    setExecutiveBio(generated.executiveBio || '');
    setSocialBio(generated.socialBio || '');

    toast.info('Lore Recompilado', 'Nova narrativa canônica gerada a partir do arquétipo.');
  };

  const handleAddBelief = () => {
    const trimmed = newBeliefText.trim();
    if (!trimmed) return;
    setCoreBeliefs([...coreBeliefs, trimmed]);
    setNewBeliefText('');
    toast.success('Crença Adicionada', 'Novo princípio fundamental incorporado à psicologia.');
  };

  const handleRemoveBelief = (index: number) => {
    const updated = coreBeliefs.filter((_, i) => i !== index);
    setCoreBeliefs(updated);
  };

  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBioType(type);
    toast.success('Copiado!', `${type} transferido para a área de transferência.`);
    setTimeout(() => setCopiedBioType(null), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-gold/10 text-cyber-gold border border-cyber-gold/30 shadow-[0_0_12px_rgba(255,215,0,0.15)]">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Gerador de Biografia e Lore Canônico (Origin Story & Authority)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-gold/20 text-cyber-gold font-bold border border-cyber-gold/30">
                Lore Soberano
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              História de origem, autoridade de mercado, diretrizes de tom de voz e crenças para {avatarName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerateFromScratch}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs border border-white/10 transition-colors"
            title="Regenerar biografia a partir do arquétipo"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyber-gold" />
            <span>Regenerar Lore</span>
          </button>

          <button
            onClick={handleSaveLore}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyber-cyan/15 hover:bg-cyber-cyan/25 text-cyber-cyan text-xs font-bold border border-cyber-cyan/30 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Salvar Lore</span>
          </button>
        </div>
      </div>

      {/* Seletor de Nichos Canônicos */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyber-cyan" />
            Nicho de Especialidade do Avatar:
          </span>
          <span className="text-[10px] text-slate-500">Alinha o vocabulário ao mercado de atuação</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {CANONICAL_NICHES.map((niche) => {
            const isSelected = nicheInput === niche.name;
            return (
              <button
                key={niche.id}
                onClick={() => handleSelectNiche(niche)}
                className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                  isSelected
                    ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan font-bold shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                    : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/25 hover:bg-white/5'
                }`}
              >
                <div className="text-[11px] truncate">{niche.name.split(' (')[0]}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">{niche.subtitle.split(',')[0]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de 2 Colunas: História de Origem & Autoridade de Mercado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* História de Origem Canônica */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-purple-400" />
              História de Origem Canônica (Origin Story)
            </span>
            <span className="text-[10px] text-slate-500">Narrativa Primária</span>
          </div>
          <textarea
            rows={5}
            value={originStory}
            onChange={(e) => setOriginStory(e.target.value)}
            placeholder="Como o personagem se formou, suas dores superadas e o início da sua soberania..."
            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-slate-200 text-xs font-sans leading-relaxed focus:border-purple-400 focus:ring-1 focus:ring-purple-400 resize-none"
          />
        </div>

        {/* Autoridade de Mercado & Prova Social */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyber-gold" />
              Autoridade de Mercado & Conquistas (Track Record)
            </span>
            <span className="text-[10px] text-slate-500">Credibilidade</span>
          </div>
          <textarea
            rows={5}
            value={marketAuthority}
            onChange={(e) => setMarketAuthority(e.target.value)}
            placeholder="Métricas de alcance, marcas, marcos e motivos pelos quais a audiência deve confiar..."
            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-slate-200 text-xs font-sans leading-relaxed focus:border-cyber-gold focus:ring-1 focus:ring-cyber-gold resize-none"
          />
        </div>
      </div>

      {/* Diretriz de Tom de Voz & Estilo Narrativo */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-cyber-cyan" />
            Diretriz de Tom de Voz & Estilo Conversacional (Tone of Voice Rulebook)
          </span>
          <span className="text-[10px] text-slate-500">Cadência & Metáforas</span>
        </div>
        <textarea
          rows={3}
          value={toneGuideline}
          onChange={(e) => setToneGuideline(e.target.value)}
          placeholder="Regras de vocabulário, atitude perante dúvidas e postura narrativa..."
          className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-slate-200 text-xs font-sans leading-relaxed focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan resize-none"
        />
      </div>

      {/* Crenças Fundamentais (Inabaláveis) */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-400" />
            Crenças Fundamentais do Personagem (Core Beliefs):
          </span>
          <span className="text-[10px] text-slate-500">{coreBeliefs.length} princípios ativos</span>
        </div>

        <div className="space-y-2">
          {coreBeliefs.map((belief, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-black/60 border border-white/5 text-xs text-slate-200"
            >
              <span className="text-[11px] font-sans flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">{idx + 1}.</span>
                <span>{belief}</span>
              </span>
              <button
                onClick={() => handleRemoveBelief(idx)}
                className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                title="Remover crença"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Adicionar Nova Crença */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={newBeliefText}
            onChange={(e) => setNewBeliefText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddBelief()}
            placeholder="Adicionar novo princípio inegociável da persona..."
            className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-sans"
          />
          <button
            onClick={handleAddBelief}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs border border-emerald-500/30 font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>

      {/* Caixas de Biografias Exportáveis: Executiva & Redes Sociais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bio Executiva (V5 Auto Blog) */}
        <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-cyber-gold" />
              Bio Executiva (Autor V5 Auto Blog):
            </span>
            <button
              onClick={() => handleCopyText(executiveBio, 'Bio Executiva')}
              className="text-[11px] text-cyber-gold hover:underline flex items-center gap-1"
            >
              {copiedBioType === 'Bio Executiva' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
          <textarea
            rows={3}
            value={executiveBio}
            onChange={(e) => setExecutiveBio(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-slate-300 text-xs font-sans leading-relaxed focus:border-cyber-gold resize-none"
          />
        </div>

        {/* Bio Redes Sociais (Instagram/TikTok/X) */}
        <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-cyber-cyan" />
              Bio Redes Sociais (Instagram / X):
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] ${socialBio.length > 160 ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
                {socialBio.length}/160 caracteres
              </span>
              <button
                onClick={() => handleCopyText(socialBio, 'Bio Social')}
                className="text-[11px] text-cyber-cyan hover:underline flex items-center gap-1"
              >
                {copiedBioType === 'Bio Social' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <textarea
            rows={3}
            value={socialBio}
            onChange={(e) => setSocialBio(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-slate-300 text-xs font-sans leading-relaxed focus:border-cyber-cyan resize-none"
          />
        </div>
      </div>
    </div>
  );
}
