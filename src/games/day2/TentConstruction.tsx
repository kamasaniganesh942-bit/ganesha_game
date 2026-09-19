import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface TentConstructionProps {
  onWin: (result: RewardResult) => void;
}

interface Piece {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

const PIECES: Piece[] = [
  { id: 'platform', name: 'Teak Wooden Platform', icon: '🪵', desc: 'Solid raised base for Lord Ganesha' },
  { id: 'pillars', name: 'Carved Royal Pillars', icon: '🏛️', desc: 'Twin supportive decorated columns' },
  { id: 'roof', name: 'Gilded Temple Roof', icon: '⛺', desc: 'Traditional Kalash-crested canopy frame' },
  { id: 'canopy', name: 'Saffron Silk Drapes', icon: '🏮', desc: 'Auspicious celebratory fabric curtain' }
];

export const TentConstruction: React.FC<TentConstructionProps> = ({ onWin }) => {
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [placedPieceIds, setPlacedPieceIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>('Select a structural piece from below to assemble!');

  const isComplete = placedPieceIds.length === PIECES.length;

  const handlePieceSelect = (id: string) => {
    if (placedPieceIds.includes(id)) return;
    soundManager.playClick();
    setSelectedPieceId(id);
    const piece = PIECES.find(p => p.id === id);
    setFeedback(`Now tap the designated blueprint slot for the ${piece?.name}!`);
  };

  const handleSlotClick = (slotId: string) => {
    if (!selectedPieceId) {
      setFeedback('Select a piece from the tray below first!');
      soundManager.playError();
      return;
    }

    if (selectedPieceId === slotId) {
      soundManager.playDhol();
      soundManager.playBell();
      const updated = [...placedPieceIds, slotId];
      setPlacedPieceIds(updated);
      setSelectedPieceId(null);
      setFeedback('Sturdy fit! What part goes next?');

      if (updated.length === PIECES.length) {
        soundManager.playFanfare();
        setFeedback('Mandap tent successfully constructed!');
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
      setFeedback('That piece does not fit in this slot. Check the blueprint matching shape!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-4 select-none">
      {/* Top Banner */}
      <div className="w-full bg-amber-950/80 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-amber-300 font-black text-xs tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            TENT CONSTRUCTION
          </h3>
          <p className="text-[11px] text-amber-100/70">Assemble the neighborhood pandal structure</p>
        </div>

        <div className="bg-amber-900/80 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
          <span className="text-[10px] text-amber-300/80 block uppercase font-bold">Progress</span>
          <span className="text-base font-black text-amber-300">{placedPieceIds.length} / 4</span>
        </div>
      </div>

      {/* Blueprint Canvas */}
      <div className="relative w-full aspect-[4/5] my-auto bg-gradient-to-b from-blue-950 via-indigo-950 to-slate-950 rounded-3xl border-2 border-amber-500/40 p-4 flex flex-col items-center justify-between shadow-2xl overflow-hidden">
        {/* Blueprint grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

        {/* Status Prompt */}
        <div className="z-10 w-full text-center py-1.5 px-3 bg-amber-950/60 rounded-xl border border-amber-500/30 text-xs text-amber-200 font-medium">
          {feedback}
        </div>

        {/* Blueprint Assembly Area */}
        <div className="relative w-full flex-1 flex flex-col items-center justify-center my-2">
          {/* 1. Roof Arch Slot */}
          <button
            onClick={() => handleSlotClick('roof')}
            className={`w-64 h-24 rounded-t-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center relative ${
              placedPieceIds.includes('roof')
                ? 'bg-amber-600/50 border-amber-300 shadow-lg text-white'
                : selectedPieceId === 'roof'
                ? 'border-amber-400 bg-amber-400/20 animate-pulse ring-4 ring-amber-400/40'
                : 'border-sky-400/50 bg-sky-950/40 text-sky-300/60'
            }`}
          >
            {placedPieceIds.includes('roof') ? (
              <div className="flex flex-col items-center">
                <span className="text-4xl">⛺</span>
                <span className="text-[10px] font-black tracking-widest text-amber-200 uppercase">Gilded Roof Arch</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-xl">⛺</span>
                <span className="text-[10px] font-bold">1. Tap Roof Slot</span>
              </div>
            )}
          </button>

          {/* 2. Canopy Drapes & Pillars Middle Layer */}
          <div className="w-64 h-36 flex items-center justify-between relative px-2">
            {/* Canopy Curtain Backing */}
            <button
              onClick={() => handleSlotClick('canopy')}
              className={`absolute inset-x-8 inset-y-2 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center z-0 ${
                placedPieceIds.includes('canopy')
                  ? 'bg-orange-600/40 border-orange-400 shadow-md text-white'
                  : selectedPieceId === 'canopy'
                  ? 'border-amber-400 bg-amber-400/20 animate-pulse ring-4 ring-amber-400/40'
                  : 'border-sky-400/50 bg-sky-950/30 text-sky-300/60'
              }`}
            >
              {placedPieceIds.includes('canopy') ? (
                <div className="flex flex-col items-center">
                  <span className="text-3xl">🏮</span>
                  <span className="text-[10px] font-black text-amber-200">Silk Drapes</span>
                </div>
              ) : (
                <span className="text-[10px] font-bold">2. Tap Canopy Slot</span>
              )}
            </button>

            {/* Twin Pillars */}
            <button
              onClick={() => handleSlotClick('pillars')}
              className={`w-12 h-32 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center z-10 ${
                placedPieceIds.includes('pillars')
                  ? 'bg-amber-700/60 border-amber-400 text-white'
                  : selectedPieceId === 'pillars'
                  ? 'border-amber-400 bg-amber-400/20 animate-pulse ring-4 ring-amber-400/40'
                  : 'border-sky-400/50 bg-sky-950/40 text-sky-300/60'
              }`}
            >
              {placedPieceIds.includes('pillars') ? (
                <span className="text-2xl">🏛️</span>
              ) : (
                <span className="text-[9px] text-center font-bold">Pillar L</span>
              )}
            </button>

            <button
              onClick={() => handleSlotClick('pillars')}
              className={`w-12 h-32 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center z-10 ${
                placedPieceIds.includes('pillars')
                  ? 'bg-amber-700/60 border-amber-400 text-white'
                  : selectedPieceId === 'pillars'
                  ? 'border-amber-400 bg-amber-400/20 animate-pulse ring-4 ring-amber-400/40'
                  : 'border-sky-400/50 bg-sky-950/40 text-sky-300/60'
              }`}
            >
              {placedPieceIds.includes('pillars') ? (
                <span className="text-2xl">🏛️</span>
              ) : (
                <span className="text-[9px] text-center font-bold">Pillar R</span>
              )}
            </button>
          </div>

          {/* 3. Base Platform Slot */}
          <button
            onClick={() => handleSlotClick('platform')}
            className={`w-72 h-14 rounded-b-2xl border-2 border-dashed transition-all flex items-center justify-center gap-2 ${
              placedPieceIds.includes('platform')
                ? 'bg-amber-800/80 border-amber-400 text-white shadow-xl'
                : selectedPieceId === 'platform'
                ? 'border-amber-400 bg-amber-400/20 animate-pulse ring-4 ring-amber-400/40'
                : 'border-sky-400/50 bg-sky-950/40 text-sky-300/60'
            }`}
          >
            {placedPieceIds.includes('platform') ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl">🪵</span>
                <span className="text-xs font-black text-amber-200">Solid Teakwood Platform</span>
              </div>
            ) : (
              <span className="text-[10px] font-bold">4. Tap Platform Slot</span>
            )}
          </button>
        </div>

        {/* Celebration Overlay on Full Build */}
        {isComplete && (
          <div className="absolute inset-x-6 top-1/3 bg-amber-950/90 border-2 border-amber-400 rounded-2xl p-4 text-center shadow-2xl backdrop-blur-md animate-in zoom-in-95 z-30">
            <span className="text-4xl animate-bounce">🎪</span>
            <h4 className="text-amber-300 font-black text-base mt-1">MANDAP FRAME READY!</h4>
            <p className="text-xs text-amber-100 mt-1">The grand tent structure stands proud and sturdy.</p>
          </div>
        )}
      </div>

      {/* Piece Selection Tray */}
      <div className="w-full bg-amber-950/80 rounded-2xl p-3 border border-amber-500/30">
        <div className="text-[10px] uppercase font-bold text-amber-300/80 mb-2">
          Available Structural Parts (Tap to select)
        </div>
        <div className="grid grid-cols-4 gap-2">
          {PIECES.map(piece => {
            const isPlaced = placedPieceIds.includes(piece.id);
            const isSelected = selectedPieceId === piece.id;

            return (
              <button
                key={piece.id}
                onClick={() => handlePieceSelect(piece.id)}
                disabled={isPlaced}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center border transition active:scale-95 ${
                  isPlaced
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400/60 opacity-60'
                    : isSelected
                    ? 'bg-amber-500 text-amber-950 border-amber-200 ring-2 ring-amber-300 scale-105'
                    : 'bg-amber-900/60 hover:bg-amber-800/80 text-amber-100 border-amber-500/30'
                }`}
              >
                <span className="text-2xl">{piece.icon}</span>
                <span className="text-[9px] font-bold text-center mt-1 leading-tight line-clamp-1">
                  {piece.name.split(' ')[0]}
                </span>
                {isPlaced && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
