import React from 'react';
import { useGame } from '../../state/GameContext';
import { AnimatedButton } from '../common/AnimatedButton';
import { X, CheckCircle, Gift } from 'lucide-react';

interface OffersModalProps {
  onClose: () => void;
}

export const OffersModal: React.FC<OffersModalProps> = ({ onClose }) => {
  const { state, claimOffer } = useGame();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm max-h-[85vh] flex flex-col bg-gradient-to-b from-[#251342] to-[#120724] border border-amber-500/40 rounded-3xl p-5 text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 shrink-0">
          <div>
            <h3 className="text-xl font-black text-amber-300 flex items-center gap-2">
              <span>🎁</span> FESTIVAL OFFERS
            </h3>
            <p className="text-xs text-slate-300">Complete challenges to earn bonus rewards!</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offers List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {state.activeOffers.map((offer) => {
            const isCompleted = offer.progress >= offer.target;
            const progressPct = Math.min(100, Math.round((offer.progress / offer.target) * 100));

            return (
              <div
                key={offer.id}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-amber-200">{offer.title}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{offer.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-amber-400">+{offer.rewardScore} pts</span>
                    <div className="text-[11px] font-bold text-pink-400">+{offer.rewardTokens} 🎟</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                    <span>PROGRESS</span>
                    <span>{offer.progress} / {offer.target}</span>
                  </div>
                  <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-1 flex justify-end">
                  {offer.claimed ? (
                    <div className="flex items-center gap-1 text-xs font-black text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-500/10">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>CLAIMED</span>
                    </div>
                  ) : isCompleted ? (
                    <AnimatedButton
                      variant="gold"
                      size="sm"
                      icon={<Gift className="w-3.5 h-3.5" />}
                      onClick={() => claimOffer(offer.id)}
                    >
                      CLAIM BONUS
                    </AnimatedButton>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">In progress...</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <div className="mt-4 pt-3 border-t border-white/10 shrink-0">
          <AnimatedButton
            variant="glass"
            size="md"
            className="w-full"
            onClick={onClose}
          >
            CLOSE
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};
