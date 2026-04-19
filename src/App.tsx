import { GameProvider } from './context/GameContext';
import { HUD } from './components/HUD';
import { FarmGrid } from './components/FarmGrid';
import { BottomPanel } from './components/BottomPanel';

function Game() {
  return (
    <div className="game">
      <HUD />
      <FarmGrid />
      <BottomPanel />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}
