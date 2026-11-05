'use client';

import React, { useState } from 'react';
import StudioHeader from '@/components/layout/StudioHeader';
import AvatarCard from '@/components/avatar/AvatarCard';
import QuickCreateAvatarModal from '@/components/avatar/QuickCreateAvatarModal';
import KeyboardShortcutsModal from '@/components/avatar/KeyboardShortcutsModal';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import { downloadV5AvatarZip } from '@/utils/v5AvatarZipPacker';
import {
  Sparkles,
  ScanEye,
  Mic,
  BrainCircuit,
  Radio,
  Layers,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  Copy,
  Check,
  Play,
  Square,
  Wand2,
  Sliders,
  ShieldCheck,
  Activity,
  Plus,
  Compass,
  Cpu,
  Smile,
  Accessibility,
  ExternalLink,
  Send,
  Volume2,
  Palette,
  Film,
} from 'lucide-react';

import VideoCharacterSwapStudio from '@/components/avatar/VideoCharacterSwapStudio';

// Import dos painéis do Laboratório Técnico (acessíveis no Modo Engenheiro)
import { CharacterCreator } from '@/components/avatar/CharacterCreator';
import TurnaroundGridViewer from '@/components/avatar/TurnaroundGridViewer';
import TurnaroundSheetExporter from '@/components/avatar/TurnaroundSheetExporter';
import DiffusionParamsInspector from '@/components/avatar/DiffusionParamsInspector';
import CinematicFramingMatrix from '@/components/avatar/CinematicFramingMatrix';
import VirtualLensSelector from '@/components/avatar/VirtualLensSelector';
import AnatomicalProportionGuides from '@/components/avatar/AnatomicalProportionGuides';
import PoseFidelityComparator from '@/components/avatar/PoseFidelityComparator';
import JointCoordinatesGenerator from '@/components/avatar/JointCoordinatesGenerator';
import UtilityPoseCatalog from '@/components/avatar/UtilityPoseCatalog';
import PoseSheetExporterPanel from '@/components/avatar/PoseSheetExporterPanel';
import VisemesCanonicalTable from '@/components/avatar/VisemesCanonicalTable';
import VisemePromptCompiler from '@/components/avatar/VisemePromptCompiler';
import BaseEmotionsMatrixPanel from '@/components/avatar/BaseEmotionsMatrixPanel';
import SecondaryEmotionsMatrixPanel from '@/components/avatar/SecondaryEmotionsMatrixPanel';
import ExpressionsGrid3x3Viewer from '@/components/avatar/ExpressionsGrid3x3Viewer';
import EmotionalIntensityModulator from '@/components/avatar/EmotionalIntensityModulator';
import QuickExpressionSwitcher from '@/components/avatar/QuickExpressionSwitcher';
import SpriteSheetComposerPanel from '@/components/avatar/SpriteSheetComposerPanel';
import AnatomicalDeviationValidatorPanel from '@/components/avatar/AnatomicalDeviationValidatorPanel';
import VoiceAudioUploader from '@/components/avatar/VoiceAudioUploader';
import WaveformCanvasViewer from '@/components/avatar/WaveformCanvasViewer';
import VoiceEngineMapperPanel from '@/components/avatar/VoiceEngineMapperPanel';
import VoiceParametersPanel from '@/components/avatar/VoiceParametersPanel';
import VoiceToneSelectorPanel from '@/components/avatar/VoiceToneSelectorPanel';
import PhoneticPangramCatalogPanel from '@/components/avatar/PhoneticPangramCatalogPanel';
import SynthesisPreviewPlayer from '@/components/avatar/SynthesisPreviewPlayer';
import V5SoundConnectorPanel from '@/components/avatar/V5SoundConnectorPanel';
import VoiceSheetExporterPanel from '@/components/avatar/VoiceSheetExporterPanel';
import PsychologicalArchetypesPanel from '@/components/avatar/PsychologicalArchetypesPanel';
import BioLoreGeneratorPanel from '@/components/avatar/BioLoreGeneratorPanel';
import VocabularyCatchphrasesPanel from '@/components/avatar/VocabularyCatchphrasesPanel';
import EthicalGuardrailsPanel from '@/components/avatar/EthicalGuardrailsPanel';
import SystemPromptCompilerPanel from '@/components/avatar/SystemPromptCompilerPanel';
import RAGKnowledgeBasePanel from '@/components/avatar/RAGKnowledgeBasePanel';
import SocialRepliesSimulatorPanel from '@/components/avatar/SocialRepliesSimulatorPanel';
import PersonaRetentionValidatorPanel from '@/components/avatar/PersonaRetentionValidatorPanel';
import SoulPackageExporterPanel from '@/components/avatar/SoulPackageExporterPanel';
import IdleBreathingPanel from '@/components/avatar/IdleBreathingPanel';
import NaturalEyeBlinkPanel from '@/components/avatar/NaturalEyeBlinkPanel';
import HeadTiltPanel from '@/components/avatar/HeadTiltPanel';
import IdleLiveCanvasViewer from '@/components/avatar/IdleLiveCanvasViewer';
import AvatarStateMachinePanel from '@/components/avatar/AvatarStateMachinePanel';
import AvatarEnergyModulatorPanel from '@/components/avatar/AvatarEnergyModulatorPanel';
import IdleSpritesheetGeneratorPanel from '@/components/avatar/IdleSpritesheetGeneratorPanel';
import IdleEmbedExporterPanel from '@/components/avatar/IdleEmbedExporterPanel';
import IdlePerformanceBenchmarkPanel from '@/components/avatar/IdlePerformanceBenchmarkPanel';
import BroadcasterWebhookPanel from '@/components/avatar/BroadcasterWebhookPanel';
import VTuberPackageExporterPanel from '@/components/avatar/VTuberPackageExporterPanel';
import AudioVisemeSyncPanel from '@/components/avatar/AudioVisemeSyncPanel';
import LiveEmotionTriggersPanel from '@/components/avatar/LiveEmotionTriggersPanel';
import ObsWebSocketConnectorPanel from '@/components/avatar/ObsWebSocketConnectorPanel';
import ObsTransparentOverlayPanel from '@/components/avatar/ObsTransparentOverlayPanel';
import LiveOperatorDeckPanel from '@/components/avatar/LiveOperatorDeckPanel';
import LiveTelemetryMonitorPanel from '@/components/avatar/LiveTelemetryMonitorPanel';
import LivePromptFirewallPanel from '@/components/avatar/LivePromptFirewallPanel';
import FaceDnaPackExporterPanel from '@/components/avatar/FaceDnaPackExporterPanel';
import BatchStylePromptInjectorPanel from '@/components/avatar/BatchStylePromptInjectorPanel';
import CanonicalEnvironmentsPanel from '@/components/avatar/CanonicalEnvironmentsPanel';
import CinematicCutsPanel from '@/components/avatar/CinematicCutsPanel';
import PrismaBatchScriptGeneratorPanel from '@/components/avatar/PrismaBatchScriptGeneratorPanel';
import FaceVerificationIndexPanel from '@/components/avatar/FaceVerificationIndexPanel';
import V5EditTimelineExporterPanel from '@/components/avatar/V5EditTimelineExporterPanel';
import UgcProductPoseGeneratorPanel from '@/components/avatar/UgcProductPoseGeneratorPanel';
import AuthorCardExporterPanel from '@/components/avatar/AuthorCardExporterPanel';
import UniversalPackageSchemaPanel from '@/components/avatar/UniversalPackageSchemaPanel';
import V5AvatarZipPackerPanel from '@/components/avatar/V5AvatarZipPackerPanel';
import V5AvatarZipImporterPanel from '@/components/avatar/V5AvatarZipImporterPanel';
import CharacterSheetPrintPanel from '@/components/avatar/CharacterSheetPrintPanel';
import CatalogBackupRestorePanel from '@/components/avatar/CatalogBackupRestorePanel';
import CatalogStressTesterPanel from '@/components/avatar/CatalogStressTesterPanel';
import E2EStudioWorkflowPanel from '@/components/avatar/E2EStudioWorkflowPanel';
import SecurityAuditPanel from '@/components/avatar/SecurityAuditPanel';
import MilestoneVersion100Banner from '@/components/avatar/MilestoneVersion100Banner';
import CentralCharacterManagementDashboard from '@/components/avatar/CentralCharacterManagementDashboard';

type StudioTab = 'face' | 'voice' | 'soul' | 'jutsu' | 'export';

export default function AvatarHubPage() {
  const { avatars, selectedAvatarId, selectAvatar, updateAvatar, resetToDefaults } = useAvatarStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<StudioTab>('face');
  const [selectedAngle, setSelectedAngle] = useState<'front' | 'threeQuarter' | 'profile' | 'back'>('front');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [copiedObs, setCopiedObs] = useState(false);
  const [showAdvancedLab, setShowAdvancedLab] = useState(false);
  const [advancedCategory, setAdvancedCategory] = useState<string>('all');

  const selectedAvatar = avatars.find((a) => a.id === selectedAvatarId) || avatars[0];

  // Teste de Fala Instantânea com Web Speech API
  const handleTestVoice = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      toast.warning('Navegador Incompatível', 'Web Speech API não suportada neste browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const catchphrase = selectedAvatar?.soul?.catchphrases?.[0] || 'Olá! Sou um personagem soberano da Holding V5.';
    const utterance = new SpeechSynthesisUtterance(catchphrase);
    utterance.lang = 'pt-BR';
    utterance.rate = selectedAvatar?.voice?.speed || 1.0;
    utterance.pitch = (selectedAvatar?.voice?.pitch || 0) * 0.1 + 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    toast.info('Voz Ativa', `Reproduzindo bordão de ${selectedAvatar?.name || 'Avatar'}`);
  };

  // Download Rápido do Pacote .v5avatar
  const handleQuickDownloadZip = async () => {
    if (!selectedAvatar) return;
    setIsExportingZip(true);
    try {
      await downloadV5AvatarZip(selectedAvatar);
      toast.success('Pacote Baixado', `Arquivo .v5avatar gerado com sucesso para ${selectedAvatar.name}.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error('Erro no Download', msg);
    } finally {
      setIsExportingZip(false);
    }
  };

  // Copiar URL do OBS Studio
  const handleCopyObsUrl = () => {
    const url = `${window.location.origin}/live/overlay`;
    navigator.clipboard.writeText(url);
    setCopiedObs(true);
    toast.success('Copiado para OBS', 'URL do overlay transparente copiada!');
    setTimeout(() => setCopiedObs(false), 2500);
  };

  // ==============================================================
  // APOLLO BRIDGE: PONTES DE INTEROPERABILIDADE ENTRE CAPITANIAS
  // ==============================================================
  const handleDispatchToPoster = () => {
    if (!selectedAvatar) return;
    const catchphrase = selectedAvatar.soul.catchphrases?.[0] || 'Novo conteúdo da holding no ar!';
    const title = `${selectedAvatar.name}: ${selectedAvatar.tagline}`;
    const posterBase = typeof window !== 'undefined' && window.location.hostname.includes('v5apollo.com') ? 'https://huntera.com.br' : (process.env.NEXT_PUBLIC_POSTER_URL || 'https://huntera.com.br');
    const url = `${posterBase}/?title=${encodeURIComponent(title)}&content=${encodeURIComponent(catchphrase)}&actor=${encodeURIComponent(selectedAvatar.name)}`;
    window.open(url, '_blank');
    toast.success('Ponte Ativada', `Enviando ${selectedAvatar.name} para o V5 Poster`);
  };

  const handleDispatchToBroadcaster = () => {
    if (!selectedAvatar) return;
    const broadcasterBase = typeof window !== 'undefined' && window.location.hostname.includes('v5apollo.com') ? 'https://broadcaster.v5apollo.com' : (process.env.NEXT_PUBLIC_BROADCASTER_URL || 'https://broadcaster.v5apollo.com');
    const url = `${broadcasterBase}/dashboard/studio?avatarId=${encodeURIComponent(selectedAvatar.id)}&avatarName=${encodeURIComponent(selectedAvatar.name)}`;
    window.open(url, '_blank');
    toast.success('Ponte Ativada', `Acoplando ${selectedAvatar.name} no V5 Broadcaster`);
  };

  const handleDispatchToSound = () => {
    if (!selectedAvatar) return;
    const url = `https://v5-apollo-sound-five.vercel.app/studio?voice=${encodeURIComponent(selectedAvatar.name)}&engine=${encodeURIComponent(selectedAvatar.voice.engine)}`;
    window.open(url, '_blank');
    toast.success('Ponte Ativada', `Sincronizando voz de ${selectedAvatar.name} no V5 Sound`);
  };

  const handleDispatchToPrisma = () => {
    if (!selectedAvatar) return;
    const prompt = `${selectedAvatar.face.fixedFeaturesPrompt}, wearing ${selectedAvatar.face.clothingPrompt}, cinematic lighting ${selectedAvatar.face.lightingPreset}`;
    const url = `https://prisma.v5apollo.com/studio?character=${encodeURIComponent(selectedAvatar.name)}&prompt=${encodeURIComponent(prompt)}`;
    window.open(url, '_blank');
    toast.success('Ponte Ativada', `Face DNA de ${selectedAvatar.name} despachado para o V5 Prisma`);
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans selection:bg-cyber-cyan selection:text-obsidian-950">
      {/* Acessibilidade WCAG AA */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyber-cyan focus:text-black focus:font-bold focus:rounded-lg focus:shadow-xl focus:outline-none"
      >
        Pular para o conteúdo principal
      </a>

      {/* Header Soberano */}
      <StudioHeader onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        
        {/* Barra de Ator em Foco & Criar Novo */}
        <div className="p-3 bg-slate-900/60 border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider pl-2">
              Ator Ativo:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {avatars.length === 0 ? (
                <div className="flex items-center gap-2 text-xs text-amber-400 font-mono pl-1">
                  <span>Nenhum ator cadastrado.</span>
                  <button
                    onClick={() => resetToDefaults()}
                    className="px-2 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan hover:text-black font-bold transition-all"
                  >
                    Restaurar Padrões Soberanos
                  </button>
                </div>
              ) : (
                avatars.map((avatar) => {
                  const isCurrent = avatar.id === selectedAvatar?.id;
                  return (
                    <button
                      key={avatar.id}
                      onClick={() => selectAvatar(avatar.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        isCurrent
                          ? 'bg-cyber-cyan/20 border-cyber-cyan text-white shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                          : 'bg-black/30 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <img
                        src={avatar.avatarUrl}
                        alt={avatar.name}
                        className="w-5 h-5 rounded-full object-cover border border-white/10"
                      />
                      <span>{avatar.name}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="text-xs px-3.5 py-1.5 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-obsidian-950 font-bold font-mono transition-all ml-auto shadow-[0_0_15px_rgba(0,229,255,0.2)] flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Personagem</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* PALCO CENTRAL DO PERSONAGEM (CHARACTER STUDIO WORKBENCH)       */}
        {/* ============================================================== */}
        {selectedAvatar ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUNA ESQUERDA: PALCO VISUAL & CONTROLES DO ATOR (5 Colunas) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden group shadow-2xl">
                {/* Glow de fundo */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none" />

                {/* Imagem do Palco com Proporção Otimizada */}
                <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-obsidian-900 border border-white/10 flex items-center justify-center">
                  <img
                    src={selectedAvatar.avatarUrl}
                    alt={selectedAvatar.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Tag do Nicho */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-obsidian-950/80 backdrop-blur-md border border-cyber-cyan/40 text-[10px] font-mono text-cyber-cyan font-bold uppercase tracking-wider">
                    {selectedAvatar.soul.niche}
                  </div>

                  {/* Seletor Rápido de Ângulos */}
                  <div className="absolute bottom-3 inset-x-3 p-1.5 rounded-xl bg-obsidian-950/90 backdrop-blur-md border border-white/10 flex items-center justify-between text-[11px] font-mono">
                    <button
                      onClick={() => setSelectedAngle('front')}
                      className={`flex-1 py-1 rounded-lg text-center transition-all ${
                        selectedAngle === 'front'
                          ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Frente
                    </button>
                    <button
                      onClick={() => setSelectedAngle('threeQuarter')}
                      className={`flex-1 py-1 rounded-lg text-center transition-all ${
                        selectedAngle === 'threeQuarter'
                          ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      3/4
                    </button>
                    <button
                      onClick={() => setSelectedAngle('profile')}
                      className={`flex-1 py-1 rounded-lg text-center transition-all ${
                        selectedAngle === 'profile'
                          ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Perfil
                    </button>
                    <button
                      onClick={() => setSelectedAngle('back')}
                      className={`flex-1 py-1 rounded-lg text-center transition-all ${
                        selectedAngle === 'back'
                          ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Costas
                    </button>
                  </div>
                </div>

                {/* Informações Resumidas do Personagem */}
                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-white">{selectedAvatar.name}</h2>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                      ID: {selectedAvatar.id.slice(0, 14)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{selectedAvatar.tagline}</p>
                </div>

                {/* Status dos 4 Pilares do Kernel */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Face DNA 360°: Pronto</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-cyber-cyan">
                    <Mic className="w-3.5 h-3.5 text-cyber-cyan" />
                    <span>{selectedAvatar.voice.engine.toUpperCase()} • {selectedAvatar.voice.tone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-purple-400">
                    <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                    <span>Soul: {selectedAvatar.soul.archetype}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-400">
                    <Radio className="w-3.5 h-3.5 text-blue-400" />
                    <span>OBS Live: Conectado</span>
                  </div>
                </div>

                {/* Ações Primárias Rápidas */}
                <div className="grid grid-cols-2 gap-2.5 mt-5">
                  <button
                    onClick={handleTestVoice}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isSpeaking
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                    }`}
                  >
                    {isSpeaking ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-cyber-cyan" />}
                    <span>{isSpeaking ? 'Parar Voz' : 'Ouvir Voz'}</span>
                  </button>

                  <button
                    onClick={handleQuickDownloadZip}
                    disabled={isExportingZip}
                    className="py-2 px-3 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-obsidian-950 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-md disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isExportingZip ? 'Gerando...' : 'Exportar .v5avatar'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA: ABAS DE PERSONALIZAÇÃO LIMPAS (7 Colunas) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Barra de Abas do Estúdio */}
              <div className="flex items-center gap-1 p-1.5 bg-slate-900/80 border border-white/10 rounded-2xl">
                <button
                  onClick={() => setActiveTab('face')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    activeTab === 'face'
                      ? 'bg-cyber-cyan text-obsidian-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ScanEye className="w-4 h-4" />
                  <span>Aparência & Rosto</span>
                </button>
                <button
                  onClick={() => setActiveTab('voice')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    activeTab === 'voice'
                      ? 'bg-cyber-cyan text-obsidian-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>Voz & Fala</span>
                </button>
                <button
                  onClick={() => setActiveTab('soul')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    activeTab === 'soul'
                      ? 'bg-cyber-cyan text-obsidian-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BrainCircuit className="w-4 h-4" />
                  <span>Personalidade</span>
                </button>
                <button
                  onClick={() => setActiveTab('jutsu')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    activeTab === 'jutsu'
                      ? 'bg-purple-600 text-white font-bold shadow-md ring-1 ring-purple-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Film className="w-4 h-4 text-purple-300" />
                  <span>Video Swap (Jutsu)</span>
                </button>
                <button
                  onClick={() => setActiveTab('export')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    activeTab === 'export'
                      ? 'bg-cyber-cyan text-obsidian-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Exportação</span>
                </button>
              </div>

              {/* CONTEÚDO DA ABA: APARÊNCIA & ROSTO */}
              {activeTab === 'face' && (
                <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5 animate-fadeIn">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ScanEye className="w-4 h-4 text-cyber-cyan" />
                      Face DNA • Identidade Visual & Trajes
                    </h3>
                    <p className="text-xs text-slate-400">
                      Configure a descrição visual imutável para renderizar vídeos no V5 Prisma e no Broadcaster.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-mono text-slate-300 block mb-1.5">
                        Vestimenta & Figurino Canônico:
                      </label>
                      <input
                        type="text"
                        value={selectedAvatar.face.clothingPrompt}
                        onChange={(e) =>
                          updateAvatar(selectedAvatar.id, {
                            face: { ...selectedAvatar.face, clothingPrompt: e.target.value },
                          })
                        }
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyber-cyan"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-300 block mb-1.5">
                        Traços Faciais Fixos (Anti-Distorção):
                      </label>
                      <textarea
                        rows={2}
                        value={selectedAvatar.face.fixedFeaturesPrompt}
                        onChange={(e) =>
                          updateAvatar(selectedAvatar.id, {
                            face: { ...selectedAvatar.face, fixedFeaturesPrompt: e.target.value },
                          })
                        }
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyber-cyan"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-mono text-slate-300 block mb-1.5">
                          Iluminação de Estúdio:
                        </label>
                        <select
                          value={selectedAvatar.face.lightingPreset}
                          onChange={(e) =>
                            updateAvatar(selectedAvatar.id, {
                              face: { ...selectedAvatar.face, lightingPreset: e.target.value as any },
                            })
                          }
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyber-cyan"
                        >
                          <option value="volumetric_neon">Volumétrica Neon (Tech)</option>
                          <option value="rembrandt">Rembrandt Clássica</option>
                          <option value="studio_soft">Estúdio Suave (Comercial)</option>
                          <option value="cyberpunk_rim">Cyberpunk Rim Light</option>
                          <option value="cinematic_warm">Cinemática Quente</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-slate-300 block mb-1.5">
                          Seed Imutável (Diffusion):
                        </label>
                        <input
                          type="number"
                          value={selectedAvatar.face.diffusionSeed || 428912301}
                          onChange={(e) =>
                            updateAvatar(selectedAvatar.id, {
                              face: { ...selectedAvatar.face, diffusionSeed: parseInt(e.target.value) || 0 },
                            })
                          }
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyber-cyan"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTEÚDO DA ABA: VOZ & FALA */}
              {activeTab === 'voice' && (
                <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5 animate-fadeIn">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Mic className="w-4 h-4 text-cyber-cyan" />
                      Voice DNA • Motor de Voz & Entonação
                    </h3>
                    <p className="text-xs text-slate-400">
                      Conectado diretamente ao V5 Sound (:3008) para clonagem Qwen-TTS e XTTS-v2.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-mono text-slate-300 block mb-1.5">
                          Motor de Síntese:
                        </label>
                        <select
                          value={selectedAvatar.voice.engine}
                          onChange={(e) =>
                            updateAvatar(selectedAvatar.id, {
                              voice: { ...selectedAvatar.voice, engine: e.target.value as any },
                            })
                          }
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyber-cyan"
                        >
                          <option value="qwen-tts">Qwen-TTS (Alta Fidelidade)</option>
                          <option value="xtts">XTTS-v2 (Clonagem Zero-Shot)</option>
                          <option value="cosyvoice">CosyVoice (Latência Ultra-Baixa)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-slate-300 block mb-1.5">
                          Tonalidade Emocional:
                        </label>
                        <select
                          value={selectedAvatar.voice.tone}
                          onChange={(e) =>
                            updateAvatar(selectedAvatar.id, {
                              voice: { ...selectedAvatar.voice, tone: e.target.value as any },
                            })
                          }
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyber-cyan"
                        >
                          <option value="energetic">Energético / Vendas</option>
                          <option value="authoritative">Autoritário / Noticiário</option>
                          <option value="calm">Calmo / Documentário</option>
                          <option value="didactic">Didático / Educativo</option>
                          <option value="mysterious">Misterioso / Narrador</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                          <span>Velocidade:</span>
                          <span className="text-cyber-cyan">{selectedAvatar.voice.speed}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.75"
                          max="1.5"
                          step="0.05"
                          value={selectedAvatar.voice.speed}
                          onChange={(e) =>
                            updateAvatar(selectedAvatar.id, {
                              voice: { ...selectedAvatar.voice, speed: parseFloat(e.target.value) },
                            })
                          }
                          className="w-full accent-cyber-cyan cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                          <span>Estabilidade Sonora:</span>
                          <span className="text-cyber-cyan">{Math.round((selectedAvatar.voice.stability || 0.8) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.4"
                          max="1.0"
                          step="0.05"
                          value={selectedAvatar.voice.stability || 0.8}
                          onChange={(e) =>
                            updateAvatar(selectedAvatar.id, {
                              voice: { ...selectedAvatar.voice, stability: parseFloat(e.target.value) },
                            })
                          }
                          className="w-full accent-cyber-cyan cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTEÚDO DA ABA: PERSONALIDADE & SOUL */}
              {activeTab === 'soul' && (
                <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5 animate-fadeIn">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-cyber-cyan" />
                      Soul DNA • Psicologia, Arquétipo & Bordões
                    </h3>
                    <p className="text-xs text-slate-400">
                      Cérebro cognitivo utilizado pelo V5 Broadcaster no chat ao vivo e pelo V5 Poster nas redes sociais.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-mono text-slate-300 block mb-1.5">
                          Nome do Personagem:
                        </label>
                        <input
                          type="text"
                          value={selectedAvatar.name}
                          onChange={(e) => updateAvatar(selectedAvatar.id, { name: e.target.value })}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyber-cyan"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono text-slate-300 block mb-1.5">
                          Nicho / Mercado:
                        </label>
                        <input
                          type="text"
                          value={selectedAvatar.soul.niche}
                          onChange={(e) =>
                            updateAvatar(selectedAvatar.id, {
                              soul: { ...selectedAvatar.soul, niche: e.target.value },
                            })
                          }
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyber-cyan"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-300 block mb-1.5">
                        Biografia & Lore Canônico:
                      </label>
                      <textarea
                        rows={3}
                        value={selectedAvatar.soul.bio}
                        onChange={(e) =>
                          updateAvatar(selectedAvatar.id, {
                            soul: { ...selectedAvatar.soul, bio: e.target.value },
                          })
                        }
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyber-cyan"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-slate-300 block mb-1.5">
                        Bordões Frequentes (Separados por vírgula):
                      </label>
                      <input
                        type="text"
                        value={selectedAvatar.soul.catchphrases.join(', ')}
                        onChange={(e) =>
                          updateAvatar(selectedAvatar.id, {
                            soul: {
                              ...selectedAvatar.soul,
                              catchphrases: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                            },
                          })
                        }
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyber-cyan"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CONTEÚDO DA ABA: EXPORTAÇÃO & ECOSSISTEMA */}
              {/* CONTEUDO DA ABA: EXPORTACAO & ECOSSISTEMA */}
              {activeTab === 'export' && (
                <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6 animate-fadeIn">
                  

                  {/* ARQUIVOS LOCAIS & OVERLAY */}
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                      <Download className="w-3 h-3 text-cyan-400" />
                      <span>Arquivos Soberanos & Integração Local</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Card 1: Baixar ZIP .v5avatar */}
                      <div className="p-4 bg-slate-900/60 border border-white/10 rounded-xl space-y-2.5">
                        <div className="flex items-center gap-2 text-cyber-cyan font-bold text-sm">
                          <Download className="w-4 h-4" />
                          <span>Pacote .v5avatar (ZIP)</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Arquivo binário contendo Face DNA, Voice DNA, prompts e manifestos assinados com SHA-256.
                        </p>
                        <button
                          onClick={handleQuickDownloadZip}
                          disabled={isExportingZip}
                          className="w-full py-2 px-3 rounded-lg bg-cyber-cyan hover:bg-cyan-400 text-obsidian-950 font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{isExportingZip ? 'Compactando...' : 'Baixar Agora'}</span>
                        </button>
                      </div>

                      {/* Card 2: Link do OBS Studio */}
                      <div className="p-4 bg-slate-900/60 border border-white/10 rounded-xl space-y-2.5">
                        <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                          <Radio className="w-4 h-4" />
                          <span>Overlay para OBS Studio</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          URL do browser source com fundo transparente para o V5 Broadcaster (:3008).
                        </p>
                        <button
                          onClick={handleCopyObsUrl}
                          className="w-full py-2 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          {copiedObs ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedObs ? 'Copiado!' : 'Copiar URL OBS'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTEÚDO DA ABA: VIDEO SWAP (JUTSU) */}
              {activeTab === 'jutsu' && (
                <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6 animate-fadeIn">
                  <VideoCharacterSwapStudio avatar={selectedAvatar} />
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* ============================================================== */}
        {/* SEÇÃO: GALERIA DE PERSONAGENS DO REGISTRO CIVIL                 */}
        {/* ============================================================== */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyber-cyan" />
                Catálogo de Atores Virtuais ({avatars.length})
              </h2>
              <p className="text-xs text-slate-400">Clique para selecionar, editar ou clonar qualquer ator.</p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-xs px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Ator</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {avatars.map((avatar) => (
              <AvatarCard
                key={avatar.id}
                avatar={avatar}
                isSelected={avatar.id === selectedAvatar?.id}
                onSelect={() => selectAvatar(avatar.id)}
              />
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* GAVETA RECOLHÍVEL: MODO ENGENHEIRO & DIAGNÓSTICO AVANÇADO       */}
        {/* Mantém todas as 70+ ferramentas técnicas sem poluir a tela      */}
        {/* ============================================================== */}
        <div className="pt-8 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-obsidian-900/60 border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Cpu className="w-5 h-5 text-slate-500" />
              <div>
                <h3 className="text-xs font-mono font-bold text-slate-300">
                  Laboratório Técnico & Diagnósticos de Engenharia (Modo Avançado)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Acesse os benchmarks de CPU, atlas de sprites FACS, rigging ósseo, matrizes e ferramentas internas.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAdvancedLab((prev) => !prev)}
              className="text-xs px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-mono flex items-center gap-2 transition-all"
            >
              <span>{showAdvancedLab ? 'Ocultar Laboratório' : 'Abrir Laboratório (70+ Tools)'}</span>
              {showAdvancedLab ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* PAINEL TÉCNICO EXPANDIDO (APENAS SOB DEMANDA) */}
          {showAdvancedLab && (
            <div className="mt-6 p-6 rounded-2xl bg-black/50 border border-cyber-cyan/20 space-y-8 animate-fadeIn">
              <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-white/10">
                <span className="text-xs font-mono text-slate-400 mr-2">Filtrar Categoria:</span>
                {[
                  { id: 'all', label: 'Todos os Painéis' },
                  { id: 'turnaround', label: 'Visão 360°' },
                  { id: 'tpose', label: 'T-Pose & Rig' },
                  { id: 'facs', label: 'FACS & Expressões' },
                  { id: 'audio', label: 'Áudio & Visemas' },
                  { id: 'soul', label: 'Soul & RAG' },
                  { id: 'live', label: 'Live & OBS' },
                  { id: 'vault', label: 'Vault & Testes' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setAdvancedCategory(cat.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                      advancedCategory === cat.id
                        ? 'bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan font-bold'
                        : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* SEÇÃO TÉCNICA 1: TURNAROUND & VISÃO */}
              {(advancedCategory === 'all' || advancedCategory === 'turnaround') && (
                <div className="space-y-6">
                  <h4 className="text-sm font-bold font-mono text-cyber-cyan"># Visual & Ótica Cinemática</h4>
                  <TurnaroundGridViewer
                    sheetImageUrl={selectedAvatar?.face.turnaroundSheetUrl || selectedAvatar?.avatarUrl}
                    characterName={selectedAvatar?.name}
                  />
                  <TurnaroundSheetExporter
                    frontUrl={selectedAvatar?.avatarUrl}
                    threeQuarterUrl={selectedAvatar?.avatarUrl}
                    profileUrl={selectedAvatar?.avatarUrl}
                    backUrl={selectedAvatar?.avatarUrl}
                  />
                  <DiffusionParamsInspector />
                  <CinematicFramingMatrix />
                  <VirtualLensSelector />
                </div>
              )}

              {/* SEÇÃO TÉCNICA 2: T-POSE & RIGGING */}
              {(advancedCategory === 'all' || advancedCategory === 'tpose') && (
                <div className="space-y-6">
                  <h4 className="text-sm font-bold font-mono text-cyber-cyan"># Poses & Rigging Ósseo</h4>
                  <AnatomicalProportionGuides previewImageUrl={selectedAvatar?.avatarUrl} />
                  <PoseFidelityComparator
                    anchorPhotoUrl={selectedAvatar?.avatarUrl}
                    tPosePhotoUrl={selectedAvatar?.face.turnaroundSheetUrl || selectedAvatar?.avatarUrl}
                    characterName={selectedAvatar?.name}
                  />
                  <JointCoordinatesGenerator
                    avatarId={selectedAvatar?.id}
                    avatarName={selectedAvatar?.name}
                    previewImageUrl={selectedAvatar?.avatarUrl}
                  />
                  <UtilityPoseCatalog characterName={selectedAvatar?.name} />
                  <PoseSheetExporterPanel
                    avatarName={selectedAvatar?.name}
                    tPoseUrl={selectedAvatar?.avatarUrl}
                    aPoseUrl={selectedAvatar?.avatarUrl}
                  />
                </div>
              )}

              {/* SEÇÃO TÉCNICA 3: FACS & EXPRESSÕES */}
              {(advancedCategory === 'all' || advancedCategory === 'facs') && (
                <div className="space-y-6">
                  <h4 className="text-sm font-bold font-mono text-cyber-cyan"># FACS Facial & Visemas</h4>
                  <VisemesCanonicalTable avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <VisemePromptCompiler characterName={selectedAvatar?.name} />
                  <BaseEmotionsMatrixPanel characterName={selectedAvatar?.name} />
                  <SecondaryEmotionsMatrixPanel characterName={selectedAvatar?.name} />
                  <ExpressionsGrid3x3Viewer characterName={selectedAvatar?.name} />
                  <EmotionalIntensityModulator characterName={selectedAvatar?.name} />
                  <QuickExpressionSwitcher characterName={selectedAvatar?.name} />
                  <SpriteSheetComposerPanel />
                  <AnatomicalDeviationValidatorPanel />
                </div>
              )}

              {/* SEÇÃO TÉCNICA 4: ÁUDIO & VOZ */}
              {(advancedCategory === 'all' || advancedCategory === 'audio') && (
                <div className="space-y-6">
                  <h4 className="text-sm font-bold font-mono text-cyber-cyan"># Acústica & FFT Espectral</h4>
                  <VoiceAudioUploader avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <WaveformCanvasViewer />
                  <VoiceEngineMapperPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <VoiceParametersPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <VoiceToneSelectorPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <PhoneticPangramCatalogPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <SynthesisPreviewPlayer avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <V5SoundConnectorPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <VoiceSheetExporterPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                </div>
              )}

              {/* SEÇÃO TÉCNICA 5: SOUL & RAG */}
              {(advancedCategory === 'all' || advancedCategory === 'soul') && (
                <div className="space-y-6">
                  <h4 className="text-sm font-bold font-mono text-cyber-cyan"># Soul, RAG & LLM</h4>
                  <PsychologicalArchetypesPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <BioLoreGeneratorPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <VocabularyCatchphrasesPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <EthicalGuardrailsPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <SystemPromptCompilerPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <RAGKnowledgeBasePanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <SocialRepliesSimulatorPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <PersonaRetentionValidatorPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <SoulPackageExporterPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                </div>
              )}

              {/* SEÇÃO TÉCNICA 6: LIVE & OBS */}
              {(advancedCategory === 'all' || advancedCategory === 'live') && (
                <div className="space-y-6">
                  <h4 className="text-sm font-bold font-mono text-cyber-cyan"># Live Streaming & Webhooks</h4>
                  <IdleBreathingPanel avatarName={selectedAvatar?.name} />
                  <NaturalEyeBlinkPanel avatarName={selectedAvatar?.name} />
                  <HeadTiltPanel avatarName={selectedAvatar?.name} />
                  <IdleLiveCanvasViewer avatarName={selectedAvatar?.name} avatarUrl={selectedAvatar?.avatarUrl} />
                  <AvatarStateMachinePanel avatarName={selectedAvatar?.name} />
                  <AvatarEnergyModulatorPanel avatarName={selectedAvatar?.name} />
                  <IdleSpritesheetGeneratorPanel avatarName={selectedAvatar?.name} avatarUrl={selectedAvatar?.avatarUrl} />
                  <IdleEmbedExporterPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <IdlePerformanceBenchmarkPanel />
                  <BroadcasterWebhookPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <VTuberPackageExporterPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <AudioVisemeSyncPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <LiveEmotionTriggersPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <ObsWebSocketConnectorPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <ObsTransparentOverlayPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <LiveOperatorDeckPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <LiveTelemetryMonitorPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <LivePromptFirewallPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                </div>
              )}

              {/* SEÇÃO TÉCNICA 7: VAULT & TESTES */}
              {(advancedCategory === 'all' || advancedCategory === 'vault') && (
                <div className="space-y-6">
                  <h4 className="text-sm font-bold font-mono text-cyber-cyan"># Vault, Certificados & Benchmarks</h4>
                  <FaceDnaPackExporterPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <BatchStylePromptInjectorPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <CanonicalEnvironmentsPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <CinematicCutsPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <PrismaBatchScriptGeneratorPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <FaceVerificationIndexPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <V5EditTimelineExporterPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <UgcProductPoseGeneratorPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <AuthorCardExporterPanel avatarId={selectedAvatar?.id} avatarName={selectedAvatar?.name} />
                  <UniversalPackageSchemaPanel />
                  <V5AvatarZipPackerPanel />
                  <V5AvatarZipImporterPanel />
                  <CharacterSheetPrintPanel />
                  <CatalogBackupRestorePanel />
                  <CatalogStressTesterPanel />
                  <E2EStudioWorkflowPanel />
                  <SecurityAuditPanel />
                  <MilestoneVersion100Banner />
                  <CentralCharacterManagementDashboard />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Criação Rápida */}
      <QuickCreateAvatarModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      {/* Modal Global de Atalhos de Teclado (?) */}
      <KeyboardShortcutsModal onOpenCreateModal={() => setIsCreateModalOpen(true)} />
    </div>
  );
}
