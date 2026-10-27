'use client';

import React, { useState } from 'react';
import {
  compileSoulDnaPackage,
  downloadSoulDnaPackageJson,
  V5SoulDnaPackage,
} from '@/utils/soulPackageExporter';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  FileDown,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Code,
  Brain,
  Layers,
  BookOpen,
  Lock,
  Download,
  Terminal,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface SoulPackageExporterPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function SoulPackageExporterPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
}: SoulPackageExporterPanelProps) {
  const { avatars } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId) || avatars[0];

  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [showJsonTree, setShowJsonTree] = useState<boolean>(false);

  if (!currentAvatar) return null;

  const soulPackage: V5SoulDnaPackage = compileSoulDnaPackage(currentAvatar);

  const handleDownload = () => {
    downloadSoulDnaPackageJson(soulPackage);
    toast.success(
      'Soul DNA Package Exportado!',
      `Arquivo ${soulPackage.avatarName.toLowerCase()}_v5soul.json baixado com sucesso.`
    );
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(soulPackage, null, 2));
    setCopiedJson(true);
    toast.success('JSON Copiado!', 'Especificação do Soul DNA copiada para a área de transferência.');
    setTimeout(() => setCopiedJson(false), 2000);
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
              Exportador da Ficha Psicológica e Lore Completo (Soul DNA Package)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
                .v5soul.json
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Passaporte cognitivo e psicológico do avatar: arquétipo, MBTI, lore, guardrails da Lei 1, RAG e prompt supremo
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowJsonTree(!showJsonTree)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-cyber-cyan/40 transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-cyber-cyan" />
            {showJsonTree ? 'Ocultar JSON' : 'Visualizar JSON'}
          </button>
          <button
            onClick={handleCopyJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-cyber-cyan/40 transition-colors"
          >
            {copiedJson ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                Copiar JSON
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            Baixar .v5soul.json
          </button>
        </div>
      </div>

      {/* Resumo em 4 Cards de Telemetria Cognitiva */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-obsidian-900/80 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Arquétipo & MBTI
            </span>
          </div>
          <p className="text-sm font-bold text-purple-300">
            {soulPackage.psychologicalProfile.archetypeName} ({soulPackage.psychologicalProfile.mbti})
          </p>
          <p className="text-[10px] text-slate-400 truncate">
            {soulPackage.psychologicalProfile.mbtiTitle}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-obsidian-900/80 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyber-cyan" />
              Retenção de Persona
            </span>
          </div>
          <p className="text-sm font-bold text-cyber-cyan">
            {soulPackage.securityAndGuardrails.personaRetentionAudit.overallScore}%
          </p>
          <p className="text-[10px] text-emerald-400 font-bold truncate">
            {soulPackage.securityAndGuardrails.personaRetentionAudit.gradeLabel}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-obsidian-900/80 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-red-400" />
              Leis do Kernel & Guardrails
            </span>
          </div>
          <p className="text-sm font-bold text-red-400">
            {soulPackage.securityAndGuardrails.guardrailsCount} Guardrails
          </p>
          <p className="text-[10px] text-slate-400">
            Zero PixDrop · Lei 1 Ativa
          </p>
        </div>

        <div className="p-3 rounded-xl bg-obsidian-900/80 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-amber-400" />
              RAG & Prompt Supremo
            </span>
          </div>
          <p className="text-sm font-bold text-amber-300">
            {soulPackage.knowledgeBaseManifest.totalDocuments} Docs RAG
          </p>
          <p className="text-[10px] text-slate-400">
            {soulPackage.compiledSystemPrompts.universalMarkdownPromptLength} chars compilados
          </p>
        </div>
      </div>

      {/* Detalhes do Pacote Cognitivo */}
      <div className="p-4 rounded-xl bg-obsidian-900/50 border border-white/5 space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/5">
          <span className="text-slate-300 font-bold flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            Metadados de Exportação e Integridade Criptográfica
          </span>
          <span className="text-[10px] text-slate-400">
            Schema: <strong className="text-slate-200">{soulPackage.schemaVersion}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Bordão de Assinatura:</span>
              <span className="text-purple-300 font-bold truncate max-w-[200px]">
                &quot;{soulPackage.lexiconAndCatchphrases.signatureCatchphrase}&quot;
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Vocabulário Técnico / Bordões:</span>
              <span className="text-slate-200">
                {soulPackage.lexiconAndCatchphrases.vocabularyTerms.length} termos ponderados
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Capitanias Interoperáveis:</span>
              <span className="text-cyber-cyan font-bold">
                Broadcaster, Edit Web, Prisma, Auto Blog, Sound
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Checksum de Integridade:</span>
              <span className="font-mono text-[10px] text-cyber-cyan truncate max-w-[220px]">
                {soulPackage.integrityChecksum}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">LLMs Suportadas nativamente:</span>
              <span className="text-emerald-400 font-bold">GPT-4o, Claude 3.5, Gemini 2.0</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Data de Geração:</span>
              <span className="text-slate-400 text-[10px]">{soulPackage.exportedAt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* JSON Viewer Interativo */}
      {showJsonTree && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
              Manifesto JSON Canônico (.v5soul.json)
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Válido para importação cruzada
            </span>
          </div>
          <pre className="p-4 rounded-xl bg-obsidian-950 border border-cyber-cyan/20 text-cyber-cyan/90 text-xs overflow-x-auto max-h-80 scrollbar-thin selection:bg-cyber-cyan selection:text-obsidian-950 font-mono">
            {JSON.stringify(soulPackage, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
