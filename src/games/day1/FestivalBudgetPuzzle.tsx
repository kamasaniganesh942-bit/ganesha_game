import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { AnimatedButton } from '../../components/common/AnimatedButton';
import { Check, ShoppingBag, AlertCircle } from 'lucide-react';

interface FestivalBudgetPuzzleProps {
  onWin: (result: RewardResult) => void;
}

interface BudgetItem {
  id: string;
  name: string;
  cost: number;
  icon: string;
  category: string;
}

const ITEMS: BudgetItem[] = [
  { id: 'flowers', name: 'Marigold Garlands', cost: 25, icon: '🌸', category: 'Flowers' },
  { id: 'diyas', name: 'Clay Diyas Pack', cost: 20, icon: '🪔', category: 'Diyas' },
  { id: 'lights', name: 'Fairy Light Strings', cost: 30, icon: '💡', category: 'Lights' },
  { id: 'decor', name: 'Entrance Toran', cost: 25, icon: '🏮', category: 'Decor' },
  { id: 'modaks', name: 'Sweet Modak Box', cost: 25, icon: '🥟', category: 'Prasad' },
  { id: 'incense', name: 'Sandal Agarbatti', cost: 15, icon: '🪵', category: 'Aroma' }
];

const TOTAL_BUDGET = 100;

export const FestivalBudgetPuzzle: React.FC<FestivalBudgetPuzzleProps> = ({ onWin }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalSpent = selectedIds.reduce((sum, id) => {
    const itm = ITEMS.find(i => i.id === id);
    return sum + (itm ? itm.cost : 0);
  }, 0);

  const remaining = TOTAL_BUDGET - totalSpent;

  const toggleItem = (id: string) => {
    setErrorMsg(null);
    if (selectedIds.includes(id)) {
      soundManager.playClick();
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else {
      const itm = ITEMS.find(i => i.id === id);
      if (itm && totalSpent + itm.cost > TOTAL_BUDGET) {
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
      setErrorMsg('Please select at least 3 essential festival items!');
      return;
    }

    if (totalSpent > TOTAL_BUDGET) {
      soundManager.playError();
      setErrorMsg('Total spent cannot exceed the ₹100 budget!');
      return;
    }

    soundManager.playFanfare();
    const efficiency = totalSpent >= 85 ? 'PERFECT' : 'GREAT';
    onWin({
      performance: efficiency,
      stars: efficiency === 'PERFECT' ? 3 : 2,
      score: 300 + (totalSpent >= 85 ? 50 : 20),
      tokens: 20,
      moneyEarned: 60
    });
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      {/* Mini-HUD showing Budget, Spent, Remaining */}
      <div className="grid grid-cols-3 gap-1.5 bg-black/40 px-3 py-2 rounded-2xl border border-white/10 text-center text-xs font-bold z-10">
        <div>
          <div className="text-[10px] text-slate-400">BUDGET</div>
          <div className="text-amber-300 font-black">₹{TOTAL_BUDGET}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">SPENT</div>
          <div className="text-orange-400 font-black">₹{totalSpent}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">REMAINING</div>
          <div className={`font-black ${remaining < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            ₹{remaining}
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 gap-2 my-auto overflow-y-auto max-h-[340px] pr-1">
        {ITEMS.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/25 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-black text-amber-300 bg-black/45 px-2 py-0.5 rounded-full">
                  ₹{item.cost}
                </span>
              </div>
              <div className="mt-2 text-xs font-bold text-white leading-tight">
                {item.name}
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[9px] text-slate-400">{item.category}</span>
                {isSelected ? (
                  <span className="text-[10px] font-black text-amber-300 flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> ADDED
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400">+ ADD</span>
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
        PACK SUPPLIES (₹{totalSpent}/₹{TOTAL_BUDGET})
      </AnimatedButton>
    </div>
  );
};
