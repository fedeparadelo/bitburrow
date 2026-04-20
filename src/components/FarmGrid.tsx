import { useRef } from 'react';
import { useGame } from '../context/GameContext';
import { CROP_MAP } from '../data/crops';
import { FarmPlot } from './FarmPlot';
import { Character } from './Character';
import { AnimalLayer } from './AnimalLayer';
import { ToastStack } from './ToastStack';
import { TreeSprite } from './sprites/TreeSprite';

const TREES: Array<{ variant: 'a' | 'b' | 'rock'; style: React.CSSProperties }> = [
  { variant: 'a',    style: { top: 4,   left: 4   } },
  { variant: 'a',    style: { top: 4,   right: 4  } },
  { variant: 'b',    style: { bottom: 30, left: 4   } },
  { variant: 'b',    style: { bottom: 30, right: 4  } },
  { variant: 'a',    style: { top: 4,   left: '47%' } },
  { variant: 'rock', style: { bottom: 36, left: '38%' } },
  { variant: 'rock', style: { bottom: 36, right: '38%' } },
  { variant: 'b',    style: { top: 42,  left: 6   } },
  { variant: 'a',    style: { top: 42,  right: 6  } },
];

export function FarmGrid() {
  const { state, harvestAll } = useGame();
  const farmRef = useRef<HTMLDivElement>(null);
  const readyCount = state.plots.filter(p => p.state === 'ready').length;
  const animalReadyCount = state.animals.filter(a => a.state === 'ready').length;
  const selectedCrop = state.selectedSeed ? CROP_MAP[state.selectedSeed] : null;
  const canPlantSelected = selectedCrop && state.inventory[state.selectedSeed!] > 0;

  return (
    <div className="farm-area" ref={farmRef}>
      {/* SVG tree / rock decorations */}
      {TREES.map((t, i) => (
        <span key={i} className="farm-decor" style={t.style as React.CSSProperties}>
          <TreeSprite variant={t.variant} />
        </span>
      ))}

      {/* Animals */}
      <AnimalLayer farmRef={farmRef} />

      {/* Character */}
      <Character containerRef={farmRef} />

      {/* Toasts */}
      <ToastStack />

      {/* Hint */}
      {canPlantSelected && (
        <div className="planting-hint">
          {selectedCrop.emoji} Click a plot to plant!
        </div>
      )}

      {/* Grid */}
      <div className="farm-grid">
        {state.plots.map(plot => (
          <FarmPlot key={plot.id} plot={plot} />
        ))}
      </div>

      {/* Harvest All */}
      {(readyCount > 0 || animalReadyCount > 0) && (
        <div className="harvest-row">
          {readyCount > 0 && (
            <button className="harvest-all-btn" onClick={harvestAll}>
              🌾 Harvest ({readyCount})
            </button>
          )}
          {animalReadyCount > 0 && (
            <span className="animal-ready-hint">
              🐾 {animalReadyCount} animal{animalReadyCount > 1 ? 's' : ''} ready! Click them!
            </span>
          )}
        </div>
      )}

      <div className="controls-hint">WASD / ← ↑ → ↓ to move</div>
    </div>
  );
}
