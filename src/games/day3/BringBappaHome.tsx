import React, { useState, useEffect } from 'react';
import { useGame } from '../../state/GameContext';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';
import { GaneshaIdol } from '../../components/common/GaneshaIdol';

interface BringBappaHomeProps {
  onWin: (result: RewardResult) => void;
}

interface Obstacle {
  id: number;
  lane: number; // 0, 1, 2
  y: number; // 0 to 100
  type: 'puddle' | 'pot' | 'petal';
}

export const BringBappaHome: React.FC<BringBappaHomeProps> = ({ onWin }) => {
  const { state } = useGame();
  const [lane, setLane] = useState(1); // 0 = Left, 1 = Center, 2 = Right
  const [items, setItems] = useState<Obstacle[]>([]);
  const [petalsCollected, setPetalsCollected] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [distance, setDistance] = useState(0); // 0 to 100%

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setLane(l => Math.max(0, l - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setLane(l => Math.min(2, l + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Spawner
  useEffect(() => {
    const spawner = setInterval(() => {
      const isPetal = Math.random() > 0.4;
      const newItem: Obstacle = {
        id: Date.now() + Math.random(),
        lane: Math.floor(Math.random() * 3),
        y: 0,
        type: isPetal ? 'petal' : (Math.random() > 0.5 ? 'puddle' : 'pot')
      };
      setItems(prev => [...prev, newItem]);
    }, 700);

    return () => clearInterval(spawner);
  }, []);

  // Game Loop
  useEffect(() => {
    const loop = setInterval(() => {
      setDistance(d => {
        const nextDist = d + 0.8;
        if (nextDist >= 100) {
          // Arrived at temple!
          clearInterval(loop);
          finishGame();
          return 100;
        }
        return nextDist;
      });

      setItems(prevItems => {
        const nextItems: Obstacle[] = [];
        prevItems.forEach(item => {
          const nextY = item.y + 3.5;

          // Check collision with player at y = 78% to 88%
          if (nextY >= 76 && nextY <= 88 && item.lane === lane) {
            if (item.type === 'petal') {
              soundManager.playCoin();
              setCombo(c => c + 1);
              setPetalsCollected(p => p + 1);
              setScore(s => s + 50);
            } else {
              // Hit puddle/pot - soft slowdown
              soundManager.playError();
              setCombo(0);
            }
          } else if (nextY <= 100) {
            nextItems.push({ ...item, y: nextY });
          }
        });
        return nextItems;
      });
    }, 45);

    return () => clearInterval(loop);
  }, [lane, score, petalsCollected]);

  const finishGame = () => {
    soundManager.playFanfare();
    const performance = petalsCollected >= 10 ? 'PERFECT' : petalsCollected >= 5 ? 'GREAT' : 'GOOD';
    const stars = performance === 'PERFECT' ? 3 : performance === 'GREAT' ? 2 : 1;
    onWin({
      performance,
      stars,
      score: score + 250,
      tokens: 20
    });
  };

  const laneX = [20, 50, 80];

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold z-10">
        <div className="text-amber-400">PETALS: {petalsCollected} 🌸</div>
        <div className="text-emerald-400">SCORE: {score}</div>
        <div className="text-pink-300">PROGRESS: {Math.round(distance)}%</div>
      </div>

      {/* Street Playfield */}
      <div className="relative flex-1 w-full my-2 bg-gradient-to-b from-[#180A2E] to-[#261045] rounded-2xl border border-white/5 overflow-hidden">
        {/* Lane dividers */}
        <div className="absolute inset-0 flex justify-around pointer-events-none opacity-20">
          <div className="w-0.5 h-full border-r border-dashed border-amber-300" />
          <div className="w-0.5 h-full border-r border-dashed border-amber-300" />
        </div>

        {/* Falling obstacles and petals */}
        {items.map((item) => (
          <div
            key={item.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl filter drop-shadow"
            style={{ left: `${laneX[item.lane]}%`, top: `${item.y}%` }}
          >
            {item.type === 'petal' ? '🌸' : item.type === 'puddle' ? '💧' : '🪴'}
          </div>
        ))}

        {/* Character carrying Bappa */}
        <div
          className="absolute bottom-6 transform -translate-x-1/2 flex flex-col items-center transition-all duration-150 z-20"
          style={{ left: `${laneX[lane]}%` }}
        >
          <div className="flex items-center gap-1 filter drop-shadow animate-bounceSubtle">
            <span className="text-3xl">🚶‍♂️</span>
            <div className="p-1 bg-amber-500/30 rounded-lg border border-amber-300 shadow">
              <GaneshaIdol
                size={38}
                type={state.selectedIdol || 'festival'}
                showHalo={false}
                showThrone={false}
                showMouse={false}
              />
            </div>
          </div>
          <span className="text-[9px] font-black text-amber-300 bg-black/70 px-2 py-0.5 rounded-full border border-amber-400/40 mt-0.5 whitespace-nowrap">
            WELCOMING BAPPA
          </span>
        </div>
      </div>

      {/* Touch Arrow Controls */}
      <div className="flex items-center justify-between gap-3 z-10">
        <button
          onClick={() => {
            soundManager.playClick();
            setLane(l => Math.max(0, l - 1));
          }}
          className="flex-1 py-3 bg-white/10 active:bg-white/20 rounded-2xl text-white font-bold text-sm border border-white/10"
        >
          ◀ LEFT
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            setLane(l => Math.min(2, l + 1));
          }}
          className="flex-1 py-3 bg-white/10 active:bg-white/20 rounded-2xl text-white font-bold text-sm border border-white/10"
        >
          RIGHT ▶
        </button>
      </div>
    </div>
  );
};
