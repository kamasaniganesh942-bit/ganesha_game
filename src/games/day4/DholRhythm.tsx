import React, { useState, useEffect } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';

interface DholRhythmProps {
  onWin: (result: RewardResult) => void;
}

interface RhythmNote {
  id: number;
  lane: 0 | 1 | 2; // 0 = Left, 1 = Center, 2 = Right
  y: number; // 0 to 100%
  speed: number;
}

export const DholRhythm: React.FC<DholRhythmProps> = ({ onWin }) => {
  const [notes, setNotes] = useState<RhythmNote[]>([]);
  const [hits, setHits] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [rating, setRating] = useState<string | null>(null);

  // Spawner
  useEffect(() => {
    const spawner = setInterval(() => {
      const newNote: RhythmNote = {
        id: Date.now() + Math.random(),
        lane: Math.floor(Math.random() * 3) as 0 | 1 | 2,
        y: 0,
        speed: 3.2
      };
      setNotes(prev => [...prev, newNote]);
    }, 800);

    return () => clearInterval(spawner);
  }, []);

  // Falling loop
  useEffect(() => {
    const loop = setInterval(() => {
      setNotes(prevNotes => {
        const nextNotes: RhythmNote[] = [];
        prevNotes.forEach(note => {
          const nextY = note.y + note.speed;
          if (nextY > 100) {
            // Missed note
            setCombo(0);
          } else {
            nextNotes.push({ ...note, y: nextY });
          }
        });
        return nextNotes;
      });
    }, 40);

    return () => clearInterval(loop);
  }, []);

  const handlePadHit = (lane: 0 | 1 | 2) => {
    soundManager.playDhol(true);

    // Find closest note in this lane around hit zone (y between 70% and 92%)
    const targetNote = notes.find(n => n.lane === lane && n.y >= 68 && n.y <= 94);

    if (targetNote) {
      const dist = Math.abs(targetNote.y - 82);
      let hitRating = 'GOOD';
      let pts = 50;

      if (dist <= 4) {
        hitRating = 'PERFECT!';
        pts = 120;
      } else if (dist <= 8) {
        hitRating = 'GREAT!';
        pts = 80;
      }

      setRating(hitRating);
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + pts * nextCombo);

      // Remove hit note
      setNotes(prev => prev.filter(n => n.id !== targetNote.id));

      const nextHits = hits + 1;
      setHits(nextHits);

      if (nextHits >= 10) {
        soundManager.playFanfare();
        setTimeout(() => {
          onWin({
            performance: 'PERFECT',
            stars: 3,
            score: score + 300,
            tokens: 25
          });
        }, 400);
      }
    } else {
      setCombo(0);
      setRating('MISS');
    }
  };

  const laneX = ['20%', '50%', '80%'];

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold z-10">
        <div className="text-amber-400">DHOL HITS: {hits} / 10</div>
        <div className="text-emerald-400">SCORE: {score}</div>
        {rating && (
          <div className="text-yellow-300 font-black animate-bounce">{rating}</div>
        )}
      </div>

      {/* 3 Rhythm Lanes Canvas */}
      <div className="relative flex-1 w-full my-2 bg-gradient-to-b from-[#180A2E] to-[#261045] rounded-2xl border border-white/5 overflow-hidden">
        {/* 3 Lane Dividers */}
        <div className="absolute inset-0 flex justify-around pointer-events-none opacity-20">
          <div className="w-0.5 h-full border-r border-dashed border-amber-300" />
          <div className="w-0.5 h-full border-r border-dashed border-amber-300" />
        </div>

        {/* Target Hit Line */}
        <div className="absolute top-[82%] inset-x-2 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-full shadow-[0_0_12px_#FFD700] z-0" />

        {/* Falling Beat Notes */}
        {notes.map((note) => (
          <div
            key={note.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: laneX[note.lane], top: `${note.y}%` }}
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 border-2 border-yellow-200 flex items-center justify-center text-xl shadow-lg animate-pulse">
              🥁
            </div>
          </div>
        ))}
      </div>

      {/* 3 Drum Pads at bottom */}
      <div className="grid grid-cols-3 gap-2 z-10">
        <button
          onClick={() => handlePadHit(0)}
          className="py-4 rounded-2xl bg-gradient-to-t from-amber-700 to-orange-600 active:scale-95 border-2 border-amber-400 text-white font-black text-sm shadow-lg"
        >
          LEFT
        </button>
        <button
          onClick={() => handlePadHit(1)}
          className="py-4 rounded-2xl bg-gradient-to-t from-yellow-600 to-amber-500 active:scale-95 border-2 border-yellow-300 text-slate-950 font-black text-sm shadow-lg"
        >
          CENTER
        </button>
        <button
          onClick={() => handlePadHit(2)}
          className="py-4 rounded-2xl bg-gradient-to-t from-amber-700 to-orange-600 active:scale-95 border-2 border-amber-400 text-white font-black text-sm shadow-lg"
        >
          RIGHT
        </button>
      </div>
    </div>
  );
};
