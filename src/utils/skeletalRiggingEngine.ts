/**
 * V5 Apollo Avatar — Motor de Articulação Óssea e Rigging (Skeletal Rigging Engine)
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 *
 * Mapeamento e exportação de coordenadas de joints esqueléticos para o V5 Broadcaster (Porta :3008),
 * compatível com padrões MediaPipe Pose e OpenPose.
 */

export interface JointPoint {
  id: string;
  name: string;
  group: 'head' | 'torso' | 'arms' | 'legs';
  x: number; // 0.0 a 1.0 (normalizado)
  y: number; // 0.0 a 1.0 (normalizado)
  confidence?: number;
}

export interface BoneLink {
  from: string;
  to: string;
  color?: string;
}

// Topologia padrão dos ossos (conexões entre articulações)
export const SKELETAL_BONES: BoneLink[] = [
  // Cabeça e Pescoço
  { from: 'nose', to: 'neck', color: '#00E5FF' },
  { from: 'left_eye', to: 'nose', color: '#00E5FF' },
  { from: 'right_eye', to: 'nose', color: '#00E5FF' },
  // Braço Esquerdo
  { from: 'neck', to: 'left_shoulder', color: '#D4AF37' },
  { from: 'left_shoulder', to: 'left_elbow', color: '#D4AF37' },
  { from: 'left_elbow', to: 'left_wrist', color: '#D4AF37' },
  // Braço Direito
  { from: 'neck', to: 'right_shoulder', color: '#D4AF37' },
  { from: 'right_shoulder', to: 'right_elbow', color: '#D4AF37' },
  { from: 'right_elbow', to: 'right_wrist', color: '#D4AF37' },
  // Coluna e Pélvis
  { from: 'neck', to: 'spine_mid', color: '#00E5FF' },
  { from: 'spine_mid', to: 'pelvis', color: '#00E5FF' },
  // Perna Esquerda
  { from: 'pelvis', to: 'left_hip', color: '#10B981' },
  { from: 'left_hip', to: 'left_knee', color: '#10B981' },
  { from: 'left_knee', to: 'left_ankle', color: '#10B981' },
  { from: 'left_ankle', to: 'left_foot', color: '#10B981' },
  // Perna Direita
  { from: 'pelvis', to: 'right_hip', color: '#10B981' },
  { from: 'right_hip', to: 'right_knee', color: '#10B981' },
  { from: 'right_knee', to: 'right_ankle', color: '#10B981' },
  { from: 'right_ankle', to: 'right_foot', color: '#10B981' },
];

// Presets canônicos de joints para T-Pose (90º)
export const T_POSE_CANONICAL_JOINTS: JointPoint[] = [
  { id: 'nose', name: 'Nariz', group: 'head', x: 0.50, y: 0.10, confidence: 0.99 },
  { id: 'left_eye', name: 'Olho Esquerdo', group: 'head', x: 0.48, y: 0.08, confidence: 0.98 },
  { id: 'right_eye', name: 'Olho Direito', group: 'head', x: 0.52, y: 0.08, confidence: 0.98 },
  { id: 'neck', name: 'Pescoço / C7', group: 'torso', x: 0.50, y: 0.16, confidence: 0.99 },
  // Braço Esquerdo (90º horizontal)
  { id: 'left_shoulder', name: 'Ombro Esquerdo', group: 'arms', x: 0.38, y: 0.19, confidence: 0.97 },
  { id: 'left_elbow', name: 'Cotovelo Esquerdo', group: 'arms', x: 0.24, y: 0.19, confidence: 0.96 },
  { id: 'left_wrist', name: 'Pulso Esquerdo', group: 'arms', x: 0.10, y: 0.19, confidence: 0.95 },
  // Braço Direito (90º horizontal)
  { id: 'right_shoulder', name: 'Ombro Direito', group: 'arms', x: 0.62, y: 0.19, confidence: 0.97 },
  { id: 'right_elbow', name: 'Cotovelo Direito', group: 'arms', x: 0.76, y: 0.19, confidence: 0.96 },
  { id: 'right_wrist', name: 'Pulso Direito', group: 'arms', x: 0.90, y: 0.19, confidence: 0.95 },
  // Coluna e Pélvis
  { id: 'spine_mid', name: 'Coluna Média / T12', group: 'torso', x: 0.50, y: 0.33, confidence: 0.98 },
  { id: 'pelvis', name: 'Pélvis / Sacro', group: 'torso', x: 0.50, y: 0.49, confidence: 0.99 },
  // Perna Esquerda
  { id: 'left_hip', name: 'Quadril Esquerdo', group: 'legs', x: 0.44, y: 0.51, confidence: 0.97 },
  { id: 'left_knee', name: 'Joelho Esquerdo', group: 'legs', x: 0.43, y: 0.73, confidence: 0.96 },
  { id: 'left_ankle', name: 'Tornozelo Esquerdo', group: 'legs', x: 0.42, y: 0.92, confidence: 0.95 },
  { id: 'left_foot', name: 'Pé Esquerdo', group: 'legs', x: 0.40, y: 0.97, confidence: 0.94 },
  // Perna Direita
  { id: 'right_hip', name: 'Quadril Direito', group: 'legs', x: 0.56, y: 0.51, confidence: 0.97 },
  { id: 'right_knee', name: 'Joelho Direito', group: 'legs', x: 0.57, y: 0.73, confidence: 0.96 },
  { id: 'right_ankle', name: 'Tornozelo Direito', group: 'legs', x: 0.58, y: 0.92, confidence: 0.95 },
  { id: 'right_foot', name: 'Pé Direito', group: 'legs', x: 0.60, y: 0.97, confidence: 0.94 },
];

// Presets canônicos para A-Pose (45º)
export const A_POSE_CANONICAL_JOINTS: JointPoint[] = T_POSE_CANONICAL_JOINTS.map((j) => {
  if (j.id === 'left_elbow') return { ...j, x: 0.28, y: 0.30 };
  if (j.id === 'left_wrist') return { ...j, x: 0.18, y: 0.42 };
  if (j.id === 'right_elbow') return { ...j, x: 0.72, y: 0.30 };
  if (j.id === 'right_wrist') return { ...j, x: 0.82, y: 0.42 };
  return j;
});

export interface BroadcasterRigPayload {
  format: 'v5_broadcaster_rig_v1';
  targetCapitania: '#07_V5_BROADCASTER';
  targetPort: 3008;
  avatarId: string;
  avatarName: string;
  posePreset: 'T-Pose' | 'A-Pose';
  scaleUnits: 'normalized_0_1';
  jointCount: number;
  joints: Record<string, { x: number; y: number; confidence: number; group: string }>;
  bones: Array<[string, string]>;
  meta: {
    generatedAt: string;
    engine: 'V5 Apollo Avatar Rigging Engine';
    isReadyForMotionCapture: boolean;
  };
}

/**
 * Converte a lista de articulações no pacote JSON canônico da Capitania Broadcaster
 */
export function buildBroadcasterRigPayload(
  avatarId: string,
  avatarName: string,
  joints: JointPoint[],
  posePreset: 'T-Pose' | 'A-Pose' = 'T-Pose'
): BroadcasterRigPayload {
  const jointsDict: Record<string, { x: number; y: number; confidence: number; group: string }> = {};

  joints.forEach((j) => {
    jointsDict[j.id] = {
      x: Number(j.x.toFixed(4)),
      y: Number(j.y.toFixed(4)),
      confidence: j.confidence ?? 0.98,
      group: j.group,
    };
  });

  return {
    format: 'v5_broadcaster_rig_v1',
    targetCapitania: '#07_V5_BROADCASTER',
    targetPort: 3008,
    avatarId,
    avatarName,
    posePreset,
    scaleUnits: 'normalized_0_1',
    jointCount: joints.length,
    joints: jointsDict,
    bones: SKELETAL_BONES.map((b) => [b.from, b.to]),
    meta: {
      generatedAt: new Date().toISOString(),
      engine: 'V5 Apollo Avatar Rigging Engine',
      isReadyForMotionCapture: true,
    },
  };
}
