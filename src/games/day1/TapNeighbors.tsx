import React, { useState, useEffect } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';

interface TapNeighborsProps {
  onWin: (result: RewardResult) => void;
}

interface NeighborSpot {
  id: number;
  name: string;
  avatar: string;
  value: number;
  active: boolean;
  x: string;
  y: string;
}

const NEIGHBORS = [
  { name: 'Aarav (Kid)', avatar: '👦', value: 20 },
  { name: 'Pooja (Neighbor)', avatar: '👩', value: 30 },
  { name: 'Ramesh (Shopkeeper)', avatar: '👨‍💼', value: 50 },
  { name: 'Dadi (Grandmother)', avatar: '👵', value: 50 },
  { name: 'Uncle Joshi', avatar: '👨', value: 20 },
  { name: 'Meera (Student)', avatar: '👧', value: 10 }
];

export const TapNeighbors: React.FC<TapNeighborsProps> = ({ onWin }) => {
  const [spots, setSpots] = useState<NeighborSpot[]>([
    { id: 1, name: 'Aarav', avatar: '👦', value: 20, active: false, x: '15%', y: '20%' },
    { id: 2, name: 'Pooja', avatar: '👩', value: 30, active: false, x: '65%', y: '18%' },
    { id: 3, name: 'Ramesh', avatar: '👨‍💼', value: 50, active: false, x: '20%', y: '50%' },
    { id: 4, name: 'Dadi', avatar: '👵', value: 50, active: false, x: '68%', y: '48%' },
    { id: 5, name: 'Uncle', avatar: '👨', value: 20, active: false, x: '18%', y: '78%' },
    { id: 6, name: 'Meera', avatar: '👧', value: 10, active: false, x: '65%', y: '75%' }
  ]);

  const [collectedMoney, setCollectedMoney] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [floatingCoins, setFloatingCoins] = useState<{ id: number; x: string; y: string; text: string }[]>([]);

  // Neighbor popup timer
  useEffect(() => {
    const popupInterval = setInterval(() => {
      setSpots(prev => {
        const randomSpotIdx = Math.floor(Math.random() * prev.length);
        const randomNeighbor = NEIGHBORS[Math.floor(Math.random() * NEIGHBORS.length)];
        return prev.map((spot, idx) => {
          if (idx === randomSpotIdx) {
            return {
              ...spot,
              name: randomNeighbor.name,
              avatar: randomNeighbor.avatar,
              value: randomNeighbor.value,
              active: true
            };
          }
          return spot;
        });
      });
    }, 1100);

    return () => clearInterval(popupInterval);
  }, []);

  // Game timer
  useEffect(() => {
    if (timeLeft <= 0) {
      finishGame();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const finishGame = () => {
    const finalScore = score + collectedMoney * 2;
    const performance = collectedMoney >= 120 ? 'PERFECT' : collectedMoney >= 60 ? 'GREAT' : 'GOOD';
    const stars = performance === 'PERFECT' ? 3 : performance === 'GREAT' ? 2 : 1;
    onWin({
      performance,
      stars,
      score: finalScore,
      tokens: 15,
      moneyEarned: Math.max(50, collectedMoney)
    });
  };

  const handleTapNeighbor = (spot: NeighborSpot) => {
    if (!spot.active) return;
    soundManager.playCoin();

    // Spawn floating coin
    const floatId = Date.now() + Math.random();
    setFloatingCoins(prev => [...prev, { id: floatId, x: spot.x, y: spot.y, text: `+₹${spot.value}` }]);
    setTimeout(() => {
      setFloatingCoins(prev => prev.filter(c => c.id !== floatId));
    }, 800);

    const nextCombo = combo + 1;
    setCombo(nextCombo);
    setCollectedMoney(prev => prev + spot.value);
    setScore(prev => prev + spot.value * (nextCombo >= 3 ? 2 : 1));

    // Hide spot
    setSpots(prev => prev.map(s => s.id === spot.id ? { ...s, active: false } : s));

    // Auto win early if collected high target
    if (collectedMoney + spot.value >= 160) {
      setTimeout(finishGame, 400);
    }
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#170C2E] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-emerald-400">COLLECTED: ₹{collectedMoney}</div>
        <div className="text-amber-400">SCORE: {score}</div>
        <div className={`px-2 py-0.5 rounded-lg ${timeLeft <= 5 ? 'bg-red-500 text-white animate-pulse' : 'text-slate-300'}`}>
          ⏳ {timeLeft}s
        </div>
      </div>

      {/* Neighborhood Scene Grid */}
      <div className="relative flex-1 my-2 rounded-2xl bg-gradient-to-b from-[#211142] to-[#120724] border border-white/5 overflow-hidden">
        {/* Neighborhood Decorative Houses Background */}
        <div className="absolute inset-0 opacity-15 flex justify-between items-end px-2 pointer-events-none text-4xl">
          <span>🏘️</span>
          <span>🏡</span>
          <span>🏢</span>
          <span>🏘️</span>
        </div>

        {/* Windows / Door Spots where Neighbors Pop Up */}
        {spots.map(spot => (
          <div
            key={spot.id}
            onClick={() => handleTapNeighbor(spot)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200"
            style={{ left: spot.x, top: spot.y }}
          >
            {/* Window frame */}
            <div className="w-20 h-24 rounded-2xl bg-[#0B0418] border-2 border-amber-500/40 p-1 flex flex-col items-center justify-between shadow-lg relative overflow-hidden">
              <div className="text-[10px] text-amber-300/80 font-bold truncate w-full text-center">
                {spot.name}
              </div>

              {spot.active ? (
                <div className="flex-1 flex flex-col items-center justify-center animate-bounceSubtle">
                  <span className="text-3xl filter drop-shadow">{spot.avatar}</span>
                  <span className="text-[11px] font-black text-emerald-400 px-1.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 mt-1">
                    +₹{spot.value}
                  </span>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-700 text-lg">
                  🪟
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Floating Coin Animations */}
        {floatingCoins.map(coin => (
          <div
            key={coin.id}
            className="absolute pointer-events-none font-black text-amber-300 text-base drop-shadow animate-float-slow -translate-x-1/2 -translate-y-1/2"
            style={{ left: coin.x, top: coin.y }}
          >
            {coin.text}
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-amber-200 font-medium">
        👉 Tap neighbors quickly when they appear at their windows!
      </div>
    </div>
  );
};
