import React, { useState, useRef } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';

interface TargetTossProps {
  onWin: (result: RewardResult) => void;
}

interface BoxTarget {
  id: string;
  name: string;
  value: number;
  scorePts: number;
  x: number; // percentage
  color: string;
  borderColor: string;
}

const BOXES: BoxTarget[] = [
  { id: 'bronze', name: 'Bronze Hundi', value: 20, scorePts: 50, x: 20, color: 'from-amber-700 to-amber-900', borderColor: 'border-amber-600' },
  { id: 'gold', name: 'Golden Hundi', value: 100, scorePts: 150, x: 50, color: 'from-yellow-400 to-amber-600', borderColor: 'border-yellow-300' },
  { id: 'silver', name: 'Silver Hundi', value: 50, scorePts: 100, x: 80, color: 'from-slate-300 to-slate-500', borderColor: 'border-slate-200' }
];

export const TargetToss: React.FC<TargetTossProps> = ({ onWin }) => {
  const [coinPos, setCoinPos] = useState<{ x: number; y: number }>({ x: 50, y: 85 });
  const [isAiming, setIsAiming] = useState(false);
  const [aimVector, setAimVector] = useState<{ dx: number; dy: number }>({ dx: 0, dy: -50 });
  const [isTossing, setIsTossing] = useState(false);
  const [tossesLeft, setTossesLeft] = useState(5);
  const [score, setScore] = useState(0);
  const [collectedMoney, setCollectedMoney] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const playfieldRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isTossing || tossesLeft <= 0) return;
    setIsAiming(true);
    updateAim(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isAiming) return;
    updateAim(e);
  };

  const updateAim = (e: React.PointerEvent) => {
    if (!playfieldRef.current) return;
    const rect = playfieldRef.current.getBoundingClientRect();
    const touchX = ((e.clientX - rect.left) / rect.width) * 100;
    const touchY = ((e.clientY - rect.top) / rect.height) * 100;

    // Aim vector from bottom center (50, 85) toward touch position
    const dx = touchX - 50;
    const dy = touchY - 85;
    setAimVector({ dx, dy: Math.min(-20, dy) });
  };

  const handlePointerUp = () => {
    if (!isAiming || isTossing) return;
    setIsAiming(false);
    executeToss();
  };

  const executeToss = () => {
    setIsTossing(true);
    soundManager.playCoin();

    // Determine target landing x based on aim dx
    const landingX = Math.max(15, Math.min(85, 50 + aimVector.dx * 1.2));
    const landingY = 28;

    // Animate coin
    setCoinPos({ x: landingX, y: landingY });

    setTimeout(() => {
      // Check which box was hit
      let hitBox: BoxTarget | null = null;
      for (const box of BOXES) {
        if (Math.abs(landingX - box.x) < 14) {
          hitBox = box;
          break;
        }
      }

      if (hitBox) {
        soundManager.playFanfare();
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        setCollectedMoney(m => m + hitBox!.value);
        setScore(s => s + hitBox!.scorePts * nextCombo);
        setFeedback(`Landed in ${hitBox.name}! +₹${hitBox.value}`);
      } else {
        soundManager.playError();
        setCombo(0);
        setFeedback('Missed! Try angling closer to the boxes.');
      }

      const nextTosses = tossesLeft - 1;
      setTossesLeft(nextTosses);

      // Reset coin after delay
      setTimeout(() => {
        setCoinPos({ x: 50, y: 85 });
        setIsTossing(false);
        setFeedback(null);

        if (nextTosses <= 0) {
          // Finish Day 1 final game!
          const performance = collectedMoney >= 120 ? 'PERFECT' : collectedMoney >= 60 ? 'GREAT' : 'GOOD';
          const stars = performance === 'PERFECT' ? 3 : performance === 'GREAT' ? 2 : 1;
          onWin({
            performance,
            stars,
            score: score + 300,
            tokens: 25,
            moneyEarned: Math.max(80, collectedMoney)
          });
        }
      }, 900);
    }, 450);
  };

  return (
    <div
      ref={playfieldRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between touch-none"
    >
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold z-10">
        <div className="text-emerald-400">WON: ₹{collectedMoney}</div>
        <div className="text-amber-400">SCORE: {score}</div>
        <div className="text-pink-300">TOSSES: {tossesLeft}</div>
      </div>

      {/* Playfield */}
      <div className="relative flex-1 w-full overflow-hidden my-2">
        {/* Donation Boxes at the top */}
        <div className="absolute top-4 inset-x-0 flex justify-around px-2">
          {BOXES.map(box => (
            <div
              key={box.id}
              className={`w-24 h-24 rounded-2xl bg-gradient-to-b ${box.color} border-2 ${box.borderColor} p-2 flex flex-col items-center justify-between shadow-lg text-center`}
            >
              <div className="text-xl">🏺</div>
              <div className="text-[10px] font-bold text-white leading-tight">{box.name}</div>
              <div className="text-xs font-black text-amber-200 bg-black/40 px-2 py-0.5 rounded-full">
                ₹{box.value}
              </div>
            </div>
          ))}
        </div>

        {/* Aim guide dotted line */}
        {isAiming && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line
              x1="50%"
              y1="85%"
              x2={`${50 + aimVector.dx}%`}
              y2={`${85 + aimVector.dy}%`}
              stroke="#FFD700"
              strokeWidth="3"
              strokeDasharray="6,6"
            />
          </svg>
        )}

        {/* Flying / Resting Coin */}
        <div
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all ${
            isTossing ? 'duration-500 ease-out scale-75' : 'duration-150'
          }`}
          style={{ left: `${coinPos.x}%`, top: `${coinPos.y}%` }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 border-2 border-yellow-200 flex items-center justify-center text-sm font-black text-slate-900 shadow-xl">
            ₹
          </div>
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className="absolute top-36 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/80 border border-amber-400 text-amber-300 text-xs font-black animate-fadeIn text-center whitespace-nowrap">
            {feedback}
          </div>
        )}
      </div>

      <div className="text-center text-xs text-amber-200 font-medium z-10">
        🎯 Drag from the coin to aim, release to toss into a hundi!
      </div>
    </div>
  );
};
