import React, { useState, useEffect } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';

interface PathMemoryProps {
  onWin: (result: RewardResult) => void;
}

// 4x4 grid indices (0 to 15)
// Path route: (0,0)->(0,1)->(1,1)->(2,1)->(2,2)->(3,2)->(3,3)
const ROUTE_INDICES = [0, 1, 5, 9, 10, 14, 15];

export const PathMemory: React.FC<PathMemoryProps> = ({ onWin }) => {
  const [phase, setPhase] = useState<'memorize' | 'trace'>('memorize');
  const [countdown, setCountdown] = useState(3);
  const [traced, setTraced] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [shakingIdx, setShakingIdx] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer);
          setPhase('trace');
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTileClick = (idx: number) => {
    if (phase !== 'trace') return;

    const expectedIdx = ROUTE_INDICES[traced.length];

    if (idx === expectedIdx) {
      // Correct step
      soundManager.playCoin();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 60 * nextCombo);

      const nextTraced = [...traced, idx];
      setTraced(nextTraced);

      if (nextTraced.length === ROUTE_INDICES.length) {
        soundManager.playFanfare();
        setTimeout(() => {
          onWin({
            performance: 'PERFECT',
            stars: 3,
            score: score + 300,
            tokens: 25
          });
        }, 500);
      }
    } else {
      // Mistake!
      soundManager.playError();
      setCombo(0);
      setShakingIdx(idx);
      setTimeout(() => setShakingIdx(null), 400);
    }
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold z-10">
        <div className="text-amber-400">PATH STEP: {traced.length} / {ROUTE_INDICES.length}</div>
        <div className="text-emerald-400">SCORE: {score}</div>
        {phase === 'memorize' && (
          <div className="text-pink-300 font-black animate-pulse">
            ⏳ MEMORIZE: {countdown}s
          </div>
        )}
      </div>

      {/* Status */}
      <div className="text-center my-1">
        {phase === 'memorize' ? (
          <span className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-black animate-pulse">
            👀 MEMORIZE THE GLOWING ROUTE TO THE LAKE!
          </span>
        ) : (
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-black">
            👉 TAP THE TILES IN THE REMEMBERED ORDER!
          </span>
        )}
      </div>

      {/* 4x4 Grid */}
      <div className="my-auto p-4 rounded-3xl bg-gradient-to-b from-[#241042] to-[#120622] border-2 border-amber-500/40 shadow-2xl max-w-[280px] mx-auto w-full">
        <div className="grid grid-cols-4 gap-2.5">
          {Array.from({ length: 16 }).map((_, idx) => {
            const isRoute = ROUTE_INDICES.includes(idx);
            const isTraced = traced.includes(idx);
            const isShowingMemorize = phase === 'memorize' && isRoute;
            const isShaking = shakingIdx === idx;

            return (
              <button
                key={idx}
                disabled={phase === 'memorize' || isTraced}
                onClick={() => handleTileClick(idx)}
                className={`aspect-square rounded-2xl border-2 flex items-center justify-center font-black text-xs transition-all duration-200 active:scale-95 shadow-md ${
                  isShowingMemorize
                    ? 'bg-amber-400 border-yellow-200 text-slate-900 shadow-[0_0_12px_#FFD700]'
                    : isTraced
                    ? 'bg-emerald-600 border-emerald-300 text-white shadow-md'
                    : isShaking
                    ? 'bg-red-950/80 border-red-500 animate-bounce'
                    : 'bg-white/5 border-white/10 hover:border-amber-400/40'
                }`}
              >
                {isShowingMemorize || isTraced ? (
                  <span>{ROUTE_INDICES.indexOf(idx) + 1}</span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-center text-xs text-amber-200 font-medium">
        🗺️ Trace the procession path step by step to the lake ghat!
      </div>
    </div>
  );
};
