'use client';

import React, { useState, useMemo } from 'react';
import { useAvatarStore } from '@/store/useAvatarStore';
import { AvatarProfile, AvatarType } from '@/types/avatar';
import {
  filterAndSortAvatars,
  extractUniqueNiches,
  computeCatalogStats,
  DashboardFilterOptions,
  SortField,
  SortOrder,
  SyncFilterTarget,
} from '@/utils/characterManagementEngine';
import AvatarCard from './AvatarCard';
import {
  Users,
  Search,
  Filter,
  Layers,
  LayoutGrid,
  List,
  Radio,
  ArrowUpDown,
  Sparkles,
  CheckCircle2,
  Share2,
  Mic,
  Bot,
  Copy,
  Trash2,
  Check,
  Globe,
  RefreshCw,
  X,
} from 'lucide-react';

interface CentralCharacterManagementDashboardProps {
  onOpenCreateModal?: () => void;
}

export default function CentralCharacterManagementDashboard({
  onOpenCreateModal,
}: CentralCharacterManagementDashboardProps) {
  const { avatars, selectedAvatarId, selectAvatar, duplicateAvatar, deleteAvatar } = useAvatarStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSyncTarget, setSelectedSyncTarget] = useState<SyncFilterTarget>('all');
  const [liveOnly, setLiveOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Nichos únicos presentes no catálogo
  const availableNiches = useMemo(() => extractUniqueNiches(avatars), [avatars]);

  // Estatísticas agregadas
  const stats = useMemo(() => computeCatalogStats(avatars), [avatars]);

  // Lista filtrada e ordenada
  const filteredAvatars = useMemo(() => {
    const options: DashboardFilterOptions = {
      searchTerm,
      selectedNiche,
      selectedType,
      selectedSyncTarget,
      liveOnly,
      sortBy,
      sortOrder,
    };
    return filterAndSortAvatars(avatars, options);
  }, [avatars, searchTerm, selectedNiche, selectedType, selectedSyncTarget, liveOnly, sortBy, sortOrder]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedNiche('all');
    setSelectedType('all');
    setSelectedSyncTarget('all');
    setLiveOnly(false);
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedNiche !== 'all' ||
    selectedType !== 'all' ||
    selectedSyncTarget !== 'all' ||
    liveOnly;

  return (
    <div className="bg-obsidian-900/90 border border-cyber-cyan/30 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative space-y-6">
      {/* Header com Metadados & Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-mono tracking-wider uppercase bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 rounded-full">
              Fase 10 · Etapa 097
            </span>
            <span className="text-xs font-mono text-slate-400">Holding V5 Apollo · Registro Civil</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
            <Users className="w-5 h-5 text-cyber-cyan" />
            Dashboard Central de Gestão de Personagens & Atores Virtuais
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Visão unificada em grade e tabela com filtros rápidos por nicho, tipo, transmissões ao vivo e sincronização com capitanias.
          </p>
        </div>

        {/* Badges de Telemetria */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="bg-black/50 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <span className="text-slate-400">Total:</span>
            <strong className="text-cyber-cyan font-bold">{stats.total}</strong>
          </div>
          <div className="bg-black/50 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-slate-400">Ao Vivo:</span>
            <strong className="text-rose-400 font-bold">{stats.liveCount}</strong>
          </div>
          <div className="bg-black/50 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <span className="text-slate-400">Nichos:</span>
            <strong className="text-purple-400 font-bold">{stats.uniqueNichesCount}</strong>
          </div>
          <div className="bg-black/50 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <span className="text-slate-400">Broadcaster:</span>
            <strong className="text-emerald-400 font-bold">{stats.syncedBroadcaster}</strong>
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Controles */}
      <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Busca Textual */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por nome, bio, nicho..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtro de Nicho */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyber-cyan"
            >
              <option value="all">Todos os Nichos ({availableNiches.length})</option>
              {availableNiches.map((niche) => (
                <option key={niche} value={niche}>
                  {niche}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de Tipo */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyber-cyan"
            >
              <option value="all">Todos os Tipos de Avatar</option>
              <option value="influencer">Influencer</option>
              <option value="actor">Ator / Apresentador</option>
              <option value="streamer">Streamer 24/7</option>
              <option value="support_agent">Agente de Suporte</option>
              <option value="mascot">Mascote</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          {/* Filtro de Sincronia de Capitania */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedSyncTarget}
              onChange={(e) => setSelectedSyncTarget(e.target.value as SyncFilterTarget)}
              className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyber-cyan"
            >
              <option value="all">Sincronia: Todas Capitanias</option>
              <option value="broadcaster">V5 Broadcaster (:3008)</option>
              <option value="prisma">V5 Prisma (:3000)</option>
              <option value="sound">V5 Sound (:3008)</option>
              <option value="edit">V5 Edit Web (:3001)</option>
              <option value="finders">V5 Finders</option>
            </select>
          </div>
        </div>

        {/* Linha Secundária: Ordenação, Toggle Live e Toggle View */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
          <div className="flex items-center gap-3">
            {/* Toggle Ao Vivo */}
            <button
              type="button"
              onClick={() => setLiveOnly(!liveOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 border ${
                liveOnly
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/10'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Somente Ao Vivo</span>
            </button>

            {/* Ordenação */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortField)}
                className="bg-black/60 border border-white/10 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyber-cyan"
              >
                <option value="createdAt">Data de Registro</option>
                <option value="name">Nome Alfabético</option>
                <option value="conversations">Total Conversas</option>
                <option value="updatedAt">Última Modificação</option>
              </select>

              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono"
                title={sortOrder === 'asc' ? 'Ordem Crescente' : 'Ordem Decrescente'}
              >
                {sortOrder === 'asc' ? '↑ ASC' : '↓ DESC'}
              </button>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-[11px] font-mono text-rose-400 hover:underline flex items-center gap-1 ml-2"
              >
                <X className="w-3 h-3" /> Limpar Filtros
              </button>
            )}
          </div>

          {/* Toggle Modo Grade / Modo Tabela */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-cyber-cyan text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Modo Grade Visual"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-cyber-cyan text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Modo Tabela / Alta Densidade"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Message */}
      {feedbackMessage && (
        <div className="p-3 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-xl text-xs font-mono text-cyber-cyan flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Contador de Resultados */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
        <span>
          Exibindo <strong className="text-cyber-cyan">{filteredAvatars.length}</strong> de{' '}
          <strong className="text-white">{avatars.length}</strong> personagens
        </span>
        {hasActiveFilters && (
          <span className="text-amber-400 text-[11px]">Filtros aplicados</span>
        )}
      </div>

      {/* Conteúdo: Visualização em Grade */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredAvatars.map((av) => (
            <AvatarCard
              key={av.id}
              avatar={av}
              isSelected={av.id === selectedAvatarId}
              onSelect={() => selectAvatar(av.id)}
            />
          ))}
        </div>
      )}

      {/* Conteúdo: Visualização em Tabela Compacta */}
      {viewMode === 'table' && (
        <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden shadow-inner">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 border-b border-white/10 font-mono text-[11px] text-slate-400 uppercase">
                <tr>
                  <th className="px-4 py-3">Avatar</th>
                  <th className="px-4 py-3">Nicho & Tipo</th>
                  <th className="px-4 py-3">Voz DNA</th>
                  <th className="px-4 py-3">Canal / Msg</th>
                  <th className="px-4 py-3">Sincronia</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredAvatars.map((av) => {
                  const isSelected = av.id === selectedAvatarId;
                  return (
                    <tr
                      key={av.id}
                      onClick={() => selectAvatar(av.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyber-cyan/10 hover:bg-cyber-cyan/15'
                          : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      {/* Avatar e Nome */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={av.avatarUrl}
                            alt={av.name}
                            loading="lazy"
                            decoding="async"
                            className="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0"
                          />
                          <div>
                            <p
                              className={`font-bold transition-colors ${
                                isSelected ? 'text-cyber-cyan' : 'text-slate-100'
                              }`}
                            >
                              {av.name}
                            </p>
                            <p className="text-[11px] text-slate-400 line-clamp-1 max-w-[200px]">
                              {av.tagline}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Nicho & Tipo */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-purple-300 block">
                          {av.soul.niche || 'Geral'}
                        </span>
                        <span className="text-[10px] uppercase font-mono text-slate-500">
                          {av.type}
                        </span>
                      </td>

                      {/* Voz DNA */}
                      <td className="px-4 py-3 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Mic className="w-3.5 h-3.5 text-purple-400" />
                          <span className="text-slate-200 uppercase">{av.voice.engine}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {av.voice.tone}
                        </span>
                      </td>

                      {/* Canal / Live */}
                      <td className="px-4 py-3 font-mono">
                        {av.channel.isLiveActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                            AO VIVO
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">
                            {av.channel.totalConversations || 0} msgs
                          </span>
                        )}
                      </td>

                      {/* Sincronia */}
                      <td className="px-4 py-3 font-mono text-[10px]">
                        <div className="flex items-center gap-1">
                          <span
                            title="V5 Broadcaster"
                            className={
                              av.syncedSites.broadcaster ? 'text-cyber-cyan font-bold' : 'text-slate-600'
                            }
                          >
                            B
                          </span>
                          <span>·</span>
                          <span
                            title="V5 Prisma"
                            className={
                              av.syncedSites.prisma ? 'text-purple-400 font-bold' : 'text-slate-600'
                            }
                          >
                            P
                          </span>
                          <span>·</span>
                          <span
                            title="V5 Sound"
                            className={
                              av.syncedSites.sound ? 'text-amber-400 font-bold' : 'text-slate-600'
                            }
                          >
                            S
                          </span>
                          <span>·</span>
                          <span
                            title="V5 Edit"
                            className={
                              av.syncedSites.edit ? 'text-blue-400 font-bold' : 'text-slate-600'
                            }
                          >
                            E
                          </span>
                        </div>
                      </td>

                      {/* Ações */}
                      <td className="px-4 py-3 text-right">
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              const dup = duplicateAvatar(av.id);
                              if (dup) setFeedbackMessage(`Avatar "${dup.name}" clonado com sucesso.`);
                            }}
                            className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                            title="Duplicar"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remover "${av.name}"?`)) {
                                deleteAvatar(av.id);
                                setFeedbackMessage(`Avatar "${av.name}" removido.`);
                              }
                            }}
                            className="p-1 rounded bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredAvatars.length === 0 && (
        <div className="p-12 text-center bg-black/30 border border-dashed border-white/10 rounded-xl space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">Nenhum avatar encontrado com esses filtros</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tente remover os filtros ou buscar por outro termo de pesquisa.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-4 py-2 bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 text-xs font-mono rounded-lg hover:bg-cyber-cyan/30 transition-all"
          >
            Resetar Todos os Filtros
          </button>
        </div>
      )}
    </div>
  );
}
