'use client';

import React, { useState, useMemo } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  TargetDiffusionModel,
  V5FaceDnaPack,
  compileFaceDnaPack,
  validateFaceDnaPack,
  downloadFaceDnaPack,
} from '@/utils/faceDnaPackExporter';
import {
  Layers,
  Sparkles,
  Download,
  Copy,
  Check,
  Cpu,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Code2,
  Flame,
  Radio,
  FileJson,
  Dices,
  Lock,
} from 'lucide-react';

interface FaceDnaPackExporterPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function FaceDnaPackExporterPanel({
  avatarId,
  avatarName,
}: FaceDnaPackExporterPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const targetName = currentAvatar?.name || avatarName || 'Maya Vance';
  const avatarImage = currentAvatar?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  const [targetModel, setTargetModel] = useState<TargetDiffusionModel>('flux_1_dev');
  const [loraStrength, setLoraStrength] = useState<number>(0.85);
  const [guidanceScale, setGuidanceScale] = useState<number>(3.5);
  const [inferenceSteps, setInferenceSteps] = useState<number>(28);
  const [denoiseStrength, setDenoiseStrength] = useState<number>(0.55);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedTrigger, setCopiedTrigger] = useState(false);

  // Compila o Face DNA Pack sob demanda
  const pack: V5FaceDnaPack = useMemo(() => {
    return compileFaceDnaPack(currentAvatar, {
      targetModel,
      loraStrength,
      guidanceScale,
      inferenceSteps,
      denoiseStrength,
    });
  }, [currentAvatar, targetModel, loraStrength, guidanceScale, inferenceSteps, denoiseStrength]);

  const integrity = useMemo(() => {
    return validateFaceDnaPack(pack);
  }, [pack]);

  const jsonString = useMemo(() => {
    return JSON.stringify(pack, null, 2);
  }, [pack]);

  const fileSizeKb = (new Blob([jsonString]).size / 1024).toFixed(1);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownload = () => {
    downloadFaceDnaPack(pack, `${currentAvatar.id}_facedna_pack.v5facedna.json`);
  };

  const handleCopyTriggerWords = () => {
    navigator.clipboard.writeText(pack.diffusionLoRAParameters.triggerWords.join(', '));
    setCopiedTrigger(true);
    setTimeout(() => setCopiedTrigger(false), 2000);
  };

  return (
    <section className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(0,229,255,0.06)] relative overflow-hidden">
      {/* Glow Superior */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-80" />

      {/* Header com Status do Exportador */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
            Fase 9 · Conector de Narrativa V5 Prisma / Edit · Etapa 081
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-3">
            <Cpu className="w-6 h-6 text-cyber-cyan" />
            Exportador de Face DNA Pack para Difusores (Flux / SDXL LoRA)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Exportação do pacote canônico <code className="text-cyber-cyan font-bold">.v5facedna.json</code> com
            biometria travada, seeds determinísticos e manifesto ComfyUI para difusão homogênea no{' '}
            <strong className="text-cyber-cyan">V5 Prisma (:3000)</strong>.
          </p>
        </div>

        {/* Badge de Integridade do Pack */}
        <div className="flex items-center gap-3 bg-obsidian-950 px-4 py-2.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-500">Integridade Face DNA</div>
              <div className="text-xs font-bold text-emerald-400 font-mono">
                {integrity.score}/100 · HOMOLOGADO PRISMA
              </div>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyber-cyan border border-cyber-cyan/20">
            Seed: {pack.diffusionSeed}
          </span>
        </div>
      </div>

      {/* Seletor de Modelo de Difusão Alvo */}
      <div className="mt-6 flex flex-wrap items-center gap-2 bg-obsidian-950 p-1.5 rounded-xl border border-white/10">
        <span className="text-[11px] font-mono text-slate-400 px-3 uppercase font-bold flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyber-cyan" />
          Modelo Alvo:
        </span>
        {[
          { id: 'flux_1_dev', label: 'Flux 1.0 Dev (Alta Fidelidade)', cfg: 3.5, steps: 28 },
          { id: 'flux_1_schnell', label: 'Flux Schnell (4-Step Turbo)', cfg: 1.0, steps: 4 },
          { id: 'sdxl_1_0_lora', label: 'SDXL 1.0 LoRA Standard', cfg: 6.0, steps: 30 },
          { id: 'wan_2_1', label: 'Wan 2.1 Video Diffuser', cfg: 4.0, steps: 35 },
          { id: 'comfyui_native', label: 'ComfyUI Native Queue', cfg: 3.5, steps: 28 },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setTargetModel(m.id as TargetDiffusionModel);
              setGuidanceScale(m.cfg);
              setInferenceSteps(m.steps);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              targetModel === m.id
                ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan font-bold shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Grid: Âncora Biométrica vs Parâmetros de Difusão e ComfyUI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Âncora Biométrica e Foto (4 Colunas) */}
        <div className="lg:col-span-4 bg-obsidian-950/80 border border-white/10 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-cyber-cyan" />
                Âncora Biométrica Canônica
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">PuLID Ativo</span>
            </div>

            <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-cyber-cyan/30 shadow-[0_0_20px_rgba(0,229,255,0.15)] bg-obsidian-900">
              <img
                src={avatarImage}
                alt={targetName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-obsidian-950/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-white/10">
                Seed: {pack.diffusionSeed}
              </div>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Personagem:</span>
                <span className="text-slate-200 font-bold">{targetName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Etnia / Faixa:</span>
                <span className="text-slate-300">{pack.biometricAnchors.ethnicityAgeGender}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Iluminação:</span>
                <span className="text-cyber-cyan">{pack.biometricAnchors.lightingPreset}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Embedding ID:</span>
                <span className="text-slate-300 truncate max-w-[140px]">{pack.pulidEmbeddingId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sliders Paramétricos e ComfyUI Nodes (8 Colunas) */}
        <div className="lg:col-span-8 space-y-4 flex flex-col justify-between">
          {/* Caixa de Sliders Paramétricos */}
          <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyber-cyan" />
                Parâmetros de Difusão LoRA & KSampler
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Sampler: <strong className="text-cyber-cyan">{pack.diffusionLoRAParameters.sampler}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* LoRA Strength */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Peso LoRA:</span>
                  <span className="text-cyber-cyan font-bold">{loraStrength.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.50"
                  max="1.00"
                  step="0.05"
                  value={loraStrength}
                  onChange={(e) => setLoraStrength(parseFloat(e.target.value))}
                  className="w-full accent-cyber-cyan"
                />
                <span className="text-[10px] text-slate-500 font-mono">Recomendado: 0.85</span>
              </div>

              {/* Guidance Scale (CFG) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">CFG Scale:</span>
                  <span className="text-cyber-cyan font-bold">{guidanceScale.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="8.0"
                  step="0.5"
                  value={guidanceScale}
                  onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                  className="w-full accent-cyber-cyan"
                />
                <span className="text-[10px] text-slate-500 font-mono">Flux: 3.5 / SDXL: 6.0</span>
              </div>

              {/* Steps */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Passos (Steps):</span>
                  <span className="text-cyber-cyan font-bold">{inferenceSteps}</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="50"
                  step="2"
                  value={inferenceSteps}
                  onChange={(e) => setInferenceSteps(parseInt(e.target.value, 10))}
                  className="w-full accent-cyber-cyan"
                />
                <span className="text-[10px] text-slate-500 font-mono">Iterações de difusão</span>
              </div>

              {/* Denoise */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Denoise Video:</span>
                  <span className="text-cyber-cyan font-bold">{denoiseStrength.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.20"
                  max="0.80"
                  step="0.05"
                  value={denoiseStrength}
                  onChange={(e) => setDenoiseStrength(parseFloat(e.target.value))}
                  className="w-full accent-cyber-cyan"
                />
                <span className="text-[10px] text-slate-500 font-mono">Fator cross-scene</span>
              </div>
            </div>
          </div>

          {/* Trigger Words Tag Cloud */}
          <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-cyber-cyan" />
                Trigger Words Canônicas do Modelo
              </span>
              <button
                onClick={handleCopyTriggerWords}
                className="text-[11px] font-mono text-slate-400 hover:text-cyber-cyan flex items-center gap-1 transition-colors"
              >
                {copiedTrigger ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedTrigger ? 'Copiadas!' : 'Copiar Triggers'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {pack.diffusionLoRAParameters.triggerWords.map((tw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-cyber-cyan/15 border border-cyber-cyan/30 text-cyber-cyan font-mono text-xs font-bold"
                >
                  {tw}
                </span>
              ))}
            </div>
          </div>

          {/* Botões de Ação de Download e Cópia */}
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.25)]"
            >
              <Download className="w-4 h-4" />
              Baixar Face DNA Pack (.v5facedna.json)
            </button>

            <button
              onClick={handleCopyJson}
              className="px-5 py-2.5 rounded-xl bg-obsidian-950 hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors font-mono"
            >
              {copiedJson ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar JSON
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Inspetor de Estrutura JSON Formatada do Face DNA Pack */}
      <div className="mt-6 bg-obsidian-950/90 border border-white/10 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyber-cyan" />
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Inspetor de Estrutura do Pacote Face DNA (.v5facedna.json)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Tamanho: <strong className="text-cyber-cyan">{fileSizeKb} KB</strong> · Hash:{' '}
            <strong className="text-emerald-400">{pack.metadata.integrityChecksum}</strong>
          </span>
        </div>

        <pre className="bg-obsidian-900 border border-white/10 rounded-lg p-4 text-[11px] font-mono text-cyan-200/90 overflow-x-auto max-h-72 select-all whitespace-pre">
          {jsonString}
        </pre>
      </div>
    </section>
  );
}
