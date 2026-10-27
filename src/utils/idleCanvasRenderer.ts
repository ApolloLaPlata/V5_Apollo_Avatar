/**
 * V5 Apollo Avatar - Idle Canvas Renderer Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Renderizador de Canvas 2D em 60 FPS para o Avatar em Estado Idle.
 * Orquestra de forma unificada e hierárquica:
 * 1. Loop de respiração suave (deformação torácica Y e expansão X)
 * 2. Sistema de piscada de olho natural (fator de abertura de pálpebras 0 a 1)
 * 3. Micro-movimentos de cabeça (Head Tilts nos 3 eixos)
 * 4. Overlay de telemetria biomecânica e HUD wireframe opcional
 */

import { IdleBreathingConfig, NaturalEyeBlinkConfig, HeadTiltConfig } from '@/types/avatar';
import { calculateBreathingPhase } from './idleBreathingEngine';
import { calculateEyelidOpenFactor } from './naturalEyeBlinkEngine';
import { HeadTiltPose } from './headTiltEngine';

export interface IdleCanvasLayerToggles {
  breathing: boolean;
  blinking: boolean;
  headTilt: boolean;
  lightingGlow: boolean;
  wireframeHud: boolean;
  mirror: boolean;
}

export interface IdleRenderFrameTelemetry {
  fps: number;
  frameTimeMs: number;
  frameCount: number;
  breathingProgress: number;
  eyelidFactor: number;
  currentPose: HeadTiltPose;
}

export interface IdleCanvasSceneState {
  breathingConfig: IdleBreathingConfig;
  eyeBlinkConfig: NaturalEyeBlinkConfig;
  headTiltConfig: HeadTiltConfig;
  toggles: IdleCanvasLayerToggles;
  currentPose: HeadTiltPose;
  eyelidProgressPercent: number; // 0% a 100% (ou 100% se olhos abertos)
  avatarImage?: HTMLImageElement | null;
  avatarName: string;
}

/**
 * Renderiza um frame completo da cena Idle do avatar no contexto 2D do Canvas
 */
export function renderIdleCanvasFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: IdleCanvasSceneState,
  timestampMs: number
): void {
  // Limpa o canvas
  ctx.clearRect(0, 0, width, height);

  ctx.save();

  // Modo Espelho
  if (state.toggles.mirror) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }

  // 1. Layer Fundo: Glow e Atmosfera Cibernética
  if (state.toggles.lightingGlow) {
    const bgGrad = ctx.createRadialGradient(
      width / 2,
      height * 0.45,
      20,
      width / 2,
      height * 0.45,
      width * 0.7
    );
    bgGrad.addColorStop(0, 'rgba(0, 229, 255, 0.08)');
    bgGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.04)');
    bgGrad.addColorStop(1, 'rgba(10, 15, 29, 0)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // Cálculo da respiração
  let scaleX = 1.0;
  let scaleY = 1.0;
  let translateY = 0;

  if (state.toggles.breathing && state.breathingConfig.isActive) {
    const bPhase = calculateBreathingPhase(timestampMs, state.breathingConfig.bpm);
    const ampY = state.breathingConfig.amplitudeYPercent / 100;
    const expX = state.breathingConfig.shoulderExpansionXPercent / 100;

    scaleX = 1 + bPhase.sineNormalized * expX;
    scaleY = 1 + bPhase.sineNormalized * ampY * 0.6;
    translateY = -bPhase.sineNormalized * (ampY * 40); // translação em pixels relativos
  }

  // Ponto de Ancoragem da Respiração (Cintura/Base)
  const anchorX = width / 2;
  const anchorY = height * 0.85;

  ctx.save();
  ctx.translate(anchorX, anchorY);
  ctx.translate(0, translateY);
  ctx.scale(scaleX, scaleY);
  ctx.translate(-anchorX, -anchorY);

  // 2. Layer Corpo & Tronco
  drawAvatarTorsoAndBase(ctx, width, height, state);

  // 3. Layer Cabeça com Head Tilts
  ctx.save();
  const neckX = width / 2;
  const neckY = height * 0.42; // Centro de rotação do pescoço

  if (state.toggles.headTilt && state.headTiltConfig.isActive) {
    ctx.translate(neckX, neckY);
    // Aplicação das rotações 2D/3D aproximadas
    ctx.rotate((state.currentPose.roll * Math.PI) / 180);
    // Simula Yaw via skewX sutil e pitch via translateY sutil
    const yawSkew = (state.currentPose.yaw * Math.PI) / 180 * 0.2;
    ctx.transform(1, 0, yawSkew, 1, 0, state.currentPose.pitch * 1.5);
    ctx.translate(-neckX, -neckY);
  }

  // Desenha a Cabeça
  drawAvatarHead(ctx, width, height, state);

  // 4. Layer Olhos e Pálpebras
  drawAvatarEyes(ctx, width, height, state);

  ctx.restore(); // Restaura contexto da cabeça

  ctx.restore(); // Restaura contexto do corpo/respiração

  // 5. Layer HUD de Wireframe e Tracking Biomecânico
  if (state.toggles.wireframeHud) {
    drawBiomechanicalHudOverlay(ctx, width, height, state);
  }

  ctx.restore(); // Restaura espelho/global
}

/**
 * Desenha o tronco, ombros e base do avatar (seja imagem real ou silhueta vetorial de estúdio)
 */
function drawAvatarTorsoAndBase(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: IdleCanvasSceneState
): void {
  const cx = width / 2;

  if (state.avatarImage && state.avatarImage.complete && state.avatarImage.naturalWidth > 0) {
    // Renderiza a imagem do avatar centralizada
    const imgRatio = state.avatarImage.naturalWidth / state.avatarImage.naturalHeight;
    const targetHeight = height * 0.88;
    const targetWidth = targetHeight * imgRatio;
    const targetX = cx - targetWidth / 2;
    const targetY = height - targetHeight;

    ctx.drawImage(state.avatarImage, targetX, targetY, targetWidth, targetHeight);
    return;
  }

  // Fallback: Silhueta Procedural Anatômica Soberana
  // Base Sombra de Contato
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(cx, height * 0.94, width * 0.28, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ombros e Tronco
  const torsoGrad = ctx.createLinearGradient(0, height * 0.45, 0, height * 0.95);
  torsoGrad.addColorStop(0, '#131b2e');
  torsoGrad.addColorStop(0.6, '#0c101d');
  torsoGrad.addColorStop(1, '#070a14');

  ctx.fillStyle = torsoGrad;
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(cx - width * 0.28, height * 0.92);
  ctx.lineTo(cx - width * 0.22, height * 0.52);
  ctx.quadraticCurveTo(cx - width * 0.14, height * 0.44, cx - width * 0.06, height * 0.43);
  ctx.lineTo(cx + width * 0.06, height * 0.43);
  ctx.quadraticCurveTo(cx + width * 0.14, height * 0.44, cx + width * 0.22, height * 0.52);
  ctx.lineTo(cx + width * 0.28, height * 0.92);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Lapela e Detalhes Executivos da Holding
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(cx - width * 0.05, height * 0.44);
  ctx.lineTo(cx, height * 0.65);
  ctx.lineTo(cx + width * 0.05, height * 0.44);
  ctx.stroke();

  // Brasão Capitania #12
  ctx.fillStyle = 'rgba(0, 229, 255, 0.7)';
  ctx.beginPath();
  ctx.arc(cx - width * 0.12, height * 0.56, 4, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Desenha a cabeça, queixo, orelhas e contorno facial
 */
function drawAvatarHead(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: IdleCanvasSceneState
): void {
  // Se for imagem real carregada, a cabeça já faz parte da textura
  if (state.avatarImage && state.avatarImage.complete && state.avatarImage.naturalWidth > 0) {
    return;
  }

  const cx = width / 2;
  const cy = height * 0.30;
  const headW = width * 0.16;
  const headH = height * 0.16;

  // Pescoço
  ctx.fillStyle = '#101626';
  ctx.fillRect(cx - width * 0.05, cy + headH * 0.6, width * 0.10, height * 0.10);

  // Contorno Facial
  const faceGrad = ctx.createLinearGradient(0, cy - headH, 0, cy + headH);
  faceGrad.addColorStop(0, '#1c2438');
  faceGrad.addColorStop(1, '#111728');

  ctx.fillStyle = faceGrad;
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
  ctx.lineWidth = 1.8;

  ctx.beginPath();
  ctx.ellipse(cx, cy, headW, headH, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Cabelo / Topo da Cabeça
  ctx.fillStyle = '#080c16';
  ctx.beginPath();
  ctx.arc(cx, cy - headH * 0.3, headW * 1.05, Math.PI, Math.PI * 2);
  ctx.closePath();
  ctx.fill();

  // Nariz e Boca Sutil
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.2;
  // Nariz
  ctx.beginPath();
  ctx.moveTo(cx, cy + 2);
  ctx.lineTo(cx + 3, cy + 16);
  ctx.lineTo(cx - 3, cy + 18);
  ctx.stroke();
  // Boca neutra em repouso
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy + 32);
  ctx.lineTo(cx + 12, cy + 32);
  ctx.stroke();
}

/**
 * Desenha os olhos e as pálpebras articuladas em tempo real
 */
function drawAvatarEyes(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: IdleCanvasSceneState
): void {
  // Se for imagem real carregada, desenha uma máscara de pálpebra suave sobreposta nas coordenadas oculares
  const cx = width / 2;
  const cy = height * 0.28;
  const eyeSpacing = width * 0.075;
  const eyeRadius = Math.max(7, width * 0.022);

  // Calcula fator de abertura: 1.0 = aberto, 0.02 = fechado
  let factor = 1.0;
  if (state.toggles.blinking && state.eyeBlinkConfig.isActive) {
    factor = calculateEyelidOpenFactor(state.eyelidProgressPercent);
  }

  // Olho Esquerdo e Direito
  [-eyeSpacing, eyeSpacing].forEach((offset) => {
    const eyeX = cx + offset;
    const eyeY = cy;

    // Globo Ocular Branco
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, eyeRadius * 1.4, eyeRadius * factor, 0, 0, Math.PI * 2);
    ctx.fill();

    // Se o olho não estiver colapsado, desenha a íris
    if (factor > 0.15) {
      // Íris
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, eyeRadius * 0.85 * factor, 0, Math.PI * 2);
      ctx.fill();

      // Pupila
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, eyeRadius * 0.45 * factor, 0, Math.PI * 2);
      ctx.fill();

      // Brilho Especular
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eyeX + 2, eyeY - 2 * factor, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Linha de Cílios Superiores
    ctx.strokeStyle = '#050811';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, eyeRadius * 1.45, Math.max(1, eyeRadius * factor * 0.5), 0, Math.PI, Math.PI * 2);
    ctx.stroke();
  });
}

/**
 * Desenha o HUD de Wireframe Biomecânico e Tracking Ósseo a 60 FPS
 */
function drawBiomechanicalHudOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: IdleCanvasSceneState
): void {
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);

  const cx = width / 2;
  const cy = height * 0.30;

  // Retículo Central de Cabeça
  ctx.beginPath();
  ctx.arc(cx, cy, width * 0.18, 0, Math.PI * 2);
  ctx.stroke();

  // Linhas de Eixo (Pitch / Yaw)
  ctx.beginPath();
  ctx.moveTo(cx - 30, cy);
  ctx.lineTo(cx + 30, cy);
  ctx.moveTo(cx, cy - 30);
  ctx.lineTo(cx, cy + 30);
  ctx.stroke();

  // Nós Ósseos Principais
  const nodes = [
    { x: cx, y: cy - height * 0.12, label: 'CRÂNIO' },
    { x: cx, y: cy + height * 0.12, label: 'CERVICAL' },
    { x: cx - width * 0.18, y: height * 0.48, label: 'OMBRO_E' },
    { x: cx + width * 0.18, y: height * 0.48, label: 'OMBRO_D' },
    { x: cx, y: height * 0.62, label: 'TÓRAX' },
  ];

  ctx.setLineDash([]);
  nodes.forEach((n) => {
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(0, 229, 255, 0.8)';
    ctx.font = '8px monospace';
    ctx.fillText(n.label, n.x + 6, n.y + 3);
  });

  // Conexões Ósseas
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
  ctx.beginPath();
  ctx.moveTo(nodes[0].x, nodes[0].y);
  ctx.lineTo(nodes[1].x, nodes[1].y);
  ctx.lineTo(nodes[4].x, nodes[4].y);
  ctx.moveTo(nodes[2].x, nodes[2].y);
  ctx.lineTo(nodes[1].x, nodes[1].y);
  ctx.lineTo(nodes[3].x, nodes[3].y);
  ctx.stroke();

  ctx.restore();
}
