'use client';

import React, { useState, useMemo } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  ScriptTemplateType,
  SCRIPT_TEMPLATES,
  PrismaBatchPackage,
  generatePrismaBatchPackage,
  exportPrismaBatchJson,
  formatScriptWithMarkers,
} from '@/utils/prismaBatchScriptGenerator';
import {
  Clapperboard,
  Sparkles,
  Layers,
  Copy,
  Check,
  Download,
  Film,
  Sliders,
  PlayCircle,
  FileText,
  Clock,
  Mic,
  Smile,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Tag,
  Activity,
} from 'lucide-react';

interface PrismaBatchScriptGeneratorPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function PrismaBatchScriptGeneratorPanel({
  avatarId,
  avatarName,
}: PrismaBatchScriptGeneratorPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const targetName = currentAvatar?.name || avatarName || 'Maya Vance';

  const [selectedTemplate, setSelectedTemplate] = useState<ScriptTemplateType>('saas_launch');
  const [wpm, setWpm] = useState<number>(140);
  const [environmentTag, setEnvironmentTag] = useState<string>('high-end tech home office');
  const [expandedSceneId, setExpandedSceneId] = useState<string | null>('scene_01');

  const [copiedBatch, setCopiedBatch] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedSceneId, setCopiedSceneId] = useState<string | null>(null);

  const batchPackage: PrismaBatchPackage = useMemo(() => {
    return generatePrismaBatchPackage(selectedTemplate, currentAvatar, wpm, environmentTag);
  }, [selectedTemplate, currentAvatar, wpm, environmentTag]);

  const handleCopyAllPrompts = () => {
    const text = batchPackage.scenes
      .map(
        (s) =>
          `=== CENA ${s.sceneId.toUpperCase()} (${s.timeStartSeconds}s - ${s.timeEndSeconds}s) ===\n` +
          `FALA: "${s.dialogueSnippet}"\n` +
          `PROMPT POSITIVO:\n${s.positivePrompt}\n\n` +
          `PROMPT NEGATIVO:\n${s.negativePrompt}\n`
      )
      .join('\n----------------------------------------\n\n');

    navigator.clipboard.writeText(text);
    setCopiedBatch(true);
    setTimeout(() => setCopiedBatch(false), 2000);
  };

  const handleCopyScriptMarkers = () => {
    const text = formatScriptWithMarkers(batchPackage);
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleCopySinglePrompt = (sceneId: string, promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedSceneId(sceneId);
    setTimeout(() => setCopiedSceneId(null), 2000);
  };

  return (
    <div className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(0,229,255,0.08)] space-y-6">
      {/* Header do Painel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <Clapperboard className="w-3.5 h-3.5" />
            Fase 9 · Etapa 085 · Conector V5 Prisma / Edit
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Gerador de Batch Prompts para o V5 Prisma
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Geração de lotes de prompts a partir de roteiros narrativos com marcadores síncronos de pose, expressão facial FACS e minutagem precisa.
          </p>
        </div>

        {/* Badges de Telemetria e Ações Globais */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-obsidian-950 border border-cyber-cyan/30 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyber-cyan" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-400">Duração Total</div>
              <div className="text-xs font-bold text-cyber-cyan">
                {batchPackage.totalDurationSeconds}s ({batchPackage.totalScenes} Cenas)
              </div>
            </div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-obsidian-950 border border-purple-500/30 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-400">Contagem de Palavras</div>
              <div className="text-xs font-bold text-purple-400">
                {batchPackage.wordCount} Palavras ({batchPackage.averageWpm} WPM)
              </div>
            </div>
          </div>

          <button
            onClick={() => exportPrismaBatchJson(batchPackage)}
            className="px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-400/40 text-purple-300 hover:bg-purple-500/25 transition-all text-xs font-mono font-semibold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Exportar JSON (.v5prismabatch)
          </button>
        </div>
      </div>

      {/* Seletor de Template de Roteiro e Controles de Ritmo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Templates de Roteiro */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs text-slate-400 font-mono uppercase">Template Narrativo Pré-Calibrado:</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {Object.values(SCRIPT_TEMPLATES).map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedTemplate === tmpl.id
                    ? 'bg-cyber-cyan/20 border-cyber-cyan shadow-[0_0_15px_rgba(0,229,255,0.2)] text-white'
                    : 'bg-obsidian-950 border-white/5 hover:border-white/20 text-slate-400'
                }`}
              >
                <div className="text-xs font-bold mb-1 line-clamp-1">{tmpl.title}</div>
                <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {tmpl.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Ajustes de WPM e Cenário */}
        <div className="bg-obsidian-950 border border-white/10 rounded-xl p-4 space-y-3 text-xs font-mono">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400">Cadência de Fala:</span>
              <span className="text-cyber-cyan font-bold">{wpm} WPM</span>
            </div>
            <input
              type="range"
              min="110"
              max="180"
              step="5"
              value={wpm}
              onChange={(e) => setWpm(Number(e.target.value))}
              className="w-full accent-cyber-cyan cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>Lenta (110)</span>
              <span>Padrão (140)</span>
              <span>Rápida (180)</span>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Cenário Canônico Injetado:</label>
            <select
              value={environmentTag}
              onChange={(e) => setEnvironmentTag(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-obsidian-900 border border-white/10 rounded text-slate-200 text-xs focus:outline-none focus:border-cyber-cyan"
            >
              <option value="high-end tech home office">Home Office Tech (Ripado & Monitores)</option>
              <option value="modern keynote tech auditorium">Palco Keynote Futurista (LED Curvo)</option>
              <option value="v5 apollo dark studio">Dark Studio V5 (Hexágonos & Luz Ciano)</option>
              <option value="downtown city golden hour">Externa Urbana (Arranya-céus Sunset)</option>
              <option value="podcast broadcast lounge">Podcast Lounge (Veludo & Shure SM7B)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ações Rápidas de Exportação */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-obsidian-950/60 p-3 rounded-xl border border-white/5">
        <span className="text-xs font-mono text-slate-400">
          Lote: <strong>{batchPackage.scenes.length} tomadas</strong> | Personagem:{' '}
          <strong className="text-cyber-cyan">{targetName}</strong>
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyScriptMarkers}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-mono transition-all flex items-center gap-1.5"
          >
            {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
            {copiedScript ? 'Copiado!' : 'Copiar Roteiro com Marcadores (Teleprompter)'}
          </button>

          <button
            onClick={handleCopyAllPrompts}
            className="px-3 py-1.5 rounded-lg bg-cyber-cyan/15 hover:bg-cyber-cyan/25 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono font-semibold transition-all flex items-center gap-1.5"
          >
            {copiedBatch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedBatch ? 'Copiado!' : 'Copiar Todos os Prompts do Lote'}
          </button>
        </div>
      </div>

      {/* Lista de Cenas com Marcadores */}
      <div className="space-y-3">
        {batchPackage.scenes.map((scene) => {
          const isExpanded = expandedSceneId === scene.sceneId;
          const isCopied = copiedSceneId === scene.sceneId;

          return (
            <div
              key={scene.sceneId}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'bg-obsidian-950 border-cyber-cyan/40 shadow-[0_0_20px_rgba(0,229,255,0.1)]'
                  : 'bg-obsidian-950/70 border-white/5 hover:border-white/15'
              }`}
            >
              {/* Barra da Cena */}
              <div
                onClick={() => setExpandedSceneId(isExpanded ? null : scene.sceneId)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-cyber-cyan/20 border border-cyber-cyan/30 text-cyber-cyan font-mono text-xs font-bold shrink-0">
                    {scene.sceneId.toUpperCase()}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">
                        [{scene.timeStartSeconds}s - {scene.timeEndSeconds}s · {scene.durationSeconds}s]
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {scene.cameraFraming.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-100 mt-1 italic">
                      "{scene.dialogueSnippet}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-400/20 text-amber-300 text-[11px] font-mono flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    {scene.poseTag}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-[11px] font-mono flex items-center gap-1">
                    <Smile className="w-3 h-3" />
                    {scene.emotionTag}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopySinglePrompt(scene.sceneId, scene.positivePrompt);
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-all ml-1"
                    title="Copiar prompt da cena"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <div className="text-slate-500">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Detalhes Expansíveis da Cena */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-white/5 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                    <div className="bg-obsidian-900/80 p-3 rounded-lg border border-white/5">
                      <span className="text-[10px] uppercase font-mono text-amber-400 block mb-1">
                        Diretiva de Pose Corporal:
                      </span>
                      <p className="leading-relaxed">{scene.poseDescription}</p>
                    </div>

                    <div className="bg-obsidian-900/80 p-3 rounded-lg border border-white/5">
                      <span className="text-[10px] uppercase font-mono text-emerald-400 block mb-1">
                        Diretiva de Expressão Facial (FACS):
                      </span>
                      <p className="leading-relaxed">{scene.emotionDescription}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-cyber-cyan flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Prompt Positivo Compilado para o V5 Prisma / Wan 2.1:
                      </span>
                      <span className="font-mono text-slate-500">1080x1920 (9:16) · LoRA 0.85</span>
                    </div>
                    <pre className="p-3 bg-obsidian-900 rounded-lg text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed border border-white/5 select-all">
                      {scene.positivePrompt}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
