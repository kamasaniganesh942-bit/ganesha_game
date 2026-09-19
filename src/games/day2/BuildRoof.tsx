import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';
import { Check } from 'lucide-react';

interface BuildRoofProps {
  onWin: (result: RewardResult) => void;
}

interface RoofPart {
  id: string;
  name: string;
  icon: string;
  step: number;
}

const PARTS: RoofPart[] = [
  { id: 'fabric', name: 'Silk Canopy Fabric', icon: '⛺', step: 1 },
  { id: 'dome', name: 'Carved Mandap Dome', icon: '🏛️', step: 2 },
  { id: 'garland', name: 'Roof Marigold Garland', icon: '🌸', step: 3 },
  { id: 'kalash', name: 'Golden Kalash Pinnacle', icon: '🪙', step: 4 }
];

export const BuildRoof: React.FC<BuildRoofProps> = ({ onWin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);

  const handleSelectPart = (part: RoofPart) => {
    if (part.step === currentStep) {
      // Correct sequence
      soundManager.playDhol(true);
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 100 * nextCombo);

      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      if (nextStep > PARTS.length) {
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
        <div className="text-amber-400">ROOF PROGRESS: {currentStep - 1} / 4</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Roof Visual Assembly */}
      <div className="my-auto text-center py-4">
        <div className="w-48 h-48 mx-auto bg-gradient-to-b from-[#241240] to-[#120722] rounded-3xl border-2 border-amber-500/40 p-4 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden">
          {/* Golden Kalash Top */}
          <div className={`transition-all duration-300 ${currentStep > 4 ? 'opacity-100 scale-100' : 'opacity-20 scale-75'}`}>
            <span className="text-4xl filter drop-shadow-[0_0_10px_#FFD700]">🪙</span>
          </div>

          {/* Marigold Garland */}
          <div className={`transition-all duration-300 ${currentStep > 3 ? 'opacity-100' : 'opacity-20'}`}>
            <span className="text-2xl">🌸 🌼 🌸</span>
          </div>

          {/* Carved Mandap Dome */}
          <div className={`transition-all duration-300 ${currentStep > 2 ? 'opacity-100' : 'opacity-20'}`}>
            <span className="text-4xl">🏛️</span>
          </div>

          {/* Silk Canopy Fabric */}
          <div className={`transition-all duration-300 ${currentStep > 1 ? 'opacity-100' : 'opacity-20'}`}>
            <span className="text-4xl">⛺</span>
          </div>
        </div>

        <div className="mt-3 text-xs font-bold text-amber-200">
          Step {Math.min(4, currentStep)}: Assemble from base canopy up to Golden Kalash!
        </div>
      </div>

      {/* Available Parts Tray */}
      <div className="grid grid-cols-2 gap-2.5">
        {PARTS.map((part) => {
          const isDone = part.step < currentStep;
          return (
            <button
              key={part.id}
              disabled={isDone}
              onClick={() => handleSelectPart(part)}
              className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all active:scale-95 ${
                isDone
                  ? 'bg-emerald-950/40 border-emerald-500/40 opacity-40 cursor-not-allowed'
                  : 'bg-white/10 border-white/15 hover:border-amber-400/60'
              }`}
            >
              <span className="text-2xl">{isDone ? <Check className="w-5 h-5 text-emerald-400" /> : part.icon}</span>
              <div className="text-left">
                <div className="text-xs font-bold text-white">{part.name}</div>
                <div className="text-[10px] text-slate-400">Step #{part.step}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
