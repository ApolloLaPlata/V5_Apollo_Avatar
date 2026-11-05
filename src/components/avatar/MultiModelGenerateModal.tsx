'use client';

import React, { useState } from 'react';
import { Avatar } from '@/types/avatar';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  X,
  Sparkles,
  Zap,
  Sliders,
  Cpu,
  Layers,
  Image as ImageIcon,
  Check,
  Download,
  RotateCw,
  Eye,
  ShieldCheck,
  Camera,
  Shirt,
  Building,
  Smile,
} from 'lucide-react';

interface MultiModelGenerateModalProps {
  avatar: Avatar;
  isOpen: boolean;
  onClose: () => void;
  defaultAngle?: 'front' | 'threeQuarter' | 'profile' | 'back';
}

type ModelType = 'flux_dev' | 'flux_schnell' | 'sdxl_lightning' | 'ideogram_v2';
type PresetType = 'turnaround_angle' | 'attire_variation' | 'environment_studio' | 'expression_shift';

export default function MultiModelGenerateModal({
  avatar,
  isOpen,
  onClose,
  defaultAngle = 'front',
}: MultiModelGenerateModalProps) {
  const { updateAvatar } = useAvatarStore();

  const [selectedModel, setSelectedModel] = useState<ModelType>('flux_dev');
  const [selectedPreset, setSelectedPreset] = useState<PresetType>('turnaround_angle');
  const [targetAngle, setTargetAngle] = useState<'front' | 'threeQuarter' | 'profile' | 'back'>(defaultAngle);
  const [customPrompt, setCustomPrompt] = useState('');
  const [lighting, setLighting] = useState(avatar.face.lightingPreset || 'volumetric_neon');
  const [computeBackend, setComputeBackend] = useState<'modal_h100' | 'comfy_local'>('modal_h100');

  // Estado de Geração
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    imageUrl: string;
    seed: number;
    durationSec: number;
    fidelityScore: number;
    compiledPrompt: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      const res = await fetch('/api/avatar/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avatarId: avatar.id,
          avatarName: avatar.name,
          model: selectedModel,
          presetType: selectedPreset,
          angle: targetAngle,
          customPrompt,
          clothingPrompt: avatar.face.clothingPrompt,
          fixedFeaturesPrompt: avatar.face.fixedFeaturesPrompt,
          lightingPreset: lighting,
          computeBackend,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro na geração');

      setGeneratedResult({
        imageUrl: data.imageUrl,
        seed: data.seed,
        durationSec: data.durationSec,
        fidelityScore: data.faceFidelityScore,
        compiledPrompt: data.compiledPrompt,
      });

      toast.success(
        'Geração Concluída!',
        `Imagem gerada com sucesso via ${selectedModel.toUpperCase()} em ${data.durationSec}s.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error('Erro na Geração', msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToAngle = () => {
    if (!generatedResult) return;

    const currentRefs = [...(avatar.face.referenceImages || [])];
    while (currentRefs.length < 4) {
      currentRefs.push(avatar.avatarUrl);
    }

    let angleIdx = 0;
    if (targetAngle === 'front') angleIdx = 0;
    else if (targetAngle === 'threeQuarter') angleIdx = 1;
    else if (targetAngle === 'profile') angleIdx = 2;
    else if (targetAngle === 'back') angleIdx = 3;

    currentRefs[angleIdx] = generatedResult.imageUrl;

    updateAvatar(avatar.id, {
      avatarUrl: targetAngle === 'front' ? generatedResult.imageUrl : avatar.avatarUrl,
      face: {
        ...avatar.face,
        primaryAnchorImage: targetAngle === 'front' ? generatedResult.imageUrl : avatar.face.primaryAnchorImage,
        referenceImages: currentRefs,
      },
    });

    toast.success('Ângulo Atualizado', `A nova imagem foi aplicada ao ângulo ${targetAngle} de ${avatar.name}!`);
    onClose();
  };

  const handleApplyAsPrimary = () => {
    if (!generatedResult) return;

    updateAvatar(avatar.id, {
      avatarUrl: generatedResult.imageUrl,
      face: {
        ...avatar.face,
        primaryAnchorImage: generatedResult.imageUrl,
      },
    });

    toast.success('Âncora Principal Atualizada', `${avatar.name} agora possui esta foto como âncora principal!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-obsidian-950 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Hub de Geração Multi-Modelos IA</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Modal H100 GPU Swarm
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gere fotos, poses e ângulos mantendo o Face DNA consistente de <strong className="text-cyber-cyan">{avatar.name}</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Seleção do Modelo IA */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>Motor de Difusão / Modelo IA:</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'flux_dev', name: 'FLUX.1 Dev', badge: 'Alta Fidelidade', desc: 'Klein LoRA' },
              { id: 'flux_schnell', name: 'FLUX Schnell', badge: 'Rápido (2s)', desc: '4-Step Preview' },
              { id: 'sdxl_lightning', name: 'SDXL Light', badge: 'Baixa VRAM', desc: 'Consistência' },
              { id: 'ideogram_v2', name: 'Ideogram v2', badge: 'Tipografia', desc: 'Roupas & Logos' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedModel(m.id as ModelType)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedModel === m.id
                    ? 'bg-purple-600/20 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>{m.name}</span>
                  {selectedModel === m.id && <Check className="w-3.5 h-3.5 text-purple-400" />}
                </div>
                <div className="text-[10px] text-purple-300 font-mono mt-0.5">{m.badge}</div>
                <div className="text-[10px] text-slate-500 font-mono">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Tipo de Variação / Preset */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Objetivo da Geração:</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'turnaround_angle', label: 'Ângulo 360°', icon: Camera },
              { id: 'attire_variation', label: 'Novo Figurino', icon: Shirt },
              { id: 'environment_studio', label: 'Novo Estúdio', icon: Building },
              { id: 'expression_shift', label: 'Expressão Facial', icon: Smile },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPreset(p.id as PresetType)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    selectedPreset === p.id
                      ? 'bg-cyber-cyan text-obsidian-950 font-bold border-cyber-cyan'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Parâmetros Conforme Preset */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-900/60 border border-white/10 rounded-xl text-xs">
          {selectedPreset === 'turnaround_angle' && (
            <div className="space-y-1 sm:col-span-2">
              <label className="font-mono text-slate-300 block">Ângulo Alvo da Rotação:</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'front', label: 'Frente (0°)' },
                  { id: 'threeQuarter', label: '3/4 (45°)' },
                  { id: 'profile', label: 'Perfil (90°)' },
                  { id: 'back', label: 'Costas (180°)' },
                ].map((ang) => (
                  <button
                    key={ang.id}
                    type="button"
                    onClick={() => setTargetAngle(ang.id as any)}
                    className={`py-1.5 rounded-lg font-mono text-center transition-all ${
                      targetAngle === ang.id
                        ? 'bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan font-bold'
                        : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ang.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="font-mono text-slate-300 block mb-1">Iluminação de Cena:</label>
            <select
              value={lighting}
              onChange={(e) => setLighting(e.target.value as any)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-cyan"
            >
              <option value="volumetric_neon">Neon Volumétrico</option>
              <option value="rembrandt">Rembrandt Clássica</option>
              <option value="ring_light">Ring Light Suave</option>
              <option value="softbox">Softbox de Estúdio</option>
              <option value="natural_sunlight">Luz Natural Solar</option>
            </select>
          </div>

          <div>
            <label className="font-mono text-slate-300 block mb-1">Cluster de Renderização:</label>
            <select
              value={computeBackend}
              onChange={(e) => setComputeBackend(e.target.value as any)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-cyan"
            >
              <option value="modal_h100">Modal 4x H100 SXM5 (Nuvem Soberana)</option>
              <option value="comfy_local">ComfyUI Local (RTX)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="font-mono text-slate-300 block mb-1">
              Instruções Adicionais (Prompt de Ajuste):
            </label>
            <input
              type="text"
              placeholder="Ex: Segurando um microfone Shure, fundo de podcast com led azul..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-cyan"
            />
          </div>
        </div>

        {/* Visualização de Face DNA Travado */}
        <div className="p-3 bg-purple-950/30 border border-purple-500/20 rounded-xl flex items-center justify-between text-xs font-mono text-purple-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Face DNA Travado: Traços faciais fixos e semente mantidos para consistência.</span>
          </div>
          <span className="text-emerald-400 font-bold">Fidelidade ~98%</span>
        </div>

        {/* Botão de Disparo */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyber-cyan hover:from-purple-500 hover:to-cyan-400 text-obsidian-950 font-bold font-mono text-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin text-black" />
              <span>Sintetizando Imagem na Usina Modal H100...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-black" />
              <span>Gerar Imagem com {selectedModel.toUpperCase()}</span>
            </>
          )}
        </button>

        {/* Resultado Gerado */}
        {generatedResult && (
          <div className="p-4 bg-slate-900 border border-cyber-cyan/40 rounded-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyber-cyan font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                Render Concluído ({generatedResult.durationSec}s • Seed: {generatedResult.seed})
              </span>
              <span className="text-xs font-mono text-slate-400">
                Fidelidade: {generatedResult.fidelityScore}%
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img
                src={generatedResult.imageUrl}
                alt="Gerado"
                className="w-36 h-48 rounded-xl object-cover border border-white/20 shadow-md"
              />
              <div className="space-y-2 flex-1 w-full text-xs">
                <p className="text-slate-300 line-clamp-3 font-mono text-[11px] bg-black/40 p-2.5 rounded-lg border border-white/5">
                  <span className="text-purple-400 font-bold">Prompt: </span>
                  {generatedResult.compiledPrompt}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleApplyToAngle}
                    className="py-2 px-3 rounded-lg bg-cyber-cyan hover:bg-cyan-400 text-obsidian-950 font-mono font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Aplicar a {targetAngle.toUpperCase()}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApplyAsPrimary}
                    className="py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Tornar Foto Principal</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
