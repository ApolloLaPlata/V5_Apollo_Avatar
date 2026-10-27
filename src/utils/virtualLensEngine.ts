/**
 * V5 Apollo Avatar - Virtual Lens & Focal Length Engine
 * Holding V5 Apollo · Capitania #12 · Porta Local :3010
 * 
 * Optical physics, perspective compression and depth of field calibration for diffusion models
 */

export type FocalLengthMm = 24 | 35 | 50 | 85 | 135;
export type ApertureFStop = 'f/1.2' | 'f/1.4' | 'f/1.8' | 'f/2.0' | 'f/2.8' | 'f/4.0' | 'f/8.0';

export interface VirtualLensProfile {
  focalLength: FocalLengthMm;
  name: string;
  fieldOfViewDeg: number;
  distortionCharacter: string;
  recommendedAperture: ApertureFStop;
  opticalDescription: string;
  facialCompression: 'Expansiva (Editorial)' | 'Neutra (Olho Humano)' | 'Lisonjeira (Retrato de Ouro)' | 'Telefoto (Ultra Comprimida)';
}

export const CANONICAL_LENSES: Record<FocalLengthMm, VirtualLensProfile> = {
  24: {
    focalLength: 24,
    name: '24mm Grande Angular Dinâmica',
    fieldOfViewDeg: 84,
    distortionCharacter: 'perspectiva dinâmica e ampla com leve expansão tridimensional',
    recommendedAperture: 'f/4.0',
    opticalDescription: '24mm ultra-wide angle prime lens, architectural context, immersive perspective',
    facialCompression: 'Expansiva (Editorial)',
  },
  35: {
    focalLength: 35,
    name: '35mm Editorial Fashion',
    fieldOfViewDeg: 63,
    distortionCharacter: 'perspectiva natural de rua com ambiência de estúdio e corpo inteiro',
    recommendedAperture: 'f/2.0',
    opticalDescription: '35mm anamorphic prime lens, high-end editorial fashion photography, balanced environmental presence',
    facialCompression: 'Expansiva (Editorial)',
  },
  50: {
    focalLength: 50,
    name: '50mm Olho Humano (Nifty Fifty)',
    fieldOfViewDeg: 47,
    distortionCharacter: 'zero distorção de barril, proporções humanas idênticas à visão natural',
    recommendedAperture: 'f/1.8',
    opticalDescription: '50mm standard prime lens, natural human eye optical perspective, rectilinear geometry, zero distortion',
    facialCompression: 'Neutra (Olho Humano)',
  },
  85: {
    focalLength: 85,
    name: '85mm Retrato de Ouro (Beauty King)',
    fieldOfViewDeg: 28,
    distortionCharacter: 'compressão facial lisonjeira, contorno de mandíbula suave e bokeh cremoso',
    recommendedAperture: 'f/1.4',
    opticalDescription: '85mm f/1.4 portrait prime lens, creamy shallow depth-of-field circular bokeh, flattering facial compression, razor-sharp eye iris detail',
    facialCompression: 'Lisonjeira (Retrato de Ouro)',
  },
  135: {
    focalLength: 135,
    name: '135mm Telefoto Cinema',
    fieldOfViewDeg: 18,
    distortionCharacter: 'máxima compressão de planos com fundo completamente dissolvido',
    recommendedAperture: 'f/2.0',
    opticalDescription: '135mm telephoto cinema lens, extreme background compression, isolated subject separation, velvety smooth backdrop drop-off',
    facialCompression: 'Telefoto (Ultra Comprimida)',
  },
};

export function compileOpticalDirective(
  focalLength: FocalLengthMm,
  aperture: ApertureFStop,
  sensorFormat: 'full_frame_35mm' | 'medium_format_hasselblad' = 'medium_format_hasselblad'
): string {
  const lens = CANONICAL_LENSES[focalLength];
  const sensorDesc = sensorFormat === 'medium_format_hasselblad'
    ? 'medium format 53.4x40mm sensor'
    : '35mm full frame sensor';

  return `shot with ${lens.focalLength}mm prime lens at ${aperture}, ${lens.opticalDescription}, captured on ${sensorDesc}, zero barrel distortion, calibrated optical sharpness`;
}
