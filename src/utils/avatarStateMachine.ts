/**
 * V5 Apollo Avatar - Smooth State Transition Machine (FSM)
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Máquina de Estados de Transição Suave entre Repouso e Fala:
 * 1. IDLE_REST: Repouso ativo (respiração livre, piscadas estocásticas, head tilt drift)
 * 2. PRE_SPEECH: Inalação preparatória (150-300ms, lábios entreabrem 20%, queixo alinha)
 * 3. SPEAKING: Fala ativa (visemas fonéticos sincronizados, amortecimento de respiração)
 * 4. POST_SPEECH: Conclusão do enunciado (200-450ms, exalação residual, retorno a repouso)
 * Evita o efeito "uncanny valley" de saltos bruscos entre o repouso e a fala.
 */

import { AvatarConversationState, AvatarFsmConfig } from '@/types/avatar';

export interface FsmStateDefinition {
  state: AvatarConversationState;
  label: string;
  badgeColor: string;
  borderColor: string;
  textColor: string;
  description: string;
  biologicalAction: string;
}

export const CANONICAL_FSM_STATES: Record<AvatarConversationState, FsmStateDefinition> = {
  idle_rest: {
    state: 'idle_rest',
    label: '1. Repouso (Idle Rest)',
    badgeColor: 'bg-cyan-500/15',
    borderColor: 'border-cyber-cyan/40',
    textColor: 'text-cyber-cyan',
    description: 'Estado de espera ativa com ciclo de respiração 100%, micro-movimentos e piscadas.',
    biologicalAction: 'Lábios selados (visema silêncio), respiração diafragmática contínua e deriva cervical.',
  },
  pre_speech: {
    state: 'pre_speech',
    label: '2. Início de Fala (Pre-Speech)',
    badgeColor: 'bg-amber-500/15',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-300',
    description: 'Transição preparatória de 200ms com inalação de fôlego e queixo voltado ao interlocutor.',
    biologicalAction: 'Tórax se expande rapidamente, lábios entreabrem (20%) e piscadas são suprimidas.',
  },
  speaking: {
    state: 'speaking',
    label: '3. Fala Ativa (Speaking)',
    badgeColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-500/40',
    textColor: 'text-emerald-300',
    description: 'Discurso contínuo sincronizado com o fluxo de áudio ou sintetizador V5 Sound.',
    biologicalAction: 'Articulação de visemas em alta cadência, respiração amortecida e nods de ênfase.',
  },
  post_speech: {
    state: 'post_speech',
    label: '4. Conclusão (Post-Speech)',
    badgeColor: 'bg-purple-500/15',
    borderColor: 'border-purple-500/40',
    textColor: 'text-purple-300',
    description: 'Relaxamento pós-enunciado de 300ms com retorno orgânico aos loops idle.',
    biologicalAction: 'Fechamento labial gradual, micro-assentimento de conclusão e exalação residual.',
  },
};

export const DEFAULT_FSM_CONFIG: AvatarFsmConfig = {
  preSpeechDurationMs: 220,
  postSpeechDurationMs: 320,
  breathingDampingFactor: 0.35,
  mouthBlendWeight: 0.85,
  autoReturnToIdle: true,
  isInteractive: true,
};

export interface FsmInterpolationSnapshot {
  mouthOpenRatio: number;      // 0.0 a 1.0 (abertura da boca)
  breathingDamping: number;    // 0.0 (parado) a 1.0 (respiração plena)
  headTiltWeight: number;      // 0.0 (bloqueado) a 1.0 (deriva livre)
  blinkingSuppressed: boolean; // se true, adia piscadas
  activeVisemeName: string;
}

/**
 * Retorna os valores interpolados para renderização no Canvas ou CSS
 */
export function calculateFsmInterpolation(
  state: AvatarConversationState,
  transitionProgress = 1.0
): FsmInterpolationSnapshot {
  switch (state) {
    case 'idle_rest':
      return {
        mouthOpenRatio: 0.0,
        breathingDamping: 1.0,
        headTiltWeight: 1.0,
        blinkingSuppressed: false,
        activeVisemeName: 'silence',
      };

    case 'pre_speech': {
      // Interpola suavemente de 0.0 a 0.22 de abertura
      const mouth = 0.22 * Math.sin((transitionProgress * Math.PI) / 2);
      return {
        mouthOpenRatio: Number(mouth.toFixed(3)),
        breathingDamping: 0.8,
        headTiltWeight: 0.4,
        blinkingSuppressed: true,
        activeVisemeName: 'A_I (preparatório)',
      };
    }

    case 'speaking': {
      // Na fala ativa a boca oscila entre 0.35 e 0.85 dependendo da modulação fonética
      return {
        mouthOpenRatio: 0.65,
        breathingDamping: 0.35,
        headTiltWeight: 0.3,
        blinkingSuppressed: false,
        activeVisemeName: 'visemas dinâmicos',
      };
    }

    case 'post_speech': {
      // Interpola de 0.22 de volta para 0.0
      const mouth = 0.22 * (1 - transitionProgress);
      return {
        mouthOpenRatio: Number(mouth.toFixed(3)),
        breathingDamping: 0.7,
        headTiltWeight: 0.75,
        blinkingSuppressed: false,
        activeVisemeName: 'relaxamento',
      };
    }
  }
}

/**
 * Validador das transições de estado permitidas pela FSM
 */
export function getValidNextStates(currentState: AvatarConversationState): AvatarConversationState[] {
  switch (currentState) {
    case 'idle_rest':
      return ['pre_speech', 'speaking'];
    case 'pre_speech':
      return ['speaking', 'idle_rest'];
    case 'speaking':
      return ['post_speech', 'idle_rest'];
    case 'post_speech':
      return ['idle_rest', 'pre_speech'];
  }
}

/**
 * Gera um trecho limpo de máquina de estados para integração no V5 Broadcaster / Overlays
 */
export function generateCleanFsmIntegrationSnippet(config: AvatarFsmConfig): string {
  return `/**
 * Holding V5 Apollo · Capitania #12
 * Conversational Avatar FSM Transition Controller
 */
class V5AvatarFSM {
  constructor(config = {}) {
    this.state = 'idle_rest';
    this.preDuration = ${config.preSpeechDurationMs};
    this.postDuration = ${config.postSpeechDurationMs};
    this.listeners = [];
  }

  onStateChange(fn) {
    this.listeners.push(fn);
  }

  setState(newState) {
    const oldState = this.state;
    this.state = newState;
    this.listeners.forEach(fn => fn(newState, oldState));
  }

  // Acionado na chegada de chunk de áudio ou stream TTS
  handleSpeechStart() {
    if (this.state === 'idle_rest') {
      this.setState('pre_speech');
      setTimeout(() => {
        if (this.state === 'pre_speech') {
          this.setState('speaking');
        }
      }, this.preDuration);
    } else {
      this.setState('speaking');
    }
  }

  // Acionado no final do buffer de áudio
  handleSpeechEnd() {
    if (this.state === 'speaking') {
      this.setState('post_speech');
      setTimeout(() => {
        if (this.state === 'post_speech') {
          this.setState('idle_rest');
        }
      }, this.postDuration);
    }
  }

  // Interrupção imediata (Barge-in do usuário no chat)
  handleBargeIn() {
    this.setState('idle_rest');
  }
}`;
}
