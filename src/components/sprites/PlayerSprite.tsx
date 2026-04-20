interface Props {
  facing: 'left' | 'right';
  moving: boolean;
  frame: number;
}

export function PlayerSprite({ facing, moving, frame }: Props) {
  const flip = facing === 'left' ? 'scale(-1,1)' : undefined;
  const walkOffset = moving ? (frame % 2 === 0 ? 1 : -1) : 0;

  return (
    <svg
      width="24"
      height="32"
      viewBox="0 0 12 16"
      style={{ imageRendering: 'pixelated', transform: flip }}
    >
      {/* Shadow */}
      <ellipse cx="6" cy="15.5" rx="4" ry="1" fill="rgba(0,0,0,0.25)" />

      {/* Legs */}
      <rect x="4" y={11 + (moving && frame % 2 === 0 ? 1 : 0)} width="2" height="3" fill="#6b3a2a" />
      <rect x="6" y={11 + (moving && frame % 2 !== 0 ? 1 : 0)} width="2" height="3" fill="#6b3a2a" />

      {/* Body / Tunic */}
      <rect x="3" y="7" width="6" height="5" fill="#3a7bd5" />
      {/* Belt */}
      <rect x="3" y="10" width="6" height="1" fill="#7a5c2e" />

      {/* Arms */}
      <rect x="1" y={7 + walkOffset} width="2" height="4" fill="#3a7bd5" />
      <rect x="9" y={7 - walkOffset} width="2" height="4" fill="#3a7bd5" />

      {/* Hands */}
      <rect x="1" y={11 + walkOffset} width="2" height="2" fill="#e8b88a" />
      <rect x="9" y={11 - walkOffset} width="2" height="2" fill="#e8b88a" />

      {/* Neck */}
      <rect x="5" y="5" width="2" height="2" fill="#e8b88a" />

      {/* Head */}
      <rect x="3" y="2" width="6" height="5" fill="#e8b88a" />

      {/* Hair */}
      <rect x="3" y="2" width="6" height="2" fill="#4a2e0a" />

      {/* Eyes */}
      <rect x="4" y="5" width="1" height="1" fill="#1a1a2e" />
      <rect x="7" y="5" width="1" height="1" fill="#1a1a2e" />

      {/* Helmet visor line */}
      <rect x="3" y="2" width="6" height="1" fill="#6b4a1a" />

      {/* Sword */}
      <rect x="10" y={4 - walkOffset} width="1" height="5" fill="#c0c0c0" />
      <rect x="9" y={6 - walkOffset} width="3" height="1" fill="#8B6914" />
    </svg>
  );
}
