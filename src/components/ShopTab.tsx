import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CROPS } from '../data/crops';
import { ANIMALS } from '../data/animals';
import type { CropId, AnimalType } from '../types/game';

function fmtTime(ms: number) {
  const s = ms / 1000;
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m`;
}

export function ShopTab() {
  const { state, buySeed, buyAnimal } = useGame();
  const [section, setSection] = useState<'seeds' | 'animals'>('seeds');

  return (
    <div className="shop-root">
      <div className="shop-section-bar">
        <button
          className={`shop-section-btn${section === 'seeds' ? ' active' : ''}`}
          onClick={() => setSection('seeds')}
        >🌱 Seeds</button>
        <button
          className={`shop-section-btn${section === 'animals' ? ' active' : ''}`}
          onClick={() => setSection('animals')}
        >🐾 Animals</button>
      </div>

      {section === 'seeds' ? (
        <div className="shop-list">
          {CROPS.map(crop => {
            const can1 = state.coins >= crop.seedCost;
            const can5 = state.coins >= crop.seedCost * 5;
            return (
              <div key={crop.id} className="shop-item">
                <span className="shop-emoji">{crop.emoji}</span>
                <div className="shop-info">
                  <span className="shop-name">{crop.name}</span>
                  <span className="shop-meta">⏱{fmtTime(crop.growTime)} → +{crop.reward}🪙</span>
                </div>
                <button className={`shop-btn${!can1 ? ' disabled' : ''}`} disabled={!can1}
                  onClick={() => buySeed(crop.id as CropId, 1)}>
                  {crop.seedCost}🪙
                </button>
                <button className={`shop-btn${!can5 ? ' disabled' : ''}`} disabled={!can5}
                  onClick={() => buySeed(crop.id as CropId, 5)}>
                  ×5
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="shop-list">
          {ANIMALS.map(animal => {
            const owned = state.animals.filter(a => a.type === animal.type).length;
            const canBuy = state.coins >= animal.cost;
            return (
              <div key={animal.type} className="shop-item">
                <span className="shop-emoji">{animal.emoji}</span>
                <div className="shop-info">
                  <span className="shop-name">
                    {animal.name}
                    {owned > 0 && <span className="owned-badge"> ×{owned}</span>}
                  </span>
                  <span className="shop-meta">⏱{fmtTime(animal.productionTime)} → +{animal.reward}🪙</span>
                </div>
                <button
                  className={`shop-btn${!canBuy ? ' disabled' : ''}`}
                  disabled={!canBuy}
                  onClick={() => buyAnimal(animal.type as AnimalType)}
                >
                  {animal.cost}🪙
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
