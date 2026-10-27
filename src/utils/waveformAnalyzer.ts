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
  const points: WaveformPoint[] = [];
  const silenceIntervals: Array<{ start: number; end: number }> = [];
  let peakCount = 0;
  let clippingCount = 0;
  let rmsSum = 0;

  for (let i = 0; i < pointCount; i++) {
    const time = (i / pointCount) * durationSeconds;

    // Simulação fonética de sílabas com pausas respiratórias
    const syllableWave = Math.sin(i * 0.45) * 0.4 + Math.sin(i * 0.18) * 0.3;
    const noise = (Math.random() - 0.5) * 0.15;

    // Pausas intencionais nas posições ~25% e ~65%
    const isPauseZone = (i >= 35 && i <= 48) || (i >= 105 && i <= 118);
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

  silenceIntervals.push({ start: 1.8, end: 2.5 }, { start: 5.6, end: 6.3 });

  return {
    durationSeconds,
    points,
    silenceIntervals,
    peakCount,
    clippingCount,
    averageRms: Number(Math.sqrt(rmsSum / pointCount).toFixed(3)),
  };
}
