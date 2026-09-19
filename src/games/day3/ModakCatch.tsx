import React, { useState, useEffect, useRef } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';

interface ModakCatchProps {
  onWin: (result: RewardResult) => void;
}

interface FallingModak {
  id: number;
  x: number; // percentage
  y: number; // percentage
  speed: number;
}

export const ModakCatch: React.FC<ModakCatchProps> = ({ onWin }) => {
  const [plateX, setPlateX] = useState(50);
  const [modaks, setModaks] = useState<FallingModak[]>([]);
  const [caught, setCaught] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setPlateX(prev => Math.max(12, prev - 8));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setPlateX(prev => Math.min(88, prev + 8));
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

  // Spawner
  useEffect(() => {
    const spawner = setInterval(() => {
      const newModak: FallingModak = {
        id: Date.now() + Math.random(),
        x: Math.floor(Math.random() * 80) + 10,
        y: 0,
        speed: Math.random() * 1.5 + 2.5
      };
      setModaks(prev => [...prev, newModak]);
    }, 650);

    return () => clearInterval(spawner);
  }, []);

  // Collision loop
  useEffect(() => {
    const loop = setInterval(() => {
      setModaks(prevModaks => {
        const nextModaks: FallingModak[] = [];
        prevModaks.forEach(m => {
          const nextY = m.y + m.speed;

          // Check collision with plate (y = 82 to 92)
          if (nextY >= 82 && nextY <= 92 && Math.abs(m.x - plateX) < 16) {
            soundManager.playCoin();
            setCombo(c => c + 1);
            setCaught(cnt => {
              const nextCnt = cnt + 1;
              if (nextCnt >= 10) {
                setTimeout(finishGame, 200);
              }
              return nextCnt;
            });
            setScore(s => s + 50);
          } else if (nextY > 100) {
            setCombo(0);
          } else {
            nextModaks.push({ ...m, y: nextY });
          }
        });
        return nextModaks;
      });
    }, 40);

    return () => clearInterval(loop);
  }, [plateX]);

  const finishGame = () => {
    soundManager.playFanfare();
    const performance = caught >= 10 ? 'PERFECT' : caught >= 6 ? 'GREAT' : 'GOOD';
    const stars = performance === 'PERFECT' ? 3 : performance === 'GREAT' ? 2 : 1;
    onWin({
      performance,
      stars,
      score: score + 250,
      tokens: 20
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    setPlateX(Math.max(12, Math.min(88, xPct)));
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
        <div className="text-amber-400">MODAKS: {caught} / 10</div>
        <div className="text-emerald-400">SCORE: {score}</div>
        <div className={`px-2 py-0.5 rounded-lg ${timeLeft <= 5 ? 'bg-red-500 text-white animate-pulse' : 'text-slate-300'}`}>
          ⏳ {timeLeft}s
        </div>
      </div>

      {/* Playfield */}
      <div className="relative flex-1 w-full overflow-hidden my-2">
        {/* Falling Modaks */}
        {modaks.map(m => (
          <div
            key={m.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-3xl filter drop-shadow"
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
          >
            🥟
          </div>
        ))}

        {/* Silver Puja Thali / Plate */}
        <div
          className="absolute bottom-4 transform -translate-x-1/2 flex flex-col items-center pointer-events-none transition-transform duration-75"
          style={{ left: `${plateX}%` }}
        >
          <div className="w-20 h-6 rounded-full bg-gradient-to-r from-slate-200 via-white to-slate-300 border-2 border-slate-400 shadow-xl flex items-center justify-center">
            <span className="text-[10px] font-black text-slate-800 tracking-wider">PUJA THALI</span>
          </div>
        </div>
      </div>

      {/* Arrow Buttons for quick tap */}
      <div className="flex items-center justify-between gap-2 z-10">
        <button
          onClick={() => setPlateX(prev => Math.max(12, prev - 14))}
          className="flex-1 py-3 bg-white/10 active:bg-white/20 rounded-2xl text-white font-bold text-sm border border-white/10"
        >
          ◀ LEFT
        </button>
        <span className="text-[11px] text-amber-200 text-center px-1">
          Catch 10 steaming modaks!
        </span>
        <button
          onClick={() => setPlateX(prev => Math.min(88, prev + 14))}
          className="flex-1 py-3 bg-white/10 active:bg-white/20 rounded-2xl text-white font-bold text-sm border border-white/10"
        >
          RIGHT ▶
        </button>
      </div>
    </div>
  );
};
