import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';

interface FinalPuzzleProps {
  onWin: (result: RewardResult) => void;
}

const PUZZLE_STAGES = [
  {
    sequence: ['🌸', '🪔', '🥟', '🌸', '🪔'],
    answer: '🥟',
    options: ['🥟', '🌸', '🪔', '🕉️']
  },
  {
    sequence: ['🕉️', '🪔', '🕉️', '🪔', '🕉️'],
    answer: '🪔',
    options: ['🌸', '🪔', '🥟', '🔔']
  },
  {
    sequence: ['🔔', '🥁', '🔔', '🥁'],
    answer: '🔔',
    options: ['🥁', '🔔', '🌸', '🪔']
  }
];

export const FinalPuzzle: React.FC<FinalPuzzleProps> = ({ onWin }) => {
  const [stage, setStage] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [shaking, setShaking] = useState(false);

  const current = PUZZLE_STAGES[stage];

  const handlePick = (symbol: string) => {
    if (symbol === current.answer) {
      soundManager.playBell();
      soundManager.playCoin();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 100 * nextCombo);

      if (stage + 1 >= PUZZLE_STAGES.length) {
        soundManager.playFanfare();
        setTimeout(() => {
          onWin({
            performance: 'PERFECT',
            stars: 3,
            score: score + 500,
            tokens: 35
          });
        }, 500);
      } else {
        setStage(s => s + 1);
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
        <div className="text-amber-400">SACRED PUZZLE: {stage + 1} / {PUZZLE_STAGES.length}</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Mandala Sequence Card */}
      <div className={`my-auto p-6 rounded-3xl bg-gradient-to-b from-[#281347] to-[#120722] border-2 border-amber-400 text-center shadow-2xl ${shaking ? 'animate-bounce' : ''}`}>
        <div className="text-xs font-black text-amber-300 uppercase tracking-wider mb-4">
          SOLVE THE SACRED MANDALA TO UNLOCK VISARJAN:
        </div>

        {/* Sequence Row */}
        <div className="flex items-center justify-center gap-2 py-4 bg-black/30 rounded-2xl border border-white/10 px-2 overflow-x-auto">
          {current.sequence.map((item, idx) => (
            <div
              key={idx}
              className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-[#1C0D30] border border-amber-400/40 flex items-center justify-center text-2xl shadow-md shrink-0"
            >
              {item}
            </div>
          ))}

          {/* Missing symbol */}
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-amber-500/20 border-2 border-dashed border-amber-300 flex items-center justify-center text-2xl font-black text-amber-300 animate-pulse shrink-0">
            ?
          </div>
        </div>

        <p className="text-xs text-amber-200 mt-4">
          Which sacred festival symbol completes the mandala?
        </p>
      </div>

      {/* 4 Choices */}
      <div className="grid grid-cols-4 gap-2">
        {current.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handlePick(opt)}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-3xl flex items-center justify-center border border-white/10 shadow-lg transition-all"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
