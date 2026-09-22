import { motion } from 'motion/react';

export type Mood = 'idle' | 'thinking' | 'happy' | 'sad';

/**
 * Paprika, the mascot. Built as an inline SVG rig rather than an imported
 * animation file so every part is addressable from code and the character can
 * react to query state. Mood is driven by what the API actually returned.
 */
export function Mascot({ mood = 'idle', size = 150 }: { mood?: Mood; size?: number }) {
  const bodyAnim = {
    idle: { y: [0, -6, 0], rotate: [0, 1.5, 0, -1.5, 0] },
    thinking: { y: [0, -3, 0], rotate: [-6, -6, -6] },
    happy: { y: [0, -18, 0, -9, 0], rotate: [0, -3, 3, 0] },
    sad: { y: [0, 4, 0], rotate: [0, 0, 0] },
  }[mood];

  const bodyTiming = {
    idle: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const },
    thinking: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' as const },
    happy: { duration: 0.9, repeat: 2, ease: 'easeOut' as const },
    sad: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' as const },
  }[mood];

  // A droop for sad, a perky lift for happy.
  const leafRotate = {
    idle: [-8, 8, -8],
    thinking: [-14, -6, -14],
    happy: [-20, 12, -20],
    sad: [10, 16, 10],
  }[mood];

  const mouthPath = {
    idle: 'M46,90 Q60,99 74,90',
    thinking: 'M48,93 Q60,91 72,93',
    happy: 'M44,88 Q60,106 76,88',
    sad: 'M46,97 Q60,87 74,97',
  }[mood];

  const eyeY = mood === 'thinking' ? 68 : 72;

  return (
    <motion.svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Paprika the mascot, looking ${mood}`}
      animate={bodyAnim}
      transition={bodyTiming}
      style={{ overflow: 'visible' }}
    >
      {/* stalk */}
      <path d="M56,30 L56,15 Q60,8 64,15 L64,30 Z" fill="#3f7d34" />

      {/* leaf, sways independently of the body */}
      <motion.path
        d="M64,18 Q86,8 92,22 Q76,32 64,22 Z"
        fill="#5aa64c"
        style={{ originX: '64px', originY: '20px' }}
        animate={{ rotate: leafRotate }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* body */}
      <path
        d="M60,26 C85,26 101,46 101,76 C101,106 88,127 76,127
           C70,127 68,120 60,120 C52,120 50,127 44,127
           C32,127 19,106 19,76 C19,46 35,26 60,26 Z"
        fill="#d8402f"
      />
      {/* specular highlight */}
      <ellipse cx="40" cy="58" rx="9" ry="15" fill="#ffffff" opacity="0.22" transform="rotate(-20 40 58)" />

      {/* eyes, blinking on their own clock */}
      <motion.g
        style={{ originX: '60px', originY: `${eyeY}px` }}
        animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.62, 0.66, 0.7, 1] }}
      >
        <ellipse cx="46" cy={eyeY} rx="5" ry="6.5" fill="#2a1410" />
        <ellipse cx="74" cy={eyeY} rx="5" ry="6.5" fill="#2a1410" />
        <circle cx="47.8" cy={eyeY - 2.4} r="1.8" fill="#fff" />
        <circle cx="75.8" cy={eyeY - 2.4} r="1.8" fill="#fff" />
      </motion.g>

      <motion.path
        d={mouthPath}
        stroke="#2a1410"
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
        initial={false}
        animate={{ d: mouthPath }}
        transition={{ duration: 0.35 }}
      />

      {/* cheeks, only when pleased */}
      {mood === 'happy' && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 0.3 }}>
          <ellipse cx="34" cy="86" rx="6" ry="4" fill="#ff8a7a" />
          <ellipse cx="86" cy="86" rx="6" ry="4" fill="#ff8a7a" />
        </motion.g>
      )}
    </motion.svg>
  );
}
