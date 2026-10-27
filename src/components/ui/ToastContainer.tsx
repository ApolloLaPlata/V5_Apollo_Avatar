'use client';

import React from 'react';
import { useToastStore, ToastType } from '@/store/useToastStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, dismissToast } = useToastStore();

  if (toasts.length === 0) return null;

  const ICONS: Record<ToastType, React.ElementType> = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const STYLES: Record<ToastType, { border: string; glow: string; text: string; bg: string }> = {
    success: {
      border: 'border-emerald-500/40',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    error: {
      border: 'border-rose-500/40',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.25)]',
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
    },
    warning: {
      border: 'border-amber-500/40',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    info: {
      border: 'border-cyber-cyan/40',
      glow: 'shadow-[0_0_20px_rgba(0,229,255,0.25)]',
      text: 'text-cyber-cyan',
      bg: 'bg-cyber-cyan/10',
    },
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        const style = STYLES[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl glass-panel border ${style.border} ${style.glow} bg-obsidian-950/90 animate-in slide-in-from-bottom-3 duration-250 transition-all`}
          >
            <div className={`p-2 rounded-xl ${style.bg} ${style.text} shrink-0`}>
              <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0 space-y-0.5">
              <h4 className="text-xs font-bold text-slate-100 leading-snug">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
