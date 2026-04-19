import type { Crop } from '../types/game';

export const XP_PER_LEVEL = 100;

export const CROPS: Crop[] = [
  { id: 'sunflower', name: 'Sunflower', emoji: '🌻', seedCost: 10,  reward: 22,  growTime: 15_000,  xp: 5   },
  { id: 'carrot',    name: 'Carrot',    emoji: '🥕', seedCost: 25,  reward: 60,  growTime: 30_000,  xp: 12  },
  { id: 'potato',    name: 'Potato',    emoji: '🥔', seedCost: 50,  reward: 125, growTime: 60_000,  xp: 25  },
  { id: 'pumpkin',   name: 'Pumpkin',   emoji: '🎃', seedCost: 100, reward: 265, growTime: 120_000, xp: 55  },
  { id: 'corn',      name: 'Corn',      emoji: '🌽', seedCost: 200, reward: 560, growTime: 300_000, xp: 120 },
];

export const CROP_MAP: Record<string, Crop> = Object.fromEntries(CROPS.map(c => [c.id, c]));
