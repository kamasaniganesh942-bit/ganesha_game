import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { Sparkles, Zap, Lightbulb } from 'lucide-react';

interface ElectricityPuzzleProps {
  onWin: (result: RewardResult) => void;
}

// 3x3 Grid of rotatable circuit tiles
// orientations: 0 (0 deg), 1 (90 deg), 2 (180 deg), 3 (270 deg)
// Tile types:
// 'line': connects Top & Bottom at 0 deg, Left & Right at 90 deg
// 'elbow': connects Top & Right at 0 deg, Right & Bottom at 90 deg, Bottom & Left at 180 deg, Left & Top at 270 deg
// 't-junction': connects Top, Right, Bottom at 0 deg, etc.
interface Tile {
  id: number;
  type: 'line' | 'elbow';
  rotation: number; // 0, 1, 2, 3
  correctRotation: number[];
  bulbIdx?: number;
}

export const ElectricityPuzzle: React.FC<ElectricityPuzzleProps> = ({ onWin }) => {
  // Initial scrambled state
  const [tiles, setTiles] = useState<Tile[]>([
    { id: 0, type: 'elbow', rotation: 1, correctRotation: [1], bulbIdx: 0 },
    { id: 1, type: 'line', rotation: 0, correctRotation: [1, 3] },
    { id: 2, type: 'elbow', rotation: 0, correctRotation: [2], bulbIdx: 1 },
    { id: 3, type: 'line', rotation: 1, correctRotation: [0, 2], bulbIdx: 2 },
    { id: 4, type: 'elbow', rotation: 2, correctRotation: [0, 2] },
    { id: 5, type: 'line', rotation: 1, correctRotation: [0, 2], bulbIdx: 3 },
    { id: 6, type: 'elbow', rotation: 3, correctRotation: [0] }, // Power entry at bottom left
    { id: 7, type: 'line', rotation: 0, correctRotation: [1, 3] },
    { id: 8, type: 'elbow', rotation: 1, correctRotation: [3], bulbIdx: 4 }
  ]);

  const [isAllPowered, setIsAllPowered] = useState(false);

  // Check if tile is in working alignment
  const isTilePowered = (tile: Tile) => {
    return tile.correctRotation.includes(tile.rotation);
  };

  const poweredCount = tiles.filter(isTilePowered).length;
  const litBulbsCount = tiles.filter(t => t.bulbIdx !== undefined && isTilePowered(t)).length;

  const handleTileClick = (tileId: number) => {
    if (isAllPowered) return;
    soundManager.playClick();

    setTiles(prev => {
      const next = prev.map(t => {
        if (t.id === tileId) {
          const nextRot = (t.rotation + 1) % 4;
          return { ...t, rotation: nextRot };
        }
        return t;
      });

      // Check if all 9 tiles are correctly oriented
      const allDone = next.every(isTilePowered);
      if (allDone) {
        setIsAllPowered(true);
        soundManager.playBell();
        soundManager.playFanfare();
        setTimeout(() => {
          onWin({
            performance: 'PERFECT',
            stars: 3,
            score: 230,
            tokens: 20
          });
        }, 1800);
      }

      return next;
    });
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-4 select-none">
      {/* Top Banner */}
      <div className="w-full bg-amber-950/80 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-amber-300 font-black text-xs tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            MANDAP ELECTRICITY PUZZLE
          </h3>
          <p className="text-[11px] text-amber-100/70">Rotate circuit wire segments to light all 5 bulbs</p>
        </div>

        <div className="bg-amber-900/80 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
          <span className="text-[10px] text-amber-300/80 block uppercase font-bold">Lights Lit</span>
          <span className="text-base font-black text-amber-300">{litBulbsCount} / 5</span>
        </div>
      </div>

      {/* Circuit Board Canvas */}
      <div className="relative w-full aspect-square my-auto bg-gradient-to-br from-slate-950 via-indigo-950 to-stone-950 rounded-3xl border-2 border-amber-500/40 p-5 flex flex-col items-center justify-center shadow-2xl overflow-hidden">
        {/* Glowing circuit tracks background */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        {/* 3x3 Tile Grid */}
        <div className="grid grid-cols-3 gap-3 z-10 w-full max-w-[280px]">
          {tiles.map(tile => {
            const powered = isTilePowered(tile);
            const rotDeg = tile.rotation * 90;

            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile.id)}
                disabled={isAllPowered}
                className={`relative aspect-square rounded-2xl border-2 flex items-center justify-center transition-all duration-200 active:scale-90 ${
                  powered
                    ? 'bg-amber-950/60 border-amber-400/80 shadow-glow'
                    : 'bg-stone-900/80 border-stone-700/60 hover:border-amber-500/40'
                }`}
              >
                {/* Wire Graphic Container with Rotation */}
                <div
                  className="w-14 h-14 relative transition-transform duration-200 flex items-center justify-center"
                  style={{ transform: `rotate(${rotDeg}deg)` }}
                >
                  {tile.type === 'line' ? (
                    // Straight Wire (Vertical at 0 deg)
                    <div
                      className={`w-3 h-full rounded-full transition-colors ${
                        powered
                          ? 'bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-300 shadow-[0_0_12px_#fde047]'
                          : 'bg-stone-600'
                      }`}
                    />
                  ) : (
                    // Elbow Wire (Top & Right at 0 deg)
                    <div className="relative w-full h-full">
                      <div
                        className={`absolute top-0 left-1/2 -translate-x-1/2 w-3 h-1/2 rounded-t-full transition-colors ${
                          powered
                            ? 'bg-gradient-to-b from-amber-300 to-yellow-400 shadow-[0_0_12px_#fde047]'
                            : 'bg-stone-600'
                        }`}
                      />
                      <div
                        className={`absolute top-1/2 left-1/2 w-1/2 h-3 -translate-y-1/2 rounded-r-full transition-colors ${
                          powered
                            ? 'bg-gradient-to-r from-yellow-400 to-amber-300 shadow-[0_0_12px_#fde047]'
                            : 'bg-stone-600'
                        }`}
                      />
                      <div
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${
                          powered ? 'bg-yellow-300' : 'bg-stone-600'
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* Light Bulb Attachment */}
                {tile.bulbIdx !== undefined && (
                  <div
                    className={`absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                      powered
                        ? 'bg-yellow-400 text-amber-950 border-white shadow-[0_0_15px_#facc15] scale-110 animate-bounce'
                        : 'bg-stone-800 text-stone-500 border-stone-600'
                    }`}
                  >
                    💡
                  </div>
                )}

                {/* Power Entry Indicator at Tile 6 */}
                {tile.id === 6 && (
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-md">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Victory Celebration Overlay */}
        {isAllPowered && (
          <div className="absolute inset-4 bg-amber-950/95 border-2 border-amber-400 rounded-3xl p-5 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-md animate-in zoom-in-90 z-20">
            <div className="text-5xl mb-2 animate-bounce">💡</div>
            <h4 className="text-amber-300 font-black text-lg">FULL PANDAL ILLUMINATED!</h4>
            <p className="text-xs text-amber-100 font-medium mt-1">
              Every decorative bulb glows with dazzling festive warmth!
            </p>
          </div>
        )}
      </div>

      {/* Bottom Hint / Info Bar */}
      <div className="w-full bg-amber-950/80 rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-amber-300/80 block uppercase font-bold">Circuit Tip</span>
            <span className="text-xs font-semibold text-amber-200">Tap tiles to rotate wires</span>
          </div>
        </div>

        <button
          onClick={() => {
            // Quick solve fallback / scramble helper
            soundManager.playClick();
            setTiles(prev =>
              prev.map(t => ({
                ...t,
                rotation: t.correctRotation[0]
              }))
            );
            setIsAllPowered(true);
            soundManager.playFanfare();
            setTimeout(() => {
              onWin({
                performance: 'GREAT',
                stars: 2,
                score: 180,
                tokens: 15
              });
            }, 1800);
          }}
          disabled={isAllPowered}
          className="px-3 py-1.5 bg-amber-600/60 hover:bg-amber-500/80 text-white rounded-xl text-xs font-bold border border-amber-400/40 active:scale-95 transition"
        >
          AUTO-ALIGN
        </button>
      </div>
    </div>
  );
};
