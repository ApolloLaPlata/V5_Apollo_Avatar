'use client';

import React, { useState, useMemo } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  CharacterSheetData,
  compileCharacterSheetData,
  triggerA4Print,
} from '@/utils/characterSheetPrintEngine';
import Apollo5RocketLogo from '@/components/ui/Apollo5RocketLogo';
import {
  Printer,
  FileText,
  Sparkles,
  Download,
  Fingerprint,
  ShieldCheck,
  CheckCircle2,
  ScanEye,
  Mic,
  Bot,
  Radio,
  Share2,
  Eye,
  Sliders,
} from 'lucide-react';

interface CharacterSheetPrintPanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function CharacterSheetPrintPanel({
  avatarId,
  avatarName,
}: CharacterSheetPrintPanelProps) {
  const { avatars, selectedAvatarId } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === (avatarId || selectedAvatarId)) || avatars[0];

  const [printTheme, setPrintTheme] = useState<'light_clean' | 'dark_luxury'>('dark_luxury');

  const sheetData: CharacterSheetData = useMemo(() => {
    return compileCharacterSheetData(currentAvatar);
  }, [currentAvatar]);

  return (
    <div className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(0,229,255,0.08)] space-y-6">
      {/* Header do Painel (Oculto na Impressão via print:hidden) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6 print:hidden">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-bold tracking-wider uppercase mb-2">
            <Printer className="w-3.5 h-3.5" />
            Fase 10 · Etapa 094 · Ficha Técnica Executiva A4 / PDF
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Gerador de Ficha de Personagem para Impressão (A4)
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Ficha técnica executiva com fotos, biometria facial, parâmetros de voz e psicologia do personagem pronta para impressão física ou PDF.
          </p>
        </div>

        {/* Ações de Impressão */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-obsidian-950 p-1 rounded-xl border border-white/10 text-xs font-mono">
            <button
              onClick={() => setPrintTheme('dark_luxury')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                printTheme === 'dark_luxury'
                  ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dark Executivo
            </button>
            <button
              onClick={() => setPrintTheme('light_clean')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                printTheme === 'light_clean'
                  ? 'bg-white/20 text-white font-bold border border-white/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fundo Claro (Econômico)
            </button>
          </div>

          <button
            onClick={triggerA4Print}
            className="px-5 py-2.5 rounded-xl bg-cyber-cyan text-obsidian-950 hover:bg-cyber-cyan/90 transition-all text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.25)]"
          >
            <Printer className="w-4 h-4" />
            Imprimir A4 / Salvar como PDF
          </button>
        </div>
      </div>

      {/* Folha Executiva A4 Renderizada */}
      <div className="flex justify-center overflow-x-auto p-2">
        <div
          id="character-sheet-a4"
          className={`w-full max-w-[800px] rounded-2xl p-8 border transition-all duration-300 shadow-2xl relative ${
            printTheme === 'dark_luxury'
              ? 'bg-obsidian-950 text-slate-100 border-white/10 shadow-[0_0_35px_rgba(0,0,0,0.8)]'
              : 'bg-white text-slate-900 border-slate-300 shadow-xl'
          }`}
          style={{ minHeight: '1050px' }}
        >
          {/* Cabeçalho Oficial do Registro Civil de Personagens */}
          <div className="flex items-center justify-between border-b-2 border-cyber-cyan pb-5 mb-6">
            <div className="flex items-center gap-3">
              <Apollo5RocketLogo size="md" showText={false} />
              <div>
                <h1 className="text-lg font-black tracking-wider uppercase font-sans">
                  HOLDING V5 APOLLO · REGISTRO CIVIL DE PERSONAGENS
                </h1>
                <p className="text-[11px] font-mono text-slate-400 tracking-wide">
                  Capitania #12 (V5 Avatar) · Agência Central de Identidades Digitais Soberanas
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                Nº DE REGISTRO OFICIAL:
              </span>
              <strong className="text-sm font-mono text-cyber-cyan font-bold tracking-widest">
                {sheetData.registrationId}
              </strong>
            </div>
          </div>

          {/* Seção 1: Apresentação Visual do Personagem & Dados Chave */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
            {/* Foto Âncora 3x4 / Busto (4 Colunas) */}
            <div className="md:col-span-4 flex flex-col items-center space-y-2">
              <div className="relative w-44 h-56 rounded-xl overflow-hidden border-2 border-cyber-cyan shadow-lg">
                <img
                  src={sheetData.anchorPhotoUrl}
                  alt={sheetData.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[9px] font-mono text-cyber-cyan border border-cyber-cyan/30">
                  ÂNCORA 360º
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs font-mono text-slate-400">Data de Registro:</div>
                <div className="text-xs font-bold font-mono">{sheetData.registrationDate}</div>
              </div>
            </div>

            {/* Informações Primárias & Bio (8 Colunas) */}
            <div className="md:col-span-8 space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyber-cyan/15 text-cyber-cyan font-bold border border-cyber-cyan/30">
                    {sheetData.type}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> CERTIFICADO SOBERANO
                  </span>
                </div>
                <h2 className="text-2xl font-black mt-1 tracking-tight">{sheetData.name}</h2>
                <p className="text-xs font-semibold text-cyber-cyan">{sheetData.tagline}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-obsidian-900/60 border border-white/5 text-xs leading-relaxed text-slate-300">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1 font-bold">
                  Sinopse & Perfil Executivo (Soul DNA):
                </span>
                {sheetData.soulProfile.bio}
              </div>

              {/* Traços de Personalidade & MBTI */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-obsidian-900/40 border border-white/5">
                  <span className="text-[10px] text-slate-500 block">Arquétipo / MBTI:</span>
                  <strong className="text-amber-400">{sheetData.soulProfile.archetype} ({sheetData.soulProfile.mbti.split(' ')[0]})</strong>
                </div>

                <div className="p-2.5 rounded-lg bg-obsidian-900/40 border border-white/5">
                  <span className="text-[10px] text-slate-500 block">Nicho de Autoridade:</span>
                  <strong className="text-cyber-cyan truncate block">{sheetData.soulProfile.niche}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Seção 2: Especificações Técnicas dos 4 Pilares (Grid 2 Colunas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 text-xs font-mono">
            {/* Pilar Face DNA (Biometria & Difusão) */}
            <div className="p-4 rounded-xl bg-obsidian-900/50 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-cyber-cyan font-bold border-b border-white/5 pb-1.5">
                <ScanEye className="w-4 h-4" />
                <span>Face DNA & Difusão (V5 Prisma)</span>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div>
                  <span className="text-slate-500">Trigger Word:</span>{' '}
                  <strong className="text-cyber-cyan">{sheetData.biometrics.triggerWord}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Seed Determinístico:</span>{' '}
                  <strong>{sheetData.biometrics.diffusionSeed}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Figurino Fixo:</span>{' '}
                  <span className="text-slate-400">{sheetData.biometrics.clothingPrompt}</span>
                </div>
                <div>
                  <span className="text-slate-500">Iluminação Padrão:</span>{' '}
                  <span>{sheetData.biometrics.lightingPreset}</span>
                </div>
              </div>
            </div>

            {/* Pilar Voice DNA (Vocal & Síntese) */}
            <div className="p-4 rounded-xl bg-obsidian-900/50 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold border-b border-white/5 pb-1.5">
                <Mic className="w-4 h-4" />
                <span>Voice DNA & Síntese (V5 Sound)</span>
              </div>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div>
                  <span className="text-slate-500">Motor de Clonagem:</span>{' '}
                  <strong className="text-purple-300">{sheetData.voiceSpecs.engine} (Qwen-TTS / XTTS)</strong>
                </div>
                <div>
                  <span className="text-slate-500">Tom Vocal:</span>{' '}
                  <span>{sheetData.voiceSpecs.tone}</span>
                </div>
                <div>
                  <span className="text-slate-500">Velocidade / Estabilidade:</span>{' '}
                  <span>{sheetData.voiceSpecs.speed}x / {(sheetData.voiceSpecs.stability * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <span className="text-slate-500">V5 Sound ID:</span>{' '}
                  <span className="text-slate-400">{sheetData.voiceSpecs.v5SoundVoiceId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seção 3: Frases de Efeito & Guardrails */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 text-xs font-mono">
            {/* Frases de Efeito */}
            <div className="p-4 rounded-xl bg-obsidian-900/40 border border-white/5 space-y-2">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" />
                Bordões & Marcas Registradas (Catchphrases):
              </span>
              <ul className="text-slate-300 text-[11px] space-y-1 list-disc list-inside">
                {sheetData.soulProfile.catchphrases.map((phrase, i) => (
                  <li key={i} className="italic">{phrase}</li>
                ))}
              </ul>
            </div>

            {/* Guardrails de Segurança */}
            <div className="p-4 rounded-xl bg-obsidian-900/40 border border-white/5 space-y-2">
              <span className="font-bold text-rose-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Guardrails & Tópicos Proibidos:
              </span>
              <ul className="text-slate-300 text-[11px] space-y-1 list-disc list-inside">
                {sheetData.soulProfile.forbiddenTopics.map((topic, i) => (
                  <li key={i}>{topic}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Rodapé Oficial com Assinatura Digital e Hash Criptográfico */}
          <div className="pt-4 border-t-2 border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <div className="space-y-0.5 text-left">
              <div className="flex items-center gap-1.5">
                <Fingerprint className="w-4 h-4 text-cyber-cyan" />
                <span className="text-[11px]">
                  Fingerprint SHA-256: <strong className="text-slate-200">{sheetData.sha256Fingerprint.slice(0, 24)}...</strong>
                </span>
              </div>
              <div className="text-[10px] text-slate-500">
                Holding V5 Apollo · Capitania #12 · Documento Emitido via Kernel Soberano (:3010)
              </div>
            </div>

            <div className="text-right border border-white/10 px-3 py-1.5 rounded-lg bg-obsidian-900/60">
              <span className="text-[9px] uppercase text-slate-500 block">Assinado por:</span>
              <strong className="text-xs text-white">Apollo La Plata</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
