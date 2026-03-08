export enum AppView {
  GENERATOR = 'Generator',
  ANALYZER = 'Analyzer',
  BLUEPRINT = 'Blueprint'
}

export enum ModelType {
  FLASH = 'Flash',
  PRO = 'Pro'
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: ModelType;
  timestamp: number;
}

export interface AspectRatio {
  label: string;
  value: string;
}

export interface ImageResolution {
  label: string;
  value: string;
}

export interface UniverseStyle {
  name: string;
  promptAddition: string;
}
