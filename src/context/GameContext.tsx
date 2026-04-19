import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';
import type { GameState, CropId, PlotState } from '../types/game';
import { CROP_MAP, XP_PER_LEVEL } from '../data/crops';

const PLOT_COUNT = 16;

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
  };
}

function loadState(): GameState {
  try {
    const raw = localStorage.getItem('bitburrow_v1');
    if (raw) return { ...defaultState(), ...JSON.parse(raw), tick: 0 };
  } catch {
    // ignore
  }
  return defaultState();
}

type Action =
  | { type: 'SELECT_SEED'; seed: CropId }
  | { type: 'PLANT'; plotId: number }
  | { type: 'HARVEST'; plotId: number }
  | { type: 'HARVEST_ALL' }
  | { type: 'BUY_SEED'; cropId: CropId; qty: number }
  | { type: 'TICK' };

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
      const newXp = state.xp + crop.xp;
      return {
        ...state,
        coins: state.coins + crop.reward,
        xp: newXp,
        level: Math.floor(newXp / XP_PER_LEVEL) + 1,
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
      const newXp = state.xp + xp;
      return {
        ...state,
        coins: state.coins + coins,
        xp: newXp,
        level: Math.floor(newXp / XP_PER_LEVEL) + 1,
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

    case 'TICK': {
      const now = Date.now();
      let changed = false;
      const plots = state.plots.map(p => {
        if (p.state !== 'planted' || !p.cropId || !p.plantedAt) return p;
        if (now - p.plantedAt >= CROP_MAP[p.cropId].growTime) {
          changed = true;
          return { ...p, state: 'ready' as PlotState };
        }
        return p;
      });
      return { ...state, tick: state.tick + 1, plots: changed ? plots : state.plots };
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
}

const GameContext = createContext<GameCtx | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    const id = setInterval(() => dispatch({ type: 'TICK' }), 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const { tick: _tick, ...save } = state;
    localStorage.setItem('bitburrow_v1', JSON.stringify(save));
  }, [state]);

  const selectSeed = useCallback((seed: CropId) => dispatch({ type: 'SELECT_SEED', seed }), []);
  const plant = useCallback((plotId: number) => dispatch({ type: 'PLANT', plotId }), []);
  const harvest = useCallback((plotId: number) => dispatch({ type: 'HARVEST', plotId }), []);
  const harvestAll = useCallback(() => dispatch({ type: 'HARVEST_ALL' }), []);
  const buySeed = useCallback((cropId: CropId, qty: number) => dispatch({ type: 'BUY_SEED', cropId, qty }), []);

  return (
    <GameContext.Provider value={{ state, selectSeed, plant, harvest, harvestAll, buySeed }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame outside GameProvider');
  return ctx;
}
