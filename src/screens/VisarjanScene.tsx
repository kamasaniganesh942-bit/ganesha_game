import React, { useState } from 'react';
import { useGame } from '../state/GameContext';
import { soundManager } from '../audio/SoundManager';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { DiyaGlow } from '../components/common/DiyaGlow';
import { GaneshaIdol } from '../components/common/GaneshaIdol';
import { Waves, Sparkles, ArrowRight } from 'lucide-react';

export const VisarjanScene: React.FC = () => {
  const { state, navigateScreen } = useGame();
  const [phase, setPhase] = useState<'intro' | 'immersing' | 'completed'>('intro');

  const handleBeginVisarjan = () => {
    setPhase('immersing');
    soundManager.playWater();
    soundManager.playBell();

    setTimeout(() => {
      soundManager.playFanfare();
      setPhase('completed');
    }, 4000);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-5 sm:p-6 text-white text-center overflow-hidden">
      {/* Sunset Lake Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2E103E] via-[#8D3B43] to-[#122238] pointer-events-none" />

      {/* Radiant Sunset Sun glow on the lake horizon */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-400/40 rounded-full blur-[80px] pointer-events-none" />

      {/* Floating Flowers and Floating Diyas on water surface */}
      <div className="absolute bottom-16 inset-x-0 h-44 pointer-events-none overflow-hidden">
        {/* Water ripples simulation */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06152B]/90 via-[#0B2544]/60 to-transparent" />

        {/* Floating Diyas */}
        <div className="absolute bottom-8 left-8 animate-float-slow" style={{ animationDelay: '0s' }}>
          <DiyaGlow size={34} lit={true} />
        </div>
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 animate-float-slow" style={{ animationDelay: '1.2s' }}>
          <DiyaGlow size={38} lit={true} />
        </div>
        <div className="absolute bottom-10 right-8 animate-float-slow" style={{ animationDelay: '2.5s' }}>
          <DiyaGlow size={32} lit={true} />
        </div>

        {/* Floating Petals */}
        <div className="absolute bottom-6 left-1/4 text-xl animate-float-slow">🌸</div>
        <div className="absolute bottom-16 right-1/4 text-xl animate-float-slow" style={{ animationDelay: '1.5s' }}>🌼</div>
        <div className="absolute bottom-4 right-1/3 text-lg animate-float-slow" style={{ animationDelay: '3s' }}>🌺</div>
      </div>

      {/* Sacred Visarjan Ghat water wave effect */}
      <svg className="absolute bottom-0 inset-x-0 w-full h-24 text-teal-800/40 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1200 120">
        <path d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,120 L0,120 Z" fill="currentColor"></path>
      </svg>

      {/* Top Header */}
      <div className="relative z-10 pt-4">
        <span className="px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-xs font-black tracking-widest text-amber-300 uppercase">
          SACRED VISARJAN GHAT
        </span>
      </div>

      {/* Center Stage */}
      <div className="relative z-10 my-auto py-6">
        {phase === 'intro' && (
          <div className="space-y-4 max-w-sm mx-auto animate-fadeIn">
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
            <h2 className="text-2xl sm:text-3xl font-black text-amber-200 drop-shadow">
              THE FESTIVAL HAS COME TO ITS FINAL MOMENT
            </h2>
            <p className="text-sm text-slate-200 font-medium leading-relaxed">
              With folded hands and joyful memories, the community gathers at the tranquil lake to bid farewell to Lord Ganesha.
            </p>
          </div>
        )}

        {phase === 'immersing' && (
          <div className="space-y-4 max-w-sm mx-auto animate-fadeIn">
            <div className="mx-auto flex items-center justify-center filter drop-shadow-2xl transition-all duration-1000">
              <GaneshaIdol
                size={140}
                type={state.selectedIdol || 'festival'}
                immersionDepth={65}
                showHalo={false}
                showThrone={true}
                showMouse={false}
              />
            </div>
            <div className="flex justify-center items-center gap-2 text-teal-300 font-bold text-sm">
              <Waves className="w-5 h-5 animate-pulse" />
              <span>Gently resting in sacred waters...</span>
            </div>
            <p className="text-xs text-slate-300 italic">
              "Pudhchya varshi lavkar ya!" (Come soon next year!)
            </p>
          </div>
        )}

        {phase === 'completed' && (
          <div className="space-y-4 max-w-xs mx-auto animate-fadeIn">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 p-1 shadow-2xl border-2 border-yellow-300 animate-bounce">
              <div className="w-full h-full rounded-full bg-[#1A0C33] flex items-center justify-center text-5xl">
                🙏
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-amber-300 tracking-wider drop-shadow-lg">
              GANPATI BAPPA MORYA!
            </h2>
            <p className="text-base text-amber-100 font-bold">
              "Until next year."
            </p>
            <p className="text-xs text-slate-300">
              May wisdom, prosperity, and joy remain with you always.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="relative z-10 w-full max-w-xs mx-auto pb-4">
        {phase === 'intro' && (
          <AnimatedButton
            variant="gold"
            size="lg"
            className="w-full text-lg"
            icon={<Waves className="w-5 h-5" />}
            soundType="bell"
            onClick={handleBeginVisarjan}
          >
            BEGIN VISARJAN
          </AnimatedButton>
        )}

        {phase === 'immersing' && (
          <div className="py-3 px-6 rounded-2xl bg-black/40 border border-white/10 text-xs font-bold text-amber-200 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            <span>Immersion Ceremony in progress...</span>
          </div>
        )}

        {phase === 'completed' && (
          <AnimatedButton
            variant="gold"
            size="lg"
            className="w-full text-lg"
            icon={<ArrowRight className="w-5 h-5" />}
            soundType="dhol"
            onClick={() => navigateScreen('final_results')}
          >
            VIEW FINAL RESULTS
          </AnimatedButton>
        )}
      </div>
    </div>
  );
};
