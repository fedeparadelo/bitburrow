import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { SeedsTab } from './SeedsTab';
import { ShopTab } from './ShopTab';

export function BottomPanel() {
  const [tab, setTab] = useState<'seeds' | 'shop'>('seeds');
  const { state } = useGame();
  const totalSeeds = Object.values(state.inventory).reduce((a, b) => a + b, 0);

  return (
    <div className="bottom-panel">
      <div className="tab-bar">
        <button
          className={`tab-btn${tab === 'seeds' ? ' active' : ''}`}
          onClick={() => setTab('seeds')}
        >
          🌱 Seeds
          {totalSeeds > 0 && <span className="tab-badge">{totalSeeds}</span>}
        </button>
        <button
          className={`tab-btn${tab === 'shop' ? ' active' : ''}`}
          onClick={() => setTab('shop')}
        >
          🏪 Shop
        </button>
      </div>
      <div className="tab-content">
        {tab === 'seeds' ? <SeedsTab /> : <ShopTab />}
      </div>
    </div>
  );
}
