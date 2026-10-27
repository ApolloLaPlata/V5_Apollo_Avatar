'use client';

import React, { useRef, useState } from 'react';
import { processImageFile, ProcessedImageResult, formatBytes } from '@/utils/imageProcessor';
import { toast } from '@/store/useToastStore';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  Maximize2,
  Cpu
} from 'lucide-react';

interface ImageCanvasUploaderProps {
  onImageProcessed: (result: ProcessedImageResult) => void;
  currentPreviewUrl?: string | null;
  onClear?: () => void;
  maxDim?: number;
  label?: string;
  sublabel?: string;
}

export default function ImageCanvasUploader({
  onImageProcessed,
  currentPreviewUrl,
  onClear,
  maxDim = 1024,
  label = 'Imagem de Referência Facial (Face Anchor)',
  sublabel = 'Canvas HTML5: Resize proporcional maxDim 1024px e compressão JPEG 0.8',
}: ImageCanvasUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<ProcessedImageResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Formato Inválido', 'Por favor envie um arquivo de imagem (PNG, JPG, WEBP).');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await processImageFile(file, { maxDim, quality: 0.8, mimeType: 'image/jpeg' });
      setLastResult(result);
      onImageProcessed(result);
      toast.success(
        'Imagem Otimizada no Canvas!',
        `${result.width}x${result.height}px · ${formatBytes(result.originalSize)} ➔ ${formatBytes(result.processedSize)} (-${result.compressionRatio}%)`
      );
    } catch (err: any) {
      toast.error('Erro no Processamento', err?.message || 'Falha ao processar imagem.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const displayUrl = currentPreviewUrl || lastResult?.dataUrl;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
          <ImageIcon className="w-3.5 h-3.5 text-cyber-cyan" />
          {label}
        </label>
        <span className="text-[10px] font-mono text-slate-500">
          Max: {maxDim}x{maxDim}px
        </span>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[160px] overflow-hidden ${
          isDragOver
            ? 'border-cyber-cyan bg-cyber-cyan/10 shadow-glow-cyan'
            : displayUrl
            ? 'border-white/20 bg-obsidian-950/80 hover:border-cyber-cyan/50'
            : 'border-white/10 bg-obsidian-950/50 hover:border-white/30 hover:bg-white/5'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />

        {isProcessing ? (
          <div className="flex flex-col items-center gap-3 py-6 text-cyber-cyan">
            <Loader2 className="w-8 h-8 animate-spin" />
            <div className="space-y-0.5">
              <span className="text-xs font-bold font-mono">Processando no Canvas HTML5...</span>
              <p className="text-[10px] text-slate-400">Redimensionando para maxDim {maxDim}px e sanitizando JPEG</p>
            </div>
          </div>
        ) : displayUrl ? (
          <div className="relative w-full flex flex-col sm:flex-row items-center gap-4">
            {/* Image Preview Thumbnail */}
            <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-obsidian-900 shadow-md">
              <img
                src={displayUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-obsidian-950/80 text-cyber-cyan font-mono text-[9px] font-bold border border-white/10">
                {lastResult ? `${lastResult.width}x${lastResult.height}` : 'Ativo'}
              </span>
            </div>

            {/* Processing Telemetry Specs */}
            <div className="flex-1 text-left space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Otimizado para Difusão
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  JPEG 80%
                </span>
              </div>

              {lastResult && (
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                  <div>
                    <span className="text-slate-500">Tamanho: </span>
                    <strong className="text-slate-200">{formatBytes(lastResult.processedSize)}</strong>
                    <span className="text-emerald-400 ml-1">(-{lastResult.compressionRatio}%)</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Resolução: </span>
                    <strong className="text-slate-200">{lastResult.width}x{lastResult.height}px</strong>
                  </div>
                </div>
              )}

              <p className="text-[10px] text-slate-400 leading-snug">
                Clique ou arraste outra imagem para substituir a âncora facial.
              </p>
            </div>

            {/* Clear Button */}
            {onClear && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLastResult(null);
                  onClear();
                }}
                className="absolute top-0 right-0 p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                title="Remover Imagem"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4">
            <div className="p-3 rounded-2xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-200">
                Arraste uma foto ou clique para fazer upload
              </span>
              <p className="text-[11px] text-slate-400">
                {sublabel}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyber-cyan" /> 100% Processado no Navegador
              </span>
              <span>·</span>
              <span>PNG, JPG, WEBP</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
