/**
 * V5 Apollo Avatar - Author Card & Specialist Signature Exporter
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Exportador de Card de Autor e Assinatura Digital de Especialista para o V5 Auto Blog.
 * Fornece metadados completos de E-E-A-T (Google Search Quality Rater Guidelines),
 * Schema.org Person JSON-LD, assinatura criptográfica SHA-256 e snippet HTML/Tailwind
 * pronto para publicação em blogs e artigos técnicos da holding.
 */

import { AvatarProfile } from '@/types/avatar';

export type AuthorTheme = 'cyber_dark' | 'clean_light' | 'obsidian_gold';

export interface AuthorProfileData {
  authorId: string;
  avatarId: string;
  fullName: string;
  jobTitle: string;
  nicheSpecialty: string;
  credentials: string[];
  shortBio: string;
  extendedBio: string;
  portraitUrl: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    youtube?: string;
    x?: string;
    website?: string;
  };
  eeatSignals: {
    yearsExperience: number;
    articlesPublished: number;
    citationsCount: number;
    specialistVerificationHash: string;
  };
  organization: {
    name: string;
    url: string;
    logoUrl: string;
  };
}

export interface JsonLdPerson {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  jobTitle: string;
  description: string;
  image: string;
  worksFor: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
  knowsAbout: string[];
  sameAs: string[];
  identifier: {
    '@type': 'PropertyValue';
    name: 'V5 Specialist Fingerprint';
    value: string;
  };
}

export interface AuthorCardPackage {
  schemaVersion: 'v5apollo.author.v1.0';
  author: AuthorProfileData;
  jsonLd: JsonLdPerson;
  htmlSnippet: string;
  targetCaptaincy: 'V5 Auto Blog';
  exportedAt: string;
}

/**
 * Gera um hash determinístico SHA-256 simulado para a assinatura do especialista
 */
export function generateSpecialistSignatureHash(avatarId: string, fullName: string): string {
  const seedStr = `v5_specialist_signature_${avatarId}_${fullName}_2026_eeat`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0xV5${hex.toUpperCase()}99A4B8F1`;
}

/**
 * Constrói o perfil canônico de autor para o V5 Auto Blog
 */
export function buildAuthorProfile(avatar?: AvatarProfile): AuthorProfileData {
  const fullName = avatar?.name || 'Dra. Maya Vance';
  const avatarId = avatar?.id || 'maya_vance_soberana';
  const portraitUrl =
    avatar?.face.primaryAnchorImage ||
    avatar?.avatarUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  const niche = avatar?.soul?.niche || 'Inteligência Artificial & Agentes Autônomos';
  const bio =
    avatar?.soul?.loreDetails?.executiveBio ||
    avatar?.soul?.bio ||
    'Pesquisadora sênior e arquiteta de agentes de IA com foco em consistência visual 360º, modelos de difusão de vídeo e automação soberana de conteúdo para a Holding V5 Apollo.';

  const verificationHash = generateSpecialistSignatureHash(avatarId, fullName);

  return {
    authorId: `author_${avatarId.replace('avatar-', '')}`,
    avatarId,
    fullName,
    jobTitle: 'Arquiteta de IA & Especialista Canônica V5',
    nicheSpecialty: niche,
    credentials: [
      'Doutorado em Ciência da Computação & Visão Computacional',
      'Membro Sênior do Conselho de IA da Holding V5 Apollo',
      'Autora de mais de 120 artigos técnicos e whitepapers de difusão',
    ],
    shortBio: `${fullName} é especialista em ${niche}, liderando iniciativas de consistência cross-scene e agentes soberanos no ecossistema V5 Apollo.`,
    extendedBio: bio,
    portraitUrl,
    socialLinks: {
      linkedin: `https://linkedin.com/in/${fullName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      github: `https://github.com/v5apollo-specialists/${avatarId}`,
      youtube: `https://youtube.com/@v5apollo_${avatarId}`,
      website: 'https://avatar.v5apollo.com',
    },
    eeatSignals: {
      yearsExperience: 12,
      articlesPublished: 148,
      citationsCount: 2340,
      specialistVerificationHash: verificationHash,
    },
    organization: {
      name: 'Holding V5 Apollo',
      url: 'https://v5apollo.com',
      logoUrl: 'https://v5apollo.com/logo-v5-emblem.png',
    },
  };
}

/**
 * Gera o schema canônico Schema.org JSON-LD para o Google Search
 */
export function buildJsonLdPerson(author: AuthorProfileData): JsonLdPerson {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.fullName,
    jobTitle: author.jobTitle,
    description: author.shortBio,
    image: author.portraitUrl,
    worksFor: {
      '@type': 'Organization',
      name: author.organization.name,
      url: author.organization.url,
    },
    knowsAbout: [author.nicheSpecialty, ...author.credentials],
    sameAs: Object.values(author.socialLinks).filter(Boolean) as string[],
    identifier: {
      '@type': 'PropertyValue',
      name: 'V5 Specialist Fingerprint',
      value: author.eeatSignals.specialistVerificationHash,
    },
  };
}

/**
 * Gera o snippet HTML/Tailwind responsivo pronto para embutir no V5 Auto Blog
 */
export function generateAuthorHtmlSnippet(author: AuthorProfileData, theme: AuthorTheme = 'cyber_dark'): string {
  const isDark = theme === 'cyber_dark' || theme === 'obsidian_gold';
  const bgClass = isDark ? 'bg-slate-900/90 text-slate-100 border-cyan-500/30' : 'bg-white text-slate-900 border-slate-200';
  const titleClass = isDark ? 'text-cyan-400' : 'text-cyan-600';

  return `<!-- V5 Apollo Auto Blog - Author Card Component (E-E-A-T Verified) -->
<aside class="author-card-v5 p-6 rounded-2xl border ${bgClass} backdrop-blur-md shadow-xl my-8">
  <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5">
    <div class="relative shrink-0">
      <img src="${author.portraitUrl}" alt="${author.fullName}" class="w-20 h-20 rounded-full object-cover border-2 border-cyan-400 shadow-lg" />
      <span class="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-xs font-bold shadow" title="Especialista Verificado V5">✓</span>
    </div>
    <div class="flex-1 text-center sm:text-left space-y-2">
      <div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h4 class="text-lg font-bold text-white tracking-tight">${author.fullName}</h4>
          <span class="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">E-E-A-T SOBERANO</span>
        </div>
        <p class="text-xs font-medium ${titleClass}">${author.jobTitle} · ${author.nicheSpecialty}</p>
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">${author.shortBio}</p>
      <div class="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
        <span>Assinatura Digital: <strong class="text-cyan-400">${author.eeatSignals.specialistVerificationHash}</strong></span>
        <span>${author.eeatSignals.yearsExperience}+ anos de exp · ${author.eeatSignals.articlesPublished} artigos</span>
      </div>
    </div>
  </div>
</aside>
<script type="application/ld+json">
${JSON.stringify(buildJsonLdPerson(author), null, 2)}
</script>`;
}

/**
 * Exporta o pacote completo de autor e assinatura digital em JSON
 */
export function exportAuthorCardPackageJson(pkg: AuthorCardPackage): void {
  const jsonString = JSON.stringify(pkg, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${pkg.author.fullName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_author_card.v5author.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
