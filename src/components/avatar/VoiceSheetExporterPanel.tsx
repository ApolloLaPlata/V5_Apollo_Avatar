'use client';

import React, { useState } from 'react';
import {
  compileVoiceSpecificationSheet,
  downloadVoiceSpecificationSheetJson,
  V5VoiceSpecificationSheet,
} from '@/utils/voiceSheetExporter';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  FileDown,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Code,
  Radio,
  Cpu,
  Layers,
  CheckCircle2,
  Download,
  Terminal,
} from 'lucide-react';

interface VoiceSheetExporterPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function VoiceSheetExporterPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
}: VoiceSheetExporterPanelProps) {
  const { avatars } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId) || avatars[0];

  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [showJsonTree, setShowJsonTree] = useState<boolean>(true);

  if (!currentAvatar) return null;

  const sheet: V5VoiceSpecificationSheet = compileVoiceSpecificationSheet(currentAvatar);

  const handleDownload = () => {
    downloadVoiceSpecificationSheetJson(sheet);
    toast.success(
      'Ficha Vocal Exportada!',
      `Arquivo ${sheet.avatarName.toLowerCase()}_v5voice.json baixado com sucesso.`
    );
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(sheet, null, 2));
    setCopiedJson(true);
    toast.success('JSON Copiado!', 'Especificação vocal copiada para a área de transferência.');
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-gold/10 text-cyber-gold border border-cyber-gold/30 shadow-[0_0_12px_rgba(255,215,0,0.15)]">
            <FileDown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Exportador de Ficha Vocal Canônica em JSON (Voice Specification Sheet)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-gold/20 text-cyber-gold font-bold border border-cyber-gold/30">
                .v5voice.json
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Passaporte acústico portátil do avatar para V5 Sound (:3008), V5 Broadcaster, V5 Edit e V5 Prisma
            </p>
          </div>
        </div>

        {/* Botões de Ação Principal */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyJson}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs border border-white/10 transition-colors"
          >
            {copiedJson ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar JSON</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyber-gold hover:bg-amber-400 text-obsidian-950 font-bold text-xs shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Baixar .v5voice.json</span>
          </button>
        </div>
      </div>

      {/* Resumo dos Pilares Acústicos da Ficha */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-500 block">ID V5 Sound:</span>
          <strong className="text-cyber-cyan truncate block font-mono text-[11px]">
            {sheet.v5SoundBinding.v5SoundVoiceId}
          </strong>
        </div>

        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-500 block">Motor de Síntese:</span>
          <strong className="text-slate-100 uppercase block font-mono text-[11px]">
            {sheet.acousticModulation.engine} (44.1 kHz)
          </strong>
        </div>

        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-500 block">Tonalidade & Inflexão:</span>
          <strong className="text-purple-300 truncate block font-mono text-[11px]">
            {sheet.emotionalToneProfile.toneName.split(' / ')[0]}
          </strong>
        </div>

        <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-500 block">Cobertura Fonética:</span>
          <strong className="text-emerald-400 block font-mono text-[11px]">
            {sheet.phoneticValidation.coveragePercent}% Homologada
          </strong>
        </div>
      </div>

      {/* Checksum SHA-256 de Integridade */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-white/10 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Assinatura Criptográfica de Integridade: </span>
          <code className="text-emerald-400 font-mono text-[10px]">
            {sheet.integrityChecksum}
          </code>
        </div>
        <span className="text-[10px] text-slate-500 hidden sm:inline">
          Schema: {sheet.schemaVersion}
        </span>
      </div>

      {/* Visualizador do Arquivo JSON Estruturado */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-bold text-slate-300">
            <Code className="w-3.5 h-3.5 text-cyber-cyan" />
            Estrutura Completa do Pacote de Voz (.v5voice.json):
          </span>
          <button
            onClick={() => setShowJsonTree(!showJsonTree)}
            className="text-[11px] text-cyber-cyan hover:underline"
          >
            {showJsonTree ? 'Recolher Visualizador' : 'Expandir Visualizador'}
          </button>
        </div>

        {showJsonTree && (
          <div className="p-4 rounded-xl bg-black/80 border border-white/15 relative">
            <pre className="text-[11px] text-slate-300 overflow-x-auto max-h-80 font-mono scrollbar-thin leading-relaxed">
              {JSON.stringify(sheet, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
