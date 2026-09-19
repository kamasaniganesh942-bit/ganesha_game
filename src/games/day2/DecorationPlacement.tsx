import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface DecorationPlacementProps {
  onWin: (result: RewardResult) => void;
}

interface DecorItem {
  id: string;
  name: string;
  icon: string;
  desc: string;
  slotPosition: { top: string; left: string; width: string; height: string };
}

const DECOR_ITEMS: DecorItem[] = [
  {
    id: 'toran',
    name: 'Mango Leaf Toran',
    icon: '🌿',
    desc: 'Hung across the entrance archway',
    slotPosition: { top: '10%', left: '50%', width: '85%', height: '45px' }
  },
  {
    id: 'banner',
    name: 'Morya Silk Banner',
    icon: '🚩',
    desc: 'Sacred tapestry behind the altar',
    slotPosition: { top: '30%', left: '50%', width: '65%', height: '50px' }
  },
  {
    id: 'diya_left',
    name: 'Left Brass Diya',
    icon: '🪔',
    desc: 'Golden tall lamp on left pedestal',
    slotPosition: { top: '56%', left: '20%', width: '50px', height: '60px' }
  },
  {
    id: 'diya_right',
    name: 'Right Brass Diya',
    icon: '🪔',
    desc: 'Golden tall lamp on right pedestal',
    slotPosition: { top: '56%', left: '80%', width: '50px', height: '60px' }
  },
  {
    id: 'floral_carpet',
    name: 'Lotus Flower Carpet',
    icon: '🏵️',
    desc: 'Petal decoration on the sacred floor',
    slotPosition: { top: '80%', left: '50%', width: '80%', height: '48px' }
  }
];

export const DecorationPlacement: React.FC<DecorationPlacementProps> = ({ onWin }) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [placedItemIds, setPlacedItemIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>('Select a festive decoration item to place in the Mandap!');

  const placedCount = placedItemIds.length;
  const isComplete = placedCount === DECOR_ITEMS.length;

  const handleSelectItem = (id: string) => {
    if (placedItemIds.includes(id)) {
      // Allow pickup/reposition
      setPlacedItemIds(prev => prev.filter(i => i !== id));
      setSelectedItemId(id);
      soundManager.playClick();
      setFeedback('Pick a new spot or reposition it.');
      return;
    }
    soundManager.playClick();
    setSelectedItemId(id);
    const item = DECOR_ITEMS.find(i => i.id === id);
    setFeedback(`Selected ${item?.name}. Tap its matching location in the mandap!`);
  };

  const handleSlotClick = (slotId: string) => {
    if (!selectedItemId) {
      // If already placed, allow pickup
      if (placedItemIds.includes(slotId)) {
        setPlacedItemIds(prev => prev.filter(i => i !== slotId));
        setSelectedItemId(slotId);
        soundManager.playClick();
        return;
      }
      setFeedback('Select a decoration item from below first!');
      soundManager.playError();
      return;
    }

    if (selectedItemId === slotId) {
      soundManager.playBell();
      const updated = [...placedItemIds, slotId];
      setPlacedItemIds(updated);
      setSelectedItemId(null);
      setFeedback('Beautiful placement!');

      if (updated.length === DECOR_ITEMS.length) {
        soundManager.playFanfare();
        setFeedback('Mandap fully decorated with divine splendor!');
        setTimeout(() => {
          onWin({
            performance: 'PERFECT',
            stars: 3,
            score: 220,
            tokens: 20
          });
        }, 1800);
      }
    } else {
      soundManager.playError();
      setFeedback('That decoration belongs in a different spot. Check the shape!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-4 select-none">
      {/* Top Banner */}
      <div className="w-full bg-amber-950/80 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-amber-300 font-black text-xs tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            DECORATION PLACEMENT
          </h3>
          <p className="text-[11px] text-amber-100/70">Adorn the mandap with sacred elements</p>
        </div>

        <div className="bg-amber-900/80 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
          <span className="text-[10px] text-amber-300/80 block uppercase font-bold">Decor</span>
          <span className="text-base font-black text-amber-300">{placedCount} / 5</span>
        </div>
      </div>

      {/* Status Bar */}
      <div className="w-full mt-2 bg-amber-950/60 rounded-xl py-1 px-3 border border-amber-600/30 text-center text-xs text-amber-200 font-medium">
        {feedback}
      </div>

      {/* Mandap Altar Canvas */}
      <div className="relative w-full aspect-[4/5] my-auto bg-gradient-to-b from-amber-950 via-stone-900 to-amber-950 rounded-3xl border-2 border-amber-500/40 p-4 shadow-2xl overflow-hidden">
        {/* Mandap Architecture Background */}
        <div className="absolute inset-0 flex flex-col items-center pointer-events-none opacity-25">
          <div className="w-full h-20 border-b-4 border-amber-400" />
          <div className="w-48 h-56 border-2 border-dashed border-amber-400 mt-4 rounded-t-full" />
        </div>

        {/* Central Asan / Altar Pedestal */}
        <div className="absolute top-[42%] left-1/2 -translate-x-1/2 w-32 h-20 bg-amber-900/60 rounded-2xl border border-amber-500/30 flex items-center justify-center text-3xl">
          👑
        </div>

        {/* 5 Drop Target Slots */}
        {DECOR_ITEMS.map(item => {
          const isPlaced = placedItemIds.includes(item.id);
          const isSelected = selectedItemId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSlotClick(item.id)}
              style={{
                position: 'absolute',
                top: item.slotPosition.top,
                left: item.slotPosition.left,
                width: item.slotPosition.width,
                height: item.slotPosition.height,
                transform: 'translate(-50%, -50%)'
              }}
              className={`rounded-2xl border-2 border-dashed transition-all duration-200 flex items-center justify-center ${
                isPlaced
                  ? 'bg-amber-500/20 border-amber-400 shadow-glow text-white'
                  : isSelected
                  ? 'bg-amber-400/30 border-amber-300 ring-4 ring-amber-400/50 animate-pulse'
                  : 'bg-black/30 border-amber-500/30 hover:border-amber-400/60'
              }`}
            >
              {isPlaced ? (
                <div className="flex items-center gap-1.5 animate-in zoom-in-75">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[10px] font-black text-amber-200 uppercase">{item.name}</span>
                </div>
              ) : (
                <span className="text-[10px] text-amber-300/60 font-semibold">{item.name}</span>
              )}
            </button>
          );
        })}

        {/* Complete Celebration Overlay */}
        {isComplete && (
          <div className="absolute inset-x-4 top-1/3 bg-amber-950/95 border-2 border-amber-400 rounded-3xl p-5 text-center shadow-2xl backdrop-blur-md animate-in zoom-in-90 z-30">
            <span className="text-5xl animate-bounce">🏮</span>
            <h4 className="text-amber-300 font-black text-lg mt-1">MANDAP GLORIOUSLY DECORATED!</h4>
            <p className="text-xs text-amber-100 mt-1">All torans, diyas, and banners shine with sacred warmth.</p>
          </div>
        )}
      </div>

      {/* Decorative Items Tray */}
      <div className="w-full bg-amber-950/80 rounded-2xl p-3 border border-amber-500/30">
        <div className="text-[10px] uppercase font-bold text-amber-300/80 mb-2">
          Available Decorations (Tap item then tap slot)
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {DECOR_ITEMS.map(item => {
            const isPlaced = placedItemIds.includes(item.id);
            const isSelected = selectedItemId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center border transition active:scale-95 ${
                  isPlaced
                    ? 'bg-emerald-950/40 border-emerald-500/40 opacity-50'
                    : isSelected
                    ? 'bg-amber-500 text-amber-950 border-amber-200 ring-2 ring-amber-300 scale-105'
                    : 'bg-amber-900/60 hover:bg-amber-800/80 text-amber-100 border-amber-500/30'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[8px] font-bold text-center mt-1 leading-tight line-clamp-1">
                  {item.name.split(' ')[0]}
                </span>
                {isPlaced && <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
