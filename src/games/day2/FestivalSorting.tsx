import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';

interface FestivalSortingProps {
  onWin: (result: RewardResult) => void;
}

interface SortItem {
  id: string;
  name: string;
  category: 'FLOWERS' | 'DIYAS' | 'LIGHTS' | 'SWEETS';
  icon: string;
}

const ITEMS_TO_SORT: SortItem[] = [
  { id: '1', name: 'Marigold', category: 'FLOWERS', icon: '🌼' },
  { id: '2', name: 'Clay Diya', category: 'DIYAS', icon: '🪔' },
  { id: '3', name: 'Fairy Lights', category: 'LIGHTS', icon: '💡' },
  { id: '4', name: 'Modak', category: 'SWEETS', icon: '🥟' },
  { id: '5', name: 'Red Hibiscus', category: 'FLOWERS', icon: '🌺' },
  { id: '6', name: 'Brass Samai', category: 'DIYAS', icon: '🕯️' },
  { id: '7', name: 'Lantern', category: 'LIGHTS', icon: '🏮' },
  { id: '8', name: 'Laddoo', category: 'SWEETS', icon: '🟡' }
];

export const FestivalSorting: React.FC<FestivalSortingProps> = ({ onWin }) => {
  const [remainingItems, setRemainingItems] = useState<SortItem[]>(ITEMS_TO_SORT);
  const [selectedItem, setSelectedItem] = useState<SortItem | null>(ITEMS_TO_SORT[0]);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [shakingCategory, setShakingCategory] = useState<string | null>(null);

  const categories: Array<{ key: 'FLOWERS' | 'DIYAS' | 'LIGHTS' | 'SWEETS'; name: string; icon: string; color: string }> = [
    { key: 'FLOWERS', name: 'Flowers', icon: '🌸', color: 'from-pink-600 to-rose-700' },
    { key: 'DIYAS', name: 'Diyas', icon: '🪔', color: 'from-amber-600 to-orange-700' },
    { key: 'LIGHTS', name: 'Lights', icon: '💡', color: 'from-yellow-500 to-amber-600' },
    { key: 'SWEETS', name: 'Sweets', icon: '🥟', color: 'from-teal-600 to-emerald-700' }
  ];

  const handleSelectCategory = (catKey: 'FLOWERS' | 'DIYAS' | 'LIGHTS' | 'SWEETS') => {
    if (!selectedItem) return;

    if (selectedItem.category === catKey) {
      // Correct sort!
      soundManager.playCoin();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 80 * nextCombo);

      const nextRemaining = remainingItems.filter(i => i.id !== selectedItem.id);
      setRemainingItems(nextRemaining);
      setSelectedItem(nextRemaining.length > 0 ? nextRemaining[0] : null);

      if (nextRemaining.length === 0) {
        soundManager.playFanfare();
        setTimeout(() => {
          onWin({
            performance: 'PERFECT',
            stars: 3,
            score: score + 300,
            tokens: 25
          });
        }, 500);
      }
    } else {
      // Wrong category!
      soundManager.playError();
      setCombo(0);
      setShakingCategory(catKey);
      setTimeout(() => setShakingCategory(null), 400);
    }
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">
          SORTED: {ITEMS_TO_SORT.length - remainingItems.length} / {ITEMS_TO_SORT.length}
        </div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Current Active Item to Sort */}
      <div className="my-auto text-center py-2">
        {selectedItem ? (
          <div className="inline-block p-4 rounded-3xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border-2 border-amber-400 shadow-2xl animate-float-slow">
            <span className="text-5xl block mb-2">{selectedItem.icon}</span>
            <div className="text-sm font-black text-white">{selectedItem.name}</div>
            <div className="text-[10px] text-amber-200 mt-1">Tap matching category basket below!</div>
          </div>
        ) : (
          <div className="text-emerald-300 font-bold text-lg">
            🎉 All Items Sorted!
          </div>
        )}
      </div>

      {/* 4 Category Baskets */}
      <div className="grid grid-cols-2 gap-2.5">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleSelectCategory(cat.key)}
            className={`p-3 rounded-2xl border flex items-center gap-3 transition-all active:scale-95 shadow-lg ${
              shakingCategory === cat.key
                ? 'bg-red-950/80 border-red-500 animate-bounce'
                : `bg-gradient-to-r ${cat.color} border-white/20 hover:border-white`
            }`}
          >
            <span className="text-3xl">{cat.icon}</span>
            <div className="text-left">
              <div className="text-xs font-black text-white">{cat.name}</div>
              <div className="text-[10px] text-white/80">Sort Box</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
