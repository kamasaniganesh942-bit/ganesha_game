import React, { useState, useEffect } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';

interface FlowerShowerProps {
  onWin: (result: RewardResult) => void;
}

interface FallingPetal {
  id: number;
  x: number;
  y: number;
  icon: string;
  speed: number;
}

const ICONS = ['🌸', '🌼', '🌺', '🌹', '🪷'];

export const FlowerShower: React.FC<FlowerShowerProps> = ({ onWin }) => {
  const [petals, setPetals] = useState<FallingPetal[]>([]);
  const [caught, setCaught] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  // Spawner
  useEffect(() => {
    const spawner = setInterval(() => {
      const newPetal: FallingPetal = {
        id: Date.now() + Math.random(),
        x: Math.floor(Math.random() * 84) + 8,
        y: 0,
        icon: ICONS[Math.floor(Math.random() * ICONS.length)],
        speed: Math.random() * 2 + 2.5
      };
      setPetals(prev => [...prev, newPetal]);
    }, 450);

    return () => clearInterval(spawner);
  }, []);

  // Falling loop
  useEffect(() => {
    const loop = setInterval(() => {
      setPetals(prev => {
        const next: FallingPetal[] = [];
        prev.forEach(p => {
          const nextY = p.y + p.speed;
          if (nextY <= 100) {
            next.push({ ...p, y: nextY });
          }
        });
        return next;
      });
    }, 40);

    return () => clearInterval(loop);
  }, []);

  const handleTapPetal = (id: number) => {
    soundManager.playCoin();
    const nextCombo = combo + 1;
    setCombo(nextCombo);
    setScore(s => s + 40 * nextCombo);

    setPetals(prev => prev.filter(p => p.id !== id));
    const nextCaught = caught + 1;
    setCaught(nextCaught);

    if (nextCaught >= 20) {
      soundManager.playFanfare();
      setTimeout(() => {
        onWin({
          performance: 'PERFECT',
          stars: 3,
          score: score + 300,
          tokens: 25
        });
      }, 300);
    }
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold z-10">
        <div className="text-amber-400">FLOWERS CAUGHT: {caught} / 20</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Falling Flowers Arena */}
      <div className="relative flex-1 w-full my-2 bg-gradient-to-b from-[#25103E] to-[#120622] rounded-2xl border border-white/5 overflow-hidden">
        {/* Balconies Background Silhouettes */}
        <div className="absolute top-0 inset-x-0 flex justify-between px-4 opacity-20 text-3xl pointer-events-none">
          <span>🏛️</span>
          <span>🏢</span>
          <span>🏛️</span>
        </div>

        {petals.map((p) => (
          <div
            key={p.id}
            onClick={() => handleTapPetal(p.id)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer text-3xl p-2 active:scale-75 transition-transform filter drop-shadow z-20"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {p.icon}
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-amber-200 font-medium z-10">
        💐 Tap and catch 20 fragrant flowers falling in the grand procession!
      </div>
    </div>
  );
};
