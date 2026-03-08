import { AspectRatio, UniverseStyle, GeneratedImage, ModelType, ImageResolution } from './types';

export const DEFINITIVE_PROMPT = "A surreal, mind-bending dimension where time and space collapse into a beautiful singularity, cinematic lighting, hyper-detailed";

export const ASPECT_RATIOS: AspectRatio[] = [
  { label: 'Square (1:1)', value: '1:1' },
  { label: 'Landscape (16:9)', value: '16:9' },
  { label: 'Portrait (9:16)', value: '9:16' },
  { label: 'Cinematic (4:1)', value: '4:1' },
  { label: 'Ultrawide (8:1)', value: '8:1' }
];

export const RESOLUTIONS: ImageResolution[] = [
  { label: '1K (Fast)', value: '1K' },
  { label: '2K (Detailed)', value: '2K' },
  { label: '4K (Masterpiece)', value: '4K' }
];

export const UNIVERSE_STYLES: UniverseStyle[] = [
  { name: 'Bioluminescent Macro', promptAddition: 'extreme macro photography, bioluminescent flora, glowing spores, depth of field, 8k resolution, photorealistic' },
  { name: 'Cyber-Renaissance', promptAddition: 'cyberpunk renaissance hybrid, ornate gold and neon details, volumetric lighting, masterpiece, octane render' },
  { name: 'Ethereal Dreamscape', promptAddition: 'soft pastel colors, ethereal mist, floating islands, dreamlike atmosphere, studio ghibli inspired, highly detailed' },
  { name: 'Dark Matter', promptAddition: 'dark fantasy, obsidian structures, crimson energy, ominous, cinematic shadows, high contrast, sharp focus' },
  { name: 'Liquid Chrome', promptAddition: 'flowing liquid metal, iridescent reflections, abstract 3D geometry, ray tracing, sleek, futuristic' },
  { name: 'Retro-Futurism', promptAddition: '70s sci-fi book cover style, vintage retro-futurism, muted warm colors, analog film grain, moebius style' }
];

export const GENESIS_MANIFESTATIONS: GeneratedImage[] = [];
