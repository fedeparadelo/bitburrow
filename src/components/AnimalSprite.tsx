import { useState, useEffect, useRef } from 'react';
import { ANIMAL_MAP } from '../data/animals';
import type { OwnedAnimal } from '../types/game';

interface Bounds { w: number; h: number }

interface Props {
  animal: OwnedAnimal;
  bounds: Bounds;
  onCollect: (id: string) => void;
}

const PAD = 28;

function randTarget(bounds: Bounds) {
  return {
    x: PAD + Math.random() * Math.max(10, bounds.w - PAD * 2),
    y: PAD + Math.random() * Math.max(10, bounds.h - PAD * 2),
  };
}

export function AnimalSprite({ animal, bounds, onCollect }: Props) {
  const def = ANIMAL_MAP[animal.type];
  const [pos, setPos] = useState({ x: animal.startX, y: animal.startY });
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [moving, setMoving] = useState(false);
  const targetRef = useRef(randTarget(bounds));
  const pauseRef = useRef(0);

  useEffect(() => {
    if (animal.state === 'ready') {
      setMoving(false);
      return;
    }

    let raf = 0;
    const tick = () => {
      setPos(p => {
        if (pauseRef.current > 0) {
          pauseRef.current--;
          setMoving(false);
          return p;
        }

        const dx = targetRef.current.x - p.x;
        const dy = targetRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 4) {
          const [min, max] = def.pauseFrames;
          pauseRef.current = min + Math.floor(Math.random() * (max - min));
          targetRef.current = randTarget(bounds);
          return p;
        }

        setMoving(true);
        if (dx < -1) setFacing('left');
        else if (dx > 1) setFacing('right');

        return {
          x: p.x + (dx / dist) * def.speed,
          y: p.y + (dy / dist) * def.speed,
        };
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animal.state, bounds, def]);

  const isReady = animal.state === 'ready';

  const spriteClass = [
    'animal-sprite',
    facing === 'left' ? 'facing-left' : '',
    moving && !isReady ? 'walking' : '',
    isReady ? 'ready-anim' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={`animal${isReady ? ' animal-ready' : ''}`}
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      onClick={() => isReady && onCollect(animal.id)}
      title={isReady ? `Collect from ${def.name}!` : def.name}
    >
      {isReady && <div className="animal-collect-badge">+{def.reward}🪙</div>}
      <div className={spriteClass}>{def.emoji}</div>
      <div className="animal-shadow" />
    </div>
  );
}
