import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';

interface PatternMakerProps {
  onWin: (result: RewardResult) => void;
}

const STAGES = [
  {
    sequence: ['🌸', '🪔', '🌸', '🪔'],
    answer: '🌸',
    options: ['🌸', '🪔', '🏮', '🔔']
  },
  {
    sequence: ['🏮', '🏮', '🪔', '🏮', '🏮'],
    answer: '🪔',
    options: ['🌸', '🪔', '🏮', '💡']
  },
  {
    sequence: ['🔔', '🪔', '🌸', '🔔', '🪔'],
    answer: '🌸',
    options: ['🔔', '🪔', '🌸', '🏮']
  },
  {
    sequence: ['💡', '💡', '🏮', '💡', '💡'],
    answer: '🏮',
    options: ['💡', '🏮', '🌸', '🪔']
  }
];

export const PatternMaker: React.FC<PatternMakerProps> = ({ onWin }) => {
  const [stage, setStage] = useState(0);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [shaking, setShaking] = useState(false);

  const current = STAGES[stage];

  const handleChoose = (opt: string) => {
    if (opt === current.answer) {
      soundManager.playCoin();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 100 * nextCombo);

      if (stage + 1 >= STAGES.length) {
        soundManager.playFanfare();
        setTimeout(() => {
          onWin({
            performance: 'PERFECT',
            stars: 3,
            score: score + 250,
            tokens: 20
          });
        }, 400);
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
        <div className="text-amber-400">PATTERN: {stage + 1} / {STAGES.length}</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Pattern Banner Card */}
      <div className={`my-auto p-6 rounded-3xl bg-gradient-to-b from-[#261242] to-[#120722] border-2 border-amber-400 text-center shadow-xl ${shaking ? 'animate-bounce' : ''}`}>
        <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-4">
          WHAT AUSPICIOUS SYMBOL IS MISSING?
        </div>

        {/* Pattern Row */}
        <div className="flex items-center justify-center gap-2 py-4 bg-black/30 rounded-2xl border border-white/10 px-2 overflow-x-auto">
          {current.sequence.map((item, idx) => (
            <div
              key={idx}
              className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-[#1D0C33] border border-amber-400/40 flex items-center justify-center text-2xl shadow-md shrink-0"
            >
              {item}
            </div>
          ))}

          {/* Missing slot */}
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-amber-500/20 border-2 border-dashed border-amber-300 flex items-center justify-center text-2xl font-black text-amber-300 animate-pulse shrink-0">
            ?
          </div>
        </div>

        <p className="text-xs text-amber-200 mt-4">
          Identify the decorative motif that logically finishes this festive sequence!
        </p>
      </div>

      {/* Choices */}
      <div className="grid grid-cols-4 gap-2">
        {current.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleChoose(opt)}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-3xl flex items-center justify-center border border-white/10 shadow-lg transition-all"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
