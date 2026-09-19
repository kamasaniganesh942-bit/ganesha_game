import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';

interface FestivalLightsProps {
  onWin: (result: RewardResult) => void;
}

interface Bulb {
  num: number;
  x: number; // percentage
  y: number; // percentage
}

const STRINGS: Bulb[][] = [
  [
    { num: 1, x: 20, y: 25 },
    { num: 2, x: 50, y: 15 },
    { num: 3, x: 80, y: 30 },
    { num: 4, x: 70, y: 70 },
    { num: 5, x: 30, y: 75 }
  ],
  [
    { num: 1, x: 25, y: 70 },
    { num: 2, x: 20, y: 25 },
    { num: 3, x: 50, y: 50 },
    { num: 4, x: 80, y: 25 },
    { num: 5, x: 75, y: 75 }
  ],
  [
    { num: 1, x: 50, y: 20 },
    { num: 2, x: 80, y: 45 },
    { num: 3, x: 65, y: 75 },
    { num: 4, x: 35, y: 75 },
    { num: 5, x: 20, y: 45 }
  ]
];

export const FestivalLights: React.FC<FestivalLightsProps> = ({ onWin }) => {
  const [stringIdx, setStringIdx] = useState(0);
  const [expectedNum, setExpectedNum] = useState(1);
  const [illuminated, setIlluminated] = useState<number[]>([]);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [allLitAnimation, setAllLitAnimation] = useState(false);

  const currentBulbs = STRINGS[stringIdx];

  const handleBulbClick = (num: number) => {
    if (num === expectedNum) {
      soundManager.playDiya();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 50 * nextCombo);

      const nextIlluminated = [...illuminated, num];
      setIlluminated(nextIlluminated);

      if (num === 5) {
        // String completed!
        setAllLitAnimation(true);
        soundManager.playBell();

        setTimeout(() => {
          setAllLitAnimation(false);
          if (stringIdx + 1 >= STRINGS.length) {
            // Finished all strings!
            soundManager.playFanfare();
            onWin({
              performance: 'PERFECT',
              stars: 3,
              score: score + 250,
              tokens: 20
            });
          } else {
            setStringIdx(s => s + 1);
            setExpectedNum(1);
            setIlluminated([]);
          }
        }, 900);
      } else {
        setExpectedNum(num + 1);
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
        <div className="text-amber-400">STRING: {stringIdx + 1} / {STRINGS.length}</div>
        <div className="text-emerald-400">SCORE: {score}</div>
        <div className="text-pink-300">NEXT BULB: #{expectedNum}</div>
      </div>

      {/* Fairy Lights Canopy Arena */}
      <div className="relative flex-1 my-2 rounded-2xl bg-gradient-to-b from-[#1E0C36] to-[#0D041A] border border-white/5 overflow-hidden">
        {/* Connecting wire lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {currentBulbs.map((b, i) => {
            if (i === 0) return null;
            const prev = currentBulbs[i - 1];
            const isWireLit = illuminated.includes(b.num) && illuminated.includes(prev.num);
            return (
              <line
                key={i}
                x1={`${prev.x}%`}
                y1={`${prev.y}%`}
                x2={`${b.x}%`}
                y2={`${b.y}%`}
                stroke={isWireLit ? '#FFD700' : 'rgba(255,255,255,0.15)'}
                strokeWidth={isWireLit ? '3' : '1.5'}
                strokeDasharray={isWireLit ? 'none' : '4,4'}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* Numbered Light Bulbs */}
        {currentBulbs.map((b) => {
          const isLit = illuminated.includes(b.num) || allLitAnimation;

          return (
            <div
              key={b.num}
              onClick={() => handleBulbClick(b.num)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 active:scale-90 transition-transform"
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
            >
              <div
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-black text-lg transition-all duration-300 ${
                  isLit
                    ? 'bg-amber-300 text-slate-900 border-yellow-100 shadow-[0_0_25px_#FFD700] scale-110'
                    : b.num === expectedNum
                    ? 'bg-white/15 text-amber-300 border-amber-400 animate-pulse'
                    : 'bg-white/5 text-slate-400 border-white/20'
                }`}
              >
                {b.num}
              </div>
            </div>
          );
        })}

        {allLitAnimation && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none">
            <span className="text-xl font-black text-amber-300 animate-bounce">
              ✨ STRING ILLUMINATED! ✨
            </span>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-amber-200 font-medium z-10">
        💡 Tap bulbs in sequential order: 1 → 2 → 3 → 4 → 5!
      </div>
    </div>
  );
};
