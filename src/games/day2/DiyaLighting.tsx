import React, { useState, useEffect } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { DiyaGlow } from '../../components/common/DiyaGlow';
import { ComboBadge } from '../../components/common/ComboBadge';

interface DiyaLightingProps {
  onWin: (result: RewardResult) => void;
}

export const DiyaLighting: React.FC<DiyaLightingProps> = ({ onWin }) => {
  const [diyas, setDiyas] = useState<boolean[]>([false, false, false, false, false, false]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) {
      finishGame();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleLightDiya = (idx: number) => {
    if (diyas[idx]) return;

    soundManager.playDiya();
    const nextCombo = combo + 1;
    setCombo(nextCombo);
    setScore(s => s + 80 * nextCombo);

    const nextDiyas = [...diyas];
    nextDiyas[idx] = true;
    setDiyas(nextDiyas);

    if (nextDiyas.every(Boolean)) {
      setTimeout(finishGame, 400);
    }
  };

  const finishGame = () => {
    const litCount = diyas.filter(Boolean).length;
    const performance = litCount === 6 ? 'PERFECT' : litCount >= 4 ? 'GREAT' : 'GOOD';
    const stars = performance === 'PERFECT' ? 3 : performance === 'GREAT' ? 2 : 1;
    soundManager.playFanfare();
    onWin({
      performance,
      stars,
      score: score + 200,
      tokens: 20
    });
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">LIT: {diyas.filter(Boolean).length} / 6</div>
        <div className="text-emerald-400">SCORE: {score}</div>
        <div className={`px-2 py-0.5 rounded-lg ${timeLeft <= 4 ? 'bg-red-500 text-white animate-pulse' : 'text-slate-300'}`}>
          ⏳ {timeLeft}s
        </div>
      </div>

      {/* Altar with 6 Diyas */}
      <div className="my-auto p-4 rounded-3xl bg-gradient-to-b from-[#251242] to-[#120722] border border-white/10 shadow-2xl">
        <div className="text-xs font-bold text-amber-300 uppercase tracking-wider text-center mb-4">
          TAP THE BRASS DIYAS TO ILLUMINATE THE SANCTUM:
        </div>

        <div className="grid grid-cols-3 gap-4 place-items-center py-4">
          {diyas.map((isLit, idx) => (
            <div
              key={idx}
              onClick={() => handleLightDiya(idx)}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all active:scale-90 ${
                isLit
                  ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_20px_rgba(255,179,0,0.5)] scale-105'
                  : 'bg-white/5 border-white/10 hover:border-amber-400/40'
              }`}
            >
              <DiyaGlow size={56} lit={isLit} />
              <span className={`text-[10px] font-bold mt-1 ${isLit ? 'text-amber-300' : 'text-slate-500'}`}>
                {isLit ? '✨ GLOWING' : 'TAP TO LIGHT'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-amber-200 font-medium">
        🪔 Light all 6 brass lamps before the oil burns low!
      </div>
    </div>
  );
};
