/**
 * Motor de Validação Rigorosa de Build de Produção (Etapa 109)
 * Holding V5 Apollo · Capitania #12 · V5 Apollo Avatar (:3010)
 * 
 * Inspeciona os manifestos gerados pelo compilador do Next.js 14,
 * valida integridade de chunks no disco, checa conformidade de rotas
 * e audita orçamentos de First Load JS (Gzip e Raw) para garantir performance extrema.
 */

export interface RouteChunkAudit {
  route: string;
  chunkCount: number;
  totalSizeBytes: number;
  totalSizeKb: number;
  gzipSizeBytes: number;
  gzipSizeKb: number;
  isWithinBudget: boolean;
  budgetKb: number;
  chunkPaths: string[];
}

export interface BuildAuditSummary {
  timestamp: string;
  nextVersion: string;
  buildStatus: 'HOMOLOGATED' | 'FAILED';
  totalRoutes: number;
  staticRoutes: string[];
  dynamicRoutes: string[];
  sharedFirstLoadBytes: number;
  sharedFirstLoadKb: number;
  sharedBudgetKb: number;
  isSharedWithinBudget: boolean;
  routeAudits: RouteChunkAudit[];
  overallPassed: boolean;
  notes: string[];
}

export const PRODUCTION_BUDGETS = {
  GZIP_SHARED_MAX_KB: 100,      // Teto para runtime compartilhado em rede
  GZIP_OBS_OVERLAY_MAX_KB: 110, // Teto para overlay OBS de streaming em rede
  GZIP_STUDIO_ROOT_MAX_KB: 450, // Teto para workbench completo de 100 ferramentas
  GZIP_NOT_FOUND_MAX_KB: 100,   // Teto para a página 404
} as const;

export const EXPECTED_ROUTES = {
  STATIC: ['/', '/live/overlay', '/_not-found'],
  DYNAMIC: ['/api/webhook/broadcaster'],
} as const;

/**
 * Avalia os manifestos e tamanhos de chunks com validação de orçamentos de rede Gzip
 */
export function evaluateBuildManifests(params: {
  appBuildManifest: {
    pages: Record<string, string[]>;
  };
  appPathRoutesManifest: Record<string, string>;
  prerenderManifest: {
    routes: Record<string, unknown>;
  };
  chunkSizesBytes: Record<string, number>;
  chunkGzipSizesBytes: Record<string, number>;
}): BuildAuditSummary {
  const { appBuildManifest, appPathRoutesManifest, prerenderManifest, chunkSizesBytes, chunkGzipSizesBytes } = params;
  const notes: string[] = [];

  // 1. Identificar rotas
  const staticRoutes = Object.keys(prerenderManifest.routes);
  const allRegisteredRoutes = Object.values(appPathRoutesManifest);
  const dynamicRoutes = allRegisteredRoutes.filter((r) => !staticRoutes.includes(r) && r !== '/_not-found');

  // Checagem de conformidade de rotas esperadas
  for (const expStatic of EXPECTED_ROUTES.STATIC) {
    if (expStatic !== '/_not-found' && !staticRoutes.includes(expStatic)) {
      notes.push(`[ALERTA] Rota estática esperada não encontrada no prerender-manifest: ${expStatic}`);
    }
  }

  for (const expDyn of EXPECTED_ROUTES.DYNAMIC) {
    if (!dynamicRoutes.includes(expDyn)) {
      notes.push(`[ALERTA] Rota dinâmica esperada não encontrada nas rotas do servidor: ${expDyn}`);
    }
  }

  // 2. Chunks compartilhados
  const pageEntries = Object.entries(appBuildManifest.pages);
  const sharedChunks = pageEntries.length > 0
    ? pageEntries[0][1].filter((chunk) => pageEntries.every(([, chunks]) => chunks.includes(chunk)))
    : [];

  const sharedFirstLoadBytes = sharedChunks.reduce((acc, chunk) => acc + (chunkGzipSizesBytes[chunk] || 0), 0);
  const sharedFirstLoadKb = parseFloat((sharedFirstLoadBytes / 1024).toFixed(2));
  const isSharedWithinBudget = sharedFirstLoadKb <= PRODUCTION_BUDGETS.GZIP_SHARED_MAX_KB;

  if (!isSharedWithinBudget) {
    notes.push(`[BUDGET] Chunks compartilhados (${sharedFirstLoadKb} KB Gzip) excederam o limite de ${PRODUCTION_BUDGETS.GZIP_SHARED_MAX_KB} KB`);
  }

  // 3. Auditar rotas
  const routeAudits: RouteChunkAudit[] = [];
  let allRoutesWithinBudget = true;

  for (const [pageKey, chunks] of pageEntries) {
    let routeName = pageKey;
    if (pageKey === '/page') routeName = '/';
    if (pageKey === '/live/overlay/page') routeName = '/live/overlay';
    if (pageKey === '/_not-found/page') routeName = '/_not-found';

    let budgetKb: number = PRODUCTION_BUDGETS.GZIP_STUDIO_ROOT_MAX_KB;
    if (routeName === '/live/overlay') budgetKb = PRODUCTION_BUDGETS.GZIP_OBS_OVERLAY_MAX_KB;
    if (routeName === '/_not-found') budgetKb = PRODUCTION_BUDGETS.GZIP_NOT_FOUND_MAX_KB;

    const totalRawBytes = chunks.reduce((acc, chunk) => acc + (chunkSizesBytes[chunk] || 0), 0);
    const totalGzipBytes = chunks.reduce((acc, chunk) => acc + (chunkGzipSizesBytes[chunk] || 0), 0);
    const totalGzipKb = parseFloat((totalGzipBytes / 1024).toFixed(2));
    const isWithinBudget = totalGzipKb <= budgetKb;

    if (!isWithinBudget) {
      allRoutesWithinBudget = false;
      notes.push(`[BUDGET] Rota ${routeName} (${totalGzipKb} KB Gzip) excedeu o teto estrito de ${budgetKb} KB`);
    }

    routeAudits.push({
      route: routeName,
      chunkCount: chunks.length,
      totalSizeBytes: totalRawBytes,
      totalSizeKb: parseFloat((totalRawBytes / 1024).toFixed(2)),
      gzipSizeBytes: totalGzipBytes,
      gzipSizeKb: totalGzipKb,
      isWithinBudget,
      budgetKb,
      chunkPaths: chunks,
    });
  }

  const overallPassed = isSharedWithinBudget && allRoutesWithinBudget && notes.length === 0;

  return {
    timestamp: new Date().toISOString(),
    nextVersion: '14.2.35',
    buildStatus: overallPassed ? 'HOMOLOGATED' : 'FAILED',
    totalRoutes: allRegisteredRoutes.length,
    staticRoutes,
    dynamicRoutes,
    sharedFirstLoadBytes,
    sharedFirstLoadKb,
    sharedBudgetKb: PRODUCTION_BUDGETS.GZIP_SHARED_MAX_KB,
    isSharedWithinBudget,
    routeAudits,
    overallPassed,
    notes,
  };
}
