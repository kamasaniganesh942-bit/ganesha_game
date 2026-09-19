import React, { useState } from 'react';
import { useGame } from '../state/GameContext';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { ArrowRight, Sparkles, Map } from 'lucide-react';

const STORY_STEPS = [
  {
    icon: '✨',
    title: 'Ganesh Chaturthi is here!',
    subtitle: 'The auspicious season of happiness and devotion begins.',
    graphic: '🏮 🌸 🪔',
    color: 'from-amber-500 to-orange-600'
  },
  {
    icon: '🏡',
    title: 'Our neighborhood wants to celebrate together.',
    subtitle: 'Families, elders, and kids are all excited to welcome Bappa.',
    graphic: '👨‍👩‍👧‍👦 🏘️ 🤝',
    color: 'from-orange-500 to-pink-600'
  },
  {
    icon: '🪵',
    title: 'But first, we need to prepare everything.',
    subtitle: 'Collecting donations, erecting the pandal, creating decorations, and cooking modaks!',
    graphic: '🪙 🎨 🥟',
    color: 'from-pink-600 to-purple-600'
  },
  {
    icon: '🐘',
    title: 'Four days. One celebration.',
    subtitle: 'Join your friends across 24 unique festive celebrations to make this the best Utsav ever!',
    graphic: '🥁 🌺 🌊',
    color: 'from-purple-600 to-amber-600'
  }
];

export const StoryIntro: React.FC = () => {
  const { navigateScreen } = useGame();
  const [currentStep, setCurrentStep] = useState(0);

  const step = STORY_STEPS[currentStep];
  const isLastStep = currentStep === STORY_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      navigateScreen('festival_map');
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-5 sm:p-6 text-white overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-b ${step.color} opacity-20 transition-all duration-700 pointer-events-none`} />

      {/* Top Header with Skip */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex gap-1.5">
          {STORY_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-8 bg-amber-400' : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => navigateScreen('festival_map')}
          className="text-xs font-bold text-amber-300/80 hover:text-amber-200 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all"
        >
          SKIP
        </button>
      </div>

      {/* Center Story Card */}
      <div className="relative z-10 my-auto text-center py-6">
        {/* Animated Badge Icon */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 p-1 shadow-2xl shadow-orange-500/40 mb-6 animate-float-slow">
          <div className="w-full h-full rounded-2xl bg-[#1D0C38] flex items-center justify-center text-5xl">
            {step.icon}
          </div>
        </div>

        {/* Narrative text */}
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-wide drop-shadow-md">
          {step.title}
        </h2>

        <p className="text-sm sm:text-base text-amber-100/80 font-medium max-w-xs mx-auto leading-relaxed mb-6">
          {step.subtitle}
        </p>

        {/* Graphic Pill */}
        <div className="inline-block px-5 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-2xl tracking-widest shadow-inner">
          {step.graphic}
        </div>
      </div>

      {/* Bottom Action Area */}
      <div className="relative z-10 w-full max-w-xs mx-auto pb-4">
        <AnimatedButton
          variant={isLastStep ? 'gold' : 'primary'}
          size="lg"
          className="w-full text-lg"
          icon={isLastStep ? <Sparkles className="w-5 h-5 fill-current" /> : <ArrowRight className="w-5 h-5" />}
          soundType={isLastStep ? 'dhol' : 'click'}
          onClick={handleNext}
        >
          {isLastStep ? 'START' : 'NEXT'}
        </AnimatedButton>
      </div>
    </div>
  );
};
