import React, { useState, useEffect, useRef } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { Sparkles, Flame, Heart } from 'lucide-react';

interface DholCrowdRhythmProps {
  onWin: (result: RewardResult) => void;
}

type ActionType = 'drum' | 'clap' | 'light' | 'flower';

interface RhythmPrompt {
  id: number;
  type: ActionType;
  y: number; // 0 to 100%
  hit: boolean;
}

const ACTION_CONFIG: Record<ActionType, { label: string; icon: string; color: string }> = {
  drum: { label: 'DHOL', icon: '🥁', color: 'from-amber-600 to-red-600' },
  clap: { label: 'CLAP', icon: '👏', color: 'from-amber-500 to-yellow-600' },
  light: { label: 'AARTI', icon: '🪔', color: 'from-orange-500 to-amber-600' },
  flower: { label: 'GULAL', icon: '🌸', color: 'from-rose-500 to-pink-600' }
};

export const DholCrowdRhythm: React.FC<DholCrowdRhythmProps> = ({ onWin }) => {
  const [prompts, setPrompts] = useState<RhythmPrompt[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [successfulBeats, setSuccessfulBeats] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const successfulBeatsRef = useRef(0);
  const comboRef = useRef(0);
  const promptsRef = useRef<RhythmPrompt[]>([]);

  successfulBeatsRef.current = successfulBeats;
  comboRef.current = combo;
  promptsRef.current = prompts;

  // Main rhythm tick
  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      tick++;

      // Spawn new beat prompt every 15 ticks (if < 8 completed)
      if (tick % 15 === 0 && successfulBeatsRef.current < 8) {
        const types: ActionType[] = ['drum', 'clap', 'light', 'flower'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        setPrompts(prev => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            type: randomType,
            y: 0,
            hit: false
          }
        ]);
      }

      // Move prompts down
      setPrompts(prev => {
        const next: RhythmPrompt[] = [];
        for (const p of prev) {
          const nextY = p.y + 4.2;
          // If missed past 94%
          if (nextY > 94 && !p.hit) {
            setCombo(0);
            setFeedback('MISSED!');
            setTimeout(() => setFeedback(null), 300);
            continue;
          }
          if (nextY <= 100) {
            next.push({ ...p, y: nextY });
          }
        }
        return next;
      });
    }, 55);

    return () => clearInterval(interval);
  }, []);

  const handleAction = (action: ActionType) => {
    // Find closest prompt in strike zone (y ~ 60% to 92%)
    const target = prompts.find(p => !p.hit && p.y >= 58 && p.y <= 92);

    if (target && target.type === action) {
      // Perfect Hit
      if (action === 'drum') soundManager.playDhol();
      else if (action === 'clap') soundManager.playClick();
      else if (action === 'light') soundManager.playBell();
      else soundManager.playCoin();

      const nextCombo = combo + 1;
      const nextBeats = successfulBeats + 1;
      setCombo(nextCombo);
      setSuccessfulBeats(nextBeats);
      setScore(s => s + 40 * Math.min(nextCombo, 4));
      setFeedback('PERFECT! 🎉');
      setTimeout(() => setFeedback(null), 250);

      setPrompts(prev =>
        prev.map(p => (p.id === target.id ? { ...p, hit: true } : p))
      );

      if (nextBeats >= 8) {
        soundManager.playFanfare();
        setTimeout(() => {
          onWin({
            performance: 'PERFECT',
            stars: 3,
            score: 250 + combo * 10,
            tokens: 25
          });
        }, 400);
      }
    } else {
      // Off beat
      soundManager.playError();
      setCombo(0);
      setFeedback('OFF BEAT!');
      setTimeout(() => setFeedback(null), 250);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-4 select-none">
      {/* Top Banner */}
      <div className="w-full bg-amber-950/80 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-amber-300 font-black text-xs tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            DHOL TASHA & CROWD RHYTHM
          </h3>
          <p className="text-[11px] text-amber-100/70">Tap the matching action in the strike zone</p>
        </div>

        <div className="flex items-center gap-2">
          {combo > 1 && (
            <div className="bg-orange-600 px-2 py-1 rounded-xl text-xs font-black text-white animate-bounce">
              {combo}x COMBO!
            </div>
          )}
          <div className="bg-amber-900/80 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
            <span className="text-[10px] text-amber-300/80 block uppercase font-bold">Beats</span>
            <span className="text-base font-black text-amber-300">{successfulBeats} / 12</span>
          </div>
        </div>
      </div>

      {/* Rhythm Highway Canvas */}
      <div className="relative w-full aspect-[4/5] my-auto bg-gradient-to-b from-purple-950 via-stone-900 to-amber-950 rounded-3xl border-2 border-amber-500/40 overflow-hidden shadow-2xl flex flex-col items-center justify-between p-4">
        {/* Crowd Silhouette & Flags */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <div className="flex justify-around text-xl pt-2">
            <span>🚩</span><span>🥁</span><span>🚩</span><span>🥁</span><span>🚩</span>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className="absolute top-1/4 z-30 px-4 py-1.5 rounded-full bg-amber-500 text-amber-950 font-black text-sm shadow-xl animate-in zoom-in-75">
            {feedback}
          </div>
        )}

        {/* Moving Rhythm Prompts Highway */}
        <div className="relative w-full flex-1">
          {prompts.map(p => {
            if (p.hit) return null;
            const cfg = ACTION_CONFIG[p.type];

            return (
              <div
                key={p.id}
                style={{ top: `${p.y}%` }}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r border-2 border-white shadow-2xl scale-105"
              >
                <span className="text-2xl">{cfg.icon}</span>
                <span className="text-xs font-black text-white uppercase tracking-wider">{cfg.label}</span>
              </div>
            );
          })}

          {/* Strike Zone Target Ring */}
          <div className="absolute top-[75%] inset-x-8 -translate-y-1/2 h-14 rounded-2xl border-4 border-dashed border-amber-400 bg-amber-500/20 flex items-center justify-center pointer-events-none shadow-glow">
            <span className="text-xs font-black text-amber-200 uppercase tracking-widest animate-pulse">
              ⭐ STRIKE ZONE ⭐
            </span>
          </div>
        </div>

        {/* Crowd Chanting Bar */}
        <div className="w-full text-center py-1 bg-amber-950/60 rounded-xl border border-amber-600/30 text-xs font-black text-amber-300 italic">
          "Ganpati Bappa Morya! Pudhchya Varshi Lavkar Ya!"
        </div>
      </div>

      {/* 4 Rhythm Action Strike Buttons */}
      <div className="w-full grid grid-cols-4 gap-2">
        {(['drum', 'clap', 'light', 'flower'] as ActionType[]).map(act => {
          const cfg = ACTION_CONFIG[act];
          return (
            <button
              key={act}
              onClick={() => handleAction(act)}
              className={`py-3 rounded-2xl bg-gradient-to-b ${cfg.color} text-white font-black border-2 border-white/40 shadow-xl flex flex-col items-center justify-center active:scale-90 transition`}
            >
              <span className="text-2xl">{cfg.icon}</span>
              <span className="text-[10px] mt-0.5 tracking-wider">{cfg.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
