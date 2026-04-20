import { useState, useEffect, type RefObject } from 'react';
import { useGame } from '../context/GameContext';
import { AnimalSprite } from './AnimalSprite';

interface Bounds { w: number; h: number }

export function AnimalLayer({ farmRef }: { farmRef: RefObject<HTMLDivElement> }) {
  const { state, collectAnimal } = useGame();
  const [bounds, setBounds] = useState<Bounds>({ w: 380, h: 280 });

  useEffect(() => {
    const update = () => {
      if (farmRef.current) {
        setBounds({ w: farmRef.current.clientWidth, h: farmRef.current.clientHeight });
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (farmRef.current) ro.observe(farmRef.current);
    return () => ro.disconnect();
  }, [farmRef]);

  return (
    <>
      {state.animals.map(animal => (
        <AnimalSprite
          key={animal.id}
          animal={animal}
          bounds={bounds}
          onCollect={collectAnimal}
        />
      ))}
    </>
  );
}
