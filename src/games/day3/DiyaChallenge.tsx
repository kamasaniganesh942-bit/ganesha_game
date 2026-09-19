import React, { useState, useEffect, useRef } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { AnimatedButton } from '../../components/common/AnimatedButton';
import { ComboBadge } from '../../components/common/ComboBadge';
import { Sparkles } from 'lucide-react';

interface DiyaChallengeProps {
  onWin: (result: RewardResult) => void;
}

export const DiyaChallenge: React.FC<DiyaChallengeProps> = ({ onWin }) => {
  const [round, setRound] = useState(1);
  const [indicatorPos, setIndicatorPos] = useState(0); // 0 to 100%
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);
  const dirRef = useRef<number>(1);

  // Moving indicator loop
  useEffect(() => {
    const loop = setInterval(() => {
      setIndicatorPos(prev => {
        let next = prev + dirRef.current * 2.2;
        if (next >= 100) {
          next = 100;
          dirRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          dirRef.current = 1;
        }
        return next;
      });
    }, 20);

    return () => clearInterval(loop);
  }, []);

  const handleTap = () => {
    // Golden sweetspot is centered at 50% (range 42% to 58%)
    const dist = Math.abs(indicatorPos - 50);

    let feedback = 'MISS';
    let pts = 0;

    if (dist <= 4) {
      feedback = 'PERFECT!';
      pts = 150;
      soundManager.playBell();
      setCombo(c => c + 1);
    } else if (dist <= 10) {
      feedback = 'GREAT!';
      pts = 100;
      soundManager.playCoin();
      setCombo(c => c + 1);
    } else if (dist <= 18) {
      feedback = 'GOOD';
      pts = 50;
      soundManager.playClick();
      setCombo(0);
    } else {
      feedback = 'MISSED';
      soundManager.playError();
      setCombo(0);
    }

    setLastFeedback(feedback);
    setScore(s => s + pts);

    if (round >= 4) {
      soundManager.playFanfare();
      setTimeout(() => {
        onWin({
          performance: score >= 350 ? 'PERFECT' : 'GREAT',
          stars: score >= 350 ? 3 : 2,
          score: score + 200,
          tokens: 20
        });
      }, 500);
    } else {
      setRound(r => r + 1);
    }
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">AARTI ROUND: {round} / 4</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Aarti Altar Visual */}
      <div className="my-auto text-center py-4">
        <div className="w-28 h-28 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center text-5xl shadow-2xl animate-float-slow mb-4">
          🪔
        </div>

        {lastFeedback && (
          <div className="text-2xl font-black text-amber-300 animate-bounce mb-3 drop-shadow">
            {lastFeedback}
          </div>
        )}

        {/* Timing Bar */}
        <div className="relative w-full max-w-[300px] mx-auto h-8 bg-black/60 rounded-full border-2 border-amber-400/40 p-1 shadow-inner overflow-hidden">
          {/* Sweetspot zones */}
          {/* Good zone: 32% to 68% */}
          <div className="absolute top-1 bottom-1 left-[32%] right-[32%] bg-amber-500/30 rounded-full" />
          {/* Great zone: 40% to 60% */}
          <div className="absolute top-1 bottom-1 left-[40%] right-[40%] bg-amber-400/50 rounded-full" />
          {/* Perfect zone: 46% to 54% */}
          <div className="absolute top-1 bottom-1 left-[46%] right-[46%] bg-yellow-300 rounded-full shadow-[0_0_10px_#FFD700]" />

          {/* Moving Indicator */}
          <div
            className="absolute top-0 bottom-0 w-3 rounded-full bg-white border border-slate-900 shadow-md transform -translate-x-1/2 transition-none"
            style={{ left: `${indicatorPos}%` }}
          />
        </div>

        <div className="flex justify-center items-center gap-4 text-[10px] font-bold text-slate-400 mt-2">
          <span className="text-amber-400">GOOD</span>
          <span className="text-orange-300">GREAT</span>
          <span className="text-yellow-300 font-black">★ PERFECT ★</span>
        </div>
      </div>

      {/* Tap Action Button */}
      <AnimatedButton
        variant="gold"
        size="lg"
        className="w-full text-lg"
        icon={<Sparkles className="w-5 h-5 fill-current" />}
        onClick={handleTap}
      >
        AARTI TAP!
      </AnimatedButton>
    </div>
  );
};
