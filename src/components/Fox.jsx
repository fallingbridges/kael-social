import React from 'react'

// Kael the fox — coach mascot. Poses: happy | cheer | think | sad
export default function Fox({ pose = 'happy', size = 120, style }) {
  const eyes = {
    happy: (
      <>
        <path d="M34 46 q5 -7 10 0" stroke="#241b16" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <path d="M56 46 q5 -7 10 0" stroke="#241b16" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      </>
    ),
    cheer: (
      <>
        <text x="30" y="52" fontSize="15">✨</text>
        <text x="53" y="52" fontSize="15">✨</text>
      </>
    ),
    think: (
      <>
        <circle cx="39" cy="44" r="3.4" fill="#241b16" />
        <circle cx="61" cy="44" r="3.4" fill="#241b16" />
        <circle cx="40.2" cy="42.8" r="1.1" fill="#fff" />
        <circle cx="62.2" cy="42.8" r="1.1" fill="#fff" />
      </>
    ),
    sad: (
      <>
        <path d="M34 48 q5 5 10 0" stroke="#241b16" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <path d="M56 48 q5 5 10 0" stroke="#241b16" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      </>
    ),
  }
  const mouth = {
    happy: <path d="M44 62 q6 6 12 0" stroke="#241b16" strokeWidth="3" fill="none" strokeLinecap="round" />,
    cheer: <path d="M42 60 q8 10 16 0 z" fill="#241b16" />,
    think: <circle cx="50" cy="63" r="3" fill="#241b16" />,
    sad: <path d="M44 66 q6 -5 12 0" stroke="#241b16" strokeWidth="3" fill="none" strokeLinecap="round" />,
  }
  return (
    <svg viewBox="0 0 100 92" width={size} height={size * 0.92} style={style}>
      {/* ears */}
      <path d="M18 36 L12 8 L38 22 Z" fill="#ff7a4d" />
      <path d="M82 36 L88 8 L62 22 Z" fill="#ff7a4d" />
      <path d="M20 32 L17 15 L33 24 Z" fill="#ffd9c4" />
      <path d="M80 32 L83 15 L67 24 Z" fill="#ffd9c4" />
      {/* head */}
      <ellipse cx="50" cy="52" rx="34" ry="32" fill="#ff7a4d" />
      {/* sweatband — coach mode */}
      <path d="M17 34 q33 -16 66 0 l-1.5 8 q-31.5 -14 -63 0 Z" fill="#ff5c39" />
      <path d="M17 34 q33 -16 66 0" stroke="#e8431f" strokeWidth="1.6" fill="none" />
      {/* muzzle */}
      <ellipse cx="50" cy="62" rx="20" ry="15" fill="#fff4ec" />
      {/* cheeks */}
      <circle cx="26" cy="56" r="5.5" fill="#ff5c39" opacity="0.35" />
      <circle cx="74" cy="56" r="5.5" fill="#ff5c39" opacity="0.35" />
      {eyes[pose] || eyes.happy}
      <ellipse cx="50" cy="55" rx="4.4" ry="3.6" fill="#241b16" />
      {mouth[pose] || mouth.happy}
    </svg>
  )
}
