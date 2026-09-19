import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface PujaPrepPuzzleProps {
  onWin: (result: RewardResult) => void;
}

interface PujaItem {
  id: string;
  name: string;
  icon: string;
  desc: string;
  slotPosition: { top: string; left: string };
}

const PUJA_ITEMS: PujaItem[] = [
  {
    id: 'diya',
    name: 'Ghee Diya',
    icon: '🪔',
    desc: 'Golden sacred flame lamp',
    slotPosition: { top: '24%', left: '50%' }
  },
  {
    id: 'kalash',
    name: 'Sacred Kalash',
    icon: '🏺',
    desc: 'Coconut & mango leaves pot',
    slotPosition: { top: '48%', left: '22%' }
  },
  {
    id: 'conch',
    name: 'Puja Shankha',
    icon: '🐚',
    desc: 'Auspicious white conch',
    slotPosition: { top: '48%', left: '78%' }
  },
  {
    id: 'bell',
    name: 'Brass Ghanti',
    icon: '🔔',
    desc: 'Melodious temple bell',
    slotPosition: { top: '74%', left: '32%' }
  },
  {
    id: 'modak',
    name: 'Prasad Modaks',
    icon: '🥟',
    desc: 'Lord Bappas favorite sweets',
    slotPosition: { top: '74%', left: '68%' }
  }
];

export const PujaPrepPuzzle: React.FC<PujaPrepPuzzleProps> = ({ onWin }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>('Select a sacred puja item below and place it on the brass thali!');

  const placedCount = placedIds.length;
  const isComplete = placedCount === PUJA_ITEMS.length;

  const handleSelectItem = (id: string) => {
    if (placedIds.includes(id)) {
      setPlacedIds(prev => prev.filter(i => i !== id));
      setSelectedId(id);
      soundManager.playClick();
      setFeedback('Pick a new slot for this item.');
      return;
    }
    soundManager.playClick();
    setSelectedId(id);
    const item = PUJA_ITEMS.find(p => p.id === id);
    setFeedback(`Selected ${item?.name}. Tap its matching outline on the altar thali!`);
  };

  const handleSlotClick = (slotId: string) => {
    if (!selectedId) {
      if (placedIds.includes(slotId)) {
        setPlacedIds(prev => prev.filter(i => i !== slotId));
        setSelectedId(slotId);
        soundManager.playClick();
        return;
      }
      setFeedback('Tap an item from the tray first!');
      soundManager.playError();
      return;
    }

    if (selectedId === slotId) {
      soundManager.playBell();
      const updated = [...placedIds, slotId];
      setPlacedIds(updated);
      setSelectedId(null);
      setFeedback('Auspicious placement!');

      if (updated.length === PUJA_ITEMS.length) {
        soundManager.playFanfare();
        setFeedback('Maha Puja Thali completely prepared!');
        setTimeout(() => {
          onWin({
            performance: 'PERFECT',
            stars: 3,
            score: 240,
            tokens: 20
          });
        }, 1800);
      }
    } else {
      soundManager.playError();
      setFeedback('Check the sacred thali outline for this item!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-4 select-none">
      {/* Top Banner */}
      <div className="w-full bg-amber-950/80 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-amber-300 font-black text-xs tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            PUJA PREPARATION PUZZLE
          </h3>
          <p className="text-[11px] text-amber-100/70">Arrange sacred items on the brass thali</p>
        </div>

        <div className="bg-amber-900/80 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
          <span className="text-[10px] text-amber-300/80 block uppercase font-bold">Placed</span>
          <span className="text-base font-black text-amber-300">{placedCount} / 5</span>
        </div>
      </div>

      {/* Guidance Prompt */}
      <div className="w-full mt-2 bg-amber-950/60 rounded-xl py-1 px-3 border border-amber-600/30 text-center text-xs text-amber-200 font-medium">
        {feedback}
      </div>

      {/* Brass Ritual Puja Thali Canvas */}
      <div className="relative w-full aspect-square my-auto bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950 rounded-3xl border-2 border-amber-500/40 p-4 flex items-center justify-center shadow-2xl overflow-hidden">
        {/* Large Circular Brass Thali */}
        <div className="relative w-72 h-72 rounded-full bg-gradient-to-br from-amber-600/40 via-amber-800/60 to-yellow-600/30 border-4 border-amber-400 shadow-2xl flex items-center justify-center">
          {/* Engraved Mandala Ring */}
          <div className="absolute inset-4 rounded-full border-2 border-dashed border-amber-300/40 pointer-events-none" />
          <div className="text-3xl opacity-20 pointer-events-none">ॐ</div>

          {/* 5 Sacred Slots */}
          {PUJA_ITEMS.map(item => {
            const isPlaced = placedIds.includes(item.id);
            const isSelected = selectedId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSlotClick(item.id)}
                style={{
                  position: 'absolute',
                  top: item.slotPosition.top,
                  left: item.slotPosition.left,
                  transform: 'translate(-50%, -50%)'
                }}
                className={`w-14 h-14 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                  isPlaced
                    ? 'bg-amber-500/30 border-amber-300 shadow-glow text-white'
                    : isSelected
                    ? 'bg-amber-400/30 border-amber-200 ring-4 ring-amber-400/50 animate-pulse'
                    : 'bg-black/40 border-amber-500/40 hover:border-amber-300'
                }`}
              >
                {isPlaced ? (
                  <div className="flex flex-col items-center animate-in zoom-in-75">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-[7px] font-black uppercase text-amber-200">{item.name.split(' ')[0]}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center opacity-60">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[7px] font-bold text-amber-300">{item.name.split(' ')[0]}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Success Overlay */}
        {isComplete && (
          <div className="absolute inset-4 bg-amber-950/95 border-2 border-amber-400 rounded-3xl p-5 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-md animate-in zoom-in-90 z-30">
            <span className="text-5xl animate-bounce">🕯️</span>
            <h4 className="text-amber-300 font-black text-lg mt-2">PUJA THALI IS CONSECRATED!</h4>
            <p className="text-xs text-amber-100 mt-1">All sacred items rest in perfect harmony on the brass altar.</p>
          </div>
        )}
      </div>

      {/* Puja Items Tray */}
      <div className="w-full bg-amber-950/80 rounded-2xl p-3 border border-amber-500/30">
        <div className="text-[10px] uppercase font-bold text-amber-300/80 mb-2">
          Sacred Puja Items (Tap item then tap slot)
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {PUJA_ITEMS.map(item => {
            const isPlaced = placedIds.includes(item.id);
            const isSelected = selectedId === item.id;

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
