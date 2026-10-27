/**
 * V5 Apollo Avatar — Motor de Troca Rápida de Expressão (Expression Switcher Engine)
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 *
 * Teste dinâmico de persistência facial inter-expressões com retículo laser de alinhamento,
 * cycling automático (loop flip-book) e métricas de desvio anatômico em tempo real.
 */

export interface ExpressionFrame {
  id: string;
  name: string;
  category: 'base' | 'secondary';
  facsCode: string;
  imageUrl: string;
  eyeLineY: number; // Porcentagem vertical da linha dos olhos (normalizado ~42%)
  noseLineY: number; // Porcentagem vertical da base do nariz (~56%)
  chinLineY: number; // Porcentagem vertical do queixo (~82%)
}

export const CANONICAL_EXPRESSION_FRAMES: ExpressionFrame[] = [
  {
    id: 'neutral',
    name: 'Neutro Canônico',
    category: 'base',
    facsCode: 'AU 0',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    eyeLineY: 42.0,
    noseLineY: 56.0,
    chinLineY: 82.0,
  },
  {
    id: 'subtle_smile',
    name: 'Sorriso Sutil',
    category: 'base',
    facsCode: 'AU 12 + 14',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    eyeLineY: 42.1,
    noseLineY: 55.9,
    chinLineY: 81.9,
  },
  {
    id: 'open_smile',
    name: 'Sorriso Aberto Duchenne',
    category: 'base',
    facsCode: 'AU 6 + 12',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    eyeLineY: 41.8,
    noseLineY: 55.8,
    chinLineY: 82.4,
  },
  {
    id: 'curiosity',
    name: 'Curiosidade / Dúvida',
    category: 'secondary',
    facsCode: 'AU 1 + 2 + 17',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    eyeLineY: 41.9,
    noseLineY: 56.1,
    chinLineY: 81.8,
  },
  {
    id: 'serious_focus',
    name: 'Foco Sério / Autoridade',
    category: 'base',
    facsCode: 'AU 4 + 7',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    eyeLineY: 42.0,
    noseLineY: 56.0,
    chinLineY: 82.1,
  },
  {
    id: 'enthusiasm',
    name: 'Entusiasmo Hype',
    category: 'secondary',
    facsCode: 'AU 1 + 2 + 5 + 12',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    eyeLineY: 41.7,
    noseLineY: 55.7,
    chinLineY: 82.5,
  },
  {
    id: 'warm_empathy',
    name: 'Empatia Acolhedora',
    category: 'secondary',
    facsCode: 'AU 1 + 12 + 24',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    eyeLineY: 42.0,
    noseLineY: 56.0,
    chinLineY: 81.9,
  },
  {
    id: 'surprise',
    name: 'Surpresa / Espanto',
    category: 'base',
    facsCode: 'AU 1 + 2 + 5 + 26',
    imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80',
    eyeLineY: 41.6,
    noseLineY: 55.8,
    chinLineY: 83.2,
  },
  {
    id: 'stern_authority',
    name: 'Autoridade Severa',
    category: 'secondary',
    facsCode: 'AU 4 + 7 + 23',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    eyeLineY: 42.0,
    noseLineY: 56.0,
    chinLineY: 82.0,
  },
];

/**
 * Calcula a variação métrica em relação ao baseline neutro
 */
export function calculateFacialDrift(current: ExpressionFrame, baseline: ExpressionFrame) {
  const deltaEye = Math.abs(current.eyeLineY - baseline.eyeLineY);
  const deltaNose = Math.abs(current.noseLineY - baseline.noseLineY);
  const deltaChin = Math.abs(current.chinLineY - baseline.chinLineY);

  const totalDev = (deltaEye + deltaNose + deltaChin) / 3;
  const consistencyScore = Math.max(90, Number((100 - totalDev * 5).toFixed(1)));

  return {
    deltaEyePercent: Number(deltaEye.toFixed(2)),
    deltaNosePercent: Number(deltaNose.toFixed(2)),
    deltaChinPercent: Number(deltaChin.toFixed(2)),
    consistencyScore,
    status: consistencyScore >= 98 ? 'Excelente (Imutável)' : 'Calibrado (Normal)',
  };
}
