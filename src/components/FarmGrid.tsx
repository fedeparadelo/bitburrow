import { useGame } from '../context/GameContext';
import { CROP_MAP } from '../data/crops';
import { FarmPlot } from './FarmPlot';

export function FarmGrid() {
  const { state, harvestAll } = useGame();
  const readyCount = state.plots.filter(p => p.state === 'ready').length;
  const selectedCrop = state.selectedSeed ? CROP_MAP[state.selectedSeed] : null;
  const canPlantSelected =
    selectedCrop && state.inventory[state.selectedSeed!] > 0;

  return (
    <div className="farm-area">
      {canPlantSelected && (
        <div className="planting-hint">
          {selectedCrop.emoji} Click a plot to plant!
        </div>
      )}
      <div className="farm-grid">
        {state.plots.map(plot => (
          <FarmPlot key={plot.id} plot={plot} />
        ))}
      </div>
      {readyCount > 0 && (
        <button className="harvest-all-btn" onClick={harvestAll}>
          Harvest All ({readyCount}) ✓
        </button>
      )}
    </div>
  );
}
