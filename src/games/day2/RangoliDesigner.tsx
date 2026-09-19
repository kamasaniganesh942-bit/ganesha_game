import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { AnimatedButton } from '../../components/common/AnimatedButton';
import { RotateCcw, Trash2, Check } from 'lucide-react';

interface RangoliDesignerProps {
  onWin: (result: RewardResult) => void;
}

const COLORS = ['#FF6F00', '#FFD700', '#D81B60', '#00897B', '#FFFFFF'];

export const RangoliDesigner: React.FC<RangoliDesignerProps> = ({ onWin }) => {
  // 4x4 grid of dots
  const [activeDots, setActiveDots] = useState<Record<number, string>>({});
  const [history, setHistory] = useState<number[]>([]);
  const [selectedColor, setSelectedColor] = useState('#FFD700');

  const handleDotClick = (idx: number) => {
    soundManager.playCoin();
    setActiveDots(prev => ({
      ...prev,
      [idx]: selectedColor
    }));
    setHistory(prev => [...prev, idx]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    soundManager.playClick();
    const lastIdx = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setActiveDots(prev => {
      const copy = { ...prev };
      delete copy[lastIdx];
      return copy;
    });
  };

  const handleClear = () => {
    soundManager.playClick();
    setActiveDots({});
    setHistory([]);
  };

  const handleDone = () => {
    const filledCount = Object.keys(activeDots).length;
    if (filledCount < 4) {
      soundManager.playError();
      return;
    }

    soundManager.playFanfare();
    const performance = filledCount >= 8 ? 'PERFECT' : filledCount >= 5 ? 'GREAT' : 'GOOD';
    const stars = performance === 'PERFECT' ? 3 : performance === 'GREAT' ? 2 : 1;
    onWin({
      performance,
      stars,
      score: 300 + filledCount * 25,
      tokens: 25
    });
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">PETALS FILLED: {Object.keys(activeDots).length} / 4+</div>
        <div className="text-pink-300 flex items-center gap-1.5">
          <span>COLOR:</span>
          <span className="w-4 h-4 rounded-full border border-white" style={{ backgroundColor: selectedColor }} />
        </div>
      </div>

      {/* Color Palette Selector */}
      <div className="flex items-center justify-center gap-3 my-1">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => {
              soundManager.playClick();
              setSelectedColor(c);
            }}
            className={`w-9 h-9 rounded-full border-2 transition-transform ${
              selectedColor === c ? 'scale-125 border-white shadow-lg' : 'border-transparent opacity-70'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* 4x4 Dot Kolam Canvas */}
      <div className="my-auto p-4 rounded-3xl bg-gradient-to-b from-[#251242] to-[#120722] border-2 border-amber-500/40 shadow-2xl max-w-[280px] mx-auto w-full">
        <div className="grid grid-cols-4 gap-3 place-items-center">
          {Array.from({ length: 16 }).map((_, idx) => {
            const isFilled = activeDots[idx] !== undefined;
            const dotColor = activeDots[idx];

            return (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 active:scale-90 ${
                  isFilled
                    ? 'scale-105 border-white shadow-lg'
                    : 'bg-white/5 border-amber-400/20 hover:border-amber-400'
                }`}
                style={{ backgroundColor: isFilled ? dotColor : undefined }}
              >
                {isFilled ? (
                  <span className="text-slate-900 font-bold text-xs">🌸</span>
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <AnimatedButton
            variant="glass"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={handleUndo}
          >
            UNDO
          </AnimatedButton>
          <AnimatedButton
            variant="glass"
            size="sm"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={handleClear}
          >
            CLEAR
          </AnimatedButton>
        </div>

        <AnimatedButton
          variant="gold"
          size="md"
          className="w-full"
          icon={<Check className="w-4 h-4" />}
          onClick={handleDone}
        >
          COMPLETE RANGOLI
        </AnimatedButton>
      </div>
    </div>
  );
};
