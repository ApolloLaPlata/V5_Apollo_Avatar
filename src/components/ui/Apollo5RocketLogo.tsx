'use client';

import React from 'react';

interface Apollo5RocketLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Apollo5RocketLogo({
  className = '',
  size = 'md',
  showText = true,
}: Apollo5RocketLogoProps) {
  const sizeMap = {
    sm: { width: 32, height: 44, text: 'text-sm' },
    md: { width: 44, height: 60, text: 'text-lg' },
    lg: { width: 64, height: 88, text: 'text-2xl' },
  };

  const { width, height, text } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        <svg
          width={width}
          height={height}
          viewBox="0 0 100 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]"
        >
          {/* Apollo 5 Saturn IB Body */}
          <path d="M50 5 L65 30 L65 105 L35 105 L35 30 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
          <path d="M50 5 L65 30 L50 25 L35 30 Z" fill="#0284c7" />
          
          {/* Insignia V5 */}
          <rect x="40" y="45" width="20" height="24" rx="3" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
          <text x="50" y="62" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">
            V5
          </text>

          {/* Wings / Fins */}
          <path d="M35 85 L18 115 L35 110 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <path d="M65 85 L82 115 L65 110 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />

          {/* Exhaust Flame */}
          <path d="M42 108 Q50 135 58 108" fill="#f59e0b" className="animate-pulse" />
          <path d="M45 108 Q50 126 55 108" fill="#ef4444" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-wider text-slate-100 ${text}`}>
            V5 <span className="text-cyan-400">AVATAR</span>
          </span>
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            Holding V5 Apollo · Capitania #12
          </span>
        </div>
      )}
    </div>
  );
}
