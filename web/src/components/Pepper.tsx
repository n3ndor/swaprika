import type { CSSProperties } from 'react';

/**
 * The Swaprika pepper. A chili pod, drawn from the design's paths: a stalk, a
 * leaf that wags on its own clock, the pod, and a collar where the two meet.
 * No face. It is a mark, not a mascot.
 */
export function Pepper({
  size = 120,
  fill = 'var(--paprika)',
  mono,
  wag = false,
  shine = false,
  noLeaf = false,
  style,
  className,
}: {
  size?: number;
  fill?: string;
  /** Flattens every part to one colour, for the washed background decorations. */
  mono?: string;
  wag?: boolean;
  shine?: boolean;
  noLeaf?: boolean;
  style?: CSSProperties;
  className?: string;
}) {
  const stalk = mono ?? 'var(--leaf)';
  const leaf = mono ?? 'var(--leaf-light)';
  const pod = mono ?? fill;
  const collar = mono ?? 'var(--leaf)';

  return (
    <svg
      viewBox="0 0 120 140"
      width={size}
      height={Math.round((size * 140) / 120)}
      aria-hidden="true"
      className={className}
      style={{ overflow: 'visible', ...style }}
    >
      <path d="M57,42 L57,13 Q60,4 63,13 L63,42 Z" fill={stalk} />
      {!noLeaf && (
        <path
          d="M63,17 Q86,6 92,20 Q75,31 63,22 Z"
          fill={leaf}
          style={
            wag
              ? { transformOrigin: '63px 19px', animation: 'wag 3.6s ease-in-out infinite' }
              : undefined
          }
        />
      )}
      <path
        d="M60,36 C72,36 80,45 80,61 C80,85 76,110 70,129 C68,134 64,134 63,129 C58,110 46,88 44,66 C43,48 49,36 60,36 Z"
        fill={pod}
      />
      <ellipse cx="60" cy="40" rx="11" ry="5" fill={collar} />
      {shine && (
        <ellipse
          cx="56"
          cy="68"
          rx="5"
          ry="16"
          fill="#ffffff"
          opacity="0.22"
          transform="rotate(-8 56 68)"
        />
      )}
    </svg>
  );
}
