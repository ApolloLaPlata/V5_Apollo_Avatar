'use client';

import React, { useState, useMemo } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  V5AvatarPackage,
  compileUniversalAvatarPackage,
  validatePackageIntegrity,
  downloadUniversalPackageJson,
} from '@/utils/universalAvatarPackageEngine';
import {
  Box,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  Check,
  Fingerprint,
  FileCode,
  Layers,
  ScanEye,
  Mic,
  Bot,
  Radio,
  RefreshCw,
  Lock,
  Unlock,
} from 'lucide-react';

interface UniversalPackageSchemaPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function UniversalPackageSchemaPanel({
  avatarId,
  avatarName,
}: UniversalPackageSchemaPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const targetName = currentAvatar?.name || avatarName || 'Maya Vance';

  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isTampered, setIsTampered] = useState(false);
  const [activeTab, setActiveTab] = useState<'pillars' | 'assets' | 'raw_json'>('pillars');

  // Compila o pacote canônico universal
  const basePackage = useMemo(() => {
    return compileUniversalAvatarPackage(currentAvatar);
  }, [currentAvatar]);

  // Pacote com ou sem adulteração de teste
  const displayPackage: V5AvatarPackage = useMemo(() => {
    if (!isTampered) return basePackage;
    return {
      ...basePackage,
      profile: {
        ...basePackage.profile,
        name: `${basePackage.profile.name} (MODIFICADO_SEM_AUTORIZACAO)`,
      },
    };
  }, [basePackage, isTampered]);

  // Validação criptográfica do pacote
  const integrityResult = useMemo(() => {
    return validatePackageIntegrity(displayPackage);
  }, [displayPackage]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(displayPackage, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(displayPackage.manifest.integrityChecksumSha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(0,229,255,0.08)] space-y-6">
      {/* Header do Painel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <Box className="w-3.5 h-3.5" />
            Fase 10 · Etapa 091 · Schema Canônico V5AvatarPackage
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Schema Canônico V5AvatarPackage & SHA-256
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Consolidação dos 4 pilares de identidade soberana (Face, Voice, Soul e Interactive Channel) em pacote universal auditado com assinatura criptográfica SHA-256.
          </p>
        </div>

        {/* Badges de Telemetria e Ações Globais */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-2.5 transition-all ${
              integrityResult.isValid
                ? 'bg-obsidian-950 border-emerald-500/30'
                : 'bg-rose-950/40 border-rose-500/50 ring-1 ring-rose-500'
            }`}
          >
            {integrityResult.isValid ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
            )}
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-400">Integridade SHA-256</div>
              <div
                className={`text-xs font-bold font-mono ${
                  integrityResult.isValid ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {integrityResult.isValid ? '100% AUTÊNTICO' : 'VIOLAÇÃO DETECTADA'}
              </div>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-obsidian-950 border border-cyber-cyan/30 flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-cyber-cyan" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-400">Schema Versão</div>
              <div className="text-xs font-bold text-cyber-cyan font-mono">v1.0 Soberano</div>
            </div>
          </div>

          <button
            onClick={() => downloadUniversalPackageJson(displayPackage)}
            className="px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-400/40 text-purple-300 hover:bg-purple-500/25 transition-all text-xs font-mono font-semibold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Exportar .v5avatar.json
          </button>
        </div>
      </div>

      {/* Caixa de Hash SHA-256 e Simulador de Violação de Integridade */}
      <div className="bg-obsidian-950 border border-white/10 rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-cyber-cyan" />
            <span className="font-bold text-slate-200">
              Assinatura Canônica SHA-256 do Pacote:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyHash}
              className="text-cyber-cyan hover:underline flex items-center gap-1 text-[11px]"
            >
              {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedHash ? 'Copiado!' : 'Copiar Hash'}
            </button>

            <button
              onClick={() => setIsTampered(!isTampered)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all border flex items-center gap-1 ${
                isTampered
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              }`}
            >
              {isTampered ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              {isTampered ? 'Restaurar Hash Original' : 'Simular Violação (Tamper Test)'}
            </button>
          </div>
        </div>

        {/* Display do Hash */}
        <div className="p-3 bg-obsidian-900 rounded-lg border border-white/5 text-xs font-mono text-slate-200 break-all select-all flex items-center justify-between">
          <span>{displayPackage.manifest.integrityChecksumSha256}</span>
          <span className="text-[10px] text-slate-500 uppercase ml-2 shrink-0">64 Hex</span>
        </div>

        {/* Aviso se houver violação */}
        {!integrityResult.isValid && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">ALERTA DE SEGURANÇA: FALHA DE AUDITORIA CRIPTOGRÁFICA</strong>
              <span>{integrityResult.errors.join(' ')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Navegador por Abas */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs font-mono">
        <button
          onClick={() => setActiveTab('pillars')}
          className={`px-3 py-1.5 rounded-lg border transition-all ${
            activeTab === 'pillars'
              ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan font-bold shadow-[0_0_10px_rgba(0,229,255,0.15)]'
              : 'bg-obsidian-950 border-white/5 text-slate-400 hover:text-slate-200'
          }`}
        >
          4 Pilares DNA Unificados
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`px-3 py-1.5 rounded-lg border transition-all ${
            activeTab === 'assets'
              ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan font-bold shadow-[0_0_10px_rgba(0,229,255,0.15)]'
              : 'bg-obsidian-950 border-white/5 text-slate-400 hover:text-slate-200'
          }`}
        >
          Manifesto de Assets ({displayPackage.assetsManifest.length} arquivos)
        </button>

        <button
          onClick={() => setActiveTab('raw_json')}
          className={`px-3 py-1.5 rounded-lg border transition-all ${
            activeTab === 'raw_json'
              ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan font-bold shadow-[0_0_10px_rgba(0,229,255,0.15)]'
              : 'bg-obsidian-950 border-white/5 text-slate-400 hover:text-slate-200'
          }`}
        >
          Payload JSON Completo
        </button>
      </div>

      {/* Conteúdo da Aba Pilares */}
      {activeTab === 'pillars' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* Pilar 1: Face DNA */}
          <div className="bg-obsidian-950 border border-white/10 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-cyber-cyan border-b border-white/5 pb-2">
              <span className="font-bold flex items-center gap-1.5">
                <ScanEye className="w-4 h-4" />
                1. Face DNA
              </span>
              <span className="text-[10px] text-emerald-400">360º OK</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Âncoras biométricas, folha de turnaround 360º, prompts de vestimenta e parâmetros LoRA.
            </p>
            <div className="text-[10px] text-slate-500 space-y-1">
              <div>Seed: {displayPackage.dnaPillars.faceDna.diffusionSeed || '428912301'}</div>
              <div>PuLID: {displayPackage.dnaPillars.faceDna.pulidEmbeddingId || 'pulid_active'}</div>
            </div>
          </div>

          {/* Pilar 2: Voice DNA */}
          <div className="bg-obsidian-950 border border-white/10 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-purple-400 border-b border-white/5 pb-2">
              <span className="font-bold flex items-center gap-1.5">
                <Mic className="w-4 h-4" />
                2. Voice DNA
              </span>
              <span className="text-[10px] text-emerald-400">Clonada</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Identidade vocal vinculada ao motor Qwen-TTS / XTTS do V5 Sound, estabilidade e amostras.
            </p>
            <div className="text-[10px] text-slate-500 space-y-1">
              <div>Voice ID: {displayPackage.dnaPillars.voiceDna.v5SoundVoiceId || displayPackage.dnaPillars.voiceDna.engine}</div>
              <div>Estabilidade: {((displayPackage.dnaPillars.voiceDna.stability ?? 0.85) * 100).toFixed(0)}%</div>
            </div>
          </div>

          {/* Pilar 3: Soul DNA */}
          <div className="bg-obsidian-950 border border-white/10 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-amber-400 border-b border-white/5 pb-2">
              <span className="font-bold flex items-center gap-1.5">
                <Bot className="w-4 h-4" />
                3. Soul DNA
              </span>
              <span className="text-[10px] text-emerald-400">RAG Ativo</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Biografia, arquétipo, Big Five, vocabulário restrito, guardrails de segurança e lore canônico.
            </p>
            <div className="text-[10px] text-slate-500 space-y-1">
              <div>Arquétipo: {displayPackage.dnaPillars.soulDna.archetype || 'sage / ruler'}</div>
              <div>Nicho: {displayPackage.dnaPillars.soulDna.niche}</div>
            </div>
          </div>

          {/* Pilar 4: Interactive Channel */}
          <div className="bg-obsidian-950 border border-white/10 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-emerald-400 border-b border-white/5 pb-2">
              <span className="font-bold flex items-center gap-1.5">
                <Radio className="w-4 h-4" />
                4. Interactive Channel
              </span>
              <span className="text-[10px] text-emerald-400">Live Ready</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Servidor de webhooks para o V5 Broadcaster, WebSocket OBS Studio e firewall anti-hijacking.
            </p>
            <div className="text-[10px] text-slate-500 space-y-1">
              <div>Canal: {displayPackage.dnaPillars.interactiveChannel.isLiveActive ? 'Live Ativo' : 'Standby Pronto'}</div>
              <div>Conversas Totais: {displayPackage.dnaPillars.interactiveChannel.totalConversations || 0} sessões</div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo da Aba Assets */}
      {activeTab === 'assets' && (
        <div className="space-y-3">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Arquivos vinculados com integridade SHA-256 individual:</span>
            <span>
              Tamanho Estimado:{' '}
              <strong className="text-cyber-cyan">
                {(displayPackage.manifest.totalSizeBytesEstimated / (1024 * 1024)).toFixed(2)} MB
              </strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            {displayPackage.assetsManifest.map((asset) => (
              <div
                key={asset.assetId}
                className="bg-obsidian-950 p-3.5 rounded-xl border border-white/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{asset.fileName}</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400 text-[10px]">
                    {(asset.sizeBytesEstimated / 1024).toFixed(0)} KB
                  </span>
                </div>

                <div className="text-[10px] text-slate-500 break-all space-y-1">
                  <div>MIME: {asset.mimeType}</div>
                  <div>SHA-256: {asset.sha256Hex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo da Aba JSON Bruto */}
      {activeTab === 'raw_json' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 font-bold">
              Estrutura Canônica JSON (Schema v5apollo.avatarpackage.v1.0):
            </span>
            <button
              onClick={handleCopyJson}
              className="px-3 py-1 rounded bg-cyber-cyan/15 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/25 text-xs font-mono flex items-center gap-1"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedJson ? 'Copiado!' : 'Copiar JSON Completo'}
            </button>
          </div>
          <pre className="p-4 bg-obsidian-950 rounded-xl text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed border border-white/5 select-all overflow-x-auto max-h-96">
            {JSON.stringify(displayPackage, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
