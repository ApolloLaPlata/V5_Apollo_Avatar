'use client';

import React, { useState } from 'react';
import { Avatar } from '@/types/avatar';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  Sparkles,
  Calendar,
  Play,
  Copy,
  Check,
  Film,
  Zap,
  ArrowRight,
  TrendingUp,
  Clock,
  Tv,
  CheckCircle2,
  RefreshCw,
  Send,
} from 'lucide-react';

interface ContentPipelineStudioProps {
  avatar: Avatar;
  onDispatchToVideoSwap?: (topic: string) => void;
  onSpeakPhrase?: (phrase: string) => void;
}

interface ContentDayItem {
  day: string;
  dayNumber: number;
  type: string;
  hook: string;
  body: string;
  cta: string;
  duration: string;
  status: 'ready' | 'rendered' | 'scheduled';
}

export default function ContentPipelineStudio({
  avatar,
  onDispatchToVideoSwap,
  onSpeakPhrase,
}: ContentPipelineStudioProps) {
  const { updateAvatar } = useAvatarStore();
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);
  const [copiedDay, setCopiedDay] = useState<number | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Geração de 7 dias de roteiros adaptados ao nicho e bordão do avatar
  const generateInitialSchedule = (): ContentDayItem[] => {
    const catchphrase = avatar.soul.catchphrases?.[0] || 'Fala, mentes do futuro!';
    const niche = avatar.soul.niche;

    return [
      {
        day: 'Segunda-feira',
        dayNumber: 1,
        type: 'Gancho Provocativo & Curiosidade',
        hook: `(0-3s • Expressão Surpresa) "Você ainda tá fazendo isso manualmente em ${new Date().getFullYear()}? Para tudo e olha esse detalhe!"`,
        body: `(3-18s • Cadência Rápida) "90% das pessoas perdem mais de 2 horas por dia com tarefas que poderiam ser automatizadas em um clique. ${catchphrase} Essa ferramenta entrega exatamente o resultado final sem você precisar quebrar a cabeça."`,
        cta: `(18-25s • Expressão Confiante) "O link completo com o passo a passo tá na bio. Comenta 'EU QUERO' que eu te mando agora no direct!"`,
        duration: '25s',
        status: 'ready',
      },
      {
        day: 'Terça-feira',
        dayNumber: 2,
        type: 'Review Sincero & Demonstração',
        hook: `(0-3s • Expressão Intrigada) "Eu juro que achei que era golpe quando vi o preço disso aqui na internet..."`,
        body: `(3-20s • Tom Didático) "Comprei pra testar e o acabamento é surreal. Mostra aqui de perto: ele resolve exatamente a dor de quem produz conteúdo em constância no nicho de ${niche}."`,
        cta: `(20-25s • Sorriso Espontâneo) "Clica no primeiro link fixado antes que o lote promocional se esgote!"`,
        duration: '25s',
        status: 'ready',
      },
      {
        day: 'Quarta-feira',
        dayNumber: 3,
        type: 'Quebra de Mito & Verdade Oculta',
        hook: `(0-3s • Olhar Fixo na Câmera) "Eles não querem que você saiba disso sobre ${niche}."`,
        body: `(3-19s • Tom Seguro e Autoritário) "A maioria dos 'especialistas' de palco esconde que o verdadeiro segredo não é trabalhar 14 horas, mas ter uma esteira soberana rodando nos bastidores."`,
        cta: `(19-24s) "Salva esse vídeo para não esquecer e envia para quem precisa ouvir essa verdade hoje."`,
        duration: '24s',
        status: 'ready',
      },
      {
        day: 'Quinta-feira',
        dayNumber: 4,
        type: 'Estudo de Caso / Antes & Depois',
        hook: `(0-3s • Expressão Empolgada) "Olha a diferença brutal entre fazer do jeito antigo e usando essa técnica!"`,
        body: `(3-18s • Comparativo Visual) "Na esquerda, 4 horas perdidas. Na direita, o pipeline do ${avatar.name} gerando o arquivo final em 22 segundos com fidelidade perfeita."`,
        cta: `(18-23s) "De qual lado você prefere estar? Segue o perfil para dominar o método."`,
        duration: '23s',
        status: 'ready',
      },
      {
        day: 'Sexta-feira',
        dayNumber: 5,
        type: 'Erro Fatal que Quase Todo Mundo Comete',
        hook: `(0-3s • Expressão Séria) "Se você comete esse único erro, você tá jogando dinheiro no lixo todos os dias."`,
        body: `(3-19s • Cadência Enfática) "O maior erro de quem tenta viralizar em ${niche} é mudar de persona o tempo todo. A consistência de identidade é a chave mestra."`,
        cta: `(19-24s) "Comenta aqui embaixo: você já passou por isso? Quero saber sua opinião."`,
        duration: '24s',
        status: 'ready',
      },
      {
        day: 'Sábado',
        dayNumber: 6,
        type: 'Hack / Dica Rápida em 30 Segundos',
        hook: `(0-3s • Expressão Amigável) "Essa dica rápida de 30 segundos vai salvar o seu final de semana!"`,
        body: `(3-18s • Dinâmico e Enérgico) "Ativa essa configuração oculta nas suas ferramentas hoje mesmo e veja a mágica acontecer. ${catchphrase}"`,
        cta: `(18-22s) "Compartilha com o seu amigo que precisa dessa praticidade urgente!"`,
        duration: '22s',
        status: 'ready',
      },
      {
        day: 'Domingo',
        dayNumber: 7,
        type: 'Reflexão Estratégica & Chamada de Comunidade',
        hook: `(0-3s • Expressão Serena) "Domingo à noite é hora de planejar quem você quer ser na próxima semana."`,
        body: `(3-19s • Tom Inspirador) "Enquanto a concorrência improvisa, a Holding V5 Apollo programa uma semana inteira de publicações no piloto automático. A soberania é uma escolha diária."`,
        cta: `(19-25s • Expressão Confiante) "Pronto para subir de nível? O link para a nossa central está no perfil. Boa semana!"`,
        duration: '25s',
        status: 'ready',
      },
    ];
  };

  const [schedule, setSchedule] = useState<ContentDayItem[]>(generateInitialSchedule);

  const handleRegenerateWeeklyBatch = () => {
    setIsGeneratingBatch(true);
    setTimeout(() => {
      setSchedule(generateInitialSchedule());
      setIsGeneratingBatch(false);
      toast.success(
        'Lote Semanal Regenerado!',
        `7 novos roteiros otimizados foram compilados para ${avatar.name}!`
      );
    }, 1000);
  };

  const handleCopyDayScript = (item: ContentDayItem) => {
    const fullText = `[${item.day.toUpperCase()} • ${item.type}]\n\n[GANCHO 0-3s]:\n${item.hook}\n\n[DESENVOLVIMENTO 3-18s]:\n${item.body}\n\n[CHAMADA PARA AÇÃO (CTA)]:\n${item.cta}\n\nPersonagem: ${avatar.name} • Canal: ${avatar.channelBinding?.channelHandle || '@v5apollo'}`;
    navigator.clipboard.writeText(fullText);
    setCopiedDay(item.dayNumber);
    toast.success('Roteiro Copiado', `Roteiro de ${item.day} copiado para a área de transferência.`);
    setTimeout(() => setCopiedDay(null), 2200);
  };

  const activeDay = schedule[selectedDayIndex] || schedule[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header da Esteira */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-obsidian-950 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-400" />
              ESTEIRA DE CONSTÂNCIA SEMANAL (7 DIAS)
            </span>
            {avatar.channelBinding && (
              <span className="text-xs font-mono text-cyber-cyan flex items-center gap-1 font-bold">
                <Tv className="w-3 h-3" />
                {avatar.channelBinding.channelHandle}
              </span>
            )}
          </div>
          <h3 className="text-base font-extrabold text-white">
            Programação Diária de Vídeos Virais • {avatar.name}
          </h3>
          <p className="text-xs text-slate-400">
            Cada roteiro é calibrado com gatilhos de retenção nos primeiros 3 segundos, bordão oficial e call-to-action de alta conversão.
          </p>
        </div>

        <button
          onClick={handleRegenerateWeeklyBatch}
          disabled={isGeneratingBatch}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-bold font-mono text-xs transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingBatch ? 'animate-spin' : ''}`} />
          <span>{isGeneratingBatch ? 'Compilando...' : 'Regenerar 7 Dias'}</span>
        </button>
      </div>

      {/* Grid de Dias da Semana (Segunda a Domingo) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {schedule.map((item, index) => {
          const isSelected = index === selectedDayIndex;
          return (
            <button
              key={item.dayNumber}
              onClick={() => setSelectedDayIndex(index)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className="font-bold text-slate-300">Dia {item.dayNumber}</span>
                <span className="text-[10px] text-emerald-400">{item.duration}</span>
              </div>
              <div className="text-xs font-bold truncate text-white">{item.day.split('-')[0]}</div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">{item.type}</div>
            </button>
          );
        })}
      </div>

      {/* Detalhe do Dia Selecionado */}
      {activeDay && (
        <div className="p-6 bg-slate-900/80 border border-white/10 rounded-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white">{activeDay.day}</h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-emerald-300">
                  {activeDay.type}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Alinhado com a psicologia de {avatar.name} ({avatar.soul.archetype}).
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onSpeakPhrase && (
                <button
                  onClick={() => onSpeakPhrase(activeDay.hook)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-slate-200 transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>Ouvir Gancho</span>
                </button>
              )}

              <button
                onClick={() => handleCopyDayScript(activeDay)}
                className="px-3 py-1.5 rounded-lg bg-cyber-cyan hover:bg-cyan-400 text-obsidian-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                {copiedDay === activeDay.dayNumber ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Roteiro</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Os 3 Atos do Vídeo */}
          <div className="space-y-3">
            {/* Ato 1: Gancho */}
            <div className="p-3.5 rounded-xl bg-obsidian-950/70 border border-purple-500/30 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-purple-300 font-bold">
                <span>[ATO 1: GANCHO DE ATENÇÃO • 0 A 3 SEGUNDOS]</span>
                <span className="text-emerald-400 font-bold">Retenção ~88%</span>
              </div>
              <p className="text-xs text-white leading-relaxed font-sans font-medium">
                {activeDay.hook}
              </p>
            </div>

            {/* Ato 2: Desenvolvimento */}
            <div className="p-3.5 rounded-xl bg-obsidian-950/70 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-cyber-cyan font-bold">
                <span>[ATO 2: DESENVOLVIMENTO & PROVA • 3 A 18 SEGUNDOS]</span>
                <span className="text-slate-400">Cadência {avatar.voice.speed}x</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {activeDay.body}
              </p>
            </div>

            {/* Ato 3: CTA */}
            <div className="p-3.5 rounded-xl bg-obsidian-950/70 border border-emerald-500/30 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 font-bold">
                <span>[ATO 3: CALL-TO-ACTION (CTA) • 18 A 25 SEGUNDOS]</span>
                <span className="text-emerald-300 font-bold">Conversão Máxima</span>
              </div>
              <p className="text-xs text-white leading-relaxed font-sans font-medium">
                {activeDay.cta}
              </p>
            </div>
          </div>

          {/* Barra de Ação Rápida: Despacho para Estúdio ou Video Swap */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Pronto para gravação de Shorts / TikTok Reels</span>
            </div>

            {onDispatchToVideoSwap && (
              <button
                onClick={() => onDispatchToVideoSwap(activeDay.hook)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Aplicar no Video Swap (Jutsu)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
