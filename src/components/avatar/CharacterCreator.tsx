'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Upload, 
  RefreshCw, 
  Smile, 
  Accessibility, 
  ScanEye, 
  CheckCircle2, 
  Copy, 
  Check, 
  Layers, 
  ShieldCheck,
  Film,
  Zap,
  Mic,
  MessageSquare
} from 'lucide-react';
import { AvatarProfile, AvatarType } from '@/types/avatar';

export function CharacterCreator({ onCreated }: { onCreated?: (avatar: AvatarProfile) => void }) {
  const [avatarName, setAvatarName] = useState('');
  const [tagline, setTagline] = useState('');
  const [avatarType, setAvatarType] = useState<AvatarType>('influencer');
  const [sheetMode, setSheetMode] = useState<'turnaround' | 't-pose' | 'expression'>('turnaround');
  const [prompt, setPrompt] = useState('');
  const [clothing, setClothing] = useState('');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<string | null>(null);

  const handleGenerateSheetPrompt = () => {
    let modeInstruction = '';
    if (sheetMode === 'turnaround') {
      modeInstruction = 'character turnaround model sheet, 4 distinct view angles in a single seamless image: front view, 3/4 left angle, side profile view, back view. Uniform clean studio lighting, identical facial features, same clothing across all angles, cinematic hyperrealistic render, neutral expression, white backdrop.';
    } else if (sheetMode === 't-pose') {
      modeInstruction = 'neutral T-pose full body character sheet, arms outstretched horizontally, legs straight, perfectly centered, detailed clothing textures, clean anatomy reference for 3D rigging and costume fitting, hyper-detailed, clean neutral studio lighting.';
    } else {
      modeInstruction = 'facial expression grid sheet, 4 consistent portrait angles showing diverse emotions: joyful smile, intense serious focus, subtle surprise, relaxed talking pose. Perfect identical facial structure, locked hair and eye details, ultra-high resolution photography.';
    }

    const compiled = `${avatarName ? `Character: ${avatarName}. ` : ''}${prompt ? `${prompt}. ` : ''}${clothing ? `Attire: ${clothing}. ` : ''}${modeInstruction}`;
    return compiled;
  };

  const currentCompiledPrompt = handleGenerateSheetPrompt();

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(currentCompiledPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMockGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGeneratedPreview('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80');
    }, 1500);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Forjador de Identidade (Character Studio)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                Turnaround 360º & Consistência
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Crie o DNA imutável do seu ator digital: multi-ângulos, T-Pose neutra e catálogo de expressões.
            </p>
          </div>
        </div>

        {/* Sheet Mode Selector */}
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setSheetMode('turnaround')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              sheetMode === 'turnaround'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ScanEye className="w-3.5 h-3.5" /> Turnaround 360º
          </button>
          <button
            onClick={() => setSheetMode('t-pose')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              sheetMode === 't-pose'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Accessibility className="w-3.5 h-3.5" /> T-Pose
          </button>
          <button
            onClick={() => setSheetMode('expression')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              sheetMode === 'expression'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smile className="w-3.5 h-3.5" /> Expressões
          </button>
        </div>
      </div>

      {/* Grid de Configuração */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Lado Esquerdo: Ficha Cadastral */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Nome do Personagem:
              </label>
              <input
                type="text"
                placeholder="Ex: Maya Vance, Lucas Tech..."
                value={avatarName}
                onChange={(e) => setAvatarName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Tipo de Atuação:
              </label>
              <select
                value={avatarType}
                onChange={(e) => setAvatarType(e.target.value as AvatarType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="influencer">Influenciador(a) Digital / UGC</option>
                <option value="actor">Ator de Cinema / Ficção</option>
                <option value="streamer">Streamer Virtual (Broadcaster)</option>
                <option value="mascot">Mascote de Marca (Negócios)</option>
                <option value="support_agent">Atendente de Suporte / Vendas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              Descrição Física & Traços Imutáveis:
            </label>
            <textarea
              placeholder="Ex: Mulher brasileira de 26 anos, olhos cor de mel, cabelo cacheado castanho escuro na altura dos ombros, sardas leves no nariz..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">
              Vestimenta Padrão (Trava de Roupa):
            </label>
            <input
              type="text"
              placeholder="Ex: Jaqueta bomber preta com detalhes ciano, camiseta branca e calça jeans escura"
              value={clothing}
              onChange={(e) => setClothing(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-medium"
            />
          </div>

          {/* Integração Multi-Capitania Badges */}
          <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
              Pronto para Interoperabilidade na Holding:
            </span>
            <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> V5 Broadcaster (Live)
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> V5 Prisma (Batch)
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> V5 Sound (Voz)
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> V5 Finders (UGC)
              </span>
            </div>
          </div>
        </div>

        {/* Lado Direito: Preview do Compilador de Prompt & Render */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="bg-slate-950/80 border border-cyan-500/20 rounded-xl p-4 space-y-2 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" /> Prompt Mestre do Modelo ({sheetMode.toUpperCase()})
                </span>
                <button
                  onClick={handleCopyPrompt}
                  className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>

              <p className="text-xs font-mono text-slate-300 mt-3 leading-relaxed break-words bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                {currentCompiledPrompt}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60">
              <button
                onClick={handleMockGenerate}
                disabled={generating}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> Forjando Folha Turnaround na Modal H100...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-slate-950" /> Gerar Folha de Consistência via API
                  </>
                )}
              </button>
            </div>
          </div>

          {generatedPreview && (
            <div className="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl flex items-center gap-3">
              <img
                src={generatedPreview}
                alt="Avatar Preview"
                className="w-12 h-12 rounded-lg object-cover border border-slate-700"
              />
              <div className="text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Folha Multi-Ângulo Pronta
                </span>
                <p className="text-[11px] text-slate-400">
                  Modelo pronto para exportação para V5 Prisma e Broadcaster.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
