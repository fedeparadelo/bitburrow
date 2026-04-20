interface Props {
  variant?: 'a' | 'b' | 'rock';
}

export function TreeSprite({ variant = 'a' }: Props) {
  if (variant === 'rock') {
    return (
      <svg width="20" height="14" viewBox="0 0 10 7" style={{ imageRendering: 'pixelated' }}>
        <ellipse cx="5" cy="5.5" rx="4" ry="1" fill="rgba(0,0,0,0.2)" />
        <rect x="1" y="2" width="8" height="4" rx="1" fill="#7a7a6a" />
        <rect x="2" y="1" width="6" height="2" fill="#8a8a7a" />
        <rect x="2" y="2" width="2" height="1" fill="#9a9a8a" />
        <rect x="3" y="1" width="1" height="1" fill="#6a6a5a" />
      </svg>
    );
  }

  const leafColor = variant === 'b' ? '#c4862a' : '#2d8a3e';
  const leafDark  = variant === 'b' ? '#8a5a1a' : '#1d6a2e';
  const leafLight = variant === 'b' ? '#e8b050' : '#4aaa5e';

  return (
    <svg width="28" height="36" viewBox="0 0 14 18" style={{ imageRendering: 'pixelated' }}>
      {/* Shadow */}
      <ellipse cx="7" cy="17" rx="5" ry="1.2" fill="rgba(0,0,0,0.25)" />

      {/* Trunk */}
      <rect x="6" y="11" width="2" height="6" fill="#8B5e3c" />
      <rect x="5" y="13" width="1" height="2" fill="#6b4020" />

      {/* Foliage layers */}
      <rect x="3" y="8"  width="8" height="5" fill={leafColor} />
      <rect x="4" y="5"  width="6" height="5" fill={leafColor} />
      <rect x="5" y="2"  width="4" height="5" fill={leafColor} />

      {/* Highlights */}
      <rect x="5" y="8"  width="2" height="2" fill={leafLight} />
      <rect x="6" y="5"  width="2" height="1" fill={leafLight} />

      {/* Shadows */}
      <rect x="3" y="11" width="4" height="2" fill={leafDark} />
      <rect x="4" y="8"  width="2" height="1" fill={leafDark} />
      <rect x="9" y="9"  width="2" height="2" fill={leafDark} />
    </svg>
  );
}
