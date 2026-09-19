import React from 'react';
import { MiniGameMeta } from '../../types/game';
import { AnimatedButton } from './AnimatedButton';
import { Play, Target } from 'lucide-react';

interface TutorialModalProps {
  game: MiniGameMeta;
  onStart: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ game, onStart }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#281447] via-[#1D0C38] to-[#120724] border-2 border-amber-500/60 rounded-3xl p-6 shadow-2xl text-center text-white overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-500/25 rounded-full blur-2xl pointer-events-none" />

        {/* Game Icon */}
        <div className="mx-auto w-18 h-18 rounded-3xl bg-gradient-to-br from-amber-400 via-yellow-300 to-orange-500 flex items-center justify-center text-4xl shadow-xl border border-yellow-200 mb-3">
          {game.icon}
        </div>

        <div className="text-amber-400 text-xs font-black tracking-widest uppercase mb-1">
          DAY {game.day} • ACTIVITY {game.gameNumber} OF 24
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
          {game.title}
        </h3>

        {/* Short One-Sentence Instruction */}
        <p className="text-amber-100 font-medium text-sm sm:text-base my-3 italic px-2">
          "{game.shortDesc}"
        </p>

        {/* Goal Card */}
        <div className="bg-black/35 p-3.5 rounded-2xl border border-white/10 text-xs sm:text-sm my-4 text-left flex items-start gap-2.5">
          <Target className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-300">GOAL: </span>
            <span className="text-slate-200 font-medium">{game.instructions.goal}</span>
          </div>
        </div>

        {/* Ready Button */}
        <AnimatedButton
          variant="gold"
          size="lg"
          className="w-full text-base sm:text-lg shadow-orange-500/40 tracking-wider font-black"
          icon={<Play className="w-5 h-5 fill-current" />}
          soundType="dhol"
          onClick={onStart}
        >
          PLAY
        </AnimatedButton>
      </div>
    </div>
  );
};
