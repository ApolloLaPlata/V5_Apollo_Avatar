/**
 * V5 Apollo Avatar - RAG Knowledge Base Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Base de Conhecimento RAG (Retrieval-Augmented Generation) do Avatar.
 * Ingestão de fatos biográficos, catálogo de produtos, regras de negócio da Holding
 * e motor de busca semântica para injeção de contexto factual no System Prompt.
 */

import { RAGKnowledgeItem } from '@/types/avatar';

export const CANONICAL_KNOWLEDGE_DOCS: RAGKnowledgeItem[] = [
  {
    id: 'doc_holding_capitanias',
    title: 'Estrutura das Capitanias da Holding V5 Apollo',
    category: 'holding_rule',
    content:
      'A Holding V5 Apollo é um ecossistema de software soberano composto por Capitanias interdependentes. A Capitania #12 é o V5 Apollo Avatar (porta local :3010), a agência central de identidades civis digitais. O V5 Broadcaster e o V5 Sound operam na porta local :3008. O V5 Edit Web opera na porta local :3005. O PixDrop é estritamente segregado em domínio próprio com proibição de links cruzados.',
    tags: ['holding', 'capitanias', 'portas', 'soberania', 'arquitetura'],
    lastUpdated: '2026-10-27T04:00:00Z',
  },
  {
    id: 'doc_voice_cloning_pipeline',
    title: 'Arquitetura de Síntese Vocal V5 Sound',
    category: 'technical_faq',
    content:
      'A síntese vocal do avatar é alimentada pelo motor Qwen-TTS (latência média de inferência ~240ms, RTF 0.18x), ideal para prosódia brasileira fluida. O XTTS-v2 é empregado para narrações longas de cursos Hotmart (latência ~580ms). O CosyVoice (160ms) é roteado para transmissões ao vivo com OBS. O áudio do falante é ancorado por um embedding SHA-256 de 512 dimensões na taxa de amostragem de 44.1 kHz.',
    tags: ['voz', 'qwen-tts', 'xtts', 'cosyvoice', 'v5 sound', 'latencia'],
    lastUpdated: '2026-10-27T04:00:00Z',
  },
  {
    id: 'doc_fines_ugc_curation',
    title: 'Critérios de Curadoria de Produtos (Radar V5 Finders)',
    category: 'product_catalog',
    content:
      'Os produtos apresentados nos criativos de UGC do avatar são minerados exclusivamente pelo radar do V5 Finders. Critérios inegociáveis: nota mínima de 4.8 estrelas nas avaliações de compradores reais, entrega nacional ou expressa, e solução tangível para um problema de rotina doméstica ou tecnologia. Nunca recomendamos produtos sem teste prático.',
    tags: ['fines', 'ugc', 'achadinhos', 'shopee', 'produtos', 'curadoria'],
    lastUpdated: '2026-10-27T04:00:00Z',
  },
  {
    id: 'doc_personal_facts_maya',
    title: 'Fatos Pessoais e Trajetória de Maya Vance',
    category: 'personal_fact',
    content:
      'Maya Vance tem 26 anos, nasceu e mora em São Paulo. É apaixonada por café filtrado puro, entusiasta de distribuições Linux e passou 3 anos estudando modelos de difusão de imagem antes de se tornar apresentadora. Ela preza por conversas francas, não suporta promessas vazias de marketing e dorme no máximo 7 horas por noite para acompanhar o ritmo da holding.',
    tags: ['maya', 'biografia', 'rotina', 'gostos', 'personalidade'],
    lastUpdated: '2026-10-27T04:00:00Z',
  },
  {
    id: 'doc_transparency_affiliates',
    title: 'Política de Ética em Afiliados e Transparência',
    category: 'pricing_policy',
    content:
      'A Holding V5 Apollo e seus avatares não operam com pirâmides financeiras, apostas ou cassinos online. Todos os links de recomendação divulgados pela persona são links de afiliados legítimos e verificados de marketplaces conhecidos, com disclosure obrigatório aos seguidores nos termos das diretrizes de publicidade transparente do CONAR.',
    tags: ['transparencia', 'afiliados', 'etica', 'conar', 'links'],
    lastUpdated: '2026-10-27T04:00:00Z',
  },
];

/**
 * Motor de busca semântica / relevância de contexto RAG
 */
export function queryRAGKnowledge(
  query: string,
  docs: RAGKnowledgeItem[],
  topK: number = 2
): {
  results: { doc: RAGKnowledgeItem; score: number }[];
  compiledContext: string;
} {
  const sanitizedQuery = query.toLowerCase().replace(/[^a-z0-9áéíóúâêôãõç\s]/g, '');
  const queryTokens = sanitizedQuery.split(/\s+/).filter((t) => t.length > 2);

  if (queryTokens.length === 0) {
    return {
      results: [],
      compiledContext: 'Nenhum contexto RAG relevante identificado para esta consulta.',
    };
  }

  const scoredDocs = docs.map((doc) => {
    let score = 0;
    const docText = `${doc.title} ${doc.content} ${doc.tags.join(' ')}`.toLowerCase();

    queryTokens.forEach((token) => {
      // Correspondência exata em tags dá pontuação máxima
      if (doc.tags.some((tag) => tag.toLowerCase().includes(token))) {
        score += 35;
      }
      // Correspondência no título
      if (doc.title.toLowerCase().includes(token)) {
        score += 25;
      }
      // Correspondência no corpo do texto
      if (docText.includes(token)) {
        score += 15;
      }
    });

    const normalizedScore = Math.min(100, score);
    return { doc, score: normalizedScore };
  });

  // Ordena por maior pontuação
  const ranked = scoredDocs
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  const contextChunks = ranked.map(
    (item, idx) =>
      `[DOCUMENTO RECUPERADO ${idx + 1}: ${item.doc.title} (Relevância: ${item.score}%)]\n${item.doc.content}`
  );

  const compiledContext =
    contextChunks.length > 0
      ? `### CONTEXTO DE CONHECIMENTO RAG RECUPERADO:\n${contextChunks.join('\n\n')}`
      : 'Nenhum documento da base de conhecimento atendeu aos critérios de relevância.';

  return {
    results: ranked,
    compiledContext,
  };
}

/**
 * Compila toda a base de conhecimento estruturada para injeção global no System Prompt
 */
export function compileKnowledgeBaseIntoPrompt(docs: RAGKnowledgeItem[]): string {
  if (docs.length === 0) return '- Nenhuma base de conhecimento cadastrada.';

  return docs
    .map(
      (d) =>
        `- **[${d.category.toUpperCase()}] ${d.title}:** ${d.content}`
    )
    .join('\n\n');
}
