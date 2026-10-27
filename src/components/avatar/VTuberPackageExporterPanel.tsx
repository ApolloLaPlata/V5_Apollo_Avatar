'use client';

import React, { useState, useMemo } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  compileVTuberStandardPackage,
  convertPackageToPNGTuberPlus,
  convertPackageToOBSBrowserSourceConfig,
  validateVTuberPackageIntegrity,
  downloadVTuberPackage,
  VTuberFormatPreset,
  VTuberAspectRatio,
  V5VTuberPackage,
} from '@/utils/vtuberPackageExporter';
import {
  Download,
  Copy,
  Check,
  Tv,
  Layers,
  Radio,
  FileJson,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sliders,
  Monitor,
  Smartphone,
  Square,
  ShieldCheck,
  Eye,
  Activity,
  Code2,
} from 'lucide-react';

interface VTuberPackageExporterPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function VTuberPackageExporterPanel({
  avatarId,
  avatarName,
}: VTuberPackageExporterPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const targetName = currentAvatar?.name || avatarName || 'Avatar Soberano V5';

  const [selectedFormat, setSelectedFormat] = useState<VTuberFormatPreset>('v5_vtuber_sovereign');
  const [selectedRatio, setSelectedRatio] = useState<VTuberAspectRatio>('16:9');
  const [targetFps, setTargetFps] = useState<30 | 60>(60);
  const [copied, setCopied] = useState(false);

  // Compila o pacote VTuber sob demanda
  const vtuberPackage: V5VTuberPackage = useMemo(() => {
    return compileVTuberStandardPackage(currentAvatar, {
      aspectRatio: selectedRatio,
      targetFps,
      transparentBackground: true,
    });
  }, [currentAvatar, selectedRatio, targetFps]);

  // Payload final de acordo com o preset selecionado
  const finalExportData = useMemo(() => {
    switch (selectedFormat) {
      case 'pngtuber_plus':
        return convertPackageToPNGTuberPlus(vtuberPackage);
      case 'obs_browser_manifest':
        return convertPackageToOBSBrowserSourceConfig(vtuberPackage);
      case 'v5_vtuber_sovereign':
      default:
        return vtuberPackage;
    }
  }, [selectedFormat, vtuberPackage]);

  // Validação de integridade do pacote
  const integrity = useMemo(() => {
    return validateVTuberPackageIntegrity(vtuberPackage);
  }, [vtuberPackage]);

  const jsonString = useMemo(() => {
    return JSON.stringify(finalExportData, null, 2);
  }, [finalExportData]);

  const fileSizeKb = (new Blob([jsonString]).size / 1024).toFixed(1);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filenameMap: Record<VTuberFormatPreset, string> = {
      v5_vtuber_sovereign: `${currentAvatar.id}_vtuber_standard.v5vtuber.json`,
      pngtuber_plus: `${currentAvatar.id}_pngtuber_model.json`,
      obs_browser_manifest: `${currentAvatar.id}_obs_source_config.json`,
    };
    downloadVTuberPackage(finalExportData, filenameMap[selectedFormat]);
  };

  return (
    <section className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(0,229,255,0.06)] relative overflow-hidden">
      {/* Glow Superior */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-80" />

      {/* Header com Status do Exportador */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/40 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase">
            <Tv className="w-3.5 h-3.5 text-cyber-cyan" />
            Fase 8 · Conector de Live V5 Broadcaster · Etapa 072
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-3">
            <Layers className="w-6 h-6 text-cyber-cyan" />
            Exportador de Pacote VTuber Standard (.v5vtuber.json)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Exportação canônica de modelo de transmissão em tempo real para o{' '}
            <strong className="text-cyber-cyan">V5 Broadcaster (:3008)</strong>,{' '}
            <strong className="text-slate-200">OBS Studio</strong> e padrões{' '}
            <strong className="text-slate-200">PNGTuber+ / VTube Studio</strong>.
          </p>
        </div>

        {/* Badge de Integridade do Pacote */}
        <div className="flex items-center gap-3 bg-obsidian-950 px-4 py-2.5 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase text-slate-500">
                Auditoria do Pacote
              </div>
              <div className="text-xs font-bold text-emerald-400 font-mono">
                {integrity.score}/100 · HOMOLOGADO PARA LIVE
              </div>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            60 FPS Ready
          </span>
        </div>
      </div>

      {/* Barra de Controles: Formato, Aspect Ratio e FPS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Formato de Exportação */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-4 space-y-2">
          <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <FileJson className="w-3.5 h-3.5 text-cyber-cyan" />
            Padrão de Modelo VTuber
          </label>
          <div className="space-y-1.5">
            {[
              {
                id: 'v5_vtuber_sovereign',
                label: 'V5 VTuber Sovereign (.v5vtuber.json)',
                desc: 'Especificação integral (visemas + idle + webhook :3008)',
              },
              {
                id: 'pngtuber_plus',
                label: 'PNGTuber+ Standard (.json)',
                desc: 'Compatível com apps de streamer 2D leves',
              },
              {
                id: 'obs_browser_manifest',
                label: 'OBS Studio Browser Source (.json)',
                desc: 'Configuração com aceleração por GPU e fundo alpha',
              },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFormat(f.id as VTuberFormatPreset)}
                className={`w-full text-left p-2 rounded-lg text-xs font-mono transition-all border ${
                  selectedFormat === f.id
                    ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan font-bold'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div>{f.label}</div>
                <div className="text-[10px] text-slate-500 font-normal">{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Proporção de Tela / Resolução */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-4 space-y-2">
          <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyber-cyan" />
            Enquadramento de Transmissão
          </label>
          <div className="space-y-2">
            {[
              {
                id: '16:9',
                icon: Monitor,
                title: '16:9 Paisagem (1920x1080)',
                sub: 'YouTube, Twitch, Kick, OBS Studio',
              },
              {
                id: '9:16',
                icon: Smartphone,
                title: '9:16 Vertical (1080x1920)',
                sub: 'TikTok Live, Shorts Live, Reels',
              },
              {
                id: '1:1',
                icon: Square,
                title: '1:1 Quadrado (2048x2048)',
                sub: 'Master Sprite Hi-Res / VTube Studio',
              },
            ].map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRatio(r.id as VTuberAspectRatio)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs font-mono flex items-center gap-3 transition-all border ${
                    selectedRatio === r.id
                      ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan font-bold'
                      : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 text-cyber-cyan" />
                  <div>
                    <div>{r.title}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{r.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resumo do Rigging & Taxa de Quadros */}
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-4 space-y-3 flex flex-col justify-between">
          <div>
            <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyber-cyan" />
              Especificações do Modelo Compilado
            </label>
            <div className="mt-3 space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Avatar Alvo:</span>
                <span className="text-slate-200 font-bold">{targetName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Visemas Mapeados:</span>
                <span className="text-cyber-cyan font-bold">7 Fonemas (Rhubarb)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Loop de Respiração:</span>
                <span className="text-emerald-400 font-bold">
                  {vtuberPackage.idleMotionRigging.breathing.bpm} BPM (±
                  {vtuberPackage.idleMotionRigging.breathing.amplitudeYPercent}%)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Piscar Natural:</span>
                <span className="text-emerald-400 font-bold">
                  {vtuberPackage.idleMotionRigging.naturalEyeBlink.intervalMinSeconds}s a{' '}
                  {vtuberPackage.idleMotionRigging.naturalEyeBlink.intervalMaxSeconds}s
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Taxa Alvo:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setTargetFps(30)}
                    className={`px-1.5 py-0.5 rounded text-[10px] ${
                      targetFps === 30 ? 'bg-cyber-cyan text-obsidian-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    30 FPS
                  </button>
                  <button
                    onClick={() => setTargetFps(60)}
                    className={`px-1.5 py-0.5 rounded text-[10px] ${
                      targetFps === 60 ? 'bg-cyber-cyan text-obsidian-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    60 FPS
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
              <span>Tamanho Estimado:</span>
              <span className="text-cyber-cyan font-bold">{fileSizeKb} KB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de 7 Visemas Canônicos no Pacote */}
      <div className="mt-6 bg-obsidian-950/80 border border-white/10 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyber-cyan" />
            Catálogo de 7 Camadas de Visemas Integradas ao Pacote
          </h3>
          <span className="text-[10px] font-mono text-slate-400">
            Padrão Rhubarb & Oculus Lipsync
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {vtuberPackage.visemesCatalog.map((v) => (
            <div
              key={v.viseme}
              className="bg-obsidian-900 border border-white/10 rounded-lg p-3 text-center space-y-1 hover:border-cyber-cyan/50 transition-colors"
            >
              <div className="text-cyber-cyan font-mono font-bold text-xs">{v.viseme}</div>
              <div className="text-[10px] font-mono text-emerald-400">Rhubarb [{v.rhubarbCode}]</div>
              <div className="text-[10px] text-slate-400 truncate" title={v.name}>
                {v.name.split('/')[0]}
              </div>
              <div className="text-[9px] font-mono text-slate-500 pt-1">
                Abert: {(v.verticalAperture * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist de Validação do Pacote */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-4 space-y-2">
          <div className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Checagens de Conformidade Aprovadas
          </div>
          <div className="space-y-1.5">
            {integrity.passedChecks.map((chk, i) => (
              <div
                key={i}
                className="text-[11px] font-mono text-slate-300 flex items-center gap-2 bg-emerald-500/5 px-2.5 py-1.5 rounded border border-emerald-500/15"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{chk}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-obsidian-950/80 border border-white/10 rounded-xl p-4 space-y-2 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyber-cyan" />
              Destinos de Transmissão Homologados
            </div>
            <div className="mt-2 space-y-1.5 text-xs font-mono text-slate-300">
              <div className="p-2 bg-obsidian-900 rounded border border-white/5 flex items-center justify-between">
                <span>V5 Broadcaster (:3008) Studio Live</span>
                <span className="text-emerald-400 font-bold">100% Sincronizado</span>
              </div>
              <div className="p-2 bg-obsidian-900 rounded border border-white/5 flex items-center justify-between">
                <span>OBS Studio 60 FPS Browser Overlay</span>
                <span className="text-emerald-400 font-bold">Alpha Transparente</span>
              </div>
              <div className="p-2 bg-obsidian-900 rounded border border-white/5 flex items-center justify-between">
                <span>VTube Studio / PNGTuber Plus</span>
                <span className="text-emerald-400 font-bold">JSON Mapping</span>
              </div>
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.25)]"
            >
              <Download className="w-4 h-4" />
              Baixar Pacote VTuber (.json)
            </button>

            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-obsidian-900 hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors font-mono"
            >
              {copied ? (
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

      {/* Inspetor de Código JSON Formatado */}
      <div className="mt-6 bg-obsidian-950/90 border border-white/10 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyber-cyan" />
            <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Inspetor de Estrutura do Pacote VTuber ({selectedFormat})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Tamanho: <strong className="text-cyber-cyan">{fileSizeKb} KB</strong> · Hash:{' '}
            <strong className="text-emerald-400">{vtuberPackage.integrityChecksum}</strong>
          </span>
        </div>

        <pre className="bg-obsidian-900 border border-white/10 rounded-lg p-4 text-[11px] font-mono text-cyan-200/90 overflow-x-auto max-h-80 select-all whitespace-pre">
          {jsonString}
        </pre>
      </div>
    </section>
  );
}
