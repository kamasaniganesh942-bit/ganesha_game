import React, { useState } from 'react';
import { useGame } from '../state/GameContext';
import { GameHUD } from '../components/layout/GameHUD';
import { ALL_MINI_GAMES } from '../data/miniGamesData';
import { DayNumber, MiniGameMeta } from '../types/game';
import { AnimatedButton } from '../components/common/AnimatedButton';
import { Lock, CheckCircle2, ChevronDown, ChevronUp, Play, Star, RotateCcw } from 'lucide-react';

interface DayConfig {
  day: DayNumber;
  title: string;
  subtitle: string;
  icon: string;
  badgeColor: string;
  borderGlow: string;
  totalGames: number;
}

const DAYS_CONFIG: DayConfig[] = [
  {
    day: 1,
    title: 'FUND THE FESTIVAL',
    subtitle: 'Collect ₹500 from neighborhood for Bappa',
    icon: '💰',
    badgeColor: 'from-amber-500 to-orange-600',
    borderGlow: 'border-amber-400 shadow-amber-500/30',
    totalGames: 6
  },
  {
    day: 2,
    title: 'BUILD THE FESTIVAL',
    subtitle: 'Construct mandap, rangoli, garlands & lights',
    icon: '🏮',
    badgeColor: 'from-orange-500 to-rose-600',
    borderGlow: 'border-orange-400 shadow-orange-500/30',
    totalGames: 6
  },
  {
    day: 3,
    title: 'BRING BAPPA & PUJA',
    subtitle: 'Choose idol, bring home & sacred rituals',
    icon: '🐘',
    badgeColor: 'from-pink-500 to-purple-600',
    borderGlow: 'border-pink-400 shadow-pink-500/30',
    totalGames: 6
  },
  {
    day: 4,
    title: 'THE GRAND FINALE',
    subtitle: 'Dhol tasha, flower celebration & lake Visarjan',
    icon: '🌅',
    badgeColor: 'from-teal-500 to-cyan-600',
    borderGlow: 'border-teal-400 shadow-teal-500/30',
    totalGames: 6
  }
];

export const FestivalMap: React.FC = () => {
  const { state, navigateScreen, startMiniGame } = useGame();
  const [expandedDay, setExpandedDay] = useState<DayNumber>(state.currentDay);

  const getDayStatus = (dayNum: DayNumber) => {
    const isCompleted = state.completedDays.includes(dayNum);
    const isCurrent = state.currentDay === dayNum;
    const isUnlocked = dayNum <= state.currentDay || state.completedDays.includes((dayNum - 1) as DayNumber);

    if (isCompleted) return 'COMPLETE';
    if (isUnlocked) return 'PLAY';
    return 'LOCKED';
  };

  const getDayProgress = (dayNum: DayNumber) => {
    const dayGames = ALL_MINI_GAMES.filter(g => g.day === dayNum);
    const completedCount = dayGames.filter(g => state.completedGames[g.id]?.completed).length;
    return {
      completed: completedCount,
      total: dayGames.length
    };
  };

  const handlePlayFirstAvailableInDay = (dayNum: DayNumber) => {
    const dayGames = ALL_MINI_GAMES.filter(g => g.day === dayNum);
    const uncompleted = dayGames.find(g => !state.completedGames[g.id]?.completed);
    if (uncompleted) {
      startMiniGame(uncompleted.id);
    } else if (dayGames.length > 0) {
      startMiniGame(dayGames[0].id);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0F071D] text-white">
      <GameHUD showDay={false} onBack={() => navigateScreen('main_menu')} />

      {/* Map Header */}
      <div className="px-4 pt-4 pb-2 text-center">
        <h2 className="text-2xl font-black text-amber-300 tracking-wider">
          FESTIVAL MAP
        </h2>
        <p className="text-xs text-slate-300">
          Four Days. 24 Celebrations. One Divine Festival!
        </p>
      </div>

      {/* Scrollable Day Path List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 max-w-md mx-auto w-full pb-8">
        {DAYS_CONFIG.map((dayCfg, index) => {
          const status = getDayStatus(dayCfg.day);
          const isLocked = status === 'LOCKED';
          const isComplete = status === 'COMPLETE';
          const isExpanded = expandedDay === dayCfg.day;
          const progress = getDayProgress(dayCfg.day);
          const dayGames = ALL_MINI_GAMES.filter(g => g.day === dayCfg.day);

          return (
            <div key={dayCfg.day} className="relative">
              {/* Connecting Path Line between days */}
              {index > 0 && (
                <div className="flex justify-center -mt-4 mb-0.5">
                  <div className={`w-1 h-6 rounded-full ${
                    !isLocked ? 'bg-gradient-to-b from-amber-400 to-orange-500 animate-pulse' : 'bg-slate-700'
                  }`} />
                </div>
              )}

              {/* Day Card */}
              <div
                className={`relative rounded-3xl p-4.5 border transition-all duration-300 shadow-xl overflow-hidden ${
                  isExpanded
                    ? 'bg-gradient-to-b from-[#2A154A] to-[#1A0C30] border-amber-400 shadow-amber-500/20'
                    : isLocked
                    ? 'bg-[#150B24]/80 border-white/5 opacity-60'
                    : 'bg-[#200F38] border-white/10 hover:border-amber-400/40'
                }`}
              >
                {/* Header Row */}
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => !isLocked && setExpandedDay(isExpanded ? (0 as DayNumber) : dayCfg.day)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${dayCfg.badgeColor} p-0.5 shadow-md flex items-center justify-center text-2xl`}>
                      <span className="p-2">{dayCfg.icon}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-400 tracking-wider">
                          DAY {dayCfg.day}
                        </span>
                        {isComplete ? (
                          <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                            <CheckCircle2 className="w-3 h-3" /> COMPLETE
                          </span>
                        ) : isLocked ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded-full bg-slate-800">
                            <Lock className="w-3 h-3" /> LOCKED
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-black text-amber-300 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40">
                            <Play className="w-3 h-3 fill-current" /> ACTIVE
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-black text-white leading-tight mt-0.5">
                        {dayCfg.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-1">{dayCfg.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-xs font-black text-amber-300">
                        {progress.completed} / {progress.total}
                      </div>
                      <div className="text-[10px] text-slate-400">GAMES</div>
                    </div>
                    {!isLocked && (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar inside Card */}
                <div className="mt-3 w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                  />
                </div>

                {/* Expanded Mini-Games List */}
                {isExpanded && !isLocked && (
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-200">SELECT MINI-GAME:</span>
                      <AnimatedButton
                        variant="gold"
                        size="sm"
                        icon={<Play className="w-3.5 h-3.5 fill-current" />}
                        onClick={() => handlePlayFirstAvailableInDay(dayCfg.day)}
                      >
                        PLAY NEXT
                      </AnimatedButton>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {dayGames.map((game) => {
                        const record = state.completedGames[game.id];
                        const isGameDone = record?.completed;

                        return (
                          <div
                            key={game.id}
                            onClick={() => startMiniGame(game.id)}
                            className={`p-3 rounded-2xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                              isGameDone
                                ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400'
                                : 'bg-white/5 border-white/10 hover:border-amber-400/50 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-xl shrink-0">{game.icon}</span>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                                  <span>{game.gameNumber}.</span>
                                  <span>{game.title}</span>
                                </div>
                                <div className="text-[11px] text-slate-400 truncate">
                                  {game.shortDesc}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* Stars & Replay */}
                              {isGameDone ? (
                                <div className="flex items-center gap-2">
                                  <div className="flex text-xs text-amber-400">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${i < (record?.stars || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-[10px] font-bold text-emerald-300 px-2 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center gap-1 hover:bg-emerald-500/30 shadow-sm">
                                    <RotateCcw className="w-3 h-3" /> REPLAY
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[11px] font-bold text-amber-300 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center gap-1">
                                  <Play className="w-3 h-3 fill-current" /> PLAY
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
