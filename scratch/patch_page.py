import os

file_path = os.path.join('src', 'app', 'page.tsx')
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update the actor selection bar with Channel filter
old_bar = """        {/* Barra de Ator em Foco & Criar Novo */}
        <div className="p-3 bg-slate-900/60 border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider pl-2">
              Ator Ativo:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {avatars.length === 0 ? (
                <div className="flex items-center gap-2 text-xs text-amber-400 font-mono pl-1">
                  <span>Nenhum ator cadastrado.</span>
                  <button
                    onClick={() => resetToDefaults()}
                    className="px-2 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan hover:text-black font-bold transition-all"
                  >
                    Restaurar Padrões Soberanos
                  </button>
                </div>
              ) : (
                avatars.map((avatar) => {
                  const isCurrent = avatar.id === selectedAvatar?.id;
                  return (
                    <button
                      key={avatar.id}
                      onClick={() => selectAvatar(avatar.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        isCurrent
                          ? 'bg-cyber-cyan/20 border-cyber-cyan text-white shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                          : 'bg-black/30 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <img
                        src={avatar.avatarUrl}
                        alt={avatar.name}
                        className="w-5 h-5 rounded-full object-cover border border-white/10"
                      />
                      <span>{avatar.name}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="text-xs px-3.5 py-1.5 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-obsidian-950 font-bold font-mono transition-all ml-auto shadow-[0_0_15px_rgba(0,229,255,0.2)] flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Personagem</span>
          </button>
        </div>"""

new_bar = """        {/* Barra de Ator em Foco, Filtro por Canal & Criar Novo */}
        <div className="p-3 bg-slate-900/60 border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 border-r border-white/10 pr-3">
              <Tv className="w-3.5 h-3.5 text-cyber-cyan mr-1" />
              <button
                onClick={() => setChannelFilter('all')}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                  channelFilter === 'all'
                    ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos ({avatars.length})
              </button>
              <button
                onClick={() => setChannelFilter('instagram_creator')}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                  channelFilter === 'instagram_creator'
                    ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Instagram
              </button>
              <button
                onClick={() => setChannelFilter('dark_youtube')}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                  channelFilter === 'dark_youtube'
                    ? 'bg-purple-500 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dark YouTube
              </button>
              <button
                onClick={() => setChannelFilter('tiktok_ugc')}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                  channelFilter === 'tiktok_ugc'
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Achadinhos UGC
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {avatars
                .filter((av) => channelFilter === 'all' || av.channelBinding?.channelType === channelFilter)
                .map((avatar) => {
                  const isCurrent = avatar.id === selectedAvatar?.id;
                  return (
                    <button
                      key={avatar.id}
                      onClick={() => selectAvatar(avatar.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        isCurrent
                          ? 'bg-cyber-cyan/20 border-cyber-cyan text-white shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                          : 'bg-black/30 border-white/5 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <img
                        src={avatar.avatarUrl}
                        alt={avatar.name}
                        className="w-5 h-5 rounded-full object-cover border border-white/10"
                      />
                      <span>{avatar.name}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="text-xs px-3.5 py-1.5 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-obsidian-950 font-bold font-mono transition-all ml-auto shadow-[0_0_15px_rgba(0,229,255,0.2)] flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Personagem</span>
          </button>
        </div>"""

text = text.replace(old_bar, new_bar)

# 2. Add channel banner and wrap workbench
old_wb = """        {/* ============================================================== */}
        {/* PALCO CENTRAL DO PERSONAGEM (CHARACTER STUDIO WORKBENCH)       */}
        {/* ============================================================== */}
        {selectedAvatar ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">"""

new_wb = """        {/* ============================================================== */}
        {/* PALCO CENTRAL DO PERSONAGEM (CHARACTER STUDIO WORKBENCH)       */}
        {/* ============================================================== */}
        {selectedAvatar ? (
          <div className="space-y-4">
            {/* Banner de Canal Vinculado & Constância de Conteúdo */}
            {selectedAvatar.channelBinding && (
              <div className="p-3.5 bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-obsidian-950 border border-purple-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {selectedAvatar.channelBinding.channelName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 font-bold">
                        {selectedAvatar.channelBinding.channelHandle}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Pilar: {selectedAvatar.channelBinding.contentPillar}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-center">
                    <div className="text-cyber-cyan font-extrabold text-sm">
                      {selectedAvatar.channelBinding.totalVideosProduced}
                    </div>
                    <div className="text-[10px] text-slate-400">Vídeos Gerados</div>
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  <div className="text-center">
                    <div className="text-purple-300 font-extrabold text-sm">
                      {selectedAvatar.channelBinding.totalAudiosSynthesized}
                    </div>
                    <div className="text-[10px] text-slate-400">Áudios & Falas</div>
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  <div className="text-center">
                    <div className="text-emerald-400 font-extrabold text-sm">
                      {selectedAvatar.channelBinding.publicationFrequency === 'daily' ? 'Diária' : 'Semanal'}
                    </div>
                    <div className="text-[10px] text-slate-400">Frequência</div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">"""

text = text.replace(old_wb, new_wb)

# 3. Add closing div for the space-y-4 wrapper
old_close = """            {/* CONTEÚDO DA ABA: VIDEO SWAP (JUTSU) */}
              {activeTab === 'jutsu' && (
                <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6 animate-fadeIn">
                  <VideoCharacterSwapStudio avatar={selectedAvatar} />
                </div>
              )}
            </div>
          </div>
        ) : null}"""

new_close = """            {/* CONTEÚDO DA ABA: VIDEO SWAP (JUTSU) */}
              {activeTab === 'jutsu' && (
                <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6 animate-fadeIn">
                  <VideoCharacterSwapStudio avatar={selectedAvatar} />
                </div>
              )}
            </div>
          </div>
          </div>
        ) : null}"""

text = text.replace(old_close, new_close)

# 4. Enhance the photo stage with Subtitles, Upload button, Expression switcher
old_stage = """                {/* Imagem do Palco com Proporção Otimizada */}
                <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-obsidian-900 border border-white/10 flex items-center justify-center">
                  <img
                    key={currentAngleImage}
                    src={currentAngleImage}
                    alt={`${selectedAvatar.name} - ${selectedAngle}`}
                    className="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105 animate-fadeIn"
                  />

                  {/* Badge de Ângulo Dinâmico */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-obsidian-950/80 backdrop-blur-md border border-white/20 text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider">
                    {selectedAngle === 'front' && '0° Frente'}
                    {selectedAngle === 'threeQuarter' && '45° 3/4'}
                    {selectedAngle === 'profile' && '90° Perfil'}
                    {selectedAngle === 'back' && '180° Costas'}
                  </div>

                  {/* Tag do Nicho */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-obsidian-950/80 backdrop-blur-md border border-cyber-cyan/40 text-[10px] font-mono text-cyber-cyan font-bold uppercase tracking-wider">
                    {selectedAvatar.soul.niche}
                  </div>

                  {/* Seletor Rápido de Ângulos */}
                  <div className="absolute bottom-3 inset-x-3 p-1.5 rounded-xl bg-obsidian-950/90 backdrop-blur-md border border-white/10 flex items-center justify-between text-[11px] font-mono">
                    <button
                      onClick={() => setSelectedAngle('front')}
                      className={`flex-1 py-1 rounded-lg text-center transition-all ${
                        selectedAngle === 'front'
                          ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Frente
                    </button>
                    <button
                      onClick={() => setSelectedAngle('threeQuarter')}
                      className={`flex-1 py-1 rounded-lg text-center transition-all ${
                        selectedAngle === 'threeQuarter'
                          ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      3/4
                    </button>
                    <button
                      onClick={() => setSelectedAngle('profile')}
                      className={`flex-1 py-1 rounded-lg text-center transition-all ${
                        selectedAngle === 'profile'
                          ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Perfil
                    </button>
                    <button
                      onClick={() => setSelectedAngle('back')}
                      className={`flex-1 py-1 rounded-lg text-center transition-all ${
                        selectedAngle === 'back'
                          ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Costas
                    </button>
                  </div>
                </div>"""

new_stage = """                {/* Imagem do Palco com Proporção Otimizada */}
                <div className="relative rounded-xl overflow-hidden aspect-[4/5] bg-obsidian-900 border border-white/10 flex items-center justify-center">
                  <img
                    key={currentAngleImage}
                    src={currentAngleImage}
                    alt={`${selectedAvatar.name} - ${selectedAngle}`}
                    className="w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105 animate-fadeIn"
                  />

                  {/* Equalizador e Closed Captions quando fala */}
                  {isSpeaking && currentSpokenText && (
                    <div className="absolute bottom-16 inset-x-3 p-3 rounded-xl bg-obsidian-950/95 border border-cyber-cyan/60 text-center backdrop-blur-md shadow-2xl animate-fadeIn z-20 space-y-1.5">
                      <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-cyber-cyan font-bold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
                        <span>Voz Ativa • {selectedAvatar.voice.engine.toUpperCase()}</span>
                      </div>
                      <p className="text-xs text-white font-medium italic">
                        &ldquo;{currentSpokenText}&rdquo;
                      </p>
                      <div className="flex items-center justify-center gap-1 pt-1">
                        <span className="w-1 h-3 bg-cyber-cyan rounded animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-5 bg-cyber-cyan rounded animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-2 bg-cyber-cyan rounded animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="w-1 h-6 bg-cyber-cyan rounded animate-bounce" style={{ animationDelay: '100ms' }} />
                        <span className="w-1 h-4 bg-cyber-cyan rounded animate-bounce" style={{ animationDelay: '200ms' }} />
                      </div>
                    </div>
                  )}

                  {/* Badge de Ângulo Dinâmico */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-obsidian-950/80 backdrop-blur-md border border-white/20 text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider">
                    {selectedAngle === 'front' && '0° Frente'}
                    {selectedAngle === 'threeQuarter' && '45° 3/4'}
                    {selectedAngle === 'profile' && '90° Perfil'}
                    {selectedAngle === 'back' && '180° Costas'}
                  </div>

                  {/* Tag do Nicho */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-obsidian-950/80 backdrop-blur-md border border-cyber-cyan/40 text-[10px] font-mono text-cyber-cyan font-bold uppercase tracking-wider">
                    {selectedAvatar.soul.niche}
                  </div>

                  {/* Seletor Rápido de Ângulos + Botão Upload */}
                  <div className="absolute bottom-3 inset-x-3 p-1.5 rounded-xl bg-obsidian-950/90 backdrop-blur-md border border-white/10 flex items-center justify-between text-[11px] font-mono gap-1">
                    <button
                      onClick={() => setSelectedAngle('front')}
                      className={`flex-1 py-1 rounded-lg text-center transition-all ${
                        selectedAngle === 'front'
                          ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Frente
                    </button>
                    <button
                      onClick={() => setSelectedAngle('threeQuarter')}
                      className={`flex-1 py-1 rounded-lg text-center transition-all ${
                        selectedAngle === 'threeQuarter'
                          ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      3/4
                    </button>
                    <button
                      onClick={() => setSelectedAngle('profile')}
                      className={`flex-1 py-1 rounded-lg text-center transition-all ${
                        selectedAngle === 'profile'
                          ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Perfil
                    </button>
                    <button
                      onClick={() => setSelectedAngle('back')}
                      className={`flex-1 py-1 rounded-lg text-center transition-all ${
                        selectedAngle === 'back'
                          ? 'bg-cyber-cyan text-obsidian-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Costas
                    </button>

                    <button
                      onClick={() => setIsUploadAngleModalOpen(true)}
                      title="Upload / Trocar Foto deste Ângulo"
                      className="px-2 py-1 rounded-lg bg-white/10 hover:bg-cyber-cyan hover:text-black text-slate-300 transition-all flex items-center gap-1"
                    >
                      <Camera className="w-3 h-3" />
                      <span className="hidden sm:inline">Trocar</span>
                    </button>
                  </div>
                </div>

                {/* Seletor Rápido de Micro-Expressões Faciais */}
                <div className="pt-2 flex items-center justify-between gap-1 overflow-x-auto text-[11px] font-mono">
                  <span className="text-slate-400 text-[10px] uppercase tracking-wider shrink-0 mr-1">Expressão:</span>
                  {[
                    { id: 'neutral', label: '😊 Neutro' },
                    { id: 'smile', label: '😄 Sorrindo' },
                    { id: 'sales', label: '🔥 Vendas' },
                    { id: 'serious', label: '🧐 Sério' },
                    { id: 'surprised', label: '😲 Surpreso' },
                  ].map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => {
                        setActiveExpression(exp.id as any);
                        toast.info('Expressão Simulada', `Ajustando micro-expressão de ${selectedAvatar.name} para ${exp.label}`);
                      }}
                      className={`px-2 py-0.5 rounded-lg border transition-all shrink-0 ${
                        activeExpression === exp.id
                          ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan font-bold'
                          : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {exp.label}
                    </button>
                  ))}
                </div>"""

text = text.replace(old_stage, new_stage)

# 5. Enhance Primary Actions with MultiModel Gen button and quick speech input
old_actions = """                {/* Ações Primárias Rápidas */}
                <div className="grid grid-cols-2 gap-2.5 mt-5">
                  <button
                    onClick={handleTestVoice}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isSpeaking
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                    }`}
                  >
                    {isSpeaking ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-cyber-cyan" />}
                    <span>{isSpeaking ? 'Parar Voz' : 'Ouvir Voz'}</span>
                  </button>

                  <button
                    onClick={handleQuickDownloadZip}
                    disabled={isExportingZip}
                    className="py-2 px-3 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-obsidian-950 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-md disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isExportingZip ? 'Gerando...' : 'Exportar .v5avatar'}</span>
                  </button>
                </div>"""

new_actions = """                {/* Ações Primárias Rápidas */}
                <div className="space-y-2 mt-5">
                  <button
                    onClick={() => setIsGenerateModalOpen(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyber-cyan hover:from-purple-500 hover:to-cyan-400 text-obsidian-950 font-extrabold text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>✨ Gerar com IA (Multi-Model Hub)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleTestVoice()}
                      className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isSpeaking
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                      }`}
                    >
                      {isSpeaking ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-cyber-cyan" />}
                      <span>{isSpeaking ? 'Parar Voz' : 'Ouvir Voz'}</span>
                    </button>

                    <button
                      onClick={handleQuickDownloadZip}
                      disabled={isExportingZip}
                      className="py-2 px-3 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-obsidian-950 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-md disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isExportingZip ? 'Gerando...' : 'Exportar .v5avatar'}</span>
                    </button>
                  </div>

                  {/* Bordões Rápidos de Teste Fonético */}
                  {selectedAvatar.soul.catchphrases && selectedAvatar.soul.catchphrases.length > 0 && (
                    <div className="pt-1 space-y-1">
                      <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
                        <span>Testar Bordão Rápido:</span>
                        <button
                          onClick={() => setShowCustomSpeechInput((prev) => !prev)}
                          className="text-cyber-cyan hover:underline"
                        >
                          {showCustomSpeechInput ? 'Fechar' : 'Digitar Frase'}
                        </button>
                      </div>

                      {showCustomSpeechInput ? (
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Digite o que o avatar deve falar..."
                            value={customSpeechText}
                            onChange={(e) => setCustomSpeechText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleTestVoice(customSpeechText);
                            }}
                            className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyber-cyan"
                          />
                          <button
                            onClick={() => handleTestVoice(customSpeechText)}
                            className="px-2.5 py-1 rounded-lg bg-cyber-cyan text-black font-mono font-bold text-xs"
                          >
                            Falar
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 overflow-x-auto pb-1">
                          {selectedAvatar.soul.catchphrases.map((phrase, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleTestVoice(phrase)}
                              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-mono text-slate-300 truncate max-w-[140px] text-left shrink-0"
                            >
                              &ldquo;{phrase}&rdquo;
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>"""

text = text.replace(old_actions, new_actions)

with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)

print('All patches applied successfully to page.tsx!')
