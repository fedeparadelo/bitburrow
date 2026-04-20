import type { Animal, AnimalType } from '../types/game';

export const ANIMALS: Animal[] = [
  {
    type: 'chicken',
    name: 'Chicken',
    emoji: '🐔',
    cost: 150,
    reward: 55,
    productionTime: 30_000,
    xp: 12,
    speed: 1.1,
    pauseFrames: [30, 80],
  },
  {
    type: 'rabbit',
    name: 'Rabbit',
    emoji: '🐰',
    cost: 280,
    reward: 90,
    productionTime: 50_000,
    xp: 20,
    speed: 1.5,
    pauseFrames: [10, 40],
  },
  {
    type: 'sheep',
    name: 'Sheep',
    emoji: '🐑',
    cost: 400,
    reward: 130,
    productionTime: 75_000,
    xp: 28,
    speed: 0.6,
    pauseFrames: [90, 180],
  },
  {
    type: 'cow',
    name: 'Cow',
    emoji: '🐄',
    cost: 600,
    reward: 190,
    productionTime: 110_000,
    xp: 40,
    speed: 0.4,
    pauseFrames: [120, 240],
  },
  {
    type: 'bee',
    name: 'Bee',
    emoji: '🐝',
    cost: 800,
    reward: 260,
    productionTime: 150_000,
    xp: 55,
    speed: 2.0,
    pauseFrames: [5, 20],
  },
];

export const ANIMAL_MAP: Record<AnimalType, Animal> = Object.fromEntries(
  ANIMALS.map(a => [a.type, a])
) as Record<AnimalType, Animal>;
