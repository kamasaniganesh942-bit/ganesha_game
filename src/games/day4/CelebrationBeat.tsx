import React, { useState, useEffect } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { AnimatedButton } from '../../components/common/AnimatedButton';
import { ComboBadge } from '../../components/common/ComboBadge';

interface CelebrationBeatProps {
  onWin: (result: RewardResult) => void;
}

type BeatType = 'DHOL' | 'TAASHA' | 'CYMBAL';

const BEAT_CYCLES: BeatType[][] = [
  ['DHOL', 'TAASHA', 'DHOL'],
  ['TAASHA', 'TAASHA', 'CYMBAL', 'DHOL'],
  ['DHOL', 'TAASHA', 'CYMBAL', 'TAASHA', 'DHOL']
];

export const CelebrationBeat: React.FC<CelebrationBeatProps> = ({ onWin }) => {
  const [cycle, setCycle] = useState(0);
  const [playerSequence, setPlayerSequence] = useState<BeatType[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBeat, setActiveBeat] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const currentBeats = BEAT_CYCLES[cycle];

  useEffect(() => {
    playBeatShowcase(currentBeats);
  }, [cycle]);

  const playBeatShowcase = (beats: BeatType[]) => {
    setIsPlaying(true);
    setPlayerSequence([]);
    beats.forEach((b, i) => {
      setTimeout(() => {
        setActiveBeat(i);
        if (b === 'DHOL') soundManager.playDhol(true);
        else if (b === 'TAASHA') soundManager.playClick();
        else soundManager.playBell();

        setTimeout(() => setActiveBeat(null), 300);

        if (i === beats.length - 1) {
          setTimeout(() => setIsPlaying(false), 400);
        }
      }, (i + 1) * 550);
    });
  };

  const handleTap = (type: BeatType) => {
    if (isPlaying) return;

    if (type === 'DHOL') soundManager.playDhol(true);
    else if (type === 'TAASHA') soundManager.playClick();
    else soundManager.playBell();

    const nextSeq = [...playerSequence, type];
    setPlayerSequence(nextSeq);

    const stepIdx = nextSeq.length - 1;
    if (nextSeq[stepIdx] !== currentBeats[stepIdx]) {
      // Mistake!
      soundManager.playError();
      setCombo(0);
      setPlayerSequence([]);
      playBeatShowcase(currentBeats);
      return;
    }

    if (nextSeq.length === currentBeats.length) {
      soundManager.playCoin();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 80 * nextCombo);

      if (cycle + 1 >= BEAT_CYCLES.length) {
        soundManager.playFanfare();
        setTimeout(() => {
          onWin({
            performance: 'PERFECT',
            stars: 3,
            score: score + 250,
            tokens: 20
          });
        }, 500);
      } else {
        setTimeout(() => setCycle(c => c + 1), 500);
      }
    }
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">BEAT CADENCE: {cycle + 1} / {BEAT_CYCLES.length}</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Celebration Beat Canvas */}
      <div className="my-auto p-5 rounded-3xl bg-gradient-to-b from-[#261042] to-[#120722] border-2 border-amber-400 text-center shadow-2xl">
        <div className="text-xs font-black text-amber-300 uppercase tracking-wider mb-2">
          {isPlaying ? '🥁 LISTEN TO THE PROCESSION TAASHA ROLL...' : '👉 REPEAT THE CADENCE!'}
        </div>

        <div className="flex items-center justify-center gap-2 my-5">
          {currentBeats.map((b, i) => {
            const isBeadActive = activeBeat === i;
            const isDone = i < playerSequence.length;

            return (
              <div
                key={i}
                className={`px-3 py-2 rounded-2xl border-2 font-black text-xs transition-all duration-150 ${
                  isBeadActive
                    ? 'bg-amber-400 border-white text-slate-900 scale-110 shadow-[0_0_15px_#FFD700]'
                    : isDone
                    ? 'bg-emerald-600 border-emerald-300 text-white'
                    : 'bg-white/10 border-white/20 text-slate-400'
                }`}
              >
                {b}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Instruments */}
      <div className="grid grid-cols-3 gap-2">
        <button
          disabled={isPlaying}
          onClick={() => handleTap('DHOL')}
          className="py-3.5 rounded-2xl bg-gradient-to-t from-amber-700 to-orange-600 border border-amber-400 text-white font-black text-xs active:scale-95 shadow-lg"
        >
          🥁 DHOL
        </button>
        <button
          disabled={isPlaying}
          onClick={() => handleTap('TAASHA')}
          className="py-3.5 rounded-2xl bg-gradient-to-t from-yellow-600 to-amber-500 border border-yellow-300 text-slate-950 font-black text-xs active:scale-95 shadow-lg"
        >
          🪘 TAASHA
        </button>
        <button
          disabled={isPlaying}
          onClick={() => handleTap('CYMBAL')}
          className="py-3.5 rounded-2xl bg-gradient-to-t from-teal-700 to-teal-600 border border-teal-400 text-white font-black text-xs active:scale-95 shadow-lg"
        >
          🔔 CYMBAL
        </button>
      </div>
    </div>
  );
};
