import React, { useState, useEffect, useRef } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { Heart, Sparkles, Shield } from 'lucide-react';
import { GaneshaIdol } from '../../components/common/GaneshaIdol';

interface IdolCarryingChallengeProps {
  onWin: (result: RewardResult) => void;
}

interface Obstacle {
  id: number;
  lane: number; // 0, 1, 2
  y: number; // 0 to 100%
  type: 'crate' | 'puddle' | 'petal' | 'modak';
}

export const IdolCarryingChallenge: React.FC<IdolCarryingChallengeProps> = ({ onWin }) => {
  const [playerLane, setPlayerLane] = useState(1);
  const [distance, setDistance] = useState(0); // 0 to 100m
  const [devotion, setDevotion] = useState(100); // 0 to 100%
  const [petalsCollected, setPetalsCollected] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [reachedGate, setReachedGate] = useState(false);

  const playerLaneRef = useRef(1);
  const devotionRef = useRef(100);
  const distanceRef = useRef(0);
  const reachedGateRef = useRef(false);

  playerLaneRef.current = playerLane;
  devotionRef.current = devotion;
  distanceRef.current = distance;
  reachedGateRef.current = reachedGate;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (reachedGateRef.current) return;
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

  // Main loop
  useEffect(() => {
    if (reachedGate) return;

    let counter = 0;
    const interval = setInterval(() => {
      setDistance(prev => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(interval);
          setReachedGate(true);
          soundManager.playBell();
          soundManager.playFanfare();
          setTimeout(() => {
            const finalDevotion = devotionRef.current;
            const stars: 1 | 2 | 3 = finalDevotion >= 75 ? 3 : finalDevotion >= 45 ? 2 : 1;
            onWin({
              performance: stars === 3 ? 'PERFECT' : 'GREAT',
              stars,
              score: 220 + petalsCollected * 15,
              tokens: 20
            });
          }, 2000);
          return 100;
        }
        return next;
      });

      // Periodic spawn
      counter++;
      if (counter % 12 === 0 && distanceRef.current < 92) {
        const lane = Math.floor(Math.random() * 3);
        const isPetal = Math.random() > 0.45;
        const obstacleTypes: ('crate' | 'puddle')[] = ['crate', 'puddle'];
        const rewardTypes: ('petal' | 'modak')[] = ['petal', 'modak'];

        const type = isPetal
          ? rewardTypes[Math.floor(Math.random() * rewardTypes.length)]
          : obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

        setObstacles(prev => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            lane,
            y: 0,
            type
          }
        ]);
      }

      // Move & detect collision
      setObstacles(prev => {
        const nextList: Obstacle[] = [];
        for (const obs of prev) {
          const nextY = obs.y + 4;
          if (nextY >= 72 && nextY <= 86 && obs.lane === playerLaneRef.current) {
            if (obs.type === 'petal' || obs.type === 'modak') {
              soundManager.playCoin();
              soundManager.playBell();
              setPetalsCollected(p => p + 1);
              setDevotion(d => Math.min(100, d + 5));
              continue;
            } else {
              soundManager.playError();
              setDevotion(d => Math.max(20, d - 15));
              continue;
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
  }, [reachedGate, petalsCollected, onWin]);

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-4 select-none">
      {/* Top Banner */}
      <div className="w-full bg-amber-950/80 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-amber-300 font-black text-xs tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            IDOL CARRYING PROCESSION
          </h3>
          <p className="text-[11px] text-amber-100/70">Balance & carry Bappa safely to the pandal</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Devotion / Balance Meter */}
          <div className="flex items-center gap-1 bg-amber-900/60 px-2 py-1 rounded-xl border border-amber-500/30">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
            <span className="text-xs font-black text-rose-300">{devotion}%</span>
          </div>

          <div className="bg-amber-900/60 px-2 py-1 rounded-xl border border-amber-500/30 text-xs font-black text-amber-300">
            🌸 {petalsCollected}
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
      <div className="relative w-full aspect-[4/5] my-auto bg-gradient-to-b from-amber-950 via-stone-900 to-amber-950 rounded-3xl border-2 border-amber-500/40 overflow-hidden shadow-2xl">
        {/* Festive Toran Garland Top */}
        <div className="absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-amber-600/30 to-transparent flex justify-around text-xs pointer-events-none">
          <span>🏮</span><span>🌸</span><span>🏮</span><span>🌸</span><span>🏮</span>
        </div>

        {/* Lane dividers */}
        <div className="absolute inset-0 flex justify-between px-6 pointer-events-none opacity-20">
          <div className="w-0.5 h-full border-r-2 border-dashed border-amber-400" />
          <div className="w-0.5 h-full border-r-2 border-dashed border-amber-400" />
        </div>

        {/* Pandal Arrival Arch at End */}
        {distance >= 80 && (
          <div
            className="absolute inset-x-0 bg-emerald-500/30 border-y-2 border-emerald-400 text-center py-1 transition-all duration-300"
            style={{ top: `${Math.min(90, (distance - 80) * 4.5)}%` }}
          >
            <span className="text-xs font-black text-emerald-300 tracking-wider">
              🚩 TEMPLE MANDAP GATES 🚩
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
              {obs.type === 'petal' && (
                <div className="w-8 h-8 rounded-full bg-rose-500/30 border border-rose-400 flex items-center justify-center text-lg animate-spin-slow">
                  🌸
                </div>
              )}
              {obs.type === 'modak' && (
                <div className="w-8 h-8 rounded-full bg-amber-400/30 border border-amber-300 flex items-center justify-center text-lg animate-bounce">
                  🥟
                </div>
              )}
              {obs.type === 'crate' && (
                <div className="w-10 h-8 bg-amber-800/80 rounded border border-amber-600 flex items-center justify-center text-xs text-amber-200 font-bold">
                  📦
                </div>
              )}
              {obs.type === 'puddle' && (
                <div className="w-10 h-6 bg-sky-600/40 rounded-full border border-sky-400 flex items-center justify-center text-xs">
                  💧
                </div>
              )}
            </div>
          );
        })}

        {/* Player: Carrying Palkhi with Ganesha */}
        <div
          className={`absolute bottom-10 -translate-x-1/2 transition-all duration-150 ${
            playerLane === 0 ? 'left-[16%]' : playerLane === 1 ? 'left-[50%]' : 'left-[84%]'
          }`}
        >
          <div className="relative flex flex-col items-center">
            {/* Palanquin Roof with Golden Umbrella */}
            <div className="text-2xl animate-pulse">☂️</div>
            {/* Lord Ganesha Idol on Palanquin */}
            <div className="relative -mt-2 drop-shadow-xl flex items-center justify-center">
              <GaneshaIdol size={64} showHalo={false} showThrone={false} showMouse={false} animated={true} />
            </div>
            {/* Devotees Carrying */}
            <div className="flex gap-2 text-sm -mt-1">
              <span>🚶</span><span>🚶</span>
            </div>
          </div>
        </div>

        {/* Arrival Dialog */}
        {reachedGate && (
          <div className="absolute inset-4 bg-amber-950/95 border-2 border-amber-400 rounded-3xl p-5 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-md animate-in zoom-in-90 z-20">
            <div className="text-5xl mb-2 animate-bounce">🙏</div>
            <h4 className="text-amber-300 font-black text-lg">BAPPA ARRIVED SAFELY!</h4>
            <p className="text-xs text-amber-100 font-medium mt-1">
              Devotees shower fragrant petals and sound the dhol drums!
            </p>
            <div className="my-3 p-3 bg-amber-900/60 rounded-2xl border border-amber-500/30 text-xs text-amber-200 italic font-bold">
              "Ganpati Bappa Morya! Mangal Murti Morya!"
            </div>
          </div>
        )}
      </div>

      {/* On-Screen Mobile Controls */}
      <div className="w-full flex items-center justify-between gap-4 mt-2">
        <button
          onClick={() => {
            setPlayerLane(l => Math.max(0, l - 1));
            soundManager.playClick();
          }}
          disabled={playerLane === 0 || reachedGate}
          className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-black rounded-2xl shadow-lg active:scale-95 disabled:opacity-40 transition flex items-center justify-center gap-2"
        >
          <span>⬅️</span>
          <span>STEER LEFT</span>
        </button>

        <button
          onClick={() => {
            setPlayerLane(l => Math.min(2, l + 1));
            soundManager.playClick();
          }}
          disabled={playerLane === 2 || reachedGate}
          className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black rounded-2xl shadow-lg active:scale-95 disabled:opacity-40 transition flex items-center justify-center gap-2"
        >
          <span>STEER RIGHT</span>
          <span>➡️</span>
        </button>
      </div>
    </div>
  );
};
