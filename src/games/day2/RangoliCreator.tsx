import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { Sparkles, RotateCcw, Check, Trash2 } from 'lucide-react';

interface RangoliCreatorProps {
  onWin: (result: RewardResult) => void;
}

const COLORS = [
  { id: 'yellow', hex: '#eab308', name: 'Haldi Yellow' },
  { id: 'red', hex: '#ef4444', name: 'Kumkum Red' },
  { id: 'orange', hex: '#f97316', name: 'Kesari Orange' },
  { id: 'green', hex: '#22c55e', name: 'Parrot Green' },
  { id: 'blue', hex: '#38bdf8', name: 'Peacock Blue' },
  { id: 'white', hex: '#ffffff', name: 'Chuna White' }
];

const GRID_SIZE = 5; // 5x5 dots matrix

export const RangoliCreator: React.FC<RangoliCreatorProps> = ({ onWin }) => {
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0].hex);
  const [gridState, setGridState] = useState<{ [key: string]: string }>({
    '2-2': '#eab308' // center dot pre-filled
  });
  const [mirrorMode, setMirrorMode] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  const filledCount = Object.keys(gridState).length;

  const handleCellClick = (r: number, c: number) => {
    soundManager.playClick();

    setGridState(prev => {
      const next = { ...prev };
      const targets = [[r, c]];

      if (mirrorMode) {
        // 4-way symmetrical rotational rangoli mandala
        targets.push([c, 4 - r]);
        targets.push([4 - r, 4 - c]);
        targets.push([4 - c, r]);
      }

      targets.forEach(([tr, tc]) => {
        const key = `${tr}-${tc}`;
        if (next[key] === selectedColor) {
          delete next[key];
        } else {
          next[key] = selectedColor;
        }
      });

      return next;
    });
  };

  const handleClear = () => {
    soundManager.playClick();
    setGridState({ '2-2': '#eab308' });
  };

  const handleDone = () => {
    if (filledCount < 8) {
      soundManager.playError();
      return;
    }

    setIsFinished(true);
    soundManager.playBell();
    soundManager.playFanfare();

    setTimeout(() => {
      onWin({
        performance: filledCount >= 16 ? 'PERFECT' : 'GREAT',
        stars: filledCount >= 16 ? 3 : 2,
        score: 180 + filledCount * 5,
        tokens: 15
      });
    }, 1800);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-4 select-none">
      {/* Top Banner */}
      <div className="w-full bg-amber-950/80 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-amber-300 font-black text-xs tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            RANGOLI MANDALA CREATOR
          </h3>
          <p className="text-[11px] text-amber-100/70">Connect powder dots for pandal entrance</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMirrorMode(m => !m);
              soundManager.playClick();
            }}
            className={`px-2 py-1 rounded-xl text-[10px] font-bold border transition ${
              mirrorMode
                ? 'bg-amber-500 text-amber-950 border-amber-300'
                : 'bg-amber-900/60 text-amber-200 border-amber-600/40'
            }`}
          >
            {mirrorMode ? '✨ 4X SYMMETRY' : 'FREE DRAW'}
          </button>
        </div>
      </div>

      {/* Rangoli Canvas Surface */}
      <div className="relative w-full aspect-square my-auto bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950 rounded-3xl border-2 border-amber-500/40 p-4 flex flex-col items-center justify-center shadow-2xl overflow-hidden">
        {/* Sacred Floor Lotus Inscription Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-64 h-64 rounded-full border-4 border-dashed border-amber-400 animate-spin-slow" />
          <div className="absolute w-44 h-44 rounded-full border-2 border-amber-300" />
        </div>

        {/* 5x5 Dot Matrix */}
        <div className="grid grid-cols-5 gap-3 sm:gap-4 z-10">
          {Array.from({ length: GRID_SIZE }).map((_, r) =>
            Array.from({ length: GRID_SIZE }).map((_, c) => {
              const key = `${r}-${c}`;
              const cellColor = gridState[key];
              const isCenter = r === 2 && c === 2;

              return (
                <button
                  key={key}
                  onClick={() => handleCellClick(r, c)}
                  disabled={isFinished}
                  style={{
                    backgroundColor: cellColor || 'rgba(255, 255, 255, 0.08)',
                    boxShadow: cellColor ? `0 0 14px ${cellColor}` : 'none'
                  }}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-90 border ${
                    cellColor
                      ? 'border-white/60 scale-100'
                      : isCenter
                      ? 'border-amber-400/60'
                      : 'border-amber-500/20 hover:border-amber-400/60'
                  }`}
                >
                  {cellColor ? (
                    <span className="text-xs">🌸</span>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-amber-400/40" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Success Splash */}
        {isFinished && (
          <div className="absolute inset-4 bg-amber-950/90 border-2 border-amber-400 rounded-3xl flex flex-col items-center justify-center text-center p-4 backdrop-blur-md animate-in zoom-in-90 z-20">
            <span className="text-5xl animate-bounce">🎨</span>
            <h4 className="text-amber-300 font-black text-lg mt-2">AUSPICIOUS RANGOLI COMPLETE!</h4>
            <p className="text-xs text-amber-100 mt-1">The pandal entrance welcomes devotees with divine beauty.</p>
          </div>
        )}
      </div>

      {/* Color Palette & Actions */}
      <div className="w-full bg-amber-950/80 rounded-2xl p-3 border border-amber-500/30 flex flex-col gap-2">
        {/* Colors */}
        <div className="flex items-center justify-around gap-2">
          {COLORS.map(c => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedColor(c.hex);
                soundManager.playClick();
              }}
              style={{ backgroundColor: c.hex }}
              className={`w-9 h-9 rounded-full border-2 transition-all active:scale-95 ${
                selectedColor === c.hex
                  ? 'border-white scale-110 shadow-lg ring-2 ring-amber-400'
                  : 'border-black/40 opacity-80'
              }`}
              title={c.name}
            />
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between gap-3 mt-1">
          <button
            onClick={handleClear}
            disabled={isFinished}
            className="px-3 py-2 bg-amber-900/60 hover:bg-amber-800/70 text-amber-200 text-xs font-bold rounded-xl border border-amber-600/40 flex items-center gap-1 active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            CLEAR
          </button>

          <div className="text-xs text-amber-200 font-bold">
            Petals: <span className="text-amber-400">{filledCount}</span> (Min: 8)
          </div>

          <button
            onClick={handleDone}
            disabled={isFinished || filledCount < 8}
            className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-1 active:scale-95 disabled:opacity-40 transition"
          >
            <Check className="w-4 h-4" />
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
