import React, { useState, useEffect } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';

interface MemoryCoinsProps {
  onWin: (result: RewardResult) => void;
}

interface CardItem {
  id: number;
  val: number;
  icon: string;
}

const VALUES = [10, 20, 50, 100, 200, 500];

export const MemoryCoins: React.FC<MemoryCoinsProps> = ({ onWin }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [combo, setCombo] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);

  // Initialize deck
  useEffect(() => {
    const rawPairs = [...VALUES, ...VALUES];
    const shuffled = rawPairs
      .sort(() => Math.random() - 0.5)
      .map((val, idx) => ({
        id: idx,
        val,
        icon: '🪙'
      }));
    setCards(shuffled);

    // Initial sneak peek for 1.5 seconds
    setFlipped(shuffled.map(c => c.id));
    const timer = setTimeout(() => {
      setFlipped([]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = (id: number) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) {
      return;
    }

    soundManager.playClick();
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.val === secondCard.val) {
        // Matched!
        setTimeout(() => {
          soundManager.playCoin();
          const nextMatched = [...matched, firstId, secondId];
          setMatched(nextMatched);
          setFlipped([]);
          const nextCombo = combo + 1;
          setCombo(nextCombo);
          setScore(s => s + 100 * nextCombo);

          if (nextMatched.length === cards.length) {
            // Win
            setTimeout(() => {
              const performance = moves <= 9 ? 'PERFECT' : moves <= 13 ? 'GREAT' : 'GOOD';
              const stars = performance === 'PERFECT' ? 3 : performance === 'GREAT' ? 2 : 1;
              onWin({
                performance,
                stars,
                score: score + 300,
                tokens: 20,
                moneyEarned: 70
              });
            }, 500);
          }
        }, 400);
      } else {
        // Miss
        setTimeout(() => {
          soundManager.playError();
          setCombo(0);
          setFlipped([]);
        }, 900);
      }
    }
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">PAIRS: {matched.length / 2} / 6</div>
        <div className="text-pink-300">MOVES: {moves}</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Card Grid (3 rows x 4 columns) */}
      <div className="grid grid-cols-4 gap-2 my-auto p-2">
        {cards.map((card) => {
          const isRevealed = flipped.includes(card.id) || matched.includes(card.id);
          const isMatched = matched.includes(card.id);

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all duration-300 transform ${
                isMatched
                  ? 'bg-emerald-950/60 border-emerald-400/50 scale-95 opacity-85'
                  : isRevealed
                  ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 border-yellow-100 text-slate-900 font-black shadow-lg shadow-amber-500/30 rotate-0'
                  : 'bg-[#22103E] border-white/15 hover:border-amber-400/50 active:scale-95'
              }`}
            >
              {isRevealed ? (
                <div className="text-center font-black">
                  <div className="text-sm sm:text-base">₹{card.val}</div>
                </div>
              ) : (
                <span className="text-lg opacity-40">🪙</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs text-amber-200 font-medium">
        🧠 Find and match all matching currency pairs!
      </div>
    </div>
  );
};
