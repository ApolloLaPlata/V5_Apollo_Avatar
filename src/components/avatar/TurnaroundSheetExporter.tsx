'use client';

import React, { useState } from 'react';
import { composeTurnaroundSheet } from '@/utils/turnaroundSheetComposer';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import { formatBytes } from '@/utils/imageProcessor';
import { 
  Download, 
  Layers, 
  Sparkles, 
  Check, 
  Loader2, 
  Maximize2, 
  FileCheck,
  FileDown
} from 'lucide-react';

interface TurnaroundSheetExporterProps {
  frontUrl?: string;
  threeQuarterUrl?: string;
  profileUrl?: string;
  backUrl?: string;
}

export default function TurnaroundSheetExporter({
  frontUrl,
  threeQuarterUrl,
  profileUrl,
  backUrl,
}: TurnaroundSheetExporterProps) {
  const { avatars, selectedAvatarId, updateAvatar } = useAvatarStore();
  const selectedAvatar = avatars.find((a) => a.id === selectedAvatarId);

  const fallbackUrl = selectedAvatar?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  const [isComposing, setIsComposing] = useState(false);
  const [resolution, setResolution] = useState<'standard' | 'high'>('standard');
  const [composedResult, setComposedResult] = useState<{
    dataUrl: string;
    width: number;
    height: number;
    sizeBytes: number;
  } | null>(null);

  const handleCompose = async () => {
    setIsComposing(true);
    try {
      const width = resolution === 'high' ? 4096 : 2048;
      const height = resolution === 'high' ? 1024 : 512;

      const result = await composeTurnaroundSheet(
        {
          frontUrl: frontUrl || fallbackUrl,
          threeQuarterUrl: threeQuarterUrl || fallbackUrl,
          profileUrl: profileUrl || fallbackUrl,
          backUrl: backUrl || fallbackUrl,
        },
        {
          width,
          height,
          characterName: selectedAvatar?.name || 'Avatar Soberano',
          seed: selectedAvatar?.face.diffusionSeed,
          includeGuidelines: true,
          includeMetadataBanner: true,
          mimeType: 'image/jpeg',
          quality: 0.88,
        }
      );

      setComposedResult(result);

      if (selectedAvatar) {
        updateAvatar(selectedAvatar.id, {
          face: {
            ...selectedAvatar.face,
            turnaroundSheetUrl: result.dataUrl,
          },
        });
      }

      toast.success(
        'Folha Turnaround 360º Consolidada!',
        `${result.width}x${result.height}px (${formatBytes(result.sizeBytes)}) salva no DNA do avatar.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao compor folha turnaround.';
      toast.error('Erro na Composição', msg);
    } finally {
      setIsComposing(false);
    }
  };

  const handleDownload = () => {
    if (!composedResult) return;
    const link = document.createElement('a');
    link.href = composedResult.dataUrl;
    link.download = `turnaround-360-${selectedAvatar?.name.toLowerCase().replace(/\s+/g, '-') || 'avatar'}-${composedResult.width}x${composedResult.height}.jpg`;
    link.click();
    toast.info('Download Iniciado', 'Arquivo de alta resolução transferido.');
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              Gerador de Folha Única Consolidada Turnaround (4:1)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan">
                Canvas Engine
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              Unifica os 4 cortes em uma tira horizontal padronizada para difusão contínua
            </p>
          </div>
        </div>

        {/* Resolution Selector */}
        <div className="flex items-center p-1 bg-obsidian-950 border border-white/10 rounded-xl text-[10px]">
          <button
            type="button"
            onClick={() => setResolution('standard')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              resolution === 'standard'
                ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2048 x 512 px (Padrão)
          </button>
          <button
            type="button"
            onClick={() => setResolution('high')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              resolution === 'high'
                ? 'bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4096 x 1024 px (Ultra 4K)
          </button>
        </div>
      </div>

      {/* Composed Preview Strip */}
      {composedResult ? (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-cyber-cyan/40 bg-obsidian-950 shadow-glow-cyan">
            <img
              src={composedResult.dataUrl}
              alt="Folha Turnaround Consolidada"
              className="w-full h-auto object-cover"
            />
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-obsidian-950/90 text-cyber-cyan text-[10px] font-bold border border-cyber-cyan/30">
              {composedResult.width} x {composedResult.height} px · {formatBytes(composedResult.sizeBytes)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-emerald-400 flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Folha gravada no FaceDNA do avatar ativo!
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCompose}
                disabled={isComposing}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold border border-white/10 transition-colors cursor-pointer"
              >
                Recompor
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyber-cyan text-obsidian-950 text-xs font-bold shadow-glow-cyan hover:bg-cyan-300 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar Imagem (.JPG)
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-xl bg-obsidian-950/60 border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-3">
          <div className="p-3 rounded-2xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-slate-200">
              Folha Consolidada 360º não gerada para esta sessão
            </h5>
            <p className="text-[11px] text-slate-400 max-w-md">
              Clique abaixo para compor matematicamente os 4 ângulos em um único arquivo de saída com réguas e banner de telemetria da Capitania #12.
            </p>
          </div>
          <button
            type="button"
            disabled={isComposing}
            onClick={handleCompose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-obsidian-950 font-bold text-xs shadow-glow-cyan transition-all cursor-pointer disabled:opacity-50"
          >
            {isComposing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-obsidian-950" />
                Compondo Folha no Canvas...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-obsidian-950" />
                Compor & Salvar Folha Turnaround 360º
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
