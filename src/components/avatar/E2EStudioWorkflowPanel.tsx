'use client';

import React, { useState } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  runE2EStudioWorkflowTest,
  E2EValidationReport,
  E2EStageResult,
} from '@/utils/e2eStudioWorkflowValidator';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  Download,
  Sparkles,
  RefreshCw,
  ScanEye,
  Mic,
  Bot,
  Package,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface E2EStudioWorkflowPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function E2EStudioWorkflowPanel({
  avatarId,
  avatarName,
}: E2EStudioWorkflowPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();

  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const [isRunning, setIsRunning] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [report, setReport] = useState<E2EValidationReport | null>(null);
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);

  const handleRunE2E = async () => {
    if (!currentAvatar) return;

    setIsRunning(true);
    setReport(null);
    setProgressPercent(10);
    setProgressStatus('Inicializando esteira E2E...');

    try {
      const result = await runE2EStudioWorkflowTest(currentAvatar, (msg, pct) => {
        setProgressStatus(msg);
        setProgressPercent(pct);
      });
      setReport(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Falha no teste E2E: ${msg}`);
    } finally {
      setIsRunning(false);
      setProgressPercent(100);
      setProgressStatus('Validação concluída.');
    }
  };

  const handleDownloadCertificate = () => {
    if (!report) return;
    const jsonString = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `e2e_cert_${report.avatarTestedName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_v5apollo.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPillarIcon = (pillar: string) => {
    switch (pillar) {
      case 'Face DNA':
        return <ScanEye className="w-4 h-4 text-cyber-cyan" />;
      case 'Voice DNA':
        return <Mic className="w-4 h-4 text-purple-400" />;
      case 'Soul DNA':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'Interactive Channel':
        return <Bot className="w-4 h-4 text-emerald-400" />;
      case 'Universal Package':
      default:
        return <Package className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="bg-obsidian-900/80 border border-cyber-cyan/30 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden space-y-6">
      {/* Glow de fundo */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-mono tracking-wider uppercase bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 rounded-full">
              Fase 10 · Etapa 099
            </span>
            <span className="text-xs font-mono text-slate-400">Homologação de Ponta a Ponta</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
            <ShieldCheck className="w-5 h-5 text-cyber-cyan" />
            Teste E2E de Fluxo Completo: Criação ➔ 360º ➔ Voz ➔ Lore ➔ Exportação
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Certifica a integridade holística do avatar através de todos os pilares do estúdio com emissão de atestado SHA-256.
          </p>
        </div>

        {/* Avatar Selecionado */}
        {currentAvatar && (
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 p-2 rounded-xl">
            <img
              src={currentAvatar.avatarUrl}
              alt={currentAvatar.name}
              loading="lazy"
              decoding="async"
              className="w-10 h-10 rounded-lg object-cover border border-white/10"
            />
            <div>
              <p className="text-xs font-bold text-white leading-tight">{currentAvatar.name}</p>
              <span className="text-[10px] font-mono text-cyber-cyan capitalize">
                {currentAvatar.soul.niche || 'Geral'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Ações e Progresso */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleRunE2E}
          disabled={isRunning || !currentAvatar}
          className="px-5 py-2.5 bg-gradient-to-r from-cyber-cyan via-electric-indigo to-purple-500 text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-cyber-cyan/20 disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
              <span>Validando Esteira ({progressPercent}%)...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-black fill-black" />
              <span>Executar Validação E2E Completa</span>
            </>
          )}
        </button>

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
            className="h-full bg-gradient-to-r from-cyber-cyan via-electric-indigo to-purple-500 transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Relatório e Certificado de Homologação E2E */}
      {report && (
        <div className="space-y-4 pt-2">
          {/* Card de Certificado */}
          <div className="p-4 rounded-xl bg-black/50 border border-cyber-cyan/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-cyber-cyan" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    Laudo de Certificação E2E Soberana
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    {report.overallScorePercent}% APROVADO
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  ID: <span className="text-slate-200">{report.testId}</span> · Tempo:{' '}
                  <strong className="text-cyber-cyan">{report.totalDurationMs}ms</strong>
                </p>
                <p className="text-[11px] font-mono text-slate-500 truncate max-w-md">
                  SHA-256 Digest: {report.packageSha256Digest}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadCertificate}
              className="px-4 py-2 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30 text-xs font-mono rounded-xl transition-all flex items-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Certificado JSON</span>
            </button>
          </div>

          {/* Stepper dos 5 Pilares */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Etapas Validadas na Esteira E2E
            </h4>

            <div className="divide-y divide-white/5 border border-white/10 rounded-xl bg-black/30 overflow-hidden">
              {report.stages.map((stage) => {
                const isExpanded = expandedStageId === stage.stageId;
                return (
                  <div key={stage.stageId} className="transition-colors hover:bg-white/[0.02]">
                    <div
                      onClick={() => setExpandedStageId(isExpanded ? null : stage.stageId)}
                      className="p-3.5 flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                          {getPillarIcon(stage.pillar)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-200">{stage.stageName}</p>
                          <span className="text-[10px] font-mono text-slate-400">
                            Pilar: {stage.pillar} · {stage.checksCompleted.length} verificações
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-slate-400">{stage.durationMs}ms</span>
                        {stage.status === 'PASS' ? (
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> PASS
                          </span>
                        ) : stage.status === 'WARN' ? (
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> WARN
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> FAIL
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Detalhes de Evidências */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 bg-black/40 border-t border-white/5 space-y-2">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          Evidências e Verificações:
                        </span>
                        <ul className="space-y-1">
                          {stage.checksCompleted.map((chk, i) => (
                            <li key={i} className="text-xs font-mono text-slate-300 flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyber-cyan shrink-0" />
                              <span>{chk}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="pt-2">
                          <span className="text-[10px] font-mono text-slate-500 uppercase">
                            Dados Extraídos em Tempo Real:
                          </span>
                          <pre className="mt-1 p-2 bg-black/80 rounded-lg text-[10px] font-mono text-slate-400 overflow-x-auto border border-white/5">
                            {JSON.stringify(stage.evidenceDetails, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
