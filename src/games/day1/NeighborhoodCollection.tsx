import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { AnimatedButton } from '../../components/common/AnimatedButton';
import { ComboBadge } from '../../components/common/ComboBadge';
import { Home, Store, Trees, Building2, CheckCircle2 } from 'lucide-react';

interface NeighborhoodCollectionProps {
  onWin: (result: RewardResult) => void;
}

interface LocationSpot {
  id: string;
  name: string;
  icon: React.ReactNode;
  character: string;
  charName: string;
  dialogue: string;
  contribution: number;
  visited: boolean;
}

export const NeighborhoodCollection: React.FC<NeighborhoodCollectionProps> = ({ onWin }) => {
  const [locations, setLocations] = useState<LocationSpot[]>([
    {
      id: 'house',
      name: 'Sharma Residence',
      icon: <Home className="w-5 h-5" />,
      character: '👵',
      charName: 'Dadi Sharma',
      dialogue: '“Jai Ganesh! Here is our family’s contribution for Bappa’s sweet modaks!”',
      contribution: 50,
      visited: false
    },
    {
      id: 'shop',
      name: 'Corner Sweet Shop',
      icon: <Store className="w-5 h-5" />,
      character: '👨‍🍳',
      charName: 'Mithaiwala Kaka',
      dialogue: '“Bappa brings so much sweetness to our street. Please take this blessing!”',
      contribution: 40,
      visited: false
    },
    {
      id: 'park',
      name: 'Neighborhood Park',
      icon: <Trees className="w-5 h-5" />,
      character: '👦',
      charName: 'Aarav & Kids',
      dialogue: '“We saved our pocket money all month for the grand dhol procession!”',
      contribution: 30,
      visited: false
    },
    {
      id: 'center',
      name: 'Community Hall',
      icon: <Building2 className="w-5 h-5" />,
      character: '👩‍💼',
      charName: 'Priya (Volunteer)',
      dialogue: '“The whole society is pitching in. Here is our floor’s collection!”',
      contribution: 50,
      visited: false
    }
  ]);

  const [activeLocId, setActiveLocId] = useState<string>('house');
  const [collectedMoney, setCollectedMoney] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [floatingCoin, setFloatingCoin] = useState<string | null>(null);

  const activeSpot = locations.find(l => l.id === activeLocId)!;

  const handleApproach = () => {
    if (activeSpot.visited) return;

    soundManager.playCoin();
    setFloatingCoin(`+₹${activeSpot.contribution}`);
    setTimeout(() => setFloatingCoin(null), 900);

    const nextCombo = combo + 1;
    setCombo(nextCombo);
    setScore(s => s + activeSpot.contribution * 3 * nextCombo);
    const nextTotal = collectedMoney + activeSpot.contribution;
    setCollectedMoney(nextTotal);

    const updated = locations.map(l => l.id === activeSpot.id ? { ...l, visited: true } : l);
    setLocations(updated);

    if (updated.every(l => l.visited)) {
      soundManager.playFanfare();
      setTimeout(() => {
        onWin({
          performance: 'PERFECT',
          stars: 3,
          score: score + 300,
          tokens: 20,
          moneyEarned: nextTotal
        });
      }, 700);
    }
  };

  const visitedCount = locations.filter(l => l.visited).length;

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold z-10">
        <div className="text-emerald-400">COLLECTED: ₹{collectedMoney}</div>
        <div className="text-amber-400">VISITED: {visitedCount} / 4</div>
        <div className="text-pink-300">SCORE: {score}</div>
      </div>

      {/* Location Tabs / Movement */}
      <div className="grid grid-cols-4 gap-1.5 my-2 z-10">
        {locations.map((loc) => {
          const isActive = loc.id === activeLocId;
          return (
            <button
              key={loc.id}
              onClick={() => {
                soundManager.playClick();
                setActiveLocId(loc.id);
              }}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-amber-500/25 border-amber-400 text-amber-300 scale-105 shadow-md shadow-amber-500/30'
                  : loc.visited
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <span className="text-base">{loc.icon}</span>
              <span className="text-[9px] font-bold mt-1 truncate w-full text-center">
                {loc.name.split(' ')[0]}
              </span>
              {loc.visited && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 mt-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Interactive Story Scene Card */}
      <div className="relative my-auto p-5 rounded-3xl bg-gradient-to-b from-[#241042] via-[#1A0C30] to-[#100620] border-2 border-amber-400/50 shadow-2xl text-center">
        {/* Character Avatar */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 p-0.5 shadow-xl mb-3 animate-float-slow">
          <div className="w-full h-full rounded-2xl bg-[#1A0B30] flex items-center justify-center text-4xl">
            {activeSpot.character}
          </div>
        </div>

        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          {activeSpot.name}
        </div>
        <h4 className="text-base font-black text-white mt-0.5">
          {activeSpot.charName}
        </h4>

        {/* Speech Bubble */}
        <div className="mt-3 p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-amber-100 font-medium leading-relaxed italic">
          {activeSpot.dialogue}
        </div>

        {floatingCoin && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 text-2xl font-black text-amber-300 drop-shadow animate-bounce">
            {floatingCoin} 🪙
          </div>
        )}
      </div>

      {/* Action Area */}
      <div className="z-10">
        {activeSpot.visited ? (
          <div className="py-3 px-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-center text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Contribution received! Move to another location.</span>
          </div>
        ) : (
          <AnimatedButton
            variant="gold"
            size="lg"
            className="w-full"
            soundType="coin"
            onClick={handleApproach}
          >
            APPROACH & RECEIVE CONTRIBUTION (+₹{activeSpot.contribution})
          </AnimatedButton>
        )}
      </div>
    </div>
  );
};
