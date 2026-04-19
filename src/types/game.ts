export type CropId = 'sunflower' | 'carrot' | 'potato' | 'pumpkin' | 'corn';

export type PlotState = 'empty' | 'planted' | 'ready';

export interface Crop {
  id: CropId;
  name: string;
  emoji: string;
  seedCost: number;
  reward: number;
  growTime: number;
  xp: number;
}

export interface Plot {
  id: number;
  state: PlotState;
  cropId: CropId | null;
  plantedAt: number | null;
}

export interface GameState {
  coins: number;
  xp: number;
  level: number;
  tick: number;
  plots: Plot[];
  inventory: Record<CropId, number>;
  selectedSeed: CropId | null;
}
