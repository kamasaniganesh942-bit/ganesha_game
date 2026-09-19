import React from 'react';
import { useGame } from '../state/GameContext';
import { DayNumber } from '../types/game';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { ConfettiCanvas } from '../components/common/ConfettiCanvas';
import { ArrowRight, Star, Ticket, Trophy, Sparkles } from 'lucide-react';

export const DayComplete: React.FC = () => {
  const { state, advanceDay, navigateScreen } = useGame();

  const dayTitles: Record<DayNumber, { title: string; subtitle: string; icon: string; statLabel: string; statVal: string }> = {
    1: {
      title: 'DAY 1 COMPLETE!',
      subtitle: 'Target Reached! You collected enough funds for Bappa!',
      icon: '🎉',
      statLabel: 'FUNDS COLLECTED',
      statVal: `₹${state.money}`
    },
    2: {
      title: 'DAY 2 COMPLETE!',
      subtitle: 'Mandap Built! The neighborhood pandal is beautifully decorated!',
      icon: '🏮',
      statLabel: 'PANDAL STATUS',
      statVal: '100% ILLUMINATED'
    },
    3: {
      title: 'DAY 3 COMPLETE!',
      subtitle: 'Bappa Has Arrived! Puja rituals and modak offering completed with devotion!',
      icon: '🙏',
      statLabel: 'PUJA BLESSINGS',
      statVal: 'SANCTUM BLESSED'
    },
    4: {
      title: 'DAY 4 COMPLETE!',
      subtitle: 'Procession Ready! The Dhol Tasha drums are beating for the final journey.',
      icon: '🥁',
      statLabel: 'PROCESSION',
      statVal: 'READY FOR GHAT'
    }
  };

  const currentInfo = dayTitles[state.currentDay];
  const isFinalDay = state.currentDay === 4;

  const handleContinue = () => {
    if (isFinalDay) {
      navigateScreen('visarjan');
    } else {
      advanceDay((state.currentDay + 1) as DayNumber);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-6 text-white text-center overflow-hidden">
      <ConfettiCanvas trigger={true} intensity="high" />

      {/* Decorative Aura */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/25 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Badge */}
      <div className="pt-4">
        <span className="px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs font-black tracking-widest text-amber-300 uppercase">
          FESTIVAL MILESTONE
        </span>
      </div>

      {/* Main Celebration Content */}
      <div className="my-auto py-4">
        {/* Animated Trophy Icon */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 p-1 shadow-2xl shadow-orange-500/50 mb-5 animate-bounce">
          <div className="w-full h-full rounded-2xl bg-[#1A0C33] flex items-center justify-center text-5xl">
            {currentInfo.icon}
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-amber-300 drop-shadow-md mb-2">
          {currentInfo.title}
        </h2>
        <p className="text-sm sm:text-base text-amber-100/90 font-medium max-w-xs mx-auto mb-6">
          {currentInfo.subtitle}
        </p>

        {/* Milestone Card */}
        <div className="bg-black/35 border border-white/10 rounded-3xl p-5 max-w-xs mx-auto space-y-3.5 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-bold text-slate-400">{currentInfo.statLabel}</span>
            <span className="text-base font-black text-emerald-400">{currentInfo.statVal}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="text-[10px] font-bold text-amber-400">SCORE BONUS</div>
              <div className="text-lg font-black text-amber-300 flex items-center gap-1">
                <Trophy className="w-4 h-4" /> +100
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20">
              <div className="text-[10px] font-bold text-pink-400">TOKENS BONUS</div>
              <div className="text-lg font-black text-pink-300 flex items-center gap-1">
                <Ticket className="w-4 h-4" /> +25
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="w-full max-w-xs mx-auto pb-4">
        <AnimatedButton
          variant="gold"
          size="lg"
          className="w-full text-lg"
          icon={isFinalDay ? <Sparkles className="w-5 h-5 fill-current" /> : <ArrowRight className="w-5 h-5" />}
          soundType="dhol"
          onClick={handleContinue}
        >
          {isFinalDay ? 'BEGIN VISARJAN' : `CONTINUE TO DAY ${state.currentDay + 1}`}
        </AnimatedButton>
      </div>
    </div>
  );
};
