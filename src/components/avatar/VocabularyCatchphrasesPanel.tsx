'use client';

import React, { useState } from 'react';
import { CatchphraseItem, VocabularyItem } from '@/types/avatar';
import {
  CANONICAL_CATCHPHRASE_BUNDLES,
  getWeightSemanticDirective,
  compileCatchphraseRulesForPrompt,
  simulateResponseWithCatchphrases,
} from '@/utils/vocabularyCatchphrasesEngine';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  Quote,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Copy,
  Check,
  Code,
  BookA,
  Play,
  RotateCcw,
  Layers,
  Sliders,
  Send,
  Zap,
} from 'lucide-react';

interface VocabularyCatchphrasesPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function VocabularyCatchphrasesPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
}: VocabularyCatchphrasesPanelProps) {
  const { avatars, updateAvatar } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId) || avatars[0];

  const defaultCatchphrases: CatchphraseItem[] = CANONICAL_CATCHPHRASE_BUNDLES.tech_ia.catchphrases;
  const defaultVocab: VocabularyItem[] = CANONICAL_CATCHPHRASE_BUNDLES.tech_ia.vocabulary;

  const [activeTab, setActiveTab] = useState<'catchphrases' | 'vocabulary'>('catchphrases');
  const [catchphrases, setCatchphrases] = useState<CatchphraseItem[]>(
    currentAvatar?.soul?.weightedCatchphrases || defaultCatchphrases
  );
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(
    currentAvatar?.soul?.vocabularyTerms || defaultVocab
  );

  // Formulário de Novo Bordão
  const [newPhrase, setNewPhrase] = useState<string>('');
  const [newPhraseWeight, setNewPhraseWeight] = useState<number>(4);
  const [newPhraseContext, setNewPhraseContext] = useState<CatchphraseItem['context']>('punchline');

  // Formulário de Novo Termo
  const [newTerm, setNewTerm] = useState<string>('');
  const [newTermMeaning, setNewTermMeaning] = useState<string>('');
  const [newTermCategory, setNewTermCategory] = useState<VocabularyItem['category']>('technical');
  const [newTermWeight, setNewTermWeight] = useState<number>(4);

  // Simulador
  const [simQuestion, setSimQuestion] = useState<string>('Como você recomenda começar em inteligência artificial soberana?');
  const [simOutput, setSimOutput] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [showPromptRule, setShowPromptRule] = useState<boolean>(false);
  const [copiedRule, setCopiedRule] = useState<boolean>(false);

  const syncStore = (updatedCatchphrases: CatchphraseItem[], updatedVocab: VocabularyItem[]) => {
    if (!currentAvatar) return;
    updateAvatar(avatarId, {
      soul: {
        ...currentAvatar.soul,
        weightedCatchphrases: updatedCatchphrases,
        catchphrases: updatedCatchphrases.map((c) => c.phrase),
        vocabularyTerms: updatedVocab,
      },
    });
  };

  const handleAddCatchphrase = () => {
    const trimmed = newPhrase.trim();
    if (!trimmed) return;

    const item: CatchphraseItem = {
      phrase: trimmed,
      weight: newPhraseWeight,
      context: newPhraseContext,
    };

    const updated = [...catchphrases, item];
    setCatchphrases(updated);
    syncStore(updated, vocabulary);
    setNewPhrase('');
    toast.success('Bordão Adicionado!', `"${trimmed}" cadastrado com peso ${newPhraseWeight}/5.`);
  };

  const handleRemoveCatchphrase = (index: number) => {
    const updated = catchphrases.filter((_, i) => i !== index);
    setCatchphrases(updated);
    syncStore(updated, vocabulary);
  };

  const handleChangeWeight = (index: number, newWeight: number) => {
    const updated = [...catchphrases];
    updated[index].weight = newWeight;
    setCatchphrases(updated);
    syncStore(updated, vocabulary);
  };

  const handleAddVocabularyTerm = () => {
    const trimmedTerm = newTerm.trim();
    const trimmedMeaning = newTermMeaning.trim();
    if (!trimmedTerm || !trimmedMeaning) return;

    const item: VocabularyItem = {
      term: trimmedTerm,
      meaning: trimmedMeaning,
      category: newTermCategory,
      weight: newTermWeight,
    };

    const updated = [...vocabulary, item];
    setVocabulary(updated);
    syncStore(catchphrases, updated);
    setNewTerm('');
    setNewTermMeaning('');
    toast.success('Termo Adicionado!', `"${trimmedTerm}" incorporado ao vocabulário.`);
  };

  const handleRemoveVocabularyTerm = (index: number) => {
    const updated = vocabulary.filter((_, i) => i !== index);
    setVocabulary(updated);
    syncStore(catchphrases, updated);
  };

  const handleLoadPresetBundle = (bundleKey: string) => {
    const bundle = CANONICAL_CATCHPHRASE_BUNDLES[bundleKey];
    if (!bundle) return;

    setCatchphrases(bundle.catchphrases);
    setVocabulary(bundle.vocabulary);
    syncStore(bundle.catchphrases, bundle.vocabulary);
    toast.success('Preset Aplicado!', `Bordões e termos de "${bundle.nicheName}" carregados.`);
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const response = simulateResponseWithCatchphrases(
        avatarName,
        simQuestion,
        catchphrases,
        vocabulary
      );
      setSimOutput(response);
      setIsSimulating(false);
      toast.info('Simulação Concluída', 'Resposta sintética com bordões dosados gerada.');
    }, 400);
  };

  const promptRuleText = compileCatchphraseRulesForPrompt(catchphrases, vocabulary);

  const handleCopyRule = () => {
    navigator.clipboard.writeText(promptRuleText);
    setCopiedRule(true);
    toast.success('Regras Copiadas!', 'Diretrizes de bordões copiadas para o System Prompt.');
    setTimeout(() => setCopiedRule(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Dicionário de Vocabulário Específico e Bordões (Catchphrases & Jargon)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30">
                {catchphrases.length} Bordões · {vocabulary.length} Termos
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Controle de recorrência verbal (Pesos 1 a 5), dosagem de gírias e repertório próprio de {avatarName}
            </p>
          </div>
        </div>

        {/* Abas e Presets */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('catchphrases')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                activeTab === 'catchphrases'
                  ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bordões ({catchphrases.length})
            </button>
            <button
              onClick={() => setActiveTab('vocabulary')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                activeTab === 'vocabulary'
                  ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Vocabulário ({vocabulary.length})
            </button>
          </div>

          <button
            onClick={() => setShowPromptRule(!showPromptRule)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs border transition-colors ${
              showPromptRule
                ? 'bg-cyber-gold/20 border-cyber-gold/40 text-cyber-gold'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showPromptRule ? 'Ocultar Prompt' : 'Ver Regras'}</span>
          </button>
        </div>
      </div>

      {/* Barra de Presets Rápidos por Nicho */}
      <div className="flex items-center justify-between text-xs text-slate-400 bg-black/40 p-3 rounded-xl border border-white/10">
        <span className="flex items-center gap-2 font-bold text-slate-300 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-cyber-gold" />
          Presets Rápidos de Repertório:
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleLoadPresetBundle('tech_ia')}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-200 text-[11px] border border-white/10 transition-colors"
          >
            Tech & IA
          </button>
          <button
            onClick={() => handleLoadPresetBundle('ugc_fines')}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-200 text-[11px] border border-white/10 transition-colors"
          >
            UGC Fines
          </button>
          <button
            onClick={() => handleLoadPresetBundle('news_authority')}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-200 text-[11px] border border-white/10 transition-colors"
          >
            Noticiário
          </button>
        </div>
      </div>

      {/* ABA 1: BORDÕES PONDERADOS */}
      {activeTab === 'catchphrases' && (
        <div className="space-y-4">
          {/* Lista de Bordões Ativos */}
          <div className="space-y-2.5">
            {catchphrases.map((item, idx) => {
              const directive = getWeightSemanticDirective(item.weight);

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-white/20 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-100 text-sm font-sans">
                        &ldquo;{item.phrase}&rdquo;
                      </span>
                      {item.context && (
                        <span className="px-2 py-0.5 rounded uppercase font-bold text-[9px] bg-white/5 border border-white/10 text-slate-400">
                          {item.context}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold ${directive.color}`}>
                        Peso {item.weight}/5 ({directive.label})
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">{directive.instruction}</p>
                  </div>

                  {/* Seletor de Peso e Botão de Deletar */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-white/10">
                      {[1, 2, 3, 4, 5].map((w) => (
                        <button
                          key={w}
                          onClick={() => handleChangeWeight(idx, w)}
                          className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-colors ${
                            item.weight === w
                              ? 'bg-cyber-cyan text-obsidian-950 shadow-[0_0_8px_rgba(0,229,255,0.6)]'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handleRemoveCatchphrase(idx)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remover bordão"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Adicionar Novo Bordão */}
          <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-3">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 text-cyber-cyan" />
              Cadastrar Novo Bordão:
            </span>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                value={newPhrase}
                onChange={(e) => setNewPhrase(e.target.value)}
                placeholder="Ex: 'Soberania digital é poder.'"
                className="flex-1 px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-slate-100 text-xs focus:border-cyber-cyan font-sans"
              />

              <select
                value={newPhraseContext}
                onChange={(e) => setNewPhraseContext(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-slate-200 text-xs focus:border-cyber-cyan"
              >
                <option value="intro">Abertura (Intro)</option>
                <option value="punchline">Frase de Efeito (Punchline)</option>
                <option value="transition">Transição</option>
                <option value="cta">Chamada para Ação (CTA)</option>
                <option value="outro">Fechamento (Outro)</option>
              </select>

              <select
                value={newPhraseWeight}
                onChange={(e) => setNewPhraseWeight(parseInt(e.target.value))}
                className="px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-slate-200 text-xs focus:border-cyber-cyan font-bold"
              >
                <option value={5}>Peso 5 (Assinatura 100%)</option>
                <option value={4}>Peso 4 (Muito Frequente 70%)</option>
                <option value={3}>Peso 3 (Moderado 40%)</option>
                <option value={2}>Peso 2 (Ocasional 20%)</option>
                <option value={1}>Peso 1 (Raro 5%)</option>
              </select>

              <button
                onClick={handleAddCatchphrase}
                className="px-4 py-2 rounded-xl bg-cyber-cyan/15 hover:bg-cyber-cyan/25 text-cyber-cyan text-xs font-bold border border-cyber-cyan/30 transition-colors shrink-0"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: DICIONÁRIO DE VOCABULÁRIO & JARGÕES */}
      {activeTab === 'vocabulary' && (
        <div className="space-y-4">
          <div className="space-y-2.5">
            {vocabulary.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cyber-cyan text-sm">{item.term}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-white/5 border border-white/10 text-slate-400">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-500">Peso {item.weight}/5</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{item.meaning}</p>
                </div>

                <button
                  onClick={() => handleRemoveVocabularyTerm(idx)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Adicionar Novo Termo */}
          <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-3">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <BookA className="w-3.5 h-3.5 text-cyber-gold" />
              Cadastrar Novo Termo / Jargão:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                placeholder="Termo / Jargão (Ex: 'Inferência Local')"
                className="px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-slate-100 text-xs focus:border-cyber-gold font-sans"
              />

              <select
                value={newTermCategory}
                onChange={(e) => setNewTermCategory(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-slate-200 text-xs focus:border-cyber-gold"
              >
                <option value="technical">Técnico</option>
                <option value="jargon">Jargão de Mercado</option>
                <option value="slang">Gíria Própria</option>
                <option value="analogy">Analogia Canônica</option>
              </select>

              <select
                value={newTermWeight}
                onChange={(e) => setNewTermWeight(parseInt(e.target.value))}
                className="px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-slate-200 text-xs focus:border-cyber-gold"
              >
                <option value={5}>Peso 5 (Muito Frequente)</option>
                <option value={4}>Peso 4 (Regular)</option>
                <option value={3}>Peso 3 (Moderado)</option>
                <option value={2}>Peso 2 (Ocasional)</option>
                <option value={1}>Peso 1 (Raro)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTermMeaning}
                onChange={(e) => setNewTermMeaning(e.target.value)}
                placeholder="Significado e como a persona deve empregar esse termo..."
                className="flex-1 px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-slate-100 text-xs focus:border-cyber-gold font-sans"
              />
              <button
                onClick={handleAddVocabularyTerm}
                className="px-4 py-2 rounded-xl bg-cyber-gold/20 hover:bg-cyber-gold/30 text-cyber-gold text-xs font-bold border border-cyber-gold/40 transition-colors shrink-0"
              >
                Salvar Termo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulador de Resposta com Injeção de Bordões */}
      <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200 flex items-center gap-2">
            <Play className="w-3.5 h-3.5 text-cyber-cyan" />
            Simulador de Resposta da Persona com Bordões Ativos:
          </span>
          <span className="text-[10px] text-slate-500">Validação em tempo real de dosagem verbal</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={simQuestion}
            onChange={(e) => setSimQuestion(e.target.value)}
            placeholder="Digite uma pergunta simulada de seguidor ou cliente..."
            className="flex-1 px-3 py-2 rounded-xl bg-black/70 border border-white/10 text-xs text-slate-200 focus:border-cyber-cyan"
          />
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyber-cyan/20 hover:bg-cyber-cyan/30 text-cyber-cyan text-xs font-bold border border-cyber-cyan/40 transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Simular</span>
          </button>
        </div>

        {simOutput && (
          <div className="p-3.5 rounded-xl bg-black/80 border border-cyber-cyan/30 text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap animate-in fade-in-50">
            {simOutput}
          </div>
        )}
      </div>

      {/* Drawer de Regras de System Prompt */}
      {showPromptRule && (
        <div className="p-4 rounded-xl bg-black/80 border border-white/15 space-y-2 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
            <span className="text-slate-300 font-bold flex items-center gap-2">
              <Code className="w-4 h-4 text-cyber-gold" />
              Diretrizes de Bordões Compiladas para o System Prompt Supremo
            </span>
            <button
              onClick={handleCopyRule}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-xs transition-colors"
            >
              {copiedRule ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Regras</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-[11px] text-cyber-gold/90 overflow-x-auto p-3 bg-black/60 rounded-lg max-h-48 scrollbar-thin whitespace-pre-wrap">
            {promptRuleText}
          </pre>
        </div>
      )}
    </div>
  );
}
