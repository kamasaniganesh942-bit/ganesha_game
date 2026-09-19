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
    <header className="sticky top-0 z-40 w-full px-2 sm:px-4 py-1.5 sm:py-2 bg-[#120824]/90 backdrop-blur-md border-b border-amber-500/25 shadow-lg">
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 max-w-lg mx-auto h-[50px] sm:h-[54px]">
        {/* Left: Back Button & Day Pill */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleBack}
            aria-label="Go Back"
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-amber-300 border border-white/10 transition-all shadow"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {showDay && (
            <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-amber-500/25 border border-amber-400/40 text-[11px] sm:text-xs font-black text-amber-300 tracking-wider shadow-inner whitespace-nowrap">
              DAY {state.currentDay}
            </div>
          )}
        </div>

        {/* Right: Stats & Quick Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Money (Day 1 or when > 0) - Turquoise Accent */}
          {(state.currentDay === 1 || state.money > 0) && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-teal-950/70 border border-teal-400/35 text-teal-300 font-black text-[11px] sm:text-xs shadow-sm whitespace-nowrap shrink-0">
              <Coins className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>₹{state.money}</span>
            </div>
          )}

          {/* Score - Warm Gold Accent */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-950/70 border border-amber-400/35 text-amber-300 font-black text-[11px] sm:text-xs shadow-sm whitespace-nowrap shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
            <span>{state.score}</span>
          </div>

          {/* Tokens - Festival Pink Accent */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-pink-950/70 border border-pink-400/35 text-pink-300 font-black text-[11px] sm:text-xs shadow-sm whitespace-nowrap shrink-0">
            <Ticket className="w-3.5 h-3.5 text-pink-400 shrink-0" />
            <span>{state.tokens}</span>
          </div>

          {/* Instant Replay Button */}
          {onReplay && (
            <button
              onClick={onReplay}
              aria-label="Replay / Restart Game"
              title="Replay this activity"
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 active:scale-95 text-amber-300 border border-amber-400/30 transition-all shrink-0 group shadow"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-rotate-90 transition-transform duration-200" />
            </button>
          )}

          {/* Pause Button */}
          {onPause && (
            <button
              onClick={onPause}
              aria-label="Pause Game"
              title="Pause"
              className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 border border-white/10 transition-all shrink-0 shadow"
            >
              <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
