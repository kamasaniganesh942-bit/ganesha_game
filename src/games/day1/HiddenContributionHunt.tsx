import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';

interface HiddenContributionHuntProps {
  onWin: (result: RewardResult) => void;
}

interface EnvelopeSpot {
  id: string;
  name: string;
  donor: string;
  amount: number;
  hint: string;
  style: { top: string; left: string; width: string; height: string };
  found: boolean;
}

export const HiddenContributionHunt: React.FC<HiddenContributionHuntProps> = ({ onWin }) => {
  const [spots, setSpots] = useState<EnvelopeSpot[]>([
    {
      id: 'tulsi',
      name: 'Potted Holy Tulsi Plant',
      donor: 'Sharma Family',
      amount: 75,
      hint: 'Near the auspicious green Tulsi pot on the front porch.',
      style: { top: '64%', left: '16%', width: '60px', height: '60px' },
      found: false
    },
    {
      id: 'board',
      name: 'Community Notice Board',
      donor: 'Society Committee',
      amount: 100,
      hint: 'Pinned beside the festive timetable on the wooden board.',
      style: { top: '34%', left: '72%', width: '55px', height: '55px' },
      found: false
    },
    {
      id: 'marigold',
      name: 'Marigold Basket',
      donor: 'Auntie Sunita',
      amount: 50,
      hint: 'Tucked gently beneath the fragrant yellow marigolds.',
      style: { top: '56%', left: '46%', width: '58px', height: '58px' },
      found: false
    }
  ]);

  const [activeNote, setActiveNote] = useState<{ donor: string; amount: number; name: string } | null>(null);
  const [hintActive, setHintActive] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  const foundCount = spots.filter(s => s.found).length;
  const totalMoney = spots.filter(s => s.found).reduce((acc, s) => acc + s.amount, 0);

  const handleSpotClick = (spotId: string) => {
    const spot = spots.find(s => s.id === spotId);
    if (!spot || spot.found) return;

    soundManager.playCoin();
    soundManager.playBell();

    const nextSpots = spots.map(s => (s.id === spotId ? { ...s, found: true } : s));
    setSpots(nextSpots);
    setActiveNote({ donor: spot.donor, amount: spot.amount, name: spot.name });
    setHintActive(false);

    const newFound = nextSpots.filter(s => s.found).length;
    if (newFound === 3) {
      soundManager.playFanfare();
      setTimeout(() => {
        onWin({
          performance: hintsUsed === 0 ? 'PERFECT' : 'GREAT',
          stars: hintsUsed === 0 ? 3 : 2,
          score: 180 - hintsUsed * 20,
          tokens: 15,
          moneyEarned: 225
        });
      }, 1800);
    }
  };

  const handleUseHint = () => {
    soundManager.playClick();
    setHintActive(true);
    setHintsUsed(prev => prev + 1);
  };

  const nextUnfound = spots.find(s => !s.found);

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-4 select-none">
      {/* Top Banner */}
      <div className="w-full bg-amber-950/70 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-amber-300 font-black text-sm tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            FIND 3 HIDDEN ENVELOPES
          </h3>
          <p className="text-xs text-amber-100/70">Tap sparkling spots in the neighborhood scene</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-amber-900/80 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <span className="text-[10px] text-amber-300/80 block uppercase font-bold">Found</span>
            <span className="text-base font-black text-amber-300">{foundCount} / 3</span>
          </div>
          <button
            onClick={handleUseHint}
            disabled={foundCount === 3 || hintActive}
            className="px-2.5 py-1.5 bg-amber-600/60 hover:bg-amber-500/80 text-white rounded-xl text-xs font-bold flex items-center gap-1 border border-amber-400/40 transition disabled:opacity-40"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            HINT
          </button>
        </div>
      </div>

      {/* Clue Prompt */}
      {hintActive && nextUnfound && (
        <div className="w-full mt-2 bg-amber-500/20 border border-amber-400/50 rounded-xl p-2 text-xs text-amber-200 text-center animate-pulse">
          💡 Clue: {nextUnfound.hint}
        </div>
      )}

      {/* Illustrated Neighborhood Scene Canvas */}
      <div className="relative w-full aspect-[4/5] my-auto bg-gradient-to-b from-sky-800 via-indigo-950 to-amber-950 rounded-3xl border-2 border-amber-500/40 overflow-hidden shadow-2xl">
        {/* Background Scenery: Traditional houses, archway, flags */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {/* Distant skyline & flags */}
          <div className="absolute top-2 left-0 right-0 flex justify-around text-lg">
            <span>🚩</span><span>🚩</span><span>🚩</span><span>🚩</span><span>🚩</span>
          </div>
          {/* Festive street lamps */}
          <div className="absolute top-10 left-6 text-3xl">🏮</div>
          <div className="absolute top-10 right-6 text-3xl">🏮</div>
        </div>

        {/* Scene Elements */}
        {/* House Front & Doorway */}
        <div className="absolute top-16 left-4 w-36 h-48 bg-amber-900/60 rounded-t-xl border border-amber-600/30 flex flex-col items-center p-2">
          <div className="w-16 h-24 bg-amber-950 rounded-t-full border border-amber-700/50 mt-auto flex items-center justify-center text-xs text-amber-500">
            🚪
          </div>
          <span className="text-[10px] text-amber-200 font-semibold mt-1">Sharma House</span>
        </div>

        {/* Notice Board */}
        <div className="absolute top-20 right-4 w-32 h-36 bg-amber-950/80 rounded-xl border-2 border-amber-700/60 p-2 shadow-inner flex flex-col items-center">
          <div className="text-[10px] font-bold text-amber-300 border-b border-amber-700 w-full text-center pb-1">
            NOTICES 📌
          </div>
          <div className="mt-2 text-[8px] text-amber-200/80 text-center space-y-1">
            <p>• Aarti 7 PM</p>
            <p>• Modak Making</p>
            <p>• Pandal Decor</p>
          </div>
        </div>

        {/* Marigold Flower Stall */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-amber-900/70 rounded-2xl border border-amber-500/30 flex flex-col items-center p-2">
          <span className="text-xs font-bold text-amber-300">🌸 Flower Stall</span>
          <div className="flex gap-2 mt-2 text-2xl">
            <span className="animate-bounce">🌺</span>
            <span>🌼</span>
            <span className="animate-pulse">🌸</span>
          </div>
        </div>

        {/* Street Floor & Rangoli */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-amber-950 border-t-2 border-amber-600/40 flex items-center justify-center">
          <span className="text-2xl opacity-60">☸️ 🪔 ☸️</span>
        </div>

        {/* Hidden Spots Overlays */}
        {spots.map(spot => {
          const isTargetHint = hintActive && nextUnfound?.id === spot.id;
          return (
            <button
              key={spot.id}
              onClick={() => handleSpotClick(spot.id)}
              disabled={spot.found}
              style={{
                position: 'absolute',
                ...spot.style
              }}
              className={`group flex items-center justify-center rounded-2xl transition-all duration-300 active:scale-95 ${
                spot.found
                  ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300'
                  : isTargetHint
                  ? 'ring-4 ring-amber-400 bg-amber-400/30 animate-bounce'
                  : 'hover:bg-amber-400/20'
              }`}
              title={spot.name}
            >
              {spot.found ? (
                <div className="flex flex-col items-center animate-in zoom-in-75">
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  <span className="text-[10px] font-black text-emerald-300">₹{spot.amount}</span>
                </div>
              ) : (
                <div className="relative">
                  <span className="text-3xl filter drop-shadow-md animate-pulse">
                    {spot.id === 'tulsi' ? '🪴' : spot.id === 'board' ? '📋' : '🧺'}
                  </span>
                  {/* Subtle sparkle effect */}
                  <span className="absolute -top-1 -right-1 text-xs animate-ping">✨</span>
                </div>
              )}
            </button>
          );
        })}

        {/* Active Found Card Pop-up */}
        {activeNote && (
          <div className="absolute inset-x-4 top-1/3 bg-amber-950/95 border-2 border-amber-400 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-center animate-in fade-in zoom-in-90 z-20">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl">
              ✉️
            </div>
            <h4 className="text-amber-300 font-black text-sm">CONTRIBUTION FOUND!</h4>
            <p className="text-xs text-amber-100/90 mt-1">
              Found at <span className="text-amber-300 font-bold">{activeNote.name}</span>
            </p>
            <div className="my-2 py-1 px-3 bg-amber-900/60 rounded-xl inline-block border border-amber-500/30">
              <span className="text-xs text-amber-200">From: {activeNote.donor}</span>
              <span className="text-lg font-black text-emerald-400 block">+ ₹{activeNote.amount}</span>
            </div>
            <p className="text-[11px] text-amber-200/70 italic">"May Lord Bappa bring happiness and prosperity!"</p>
            <button
              onClick={() => setActiveNote(null)}
              className="mt-3 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-amber-950 font-black text-xs rounded-xl shadow-md active:scale-95 transition"
            >
              KEEP SEARCHING
            </button>
          </div>
        )}
      </div>

      {/* Bottom Summary Bar */}
      <div className="w-full bg-amber-950/80 rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between">
        <div className="text-left">
          <span className="text-[11px] text-amber-300/80 block uppercase font-bold">Total Secret Funds</span>
          <span className="text-lg font-black text-emerald-400">₹{totalMoney}</span>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-amber-300/80 block uppercase font-bold">Status</span>
          <span className="text-xs font-bold text-amber-200">
            {foundCount === 3 ? '🎉 All Envelopes Found!' : `Need ${3 - foundCount} more`}
          </span>
        </div>
      </div>
    </div>
  );
};
