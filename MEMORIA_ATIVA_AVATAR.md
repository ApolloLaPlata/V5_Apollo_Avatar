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

---

## 6. LOG DE HARDENING & CORREÇÕES DE BUGS (27/10/2026)
- **Commit 5ab98be:**
  - waveformAnalyzer.ts: Eliminada divisão por zero e NaN em verageRms para pointCount 0 ou duração nula/negativa, com fallbacks de intervalo de silêncio proporcionais.
  - udioProcessor.ts: Rejeição imediata de arquivo nulo, execução segura em SSR (	ypeof window === 'undefined'), tratamento preventivo para buffers sem canais (channels === 0) e cleanup seguro com .catch(() => {}) no udioContext.close().
  - Suíte scripts/test_audio_waveform_hardening.ts aprovada com 100% de sucesso (4/4 testes).
  - Next.js 14 Build: Compilado com Exit Code 0 em todas as 6 rotas.


---

## 6. DIRETRIZ ESTRATÉGICA DE PRODUTO & UX: O ESTÚDIO SOBERANO MINIMALISTA

**Princípio Fundamental:** *"O grosso roda no backend de forma invisível; no frontend, o usuário tem uma experiência visual minimalista, rápida e focada 100% no personagem."*

### 6.1 Missão de Negócio do V5 Avatar
O V5 Apollo Avatar não é uma vitrine de diagnósticos de laboratório, mas sim a **Agência Central & Cofre Soberano de Personagens Digitais**.
Nele, criadores, marcas e agências armazenam, gerenciam e refinam todos os seus avatares virtuais que aparecem de forma consistente em todos os seus canais:
- Canais Dark de Histórias e Curiosidades (YouTube/TikTok)
- Apresentadores de Afiliados e UGC (V5 Finders / Shopee / Mercado Livre)
- Streamers e Apresentadores de Rádio e Live 24/7 (V5 Broadcaster / OBS Studio)
- Autores e Especialistas com Autoridade E-E-A-T (V5 Auto Blog)
- Protagonistas de VSLs e Treinamentos (V5 Prisma / Hotmart)

### 6.2 Pilares da Experiência do Usuário (Design System)
1. **Palco Visual em Destaque (Studio Stage):** O personagem em alta resolução com carrossel 360º suave (<kbd>Frente</kbd>, <kbd>3/4</kbd>, <kbd>Perfil</kbd>, <kbd>Costas</kbd>) e player de voz instantâneo com síntese em 1 clique.
2. **Personalização Sem Ruído:** Apenas 4 abas práticas (Aparência, Voz, Personalidade e Exportação/Conexões).
3. **Multi-Modelos no Backend:** Seleção transparente de motores de geração visual (Flux.1, SDXL, ComfyUI local) e vocal (Qwen-TTS, XTTS-v2, CosyVoice).
4. **Laboratório Avançado Oculto:** As 70+ ferramentas técnicas, benchmarks e medidores de orquestração continuam ativas no código, mas recolhidas no rodapé sob demanda para não poluir a criação.

---

## 7. INTEGRAÇÃO JUTSU: VIDEO CHARACTER SWAP ENGINE (04/11/2026)
- **Commit a3b620b:**
  - Criação do estúdio \src/components/avatar/VideoCharacterSwapStudio.tsx\ (OpenJutsu Protocol).
  - Implementada a 5ª aba principal do estúdio: **Video Swap (Jutsu)**.
  - Eliminação de dependência frágil do Edge Runtime em \opengraph-image.tsx\ com @vercel/og que causava falhas no Windows.
  - Compilação Next.js 14.2.35 limpa em 100% das 11 rotas (
pm run build com Exit Code 0).
  - Verificação de UI ponta a ponta via Playwright: 0 erros e 0 warnings no console.
  - Modos de operação integrados:
    1. **Full Character Replacement (OpenJutsu):** Troca completa do corpo e rosto com SAM 3.1.
    2. **Face Swap & Relighting (FLUX Klein + InsightFace):** Troca de rosto e iluminação harmônica.
    3. **Motion Retargeting (MiniMax H3 / Wan 2.1):** Animação a partir da pose do vídeo de referência.
  - Backends de computação: Nuvem Modal H100 SXM5 (zero custo de hardware local) vs ComfyUI Local.
  - Exportação direta com 1 clique para o **Apollo Studio** (inbox dos 7 canais de vídeo).

---

## 8. BACKEND API DE VÍDEO SWAP & ALTERNADOR 360° DINÂMICO (04/11/2026)
- **Commit 9c6c9d6:**
  - Criação da rota oficial \src/app/api/avatar/video-swap/route.ts\ com endpoints POST (despacho de job) e GET (polling de telemetria/status).
  - Implementado alternador de câmera instantâneo no palco principal do estúdio: clicar em **Frente**, **3/4**, **Perfil** ou **Costas** altera a imagem do avatar em tempo real com animação fluida e badge de grau correspondente (0°, 45°, 90°, 180°).
  - Atualização dos perfis canônicos em \src/store/useAvatarStore.ts\ com as folhas completas de referência multi-ângulo.
  - Compilação limpa em 12/12 rotas estáticas e dinâmicas (
pm run build com Exit Code 0).

---

## 9. CENTRAL DE CANAIS VINCULADOS, HUB MULTI-MODELOS & PALCO INTERATIVO (04/11/2026)
- **Commit 1fdb04b:**
  - **Canal Vinculado & Constância de Conteúdo (Channel Binding):**
    - Enriquecimento do modelo de dados (\ChannelBinding\) vinculando cada personagem da Holding ao seu canal oficial de transmissão (\@mayavance.ia\ para Instagram Creator, \@arquivooculto.v5\ para Dark YouTube e novo avatar canônico \@achadinhosdaluna\ para TikTok UGC / Achadinhos).
    - Banner visual de métricas de constância no topo do workbench: total de vídeos produzidos, áudios sintetizados e frequência de publicação.
    - Filtro de catálogo por tipo de canal no topo da barra de atores.
  - **Hub de Geração Multi-Modelos IA (\/api/avatar/generate\ & \MultiModelGenerateModal.tsx\):**
    - Suporte a múltiplos motores de difusão de última geração: **FLUX.1 Dev (Klein)**, **FLUX.1 Schnell**, **SDXL Lightning** e **Ideogram v2**.
    - Presets calibrados: Geração de Ângulo 360°, Troca de Figurino/Roupa, Cenário de Estúdio (Podcast, Minimalista, Cyberpunk) e Expressão Facial mantendo o Face DNA imutável.
    - Aplicação em 1 clique para o ângulo correspondente ou foto principal do avatar.
  - **Palco Visual Super-Interativo (Studio Stage):**
    - **Upload Direto de Foto por Ângulo (\CustomAngleUploadModal.tsx\):** Botão direto na barra de ângulos para subir arquivo do computador ou link web para Frente, 3/4, Perfil ou Costas.
    - **HUD de Fala com Legendas em Tempo Real (Closed Captions):** Visualizador de equalizador de som e balão de fala flutuante com texto falado diretamente sobre a imagem do ator.
    - **Testador de Bordões & Frases Personalizadas:** Botões para disparar qualquer bordão do avatar na hora ou digitar frases livres para o avatar falar.
    - **Micro-Expressões Faciais Imediatas:** Seletor rápido de humor (\😊 Neutro\, \😄 Sorrindo\, \🔥 Vendas\, \🧐 Sério\, \😲 Surpreso\).
  - **Homologação e QA:**
    - TypeScript Strict: 100% aprovado (px tsc --noEmit\ Exit Code 0).
    - Next.js 14 Build: 13/13 rotas compiladas com sucesso (pm run build\ Exit Code 0).
    - Playwright Test: 0 erros e 0 warnings no console do navegador na porta :3010.


---

## 10. ESTEIRA DE CONSTÂNCIA SEMANAL DE 7 DIAS & PIPELINE AUTOMATIZADO (04/11/2026)
- **Commit c6202d8:**
  - **Componente ContentPipelineStudio (`src/components/avatar/ContentPipelineStudio.tsx`):**
    - Criação da 6ª aba do estúdio: **Esteira (7 Dias)**.
    - Geração automática da grade de 7 dias de publicações para redes sociais (Segunda a Domingo) contendo:
      1. Segunda: Gancho Provocativo & Curiosidade
      2. Terça: Review Sincero & Demonstração de Produto
      3. Quarta: Quebra de Mito & Verdade Oculta
      4. Quinta: Estudo de Caso / Antes & Depois
      5. Sexta: Erro Fatal que Quase Todo Mundo Comete
      6. Sábado: Hack / Dica Rápida em 30 Segundos
      7. Domingo: Reflexão Estratégica & Chamada de Comunidade
    - Roteiros estruturados nos 3 Atos de Alta Retenção:
      - Gancho Visual (0 a 3 segundos com micro-expressão indicada)
      - Desenvolvimento e Prova (3 a 18 segundos no tom vocal do avatar)
      - Call-to-Action Final (18 a 25 segundos direcionando para o canal vinculado)
    - Botão **"Ouvir Gancho"** disparando síntese de fala imediata.
    - Botão **"Aplicar no Video Swap"** transferindo o roteiro para renderização na usina Modal H100.
    - Botão **"Regenerar 7 Dias"** para compilar novas variações de pauta.
  - **Homologação:**
    - TypeScript Strict: Exit Code 0.
    - Next.js 14 Build: 13/13 rotas geradas (Exit Code 0).
    - Playwright Browser QA: 0 erros e 0 warnings no console.
    - Servidor em produção ativo na porta :3010.


---

## 11. GESTOR DE CANAIS VINCULADOS & CÉREBRO CONVERSACIONAL (CHAT INTERATIVO) (04/11/2026)
- **Commit be6f39c:**
  - **Modal de Configuração de Canais Soberanos (`ChannelBindingModal.tsx`):**
    - Interface dedicada para vincular e editar as informações de canal de cada personagem.
    - Suporte a 6 tipos de canais da Holding: Instagram Creator, Dark YouTube, TikTok UGC, Rádio 24h/Live, Educacional e VSL/Vendas.
    - Edição de nome do canal, handle (@), pilar de conteúdo, público-alvo e frequência de postagem (Diária, Semanal, 24/7).
    - Botão direto no banner de canal do workbench para configuração rápida.
  - **Cérebro Conversacional do Avatar (`AvatarInteractiveChatModal.tsx`):**
    - Cumprimento integral do 4º Pilar do Kernel: **Interactive Channel**.
    - Chat interativo em tempo real respeitando 100% o Soul DNA, arquétipo, biografia, bordões e diretrizes éticas do avatar.
    - Síntese de voz automática (TTS) sincronizada: o avatar fala suas respostas em voz alta usando a velocidade e o pitch calibrados do Voice DNA.
    - Sugestões de perguntas rápidas contextuais ao nicho do personagem.
    - Controle de áudio (mutar/ativar som), botão de reiniciar conversa e cópia rápida de mensagens.
  - **Homologação:**
    - TypeScript Strict: 100% verificado (`npx tsc --noEmit` com Exit Code 0).
    - Next.js 14 Build: 13/13 rotas compiladas (`npm run build` com Exit Code 0).
    - Playwright QA: 0 erros e 0 warnings no console em `http://localhost:3010`.
    - Servidor de produção ativo e respondendo na porta local :3010.


---

## 12. MODO VIVO DE ANIMAÇÃO NO PALCO (IDLE & VISEMAS) & INTEGRAÇÃO DE PRODUTOS MINERADOS (05/11/2026)
- **Implementações Realizadas:**
  - **Modo Vivo no Palco do Avatar (`src/app/page.tsx` & `globals.css`):**
    - Controle toggleable `isLiveIdle` no canto superior do palco com indicador luminoso e estado em tempo real.
    - Animação torácica suave de respiração biológica contínua (`.animate-avatar-breathe`).
    - Ciclo estocástico orgânico de piscada de olhos (`isBlinking`) acionado a cada 4.2 segundos com transição sutil de luminosidade e overlay palpebral (150ms).
    - Efeito de visema dinâmico labial (`.animate-viseme-pulse`) com aura de pulsação sonora disparada automaticamente enquanto `isSpeaking` estiver ativo.
  - **Hub de Produtos Minerados do V5 Finders no Video Character Swap (`VideoCharacterSwapStudio.tsx`):**
    - Cumprimento rigoroso da **Lei 2 do Kernel** (Fines minera produtos; V5 Avatar provê os atores virtuais para anúncios UGC).
    - Seletor por abas no Passo 1: **Achadinhos (V5 Finders)**, **Vídeos Base** e **Link URL**.
    - Catálogo curado de 6 achadinhos de alta conversão: Mini Seladora Térmica USB (Shopee), Escova Secadora 3em1 Cerâmica (TikTok Shop), Projetor 4K Magcubic (AliExpress), Luminária Sunset RGB (Shopee), Mini Processador USB (Shopee) e Fone Bluetooth Powerbank (TikTok Shop).
    - Cartões informativos com preço de venda, estimativa de comissão (ex: 14% R$ 2,64) e índice de viralidade (94% a 99%).
    - Carregamento automático de roteiro viral em 3 atos (Gancho, Demonstração, CTA) e botão de áudio imediato para ouvir o gancho com a voz do avatar.
    - Badge dinâmico no HUD de prévia do vídeo indicando o produto e plataforma afiliada.
  - **Homologação:**
    - TypeScript Strict: 100% verificado (`npx tsc --noEmit` com Exit Code 0).
    - Next.js 14 Build: 13/13 rotas compiladas com sucesso (`npm run build` com Exit Code 0).
    - Playwright QA: 0 erros e 0 warnings no console do navegador em `http://localhost:3010`.
    - Servidor em produção ativo na porta :3010.
