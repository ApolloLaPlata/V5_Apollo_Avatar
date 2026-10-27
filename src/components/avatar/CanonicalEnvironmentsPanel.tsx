'use client';

import React, { useState, useMemo } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  CanonicalEnvironment,
  CANONICAL_ENVIRONMENTS,
  EnvironmentCategory,
  BokehLevel,
  TimeOfDay,
  compileEnvironmentPrompt,
  exportEnvironmentsCatalogJson,
} from '@/utils/canonicalEnvironmentsEngine';
import {
  Compass,
  Sparkles,
  Layers,
  Copy,
  Check,
  Download,
  Sun,
  Moon,
  Sunset,
  Volume2,
  Camera,
  Maximize2,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Palette,
  ExternalLink,
  Laptop,
  Flame,
  Radio,
  Building,
  Mic,
  Home,
} from 'lucide-react';

interface CanonicalEnvironmentsPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function CanonicalEnvironmentsPanel({
  avatarId,
  avatarName,
}: CanonicalEnvironmentsPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const targetName = currentAvatar?.name || avatarName || 'Maya Vance';

  const [selectedEnvId, setSelectedEnvId] = useState<string>('home_office_tech');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [bokehLevel, setBokehLevel] = useState<BokehLevel>('f/1.8 cinematic bokeh');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('daylight');
  const [addHaze, setAddHaze] = useState<boolean>(true);

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedNegative, setCopiedNegative] = useState(false);

  const selectedEnvironment = useMemo(() => {
    return (
      CANONICAL_ENVIRONMENTS.find((e) => e.id === selectedEnvId) ||
      CANONICAL_ENVIRONMENTS[0]
    );
  }, [selectedEnvId]);

  const filteredEnvironments = useMemo(() => {
    if (activeCategory === 'all') return CANONICAL_ENVIRONMENTS;
    return CANONICAL_ENVIRONMENTS.filter((e) => e.category === activeCategory);
  }, [activeCategory]);

  const compiledPrompt = useMemo(() => {
    return compileEnvironmentPrompt(selectedEnvironment, currentAvatar, {
      bokehLevel,
      timeOfDay,
      addAtmosphericHaze: addHaze,
    });
  }, [selectedEnvironment, currentAvatar, bokehLevel, timeOfDay, addHaze]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(compiledPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyNegative = () => {
    navigator.clipboard.writeText(selectedEnvironment.negativeEnvironmentPrompt);
    setCopiedNegative(true);
    setTimeout(() => setCopiedNegative(false), 2000);
  };

  const getCategoryIcon = (category: EnvironmentCategory) => {
    switch (category) {
      case 'executive_tech':
        return <Laptop className="w-3.5 h-3.5 text-cyber-cyan" />;
      case 'keynote_stage':
        return <Flame className="w-3.5 h-3.5 text-blue-400" />;
      case 'indoor_studio':
        return <Radio className="w-3.5 h-3.5 text-purple-400" />;
      case 'outdoor_urban':
        return <Building className="w-3.5 h-3.5 text-amber-400" />;
      case 'podcast_lounge':
        return <Mic className="w-3.5 h-3.5 text-rose-400" />;
      case 'lifestyle_loft':
        return <Home className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(0,229,255,0.08)] space-y-6">
      {/* Header do Painel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <Compass className="w-3.5 h-3.5" />
            Fase 9 · Etapa 083 · Conector V5 Prisma / Edit
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Tabela de Cenários & Ambientes Canônicos
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Padronização dos 6 cenários oficiais da Holding V5 Apollo para renderização de Shorts e vídeos longos com coerência de bokeh, luz e acústica.
          </p>
        </div>

        {/* Ações Globais */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => exportEnvironmentsCatalogJson(CANONICAL_ENVIRONMENTS)}
            className="px-4 py-2 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/25 transition-all text-xs font-mono font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.15)]"
          >
            <Download className="w-4 h-4" />
            Exportar Catálogo JSON (.v5environments)
          </button>
        </div>
      </div>

      {/* Filtros por Categoria */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        <span className="text-slate-500 text-[11px] uppercase mr-1">Filtrar:</span>
        {[
          { id: 'all', label: 'Todos (6 Cenários)' },
          { id: 'executive_tech', label: 'Home Office Tech' },
          { id: 'keynote_stage', label: 'Palco Keynote' },
          { id: 'indoor_studio', label: 'Dark Studio V5' },
          { id: 'outdoor_urban', label: 'Externa Urbana' },
          { id: 'podcast_lounge', label: 'Podcast Lounge' },
          { id: 'lifestyle_loft', label: 'Loft UGC' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
              activeCategory === tab.id
                ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan font-bold shadow-[0_0_10px_rgba(0,229,255,0.15)]'
                : 'bg-obsidian-950 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grade de Seleção dos 6 Cenários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEnvironments.map((env) => {
          const isSelected = selectedEnvId === env.id;
          return (
            <div
              key={env.id}
              onClick={() => {
                setSelectedEnvId(env.id);
                setBokehLevel(env.recommendedBokeh);
                setTimeOfDay(env.defaultTimeOfDay);
              }}
              className={`group cursor-pointer rounded-xl border overflow-hidden transition-all duration-300 relative ${
                isSelected
                  ? 'bg-obsidian-950 border-cyber-cyan shadow-[0_0_20px_rgba(0,229,255,0.2)] ring-1 ring-cyber-cyan/50'
                  : 'bg-obsidian-950/60 border-white/5 hover:border-white/20 hover:bg-obsidian-950'
              }`}
            >
              {/* Imagem de Prévia com Overlay */}
              <div className="h-36 w-full relative overflow-hidden bg-obsidian-900">
                <img
                  src={env.previewImageUrl}
                  alt={env.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent" />

                {/* Badge de Categoria */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-obsidian-950/90 border border-white/10 text-[10px] font-mono font-bold text-slate-200 backdrop-blur-md">
                  {getCategoryIcon(env.category)}
                  <span>{env.category.replace('_', ' ').toUpperCase()}</span>
                </div>

                {/* Temperatura de Cor */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-[10px] font-mono text-amber-300 backdrop-blur-md">
                  {env.colorTemperature}
                </div>

                {/* Paleta Dominante Flutuante */}
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1">
                  {env.dominantPalette.map((color, i) => (
                    <span
                      key={i}
                      className="w-3.5 h-3.5 rounded-full border border-black/50 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Corpo do Card */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-bold ${isSelected ? 'text-cyber-cyan' : 'text-white'}`}>
                    {env.name}
                  </h3>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
                  )}
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {env.shortDescription}
                </p>

                {/* Badges de Acústica e Bokeh */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Camera className="w-3 h-3 text-cyber-cyan" />
                    {env.recommendedBokeh.split(' ')[0]}
                  </span>
                  <span className="flex items-center gap-1 text-purple-400">
                    <Volume2 className="w-3 h-3" />
                    RT60: {env.acousticProfile.rt60DecaySeconds}s
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspetor Detalhado do Cenário Selecionado */}
      <div className="bg-obsidian-950/90 border border-cyber-cyan/20 rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan font-bold font-mono">
              083
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{selectedEnvironment.name}</h3>
                <span className="px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan text-[10px] font-mono font-bold">
                  CANÔNICO V5
                </span>
              </div>
              <p className="text-xs text-slate-400">{selectedEnvironment.shortDescription}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPrompt}
              className="px-3.5 py-1.5 rounded-lg bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/25 transition-all text-xs font-mono font-semibold flex items-center gap-1.5"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedPrompt ? 'Copiado!' : 'Copiar Prompt Compilado'}
            </button>
          </div>
        </div>

        {/* Grade de Parâmetros de Simulação de Câmera e Luz */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          {/* Controle de Bokeh / Abertura */}
          <div className="bg-obsidian-900/80 border border-white/5 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyber-cyan" />
                Abertura / Bokeh:
              </span>
              <span className="text-cyber-cyan">{bokehLevel.split(' ')[0]}</span>
            </div>
            <select
              value={bokehLevel}
              onChange={(e) => setBokehLevel(e.target.value as BokehLevel)}
              className="w-full px-2.5 py-1.5 bg-obsidian-950 border border-white/10 rounded text-slate-200 focus:outline-none focus:border-cyber-cyan"
            >
              <option value="f/1.4 extreme blur">f/1.4 (Isolamento Extremo / Desfoque Total)</option>
              <option value="f/1.8 cinematic bokeh">f/1.8 (Padrão Cinemático / Bokeh Suave)</option>
              <option value="f/2.8 subtle blur">f/2.8 (Desfoque Médio / Detalhe Visível)</option>
              <option value="f/4.0 contextual">f/4.0 (Contextual / Alta Nitidez no Fundo)</option>
            </select>
          </div>

          {/* Horário / Iluminação */}
          <div className="bg-obsidian-900/80 border border-white/5 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Iluminação & Atmosfera:
              </span>
              <span className="text-amber-400 uppercase text-[10px]">{timeOfDay}</span>
            </div>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
              className="w-full px-2.5 py-1.5 bg-obsidian-950 border border-white/10 rounded text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="daylight">Luz do Dia / Manhã Natural (5200K)</option>
              <option value="golden_hour">Golden Hour / Pôr do Sol Quente (3800K)</option>
              <option value="cyber_night">Noite Atmosférica / Neon Cyber (Teal)</option>
              <option value="neutral_studio">Estúdio Controlado Balanceado (5000K)</option>
            </select>
          </div>

          {/* Acústica para V5 Sound */}
          <div className="bg-obsidian-900/80 border border-white/5 rounded-lg p-3 space-y-1.5">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                Perfil Acústico (V5 Sound):
              </span>
              <span className="text-purple-300 text-[10px]">
                RT60 {selectedEnvironment.acousticProfile.rt60DecaySeconds}s
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {selectedEnvironment.acousticProfile.recommendedReverbPreset}
            </p>
            <p className="text-[10px] text-slate-500 italic">
              Emparelha automaticamente com os motores de clonagem de voz do V5 Sound.
            </p>
          </div>
        </div>

        {/* Guia de Safe Zones para Mobile 9:16 (Shorts / Reels) */}
        <div className="bg-obsidian-900/50 border border-white/5 rounded-lg p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200">Margens Seguras de Mobile 9:16:</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono">
            <span>Topo: <strong className="text-slate-200">{selectedEnvironment.mobileCompositionSafeZones.upperTextSafeMargin}</strong></span>
            <span>Base: <strong className="text-slate-200">{selectedEnvironment.mobileCompositionSafeZones.lowerSubtitleMargin}</strong></span>
            <span>Posicionamento: <strong className="text-cyber-cyan">{selectedEnvironment.mobileCompositionSafeZones.optimalAvatarPlacement}</strong></span>
          </div>
        </div>

        {/* Prompt Compilado */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Prompt Positivo Compilado com Identidade do Avatar ({targetName}):
            </span>
            <span className="text-slate-500 font-mono text-[11px]">8K UHD · 9:16 Vertical · Flux / Wan 2.1</span>
          </div>
          <pre className="p-3 bg-obsidian-950 rounded-lg text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed border border-white/5 select-all">
            {compiledPrompt}
          </pre>
        </div>

        {/* Prompt Negativo de Ambiente */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-rose-400 flex items-center gap-1">
              Filtro Negativo de Ambiente (Remove bagunça e artefatos de fundo):
            </span>
            <button
              onClick={handleCopyNegative}
              className="text-[11px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              {copiedNegative ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedNegative ? 'Copiado' : 'Copiar Negativo'}
            </button>
          </div>
          <pre className="p-2.5 bg-obsidian-950/70 rounded-lg text-[11px] font-mono text-rose-300/80 whitespace-pre-wrap leading-relaxed border border-rose-900/20 select-all">
            {selectedEnvironment.negativeEnvironmentPrompt}
          </pre>
        </div>
      </div>
    </div>
  );
}
