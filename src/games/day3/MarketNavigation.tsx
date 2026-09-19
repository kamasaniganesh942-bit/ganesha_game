import React, { useState } from 'react';
import { useGame } from '../../state/GameContext';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { GaneshaIdol } from '../../components/common/GaneshaIdol';
import { Compass, CheckCircle2, Sparkles } from 'lucide-react';

interface MarketNavigationProps {
  onWin: (result: RewardResult) => void;
}

interface Checkpoint {
  id: string;
  name: string;
  icon: string;
  desc: string;
}

const CHECKPOINTS: Checkpoint[] = [
  { id: 'idol_shop', name: 'Murti Workshop', icon: '🐘', desc: 'Receive Lord Ganesha with reverence' },
  { id: 'flower_bazaar', name: 'Flower Bazaar', icon: '🌸', desc: 'Pick red hibiscus & durva grass' },
  { id: 'temple', name: 'Community Pandal', icon: '🏛️', desc: 'Arrival at the grand temple mandap' }
];

interface Crossroads {
  id: number;
  locationName: string;
  sceneDesc: string;
  options: {
    label: string;
    direction: 'left' | 'straight' | 'right';
    targetCheckpoint?: string;
    isCorrect: boolean;
    clue: string;
  }[];
}

const STAGES: Crossroads[] = [
  // Stage 0: Towards Idol Shop
  {
    id: 0,
    locationName: 'North Market Gate',
    sceneDesc: 'Artisan signs point down the clay sculpting avenue.',
    options: [
      { label: 'Clay Sculptor Lane ⬅️', direction: 'left', targetCheckpoint: 'idol_shop', isCorrect: true, clue: 'Fresh earthen clay scent' },
      { label: 'Silk Saree Chowk ⬆️', direction: 'straight', isCorrect: false, clue: 'Textile shop' },
      { label: 'Sweet Mart ➡️', direction: 'right', isCorrect: false, clue: 'Jalebi fryer' }
    ]
  },
  // Stage 1: Towards Flower Bazaar
  {
    id: 1,
    locationName: 'Central Square Crossing',
    sceneDesc: 'Fragrance of fresh marigold and jasmine fills the air.',
    options: [
      { label: 'Brass Utensil Row ⬅️', direction: 'left', isCorrect: false, clue: 'Hammering brass' },
      { label: 'Fragrant Flower Bazaar ⬆️', direction: 'straight', targetCheckpoint: 'flower_bazaar', isCorrect: true, clue: 'Garland sellers calling' },
      { label: 'Pottery Stalls ➡️', direction: 'right', isCorrect: false, clue: 'Clay lamps' }
    ]
  },
  // Stage 2: Towards Pandal Temple
  {
    id: 2,
    locationName: 'Temple Boulevard',
    sceneDesc: 'Echoes of dhol drums and saffron flags fluttering ahead.',
    options: [
      { label: 'Back Alley ⬅️', direction: 'left', isCorrect: false, clue: 'Quiet path' },
      { label: 'Pandal Temple Arch ➡️', direction: 'right', targetCheckpoint: 'temple', isCorrect: true, clue: 'Dhol tasha & cheering devotees' },
      { label: 'Tea Stall ⬆️', direction: 'straight', isCorrect: false, clue: 'Masala chai' }
    ]
  }
];

export const MarketNavigation: React.FC<MarketNavigationProps> = ({ onWin }) => {
  const { state } = useGame();
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [visitedCheckpoints, setVisitedCheckpoints] = useState<string[]>([]);
  const [wrongTurns, setWrongTurns] = useState(0);
  const [feedback, setFeedback] = useState<string>('Follow market signs to reach the 3 festival checkpoints!');

  const stage = STAGES[currentStageIdx];

  const handleChoice = (option: typeof stage.options[0]) => {
    if (option.isCorrect) {
      soundManager.playBell();
      if (option.targetCheckpoint) {
        const nextVisited = [...visitedCheckpoints, option.targetCheckpoint];
        setVisitedCheckpoints(nextVisited);

        if (nextVisited.length === CHECKPOINTS.length) {
          soundManager.playFanfare();
          setFeedback('Grand arrival at the Community Pandal!');
          setTimeout(() => {
            onWin({
              performance: wrongTurns === 0 ? 'PERFECT' : 'GREAT',
              stars: wrongTurns === 0 ? 3 : 2,
              score: 220 - wrongTurns * 20,
              tokens: 20
            });
          }, 1800);
          return;
        }
      }

      setCurrentStageIdx(s => s + 1);
      setFeedback('Correct route! Proceeding to the next market lane.');
    } else {
      soundManager.playError();
      setWrongTurns(w => w + 1);
      setFeedback(`That path leads to ${option.clue}. Check the signposts!`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-4 select-none">
      {/* Top Banner */}
      <div className="w-full bg-amber-950/80 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-amber-300 font-black text-xs tracking-wider flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            FESTIVE MARKET NAVIGATION
          </h3>
          <p className="text-[11px] text-amber-100/70">Guide the procession via street signposts</p>
        </div>

        <div className="bg-amber-900/80 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
          <span className="text-[10px] text-amber-300/80 block uppercase font-bold">Checkpoints</span>
          <span className="text-base font-black text-amber-300">{visitedCheckpoints.length} / 3</span>
        </div>
      </div>

      {/* 3 Checkpoints Progress Tracker */}
      <div className="w-full mt-2 grid grid-cols-3 gap-2">
        {CHECKPOINTS.map((cp, idx) => {
          const isDone = visitedCheckpoints.includes(cp.id);
          const isNext = !isDone && (idx === 0 || visitedCheckpoints.includes(CHECKPOINTS[idx - 1].id));

          return (
            <div
              key={cp.id}
              className={`flex items-center gap-1 text-xs font-bold transition-all ${
                isDone ? 'text-amber-300 scale-105' : 'text-slate-500 opacity-60'
              }`}
            >
              <span className="text-base">{cp.icon}</span>
              <span className="hidden sm:inline">{cp.name}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />}
            </div>
          );
        })}
      </div>

      {/* Main Street Navigation Canvas */}
      <div className="relative flex-1 w-full my-2 bg-gradient-to-b from-[#220E3E] via-[#17092C] to-[#0D041A] rounded-2xl border border-white/10 overflow-hidden flex flex-col items-center justify-between p-4">
        {/* Street Ambience Decor */}
        <div className="absolute inset-0 p-3 pointer-events-none opacity-20 flex justify-between">
          <div className="text-3xl">🏮</div>
          <div className="text-3xl">🚩</div>
          <div className="text-3xl">🏮</div>
        </div>

        {/* Current Location Sign */}
        <div className="z-10 w-full bg-amber-950/80 border border-amber-500/40 rounded-2xl p-3 text-center shadow-lg">
          <span className="text-[10px] text-amber-400 uppercase font-black tracking-widest block">
            LOCATION
          </span>
          <h4 className="text-base font-black text-amber-200">{stage.locationName}</h4>
          <p className="text-[11px] text-amber-100/70 mt-0.5">{stage.sceneDesc}</p>
        </div>

        {/* Procession Palanquin Centerpiece */}
        <div className="relative flex flex-col items-center animate-bounceSubtle my-1">
          <GaneshaIdol
            size={70}
            type={state.selectedIdol || 'festival'}
            showHalo={false}
            showThrone={false}
            showMouse={false}
          />
          <div className="px-3 py-1 bg-amber-500/30 rounded-full border border-amber-400 text-[10px] font-black text-amber-200 mt-1 shadow">
            Morya Palkhi
          </div>
        </div>

        {/* Dynamic Route Guidance Signpost Options */}
        <div className="z-10 w-full flex flex-col gap-2">
          {stage.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleChoice(opt)}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-900/90 via-amber-800/90 to-amber-900/90 hover:from-amber-700 hover:to-amber-800 text-amber-100 rounded-2xl border-2 border-amber-500/40 shadow-lg font-bold text-xs flex items-center justify-between active:scale-95 transition"
            >
              <span>{opt.label}</span>
              <span className="text-[10px] text-amber-300/70 italic font-normal">({opt.clue})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Feedback Bar */}
      <div className="w-full bg-amber-950/80 rounded-2xl p-2.5 border border-amber-500/30 text-center text-xs text-amber-200 font-medium">
        {feedback}
      </div>
    </div>
  );
};
