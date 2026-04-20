import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import type { GameState, CropId, PlotState, AnimalType, AnimalState, Toast } from '../types/game';
import { CROP_MAP, XP_PER_LEVEL } from '../data/crops';
import { ANIMAL_MAP } from '../data/animals';

const PLOT_COUNT = 36;
let toastCounter = 0;

function makeToast(emoji: string, message: string, duration = 2500): Toast {
  return { id: ++toastCounter, emoji, message, expiresAt: Date.now() + duration };
}

function defaultState(): GameState {
  return {
    coins: 100,
    xp: 0,
    level: 1,
    tick: 0,
    plots: Array.from({ length: PLOT_COUNT }, (_, i) => ({
      id: i,
      state: 'empty' as PlotState,
      cropId: null,
      plantedAt: null,
    })),
    inventory: { sunflower: 5, carrot: 0, potato: 0, pumpkin: 0, corn: 0 },
    selectedSeed: null,
    animals: [],
    toasts: [],
  };
}

function loadState(): GameState {
  try {
    const raw = localStorage.getItem('bitburrow_v3');
    if (raw) return { ...defaultState(), ...JSON.parse(raw), tick: 0, toasts: [] };
  } catch { /* ignore */ }
  return defaultState();
}

type Action =
  | { type: 'SELECT_SEED'; seed: CropId }
  | { type: 'PLANT'; plotId: number }
  | { type: 'HARVEST'; plotId: number }
  | { type: 'HARVEST_ALL' }
  | { type: 'BUY_SEED'; cropId: CropId; qty: number }
  | { type: 'BUY_ANIMAL'; animalType: AnimalType }
  | { type: 'COLLECT_ANIMAL'; animalId: string }
  | { type: 'TICK' };

function withLevel(state: GameState, addedXp: number) {
  const newXp = state.xp + addedXp;
  const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
  const toasts = [...state.toasts];
  if (newLevel > state.level) {
    toasts.push(makeToast('⭐', `Level Up! Lv.${newLevel}!`, 4000));
  }
  return { xp: newXp, level: newLevel, toasts };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SELECT_SEED':
      return {
        ...state,
        selectedSeed: state.selectedSeed === action.seed ? null : action.seed,
      };

    case 'PLANT': {
      const { selectedSeed, inventory } = state;
      if (!selectedSeed || inventory[selectedSeed] <= 0) return state;
      const plot = state.plots[action.plotId];
      if (plot.state !== 'empty') return state;
      return {
        ...state,
        inventory: { ...inventory, [selectedSeed]: inventory[selectedSeed] - 1 },
        plots: state.plots.map(p =>
          p.id === action.plotId
            ? { ...p, state: 'planted' as PlotState, cropId: selectedSeed, plantedAt: Date.now() }
            : p
        ),
      };
    }

    case 'HARVEST': {
      const plot = state.plots[action.plotId];
      if (plot.state !== 'ready' || !plot.cropId) return state;
      const crop = CROP_MAP[plot.cropId];
      const leveled = withLevel(state, crop.xp);
      return {
        ...state,
        ...leveled,
        coins: state.coins + crop.reward,
        toasts: [...leveled.toasts, makeToast(crop.emoji, `+${crop.reward}🪙`)],
        plots: state.plots.map(p =>
          p.id === action.plotId
            ? { ...p, state: 'empty' as PlotState, cropId: null, plantedAt: null }
            : p
        ),
      };
    }

    case 'HARVEST_ALL': {
      const ready = state.plots.filter(p => p.state === 'ready' && p.cropId);
      if (ready.length === 0) return state;
      let coins = 0;
      let xp = 0;
      ready.forEach(p => {
        const crop = CROP_MAP[p.cropId!];
        coins += crop.reward;
        xp += crop.xp;
      });
      const leveled = withLevel(state, xp);
      return {
        ...state,
        ...leveled,
        coins: state.coins + coins,
        toasts: [...leveled.toasts, makeToast('🌾', `+${coins}🪙 Harvest!`)],
        plots: state.plots.map(p =>
          p.state === 'ready'
            ? { ...p, state: 'empty' as PlotState, cropId: null, plantedAt: null }
            : p
        ),
      };
    }

    case 'BUY_SEED': {
      const crop = CROP_MAP[action.cropId];
      const cost = crop.seedCost * action.qty;
      if (state.coins < cost) return state;
      return {
        ...state,
        coins: state.coins - cost,
        inventory: {
          ...state.inventory,
          [action.cropId]: state.inventory[action.cropId] + action.qty,
        },
      };
    }

    case 'BUY_ANIMAL': {
      const animal = ANIMAL_MAP[action.animalType];
      if (state.coins < animal.cost) return state;
      const newAnimal = {
        id: `${action.animalType}_${Date.now()}`,
        type: action.animalType,
        startX: 60 + Math.random() * 260,
        startY: 60 + Math.random() * 180,
        state: 'producing' as AnimalState,
        lastCollected: Date.now(),
      };
      return {
        ...state,
        coins: state.coins - animal.cost,
        animals: [...state.animals, newAnimal],
        toasts: [...state.toasts, makeToast(animal.emoji, `${animal.name} joined your farm!`)],
      };
    }

    case 'COLLECT_ANIMAL': {
      const owned = state.animals.find(a => a.id === action.animalId);
      if (!owned || owned.state !== 'ready') return state;
      const animal = ANIMAL_MAP[owned.type];
      const leveled = withLevel(state, animal.xp);
      return {
        ...state,
        ...leveled,
        coins: state.coins + animal.reward,
        toasts: [...leveled.toasts, makeToast(animal.emoji, `+${animal.reward}🪙 ${animal.name}!`)],
        animals: state.animals.map(a =>
          a.id === action.animalId
            ? { ...a, state: 'producing' as AnimalState, lastCollected: Date.now() }
            : a
        ),
      };
    }

    case 'TICK': {
      const now = Date.now();

      let plotsChanged = false;
      const plots = state.plots.map(p => {
        if (p.state !== 'planted' || !p.cropId || !p.plantedAt) return p;
        if (now - p.plantedAt >= CROP_MAP[p.cropId].growTime) {
          plotsChanged = true;
          return { ...p, state: 'ready' as PlotState };
        }
        return p;
      });

      let animalsChanged = false;
      const animals = state.animals.map(a => {
        if (a.state === 'producing' && now - a.lastCollected >= ANIMAL_MAP[a.type].productionTime) {
          animalsChanged = true;
          return { ...a, state: 'ready' as AnimalState };
        }
        return a;
      });

      const toasts = state.toasts.filter(t => t.expiresAt > now);

      return {
        ...state,
        tick: state.tick + 1,
        plots: plotsChanged ? plots : state.plots,
        animals: animalsChanged ? animals : state.animals,
        toasts,
      };
    }

    default:
      return state;
  }
}

interface GameCtx {
  state: GameState;
  selectSeed: (seed: CropId) => void;
  plant: (plotId: number) => void;
  harvest: (plotId: number) => void;
  harvestAll: () => void;
  buySeed: (cropId: CropId, qty: number) => void;
  buyAnimal: (type: AnimalType) => void;
  collectAnimal: (id: string) => void;
}

const GameContext = createContext<GameCtx | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    const id = setInterval(() => dispatch({ type: 'TICK' }), 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const { tick: _t, toasts: _toast, ...save } = state;
    localStorage.setItem('bitburrow_v3', JSON.stringify(save));
  }, [state]);

  const selectSeed    = useCallback((seed: CropId)       => dispatch({ type: 'SELECT_SEED', seed }), []);
  const plant         = useCallback((plotId: number)      => dispatch({ type: 'PLANT', plotId }), []);
  const harvest       = useCallback((plotId: number)      => dispatch({ type: 'HARVEST', plotId }), []);
  const harvestAll    = useCallback(()                    => dispatch({ type: 'HARVEST_ALL' }), []);
  const buySeed       = useCallback((cropId: CropId, qty: number) => dispatch({ type: 'BUY_SEED', cropId, qty }), []);
  const buyAnimal     = useCallback((animalType: AnimalType)      => dispatch({ type: 'BUY_ANIMAL', animalType }), []);
  const collectAnimal = useCallback((animalId: string)            => dispatch({ type: 'COLLECT_ANIMAL', animalId }), []);

  return (
    <GameContext.Provider value={{ state, selectSeed, plant, harvest, harvestAll, buySeed, buyAnimal, collectAnimal }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame outside GameProvider');
  return ctx;
}
