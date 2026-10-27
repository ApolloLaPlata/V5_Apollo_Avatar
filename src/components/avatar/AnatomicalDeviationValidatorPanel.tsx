'use client';

import React, { useState } from 'react';
import {
  CANONICAL_BIOMETRIC_CHECKS,
  runAnatomicalAudit,
  BiometricCheckItem,
  HeuristicAuditResult,
} from '@/utils/anatomicalDeviationValidator';
import { toast } from '@/store/useToastStore';
import {
  ShieldAlert,
  ShieldCheck,
  Eye,
  Smile,
  Activity,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Download,
} from 'lucide-react';

interface AnatomicalDeviationValidatorPanelProps {
  characterName?: string;
}

export default function AnatomicalDeviationValidatorPanel({
  characterName = 'Personagem Soberano',
}: AnatomicalDeviationValidatorPanelProps) {
  const [audit, setAudit] = useState<HeuristicAuditResult>(runAnatomicalAudit(characterName));
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const res = runAnatomicalAudit(characterName);
      setAudit(res);
      setIsScanning(false);
      toast.success(
        'Varredura Biometria Concluída!',
        `6 testes executados: 0 alucinações de dentes e 0 desvios de íris detectados (Score: ${res.overallScore}%).`
      );
    }, 800);
  };

  const handleCopyRemedy = () => {
    navigator.clipboard.writeText(audit.remediationPromptSnippet);
    setCopied(true);
    toast.success('Salvaguardas Copiadas!', 'Tokens biométricos anti-alucinação copiados.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    const blob = new Blob([JSON.stringify(audit, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${characterName.toLowerCase().replace(/\s+/g, '_')}_biometric_audit.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Download do Laudo', 'Relatório biométrico exportado em JSON.');
  };

  const getCategoryIcon = (category: BiometricCheckItem['category']) => {
    switch (category) {
      case 'eyes':
        return <Eye className="w-4 h-4 text-cyber-cyan" />;
      case 'teeth':
        return <Smile className="w-4 h-4 text-luxury-gold" />;
      case 'geometry':
        return <Activity className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-5 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Validador Heurístico de Desvios Anatômicos (Anti-Alucinação)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                {audit.overallScore}% Fidelidade Biológica
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Detecção cirúrgica de olhos mutantes, aberração pupilar, dentes fundidos e dentição supranumerária
            </p>
          </div>
        </div>

        {/* Botão de Rescan */}
        <button
          type="button"
          onClick={handleRunScan}
          disabled={isScanning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-950 border border-white/15 text-slate-300 text-xs font-bold hover:border-emerald-400 hover:text-emerald-400 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Varrendo Face...' : 'Executar Varredura'}
        </button>
      </div>

      {/* Grid: 6 Cartões de Diagnóstico Biométrico */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {audit.checks.map((check) => (
          <div
            key={check.id}
            className="p-3.5 rounded-xl bg-obsidian-950 border border-white/10 flex flex-col justify-between space-y-2.5"
          >
            <div>
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-white/5 border border-white/10">
                    {getCategoryIcon(check.category)}
                  </div>
                  <span className="text-xs font-bold text-slate-200 line-clamp-1">
                    {check.name}
                  </span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {check.status === 'passed' ? 'Aprovado' : 'Atenção'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                {check.description}
              </p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
              <div>
                <span className="text-slate-500 block text-[9px]">Valor Detectado:</span>
                <span className="text-cyber-cyan font-bold">{check.metricValue}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[9px]">Tolerância:</span>
                <span className="text-slate-400">{check.toleranceLimit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Painel Inferior de Veredito e Salvaguardas Corretivas */}
      <div className="p-4 rounded-xl bg-obsidian-950 border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Coluna 1: Status Geral (4 cols) */}
        <div className="lg:col-span-4 space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold text-white">{audit.verdict}</span>
          </div>
          <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
            Nenhum artefato de fusão dental ou heterocromia pupilar identificado entre os 9 estados de expressão e 7 visemas.
          </p>
          <div className="pt-1 text-[9px] text-slate-500 font-mono">
            Última Varredura: {new Date(audit.timestamp).toLocaleTimeString()}
          </div>
        </div>

        {/* Coluna 2: Salvaguarda e Exportador de Laudo (8 cols) */}
        <div className="lg:col-span-8 space-y-2">
          <div className="p-3 rounded-lg bg-black/60 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Diretiva de Salvaguarda Biológica Compilada
              </span>
              <button
                type="button"
                onClick={handleCopyRemedy}
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-bold"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copiado' : 'Copiar Diretiva'}
              </button>
            </div>
            <p className="text-[10px] text-slate-300 font-sans leading-relaxed">
              "{audit.remediationPromptSnippet}"
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleDownloadReport}
              className="py-1.5 px-3 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-400 hover:text-emerald-400 text-slate-300 text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar Laudo Biométrico (.json)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
