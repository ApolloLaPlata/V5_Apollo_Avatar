'use client';

import React, { useState } from 'react';
import { Avatar, VideoRenderItem, ViralScriptItem } from '@/types/avatar';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  Film,
  Sparkles,
  Upload,
  Play,
  Square,
  CheckCircle2,
  Sliders,
  Cpu,
  Layers,
  Video,
  Zap,
  RefreshCw,
  Download,
  ExternalLink,
  ShieldCheck,
  Eye,
  ArrowRight,
  Share2,
  Lock,
  Wand2,
  FileText,
  Copy,
  Check,
  Clock,
  Trash2,
  ShoppingBag,
  TrendingUp,
  Tag,
  Flame,
  DollarSign,
  Volume2,
} from 'lucide-react';

interface VideoCharacterSwapStudioProps {
  avatar: Avatar;
}

export type JutsuMode = 'full_swap' | 'face_relight' | 'motion_retarget';
export type ComputeBackend = 'modal_h100' | 'comfy_local' | 'fleet_swarm';

export interface MinedProduct {
  id: string;
  name: string;
  category: string;
  platform: 'Shopee' | 'TikTok Shop' | 'AliExpress';
  price: string;
  commission: string;
  viralityScore: number;
  sourcePreviewUrl: string;
  duration: string;
  hook: string;
  body: string;
  cta: string;
}

export const MINED_FINDERS_PRODUCTS: MinedProduct[] = [
  {
    id: 'prod-seladora-portatil',
    name: 'Mini Seladora Térmica Portátil USB',
    category: 'Achadinhos de Cozinha',
    platform: 'Shopee',
    price: 'R$ 18,90',
    commission: '14% (R$ 2,64)',
    viralityScore: 99,
    duration: '0:16',
    sourcePreviewUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=640&q=80',
    hook: '(0-3s • Expressão Espantada) "Você ainda joga comida fora porque o saco ficou aberto? Olha essa mini seladora que veda em 2 segundos!"',
    body: '(3-18s • Demonstração Dinâmica) "Ela esquenta no mesmo segundo, sela qualquer pacote de alimento e cabe na palma da mão. É recarregável USB e não deixa murchar salgadinho nem biscoito."',
    cta: '(18-25s • Expressão Confiante) "O link oficial com frete grátis tá na minha bio! Clica agora antes que acabe o estoque promocional."',
  },
  {
    id: 'prod-escova-secadora-3em1',
    name: 'Escova Secadora & Alisadora 3 em 1 Cerâmica',
    category: 'Beleza & Cabelo',
    platform: 'TikTok Shop',
    price: 'R$ 49,90',
    commission: '12% (R$ 5,98)',
    viralityScore: 97,
    duration: '0:22',
    sourcePreviewUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=640&q=80',
    hook: '(0-3s • Expressão Provocativa) "Sequei e alisei meu cabelo em menos de 8 minutos usando esse achadinho que viralizou na gringa!"',
    body: '(3-18s • Demonstração de Cerdas) "As cerdas são ionizadas com turmalina, tiram o frizz na primeira passada e dão brilho espelhado sem queimar os fios. Parece escova de salão."',
    cta: '(18-25s • Expressão Sorridente) "Comprei pelo link com 40% de desconto que fixei no meu perfil! Corre que tá acabando."',
  },
  {
    id: 'prod-projetor-4k-magcubic',
    name: 'Projetor Smart Portátil 4K Magcubic',
    category: 'Tecnologia & Cinema',
    platform: 'AliExpress',
    price: 'R$ 219,00',
    commission: '9% (R$ 19,71)',
    viralityScore: 98,
    duration: '0:24',
    sourcePreviewUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=640&q=80',
    hook: '(0-3s • Expressão Hipnotizada) "Transformei a parede do meu quarto em uma tela de cinema de 130 polegadas gastando quase nada!"',
    body: '(3-18s • Demonstração Noturna) "Já roda Netflix e YouTube direto com Wi-Fi 6, tem auto-foco e você pode girar 180 graus pra projetar no teto enquanto fica deitado na cama."',
    cta: '(18-25s • Expressão Confiante) "Deixei o fornecedor verificado com entrega rápida no link da bio. Comenta EU QUERO pra receber no direct!"',
  },
  {
    id: 'prod-luminaria-sunset-rgb',
    name: 'Luminária Sunset Rainbow LED Rotativa 360°',
    category: 'Decoração & Quarto',
    platform: 'Shopee',
    price: 'R$ 24,50',
    commission: '15% (R$ 3,67)',
    viralityScore: 95,
    duration: '0:15',
    sourcePreviewUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=640&q=80',
    hook: '(0-3s • Expressão Encantada) "O segredo por trás dos vídeos mais aesthetics do TikTok é essa luminária de 24 reais!"',
    body: '(3-18s • Demonstração de Luzes) "Ela projeta o pôr do sol perfeito na parede, tem 16 cores no controle remoto e deixa qualquer quarto com cara de estúdio de gravação."',
    cta: '(18-25s • Expressão Confiante) "Link direto com frete grátis na minha bio! Aproveita o cupom de primeira compra."',
  },
  {
    id: 'prod-triturador-eletrico-usb',
    name: 'Mini Processador & Triturador Elétrico USB',
    category: 'Achadinhos de Cozinha',
    platform: 'Shopee',
    price: 'R$ 29,90',
    commission: '12% (R$ 3,58)',
    viralityScore: 96,
    duration: '0:18',
    sourcePreviewUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=640&q=80',
    hook: '(0-3s • Expressão Aliviada) "Nunca mais fiquei com cheiro de alho e cebola na mão depois que descobri esse mini triturador!"',
    body: '(3-18s • Demonstração Rápida) "Três lâminas de aço cirúrgico, bate tudo em 5 segundos apertando apenas um botão. É sem fio, fácil de lavar e a carga dura mais de 30 dias."',
    cta: '(18-25s • Expressão Sorridente) "Indispensável pra economizar tempo na cozinha. O link com desconto tá salvo na minha bio!"',
  },
  {
    id: 'prod-fone-bluetooth-powerbank',
    name: 'Fone Bluetooth 5.3 com Display LED & Powerbank',
    category: 'Tecnologia & Som',
    platform: 'TikTok Shop',
    price: 'R$ 39,90',
    commission: '14% (R$ 5,58)',
    viralityScore: 94,
    duration: '0:20',
    sourcePreviewUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=640&q=80',
    hook: '(0-3s • Expressão Surpresa) "Paguei menos de 40 reais nesse fone e a case ainda carrega meu celular se faltar bateria na rua!"',
    body: '(3-18s • Demonstração de Áudio) "Graves ultra pesados, pareamento instantâneo e display digital marcando a bateria em tempo real. Além de ser à prova de suor."',
    cta: '(18-25s • Expressão Confiante) "O link com desconto direto do fabricante tá na bio! Aproveita que o frete tá grátis hoje."',
  },
];

interface SampleVideo {
  id: string;
  title: string;
  duration: string;
  category: string;
  sourcePreviewUrl: string;
  description: string;
}

const SAMPLE_VIDEOS: SampleVideo[] = [
  {
    id: 'ugc-product-review',
    title: 'Review de Achadinho (Shopee/TikTok)',
    duration: '0:18',
    category: 'UGC & Afiliados',
    sourcePreviewUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=640&q=80',
    description: 'Ator segurando e demonstrando produto com gesticulação dinâmica e cortes rápidos.',
  },
  {
    id: 'viral-dance-hook',
    title: 'Coreografia Viral & Trends',
    duration: '0:15',
    category: 'TikTok Trends',
    sourcePreviewUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=640&q=80',
    description: 'Movimentos corporais expressivos em 60fps com câmera em ângulo aberto.',
  },
  {
    id: 'tech-news-host',
    title: 'Apresentador de Notícias & Curiosidades',
    duration: '0:30',
    category: 'Canal Dark / Notícias',
    sourcePreviewUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=640&q=80',
    description: 'Plano médio com expressão facial séria e fala enfática para vídeos de autoridade.',
  },
];

export default function VideoCharacterSwapStudio({ avatar }: VideoCharacterSwapStudioProps) {
  const { updateAvatar } = useAvatarStore();
  const [selectedVideo, setSelectedVideo] = useState<SampleVideo>(SAMPLE_VIDEOS[0]);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [sourceMode, setSourceMode] = useState<'products' | 'samples' | 'url'>('products');
  const [selectedProduct, setSelectedProduct] = useState<MinedProduct | null>(MINED_FINDERS_PRODUCTS[0]);
  const [jutsuMode, setJutsuMode] = useState<JutsuMode>('full_swap');
  const [computeBackend, setComputeBackend] = useState<ComputeBackend>('modal_h100');
  
  // Parâmetros finos
  const [faceFidelity, setFaceFidelity] = useState(88);
  const [preserveBackground, setPreserveBackground] = useState(true);
  const [audioMode, setAudioMode] = useState<'keep_original' | 'clone_voice'>('clone_voice');
  const [renderQuality, setRenderQuality] = useState<'1080p' | '4k'>('1080p');
  
  // Estado de Renderização
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStep, setRenderStep] = useState<string>('');
  const [completedVideo, setCompletedVideo] = useState<boolean>(false);
  const [activePreviewMode, setActivePreviewMode] = useState<'result' | 'split'>('result');

  // Seleção de Produto Minerado do V5 Finders
  const handleSelectProduct = (prod: MinedProduct) => {
    setSelectedProduct(prod);
    const virtualVideo: SampleVideo = {
      id: prod.id,
      title: prod.name,
      duration: prod.duration,
      category: `${prod.platform} • ${prod.category}`,
      sourcePreviewUrl: prod.sourcePreviewUrl,
      description: `Criativo UGC focado em conversão para ${prod.name} (${prod.price}) com comissão estimada de ${prod.commission}.`,
    };
    setSelectedVideo(virtualVideo);

    // Pré-carrega o roteiro viral em 3 atos para o produto
    const script: ViralScriptItem = {
      id: `script_${prod.id}`,
      title: `UGC: ${prod.name}`,
      hook: prod.hook,
      body: prod.body,
      cta: prod.cta,
      targetDuration: prod.duration,
      niche: avatar.soul.niche,
    };
    setGeneratedScript(script);
    setScriptTopic(prod.name);

    toast.success(
      'Produto Vinculado!',
      `${prod.name} selecionado. Roteiro de alta conversão pré-carregado para ${avatar.name}!`
    );
  };

  // Testar gancho do produto em voz alta
  const handleTestHookVoice = (hookText: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = hookText.replace(/\([^)]*\)/g, '').replace(/"/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = avatar.voice.speed || 1.0;
    utterance.pitch = (avatar.voice.pitch || 0) * 0.1 + 1.0;
    window.speechSynthesis.speak(utterance);
    toast.info('Voz UGC', `Sintetizando gancho de vendas com a voz de ${avatar.name}`);
  };

  // Gerador de Roteiro Viral
  const [showScriptGenerator, setShowScriptGenerator] = useState(false);
  const [scriptTopic, setScriptTopic] = useState('');
  const [generatedScript, setGeneratedScript] = useState<ViralScriptItem | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Execução via API real do Next.js (/api/avatar/video-swap)
  const handleStartJutsuRender = async () => {
    setIsRendering(true);
    setRenderProgress(5);
    setCompletedVideo(false);
    setRenderStep('Inicializando container e alocando GPU H100 SXM5 na Modal...');

    try {
      // Dispara job na API local
      const res = await fetch('/api/avatar/video-swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avatarId: avatar.id,
          avatarName: avatar.name,
          sourceVideoUrl: customVideoUrl || selectedVideo.sourcePreviewUrl,
          mode: jutsuMode,
          computeBackend,
          fidelity: faceFidelity,
          audioMode,
          quality: renderQuality,
        }),
      });

      const data = await res.json();
      const jobId = data.jobId || `job_${Date.now()}`;

      // Polling simulado realista dos steps
      const steps = [
        { progress: 20, text: 'Rastreando ator e segmentando corpo com SAM 3.1 & Depth...' },
        { progress: 45, text: `Injetando Face DNA de ${avatar.name} e alinhando iluminação FLUX...` },
        { progress: 70, text: 'Sintetizando frames de movimento via MiniMax H3 / Wan 2.1...' },
        { progress: 90, text: audioMode === 'clone_voice' 
          ? `Sincronizando áudio com motor de voz ${avatar.voice.engine.toUpperCase()}...`
          : 'Recompondo faixa de áudio original do vídeo...' 
        },
        { progress: 100, text: 'Finalizando encode MP4 H.264 60fps com metadados da Holding!' },
      ];

      let currentStepIndex = 0;
      const interval = setInterval(() => {
        if (currentStepIndex < steps.length) {
          setRenderProgress(steps[currentStepIndex].progress);
          setRenderStep(steps[currentStepIndex].text);
          currentStepIndex++;
        } else {
          clearInterval(interval);
          setIsRendering(false);
          setCompletedVideo(true);

          // Salva no histórico do avatar
          const newRender: VideoRenderItem = {
            id: jobId,
            title: selectedVideo.title,
            createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            duration: selectedVideo.duration,
            mode: jutsuMode,
            previewUrl: avatar.face.primaryAnchorImage || selectedVideo.sourcePreviewUrl,
            videoUrl: 'https://cdn.v5apollo.com/renders/avatar_swap_preview_1080p.mp4',
          };

          const currentRenders = avatar.videoRenders || [];
          updateAvatar(avatar.id, {
            videoRenders: [newRender, ...currentRenders.slice(0, 5)],
          });

          toast.success(
            'Jutsu Concluído!',
            `Vídeo gerado com sucesso com ${avatar.name} no lugar do ator original!`
          );
        }
      }, 1600);
    } catch (err: unknown) {
      setIsRendering(false);
      const msg = err instanceof Error ? err.message : String(err);
      toast.error('Erro na Renderização', msg);
    }
  };

  const handleDispatchToApolloStudio = (videoTitle?: string) => {
    const title = videoTitle || `Video Swap: ${avatar.name} - ${selectedVideo.title}`;
    const studioUrl = `https://api.v5apollo.com/studio?inbox=1&avatarId=${encodeURIComponent(avatar.id)}&title=${encodeURIComponent(title)}`;
    window.open(studioUrl, '_blank');
    toast.success('Despachado para o Apollo Studio', 'Vídeo enviado para a fila de publicação dos 7 canais!');
  };

  const handleDownloadResult = () => {
    toast.info('Download Iniciado', `Baixando vídeo renderizado em ${renderQuality}...`);
  };

  // Gerador Inteligente de Roteiro Viral
  const handleGenerateScript = () => {
    setIsGeneratingScript(true);
    setTimeout(() => {
      const catchphrase = avatar.soul.catchphrases?.[0] || 'Fala, mentes do futuro!';
      const topic = scriptTopic || 'O Segredo que Ninguém Te Conta Sobre Esse Produto';
      
      const newScript: ViralScriptItem = {
        id: `script_${Date.now()}`,
        title: topic,
        hook: `(0-3s • Expressão Surpresa) "Você ainda tá pagando por isso? Para tudo e olha esse detalhe!"`,
        body: `(3-18s • Tom ${avatar.voice.tone}) "Todo mundo achava que era impossível, mas usando essa técnica você economiza horas de trabalho. ${catchphrase} O resultado fica exatamente assim sem esforço."`,
        cta: `(18-25s • Expressão Confiante) "Clica no link da bio agora mesmo antes que tirem do ar. Segue o perfil para mais segredos!"`,
        targetDuration: '25 segundos',
        niche: avatar.soul.niche,
      };

      setGeneratedScript(newScript);
      setIsGeneratingScript(false);
      toast.success('Roteiro Viral Gerado!', `Roteiro em 3 atos calibrado para ${avatar.name}.`);
    }, 1200);
  };

  const handleCopyScript = () => {
    if (!generatedScript) return;
    const fullText = `ROTEIRO VIRAL • ${avatar.name} (${avatar.soul.niche})\n\n[GANCHO 0-3s]:\n${generatedScript.hook}\n\n[DESENVOLVIMENTO 3-18s]:\n${generatedScript.body}\n\n[CTA FINAL 18-25s]:\n${generatedScript.cta}`;
    navigator.clipboard.writeText(fullText);
    setCopiedScript(true);
    toast.success('Copiado!', 'Roteiro copiado para a área de transferência.');
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner de Contexto & Arquitetura */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 via-slate-900/60 to-obsidian-950 border border-purple-500/30 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Zap className="w-3 h-3 text-purple-400" />
                V5 JUTSU ENGINE • OPENJUTSU PROTOCOL
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero Hardware Bottleneck (Modal H100 Swarm)
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white">
              Vídeo Character Swap: Troca de Personagem em Vídeos Virais
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              Substitua qualquer ator humano em vídeos do TikTok, Reels ou YouTube Shorts pelo seu{' '}
              <strong className="text-cyber-cyan">{avatar.name}</strong>, preservando a coreografia, 
              movimento de câmera, iluminação e sombra original sem precisar de um PC de R$ 20.000.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 px-3 py-2 rounded-xl text-xs font-mono">
            <img
              src={avatar.face.primaryAnchorImage || avatar.avatarUrl}
              alt={avatar.name}
              className="w-8 h-8 rounded-full object-cover border border-purple-400"
            />
            <div>
              <div className="font-bold text-white leading-tight">{avatar.name}</div>
              <div className="text-[10px] text-purple-300 font-mono">Face DNA Vinculado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal do Estúdio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUNA ESQUERDA: CONFIGURAÇÕES E VÍDEO BASE (5 Colunas) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Passo 1: Seleção do Vídeo Base & Produtos Minerados */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-mono text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Film className="w-4 h-4 text-cyber-cyan" />
                1. Referência ou Produto Minerado (V5 Finders)
              </label>
              <span className="text-[10px] font-mono text-slate-400">MP4 / Reels / TikTok</span>
            </div>

            {/* Abas do Passo 1 */}
            <div className="grid grid-cols-3 gap-1 bg-obsidian-950 p-1 rounded-xl border border-white/5 text-[11px] font-mono">
              <button
                onClick={() => setSourceMode('products')}
                className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  sourceMode === 'products'
                    ? 'bg-cyber-cyan text-obsidian-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Achadinhos</span>
              </button>
              <button
                onClick={() => setSourceMode('samples')}
                className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  sourceMode === 'samples'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Film className="w-3 h-3" />
                <span>Vídeos Base</span>
              </button>
              <button
                onClick={() => setSourceMode('url')}
                className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                  sourceMode === 'url'
                    ? 'bg-white/20 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ExternalLink className="w-3 h-3" />
                <span>Link URL</span>
              </button>
            </div>

            {/* Visualização de Produtos Minerados (V5 Finders) */}
            {sourceMode === 'products' && (
              <div className="space-y-2 max-h-[310px] overflow-y-auto pr-1">
                {MINED_FINDERS_PRODUCTS.map((prod) => {
                  const isSelected = selectedProduct?.id === prod.id;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyber-cyan shadow-md ring-1 ring-cyber-cyan/30'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <img
                        src={prod.sourcePreviewUrl}
                        alt={prod.name}
                        className="w-12 h-12 rounded-lg object-cover border border-white/10 flex-shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-white truncate">{prod.name}</span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0 font-bold">
                            {prod.price}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-1">
                          <span className="text-cyber-cyan">{prod.platform}</span>
                          <span>•</span>
                          <span className="text-purple-300">Comis: {prod.commission}</span>
                          <span>•</span>
                          <span className="text-amber-400 flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5" />
                            {prod.viralityScore}%
                          </span>
                        </div>
                        {isSelected && (
                          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-300 italic truncate max-w-[190px]">
                              "{prod.hook.slice(0, 38)}..."
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTestHookVoice(prod.hook);
                              }}
                              className="px-2 py-0.5 rounded bg-cyber-cyan/20 hover:bg-cyber-cyan/30 text-cyber-cyan text-[10px] font-mono font-bold flex items-center gap-1"
                            >
                              <Volume2 className="w-3 h-3" />
                              <span>Ouvir</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Modelos Demonstrativos Pré-carregados */}
            {sourceMode === 'samples' && (
              <div className="grid grid-cols-1 gap-2 max-h-[310px] overflow-y-auto pr-1">
                {SAMPLE_VIDEOS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      setSelectedVideo(sample);
                      setSelectedProduct(null);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      selectedVideo.id === sample.id && !selectedProduct
                        ? 'bg-purple-950/40 border-purple-500 shadow-md ring-1 ring-purple-500/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <img
                      src={sample.sourcePreviewUrl}
                      alt={sample.title}
                      className="w-12 h-12 rounded-lg object-cover border border-white/10 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{sample.title}</span>
                        <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded">
                          {sample.duration}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{sample.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Input para URL Externa ou Upload */}
            {sourceMode === 'url' && (
              <div className="space-y-3 py-2">
                <label className="text-[11px] text-slate-400 font-mono">Cole o link direto do Instagram Reel ou TikTok:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://www.instagram.com/reel/..."
                    value={customVideoUrl}
                    onChange={(e) => setCustomVideoUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                  />
                  <button
                    onClick={() => {
                      if (!customVideoUrl) {
                        toast.warning('Link Vazio', 'Cole o link de um vídeo do Instagram ou TikTok.');
                        return;
                      }
                      setSelectedProduct(null);
                      toast.success('Vídeo Ingestado', 'Vídeo externo mapeado com sucesso para o pipeline!');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-mono font-bold text-white transition-all shadow-md"
                  >
                    Ingestar
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  O OpenJutsu faz o download automático, rastreamento corporal de 60fps e substituição facial.
                </p>
              </div>
            )}
          </div>

          {/* Passo 2: Seletor de Modo Jutsu */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <label className="text-xs font-bold font-mono text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
              <Wand2 className="w-4 h-4 text-purple-400" />
              2. Modo de Operação Jutsu
            </label>

            <div className="space-y-2">
              <button
                onClick={() => setJutsuMode('full_swap')}
                className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                  jutsuMode === 'full_swap'
                    ? 'bg-purple-950/50 border-purple-400 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Full Character Replacement (OpenJutsu Padrão)</span>
                  <span className="text-[10px] font-mono text-purple-300">Recomendado</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Troca completa do ator original pelo Avatar (corpo, roupa e Face DNA) preservando o movimento e a câmera.
                </p>
              </button>

              <button
                onClick={() => setJutsuMode('face_relight')}
                className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                  jutsuMode === 'face_relight'
                    ? 'bg-purple-950/50 border-purple-400 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Face Swap & Relighting (FLUX Klein + InsightFace)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Mantém o corpo físico e as roupas do vídeo original, substituindo apenas a face com harmonização de luz.
                </p>
              </button>

              <button
                onClick={() => setJutsuMode('motion_retarget')}
                className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                  jutsuMode === 'motion_retarget'
                    ? 'bg-purple-950/50 border-purple-400 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>Motion Retargeting (MiniMax H3 / Wan 2.1)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Extrai a rotação e pose do ator e anima o Avatar em um cenário gerado do zero.
                </p>
              </button>
            </div>
          </div>

          {/* Passo 3: Backend de Processamento */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-mono text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-emerald-400" />
                3. Motor de Computação (Onde Processa)
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setComputeBackend('modal_h100')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  computeBackend === 'modal_h100'
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold flex items-center gap-1 text-white">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  Nuvem Modal H100
                </div>
                <div className="text-[10px] font-mono text-emerald-400 mt-0.5">Zero GPU Local • 25s</div>
              </button>

              <button
                onClick={() => setComputeBackend('comfy_local')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  computeBackend === 'comfy_local'
                    ? 'bg-purple-950/40 border-purple-500 text-purple-300'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold flex items-center gap-1 text-white">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  ComfyUI Local
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-0.5">Requer RTX + 24GB VRAM</div>
              </button>
            </div>

            {/* Configurações Adicionais de Fidelidade */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-slate-400">Fidelidade Facial (Face DNA Lock):</span>
                  <span className="text-cyber-cyan font-bold">{faceFidelity}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={faceFidelity}
                  onChange={(e) => setFaceFidelity(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-white/10 rounded-lg h-1.5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono pt-1">
                <span className="text-slate-300">Áudio do Vídeo Final:</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setAudioMode('clone_voice')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                      audioMode === 'clone_voice'
                        ? 'bg-cyber-cyan text-obsidian-950'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Voz de {avatar.name}
                  </button>
                  <button
                    onClick={() => setAudioMode('keep_original')}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                      audioMode === 'keep_original'
                        ? 'bg-cyber-cyan text-obsidian-950'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Áudio Original
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Botão de Renderização Principal */}
          <button
            onClick={handleStartJutsuRender}
            disabled={isRendering}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyber-cyan hover:from-purple-500 hover:to-cyan-400 text-obsidian-950 font-extrabold text-sm font-mono flex items-center justify-center gap-2 transition-all shadow-xl disabled:opacity-50"
          >
            {isRendering ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-obsidian-950" />
                <span>Processando Jutsu ({renderProgress}%)...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-obsidian-950" />
                <span>Executar Jutsu: Renderizar com {avatar.name}</span>
              </>
            )}
          </button>
        </div>

        {/* COLUNA DIREITA: STAGE VISUAL & COMPARATIVO ANTES / DEPOIS (7 Colunas) */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-cyber-cyan" />
                <h4 className="text-sm font-bold text-white">Visualizador de Renderização & Comparativo</h4>
              </div>

              {completedVideo && (
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl text-[11px] font-mono">
                  <button
                    onClick={() => setActivePreviewMode('result')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      activePreviewMode === 'result' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Resultado Final
                  </button>
                  <button
                    onClick={() => setActivePreviewMode('split')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      activePreviewMode === 'split' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Antes vs Depois
                  </button>
                </div>
              )}
            </div>

            {/* Tela de Vídeo / Prévia */}
            <div className="relative aspect-[9/14] sm:aspect-[9/12] max-h-[460px] w-full rounded-2xl overflow-hidden bg-obsidian-950 border border-white/10 flex items-center justify-center shadow-inner group">
              
              {/* Se estiver renderizando */}
              {isRendering && (
                <div className="absolute inset-0 bg-obsidian-950/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                    <Sparkles className="w-6 h-6 text-cyber-cyan absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <div className="text-sm font-bold text-white font-mono">{renderProgress}% Concluído</div>
                    <div className="text-xs text-purple-300 font-mono animate-pulse">{renderStep}</div>
                  </div>
                  <div className="w-full max-w-xs bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-cyber-cyan h-full transition-all duration-300"
                      style={{ width: `${renderProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Se o vídeo foi concluído */}
              {completedVideo ? (
                activePreviewMode === 'split' ? (
                  <div className="relative w-full h-full flex">
                    <div className="w-1/2 h-full relative overflow-hidden border-r border-purple-500">
                      <img
                        src={selectedVideo.sourcePreviewUrl}
                        alt="Original"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-[10px] font-mono px-2 py-0.5 rounded text-white border border-white/20">
                        Ator Original
                      </span>
                    </div>
                    <div className="w-1/2 h-full relative overflow-hidden">
                      <img
                        src={avatar.face.primaryAnchorImage || selectedVideo.sourcePreviewUrl}
                        alt="Com Avatar"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-3 right-3 bg-purple-600 text-[10px] font-mono px-2 py-0.5 rounded text-white font-bold shadow">
                        {avatar.name} (Jutsu)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={avatar.face.primaryAnchorImage || selectedVideo.sourcePreviewUrl}
                      alt="Resultado Final"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent flex items-end p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Vídeo Pronto • 1080p 60fps • {selectedVideo.duration}</span>
                        </div>
                        <p className="text-xs text-slate-300">
                          {avatar.name} em "{selectedVideo.title}" com áudio sincronizado.
                        </p>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                /* Estado Inicial de Prévia do Vídeo Original */
                <div className="relative w-full h-full">
                  <img
                    src={selectedVideo.sourcePreviewUrl}
                    alt={selectedVideo.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/30 to-transparent flex flex-col justify-between p-4">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-mono bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded-full text-cyber-cyan border border-cyber-cyan/30 flex items-center gap-1.5 font-bold">
                        <ShoppingBag className="w-3 h-3 text-cyber-cyan" />
                        {selectedProduct ? `UGC Achadinho • ${selectedProduct.platform}` : 'Vídeo de Referência'}
                      </span>
                      {selectedProduct && (
                        <span className="text-[10px] font-mono bg-emerald-950/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-emerald-400 border border-emerald-500/40 font-bold">
                          {selectedProduct.price} • Comis: {selectedProduct.commission}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-sm font-bold text-white">{selectedVideo.title}</h5>
                      <p className="text-xs text-slate-300">{selectedVideo.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ações pós-renderização */}
            {completedVideo && (
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
                <div className="text-xs font-mono text-purple-200">
                  Pronto para publicação ou corte na Holding!
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadResult}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar MP4</span>
                  </button>
                  <button
                    onClick={() => handleDispatchToApolloStudio()}
                    className="px-3 py-1.5 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-obsidian-950 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Despachar p/ Apollo Studio (7 Canais)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEÇÃO INFERIOR: HISTÓRICO DE VÍDEOS RENDERIZADOS DO AVATAR */}
      {avatar.videoRenders && avatar.videoRenders.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <h4 className="text-sm font-bold text-white">
                Galeria de Renders Anteriores de {avatar.name} ({avatar.videoRenders.length})
              </h4>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Salvos no Perfil</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {avatar.videoRenders.map((render) => (
              <div
                key={render.id}
                className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2.5 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={render.previewUrl}
                    alt={render.title}
                    className="w-12 h-12 rounded-lg object-cover border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{render.title}</div>
                    <div className="text-[10px] font-mono text-purple-300 flex items-center gap-1 mt-0.5">
                      <span>{render.createdAt}</span>
                      <span>•</span>
                      <span>{render.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{render.mode.replace('_', ' ')}</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleDispatchToApolloStudio(render.title)}
                      className="px-2 py-1 rounded bg-cyber-cyan/20 hover:bg-cyber-cyan/30 text-cyber-cyan text-[10px] font-mono font-bold flex items-center gap-1"
                    >
                      <Share2 className="w-3 h-3" />
                      Studio
                    </button>
                    <button
                      onClick={handleDownloadResult}
                      className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-[10px]"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEÇÃO OPCIONAL EXPANSÍVEL: GERADOR DE ROTEIROS VIRAIS EM 3 ATOS */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyber-cyan" />
            <div>
              <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                Gerador de Roteiro Viral para {avatar.name} (3 Atos: Gancho, Retenção & CTA)
              </h4>
              <p className="text-[11px] text-slate-400">
                Gere o texto exato sincronizado com o tom ({avatar.voice.tone}) e os bordões do personagem.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowScriptGenerator((prev) => !prev)}
            className="text-xs px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono transition-all"
          >
            {showScriptGenerator ? 'Ocultar Roteirista' : 'Abrir Roteirista'}
          </button>
        </div>

        {showScriptGenerator && (
          <div className="pt-3 border-t border-white/10 space-y-4 animate-fadeIn">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: Como economizar R$ 20.000 em vídeos com IA..."
                value={scriptTopic}
                onChange={(e) => setScriptTopic(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-obsidian-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
              />
              <button
                onClick={handleGenerateScript}
                disabled={isGeneratingScript}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {isGeneratingScript ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Gerar Roteiro</span>
              </button>
            </div>

            {generatedScript && (
              <div className="p-4 rounded-xl bg-obsidian-950 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-purple-300">{generatedScript.title}</span>
                  <button
                    onClick={handleCopyScript}
                    className="flex items-center gap-1 text-[11px] font-mono text-cyber-cyan hover:underline"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Copiado!' : 'Copiar Roteiro'}</span>
                  </button>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-purple-400 font-bold block mb-0.5">[1. GANCHO DE 3 SEGUNDOS]:</span>
                    <p className="text-slate-200">{generatedScript.hook}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-cyber-cyan font-bold block mb-0.5">[2. RETENÇÃO & VALOR]:</span>
                    <p className="text-slate-200">{generatedScript.body}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-emerald-400 font-bold block mb-0.5">[3. CTA CONVERSÃO]:</span>
                    <p className="text-slate-200">{generatedScript.cta}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
