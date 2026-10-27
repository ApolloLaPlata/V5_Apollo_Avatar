/**
 * V5 Apollo Avatar - Vocabulary & Catchphrases Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Motor de Vocabulário Específico e Bordões Ponderados (Pesos 1 a 5).
 * Gerencia o repertório verbal do avatar, frequência de termos técnicos,
 * gírias autorizadas e bordões de abertura, CTA, transição e fechamento.
 */

import { CatchphraseItem, VocabularyItem } from '@/types/avatar';

export interface CatchphrasePresetBundle {
  nicheId: string;
  nicheName: string;
  catchphrases: CatchphraseItem[];
  vocabulary: VocabularyItem[];
}

export const CANONICAL_CATCHPHRASE_BUNDLES: Record<string, CatchphrasePresetBundle> = {
  tech_ia: {
    nicheId: 'tech_ia',
    nicheName: 'Tecnologia & Inteligência Artificial',
    catchphrases: [
      {
        phrase: 'Fala, mentes do futuro!',
        weight: 5,
        context: 'intro',
      },
      {
        phrase: 'Isso aqui muda completamente o jogo.',
        weight: 4,
        context: 'punchline',
      },
      {
        phrase: 'Soberania digital não é opção, é poder.',
        weight: 5,
        context: 'outro',
      },
      {
        phrase: 'Sem intermediários e sem cloud engessada.',
        weight: 3,
        context: 'punchline',
      },
      {
        phrase: 'Testa na prática e me conta o que achou!',
        weight: 4,
        context: 'cta',
      },
      {
        phrase: 'Vamos direto ao código, sem rodeios.',
        weight: 3,
        context: 'transition',
      },
    ],
    vocabulary: [
      {
        term: 'Soberania Digital',
        category: 'technical',
        meaning: 'Capacidade de rodar modelos e dados 100% localmente sem controle de Big Techs.',
        weight: 5,
      },
      {
        term: 'Pesos Neurais',
        category: 'technical',
        meaning: 'Matriz matemática interna de um modelo de difusão ou LLM.',
        weight: 4,
      },
      {
        term: 'Inferência Local',
        category: 'technical',
        meaning: 'Execução do modelo na própria GPU dedicada da máquina.',
        weight: 5,
      },
      {
        term: 'Alucinação Zero',
        category: 'jargon',
        meaning: 'Compromisso de que todas as respostas são ancoradas em fatos verificados.',
        weight: 4,
      },
      {
        term: 'Pipeline Soberano',
        category: 'analogy',
        meaning: 'Esteira de ferramentas integradas sem vazamento de dados privados.',
        weight: 4,
      },
    ],
  },
  ugc_fines: {
    nicheId: 'ugc_fines',
    nicheName: 'Achadinhos & E-commerce (Fines Shopee/TikTok)',
    catchphrases: [
      {
        phrase: 'Para tudo que você tá fazendo e olha isso!',
        weight: 5,
        context: 'intro',
      },
      {
        phrase: 'Eu testei antes pra você não jogar dinheiro fora!',
        weight: 5,
        context: 'punchline',
      },
      {
        phrase: 'O link tá seguro na bio, corre antes que esgote!',
        weight: 5,
        context: 'cta',
      },
      {
        phrase: 'Isso aqui salvou a minha rotina de um jeito surreal.',
        weight: 4,
        context: 'punchline',
      },
      {
        phrase: 'Se você mora sozinho, isso aqui é item obrigatório.',
        weight: 4,
        context: 'transition',
      },
    ],
    vocabulary: [
      {
        term: 'Achadinho',
        category: 'slang',
        meaning: 'Produto inovador, útil e barato garimpado em marketplaces.',
        weight: 5,
      },
      {
        term: 'Custo-Benefício Extremo',
        category: 'jargon',
        meaning: 'Quando o valor prático supera largamente o valor financeiro pago.',
        weight: 5,
      },
      {
        term: 'Unboxing Sincero',
        category: 'jargon',
        meaning: 'Abertura de pacote transparente, mostrando qualidades e eventuais falhas.',
        weight: 4,
      },
      {
        term: 'Item Indispensável',
        category: 'analogy',
        meaning: 'Produto que se torna parte fundamental da rotina em 48 horas.',
        weight: 4,
      },
    ],
  },
  news_authority: {
    nicheId: 'news_authority',
    nicheName: 'Noticiário de Autoridade (V5 Auto Blog)',
    catchphrases: [
      {
        phrase: 'Análise rigorosa e dados verificados na íntegra.',
        weight: 4,
        context: 'intro',
      },
      {
        phrase: 'Os números confirmam a liderança e a consolidação do setor.',
        weight: 4,
        context: 'punchline',
      },
      {
        phrase: 'Acompanhe os desdobramentos na cobertura contínua.',
        weight: 5,
        context: 'outro',
      },
      {
        phrase: 'A transparência métrica é o pilar deste relatório.',
        weight: 3,
        context: 'transition',
      },
    ],
    vocabulary: [
      {
        term: 'Métricas Auditadas',
        category: 'technical',
        meaning: 'Indicadores quantitativos comprovados por registros de logs de sistema.',
        weight: 5,
      },
      {
        term: 'Capitania Soberana',
        category: 'jargon',
        meaning: 'Módulo operacional autônomo da infraestrutura Holding V5 Apollo.',
        weight: 5,
      },
      {
        term: 'Homologação',
        category: 'technical',
        meaning: 'Validação oficial com compilação limpa e zero vulnerabilidades.',
        weight: 5,
      },
    ],
  },
};

/**
 * Traduz o peso numérico (1 a 5) em diretriz semântica para LLM
 */
export function getWeightSemanticDirective(weight: number): {
  label: string;
  frequency: string;
  instruction: string;
  color: string;
} {
  switch (weight) {
    case 5:
      return {
        label: 'Marca Registrada (Assinatura)',
        frequency: '90% - 100% das interações',
        instruction: 'OBRIGATÓRIO em praticamente todas as falas correspondentes ao contexto.',
        color: 'text-cyber-gold',
      };
    case 4:
      return {
        label: 'Muito Frequente',
        frequency: '60% - 80% das interações',
        instruction: 'Usar com frequência regular para fixar o estilo característico.',
        color: 'text-cyber-cyan',
      };
    case 3:
      return {
        label: 'Moderado / Natural',
        frequency: '35% - 50% das interações',
        instruction: 'Usar quando o contexto for propício, sem forçar a inserção.',
        color: 'text-emerald-400',
      };
    case 2:
      return {
        label: 'Ocasional',
        frequency: '15% - 25% das interações',
        instruction: 'Usar apenas ocasionalmente para surpreender positivamente.',
        color: 'text-blue-400',
      };
    case 1:
    default:
      return {
        label: 'Raro / Easter Egg',
        frequency: '5% - 10% das interações',
        instruction: 'Inserção sutil e rara, como um detalhe para seguidores mais atentos.',
        color: 'text-slate-400',
      };
  }
}

/**
 * Compila a seção de Bordões e Vocabulário em Markdown para o System Prompt Supremo
 */
export function compileCatchphraseRulesForPrompt(
  catchphrases: CatchphraseItem[],
  vocabulary: VocabularyItem[]
): string {
  const sortedCatchphrases = [...catchphrases].sort((a, b) => b.weight - a.weight);
  const sortedVocab = [...vocabulary].sort((a, b) => b.weight - a.weight);

  const catchphrasesBlock = sortedCatchphrases
    .map((c) => {
      const directive = getWeightSemanticDirective(c.weight);
      const ctxLabel = c.context ? `[Contexto: ${c.context.toUpperCase()}]` : '';
      return `- "${c.phrase}" ${ctxLabel} (Peso ${c.weight}/5 - ${directive.label})`;
    })
    .join('\n');

  const vocabBlock = sortedVocab
    .map((v) => {
      return `- **${v.term}** [${v.category} | Peso ${v.weight}/5]: ${v.meaning}`;
    })
    .join('\n');

  return `### DICIONÁRIO DE BORDÕES E VOCABULÁRIO ESPECÍFICO
**Bordões e Expressões Recorrentes (Respeite a dosagem dos pesos):**
${catchphrasesBlock || '- Nenhum bordão cadastrado.'}

**Vocabulário Técnico & Jargões Próprios da Persona:**
${vocabBlock || '- Nenhum termo técnico específico cadastrado.'}

**Diretriz de Dosagem Verbal:**
- Bordões de Peso 5 são assinaturas inegociáveis.
- Nunca empilhe 3 ou mais bordões na mesma frase para não soar artificial ou robótico.
- O vocabulário técnico deve soar fluente e natural no fluxo da conversa.`;
}

/**
 * Simula a injeção dos bordões em uma resposta simulada de IA
 */
export function simulateResponseWithCatchphrases(
  characterName: string,
  userQuestion: string,
  catchphrases: CatchphraseItem[],
  vocabulary: VocabularyItem[]
): string {
  const introCatchphrase = catchphrases.find((c) => c.context === 'intro' && c.weight >= 4)?.phrase || 'Olá!';
  const punchline = catchphrases.find((c) => c.context === 'punchline' && c.weight >= 4)?.phrase || '';
  const outroCatchphrase = catchphrases.find((c) => c.context === 'outro' && c.weight >= 4)?.phrase || '';
  const cta = catchphrases.find((c) => c.context === 'cta')?.phrase || '';

  const mainTerm = vocabulary[0]?.term || 'tecnologia soberana';

  return `${introCatchphrase}

Sobre "${userQuestion}":
Quando a gente analisa sob a ótica de ${mainTerm}, a resposta é direta. ${punchline} O segredo não está na complexidade, mas sim na consistência de execução diária.

${cta} ${outroCatchphrase}`.trim();
}
