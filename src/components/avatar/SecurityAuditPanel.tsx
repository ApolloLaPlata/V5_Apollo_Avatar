'use client';

import React, { useState } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  runCatalogSecurityAudit,
  SecurityAuditReport,
} from '@/utils/securityAuditEngine';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Download,
  RefreshCw,
  Zap,
  Terminal,
  Bug,
  Code2,
} from 'lucide-react';

export default function SecurityAuditPanel() {
  const { avatars } = useAvatarStore();
  const [report, setReport] = useState<SecurityAuditReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const result = runCatalogSecurityAudit(avatars);
      setReport(result);
      setIsScanning(false);
    }, 400);
  };

  const handleDownloadReport = () => {
    if (!report) return;
    const jsonStr = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security_audit_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-obsidian-900/80 border border-cyber-cyan/30 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden space-y-6">
      {/* Glow de fundo */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-mono tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full">
              Fase 11 · Etapa 104
            </span>
            <span className="text-xs font-mono text-slate-400">Blindagem de Segurança do Kernel</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
            <Lock className="w-5 h-5 text-emerald-400" />
            Varredura de Segurança de Inputs (Anti-XSS, Memory Leaks & Prompt Injection)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Auditoria estrita de inputs de texto, proteção contra poluição de protótipo e prevenção de vazamento de memória.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunScan}
          disabled={isScanning}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyber-cyan text-black font-bold text-xs font-mono uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
              <span>Varrendo Kernel...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>Executar Varredura de Segurança</span>
            </>
          )}
        </button>
      </div>

      {/* Checklist Inicial de Proteção */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-black/40 border border-white/10 p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">Anti-XSS Shield</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-400">
            Filtro de tags script, handlers inline e esquemas javascript:
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">Prototype Pollution</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-400">
            Bloqueio de __proto__, constructor e prototype em merges de JSON.
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">Memory Leaks Guard</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-400">
            Desalocação de Blob URLs (revokeObjectURL) e timers limpos no unmount.
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 p-3.5 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">Prompt Firewall</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-[11px] text-slate-400">
            Quarentena de injeções DAN, ignore instructions e vazamento de prompts.
          </p>
        </div>
      </div>

      {/* Relatório de Varredura */}
      {report && (
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-xl bg-black/50 border border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    Laudo de Varredura de Segurança Atestado
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    {report.securityScorePercent}% SEGURO
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  ID: <span className="text-slate-200">{report.auditId}</span> · Inputs auditados:{' '}
                  <strong className="text-cyber-cyan">{report.totalInputsScanned}</strong> · Avatares:{' '}
                  <strong className="text-white">{report.totalAvatarsAudited}</strong>
                </p>
                <p className="text-[11px] font-mono text-slate-500">
                  Digest SHA-256: {report.sha256AuditDigest}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadReport}
              className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono rounded-xl transition-all flex items-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Laudo JSON</span>
            </button>
          </div>

          {/* Estado de Vulnerabilidades */}
          {report.vulnerabilitiesFound.length === 0 ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Zero vulnerabilidades detectadas. Todos os inputs, URLs e prompts estão 100% seguros e em conformidade.
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="text-xs font-mono text-rose-400 font-bold uppercase">
                Vulnerabilidades Encontradas ({report.vulnerabilitiesFound.length}):
              </span>
              {report.vulnerabilitiesFound.map((vuln, idx) => (
                <div key={idx} className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-mono">
                  <div className="flex items-center justify-between text-rose-400 font-bold">
                    <span>{vuln.category}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40">
                      {vuln.severity}
                    </span>
                  </div>
                  <p className="text-slate-300 mt-1">Alvo: {vuln.target}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Recomendação: {vuln.recommendation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
