import React, { useState } from 'react';
import { useGame } from '../state/GameContext';
import { ALL_MINI_GAMES } from '../data/miniGamesData';
import { RewardResult } from '../types/game';
import { GameHUD } from '../components/layout/GameHUD';
import { TutorialModal } from '../components/common/TutorialModal';
import { RewardModal } from '../components/common/RewardModal';
import { PauseModal } from '../components/modals/PauseModal';
import { SettingsModal } from '../components/modals/SettingsModal';

// Day 1: FUND THE FESTIVAL (Games 1 - 6)
import { NeighborhoodCollection } from './day1/NeighborhoodCollection';
import { CoinCatcher } from './day1/CoinCatcher';
import { MoneyCountingChallenge } from './day1/MoneyCountingChallenge';
import { FestivalBudgetPuzzle } from './day1/FestivalBudgetPuzzle';
import { HiddenContributionHunt } from './day1/HiddenContributionHunt';
import { LuckyDelivery } from './day1/LuckyDelivery';

// Day 2: BUILD THE FESTIVAL (Games 7 - 12)
import { TentConstruction } from './day2/TentConstruction';
import { RangoliCreator } from './day2/RangoliCreator';
import { GarlandMaker } from './day2/GarlandMaker';
import { DecorationPlacement } from './day2/DecorationPlacement';
import { ElectricityPuzzle } from './day2/ElectricityPuzzle';
import { TempleDesignChallenge } from './day2/TempleDesignChallenge';

// Day 3: BRING BAPPA (Games 13 - 18)
import { ChooseTheIdol } from './day3/ChooseTheIdol';
import { MarketNavigation } from './day3/MarketNavigation';
import { IdolCarryingChallenge } from './day3/IdolCarryingChallenge';
import { FlowerOffering } from './day3/FlowerOffering';
import { PujaPrepPuzzle } from './day3/PujaPrepPuzzle';
import { PujaCelebration } from './day3/PujaCelebration';

// Day 4: THE GRAND FINALE (Games 19 - 24)
import { ProcessionPreparation } from './day4/ProcessionPreparation';
import { DholCrowdRhythm } from './day4/DholCrowdRhythm';
import { ProcessionNavigation } from './day4/ProcessionNavigation';
import { FlowerCelebration } from './day4/FlowerCelebration';
import { MemoryJourney } from './day4/MemoryJourney';
import { GrandVisarjanCeremony } from './day4/GrandVisarjanCeremony';

export const MiniGameContainer: React.FC = () => {
  const { state, completeMiniGame, navigateScreen, startMiniGame } = useGame();
  const [showTutorial, setShowTutorial] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [rewardResult, setRewardResult] = useState<RewardResult | null>(null);
  const [gameKey, setGameKey] = useState(0); // for restarting game

  const gameMeta = ALL_MINI_GAMES.find(g => g.id === state.activeGameId);

  if (!gameMeta) {
    return (
      <div className="p-8 text-center text-white">
        <p className="text-red-400">Game not found: {state.activeGameId}</p>
        <button
          onClick={() => navigateScreen('festival_map')}
          className="mt-4 px-4 py-2 bg-amber-500 rounded-xl font-bold"
        >
          Return to Festival Map
        </button>
      </div>
    );
  }

  const handleWin = (result: RewardResult) => {
    completeMiniGame(gameMeta.id, result);

    // Check if this was the final game of the day
    const dayGames = ALL_MINI_GAMES.filter(g => g.day === gameMeta.day);
    const isLastOfDay = dayGames[dayGames.length - 1].id === gameMeta.id;

    if (isLastOfDay) {
      setTimeout(() => {
        navigateScreen('day_complete');
      }, 700);
    } else {
      setRewardResult(result);
    }
  };

  const handleNextGame = () => {
    const currentIndex = ALL_MINI_GAMES.findIndex(g => g.id === gameMeta.id);
    if (currentIndex >= 0 && currentIndex < ALL_MINI_GAMES.length - 1) {
      const nextGame = ALL_MINI_GAMES[currentIndex + 1];
      setRewardResult(null);
      setShowTutorial(true);
      startMiniGame(nextGame.id);
    } else {
      navigateScreen('festival_map');
    }
  };

  const handleRestart = () => {
    setIsPaused(false);
    setRewardResult(null);
    setShowTutorial(false);
    setGameKey(k => k + 1);
  };

  const renderGameComponent = () => {
    switch (gameMeta.id) {
      // Day 1: Fund the Festival (1 - 6)
      case 'neighborhood-collection':
        return <NeighborhoodCollection key={gameKey} onWin={handleWin} />;
      case 'coin-catcher':
        return <CoinCatcher key={gameKey} onWin={handleWin} />;
      case 'money-counting-challenge':
        return <MoneyCountingChallenge key={gameKey} onWin={handleWin} />;
      case 'festival-budget-puzzle':
        return <FestivalBudgetPuzzle key={gameKey} onWin={handleWin} />;
      case 'hidden-contribution-hunt':
        return <HiddenContributionHunt key={gameKey} onWin={handleWin} />;
      case 'lucky-delivery':
        return <LuckyDelivery key={gameKey} onWin={handleWin} />;

      // Day 2: Build the Festival (7 - 12)
      case 'tent-construction':
        return <TentConstruction key={gameKey} onWin={handleWin} />;
      case 'rangoli-creator':
        return <RangoliCreator key={gameKey} onWin={handleWin} />;
      case 'garland-maker':
        return <GarlandMaker key={gameKey} onWin={handleWin} />;
      case 'decoration-placement':
        return <DecorationPlacement key={gameKey} onWin={handleWin} />;
      case 'electricity-puzzle':
        return <ElectricityPuzzle key={gameKey} onWin={handleWin} />;
      case 'temple-design-challenge':
        return <TempleDesignChallenge key={gameKey} onWin={handleWin} />;

      // Day 3: Bring Bappa (13 - 18)
      case 'choose-the-idol':
        return <ChooseTheIdol key={gameKey} onWin={handleWin} />;
      case 'market-navigation':
        return <MarketNavigation key={gameKey} onWin={handleWin} />;
      case 'idol-carrying-challenge':
        return <IdolCarryingChallenge key={gameKey} onWin={handleWin} />;
      case 'flower-offering':
        return <FlowerOffering key={gameKey} onWin={handleWin} />;
      case 'puja-prep-puzzle':
        return <PujaPrepPuzzle key={gameKey} onWin={handleWin} />;
      case 'puja-celebration':
        return <PujaCelebration key={gameKey} onWin={handleWin} />;

      // Day 4: The Grand Finale (19 - 24)
      case 'procession-preparation':
        return <ProcessionPreparation key={gameKey} onWin={handleWin} />;
      case 'dhol-crowd-rhythm':
        return <DholCrowdRhythm key={gameKey} onWin={handleWin} />;
      case 'procession-navigation':
        return <ProcessionNavigation key={gameKey} onWin={handleWin} />;
      case 'flower-celebration':
        return <FlowerCelebration key={gameKey} onWin={handleWin} />;
      case 'memory-journey':
        return <MemoryJourney key={gameKey} onWin={handleWin} />;
      case 'grand-visarjan-ceremony':
        return <GrandVisarjanCeremony key={gameKey} onWin={handleWin} />;

      default:
        return <div className="text-white p-4">Mini-game loading...</div>;
    }
  };

  const currentIndex = ALL_MINI_GAMES.findIndex(g => g.id === gameMeta.id);
  const hasNext = currentIndex >= 0 && currentIndex < ALL_MINI_GAMES.length - 1;

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#0E061B]">
      {/* Top HUD */}
      <GameHUD
        showDay={true}
        onPause={() => setIsPaused(true)}
        onReplay={handleRestart}
        onBack={() => navigateScreen('festival_map')}
      />

      {/* Mini-Game Gameplay Viewport */}
      <div className="flex-1 flex flex-col justify-center p-3 sm:p-4 max-w-md mx-auto w-full">
        {renderGameComponent()}
      </div>

      {/* Tutorial Modal (shown before starting) */}
      {showTutorial && (
        <TutorialModal
          game={gameMeta}
          onStart={() => setShowTutorial(false)}
        />
      )}

      {/* Pause Modal */}
      {isPaused && (
        <PauseModal
          onResume={() => setIsPaused(false)}
          onRestart={handleRestart}
          onMap={() => {
            setIsPaused(false);
            navigateScreen('festival_map');
          }}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {/* Settings Modal (from pause) */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}

      {/* Reward / Victory Modal */}
      {rewardResult && (
        <RewardModal
          result={rewardResult}
          hasNextGame={hasNext}
          onNext={handleNextGame}
          onReplay={handleRestart}
          onMap={() => {
            setRewardResult(null);
            navigateScreen('festival_map');
          }}
        />
      )}
    </div>
  );
};
