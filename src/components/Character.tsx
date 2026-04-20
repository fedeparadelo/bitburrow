import { useState, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { PlayerSprite } from './sprites/PlayerSprite';

const SPEED = 2.6;
const SIZE = 28;

interface Props {
  containerRef: RefObject<HTMLDivElement>;
}

export function Character({ containerRef }: Props) {
  const [pos, setPos] = useState({ x: 20, y: 20 });
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [moving, setMoving] = useState(false);
  const [frame, setFrame] = useState(0);
  const keys = useRef<Set<string>>(new Set());

  useEffect(() => {
    const isWASD = (k: string) => ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k);
    const norm = (k: string) => ({
      arrowup: 'w', arrowdown: 's', arrowleft: 'a', arrowright: 'd',
    } as Record<string, string>)[k] ?? k;

    const down = (e: KeyboardEvent) => {
      const k = norm(e.key.toLowerCase());
      if (isWASD(e.key.toLowerCase())) {
        keys.current.add(k);
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => {
      const k = norm(e.key.toLowerCase());
      keys.current.delete(k);
    };
    const blur = () => keys.current.clear();

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let frameTimer = 0;
    let lastFrameTime = 0;

    const tick = (timestamp: number) => {
      const el = containerRef.current;
      const w = el?.clientWidth ?? 400;
      const h = el?.clientHeight ?? 400;

      let dx = 0;
      let dy = 0;
      if (keys.current.has('w')) dy -= 1;
      if (keys.current.has('s')) dy += 1;
      if (keys.current.has('a')) dx -= 1;
      if (keys.current.has('d')) dx += 1;

      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      const isMoving = dx !== 0 || dy !== 0;

      setPos(p => ({
        x: Math.max(0, Math.min(w - SIZE, p.x + dx * SPEED)),
        y: Math.max(0, Math.min(h - SIZE, p.y + dy * SPEED)),
      }));

      if (dx < 0) setFacing('left');
      else if (dx > 0) setFacing('right');

      setMoving(isMoving);

      if (isMoving && timestamp - lastFrameTime > 200) {
        frameTimer++;
        setFrame(frameTimer);
        lastFrameTime = timestamp;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [containerRef]);

  return (
    <div className="character" style={{ left: `${pos.x}px`, top: `${pos.y}px` }}>
      <div className="char-nametag">You</div>
      <PlayerSprite facing={facing} moving={moving} frame={frame} />
    </div>
  );
}
