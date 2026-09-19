import React from 'react';
import { useGame } from '../../state/GameContext';
import { SHOP_ITEMS } from '../../data/miniGamesData';
import { AnimatedButton } from '../common/AnimatedButton';
import { X, Ticket, Check } from 'lucide-react';

interface RewardShopModalProps {
  onClose: () => void;
}

export const RewardShopModal: React.FC<RewardShopModalProps> = ({ onClose }) => {
  const { state, buyShopItem } = useGame();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm max-h-[85vh] flex flex-col bg-gradient-to-b from-[#251342] to-[#120724] border border-amber-500/40 rounded-3xl p-5 text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 shrink-0">
          <div>
            <h3 className="text-xl font-black text-amber-300 flex items-center gap-2">
              <span>🏮</span> FESTIVAL SHOP
            </h3>
            <p className="text-xs text-slate-300">Decorate the pandal with tokens!</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency balance banner */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-pink-950/60 border border-pink-500/40 mb-4 shrink-0">
          <span className="text-xs font-bold text-pink-200">YOUR FESTIVAL TOKENS:</span>
          <span className="text-lg font-black text-pink-300 flex items-center gap-1.5">
            <Ticket className="w-4 h-4 text-pink-400" />
            {state.tokens}
          </span>
        </div>

        {/* Shop Items List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {SHOP_ITEMS.map((item) => {
            const isOwned = state.purchasedDecorations.includes(item.id);
            const canAfford = state.tokens >= item.cost;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all ${
                  isOwned
                    ? 'bg-emerald-950/40 border-emerald-500/40'
                    : 'bg-white/5 border-white/10 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/30 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-sm text-white truncate">{item.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-amber-300">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{item.desc}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="text-xs font-bold text-pink-300 flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>{item.cost} Tokens</span>
                  </div>

                  {isOwned ? (
                    <div className="flex items-center gap-1 text-xs font-black text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <Check className="w-3.5 h-3.5" />
                      <span>UNLOCKED</span>
                    </div>
                  ) : (
                    <AnimatedButton
                      variant={canAfford ? 'gold' : 'glass'}
                      size="sm"
                      disabled={!canAfford}
                      onClick={() => buyShopItem(item.id, item.cost)}
                    >
                      {canAfford ? 'GET ITEM' : 'NEED TOKENS'}
                    </AnimatedButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 shrink-0">
          <AnimatedButton
            variant="glass"
            size="md"
            className="w-full"
            onClick={onClose}
          >
            BACK TO GAME
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};
