import React, { useState, useEffect } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';
import { Check } from 'lucide-react';

interface RememberPujaItemsProps {
  onWin: (result: RewardResult) => void;
}

interface Item {
  id: string;
  name: string;
  icon: string;
}

const REQUIRED_ITEMS: Item[] = [
  { id: 'diya', name: 'Brass Diya', icon: '🪔' },
  { id: 'flower', name: 'Hibiscus', icon: '🌺' },
  { id: 'bell', name: 'Puja Bell', icon: '🔔' },
  { id: 'modak', name: 'Sweet Modak', icon: '🥟' }
];

const DECOY_ITEMS: Item[] = [
  { id: 'leaf', name: 'Banana Leaf', icon: '🍃' },
  { id: 'water', name: 'Kalash Water', icon: '🏺' },
  { id: 'fruit', name: 'Banana', icon: '🍌' },
  { id: 'coconut', name: 'Coconut', icon: '🥥' }
];

export const RememberPujaItems: React.FC<RememberPujaItemsProps> = ({ onWin }) => {
  const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(3);
  const [allTrayItems, setAllTrayItems] = useState<Item[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  useEffect(() => {
    // Shuffle all items for the recall tray
    const combined = [...REQUIRED_ITEMS, ...DECOY_ITEMS].sort(() => Math.random() - 0.5);
    setAllTrayItems(combined);

    // 3 second memorize countdown
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer);
          setPhase('recall');
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePickItem = (item: Item) => {
    if (phase !== 'recall' || selectedIds.includes(item.id)) return;

    const isRequired = REQUIRED_ITEMS.some(r => r.id === item.id);
    if (isRequired) {
      soundManager.playCoin();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 75 * nextCombo);

      const nextSelected = [...selectedIds, item.id];
      setSelectedIds(nextSelected);

      if (nextSelected.length === REQUIRED_ITEMS.length) {
        soundManager.playFanfare();
        setTimeout(() => {
          onWin({
            performance: 'PERFECT',
            stars: 3,
            score: score + 250,
            tokens: 20
          });
        }, 500);
      }
    } else {
      soundManager.playError();
      setCombo(0);
    }
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">FOUND: {selectedIds.length} / 4</div>
        <div className="text-emerald-400">SCORE: {score}</div>
        {phase === 'memorize' && (
          <div className="text-pink-300 font-black animate-pulse">
            ⏳ MEMORIZE: {countdown}s
          </div>
        )}
      </div>

      {phase === 'memorize' ? (
        /* Memorize Showcase Card */
        <div className="my-auto p-6 rounded-3xl bg-gradient-to-b from-[#281347] to-[#120722] border-2 border-amber-400 text-center shadow-2xl animate-fadeIn">
          <div className="text-xs font-black text-amber-300 uppercase tracking-wider mb-2">
            MEMORIZE THESE 4 PUJA ITEMS:
          </div>
          <div className="grid grid-cols-2 gap-3 my-4">
            {REQUIRED_ITEMS.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-2.5"
              >
                <span className="text-3xl">{item.icon}</span>
                <span className="text-xs font-bold text-white">{item.name}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-200">
            Hiding in {countdown}s... Remember them carefully!
          </p>
        </div>
      ) : (
        /* Recall Grid Tray */
        <div className="my-auto">
          <div className="text-center text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
            SELECT THE 4 REMEMBERED PUJA ITEMS:
          </div>
          <div className="grid grid-cols-2 gap-2.5 max-w-[320px] mx-auto">
            {allTrayItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  disabled={isSelected}
                  onClick={() => handlePickItem(item)}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between gap-2 transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 shadow-md'
                      : 'bg-white/10 border-white/15 hover:border-amber-400 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-xs font-bold">{item.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="text-center text-xs text-amber-200 font-medium">
        🕯️ Recall and pick only the items that were shown on the puja thali!
      </div>
    </div>
  );
};
