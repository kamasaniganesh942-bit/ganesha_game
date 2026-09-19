import React, { useState } from 'react';
import { RewardResult } from '../../types/game';
import { soundManager } from '../../audio/SoundManager';
import { ComboBadge } from '../../components/common/ComboBadge';
import { Home, Store, Trees, Building2, CheckCircle2, Sparkles, Coins } from 'lucide-react';

interface NeighborhoodCollectionProps {
  onWin: (result: RewardResult) => void;
}

type LocationId = 'house' | 'shop' | 'center' | 'park';

interface LocationInfo {
  id: LocationId;
  name: string;
  icon: React.ReactNode;
  subtitle: string;
  completed: boolean;
  amount: number;
}

export const NeighborhoodCollection: React.FC<NeighborhoodCollectionProps> = ({ onWin }) => {
  const [activeTab, setActiveTab] = useState<LocationId>('house');
  const [completedLocs, setCompletedLocs] = useState<Record<LocationId, boolean>>({
    house: false,
    shop: false,
    center: false,
    park: false,
  });

  const [collectedMoney, setCollectedMoney] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [floatingText, setFloatingText] = useState<{ text: string; id: number } | null>(null);

  // House interaction state: 3 envelopes
  const [houseEnvelopeChosen, setHouseEnvelopeChosen] = useState<number | null>(null);

  // Shop interaction state: 3 coins to tap
  const [shopCoinsCollected, setShopCoinsCollected] = useState<number[]>([]);

  // Community Hall interaction state
  const [centerTapped, setCenterTapped] = useState(false);

  // Park interaction state
  const [parkFound, setParkFound] = useState(false);

  const locations: LocationInfo[] = [
    {
      id: 'house',
      name: 'Sharma House',
      icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />,
      subtitle: 'Pick a family envelope',
      completed: completedLocs.house,
      amount: 120,
    },
    {
      id: 'shop',
      name: 'Corner Shop',
      icon: <Store className="w-4 h-4 sm:w-5 sm:h-5" />,
      subtitle: 'Tally shop earnings',
      completed: completedLocs.shop,
      amount: 130,
    },
    {
      id: 'center',
      name: 'Community Hall',
      icon: <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />,
      subtitle: 'Society group fund',
      completed: completedLocs.center,
      amount: 150,
    },
    {
      id: 'park',
      name: 'Neighborhood Park',
      icon: <Trees className="w-4 h-4 sm:w-5 sm:h-5" />,
      subtitle: "Find kids' savings",
      completed: completedLocs.park,
      amount: 100,
    },
  ];

  const triggerReward = (locId: LocationId, amount: number) => {
    soundManager.playCoin();
    const nextCombo = combo + 1;
    setCombo(nextCombo);
    setScore(s => s + amount * 3 * nextCombo);

    const nextMoney = collectedMoney + amount;
    setCollectedMoney(nextMoney);

    setFloatingText({ text: `+₹${amount}`, id: Date.now() });
    setTimeout(() => setFloatingText(null), 900);

    const updated = { ...completedLocs, [locId]: true };
    setCompletedLocs(updated);

    // Check if target ₹500 reached
    if (Object.values(updated).filter(Boolean).length === 4 || nextMoney >= 500) {
      soundManager.playFanfare();
      setTimeout(() => {
        onWin({
          performance: 'PERFECT',
          stars: 3,
          score: score + 500,
          tokens: 25,
          moneyEarned: nextMoney,
        });
      }, 400);
    }
  };

  // 1. House: Choose 1 of 3 festive envelopes
  const handlePickEnvelope = (envIdx: number) => {
    if (completedLocs.house || houseEnvelopeChosen !== null) return;
    setHouseEnvelopeChosen(envIdx);
    triggerReward('house', 120);
  };

  // 2. Shop: Tap 3 coins on the counter (₹50, ₹50, ₹30)
  const handleTapShopCoin = (coinIdx: number) => {
    if (completedLocs.shop || shopCoinsCollected.includes(coinIdx)) return;
    soundManager.playCoin();
    const updated = [...shopCoinsCollected, coinIdx];
    setShopCoinsCollected(updated);

    if (updated.length === 3) {
      triggerReward('shop', 130);
    }
  };

  // 3. Community Hall: Tap donation box
  const handleTapCenterBox = () => {
    if (completedLocs.center || centerTapped) return;
    setCenterTapped(true);
    triggerReward('center', 150);
  };

  // 4. Park: Tap sparkling bush to find piggy bank
  const handleTapParkBush = () => {
    if (completedLocs.park || parkFound) return;
    setParkFound(true);
    triggerReward('park', 100);
  };

  const completedCount = Object.values(completedLocs).filter(Boolean).length;
  const progressPercent = Math.min(100, Math.round((collectedMoney / 500) * 100));

  return (
    <div className="relative w-full flex-1 flex flex-col justify-between bg-[#140A28] rounded-3xl border border-amber-500/30 overflow-hidden select-none p-3 sm:p-4 min-h-[460px] max-h-[580px]">
      <ComboBadge combo={combo} />

      {/* Top Game HUD Bar */}
      <div className="space-y-1.5 z-10">
        <div className="flex justify-between items-center bg-black/45 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-bold">
          <div className="flex items-center gap-1 text-teal-300 font-black">
            <Coins className="w-3.5 h-3.5 text-teal-400" />
            <span>₹{collectedMoney} / ₹500</span>
          </div>
          <div className="text-amber-300">
            {completedCount} / 4 LOCATIONS
          </div>
          <div className="text-yellow-300">
            ⭐ {score}
          </div>
        </div>

        {/* Collection Meter Progress Bar */}
        <div className="w-full h-2 rounded-full bg-black/60 border border-teal-500/30 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 4 Location Selector Tabs */}
      <div className="grid grid-cols-4 gap-1.5 my-2 z-10">
        {locations.map(loc => {
          const isActive = loc.id === activeTab;
          return (
            <button
              key={loc.id}
              onClick={() => {
                soundManager.playClick();
                setActiveTab(loc.id);
              }}
              className={`p-1.5 sm:p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-amber-500/25 border-amber-400 text-amber-200 scale-102 shadow-md shadow-amber-500/30'
                  : loc.completed
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <div className="relative">
                {loc.icon}
                {loc.completed && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 absolute -top-1 -right-1 bg-black rounded-full" />
                )}
              </div>
              <span className="text-[9px] font-black mt-1 truncate w-full text-center">
                {loc.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Main Stage Card */}
      <div className="relative flex-1 flex flex-col justify-center items-center p-4 rounded-2xl bg-gradient-to-b from-[#220F3E] via-[#1A0B30] to-[#120722] border border-amber-500/35 text-center overflow-hidden">
        {/* Floating Number Overlay */}
        {floatingText && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 text-2xl sm:text-3xl font-black text-amber-300 drop-shadow-lg animate-bounce">
            {floatingText.text} 🪙
          </div>
        )}

        {/* 1. Sharma House: Choose an envelope */}
        {activeTab === 'house' && (
          <div className="space-y-3 w-full">
            <div className="text-3xl animate-bounceSubtle">👵</div>
            <h4 className="text-base font-black text-amber-200">Sharma Residence</h4>
            <p className="text-xs text-amber-100/80 max-w-xs mx-auto">
              Dadi has prepared 3 festive donation envelopes. Tap one to reveal the family's contribution!
            </p>

            <div className="flex justify-center gap-3 pt-2">
              {[0, 1, 2].map(idx => {
                const isPicked = houseEnvelopeChosen === idx;
                const isHouseDone = completedLocs.house;
                return (
                  <button
                    key={idx}
                    onClick={() => handlePickEnvelope(idx)}
                    disabled={isHouseDone}
                    className={`w-18 h-22 sm:w-20 sm:h-24 rounded-2xl p-2 flex flex-col items-center justify-center border-2 transition-all transform ${
                      isPicked
                        ? 'bg-gradient-to-b from-amber-400 to-yellow-500 text-slate-900 border-yellow-200 scale-105 shadow-xl'
                        : isHouseDone
                        ? 'bg-white/5 border-white/10 text-slate-500 opacity-50 cursor-not-allowed'
                        : 'bg-pink-950/50 border-pink-400/50 hover:border-pink-300 active:scale-95 text-pink-200 shadow-md'
                    }`}
                  >
                    <span className="text-3xl">{isPicked ? '🎁' : '✉️'}</span>
                    <span className="text-[10px] font-black mt-1">
                      {isPicked ? '₹120' : `Envelope ${idx + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Corner Shop: Tap the 3 coins */}
        {activeTab === 'shop' && (
          <div className="space-y-3 w-full">
            <div className="text-3xl animate-bounceSubtle">👨‍🍳</div>
            <h4 className="text-base font-black text-amber-200">Corner Sweet Shop</h4>
            <p className="text-xs text-amber-100/80 max-w-xs mx-auto">
              Mithaiwala Kaka placed shop earnings on the sweets counter. Tap all 3 coins to collect!
            </p>

            <div className="flex justify-center items-center gap-3 pt-2">
              {[
                { idx: 0, val: 50 },
                { idx: 1, val: 50 },
                { idx: 2, val: 30 },
              ].map(coin => {
                const isTaken = shopCoinsCollected.includes(coin.idx);
                return (
                  <button
                    key={coin.idx}
                    onClick={() => handleTapShopCoin(coin.idx)}
                    disabled={isTaken}
                    className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex flex-col items-center justify-center border-2 transition-all transform ${
                      isTaken
                        ? 'bg-emerald-900/40 border-emerald-400 text-emerald-300 scale-90 opacity-60'
                        : 'bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-500 text-slate-900 border-yellow-200 shadow-lg hover:scale-105 active:scale-95'
                    }`}
                  >
                    <span className="text-xl">🪙</span>
                    <span className="text-[11px] font-black">{isTaken ? '✓' : `₹${coin.val}`}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Community Hall: Tap box */}
        {activeTab === 'center' && (
          <div className="space-y-3 w-full">
            <div className="text-3xl animate-bounceSubtle">🏢</div>
            <h4 className="text-base font-black text-amber-200">Community Hall</h4>
            <p className="text-xs text-amber-100/80 max-w-xs mx-auto">
              The 4 residential society floors have pooled their festival fund. Tap the donation box to open!
            </p>

            <div className="pt-2">
              <button
                onClick={handleTapCenterBox}
                disabled={completedLocs.center}
                className={`px-6 py-4 rounded-2xl border-2 transition-all transform flex flex-col items-center mx-auto shadow-xl ${
                  completedLocs.center
                    ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300'
                    : 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 border-amber-300 hover:scale-105 active:scale-95 text-white'
                }`}
              >
                <span className="text-4xl mb-1">{completedLocs.center ? '🔓' : '📦'}</span>
                <span className="text-xs font-black">
                  {completedLocs.center ? 'SOCIETY FUND: ₹150 RECEIVED' : 'OPEN SOCIETY BOX (+₹150)'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* 4. Park: Tap sparkling spot */}
        {activeTab === 'park' && (
          <div className="space-y-3 w-full">
            <div className="text-3xl animate-bounceSubtle">🌳</div>
            <h4 className="text-base font-black text-amber-200">Neighborhood Park</h4>
            <p className="text-xs text-amber-100/80 max-w-xs mx-auto">
              Aarav and the kids saved their pocket money all month. Tap the sparkling bush to find their piggy bank!
            </p>

            <div className="flex justify-center gap-4 pt-2">
              <div className="text-3xl p-3 opacity-40">🌿</div>
              <button
                onClick={handleTapParkBush}
                disabled={completedLocs.park}
                className={`p-3.5 rounded-2xl border-2 transition-all transform flex flex-col items-center shadow-xl ${
                  completedLocs.park
                    ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300'
                    : 'bg-emerald-900/60 border-emerald-400 animate-pulse hover:scale-105 active:scale-95 text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className="text-3xl">{completedLocs.park ? '🐷' : '✨'}</span>
                  <span className="text-3xl">🌺</span>
                </div>
                <span className="text-[11px] font-black mt-1">
                  {completedLocs.park ? "KIDS' SAVINGS: ₹100" : "TAP TO FIND (+₹100)"}
                </span>
              </button>
              <div className="text-3xl p-3 opacity-40">🌿</div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Feedback Bar */}
      <div className="z-10 text-center py-1">
        {completedCount === 4 || collectedMoney >= 500 ? (
          <div className="text-xs font-black text-emerald-300 flex items-center justify-center gap-1.5 animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>🎉 TARGET REACHED: ₹500 COLLECTED!</span>
          </div>
        ) : (
          <p className="text-[11px] text-amber-300/80 font-bold">
            Tap on each neighborhood location above to complete all 4 collections!
          </p>
        )}
      </div>
    </div>
  );
};
