import React, { useState, useEffect } from 'react';
import { useGame } from '../state/GameContext';
import { soundManager } from '../audio/SoundManager';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { DiyaGlow } from '../components/common/DiyaGlow';
import { GaneshaIdol } from '../components/common/GaneshaIdol';
import { Waves, Sparkles, ArrowRight, Heart } from 'lucide-react';

export const VisarjanScene: React.FC = () => {
  const { state, navigateScreen } = useGame();
  
  // 10-stage emotional progression:
  // Stage 1: Procession reaches the lake.
  // Stage 2: Player prepares final offering.
  // Stage 3: Short peaceful interaction.
  // Stage 4: Begin Visarjan.
  // Stage 5: Gentle symbolic immersion.
  // Stage 6: Water ripple.
  // Stage 7: Floating flowers and diyas.
  // Stage 8: Camera slowly moves upward.
  // Stage 9: GANPATI BAPPA MORYA!
  // Stage 10: FINAL SCORE
  const [stage, setStage] = useState<number>(1);
  const [offeringPlaced, setOfferingPlaced] = useState<{ flowers: boolean; diya: boolean }>({ flowers: false, diya: false });
  const [immersionProgress, setImmersionProgress] = useState<number>(0);

  // Auto-progression for cinematic transitions when applicable
  useEffect(() => {
    let timer: any;
    if (stage === 1) {
      // Allow 3.5s to take in the lake arrival sunset atmosphere
      timer = setTimeout(() => {
        soundManager.playBell();
        setStage(2);
      }, 3500);
    } else if (stage === 5) {
      // Gentle immersion animation over 3.5 seconds
      let p = 0;
      const interval = setInterval(() => {
        p += 5;
        setImmersionProgress(Math.min(p, 85));
        if (p >= 85) {
          clearInterval(interval);
          soundManager.playWater();
          setStage(6);
        }
      }, 150);
      return () => clearInterval(interval);
    } else if (stage === 6) {
      // Water ripples radiating out
      timer = setTimeout(() => {
        setStage(7);
      }, 2500);
    } else if (stage === 7) {
      // Floating diyas and flowers drift across lake
      timer = setTimeout(() => {
        setStage(8);
      }, 3000);
    } else if (stage === 8) {
      // Camera gliding up to starlit twilight sky
      timer = setTimeout(() => {
        soundManager.playFanfare();
        setStage(9);
      }, 3000);
    } else if (stage === 9) {
      // Chanting Morya reveal leading to final score button
      timer = setTimeout(() => {
        setStage(10);
      }, 3500);
    }
    return () => clearTimeout(timer);
  }, [stage]);

  const handleStage2Tap = (type: 'flowers' | 'diya') => {
    soundManager.playBell();
    const updated = { ...offeringPlaced, [type]: true };
    setOfferingPlaced(updated);
    if (updated.flowers && updated.diya) {
      soundManager.playBell();
      setTimeout(() => {
        setStage(3);
      }, 500);
    }
  };

  const handlePrayer = () => {
    soundManager.playBell();
    setStage(4);
  };

  const handleBeginImmersion = () => {
    soundManager.playWater();
    soundManager.playBell();
    setStage(5);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-4 sm:p-6 text-white text-center overflow-hidden select-none">
      {/* Sunset Lake / Twilight Sky Dynamic Background */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ${
          stage >= 8 
            ? 'bg-gradient-to-b from-[#0A051B] via-[#1E0E3D] to-[#0A162B]' 
            : 'bg-gradient-to-b from-[#2E0E3B] via-[#7B2E3D] to-[#0D1E36]'
        }`} 
      />

      {/* Radiant Sunset Sun glow on lake horizon */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[90px] pointer-events-none transition-all duration-1000 ${
        stage >= 8 ? 'bg-indigo-500/20' : 'bg-amber-400/35'
      }`} />

      {/* Floating stars and spark particles in twilight sky */}
      {stage >= 8 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden animate-fadeIn">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-amber-200 rounded-full animate-pulse"
              style={{
                top: `${(i * 19) % 85}%`,
                left: `${(i * 31) % 95}%`,
                opacity: 0.4 + (i % 5) * 0.15,
                animationDelay: `${(i * 0.3)}s`
              }}
            />
          ))}
          {/* Crescent Moon */}
          <div className="absolute top-10 right-8 text-2xl text-amber-200/80 animate-float-slow">
            🌙
          </div>
        </div>
      )}

      {/* Lake water surface & floating offerings */}
      <div className="absolute bottom-0 inset-x-0 h-56 pointer-events-none overflow-hidden">
        {/* Sacred water gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040C1A] via-[#081B33]/85 to-transparent" />

        {/* Concentric ripples during stage 6 & 7 */}
        {(stage === 6 || stage === 7) && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="w-32 h-10 border border-teal-400/60 rounded-full animate-ping" />
            <div className="w-56 h-16 border border-amber-300/40 rounded-full animate-ping mt-[-20px] ml-[-48px]" style={{ animationDelay: '0.4s' }} />
          </div>
        )}

        {/* Floating diyas drifting gently */}
        {(stage >= 2 && offeringPlaced.diya) || stage >= 7 ? (
          <>
            <div className="absolute bottom-12 left-10 animate-float-slow" style={{ animationDelay: '0s' }}>
              <DiyaGlow size={30} lit={true} />
            </div>
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 animate-float-slow" style={{ animationDelay: '1s' }}>
              <DiyaGlow size={36} lit={true} />
            </div>
            <div className="absolute bottom-10 right-12 animate-float-slow" style={{ animationDelay: '2.2s' }}>
              <DiyaGlow size={30} lit={true} />
            </div>
          </>
        ) : null}

        {/* Floating petals */}
        {(stage >= 2 && offeringPlaced.flowers) || stage >= 7 ? (
          <>
            <div className="absolute bottom-8 left-1/4 text-lg animate-float-slow">🌸</div>
            <div className="absolute bottom-16 right-1/4 text-lg animate-float-slow" style={{ animationDelay: '1.2s' }}>🌼</div>
            <div className="absolute bottom-6 right-1/3 text-base animate-float-slow" style={{ animationDelay: '2.4s' }}>🌺</div>
            <div className="absolute bottom-24 left-1/3 text-base animate-float-slow" style={{ animationDelay: '3.1s' }}>🌸</div>
          </>
        ) : null}

        {/* Gentle water wave SVG */}
        <svg className="absolute bottom-0 inset-x-0 w-full h-20 text-teal-900/40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1200 120">
          <path d="M0,0 C150,80 350,-30 500,50 C650,140 900,10 1200,30 L1200,120 L0,120 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Top Header & Stage Tracker */}
      <div className="relative z-10 pt-3 flex flex-col items-center gap-1.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/35 text-[11px] font-black tracking-widest text-amber-300 uppercase shadow-sm">
          <Waves className="w-3.5 h-3.5 text-teal-300" />
          <span>SACRED VISARJAN GHAT • STAGE {stage} / 10</span>
        </div>
      </div>

      {/* Center Cinematic Stage Content */}
      <div className="relative z-10 my-auto py-4 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
        {/* STAGE 1: Procession reaches the lake */}
        {stage === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="mx-auto flex items-center justify-center filter drop-shadow-2xl animate-float-slow">
              <GaneshaIdol
                size={140}
                type={state.selectedIdol || 'festival'}
                showHalo={true}
                showThrone={true}
                showMouse={true}
                animated={true}
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-200 drop-shadow">
              THE PROCESSION REACHES THE SACRED LAKE
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              As the golden sun sets, the devotees gather on the tranquil lake steps to bid Lord Ganesha a loving farewell.
            </p>
            <div className="text-xs text-amber-300/80 italic animate-pulse">
              Arriving at the peaceful lake edge...
            </div>
          </div>
        )}

        {/* STAGE 2: Player prepares final offering */}
        {stage === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg sm:text-xl font-black text-amber-300">
              PREPARE THE FINAL OFFERING
            </h3>
            <p className="text-xs text-slate-200">
              Tap the holy items to place fresh blossoms and light the farewell diya:
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleStage2Tap('flowers')}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                  offeringPlaced.flowers
                    ? 'bg-emerald-950/70 border-emerald-400/60 shadow-lg shadow-emerald-900/30'
                    : 'bg-purple-950/70 border-amber-500/40 hover:scale-105 active:scale-95'
                }`}
              >
                <span className="text-3xl">🌸</span>
                <span className="text-xs font-bold text-amber-100">
                  {offeringPlaced.flowers ? '✓ Blossoms Placed' : 'Offer Blossoms'}
                </span>
              </button>

              <button
                onClick={() => handleStage2Tap('diya')}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                  offeringPlaced.diya
                    ? 'bg-emerald-950/70 border-emerald-400/60 shadow-lg shadow-emerald-900/30'
                    : 'bg-purple-950/70 border-amber-500/40 hover:scale-105 active:scale-95'
                }`}
              >
                <span className="text-3xl">🪔</span>
                <span className="text-xs font-bold text-amber-100">
                  {offeringPlaced.diya ? '✓ Diya Kindled' : 'Kindle Lake Diya'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: Short peaceful interaction (Silent Prayer) */}
        {stage === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-3xl animate-pulse">
              🙏
            </div>
            <h3 className="text-xl font-black text-amber-200">
              A MOMENT OF DEVOTION
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              Fold your hands and whisper your heartfelt prayers into Lord Ganesha's ear.
            </p>
            <AnimatedButton
              variant="gold"
              size="md"
              className="mt-2"
              icon={<Heart className="w-4 h-4 text-rose-500 fill-rose-500" />}
              onClick={handlePrayer}
            >
              OFFER SILENT PRAYER 🙏
            </AnimatedButton>
          </div>
        )}

        {/* STAGE 4: Begin Visarjan */}
        {stage === 4 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="mx-auto flex items-center justify-center filter drop-shadow-2xl">
              <GaneshaIdol
                size={130}
                type={state.selectedIdol || 'festival'}
                showHalo={true}
                showThrone={true}
                showMouse={false}
              />
            </div>
            <h3 className="text-xl font-black text-amber-300">
              READY FOR SACRED IMMERSION
            </h3>
            <p className="text-xs text-slate-200">
              The auspicious moment has arrived. Gently guide Bappa into the blessed waters.
            </p>
            <AnimatedButton
              variant="gold"
              size="lg"
              className="w-full text-base"
              icon={<Waves className="w-5 h-5" />}
              onClick={handleBeginImmersion}
            >
              BEGIN SACRED VISARJAN 🌊
            </AnimatedButton>
          </div>
        )}

        {/* STAGE 5: Gentle symbolic immersion */}
        {stage === 5 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="mx-auto flex items-center justify-center filter drop-shadow-2xl transition-all duration-300">
              <GaneshaIdol
                size={135}
                type={state.selectedIdol || 'festival'}
                immersionDepth={immersionProgress}
                showHalo={false}
                showThrone={true}
                showMouse={false}
              />
            </div>
            <div className="flex justify-center items-center gap-2 text-teal-300 font-bold text-xs animate-pulse">
              <Waves className="w-4 h-4" />
              <span>Gently resting into the sacred lake waters...</span>
            </div>
          </div>
        )}

        {/* STAGE 6: Water ripple */}
        {stage === 6 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-20 h-20 mx-auto rounded-full bg-teal-500/20 border border-teal-300/50 flex items-center justify-center text-3xl animate-pulse">
              🌊
            </div>
            <h3 className="text-xl font-black text-teal-200">
              SACRED RIPPLES OF BLESSINGS
            </h3>
            <p className="text-xs text-slate-200">
              The holy waters receive Lord Ganesha, carrying His divine energy everywhere.
            </p>
          </div>
        )}

        {/* STAGE 7: Floating flowers and diyas */}
        {stage === 7 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-center items-center gap-3 text-3xl animate-bounce">
              <span>🪔</span>
              <span>🌸</span>
              <span>🪔</span>
            </div>
            <h3 className="text-xl font-black text-amber-200">
              THE LAKE ILLUMINATES WITH DEVOTION
            </h3>
            <p className="text-xs text-slate-200">
              Glowing lamps and marigolds drift across the evening water under the twilight breeze.
            </p>
          </div>
        )}

        {/* STAGE 8: Camera slowly moves upward into starry sky */}
        {stage === 8 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-4xl animate-float-slow">✨</div>
            <h3 className="text-xl font-black text-amber-100">
              THE NIGHT SKY SHINES WITH PEACE
            </h3>
            <p className="text-xs text-slate-200">
              Wisdom, joy, and new beginnings rise into the calm twilight evening.
            </p>
          </div>
        )}

        {/* STAGE 9: GANPATI BAPPA MORYA! */}
        {stage === 9 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 p-1 shadow-2xl border-2 border-yellow-300 animate-bounce">
              <div className="w-full h-full rounded-full bg-[#1A0C33] flex items-center justify-center text-4xl">
                🙏
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wider drop-shadow-lg">
              GANPATI BAPPA MORYA!
            </h2>
            <p className="text-sm font-bold text-amber-100">
              "Pudhchya varshi lavkar ya!"
            </p>
            <p className="text-xs text-slate-300 italic">
              Come back soon next year!
            </p>
          </div>
        )}

        {/* STAGE 10: FINAL SCORE & CELEBRATION */}
        {stage === 10 && (
          <div className="space-y-4 animate-fadeIn">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-500 p-1 shadow-2xl animate-pulse">
              <div className="w-full h-full rounded-full bg-[#1A0C33] flex items-center justify-center text-4xl">
                🏆
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wide drop-shadow">
              FESTIVAL CELEBRATION COMPLETE!
            </h2>
            <p className="text-xs text-slate-200 max-w-xs mx-auto leading-relaxed">
              You successfully organized, celebrated, and guided the 4-day Bappa Utsav festival!
            </p>
            <div className="pt-2">
              <AnimatedButton
                variant="gold"
                size="lg"
                className="w-full text-base"
                icon={<ArrowRight className="w-5 h-5" />}
                soundType="fanfare"
                onClick={() => navigateScreen('final_results')}
              >
                VIEW FINAL SCORE & STATS
              </AnimatedButton>
            </div>
          </div>
        )}
      </div>

      {/* Bottom status / Quick progress indicator */}
      <div className="relative z-10 w-full max-w-xs mx-auto pb-2 flex items-center justify-center gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              s === stage
                ? 'w-6 bg-amber-400'
                : s < stage
                ? 'w-2 bg-emerald-400/80'
                : 'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

