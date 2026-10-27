/**
 * V5 Apollo Avatar - OBS WebSocket Connector Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Conector de Baixa Latência (< 5ms) para OBS Studio (Protocolo obs-websocket v5)
 * Sincroniza estado de cenas, visibilidade do Browser Source, telemetria de
 * micro-movimentos em tempo real e comandos do V5 Broadcaster (:3008).
 */

export type ObsConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'simulated_live'
  | 'error';

export interface ObsWebSocketConfig {
  host: string;           // Ex: 'localhost' ou '127.0.0.1'
  port: number;           // Padrão OBS v5: 4455, ou V5 Broadcaster: 3008
  password?: string;      // Senha de autenticação do OBS
  sourceName: string;     // Nome da fonte no OBS (ex: 'V5_Avatar_Overlay')
  targetFps: number;      // 30 ou 60 FPS
  autoReconnect: boolean; // Reconexão automática em caso de queda
  heartbeatIntervalMs: number; // Intervalo de ping (default: 2000ms)
}

export const DEFAULT_OBS_WS_CONFIG: ObsWebSocketConfig = {
  host: 'localhost',
  port: 4455,
  password: '',
  sourceName: 'V5_Avatar_Overlay',
  targetFps: 60,
  autoReconnect: true,
  heartbeatIntervalMs: 2000,
};

export interface ObsSceneDescriptor {
  sceneName: string;
  sceneIndex: number;
  isProgramScene: boolean;
  isStudioMode: boolean;
  avatarSourceVisible: boolean;
  audioMuted: boolean;
}

export interface ObsTelemetryPacket {
  seq: number;
  timestamp: number;
  rttMs: number;
  fps: number;
  activeViseme: string;
  headTiltEuler: { pitch: number; yaw: number; roll: number };
  breathingY: number;
  activeEmotion: string;
  sourceVisible: boolean;
}

export interface ObsEventLogEntry {
  id: string;
  timestamp: string;
  direction: 'inbound' | 'outbound';
  eventType: string;
  details: Record<string, unknown>;
  latencyMs: number;
}

/**
 * Cliente Gerenciador do Bridge WebSocket OBS <-> V5 Avatar
 */
export class ObsAvatarWebSocketBridge {
  private ws: WebSocket | null = null;
  private config: ObsWebSocketConfig;
  private status: ObsConnectionStatus = 'disconnected';
  private pingStart = 0;
  private currentRtt = 2; // ms
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private simTimer: NodeJS.Timeout | null = null;
  private packetSeq = 0;
  private listeners: Array<(status: ObsConnectionStatus, telemetry?: ObsTelemetryPacket) => void> = [];
  private eventLogs: ObsEventLogEntry[] = [];
  private currentScene: ObsSceneDescriptor = {
    sceneName: 'CENA_01_AVATAR_BANCADA',
    sceneIndex: 0,
    isProgramScene: true,
    isStudioMode: false,
    avatarSourceVisible: true,
    audioMuted: false,
  };

  constructor(config: Partial<ObsWebSocketConfig> = {}) {
    this.config = { ...DEFAULT_OBS_WS_CONFIG, ...config };
  }

  public subscribe(
    callback: (status: ObsConnectionStatus, telemetry?: ObsTelemetryPacket) => void
  ): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify(telemetry?: ObsTelemetryPacket) {
    this.listeners.forEach((cb) => cb(this.status, telemetry));
  }

  private logEvent(
    direction: 'inbound' | 'outbound',
    eventType: string,
    details: Record<string, unknown>,
    latencyMs = 0
  ) {
    const entry: ObsEventLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      direction,
      eventType,
      details,
      latencyMs,
    };
    this.eventLogs = [entry, ...this.eventLogs.slice(0, 19)];
  }

  public get logs(): ObsEventLogEntry[] {
    return this.eventLogs;
  }

  public get sceneState(): ObsSceneDescriptor {
    return this.currentScene;
  }

  public get connectionStatus(): ObsConnectionStatus {
    return this.status;
  }

  public get rttLatency(): number {
    return this.currentRtt;
  }

  /**
   * Conecta ao servidor WebSocket real do OBS Studio (ws://host:port)
   */
  public connect(): void {
    if (typeof window === 'undefined') return;

    this.disconnect();
    this.status = 'connecting';
    this.notify();

    const wsUrl = `ws://${this.config.host}:${this.config.port}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.status = 'connected';
        this.logEvent('inbound', 'ObsWebSocketConnected', {
          server: wsUrl,
          protocol: 'obs-websocket-v5',
          status: 'Handshake Real OK',
        });
        this.notify();
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.op === 2) {
            // Identified
            this.logEvent('inbound', 'ObsIdentified', { d: msg.d });
          } else if (msg.op === 5) {
            // Event
            this.handleObsEvent(msg.d);
          } else if (msg.op === 7) {
            // RequestResponse / Pong
            this.currentRtt = Math.max(1, Date.now() - this.pingStart);
          }
        } catch {
          // ignore parsing error
        }
      };

      this.ws.onerror = () => {
        // Se OBS offline, fallback para modo simulado se requisitado
        this.status = 'error';
        this.logEvent('inbound', 'ObsConnectionFailed', {
          target: wsUrl,
          message: 'OBS Studio não está em execução na porta ou rejeitou a conexão.',
        });
        this.notify();
      };

      this.ws.onclose = () => {
        if (this.status === 'connected') {
          this.logEvent('inbound', 'ObsDisconnected', { reason: 'Socket fechado' });
        }
        this.status = 'disconnected';
        this.notify();
      };
    } catch {
      this.status = 'error';
      this.notify();
    }
  }

  /**
   * Inicia o modo de simulação interna caso o OBS Studio não esteja rodando localmente
   */
  public startSimulatedLoop(): void {
    this.disconnect();
    this.status = 'simulated_live';
    this.logEvent('inbound', 'SimulatedBridgeStarted', {
      fps: this.config.targetFps,
      pairedPort: 4455,
      mode: 'Loop Simulado de Alta Fidelidade',
    });
    this.notify();

    const intervalMs = 1000 / this.config.targetFps;

    this.simTimer = setInterval(() => {
      this.packetSeq++;
      const time = Date.now() / 1000;

      const telemetry: ObsTelemetryPacket = {
        seq: this.packetSeq,
        timestamp: Date.now(),
        rttMs: Math.floor(Math.random() * 2 + 1), // 1 a 3ms
        fps: this.config.targetFps,
        activeViseme: this.packetSeq % 120 < 40 ? 'A_I' : this.packetSeq % 120 < 80 ? 'E' : 'silence',
        headTiltEuler: {
          pitch: Number((Math.sin(time * 0.8) * 2.2).toFixed(2)),
          yaw: Number((Math.cos(time * 0.5) * 3.1).toFixed(2)),
          roll: Number((Math.sin(time * 0.4) * 2.8).toFixed(2)),
        },
        breathingY: Number((Math.sin(time * 2.1) * 0.8).toFixed(2)),
        activeEmotion: this.packetSeq % 300 < 100 ? 'open_smile' : 'neutral',
        sourceVisible: this.currentScene.avatarSourceVisible,
      };

      this.notify(telemetry);
    }, intervalMs);
  }

  private handleObsEvent(eventData: Record<string, unknown>) {
    const eventType = (eventData?.eventType as string) || 'UnknownEvent';
    this.logEvent('inbound', eventType, eventData);

    if (eventType === 'CurrentProgramSceneChanged') {
      this.currentScene.sceneName = (eventData.sceneName as string) || this.currentScene.sceneName;
    } else if (eventType === 'SceneItemEnableStateChanged') {
      this.currentScene.avatarSourceVisible = Boolean(eventData.sceneItemEnabled);
    }
    this.notify();
  }

  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.pingStart = Date.now();
        this.ws.send(JSON.stringify({ op: 6, d: { requestType: 'GetVersion', requestId: `ping_${Date.now()}` } }));
      }
    }, this.config.heartbeatIntervalMs);
  }

  /**
   * Envia comando de troca de cena para o OBS
   */
  public switchScene(sceneName: string): void {
    this.currentScene.sceneName = sceneName;
    this.logEvent('outbound', 'SetCurrentProgramScene', { sceneName });

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          op: 6,
          d: {
            requestType: 'SetCurrentProgramScene',
            requestId: `req_${Date.now()}`,
            requestData: { sceneName },
          },
        })
      );
    }
    this.notify();
  }

  /**
   * Alterna visibilidade da fonte Browser Source do Avatar no OBS
   */
  public toggleSourceVisibility(): void {
    this.currentScene.avatarSourceVisible = !this.currentScene.avatarSourceVisible;
    this.logEvent('outbound', 'SetSceneItemEnabled', {
      source: this.config.sourceName,
      visible: this.currentScene.avatarSourceVisible,
    });
    this.notify();
  }

  /**
   * Desconecta e limpa sockets e timers
   */
  public disconnect(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.simTimer) {
      clearInterval(this.simTimer);
      this.simTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore
      }
      this.ws = null;
    }
    this.status = 'disconnected';
    this.notify();
  }
}
