/**
 * V5 Apollo Avatar - Phonetic Pangrams Catalog
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Catálogo Canônico de Pangramas e Frases de Teste Fonético para Motores TTS
 * (Qwen-TTS, XTTS-v2 e CosyVoice). Cobre sibilantes, plosivas, nasais,
 * vogais abertas/fechadas e todas as consoantes do alfabeto PT-BR e EN.
 */

import { VisemeType } from '@/types/avatar';

export type PhoneticCategory = 
  | 'complete_alphabet' 
  | 'sibilants' 
  | 'plosives' 
  | 'nasals' 
  | 'vowels' 
  | 'vibrants' 
  | 'digraphs';

export interface PhoneticPangram {
  id: string;
  title: string;
  phrase: string;
  language: 'pt-BR' | 'en-US';
  dialect: string;
  category: PhoneticCategory;
  targetPhonemes: string[];
  testedVisemes: VisemeType[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
  expectedDurationSec: number;
  audioGuidance: string;
  whyItMatters: string;
}

export const CANONICAL_PHONETIC_PANGRAMS: PhoneticPangram[] = [
  {
    id: 'pangram_pt_complete_1',
    title: 'Pangrama Completo Clássico',
    phrase: 'Um pequeno jabuti xereta viu dez cegonhas felizes sobre o gramado.',
    language: 'pt-BR',
    dialect: 'Padrão Neutro (Sudeste/Nacional)',
    category: 'complete_alphabet',
    targetPhonemes: ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'x', 'z'],
    testedVisemes: ['silence', 'A_I', 'E', 'O_U', 'MBP', 'FV', 'LDT'],
    difficulty: 'basic',
    expectedDurationSec: 3.8,
    audioGuidance: 'Verifique se as consoantes raras (j, x, z) soam naturais e sem sibilação estridente.',
    whyItMatters: 'Valida a consistência de todas as letras do alfabeto latino em uma única frase fluida.',
  },
  {
    id: 'pangram_sibilants_fricatives',
    title: 'Estresse de Sibilantes & Fricativas',
    phrase: 'Cinco ciganos e seis sábios fecharam a janela sob o forte vento da serra.',
    language: 'pt-BR',
    dialect: 'Padrão Sudeste / Sul',
    category: 'sibilants',
    targetPhonemes: ['s', 'z', 'ch', 'j', 'f', 'v', 'ç'],
    testedVisemes: ['FV', 'LDT', 'A_I', 'E'],
    difficulty: 'advanced',
    expectedDurationSec: 4.2,
    audioGuidance: 'Avalie a faixa de 4 kHz a 8 kHz. Não deve haver "chiado metálico" nem perda de dentes nos visemas.',
    whyItMatters: 'Evita problemas comuns de compressão MP3 e lisping em modelos clonados.',
  },
  {
    id: 'pangram_plosives_labials',
    title: 'Pressão de Plosivas & Labiais',
    phrase: 'Pedro pediu para o padeiro bater o bolo com trigo e polvilho na tigela.',
    language: 'pt-BR',
    dialect: 'Padrão Nacional',
    category: 'plosives',
    targetPhonemes: ['p', 'b', 't', 'd', 'k', 'g'],
    testedVisemes: ['MBP', 'LDT', 'O_U'],
    difficulty: 'intermediate',
    expectedDurationSec: 4.0,
    audioGuidance: 'Monitore popping de ar (estalo nas plosivas "p" e "b"). Os lábios devem fechar totalmente.',
    whyItMatters: 'Garante que os visemas labiais MBP tenham sincronia temporal precisa com oclusão labial.',
  },
  {
    id: 'pangram_nasals_diphthongs',
    title: 'Ressonância Nasal Brasileira',
    phrase: 'O caminhão com carvão e pão passou pelo galpão na manhã de verão.',
    language: 'pt-BR',
    dialect: 'Caipira / Interior Paulista / Centro-Oeste',
    category: 'nasals',
    targetPhonemes: ['m', 'n', 'nh', 'ão', 'õe', 'ãe'],
    testedVisemes: ['MBP', 'A_I', 'O_U'],
    difficulty: 'advanced',
    expectedDurationSec: 3.9,
    audioGuidance: 'A ressonância deve soar nasal orgânica e não anasalada de forma sintética/robótica.',
    whyItMatters: 'O português brasileiro tem forte identidade em ditongos nasais (ão, ões). Teste mandatório.',
  },
  {
    id: 'pangram_vowels_aperture',
    title: 'Amplitude Vocálica & Abertura Labial',
    phrase: 'Árvores ágeis equilibram pássaros únicos sobre os córregos límpidos.',
    language: 'pt-BR',
    dialect: 'Nordeste / Salvador / Recife',
    category: 'vowels',
    targetPhonemes: ['a', 'á', 'à', 'e', 'é', 'ê', 'i', 'o', 'ó', 'ô', 'u'],
    testedVisemes: ['A_I', 'E', 'O_U'],
    difficulty: 'intermediate',
    expectedDurationSec: 4.1,
    audioGuidance: 'Observe a alternância entre vogais abertas (á, ó) e fechadas (ê, ô) e correspondência dental.',
    whyItMatters: 'Testa a dinâmica dos visemas A_I e O_U para boca aberta realista sem deformação anatômica.',
  },
  {
    id: 'pangram_vibrants_rhotic',
    title: 'Vibrantes & Articulação Rótica',
    phrase: 'O rato roeu a rica roupa do rei de Roma na curva rápida do morro.',
    language: 'pt-BR',
    dialect: 'Rio de Janeiro / Carioca (R gutural)',
    category: 'vibrants',
    targetPhonemes: ['r', 'rr', 'r_brando', 'r_caipira'],
    testedVisemes: ['LDT', 'A_I', 'O_U'],
    difficulty: 'advanced',
    expectedDurationSec: 3.7,
    audioGuidance: 'Verifique se o "R" duplo inicial soa firme e se os "r" brandos internos mantêm o toque de língua.',
    whyItMatters: 'Permite calibrar se o avatar adota sotaque carioca gutural ou paulista alveolar.',
  },
  {
    id: 'pangram_digraphs_palatals',
    title: 'Dígrafos Palatais & Líquidas',
    phrase: 'A jovem mulher recolheu palha de milho para o ninho da velha galinha.',
    language: 'pt-BR',
    dialect: 'Padrão Sudeste / Minas Gerais',
    category: 'digraphs',
    targetPhonemes: ['lh', 'nh', 'ch', 'qu', 'gu'],
    testedVisemes: ['LDT', 'A_I', 'E'],
    difficulty: 'intermediate',
    expectedDurationSec: 4.0,
    audioGuidance: 'Articulação palatal delicada ("lh" e "nh") sem transformar milho em "mio" ou galinha em "gainha".',
    whyItMatters: 'Evita a degradação de dígrafos palatais que é crônica em modelos de síntese mal treinados.',
  },
  {
    id: 'pangram_en_us_universal',
    title: 'English Phonetic Benchmark (International)',
    phrase: 'The quick brown fox jumps over the lazy dog near the sphinx of black quartz.',
    language: 'en-US',
    dialect: 'General American (GenAm)',
    category: 'complete_alphabet',
    targetPhonemes: ['th', 'w', 'r', 'z', 'q', 'x', 'j', 'k', 'v'],
    testedVisemes: ['FV', 'LDT', 'MBP', 'A_I', 'E', 'O_U'],
    difficulty: 'basic',
    expectedDurationSec: 4.4,
    audioGuidance: 'Ideal para testar suporte bilíngue da voz clonada do avatar em vídeos internacionais.',
    whyItMatters: 'Homologa a voz para lançamentos globais da holding V5 Apollo.',
  },
];

/**
 * Calcula a cobertura fonética das frases testadas
 */
export function calculatePhoneticCoverage(testedIds: string[]): {
  coveragePercent: number;
  totalPangrams: number;
  testedCount: number;
  testedCategories: PhoneticCategory[];
  allCategoriesCovered: boolean;
  scoreLabel: string;
  scoreColor: string;
} {
  const total = CANONICAL_PHONETIC_PANGRAMS.length;
  const testedCount = testedIds.length;
  const coveragePercent = Math.min(100, Math.round((testedCount / total) * 100));

  const testedSet = new Set(testedIds);
  const coveredCats = new Set<PhoneticCategory>();

  CANONICAL_PHONETIC_PANGRAMS.forEach((p) => {
    if (testedSet.has(p.id)) {
      coveredCats.add(p.category);
    }
  });

  const categories: PhoneticCategory[] = [
    'complete_alphabet',
    'sibilants',
    'plosives',
    'nasals',
    'vowels',
    'vibrants',
    'digraphs',
  ];

  const allCategoriesCovered = categories.every((cat) => coveredCats.has(cat));

  let scoreLabel = 'Cobertura Inicial';
  let scoreColor = 'text-amber-400';

  if (coveragePercent >= 100) {
    scoreLabel = 'Homologação Fonética 100% Completa';
    scoreColor = 'text-emerald-400';
  } else if (coveragePercent >= 60) {
    scoreLabel = 'Cobertura Fonética Robusta';
    scoreColor = 'text-cyber-cyan';
  } else if (coveragePercent >= 30) {
    scoreLabel = 'Cobertura Média / Em Progresso';
    scoreColor = 'text-blue-400';
  }

  return {
    coveragePercent,
    totalPangrams: total,
    testedCount,
    testedCategories: Array.from(coveredCats),
    allCategoriesCovered,
    scoreLabel,
    scoreColor,
  };
}

/**
 * Filtra pangramas por idioma ou categoria
 */
export function filterPangrams(
  language?: 'all' | 'pt-BR' | 'en-US',
  category?: 'all' | PhoneticCategory
): PhoneticPangram[] {
  return CANONICAL_PHONETIC_PANGRAMS.filter((p) => {
    if (language && language !== 'all' && p.language !== language) return false;
    if (category && category !== 'all' && p.category !== category) return false;
    return true;
  });
}
