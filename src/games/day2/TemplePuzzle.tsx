import React, { useState, useEffect } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';

interface TemplePuzzleProps {
  onWin: (result: RewardResult) => void;
}

// 3x3 temple graphic tiles
const ICONS = ['🎪', '🏮', '🌸', '🪔', '🐘', '🪔', '🌸', '🏮', '🎪'];

export const TemplePuzzle: React.FC<TemplePuzzleProps> = ({ onWin }) => {
  // Tiles array stores the current order of tile indices [0..8]
  const [tiles, setTiles] = useState<number[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);

  // Initialize with a solvable slight shuffle
  useEffect(() => {
    // Simple shuffle: swap 3 pairs so it is fun and quickly solvable in 20-30s
    const initial = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    // Swap (1, 3), (2, 6), (5, 7)
    const temp1 = initial[1]; initial[1] = initial[3]; initial[3] = temp1;
    const temp2 = initial[2]; initial[2] = initial[6]; initial[6] = temp2;
    const temp3 = initial[5]; initial[5] = initial[7]; initial[7] = temp3;
    setTiles(initial);
  }, []);

  const handleTileClick = (index: number) => {
    soundManager.playClick();

    if (selectedIdx === null) {
      setSelectedIdx(index);
    } else {
      // Swap tiles at selectedIdx and index
      const newTiles = [...tiles];
      const temp = newTiles[selectedIdx];
      newTiles[selectedIdx] = newTiles[index];
      newTiles[index] = temp;

      setTiles(newTiles);
      setSelectedIdx(null);
      setMoves(m => m + 1);

      // Check if solved
      const isSolved = newTiles.every((val, idx) => val === idx);
      if (isSolved) {
        soundManager.playFanfare();
        setCombo(c => c + 1);
        setTimeout(() => {
          onWin({
            performance: moves <= 6 ? 'PERFECT' : 'GREAT',
            stars: moves <= 6 ? 3 : 2,
            score: 350 + Math.max(0, 100 - moves * 10),
            tokens: 20
          });
        }, 500);
      }
    }
  };

  const solvedCount = tiles.filter((val, idx) => val === idx).length;

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">MATCHED: {solvedCount} / 9</div>
        <div className="text-pink-300">MOVES: {moves}</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* 3x3 Puzzle Grid */}
      <div className="my-auto p-4 rounded-3xl bg-gradient-to-b from-[#281347] to-[#120722] border-2 border-amber-500/40 shadow-2xl max-w-[280px] mx-auto w-full">
        <div className="grid grid-cols-3 gap-2.5">
          {tiles.map((tileTargetId, currentPosIdx) => {
            const isCorrect = tileTargetId === currentPosIdx;
            const isSelected = selectedIdx === currentPosIdx;

            return (
              <button
                key={currentPosIdx}
                onClick={() => handleTileClick(currentPosIdx)}
                className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all active:scale-95 shadow-md ${
                  isCorrect
                    ? 'bg-emerald-950/40 border-emerald-400/60'
                    : isSelected
                    ? 'bg-amber-500/30 border-amber-300 scale-105 shadow-amber-500/40 animate-pulse'
                    : 'bg-[#1C0D30] border-white/15 hover:border-amber-400/40'
                }`}
              >
                <span className="text-2xl sm:text-3xl">{ICONS[tileTargetId]}</span>
                <span className="text-[10px] font-bold text-slate-400 mt-1">
                  #{tileTargetId + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-center text-xs text-amber-200 font-medium">
        🧩 Tap two tiles to swap them until all 9 are in correct numeric order!
      </div>
    </div>
  );
};
