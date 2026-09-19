import React, { useState, useEffect } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';

interface QuickCalcProps {
  onWin: (result: RewardResult) => void;
}

const EQUATIONS = [
  { text: '20 + 30', ans: 50, options: [40, 50, 60, 70] },
  { text: '50 - 20', ans: 30, options: [20, 25, 30, 35] },
  { text: '40 + 25', ans: 65, options: [55, 60, 65, 75] },
  { text: '100 - 35', ans: 65, options: [65, 70, 75, 80] },
  { text: '50 + 50 + 20', ans: 120, options: [110, 120, 130, 140] },
  { text: '200 - 60', ans: 140, options: [130, 140, 150, 160] }
];

export const QuickCalc: React.FC<QuickCalcProps> = ({ onWin }) => {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [shaking, setShaking] = useState(false);

  const current = EQUATIONS[round];

  useEffect(() => {
    if (timeLeft <= 0) {
      // Time up
      finishGame();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const finishGame = () => {
    const performance = round >= 5 ? 'PERFECT' : round >= 3 ? 'GREAT' : 'GOOD';
    const stars = performance === 'PERFECT' ? 3 : performance === 'GREAT' ? 2 : 1;
    onWin({
      performance,
      stars,
      score: score + 150,
      tokens: 15,
      moneyEarned: 60
    });
  };

  const handleChoice = (opt: number) => {
    if (opt === current.ans) {
      soundManager.playCoin();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 50 * nextCombo);

      if (round + 1 >= EQUATIONS.length) {
        finishGame();
      } else {
        setRound(r => r + 1);
        setTimeLeft(t => Math.min(15, t + 4)); // Time bonus for fast answers
      }
    } else {
      soundManager.playError();
      setCombo(0);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    }
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">ROUND: {round + 1} / {EQUATIONS.length}</div>
        <div className="text-emerald-400">SCORE: {score}</div>
        <div className={`px-2 py-0.5 rounded-lg ${timeLeft <= 5 ? 'bg-red-500 text-white animate-pulse' : 'text-slate-300'}`}>
          ⏳ {timeLeft}s
        </div>
      </div>

      {/* Calculation Display Card */}
      <div className={`my-auto p-6 rounded-3xl bg-gradient-to-b from-[#281347] to-[#140826] border-2 border-amber-400 text-center shadow-xl ${shaking ? 'animate-bounce' : ''}`}>
        <div className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-2">
          SOLVE RAPID CALCULATION:
        </div>
        <div className="text-4xl sm:text-5xl font-black text-white tracking-wider my-4 drop-shadow-md">
          {current.text} = ?
        </div>
        <div className="text-xs text-amber-200">
          Be quick to maintain your time bonus!
        </div>
      </div>

      {/* Multiple Choice Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        {current.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleChoice(opt)}
            className="py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-amber-300 font-black text-xl border border-white/10 shadow-lg transition-all"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
