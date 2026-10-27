'use client';

import React, { useState, useRef } from 'react';
import {
  ALLOWED_AUDIO_TYPES,
  AudioSanitizationReport,
  analyzeAudioFile,
} from '@/utils/audioProcessor';
import { toast } from '@/store/useToastStore';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  Mic,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileAudio,
  Activity,
  Layers,
} from 'lucide-react';

interface VoiceAudioUploaderProps {
  avatarId?: string;
  avatarName?: string;
  currentAudioUrl?: string;
}

export default function VoiceAudioUploader({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
  currentAudioUrl,
}: VoiceAudioUploaderProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'record'>('upload');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(currentAudioUrl || null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<AudioSanitizationReport | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { updateAvatar, avatars } = useAvatarStore();

  // Handlers de Upload de Arquivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_AUDIO_TYPES.includes(file.type) && !file.name.match(/\.(wav|mp3|m4a|ogg|flac)$/i)) {
      toast.error('Formato Inválido', 'Por favor envie arquivos .wav, .mp3, .m4a ou .ogg.');
      return;
    }

    try {
      setIsProcessing(true);
      const rep = await analyzeAudioFile(file);
      setAnalysis(rep);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      toast.success(
        'Áudio Carregado!',
        `${file.name} (${rep.durationSeconds}s) sanitizado com sucesso.`
      );
    } catch (err: any) {
      toast.error('Falha na Análise', 'Não foi possível decodificar o arquivo de áudio.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handlers de Gravação via Microfone Nativo
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) audioChunksRef.current.push(ev.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const recordedFile = new File([audioBlob], 'live_recording_voice.wav', {
          type: 'audio/wav',
        });
        const rep = await analyzeAudioFile(recordedFile);
        setAnalysis(rep);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        toast.success(
          'Gravação Concluída!',
          `${rep.durationSeconds}s capturados com qualidade de estúdio.`
        );
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 20) {
            handleStopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      toast.error(
        'Permissão Negada',
        'Por favor permita o acesso ao microfone no navegador para gravar.'
      );
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  };

  // Play / Pause do Player de Áudio
  const togglePlay = () => {
    if (!audioPlayerRef.current || !audioUrl) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => setIsPlaying(false);

  // Vincular à Store
  const handleSaveToStore = () => {
    if (!audioUrl) return;
    const current = avatars.find((a) => a.id === avatarId);
    if (!current) return;

    updateAvatar(avatarId, {
      voice: {
        ...current.voice,
        sampleAudioUrl: audioUrl,
        v5SoundVoiceId: `v5sound_${avatarName.toLowerCase().replace(/\s+/g, '_')}_v1`,
      },
    });

    toast.success(
      'DNA Vocal Vinculado!',
      `Amostra sonora atribuída ao personagem com ID V5 Sound.`
    );
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-5 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/30 shadow-glow-gold">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Uploader & Gravador Nativo de Áudio de Referência (V5 Sound)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30">
                Qwen-TTS / XTTS-v2 Ready
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Captura e sanitização acústica de amostras limpas (5s a 25s) para clonagem de voz sem ruído
            </p>
          </div>
        </div>

        {/* Tabs: Upload vs Gravação */}
        <div className="flex items-center gap-1.5 p-1 bg-obsidian-950 border border-white/10 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-luxury-gold text-obsidian-950 shadow-glow-gold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Arquivo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('record')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'record'
                ? 'bg-luxury-gold text-obsidian-950 shadow-glow-gold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Gravar Microfone
          </button>
        </div>
      </div>

      {/* Grid: Área de Captura (Esquerda / 6 cols) & Laudo de Sanitização (Direita / 6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Coluna 1: Captura / Gravação */}
        <div className="lg:col-span-6 bg-obsidian-950 p-4 rounded-xl border border-white/10 space-y-4">
          {activeTab === 'upload' ? (
            /* Dropzone de Upload */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/15 rounded-xl p-6 text-center hover:border-luxury-gold/50 hover:bg-white/[0.02] transition-all cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".wav,.mp3,.m4a,.ogg,.flac,audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="p-3 rounded-full bg-white/5 border border-white/10 text-luxury-gold">
                <FileAudio className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">
                  Clique para selecionar ou arraste o arquivo de áudio
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Formatos aceitos: WAV, MP3, M4A, OGG (Máx. 25MB · 5s a 25s recomendado)
                </p>
              </div>
            </div>
          ) : (
            /* Área de Gravação ao Vivo */
            <div className="p-6 rounded-xl bg-black/40 border border-white/10 text-center flex flex-col items-center justify-center space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    isRecording ? 'bg-red-500 animate-ping' : 'bg-slate-600'
                  }`}
                />
                <span className="text-sm font-bold font-mono text-slate-200">
                  {isRecording ? `Gravando... 00:${recordingSeconds.toString().padStart(2, '0')}` : 'Microfone Pronto'}
                </span>
              </div>

              <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed font-sans">
                Fale naturalmente em um ambiente silencioso por 8 a 12 segundos. Leia uma frase de apresentação.
              </p>

              <button
                type="button"
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`py-2.5 px-5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                  isRecording
                    ? 'bg-red-500 text-white shadow-red-500/30 animate-pulse'
                    : 'bg-luxury-gold text-obsidian-950 hover:bg-yellow-400 shadow-glow-gold'
                }`}
              >
                <Mic className="w-4 h-4" />
                {isRecording ? 'Parar Gravação' : 'Iniciar Gravação'}
              </button>
            </div>
          )}

          {/* Player de Prévia do Áudio Carregado */}
          {audioUrl && (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
              <audio
                ref={audioPlayerRef}
                src={audioUrl}
                onEnded={handleAudioEnded}
                className="hidden"
              />
              <button
                type="button"
                onClick={togglePlay}
                className="p-2.5 rounded-lg bg-luxury-gold text-obsidian-950 font-bold hover:bg-yellow-400 transition-colors cursor-pointer shadow-glow-gold"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <div className="flex-1 text-[11px] truncate">
                <span className="font-bold text-slate-200 block truncate">
                  {analysis?.fileName || 'Amostra de Voz Gravada'}
                </span>
                <span className="text-[9px] text-slate-500 font-mono">
                  Duração: {analysis?.durationSeconds || '--'}s · {analysis?.sampleRateHz || 44100} Hz
                </span>
              </div>
              <button
                type="button"
                onClick={handleSaveToStore}
                className="py-1.5 px-3 rounded-lg bg-cyber-cyan text-obsidian-950 font-bold text-[10px] hover:bg-cyan-300 transition-colors cursor-pointer shadow-[0_0_10px_rgba(0,229,255,0.3)]"
              >
                Vincular ao DNA
              </button>
            </div>
          )}
        </div>

        {/* Coluna 2: Laudo de Sanitização Acústica */}
        <div className="lg:col-span-6 space-y-4 bg-obsidian-950 p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-luxury-gold" />
              Laudo de Sanitização Acústica
            </span>
            {analysis ? (
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                {analysis.verdict}
              </span>
            ) : (
              <span className="text-[10px] text-slate-500">Aguardando áudio</span>
            )}
          </div>

          {analysis ? (
            <div className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-slate-500 block">Ruído de Fundo (Noise Floor):</span>
                  <span className="text-cyber-cyan font-bold text-xs">
                    {analysis.estimatedNoiseFloorDb} dB
                  </span>
                  <span className="text-[9px] text-emerald-400 block mt-0.5">Silêncio Limpo</span>
                </div>

                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-slate-500 block">Pico Máximo (Headroom):</span>
                  <span className="text-luxury-gold font-bold text-xs">
                    {analysis.peakDbFs} dBFS
                  </span>
                  <span className="text-[9px] text-emerald-400 block mt-0.5">
                    {analysis.clippingDetected ? 'Atenção: Clipping' : 'Sem Saturação'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1.5 text-[10px]">
                <div className="flex justify-between text-slate-400">
                  <span>Duração Recomendada (5s - 25s):</span>
                  <span className="text-emerald-400 font-bold">
                    {analysis.durationSeconds}s ({analysis.isLengthOptimal ? 'Ideal' : 'Ajustar'})
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Qualidade Global de Clonagem:</span>
                  <span className="text-luxury-gold font-bold">{analysis.overallQuality}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Canais e Frequência:</span>
                  <span className="text-slate-300 font-mono">
                    {analysis.channels === 1 ? 'Mono' : 'Stereo'} · {analysis.sampleRateHz / 1000} kHz
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 py-6 text-center leading-relaxed">
              Carregue ou grave uma amostra vocal para inspecionar automaticamente a taxa de amostragem, ruído de fundo e nível de saturação acústica.
            </p>
          )}

          <div className="p-3 rounded-lg bg-luxury-gold/[0.05] border border-luxury-gold/20 text-[10px] text-luxury-gold space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Soberania V5 Sound Qwen-TTS / XTTS
            </span>
            <p className="text-slate-400 text-[9px] leading-relaxed font-sans">
              O modelo de clonagem vocal utiliza a amostra como prompt acústico de referência direta, mantendo o timbre, sotaque e respirações naturais sem distorção robótica.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
