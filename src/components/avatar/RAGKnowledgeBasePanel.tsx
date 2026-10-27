'use client';

import React, { useState } from 'react';
import { RAGKnowledgeItem } from '@/types/avatar';
import {
  CANONICAL_KNOWLEDGE_DOCS,
  queryRAGKnowledge,
} from '@/utils/ragKnowledgeEngine';
import { useAvatarStore } from '@/store/useAvatarStore';
import { toast } from '@/store/useToastStore';
import {
  Database,
  Search,
  Plus,
  Trash2,
  Sparkles,
  BookOpen,
  Tag,
  CheckCircle2,
  Copy,
  Check,
  Code,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface RAGKnowledgeBasePanelProps {
  avatarId?: string;
  avatarName?: string;
}

export default function RAGKnowledgeBasePanel({
  avatarId = 'avatar-default',
  avatarName = 'Personagem Soberano',
}: RAGKnowledgeBasePanelProps) {
  const { avatars, updateAvatar } = useAvatarStore();
  const currentAvatar = avatars.find((a) => a.id === avatarId) || avatars[0];

  const initialDocs =
    currentAvatar?.soul?.structuredKnowledgeBase || CANONICAL_KNOWLEDGE_DOCS;

  const [docs, setDocs] = useState<RAGKnowledgeItem[]>(initialDocs);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Formulário de Ingestão
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<RAGKnowledgeItem['category']>('technical_faq');
  const [newContent, setNewContent] = useState<string>('');
  const [newTags, setNewTags] = useState<string>('');

  // Simulador de Recuperação RAG
  const [searchQuery, setSearchQuery] = useState<string>('Como funciona a clonagem de voz no V5 Sound?');
  const [retrievalResult, setRetrievalResult] = useState<ReturnType<typeof queryRAGKnowledge> | null>(null);
  const [copiedContext, setCopiedContext] = useState<boolean>(false);

  const syncStore = (updatedDocs: RAGKnowledgeItem[]) => {
    if (!currentAvatar) return;
    updateAvatar(avatarId, {
      soul: {
        ...currentAvatar.soul,
        structuredKnowledgeBase: updatedDocs,
        knowledgeBaseDocs: updatedDocs.map((d) => `${d.title}: ${d.content}`),
      },
    });
  };

  const handleAddDocument = () => {
    const trimmedTitle = newTitle.trim();
    const trimmedContent = newContent.trim();
    if (!trimmedTitle || !trimmedContent) return;

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const newDoc: RAGKnowledgeItem = {
      id: `doc_custom_${Date.now()}`,
      title: trimmedTitle,
      category: newCategory,
      content: trimmedContent,
      tags: tagsArray.length > 0 ? tagsArray : ['geral'],
      lastUpdated: new Date().toISOString(),
    };

    const updated = [...docs, newDoc];
    setDocs(updated);
    syncStore(updated);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    toast.success('Documento Ingestado!', `"${trimmedTitle}" adicionado à base RAG.`);
  };

  const handleRemoveDocument = (id: string) => {
    const updated = docs.filter((d) => d.id !== id);
    setDocs(updated);
    syncStore(updated);
    toast.info('Documento Excluído', 'Fato removido da base de conhecimento.');
  };

  const handleRunSearch = () => {
    const res = queryRAGKnowledge(searchQuery, docs, 2);
    setRetrievalResult(res);
    if (res.results.length > 0) {
      toast.success(
        'Busca Concluída',
        `${res.results.length} documento(s) relevante(s) recuperado(s). Maior score: ${res.results[0].score}%.`
      );
    } else {
      toast.info('Sem Correspondência', 'Nenhum fato atingiu o limiar de relevância.');
    }
  };

  const handleCopyCompiledContext = () => {
    if (!retrievalResult) return;
    navigator.clipboard.writeText(retrievalResult.compiledContext);
    setCopiedContext(true);
    toast.success('Contexto Copiado!', 'Texto formatado transferido para a área de transferência.');
    setTimeout(() => setCopiedContext(false), 2000);
  };

  const filteredDocs = docs.filter((d) => {
    if (selectedCategory === 'all') return true;
    return d.category === selectedCategory;
  });

  return (
    <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 shadow-[0_0_12px_rgba(0,229,255,0.15)]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Construtor de Base de Conhecimento RAG do Avatar
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-cyan/20 text-cyber-cyan font-bold border border-cyber-cyan/30">
                {docs.length} Documentos RAG
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Ingestão de fatos, regras de negócio e busca vetorial de contexto factual para {avatarName}
            </p>
          </div>
        </div>
      </div>

      {/* Simulador de Busca Semântica RAG */}
      <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-cyber-cyan" />
            Simulador de Consulta RAG (Retrieval Tester):
          </span>
          <span className="text-[10px] text-slate-500">Avalie a relevância de recuperação</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunSearch()}
            placeholder="Digite uma pergunta factual (Ex: 'Qual a latência da voz?')..."
            className="flex-1 px-3 py-2 rounded-xl bg-black/70 border border-white/10 text-xs text-slate-200 focus:border-cyber-cyan font-sans"
          />
          <button
            onClick={handleRunSearch}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyber-cyan/20 hover:bg-cyber-cyan/30 text-cyber-cyan text-xs font-bold border border-cyber-cyan/40 transition-colors shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Consultar</span>
          </button>
        </div>

        {retrievalResult && (
          <div className="p-3.5 rounded-xl bg-black/80 border border-cyber-cyan/30 text-xs space-y-3 animate-in fade-in-50">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px]">
              <span className="font-bold text-cyber-cyan flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {retrievalResult.results.length} Documentos Recuperados no Top-K
              </span>
              <button
                onClick={handleCopyCompiledContext}
                className="text-cyber-cyan hover:underline flex items-center gap-1 text-[10px]"
              >
                {copiedContext ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedContext ? 'Copiado' : 'Copiar Contexto'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {retrievalResult.results.map((r, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-black/60 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-100 text-[11px] truncate">{r.doc.title}</strong>
                    <span className="text-[10px] font-bold text-cyber-gold bg-cyber-gold/10 px-2 py-0.5 rounded border border-cyber-gold/20">
                      {r.score}% Match
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-3 font-sans">{r.doc.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filtros de Categoria */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[11px] text-slate-500 mr-2 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Categoria:
        </span>
        {[
          { id: 'all', label: 'Todos os Fatos' },
          { id: 'holding_rule', label: 'Regras da Holding' },
          { id: 'technical_faq', label: 'FAQ Técnico' },
          { id: 'product_catalog', label: 'Catálogo de Produtos' },
          { id: 'personal_fact', label: 'Fatos Pessoais' },
          { id: 'pricing_policy', label: 'Política & Afiliados' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              selectedCategory === cat.id
                ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 font-bold'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-transparent'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lista de Documentos da Base RAG */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-4 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-slate-100 text-xs font-sans line-clamp-1">{doc.title}</span>
                <button
                  onClick={() => handleRemoveDocument(doc.id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                  title="Remover fato"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="inline-block text-[9px] uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyber-cyan font-bold">
                {doc.category.replace('_', ' ')}
              </span>

              <p className="text-[11px] text-slate-300 font-sans leading-relaxed line-clamp-4">
                {doc.content}
              </p>
            </div>

            {/* Tags do Documento */}
            <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 flex-wrap">
              <Tag className="w-3 h-3 text-slate-500 shrink-0" />
              {doc.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[9px] px-1.5 py-0.2 rounded bg-black/50 text-slate-400 font-mono border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Formulário de Ingestão de Novo Documento */}
      <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3">
        <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <Plus className="w-3.5 h-3.5 text-cyber-cyan" />
          Ingestar Novo Fato na Base de Conhecimento RAG:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Título do Documento (Ex: 'Horário de Transmissão Live')"
            className="px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-slate-100 text-xs focus:border-cyber-cyan font-sans"
          />

          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as RAGKnowledgeItem['category'])}
            className="px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-slate-200 text-xs focus:border-cyber-cyan"
          >
            <option value="holding_rule">Regras da Holding</option>
            <option value="technical_faq">FAQ Técnico</option>
            <option value="product_catalog">Catálogo de Produtos</option>
            <option value="personal_fact">Fatos Pessoais</option>
            <option value="pricing_policy">Política & Preços</option>
          </select>
        </div>

        <textarea
          rows={3}
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Conteúdo factual completo que o LLM deve utilizar como fonte inabalável da verdade..."
          className="w-full px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-slate-100 text-xs focus:border-cyber-cyan font-sans resize-none"
        />

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
            placeholder="Tags separadas por vírgula (Ex: 'live, horario, obs, broadcaster')..."
            className="flex-1 px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-slate-100 text-xs focus:border-cyber-cyan font-sans"
          />
          <button
            onClick={handleAddDocument}
            className="px-4 py-2 rounded-xl bg-cyber-cyan/20 hover:bg-cyber-cyan/30 text-cyber-cyan text-xs font-bold border border-cyber-cyan/40 transition-colors shrink-0"
          >
            Ingestar Fato
          </button>
        </div>
      </div>
    </div>
  );
}
