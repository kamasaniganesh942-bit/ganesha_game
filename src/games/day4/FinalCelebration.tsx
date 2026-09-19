import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';
import confetti from 'canvas-confetti';

interface FinalCelebrationProps {
  onWin: (result: RewardResult) => void;
}

interface TapTarget {
  id: number;
  icon: string;
  name: string;
  sound: 'bell' | 'dhol' | 'coin';
  x: string;
  y: string;
}

const TARGETS: TapTarget[] = [
  { id: 1, icon: '🔔', name: 'Temple Bell', sound: 'bell', x: '18%', y: '22%' },
  { id: 2, icon: '🎆', name: 'Sparkles', sound: 'coin', x: '80%', y: '20%' },
  { id: 3, icon: '🥁', name: 'Dhol', sound: 'dhol', x: '25%', y: '55%' },
  { id: 4, icon: '🌸', name: 'Gulal Flowers', sound: 'coin', x: '75%', y: '58%' },
  { id: 5, icon: '🪔', name: 'Aarti Diya', sound: 'bell', x: '50%', y: '80%' }
];

export const FinalCelebration: React.FC<FinalCelebrationProps> = ({ onWin }) => {
  const [excitement, setExcitement] = useState(0); // 0 to 100%
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const handleTap = (t: TapTarget) => {
    if (t.sound === 'bell') soundManager.playBell();
    else if (t.sound === 'dhol') soundManager.playDhol(true);
    else soundManager.playCoin();

    // Fire mini confetti burst
    confetti({
      particleCount: 15,
      spread: 45,
      origin: { y: 0.6 }
    });

    const nextCombo = combo + 1;
    setCombo(nextCombo);
    setScore(s => s + 50 * nextCombo);

    const nextExcitement = Math.min(100, excitement + 8);
    setExcitement(nextExcitement);

    if (nextExcitement >= 100) {
      soundManager.playFanfare();
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 }
      });
      setTimeout(() => {
        onWin({
          performance: 'PERFECT',
          stars: 3,
          score: score + 400,
          tokens: 30
        });
      }, 500);
    }
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold z-10">
        <div className="text-amber-400">EXCITEMENT: {excitement}%</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Excitement Progress Bar */}
      <div className="w-full bg-black/30 h-2.5 rounded-full overflow-hidden border border-white/10 my-1 z-10">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-pink-500 transition-all duration-150"
          style={{ width: `${excitement}%` }}
        />
      </div>

      {/* Celebration Arena */}
      <div className="relative flex-1 w-full my-2 bg-gradient-to-b from-[#240C3E] via-[#16062A] to-[#0A0314] rounded-2xl border border-white/10 overflow-hidden">
        {/* Ambient Celebration Silhouettes */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
          <span className="text-8xl animate-pulse">🎉</span>
        </div>

        {/* Interactive Tap Targets */}
        {TARGETS.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTap(t)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 p-3.5 rounded-3xl bg-white/10 hover:bg-white/20 active:scale-75 border border-amber-400/50 shadow-xl transition-transform z-20 flex flex-col items-center"
            style={{ left: t.x, top: t.y }}
          >
            <span className="text-4xl animate-bounceSubtle">{t.icon}</span>
            <span className="text-[9px] font-black text-amber-300 mt-1 bg-black/60 px-1.5 py-0.5 rounded-full">
              {t.name}
            </span>
          </button>
        ))}
      </div>

      <div className="text-center text-xs text-amber-200 font-medium z-10">
        🎉 Tap bells, crackers, lights, and flowers rapidly to max out the celebration!
      </div>
    </div>
  );
};
