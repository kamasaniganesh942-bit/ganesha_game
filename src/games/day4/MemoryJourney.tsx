import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { Sparkles, CheckCircle2, History } from 'lucide-react';

interface MemoryJourneyProps {
  onWin: (result: RewardResult) => void;
}

interface Landmark {
  id: string;
  name: string;
  day: number;
  icon: string;
  memory: string;
  pos: { top: string; left: string };
}

const LANDMARKS: Landmark[] = [
  {
    id: 'house',
    name: 'Neighborhood Porch',
    day: 1,
    icon: '🏘️',
    memory: 'Day 1: Gathering coins from kind neighbors to fund the celebration.',
    pos: { top: '18%', left: '25%' }
  },
  {
    id: 'mandap',
    name: 'Pandal Mandap',
    day: 2,
    icon: '🎪',
    memory: 'Day 2: Raising timber pillars, weaving rangoli, and illuminating lights.',
    pos: { top: '34%', left: '75%' }
  },
  {
    id: 'workshop',
    name: 'Artisan Workshop',
    day: 3,
    icon: '🐘',
    memory: 'Day 3: Choosing eco-friendly Bappa and carrying Him home with love.',
    pos: { top: '56%', left: '26%' }
  },
  {
    id: 'streets',
    name: 'Grand Procession',
    day: 4,
    icon: '🌸',
    memory: 'Day 4: Dancing to thunderous dhol beats through flower-showered lanes.',
    pos: { top: '70%', left: '74%' }
  },
  {
    id: 'lake',
    name: 'Sacred Lake Ghat',
    day: 4,
    icon: '🌅',
    memory: 'The Sunset Lake: Where the divine journey reaches its peaceful blessing.',
    pos: { top: '88%', left: '50%' }
  }
];

const CORRECT_ORDER = ['house', 'mandap', 'workshop', 'streets', 'lake'];

export const MemoryJourney: React.FC<MemoryJourneyProps> = ({ onWin }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMemory, setActiveMemory] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const handleLandmarkClick = (id: string) => {
    const nextExpected = CORRECT_ORDER[selectedIds.length];

    if (id === nextExpected) {
      soundManager.playBell();
      const updated = [...selectedIds, id];
      setSelectedIds(updated);

      const lm = LANDMARKS.find(l => l.id === id);
      if (lm) setActiveMemory(lm.memory);

      if (updated.length === CORRECT_ORDER.length) {
        soundManager.playFanfare();
        setTimeout(() => {
          onWin({
            performance: mistakes === 0 ? 'PERFECT' : 'GREAT',
            stars: mistakes === 0 ? 3 : 2,
            score: 260 - mistakes * 20,
            tokens: 25
          });
        }, 450);
      }
    } else {
      soundManager.playError();
      setMistakes(m => m + 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-4 select-none">
      {/* Top Banner */}
      <div className="w-full bg-amber-950/80 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-amber-300 font-black text-xs tracking-wider flex items-center gap-1">
            <History className="w-3.5 h-3.5 text-amber-400" />
            FOUR-DAY MEMORY JOURNEY
          </h3>
          <p className="text-[11px] text-amber-100/70">Connect landmark memories in story order</p>
        </div>

        <div className="bg-amber-900/80 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
          <span className="text-[10px] text-amber-300/80 block uppercase font-bold">Connected</span>
          <span className="text-base font-black text-amber-300">{selectedIds.length} / 5</span>
        </div>
      </div>

      {/* Active Memory Prompt Card */}
      <div className="w-full mt-2 bg-amber-950/60 rounded-xl py-1.5 px-3 border border-amber-600/30 text-center text-xs text-amber-200 font-medium min-h-[36px] flex items-center justify-center">
        {activeMemory || 'Tap the first landmark of Day 1: Where did we begin funding?'}
      </div>

      {/* Illustrated Story Map Canvas */}
      <div className="relative w-full aspect-[4/5] my-auto bg-gradient-to-b from-indigo-950 via-stone-900 to-amber-950 rounded-3xl border-2 border-amber-500/40 p-4 shadow-2xl overflow-hidden">
        {/* Winding Connecting Pilgrim Path */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-amber-500/40 stroke-[3] stroke-dasharray-4 fill-none">
          <path d="M 100 80 Q 280 120 280 160 T 110 260 T 280 340 T 190 420" />
        </svg>

        {/* 5 Landmark Memory Nodes */}
        {LANDMARKS.map((lm, idx) => {
          const isSelected = selectedIds.includes(lm.id);
          const isNext = !isSelected && lm.id === CORRECT_ORDER[selectedIds.length];

          return (
            <button
              key={lm.id}
              onClick={() => handleLandmarkClick(lm.id)}
              disabled={isSelected}
              style={{
                position: 'absolute',
                top: lm.pos.top,
                left: lm.pos.left,
                transform: 'translate(-50%, -50%)'
              }}
              className={`p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 active:scale-95 ${
                isSelected
                  ? 'bg-emerald-950/70 border-emerald-400 shadow-glow scale-105 text-emerald-300'
                  : isNext
                  ? 'bg-amber-500/30 border-amber-300 ring-4 ring-amber-400/50 animate-bounce'
                  : 'bg-stone-900/80 border-amber-500/30 hover:border-amber-400'
              }`}
            >
              <div className="relative">
                <span className="text-3xl">{lm.icon}</span>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute -top-1 -right-1 bg-black rounded-full" />
                )}
              </div>
              <span className="text-[9px] font-black text-amber-200 mt-1 uppercase text-center max-w-[80px] leading-tight">
                {lm.name}
              </span>
            </button>
          );
        })}

        {/* Completion Modal */}
        {selectedIds.length === 5 && (
          <div className="absolute inset-4 bg-amber-950/95 border-2 border-amber-400 rounded-3xl p-5 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-md animate-in zoom-in-90 z-30">
            <span className="text-5xl animate-bounce">📜</span>
            <h4 className="text-amber-300 font-black text-lg mt-2">JOURNEY REMEMBERED!</h4>
            <p className="text-xs text-amber-100 mt-1">
              Every step of the four days connects into a golden thread of community love.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-black text-sm mt-3">
              <Sparkles className="w-4 h-4" />
              Final Visarjan Ceremony Unlocked!
            </div>
          </div>
        )}
      </div>

      {/* Bottom Timeline Indicator */}
      <div className="w-full bg-amber-950/80 rounded-2xl p-2.5 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
        <span>Day 1 Fund</span>
        <span>→</span>
        <span>Day 2 Build</span>
        <span>→</span>
        <span>Day 3 Welcome</span>
        <span>→</span>
        <span className="text-amber-400 font-bold">Lake Visarjan</span>
      </div>
    </div>
  );
};
