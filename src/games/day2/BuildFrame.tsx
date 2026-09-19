import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';
import { Check } from 'lucide-react';

interface BuildFrameProps {
  onWin: (result: RewardResult) => void;
}

interface FramePiece {
  id: string;
  name: string;
  icon: string;
  slot: string;
  placed: boolean;
}

export const BuildFrame: React.FC<BuildFrameProps> = ({ onWin }) => {
  const [pieces, setPieces] = useState<FramePiece[]>([
    { id: 'left-pillar', name: 'Left Bamboo Pillar', icon: '🪵', slot: 'left', placed: false },
    { id: 'right-pillar', name: 'Right Bamboo Pillar', icon: '🪵', slot: 'right', placed: false },
    { id: 'top-beam', name: 'Top Cross Beam', icon: '🌲', slot: 'top', placed: false },
    { id: 'base-beam', name: 'Base Timber Platform', icon: '🧱', slot: 'base', placed: false }
  ]);
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);

  const handleSlotClick = (slot: string) => {
    if (!selectedPieceId) return;

    const piece = pieces.find(p => p.id === selectedPieceId);
    if (!piece) return;

    if (piece.slot === slot) {
      // Snapped into place!
      soundManager.playDhol(true);
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 100 * nextCombo);

      const nextPieces = pieces.map(p => p.id === selectedPieceId ? { ...p, placed: true } : p);
      setPieces(nextPieces);
      setSelectedPieceId(null);

      if (nextPieces.every(p => p.placed)) {
        setTimeout(() => {
          soundManager.playFanfare();
          onWin({
            performance: 'PERFECT',
            stars: 3,
            score: score + 250,
            tokens: 20
          });
        }, 500);
      }
    } else {
      soundManager.playError();
      setCombo(0);
    }
  };

  const selectedPiece = pieces.find(p => p.id === selectedPieceId);

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">
          PLACED: {pieces.filter(p => p.placed).length} / 4
        </div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Mandap Blueprint Blueprint Frame */}
      <div className="relative w-full max-w-[280px] h-[240px] mx-auto my-auto bg-black/40 rounded-3xl border-2 border-dashed border-amber-400/50 p-3 flex flex-col justify-between shadow-2xl">
        {/* Top Beam Slot */}
        <div
          onClick={() => handleSlotClick('top')}
          className={`h-9 w-full rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all ${
            pieces.find(p => p.slot === 'top')?.placed
              ? 'bg-amber-600 border-amber-300 text-white font-black shadow-md'
              : selectedPiece?.slot === 'top'
              ? 'border-yellow-300 bg-yellow-400/20 animate-pulse'
              : 'border-white/20 bg-white/5 hover:bg-white/10'
          }`}
        >
          {pieces.find(p => p.slot === 'top')?.placed ? '🌲 TOP CROSS BEAM' : 'Outline: Top Beam'}
        </div>

        {/* Middle Area: Left & Right Pillars */}
        <div className="flex justify-between flex-1 py-2">
          {/* Left Pillar Slot */}
          <div
            onClick={() => handleSlotClick('left')}
            className={`w-14 h-full rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all text-center text-[10px] p-1 ${
              pieces.find(p => p.slot === 'left')?.placed
                ? 'bg-amber-700 border-amber-400 text-white font-bold shadow-md'
                : selectedPiece?.slot === 'left'
                ? 'border-yellow-300 bg-yellow-400/20 animate-pulse'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
          >
            {pieces.find(p => p.slot === 'left')?.placed ? '🪵 PILLAR' : 'Left Pillar'}
          </div>

          {/* Center Pandal Sanctum Preview */}
          <div className="flex-1 flex items-center justify-center text-4xl opacity-20 pointer-events-none">
            🎪
          </div>

          {/* Right Pillar Slot */}
          <div
            onClick={() => handleSlotClick('right')}
            className={`w-14 h-full rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all text-center text-[10px] p-1 ${
              pieces.find(p => p.slot === 'right')?.placed
                ? 'bg-amber-700 border-amber-400 text-white font-bold shadow-md'
                : selectedPiece?.slot === 'right'
                ? 'border-yellow-300 bg-yellow-400/20 animate-pulse'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
          >
            {pieces.find(p => p.slot === 'right')?.placed ? '🪵 PILLAR' : 'Right Pillar'}
          </div>
        </div>

        {/* Base Platform Slot */}
        <div
          onClick={() => handleSlotClick('base')}
          className={`h-9 w-full rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all ${
            pieces.find(p => p.slot === 'base')?.placed
              ? 'bg-amber-800 border-amber-400 text-white font-black shadow-md'
              : selectedPiece?.slot === 'base'
              ? 'border-yellow-300 bg-yellow-400/20 animate-pulse'
              : 'border-white/20 bg-white/5 hover:bg-white/10'
          }`}
        >
          {pieces.find(p => p.slot === 'base')?.placed ? '🧱 BASE PLATFORM' : 'Outline: Base Platform'}
        </div>
      </div>

      {/* Piece Selector Tray */}
      <div className="bg-black/30 p-2.5 rounded-2xl border border-white/10">
        <div className="text-[11px] font-bold text-slate-300 mb-1.5 text-center">
          Tap a timber piece below, then tap its matching outline above:
        </div>
        <div className="grid grid-cols-4 gap-2">
          {pieces.map((piece) => (
            <button
              key={piece.id}
              disabled={piece.placed}
              onClick={() => {
                soundManager.playClick();
                setSelectedPieceId(piece.id);
              }}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                piece.placed
                  ? 'bg-emerald-950/40 border-emerald-500/40 opacity-40 cursor-not-allowed'
                  : selectedPieceId === piece.id
                  ? 'bg-amber-500/30 border-amber-400 scale-105 shadow-md shadow-amber-500/40'
                  : 'bg-white/10 border-white/15 hover:bg-white/20'
              }`}
            >
              <span className="text-xl">{piece.placed ? <Check className="w-5 h-5 text-emerald-400" /> : piece.icon}</span>
              <span className="text-[10px] font-bold text-white mt-1 truncate w-full text-center">
                {piece.slot.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
