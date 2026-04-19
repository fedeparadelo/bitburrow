import { useGame } from '../context/GameContext';
import { CROPS } from '../data/crops';
import type { CropId } from '../types/game';

function fmtTime(ms: number) {
  const s = ms / 1000;
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m`;
}

export function ShopTab() {
  const { state, buySeed } = useGame();

  return (
    <div className="shop-list">
      {CROPS.map(crop => {
        const can1 = state.coins >= crop.seedCost;
        const can5 = state.coins >= crop.seedCost * 5;
        return (
          <div key={crop.id} className="shop-item">
            <span className="shop-emoji">{crop.emoji}</span>
            <div className="shop-info">
              <span className="shop-name">{crop.name}</span>
              <span className="shop-meta">
                ⏱{fmtTime(crop.growTime)} → +{crop.reward}🪙 +{crop.xp}xp
              </span>
            </div>
            <button
              className={`shop-btn${!can1 ? ' disabled' : ''}`}
              disabled={!can1}
              onClick={() => buySeed(crop.id as CropId, 1)}
            >
              {crop.seedCost}🪙
            </button>
            <button
              className={`shop-btn${!can5 ? ' disabled' : ''}`}
              disabled={!can5}
              onClick={() => buySeed(crop.id as CropId, 5)}
            >
              ×5
            </button>
          </div>
        );
      })}
    </div>
  );
}
