/**
 * CLI Runner de Validação Rigorosa de Build (Etapa 109)
 * Holding V5 Apollo · Capitania #12 · V5 Apollo Avatar (:3010)
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const nextDir = path.join(projectRoot, '.next');

console.log('===============================================================');
console.log('🚀 V5 APOLLO AVATAR - AUDITORIA RIGOROSA DE BUILD DE PRODUÇÃO');
console.log('Holding V5 Apollo · Capitania #12 · Porta Local :3010');
console.log('===============================================================\n');

if (!fs.existsSync(nextDir)) {
  console.error('❌ ERRO CRÍTICO: Pasta .next não encontrada. Execute `npm run build` primeiro.');
  process.exit(1);
}

const appBuildManifestPath = path.join(nextDir, 'app-build-manifest.json');
const prerenderManifestPath = path.join(nextDir, 'prerender-manifest.json');
const appPathRoutesPath = path.join(nextDir, 'app-path-routes-manifest.json');

if (!fs.existsSync(appBuildManifestPath) || !fs.existsSync(prerenderManifestPath)) {
  console.error('❌ ERRO CRÍTICO: Manifestos do Next.js ausentes ou corrompidos.');
  process.exit(1);
}

const appBuildManifest = JSON.parse(fs.readFileSync(appBuildManifestPath, 'utf8'));
const prerenderManifest = JSON.parse(fs.readFileSync(prerenderManifestPath, 'utf8'));
const appPathRoutes = fs.existsSync(appPathRoutesPath)
  ? JSON.parse(fs.readFileSync(appPathRoutesPath, 'utf8'))
  : {};

// Medir tamanhos dos chunks em disco (Raw e Gzip)
const chunkRawSizes = {};
const chunkGzipSizes = {};
let totalRawBytes = 0;
let totalGzipBytes = 0;
let missingChunksCount = 0;

for (const [page, chunks] of Object.entries(appBuildManifest.pages)) {
  for (const chunk of chunks) {
    if (chunkRawSizes[chunk] === undefined) {
      const fullPath = path.join(nextDir, chunk);
      if (fs.existsSync(fullPath)) {
        const rawBuf = fs.readFileSync(fullPath);
        const gzBuf = zlib.gzipSync(rawBuf);
        chunkRawSizes[chunk] = rawBuf.length;
        chunkGzipSizes[chunk] = gzBuf.length;
        totalRawBytes += rawBuf.length;
        totalGzipBytes += gzBuf.length;
      } else {
        console.warn(`⚠️ [AVISO] Chunk não encontrado em disco: ${chunk}`);
        chunkRawSizes[chunk] = 0;
        chunkGzipSizes[chunk] = 0;
        missingChunksCount++;
      }
    }
  }
}

console.log('📦 1. ROTAS IDENTIFICADAS:');
const staticRoutes = Object.keys(prerenderManifest.routes);
console.log(`   - Rotas Estáticas Pré-renderizadas (SSG): ${staticRoutes.join(', ')}`);
console.log(`   - Rotas Totais Mapeadas: ${Object.keys(appPathRoutes).length}`);

console.log('\n📊 2. AUDITORIA DE ORÇAMENTO DE REDE (FIRST LOAD JS - GZIP):');
let hasBudgetViolation = false;

for (const [pageKey, chunks] of Object.entries(appBuildManifest.pages)) {
  const pageGzipBytes = chunks.reduce((acc, c) => acc + (chunkGzipSizes[c] || 0), 0);
  const pageRawBytes = chunks.reduce((acc, c) => acc + (chunkRawSizes[c] || 0), 0);
  const pageGzipKb = (pageGzipBytes / 1024).toFixed(2);
  const pageRawKb = (pageRawBytes / 1024).toFixed(2);
  
  let budgetKb = 450; // Studio Root
  if (pageKey.includes('overlay')) budgetKb = 110;
  if (pageKey.includes('_not-found')) budgetKb = 100;
  if (pageKey === '/layout') budgetKb = 120;
  
  const passed = parseFloat(pageGzipKb) <= budgetKb;
  if (!passed) hasBudgetViolation = true;
  
  const statusIcon = passed ? '✅' : '❌';
  console.log(`   ${statusIcon} Rota [${pageKey}]: ${pageGzipKb} KB Gzip (Raw: ${pageRawKb} KB) | Limite Gzip: ${budgetKb} KB (${chunks.length} chunks)`);
}

console.log('\n🛡️ 3. VERIFICAÇÃO DE INTEGRIDADE E ARQUIVOS FÍSICOS:');
console.log(`   - Total de Chunks Únicos Verificados: ${Object.keys(chunkRawSizes).length}`);
console.log(`   - Chunks Ausentes no Disco: ${missingChunksCount}`);
console.log(`   - Volume Total de Assets no Disco (Raw): ${(totalRawBytes / 1024).toFixed(2)} KB`);
console.log(`   - Volume Total de Assets em Rede (Gzip): ${(totalGzipBytes / 1024).toFixed(2)} KB`);

if (missingChunksCount > 0 || hasBudgetViolation) {
  console.error('\n❌ BUILD REPROVADO NA AUDITORIA RIGOROSA!');
  process.exit(1);
} else {
  console.log('\n✅ BUILD 100% HOMOLOGADO E AUDITADO COM SUCESSO!');
  console.log('   Capitania #12 operacional na porta :3010 com máxima fidelidade e performance.');
  process.exit(0);
}
