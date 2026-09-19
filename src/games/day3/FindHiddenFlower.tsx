import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';
import { GaneshaIdol } from '../../components/common/GaneshaIdol';
import { Sparkles } from 'lucide-react';

interface FindHiddenFlowerProps {
  onWin: (result: RewardResult) => void;
}

interface HiddenFlower {
  id: number;
  x: number; // percentage
  y: number;
  found: boolean;
}

export const FindHiddenFlower: React.FC<FindHiddenFlowerProps> = ({ onWin }) => {
  const [flowers, setFlowers] = useState<HiddenFlower[]>([
    { id: 1, x: 18, y: 22, found: false },
    { id: 2, x: 78, y: 28, found: false },
    { id: 3, x: 30, y: 62, found: false },
    { id: 4, x: 82, y: 72, found: false },
    { id: 5, x: 50, y: 84, found: false }
  ]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const handleTapFlower = (id: number) => {
    soundManager.playCoin();
    const newFlowers = flowers.map(f => f.id === id ? { ...f, found: true } : f);
    setFlowers(newFlowers);

    const newScore = score + 250;
    setScore(newScore);
    setCombo(prev => prev + 1);

    if (newFlowers.every(f => f.found)) {
      soundManager.playFanfare();
      setTimeout(() => {
        onWin({
          performance: 'PERFECT',
          stars: 3,
          score: newScore,
          tokens: 20
        });
      }, 700);
    }
  };

  const foundCount = flowers.filter(f => f.found).length;

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold z-10">
        <div className="text-amber-400">FLOWERS FOUND: {foundCount} / 5</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Detailed Festive Scene Area */}
      <div className="relative flex-1 w-full my-2 bg-gradient-to-b from-[#220E3E] via-[#17092C] to-[#0D041A] rounded-2xl border border-white/10 overflow-hidden">
        {/* Pandal Decor Scene background elements */}
        <div className="absolute inset-0 p-4 pointer-events-none opacity-40">
          <div className="text-4xl absolute top-3 left-6">🏮</div>
          <div className="text-4xl absolute top-3 right-6">🏮</div>
          <div className="text-5xl absolute top-12 left-1/2 -translate-x-1/2">🎪</div>
          <div className="absolute top-32 left-1/2 -translate-x-1/2 flex items-center justify-center">
            <GaneshaIdol size={80} type="festival" showHalo={true} showThrone={true} />
          </div>
          <div className="text-3xl absolute bottom-8 left-12">🪔</div>
          <div className="text-3xl absolute bottom-8 right-12">🪔</div>
          <div className="text-2xl absolute top-32 left-10">🔔</div>
          <div className="text-2xl absolute top-32 right-10">🔔</div>
        </div>

        {/* Hidden Flowers */}
        {flowers.map((f) => (
          <div
            key={f.id}
            onClick={() => !f.found && handleTapFlower(f.id)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 p-2"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
          >
            {f.found ? (
              <div className="text-3xl animate-bounce filter drop-shadow-[0_0_12px_#FFD700]">
                🌸
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-amber-400/20 hover:bg-amber-400/40 border border-amber-300/30 flex items-center justify-center text-lg filter opacity-75 hover:opacity-100 transition-all">
                🌺
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-amber-200 font-medium z-10">
        🔎 Inspect the pandal decorations and tap the 5 hidden golden flowers!
      </div>
    </div>
  );
};
