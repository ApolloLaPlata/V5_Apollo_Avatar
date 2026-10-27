/**
 * V5 Apollo Avatar — Motor da Grade 3x3 de Expressões Faciais
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 *
 * Mapeamento das 9 células da folha de contato 3x3 com calibração de rugas dinâmicas,
 * sulco nasolabial, pés de galinha perioculares e conformidade anatômica inter-quadros.
 */

export interface ExpressionGridCell {
  index: number; // 0 a 8
  gridRow: number;
  gridCol: number;
  id: string;
  name: string;
  shortLabel: string;
  facsUnits: string;
  wrinkleZones: {
    forehead: 'lisa' | 'leve' | 'acentuada';
    glabella: 'lisa' | 'moderada' | 'intensa';
    crowsFeet: 'ausente' | 'sutil' | 'definida';
    nasolabialFold: 'neutro' | 'raso' | 'profundo';
  };
  sampleImageUrl?: string;
}

export const CANONICAL_3X3_EXPRESSIONS: ExpressionGridCell[] = [
  {
    index: 0,
    gridRow: 0,
    gridCol: 0,
    id: 'neutral',
    name: '01. Neutro Calmo',
    shortLabel: 'Neutro',
    facsUnits: 'AU 0',
    wrinkleZones: { forehead: 'lisa', glabella: 'lisa', crowsFeet: 'ausente', nasolabialFold: 'neutro' },
    sampleImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    index: 1,
    gridRow: 0,
    gridCol: 1,
    id: 'subtle_smile',
    name: '02. Sorriso Sutil',
    shortLabel: 'Sutil',
    facsUnits: 'AU 12 + 14',
    wrinkleZones: { forehead: 'lisa', glabella: 'lisa', crowsFeet: 'sutil', nasolabialFold: 'raso' },
    sampleImageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  },
  {
    index: 2,
    gridRow: 0,
    gridCol: 2,
    id: 'open_smile',
    name: '03. Sorriso Aberto',
    shortLabel: 'Alegria',
    facsUnits: 'AU 6 + 12',
    wrinkleZones: { forehead: 'lisa', glabella: 'lisa', crowsFeet: 'definida', nasolabialFold: 'profundo' },
    sampleImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  },
  {
    index: 3,
    gridRow: 1,
    gridCol: 0,
    id: 'curiosity',
    name: '04. Curiosidade / Dúvida',
    shortLabel: 'Dúvida',
    facsUnits: 'AU 1 + 2 + 17',
    wrinkleZones: { forehead: 'acentuada', glabella: 'moderada', crowsFeet: 'ausente', nasolabialFold: 'neutro' },
    sampleImageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
  },
  {
    index: 4,
    gridRow: 1,
    gridCol: 1,
    id: 'serious_focus',
    name: '05. Foco Sério',
    shortLabel: 'Foco',
    facsUnits: 'AU 4 + 7',
    wrinkleZones: { forehead: 'lisa', glabella: 'intensa', crowsFeet: 'sutil', nasolabialFold: 'neutro' },
    sampleImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    index: 5,
    gridRow: 1,
    gridCol: 2,
    id: 'enthusiasm',
    name: '06. Entusiasmo Hype',
    shortLabel: 'Hype',
    facsUnits: 'AU 1 + 2 + 5 + 12',
    wrinkleZones: { forehead: 'leve', glabella: 'lisa', crowsFeet: 'definida', nasolabialFold: 'profundo' },
    sampleImageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
  },
  {
    index: 6,
    gridRow: 2,
    gridCol: 0,
    id: 'warm_empathy',
    name: '07. Empatia Acolhedora',
    shortLabel: 'Empatia',
    facsUnits: 'AU 1 + 12 + 24',
    wrinkleZones: { forehead: 'lisa', glabella: 'lisa', crowsFeet: 'sutil', nasolabialFold: 'raso' },
    sampleImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  },
  {
    index: 7,
    gridRow: 2,
    gridCol: 1,
    id: 'surprise',
    name: '08. Surpresa / Choque',
    shortLabel: 'Surpresa',
    facsUnits: 'AU 1 + 2 + 5 + 26',
    wrinkleZones: { forehead: 'acentuada', glabella: 'lisa', crowsFeet: 'ausente', nasolabialFold: 'neutro' },
    sampleImageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
  },
  {
    index: 8,
    gridRow: 2,
    gridCol: 2,
    id: 'stern_authority',
    name: '09. Autoridade Severa',
    shortLabel: 'Autoridade',
    facsUnits: 'AU 4 + 7 + 23',
    wrinkleZones: { forehead: 'lisa', glabella: 'intensa', crowsFeet: 'ausente', nasolabialFold: 'neutro' },
    sampleImageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  },
];
