import React, { useState, useRef } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { Sparkles, Heart, Waves, CheckCircle2 } from 'lucide-react';
import { useGame } from '../../state/GameContext';
import { GaneshaIdol } from '../../components/common/GaneshaIdol';

interface GrandVisarjanCeremonyProps {
  onWin: (result: RewardResult) => void;
}

export const GrandVisarjanCeremony: React.FC<GrandVisarjanCeremonyProps> = ({ onWin }) => {
  const { state } = useGame();
  // Phase 1: Sunset Aarti (wave 3 times)
  // Phase 2: Flower Petal Shower (tap 3 times)
  // Phase 3: Whisper Prayer in Bappa's ear
  // Phase 4: Gentle Immersion (hold 2s)
  // Phase 5: Divine Blessing Echoes
  const [phase, setPhase] = useState<1 | 2 | 3 | 4 | 5>(1);

  const [aartiWaved, setAartiWaved] = useState(0);
  const [petalsShowered, setPetalsShowered] = useState(0);
  const [prayerWhispered, setPrayerWhispered] = useState(false);
  const [immersionDepth, setImmersionDepth] = useState(0); // 0 to 100%

  const immersionInterval = useRef<any>(null);

  // Phase 1 Aarti
  const handleAartiWave = () => {
    if (phase !== 1) return;
    soundManager.playBell();
    setAartiWaved(prev => {
      const next = prev + 1;
      if (next >= 3) {
        soundManager.playFanfare();
        setTimeout(() => setPhase(2), 600);
        return 3;
      }
      return next;
    });
  };

  // Phase 2 Petals
  const handleShowerPetals = () => {
    if (phase !== 2) return;
    soundManager.playBell();
    setPetalsShowered(prev => {
      const next = prev + 1;
      if (next >= 3) {
        soundManager.playFanfare();
        setTimeout(() => setPhase(3), 600);
        return 3;
      }
      return next;
    });
  };

  // Phase 3 Whisper Prayer
  const handleWhisperPrayer = () => {
    if (phase !== 3 || prayerWhispered) return;
    soundManager.playBell();
    setPrayerWhispered(true);
    setTimeout(() => setPhase(4), 1200);
  };

  // Phase 4 Immersion Hold
  const handleImmersionStart = () => {
    if (phase !== 4) return;
    soundManager.playClick();
    immersionInterval.current = setInterval(() => {
      setImmersionDepth(prev => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(immersionInterval.current);
          soundManager.playWater();
          soundManager.playBell();
          soundManager.playFanfare();
          setPhase(5);

          // Conclude after emotional cinematic moment
          setTimeout(() => {
            onWin({
              performance: 'PERFECT',
              stars: 3,
              score: 500,
              tokens: 50
            });
          }, 3500);

          return 100;
        }
        return next;
      });
    }, 80);
  };

  const handleImmersionEnd = () => {
    if (immersionDepth < 100 && phase === 4) {
      clearInterval(immersionInterval.current);
      setImmersionDepth(0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-4 select-none">
      {/* Top Banner */}
      <div className="w-full bg-amber-950/80 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-amber-300 font-black text-xs tracking-wider flex items-center gap-1">
            <Waves className="w-3.5 h-3.5 text-amber-400" />
            GRAND VISARJAN CEREMONY
          </h3>
          <p className="text-[11px] text-amber-100/70">
            {phase === 1 && '1. Final Aarti at Sunset Lake'}
            {phase === 2 && '2. Float Sacred Petals on Waters'}
            {phase === 3 && "3. Whisper Prayer into Bappa's Ear"}
            {phase === 4 && '4. Hold to Gently Immerse with Love'}
            {phase === 5 && '5. Divine Blessing & Eternal Promise'}
          </p>
        </div>

        <div className="bg-amber-900/80 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
          <span className="text-[10px] text-amber-300/80 block uppercase font-bold">Ceremony</span>
          <span className="text-base font-black text-amber-300">{phase} / 5</span>
        </div>
      </div>

      {/* 5 Phase Progress Indicator */}
      <div className="w-full mt-2 grid grid-cols-5 gap-1">
        {[
          { p: 1, label: 'Aarti', icon: '🪔' },
          { p: 2, label: 'Petals', icon: '🌸' },
          { p: 3, label: 'Prayer', icon: '🙏' },
          { p: 4, label: 'Immerse', icon: '🌊' },
          { p: 5, label: 'Blessing', icon: '✨' }
        ].map(item => {
          const isDone = phase > item.p || (item.p === 5 && phase === 5);
          const isCurrent = phase === item.p;

          return (
            <div
              key={item.p}
              className={`p-1 rounded-xl border flex flex-col items-center text-center transition ${
                isDone
                  ? 'bg-emerald-950/40 border-emerald-400 text-emerald-300'
                  : isCurrent
                  ? 'bg-amber-500/20 border-amber-300 ring-2 ring-amber-400/50 text-amber-200 animate-pulse'
                  : 'bg-black/30 border-white/10 text-stone-600'
              }`}
            >
              <span className="text-xs">{item.icon}</span>
              <span className="text-[7px] font-black uppercase mt-0.5">{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Sunset Sacred Lake Canvas */}
      <div className="relative w-full aspect-[4/5] my-auto bg-gradient-to-b from-orange-900 via-amber-900 to-sky-950 rounded-3xl border-2 border-amber-500/40 p-4 flex flex-col items-center justify-between shadow-2xl overflow-hidden">
        {/* Sunset Sky & Reflection */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-gradient-to-b from-yellow-300 via-amber-500 to-rose-600 blur-2xl" />
        </div>

        {/* Ghat Stone Steps & Crowd Silhouette */}
        <div className="absolute top-8 inset-x-0 flex justify-center pointer-events-none opacity-25">
          <span className="text-2xl tracking-widest">🙏 🏮 🙏 🏮 🙏</span>
        </div>

        {/* Sacred Water Ripples Layer */}
        <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-sky-900/90 via-cyan-950/80 to-transparent border-t-2 border-amber-400/30 flex flex-col items-center justify-center">
          <div className="text-3xl text-cyan-300/40 animate-pulse">
            〰️ 〰️ 〰️
          </div>
          {petalsShowered > 0 && (
            <div className="flex gap-4 text-xl mt-2 animate-bounce">
              <span>🌸</span><span>🌺</span><span>🌼</span><span>🌸</span>
            </div>
          )}
        </div>

        {/* Lord Ganesha on Ghat Platform / Immersing */}
        <div className="relative z-10 flex flex-col items-center my-auto transition-all duration-300">
          <GaneshaIdol
            size={145}
            type={state.selectedIdol || 'festival'}
            immersionDepth={phase >= 4 ? immersionDepth : 0}
            showHalo={phase !== 5}
            showThrone={true}
            animated={phase < 4}
          />
          <div className="px-3 py-0.5 bg-amber-500/40 rounded-full border border-amber-300 text-[10px] font-black text-amber-200 mt-1 shadow-lg">
            {phase === 5 ? 'Dissolved into Nature' : 'Lord Bappa at the Ghat'}
          </div>
        </div>

        {/* Dynamic Ritual Action by Phase */}
        <div className="relative z-20 w-full flex flex-col items-center">
          {/* Phase 1: Wave Aarti */}
          {phase === 1 && (
            <button
              onClick={handleAartiWave}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-amber-950 font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <span className="text-2xl animate-bounce">🪔</span>
              <span className="text-xs uppercase">WAVE FAREWELL AARTI ({aartiWaved} / 3)</span>
            </button>
          )}

          {/* Phase 2: Shower Petals */}
          {phase === 2 && (
            <button
              onClick={handleShowerPetals}
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <span className="text-2xl animate-bounce">🌸</span>
              <span className="text-xs uppercase">FLOAT PETALS ON WATER ({petalsShowered} / 3)</span>
            </button>
          )}

          {/* Phase 3: Whisper Prayer */}
          {phase === 3 && (
            <button
              onClick={handleWhisperPrayer}
              disabled={prayerWhispered}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <span className="text-2xl animate-bounce">👂</span>
              <span className="text-xs uppercase">
                {prayerWhispered ? 'PRAYER WHISPERED IN BAPPAS EAR' : 'WHISPER PRAYER IN BAPPAS EAR'}
              </span>
            </button>
          )}

          {/* Phase 4: Gentle Immersion */}
          {phase === 4 && (
            <div className="w-full flex flex-col items-center">
              <button
                onMouseDown={handleImmersionStart}
                onMouseUp={handleImmersionEnd}
                onTouchStart={handleImmersionStart}
                onTouchEnd={handleImmersionEnd}
                className="w-full py-4 bg-gradient-to-r from-sky-600 to-indigo-700 text-white font-black rounded-2xl shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition relative overflow-hidden"
              >
                <Waves className="w-5 h-5 animate-bounce" />
                <span className="text-xs uppercase tracking-wider">
                  HOLD TO IMMERSE BAPPA WITH LOVE ({immersionDepth}%)
                </span>
                <div
                  className="absolute inset-y-0 left-0 bg-amber-400/30 transition-all duration-75 pointer-events-none"
                  style={{ width: `${immersionDepth}%` }}
                />
              </button>
              <span className="text-[10px] text-amber-200/80 mt-1">Press and keep holding until full immersion</span>
            </div>
          )}

          {/* Phase 5: Divine Blessing & Farewell Echoes */}
          {phase === 5 && (
            <div className="w-full bg-amber-950/95 border-2 border-amber-400 rounded-2xl p-4 text-center shadow-2xl backdrop-blur-md animate-in zoom-in-95">
              <span className="text-4xl animate-bounce">✨</span>
              <h4 className="text-amber-300 font-black text-base mt-1">GANPATI BAPPA MORYA!</h4>
              <p className="text-xs text-amber-100 font-bold mt-1">
                "Pudhchya Varshi Lavkar Ya!"
              </p>
              <p className="text-[11px] text-amber-200/80 mt-1 italic">
                Lord Ganesha dissolves back into nature and stays forever in our hearts.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Chanting Bar */}
      <div className="w-full bg-amber-950/80 rounded-2xl p-2.5 border border-amber-500/30 text-center text-xs text-amber-300 font-black italic">
        "Jai Ganesh, Jai Ganesh, Jai Ganesh Deva..."
      </div>
    </div>
  );
};
