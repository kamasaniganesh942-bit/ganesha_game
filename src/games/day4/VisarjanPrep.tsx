import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';
import { Check } from 'lucide-react';

interface VisarjanPrepProps {
  onWin: (result: RewardResult) => void;
}

interface PrepStep {
  step: number;
  title: string;
  desc: string;
  icon: string;
}

const STEPS: PrepStep[] = [
  { step: 1, title: 'Farewell Flower Garland', desc: 'Offering final fragrant marigolds & lotus', icon: '🌸' },
  { step: 2, title: 'Final Uttarpuja Diya', desc: 'Lighting the sacred farewell oil lamp', icon: '🪔' },
  { step: 3, title: 'Community Prarthana', desc: 'Seeking blessings & chanting "Ganpati Bappa Morya"', icon: '🙏' },
  { step: 4, title: 'Lift Palkhi to Lake Ghat', desc: 'Procession chariot gently lifted toward the serene waters', icon: '🚶‍♂️' }
];

export const VisarjanPrep: React.FC<VisarjanPrepProps> = ({ onWin }) => {
  const [completedStep, setCompletedStep] = useState(0); // 0 to 4
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const handleCompleteStep = (step: PrepStep) => {
    if (step.step === completedStep + 1) {
      soundManager.playBell();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 75 * nextCombo);

      const nextStep = completedStep + 1;
      setCompletedStep(nextStep);

      if (nextStep >= 4) {
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

  const progressPct = (completedStep / 4) * 100;

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">READINESS: {progressPct}%</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-black/30 h-2.5 rounded-full overflow-hidden border border-white/10 my-1">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* 4 Steps Checklist Cards */}
      <div className="space-y-2.5 my-auto overflow-y-auto max-h-[380px] pr-1">
        {STEPS.map((s) => {
          const isDone = s.step <= completedStep;
          const isNext = s.step === completedStep + 1;

          return (
            <div
              key={s.step}
              onClick={() => !isDone && handleCompleteStep(s)}
              className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-95 ${
                isDone
                  ? 'bg-emerald-950/40 border-emerald-500/50 opacity-60'
                  : isNext
                  ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.01]'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{s.icon}</span>
                <div>
                  <div className="text-xs font-bold text-white">{s.title}</div>
                  <div className="text-[10px] text-slate-300">{s.desc}</div>
                </div>
              </div>

              <div>
                {isDone ? (
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                    <Check className="w-3.5 h-3.5" /> READY
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-300 px-2 py-1 rounded-full bg-amber-500/20">
                    STEP #{s.step}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs text-amber-200 font-medium">
        🙏 Complete all 4 sacred preparation rituals to reach 100% readiness!
      </div>
    </div>
  );
};
