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
import AvatarCard from '@/components/avatar/AvatarCard';
import QuickCreateAvatarModal from '@/components/avatar/QuickCreateAvatarModal';
import Apollo5RocketLogo from '@/components/ui/Apollo5RocketLogo';
import { useAvatarStore } from '@/store/useAvatarStore';
import { 
  Users, 
  Sparkles, 
  ScanEye, 
  Mic, 
  Bot, 
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function AvatarHubPage() {
  const { avatars, selectedAvatarId, selectAvatar, activeMode } = useAvatarStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const selectedAvatar = avatars.find((a) => a.id === selectedAvatarId) || avatars[0];

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans selection:bg-cyber-cyan selection:text-obsidian-950">
      {/* Studio Header com Telemetria e Navegação */}
      <StudioHeader onOpenCreateModal={() => setIsCreateModalOpen(true)} />
      
      {/* Banner de Ativação Soberana */}
      <V5AppActivationBanner />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(0,229,255,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
            Capitania #12 · Registro Civil de Pessoas Digitais
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight cyber-gradient-text">
            V5 Apollo Avatar
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Forja de atores digitais soberanos com consistência 360º absoluta. Conecte um único personagem ao{' '}
            <span className="text-cyber-cyan font-bold">V5 Broadcaster</span>,{' '}
            <span className="text-blue-400 font-bold">V5 Prisma</span>,{' '}
            <span className="text-luxury-gold font-bold">V5 Sound</span> e{' '}
            <span className="text-emerald-400 font-bold">V5 Finders</span>.
          </p>
        </div>

        {/* Character Studio Interactive Workspace */}
        <CharacterCreator />

        {/* Visualizador Grid 4 Ângulos Turnaround 360º */}
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

        {/* Matriz de Enquadramentos Cinemáticos */}
        <CinematicFramingMatrix />

        {/* Seletor de Lentes e Distâncias Focais Virtuais */}
        <VirtualLensSelector />

        {/* Sistema de Guias de Proporção Anatômica */}
        <AnatomicalProportionGuides previewImageUrl={selectedAvatar?.avatarUrl} />

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

        {/* Validador Heurístico de Desvios Anatômicos (Anti-Alucinação) */}
        <AnatomicalDeviationValidatorPanel characterName={selectedAvatar?.name} />

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

        {/* Seletor de Tonalidade Emocional Vocal (Enérgico, Calmo, Autoritário, Amigável, Hipnótico, Noturno) */}
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

        {/* Galeria de Personagens Registrados na Store */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyber-cyan" />
              Atores & Personagens Registrados na Holding
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Total: <strong className="text-cyber-cyan">{avatars.length}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {avatars.map((av) => (
              <AvatarCard
                key={av.id}
                avatar={av}
                isSelected={av.id === selectedAvatarId}
                onSelect={() => selectAvatar(av.id)}
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-obsidian-950 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Apollo5RocketLogo size="sm" showText={false} />
            <span className="font-mono text-slate-400">
              Holding V5 Apollo · Capitania #12 (V5 Avatar)
            </span>
          </div>
          <p className="font-mono text-[11px] text-slate-500">
            Soberania de Personagens · Consistência 360º · Turnaround · Voice DNA
          </p>
        </div>
      </footer>

      {/* Modal de Criação Rápida de Avatar */}
      <QuickCreateAvatarModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}
