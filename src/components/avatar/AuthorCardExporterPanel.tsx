'use client';

import React, { useState, useMemo } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  AuthorProfileData,
  AuthorTheme,
  buildAuthorProfile,
  buildJsonLdPerson,
  generateAuthorHtmlSnippet,
  exportAuthorCardPackageJson,
  AuthorCardPackage,
} from '@/utils/authorCardExporter';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Code2,
  FileCode,
  FileText,
  ExternalLink,
  ShieldCheck,
  Layers,
  Fingerprint,
  Globe,
  Share2,
  BookOpen,
} from 'lucide-react';

interface AuthorCardExporterPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function AuthorCardExporterPanel({
  avatarId,
  avatarName,
}: AuthorCardExporterPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const targetName = currentAvatar?.name || avatarName || 'Maya Vance';

  const [activeTheme, setActiveTheme] = useState<AuthorTheme>('cyber_dark');
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'jsonld' | 'signature'>('preview');

  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedJsonLd, setCopiedJsonLd] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const authorData: AuthorProfileData = useMemo(() => {
    return buildAuthorProfile(currentAvatar);
  }, [currentAvatar]);

  const jsonLdData = useMemo(() => {
    return buildJsonLdPerson(authorData);
  }, [authorData]);

  const htmlSnippet = useMemo(() => {
    return generateAuthorHtmlSnippet(authorData, activeTheme);
  }, [authorData, activeTheme]);

  const authorPackage: AuthorCardPackage = useMemo(() => {
    return {
      schemaVersion: 'v5apollo.author.v1.0',
      author: authorData,
      jsonLd: jsonLdData,
      htmlSnippet,
      targetCaptaincy: 'V5 Auto Blog',
      exportedAt: new Date().toISOString(),
    };
  }, [authorData, jsonLdData, htmlSnippet]);

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlSnippet);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleCopyJsonLd = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonLdData, null, 2));
    setCopiedJsonLd(true);
    setTimeout(() => setCopiedJsonLd(false), 2000);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(authorData.eeatSignals.specialistVerificationHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(0,229,255,0.08)] space-y-6">
      {/* Header do Painel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <Award className="w-3.5 h-3.5" />
            Fase 9 · Etapa 089 · Conector V5 Auto Blog
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Exportador de Card de Autor & Assinatura E-E-A-T
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Geração de Card de Especialista, dados estruturados Schema.org Person JSON-LD e assinatura criptográfica SHA-256 para indexação no Google Search e LLMs.
          </p>
        </div>

        {/* Badges de Telemetria e Ações Globais */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-obsidian-950 border border-emerald-500/30 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-400">Certificação E-E-A-T</div>
              <div className="text-xs font-bold text-emerald-400">Verificado V5 Apollo</div>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-obsidian-950 border border-cyber-cyan/30 flex items-center gap-2.5">
            <Fingerprint className="w-4 h-4 text-cyber-cyan" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-400">Hash do Especialista</div>
              <div className="text-xs font-bold text-cyber-cyan font-mono">
                {authorData.eeatSignals.specialistVerificationHash.slice(0, 10)}...
              </div>
            </div>
          </div>

          <button
            onClick={() => exportAuthorCardPackageJson(authorPackage)}
            className="px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-400/40 text-purple-300 hover:bg-purple-500/25 transition-all text-xs font-mono font-semibold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Exportar JSON (.v5author)
          </button>
        </div>
      </div>

      {/* Controles de Visualização e Temas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-obsidian-950/70 p-3 rounded-xl border border-white/5 text-xs font-mono">
        {/* Abas */}
        <div className="flex items-center gap-2">
          {[
            { id: 'preview', label: 'Pré-Visualização', icon: <BookOpen className="w-3.5 h-3.5" /> },
            { id: 'html', label: 'HTML / Tailwind Embed', icon: <Code2 className="w-3.5 h-3.5" /> },
            { id: 'jsonld', label: 'Schema.org JSON-LD', icon: <FileCode className="w-3.5 h-3.5" /> },
            { id: 'signature', label: 'Assinatura Criptográfica', icon: <Fingerprint className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all ${
                activeTab === tab.id
                  ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan font-bold shadow-[0_0_10px_rgba(0,229,255,0.15)]'
                  : 'bg-obsidian-900 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Seletor de Tema */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[11px]">Tema:</span>
          {[
            { id: 'cyber_dark', label: 'Cyber Dark' },
            { id: 'clean_light', label: 'Clean Light' },
            { id: 'obsidian_gold', label: 'Obsidian Gold' },
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => setActiveTheme(theme.id as any)}
              className={`px-2.5 py-1 rounded text-xs transition-all border ${
                activeTheme === theme.id
                  ? 'bg-white/15 border-white/40 text-white font-bold'
                  : 'bg-obsidian-900 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo Dinâmico por Aba */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div
            className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
              activeTheme === 'cyber_dark'
                ? 'bg-obsidian-950/90 border-cyber-cyan/40 shadow-[0_0_30px_rgba(0,229,255,0.15)] text-slate-100'
                : activeTheme === 'obsidian_gold'
                ? 'bg-obsidian-950/90 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)] text-slate-100'
                : 'bg-white border-slate-200 shadow-xl text-slate-900'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Foto do Autor com Selo */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyber-cyan shadow-xl ring-4 ring-cyber-cyan/20">
                  <img
                    src={authorData.portraitUrl}
                    alt={authorData.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-cyber-cyan text-obsidian-950 flex items-center justify-center font-bold text-sm shadow-md"
                  title="Especialista Certificado V5"
                >
                  ✓
                </div>
              </div>

              {/* Corpo da Bio do Autor */}
              <div className="flex-1 text-center sm:text-left space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-white">
                      {authorData.fullName}
                    </h3>
                    <p className="text-xs font-semibold text-cyber-cyan">
                      {authorData.jobTitle} · {authorData.nicheSpecialty}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 self-center sm:self-auto">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    AUTOR VERIFICADO E-E-A-T
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {authorData.extendedBio}
                </p>

                {/* Credenciais e Sinais de Experiência */}
                <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-4">
                    <span>
                      Experiência:{' '}
                      <strong className="text-cyber-cyan">
                        {authorData.eeatSignals.yearsExperience}+ anos
                      </strong>
                    </span>
                    <span>
                      Artigos Publicados:{' '}
                      <strong className="text-emerald-400">
                        {authorData.eeatSignals.articlesPublished}
                      </strong>
                    </span>
                    <span>
                      Citações:{' '}
                      <strong className="text-purple-300">
                        {authorData.eeatSignals.citationsCount}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4 text-cyber-cyan" />
                    <span className="text-[11px]">
                      Fingerprint:{' '}
                      <strong className="text-white font-mono">
                        {authorData.eeatSignals.specialistVerificationHash}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'html' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 font-bold">
              Snippet HTML/Tailwind com Microdata Schema.org (Pronto para o V5 Auto Blog):
            </span>
            <button
              onClick={handleCopyHtml}
              className="px-3 py-1 rounded bg-cyber-cyan/15 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/25 text-xs font-mono flex items-center gap-1"
            >
              {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedHtml ? 'Copiado!' : 'Copiar Snippet HTML'}
            </button>
          </div>
          <pre className="p-4 bg-obsidian-950 rounded-xl text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed border border-white/5 select-all overflow-x-auto max-h-80">
            {htmlSnippet}
          </pre>
        </div>
      )}

      {activeTab === 'jsonld' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400 font-bold">
              Schema.org Person JSON-LD (Google Search Rich Snippets & E-E-A-T):
            </span>
            <button
              onClick={handleCopyJsonLd}
              className="px-3 py-1 rounded bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/25 text-xs font-mono flex items-center gap-1"
            >
              {copiedJsonLd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedJsonLd ? 'Copiado!' : 'Copiar JSON-LD'}
            </button>
          </div>
          <pre className="p-4 bg-obsidian-950 rounded-xl text-xs font-mono text-emerald-300/90 whitespace-pre-wrap leading-relaxed border border-emerald-900/20 select-all overflow-x-auto max-h-80">
            {JSON.stringify(jsonLdData, null, 2)}
          </pre>
        </div>
      )}

      {activeTab === 'signature' && (
        <div className="bg-obsidian-950 border border-white/10 rounded-xl p-6 space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <Fingerprint className="w-6 h-6 text-cyber-cyan" />
              <div>
                <h4 className="text-sm font-bold text-white">Certificado Criptográfico de Especialista</h4>
                <p className="text-slate-400">Assinatura digital soberana vinculada ao Face DNA e Voice DNA</p>
              </div>
            </div>

            <button
              onClick={handleCopyHash}
              className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 flex items-center gap-1"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedHash ? 'Copiado' : 'Copiar Hash'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-300">
            <div className="bg-obsidian-900 p-3.5 rounded-lg border border-white/5 space-y-1">
              <span className="text-[10px] uppercase text-slate-500">Hash de Verificação SHA-256:</span>
              <div className="text-cyber-cyan font-bold break-all">
                {authorData.eeatSignals.specialistVerificationHash}
              </div>
            </div>

            <div className="bg-obsidian-900 p-3.5 rounded-lg border border-white/5 space-y-1">
              <span className="text-[10px] uppercase text-slate-500">Organização Emissora:</span>
              <div className="text-white font-bold">
                {authorData.organization.name} ({authorData.organization.url})
              </div>
            </div>
          </div>

          <div className="p-3 bg-cyber-cyan/5 border border-cyber-cyan/20 rounded-lg text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyber-cyan shrink-0" />
            <span>
              Este certificado atesta para indexadores de busca e mecanismos de resposta de IA (AEO/GEO) que o conteúdo publicado pelo avatar possui validação de autor humano/soberano real.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
