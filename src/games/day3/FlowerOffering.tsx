import React, { useState } from 'react';
import { useGame } from '../../state/GameContext';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';
import { GaneshaIdol } from '../../components/common/GaneshaIdol';
import { Sparkles } from 'lucide-react';

interface FlowerOfferingProps {
  onWin: (result: RewardResult) => void;
}

interface FlowerItem {
  id: string;
  name: string;
  icon: string;
}

const SACRED_FLOWERS: FlowerItem[] = [
  { id: 'hibiscus', name: 'Red Hibiscus (Jaswand)', icon: '🌺' },
  { id: 'durva', name: '21 Durva Grass Blades', icon: '🌿' },
  { id: 'marigold', name: 'Yellow Marigold', icon: '🌼' },
  { id: 'rose', name: 'Fragrant Gulab', icon: '🌸' }
];

export const FlowerOffering: React.FC<FlowerOfferingProps> = ({ onWin }) => {
  const { state } = useGame();
  const [offered, setOffered] = useState<string[]>([]);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);

  const handleOffer = (flower: FlowerItem) => {
    if (offered.length >= 5) return;

    soundManager.playBell();
    const nextCombo = combo + 1;
    setCombo(nextCombo);
    setScore(s => s + 70 * nextCombo);

    const nextOffered = [...offered, flower.icon];
    setOffered(nextOffered);

    if (nextOffered.length >= 5) {
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
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">OFFERED: {offered.length} / 5</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Sanctum Altar Offering Area */}
      <div className="my-auto p-4 rounded-3xl bg-gradient-to-b from-[#241142] to-[#120722] border-2 border-amber-400/50 shadow-2xl text-center">
        {/* Lord Ganesha on throne */}
        <div className="flex justify-center mb-2 animate-float-slow">
          <GaneshaIdol
            size={115}
            type={state.selectedIdol || 'festival'}
            showHalo={true}
            showThrone={true}
            showMouse={true}
            animated={true}
          />
        </div>
        <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
          OFFERING THALI AT BAPPA'S FEET:
        </div>

        {/* Thali plate with offered flowers */}
        <div className="w-56 h-24 mx-auto my-3 rounded-full bg-gradient-to-b from-amber-500/20 to-orange-500/30 border-2 border-amber-300 p-2 flex items-center justify-center gap-2 shadow-inner">
          {offered.length === 0 ? (
            <span className="text-xs text-amber-200/60 italic">Tap flowers below to offer</span>
          ) : (
            offered.map((icon, idx) => (
              <span key={idx} className="text-3xl animate-bounceSubtle">
                {icon}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Flower Selector Tray */}
      <div className="grid grid-cols-2 gap-2.5">
        {SACRED_FLOWERS.map((flower) => (
          <button
            key={flower.id}
            onClick={() => handleOffer(flower)}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 flex items-center gap-2.5 transition-all shadow-md"
          >
            <span className="text-3xl">{flower.icon}</span>
            <div className="text-left">
              <div className="text-xs font-bold text-white">{flower.name}</div>
              <div className="text-[10px] text-amber-300 flex items-center gap-0.5">
                <Sparkles className="w-3 h-3" /> Tap to Offer
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
