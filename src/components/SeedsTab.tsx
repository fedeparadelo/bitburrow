import { useGame } from '../context/GameContext';
import { CROPS } from '../data/crops';
import type { CropId } from '../types/game';

export function SeedsTab() {
  const { state, selectSeed } = useGame();
  const ownedCrops = CROPS.filter(c => state.inventory[c.id] > 0);

  if (ownedCrops.length === 0) {
    return (
      <div className="empty-state">
        No seeds! Buy some in the Shop tab.
      </div>
    );
  }

  return (
    <div className="seeds-grid">
      {ownedCrops.map(crop => (
        <button
          key={crop.id}
          className={`seed-btn${state.selectedSeed === crop.id ? ' selected' : ''}`}
          onClick={() => selectSeed(crop.id as CropId)}
        >
          <span className="seed-emoji">{crop.emoji}</span>
          <span className="seed-name">{crop.name}</span>
          <span className="seed-count">×{state.inventory[crop.id]}</span>
        </button>
      ))}
    </div>
  );
}
