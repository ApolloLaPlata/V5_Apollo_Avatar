'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from '@/types/avatar';
import { toast } from '@/store/useToastStore';
import {
  X,
  MessageSquare,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';

interface AvatarInteractiveChatModalProps {
  avatar: Avatar;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'avatar';
  text: string;
  timestamp: string;
}

export default function AvatarInteractiveChatModal({
  avatar,
  isOpen,
  onClose,
}: AvatarInteractiveChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome_1',
      sender: 'avatar',
      text: `${avatar.soul.catchphrases?.[0] || 'Olá!'} Sou ${avatar.name}, operando como ${avatar.tagline}. Como posso te ajudar hoje no nicho de ${avatar.soul.niche}?`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  // Perguntas rápidas sugeridas
  const suggestedPrompts = [
    `Qual o seu segredo para criar conteúdo em ${avatar.soul.niche}?`,
    `Como você aplica o seu bordão no dia a dia?`,
    `O que você recomenda para quem está começando hoje?`,
  ];

  const handleSpeak = (textToSpeak: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'pt-BR';
    utterance.rate = avatar.voice?.speed || 1.0;
    utterance.pitch = (avatar.voice?.pitch || 0) * 0.1 + 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = (userMessageText: string) => {
    const text = userMessageText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Resposta inteligente contextual simulada respeitando o Soul DNA
    setTimeout(() => {
      const catchphrase = avatar.soul.catchphrases?.[0] || 'Isso aqui muda completamente o jogo.';
      let reply = '';

      if (text.toLowerCase().includes('segredo') || text.toLowerCase().includes('dica')) {
        reply = `O grande diferencial é nunca abrir mão da constância soberana. Em ${avatar.soul.niche}, 80% das pessoas desistem na primeira semana. ${catchphrase} A consistência de identidade visual e vocal é o que constrói audiência real.`;
      } else if (text.toLowerCase().includes('bordão') || text.toLowerCase().includes('fala')) {
        reply = `Meu bordão principal é exatamente: "${avatar.soul.catchphrases?.[0] || 'Soberania digital é poder'}". Ele reflete o pilar do meu canal e ajuda na retenção imediata nos primeiros 3 segundos.`;
      } else if (text.toLowerCase().includes('quem é você') || text.toLowerCase().includes('sobre')) {
        reply = `${avatar.soul.bio} Minha missão na Holding V5 é entregar valor sólido sem perder a autenticidade humana.`;
      } else {
        reply = `Excelente reflexão! Quando analisamos sob a ótica de ${avatar.soul.niche}, fica claro que ferramentas sem método não geram autoridade. ${catchphrase} O que você acha de testarmos esse conceito na prática?`;
      }

      const avatarMsg: ChatMessage = {
        id: `avatar_${Date.now()}`,
        sender: 'avatar',
        text: reply,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, avatarMsg]);
      setIsTyping(false);

      if (autoSpeak) {
        handleSpeak(reply);
      }
    }, 900);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    toast.success('Copiado', 'Texto copiado para a área de transferência.');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'avatar',
        text: `Chat reiniciado! Olá novamente, sou ${avatar.name}. O que deseja conversar?`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl h-[85vh] bg-obsidian-950 border border-cyber-cyan/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header do Chat */}
        <div className="p-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={avatar.avatarUrl}
                alt={avatar.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-cyber-cyan shadow-[0_0_10px_rgba(0,229,255,0.3)]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-obsidian-950" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{avatar.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {avatar.soul.archetype}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {avatar.channelBinding?.channelHandle || '@v5apollo'} • {avatar.voice.engine.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setAutoSpeak((prev) => !prev)}
              title={autoSpeak ? 'Voz Automática Ativa' : 'Voz Silenciada'}
              className={`p-2 rounded-lg border transition-all ${
                autoSpeak
                  ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={handleClearChat}
              title="Limpar Conversa"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                onClose();
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mensagens do Chat */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg) => {
            const isAvatar = msg.sender === 'avatar';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[85%] ${
                  isAvatar ? 'mr-auto items-start' : 'ml-auto flex-row-reverse items-start'
                }`}
              >
                {isAvatar ? (
                  <img
                    src={avatar.avatarUrl}
                    alt={avatar.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-cyber-cyan/40"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl text-xs space-y-1 relative group ${
                    isAvatar
                      ? 'bg-slate-900 border border-white/10 text-slate-100 rounded-tl-none shadow-sm'
                      : 'bg-cyber-cyan text-obsidian-950 font-medium rounded-tr-none shadow-md'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  
                  <div className="flex items-center justify-between gap-3 pt-1 text-[10px] opacity-60 font-mono">
                    <span>{msg.timestamp}</span>
                    {isAvatar && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleSpeak(msg.text)}
                          title="Ouvir Novamente"
                          className="hover:text-cyber-cyan"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          title="Copiar Mensagem"
                          className="hover:text-cyber-cyan"
                        >
                          {copiedIndex === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2.5 mr-auto items-start max-w-[85%] animate-fadeIn">
              <img
                src={avatar.avatarUrl}
                alt={avatar.name}
                className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 border border-cyber-cyan/40"
              />
              <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-slate-400 text-xs rounded-tl-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[10px] font-mono ml-1 text-slate-500">Digitando...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Sugestões Rápidas de Perguntas */}
        <div className="px-4 py-2 bg-slate-900/40 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono text-slate-400">
          <span className="shrink-0 text-slate-500">Sugerido:</span>
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 truncate max-w-[200px] shrink-0 text-left transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="p-3 bg-slate-900/90 border-t border-white/10 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Envie uma mensagem para ${avatar.name}...`}
            className="flex-1 bg-obsidian-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-cyan"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-cyber-cyan hover:bg-cyan-400 text-obsidian-950 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(0,229,255,0.2)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
