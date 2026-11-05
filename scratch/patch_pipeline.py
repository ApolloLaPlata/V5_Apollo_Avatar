import os

page_path = os.path.join('src', 'app', 'page.tsx')
with open(page_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Import ContentPipelineStudio and Calendar
imp_target = "import MultiModelGenerateModal from '@/components/avatar/MultiModelGenerateModal';"
imp_rep = """import MultiModelGenerateModal from '@/components/avatar/MultiModelGenerateModal';
import ContentPipelineStudio from '@/components/avatar/ContentPipelineStudio';
import { Calendar } from 'lucide-react';"""

text = text.replace(imp_target, imp_rep)

# 2. Update type StudioTab
type_target = "type StudioTab = 'face' | 'voice' | 'soul' | 'jutsu' | 'export';"
type_rep = "type StudioTab = 'face' | 'voice' | 'soul' | 'jutsu' | 'pipeline' | 'export';"

text = text.replace(type_target, type_rep)

# 3. Add Tab Button
tab_btn_target = """                <button
                  onClick={() => setActiveTab('export')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    activeTab === 'export'
                      ? 'bg-cyber-cyan text-obsidian-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Exportação</span>
                </button>"""

tab_btn_rep = """                <button
                  onClick={() => setActiveTab('pipeline')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    activeTab === 'pipeline'
                      ? 'bg-emerald-500 text-obsidian-950 font-bold shadow-md ring-1 ring-emerald-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Esteira (7 Dias)</span>
                </button>
                <button
                  onClick={() => setActiveTab('export')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    activeTab === 'export'
                      ? 'bg-cyber-cyan text-obsidian-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Exportação</span>
                </button>"""

text = text.replace(tab_btn_target, tab_btn_rep)

# 4. Add Tab Content
content_target = """              {/* CONTEÚDO DA ABA: VIDEO SWAP (JUTSU) */}
              {activeTab === 'jutsu' && (
                <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6 animate-fadeIn">
                  <VideoCharacterSwapStudio avatar={selectedAvatar} />
                </div>
              )}"""

content_rep = """              {/* CONTEÚDO DA ABA: VIDEO SWAP (JUTSU) */}
              {activeTab === 'jutsu' && (
                <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6 animate-fadeIn">
                  <VideoCharacterSwapStudio avatar={selectedAvatar} />
                </div>
              )}

              {/* CONTEÚDO DA ABA: ESTEIRA DE CONSTÂNCIA (7 DIAS) */}
              {activeTab === 'pipeline' && (
                <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6 animate-fadeIn">
                  <ContentPipelineStudio
                    avatar={selectedAvatar}
                    onSpeakPhrase={(phrase) => handleTestVoice(phrase)}
                    onDispatchToVideoSwap={(topic) => {
                      setActiveTab('jutsu');
                      toast.info('Modo Jutsu Ativado', 'Tema carregado para Video Character Swap.');
                    }}
                  />
                </div>
              )}"""

text = text.replace(content_target, content_rep)

with open(page_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)

print('Content pipeline tab added successfully!')
