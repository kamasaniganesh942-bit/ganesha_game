import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface ProcessionStepsProps {
  onWin: (result: RewardResult) => void;
}

type Direction = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';

const STEP_SEQUENCE: Direction[] = [
  'UP', 'RIGHT', 'LEFT', 'UP', 'DOWN', 'RIGHT', 'UP', 'UP'
];

export const ProcessionSteps: React.FC<ProcessionStepsProps> = ({ onWin }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [shaking, setShaking] = useState(false);

  const targetDir = STEP_SEQUENCE[currentIdx];

  const handlePressDir = (dir: Direction) => {
    if (dir === targetDir) {
      soundManager.playDhol(true);
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 75 * nextCombo);

      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);

      if (nextIdx >= STEP_SEQUENCE.length) {
        soundManager.playFanfare();
        setTimeout(() => {
          onWin({
            performance: 'PERFECT',
            stars: 3,
            score: score + 250,
            tokens: 20
          });
        }, 400);
      }
    } else {
      soundManager.playError();
      setCombo(0);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
    }
  };

  const getDirIcon = (dir: Direction) => {
    switch (dir) {
      case 'UP': return <ArrowUp className="w-8 h-8" />;
      case 'DOWN': return <ArrowDown className="w-8 h-8" />;
      case 'LEFT': return <ArrowLeft className="w-8 h-8" />;
      case 'RIGHT': return <ArrowRight className="w-8 h-8" />;
    }
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">PROCESSION STEP: {currentIdx + 1} / {STEP_SEQUENCE.length}</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Procession Marching Canvas */}
      <div className={`my-auto p-5 rounded-3xl bg-gradient-to-b from-[#261045] to-[#120722] border-2 border-amber-400 text-center shadow-2xl ${shaking ? 'animate-bounce' : ''}`}>
        <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
          DANCE STEP PROMPT:
        </div>

        {/* Big Arrow Prompt */}
        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 p-1 shadow-2xl border-2 border-yellow-200 flex items-center justify-center text-white my-3 animate-pulse">
          {getDirIcon(targetDir)}
        </div>

        <div className="text-sm font-black text-amber-200">
          STEP: {targetDir}
        </div>

        {/* Procession March Progress */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {STEP_SEQUENCE.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i < currentIdx ? 'w-6 bg-emerald-400' : i === currentIdx ? 'w-4 bg-amber-400' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 4 D-Pad Arrow Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {(['LEFT', 'UP', 'DOWN', 'RIGHT'] as Direction[]).map((dir) => (
          <button
            key={dir}
            onClick={() => handlePressDir(dir)}
            className="py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-90 border border-white/15 text-amber-300 font-black text-xs flex flex-col items-center justify-center gap-1 shadow-lg transition-all"
          >
            {getDirIcon(dir)}
            <span>{dir}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
