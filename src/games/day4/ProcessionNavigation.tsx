import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { MapPin, Sparkles, Navigation } from 'lucide-react';
import { useGame } from '../../state/GameContext';
import { GaneshaIdol } from '../../components/common/GaneshaIdol';

interface ProcessionNavigationProps {
  onWin: (result: RewardResult) => void;
}

interface ProcessionZone {
  id: number;
  name: string;
  icon: string;
  skyColor: string;
  description: string;
  signposts: {
    label: string;
    clue: string;
    isCorrect: boolean;
  }[];
}

const ZONES: ProcessionZone[] = [
  {
    id: 0,
    name: 'Neighborhood Residential Lanes',
    icon: '🏘️',
    skyColor: 'from-amber-800 via-orange-900 to-amber-950',
    description: 'Families cheer from balconies, throwing fragrant flower showers.',
    signposts: [
      { label: 'Broad Avenue ⬆️', clue: 'Clear procession path', isCorrect: true },
      { label: 'Narrow Alley ⬅️', clue: 'Too tight for Rath', isCorrect: false },
      { label: 'Dead End Courtyard ➡️', clue: 'No exit', isCorrect: false }
    ]
  },
  {
    id: 1,
    name: 'Festive Market Bazaar',
    icon: '🏮',
    skyColor: 'from-orange-800 via-purple-950 to-stone-950',
    description: 'Lanterns glow, sweet aroma fills the air, and crowd beats drums.',
    signposts: [
      { label: 'Vendor Cart Lane ⬅️', clue: 'Fruit stalls blocking', isCorrect: false },
      { label: 'Royal Procession Road ⬆️', clue: 'Decorated with torans', isCorrect: true },
      { label: 'Metro Construction ➡️', clue: 'Road works', isCorrect: false }
    ]
  },
  {
    id: 2,
    name: 'Grand Festival Square Chowk',
    icon: '🎪',
    skyColor: 'from-rose-800 via-indigo-950 to-stone-950',
    description: 'A sea of orange gulal fills the sky as thousands dance with joy.',
    signposts: [
      { label: 'Shopping Complex ⬅️', clue: 'Mall parking', isCorrect: false },
      { label: 'Old Bus Depot ➡️', clue: 'Heavy traffic', isCorrect: false },
      { label: 'Lake Ghat Boulevard ⬆️', clue: 'Follow the temple torches', isCorrect: true }
    ]
  },
  {
    id: 3,
    name: 'Sacred Lake Ghat',
    icon: '🌅',
    skyColor: 'from-amber-600 via-orange-900 to-indigo-950',
    description: 'Sunset bathes the holy waters in pure gold. The destination is reached!',
    signposts: [
      { label: 'Enter Lake Steps 🙏', clue: 'Holy Ghat entrance', isCorrect: true }
    ]
  }
];

export const ProcessionNavigation: React.FC<ProcessionNavigationProps> = ({ onWin }) => {
  const { state } = useGame();
  const [currentZoneIdx, setCurrentZoneIdx] = useState(0);
  const [wrongTurns, setWrongTurns] = useState(0);
  const [feedback, setFeedback] = useState<string>('Select the clearest route signpost to guide Bappas Rath!');

  const zone = ZONES[currentZoneIdx];

  const handleSignpostClick = (opt: typeof zone.signposts[0]) => {
    if (opt.isCorrect) {
      soundManager.playBell();
      soundManager.playDhol();

      if (currentZoneIdx + 1 >= ZONES.length) {
        // Reached the lake!
        soundManager.playFanfare();
        setFeedback('Grand arrival at the Sacred Lake Ghat!');
        setTimeout(() => {
          onWin({
            performance: wrongTurns === 0 ? 'PERFECT' : 'GREAT',
            stars: wrongTurns === 0 ? 3 : 2,
            score: 240 - wrongTurns * 20,
            tokens: 25
          });
        }, 1800);
      } else {
        setCurrentZoneIdx(z => z + 1);
        setFeedback('Route cleared! Progressing into the next area.');
      }
    } else {
      soundManager.playError();
      setWrongTurns(w => w + 1);
      setFeedback(`Cannot proceed there: ${opt.clue}. Check the signposts!`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-4 select-none">
      {/* Top Banner */}
      <div className="w-full bg-amber-950/80 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-amber-300 font-black text-xs tracking-wider flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-amber-400" />
            GRAND PROCESSION ROUTE
          </h3>
          <p className="text-[11px] text-amber-100/70">Navigate through transforming environments</p>
        </div>

        <div className="bg-amber-900/80 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
          <span className="text-[10px] text-amber-300/80 block uppercase font-bold">Stage</span>
          <span className="text-base font-black text-amber-300">{currentZoneIdx + 1} / 4</span>
        </div>
      </div>

      {/* 4 Stages Progress Bar */}
      <div className="w-full mt-2 grid grid-cols-4 gap-1.5">
        {ZONES.map((z, idx) => {
          const isDone = idx < currentZoneIdx;
          const isCurrent = idx === currentZoneIdx;

          return (
            <div
              key={z.id}
              className={`p-1.5 rounded-xl border flex flex-col items-center text-center transition ${
                isDone
                  ? 'bg-emerald-950/40 border-emerald-400 text-emerald-300'
                  : isCurrent
                  ? 'bg-amber-500/20 border-amber-300 ring-2 ring-amber-400/50 text-amber-200 animate-pulse'
                  : 'bg-black/30 border-white/10 text-stone-600'
              }`}
            >
              <span className="text-sm">{z.icon}</span>
              <span className="text-[8px] font-black uppercase mt-0.5 truncate w-full">
                {z.name.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Dynamic Transforming Environment Canvas */}
      <div
        className={`relative w-full aspect-[4/5] my-auto bg-gradient-to-b ${zone.skyColor} rounded-3xl border-2 border-amber-500/40 p-4 flex flex-col items-center justify-between shadow-2xl overflow-hidden transition-all duration-700`}
      >
        {/* Scenery Silhouette based on zone */}
        <div className="absolute inset-0 pointer-events-none opacity-30 flex flex-col justify-between">
          <div className="flex justify-around text-xl pt-2">
            <span>🚩</span><span>🏮</span><span>🚩</span><span>🏮</span><span>🚩</span>
          </div>
          {currentZoneIdx === 3 && (
            <div className="w-full text-center text-5xl opacity-40 animate-pulse">
              🌊 🌊 🌊
            </div>
          )}
        </div>

        {/* Current Zone Header Card */}
        <div className="z-10 w-full bg-black/60 backdrop-blur-md border border-amber-400/40 rounded-2xl p-3 text-center shadow-lg">
          <span className="text-[10px] text-amber-400 font-black uppercase tracking-widest block">
            TRANSFORMING ROUTE
          </span>
          <h4 className="text-sm font-black text-white">{zone.name}</h4>
          <p className="text-[11px] text-amber-100/80 mt-1">{zone.description}</p>
        </div>

        {/* Procession Rath Centerpiece */}
        <div className="relative z-10 flex flex-col items-center my-auto animate-bounce">
          <GaneshaIdol
            size={120}
            type={state.selectedIdol || 'grand'}
            showHalo={true}
            showThrone={true}
            animated={true}
          />
          <div className="px-3 py-1 bg-amber-500/40 rounded-full border border-amber-300 text-[10px] font-black text-white mt-1 shadow-lg">
            Morya Rath Moving Forward
          </div>
        </div>

        {/* Signpost Route Buttons */}
        <div className="z-10 w-full flex flex-col gap-2">
          {zone.signposts.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => handleSignpostClick(sp)}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-950/90 via-amber-900/90 to-amber-950/90 hover:from-amber-800 hover:to-amber-900 text-amber-100 rounded-2xl border-2 border-amber-500/40 shadow-lg font-bold text-xs flex items-center justify-between active:scale-95 transition"
            >
              <span>{sp.label}</span>
              <span className="text-[10px] text-amber-300/70 italic font-normal">({sp.clue})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Feedback Bar */}
      <div className="w-full bg-amber-950/80 rounded-2xl p-2.5 border border-amber-500/30 text-center text-xs text-amber-200 font-medium">
        {feedback}
      </div>
    </div>
  );
};
