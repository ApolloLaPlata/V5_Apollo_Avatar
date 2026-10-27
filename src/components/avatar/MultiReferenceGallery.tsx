'use client';

import React, { useRef, useState } from 'react';
import { processImageFile, formatBytes } from '@/utils/imageProcessor';
import { toast } from '@/store/useToastStore';
import { 
  Star, 
  Trash2, 
  Plus, 
  Tag, 
  Check, 
  Sparkles, 
  ScanEye, 
  Layers,
  Crown,
  Loader2
} from 'lucide-react';

export interface ReferenceItem {
  id: string;
  url: string;
  angleTag: 'Frontal' | '3/4 Esquerda' | '3/4 Direita' | 'Perfil Esquerdo' | 'Perfil Direito' | 'Costas' | 'Livre';
  isPrimary: boolean;
  resolution?: string;
  sizeBytes?: number;
}

interface MultiReferenceGalleryProps {
  references: ReferenceItem[];
  onChange: (refs: ReferenceItem[]) => void;
  maxImages?: number;
}

const ANGLE_TAGS: ReferenceItem['angleTag'][] = [
  'Frontal',
  '3/4 Esquerda',
  '3/4 Direita',
  'Perfil Esquerdo',
  'Perfil Direito',
  'Costas',
  'Livre',
];

export default function MultiReferenceGallery({
  references,
  onChange,
  maxImages = 6,
}: MultiReferenceGalleryProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    if (references.length >= maxImages) {
      toast.warning('Limite Atingido', `Máximo de ${maxImages} referências por avatar.`);
      return;
    }

    setIsUploading(true);
    const newItems: ReferenceItem[] = [];

    for (let i = 0; i < files.length; i++) {
      if (references.length + newItems.length >= maxImages) break;
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      try {
        const processed = await processImageFile(file, { maxDim: 1024, quality: 0.8 });
        const isFirstEver = references.length === 0 && newItems.length === 0;

        newItems.push({
          id: `ref-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          url: processed.dataUrl,
          angleTag: isFirstEver ? 'Frontal' : 'Livre',
          isPrimary: isFirstEver,
          resolution: `${processed.width}x${processed.height}`,
          sizeBytes: processed.processedSize,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Falha ao processar arquivo.';
        toast.error('Erro na Ingestão', msg);
      }
    }

    if (newItems.length > 0) {
      onChange([...references, ...newItems]);
      toast.success(
        'Referências Adicionadas!',
        `${newItems.length} nova(s) foto(s) calibrada(s) no Canvas.`
      );
    }
    setIsUploading(false);
  };

  const setPrimary = (id: string) => {
    const updated = references.map((r) => ({
      ...r,
      isPrimary: r.id === id,
    }));
    onChange(updated);
    const chosen = updated.find((r) => r.id === id);
    toast.info('Âncora Principal Atualizada', `Foto ${chosen?.angleTag || ''} eleita como referência primária.`);
  };

  const removeReference = (id: string) => {
    const target = references.find((r) => r.id === id);
    let updated = references.filter((r) => r.id !== id);

    // If removed item was primary, promote the first remaining
    if (target?.isPrimary && updated.length > 0) {
      updated[0].isPrimary = true;
    }

    onChange(updated);
    toast.warning('Referência Removida', 'Foto retirada da galeria de DNA.');
  };

  const updateAngleTag = (id: string, tag: ReferenceItem['angleTag']) => {
    const updated = references.map((r) =>
      r.id === id ? { ...r, angleTag: tag } : r
    );
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
          <ScanEye className="w-3.5 h-3.5 text-cyber-cyan" />
          Galeria Multi-Ângulos & Âncora Principal ({references.length}/{maxImages})
        </label>
        <span className="text-[10px] font-mono text-slate-500">
          Eleja 1 Foto com Coroa como Âncora
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {references.map((item) => (
          <div
            key={item.id}
            className={`relative rounded-xl overflow-hidden border p-1.5 transition-all group ${
              item.isPrimary
                ? 'border-luxury-gold bg-luxury-gold/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'border-white/10 bg-obsidian-950/70 hover:border-white/25'
            }`}
          >
            {/* Image Preview Container */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-obsidian-900 border border-white/5">
              <img
                src={item.url}
                alt={`Referência ${item.angleTag}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Primary Crown Badge */}
              {item.isPrimary ? (
                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-luxury-gold text-obsidian-950 font-bold text-[9px] font-mono flex items-center gap-1 shadow-md">
                  <Crown className="w-3 h-3 fill-obsidian-950" />
                  ÂNCORA
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPrimary(item.id)}
                  title="Eleger como Foto Âncora Principal"
                  className="absolute top-1.5 left-1.5 p-1 rounded-md bg-obsidian-950/80 text-slate-400 hover:text-luxury-gold hover:bg-obsidian-900 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Star className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => removeReference(item.id)}
                title="Remover Referência"
                className="absolute top-1.5 right-1.5 p-1 rounded-md bg-obsidian-950/80 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Resolution Tag */}
              {item.resolution && (
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-obsidian-950/80 text-[8px] font-mono text-slate-400 border border-white/10">
                  {item.resolution}
                </span>
              )}
            </div>

            {/* Angle Selector Dropdown */}
            <div className="mt-1.5">
              <select
                value={item.angleTag}
                onChange={(e) => updateAngleTag(item.id, e.target.value as ReferenceItem['angleTag'])}
                className="w-full bg-obsidian-900 border border-white/10 rounded-md py-1 px-1.5 text-[10px] font-mono text-slate-200 focus:outline-none focus:border-cyber-cyan cursor-pointer"
              >
                {ANGLE_TAGS.map((tag) => (
                  <option key={tag} value={tag} className="bg-obsidian-950 text-slate-200">
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {/* Add Button Slot */}
        {references.length < maxImages && (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-xl border border-dashed border-white/15 hover:border-cyber-cyan/50 bg-obsidian-950/40 hover:bg-cyber-cyan/5 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer text-slate-400 hover:text-cyber-cyan group p-3"
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-cyber-cyan" />
            ) : (
              <div className="p-2 rounded-xl bg-white/5 group-hover:bg-cyber-cyan/15 group-hover:text-cyber-cyan transition-colors">
                <Plus className="w-5 h-5" />
              </div>
            )}
            <span className="text-[10px] font-mono font-bold">
              {isUploading ? 'Processando...' : '+ Foto Ângulo'}
            </span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
          }}
        />
      </div>
    </div>
  );
}
