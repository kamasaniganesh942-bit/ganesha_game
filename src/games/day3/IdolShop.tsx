import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { useGame } from '../../state/GameContext';
import { soundManager } from '../../audio/SoundManager';
import { AnimatedButton } from '../../components/common/AnimatedButton';
import { Check, Sparkles } from 'lucide-react';

interface IdolShopProps {
  onWin: (result: RewardResult) => void;
}

interface IdolOption {
  id: 'simple' | 'festival' | 'grand';
  name: string;
  price: number;
  icon: string;
  desc: string;
  tag: string;
}

const IDOLS: IdolOption[] = [
  {
    id: 'simple',
    name: 'Eco Clay Idol',
    price: 300,
    icon: '🐘',
    desc: 'Pure earthen clay idol, 100% natural and eco-friendly.',
    tag: 'ECO-FRIENDLY'
  },
  {
    id: 'festival',
    name: 'Festive Altar Bappa',
    price: 400,
    icon: '✨',
    desc: 'Artisan hand-painted idol with golden crown and modak in hand.',
    tag: 'POPULAR'
  },
  {
    id: 'grand',
    name: 'Grand Raja Idol',
    price: 500,
    icon: '👑',
    desc: 'Majestic Lalbaug-style grand throne idol with royal silks.',
    tag: 'MAJESTIC'
  }
];

export const IdolShop: React.FC<IdolShopProps> = ({ onWin }) => {
  const { state, selectIdol } = useGame();
  const [selectedIdolId, setSelectedIdolId] = useState<'simple' | 'festival' | 'grand'>('festival');

  const handleBuy = () => {
    const chosen = IDOLS.find(i => i.id === selectedIdolId);
    if (!chosen) return;

    // Deduct fictional game funds or auto-allow if testing
    const cost = Math.min(state.money, chosen.price);
    selectIdol(chosen.id, cost);

    soundManager.playFanfare();
    setTimeout(() => {
      onWin({
        performance: 'PERFECT',
        stars: 3,
        score: 300,
        tokens: 25
      });
    }, 500);
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-emerald-400">FESTIVAL FUNDS: ₹{state.money}</div>
        <div className="text-amber-400">ARTISAN WORKSHOP</div>
      </div>

      {/* Header */}
      <div className="text-center my-1">
        <h3 className="text-lg font-black text-amber-300">
          WELCOME BAPPA TO YOUR PANDAL
        </h3>
        <p className="text-xs text-slate-300">
          Select an auspicious idol made with love by neighborhood sculptors:
        </p>
      </div>

      {/* 3 Idol Options Cards */}
      <div className="space-y-2.5 my-auto overflow-y-auto max-h-[340px] pr-1">
        {IDOLS.map((idol) => {
          const isSelected = selectedIdolId === idol.id;
          const canAfford = state.money >= idol.price || state.money >= 300;

          return (
            <div
              key={idol.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedIdolId(idol.id);
              }}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.01]'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-orange-500/30 border border-amber-400/40 flex items-center justify-center text-3xl shrink-0">
                  {idol.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white">{idol.name}</h4>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                      {idol.tag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{idol.desc}</p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-400">
                      ₹{idol.price}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-black text-amber-300 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> SELECTED
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      <AnimatedButton
        variant="gold"
        size="lg"
        className="w-full"
        icon={<Sparkles className="w-5 h-5 fill-current" />}
        soundType="dhol"
        onClick={handleBuy}
      >
        WELCOME THIS BAPPA
      </AnimatedButton>
    </div>
  );
};
