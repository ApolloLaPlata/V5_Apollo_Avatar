# 👤 MEMÓRIA ATIVA - V5 APOLLO AVATAR (CAPITANIA #12)

**Holding V5 Apollo · Agência Central de Identidades Digitais & Registro Civil de Personagens Soberanos**  
**Porta Local Soberana:** `:3010` (`avatar.v5apollo.com`)  
**Stack Tecnológica:** Next.js 14.2.35 (App Router), React 18, TypeScript (Strict Mode 100% Zero `any`), Tailwind CSS, Lucide React, Framer Motion, Canvas 2D, JSZip.  
**Versão Atual:** `1.0.0` (Lançamento Oficial de Produção)  
**Última Atualização:** 27/10/2026 · **Responsável:** Apollo La Plata (`v5estudio@hotmail.com`)

---

## 1. IDENTIDADE, MISSÃO E LEIS DO KERNEL

### 1.1 Missão Soberana
O **V5 Apollo Avatar** resolve definitivamente o problema de fragmentação e perda de consistência visual, vocal e psicológica de personagens gerados por Inteligência Artificial no ecossistema da Holding V5.
Centraliza o "Registro Civil de Personagens Soberanos", gerando especificações canônicas que alimentam diretamente:
- **V5 Broadcaster (:3008):** Transmissões ao vivo 24/7 com VTubers, visemas em tempo real e reações a eventos de chat.
- **V5 Prisma (:3000):** Geração em lote de 20+ vídeos curtos mantendo o mesmo rosto, vestimenta e proporção corporal.
- **V5 Edit Web (:3001):** Sincronização labial na timeline e metadados de respiração/ênfase de cortes.
- **V5 Sound (:3008):** Clonagem vocal com Qwen-TTS, XTTS e CosyVoice.
- **V5 Auto Blog (:3000):** Assinatura digital de autor e selo de autoridade E-E-A-T.
- **V5 Finders:** Geração de poses UGC segurando produtos minerados para criativos de afiliados.

### 1.2 Leis Invioláveis do Kernel
1. **🔴 LEI 1: SEGREGAÇÃO ABSOLUTA DO MERCADO CINZA (PROIBIDO PIXDROP)**
   O PixDrop (`pixdrop.com.br`) opera isolado. É terminantemente proibido qualquer link, âncora, banner ou menção ao PixDrop dentro do V5 Avatar ou sistemas integrados da holding.
2. **🛡️ LEI 2: FINES É O RADAR DE PRODUTOS, NÃO DE PERSONAGENS**
   O Fines minera dados e tendências. O V5 Avatar provê os apresentadores humanos virtuais para os criativos de produtos.
3. **🚫 LEI 3: NÃO TOCAR EM OUTRAS CAPITANIAS**
   Desenvolvimento isolado e soberano na pasta local do V5 Apollo Avatar sem modificar arquivos de outras capitanias.
4. **💻 LEI 4: DESENVOLVIMENTO LOCAL SOBERANO (PORTA :3010)**
   Operação e testes 100% funcionais na porta local `:3010`.
5. **✍️ LEI 5: PROTOCOLO DE COMMITS GIT**
   Commits oficiais assinados obrigatoriamente como:
   `git -c user.name="Apollo La Plata" -c user.email="v5estudio@hotmail.com" commit -m "..."`

---

## 2. PILARES DA ARQUITETURA E MOTORES DO SISTEMA

### 2.1 Face DNA (Identidade Visual e Consistência Multi-Ângulo)
- **Turnaround 360º de Folha Única 4:1:** Renderização e montagem composta em proporção 4:1 contendo 4 ângulos fotográficos canônicos (Frente, 3/4, Perfil 90º e Costas) com travas de iluminação e vestimenta (`attireLockEngine.ts`, `turnaroundComposerEngine.ts`).
- **Laser Eye-Level Alignment:** Réguas digitais de proporção e retículo laser com tolerância de 2 pixels para evitar flutuação de altura dos olhos entre ângulos.
- **Matriz de Poses Neutras (T-Pose 90º e A-Pose 45º):** Padronização anatômica em 7.0, 7.5 e 8.0 cabeças e proporção áurea com canal alfa 32-bit (`tPoseComposerEngine.ts`, `alphaMatteExporter.ts`).
- **Rigging Ósseo 20-Keypoints:** Mapeador cinemático de articulações corporais exportável diretamente para o motor de rastreamento do V5 Broadcaster (`boneRiggingEngine.ts`).

### 2.2 Voice DNA (Identidade Vocal e Sincronia Labial)
- **Mapeador Multi-Motor:** Handshake local com V5 Sound (:3008) para Qwen-TTS, XTTS-v2 e CosyVoice (`v5SoundConnectorEngine.ts`).
- **Controles Paramétricos:** Pitch (-12st a +12st), Velocidade (0.5x a 2.0x), Estabilidade e Temperatura Sonora.
- **6 Tonalidades Emocionais com SSML:** Neutro, Confiante/Autoritário, Empático/Calmo, Energético/Vendas, Misterioso/Narrador e Didático/Educativo.
- **Bateria Fonética de Estresse:** 8 frases e pangramas calibrados cobrindo 7 famílias fonéticas completas (`phoneticPangramEngine.ts`).
- **Pacote Canônico .v5voice.json:** Exportação da assinatura vocal criptografada com hash SHA-256 (`v5VoicePackageEngine.ts`).

### 2.3 Soul DNA (Identidade Psicológica, Lore e Guardrails)
- **Matriz de Arquétipos Jungianos:** 12 personas fundamentais (O Especialista, O Mago, O Governante, O Herói, O Amigo, etc.) com calibragem de tom e léxico (`archetypeEngine.ts`).
- **Dicionário de Bordões Ponderados:** Frequência de uso probabilística de 1 a 5 com regras de inserção orgânica.
- **Guardrails Éticos & Firewall:** Bloqueio ativo da Lei 1 (PixDrop), filtragem de termos proibidos e mitigação de jailbreaks/DAN (`livePromptFirewallEngine.ts`, `antiJailbreakEngine.ts`).
- **Módulo RAG Local:** Base de conhecimento vetorial e fatos biográficos imutáveis do personagem (`soulDnaEngine.ts`).

### 2.4 Live & Broadcast Connector (Interatividade em Tempo Real)
- **Servidor Webhook Seguro (`/api/webhook/broadcaster`):** Validação de tokens de sessão, origin check e HMAC SHA-256 para eventos de live streaming.
- **Overlay Web OBS Studio (`/live/overlay`):** Fundo 100% transparente, GPU-accelerated a 60 FPS com visemas gerados por FFT de áudio (`audioVisemeSyncEngine.ts`).
- **Painel de Operador de Live:** Disparador instantâneo de poses, expressões e respostas canônicas preparadas com tecla de atalho.
- **Telemetria de Transmissão:** Monitoramento contínuo de latência (RTT < 45ms), estabilidade de FPS e perda de pacotes.

### 2.5 Narrative Connector (Prisma & Edit Integration)
- **Face DNA Pack para Difusores:** Prompts estruturados com pesos LoRA para Flux.1 e SDXL (`faceDnaPackEngine.ts`).
- **Tabela de Cenários Canônicos:** Ambientes trancados com seeds imutáveis (Home Office Tech, Estúdio Escuro, Auditório Moderno, Externa Urbana).
- **Jump Cuts Cinemáticos:** Matriz de angulação de câmera e regras de corte para edição de Shorts e Reels sem alucinação facial.
- **Face Verification Index (FVI):** Estimador heurístico de semelhança facial cross-scene com pontuação de 0% a 100% (`faceVerificationIndexEngine.ts`).
- **Marcadores de Timeline V5 Edit:** Metadados JSON com pontos de respiração, ênfase vocal e pausas dramáticas (`timelineMetadataEngine.ts`).

### 2.6 Universal Avatar Package (.v5avatar)
- **Schema Canônico Criptográfico:** `V5AvatarPackage` versão 1.0.0 com assinatura e soma de verificação SHA-256 em todos os arquivos (`universalAvatarPackageEngine.ts`).
- **Empacotador & Importador ZIP Client-Side:** Compactação e descompactação local no navegador via JSZip com suporte a drag-and-drop (`v5AvatarZipPacker.ts`, `v5AvatarZipImporter.ts`).
- **Ficha de Personagem A4/PDF:** Gerador de relatório executivo de alta fidelidade com fotos, specs vocais e lore para impressão direta (`characterSheetPrintEngine.ts`).
- **Backup & Restauração Completa:** Backup de 1 clique de todo o catálogo de identidades do estúdio (`catalogBackupEngine.ts`).

---

## 3. RELATÓRIO DAS 11 FASES CONCLUÍDAS DO PLANO MESTRE

| Fase | Título | Etapas | Status | Destaque Técnico |
|---|---|---|---|---|
| **Fase 1** | Fundações do Estúdio & Arquitetura Base | 001 - 010 | Homologado | Zustand Store com persistência, Design System Dark Luxury, Holographic Card, Archetypes |
| **Fase 2** | Motor de Model Sheet Turnaround 360º | 011 - 020 | Homologado | Ingestor Canvas 1024px, Laser Eye-Level, 5 Iluminações, Attire Lock, Compositor 4:1 |
| **Fase 3** | Poses Neutras (T-Pose, A-Pose) & Rigging | 021 - 030 | Homologado | T-Pose 90º, A-Pose 45º, Proporção Áurea, Rigging 20 Keypoints, Poses UGC, Exportador Alpha |
| **Fase 4** | Expressões Faciais & Visemas de Fala | 031 - 040 | Homologado | 7 Visemas Rhubarb/Oculus, Matriz FACS 5+4 emoções, Sprite Sheet Atlas 4x4, Lupa 2.5x |
| **Fase 5** | Estúdio de DNA Vocal (Qwen-TTS & SSML) | 041 - 050 | Homologado | Waveform Canvas, Handshake V5 Sound :3008, 6 Tons Emocionais, 8 Pangramas Fonéticos |
| **Fase 6** | Lore, Personalidade & Soul DNA | 051 - 060 | Homologado | Arquétipos Jungianos, Bordões 1-5, RAG Knowledge Base, Anti-Jailbreak, Pacote .v5soul.json |
| **Fase 7** | Animação Idle & Micro-movimentos | 061 - 070 | Homologado | Respiração torácica, Piscada estocástica, Head Tilts, Canvas 60 FPS, Overhead CPU < 1% |
| **Fase 8** | Conector de Live com V5 Broadcaster | 071 - 080 | Homologado | Webhook seguro, Overlay OBS transparente, FFT de Áudio, Telemetria e Firewall Anti-Hijack |
| **Fase 9** | Conector de Narrativa V5 Prisma / Edit | 081 - 090 | Homologado | Face DNA Pack LoRA, Cenários Canônicos, Jump Cuts, FVI Semelhança Facial, Timeline Edit |
| **Fase 10** | Exportador Universal de Pacotes & E2E | 091 - 100 | Homologado | Pacote portátil .v5avatar (ZIP), Ficha A4, Backup 1-Clique, Atalhos de Teclado, E2E Completo |
| **Fase 11** | Auditoria, QA, Blindagem & Homologação | 101 - 108 | Homologado | Zero Any TypeScript strict, React.memo, WCAG AA, Isolamento PixDrop, Tolerância Storage |

---

## 4. MAPEAMENTO DE PORTAS E ECOSSISTEMA DA HOLDING V5

```
+-----------------------------------------------------------------------+
|                       HOLDING V5 APOLLO (ECOSSISTEMA)                 |
+-----------------------------------------------------------------------+
|                                                                       |
|  [CAPITANIA #12] V5 APOLLO AVATAR (:3010)                             |
|  -> Agência Central de Identidades Digitais & Registro Civil           |
|  -> Emite: Face DNA, Voice DNA, Soul DNA e Pacotes .v5avatar          |
|                                                                       |
|         |                     |                     |                 |
|         v                     v                     v                 |
|  +--------------+     +--------------+     +-----------------------+  |
|  | V5 BROADCAST |     |  V5 PRISMA   |     |      V5 SOUND         |  |
|  |   (:3008)    |     |   (:3000)    |     |      (:3008)          |  |
|  |  Live VTuber |     | 20+ Shorts/Lote|   | Qwen-TTS / XTTS Voice |  |
|  +--------------+     +--------------+     +-----------------------+  |
|         |                     |                                       |
|         +---------------------+---------------------+                 |
|                               |                     |                 |
|                               v                     v                 |
|                      +------------------+  +------------------+       |
|                      |   V5 EDIT WEB    |  |   V5 AUTO BLOG   |       |
|                      |     (:3001)      |  |     (:3000)      |       |
|                      | Timeline Markers |  | E-E-A-T Signature|       |
|                      +------------------+  +------------------+       |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## 5. DIRETRIZES DE MANUTENÇÃO E OPERAÇÃO CONTÍNUA
1. Qualquer nova funcionalidade adicionada ao estúdio deve passar pela checagem estrita de tipos (`npx tsc --noEmit`) e pelo build de produção (`npm run build`) com **Exit Code 0**.
2. O arquivo `antigravity_hive_bus.md` da Colmeia deve ser atualizado a cada avanço relevante.
3. O serviço de Background Cron (`0 */2 * * *`) deve ser mantido ativo para garantir a sincronia e telemetria constante do ecossistema.
