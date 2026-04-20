import { useRef } from 'react';
import { useGame } from '../context/GameContext';
import { CROP_MAP } from '../data/crops';
import { FarmPlot } from './FarmPlot';
import { Character } from './Character';
import { AnimalLayer } from './AnimalLayer';
import { ToastStack } from './ToastStack';

const DECOR = [
  { emoji: '🌲', style: { top: 4, left: 4, fontSize: 22 } },
  { emoji: '🌲', style: { top: 4, right: 4, fontSize: 22 } },
  { emoji: '🌲', style: { bottom: 22, left: 4, fontSize: 22 } },
  { emoji: '🌲', style: { bottom: 22, right: 4, fontSize: 22 } },
  { emoji: '🌸', style: { top: 28, left: 18, fontSize: 12 } },
  { emoji: '🌼', style: { top: 28, right: 18, fontSize: 12 } },
  { emoji: '🌿', style: { bottom: 44, left: 18, fontSize: 12 } },
  { emoji: '🍀', style: { bottom: 44, right: 18, fontSize: 12 } },
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
      {/* Decorations */}
      {DECOR.map((d, i) => (
        <span key={i} className="farm-decor" style={d.style as React.CSSProperties}>
          {d.emoji}
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
