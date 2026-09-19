import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';

interface FlowerGarlandProps {
  onWin: (result: RewardResult) => void;
}

const PATTERNS = [
  {
    sequence: ['🌸', '🌼', '🌸', '🌼'],
    answer: '🌸',
    options: ['🌸', '🌼', '🪷', '💮']
  },
  {
    sequence: ['🌼', '🌼', '🌸', '🌼', '🌼'],
    answer: '🌸',
    options: ['🌼', '🌸', '💮', '🌹']
  },
  {
    sequence: ['💮', '🌸', '🌼', '💮', '🌸'],
    answer: '🌼',
    options: ['🌸', '🌼', '💮', '🪷']
  },
  {
    sequence: ['🪷', '🌼', '🪷', '🌼'],
    answer: '🪷',
    options: ['🪷', '🌼', '🌸', '💮']
  }
];

export const FlowerGarland: React.FC<FlowerGarlandProps> = ({ onWin }) => {
  const [round, setRound] = useState(0);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [shaking, setShaking] = useState(false);

  const current = PATTERNS[round];

  const handlePick = (flower: string) => {
    if (flower === current.answer) {
      soundManager.playCoin();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 100 * nextCombo);

      if (round + 1 >= PATTERNS.length) {
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
        setRound(r => r + 1);
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
        <div className="text-amber-400">GARLAND: {round + 1} / {PATTERNS.length}</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Garland Display Canvas */}
      <div className={`my-auto p-6 rounded-3xl bg-gradient-to-b from-[#271242] to-[#120722] border-2 border-amber-400 text-center shadow-xl ${shaking ? 'animate-bounce' : ''}`}>
        <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-4">
          COMPLETE THE FLOWER PATTERN:
        </div>

        {/* Garland Thread */}
        <div className="relative py-4 flex items-center justify-center gap-2 sm:gap-3 bg-black/30 rounded-2xl border border-white/10 px-2 overflow-x-auto">
          {/* Thread Line */}
          <div className="absolute inset-x-4 h-1 bg-amber-600/60 top-1/2 -translate-y-1/2 -z-0" />

          {current.sequence.map((item, idx) => (
            <div
              key={idx}
              className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-[#1A0B30] border border-amber-400/40 flex items-center justify-center text-2xl shadow-md z-10 shrink-0"
            >
              {item}
            </div>
          ))}

          {/* Missing Slot */}
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-amber-500/20 border-2 border-dashed border-amber-300 flex items-center justify-center text-2xl font-black text-amber-300 animate-pulse z-10 shrink-0">
            ?
          </div>
        </div>

        <p className="text-xs text-amber-200 mt-4">
          Which sacred flower comes next in this garland?
        </p>
      </div>

      {/* Choice Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {current.options.map((flower, idx) => (
          <button
            key={idx}
            onClick={() => handlePick(flower)}
            className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-3xl flex items-center justify-center border border-white/10 shadow-lg transition-all"
          >
            {flower}
          </button>
        ))}
      </div>
    </div>
  );
};
