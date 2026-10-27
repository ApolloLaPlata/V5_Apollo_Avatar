'use client';

import React from 'react';
import { LightingPreset } from '@/types/avatar';
import { 
  Sun, 
  Lightbulb, 
  CircleDot, 
  Sparkles, 
  Zap, 
  Layers, 
  Check, 
  Flame 
} from 'lucide-react';

export interface StudioLightingPresetConfig {
  id: LightingPreset;
  title: string;
  subtitle: string;
  colorTemp: string;
  shadowSoftness: string;
  bestFor: string;
  gradientBadge: string;
  promptDirective: string;
}

export const STUDIO_LIGHTING_PRESETS: StudioLightingPresetConfig[] = [
  {
    id: 'softbox',
    title: 'Softbox Difuso 360º',
    subtitle: 'Iluminação difusa suave sem sombras duras, uniformidade clínica em todos os ângulos.',
    colorTemp: '5500K (Branco Puro)',
    shadowSoftness: 'Extra Suave (0.1)',
    bestFor: 'E-commerce, Catálogo e Model Sheet Base',
    gradientBadge: 'from-slate-200 to-slate-400 text-obsidian-950',
    promptDirective: 'diffuse 360-degree dual softbox studio lighting, perfectly balanced fill, zero harsh occlusions or shadows, 5500K neutral color temperature',
  },
  {
    id: 'rembrandt',
    title: 'Rembrandt Dramático',
    subtitle: 'Luz principal a 45º com triângulo de iluminação característico na bochecha oposta.',
    colorTemp: '4800K (Neutra Quente)',
    shadowSoftness: 'Média/Contraste (0.6)',
    bestFor: 'Canais Dark, Historiadores, VSLs e Cinema',
    gradientBadge: 'from-amber-400 to-amber-700 text-obsidian-950',
    promptDirective: 'cinematic Rembrandt studio lighting, 45-degree key light creating iconic subtle cheek highlight triangle, soft dark fill ratio 3:1, moody fine art portraiture',
  },
  {
    id: 'ring_light',
    title: 'Ring Light Beauty',
    subtitle: 'Brilho circular concêntrico na pupila, suavização de pele e contornos faciais nítidos.',
    colorTemp: '5600K (Estúdio Beauty)',
    shadowSoftness: 'Suave Frontal (0.2)',
    bestFor: 'UGC, Influencers, Vlogs e Maquiagem',
    gradientBadge: 'from-cyan-300 to-blue-500 text-obsidian-950',
    promptDirective: 'macro commercial ring light portrait lighting, circular pupil catchlights, ultra-crisp facial edge definition, flawless beauty diffusion',
  },
  {
    id: 'volumetric_neon',
    title: 'Volumétrica Neon Cyber',
    subtitle: 'Rim light duplo em Ciano e Âmbar, atmosfera futurista e recorte de silhueta de alto impacto.',
    colorTemp: 'Bicolor Cyberpunk',
    shadowSoftness: 'Dura & Recortada (0.8)',
    bestFor: 'VTubers, Streamers do Broadcaster e Games',
    gradientBadge: 'from-cyber-cyan via-purple-500 to-rose-500 text-white',
    promptDirective: 'volumetric dual-tone rim edge lighting, vivid cyber-cyan key illumination on left profile and warm amber rim light on right contour, deep obsidian atmospheric backdrop',
  },
  {
    id: 'natural_sunlight',
    title: 'Luz Solar Orgânica',
    subtitle: 'Claridade natural de janela com suaves reflexos dourados e atmosfera acolhedora.',
    colorTemp: '5200K (Luz do Dia)',
    shadowSoftness: 'Orgânica (0.4)',
    bestFor: 'Vloggers, Estilo de Vida e Atuação Cotidiana',
    gradientBadge: 'from-yellow-300 to-orange-400 text-obsidian-950',
    promptDirective: 'soft natural architectural daylight streaming from large studio window, gentle organic feathered shadows, warm natural skin tones, documentary cinema aesthetic',
  },
];

interface StudioLightingPresetSelectorProps {
  selectedPreset: LightingPreset;
  onSelectPreset: (preset: LightingPreset) => void;
}

export default function StudioLightingPresetSelector({
  selectedPreset,
  onSelectPreset,
}: StudioLightingPresetSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
          <Sun className="w-3.5 h-3.5 text-luxury-gold" />
          Presets de Iluminação de Estúdio Uniforme
        </label>
        <span className="text-[10px] font-mono text-slate-500">
          5 setups padronizados
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {STUDIO_LIGHTING_PRESETS.map((item) => {
          const isSelected = selectedPreset === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectPreset(item.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                isSelected
                  ? 'border-cyber-cyan bg-cyber-cyan/10 ring-1 ring-cyber-cyan shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                  : 'border-white/10 bg-obsidian-950/70 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="space-y-1.5">
                {/* Badge Header */}
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded uppercase bg-gradient-to-r ${item.gradientBadge}`}>
                    {item.id.replace('_', ' ')}
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-cyber-cyan flex items-center justify-center text-obsidian-950">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>

                <h5 className={`text-xs font-bold leading-tight ${isSelected ? 'text-cyber-cyan' : 'text-slate-200'}`}>
                  {item.title}
                </h5>

                <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">
                  {item.subtitle}
                </p>
              </div>

              {/* Specs Footer */}
              <div className="mt-3 pt-2 border-t border-white/5 space-y-0.5 text-[9px] font-mono text-slate-500">
                <div className="flex justify-between">
                  <span>Temp:</span>
                  <span className="text-slate-300 truncate">{item.colorTemp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ideal:</span>
                  <span className="text-cyber-cyan truncate">{item.bestFor.split(',')[0]}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
