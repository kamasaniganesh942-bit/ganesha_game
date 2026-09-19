import React from 'react';

interface DiyaGlowProps {
  size?: number;
  lit?: boolean;
  className?: string;
  onClick?: () => void;
}

export const DiyaGlow: React.FC<DiyaGlowProps> = ({
  size = 48,
  lit = true,
  className = '',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Animated flame when lit */}
        {lit && (
          <g className="animate-diya-flicker origin-bottom">
            {/* Outer Flame Glow */}
            <path
              d="M50 5 C45 22, 36 32, 38 46 C40 56, 46 60, 50 60 C54 60, 60 56, 62 46 C64 32, 55 22, 50 5 Z"
              fill="url(#outerFlame)"
              opacity="0.9"
            />
            {/* Inner Flame Core */}
            <path
              d="M50 18 C47 28, 42 35, 44 48 C45 54, 48 57, 50 57 C52 57, 55 54, 56 48 C58 35, 53 28, 50 18 Z"
              fill="url(#innerFlame)"
            />
          </g>
        )}

        {/* Diya Clay / Brass Base */}
        <path
          d="M15 50 C15 50, 30 75, 50 78 C70 75, 85 50, 85 50 C80 62, 68 85, 50 85 C32 85, 20 62, 15 50 Z"
          fill="url(#diyaBase)"
        />
        {/* Diya Rim */}
        <ellipse
          cx="50"
          cy="52"
          rx="35"
          ry="9"
          fill="url(#diyaRim)"
        />
        {/* Diya Oil Well */}
        <ellipse
          cx="50"
          cy="53"
          rx="27"
          ry="6"
          fill="#5D1E04"
        />

        <defs>
          <radialGradient id="outerFlame" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="45%" stopColor="#FFB300" />
            <stop offset="90%" stopColor="#FF3D00" />
          </radialGradient>
          <radialGradient id="innerFlame" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#FFF176" />
            <stop offset="100%" stopColor="#FF8F00" />
          </radialGradient>
          <linearGradient id="diyaBase" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFA000" />
            <stop offset="50%" stopColor="#D84315" />
            <stop offset="100%" stopColor="#4E342E" />
          </linearGradient>
          <linearGradient id="diyaRim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFD54F" />
            <stop offset="50%" stopColor="#FFE082" />
            <stop offset="100%" stopColor="#FFB300" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
