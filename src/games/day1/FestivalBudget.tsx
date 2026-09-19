import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { AnimatedButton } from '../../components/common/AnimatedButton';
import { Check, ShoppingBag, AlertCircle } from 'lucide-react';

interface FestivalBudgetProps {
  onWin: (result: RewardResult) => void;
}

interface BudgetItem {
  id: string;
  name: string;
  cost: number;
  icon: string;
}

const ITEMS: BudgetItem[] = [
  { id: 'flowers', name: 'Fresh Marigolds', cost: 25, icon: '🌸' },
  { id: 'diyas', name: 'Clay Diyas (Pack)', cost: 20, icon: '🪔' },
  { id: 'decor', name: 'Festive Streamers', cost: 30, icon: '🏮' },
  { id: 'modaks', name: 'Sweet Modaks (Box)', cost: 25, icon: '🥟' },
  { id: 'agarbatti', name: 'Sandal Agarbatti', cost: 15, icon: '🪵' },
  { id: 'camphor', name: 'Aarti Camphor', cost: 20, icon: '✨' }
];

const MAX_BUDGET = 100;

export const FestivalBudget: React.FC<FestivalBudgetProps> = ({ onWin }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalSpent = selectedIds.reduce((sum, id) => {
    const item = ITEMS.find(i => i.id === id);
    return sum + (item ? item.cost : 0);
  }, 0);

  const toggleItem = (id: string) => {
    setErrorMsg(null);
    if (selectedIds.includes(id)) {
      soundManager.playClick();
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else {
      const item = ITEMS.find(i => i.id === id);
      if (item && totalSpent + item.cost > MAX_BUDGET) {
        soundManager.playError();
        setErrorMsg('Exceeds ₹100 budget! Unselect an item first.');
        return;
      }
      soundManager.playCoin();
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleConfirm = () => {
    if (selectedIds.length < 3) {
      soundManager.playError();
      setErrorMsg('Please select at least 3 festival items!');
      return;
    }

    if (totalSpent > MAX_BUDGET) {
      soundManager.playError();
      setErrorMsg('Total spent cannot exceed ₹100!');
      return;
    }

    // Success
    soundManager.playFanfare();
    const efficiencyBonus = totalSpent >= 80 ? 50 : 20;
    onWin({
      performance: totalSpent >= 85 ? 'PERFECT' : 'GREAT',
      stars: totalSpent >= 85 ? 3 : 2,
      score: 300 + efficiencyBonus,
      tokens: 20,
      moneyEarned: 60
    });
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">BUDGET: ₹{MAX_BUDGET}</div>
        <div className={`font-black ${totalSpent > MAX_BUDGET ? 'text-red-400' : 'text-emerald-400'}`}>
          SPENT: ₹{totalSpent}
        </div>
        <div className="text-pink-300">ITEMS: {selectedIds.length} / 3+</div>
      </div>

      {/* Progress meter */}
      <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden border border-white/10 my-1">
        <div
          className={`h-full transition-all duration-300 ${totalSpent > MAX_BUDGET ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 to-emerald-400'}`}
          style={{ width: `${Math.min(100, (totalSpent / MAX_BUDGET) * 100)}%` }}
        />
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 gap-2 my-1 overflow-y-auto max-h-[320px] pr-1">
        {ITEMS.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-black text-amber-300 bg-black/40 px-2 py-0.5 rounded-full">
                  ₹{item.cost}
                </span>
              </div>
              <div className="mt-2 text-xs font-bold text-white leading-tight">
                {item.name}
              </div>
              <div className="mt-1 flex justify-end">
                {isSelected ? (
                  <span className="text-[10px] font-bold text-amber-300 flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> ADDED
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">+ TAP TO ADD</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-red-300 font-bold bg-red-950/70 p-2 rounded-xl border border-red-500/30">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Action Button */}
      <AnimatedButton
        variant="gold"
        size="md"
        className="w-full"
        icon={<ShoppingBag className="w-4 h-4" />}
        onClick={handleConfirm}
      >
        PACK FESTIVAL SUPPLIES (₹{totalSpent}/₹{MAX_BUDGET})
      </AnimatedButton>
    </div>
  );
};
