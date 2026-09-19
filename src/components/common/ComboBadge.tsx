import React from 'react';

interface ComboBadgeProps {
  combo: number;
}

export const ComboBadge: React.FC<ComboBadgeProps> = ({ combo }) => {
  if (combo < 2) return null;

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-bounce">
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white font-extrabold text-sm sm:text-base px-3.5 py-1 rounded-full shadow-lg border-2 border-yellow-300 drop-shadow flex items-center gap-1.5">
        <span>🔥</span>
        <span>COMBO x{combo}</span>
      </div>
    </div>
  );
};
