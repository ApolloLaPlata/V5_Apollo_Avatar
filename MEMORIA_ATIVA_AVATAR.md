# 👤 MEMÓRIA ATIVA - V5 APOLLO AVATAR (CAPITANIA #12)

**Holding V5 Apollo · Repositório Local · Porta :3010**
**Data de Criação:** 27/10/2026 · **Status:** Em Implantação Inicial

---

## 1. Origem e Missão
O **V5 Apollo Avatar** resolve a fragmentação de personagens de IA na Holding V5.
Em vez de configurar o rosto, a voz e a biografia do personagem repetidamente em cada site (Edit, Prisma, Sound, Broadcaster, Finders), o Avatar centraliza a ficha civil do personagem com soberania total.

---

## 2. Pilares de Arquitetura herdados de "gerador-de-historias-por-imagem---apollo-la-plata"
A pasta local `Pesquisa e Conhecimento/Apollo_La_Plata_Character_Base` contém o código original consolidado:
1. **Modo Turnaround:** 4 ângulos em um único arquivo de saída (frente, 3/4, perfil lateral e costas) com iluminação de estúdio limpa para alimentar modelos de difusão (Flux / SDXL) com trava de vestimenta.
2. **Modo T-Pose:** Pose neutra com braços abertos para referências anatômicas e prova virtual de roupas.
3. **Modo Expressions:** Grade de expressões faciais idênticas (alegria, seriedade, surpresa, fala).
4. **Descrevedor e Expansor de Prompt:** Rotação de chaves e enriquecimento cinematográfico.

---

## 3. Interoperabilidade com o Ecossistema
- **V5 Broadcaster:** Exporta o modelo para streamer virtual (VTuber).
- **V5 Prisma:** Injeta o Face DNA para renderização de lotes de 20 Shorts com a mesma pessoa.
- **V5 Sound:** Conecta a chave vocal do personagem com o motor de clonagem Qwen-TTS.
- **V5 Finders:** Atua como criador de UGC e apresentador de produtos e ofertas.
- **V5 Poster:** Responde como chatbot in-character aos comentários e mensagens de Direct.

---

## 4. Próximos Passos (Plano Mestre de 100 Etapas)
- [x] **Etapa 1:** Scaffold inicial Next.js 14, Tailwind, tipos e componentes base.
- [ ] **Etapa 2:** Integração com o canvas de upload e recorte de imagem de referência.
- [ ] **Etapa 3:** Chamada real para a API central `https://api.v5apollo.com` para geração de imagens Flux / MiniMax.
- [ ] **Etapa 4:** Conexão com o V5 Sound para preview de áudio da voz do avatar.
- [ ] **Etapa 5:** Construtor de Webhook para exportar o cérebro do avatar para o V5 Poster / ManyChat.
