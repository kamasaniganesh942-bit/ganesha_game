import React, { useState, useEffect, useRef } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';

interface CoinCatcherProps {
  onWin: (result: RewardResult) => void;
}

interface FallingCoin {
  id: number;
  x: number; // percentage 5% to 90%
  y: number; // percentage 0% to 100%
  speed: number;
  val: number;
  color: string;
}

export const CoinCatcher: React.FC<CoinCatcherProps> = ({ onWin }) => {
  const [basketX, setBasketX] = useState(50); // percentage 10% to 90%
  const [coins, setCoins] = useState<FallingCoin[]>([]);
  const [collectedMoney, setCollectedMoney] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setBasketX(prev => Math.max(12, prev - 8));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setBasketX(prev => Math.min(88, prev + 8));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      finishGame();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Coin Spawner
  useEffect(() => {
    const spawner = setInterval(() => {
      const denominations = [
        { val: 5, color: 'text-amber-200' },
        { val: 10, color: 'text-amber-400' },
        { val: 20, color: 'text-yellow-300' }
      ];
      const denom = denominations[Math.floor(Math.random() * denominations.length)];
      const newCoin: FallingCoin = {
        id: Date.now() + Math.random(),
        x: Math.floor(Math.random() * 80) + 10,
        y: 0,
        speed: Math.random() * 1.5 + 2.5,
        val: denom.val,
        color: denom.color
      };
      setCoins(prev => [...prev, newCoin]);
    }, 700);

    return () => clearInterval(spawner);
  }, []);

  // Game Loop: update falling coins & check collision with basket
  useEffect(() => {
    const loop = setInterval(() => {
      setCoins(prevCoins => {
        const nextCoins: FallingCoin[] = [];
        prevCoins.forEach(coin => {
          const nextY = coin.y + coin.speed;

          // Check basket collision: Basket is around y = 84% to 94%
          if (nextY >= 82 && nextY <= 92 && Math.abs(coin.x - basketX) < 16) {
            // Caught!
            soundManager.playCoin();
            setCombo(c => c + 1);
            setCollectedMoney(m => m + coin.val);
            setScore(s => s + coin.val * 5);
          } else if (nextY > 100) {
            // Missed ground
            setCombo(0);
          } else {
            nextCoins.push({ ...coin, y: nextY });
          }
        });
        return nextCoins;
      });
    }, 40);

    return () => clearInterval(loop);
  }, [basketX]);

  const finishGame = () => {
    const finalScore = score + collectedMoney * 3;
    const performance = collectedMoney >= 90 ? 'PERFECT' : collectedMoney >= 50 ? 'GREAT' : 'GOOD';
    const stars = performance === 'PERFECT' ? 3 : performance === 'GREAT' ? 2 : 1;
    onWin({
      performance,
      stars,
      score: finalScore,
      tokens: 15,
      moneyEarned: Math.max(50, collectedMoney)
    });
  };

  // Touch / Drag handler
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(12, Math.min(88, xPct)));
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerMove}
      className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between touch-none"
    >
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold z-10">
        <div className="text-emerald-400">CATCH: ₹{collectedMoney}</div>
        <div className="text-amber-400">SCORE: {score}</div>
        <div className={`px-2 py-0.5 rounded-lg ${timeLeft <= 5 ? 'bg-red-500 text-white animate-pulse' : 'text-slate-300'}`}>
          ⏳ {timeLeft}s
        </div>
      </div>

      {/* Playfield */}
      <div className="relative flex-1 w-full overflow-hidden my-2">
        {/* Falling Coins */}
        {coins.map(coin => (
          <div
            key={coin.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 font-black"
            style={{ left: `${coin.x}%`, top: `${coin.y}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 border-2 border-yellow-200 flex items-center justify-center text-xs text-slate-900 shadow-md font-bold">
              ₹{coin.val}
            </div>
          </div>
        ))}

        {/* Basket */}
        <div
          className="absolute bottom-4 transform -translate-x-1/2 flex flex-col items-center pointer-events-none transition-transform duration-75"
          style={{ left: `${basketX}%` }}
        >
          <div className="text-3xl filter drop-shadow">🧺</div>
          <span className="text-[10px] font-black text-amber-300 bg-black/60 px-2 py-0.5 rounded-full border border-amber-400/40">
            BASKET
          </span>
        </div>
      </div>

      {/* Control Instruction & On-Screen Arrow Buttons for mobile tap */}
      <div className="flex items-center justify-between gap-2 z-10">
        <button
          onClick={() => setBasketX(prev => Math.max(12, prev - 14))}
          className="flex-1 py-3 bg-white/10 active:bg-white/20 rounded-2xl text-white font-bold text-sm border border-white/10"
        >
          ◀ LEFT
        </button>
        <span className="text-[11px] text-amber-200 text-center px-1">
          Drag basket or tap arrows
        </span>
        <button
          onClick={() => setBasketX(prev => Math.min(88, prev + 14))}
          className="flex-1 py-3 bg-white/10 active:bg-white/20 rounded-2xl text-white font-bold text-sm border border-white/10"
        >
          RIGHT ▶
        </button>
      </div>
    </div>
  );
};
