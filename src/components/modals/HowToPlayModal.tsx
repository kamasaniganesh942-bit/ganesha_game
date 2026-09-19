import React from 'react';
import { AnimatedButton } from '../common/AnimatedButton';
import { X, Calendar, Sparkles, Trophy, Flame } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm max-h-[85vh] flex flex-col bg-gradient-to-b from-[#251342] to-[#120724] border border-amber-500/40 rounded-3xl p-5 text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 shrink-0">
          <h3 className="text-xl font-black text-amber-300 flex items-center gap-2">
            <span>📖</span> HOW TO PLAY
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs sm:text-sm">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 font-black text-amber-300 mb-1">
              <Calendar className="w-4 h-4" />
              <span>THE 4 DAYS JOURNEY</span>
            </div>
            <p className="text-slate-200">
              Celebrate the 4 days of Ganesh Utsav! Complete each day's unique mini-games to unlock the next chapter:
            </p>
            <ul className="mt-2 space-y-1 text-slate-300 pl-2 text-xs">
              <li>💰 <b>Day 1:</b> Collect funds for Bappa (₹500 target)</li>
              <li>🏮 <b>Day 2:</b> Build & decorate the festival pandal</li>
              <li>🐘 <b>Day 3:</b> Bring Bappa home & perform puja</li>
              <li>🥁 <b>Day 4:</b> Grand procession & serene Visarjan</li>
            </ul>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 font-black text-pink-300 mb-1">
              <Flame className="w-4 h-4" />
              <span>STARS & COMBOS</span>
            </div>
            <p className="text-slate-200">
              Score consecutive correct moves to build <b>COMBO multipliers</b> (x2, x3, x4!).
              Earn up to <b>3 Stars</b> per mini-game based on your speed, accuracy, and score.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 font-black text-emerald-300 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>CONTROLS & PLAYABILITY</span>
            </div>
            <p className="text-slate-200">
              Designed for mobile touch first! Tap, drag, and swipe easily with large buttons. Also works smoothly with mouse and keyboard arrows on desktop.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 font-black text-yellow-300 mb-1">
              <Trophy className="w-4 h-4" />
              <span>REWARDS & COSMETICS</span>
            </div>
            <p className="text-slate-200">
              Collect 🎟 <b>Festival Tokens</b> to purchase festive pandal decorations in the Shop. No real money required!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 shrink-0">
          <AnimatedButton
            variant="gold"
            size="md"
            className="w-full"
            onClick={onClose}
          >
            UNDERSTOOD! LET'S PLAY
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};
