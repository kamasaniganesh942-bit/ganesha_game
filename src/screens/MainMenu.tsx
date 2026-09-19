import React, { useState } from 'react';
import { useGame } from '../state/GameContext';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { DiyaGlow } from '../components/common/DiyaGlow';
import { SettingsModal } from '../components/modals/SettingsModal';
import { RewardShopModal } from '../components/modals/RewardShopModal';
import { OffersModal } from '../components/modals/OffersModal';
import { HowToPlayModal } from '../components/modals/HowToPlayModal';
import { Play, Map, Gift, BookOpen, Settings, ShoppingBag, Trophy } from 'lucide-react';
import { GaneshaIdol } from '../components/common/GaneshaIdol';

export const MainMenu: React.FC = () => {
  const { navigateScreen } = useGame();
  const [activeModal, setActiveModal] = useState<'settings' | 'shop' | 'offers' | 'help' | null>(null);

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
      {/* Decorative Night Sky Background with Temple Silhouette & Lanterns */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Evening Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#170B2F] via-[#210D3D] to-[#0D041A]" />

        {/* Ambient Warm Temple Light Aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/25 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-600/20 rounded-full blur-[80px]" />

        {/* Hanging Festive Lanterns / Lights at top */}
        <div className="absolute top-0 inset-x-0 flex justify-around px-4 opacity-80">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-0.5 h-6 sm:h-9 bg-amber-400/40" />
              <div
                className="w-4 h-4 rounded-full bg-amber-300 shadow-[0_0_12px_#FFD700] animate-pulse"
                style={{ animationDelay: `${i * 300}ms` }}
              />
            </div>
          ))}
        </div>

        {/* Floating Flower Petals */}
        <div className="absolute inset-0">
          {[
            { left: '10%', top: '20%', delay: '0s', duration: '7s' },
            { left: '85%', top: '15%', delay: '1.5s', duration: '8s' },
            { left: '25%', top: '65%', delay: '3s', duration: '6s' },
            { left: '75%', top: '75%', delay: '2s', duration: '9s' },
            { left: '45%', top: '85%', delay: '4s', duration: '7.5s' }
          ].map((petal, idx) => (
            <div
              key={idx}
              className="absolute text-base opacity-70 animate-float-slow select-none"
              style={{
                left: petal.left,
                top: petal.top,
                animationDelay: petal.delay,
                animationDuration: petal.duration
              }}
            >
              🌸
            </div>
          ))}
        </div>

        {/* Temple Silhouette at the bottom */}
        <svg
          viewBox="0 0 500 180"
          className="absolute bottom-0 inset-x-0 w-full h-auto opacity-20 text-amber-500 fill-current"
          preserveAspectRatio="none"
        >
          <path d="M0 180 L0 140 L50 140 L70 110 L100 110 L120 70 L150 70 L160 30 L170 30 L175 0 L180 30 L190 30 L200 70 L230 70 L250 110 L280 110 L300 140 L350 140 L370 90 L390 90 L400 40 L410 0 L420 40 L430 90 L450 90 L470 140 L500 140 L500 180 Z" />
        </svg>
      </div>

      {/* Top Bar: Diyas & Quick Actions */}
      <header className="relative z-10 flex items-center justify-between pt-2">
        <DiyaGlow size={42} lit={true} />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModal('shop')}
            aria-label="Open Reward Shop"
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-pink-300 border border-pink-400/30 flex items-center justify-center shadow-lg transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveModal('settings')}
            aria-label="Open Settings"
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-amber-300 border border-amber-400/30 flex items-center justify-center shadow-lg transition-all"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
        <DiyaGlow size={42} lit={true} />
      </header>

      {/* Center: Grand Festival Title & Mascot */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto py-6">
        {/* Sacred Ganesha Idol Showcase */}
        <div className="relative mb-2 animate-float-slow flex items-center justify-center">
          <GaneshaIdol
            size={165}
            type="festival"
            silkColor="saffron"
            showHalo={true}
            showThrone={true}
            showMouse={true}
            animated={true}
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-display">
          BAPPA UTSAV
        </h1>

        {/* Tagline */}
        <p className="mt-1 text-sm sm:text-base font-bold text-amber-200 tracking-widest uppercase flex items-center gap-2">
          <span>🏮</span> Four Days. One Celebration. <span>🏮</span>
        </p>

        <div className="mt-3 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-slate-300 backdrop-blur-sm">
          A Joyful Ganesh Chaturthi Adventure
        </div>
      </div>

      {/* Bottom Menu Buttons Area */}
      <div className="relative z-10 w-full max-w-xs mx-auto space-y-2.5 pb-4">
        {/* Main PLAY Button */}
        <AnimatedButton
          variant="gold"
          size="lg"
          className="w-full text-xl shadow-orange-500/50 tracking-wider font-black"
          icon={<Play className="w-6 h-6 fill-current" />}
          soundType="dhol"
          onClick={() => navigateScreen('story_intro')}
        >
          ▶ PLAY
        </AnimatedButton>

        {/* Festival Map */}
        <AnimatedButton
          variant="primary"
          size="md"
          className="w-full font-bold"
          icon={<Map className="w-5 h-5" />}
          onClick={() => navigateScreen('festival_map')}
        >
          🗺 FESTIVAL MAP
        </AnimatedButton>

        {/* Sub-actions: REWARDS & HOW TO PLAY */}
        <div className="grid grid-cols-2 gap-2">
          <AnimatedButton
            variant="accent"
            size="sm"
            className="text-xs"
            icon={<Trophy className="w-4 h-4 text-yellow-300" />}
            onClick={() => setActiveModal('shop')}
          >
            🏆 REWARDS
          </AnimatedButton>

          <AnimatedButton
            variant="secondary"
            size="sm"
            className="text-xs"
            icon={<BookOpen className="w-4 h-4 text-amber-300" />}
            onClick={() => setActiveModal('help')}
          >
            📖 HOW TO PLAY
          </AnimatedButton>
        </div>

        {/* Settings Button */}
        <AnimatedButton
          variant="secondary"
          size="sm"
          className="w-full text-xs text-slate-300 hover:text-white"
          icon={<Settings className="w-4 h-4" />}
          onClick={() => setActiveModal('settings')}
        >
          ⚙ SETTINGS
        </AnimatedButton>
      </div>

      {/* Modals */}
      {activeModal === 'settings' && <SettingsModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'shop' && <RewardShopModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'offers' && <OffersModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'help' && <HowToPlayModal onClose={() => setActiveModal(null)} />}
    </div>
  );
};
