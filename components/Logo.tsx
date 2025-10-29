
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-cyan-400"
      filter="url(#neon-glow)"
    >
      <path d="M12 28 l18 -20 l18 20 l-9 0 l0 24 l-18 0 l0 -24 z" />
      <path d="M68 52 l-18 20 l-18 -20 l9 0 l0 -24 l18 0 l0 24 z" />
    </g>
  </svg>
);
