import React, { useState, useEffect } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';

interface FindContributionProps {
  onWin: (result: RewardResult) => void;
}

const ROUNDS = [
  { target: 50, decoys: [10, 20, 100, 20, 50, 10, 500, 200, 50] },
  { target: 100, decoys: [50, 20, 200, 100, 10, 50, 100, 500, 20] },
  { target: 20, decoys: [50, 20, 10, 200, 100, 20, 10, 500, 50] },
  { target: 200, decoys: [100, 50, 200, 20, 500, 10, 200, 50, 100] },
  { target: 500, decoys: [100, 200, 50, 20, 500, 10, 50, 100, 200] }
];

export const FindContribution: React.FC<FindContributionProps> = ({ onWin }) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [shakingIdx, setShakingIdx] = useState<number | null>(null);

  const round = ROUNDS[roundIdx];

  const handleTileClick = (val: number, idx: number) => {
    if (val === round.target) {
      soundManager.playCoin();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 80 * nextCombo);
      const nextFound = foundCount + 1;
      setFoundCount(nextFound);

      if (roundIdx + 1 >= ROUNDS.length) {
        // Complete
        onWin({
          performance: 'PERFECT',
          stars: 3,
          score: score + 250,
          tokens: 20,
          moneyEarned: 70
        });
      } else {
        setRoundIdx(r => r + 1);
      }
    } else {
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
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">ROUND: {roundIdx + 1} / {ROUNDS.length}</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Target Prompt Banner */}
      <div className="text-center py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl border border-amber-400/40 my-2">
        <span className="text-xs text-amber-200 font-bold uppercase tracking-wider block">
          TARGET TO FIND:
        </span>
        <span className="text-3xl font-black text-amber-300 drop-shadow">
          ₹{round.target}
        </span>
      </div>

      {/* Decoys Grid (3x3) */}
      <div className="grid grid-cols-3 gap-2.5 my-auto p-2">
        {round.decoys.map((val, idx) => (
          <button
            key={idx}
            onClick={() => handleTileClick(val, idx)}
            className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center font-black text-lg sm:text-xl transition-all active:scale-95 shadow-lg ${
              shakingIdx === idx
                ? 'bg-red-950/80 border-red-500 animate-bounce'
                : 'bg-[#22103E] border-white/15 hover:border-amber-400 text-white'
            }`}
          >
            <span className="text-xs text-slate-400">ENVELOPE</span>
            <span className="text-amber-300 font-black">₹{val}</span>
          </button>
        ))}
      </div>

      <div className="text-center text-xs text-amber-200 font-medium">
        🔍 Spot the envelope with the exact target amount!
      </div>
    </div>
  );
};
