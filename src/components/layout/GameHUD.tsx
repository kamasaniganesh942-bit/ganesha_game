import React from 'react';
import { useGame } from '../../state/GameContext';
import { ArrowLeft, Pause, RotateCcw, Star, Coins, Ticket } from 'lucide-react';

interface GameHUDProps {
  onPause?: () => void;
  onReplay?: () => void;
  onBack?: () => void;
  showDay?: boolean;
}

export const GameHUD: React.FC<GameHUDProps> = ({ onPause, onReplay, onBack, showDay = true }) => {
  const { state, navigateScreen } = useGame();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigateScreen('festival_map');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full px-3 py-2 bg-[#140A26]/85 backdrop-blur-md border-b border-amber-500/20 shadow-md">
      <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
        {/* Left: Back Button */}
        <button
          onClick={handleBack}
          aria-label="Go Back"
          className="flex items-center justify-center min-w-[42px] min-h-[42px] rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-amber-300 border border-white/10 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Center: Day Badge */}
        {showDay && (
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 text-xs sm:text-sm font-black text-amber-300 tracking-wider shadow-inner">
            DAY {state.currentDay}
          </div>
        )}

        {/* Right Stats & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Money (Always on Day 1, or when > 0) */}
          {(state.currentDay === 1 || state.money > 0) && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>₹{state.money}</span>
            </div>
          )}

          {/* Score */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-300 font-bold text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{state.score}</span>
          </div>

          {/* Tokens */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-pink-950/60 border border-pink-500/30 text-pink-300 font-bold text-xs">
            <Ticket className="w-3.5 h-3.5 text-pink-400" />
            <span>{state.tokens}</span>
          </div>

          {/* Instant Replay Button */}
          {onReplay && (
            <button
              onClick={onReplay}
              aria-label="Replay / Restart Game"
              title="Replay this activity"
              className="flex items-center justify-center min-w-[42px] min-h-[42px] rounded-xl bg-amber-500/20 hover:bg-amber-500/30 active:scale-95 text-amber-300 border border-amber-400/30 transition-all ml-0.5 group"
            >
              <RotateCcw className="w-4 h-4 group-hover:-rotate-90 transition-transform duration-200" />
            </button>
          )}

          {/* Pause Button */}
          {onPause && (
            <button
              onClick={onPause}
              aria-label="Pause Game"
              title="Pause"
              className="flex items-center justify-center min-w-[42px] min-h-[42px] rounded-xl bg-amber-500/20 hover:bg-amber-500/30 active:scale-95 text-amber-300 border border-amber-400/30 transition-all"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
