'use client';

import React, { useState } from 'react';
import StudioHeader from '@/components/layout/StudioHeader';
import V5AppActivationBanner from '@/components/ui/V5AppActivationBanner';
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
import KeyboardShortcutsModal from '@/components/avatar/KeyboardShortcutsModal';
import QuickCreateAvatarModal from '@/components/avatar/QuickCreateAvatarModal';
import Apollo5RocketLogo from '@/components/ui/Apollo5RocketLogo';
import { useAvatarStore, StudioViewMode } from '@/store/useAvatarStore';
import { 
  Sparkles, 
  ScanEye, 
  Accessibility, 
  Smile, 
  Mic, 
  BrainCircuit, 
  Radio, 
  Layers,
  LayoutGrid
} from 'lucide-react';

export default function AvatarHubPage() {
  const { avatars, selectedAvatarId, selectAvatar, activeMode, setActiveMode } = useAvatarStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const selectedAvatar = avatars.find((a) => a.id === selectedAvatarId) || avatars[0];

  const TABS: { id: StudioViewMode; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'turnaround', label: 'Turnaround 360°', icon: ScanEye, badge: 'Visual' },
    { id: 't-pose', label: 'T-Pose & Rigging', icon: Accessibility, badge: 'Anatomia' },
    { id: 'expression', label: 'Expressões & FACS', icon: Smile, badge: 'FACS' },
    { id: 'voice', label: 'DNA Vocal', icon: Mic, badge: 'V5 Sound' },
    { id: 'soul', label: 'Soul & Lore', icon: BrainCircuit, badge: 'LLM' },
    { id: 'live', label: 'Live OBS & Idle', icon: Radio, badge: 'Broadcaster' },
    { id: 'ecosystem', label: 'Ecossistema & Pacotes', icon: Layers, badge: 'Vault' },
    { id: 'all', label: 'Visão Panorâmica', icon: LayoutGrid, badge: 'Tudo' }
  ];

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans selection:bg-cyber-cyan selection:text-obsidian-950">
      {/* Acessibilidade WCAG AA */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyber-cyan focus:text-black focus:font-bold focus:rounded-lg focus:shadow-xl focus:outline-none"
      >
        Pular para o conteúdo principal
      </a>

      <StudioHeader onOpenCreateModal={() => setIsCreateModalOpen(true)} />
      
      {/* Banner de Ativação Soberana */}
      <V5AppActivationBanner />

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(0,229,255,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
            Capitania #12 • Registro Civil de Pessoas Digitais
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight cyber-gradient-text">
            V5 Apollo Avatar
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Forja de atores digitais soberanos com consistência 360° absoluta. Conecte um único personagem ao{' '}
            <span className="text-cyber-cyan font-bold">V5 Broadcaster</span>,{' '}
            <span className="text-blue-400 font-bold">V5 Prisma</span>,{' '}
            <span className="text-luxury-gold font-bold">V5 Sound</span> e{' '}
            <span className="text-emerald-400 font-bold">V5 Finders</span>.
          </p>
        </div>

        {/* Marco Histórico: Versão 1.0.0 Soberana (Fase 10 • Etapa 100) */}
        <MilestoneVersion100Banner />

        {/* Seletor Rápido de Personagem em Foco */}
        <div className="p-3 bg-slate-900/60 border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider pl-2">
              Ator Selecionado:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {avatars.map((avatar) => {
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
              })}
            </div>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="text-xs px-3 py-1.5 rounded-xl bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/30 text-cyber-cyan font-mono transition-all ml-auto"
          >
            + Novo Ator
          </button>
        </div>

        {/* Navegador de Modos do Studio (Sub-Nav Interativo) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-obsidian-950 border border-white/10 rounded-2xl overflow-x-auto shadow-inner">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMode === tab.id || (tab.id === 'turnaround' && !activeMode);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMode(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyber-cyan/20 to-blue-500/20 border border-cyber-cyan/50 text-white shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyber-cyan' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-cyber-cyan/30 text-cyber-cyan font-bold' : 'bg-white/5 text-slate-500'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* SEÇÃO 1: TURNAROUND 360° & VISÃO COMPUTACIONAL                */}
        {/* ============================================================== */}
        {(activeMode === 'turnaround' || activeMode === 'all') && (
          <section className="space-y-8 animate-fadeIn">
            <div className="border-b border-cyber-cyan/20 pb-2">
              <h2 className="text-xl font-bold text-cyber-cyan flex items-center gap-2">
                <ScanEye className="w-5 h-5" /> 1. Turnaround 360° & Visão Computacional
              </h2>
              <p className="text-xs text-slate-400">Model sheets multidimensionais, parâmetros de difusão e ótica cinematográfica.</p>
            </div>

            {/* Character Studio Interactive Workspace */}
            <CharacterCreator />

            {/* Visualizador Grid 4 Ângulos Turnaround 360° */}
            <TurnaroundGridViewer
              sheetImageUrl={selectedAvatar?.face.turnaroundSheetUrl || selectedAvatar?.avatarUrl}
              characterName={selectedAvatar?.name}
            />

            {/* Gerador de Folha Única Consolidada Turnaround (4:1) */}
            <TurnaroundSheetExporter
              frontUrl={selectedAvatar?.avatarUrl}
              threeQuarterUrl={selectedAvatar?.avatarUrl}
              profileUrl={selectedAvatar?.avatarUrl}
              backUrl={selectedAvatar?.avatarUrl}
            />

            {/* Inspetor de Seeds e Parâmetros de Difusão */}
            <DiffusionParamsInspector />

            {/* Matriz de Enquadramentos Cinematográficos */}
            <CinematicFramingMatrix />

            {/* Seletor de Lentes e Distâncias Focais Virtuais */}
            <VirtualLensSelector />

            {/* Sistema de Guias de Proporção Anatômica */}
            <AnatomicalProportionGuides previewImageUrl={selectedAvatar?.avatarUrl} />

            {/* Estimador de Índice de Semelhança Facial Cross-Scene */}
            <FaceVerificationIndexPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />
          </section>
        )}

        {/* ============================================================== */}
        {/* SEÇÃO 2: T-POSE, A-POSE & RIGGING ANATÔMICO                    */}
        {/* ============================================================== */}
        {(activeMode === 't-pose' || activeMode === 'a-pose' || activeMode === 'all') && (
          <section className="space-y-8 animate-fadeIn">
            <div className="border-b border-indigo-500/20 pb-2">
              <h2 className="text-xl font-bold text-indigo-400 flex items-center gap-2">
                <Accessibility className="w-5 h-5" /> 2. T-Pose, A-Pose & Rigging Esquelético
              </h2>
              <p className="text-xs text-slate-400">Padronização anatômica, coordenadas ósseas para V5 Broadcaster e canal alpha.</p>
            </div>

            {/* Comparador Lado a Lado: Foto Âncora vs T-Pose */}
            <PoseFidelityComparator
              anchorPhotoUrl={selectedAvatar?.avatarUrl}
              tPosePhotoUrl={selectedAvatar?.face.turnaroundSheetUrl || selectedAvatar?.avatarUrl}
              characterName={selectedAvatar?.name}
            />

            {/* Gerador de Metadados de Articulação Óssea (Rigging V5 Broadcaster) */}
            <JointCoordinatesGenerator
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
              previewImageUrl={selectedAvatar?.avatarUrl}
            />

            {/* Catálogo de Poses Utilitárias (Fines & Auto Blog) */}
            <UtilityPoseCatalog characterName={selectedAvatar?.name} />

            {/* Exportador de Folha de Poses (Alta Resolução & Canal Alpha) */}
            <PoseSheetExporterPanel
              avatarName={selectedAvatar?.name}
              tPoseUrl={selectedAvatar?.avatarUrl}
              aPoseUrl={selectedAvatar?.avatarUrl}
            />

            {/* Validador Heurístico de Desvios Anatômicos (Anti-Alucinação) */}
            <AnatomicalDeviationValidatorPanel characterName={selectedAvatar?.name} />

            {/* Gerador de Poses UGC com Produtos Minerados do V5 Finders */}
            <UgcProductPoseGeneratorPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />
          </section>
        )}

        {/* ============================================================== */}
        {/* SEÇÃO 3: EXPRESSÕES FACS & LIP-SYNC VISEMES                    */}
        {/* ============================================================== */}
        {(activeMode === 'expression' || activeMode === 'all') && (
          <section className="space-y-8 animate-fadeIn">
            <div className="border-b border-amber-500/20 pb-2">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <Smile className="w-5 h-5" /> 3. Expressões FACS & Visemas de Fala
              </h2>
              <p className="text-xs text-slate-400">Tabela de visemas para Lip-Sync, matriz emocional FACS e spritesheets de animação.</p>
            </div>

            {/* Tabela de Visemas Canônicos da Fala (Lip-Sync Engine) */}
            <VisemesCanonicalTable
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Compilador de Prompts para Visemas & Realismo Dental */}
            <VisemePromptCompiler characterName={selectedAvatar?.name} />

            {/* Matriz de Emoções Base do Personagem (FACS Standard) */}
            <BaseEmotionsMatrixPanel
              avatarId={selectedAvatar?.id}
              characterName={selectedAvatar?.name}
            />

            {/* Matriz de Emoções Secundárias & Engajamento Social */}
            <SecondaryEmotionsMatrixPanel
              avatarId={selectedAvatar?.id}
              characterName={selectedAvatar?.name}
            />

            {/* Visualizador de Expressões em Grade 3x3 com Lupa de Detalhes */}
            <ExpressionsGrid3x3Viewer
              characterName={selectedAvatar?.name}
              sheetImageUrl={selectedAvatar?.face.expressionSheetUrl || selectedAvatar?.avatarUrl}
            />

            {/* Slider de Intensidade Emocional (Modulador 10% - 100%) */}
            <EmotionalIntensityModulator characterName={selectedAvatar?.name} />

            {/* Ferramenta de Troca Rápida de Expressão (Flip-Book Test) */}
            <QuickExpressionSwitcher characterName={selectedAvatar?.name} />

            {/* Gerador de Sprite Sheet Consolidado & Atlas JSON (4x4) */}
            <SpriteSheetComposerPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />
          </section>
        )}

        {/* ============================================================== */}
        {/* SEÇÃO 4: DNA VOCAL & V5 SOUND                                  */}
        {/* ============================================================== */}
        {(activeMode === 'voice' || activeMode === 'all') && (
          <section className="space-y-8 animate-fadeIn">
            <div className="border-b border-emerald-500/20 pb-2">
              <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                <Mic className="w-5 h-5" /> 4. DNA Vocal & Integração V5 Sound
              </h2>
              <p className="text-xs text-slate-400">Clonagem de voz, Qwen-TTS, XTTS, controles acústicos e conexão com a porta :3008.</p>
            </div>

            {/* Uploader & Gravador Nativo de Áudio de Referência (V5 Sound) */}
            <VoiceAudioUploader
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
              currentAudioUrl={selectedAvatar?.voice.sampleAudioUrl}
            />

            {/* Visualizador de Onda Sonora (Waveform Canvas Interativo) */}
            <WaveformCanvasViewer
              audioUrl={selectedAvatar?.voice.sampleAudioUrl}
              characterName={selectedAvatar?.name}
            />

            {/* Mapeador de Motores de Síntese Vocal (V5 Sound Engines) */}
            <VoiceEngineMapperPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
              currentEngine={selectedAvatar?.voice.engine}
            />

            {/* Controles Paramétricos de Voz (Pitch, Velocidade, Estabilidade, Temperatura) */}
            <VoiceParametersPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
              currentEngine={selectedAvatar?.voice.engine}
            />

            {/* Seletor de Tonalidade Emocional Vocal */}
            <VoiceToneSelectorPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
              currentTone={selectedAvatar?.voice.tone}
            />

            {/* Catálogo de Pangramas e Frases Canônicas de Teste Fonético */}
            <PhoneticPangramCatalogPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Player de Preview de Síntese Vocal & Sincronização de Tempo */}
            <SynthesisPreviewPlayer
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
              avatarUrl={selectedAvatar?.avatarUrl}
            />

            {/* Conector de ID de Voz com o Ecossistema do V5 Sound (:3008) */}
            <V5SoundConnectorPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
              currentVoiceId={selectedAvatar?.voice.v5SoundVoiceId}
            />

            {/* Exportador de Ficha Vocal Canônica em JSON (.v5voice.json) */}
            <VoiceSheetExporterPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />
          </section>
        )}

        {/* ============================================================== */}
        {/* SEÇÃO 5: SOUL, LORE & PROMPT ENGINEERING                       */}
        {/* ============================================================== */}
        {(activeMode === 'soul' || activeMode === 'all') && (
          <section className="space-y-8 animate-fadeIn">
            <div className="border-b border-purple-500/20 pb-2">
              <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5" /> 5. Soul, Lore & Engenharia de Persona
              </h2>
              <p className="text-xs text-slate-400">Arquétipos psicológicos, guardrails anti-jailbreak, compilador de System Prompt e RAG.</p>
            </div>

            {/* Arquiteto de Arquétipos Psicológicos (Jungiano / MBTI / Big Five) */}
            <PsychologicalArchetypesPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Gerador de Biografia e Lore Canônico (Origin Story & Authority) */}
            <BioLoreGeneratorPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Dicionário de Vocabulário Específico e Bordões Ponderados */}
            <VocabularyCatchphrasesPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Tabela de Tópicos Proibidos e Limites Éticos (Guardrails Anti-Jailbreak) */}
            <EthicalGuardrailsPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Compilador do System Prompt Supremo para LLMs (GPT-4o, Claude 3.5, Gemini 2.0) */}
            <SystemPromptCompilerPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Construtor de Base de Conhecimento RAG do Avatar (Ingestão de Fatos) */}
            <RAGKnowledgeBasePanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Simulador de Respostas Curtas para Redes Sociais */}
            <SocialRepliesSimulatorPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
              avatarUrl={selectedAvatar?.avatarUrl}
            />

            {/* Validador de Retenção de Persona (Audit Score Anti-Jailbreak) */}
            <PersonaRetentionValidatorPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Exportador da Ficha Psicológica e Lore Completo (.v5soul.json) */}
            <SoulPackageExporterPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Exportador de Card de Autor e Assinatura Digital para V5 Auto Blog */}
            <AuthorCardExporterPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />
          </section>
        )}

        {/* ============================================================== */}
        {/* SEÇÃO 6: LIVE OBS, IDLE ANIMATION & BROADCASTER                */}
        {/* ============================================================== */}
        {(activeMode === 'live' || activeMode === 'all') && (
          <section className="space-y-8 animate-fadeIn">
            <div className="border-b border-rose-500/20 pb-2">
              <h2 className="text-xl font-bold text-rose-400 flex items-center gap-2">
                <Radio className="w-5 h-5" /> 6. Live OBS Studio, Animação Idle & Broadcaster
              </h2>
              <p className="text-xs text-slate-400">Micro-movimentos a 60 FPS, overlay transparente, WebSocket OBS e firewall de live.</p>
            </div>

            {/* Motor de Loop de Respiração Suave */}
            <IdleBreathingPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
              avatarUrl={selectedAvatar?.avatarUrl}
            />

            {/* Sistema de Piscada de Olho Natural */}
            <NaturalEyeBlinkPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Micro-movimentos de Cabeça */}
            <HeadTiltPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
              avatarUrl={selectedAvatar?.avatarUrl}
            />

            {/* Visualizador ao Vivo do Avatar em Estado Idle 60 FPS */}
            <IdleLiveCanvasViewer
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
              avatarUrl={selectedAvatar?.avatarUrl}
            />

            {/* Máquina de Estados de Transição Suave */}
            <AvatarStateMachinePanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Modulador de Dinâmica e Frequência por Nível de Energia */}
            <AvatarEnergyModulatorPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Gerador de Spritesheets de Animação Idle */}
            <IdleSpritesheetGeneratorPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
              avatarUrl={selectedAvatar?.avatarUrl}
            />

            {/* Exportador de Código de Animação CSS/JS para Embed Rápido */}
            <IdleEmbedExporterPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Benchmark de Consumo de GPU/CPU */}
            <IdlePerformanceBenchmarkPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Servidor de Webhook de Entrada Seguro para V5 Broadcaster */}
            <BroadcasterWebhookPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Exportador de Pacote VTuber Standard */}
            <VTuberPackageExporterPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Sincronizador de Áudio com Visemas em Tempo Real */}
            <AudioVisemeSyncPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Sistema de Gatilhos de Emoções em Tempo Real */}
            <LiveEmotionTriggersPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Conector WebSocket Local de Baixa Latência para OBS Studio */}
            <ObsWebSocketConnectorPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Overlay Web Otimizado para OBS com Fundo Transparente */}
            <ObsTransparentOverlayPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Painel de Controle de Operador de Live */}
            <LiveOperatorDeckPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Monitor de Telemetria de Live */}
            <LiveTelemetryMonitorPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Firewall Anti-Hijacking e Defesa Anti-Jailbreak de Live */}
            <LivePromptFirewallPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />
          </section>
        )}

        {/* ============================================================== */}
        {/* SEÇÃO 7: ECOSSISTEMA, PACOTES .V5AVATAR & BACKUP               */}
        {/* ============================================================== */}
        {(activeMode === 'ecosystem' || activeMode === 'all') && (
          <section className="space-y-8 animate-fadeIn">
            <div className="border-b border-cyan-500/20 pb-2">
              <h2 className="text-xl font-bold text-cyber-cyan flex items-center gap-2">
                <Layers className="w-5 h-5" /> 7. Ecossistema V5 Apollo, Pacotes .v5avatar & Vault
              </h2>
              <p className="text-xs text-slate-400">Exportação em lote, scripts para V5 Prisma, integração V5 Edit Web e gestão do catálogo.</p>
            </div>

            {/* Exportador de Face DNA Pack para Difusores de Vídeo */}
            <FaceDnaPackExporterPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Injetor de Prompts Fixo de Estilo para Lote de Shorts */}
            <BatchStylePromptInjectorPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Tabela de Cenários e Ambientes Canônicos do Avatar */}
            <CanonicalEnvironmentsPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Tabela de Cortes e Ângulos de Câmera para Edição de Shorts */}
            <CinematicCutsPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Gerador de Batch Prompts para o V5 Prisma */}
            <PrismaBatchScriptGeneratorPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Exportador de Metadados de Timeline para o V5 Edit Web */}
            <V5EditTimelineExporterPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Schema Canônico V5AvatarPackage com Integridade Criptográfica SHA-256 */}
            <UniversalPackageSchemaPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Empacotador ZIP Portátil .v5avatar Client-Side */}
            <V5AvatarZipPackerPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Importador Universal de Pacotes .v5avatar */}
            <V5AvatarZipImporterPanel />

            {/* Gerador de Ficha de Personagem para Impressão A4 / PDF */}
            <CharacterSheetPrintPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Sistema de Backup e Restauração Completa do Catálogo em 1 Clique */}
            <CatalogBackupRestorePanel />

            {/* Teste de Carga e Estresse de Importação/Exportação */}
            <CatalogStressTesterPanel />

            {/* Teste E2E de Fluxo Completo */}
            <E2EStudioWorkflowPanel
              avatarId={selectedAvatar?.id}
              avatarName={selectedAvatar?.name}
            />

            {/* Varredura de Segurança de Inputs */}
            <SecurityAuditPanel />

            {/* Dashboard Central de Gestão de Personagens */}
            <CentralCharacterManagementDashboard 
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
            />
          </section>
        )}
      </main>

      <footer className="border-t border-white/10 bg-obsidian-950 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Apollo5RocketLogo size="sm" showText={false} />
            <span className="font-mono text-slate-400">
              Holding V5 Apollo • Capitania #12 (V5 Avatar)
            </span>
          </div>
          <p className="font-mono text-[11px] text-slate-500">
            Soberania de Personagens • Consistência 360° • Turnaround • Voice DNA
          </p>
        </div>
      </footer>

      {/* Modal de Criação Rápida de Avatar */}
      <QuickCreateAvatarModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      {/* Central de Atalhos de Teclado Globais */}
      <KeyboardShortcutsModal
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />
    </div>
  );
}
