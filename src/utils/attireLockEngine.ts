/**
 * V5 Apollo Avatar - Attire & Color Lock Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Formal structured attire specification & prompt weight compilation
 */

export interface AttireColorSwatch {
  name: string;
  hex: string;
}

export interface AttireLockSpec {
  topGarment: string;
  topFabric: string;
  topColor: string;
  innerLayer?: string;
  bottomGarment: string;
  bottomColor: string;
  footwear: string;
  accessories?: string[];
  lockStrength: 'flexible' | 'strict' | 'maximum';
  palette: AttireColorSwatch[];
}

export const CANONICAL_ATTIRE_PRESETS: Record<string, AttireLockSpec> = {
  techwear_cyber: {
    topGarment: 'Jaqueta bomber techwear com gola estruturada e zíper metálico assimétrico',
    topFabric: 'Nylon balístico fosco anti-rasgo com forro térmico',
    topColor: 'Preto ônix (#0a0a0a) com frisos reflexivos ciano cibernético (#00e5ff)',
    innerLayer: 'Camiseta básica de algodão peruano grafite escuro',
    bottomGarment: 'Calça cargo tática slim com bolsos modulares termo-selados',
    bottomColor: 'Preto carvão profundo (#121212)',
    footwear: 'Sneakers futuristas cano baixo com solado preto fosco e detalhes em ciano',
    accessories: ['Smartwatch ultrafino com pulseira magnética de titânio escovado'],
    lockStrength: 'maximum',
    palette: [
      { name: 'Preto Ônix', hex: '#0a0a0a' },
      { name: 'Ciano Cyber', hex: '#00e5ff' },
      { name: 'Grafite', hex: '#262626' },
    ],
  },
  classic_tailoring: {
    topGarment: 'Blazer de alfaiataria corte italiano de 2 botões',
    topFabric: 'Lã fria Super 120s com textura sarja sutil',
    topColor: 'Cinza chumbo mescla (#374151)',
    innerLayer: 'Camisa social de linho puro branco sem gravata e colarinho aberto',
    bottomGarment: 'Calça de alfaiataria com vinco frontal impecável sem barra italiana',
    bottomColor: 'Cinza chumbo coordenado (#374151)',
    footwear: 'Sapatos Oxford de couro legítimo café escuro com acabamento brilhante',
    accessories: ['Óculos de armação fina redonda em titânio fosco'],
    lockStrength: 'strict',
    palette: [
      { name: 'Cinza Chumbo', hex: '#374151' },
      { name: 'Branco Linho', hex: '#f8fafc' },
      { name: 'Couro Café', hex: '#3d2314' },
    ],
  },
  casual_minimalist: {
    topGarment: 'Camisa overshirt de linho leve com mangas dobradas nos antebraços',
    topFabric: 'Linho rústico pré-lavado e respirável',
    topColor: 'Verde oliva sálvia (#556b2f)',
    innerLayer: 'Regata básica canelada branca',
    bottomGarment: 'Calça de sarja chino com corte reto moderno',
    bottomColor: 'Areia clara neutra (#d2b48c)',
    footwear: 'Tênis de couro branco minimalista com sola de borracha vulcanizada',
    accessories: ['Brincos de argola pequenos dourados discretos'],
    lockStrength: 'strict',
    palette: [
      { name: 'Verde Sálvia', hex: '#556b2f' },
      { name: 'Areia Neutra', hex: '#d2b48c' },
      { name: 'Branco Puro', hex: '#ffffff' },
    ],
  },
};

/**
 * Compiles a structured attire lock spec into an attention-weighted prompt string
 */
export function compileAttireLockPrompt(spec: AttireLockSpec): string {
  const parts: string[] = [];

  // Top piece
  let topPart = `${spec.topGarment} in ${spec.topColor}, made of ${spec.topFabric}`;
  if (spec.innerLayer) {
    topPart += ` layered over ${spec.innerLayer}`;
  }
  parts.push(topPart);

  // Bottom piece
  parts.push(`${spec.bottomGarment} in ${spec.bottomColor}`);

  // Footwear
  parts.push(`${spec.footwear}`);

  // Accessories
  if (spec.accessories && spec.accessories.length > 0) {
    parts.push(`accessories: ${spec.accessories.join(', ')}`);
  }

  // Weight modifier based on lock strength
  const baseAttire = parts.join(', ');
  if (spec.lockStrength === 'maximum') {
    return `(strict locked attire consistency across all angles: ${baseAttire}:1.35), identical fabric weaving, identical garment seams, precise color lock`;
  } else if (spec.lockStrength === 'strict') {
    return `(locked clothing consistency: ${baseAttire}:1.2), same outfit throughout all viewpoints`;
  }

  return `attire: ${baseAttire}, matching outfit`;
}
