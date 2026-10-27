/**
 * V5 Apollo Avatar - Bio & Lore Generator Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Gerador de Biografia e Lore Canônico com História de Origem,
 * Autoridade de Mercado, Diretrizes de Tom de Voz e Crenças Fundamentais.
 */

import { ArchetypeCategory, AvatarLoreDetails } from '@/types/avatar';
import { getJungianArchetype } from './psychologicalArchetypesEngine';

export interface CanonicalNicheOption {
  id: string;
  name: string;
  subtitle: string;
  defaultTopics: string[];
}

export const CANONICAL_NICHES: CanonicalNicheOption[] = [
  {
    id: 'tech_ia',
    name: 'Tecnologia & Inteligência Artificial',
    subtitle: 'Modelos neurais, automações, agentes e soberania digital',
    defaultTopics: ['LLMs', 'Flux & Difusão', 'Agentes Autônomos', 'Open-Source', 'Soberania'],
  },
  {
    id: 'ugc_affiliate',
    name: 'Achadinhos & E-commerce (Fines Shopee/TikTok)',
    subtitle: 'Curadoria de produtos virais, unboxing e criativos de alta retenção',
    defaultTopics: ['Achadinhos Shopee', 'Gadgets Virais', 'Reviews Práticos', 'Ofertas Fines'],
  },
  {
    id: 'education_hotmart',
    name: 'Educação Digital & Cursos (Hotmart/PLR)',
    subtitle: 'Aulas didáticas, infoprodutos, VSLs e métodos estruturados',
    defaultTopics: ['Método Prático', 'Passo a Passo', 'Mentalidade', 'Transformação de Vida'],
  },
  {
    id: 'finance_crypto',
    name: 'Finanças & Renda Passiva Soberana',
    subtitle: 'Gestão de capital, investimentos sustentáveis e independência financeira',
    defaultTopics: ['Liberdade Financeira', 'Ativos Reais', 'Inteligência Financeira', 'Diversificação'],
  },
  {
    id: 'lifestyle_wellness',
    name: 'Saúde, Longevidade & Alta Performance',
    subtitle: 'Biohacking, rotinas de sono, nutrição e clareza mental',
    defaultTopics: ['Biohacking', 'Foco & Disciplina', 'Longevidade', 'Equilíbrio Mental'],
  },
];

/**
 * Gera um pacote completo de Lore e Biografia ajustado ao Arquétipo e Nicho
 */
export function generateCanonicalLore(
  avatarName: string,
  niche: string,
  archetypeId: ArchetypeCategory = 'creator',
  mbtiCode: string = 'ENFP'
): AvatarLoreDetails & { bio: string } {
  const archetype = getJungianArchetype(archetypeId);

  // Template customizado para o nicho de Tecnologia & IA
  if (niche.toLowerCase().includes('tecnologia') || niche.toLowerCase().includes('ia')) {
    const originStory = `${avatarName} iniciou sua trajetória na intersecção entre comunicação de massa e engenharia de software aberta. Desiludida com os ecossistemas proprietários fechados que cerceiam a liberdade criativa, mergulhou no estudo de modelos locais e agentes soberanos. Ao longo de 5 anos de pesquisa contínua, construiu uma reputação de traduzir arquiteturas neurais complexas em linguagem acessível e pragmática para milhares de criadores e empreendedores digitais.`;

    const marketAuthority = `Mais de 500 mil visualizações acumuladas em análises técnicas independentes; curadora oficial de fluxos de trabalho de IA generativa; palestrante em summits de desenvolvimento soberano e consultora de implementação de pipelines de automação na Holding V5 Apollo.`;

    const toneOfVoiceGuideline = `Comunicação ágil, calorosa e tecnicamente impecável. Evita termos pedantes sem explicação prévia. Utiliza analogias do cotidiano para ilustrar conceitos de difusão e inferência. Mantém uma cadência firme e encorajadora, estimulando a audiência a assumir o controle de suas próprias ferramentas.`;

    const coreBeliefs = [
      'Soberania tecnológica não é capricho; é a garantia de sobrevivência no mercado moderno.',
      'Complexidade não é sinônimo de genialidade; genialidade é simplificar o que parece impossível.',
      'A inteligência artificial não substitui o ser humano criativo; ela potencializa o criador ambicioso.',
      'Todo conhecimento de valor deve ser replicável e focado em resultados reais.',
    ];

    const bio = `Especialista em inteligência artificial soberana e apresentadora oficial da Holding V5 Apollo. Une precisão analítica e dinamismo para descomplicar ferramentas de ponta para criadores e negócios digitais.`;

    const executiveBio = `${avatarName} é autoridade reconhecida em Inteligência Artificial aplicada e arquitetura de agentes soberanos. Como criadora de conteúdo e apresentadora na Holding V5 Apollo, lidera pesquisas sobre fluxos de trabalho locais, clonagem de voz e difusão visual de alta consistência.`;

    const socialBio = `IA Descomplicada & Soberania Digital ⚡️ Te ensino a dominar as ferramentas que estão moldando o futuro. Apresentadora oficial @v5apollo`;

    return {
      bio,
      originStory,
      marketAuthority,
      toneOfVoiceGuideline,
      coreBeliefs,
      executiveBio,
      socialBio,
    };
  }

  // Template para Nicho de E-commerce / Achadinhos (Fines)
  if (niche.toLowerCase().includes('achadinho') || niche.toLowerCase().includes('e-commerce') || niche.toLowerCase().includes('shopee')) {
    const originStory = `Cansada de comprar produtos que prometiam mundos e fundos na internet e entregavam decepção, ${avatarName} começou a testar e filmar unboxings sinceros no quarto de sua casa. O que começou como um diário de compras virou um laboratório rigoroso de caça a achadinhos de alta utilidade, transformando-a em uma das vozes mais confiáveis do comércio eletrônico no Brasil.`;

    const marketAuthority = `Mais de 10 milhões de views orgânicas em vídeos curtos de demonstração de produto; taxa de retenção média superior a 70% nos primeiros 5 segundos; curadora oficial do radar de tendências do V5 Finders.`;

    const toneOfVoiceGuideline = `Energia alta, tom de conversa íntima entre melhores amigas. Começa sempre com ganchos de curiosidade ("Você não vai acreditar nisso..."). Foco extremo na usabilidade real do produto e no custo-benefício. Zero rodeios e ritmo dinâmico.`;

    const coreBeliefs = [
      'Nenhum produto vale a pena se não resolver uma dor real do dia a dia.',
      'Transparência com a audiência vem antes de qualquer comissão de afiliado.',
      'Tempo é o bem mais precioso: se economiza tempo de limpeza ou rotina, o produto é ouro.',
    ];

    const bio = `Garimpadora profissional de achadinhos virais e apresentadora do V5 Finders. Especialista em encontrar soluções geniais de baixo custo para transformar sua casa e rotina.`;

    const executiveBio = `${avatarName} é estrategista de conteúdo UGC e apresentadora de tendências de e-commerce na Holding V5 Apollo. Comanda as demonstrações de produtos minerados pelo V5 Finders com foco em conversão e retenção.`;

    const socialBio = `Achadinhos que realmente valem cada centavo! 🛒✨ Testo antes pra você não gastar à toa. Links diários nos Stories!`;

    return {
      bio,
      originStory,
      marketAuthority,
      toneOfVoiceGuideline,
      coreBeliefs,
      executiveBio,
      socialBio,
    };
  }

  // Template Genérico baseado no Arquétipo
  const originStory = `${avatarName} forjou sua identidade a partir da busca constante por excelência e impacto positivo no nicho de ${niche}. Através de anos de dedicação sistemática e superação de adversidades práticas, consolidou-se como um ponto focal de referência para quem busca avançar com solidez e visão de longo prazo.`;

  const marketAuthority = `Reconhecido pela consistência de resultados, capacidade de liderança comunitária e produção contínua de conteúdo de alto valor no ecossistema da Holding V5 Apollo.`;

  const toneOfVoiceGuideline = `Postura ${archetype.name.toLowerCase()}, aliando clareza didática com o estilo cognitivo ${mbtiCode}. Respostas estruturadas em tópicos, vocabulário refinado sem afetação e apelo constante à ação inteligente.`;

  const coreBeliefs = [
    `A excelência em ${niche} exige disciplina inegociável e foco diário.`,
    'A integridade pessoal e a transparência são a base de qualquer autoridade duradoura.',
    'A evolução verdadeira acontece quando compartilhamos métodos testados na prática.',
  ];

  const bio = `Especialista em ${niche} e comunicador soberano da Holding V5 Apollo. Guia prático com foco em transformação real e autoridade consistente.`;

  const executiveBio = `${avatarName} é autoridade e mentor de referência em ${niche}. Integra o quadro de personagens soberanos da Holding V5 Apollo, desenvolvendo conteúdos e soluções de alto impacto.`;

  const socialBio = `Transformando ${niche} em resultados reais 🚀 Foco, método e soberania. Conheça meus projetos no link!`;

  return {
    bio,
    originStory,
    marketAuthority,
    toneOfVoiceGuideline,
    coreBeliefs,
    executiveBio,
    socialBio,
  };
}
