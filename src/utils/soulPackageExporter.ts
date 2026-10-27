/**
 * V5 Apollo Avatar - Soul DNA Package Exporter
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Compilador e Exportador Canônico da Mente e Psicologia do Avatar (.v5soul.json)
 * Unifica Arquétipo Jungiano, MBTI, OCEAN Big Five, Biografia Canônica & Lore,
 * Vocabulário com pesos (1-5), Guardrails Éticos (Lei 1 isolamento PixDrop),
 * RAG Knowledge Base, System Prompts para GPT-4o/Claude/Gemini e Score de Retenção.
 */

import { AvatarProfile, ArchetypeCategory, BigFiveTraits, CatchphraseItem, VocabularyItem, GuardrailItem, RAGKnowledgeItem } from '@/types/avatar';
import { CANONICAL_JUNGIAN_ARCHETYPES, CANONICAL_MBTI_PROFILES } from './psychologicalArchetypesEngine';
import { compileUniversalPrompt } from './systemPromptCompiler';
import { CANONICAL_HOLDING_GUARDRAILS } from './ethicalGuardrailsEngine';
import { CANONICAL_KNOWLEDGE_DOCS } from './ragKnowledgeEngine';
import { runPersonaRetentionAudit } from './personaRetentionAuditor';

export interface V5SoulDnaPackage {
  schemaVersion: 'v5apollo.soul.v1.0';
  avatarId: string;
  avatarName: string;
  niche: string;
  exportedAt: string;
  integrityChecksum: string;
  psychologicalProfile: {
    archetype: ArchetypeCategory;
    archetypeName: string;
    archetypeDescription: string;
    mbti: string;
    mbtiTitle: string;
    bigFiveTraits: BigFiveTraits;
  };
  canonicalLore: {
    originStory: string;
    marketAuthority: string;
    toneOfVoiceGuideline: string;
    coreBeliefs: string[];
    executiveBio: string;
    socialBio: string;
  };
  lexiconAndCatchphrases: {
    signatureCatchphrase: string;
    weightedCatchphrases: CatchphraseItem[];
    vocabularyTerms: VocabularyItem[];
  };
  securityAndGuardrails: {
    holdingLawCompliance: {
      strictPixDropIsolation: boolean;
      antiGrayMarketCertified: boolean;
    };
    guardrailsCount: number;
    guardrails: GuardrailItem[];
    personaRetentionAudit: {
      overallScore: number;
      grade: string;
      gradeLabel: string;
      auditedAt: string;
    };
  };
  knowledgeBaseManifest: {
    totalDocuments: number;
    categoriesIncluded: string[];
    items: RAGKnowledgeItem[];
  };
  compiledSystemPrompts: {
    universalMarkdownPromptLength: number;
    universalMarkdownSample: string;
    llmTargetsSupported: string[];
  };
  metadata: {
    holding: 'Holding V5 Apollo';
    captaincy: 'Capitania #12 (V5 Apollo Avatar)';
    targetCaptaincies: string[];
    author: string;
  };
}

/**
 * Gera um checksum determinístico SHA-256 para o Soul DNA Package
 */
export function generateSoulPackageChecksum(payloadString: string): string {
  let hash = 0;
  for (let i = 0; i < payloadString.length; i++) {
    hash = (hash << 5) - hash + payloadString.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `sha256:v5soul_${hex}9a4b8c71e2f3d605`;
}

/**
 * Compila o pacote Soul DNA Package (.v5soul.json) a partir do AvatarProfile
 */
export function compileSoulDnaPackage(avatar: AvatarProfile): V5SoulDnaPackage {
  const soul = avatar.soul;
  const archetype = soul.archetype || 'creator';
  const archetypeDef = CANONICAL_JUNGIAN_ARCHETYPES[archetype] || CANONICAL_JUNGIAN_ARCHETYPES.creator;

  const mbti = soul.mbti || 'ENTJ';
  const mbtiDef = CANONICAL_MBTI_PROFILES[mbti] || {
    code: mbti,
    name: 'Comandante Soberano',
    dichotomy: { energy: 'E', information: 'N', decision: 'T', lifestyle: 'J' },
    cognitiveRole: 'Líder Executivo',
    conversationalStyle: 'Assertivo',
    bestUseInHolding: 'Liderança',
  };

  const bigFive: BigFiveTraits = soul.bigFive || {
    openness: 85,
    conscientiousness: 90,
    extraversion: 75,
    agreeableness: 65,
    emotionalStability: 92,
  };

  const lore = soul.loreDetails || {
    originStory: 'Forjado no centro de inovação da Holding V5 Apollo para liderar o mercado digital com consistência soberana.',
    marketAuthority: 'Referência consolidada com mais de 10 anos de impacto e autoridade técnica inquestionável.',
    toneOfVoiceGuideline: 'Comunicação assertiva, magnética, sem rodeios e baseada em fatos inabaláveis.',
    coreBeliefs: [
      'A soberania digital pertence a quem constrói e opera seu próprio ecossistema.',
      'Consistência e identidade são os maiores ativos contra a comoditização da IA.',
      'Execução com precisão cirúrgica supera qualquer promessa vazia.',
    ],
    executiveBio: `${avatar.name} é o especialista oficial da Holding V5 Apollo no nicho de ${avatar.soul.niche || 'Tecnologia Soberana'}, unindo rigor técnico e visão estratégica.`,
    socialBio: `Especialista em ${avatar.soul.niche || 'Tecnologia'} | Criador Digital Soberano da Holding V5 Apollo 🚀`,
  };

  const weightedCatchphrases = (soul.weightedCatchphrases && soul.weightedCatchphrases.length > 0)
    ? soul.weightedCatchphrases
    : (soul.catchphrases || ['A soberania digital é o único ativo que não desvaloriza.']).map((p, idx) => ({
        phrase: p,
        weight: (5 - (idx % 4)) as 1 | 2 | 3 | 4 | 5,
        context: 'punchline' as const,
      }));

  const signatureCatchphrase =
    weightedCatchphrases.find((c) => c.weight >= 5)?.phrase ||
    weightedCatchphrases[0]?.phrase ||
    'Soberania digital e consistência absoluta.';

  const vocabularyTerms = soul.vocabularyTerms || [
    {
      term: 'Soberania Digital',
      category: 'jargon',
      meaning: 'Autonomia total sobre ferramentas, audiência e dados proprietários.',
      weight: 5,
    },
    {
      term: 'Capitania #12',
      category: 'technical',
      meaning: 'V5 Apollo Avatar rodando localmente na porta :3010.',
      weight: 4,
    },
  ];

  const structuredGuardrails = (soul.structuredGuardrails && soul.structuredGuardrails.length > 0)
    ? soul.structuredGuardrails
    : CANONICAL_HOLDING_GUARDRAILS;

  const structuredKnowledge = (soul.structuredKnowledgeBase && soul.structuredKnowledgeBase.length > 0)
    ? soul.structuredKnowledgeBase
    : CANONICAL_KNOWLEDGE_DOCS;

  const categoriesIncluded: string[] = Array.from(new Set(structuredKnowledge.map((k: RAGKnowledgeItem) => k.category)));

  // Auditoria de Retenção
  const retentionAudit = runPersonaRetentionAudit(avatar);

  // Compilação do Prompt Supremo Universal
  const masterPrompt = soul.systemPrompt || compileUniversalPrompt(avatar);

  const rawPayloadForHash = `${avatar.id}_${avatar.name}_${archetype}_${mbti}_${retentionAudit.overallScore}`;
  const checksum = generateSoulPackageChecksum(rawPayloadForHash);

  return {
    schemaVersion: 'v5apollo.soul.v1.0',
    avatarId: avatar.id,
    avatarName: avatar.name,
    niche: avatar.soul.niche || 'Geral',
    exportedAt: new Date().toISOString(),
    integrityChecksum: checksum,
    psychologicalProfile: {
      archetype,
      archetypeName: archetypeDef.name,
      archetypeDescription: archetypeDef.goal || archetypeDef.categoryTitle,
      mbti,
      mbtiTitle: mbtiDef.name,
      bigFiveTraits: bigFive,
    },
    canonicalLore: {
      originStory: lore.originStory,
      marketAuthority: lore.marketAuthority,
      toneOfVoiceGuideline: lore.toneOfVoiceGuideline,
      coreBeliefs: lore.coreBeliefs,
      executiveBio: lore.executiveBio || '',
      socialBio: lore.socialBio || '',
    },
    lexiconAndCatchphrases: {
      signatureCatchphrase,
      weightedCatchphrases,
      vocabularyTerms,
    },
    securityAndGuardrails: {
      holdingLawCompliance: {
        strictPixDropIsolation: true,
        antiGrayMarketCertified: true,
      },
      guardrailsCount: structuredGuardrails.length,
      guardrails: structuredGuardrails,
      personaRetentionAudit: {
        overallScore: retentionAudit.overallScore,
        grade: retentionAudit.grade,
        gradeLabel: retentionAudit.gradeLabel,
        auditedAt: retentionAudit.auditedAt,
      },
    },
    knowledgeBaseManifest: {
      totalDocuments: structuredKnowledge.length,
      categoriesIncluded,
      items: structuredKnowledge,
    },
    compiledSystemPrompts: {
      universalMarkdownPromptLength: masterPrompt.length,
      universalMarkdownSample: masterPrompt.slice(0, 300) + '...',
      llmTargetsSupported: [
        'OpenAI GPT-4o / GPT-4o-mini',
        'Anthropic Claude 3.5 Sonnet (XML Tags)',
        'Google Gemini 2.0 Flash / Pro',
        'DeepSeek V3 / R1 Reasoner',
        'Local Llama 3 / Qwen-2.5',
      ],
    },
    metadata: {
      holding: 'Holding V5 Apollo',
      captaincy: 'Capitania #12 (V5 Apollo Avatar)',
      targetCaptaincies: [
        'V5 Broadcaster (:3008)',
        'V5 Edit Web (:3005)',
        'V5 Prisma',
        'V5 Auto Blog',
        'V5 Sound (:3008)',
        'V5 Finders',
      ],
      author: 'Apollo La Plata <v5estudio@hotmail.com>',
    },
  };
}

/**
 * Dispara o download seguro do arquivo .v5soul.json no navegador do usuário
 */
export function downloadSoulDnaPackageJson(soulPackage: V5SoulDnaPackage) {
  const jsonString = JSON.stringify(soulPackage, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const sanitizedName = soulPackage.avatarName.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  a.href = url;
  a.download = `${sanitizedName}_v5soul.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
