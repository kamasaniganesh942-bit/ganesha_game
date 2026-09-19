import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface GarlandMakerProps {
  onWin: (result: RewardResult) => void;
}

interface FlowerOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const FLOWERS: FlowerOption[] = [
  { id: 'yellow_marigold', name: 'Yellow Marigold', icon: '🌼', color: '#eab308' },
  { id: 'orange_marigold', name: 'Orange Genda', icon: '🏵️', color: '#f97316' },
  { id: 'red_rose', name: 'Red Rose', icon: '🌹', color: '#ef4444' },
  { id: 'jasmine', name: 'White Mogra', icon: '🌸', color: '#ffffff' }
];

const PATTERNS = [
  // Round 1: Simple 2-flower rhythm (4 flowers)
  {
    name: 'Genda Toran',
    target: ['yellow_marigold', 'orange_marigold', 'yellow_marigold', 'orange_marigold']
  },
  // Round 2: Rose & Jasmine devotion (4 flowers)
  {
    name: 'Gulab Mogra Haar',
    target: ['red_rose', 'jasmine', 'red_rose', 'jasmine']
  },
  // Round 3: Royal Trio Mala (4 flowers)
  {
    name: 'Royal Trio Mala',
    target: ['yellow_marigold', 'red_rose', 'orange_marigold', 'jasmine']
  }
];

export const GarlandMaker: React.FC<GarlandMakerProps> = ({ onWin }) => {
  const [round, setRound] = useState(0);
  const [threadedIds, setThreadedIds] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [isRoundComplete, setIsRoundComplete] = useState(false);

  const currentPattern = PATTERNS[round];
  const nextTargetId = currentPattern.target[threadedIds.length];

  const handlePickFlower = (flowerId: string) => {
    if (isRoundComplete) return;

    if (flowerId === nextTargetId) {
      soundManager.playBell();
      const updated = [...threadedIds, flowerId];
      setThreadedIds(updated);

      // Check if current garland is finished
      if (updated.length === currentPattern.target.length) {
        soundManager.playFanfare();
        setIsRoundComplete(true);

        setTimeout(() => {
          if (round + 1 < PATTERNS.length) {
            setRound(r => r + 1);
            setThreadedIds([]);
            setIsRoundComplete(false);
          } else {
            // All 3 garlands finished!
            onWin({
              performance: mistakes === 0 ? 'PERFECT' : 'GREAT',
              stars: mistakes === 0 ? 3 : 2,
              score: 210 - mistakes * 15,
              tokens: 20
            });
          }
        }, 400);
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
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            GARLAND WEAVING ({round + 1} / 3)
          </h3>
          <p className="text-[11px] text-amber-100/70">{currentPattern.name}</p>
        </div>

        <div className="bg-amber-900/80 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
          <span className="text-[10px] text-amber-300/80 block uppercase font-bold">Flowers</span>
          <span className="text-base font-black text-amber-300">
            {threadedIds.length} / {currentPattern.target.length}
          </span>
        </div>
      </div>

      {/* Target Pattern Preview */}
      <div className="w-full mt-2 bg-amber-950/60 rounded-xl p-2 border border-amber-600/30 flex items-center justify-center gap-2">
        <span className="text-[10px] font-bold text-amber-300 uppercase mr-1">Target Pattern:</span>
        <div className="flex items-center gap-1">
          {currentPattern.target.map((tId, idx) => {
            const flower = FLOWERS.find(f => f.id === tId);
            const isDone = idx < threadedIds.length;
            const isNext = idx === threadedIds.length;
            return (
              <div
                key={idx}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm border transition ${
                  isDone
                    ? 'bg-emerald-500/30 border-emerald-400 opacity-60'
                    : isNext
                    ? 'bg-amber-500/40 border-amber-300 scale-110 animate-pulse'
                    : 'bg-black/30 border-white/20'
                }`}
              >
                {flower?.icon}
              </div>
            );
          })}
        </div>
      </div>

      {/* Golden Thread Weaving Canvas */}
      <div className="relative w-full aspect-[4/5] my-auto bg-gradient-to-b from-amber-950 via-stone-900 to-amber-950 rounded-3xl border-2 border-amber-500/40 p-4 flex flex-col items-center justify-center shadow-2xl overflow-hidden">
        {/* Festive Temple Arch Background */}
        <div className="absolute inset-0 flex justify-center pointer-events-none opacity-20">
          <div className="w-72 h-full border-x-4 border-dashed border-amber-400" />
        </div>

        {/* Needle & Golden Thread */}
        <div className="relative flex flex-col items-center h-72">
          {/* Top Brass Ring */}
          <div className="w-6 h-6 rounded-full border-4 border-amber-400 bg-amber-600 shadow-md" />

          {/* Golden Thread Line */}
          <div className="w-1 flex-1 bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 shadow-glow" />

          {/* Threaded Flowers Growing Downwards */}
          <div className="absolute top-8 flex flex-col items-center gap-1">
            {threadedIds.map((fId, i) => {
              const flower = FLOWERS.find(f => f.id === fId);
              return (
                <div
                  key={i}
                  className="text-3xl animate-in zoom-in-75 filter drop-shadow-lg"
                  style={{ animationDuration: '200ms' }}
                >
                  {flower?.icon}
                </div>
              );
            })}
          </div>

          {/* Golden Threading Needle at bottom */}
          <div className="w-2 h-10 bg-gradient-to-b from-amber-300 to-amber-100 rounded-b-full shadow-lg border border-amber-400 mt-auto animate-bounce" />
        </div>

        {/* Round Complete Banner */}
        {isRoundComplete && (
          <div className="absolute inset-x-6 top-1/3 bg-amber-950/95 border-2 border-amber-400 rounded-2xl p-4 text-center shadow-2xl backdrop-blur-md animate-in zoom-in-95 z-20">
            <span className="text-4xl animate-bounce">🌸</span>
            <h4 className="text-amber-300 font-black text-base mt-1">GARLAND WOVEN!</h4>
            <p className="text-xs text-amber-100 mt-1">
              {round + 1 < PATTERNS.length ? 'Preparing next sacred mala...' : 'All festival garlands ready for Bappa!'}
            </p>
          </div>
        )}
      </div>

      {/* Flower Basket Choices */}
      <div className="w-full bg-amber-950/80 rounded-2xl p-3 border border-amber-500/30">
        <div className="text-[10px] uppercase font-bold text-amber-300/80 mb-2 text-center">
          Tap the Next Flower in the Pattern
        </div>
        <div className="grid grid-cols-4 gap-2">
          {FLOWERS.map(flower => (
            <button
              key={flower.id}
              onClick={() => handlePickFlower(flower.id)}
              disabled={isRoundComplete}
              className="py-3 px-2 rounded-2xl bg-amber-900/70 hover:bg-amber-800/80 border border-amber-500/30 flex flex-col items-center justify-center transition active:scale-95 shadow-md group"
            >
              <span className="text-3xl group-hover:scale-110 transition">{flower.icon}</span>
              <span className="text-[10px] font-bold text-amber-200 mt-1 text-center line-clamp-1">
                {flower.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
