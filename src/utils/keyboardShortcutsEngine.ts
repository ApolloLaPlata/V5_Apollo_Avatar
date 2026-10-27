/**
 * V5 Apollo Avatar - Studio Keyboard Shortcuts Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Central de Atalhos de Teclado Globais para fluxo de trabalho de alta velocidade no estúdio.
 * Gerencia mapeamento de teclas, filtragem de foco em inputs de texto e despacho de ações.
 */

export interface ShortcutDefinition {
  id: string;
  keyCombo: string;
  displayKeys: string[];
  description: string;
  category: 'navigation' | 'viewport' | 'audio' | 'export';
  actionId: string;
}

export const STUDIO_SHORTCUTS: ShortcutDefinition[] = [
  // Categoria: Navegação & Seleção
  {
    id: 'create_avatar',
    keyCombo: 'alt+n',
    displayKeys: ['Alt', 'N'],
    description: 'Criar Novo Avatar no Registro Civil',
    category: 'navigation',
    actionId: 'OPEN_CREATE_MODAL',
  },
  {
    id: 'next_avatar',
    keyCombo: 'j',
    displayKeys: ['J', 'ou', '↓'],
    description: 'Selecionar Próximo Avatar do Catálogo',
    category: 'navigation',
    actionId: 'SELECT_NEXT_AVATAR',
  },
  {
    id: 'prev_avatar',
    keyCombo: 'k',
    displayKeys: ['K', 'ou', '↑'],
    description: 'Selecionar Avatar Anterior do Catálogo',
    category: 'navigation',
    actionId: 'SELECT_PREV_AVATAR',
  },
  {
    id: 'toggle_shortcuts',
    keyCombo: '?',
    displayKeys: ['?'],
    description: 'Abrir / Fechar Guia de Atalhos Rápidos',
    category: 'navigation',
    actionId: 'TOGGLE_SHORTCUTS_MODAL',
  },
  {
    id: 'close_modals',
    keyCombo: 'escape',
    displayKeys: ['Esc'],
    description: 'Fechar Modais e Painéis Flutuantes',
    category: 'navigation',
    actionId: 'CLOSE_ALL_MODALS',
  },

  // Categoria: Visualização & Câmera 360º
  {
    id: 'angle_front',
    keyCombo: '1',
    displayKeys: ['1'],
    description: 'Câmera: Ângulo Frontal Canônico',
    category: 'viewport',
    actionId: 'VIEW_ANGLE_FRONT',
  },
  {
    id: 'angle_34_l',
    keyCombo: '2',
    displayKeys: ['2'],
    description: 'Câmera: Ângulo 3/4 Esquerda',
    category: 'viewport',
    actionId: 'VIEW_ANGLE_34_LEFT',
  },
  {
    id: 'angle_34_r',
    keyCombo: '3',
    displayKeys: ['3'],
    description: 'Câmera: Ângulo 3/4 Direita',
    category: 'viewport',
    actionId: 'VIEW_ANGLE_34_RIGHT',
  },
  {
    id: 'angle_profile_l',
    keyCombo: '4',
    displayKeys: ['4'],
    description: 'Câmera: Perfil Esquerda (90º)',
    category: 'viewport',
    actionId: 'VIEW_ANGLE_PROFILE_LEFT',
  },
  {
    id: 'angle_profile_r',
    keyCombo: '5',
    displayKeys: ['5'],
    description: 'Câmera: Perfil Direita (90º)',
    category: 'viewport',
    actionId: 'VIEW_ANGLE_PROFILE_RIGHT',
  },
  {
    id: 'angle_back',
    keyCombo: '6',
    displayKeys: ['6'],
    description: 'Câmera: Costas (180º)',
    category: 'viewport',
    actionId: 'VIEW_ANGLE_BACK',
  },

  // Categoria: Áudio & Voz DNA
  {
    id: 'toggle_voice_audio',
    keyCombo: 'space',
    displayKeys: ['Espaço'],
    description: 'Tocar / Pausar Áudio de Amostra de Voz',
    category: 'audio',
    actionId: 'TOGGLE_AUDIO_PREVIEW',
  },

  // Categoria: Exportação & Impressão
  {
    id: 'quick_save_snapshot',
    keyCombo: 'ctrl+s',
    displayKeys: ['Ctrl', 'S'],
    description: 'Salvar Snapshot Local do Catálogo',
    category: 'export',
    actionId: 'QUICK_SAVE_SNAPSHOT',
  },
  {
    id: 'print_sheet',
    keyCombo: 'ctrl+p',
    displayKeys: ['Ctrl', 'P'],
    description: 'Imprimir Ficha Técnica A4 do Avatar Ativo',
    category: 'export',
    actionId: 'PRINT_CHARACTER_SHEET',
  },
];

/**
 * Verifica se o evento de teclado ocorreu dentro de um elemento de input editável
 */
export function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    target.isContentEditable
  );
}

/**
 * Normaliza um evento de teclado para uma string comparável (ex: "ctrl+s", "alt+n", "?")
 */
export function getEventKeyCombo(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey || e.metaKey) parts.push('ctrl');
  if (e.altKey) parts.push('alt');
  if (e.shiftKey && e.key !== '?') parts.push('shift');

  const key = e.key.toLowerCase();
  if (key === 'escape') parts.push('escape');
  else if (key === ' ') parts.push('space');
  else if (key === 'arrowdown') parts.push('arrowdown');
  else if (key === 'arrowup') parts.push('arrowup');
  else if (key === '?') parts.push('?');
  else if (!['control', 'alt', 'shift', 'meta'].includes(key)) {
    parts.push(key);
  }

  return parts.join('+');
}
