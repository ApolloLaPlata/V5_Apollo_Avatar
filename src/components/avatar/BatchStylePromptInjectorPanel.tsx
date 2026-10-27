'use client';

import React, { useState, useMemo } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  WardrobePresetKey,
  LightingPresetKey,
  WARDROBE_PRESETS,
  LIGHTING_PRESETS,
  DEFAULT_20_SHORTS_SCENES,
  ShortSceneInput,
  injectBatchStylePrompts,
  exportBatchToJson,
  formatBatchAsText,
} from '@/utils/batchStylePromptInjector';
import {
  Film,
  Sparkles,
  Shirt,
  SunMedium,
  Lock,
  Download,
  Copy,
  Check,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Dices,
  PlaySquare,
  Sliders,
  Smartphone,
  Eye,
  RefreshCw,
} from 'lucide-react';

interface BatchStylePromptInjectorPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function BatchStylePromptInjectorPanel({
  avatarId,
  avatarName,
}: BatchStylePromptInjectorPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const targetName = currentAvatar?.name || avatarName || 'Maya Vance';

  // Configurações de Injeção
  const [selectedWardrobe, setSelectedWardrobe] = useState<WardrobePresetKey>('tech_founder');
  const [selectedLighting, setSelectedLighting] = useState<LightingPresetKey>('clean_daylight');
  const [customClothing, setCustomClothing] = useState<string>('');
  const [targetLens, setTargetLens] = useState<string>('85mm portrait');
  const [motionStrength, setMotionStrength] = useState<number>(0.65);
  const [seedLock, setSeedLock] = useState<number>(42891901);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Estados de feedback de cópia
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSingle, setCopiedSingle] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);

  // Geração reativa do lote de prompts
  const batchResult = useMemo(() => {
    return injectBatchStylePrompts(
      DEFAULT_20_SHORTS_SCENES,
      {
        wardrobePreset: selectedWardrobe,
        customClothingOverride: customClothing,
        lightingPreset: selectedLighting,
        targetLens,
        motionStrength,
        seedLock,
        preserveFacialMarks: true,
      },
      currentAvatar
    );
  }, [
    currentAvatar,
    selectedWardrobe,
    customClothing,
    selectedLighting,
    targetLens,
    motionStrength,
    seedLock,
  ]);

  const filteredScenes = useMemo(() => {
    if (!searchFilter.trim()) return batchResult.scenes;
    const q = searchFilter.toLowerCase();
    return batchResult.scenes.filter(
      (s) =>
        s.segmentTitle.toLowerCase().includes(q) ||
        s.facialExpression.toLowerCase().includes(q) ||
        s.cameraFraming.toLowerCase().includes(q)
    );
  }, [batchResult.scenes, searchFilter]);

  const activeScene = batchResult.scenes[selectedSceneIndex] || batchResult.scenes[0];

  const handleCopyAll = () => {
    const formatted = formatBatchAsText(batchResult);
    navigator.clipboard.writeText(formatted);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSingle(true);
    setTimeout(() => setCopiedSingle(false), 2000);
  };

  const handleCopyNegative = () => {
    navigator.clipboard.writeText(batchResult.globalNegativePrompt);
    setCopiedNegative(true);
    setTimeout(() => setCopiedNegative(false), 2000);
  };

  const handleRandomizeSeed = () => {
    const newSeed = Math.floor(Math.random() * 90000000) + 10000000;
    setSeedLock(newSeed);
  };

  return (
    <div className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(0,229,255,0.08)] space-y-6">
      {/* Header do Painel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <Film className="w-3.5 h-3.5" />
            Fase 9 · Etapa 082 · Conector V5 Prisma / Edit
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Injetor de Prompts Fixo de Estilo para Lote de Shorts
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Renderização em lote de 20+ takes curtos preservando 100% de figurino, iluminação e identidade facial sem desvio de IA (Anti-Drift Lock).
          </p>
        </div>

        {/* Badges de Telemetria e Consistência */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-obsidian-950 border border-emerald-500/30 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-400">Lock de Figurino</div>
              <div className="text-xs font-bold text-emerald-400">100% Imutável</div>
            </div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-obsidian-950 border border-cyber-cyan/30 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-cyber-cyan" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-400">Padrão Shorts</div>
              <div className="text-xs font-bold text-cyber-cyan">9:16 (1080x1920)</div>
            </div>
          </div>

          <div className="px-3 py-2 rounded-xl bg-obsidian-950 border border-purple-500/30 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-400">Cenas no Lote</div>
              <div className="text-xs font-bold text-purple-400">
                {batchResult.totalScenes} Takes ({batchResult.totalEstimatedDurationSeconds}s)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grade de Controles de Estilo e Blindagem */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1: Figurino Fixo */}
        <div className="bg-obsidian-950/80 border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Shirt className="w-4 h-4 text-cyber-cyan" />
            <span>Figurino Canônico Blindado</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">Preset de Vestimenta:</label>
            <div className="grid grid-cols-1 gap-1.5">
              {Object.values(WARDROBE_PRESETS).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedWardrobe(p.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all border text-left ${
                    selectedWardrobe === p.id
                      ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan font-bold shadow-[0_0_10px_rgba(0,229,255,0.15)]'
                      : 'bg-obsidian-900 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
                  }`}
                >
                  <span>{p.label}</span>
                  <div className="flex items-center gap-1">
                    {p.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full border border-black/40"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Personalizar Descrição de Roupas:</label>
            <input
              type="text"
              value={customClothing}
              onChange={(e) => setCustomClothing(e.target.value)}
              placeholder="Opcional: digite detalhes de tecido, gola ou corte..."
              className="w-full px-3 py-2 bg-obsidian-900 border border-white/10 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyber-cyan"
            />
          </div>
        </div>

        {/* Coluna 2: Iluminação e Fotografia */}
        <div className="bg-obsidian-950/80 border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <SunMedium className="w-4 h-4 text-amber-400" />
            <span>Iluminação & Setup Cinemático</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">Preset de Luz e Ambiente:</label>
            <div className="grid grid-cols-1 gap-1.5">
              {Object.values(LIGHTING_PRESETS).map((l) => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLighting(l.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all border text-left ${
                    selectedLighting === l.id
                      ? 'bg-amber-500/15 border-amber-400 text-amber-300 font-bold shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                      : 'bg-obsidian-900 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
                  }`}
                >
                  <span>{l.label}</span>
                  <span className="text-[10px] text-slate-500">{l.colorTemperature}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Lente Cinemática Recomendada:</label>
            <select
              value={targetLens}
              onChange={(e) => setTargetLens(e.target.value)}
              className="w-full px-3 py-2 bg-obsidian-900 border border-white/10 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
            >
              <option value="85mm portrait">85mm Portrait (Busto e Close-up Nítido)</option>
              <option value="50mm prime cinematic">50mm Prime Cinematic (Padrão Humano Natural)</option>
              <option value="35mm wide-normal vlog">35mm Vlog (Criador Dinâmico)</option>
              <option value="105mm telephoto portrait">105mm Telephoto (Fundo Ultra Desfocado)</option>
            </select>
          </div>
        </div>

        {/* Coluna 3: Blindagem Anti-Drift e Seed */}
        <div className="bg-obsidian-950/80 border border-white/5 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Lock className="w-4 h-4 text-purple-400" />
            <span>Blindagem Anti-Drift & Seed Lock</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-400">Seed Determinístico Fixo:</label>
              <button
                onClick={handleRandomizeSeed}
                className="text-[11px] font-mono text-cyber-cyan hover:underline flex items-center gap-1"
              >
                <Dices className="w-3 h-3" /> Gerar Novo
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={seedLock}
                onChange={(e) => setSeedLock(Number(e.target.value))}
                className="flex-1 px-3 py-2 bg-obsidian-900 border border-white/10 rounded-lg text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-400"
              />
              <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                LOCKED
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Intensidade de Movimento (Motion):</span>
              <span className="font-mono text-cyber-cyan font-bold">{(motionStrength * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={motionStrength}
              onChange={(e) => setMotionStrength(Number(e.target.value))}
              className="w-full accent-cyber-cyan cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Valores entre 55% e 75% garantem fluidez sem distorcer articulações das mãos e boca.
            </p>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-400">Score de Consistência Facial:</span>
            <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {batchResult.overallConsistencyScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Navegador de Cenas do Lote de 20 Shorts */}
      <div className="bg-obsidian-950/90 border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <PlaySquare className="w-5 h-5 text-cyber-cyan" />
            <div>
              <h3 className="text-sm font-bold text-white">Catálogo de 20 Takes do Short</h3>
              <p className="text-xs text-slate-400">Selecione uma cena para inspecionar o prompt final injetado</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Filtrar cena (ex: hook, cta, close)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="px-3 py-1.5 bg-obsidian-900 border border-white/10 rounded-lg text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyber-cyan"
            />

            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 rounded-lg bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/25 transition-all text-xs font-mono font-semibold flex items-center gap-1.5"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedAll ? 'Copiado!' : 'Copiar 20 Prompts'}
            </button>

            <button
              onClick={() => exportBatchToJson(batchResult)}
              className="px-3 py-1.5 rounded-lg bg-purple-500/15 border border-purple-400/40 text-purple-300 hover:bg-purple-500/25 transition-all text-xs font-mono font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar JSON
            </button>
          </div>
        </div>

        {/* Grade de Pílulas das 20 Cenas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {batchResult.scenes.map((scene, idx) => {
            const isSelected = selectedSceneIndex === idx;
            return (
              <button
                key={scene.sceneNumber}
                onClick={() => setSelectedSceneIndex(idx)}
                className={`p-2.5 rounded-lg border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-cyber-cyan/20 border-cyber-cyan shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                    : 'bg-obsidian-900/80 border-white/5 hover:border-white/20 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className={`font-bold ${isSelected ? 'text-cyber-cyan' : 'text-slate-300'}`}>
                    Take #{String(scene.sceneNumber).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-slate-500">{scene.durationSeconds}s</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-200 truncate">
                  {scene.segmentTitle.split('. ')[1] || scene.segmentTitle}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1 uppercase">
                  {scene.cameraFraming.replace('_', ' ')}
                </div>
              </button>
            );
          })}
        </div>

        {/* Visualizador da Cena Selecionada */}
        <div className="bg-obsidian-900 border border-cyber-cyan/20 rounded-xl p-4 space-y-3 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan text-xs font-mono font-bold">
                CENA {String(activeScene.sceneNumber).padStart(2, '0')}
              </span>
              <span className="text-sm font-bold text-white">{activeScene.segmentTitle}</span>
              <span className="text-xs text-slate-500">({activeScene.durationSeconds} segundos)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopySingle(activeScene.finalPositivePrompt)}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-all flex items-center gap-1 border border-white/10"
              >
                {copiedSingle ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedSingle ? 'Copiado!' : 'Copiar Prompt da Cena'}
              </button>
            </div>
          </div>

          {/* Prompt Positivo Injetado */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Prompt Positivo Injetado & Blindado (V5 Prisma / Flux / Wan 2.1):
              </span>
              <span className="font-mono text-slate-500">
                Resolução: {activeScene.resolution.width}x{activeScene.resolution.height} (9:16)
              </span>
            </div>
            <pre className="p-3 bg-obsidian-950 rounded-lg text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed border border-white/5 select-all">
              {activeScene.finalPositivePrompt}
            </pre>
          </div>

          {/* Prompt Negativo Anti-Drift */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-rose-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Prompt Negativo Anti-Drift (Global para todos os takes):
              </span>
              <button
                onClick={handleCopyNegative}
                className="font-mono text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
              >
                {copiedNegative ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedNegative ? 'Copiado' : 'Copiar'}
              </button>
            </div>
            <pre className="p-2.5 bg-obsidian-950/70 rounded-lg text-[11px] font-mono text-rose-300/80 whitespace-pre-wrap leading-relaxed border border-rose-900/20 select-all">
              {batchResult.globalNegativePrompt}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
