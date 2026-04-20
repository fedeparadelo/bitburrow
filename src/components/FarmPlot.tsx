import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { CROP_MAP } from '../data/crops';
import type { Plot } from '../types/game';

function formatTime(ms: number) {
  const s = Math.ceil(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r > 0 ? `${m}m${r}s` : `${m}m`;
}

export function FarmPlot({ plot }: { plot: Plot }) {
  const { state, plant, harvest } = useGame();
  const [now, setNow] = useState(Date.now());
  const [floatingReward, setFloatingReward] = useState<number | null>(null);

  useEffect(() => {
    if (plot.state !== 'planted') return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [plot.state]);

  const crop = plot.cropId ? CROP_MAP[plot.cropId] : null;

  const progress =
    plot.state === 'planted' && plot.plantedAt && crop
      ? Math.min(1, (now - plot.plantedAt) / crop.growTime)
      : 0;

  const timeLeft =
    plot.state === 'planted' && plot.plantedAt && crop
      ? Math.max(0, crop.growTime - (now - plot.plantedAt))
      : 0;

  const canPlant =
    plot.state === 'empty' &&
    !!state.selectedSeed &&
    state.inventory[state.selectedSeed] > 0;

  function handleClick() {
    if (plot.state === 'empty' && canPlant) {
      plant(plot.id);
    } else if (plot.state === 'ready' && crop) {
      const reward = crop.reward;
      harvest(plot.id);
      setFloatingReward(reward);
      setTimeout(() => setFloatingReward(null), 1200);
    }
  }

  const terrain = ['', ' terrain-b', ' terrain-c'][plot.id % 3];

  const classes = [
    'plot' + terrain,
    `plot-${plot.state}`,
    canPlant ? 'plot-hinted' : '',
    plot.state === 'ready' || canPlant ? 'plot-clickable' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={handleClick}>
      {crop && (
        <span className={`plot-emoji${plot.state === 'ready' ? ' plot-emoji-ready' : ''}`}>
          {crop.emoji}
        </span>
      )}

      {plot.state === 'planted' && (
        <>
          <div className="time-left">{formatTime(timeLeft)}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        </>
      )}

      {plot.state === 'ready' && <div className="ready-badge">✓</div>}

      {floatingReward !== null && (
        <div className="floating-coins">+{floatingReward}🪙</div>
      )}
    </div>
  );
}
