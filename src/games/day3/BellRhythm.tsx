import React, { useState, useEffect } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { AnimatedButton } from '../../components/common/AnimatedButton';
import { ComboBadge } from '../../components/common/ComboBadge';
import { Bell } from 'lucide-react';

interface BellRhythmProps {
  onWin: (result: RewardResult) => void;
}

const RHYTHMS = [
  { prompt: 'TAP • TAP • TAP', beats: ['TAP', 'TAP', 'TAP'] },
  { prompt: 'TAP • TAP • PAUSE • TAP', beats: ['TAP', 'TAP', 'PAUSE', 'TAP'] },
  { prompt: 'TAP • PAUSE • TAP • TAP', beats: ['TAP', 'PAUSE', 'TAP', 'TAP'] }
];

export const BellRhythm: React.FC<BellRhythmProps> = ({ onWin }) => {
  const [level, setLevel] = useState(0);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isRinging, setIsRinging] = useState(false);

  const currentRhythm = RHYTHMS[level];

  const handleAction = (action: 'TAP' | 'PAUSE') => {
    if (action === 'TAP') {
      soundManager.playBell();
      setIsRinging(true);
      setTimeout(() => setIsRinging(false), 250);
    } else {
      soundManager.playClick();
    }

    if (action === currentRhythm.beats[playerIndex]) {
      // Correct beat
      const nextIndex = playerIndex + 1;
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 60 * nextCombo);

      if (nextIndex >= currentRhythm.beats.length) {
        // Level passed
        if (level + 1 >= RHYTHMS.length) {
          soundManager.playFanfare();
          setTimeout(() => {
            onWin({
              performance: 'PERFECT',
              stars: 3,
              score: score + 250,
              tokens: 20
            });
          }, 400);
        } else {
          setLevel(l => l + 1);
          setPlayerIndex(0);
        }
      } else {
        setPlayerIndex(nextIndex);
      }
    } else {
      // Missed rhythm
      soundManager.playError();
      setCombo(0);
      setPlayerIndex(0);
    }
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold">
        <div className="text-amber-400">CADENCE: {level + 1} / {RHYTHMS.length}</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Temple Ghanti Bell Canvas */}
      <div className="my-auto text-center py-4">
        <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-amber-500/20 to-yellow-400/30 border-2 border-amber-300/40 flex items-center justify-center text-6xl shadow-2xl transition-transform ${
          isRinging ? 'scale-125 rotate-12 drop-shadow-[0_0_20px_#FFD700]' : 'scale-100'
        }`}>
          🔔
        </div>

        {/* Target Sequence Visual */}
        <div className="mt-4 p-3 rounded-2xl bg-black/40 border border-white/10 max-w-xs mx-auto">
          <div className="text-[10px] text-amber-300/80 font-bold uppercase mb-2">
            CADENCE TARGET:
          </div>
          <div className="flex items-center justify-center gap-2">
            {currentRhythm.beats.map((b, idx) => (
              <span
                key={idx}
                className={`px-2.5 py-1 rounded-xl text-xs font-black border transition-all ${
                  idx < playerIndex
                    ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300'
                    : idx === playerIndex
                    ? 'bg-amber-400 text-slate-900 border-white animate-pulse'
                    : 'bg-white/5 border-white/10 text-slate-500'
                }`}
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Rhythm Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <AnimatedButton
          variant="gold"
          size="lg"
          icon={<Bell className="w-5 h-5 fill-current" />}
          soundType="bell"
          onClick={() => handleAction('TAP')}
        >
          RING BELL
        </AnimatedButton>

        <AnimatedButton
          variant="glass"
          size="lg"
          onClick={() => handleAction('PAUSE')}
        >
          PAUSE (REST)
        </AnimatedButton>
      </div>
    </div>
  );
};
