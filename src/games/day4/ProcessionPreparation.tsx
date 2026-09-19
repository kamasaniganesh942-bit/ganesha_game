import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { useGame } from '../../state/GameContext';
import { GaneshaIdol } from '../../components/common/GaneshaIdol';

interface ProcessionPreparationProps {
  onWin: (result: RewardResult) => void;
}

interface CartItem {
  id: string;
  name: string;
  icon: string;
  desc: string;
  slotPos: { top: string; left: string };
}

const CART_ITEMS: CartItem[] = [
  {
    id: 'chhatri',
    name: 'Golden Velvet Chhatri',
    icon: '☂️',
    desc: 'Ceremonial umbrella shading Lord Ganesha',
    slotPos: { top: '16%', left: '50%' }
  },
  {
    id: 'flag',
    name: 'Morya Saffron Flag',
    icon: '🚩',
    desc: 'Royal pennant fluttering on the cart mast',
    slotPos: { top: '24%', left: '80%' }
  },
  {
    id: 'garland',
    name: 'Marigold Cart Garlands',
    icon: '🌸',
    desc: 'Heavy fragrant floral ropes around cart rails',
    slotPos: { top: '56%', left: '50%' }
  },
  {
    id: 'lamps',
    name: 'Procession Brass Lamps',
    icon: '🪔',
    desc: 'Twin glowing torches lighting the road ahead',
    slotPos: { top: '72%', left: '24%' }
  }
];

export const ProcessionPreparation: React.FC<ProcessionPreparationProps> = ({ onWin }) => {
  const { state } = useGame();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>('Select an ornament below to stage the Grand Chariot!');

  const placedCount = placedIds.length;
  const isComplete = placedCount === CART_ITEMS.length;

  const handleSelectItem = (id: string) => {
    if (placedIds.includes(id)) {
      setPlacedIds(prev => prev.filter(i => i !== id));
      setSelectedId(id);
      soundManager.playClick();
      setFeedback('Repositioning item.');
      return;
    }
    soundManager.playClick();
    setSelectedId(id);
    const item = CART_ITEMS.find(i => i.id === id);
    setFeedback(`Selected ${item?.name}. Tap its mounting slot on the Rath Chariot!`);
  };

  const handleSlotClick = (slotId: string) => {
    if (!selectedId) {
      if (placedIds.includes(slotId)) {
        setPlacedIds(prev => prev.filter(i => i !== slotId));
        setSelectedId(slotId);
        soundManager.playClick();
        return;
      }
      setFeedback('Select a decoration item from the dock first!');
      soundManager.playError();
      return;
    }

    if (selectedId === slotId) {
      soundManager.playDhol();
      soundManager.playBell();
      const updated = [...placedIds, slotId];
      setPlacedIds(updated);
      setSelectedId(null);
      setFeedback('Mounted securely on the Rath!');

      if (updated.length === CART_ITEMS.length) {
        soundManager.playFanfare();
        setFeedback('The Grand Procession Chariot is ready to roll!');
        setTimeout(() => {
          onWin({
            performance: 'PERFECT',
            stars: 3,
            score: 250,
            tokens: 25
          });
        }, 1800);
      }
    } else {
      soundManager.playError();
      setFeedback('That ornament belongs in another mounting spot!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-4 select-none">
      {/* Top Banner */}
      <div className="w-full bg-amber-950/80 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-amber-300 font-black text-xs tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            PROCESSION CHARIOT STAGING
          </h3>
          <p className="text-[11px] text-amber-100/70">Stage the Rath before departure to the lake</p>
        </div>

        <div className="bg-amber-900/80 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
          <span className="text-[10px] text-amber-300/80 block uppercase font-bold">Staged</span>
          <span className="text-base font-black text-amber-300">{placedCount} / 4</span>
        </div>
      </div>

      {/* Guidance */}
      <div className="w-full mt-2 bg-amber-950/60 rounded-xl py-1 px-3 border border-amber-600/30 text-center text-xs text-amber-200 font-medium">
        {feedback}
      </div>

      {/* Grand Chariot Canvas */}
      <div className="relative w-full aspect-[4/5] my-auto bg-gradient-to-b from-amber-950 via-stone-900 to-amber-950 rounded-3xl border-2 border-amber-500/40 p-4 shadow-2xl overflow-hidden">
        {/* Festive Courtyard Backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-full flex justify-between px-8">
            <div className="w-0.5 h-full border-r-2 border-dashed border-amber-400" />
            <div className="w-0.5 h-full border-r-2 border-dashed border-amber-400" />
          </div>
        </div>

        {/* Chariot Rath Centerpiece */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-72 flex flex-col items-center justify-center">
          {/* Lord Ganesha on Rath Throne */}
          <div className="relative -mb-3 z-10 animate-bounce flex items-center justify-center">
            <GaneshaIdol
              size={115}
              type={state.selectedIdol || 'grand'}
              showHalo={true}
              showThrone={false}
              animated={true}
            />
          </div>

          {/* Wooden Rath Cart Frame */}
          <div className="w-48 h-28 bg-gradient-to-b from-amber-700 to-amber-900 border-4 border-amber-400 rounded-2xl shadow-2xl flex items-center justify-center relative mt-1">
            <span className="text-xs font-black text-amber-200 tracking-widest uppercase">
              MORYA RATH
            </span>

            {/* Giant Chariot Wheels */}
            <div className="absolute -bottom-6 -left-4 w-14 h-14 rounded-full bg-amber-950 border-4 border-amber-400 flex items-center justify-center text-base shadow-xl">
              ⚙️
            </div>
            <div className="absolute -bottom-6 -right-4 w-14 h-14 rounded-full bg-amber-950 border-4 border-amber-400 flex items-center justify-center text-base shadow-xl">
              ⚙️
            </div>
          </div>
        </div>

        {/* 4 Interactive Mounting Slots */}
        {CART_ITEMS.map(item => {
          const isPlaced = placedIds.includes(item.id);
          const isSelected = selectedId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSlotClick(item.id)}
              style={{
                position: 'absolute',
                top: item.slotPos.top,
                left: item.slotPos.left,
                transform: 'translate(-50%, -50%)'
              }}
              className={`rounded-2xl border-2 border-dashed p-2 flex flex-col items-center justify-center transition-all z-20 ${
                isPlaced
                  ? 'bg-amber-500/30 border-amber-300 shadow-glow text-white'
                  : isSelected
                  ? 'bg-amber-400/30 border-amber-200 ring-4 ring-amber-400/50 animate-pulse'
                  : 'bg-black/40 border-amber-500/30 hover:border-amber-400'
              }`}
            >
              {isPlaced ? (
                <div className="flex flex-col items-center animate-in zoom-in-75">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-[8px] font-black text-amber-200 uppercase mt-0.5">{item.name.split(' ')[0]}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center opacity-60">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[7px] font-bold text-amber-300">{item.name.split(' ')[0]}</span>
                </div>
              )}
            </button>
          );
        })}

        {/* Complete Dialog */}
        {isComplete && (
          <div className="absolute inset-4 bg-amber-950/95 border-2 border-amber-400 rounded-3xl p-5 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-md animate-in zoom-in-90 z-30">
            <span className="text-5xl animate-bounce">🏮</span>
            <h4 className="text-amber-300 font-black text-lg mt-2">CHARIOT READY TO DEPART!</h4>
            <p className="text-xs text-amber-100 mt-1">
              Devotees pull the golden ropes. The Grand Procession begins!
            </p>
          </div>
        )}
      </div>

      {/* Dock of Ornaments */}
      <div className="w-full bg-amber-950/80 rounded-2xl p-3 border border-amber-500/30">
        <div className="text-[10px] uppercase font-bold text-amber-300/80 mb-2">
          Rath Ornaments (Tap item then tap slot)
        </div>
        <div className="grid grid-cols-4 gap-2">
          {CART_ITEMS.map(item => {
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
