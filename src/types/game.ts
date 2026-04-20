export type CropId = 'sunflower' | 'carrot' | 'potato' | 'pumpkin' | 'corn';
export type AnimalType = 'chicken' | 'rabbit' | 'sheep' | 'cow' | 'bee';
export type PlotState = 'empty' | 'planted' | 'ready';
export type AnimalState = 'producing' | 'ready';

export interface Crop {
  id: CropId;
  name: string;
  emoji: string;
  seedCost: number;
  reward: number;
  growTime: number;
  xp: number;
}

export interface Animal {
  type: AnimalType;
  name: string;
  emoji: string;
  cost: number;
  reward: number;
  productionTime: number;
  xp: number;
  speed: number;
  pauseFrames: [number, number];
}

export interface OwnedAnimal {
  id: string;
  type: AnimalType;
  startX: number;
  startY: number;
  state: AnimalState;
  lastCollected: number;
}

export interface Plot {
  id: number;
  state: PlotState;
  cropId: CropId | null;
  plantedAt: number | null;
}

export interface Toast {
  id: number;
  emoji: string;
  message: string;
  expiresAt: number;
}

export interface GameState {
  coins: number;
  xp: number;
  level: number;
  tick: number;
  plots: Plot[];
  inventory: Record<CropId, number>;
  selectedSeed: CropId | null;
  animals: OwnedAnimal[];
  toasts: Toast[];
}
