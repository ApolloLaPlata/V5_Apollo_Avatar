'use client';

import React, { useState } from 'react';
import { AvatarProfile } from '@/types/avatar';
import {
  compileMasterSystemPrompt,
  LLMTargetModel,
  PromptCompilerResult,
} from '@/utils/systemPromptCompiler';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  Terminal,
  Cpu,
  Copy,
  Check,
  Download,
  CheckCircle2,
  Sparkles,
  Bot,
  Zap,
  Save,
  Layers,
  FileText,
} from 'lucide-react';

interface SystemPromptCompilerPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function SystemPromptCompilerPanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
}: SystemPromptCompilerPanelProps) {
  const { avatars, updateAvatar } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId) || avatars[0];

  const [targetModel, setTargetModel] = useState<LLMTargetModel>('universal');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [isSavedInStore, setIsSavedInStore] = useState<boolean>(true);

  if (!currentAvatar) return null;

  const result: PromptCompilerResult = compileMasterSystemPrompt(currentAvatar, targetModel);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.compiledPrompt);
    setCopiedPrompt(true);
    toast.success(
      'System Prompt Copiado!',
      `Prompt (${result.tokenCountEstimate} tokens) copiado no formato ${targetModel.toUpperCase()}.`
    );
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleSaveToStore = () => {
    updateAvatar(avatarId, {
      soul: {
        ...currentAvatar.soul,
        systemPrompt: result.compiledPrompt,
      },
    });
    setIsSavedInStore(true);
    toast.success(
      'System Prompt Salvo no Avatar!',
      'Instrução mestre vinculada à memória do personagem na store global.'
    );
  };

  const handleDownloadFile = () => {
    const cleanName = currentAvatar.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const filename = `${cleanName}_system_prompt_${targetModel}.md`;
    const blob = new Blob([result.compiledPrompt], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Arquivo Baixado!', `Salvo como ${filename}.`);
  };

  const getModelTabTitle = (m: LLMTargetModel) => {
    switch (m) {
      case 'universal':
        return 'Universal Markdown';
      case 'gpt4o':
        return 'OpenAI (GPT-4o)';
      case 'claude35':
        return 'Anthropic (Claude 3.5 XML)';
      case 'gemini20':
        return 'Google (Gemini 2.0)';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-gold/10 text-cyber-gold border border-cyber-gold/30 shadow-[0_0_12px_rgba(255,215,0,0.15)]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Compilador do System Prompt Supremo para LLMs
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30">
                GPT-4o · Claude 3.5 · Gemini 2.0
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Instrução central soberana unificando psicologia, história de origem, bordões e guardrails de {avatarName}
            </p>
          </div>
        </div>

        {/* Botões de Ação Principal */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs border border-white/10 transition-colors"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Prompt</span>
              </>
            )}
          </button>

          <button
            onClick={handleSaveToStore}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyber-cyan/15 hover:bg-cyber-cyan/25 text-cyber-cyan text-xs font-bold border border-cyber-cyan/30 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar no Avatar</span>
          </button>

          <button
            onClick={handleDownloadFile}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyber-gold/20 hover:bg-cyber-gold/30 text-cyber-gold text-xs font-bold border border-cyber-gold/40 transition-colors"
            title="Baixar arquivo markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.md</span>
          </button>
        </div>
      </div>

      {/* Seletor de Modelo / Dialeto de LLM */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 flex-wrap">
          {(['universal', 'gpt4o', 'claude35', 'gemini20'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setTargetModel(m);
                setIsSavedInStore(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors font-bold ${
                targetModel === m
                  ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {getModelTabTitle(m)}
            </button>
          ))}
        </div>

        {/* Métricas de Tokens e Palavras */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
          <span>Tokens: <strong className="text-cyber-cyan">~{result.tokenCountEstimate}</strong></span>
          <span>·</span>
          <span>Palavras: <strong className="text-slate-200">{result.wordCount}</strong></span>
          <span>·</span>
          <span>Caracteres: <strong className="text-slate-200">{result.characterCount}</strong></span>
        </div>
      </div>

      {/* Caixa do Código / Prompt Formatado */}
      <div className="relative group">
        <div className="p-4 rounded-xl bg-black/80 border border-white/15 relative">
          <pre className="text-[11px] text-slate-200 overflow-x-auto max-h-96 font-mono scrollbar-thin whitespace-pre-wrap leading-relaxed">
            {result.compiledPrompt}
          </pre>
        </div>
      </div>
    </div>
  );
}
