import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { DiyaGlow } from '../../components/common/DiyaGlow';
import { ComboBadge } from '../../components/common/ComboBadge';

interface DiyaTrailProps {
  onWin: (result: RewardResult) => void;
}

interface PathDiya {
  step: number;
  x: number;
  y: number;
}

const TRAIL: PathDiya[] = [
  { step: 1, x: 20, y: 15 },
  { step: 2, x: 50, y: 28 },
  { step: 3, x: 80, y: 40 },
  { step: 4, x: 45, y: 55 },
  { step: 5, x: 25, y: 72 },
  { step: 6, x: 65, y: 85 }
];

export const DiyaTrail: React.FC<DiyaTrailProps> = ({ onWin }) => {
  const [litStep, setLitStep] = useState(0); // 0 to 6
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const handleTapDiya = (step: number) => {
    if (step === litStep + 1) {
      // Correct in sequence!
      soundManager.playDiya();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 75 * nextCombo);

      const nextLit = litStep + 1;
      setLitStep(nextLit);

      if (nextLit >= TRAIL.length) {
        soundManager.playFanfare();
        setTimeout(() => {
          onWin({
            performance: 'PERFECT',
            stars: 3,
            score: score + 250,
            tokens: 20
          });
        }, 500);
      }
    } else {
      soundManager.playError();
      setCombo(0);
    }
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold z-10">
        <div className="text-amber-400">PATH DIYAS: {litStep} / 6</div>
        <div className="text-emerald-400">SCORE: {score}</div>
        <div className="text-pink-300">NEXT: #{litStep + 1}</div>
      </div>

      {/* Winding Stone Ghat Path */}
      <div className="relative flex-1 w-full my-2 bg-gradient-to-b from-[#18082A] via-[#210B38] to-[#0A1628] rounded-2xl border border-white/5 overflow-hidden">
        {/* River Ghat Water at the bottom */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-cyan-950/80 to-transparent pointer-events-none" />

        {/* Path curve guide */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {TRAIL.map((d, i) => {
            if (i === 0) return null;
            const prev = TRAIL[i - 1];
            const isLit = litStep >= d.step;
            return (
              <line
                key={i}
                x1={`${prev.x}%`}
                y1={`${prev.y}%`}
                x2={`${d.x}%`}
                y2={`${d.y}%`}
                stroke={isLit ? '#FFD700' : 'rgba(255,255,255,0.1)'}
                strokeWidth={isLit ? '3' : '1.5'}
                strokeDasharray={isLit ? 'none' : '4,4'}
              />
            );
          })}
        </svg>

        {/* Diyas along the path */}
        {TRAIL.map((d) => {
          const isLit = litStep >= d.step;
          const isNext = d.step === litStep + 1;

          return (
            <div
              key={d.step}
              onClick={() => handleTapDiya(d.step)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 active:scale-90 transition-transform"
              style={{ left: `${d.x}%`, top: `${d.y}%` }}
            >
              <div className={`p-1 rounded-2xl flex flex-col items-center ${isNext ? 'animate-bounce' : ''}`}>
                <DiyaGlow size={48} lit={isLit} />
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full mt-0.5 ${
                  isLit ? 'bg-amber-400 text-slate-900' : 'bg-black/60 text-slate-400'
                }`}>
                  #{d.step}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs text-amber-200 font-medium z-10">
        🛤️ Tap the diyas in path order from street steps down to the lake ghat!
      </div>
    </div>
  );
};
