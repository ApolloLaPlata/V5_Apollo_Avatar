'use client';

import React, { useState } from 'react';
import {
  compileIdleEmbedBundle,
  downloadFile,
  V5IdleEmbedBundle,
} from '@/utils/idleEmbedExporter';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  FileCode,
  Copy,
  Check,
  Download,
  Code,
  Layers,
  Sparkles,
  Tv,
  Atom,
  Globe,
  Monitor,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

interface IdleEmbedExporterPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function IdleEmbedExporterPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
}: IdleEmbedExporterPanelProps) {
  const { avatars } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId) || avatars[0];

  const [activeTab, setActiveTab] = useState<'pureCss' | 'reactTsx' | 'webComponentJs' | 'obsOverlayHtml'>('pureCss');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showLivePreview, setShowLivePreview] = useState<boolean>(false);

  if (!currentAvatar) return null;

  const bundle: V5IdleEmbedBundle = compileIdleEmbedBundle(currentAvatar);

  const getActiveCode = (): { code: string; filename: string; mime: string; title: string } => {
    const cleanName = currentAvatar.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    switch (activeTab) {
      case 'pureCss':
        return {
          code: bundle.formats.pureCss,
          filename: `${cleanName}_idle.css`,
          mime: 'text/css',
          title: 'CSS3 Puro (Zero JavaScript / 100% GPU)',
        };
      case 'reactTsx':
        return {
          code: bundle.formats.reactTsx,
          filename: `V5AvatarEmbed_${cleanName}.tsx`,
          mime: 'text/typescript',
          title: 'Componente React / Next.js (App Router TSX)',
        };
      case 'webComponentJs':
        return {
          code: bundle.formats.webComponentJs,
          filename: `${cleanName}_webcomponent.js`,
          mime: 'application/javascript',
          title: 'Vanilla Web Component (<v5-avatar-idle>)',
        };
      case 'obsOverlayHtml':
        return {
          code: bundle.formats.obsOverlayHtml,
          filename: `${cleanName}_obs_overlay.html`,
          mime: 'text/html',
          title: 'Overlay OBS Browser Source (1080p Transparente)',
        };
    }
  };

  const activeFormat = getActiveCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFormat.code);
    setCopiedCode(true);
    toast.success('Código Copiado!', `${activeFormat.title} copiado para a área de transferência.`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadActive = () => {
    downloadFile(activeFormat.code, activeFormat.filename, activeFormat.mime);
    toast.success('Download Concluído!', `Arquivo ${activeFormat.filename} salvo com sucesso.`);
  };

  const handleDownloadFullBundle = () => {
    const cleanName = currentAvatar.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    downloadFile(
      JSON.stringify(bundle, null, 2),
      `${cleanName}_idle_bundle.v5embed.json`,
      'application/json'
    );
    toast.success('Pacote Completo Baixado!', 'Manifesto .v5embed.json com todos os 4 formatos salvo.');
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyber-cyan border border-cyber-cyan/30 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Exportador de Código de Animação CSS/JS para Embed Rápido
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyber-cyan font-bold border border-cyber-cyan/30">
                Fase 7 · Etapa 068
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Exportação plug-and-play para V5 Broadcaster, V5 Auto Blog, OBS e sites da holding
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-cyber-cyan/40 transition-colors"
          >
            <Monitor className="w-3.5 h-3.5 text-cyber-cyan" />
            {showLivePreview ? 'Ocultar Preview' : 'Preview do Embed'}
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-cyber-cyan/40 transition-colors"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                Copiar Código
              </>
            )}
          </button>

          <button
            onClick={handleDownloadActive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-300 hover:text-white hover:border-cyber-cyan/40 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyber-cyan" />
            Baixar {activeFormat.filename.split('.').pop()?.toUpperCase()}
          </button>

          <button
            onClick={handleDownloadFullBundle}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-xs shadow-[0_0_15px_rgba(0,229,255,0.25)] transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            Baixar Pacote (.v5embed.json)
          </button>
        </div>
      </div>

      {/* Tabs de Formatos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: 'pureCss', label: 'CSS3 Puro', icon: Code, desc: 'Zero JS / 100% GPU' },
          { id: 'reactTsx', label: 'React / Next.js', icon: Atom, desc: 'TSX Component' },
          { id: 'webComponentJs', label: 'Web Component', icon: Globe, desc: '<v5-avatar-idle>' },
          { id: 'obsOverlayHtml', label: 'OBS Overlay HTML', icon: Tv, desc: '1080p Transparente' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyber-cyan text-slate-100 shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                  : 'bg-obsidian-900/60 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyber-cyan' : 'text-slate-500'}`} />
                <span className="text-xs font-bold block">{tab.label}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">{tab.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Live Preview Toggle do Embed */}
      {showLivePreview && (
        <div className="p-6 rounded-2xl bg-obsidian-950 border border-cyber-cyan/30 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
          <div className="absolute top-3 left-3 text-[10px] font-mono text-cyber-cyan flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
            Mock do Container Webhook / OBS Browser Source
          </div>

          <div className="w-48 sm:w-56 py-6">
            <div
              className="w-full flex items-center justify-center"
              style={{
                transformOrigin: 'center bottom',
                animation: 'v5-avatar-breathe 4.2s infinite ease-in-out',
              }}
            >
              <img
                src={currentAvatar.avatarUrl || '/sample-avatar.png'}
                alt={currentAvatar.name}
                className="max-h-56 object-contain drop-shadow-[0_10px_25px_rgba(0,229,255,0.2)]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Visualizador de Código com Estilo Terminal */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-cyber-cyan" />
            {activeFormat.title} ({activeFormat.filename})
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">
            {bundle.telemetry.expectedCpuLoad}
          </span>
        </div>

        <pre className="p-4 rounded-xl bg-obsidian-950 border border-cyber-cyan/20 text-cyber-cyan/90 text-xs overflow-x-auto max-h-80 scrollbar-thin font-mono selection:bg-cyber-cyan selection:text-obsidian-950">
          {activeFormat.code}
        </pre>
      </div>

      {/* Metadados e Checksum */}
      <div className="p-3.5 rounded-xl bg-obsidian-900/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-bold">Integridade Criptográfica do Pacote:</span>
          <span className="text-[10px] font-mono text-cyber-cyan truncate max-w-[220px]">
            {bundle.integrityChecksum}
          </span>
        </div>
        <div className="text-[10px] text-slate-400">
          Exportado em: <strong className="text-slate-200">{bundle.exportedAt}</strong>
        </div>
      </div>
    </div>
  );
}
