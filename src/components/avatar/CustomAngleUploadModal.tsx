'use client';

import React, { useState } from 'react';
import { Avatar } from '@/types/avatar';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  X,
  Upload,
  Link as LinkIcon,
  Check,
  Camera,
  Image as ImageIcon,
  RotateCw,
} from 'lucide-react';

interface CustomAngleUploadModalProps {
  avatar: Avatar;
  isOpen: boolean;
  onClose: () => void;
  defaultAngle?: 'front' | 'threeQuarter' | 'profile' | 'back';
}

export default function CustomAngleUploadModal({
  avatar,
  isOpen,
  onClose,
  defaultAngle = 'front',
}: CustomAngleUploadModalProps) {
  const { updateAvatar } = useAvatarStore();
  const [selectedAngle, setSelectedAngle] = useState<'front' | 'threeQuarter' | 'profile' | 'back'>(defaultAngle);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [imageUrl, setImageUrl] = useState('');
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Arquivo Inválido', 'Por favor selecione um arquivo de imagem (.png, .jpg, .webp).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewSrc(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!imageUrl.trim()) {
      toast.warning('URL Vazia', 'Insira uma URL de imagem válida.');
      return;
    }
    setPreviewSrc(imageUrl.trim());
  };

  const handleSaveAngle = () => {
    const finalImage = previewSrc || imageUrl;
    if (!finalImage) {
      toast.warning('Nenhuma Imagem', 'Selecione um arquivo ou insira uma URL antes de salvar.');
      return;
    }

    setIsProcessing(true);

    try {
      const currentRefs = [...(avatar.face.referenceImages || [])];
      // Garante 4 posições no array de referências: [frente, 3/4, perfil, costas]
      while (currentRefs.length < 4) {
        currentRefs.push(avatar.avatarUrl);
      }

      let updatedPrimaryAnchor = avatar.face.primaryAnchorImage || avatar.avatarUrl;
      let angleIndex = 0;

      switch (selectedAngle) {
        case 'front':
          angleIndex = 0;
          updatedPrimaryAnchor = finalImage;
          break;
        case 'threeQuarter':
          angleIndex = 1;
          break;
        case 'profile':
          angleIndex = 2;
          break;
        case 'back':
          angleIndex = 3;
          break;
      }

      currentRefs[angleIndex] = finalImage;

      updateAvatar(avatar.id, {
        avatarUrl: selectedAngle === 'front' ? finalImage : avatar.avatarUrl,
        face: {
          ...avatar.face,
          primaryAnchorImage: updatedPrimaryAnchor,
          referenceImages: currentRefs,
        },
      });

      const angleNames = {
        front: '0° Frente',
        threeQuarter: '45° 3/4',
        profile: '90° Perfil',
        back: '180° Costas',
      };

      toast.success(
        'Ângulo Atualizado!',
        `A foto do ângulo ${angleNames[selectedAngle]} de ${avatar.name} foi salva no Face DNA.`
      );

      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error('Erro ao Salvar', msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-obsidian-950 border border-cyber-cyan/30 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        
        {/* Cabeçalho */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upload de Foto do Ângulo 360°</h3>
              <p className="text-xs text-slate-400">
                Atribua uma foto canônica para os 4 ângulos de <strong className="text-cyber-cyan">{avatar.name}</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Seletor de Ângulo Alvo */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-300 block">Selecione o Ângulo a Atualizar:</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'front', label: 'Frente', deg: '0°' },
              { id: 'threeQuarter', label: '3/4', deg: '45°' },
              { id: 'profile', label: 'Perfil', deg: '90°' },
              { id: 'back', label: 'Costas', deg: '180°' },
            ].map((angle) => (
              <button
                key={angle.id}
                type="button"
                onClick={() => setSelectedAngle(angle.id as any)}
                className={`py-2 px-2 rounded-xl border text-xs font-mono text-center transition-all ${
                  selectedAngle === angle.id
                    ? 'bg-cyber-cyan text-obsidian-950 font-bold border-cyber-cyan shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div>{angle.label}</div>
                <div className="text-[10px] opacity-75">{angle.deg}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Seletor de Modo de Upload */}
        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-white/10 rounded-xl">
          <button
            type="button"
            onClick={() => setUploadMode('file')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              uploadMode === 'file'
                ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Arquivo Local</span>
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('url')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              uploadMode === 'url'
                ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Link / URL Direta</span>
          </button>
        </div>

        {/* Input por Arquivo ou URL */}
        {uploadMode === 'file' ? (
          <div className="border-2 border-dashed border-white/20 hover:border-cyber-cyan/50 rounded-2xl p-6 text-center cursor-pointer relative bg-slate-900/40 transition-all group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-cyber-cyan/10 text-cyber-cyan group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs font-medium text-slate-200">
                Arraste uma foto ou clique para buscar no computador
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Formatos recomendados: PNG, JPG ou WEBP (Resolução mínima 512x512)
              </p>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://exemplo.com/foto-angulo.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyber-cyan"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-mono font-bold text-white transition-all"
            >
              Carregar
            </button>
          </div>
        )}

        {/* Prévia da Imagem Selecionada */}
        {previewSrc && (
          <div className="p-3 bg-slate-900/60 border border-white/10 rounded-xl flex items-center gap-3">
            <img
              src={previewSrc}
              alt="Prévia"
              className="w-16 h-20 rounded-lg object-cover border border-cyber-cyan/40"
            />
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyber-cyan">
                <Check className="w-3.5 h-3.5" />
                <span>Imagem Carregada com Sucesso</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Pronta para ser aplicada ao ângulo selecionado.
              </p>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-mono transition-all"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSaveAngle}
            disabled={!previewSrc && !imageUrl}
            className="px-5 py-2 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-obsidian-950 text-xs font-bold font-mono transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.25)]"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Salvar no Palco 360°</span>
          </button>
        </div>

      </div>
    </div>
  );
}
