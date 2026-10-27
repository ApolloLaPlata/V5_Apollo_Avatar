'use client';

import React, { useState, useMemo } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  FviStatus,
  DEFAULT_SCENE_TAKES,
  SceneTakeInput,
  evaluateSceneVerification,
  exportFviAuditReport,
} from '@/utils/faceVerificationIndexEngine';
import {
  Scan,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Download,
  Copy,
  Check,
  Sliders,
  Layers,
  Camera,
  Activity,
  Info,
  ChevronRight,
  Maximize2,
  RotateCcw,
} from 'lucide-react';

interface FaceVerificationIndexPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function FaceVerificationIndexPanel({
  avatarId,
  avatarName,
}: FaceVerificationIndexPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const targetName = currentAvatar?.name || avatarName || 'Maya Vance';
  const anchorPhoto =
    currentAvatar?.face.primaryAnchorImage ||
    currentAvatar?.avatarUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  const [loraBoost, setLoraBoost] = useState<number>(0.85);
  const [passingThreshold, setPassingThreshold] = useState<number>(88.0);
  const [compensateLighting, setCompensateLighting] = useState<boolean>(true);
  const [selectedSceneId, setSelectedSceneId] = useState<string>('take_01');

  const [copiedReport, setCopiedReport] = useState(false);

  // Avaliação reativa de auditoria biométrica FVI
  const fviSummary = useMemo(() => {
    return evaluateSceneVerification(DEFAULT_SCENE_TAKES, currentAvatar, {
      customLoraBoost: loraBoost,
      customThresholdPassing: passingThreshold,
      compensateLighting,
    });
  }, [currentAvatar, loraBoost, passingThreshold, compensateLighting]);

  const activeSceneReport = useMemo(() => {
    return fviSummary.scenes.find((s) => s.sceneId === selectedSceneId) || fviSummary.scenes[0];
  }, [fviSummary.scenes, selectedSceneId]);

  const handleCopySummary = () => {
    const text =
      `=== RELATÓRIO BIOMÉTRICO FVI (FACE VERIFICATION INDEX) ===\n` +
      `AVATAR: ${fviSummary.avatarName} (${fviSummary.avatarId})\n` +
      `SCORE MÉDIO: ${fviSummary.averageBatchFviScore}% | STATUS: ${fviSummary.overallBatchStatus}\n` +
      `CENAS APROVADAS: ${fviSummary.passedScenesCount}/${fviSummary.totalScenesEvaluated}\n\n` +
      fviSummary.scenes
        .map(
          (s) =>
            `[${s.sceneId.toUpperCase()}] ${s.sceneName}\n` +
            `SCORE: ${s.overallFviScore}% (${s.status}) | ARCFACE: ${s.metrics.arcFaceCosineSimilarity}\n` +
            `ENQUADRAMENTO: ${s.framing} (${s.angleDegrees}º) | AMBIENTE: ${s.environmentName}\n` +
            `RECOMENDAÇÃO: ${s.recommendations.join('; ')}\n`
        )
        .join('\n----------------------------------------\n\n');

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const getStatusBadge = (status: FviStatus) => {
    switch (status) {
      case 'EXCELLENT':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            EXCELENTE
          </span>
        );
      case 'ACCEPTABLE':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 text-xs font-mono font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            ACEITÁVEL
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            ATENÇÃO
          </span>
        );
      case 'FAILED':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-400 text-xs font-mono font-bold flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            REJEITADO
          </span>
        );
    }
  };

  return (
    <div className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(0,229,255,0.08)] space-y-6">
      {/* Header do Painel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <Scan className="w-3.5 h-3.5" />
            Fase 9 · Etapa 086 · Conector V5 Prisma / Edit
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Estimador de Semelhança Facial Cross-Scene (FVI)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Auditoria biométrica automatizada (ArcFace, distâncias de marcos faciais e simetria labial) comparando a foto âncora com tomadas do V5 Prisma.
          </p>
        </div>

        {/* Badges de Telemetria e Ações Globais */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-obsidian-950 border border-emerald-500/30 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-400">Score Médio FVI</div>
              <div className="text-xs font-bold text-emerald-400">
                {fviSummary.averageBatchFviScore}% ({fviSummary.overallBatchStatus})
              </div>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-obsidian-950 border border-cyber-cyan/30 flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-cyber-cyan" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-400">Cenas Aprovadas</div>
              <div className="text-xs font-bold text-cyber-cyan">
                {fviSummary.passedScenesCount} / {fviSummary.totalScenesEvaluated} Takes
              </div>
            </div>
          </div>

          <button
            onClick={() => exportFviAuditReport(fviSummary)}
            className="px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-400/40 text-purple-300 hover:bg-purple-500/25 transition-all text-xs font-mono font-semibold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Exportar Auditoria JSON (.v5fviaudit)
          </button>
        </div>
      </div>

      {/* Seção de Controles de Calibração e Foto Âncora */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-obsidian-950/70 border border-white/5 rounded-xl p-5">
        {/* Foto Âncora (3 Colunas) */}
        <div className="md:col-span-3 flex flex-col items-center justify-center p-3 border border-white/10 rounded-lg bg-obsidian-900/60 text-center">
          <span className="text-[10px] font-mono uppercase text-slate-400 mb-2 font-bold tracking-wider">
            Âncora Biométrica Principal
          </span>
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-cyber-cyan shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            <img src={anchorPhoto} alt={targetName} className="w-full h-full object-cover" />
          </div>
          <span className="text-xs font-bold text-white mt-2">{targetName}</span>
          <span className="text-[10px] font-mono text-cyber-cyan">Embed ArcFace 512-dim</span>
        </div>

        {/* Controles de Simulação LoRA & Threshold (9 Colunas) */}
        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-obsidian-900 p-3.5 rounded-lg border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Peso LoRA Aplicado:</span>
              <span className="text-cyber-cyan font-bold">{loraBoost.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.60"
              max="1.00"
              step="0.05"
              value={loraBoost}
              onChange={(e) => setLoraBoost(Number(e.target.value))}
              className="w-full accent-cyber-cyan cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              0.80 a 0.90 mantém fidelidade facial sem engessar as expressões.
            </p>
          </div>

          <div className="bg-obsidian-900 p-3.5 rounded-lg border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Nota de Corte (Threshold):</span>
              <span className="text-purple-300 font-bold">{passingThreshold}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="95"
              step="1"
              value={passingThreshold}
              onChange={(e) => setPassingThreshold(Number(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Shorts aceitam 88%+, vídeos 4K exigem 94%+ de paridade biométrica.
            </p>
          </div>

          <div className="bg-obsidian-900 p-3.5 rounded-lg border border-white/5 space-y-2 flex flex-col justify-between">
            <div>
              <span className="text-slate-300 block mb-1">Compensação de Luz:</span>
              <p className="text-[10px] text-slate-400">
                Normaliza variações de sombra para evitar falsos alertas de desvio.
              </p>
            </div>
            <button
              onClick={() => setCompensateLighting(!compensateLighting)}
              className={`w-full py-1.5 rounded text-xs font-mono font-bold transition-all border ${
                compensateLighting
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-slate-400'
              }`}
            >
              {compensateLighting ? 'Luz Compensada (Ativa)' : 'Luz Bruta (Sem Filtro)'}
            </button>
          </div>
        </div>
      </div>

      {/* Grade de Tomadas Avaliadas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-slate-200">Tomadas Auditadas no Lote:</span>
          <button
            onClick={handleCopySummary}
            className="text-cyber-cyan hover:underline flex items-center gap-1"
          >
            {copiedReport ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copiedReport ? 'Copiado!' : 'Copiar Relatório Completo'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
          {fviSummary.scenes.map((scene) => {
            const isSelected = selectedSceneId === scene.sceneId;
            return (
              <button
                key={scene.sceneId}
                onClick={() => setSelectedSceneId(scene.sceneId)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-cyber-cyan/15 border-cyber-cyan shadow-[0_0_15px_rgba(0,229,255,0.15)] ring-1 ring-cyber-cyan'
                    : 'bg-obsidian-950 border-white/5 hover:border-white/20 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                  <span className={isSelected ? 'text-cyber-cyan font-bold' : 'text-slate-300'}>
                    {scene.sceneId.toUpperCase()}
                  </span>
                  <span>{getStatusBadge(scene.status)}</span>
                </div>

                <div className="text-xs font-bold text-slate-200 truncate mb-1">
                  {scene.sceneName.split('. ')[1] || scene.sceneName}
                </div>

                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Score FVI:</span>
                  <strong className="text-emerald-400">{scene.overallFviScore}%</strong>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inspetor Detalhado da Tomada Selecionada */}
      <div className="bg-obsidian-950 border border-cyber-cyan/20 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-cyber-cyan">
                {activeSceneReport.sceneId.toUpperCase()}
              </span>
              <h3 className="text-base font-bold text-white">{activeSceneReport.sceneName}</h3>
              {getStatusBadge(activeSceneReport.status)}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Enquadramento: <strong>{activeSceneReport.framing}</strong> ({activeSceneReport.angleDegrees}º de rotação) | Cenário: <strong>{activeSceneReport.environmentName}</strong>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-400">Índice FVI:</span>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {activeSceneReport.overallFviScore}%
            </div>
          </div>
        </div>

        {/* 6 Indicadores Biométricos Específicos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs font-mono">
          <div className="bg-obsidian-900 p-2.5 rounded-lg border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500">ArcFace Cosseno:</span>
            <div className="text-cyber-cyan font-bold">
              {activeSceneReport.metrics.arcFaceCosineSimilarity}
            </div>
          </div>

          <div className="bg-obsidian-900 p-2.5 rounded-lg border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500">Dist. Interpupilar:</span>
            <div className="text-slate-200 font-bold">
              {activeSceneReport.metrics.interpupillaryRatio}%
            </div>
          </div>

          <div className="bg-obsidian-900 p-2.5 rounded-lg border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500">Contorno Mandibular:</span>
            <div className="text-slate-200 font-bold">
              {activeSceneReport.metrics.jawlineContourMatch}%
            </div>
          </div>

          <div className="bg-obsidian-900 p-2.5 rounded-lg border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500">Ponte Nasal:</span>
            <div className="text-slate-200 font-bold">
              {activeSceneReport.metrics.nasalBridgeAngleMatch}%
            </div>
          </div>

          <div className="bg-obsidian-900 p-2.5 rounded-lg border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500">Simetria Labial:</span>
            <div className="text-slate-200 font-bold">
              {activeSceneReport.metrics.lipThicknessSymmetry}%
            </div>
          </div>

          <div className="bg-obsidian-900 p-2.5 rounded-lg border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500">Tom de Pele (Luz):</span>
            <div className="text-slate-200 font-bold">
              {activeSceneReport.metrics.skinMelaninParity}%
            </div>
          </div>
        </div>

        {/* Parecer Técnico e Recomendação */}
        <div className="bg-obsidian-900/80 p-3 rounded-lg border border-white/5 flex items-start gap-2.5 text-xs text-slate-300">
          <Info className="w-4 h-4 text-cyber-cyan shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Parecer da Auditoria Biometria V5:</strong>{' '}
            {activeSceneReport.recommendations.join(' ')}
          </div>
        </div>
      </div>

      {/* Matriz de Similaridade Cruzada Par a Par (Cross-Scene Drift) */}
      <div className="bg-obsidian-950/70 border border-white/5 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            Matriz de Deriva Cruzada Par a Par (Cross-Scene Matrix)
          </span>
          <span className="text-slate-500 text-[11px]">
            Garante que a transição entre qualquer par de tomadas não cause estranhamento
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
          {fviSummary.pairwiseCrossSceneMatrix.map((pair, idx) => (
            <div
              key={idx}
              className="p-2 rounded bg-obsidian-900 border border-white/5 flex items-center justify-between"
            >
              <span className="text-slate-400 text-[11px]">
                {pair.sceneA.toUpperCase()} ↔ {pair.sceneB.toUpperCase()}
              </span>
              <span
                className={`font-bold ${
                  pair.driftRisk === 'low'
                    ? 'text-emerald-400'
                    : pair.driftRisk === 'moderate'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {(pair.cosineSimilarity * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
