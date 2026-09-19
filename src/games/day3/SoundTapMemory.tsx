import React, { useState, useEffect } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { AnimatedButton } from '../../components/common/AnimatedButton';
import { ComboBadge } from '../../components/common/ComboBadge';

interface SoundTapMemoryProps {
  onWin: (result: RewardResult) => void;
}

// Beats: 'Dha' (deep hit), 'Ta' (sharp bell/tap)
const CYCLES = [
  ['Dha', 'Dha', 'Ta', 'Dha'],
  ['Ta', 'Dha', 'Ta', 'Ta', 'Dha'],
  ['Dha', 'Ta', 'Dha', 'Dha', 'Ta', 'Dha']
];

export const SoundTapMemory: React.FC<SoundTapMemoryProps> = ({ onWin }) => {
  const [cycleIdx, setCycleIdx] = useState(0);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBeat, setActiveBeat] = useState<number | null>(null);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);

  const currentSequence = CYCLES[cycleIdx];

  useEffect(() => {
    playBeatSequence(currentSequence);
  }, [cycleIdx]);

  const playBeatSequence = (seq: string[]) => {
    setIsPlaying(true);
    setPlayerInput([]);
    seq.forEach((beat, i) => {
      setTimeout(() => {
        setActiveBeat(i);
        if (beat === 'Dha') soundManager.playDhol(true);
        else soundManager.playBell();

        setTimeout(() => setActiveBeat(null), 300);

        if (i === seq.length - 1) {
          setTimeout(() => setIsPlaying(false), 450);
        }
      }, (i + 1) * 600);
    });
  };

  const handleTap = (type: 'Dha' | 'Ta') => {
    if (isPlaying) return;

    if (type === 'Dha') soundManager.playDhol(true);
    else soundManager.playBell();

    const nextInput = [...playerInput, type];
    setPlayerInput(nextInput);

    const stepIdx = nextInput.length - 1;
    if (nextInput[stepIdx] !== currentSequence[stepIdx]) {
      // Mistake!
      soundManager.playError();
      setCombo(0);
      setPlayerInput([]);
      playBeatSequence(currentSequence);
      return;
    }

    if (nextInput.length === currentSequence.length) {
      // Cycle complete!
      soundManager.playCoin();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 100 * nextCombo);

      if (cycleIdx + 1 >= CYCLES.length) {
        soundManager.playFanfare();
        setTimeout(() => {
          onWin({
            performance: 'PERFECT',
            stars: 3,
            score: score + 300,
            tokens: 25
          });
        }, 500);
      } else {
        setTimeout(() => setCycleIdx(c => c + 1), 600);
      }
    }
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">TALAM BEAT: {cycleIdx + 1} / {CYCLES.length}</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Visual Sequence Beads */}
      <div className="my-auto p-5 rounded-3xl bg-gradient-to-b from-[#261142] to-[#120722] border-2 border-amber-400 text-center shadow-2xl">
        <div className="text-xs font-black text-amber-300 uppercase tracking-wider mb-2">
          {isPlaying ? '🎧 LISTEN TO THE DEVOTIONAL TALAM BEATS...' : '👉 REPEAT THE TALAM RHYTHM!'}
        </div>

        {/* Beads */}
        <div className="flex items-center justify-center gap-2 my-5">
          {currentSequence.map((beat, i) => {
            const isBeadActive = activeBeat === i;
            const isPlayerDone = i < playerInput.length;

            return (
              <div
                key={i}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-black text-xs transition-all duration-150 ${
                  isBeadActive
                    ? 'bg-amber-400 border-yellow-100 text-slate-900 scale-125 shadow-[0_0_15px_#FFD700]'
                    : isPlayerDone
                    ? 'bg-emerald-600 border-emerald-300 text-white'
                    : 'bg-white/10 border-white/20 text-slate-400'
                }`}
              >
                {beat === 'Dha' ? '●' : '○'}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-amber-200">
          ● = Dha (Drum Bass) | ○ = Ta (Bell Chime)
        </p>
      </div>

      {/* 2 Big Action Rhythm Pads */}
      <div className="grid grid-cols-2 gap-3">
        <AnimatedButton
          variant="gold"
          size="lg"
          disabled={isPlaying}
          soundType="dhol"
          onClick={() => handleTap('Dha')}
        >
          ● DHA (BASS)
        </AnimatedButton>

        <AnimatedButton
          variant="secondary"
          size="lg"
          disabled={isPlaying}
          soundType="bell"
          onClick={() => handleTap('Ta')}
        >
          ○ TA (BELL)
        </AnimatedButton>
      </div>
    </div>
  );
};
