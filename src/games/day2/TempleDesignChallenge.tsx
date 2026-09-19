import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface TempleDesignChallengeProps {
  onWin: (result: RewardResult) => void;
}

interface DesignItem {
  id: string;
  name: string;
  icon: string;
}

const PALETTE: DesignItem[] = [
  { id: 'diya', name: 'Brass Diya', icon: '🪔' },
  { id: 'flower', name: 'Lotus Bloom', icon: '🌸' },
  { id: 'banner', name: 'Royal Banner', icon: '🚩' },
  { id: 'bell', name: 'Temple Bell', icon: '🔔' },
  { id: 'modak', name: 'Prasad Modak', icon: '🥟' }
];

// Target symmetrical arrangement
const TARGET_LAYOUT: string[] = ['diya', 'flower', 'banner', 'flower', 'diya'];

export const TempleDesignChallenge: React.FC<TempleDesignChallengeProps> = ({ onWin }) => {
  const [userSlots, setUserSlots] = useState<(string | null)[]>([null, null, null, null, null]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSlotClick = (idx: number) => {
    if (isSubmitted) return;

    if (selectedItem) {
      soundManager.playClick();
      const nextSlots = [...userSlots];
      nextSlots[idx] = selectedItem;
      setUserSlots(nextSlots);
      setSelectedItem(null);
    } else if (userSlots[idx]) {
      // Clear slot
      soundManager.playClick();
      const nextSlots = [...userSlots];
      nextSlots[idx] = null;
      setUserSlots(nextSlots);
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setUserSlots([null, null, null, null, null]);
    setSelectedItem(null);
  };

  const handleSubmit = () => {
    if (userSlots.some(s => s === null)) {
      soundManager.playError();
      return;
    }

    const matches = userSlots.filter((s, i) => s === TARGET_LAYOUT[i]).length;

    if (matches === TARGET_LAYOUT.length) {
      setIsSubmitted(true);
      soundManager.playBell();
      soundManager.playFanfare();

      setTimeout(() => {
        onWin({
          performance: 'PERFECT',
          stars: 3,
          score: 250,
          tokens: 25
        });
      }, 1800);
    } else {
      soundManager.playError();
    }
  };

  const filledCount = userSlots.filter(Boolean).length;

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-4 select-none">
      {/* Top Banner */}
      <div className="w-full bg-amber-950/80 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-amber-300 font-black text-xs tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            TEMPLE DESIGN CHALLENGE
          </h3>
          <p className="text-[11px] text-amber-100/70">Recreate the symmetrical mandap layout</p>
        </div>

        <div className="bg-amber-900/80 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
          <span className="text-[10px] text-amber-300/80 block uppercase font-bold">Placed</span>
          <span className="text-base font-black text-amber-300">{filledCount} / 5</span>
        </div>
      </div>

      {/* Target Blueprint Layout Card */}
      <div className="w-full mt-2 bg-amber-950/70 rounded-2xl p-3 border border-amber-600/30 flex flex-col items-center">
        <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider mb-2">
          Target Sacred Arrangement:
        </span>
        <div className="flex items-center justify-center gap-2">
          {TARGET_LAYOUT.map((tId, idx) => {
            const item = PALETTE.find(p => p.id === tId);
            return (
              <div
                key={idx}
                className="w-11 h-11 rounded-xl bg-amber-900/60 border-2 border-amber-400 flex flex-col items-center justify-center shadow-md"
              >
                <span className="text-xl">{item?.icon}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Arrangement Canvas */}
      <div className="relative w-full aspect-[4/5] my-auto bg-gradient-to-b from-amber-950 via-stone-900 to-amber-950 rounded-3xl border-2 border-amber-500/40 p-4 flex flex-col items-center justify-center shadow-2xl overflow-hidden">
        {/* Background Arch */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-72 h-72 border-4 border-dashed border-amber-400 rounded-full" />
        </div>

        <div className="text-xs text-amber-200/80 font-semibold mb-4 text-center">
          Tap an item below, then tap a slot to place it:
        </div>

        {/* 5 User Interactive Slots */}
        <div className="flex items-center justify-center gap-2 z-10">
          {userSlots.map((sId, idx) => {
            const item = PALETTE.find(p => p.id === sId);
            const isMatch = sId === TARGET_LAYOUT[idx];

            return (
              <button
                key={idx}
                onClick={() => handleSlotClick(idx)}
                className={`w-12 h-14 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all active:scale-95 ${
                  item
                    ? isSubmitted && isMatch
                      ? 'bg-emerald-600/40 border-emerald-400 shadow-glow'
                      : 'bg-amber-600/40 border-amber-400 shadow-md'
                    : selectedItem
                    ? 'border-amber-300 bg-amber-400/20 animate-pulse'
                    : 'border-amber-500/30 bg-black/30 hover:border-amber-400/60'
                }`}
              >
                {item ? (
                  <div className="flex flex-col items-center animate-in zoom-in-75">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-[8px] font-bold text-amber-200 mt-0.5">{item.name.split(' ')[0]}</span>
                  </div>
                ) : (
                  <span className="text-xs text-amber-400/50 font-bold">{idx + 1}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Complete Notification */}
        {isSubmitted && (
          <div className="absolute inset-4 bg-amber-950/95 border-2 border-amber-400 rounded-3xl p-5 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-md animate-in zoom-in-90 z-30">
            <span className="text-5xl animate-bounce">🏛️</span>
            <h4 className="text-amber-300 font-black text-lg mt-2">MANDAP COMPLETED!</h4>
            <p className="text-xs text-amber-100 mt-1">
              Day 2 finished! The temple is fully prepared to welcome Lord Ganesha tomorrow!
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-black text-sm mt-3">
              <Sparkles className="w-4 h-4" />
              Day 2 Complete • Bring Bappa Unlocked!
            </div>
          </div>
        )}
      </div>

      {/* Item Palette & Actions */}
      <div className="w-full bg-amber-950/80 rounded-2xl p-3 border border-amber-500/30 flex flex-col gap-2">
        <div className="grid grid-cols-5 gap-1.5">
          {PALETTE.map(item => {
            const isSelected = selectedItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedItem(isSelected ? null : item.id);
                }}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center border transition active:scale-95 ${
                  isSelected
                    ? 'bg-amber-500 text-amber-950 border-amber-200 ring-2 ring-amber-300 scale-105 shadow-md'
                    : 'bg-amber-900/60 hover:bg-amber-800/80 text-amber-100 border-amber-500/30'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[8px] font-bold text-center mt-1 leading-tight line-clamp-1">{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 mt-1">
          <button
            onClick={handleReset}
            disabled={isSubmitted || filledCount === 0}
            className="px-3 py-2 bg-amber-900/60 text-amber-200 text-xs font-bold rounded-xl border border-amber-600/40 flex items-center gap-1 active:scale-95 disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitted || filledCount < 5}
            className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-amber-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1 active:scale-95 disabled:opacity-40 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            CONFIRM TEMPLE DESIGN
          </button>
        </div>
      </div>
    </div>
  );
};
