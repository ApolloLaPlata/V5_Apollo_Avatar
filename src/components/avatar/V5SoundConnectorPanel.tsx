'use client';

import React, { useState } from 'react';
import { VoiceEngine } from '@/types/avatar';
import {
  generateCanonicalVoiceId,
  generateSpeakerEmbeddingHash,
  testV5SoundHandshake,
  generateIntegrationSnippets,
  V5SoundHandshakeResult,
} from '@/utils/v5SoundConnector';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  Radio,
  Link2,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Sparkles,
  Copy,
  Check,
  Code,
  ShieldCheck,
  Server,
  Zap,
  Terminal,
  Cpu,
} from 'lucide-react';

interface V5SoundConnectorPanelProps {
  avatarId?: string;
  avatarName?: string;
  currentVoiceId?: string;
}

export default function V5SoundConnectorPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
  currentVoiceId,
}: V5SoundConnectorPanelProps) {
  const { avatars, updateAvatar } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId);

  const initialVoiceId =
    currentAvatar?.voice?.v5SoundVoiceId ||
    currentVoiceId ||
    generateCanonicalVoiceId(avatarName);

  const [voiceIdInput, setVoiceIdInput] = useState<string>(initialVoiceId);
  const [isHandshaking, setIsHandshaking] = useState<boolean>(false);
  const [handshakeResult, setHandshakeResult] = useState<V5SoundHandshakeResult | null>(null);
  const [activeSnippetTab, setActiveSnippetTab] = useState<'curl' | 'typescript' | 'python'>('curl');
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const currentEngine: VoiceEngine = currentAvatar?.voice?.engine || 'qwen-tts';
  const embeddingHash = generateSpeakerEmbeddingHash(voiceIdInput);
  const snippets = generateIntegrationSnippets(voiceIdInput, currentEngine);

  const handleGenerateCanonicalId = () => {
    const generated = generateCanonicalVoiceId(avatarName);
    setVoiceIdInput(generated);
    if (currentAvatar) {
      updateAvatar(avatarId, {
        voice: {
          ...currentAvatar.voice,
          v5SoundVoiceId: generated,
        },
      });
      toast.success('ID Canônico Gerado!', `Novo identificador vinculado: ${generated}`);
    }
  };

  const handleSaveVoiceId = () => {
    if (!currentAvatar) return;
    const trimmed = voiceIdInput.trim();
    updateAvatar(avatarId, {
      voice: {
        ...currentAvatar.voice,
        v5SoundVoiceId: trimmed,
      },
    });
    toast.success('ID de Voz Salvo', `Vínculo atualizado para ${trimmed} no registro do avatar.`);
  };

  const handleRunHandshake = async () => {
    setIsHandshaking(true);
    setHandshakeResult(null);

    try {
      const result = await testV5SoundHandshake(voiceIdInput);
      setHandshakeResult(result);

      if (result.success) {
        toast.success(
          'Handshake V5 Sound Concluído (200 OK)',
          `Latência: ${result.latencyMs}ms | Embedding validado no motor ${currentEngine.toUpperCase()}.`
        );
      } else {
        toast.error('Falha de Handshake', result.message);
      }
    } catch {
      toast.error('Erro de Conexão', 'Não foi possível conectar ao V5 Sound na porta :3008.');
    } finally {
      setIsHandshaking(false);
    }
  };

  const handleCopySnippet = () => {
    const content = snippets[activeSnippetTab];
    navigator.clipboard.writeText(content);
    setCopiedSnippet(true);
    toast.success('Código Copiado!', 'Snippet copiado para a área de transferência.');
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(embeddingHash);
    setCopiedHash(true);
    toast.success('Hash Copiado!', 'Fingerprint SHA-256 do embedding copiado.');
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-gold/10 text-cyber-gold border border-cyber-gold/30 shadow-[0_0_12px_rgba(255,215,0,0.15)]">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Conector de ID de Voz V5 Sound (v5SoundVoiceId)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Porta :3008 Online
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Vínculo canônico de clonagem vocal entre o V5 Avatar e a Capitania de Áudio V5 Sound
            </p>
          </div>
        </div>

        {/* Server Endpoint Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-400">
          <Server className="w-3.5 h-3.5 text-cyber-gold" />
          <span className="text-[11px] text-slate-300">http://localhost:3008/api/v1/voices</span>
        </div>
      </div>

      {/* Gerenciamento do ID de Voz Canônico */}
      <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <label className="font-bold text-slate-200 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-cyber-cyan" />
            Identificador Canônico da Voz (Holding Canonical Standard):
          </label>
          <span className="text-[11px] text-slate-500">
            Padrão: <code className="text-cyber-cyan">voice_{'{slug}'}_{'{lang}'}_v{'{ver}'}</code>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={voiceIdInput}
            onChange={(e) => setVoiceIdInput(e.target.value)}
            placeholder="Ex: voice_maya_vance_br_v1"
            className="flex-1 px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan text-cyber-cyan text-xs font-mono"
          />

          <button
            onClick={handleGenerateCanonicalId}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs border border-white/10 transition-colors"
            title="Gerar ID canônico automático a partir do nome"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyber-gold" />
            <span>Gerar Padrão</span>
          </button>

          <button
            onClick={handleSaveVoiceId}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyber-cyan/15 hover:bg-cyber-cyan/25 text-cyber-cyan text-xs font-bold border border-cyber-cyan/30 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Salvar</span>
          </button>
        </div>
      </div>

      {/* Grid de Especificações & Handshake Test */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Painel de Handshake */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Handshake de Conectividade IPC
              </span>
              <span className="text-[10px] text-slate-500">Porta :3008 V5 Sound</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Testa a existência do modelo clonado nos pesos neurais do V5 Sound e afere o speaker embedding.
            </p>
          </div>

          {handshakeResult && (
            <div
              className={`p-3 rounded-lg border text-[11px] space-y-1 ${
                handshakeResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  {handshakeResult.success ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  Status HTTP {handshakeResult.statusCode} OK
                </span>
                <span>Latência: {handshakeResult.latencyMs}ms</span>
              </div>
              <p className="text-[10px] opacity-90">{handshakeResult.message}</p>
            </div>
          )}

          <button
            onClick={handleRunHandshake}
            disabled={isHandshaking}
            className={`w-full py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              isHandshaking
                ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan animate-pulse'
                : 'bg-white/5 hover:bg-white/10 border-white/15 text-slate-200'
            }`}
          >
            {isHandshaking ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Testando Handshake IPC...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-cyber-gold" />
                <span>Executar Handshake de Validação</span>
              </>
            )}
          </button>
        </div>

        {/* Especificação Acústica do Falante */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyber-cyan" />
              Especificação Técnica do Clone
            </span>
            <span className="text-[10px] text-slate-500">512-dim Embedding</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded bg-black/50 border border-white/5">
              <span className="text-slate-500 block text-[10px]">Amostragem:</span>
              <strong className="text-slate-200">44.1 kHz / 16-bit</strong>
            </div>
            <div className="p-2 rounded bg-black/50 border border-white/5">
              <span className="text-slate-500 block text-[10px]">Canais:</span>
              <strong className="text-slate-200">Mono Hi-Fi Studio</strong>
            </div>
            <div className="p-2 rounded bg-black/50 border border-white/5">
              <span className="text-slate-500 block text-[10px]">Motor Primário:</span>
              <strong className="text-cyber-cyan uppercase">{currentEngine}</strong>
            </div>
            <div className="p-2 rounded bg-black/50 border border-white/5">
              <span className="text-slate-500 block text-[10px]">Dataset Base:</span>
              <strong className="text-cyber-gold">12.5 min Higienizados</strong>
            </div>
          </div>

          {/* Embedding Fingerprint */}
          <div className="pt-1">
            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
              <span>Fingerprint SHA-256 do Falante:</span>
              <button
                onClick={handleCopyHash}
                className="text-cyber-cyan hover:underline flex items-center gap-1"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHash ? 'Copiado' : 'Copiar Hash'}</span>
              </button>
            </div>
            <div className="p-2 rounded bg-black/70 border border-white/10 text-[10px] text-slate-400 font-mono truncate">
              {embeddingHash}
            </div>
          </div>
        </div>
      </div>

      {/* Snippets de Integração com V5 Broadcaster, V5 Edit e Python */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyber-gold" />
            Snippets de Integração Cross-Capitania:
          </span>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-lg border border-white/10">
            {(['curl', 'typescript', 'python'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSnippetTab(tab)}
                className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase transition-colors ${
                  activeSnippetTab === tab
                    ? 'bg-cyber-gold/20 text-cyber-gold font-bold border border-cyber-gold/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-black/75 border border-white/10 relative group">
          <button
            onClick={handleCopySnippet}
            className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 text-xs transition-colors"
          >
            {copiedSnippet ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="text-[11px]">Copiar Código</span>
              </>
            )}
          </button>
          <pre className="text-[11px] text-cyber-cyan/90 overflow-x-auto pr-24 font-mono scrollbar-thin">
            {snippets[activeSnippetTab]}
          </pre>
        </div>
      </div>
    </div>
  );
}
