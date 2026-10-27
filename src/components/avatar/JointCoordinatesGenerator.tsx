'use client';

import React, { useState, useRef } from 'react';
import {
  JointPoint,
  T_POSE_CANONICAL_JOINTS,
  A_POSE_CANONICAL_JOINTS,
  SKELETAL_BONES,
  buildBroadcasterRigPayload,
} from '@/utils/skeletalRiggingEngine';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  Bone,
  Radio,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  Layers,
  ShieldCheck,
  Eye,
  Sliders,
} from 'lucide-react';

interface JointCoordinatesGeneratorProps {
  avatarId?: string;
  avatarName?: string;
  previewImageUrl?: string | null;
}

export default function JointCoordinatesGenerator({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
  previewImageUrl,
}: JointCoordinatesGeneratorProps) {
  const [posePreset, setPosePreset] = useState<'T-Pose' | 'A-Pose'>('T-Pose');
  const [joints, setJoints] = useState<JointPoint[]>(T_POSE_CANONICAL_JOINTS);
  const [selectedJointId, setSelectedJointId] = useState<string | null>(null);
  const [showBones, setShowBones] = useState(true);
  const [showJointLabels, setShowJointLabels] = useState(true);
  const [copied, setCopied] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const { updateAvatar } = useAvatarStore();

  const handlePoseChange = (preset: 'T-Pose' | 'A-Pose') => {
    setPosePreset(preset);
    setJoints(preset === 'T-Pose' ? T_POSE_CANONICAL_JOINTS : A_POSE_CANONICAL_JOINTS);
  };

  const handleReset = () => {
    setJoints(posePreset === 'T-Pose' ? T_POSE_CANONICAL_JOINTS : A_POSE_CANONICAL_JOINTS);
    toast.info('Coordenadas Redefinidas', 'Joints retornados aos valores canônicos da holding.');
  };

  // Mover articulação ao arrastar ou clicar no viewport
  const handleViewportClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedJointId || !viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setJoints((prev) =>
      prev.map((j) => (j.id === selectedJointId ? { ...j, x, y } : j))
    );
  };

  const payload = buildBroadcasterRigPayload(avatarId, avatarName, joints, posePreset);

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    toast.success(
      'Metadados de Rigging Copiados!',
      `${joints.length} articulações prontas para ingestão no V5 Broadcaster (:3008).`
    );
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${avatarName.toLowerCase().replace(/\s+/g, '_')}_broadcaster_rig.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Download Concluído', 'Arquivo .json de rig salvo localmente.');
  };

  const handleSaveToStore = () => {
    const jointMap: Record<string, { x: number; y: number }> = {};
    joints.forEach((j) => {
      jointMap[j.id] = { x: j.x, y: j.y };
    });

    updateAvatar(avatarId, {
      rigging: {
        jointCoordinates: jointMap,
        idleMotionIntensity: 0.8,
        breathingCycleSeconds: 3.5,
      },
    });

    toast.success('DNA de Rigging Gravado', 'Articulações vinculadas permanentemente ao personagem.');
  };

  const activeJoint = joints.find((j) => j.id === selectedJointId);

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Bone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Gerador de Metadados de Articulação Óssea (V5 Broadcaster Rig)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Porta :3008 Ready
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Mapeamento de 20 keypoints anatômicos (MediaPipe / OpenPose) para rastreamento de VTuber e mocap
            </p>
          </div>
        </div>

        {/* T-Pose / A-Pose Preset Pill Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-obsidian-950 border border-white/10 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => handlePoseChange('T-Pose')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              posePreset === 'T-Pose'
                ? 'bg-cyber-cyan text-obsidian-950 shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            T-Pose (90º)
          </button>
          <button
            type="button"
            onClick={() => handlePoseChange('A-Pose')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              posePreset === 'A-Pose'
                ? 'bg-cyber-cyan text-obsidian-950 shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            A-Pose (45º)
          </button>
        </div>
      </div>

      {/* Grid: Viewport Esquelético (Esquerda) e Inspetor de Joints / Export (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna 1: Viewport com Wireframe SVG (5 cols) */}
        <div className="lg:col-span-5 bg-obsidian-950 rounded-xl p-4 border border-white/10 flex flex-col items-center">
          <div className="flex items-center justify-between w-full pb-2 mb-2 border-b border-white/5 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-cyber-cyan font-bold">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Squeleto Interativo (Clique para reposicionar)
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="hover:text-white flex items-center gap-1 text-[10px] cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div
            ref={viewportRef}
            onClick={handleViewportClick}
            className="relative w-full aspect-[9/16] max-w-[280px] bg-gradient-to-b from-obsidian-900 via-obsidian-950 to-black rounded-lg border border-white/10 overflow-hidden cursor-crosshair select-none"
          >
            {/* Silhueta de Fundo / Preview */}
            {previewImageUrl ? (
              <img
                src={previewImageUrl}
                alt="Avatar Rig Silhouette"
                className="absolute inset-0 w-full h-full object-contain opacity-40 pointer-events-none"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <span className="text-6xl font-extrabold text-slate-500 font-mono">RIG</span>
              </div>
            )}

            {/* SVG Bones (Linhas de Conexão Óssea) */}
            {showBones && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {SKELETAL_BONES.map((bone, idx) => {
                  const fromJoint = joints.find((j) => j.id === bone.from);
                  const toJoint = joints.find((j) => j.id === bone.to);
                  if (!fromJoint || !toJoint) return null;

                  return (
                    <line
                      key={idx}
                      x1={`${fromJoint.x * 100}%`}
                      y1={`${fromJoint.y * 100}%`}
                      x2={`${toJoint.x * 100}%`}
                      y2={`${toJoint.y * 100}%`}
                      stroke={bone.color || '#00E5FF'}
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="opacity-80"
                    />
                  );
                })}
              </svg>
            )}

            {/* Marcadores de Joints (Articulações) */}
            {joints.map((joint) => {
              const isSelected = selectedJointId === joint.id;
              return (
                <div
                  key={joint.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedJointId(joint.id);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-transform hover:scale-150 z-20 flex items-center justify-center ${
                    isSelected
                      ? 'w-4 h-4 bg-cyber-cyan ring-4 ring-cyan-400/50 shadow-[0_0_15px_rgba(0,229,255,1)]'
                      : 'w-3 h-3 bg-luxury-gold/90 border border-white shadow-[0_0_6px_rgba(212,175,55,0.8)]'
                  }`}
                  style={{
                    left: `${joint.x * 100}%`,
                    top: `${joint.y * 100}%`,
                  }}
                  title={`${joint.name} (X: ${joint.x.toFixed(2)}, Y: ${joint.y.toFixed(2)})`}
                >
                  {showJointLabels && isSelected && (
                    <span className="absolute left-5 top-0 whitespace-nowrap px-1.5 py-0.5 rounded bg-obsidian-950/90 border border-cyber-cyan text-cyber-cyan text-[8px] font-bold pointer-events-none z-30">
                      {joint.name}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="w-full mt-3 flex items-center justify-between text-[10px] text-slate-400 px-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showBones}
                onChange={(e) => setShowBones(e.target.checked)}
                className="accent-cyber-cyan"
              />
              Exibir Conexões Ósseas
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showJointLabels}
                onChange={(e) => setShowJointLabels(e.target.checked)}
                className="accent-cyber-cyan"
              />
              Rótulos de Articulação
            </label>
          </div>
        </div>

        {/* Coluna 2: Inspetor de Coordenadas e Exportador V5 Broadcaster (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card da Articulação Selecionada */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyber-cyan" />
                Articulação Selecionada
              </span>
              {activeJoint ? (
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30">
                  {activeJoint.id} ({activeJoint.group})
                </span>
              ) : (
                <span className="text-[10px] text-slate-500">Clique em um ponto do esqueleto</span>
              )}
            </div>

            {activeJoint ? (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-obsidian-950 p-2.5 rounded-lg border border-white/10">
                  <span className="text-[9px] text-slate-400 block">Eixo X (Horizontal)</span>
                  <span className="text-sm font-bold text-cyber-cyan font-mono">
                    {activeJoint.x.toFixed(4)}
                  </span>
                </div>
                <div className="bg-obsidian-950 p-2.5 rounded-lg border border-white/10">
                  <span className="text-[9px] text-slate-400 block">Eixo Y (Vertical)</span>
                  <span className="text-sm font-bold text-luxury-gold font-mono">
                    {activeJoint.y.toFixed(4)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 py-2">
                Selecione qualquer articulação (ombro, cotovelo, joelho, cabeça) para ajustar milimetricamente suas coordenadas de rigging.
              </p>
            )}
          </div>

          {/* Lista Rápida de Articulações por Grupo */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Catálogo de Articulações Rigged ({joints.length} nós)
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-[140px] overflow-y-auto pr-1">
              {joints.map((j) => (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => setSelectedJointId(j.id)}
                  className={`p-1.5 rounded-lg text-left text-[10px] border truncate transition-all cursor-pointer ${
                    selectedJointId === j.id
                      ? 'border-cyber-cyan bg-cyber-cyan/15 text-white font-bold'
                      : 'border-white/5 bg-white/[0.01] text-slate-400 hover:border-white/20 hover:text-slate-200'
                  }`}
                >
                  {j.name}
                </button>
              ))}
            </div>
          </div>

          {/* Telemetria do Conector Broadcaster */}
          <div className="p-3.5 rounded-xl bg-obsidian-950 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Radio className="w-4 h-4 text-emerald-400" />
                Bridge Capitania #07 · V5 Broadcaster
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Payload V1 Ready
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Os metadados contêm a matriz completa de joints e ossos para ingestão direta no motor de captura de movimento e OBS Ducking do Broadcaster.
            </p>

            {/* Ações de Exportação */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyJSON}
                className="flex-1 py-2 px-3 rounded-xl bg-cyber-cyan text-obsidian-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-cyan-300 transition-colors cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.3)]"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado!' : 'Copiar Payload JSON'}
              </button>

              <button
                type="button"
                onClick={handleDownloadJSON}
                className="py-2 px-3 rounded-xl bg-white/5 text-slate-200 border border-white/10 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Exportar .json
              </button>

              <button
                type="button"
                onClick={handleSaveToStore}
                className="py-2 px-3 rounded-xl bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/30 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-luxury-gold/25 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Salvar DNA de Rig
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
