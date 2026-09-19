import React, { useState, useEffect, useRef } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { Shield, Sparkles, AlertTriangle } from 'lucide-react';

interface LuckyDeliveryProps {
  onWin: (result: RewardResult) => void;
}

interface Obstacle {
  id: number;
  lane: number; // 0: Left, 1: Center, 2: Right
  y: number; // 0 to 100%
  type: 'puddle' | 'dog' | 'cart' | 'coin';
}

export const LuckyDelivery: React.FC<LuckyDeliveryProps> = ({ onWin }) => {
  const [playerLane, setPlayerLane] = useState(1); // 0, 1, 2
  const [distance, setDistance] = useState(0); // 0 to 100 meters
  const [health, setHealth] = useState(3);
  const [bonusCoins, setBonusCoins] = useState(0);
  const [isHit, setIsHit] = useState(false);
  const [reachedFinish, setReachedFinish] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);

  const distanceRef = useRef(0);
  const healthRef = useRef(3);
  const playerLaneRef = useRef(1);
  const reachedFinishRef = useRef(false);

  playerLaneRef.current = playerLane;
  healthRef.current = health;
  distanceRef.current = distance;
  reachedFinishRef.current = reachedFinish;

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (reachedFinishRef.current) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setPlayerLane(l => Math.max(0, l - 1));
        soundManager.playClick();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setPlayerLane(l => Math.min(2, l + 1));
        soundManager.playClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main game tick
  useEffect(() => {
    if (reachedFinish) return;

    let obstacleCounter = 0;
    const interval = setInterval(() => {
      // Advance distance
      setDistance(prev => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(interval);
          setReachedFinish(true);
          soundManager.playFanfare();
          setTimeout(() => {
            const finalHealth = healthRef.current;
            const stars: 1 | 2 | 3 = finalHealth === 3 ? 3 : finalHealth === 2 ? 2 : 1;
            onWin({
              performance: stars === 3 ? 'PERFECT' : 'GREAT',
              stars,
              score: 200 + bonusCoins * 15,
              tokens: 20,
              moneyEarned: 150
            });
          }, 2000);
          return 100;
        }
        return next;
      });

      // Spawn obstacles periodically
      obstacleCounter++;
      if (obstacleCounter % 14 === 0 && distanceRef.current < 90) {
        const randomLane = Math.floor(Math.random() * 3);
        const isCoin = Math.random() > 0.55;
        const types: ('puddle' | 'dog' | 'cart')[] = ['puddle', 'dog', 'cart'];
        const randomType = isCoin ? 'coin' : types[Math.floor(Math.random() * types.length)];

        setObstacles(prev => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            lane: randomLane,
            y: 0,
            type: randomType
          }
        ]);
      }

      // Move obstacles & detect collision
      setObstacles(prev => {
        const nextList: Obstacle[] = [];
        for (const obs of prev) {
          const nextY = obs.y + 4;
          // Collision zone near player (y ~ 75% to 88%)
          if (nextY >= 72 && nextY <= 86 && obs.lane === playerLaneRef.current) {
            if (obs.type === 'coin') {
              soundManager.playCoin();
              setBonusCoins(c => c + 1);
              continue; // remove collected coin
            } else {
              soundManager.playError();
              setIsHit(true);
              setTimeout(() => setIsHit(false), 300);
              setHealth(h => {
                const nextH = Math.max(1, h - 1);
                return nextH;
              });
              continue; // remove collided obstacle
            }
          }

          if (nextY < 100) {
            nextList.push({ ...obs, y: nextY });
          }
        }
        return nextList;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [reachedFinish, bonusCoins, onWin]);

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-4 select-none">
      {/* HUD Header */}
      <div className="w-full bg-amber-950/80 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-amber-300 font-black text-xs tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            LUCKY DELIVERY TO PANDAL
          </h3>
          <p className="text-[11px] text-amber-100/70">Rush treasury box to Organizer Ramesh</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Health Hearts */}
          <div className="flex items-center gap-1 bg-amber-900/60 px-2 py-1 rounded-xl border border-amber-500/30">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-black text-rose-400">
              {'❤️'.repeat(health)}
            </span>
          </div>

          {/* Bonus Coins */}
          <div className="bg-amber-900/60 px-2 py-1 rounded-xl border border-amber-500/30 text-xs font-black text-amber-300">
            🪙 {bonusCoins}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full mt-2 bg-amber-950/60 rounded-full h-3 border border-amber-600/30 overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 transition-all duration-100"
          style={{ width: `${distance}%` }}
        />
        <span className="absolute inset-0 text-[9px] font-black text-white text-center leading-3">
          {distance}m / 100m
        </span>
      </div>

      {/* 3-Lane Street Canvas */}
      <div
        className={`relative w-full aspect-[4/5] my-auto bg-gradient-to-b from-amber-950 via-stone-900 to-amber-950 rounded-3xl border-2 border-amber-500/40 overflow-hidden shadow-2xl transition-transform ${
          isHit ? 'animate-shake' : ''
        }`}
      >
        {/* Street Lines & Bunting */}
        <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-20">
          <div className="w-0.5 h-full border-r-2 border-dashed border-amber-400" />
          <div className="w-0.5 h-full border-r-2 border-dashed border-amber-400" />
        </div>

        {/* Festive Toran Garland Top */}
        <div className="absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-amber-600/30 to-transparent flex justify-around text-xs pointer-events-none">
          <span>🏮</span><span>🌸</span><span>🏮</span><span>🌸</span><span>🏮</span>
        </div>

        {/* Finish Line (Appears as distance > 80m) */}
        {distance >= 80 && (
          <div
            className="absolute inset-x-0 bg-emerald-500/30 border-y-2 border-emerald-400 text-center py-1 transition-all duration-300"
            style={{ top: `${Math.min(90, (distance - 80) * 4.5)}%` }}
          >
            <span className="text-xs font-black text-emerald-300 tracking-wider">
              🚩 COMMUNITY PANDAL ENTRANCE 🚩
            </span>
          </div>
        )}

        {/* Obstacles & Pickups */}
        {obstacles.map(obs => {
          const laneX = obs.lane === 0 ? 'left-[16%]' : obs.lane === 1 ? 'left-[50%]' : 'left-[84%]';
          return (
            <div
              key={obs.id}
              style={{ top: `${obs.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform ${laneX}`}
            >
              {obs.type === 'coin' && (
                <div className="w-9 h-9 rounded-full bg-amber-400/30 border border-amber-300 flex items-center justify-center text-xl animate-bounce shadow-lg">
                  🪙
                </div>
              )}
              {obs.type === 'puddle' && (
                <div className="w-12 h-8 rounded-full bg-sky-600/40 border border-sky-400/50 flex items-center justify-center text-xs">
                  💧
                </div>
              )}
              {obs.type === 'dog' && (
                <div className="text-2xl filter drop-shadow animate-pulse">
                  🐕
                </div>
              )}
              {obs.type === 'cart' && (
                <div className="w-11 h-9 bg-amber-800/80 rounded-lg border border-amber-600 flex items-center justify-center text-xs text-amber-200 font-bold">
                  🛒
                </div>
              )}
            </div>
          );
        })}

        {/* Player: Carrying the Donation Box */}
        <div
          className={`absolute bottom-10 -translate-x-1/2 transition-all duration-150 ${
            playerLane === 0 ? 'left-[16%]' : playerLane === 1 ? 'left-[50%]' : 'left-[84%]'
          }`}
        >
          <div className="relative flex flex-col items-center">
            {/* Treasury Box with Sparkle */}
            <div className="w-12 h-8 bg-amber-500 rounded-lg border-2 border-amber-200 shadow-xl flex items-center justify-center text-xs font-black text-amber-950 animate-pulse">
              ₹500 📦
            </div>
            {/* Runner Avatar */}
            <div className="text-3xl -mt-1">
              🏃‍♂️
            </div>
          </div>
        </div>

        {/* Finish Arrival Dialog */}
        {reachedFinish && (
          <div className="absolute inset-4 bg-amber-950/95 border-2 border-amber-400 rounded-3xl p-5 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-md animate-in zoom-in-90 z-20">
            <div className="text-5xl mb-2 animate-bounce">🙏</div>
            <h4 className="text-amber-300 font-black text-lg">DELIVERY COMPLETE!</h4>
            <p className="text-xs text-amber-100 font-medium mt-1">
              Organizer Ramesh welcomes you warmly at the Pandal:
            </p>
            <div className="my-3 p-3 bg-amber-900/60 rounded-2xl border border-amber-500/30 text-xs text-amber-200 italic">
              "Shabash! You safely brought the entire community's ₹500 collection! The festival is officially funded!"
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
              <Sparkles className="w-4 h-4" />
              Day 1 Complete • Building Unlocked!
            </div>
          </div>
        )}
      </div>

      {/* On-Screen Mobile Touch Controls */}
      <div className="w-full flex items-center justify-between gap-4 mt-2">
        <button
          onClick={() => {
            setPlayerLane(l => Math.max(0, l - 1));
            soundManager.playClick();
          }}
          disabled={playerLane === 0 || reachedFinish}
          className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-black rounded-2xl shadow-lg active:scale-95 disabled:opacity-40 transition flex items-center justify-center gap-2"
        >
          <span>⬅️</span>
          <span>LEFT LANE</span>
        </button>

        <button
          onClick={() => {
            setPlayerLane(l => Math.min(2, l + 1));
            soundManager.playClick();
          }}
          disabled={playerLane === 2 || reachedFinish}
          className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black rounded-2xl shadow-lg active:scale-95 disabled:opacity-40 transition flex items-center justify-center gap-2"
        >
          <span>RIGHT LANE</span>
          <span>➡️</span>
        </button>
      </div>
    </div>
  );
};
