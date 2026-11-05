import os

page_path = os.path.join('src', 'app', 'page.tsx')
with open(page_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Imports
imp_target = "import ContentPipelineStudio from '@/components/avatar/ContentPipelineStudio';"
imp_rep = """import ContentPipelineStudio from '@/components/avatar/ContentPipelineStudio';
import ChannelBindingModal from '@/components/avatar/ChannelBindingModal';
import AvatarInteractiveChatModal from '@/components/avatar/AvatarInteractiveChatModal';"""

text = text.replace(imp_target, imp_rep)

# 2. States
state_target = "  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);"
state_rep = """  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);"""

text = text.replace(state_target, state_rep)

# 3. Channel banner button
banner_target = """                  <div className="text-center">
                    <div className="text-emerald-400 font-extrabold text-sm">
                      {selectedAvatar.channelBinding.publicationFrequency === 'daily' ? 'Diária' : 'Semanal'}
                    </div>
                    <div className="text-[10px] text-slate-400">Frequência</div>
                  </div>
                </div>
              </div>"""

banner_rep = """                  <div className="text-center">
                    <div className="text-emerald-400 font-extrabold text-sm">
                      {selectedAvatar.channelBinding.publicationFrequency === 'daily' ? 'Diária' : 'Semanal'}
                    </div>
                    <div className="text-[10px] text-slate-400">Frequência</div>
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  <button
                    onClick={() => setIsChannelModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>Configurar Canal</span>
                  </button>
                </div>
              </div>"""

text = text.replace(banner_target, banner_rep)

# 4. Add Conversar (Chat) button to actions
act_target = """                  <div className="grid grid-cols-2 gap-2">
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
                  </div>"""

act_rep = """                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleTestVoice()}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isSpeaking
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                      }`}
                    >
                      {isSpeaking ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-cyber-cyan" />}
                      <span>{isSpeaking ? 'Parar' : 'Voz'}</span>
                    </button>

                    <button
                      onClick={() => setIsChatModalOpen(true)}
                      className="py-2 px-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>

                    <button
                      onClick={handleQuickDownloadZip}
                      disabled={isExportingZip}
                      className="py-2 px-2.5 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-obsidian-950 font-bold text-xs font-mono flex items-center justify-center gap-1.5 transition-all shadow-md disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isExportingZip ? '...' : '.v5avatar'}</span>
                    </button>
                  </div>"""

text = text.replace(act_target, act_rep)

# 5. Render Modals at the bottom
modals_target = """      {/* Modal do Hub Multi-Modelos IA */}
      {selectedAvatar && (
        <MultiModelGenerateModal
          avatar={selectedAvatar}
          isOpen={isGenerateModalOpen}
          onClose={() => setIsGenerateModalOpen(false)}
          defaultAngle={selectedAngle}
        />
      )}
    </div>"""

modals_rep = """      {/* Modal do Hub Multi-Modelos IA */}
      {selectedAvatar && (
        <MultiModelGenerateModal
          avatar={selectedAvatar}
          isOpen={isGenerateModalOpen}
          onClose={() => setIsGenerateModalOpen(false)}
          defaultAngle={selectedAngle}
        />
      )}

      {/* Modal de Configuração do Canal Vinculado */}
      {selectedAvatar && (
        <ChannelBindingModal
          avatar={selectedAvatar}
          isOpen={isChannelModalOpen}
          onClose={() => setIsChannelModalOpen(false)}
        />
      )}

      {/* Modal de Chat Interativo com o Avatar */}
      {selectedAvatar && (
        <AvatarInteractiveChatModal
          avatar={selectedAvatar}
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
        />
      )}
    </div>"""

text = text.replace(modals_target, modals_rep)

with open(page_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)

print('Modals patched successfully!')
