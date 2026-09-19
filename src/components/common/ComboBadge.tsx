import React, { useState, useEffect, useRef } from 'react';

interface ComboBadgeProps {
  combo: number;
}

export const ComboBadge: React.FC<ComboBadgeProps> = ({ combo }) => {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (combo >= 2) {
      setVisible(true);
      setAnimating(true);
      const animTimer = setTimeout(() => setAnimating(false), 200);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, 1200);

      return () => {
        clearTimeout(animTimer);
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    } else {
      setVisible(false);
    }
  }, [combo]);

  if (!visible || combo < 2) return null;

  return (
    <div className="w-full flex justify-center pointer-events-none z-30 py-0.5 animate-fadeIn">
      <div
        className={`bg-gradient-to-r from-orange-500/90 via-amber-500/90 to-orange-600/90 text-white font-black text-xs px-3 py-0.5 rounded-full shadow-md border border-amber-300/50 backdrop-blur-sm flex items-center gap-1.5 transition-transform duration-150 ${
          animating ? 'scale-110' : 'scale-100'
        }`}
      >
        <span className="text-xs">🔥</span>
        <span className="tracking-wide uppercase text-[11px]">x{combo} COMBO</span>
      </div>
    </div>
  );
};
