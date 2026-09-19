import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';
import { Check } from 'lucide-react';

interface PujaSequenceProps {
  onWin: (result: RewardResult) => void;
}

interface RitualCard {
  id: string;
  order: number;
  title: string;
  sanskrit: string;
  icon: string;
}

const RITUALS: RitualCard[] = [
  { id: 'diya', order: 1, title: 'Light Sacred Diya', sanskrit: 'Deepa Prajwalana', icon: '🪔' },
  { id: 'flower', order: 2, title: 'Offer Sacred Flowers', sanskrit: 'Pushparchana', icon: '🌸' },
  { id: 'modak', order: 3, title: 'Offer Sweet Modaks', sanskrit: 'Naivedya Samarpan', icon: '🥟' },
  { id: 'aarti', order: 4, title: 'Perform Mangal Aarti', sanskrit: 'Maha Aarti', icon: '🔔' }
];

export const PujaSequence: React.FC<PujaSequenceProps> = ({ onWin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);

  const handleCardClick = (card: RitualCard) => {
    if (card.order === currentStep) {
      // Correct ritual in sequence!
      soundManager.playBell();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 80 * nextCombo);

      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      if (nextStep > 4) {
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
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">RITUAL STEP: {currentStep - 1} / 4</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Header Prompt */}
      <div className="text-center my-1">
        <h3 className="text-base font-black text-amber-300 uppercase">
          PERFORM PUJA IN TRADITIONAL SEQUENCE:
        </h3>
        <p className="text-xs text-slate-300">
          Step {Math.min(4, currentStep)}: Choose the next sacred ritual to perform!
        </p>
      </div>

      {/* 4 Ritual Cards */}
      <div className="space-y-2.5 my-auto overflow-y-auto max-h-[380px] pr-1">
        {RITUALS.map((ritual) => {
          const isDone = ritual.order < currentStep;
          const isNext = ritual.order === currentStep;

          return (
            <div
              key={ritual.id}
              onClick={() => !isDone && handleCardClick(ritual)}
              className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-95 ${
                isDone
                  ? 'bg-emerald-950/40 border-emerald-500/50 opacity-60'
                  : isNext
                  ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.01]'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{ritual.icon}</span>
                <div>
                  <div className="text-xs font-bold text-white">{ritual.title}</div>
                  <div className="text-[10px] text-amber-300 font-semibold">{ritual.sanskrit}</div>
                </div>
              </div>

              <div>
                {isDone ? (
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                    <Check className="w-3.5 h-3.5" /> BLESSED
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 px-2 py-1 rounded-full bg-black/40">
                    STEP #{ritual.order}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs text-amber-200 font-medium">
        📜 Order: 1. Diya → 2. Flowers → 3. Modak → 4. Aarti
      </div>
    </div>
  );
};
