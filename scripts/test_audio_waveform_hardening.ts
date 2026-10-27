import assert from "assert";
import { generateProceduralSpeechWaveform } from "../src/utils/waveformAnalyzer";
import { analyzeAudioFile } from "../src/utils/audioProcessor";

console.log("⚡ [V5 AVATAR] Iniciando testes de hardening de áudio e forma de onda...");

// Teste 1: generateProceduralSpeechWaveform com 0 ou NaN em durationSeconds
console.log("  [TEST 1] Procedural waveform com valores inválidos...");
const res1 = generateProceduralSpeechWaveform(NaN, 0);
assert(res1.points.length >= 10, "Deve gerar no mínimo 10 pontos mesmo com pointCount=0");
assert(Number.isFinite(res1.durationSeconds), "durationSeconds deve ser finita");
assert(Number.isFinite(res1.averageRms), "averageRms não pode ser NaN");
console.log("  ✅ [PASS] 1. Waveform procedural blindada contra NaN e pointCount zero");

// Teste 2: generateProceduralSpeechWaveform com duração negativa
console.log("  [TEST 2] Procedural waveform com duração negativa...");
const res2 = generateProceduralSpeechWaveform(-10, 50);
assert(res2.durationSeconds > 0, "Duração deve sofrer fallback positivo");
assert.strictEqual(res2.points.length, 50, "Deve respeitar pointCount válido");
console.log("  ✅ [PASS] 2. Duração negativa tratada com sucesso");

// Teste 3: analyzeAudioFile no ambiente SSR (window === undefined)
console.log("  [TEST 3] analyzeAudioFile em SSR...");
const mockFile = { name: "test_voice.wav" } as any;
analyzeAudioFile(mockFile).then((report) => {
  assert.strictEqual(report.fileName, "test_voice.wav");
  assert.strictEqual(report.verdict, "Aprovado para V5 Sound");
  console.log("  ✅ [PASS] 3. analyzeAudioFile seguro em SSR");
  
  // Teste 4: analyzeAudioFile com arquivo nulo
  console.log("  [TEST 4] analyzeAudioFile com input nulo...");
  analyzeAudioFile(null as any).catch((err) => {
    assert(err.message.includes("Nenhum arquivo"), "Deve rejeitar arquivo nulo com mensagem clara");
    console.log("  ✅ [PASS] 4. Rejeição de input nulo validada");

    console.log("\n==================================================");
    console.log("🏆 [V5 AVATAR] TODOS OS 4 TESTES DE ÁUDIO APROVADOS (100%)!");
    console.log("==================================================");
  });
});
