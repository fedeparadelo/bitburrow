import { useGame } from '../context/GameContext';
import { XP_PER_LEVEL } from '../data/crops';

export function HUD() {
  const { state } = useGame();
  const xpInLevel = state.xp % XP_PER_LEVEL;
  const xpPct = (xpInLevel / XP_PER_LEVEL) * 100;

  return (
    <div className="hud">
      <div className="hud-title">🌾 BitBurrow</div>
      <div className="hud-right">
        <div className="hud-coins">🪙 {state.coins.toLocaleString()}</div>
        <div className="hud-level">
          <span>Lv.{state.level}</span>
          <div className="xp-bar">
            <div className="xp-fill" style={{ width: `${xpPct}%` }} />
          </div>
          <span className="xp-text">{xpInLevel}/{XP_PER_LEVEL}</span>
        </div>
      </div>
    </div>
  );
}
