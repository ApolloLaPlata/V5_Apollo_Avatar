'use client';

import React, { useState } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  runCatalogStressTest,
  generateSyntheticAvatars,
  CatalogStressTestReport,
} from '@/utils/catalogStressTesterEngine';
import {
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HardDrive,
  Cpu,
  Layers,
  Sparkles,
  RefreshCw,
  PlusCircle,
  Clock,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export default function CatalogStressTesterPanel() {
  const { avatars, addAvatar } = useAvatarStore();

  const [avatarBatchSize, setAvatarBatchSize] = useState<number>(25);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [report, setReport] = useState<CatalogStressTestReport | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleRunStressTest = async () => {
    setIsRunning(true);
    setFeedbackMessage(null);
    setProgressPercent(5);
    setProgressStatus('Iniciando benchmark de carga...');

    try {
      const result = await runCatalogStressTest(avatarBatchSize, (stepName, pct) => {
        setProgressStatus(stepName);
        setProgressPercent(pct);
      });
      setReport(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Erro durante teste de estresse: ${msg}`);
    } finally {
      setIsRunning(false);
      setProgressPercent(100);
      setProgressStatus('Benchmark concluído.');
    }
  };

  const handleInjectIntoStore = () => {
    if (!confirm(`Deseja injetar ${avatarBatchSize} avatares sintéticos no catálogo ativo da holding?`)) {
      return;
    }

    const synthetic = generateSyntheticAvatars(avatarBatchSize);
    for (const av of synthetic) {
      addAvatar(av);
    }

    setFeedbackMessage(
      `Sucesso! ${synthetic.length} avatares adicionados. O catálogo agora possui ${avatars.length + synthetic.length} atores virtuais!`
    );
  };

  return (
    <div className="bg-obsidian-900/80 border border-cyber-cyan/30 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden space-y-6">
      {/* Glow de fundo */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-electric-indigo/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-mono tracking-wider uppercase bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 rounded-full">
              Fase 10 · Etapa 096
            </span>
            <span className="text-xs font-mono text-slate-400">Escalabilidade & Performance</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
            <Flame className="w-5 h-5 text-amber-400" />
            Teste de Carga e Estresse do Catálogo de Avatares
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Avalia o desempenho de serialização, hashing SHA-256, deserialização e limites de memória para grandes volumes simultâneos.
          </p>
        </div>

        {/* Seletor de Carga */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-slate-300">Volume de Teste:</label>
          <div className="inline-flex rounded-lg bg-black/40 p-1 border border-white/10">
            {[10, 25, 50, 100].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setAvatarBatchSize(count)}
                disabled={isRunning}
                className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                  avatarBatchSize === count
                    ? 'bg-cyber-cyan text-black font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {count} Avatares
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Message */}
      {feedbackMessage && (
        <div className="p-3 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-xl text-xs font-mono text-cyber-cyan flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Ações Principais */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRunStressTest}
            disabled={isRunning}
            className="px-5 py-2.5 bg-gradient-to-r from-cyber-cyan to-electric-indigo text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-cyber-cyan/20 disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>Processando Carga ({progressPercent}%)...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-black" />
                <span>Executar Benchmark ({avatarBatchSize} Avatares)</span>
              </>
            )}
          </button>

          {report && (
            <button
              type="button"
              onClick={handleInjectIntoStore}
              disabled={isRunning}
              className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono rounded-xl transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Injetar {avatarBatchSize} na Store</span>
            </button>
          )}
        </div>

        {/* Status em tempo real */}
        {isRunning && (
          <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
            <span>{progressStatus}</span>
          </div>
        )}
      </div>

      {/* Barra de Progresso */}
      {isRunning && (
        <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-cyber-cyan to-electric-indigo transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Relatório de Resultados */}
      {report && (
        <div className="space-y-4 pt-2">
          {/* Grid de Cards KPI */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="bg-black/40 border border-white/10 p-3 rounded-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Volume</span>
              <p className="text-lg font-bold text-white mt-1">{report.avatarCount} Avatares</p>
              <span className="text-[10px] text-slate-500">carga simultânea</span>
            </div>

            <div className="bg-black/40 border border-white/10 p-3 rounded-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Duração Total</span>
              <p className="text-lg font-bold text-cyber-cyan mt-1">{report.totalDurationMs} ms</p>
              <span className="text-[10px] text-slate-500">tempo acumulado</span>
            </div>

            <div className="bg-black/40 border border-white/10 p-3 rounded-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Tamanho Bruto</span>
              <p className="text-lg font-bold text-purple-400 mt-1">{report.dataSizeFormatted}</p>
              <span className="text-[10px] text-slate-500">payload em JSON</span>
            </div>

            <div className="bg-black/40 border border-white/10 p-3 rounded-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Heap Estimado</span>
              <p className="text-lg font-bold text-amber-400 mt-1">{report.memoryEstimatedMb} MB</p>
              <span className="text-[10px] text-slate-500">impacto na RAM</span>
            </div>

            <div className="bg-black/40 border border-white/10 p-3 rounded-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Vazão SHA-256</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">
                {report.steps.find((s) => s.stepId === 'step_sha256')?.throughputItemsPerSec || 0} /s
              </p>
              <span className="text-[10px] text-slate-500">itens processados</span>
            </div>

            <div className="bg-black/40 border border-white/10 p-3 rounded-xl">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Status Global</span>
              <div className="mt-1 flex items-center gap-1.5">
                {report.overallStatus === 'PASS' ? (
                  <span className="px-2 py-0.5 text-xs font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> APROVADO
                  </span>
                ) : report.overallStatus === 'WARN' ? (
                  <span className="px-2 py-0.5 text-xs font-bold font-mono bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-md flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> ALERTA
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-xs font-bold font-mono bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-md flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> FALHA
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500">critério de homologação</span>
            </div>
          </div>

          {/* Tabela de Passos do Benchmark */}
          <div className="bg-black/30 border border-white/10 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyber-cyan" />
                Discriminação dos Testes de Carga & Throughput
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Digest SHA-256: <strong className="text-slate-200">{report.digestSha256.substring(0, 16)}...</strong>
              </span>
            </div>

            <div className="divide-y divide-white/5">
              {report.steps.map((step) => (
                <div key={step.stepId} className="px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {step.status === 'PASS' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : step.status === 'WARN' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-200">{step.stepName}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{step.details}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono pl-7 md:pl-0">
                    <span className="text-slate-400">
                      Latência: <strong className="text-slate-200">{step.durationMs}ms</strong>
                    </span>
                    <span className="text-slate-400">
                      Taxa: <strong className="text-cyber-cyan">{step.throughputItemsPerSec} itens/s</strong>
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded font-bold uppercase ${
                        step.status === 'PASS'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : step.status === 'WARN'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
