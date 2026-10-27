/**
 * V5 Apollo Avatar — Analisador de Forma de Onda Acústica (Waveform Analyzer)
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 *
 * Extração de amostras de amplitude, detecção de silêncios/pausas fonéticas,
 * picos de intensidade e monitoramento de saturação (clipping) para a Web Audio API.
 */

export interface WaveformPoint {
  index: number;
  timeSeconds: number;
  amplitude: number; // 0.0 a 1.0 (normalizado)
  isPeak: boolean;
  isSilence: boolean;
  isClipping: boolean;
}

export interface WaveformAnalysisResult {
  durationSeconds: number;
  points: WaveformPoint[];
  silenceIntervals: Array<{ start: number; end: number }>;
  peakCount: number;
  clippingCount: number;
  averageRms: number;
}

/**
 * Gera uma forma de onda sintética de fala humana para pré-visualização quando nenhum arquivo foi carregado
 */
export function generateProceduralSpeechWaveform(
  durationSeconds: number = 8.5,
  pointCount: number = 160
): WaveformAnalysisResult {
  const safeDuration = Number.isFinite(durationSeconds) && durationSeconds > 0 ? durationSeconds : 8.5;
  const safePointCount = Number.isFinite(pointCount) && pointCount > 0 ? Math.min(Math.max(Math.round(pointCount), 10), 1000) : 160;

  const points: WaveformPoint[] = [];
  const silenceIntervals: Array<{ start: number; end: number }> = [];
  let peakCount = 0;
  let clippingCount = 0;
  let rmsSum = 0;

  for (let i = 0; i < safePointCount; i++) {
    const time = (i / safePointCount) * safeDuration;

    // Simulação fonética de sílabas com pausas respiratórias
    const syllableWave = Math.sin(i * 0.45) * 0.4 + Math.sin(i * 0.18) * 0.3;
    const noise = (Math.random() - 0.5) * 0.15;

    // Pausas intencionais nas posições ~25% e ~65%
    const isPauseZone = (i >= Math.round(safePointCount * 0.22) && i <= Math.round(safePointCount * 0.30)) ||
                        (i >= Math.round(safePointCount * 0.65) && i <= Math.round(safePointCount * 0.73));
    let amp = isPauseZone ? Math.abs(noise * 0.2) : Math.abs(syllableWave + noise);
    amp = Math.min(1.0, Math.max(0.02, amp));

    const isSilence = amp < 0.08;
    const isPeak = amp > 0.85;
    const isClipping = amp >= 0.99;

    if (isPeak) peakCount++;
    if (isClipping) clippingCount++;
    rmsSum += amp * amp;

    points.push({
      index: i,
      timeSeconds: Number(time.toFixed(2)),
      amplitude: Number(amp.toFixed(3)),
      isPeak,
      isSilence,
      isClipping,
    });
  }

  silenceIntervals.push(
    { start: Number((safeDuration * 0.22).toFixed(2)), end: Number((safeDuration * 0.30).toFixed(2)) },
    { start: Number((safeDuration * 0.65).toFixed(2)), end: Number((safeDuration * 0.73).toFixed(2)) }
  );

  return {
    durationSeconds: safeDuration,
    points,
    silenceIntervals,
    peakCount,
    clippingCount,
    averageRms: safePointCount > 0 ? Number(Math.sqrt(rmsSum / safePointCount).toFixed(3)) : 0,
  };
}
