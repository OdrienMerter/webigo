
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
      className="text-indigo-400"
      filter="url(#neon-glow)"
    >
      {/* Monitor frame and stand */}
      <path d="M10 56 V16 C10 13.79 11.79 12 14 12 H66 C68.21 12 70 13.79 70 16 V56 C70 58.21 68.21 60 66 60 H14 C11.79 60 10 58.21 10 56 Z M40 60 V68 M28 72 H52" />
      
      {/* Left Person */}
      <path d="M30 30 A6 6 0 1 0 30 18 A6 6 0 0 0 30 30 Z M20 50 A10 10 0 0 1 40 40 M27 24.5 L27.1 24.5 M33 24.5 L33.1 24.5 M28 28 Q30 30 32 28" />
      
      {/* Right Person */}
      <path d="M50 30 A6 6 0 1 0 50 18 A6 6 0 0 0 50 30 Z M60 50 A10 10 0 0 0 40 40 M47 24.5 L47.1 24.5 M53 24.5 L53.1 24.5 M48 28 Q50 30 52 28" />
    </g>
  </svg>
);