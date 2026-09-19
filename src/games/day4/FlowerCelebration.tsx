import React, { useState, useEffect, useRef } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { Sparkles, Star } from 'lucide-react';

interface FlowerCelebrationProps {
  onWin: (result: RewardResult) => void;
}

interface BloomItem {
  id: number;
  lane: number; // 0, 1, 2
  y: number; // 0 to 100%
  isStar: boolean;
  icon: string;
}

export const FlowerCelebration: React.FC<FlowerCelebrationProps> = ({ onWin }) => {
  const [basketLane, setBasketLane] = useState(1);
  const [flowersCollected, setFlowersCollected] = useState(0);
  const [starsCollected, setStarsCollected] = useState(0);
  const [blooms, setBlooms] = useState<BloomItem[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const basketLaneRef = useRef(1);
  const flowersCollectedRef = useRef(0);
  const starsCollectedRef = useRef(0);
  const isCompletedRef = useRef(false);

  basketLaneRef.current = basketLane;
  flowersCollectedRef.current = flowersCollected;
  starsCollectedRef.current = starsCollected;
  isCompletedRef.current = isCompleted;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompletedRef.current) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setBasketLane(l => Math.max(0, l - 1));
        soundManager.playClick();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setBasketLane(l => Math.min(2, l + 1));
        soundManager.playClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Spawn and fall loop
  useEffect(() => {
    if (isCompleted) return;

    let counter = 0;
    const interval = setInterval(() => {
      counter++;

      // Spawn falling flowers every 7 ticks
      if (counter % 7 === 0 && flowersCollectedRef.current < 6) {
        const lane = Math.floor(Math.random() * 3);
        const isStar = Math.random() > 0.65;
        const flowerIcons = ['🌸', '🌺', '🌼', '🏵️'];
        const randomIcon = isStar ? '⭐' : flowerIcons[Math.floor(Math.random() * flowerIcons.length)];

        setBlooms(prev => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            lane,
            y: 0,
            isStar,
            icon: randomIcon
          }
        ]);
      }

      // Move items down & detect basket catch
      setBlooms(prev => {
        const next: BloomItem[] = [];
        for (const b of prev) {
          const nextY = b.y + 5;
          // Catch zone near bottom basket (y ~ 74% to 88%)
          if (nextY >= 72 && nextY <= 86 && b.lane === basketLaneRef.current) {
            if (b.isStar) {
              soundManager.playBell();
              soundManager.playCoin();
              setStarsCollected(s => s + 1);
            } else {
              soundManager.playBell();
              setFlowersCollected(f => f + 1);
            }

            // Check goal
            if (flowersCollectedRef.current + 1 >= 6 && starsCollectedRef.current >= 1) {
              setIsCompleted(true);
              soundManager.playFanfare();
              setTimeout(() => {
                onWin({
                  performance: 'PERFECT',
                  stars: 3,
                  score: 280,
                  tokens: 25
                });
              }, 450);
            }
            continue;
          }

          if (nextY <= 100) {
            next.push({ ...b, y: nextY });
          }
        }
        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [isCompleted, onWin]);

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-4 select-none">
      {/* Top Banner */}
      <div className="w-full bg-amber-950/80 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-amber-300 font-black text-xs tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            FLOWER & GULAL CELEBRATION
          </h3>
          <p className="text-[11px] text-amber-100/70">Catch flower showers & golden star blooms</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Star Blooms */}
          <div className="flex items-center gap-1 bg-amber-900/80 px-2 py-1 rounded-xl border border-amber-500/40 text-xs font-black text-amber-300">
            <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
            <span>{starsCollected} / 1</span>
          </div>

          {/* Flowers */}
          <div className="bg-amber-900/80 px-2.5 py-1 rounded-xl border border-amber-500/40 text-xs font-black text-rose-300">
            🌸 {flowersCollected} / 6
          </div>
        </div>
      </div>

      {/* Flower Shower Lane Canvas */}
      <div className="relative w-full aspect-[4/5] my-auto bg-gradient-to-b from-rose-950 via-purple-950 to-amber-950 rounded-3xl border-2 border-amber-500/40 overflow-hidden shadow-2xl">
        {/* Floating Gulal Clouds */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-1/4 w-32 h-32 rounded-full bg-pink-500 blur-3xl animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-orange-500 blur-3xl animate-pulse" />
        </div>

        {/* 3 Procession Lanes */}
        <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-20">
          <div className="w-0.5 h-full border-r-2 border-dashed border-pink-400" />
          <div className="w-0.5 h-full border-r-2 border-dashed border-pink-400" />
        </div>

        {/* Falling Blooms */}
        {blooms.map(b => {
          const laneX = b.lane === 0 ? 'left-[16%]' : b.lane === 1 ? 'left-[50%]' : 'left-[84%]';
          return (
            <div
              key={b.id}
              style={{ top: `${b.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform ${laneX}`}
            >
              {b.isStar ? (
                <div className="w-10 h-10 rounded-full bg-amber-400/40 border-2 border-amber-300 flex items-center justify-center text-xl shadow-[0_0_15px_#fde047] animate-spin-slow">
                  ⭐
                </div>
              ) : (
                <div className="text-3xl filter drop-shadow-md animate-spin-slow">
                  {b.icon}
                </div>
              )}
            </div>
          );
        })}

        {/* Player Flower Catching Tray Basket */}
        <div
          className={`absolute bottom-10 -translate-x-1/2 transition-all duration-150 ${
            basketLane === 0 ? 'left-[16%]' : basketLane === 1 ? 'left-[50%]' : 'left-[84%]'
          }`}
        >
          <div className="relative flex flex-col items-center">
            {/* Flower Shower Particle Trail */}
            <div className="text-xs text-amber-300/80 -mb-1 animate-pulse">✨ ✨</div>
            {/* Basket Tray */}
            <div className="w-16 h-10 bg-amber-600/90 border-2 border-amber-300 rounded-b-2xl shadow-xl flex items-center justify-center text-xl">
              🧺
            </div>
            <span className="text-[9px] font-black text-amber-200 uppercase mt-0.5">DEVOTEE TRAY</span>
          </div>
        </div>

        {/* Completion Dialogue */}
        {isCompleted && (
          <div className="absolute inset-4 bg-amber-950/95 border-2 border-amber-400 rounded-3xl p-5 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-md animate-in zoom-in-90 z-20">
            <span className="text-5xl mb-2 animate-bounce">💐</span>
            <h4 className="text-amber-300 font-black text-lg">FLOWER SHOWER CELEBRATION!</h4>
            <p className="text-xs text-amber-100 font-medium mt-1">
              The streets are blanketed in fragrant blooms and golden starlight!
            </p>
          </div>
        )}
      </div>

      {/* On-Screen Mobile Controls */}
      <div className="w-full flex items-center justify-between gap-4 mt-2">
        <button
          onClick={() => {
            setBasketLane(l => Math.max(0, l - 1));
            soundManager.playClick();
          }}
          disabled={basketLane === 0 || isCompleted}
          className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-black rounded-2xl shadow-lg active:scale-95 disabled:opacity-40 transition flex items-center justify-center gap-2"
        >
          <span>⬅️</span>
          <span>LEFT LANE</span>
        </button>

        <button
          onClick={() => {
            setBasketLane(l => Math.min(2, l + 1));
            soundManager.playClick();
          }}
          disabled={basketLane === 2 || isCompleted}
          className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black rounded-2xl shadow-lg active:scale-95 disabled:opacity-40 transition flex items-center justify-center gap-2"
        >
          <span>RIGHT LANE</span>
          <span>➡️</span>
        </button>
      </div>
    </div>
  );
};
