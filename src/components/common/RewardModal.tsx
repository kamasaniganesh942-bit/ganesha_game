import React from 'react';
import { RewardResult } from '../../types/game';
import { AnimatedButton } from './AnimatedButton';
import { ConfettiCanvas } from './ConfettiCanvas';
import { ArrowRight, RotateCcw, Map } from 'lucide-react';

interface RewardModalProps {
  result: RewardResult;
  onNext: () => void;
  onReplay: () => void;
  onMap: () => void;
  hasNextGame: boolean;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  result,
  onNext,
  onReplay,
  onMap,
  hasNextGame
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <ConfettiCanvas trigger={true} intensity={result.stars === 3 ? 'high' : 'medium'} />

      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#2E144D] via-[#200D36] to-[#120722] border-2 border-amber-400 rounded-3xl p-6 shadow-2xl text-center text-white">
        {/* Shimmer title badge */}
        <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-black text-sm tracking-widest uppercase mb-2">
          🎉 COMPLETE!
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-amber-300 mb-2 drop-shadow">
          ACTIVITY CLEARED
        </h3>

        {/* Stars */}
        <div className="flex justify-center items-center gap-3 my-3">
          {[1, 2, 3].map((starIdx) => {
            const isEarned = starIdx <= result.stars;
            return (
              <div
                key={starIdx}
                className={`text-4xl sm:text-5xl transform transition-transform duration-300 ${
                  isEarned ? 'scale-110 drop-shadow-[0_0_12px_rgba(255,215,0,0.9)] animate-bounce' : 'opacity-30 grayscale'
                }`}
                style={{ animationDelay: `${starIdx * 150}ms` }}
              >
                ⭐
              </div>
            );
          })}
        </div>

        {/* Rewards Breakdown */}
        <div className="grid grid-cols-2 gap-2.5 my-4 bg-black/35 p-3.5 rounded-2xl border border-white/10 text-sm">
          <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
            <div className="text-xs text-amber-300/80 font-bold">SCORE</div>
            <div className="text-lg font-black text-amber-300">+{result.score}</div>
          </div>

          <div className="bg-pink-500/10 p-2.5 rounded-xl border border-pink-500/20">
            <div className="text-xs text-pink-300/80 font-bold">TOKENS</div>
            <div className="text-lg font-black text-pink-300">+{result.tokens} 🎟</div>
          </div>

          {result.moneyEarned !== undefined && result.moneyEarned > 0 && (
            <div className="col-span-2 bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
              <div className="text-xs text-emerald-300/80 font-bold">FESTIVAL FUNDS COLLECTED</div>
              <div className="text-xl font-black text-emerald-400">+₹{result.moneyEarned} 💰</div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-2.5 mt-5">
          {hasNextGame ? (
            <AnimatedButton
              variant="gold"
              size="lg"
              className="w-full text-lg shadow-orange-500/40"
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={onNext}
            >
              CONTINUE
            </AnimatedButton>
          ) : (
            <AnimatedButton
              variant="gold"
              size="lg"
              className="w-full text-lg"
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={onMap}
            >
              CONTINUE TO MAP
            </AnimatedButton>
          )}

          <div className="grid grid-cols-2 gap-2">
            <AnimatedButton
              variant="secondary"
              size="sm"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={onReplay}
            >
              REPLAY
            </AnimatedButton>

            <AnimatedButton
              variant="glass"
              size="sm"
              icon={<Map className="w-4 h-4" />}
              onClick={onMap}
            >
              MAP
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  );
};
