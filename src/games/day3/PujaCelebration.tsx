import React, { useState, useRef } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { Sparkles, Flame, Bell, Heart, CheckCircle2 } from 'lucide-react';
import { useGame } from '../../state/GameContext';
import { GaneshaIdol } from '../../components/common/GaneshaIdol';

interface PujaCelebrationProps {
  onWin: (result: RewardResult) => void;
}

export const PujaCelebration: React.FC<PujaCelebrationProps> = ({ onWin }) => {
  const { state } = useGame();
  // Step 1: Light Diya (hold 2s)
  // Step 2: Circle Aarti (drag circle 3 times)
  // Step 3: Ring Bell (5 rhythm taps)
  // Step 4: Offer Modak (tap to offer)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 state
  const [diyaLitProgress, setDiyaLitProgress] = useState(0); // 0 to 100%
  const diyaHoldInterval = useRef<any>(null);

  // Step 2 state: Aarti Circles
  const [aartiCircles, setAartiCircles] = useState(0); // target 3

  // Step 3 state: Bell Rings
  const [bellRings, setBellRings] = useState(0); // target 5

  // Step 4 state: Modak offered
  const [modakOffered, setModakOffered] = useState(false);

  // Step 1 Hold Handlers
  const handleDiyaTouchStart = () => {
    if (currentStep !== 1) return;
    soundManager.playClick();
    diyaHoldInterval.current = setInterval(() => {
      setDiyaLitProgress(prev => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(diyaHoldInterval.current);
          soundManager.playBell();
          soundManager.playFanfare();
          setTimeout(() => setCurrentStep(2), 600);
          return 100;
        }
        return next;
      });
    }, 50);
  };

  const handleDiyaTouchEnd = () => {
    if (diyaLitProgress < 100) {
      clearInterval(diyaHoldInterval.current);
      setDiyaLitProgress(0);
    }
  };

  // Step 2 Aarti Circle Tap
  const handleAartiMove = () => {
    if (currentStep !== 2) return;
    soundManager.playBell();
    setAartiCircles(prev => {
      const next = prev + 1;
      if (next >= 3) {
        soundManager.playFanfare();
        setTimeout(() => setCurrentStep(3), 600);
        return 3;
      }
      return next;
    });
  };

  // Step 3 Bell Tap
  const handleBellRing = () => {
    if (currentStep !== 3) return;
    soundManager.playBell();
    setBellRings(prev => {
      const next = prev + 1;
      if (next >= 5) {
        soundManager.playFanfare();
        setTimeout(() => setCurrentStep(4), 600);
        return 5;
      }
      return next;
    });
  };

  // Step 4 Offer Modak
  const handleOfferModak = () => {
    if (currentStep !== 4 || modakOffered) return;
    soundManager.playBell();
    soundManager.playFanfare();
    setModakOffered(true);

    setTimeout(() => {
      onWin({
        performance: 'PERFECT',
        stars: 3,
        score: 300,
        tokens: 30
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-4 select-none">
      {/* Top Banner */}
      <div className="w-full bg-amber-950/80 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-amber-300 font-black text-xs tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            MAHA PUJA CELEBRATION
          </h3>
          <p className="text-[11px] text-amber-100/70">
            {currentStep === 1 && 'Step 1: Kindle the Sacred Diya'}
            {currentStep === 2 && 'Step 2: Circle the Aarti Lamp'}
            {currentStep === 3 && 'Step 3: Ring Temple Bell with Chants'}
            {currentStep === 4 && 'Step 4: Offer Sweet Modak Prasad'}
          </p>
        </div>

        <div className="bg-amber-900/80 px-3 py-1.5 rounded-xl border border-amber-500/40 text-center">
          <span className="text-[10px] text-amber-300/80 block uppercase font-bold">Ritual</span>
          <span className="text-base font-black text-amber-300">{currentStep} / 4</span>
        </div>
      </div>

      {/* 4 Ritual Steps Breadcrumbs */}
      <div className="w-full mt-2 grid grid-cols-4 gap-1.5">
        {[
          { step: 1, label: 'Diya', icon: '🪔' },
          { step: 2, label: 'Aarti', icon: '✨' },
          { step: 3, label: 'Bell', icon: '🔔' },
          { step: 4, label: 'Modak', icon: '🥟' }
        ].map(s => {
          const isDone = currentStep > s.step || (s.step === 4 && modakOffered);
          const isCurrent = currentStep === s.step;

          return (
            <div
              key={s.step}
              className={`p-1.5 rounded-xl border flex flex-col items-center text-center transition ${
                isDone
                  ? 'bg-emerald-950/40 border-emerald-400 text-emerald-300'
                  : isCurrent
                  ? 'bg-amber-500/20 border-amber-300 ring-2 ring-amber-400/50 text-amber-200 animate-pulse'
                  : 'bg-black/30 border-white/10 text-stone-600'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-sm">{s.icon}</span>
                {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </div>
              <span className="text-[8px] font-black uppercase mt-0.5">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Main Altar Sanctum Canvas */}
      <div className="relative w-full aspect-[4/5] my-auto bg-gradient-to-b from-amber-950 via-stone-900 to-amber-950 rounded-3xl border-2 border-amber-500/40 p-4 flex flex-col items-center justify-between shadow-2xl overflow-hidden">
        {/* Divine Sanctum Aura */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
          <div className="w-64 h-64 rounded-full border-4 border-amber-300/40 animate-spin-slow" />
          <div className="absolute w-44 h-44 rounded-full bg-amber-500/20 blur-2xl" />
        </div>

        {/* Lord Ganesha on Throne */}
        <div className="relative z-10 flex flex-col items-center mt-1">
          <GaneshaIdol
            size={145}
            type={state.selectedIdol || 'festival'}
            showHalo={true}
            showThrone={true}
            animated={true}
          />
        </div>

        {/* Dynamic Ritual Interactive Zone based on currentStep */}
        <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center my-2">
          {/* Step 1: Kindle Diya */}
          {currentStep === 1 && (
            <div className="flex flex-col items-center">
              <button
                onMouseDown={handleDiyaTouchStart}
                onMouseUp={handleDiyaTouchEnd}
                onTouchStart={handleDiyaTouchStart}
                onTouchEnd={handleDiyaTouchEnd}
                className="w-24 h-24 rounded-full bg-amber-900/60 border-4 border-amber-400/80 shadow-2xl flex flex-col items-center justify-center active:scale-95 transition relative"
              >
                <Flame className={`w-10 h-10 transition-colors ${diyaLitProgress > 0 ? 'text-amber-400 animate-bounce' : 'text-stone-500'}`} />
                <span className="text-2xl mt-1">🪔</span>
                {diyaLitProgress > 0 && (
                  <div
                    className="absolute inset-0 rounded-full border-4 border-amber-300 pointer-events-none animate-spin"
                    style={{ clipPath: `inset(${100 - diyaLitProgress}% 0 0 0)` }}
                  />
                )}
              </button>
              <div className="mt-3 text-center">
                <span className="text-xs font-bold text-amber-300 block">HOLD TO KINDLE FLAME</span>
                <span className="text-[10px] text-amber-200/80">Press & hold until wick ignites ({diyaLitProgress}%)</span>
              </div>
            </div>
          )}

          {/* Step 2: Circle Aarti */}
          {currentStep === 2 && (
            <div className="flex flex-col items-center">
              <button
                onClick={handleAartiMove}
                className="w-28 h-28 rounded-full border-4 border-dashed border-amber-400 flex flex-col items-center justify-center active:scale-90 transition animate-spin-slow bg-amber-500/20"
              >
                <span className="text-4xl animate-bounce">🪔</span>
                <span className="text-[9px] font-black text-amber-200 mt-1">CIRCLE AARTI</span>
              </button>
              <div className="mt-3 text-center">
                <span className="text-xs font-bold text-amber-300 block">CIRCLE THE FLAME ({aartiCircles} / 3)</span>
                <span className="text-[10px] text-amber-200/80">Tap to wave auspicious aarti around Bappa</span>
              </div>
            </div>
          )}

          {/* Step 3: Ring Bell */}
          {currentStep === 3 && (
            <div className="flex flex-col items-center">
              <button
                onClick={handleBellRing}
                className="w-24 h-24 rounded-full bg-amber-600/40 border-4 border-amber-300 shadow-2xl flex flex-col items-center justify-center active:scale-90 transition active:rotate-12"
              >
                <Bell className="w-10 h-10 text-amber-300 animate-pulse" />
                <span className="text-2xl mt-1">🔔</span>
              </button>
              <div className="mt-3 text-center">
                <span className="text-xs font-bold text-amber-300 block">RING TEMPLE BELL ({bellRings} / 5)</span>
                <span className="text-[10px] text-amber-200/80">Tap in rhythm with the evening aarti bells</span>
              </div>
            </div>
          )}

          {/* Step 4: Offer Modak */}
          {currentStep === 4 && (
            <div className="flex flex-col items-center">
              <button
                onClick={handleOfferModak}
                disabled={modakOffered}
                className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center active:scale-95 transition shadow-2xl ${
                  modakOffered
                    ? 'bg-emerald-500/40 border-emerald-400'
                    : 'bg-gradient-to-br from-amber-500/40 to-orange-600/40 border-amber-300 animate-pulse'
                }`}
              >
                <span className="text-5xl animate-bounce">🥟</span>
                <span className="text-[9px] font-black text-amber-200 mt-1">
                  {modakOffered ? 'OFFERED' : 'OFFER MODAK'}
                </span>
              </button>
              <div className="mt-3 text-center">
                <span className="text-xs font-bold text-amber-300 block">FINAL BLESSING PRASAD</span>
                <span className="text-[10px] text-amber-200/80">Tap to place sweet Ukadiche Modak at Bappa's feet</span>
              </div>
            </div>
          )}
        </div>

        {/* Final Sanctum Blessing Notification */}
        {modakOffered && (
          <div className="absolute inset-4 bg-amber-950/95 border-2 border-amber-400 rounded-3xl p-5 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-md animate-in zoom-in-90 z-30">
            <span className="text-5xl mb-2 animate-bounce">🙏</span>
            <h4 className="text-amber-300 font-black text-lg">MAHA PUJA COMPLETED!</h4>
            <p className="text-xs text-amber-100 font-medium mt-1">
              Lord Ganesha is deeply pleased and blesses the entire community!
            </p>
            <div className="my-3 p-3 bg-amber-900/60 rounded-2xl border border-amber-500/30 text-xs text-amber-200 italic font-bold">
              "Sukh Karta Dukh Harta Varta Vighnachi... Ganpati Bappa Morya!"
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
              <Sparkles className="w-4 h-4" />
              Day 3 Complete • Grand Finale Unlocked!
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Card */}
      <div className="w-full bg-amber-950/80 rounded-2xl p-3 border border-amber-500/30 text-center">
        <span className="text-xs font-bold text-amber-200">
          {currentStep === 1 && 'Hold wick to kindle the flame'}
          {currentStep === 2 && `Wave Aarti around Bappa: ${3 - aartiCircles} remaining`}
          {currentStep === 3 && `Chant and ring bell: ${5 - bellRings} remaining`}
          {currentStep === 4 && (modakOffered ? '🎉 Blessings Received!' : 'Tap Modak to complete Maha Puja!')}
        </span>
      </div>
    </div>
  );
};
