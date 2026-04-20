import { useGame } from '../context/GameContext';

export function ToastStack() {
  const { state } = useGame();
  if (state.toasts.length === 0) return null;

  return (
    <div className="toast-stack" aria-live="polite">
      {state.toasts.map(t => (
        <div key={t.id} className={`toast${t.message.includes('Level') ? ' toast-levelup' : ''}`}>
          <span className="toast-emoji">{t.emoji}</span>
          <span className="toast-msg">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
