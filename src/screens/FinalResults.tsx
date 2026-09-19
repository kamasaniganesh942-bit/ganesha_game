import React from 'react';
import { useGame } from '../state/GameContext';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { ConfettiCanvas } from '../components/common/ConfettiCanvas';
import { Trophy, Star, Ticket, Coins, Play, Map, Home, Gamepad2 } from 'lucide-react';
import { ALL_MINI_GAMES } from '../data/miniGamesData';

export const FinalResults: React.FC = () => {
  const { state, navigateScreen, resetGameProgress } = useGame();

  const completedCount = ALL_MINI_GAMES.filter(g => state.completedGames[g.id]?.completed).length;

  const handlePlayAgain = () => {
    resetGameProgress();
    navigateScreen('story_intro');
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-5 sm:p-6 text-white text-center overflow-hidden">
      <ConfettiCanvas trigger={true} intensity="high" />

      {/* Decorative Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="pt-4">
        <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 text-xs font-black tracking-widest text-amber-300 uppercase">
          🏆 UTSAV SAMAPTI
        </span>
      </div>

      {/* Results Content */}
      <div className="my-auto py-4 max-w-sm mx-auto w-full">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-1 shadow-2xl shadow-yellow-500/50 mb-3 animate-bounce">
          <div className="w-full h-full rounded-2xl bg-[#1D0C38] flex items-center justify-center text-4xl sm:text-5xl">
            🏆
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-amber-300 drop-shadow-md">
          FESTIVAL COMPLETE!
        </h2>
        <div className="text-xs font-black tracking-widest text-orange-300 uppercase mb-4">
          FOUR DAYS OF DEVOTION & JOY
        </div>

        {/* Stats Grid */}
        <div className="bg-black/35 border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-left">
              <div className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                <Gamepad2 className="w-3.5 h-3.5" /> MINI-GAMES
              </div>
              <div className="text-xl font-black text-white mt-0.5">
                {completedCount} / 24
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-left">
              <div className="text-[10px] font-bold text-yellow-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" /> TOTAL STARS
              </div>
              <div className="text-xl font-black text-amber-300 mt-0.5">
                {state.stars} ⭐
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-left">
              <div className="text-[10px] font-bold text-orange-400 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" /> TOTAL SCORE
              </div>
              <div className="text-xl font-black text-white mt-0.5">
                {state.score}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-left">
              <div className="text-[10px] font-bold text-pink-400 flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5" /> FESTIVAL TOKENS
              </div>
              <div className="text-xl font-black text-pink-300 mt-0.5">
                {state.tokens} 🎟
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-400" /> TOTAL MONEY COLLECTED:
            </span>
            <span className="text-lg font-black text-emerald-400">₹{state.money}</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
          <p className="font-bold text-amber-200">"GANPATI BAPPA MORYA!"</p>
          <p className="text-slate-300 mt-0.5">Thank you for celebrating together as one big family.</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-xs mx-auto space-y-2.5 pb-4">
        <AnimatedButton
          variant="gold"
          size="lg"
          className="w-full text-base"
          icon={<Play className="w-5 h-5 fill-current" />}
          soundType="dhol"
          onClick={handlePlayAgain}
        >
          PLAY AGAIN
        </AnimatedButton>

        <div className="grid grid-cols-2 gap-2">
          <AnimatedButton
            variant="primary"
            size="md"
            icon={<Map className="w-4 h-4" />}
            onClick={() => navigateScreen('festival_map')}
          >
            FESTIVAL MAP
          </AnimatedButton>

          <AnimatedButton
            variant="glass"
            size="md"
            icon={<Home className="w-4 h-4" />}
            onClick={() => navigateScreen('main_menu')}
          >
            MAIN MENU
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};
