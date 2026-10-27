'use client';

import React from 'react';
import Apollo5RocketLogo from './Apollo5RocketLogo';
import { Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

export default function V5AppActivationBanner() {
  return (
    <div className="relative overflow-hidden border-b border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Apollo5RocketLogo size="sm" showText={false} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-100 tracking-wide flex items-center gap-1.5">
                V5 AVATAR
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  Capitania #12 Ativa
                </span>
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Porta :3010
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Agência Central de Identidades Digitais · Turnaround 360º · Voz Clonada · Atuação Multicanal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://v5apollo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>Central V5 Apollo</span>
            <ExternalLink className="w-3 h-3 text-cyan-400" />
          </a>
        </div>
      </div>
    </div>
  );
}
