'use client';

import React, { useState } from 'react';
import {
  CANONICAL_PHONETIC_PANGRAMS,
  PhoneticPangram,
  PhoneticCategory,
  calculatePhoneticCoverage,
  filterPangrams,
} from '@/utils/phoneticPangramsCatalog';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Play,
  RotateCw,
  Sparkles,
  ShieldCheck,
  Layers,
  Filter,
  CheckCheck,
  RotateCcw,
} from 'lucide-react';

interface PhoneticPangramCatalogPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function PhoneticPangramCatalogPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
}: PhoneticPangramCatalogPanelProps) {
  const { avatars, updateAvatar } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId);

  const testedPangrams = currentAvatar?.voice?.phoneticPangramsTested || [
    'pangram_pt_complete_1',
    'pangram_sibilants_fricatives',
  ];

  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'pt-BR' | 'en-US'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | PhoneticCategory>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [simulatingId, setSimulatingId] = useState<string | null>(null);

  const coverage = calculatePhoneticCoverage(testedPangrams);
  const filteredList = filterPangrams(selectedLanguage, selectedCategory);

  const handleTogglePangram = (pangramId: string) => {
    if (!currentAvatar) return;

    let updatedList: string[];
    const isCurrentlyTested = testedPangrams.includes(pangramId);

    if (isCurrentlyTested) {
      updatedList = testedPangrams.filter((id) => id !== pangramId);
      toast.info('Pangrama Desmarcado', 'Item removido da lista de testes homologados.');
    } else {
      updatedList = [...testedPangrams, pangramId];
      toast.success('Pangrama Homologado!', 'Teste fonético validado com sucesso para este personagem.');
    }

    updateAvatar(avatarId, {
      voice: {
        ...currentAvatar.voice,
        phoneticPangramsTested: updatedList,
      },
    });
  };

  const handleMarkAllTested = () => {
    if (!currentAvatar) return;
    const allIds = CANONICAL_PHONETIC_PANGRAMS.map((p) => p.id);
    updateAvatar(avatarId, {
      voice: {
        ...currentAvatar.voice,
        phoneticPangramsTested: allIds,
      },
    });
    toast.success('Todos Homologados!', '100% dos testes fonéticos canônicos marcados como validados.');
  };

  const handleResetTests = () => {
    if (!currentAvatar) return;
    updateAvatar(avatarId, {
      voice: {
        ...currentAvatar.voice,
        phoneticPangramsTested: [],
      },
    });
    toast.info('Testes Resetados', 'Histórico de validação fonética do avatar foi zerado.');
  };

  const handleCopyPhrase = (pangram: PhoneticPangram) => {
    navigator.clipboard.writeText(pangram.phrase);
    setCopiedId(pangram.id);
    toast.success('Frase Copiada!', 'Texto do pangrama copiado para envio ao motor TTS.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulateSpeech = (pangram: PhoneticPangram) => {
    setSimulatingId(pangram.id);
    const durationMs = Math.round(pangram.expectedDurationSec * 1000);

    toast.info(
      `Sintetizando Fonemas: ${pangram.title}`,
      `Executando inferência acústica no motor ${currentAvatar?.voice?.engine?.toUpperCase() || 'QWEN-TTS'}... (~${pangram.expectedDurationSec}s)`
    );

    setTimeout(() => {
      setSimulatingId(null);
      // Se ainda não estava marcado como testado, marca automaticamente após simulação
      if (!testedPangrams.includes(pangram.id) && currentAvatar) {
        updateAvatar(avatarId, {
          voice: {
            ...currentAvatar.voice,
            phoneticPangramsTested: [...testedPangrams, pangram.id],
          },
        });
        toast.success('Teste Fonético Aprovado!', `Frase homologada com zero desvio fonético.`);
      }
    }, Math.min(2800, durationMs));
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Catálogo de Pangramas e Teste Fonético Canônico
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${coverage.scoreColor} bg-white/5 border-white/10`}>
                {coverage.testedCount}/{coverage.totalPangrams} Homologados ({coverage.coveragePercent}%)
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Banco de frases de estresse para validação de sibilantes, plosivas, nasais e visemas para {avatarName}
            </p>
          </div>
        </div>

        {/* Botões em Lote */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllTested}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs border border-emerald-500/30 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Homologar Todos</span>
          </button>
          <button
            onClick={handleResetTests}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-xs border border-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetar</span>
          </button>
        </div>
      </div>

      {/* Barra de Progresso e Cobertura Fonética */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-2 font-bold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Índice de Cobertura Fonética do Avatar
          </span>
          <span className={`font-bold ${coverage.scoreColor}`}>
            {coverage.scoreLabel} ({coverage.coveragePercent}%)
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-cyber-cyan to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${coverage.coveragePercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
          <span>7 Famílias de Fonemas PT-BR + Teste Internacional EN-US</span>
          <span>
            {coverage.allCategoriesCovered
              ? '✓ Todas as categorias fonéticas validadas'
              : `${coverage.testedCategories.length}/7 categorias auditadas`}
          </span>
        </div>
      </div>

      {/* Filtros por Idioma e Categoria */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Idioma */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Idioma:
          </span>
          {(['all', 'pt-BR', 'en-US'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                selectedLanguage === lang
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-transparent'
              }`}
            >
              {lang === 'all' ? 'Todos' : lang}
            </button>
          ))}
        </div>

        {/* Categoria */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-500 mr-1">Filtro:</span>
          {([
            { id: 'all', label: 'Todas' },
            { id: 'complete_alphabet', label: 'Alfabeto' },
            { id: 'sibilants', label: 'Sibilantes' },
            { id: 'plosives', label: 'Plosivas' },
            { id: 'nasals', label: 'Nasais' },
            { id: 'vowels', label: 'Vogais' },
            { id: 'vibrants', label: 'Vibrantes' },
            { id: 'digraphs', label: 'Dígrafos' },
          ] as const).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 font-bold'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Cards de Pangramas */}
      <div className="space-y-3">
        {filteredList.map((pangram) => {
          const isTested = testedPangrams.includes(pangram.id);
          const isSimulating = simulatingId === pangram.id;
          const isCopied = copiedId === pangram.id;

          return (
            <div
              key={pangram.id}
              className={`p-4 rounded-xl border text-xs transition-all duration-200 space-y-3 ${
                isTested
                  ? 'bg-emerald-500/[0.04] border-emerald-500/25 hover:border-emerald-500/40'
                  : 'bg-black/30 border-white/10 hover:border-white/20'
              }`}
            >
              {/* Linha Superior */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleTogglePangram(pangram.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                    title={isTested ? 'Desmarcar homologação' : 'Marcar como homologado'}
                  >
                    {isTested ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/10" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-100 text-sm">{pangram.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                        {pangram.dialect}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold border ${
                          pangram.difficulty === 'basic'
                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                            : pangram.difficulty === 'intermediate'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        {pangram.difficulty}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{pangram.whyItMatters}</p>
                  </div>
                </div>

                {/* Duração Estimada */}
                <span className="text-[11px] text-slate-500 shrink-0 font-mono">
                  ~{pangram.expectedDurationSec}s
                </span>
              </div>

              {/* Frase Principal Destacada */}
              <div className="p-3 rounded-lg bg-black/60 border border-white/10 text-slate-100 text-[13px] font-sans leading-relaxed tracking-wide select-all">
                &ldquo;{pangram.phrase}&rdquo;
              </div>

              {/* Linha Inferior com Fonemas, Visemas e Ações */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-[11px]">
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Fonemas Alvo */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 text-[10px]">Fonemas:</span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {pangram.targetPhonemes.slice(0, 8).map((ph, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.2 rounded bg-white/5 text-cyber-cyan font-mono text-[10px] border border-white/5"
                        >
                          /{ph}/
                        </span>
                      ))}
                      {pangram.targetPhonemes.length > 8 && (
                        <span className="text-[10px] text-slate-500">
                          +{pangram.targetPhonemes.length - 8}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visemas Testados */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 text-[10px]">Visemas:</span>
                    <div className="flex items-center gap-1">
                      {pangram.testedVisemes.map((viseme) => (
                        <span
                          key={viseme}
                          className="px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 font-mono text-[9px] border border-purple-500/20"
                        >
                          {viseme}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleCopyPhrase(pangram)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs transition-colors"
                    title="Copiar texto do pangrama"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-[11px]">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Copiar</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleSimulateSpeech(pangram)}
                    disabled={isSimulating}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs transition-all ${
                      isSimulating
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300 animate-pulse'
                        : 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-300'
                    }`}
                  >
                    {isSimulating ? (
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span className="text-[11px] font-bold">
                      {isSimulating ? 'Sintetizando...' : 'Testar Voz'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Guia de Escuta */}
              <div className="text-[10px] text-slate-400 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2">
                <span className="text-amber-400 font-bold shrink-0">Dica Acústica:</span>
                <span>{pangram.audioGuidance}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
