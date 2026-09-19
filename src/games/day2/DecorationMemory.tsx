import React, { useState, useEffect } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';

interface DecorationMemoryProps {
  onWin: (result: RewardResult) => void;
}

const MOTIFS = [
  { id: 'flower', icon: '🌸', name: 'Flower' },
  { id: 'diya', icon: '🪔', name: 'Diya' },
  { id: 'light', icon: '💡', name: 'Light' },
  { id: 'banner', icon: '🏮', name: 'Banner' }
];

export const DecorationMemory: React.FC<DecorationMemoryProps> = ({ onWin }) => {
  const [level, setLevel] = useState(1); // 1 to 3
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeFlashId, setActiveFlashId] = useState<string | null>(null);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);

  // Generate sequence for current level
  useEffect(() => {
    const length = level + 2; // Level 1 = 3 items, Level 2 = 4 items, Level 3 = 5 items
    const newSeq: string[] = [];
    for (let i = 0; i < length; i++) {
      const randomMotif = MOTIFS[Math.floor(Math.random() * MOTIFS.length)].id;
      newSeq.push(randomMotif);
    }
    setSequence(newSeq);
    setPlayerInput([]);

    // Playback sequence
    playSequence(newSeq);
  }, [level]);

  const playSequence = (seq: string[]) => {
    setIsShowingSequence(true);
    seq.forEach((id, index) => {
      setTimeout(() => {
        setActiveFlashId(id);
        soundManager.playBell();
        setTimeout(() => setActiveFlashId(null), 450);

        if (index === seq.length - 1) {
          setTimeout(() => setIsShowingSequence(false), 550);
        }
      }, (index + 1) * 700);
    });
  };

  const handlePlayerTap = (id: string) => {
    if (isShowingSequence) return;
    soundManager.playClick();

    const nextInput = [...playerInput, id];
    setPlayerInput(nextInput);

    const currentStepIdx = nextInput.length - 1;
    if (nextInput[currentStepIdx] !== sequence[currentStepIdx]) {
      // Wrong!
      soundManager.playError();
      setCombo(0);
      setPlayerInput([]);
      playSequence(sequence); // Replay sequence
      return;
    }

    // Correct step
    if (nextInput.length === sequence.length) {
      // Level cleared!
      soundManager.playCoin();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 100 * nextCombo);

      if (level >= 3) {
        // Complete game!
        soundManager.playFanfare();
        setTimeout(() => {
          onWin({
            performance: 'PERFECT',
            stars: 3,
            score: score + 300,
            tokens: 20
          });
        }, 500);
      } else {
        setTimeout(() => setLevel(l => l + 1), 600);
      }
    }
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">ROUND: {level} / 3</div>
        <div className="text-emerald-400">SCORE: {score}</div>
        <div className="text-pink-300">
          STEPS: {playerInput.length} / {sequence.length}
        </div>
      </div>

      {/* Status Alert */}
      <div className="text-center my-2">
        {isShowingSequence ? (
          <span className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black animate-pulse">
            👀 WATCH THE SEQUENCE...
          </span>
        ) : (
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black">
            👉 YOUR TURN TO REPEAT!
          </span>
        )}
      </div>

      {/* 4 Interactive Motif Pads */}
      <div className="grid grid-cols-2 gap-3.5 my-auto max-w-[280px] mx-auto w-full">
        {MOTIFS.map((motif) => {
          const isFlashing = activeFlashId === motif.id;

          return (
            <button
              key={motif.id}
              disabled={isShowingSequence}
              onClick={() => handlePlayerTap(motif.id)}
              className={`aspect-square rounded-3xl border-2 flex flex-col items-center justify-center transition-all duration-150 active:scale-95 shadow-xl ${
                isFlashing
                  ? 'bg-amber-400 border-yellow-200 scale-110 shadow-[0_0_25px_#FFD700]'
                  : 'bg-[#220F3A] border-white/15 hover:border-amber-400/50'
              }`}
            >
              <span className="text-4xl">{motif.icon}</span>
              <span className="text-xs font-bold text-white mt-2">{motif.name}</span>
            </button>
          );
        })}
      </div>

      <div className="text-center text-xs text-amber-200 font-medium">
        🧠 Watch the flashing sequence carefully and tap the items in exact order!
      </div>
    </div>
  );
};
