import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';

interface MoneyCounterProps {
  onWin: (result: RewardResult) => void;
}

const QUESTIONS = [
  {
    items: [20, 10, 50],
    correct: 80,
    options: [70, 80, 90, 100]
  },
  {
    items: [50, 50, 20, 10],
    correct: 130,
    options: [120, 130, 140, 110]
  },
  {
    items: [100, 50, 20],
    correct: 170,
    options: [150, 160, 170, 180]
  },
  {
    items: [20, 20, 20, 50],
    correct: 110,
    options: [100, 110, 120, 90]
  },
  {
    items: [100, 100, 50, 50],
    correct: 300,
    options: [280, 300, 320, 350]
  }
];

export const MoneyCounter: React.FC<MoneyCounterProps> = ({ onWin }) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [shaking, setShaking] = useState(false);

  const q = QUESTIONS[currentRound];

  const handleSelect = (choice: number) => {
    if (choice === q.correct) {
      soundManager.playCoin();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      const roundScore = 100 + nextCombo * 20;
      setScore(s => s + roundScore);

      if (currentRound + 1 >= QUESTIONS.length) {
        // Complete
        const finalScore = score + roundScore;
        onWin({
          performance: 'PERFECT',
          stars: 3,
          score: finalScore,
          tokens: 15,
          moneyEarned: 70
        });
      } else {
        setCurrentRound(r => r + 1);
      }
    } else {
      soundManager.playError();
      setCombo(0);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">ROUND: {currentRound + 1} / {QUESTIONS.length}</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Tray Area with Notes and Coins */}
      <div className={`my-auto p-5 rounded-3xl bg-gradient-to-b from-[#251342] to-[#120724] border-2 border-amber-500/40 text-center shadow-xl transition-transform ${shaking ? 'animate-bounce' : ''}`}>
        <div className="text-xs font-bold text-amber-300 tracking-wider uppercase mb-3">
          COUNT THE DONATION TRAY:
        </div>

        {/* Notes / Coins on Plate */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 py-4 bg-black/30 rounded-2xl border border-white/10">
          {q.items.map((val, idx) => (
            <div
              key={idx}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-slate-900 font-black text-sm sm:text-base border border-yellow-200 shadow-md transform hover:scale-105 transition-transform"
            >
              ₹{val}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-black text-white mt-4">
          How much is the total?
        </h3>
      </div>

      {/* 4 Choices */}
      <div className="grid grid-cols-2 gap-2.5">
        {q.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            className="py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-amber-300 font-black text-lg border border-white/10 shadow-lg transition-all"
          >
            ₹{opt}
          </button>
        ))}
      </div>
    </div>
  );
};
