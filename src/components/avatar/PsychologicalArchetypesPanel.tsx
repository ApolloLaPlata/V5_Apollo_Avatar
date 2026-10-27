'use client';

import React, { useState } from 'react';
import { ArchetypeCategory, BigFiveTraits } from '@/types/avatar';
import {
  CANONICAL_JUNGIAN_ARCHETYPES,
  CANONICAL_MBTI_PROFILES,
  getJungianArchetype,
  getMBTIProfile,
  compileSoulPromptFragment,
  JungianArchetypeDetail,
  MBTIProfile,
} from '@/utils/psychologicalArchetypesEngine';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  Brain,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Sliders,
  RotateCcw,
  Code,
  Heart,
  Compass,
  Crown,
  BookOpen,
  Smile,
  Flame,
  Users,
  Wand2,
} from 'lucide-react';

interface PsychologicalArchetypesPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function PsychologicalArchetypesPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
}: PsychologicalArchetypesPanelProps) {
  const { avatars, updateAvatar } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId) || avatars[0];

  const currentArchetypeId: ArchetypeCategory = currentAvatar?.soul?.archetype || 'creator';
  const currentMbti: string = currentAvatar?.soul?.mbti || 'ENFP';

  const defaultBigFive: BigFiveTraits = {
    openness: 90,
    conscientiousness: 75,
    extraversion: 78,
    agreeableness: 70,
    emotionalStability: 80,
  };

  const [selectedArchetypeId, setSelectedArchetypeId] = useState<ArchetypeCategory>(currentArchetypeId);
  const [selectedMbti, setSelectedMbti] = useState<string>(currentMbti);
  const [bigFive, setBigFive] = useState<BigFiveTraits>(currentAvatar?.soul?.bigFive || defaultBigFive);

  const [activeTab, setActiveTab] = useState<'jungian' | 'mbti' | 'bigfive'>('jungian');
  const [showPromptSnippet, setShowPromptSnippet] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  const activeArchetype = getJungianArchetype(selectedArchetypeId);
  const activeMbtiProfile = getMBTIProfile(selectedMbti);

  const archetypeKeys = Object.keys(CANONICAL_JUNGIAN_ARCHETYPES) as ArchetypeCategory[];
  const mbtiKeys = Object.keys(CANONICAL_MBTI_PROFILES);

  const updateStoreSoul = (arch: ArchetypeCategory, mbti: string, b5: BigFiveTraits) => {
    if (!currentAvatar) return;
    const archDetail = getJungianArchetype(arch);

    updateAvatar(avatarId, {
      soul: {
        ...currentAvatar.soul,
        archetype: arch,
        mbti,
        bigFive: b5,
        personalityTraits: archDetail.recommendedTraits,
      },
    });
  };

  const handleSelectArchetype = (arch: ArchetypeCategory) => {
    setSelectedArchetypeId(arch);
    const detail = getJungianArchetype(arch);
    setSelectedMbti(detail.recommendedMBTI);
    setBigFive(detail.recommendedBigFive);
    updateStoreSoul(arch, detail.recommendedMBTI, detail.recommendedBigFive);

    toast.success(
      `Arquétipo Atualizado: ${detail.name}`,
      `Traços e MBTI ajustados para ${detail.categoryTitle}.`
    );
  };

  const handleSelectMbti = (code: string) => {
    setSelectedMbti(code);
    updateStoreSoul(selectedArchetypeId, code, bigFive);
    toast.info('Perfil MBTI Atualizado', `Cognição configurada para ${code} - ${CANONICAL_MBTI_PROFILES[code]?.name}.`);
  };

  const handleBigFiveChange = (key: keyof BigFiveTraits, value: number) => {
    const updated = { ...bigFive, [key]: value };
    setBigFive(updated);
    updateStoreSoul(selectedArchetypeId, selectedMbti, updated);
  };

  const handleResetToArchetypeDefaults = () => {
    const detail = getJungianArchetype(selectedArchetypeId);
    setSelectedMbti(detail.recommendedMBTI);
    setBigFive(detail.recommendedBigFive);
    updateStoreSoul(selectedArchetypeId, detail.recommendedMBTI, detail.recommendedBigFive);
    toast.info('Padrão Restaurado', 'Valores de Big Five e MBTI redefinidos para os ideais do arquétipo.');
  };

  const promptFragment = compileSoulPromptFragment(selectedArchetypeId, selectedMbti, bigFive);

  const handleCopyPromptFragment = () => {
    navigator.clipboard.writeText(promptFragment);
    setCopiedSnippet(true);
    toast.success('Prompt Copiado!', 'DNA Psicológico compilado copiado para a área de transferência.');
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Arquiteto de Arquétipos Psicológicos (Soul DNA Architecture)
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${activeArchetype.color} bg-white/5 border-white/10`}>
                {activeArchetype.name} · {selectedMbti}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Pilares cognitivos triplos: Jungiano, MBTI e Traços Big Five (OCEAN) para {avatarName}
            </p>
          </div>
        </div>

        {/* Abas Superiores & Ações */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('jungian')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                activeTab === 'jungian'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1. Jungiano
            </button>
            <button
              onClick={() => setActiveTab('mbti')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                activeTab === 'mbti'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2. MBTI
            </button>
            <button
              onClick={() => setActiveTab('bigfive')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                activeTab === 'bigfive'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3. Big Five (OCEAN)
            </button>
          </div>

          <button
            onClick={() => setShowPromptSnippet(!showPromptSnippet)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs border transition-colors ${
              showPromptSnippet
                ? 'bg-cyber-cyan/20 border-cyber-cyan/40 text-cyber-cyan'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showPromptSnippet ? 'Ocultar Prompt' : 'Ver Prompt'}</span>
          </button>
        </div>
      </div>

      {/* 1. SEÇÃO ARQUÉTIPOS JUNGIANOS */}
      {activeTab === 'jungian' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              10 Arquétipos Universais Canônicos da Holding:
            </span>
            <span className="text-[11px] text-slate-500">Clique para selecionar e alinhar a persona</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {archetypeKeys.map((archKey) => {
              const detail = CANONICAL_JUNGIAN_ARCHETYPES[archKey];
              const isSelected = selectedArchetypeId === archKey;

              return (
                <div
                  key={archKey}
                  onClick={() => handleSelectArchetype(archKey)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-2 relative group ${
                    isSelected
                      ? `bg-gradient-to-br ${detail.bgGradient} ${detail.borderColor} border-2 shadow-[0_0_15px_rgba(255,255,255,0.08)]`
                      : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100">{detail.name}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{detail.categoryTitle.split(' / ')[1]}</div>
                    <p className="text-[10px] text-slate-500 italic line-clamp-2 leading-relaxed">
                      &ldquo;{detail.motto}&rdquo;
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 space-y-1 text-[10px]">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>MBTI Ideal:</span>
                      <strong className={detail.color}>{detail.recommendedMBTI}</strong>
                    </div>
                    <div className="text-slate-500 truncate">
                      Sombra: {detail.shadowSide.split(' e ')[0]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. SEÇÃO MBTI */}
      {activeTab === 'mbti' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyber-cyan" />
              Matriz Cognitiva MBTI (16 Tipos de Comunicação):
            </span>
            <span className="text-[11px] text-slate-500">Define o ritmo lógico e estilo de resposta</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {mbtiKeys.map((code) => {
              const prof = CANONICAL_MBTI_PROFILES[code];
              const isSelected = selectedMbti === code;

              return (
                <div
                  key={code}
                  onClick={() => handleSelectMbti(code)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan shadow-[0_0_15px_rgba(0,229,255,0.15)] font-bold'
                      : 'bg-black/30 border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold font-mono tracking-wider">{prof.code}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-cyber-cyan" />}
                  </div>
                  <div className="text-[11px] text-slate-200">{prof.name}</div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                    {prof.conversationalStyle}
                  </p>
                  <div className="pt-2 border-t border-white/10 text-[9px] text-slate-500 truncate">
                    Uso: {prof.bestUseInHolding}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. SEÇÃO BIG FIVE (OCEAN) */}
      {activeTab === 'bigfive' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              Modulador Psicométrico Big Five (OCEAN):
            </span>
            <button
              onClick={handleResetToArchetypeDefaults}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restaurar Padrão do Arquétipo ({activeArchetype.name})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* O: Openness */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">Abertura a Experiências (Openness)</span>
                <span className="font-bold text-cyber-cyan">{bigFive.openness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={bigFive.openness}
                onChange={(e) => handleBigFiveChange('openness', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Pragmático / Tradicional</span>
                <span>Visionário / Inovador</span>
              </div>
            </div>

            {/* C: Conscientiousness */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">Conscienciosidade / Disciplina (Conscientiousness)</span>
                <span className="font-bold text-blue-400">{bigFive.conscientiousness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={bigFive.conscientiousness}
                onChange={(e) => handleBigFiveChange('conscientiousness', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Flexível / Espontâneo</span>
                <span>Rigoroso / Metódico</span>
              </div>
            </div>

            {/* E: Extraversion */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">Extroversão / Energia Social (Extraversion)</span>
                <span className="font-bold text-amber-400">{bigFive.extraversion}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={bigFive.extraversion}
                onChange={(e) => handleBigFiveChange('extraversion', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Introspectivo / Calmo</span>
                <span>Expansivo / Enérgico</span>
              </div>
            </div>

            {/* A: Agreeableness */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">Amabilidade / Empatia (Agreeableness)</span>
                <span className="font-bold text-emerald-400">{bigFive.agreeableness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={bigFive.agreeableness}
                onChange={(e) => handleBigFiveChange('agreeableness', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Desafiador / Cético</span>
                <span>Acolhedor / Conciliador</span>
              </div>
            </div>

            {/* N: Emotional Stability */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 md:col-span-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">Estabilidade Emocional / Resiliência (Emotional Stability)</span>
                <span className="font-bold text-purple-400">{bigFive.emotionalStability}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={bigFive.emotionalStability}
                onChange={(e) => handleBigFiveChange('emotionalStability', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Sensível / Reativo</span>
                <span>Inabalável / Equilibrado</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Traços de Personalidade Recomendados */}
      <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyber-cyan" />
            Traços Psicológicos Vinculados ao Personagem:
          </span>
          <span className="text-[10px] text-slate-500">Base para geração de biografia e respostas</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeArchetype.recommendedTraits.map((trait, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-xs font-mono"
            >
              #{trait}
            </span>
          ))}
        </div>
      </div>

      {/* Drawer com Snippet de Injeção no System Prompt */}
      {showPromptSnippet && (
        <div className="p-4 rounded-xl bg-black/80 border border-white/15 space-y-2 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
            <span className="text-slate-300 font-bold flex items-center gap-2">
              <Code className="w-4 h-4 text-purple-400" />
              Fragmento Markdown de Injeção no System Prompt Supremo
            </span>
            <button
              onClick={handleCopyPromptFragment}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-xs transition-colors"
            >
              {copiedSnippet ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Fragmento</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-[11px] text-purple-300/95 overflow-x-auto p-3 bg-black/60 rounded-lg max-h-48 scrollbar-thin whitespace-pre-wrap">
            {promptFragment}
          </pre>
        </div>
      )}
    </div>
  );
}
