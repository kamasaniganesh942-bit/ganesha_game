import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { AnimatedButton } from '../../components/common/AnimatedButton';
import { ComboBadge } from '../../components/common/ComboBadge';
import { Check, Trash2 } from 'lucide-react';

interface MoneyCountingChallengeProps {
  onWin: (result: RewardResult) => void;
}

interface DenomItem {
  id: number;
  val: number;
  type: 'coin' | 'note';
  inTray: boolean;
}

const PUZZLES = [
  {
    targetText: 'Target: Tally exactly ₹120',
    targetAmount: 120,
    available: [50, 50, 20, 20, 10, 10, 5]
  },
  {
    targetText: 'Target: Tally exactly ₹175',
    targetAmount: 175,
    available: [100, 50, 20, 10, 5, 20, 50]
  },
  {
    targetText: 'Target: Tally exactly ₹250',
    targetAmount: 250,
    available: [100, 100, 50, 50, 20, 10, 20]
  }
];

export const MoneyCountingChallenge: React.FC<MoneyCountingChallengeProps> = ({ onWin }) => {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [items, setItems] = useState<DenomItem[]>(() =>
    PUZZLES[0].available.map((val, idx) => ({
      id: idx,
      val,
      type: val >= 50 ? 'note' : 'coin',
      inTray: false
    }))
  );
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentPuzzle = PUZZLES[puzzleIdx];

  const trayTotal = items.filter(i => i.inTray).reduce((sum, i) => sum + i.val, 0);

  const toggleItem = (id: number) => {
    soundManager.playClick();
    setErrorMsg(null);
    setItems(prev => prev.map(i => i.id === id ? { ...i, inTray: !i.inTray } : i));
  };

  const handleClearTray = () => {
    soundManager.playClick();
    setItems(prev => prev.map(i => ({ ...i, inTray: false })));
  };

  const handleSubmit = () => {
    if (trayTotal === currentPuzzle.targetAmount) {
      // Correct!
      soundManager.playCoin();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore(s => s + 100 * nextCombo);

      if (puzzleIdx + 1 >= PUZZLES.length) {
        soundManager.playFanfare();
        setTimeout(() => {
          onWin({
            performance: 'PERFECT',
            stars: 3,
            score: score + 250,
            tokens: 20,
            moneyEarned: 80
          });
        }, 500);
      } else {
        const nextIdx = puzzleIdx + 1;
        setPuzzleIdx(nextIdx);
        setItems(
          PUZZLES[nextIdx].available.map((val, idx) => ({
            id: idx,
            val,
            type: val >= 50 ? 'note' : 'coin',
            inTray: false
          }))
        );
      }
    } else {
      soundManager.playError();
      setCombo(0);
      setErrorMsg(`Current total is ₹${trayTotal}. Target is ₹${currentPuzzle.targetAmount}!`);
    }
  };

  return (
    <div className="relative w-full h-[70vh] max-h-[560px] bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-4 flex flex-col justify-between">
      <ComboBadge combo={combo} />

      {/* Mini-HUD */}
      <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-2xl border border-white/10 text-xs sm:text-sm font-bold z-10">
        <div className="text-amber-400">CHALLENGE: {puzzleIdx + 1} / {PUZZLES.length}</div>
        <div className="text-emerald-400">SCORE: {score}</div>
      </div>

      {/* Target Banner */}
      <div className="text-center py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl border border-amber-400/40 my-1">
        <span className="text-xs text-amber-200 font-bold uppercase tracking-wider block">
          {currentPuzzle.targetText}
        </span>
      </div>

      {/* Counting Tray Area */}
      <div className="my-auto p-4 rounded-3xl bg-gradient-to-b from-[#241042] to-[#120722] border-2 border-amber-500/50 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-amber-300 uppercase">COUNTING TRAY:</span>
          <span className="text-base font-black text-emerald-400">TOTAL: ₹{trayTotal}</span>
        </div>

        {/* Tray Box */}
        <div className="min-h-[90px] p-2.5 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-center gap-2">
          {items.filter(i => i.inTray).length === 0 ? (
            <span className="text-xs text-slate-400 italic">Tap coins/notes below to place in tray</span>
          ) : (
            items.filter(i => i.inTray).map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-900 font-black text-xs border border-yellow-100 shadow-md animate-bounceSubtle"
              >
                ₹{item.val} ✕
              </button>
            ))
          )}
        </div>

        {errorMsg && (
          <div className="text-xs text-red-300 font-bold text-center mt-2 animate-bounce">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Available Denominations Area */}
      <div className="bg-black/30 p-2.5 rounded-2xl border border-white/10">
        <div className="text-[11px] font-bold text-slate-300 mb-1.5 text-center">
          Available Currency (tap to add/remove from tray):
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`px-3 py-2 rounded-xl font-black text-xs border transition-all active:scale-95 ${
                item.inTray
                  ? 'bg-slate-800/60 border-white/10 opacity-30 cursor-pointer'
                  : 'bg-white/10 border-white/20 hover:border-amber-400 text-amber-300 shadow-md'
              }`}
            >
              {item.type === 'note' ? '💵' : '🪙'} ₹{item.val}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2">
        <AnimatedButton
          variant="glass"
          size="sm"
          icon={<Trash2 className="w-4 h-4" />}
          onClick={handleClearTray}
        >
          CLEAR
        </AnimatedButton>
        <AnimatedButton
          variant="gold"
          size="sm"
          className="col-span-2"
          icon={<Check className="w-4 h-4" />}
          onClick={handleSubmit}
        >
          CONFIRM TALLY (₹{trayTotal})
        </AnimatedButton>
      </div>
    </div>
  );
};
