'use client';

import React, { useState } from 'react';
import Apollo5RocketLogo from '@/components/ui/Apollo5RocketLogo';
import V5AppActivationBanner from '@/components/ui/V5AppActivationBanner';
import { CharacterCreator } from '@/components/avatar/CharacterCreator';
import { 
  Users, 
  Sparkles, 
  ScanEye, 
  Mic, 
  MessageSquare, 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  Layers,
  Radio,
  Video,
  ShoppingBag
} from 'lucide-react';
import { AvatarProfile } from '@/types/avatar';

const DEMO_AVATARS: AvatarProfile[] = [
  {
    id: 'avatar-1',
    name: 'Maya Vance',
    tagline: 'Apresentadora Tech & Reviewer de Inteligência Artificial',
    type: 'influencer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-10-26',
    updatedAt: '2026-10-26',
    face: {
      referenceImages: [],
      clothingPrompt: 'Jaqueta bomber futurista ciano e preta',
      fixedFeaturesPrompt: 'Olhos castanhos claros, cabelo ondulado médio, traços brasileiros expressivos',
      ethnicityAgeGender: 'Mulher brasileira, 26 anos'
    },
    voice: {
      engine: 'qwen-tts',
      tone: 'energetic',
      speed: 1.05
    },
    soul: {
      bio: 'Especialista em descomplicar ferramentas de IA para o público do Instagram e YouTube.',
      niche: 'Tecnologia & IA',
      personalityTraits: ['Espontânea', 'Carismática', 'Didática'],
      catchphrases: ['Fala, mentes do futuro!', 'Isso aqui muda o jogo.'],
      forbiddenTopics: ['Política partidária', 'Conselhos financeiros duvidosos'],
      systemPrompt: 'Você é Maya Vance, criadora de conteúdo e apresentadora oficial da V5 Apollo.'
    },
    channel: {
      totalConversations: 1420
    },
    syncedSites: {
      broadcaster: true,
      prisma: true,
      sound: true,
      edit: true,
      finders: true
    }
  },
  {
    id: 'avatar-2',
    name: 'Professor Arthur',
    tagline: 'Narrador Pedagógico para Histórias & VSLs Científicas',
    type: 'actor',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-10-26',
    updatedAt: '2026-10-26',
    face: {
      referenceImages: [],
      clothingPrompt: 'Blazer cinza clássico sobre camisa social branca sem gravata',
      fixedFeaturesPrompt: 'Homem maduro de 48 anos, barba grisalha alinhada, óculos de aro fino',
      ethnicityAgeGender: 'Homem de 48 anos'
    },
    voice: {
      engine: 'xtts',
      tone: 'authoritative',
      speed: 0.95
    },
    soul: {
      bio: 'Narrador sério para canais dark de história, filosofia e ciência.',
      niche: 'Educação & VSL',
      personalityTraits: ['Profundo', 'Reflexivo', 'Confiável'],
      catchphrases: ['Mas a verdadeira pergunta que devemos fazer é...'],
      forbiddenTopics: ['Linguagem vulgar', 'Gírias de internet'],
      systemPrompt: 'Você é o Professor Arthur, narrador do canal.'
    },
    channel: {
      totalConversations: 630
    },
    syncedSites: {
      broadcaster: true,
      prisma: true,
      sound: true,
      edit: true,
      finders: false
    }
  }
];

export default function AvatarHubPage() {
  const [avatars, setAvatars] = useState<AvatarProfile[]>(DEMO_AVATARS);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarProfile | null>(DEMO_AVATARS[0]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <V5AppActivationBanner />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Capitania #12 · Registro Civil de Pessoas Digitais
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            V5 Apollo Avatar
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Forja de atores digitais com consistência 360º absoluta. Conecte um único personagem ao <span className="text-cyan-400 font-bold">V5 Broadcaster</span>, <span className="text-purple-400 font-bold">V5 Prisma</span>, <span className="text-emerald-400 font-bold">V5 Sound</span> e <span className="text-amber-400 font-bold">V5 Finders</span>.
          </p>
        </div>

        {/* Character Studio Interactive Workspace */}
        <CharacterCreator />

        {/* Galeria de Personagens Registrados */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Atores & Personagens Registrados na Holding
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Total: <strong className="text-cyan-400">{avatars.length}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {avatars.map((av) => (
              <div
                key={av.id}
                className="bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start transition-all shadow-md group"
              >
                <img
                  src={av.avatarUrl}
                  alt={av.name}
                  className="w-24 h-24 rounded-xl object-cover border border-slate-700 shrink-0 shadow-lg group-hover:scale-105 transition-transform"
                />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-slate-100 group-hover:text-cyan-400 transition-colors">
                      {av.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/20 uppercase">
                      {av.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {av.tagline}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1 text-purple-300">
                      <Mic className="w-3.5 h-3.5" /> {av.voice.engine.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1 text-cyan-300">
                      <ScanEye className="w-3.5 h-3.5" /> Turnaround 360º
                    </span>
                    <span className="flex items-center gap-1 text-emerald-300">
                      <Bot className="w-3.5 h-3.5" /> Webhook Ativo
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500 mt-12">
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
    </div>
  );
}
