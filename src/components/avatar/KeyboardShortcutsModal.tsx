'use client';

import React, { useState, useEffect } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import {
  STUDIO_SHORTCUTS,
  ShortcutDefinition,
  isEditableTarget,
  getEventKeyCombo,
} from '@/utils/keyboardShortcutsEngine';
import {
  Command,
  Keyboard,
  X,
  Search,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Layers,
  Camera,
  Mic,
  FileDown,
} from 'lucide-react';

interface KeyboardShortcutsModalProps {
  onOpenCreateModal?: () => void;
  onSelectAngle?: (angle: string) => void;
}

export default function KeyboardShortcutsModal({
  onOpenCreateModal,
  onSelectAngle,
}: KeyboardShortcutsModalProps) {
  const { avatars, selectedAvatarId, selectAvatar } = useAvatarStore();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lastExecutedAction, setLastExecutedAction] = useState<string | null>(null);

  // Listener global de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Tecla Escape sempre fecha modais
      if (e.key === 'Escape') {
        if (isOpen) {
          setIsOpen(false);
          e.preventDefault();
        }
        return;
      }

      // Tecla "?" abre/fecha o modal mesmo sem foco
      if (e.key === '?' && !isEditableTarget(e.target)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Se estiver digitando em input ou textarea, ignorar outros atalhos
      if (isEditableTarget(e.target)) return;

      const combo = getEventKeyCombo(e);

      // Ações mapeadas
      if (combo === 'alt+n') {
        e.preventDefault();
        onOpenCreateModal?.();
        triggerFeedback('Novo Avatar Aberto [Alt+N]');
      } else if (combo === 'j' || combo === 'arrowdown') {
        e.preventDefault();
        navigateAvatar(1);
      } else if (combo === 'k' || combo === 'arrowup') {
        e.preventDefault();
        navigateAvatar(-1);
      } else if (combo === '1') {
        e.preventDefault();
        onSelectAngle?.('front');
        triggerFeedback('Câmera: Frente Canônica [1]');
      } else if (combo === '2') {
        e.preventDefault();
        onSelectAngle?.('three_quarters_left');
        triggerFeedback('Câmera: 3/4 Esquerda [2]');
      } else if (combo === '3') {
        e.preventDefault();
        onSelectAngle?.('three_quarters_right');
        triggerFeedback('Câmera: 3/4 Direita [3]');
      } else if (combo === '4') {
        e.preventDefault();
        onSelectAngle?.('profile_left');
        triggerFeedback('Câmera: Perfil Esquerda [4]');
      } else if (combo === '5') {
        e.preventDefault();
        onSelectAngle?.('profile_right');
        triggerFeedback('Câmera: Perfil Direita [5]');
      } else if (combo === '6') {
        e.preventDefault();
        onSelectAngle?.('back');
        triggerFeedback('Câmera: Costas [6]');
      } else if (combo === 'ctrl+p') {
        e.preventDefault();
        window.print();
        triggerFeedback('Impressão Disparada [Ctrl+P]');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, avatars, selectedAvatarId, onOpenCreateModal, onSelectAngle]);

  const navigateAvatar = (direction: number) => {
    if (avatars.length === 0) return;
    const currentIndex = avatars.findIndex((a) => a.id === selectedAvatarId);
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = avatars.length - 1;
    if (nextIndex >= avatars.length) nextIndex = 0;

    const target = avatars[nextIndex];
    if (target) {
      selectAvatar(target.id);
      triggerFeedback(`Avatar Selecionado: ${target.name}`);
    }
  };

  const triggerFeedback = (msg: string) => {
    setLastExecutedAction(msg);
    setTimeout(() => {
      setLastExecutedAction(null);
    }, 2500);
  };

  const handleManualExecute = (actionId: string) => {
    switch (actionId) {
      case 'OPEN_CREATE_MODAL':
        setIsOpen(false);
        onOpenCreateModal?.();
        break;
      case 'SELECT_NEXT_AVATAR':
        navigateAvatar(1);
        break;
      case 'SELECT_PREV_AVATAR':
        navigateAvatar(-1);
        break;
      case 'VIEW_ANGLE_FRONT':
        onSelectAngle?.('front');
        triggerFeedback('Câmera: Frente');
        break;
      case 'VIEW_ANGLE_34_LEFT':
        onSelectAngle?.('three_quarters_left');
        triggerFeedback('Câmera: 3/4 Esquerda');
        break;
      case 'PRINT_CHARACTER_SHEET':
        window.print();
        break;
      default:
        triggerFeedback('Comando Executado');
        break;
    }
  };

  // Filtros de atalhos
  const filteredShortcuts = STUDIO_SHORTCUTS.filter((sc) => {
    if (activeCategory !== 'all' && sc.category !== activeCategory) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        sc.description.toLowerCase().includes(q) ||
        sc.keyCombo.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <>
      {/* Toast flutuante de feedback de atalho executado */}
      {lastExecutedAction && (
        <div className="fixed bottom-6 left-6 z-50 bg-obsidian-900 border border-cyber-cyan text-cyber-cyan text-xs font-mono px-4 py-2.5 rounded-xl shadow-glow-cyan flex items-center gap-2 animate-bounce">
          <Zap className="w-4 h-4 text-cyber-cyan animate-pulse" />
          <span>{lastExecutedAction}</span>
        </div>
      )}

      {/* Botão flutuante de ativação de atalhos */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-3.5 py-2 bg-obsidian-900/90 hover:bg-obsidian-850 border border-cyber-cyan/40 hover:border-cyber-cyan text-slate-200 hover:text-white rounded-xl shadow-xl backdrop-blur-md text-xs font-mono flex items-center gap-2 transition-all hover:scale-105 group"
        title="Ver Central de Atalhos (Pressione ? no teclado)"
      >
        <Keyboard className="w-4 h-4 text-cyber-cyan group-hover:animate-pulse" />
        <span className="hidden sm:inline">Atalhos</span>
        <kbd className="px-1.5 py-0.5 text-[10px] bg-black/60 border border-white/20 rounded text-cyber-cyan">
          ?
        </kbd>
      </button>

      {/* Modal Central de Atalhos */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-obsidian-900 border border-cyber-cyan/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center">
                  <Command className="w-4 h-4 text-cyber-cyan" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Central de Atalhos de Teclado Globais
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30">
                      Fase 10 · Etapa 098
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Acelere o fluxo de trabalho de criação, turnaround 360º e exportação no estúdio
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Barra de Busca e Tabs */}
            <div className="p-4 border-b border-white/10 space-y-3 bg-black/20">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar atalho ou comando (ex: câmera, avatar, print)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan font-mono"
                  autoFocus
                />
              </div>

              {/* Categorias */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'navigation', label: 'Navegação' },
                  { id: 'viewport', label: 'Câmera 360º' },
                  { id: 'audio', label: 'Áudio & Voz' },
                  { id: 'export', label: 'Exportação' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeCategory === tab.id
                        ? 'bg-cyber-cyan text-black font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Atalhos */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-white/5">
              {filteredShortcuts.map((sc) => (
                <div
                  key={sc.id}
                  className="pt-2 pb-1 flex items-center justify-between gap-4 group hover:bg-white/[0.02] px-2 rounded-lg transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 group-hover:text-cyber-cyan transition-colors">
                      {sc.description}
                    </p>
                    <span className="text-[10px] font-mono text-slate-500 capitalize">
                      Categoria: {sc.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1">
                      {sc.displayKeys.map((k, i) => (
                        <kbd
                          key={i}
                          className="px-2 py-1 text-xs font-mono font-bold bg-black/60 border border-white/20 rounded-md text-slate-200 shadow-sm"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleManualExecute(sc.actionId)}
                      className="px-2.5 py-1 text-[11px] font-mono bg-white/5 hover:bg-cyber-cyan hover:text-black text-slate-300 rounded-md transition-all flex items-center gap-1 opacity-0 group-hover:opacity-100"
                    >
                      <span>Executar</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredShortcuts.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500 font-mono">
                  Nenhum atalho encontrado para "{searchTerm}".
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Pressione <kbd className="text-cyber-cyan">Esc</kbd> para fechar</span>
              <span className="text-slate-500">Holding V5 Apollo · Capitania #12</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
