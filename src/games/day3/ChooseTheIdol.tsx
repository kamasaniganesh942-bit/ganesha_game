import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { useGame } from '../../state/GameContext';
import { soundManager } from '../../audio/SoundManager';
import { GaneshaIdol } from '../../components/common/GaneshaIdol';
import { Sparkles, Check, Crown, Flame, Flower2, Heart } from 'lucide-react';

interface ChooseTheIdolProps {
  onWin: (result: RewardResult) => void;
}

interface IdolBase {
  id: 'simple' | 'festival' | 'grand';
  name: string;
  price: number;
  tag: string;
  desc: string;
}

const IDOL_BASES: IdolBase[] = [
  {
    id: 'simple',
    name: 'Shadu River Clay (Eco)',
    price: 300,
    tag: '100% ECO-FRIENDLY',
    desc: 'Pure earthen clay from holy rivers. Dissolves cleanly back into nature.'
  },
  {
    id: 'festival',
    name: 'Festive Pandal Murti',
    price: 400,
    tag: 'MOST POPULAR',
    desc: 'Artisan hand-sculpted traditional murti with classic pitambar dhoti.'
  },
  {
    id: 'grand',
    name: 'Grand Raja Throne Murti',
    price: 500,
    tag: 'ROYAL SPLENDOR',
    desc: 'Majestic Lalbaug-style murti seated upon an ornate royal throne.'
  }
];

export const ChooseTheIdol: React.FC<ChooseTheIdolProps> = ({ onWin }) => {
  const { state, selectIdol } = useGame();

  const [selectedType, setSelectedType] = useState<'simple' | 'festival' | 'grand'>('festival');
  const [selectedSilk, setSelectedSilk] = useState<'saffron' | 'rose' | 'gold'>('saffron');
  const [hasCrown, setHasCrown] = useState(true);
  const [hasTilak, setHasTilak] = useState(true);
  const [hasGarland, setHasGarland] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState<'clay' | 'attire' | 'adornments'>('clay');

  const currentBase = IDOL_BASES.find(b => b.id === selectedType)!;

  const handleSelectClay = (type: 'simple' | 'festival' | 'grand') => {
    soundManager.playClick();
    setSelectedType(type);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    soundManager.playBell();
    soundManager.playFanfare();

    const cost = Math.min(state.money, currentBase.price);
    selectIdol(currentBase.id, cost);

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
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto p-3 sm:p-4 select-none">
      {/* Top Banner */}
      <div className="w-full bg-amber-950/80 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30 flex items-center justify-between shadow-lg">
        <div>
          <h3 className="text-amber-300 font-black text-xs tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            MAKE & ADORN THE GANESHA IDOL
          </h3>
          <p className="text-[11px] text-amber-100/70">Artisan Sculpting Studio</p>
        </div>

        <div className="bg-amber-900/80 px-3 py-1 rounded-xl border border-amber-500/40 text-center">
          <span className="text-[10px] text-amber-300/80 block uppercase font-bold">Funds</span>
          <span className="text-sm font-black text-emerald-400">₹{state.money}</span>
        </div>
      </div>

      {/* Main Live Idol Crafting Canvas */}
      <div className="relative w-full aspect-[4/5] my-2 bg-gradient-to-b from-amber-950/70 via-stone-900 to-amber-950 rounded-3xl border-2 border-amber-500/40 p-4 flex flex-col items-center justify-center shadow-2xl overflow-hidden">
        {/* Sacred Temple Sanctum Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-72 h-72 rounded-full border-4 border-dashed border-amber-400 animate-spin-slow" />
        </div>

        {/* Live Dynamic Ganesha Idol Vector Artwork */}
        <div className="relative z-10 animate-float-slow flex items-center justify-center">
          <GaneshaIdol
            size={220}
            type={selectedType}
            silkColor={selectedSilk}
            showHalo={true}
            showThrone={true}
            showMouse={true}
            animated={true}
          />
        </div>

        {/* Dynamic Name Plaque */}
        <div className="z-10 mt-2 text-center bg-amber-950/80 px-4 py-1.5 rounded-full border border-amber-400/40 shadow-lg">
          <span className="text-xs font-black text-amber-300 uppercase tracking-widest">
            {currentBase.name}
          </span>
          <span className="text-xs font-black text-emerald-400 ml-2">₹{currentBase.price}</span>
        </div>

        {/* Celebration Pop-up on Consecration */}
        {confirmed && (
          <div className="absolute inset-4 bg-amber-950/95 border-2 border-amber-400 rounded-3xl p-5 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-md animate-in zoom-in-90 z-30">
            <span className="text-5xl mb-2 animate-bounce">🙏</span>
            <h4 className="text-amber-300 font-black text-lg">IDOL CONSECRATED!</h4>
            <p className="text-xs text-amber-100 font-medium mt-1">
              Lord Ganesha is lovingly crafted and welcomed by the community!
            </p>
            <div className="my-3 p-3 bg-amber-900/60 rounded-2xl border border-amber-500/30 text-xs text-amber-200 italic font-bold">
              "Ganpati Bappa Morya! Mangal Murti Morya!"
            </div>
          </div>
        )}
      </div>

      {/* Crafting / Making Tabs */}
      <div className="w-full bg-amber-950/80 rounded-2xl p-3 border border-amber-500/30 flex flex-col gap-2.5">
        {/* Navigation Sub-Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
          {[
            { id: 'clay', label: '1. CLAY BASE' },
            { id: 'attire', label: '2. SILK STOLE' },
            { id: 'adornments', label: '3. ORNAMENTS' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-amber-950 shadow-md font-black'
                  : 'text-amber-200/70 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Clay Base Options */}
        {activeTab === 'clay' && (
          <div className="grid grid-cols-3 gap-2">
            {IDOL_BASES.map(b => (
              <button
                key={b.id}
                onClick={() => handleSelectClay(b.id)}
                className={`p-2 rounded-xl border text-center transition flex flex-col items-center justify-between min-h-[64px] ${
                  selectedType === b.id
                    ? 'bg-amber-500/30 border-amber-400 ring-2 ring-amber-400 text-amber-200'
                    : 'bg-amber-900/40 border-amber-600/30 text-amber-200/70 hover:border-amber-400/50'
                }`}
              >
                <span className="text-base">{b.id === 'simple' ? '🌿' : b.id === 'festival' ? '✨' : '👑'}</span>
                <span className="text-[9px] font-black leading-tight line-clamp-1 mt-0.5">{b.name.split(' ')[0]}</span>
                <span className="text-[10px] font-black text-amber-400">₹{b.price}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tab 2: Silk Angavastra Stole Colors */}
        {activeTab === 'attire' && (
          <div className="flex items-center justify-around gap-2 py-1">
            {[
              { id: 'saffron', name: 'Royal Saffron', icon: '🟠', bg: 'bg-orange-600' },
              { id: 'rose', name: 'Rose Pink', icon: '🌸', bg: 'bg-rose-600' },
              { id: 'gold', name: 'Temple Gold', icon: '🟡', bg: 'bg-yellow-500' }
            ].map(s => (
              <button
                key={s.id}
                onClick={() => {
                  soundManager.playBell();
                  setSelectedSilk(s.id as any);
                }}
                className={`flex-1 py-2 px-1 rounded-xl border flex flex-col items-center gap-1 transition ${
                  selectedSilk === s.id
                    ? 'bg-amber-500/30 border-amber-300 ring-2 ring-amber-400 shadow-md scale-105'
                    : 'bg-black/30 border-white/10 opacity-70'
                }`}
              >
                <div className={`w-7 h-7 rounded-full ${s.bg} border-2 border-white shadow-inner flex items-center justify-center text-sm`}>
                  {s.icon}
                </div>
                <span className="text-[9px] font-bold text-amber-200">{s.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tab 3: Sacred Ornaments */}
        {activeTab === 'adornments' && (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                soundManager.playBell();
                setHasCrown(c => !c);
              }}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition ${
                hasCrown ? 'bg-amber-500/30 border-amber-300 text-amber-200' : 'bg-black/30 border-white/10 opacity-60'
              }`}
            >
              <Crown className="w-5 h-5 text-amber-300" />
              <span className="text-[9px] font-bold mt-1">Mukut Crown</span>
              <span className="text-[8px] text-emerald-400 font-black">ADORNED</span>
            </button>

            <button
              onClick={() => {
                soundManager.playBell();
                setHasTilak(t => !t);
              }}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition ${
                hasTilak ? 'bg-amber-500/30 border-amber-300 text-amber-200' : 'bg-black/30 border-white/10 opacity-60'
              }`}
            >
              <Flame className="w-5 h-5 text-red-400" />
              <span className="text-[9px] font-bold mt-1">Holy Tilak</span>
              <span className="text-[8px] text-emerald-400 font-black">PAINTED</span>
            </button>

            <button
              onClick={() => {
                soundManager.playBell();
                setHasGarland(g => !g);
              }}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition ${
                hasGarland ? 'bg-amber-500/30 border-amber-300 text-amber-200' : 'bg-black/30 border-white/10 opacity-60'
              }`}
            >
              <Flower2 className="w-5 h-5 text-rose-400" />
              <span className="text-[9px] font-bold mt-1">Flower Mala</span>
              <span className="text-[8px] text-emerald-400 font-black">OFFERED</span>
            </button>
          </div>
        )}

        {/* Master Confirmation Button */}
        <button
          onClick={handleConfirm}
          disabled={confirmed}
          className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-amber-950 font-black text-xs sm:text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition"
        >
          <Sparkles className="w-4 h-4" />
          {confirmed ? 'BAPPA IS CONSECRATED!' : `CONSECRATE & WELCOME BAPPA 🙏`}
        </button>
      </div>
    </div>
  );
};
