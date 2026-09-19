import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GameState, DayNumber, GameSettings, RewardResult, FestivalOffer } from '../types/game';
import { INITIAL_OFFERS } from '../data/miniGamesData';
import { soundManager } from '../audio/SoundManager';

const STORAGE_KEY = 'bappa_utsav_save_v1';

const DEFAULT_STATE: GameState = {
  currentDay: 1,
  activeScreen: 'main_menu',
  activeGameId: null,
  money: 0,
  score: 0,
  stars: 0,
  tokens: 20, // Welcome gift tokens
  completedGames: {},
  completedDays: [],
  selectedIdol: null,
  purchasedDecorations: [],
  activeOffers: INITIAL_OFFERS,
  settings: {
    music: true,
    sfx: true,
    reducedMotion: false,
  },
};

interface GameContextType {
  state: GameState;
  navigateScreen: (screen: GameState['activeScreen']) => void;
  startMiniGame: (gameId: string) => void;
  completeMiniGame: (gameId: string, result: RewardResult) => void;
  advanceDay: (nextDay: DayNumber) => void;
  buyShopItem: (itemId: string, cost: number) => boolean;
  selectIdol: (idol: 'simple' | 'festival' | 'grand', cost: number) => boolean;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  claimOffer: (offerId: string) => void;
  incrementOfferProgress: (offerId: string, amount?: number) => void;
  resetGameProgress: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.currentDay === 'number') {
          return {
            ...DEFAULT_STATE,
            ...parsed,
            // Ensure offers exist and have right schema
            activeOffers: parsed.activeOffers?.length ? parsed.activeOffers : INITIAL_OFFERS,
            settings: { ...DEFAULT_STATE.settings, ...parsed.settings }
          };
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved game state, falling back to default:', e);
    }
    return DEFAULT_STATE;
  });

  // Keep soundManager in sync with settings
  useEffect(() => {
    soundManager.updateSettings(state.settings.sfx, state.settings.music);
  }, [state.settings.sfx, state.settings.music]);

  // Persist state changes with 250ms debounce to prevent disk lag on rapid taps
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn('Failed to save game state to localStorage:', e);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [state]);

  const navigateScreen = useCallback((screen: GameState['activeScreen']) => {
    soundManager.playClick();
    setState(prev => ({
      ...prev,
      activeScreen: screen,
      activeGameId: screen === 'mini_game' ? prev.activeGameId : null
    }));
  }, []);

  const startMiniGame = useCallback((gameId: string) => {
    soundManager.playClick();
    setState(prev => ({
      ...prev,
      activeScreen: 'mini_game',
      activeGameId: gameId
    }));
  }, []);

  const incrementOfferProgress = useCallback((offerId: string, amount = 1) => {
    setState(prev => {
      const updatedOffers = prev.activeOffers.map(offer => {
        if (offer.id === offerId) {
          const nextProgress = Math.min(offer.target, offer.progress + amount);
          return { ...offer, progress: nextProgress };
        }
        return offer;
      });
      return { ...prev, activeOffers: updatedOffers };
    });
  }, []);

  const claimOffer = useCallback((offerId: string) => {
    setState(prev => {
      const targetOffer = prev.activeOffers.find(o => o.id === offerId);
      if (!targetOffer || targetOffer.claimed || targetOffer.progress < targetOffer.target) {
        return prev;
      }
      soundManager.playFanfare();
      const updatedOffers = prev.activeOffers.map(o =>
        o.id === offerId ? { ...o, claimed: true } : o
      );
      return {
        ...prev,
        score: prev.score + targetOffer.rewardScore,
        tokens: prev.tokens + targetOffer.rewardTokens,
        activeOffers: updatedOffers
      };
    });
  }, []);

  const completeMiniGame = useCallback((gameId: string, result: RewardResult) => {
    soundManager.playFanfare();
    setState(prev => {
      const prevRecord = prev.completedGames[gameId];
      const starsEarned = Math.max(prevRecord?.stars || 0, result.stars);
      const bestScore = Math.max(prevRecord?.bestScore || 0, result.score);

      const addedStars = result.stars - (prevRecord?.stars || 0);
      const starDiff = Math.max(0, addedStars);

      const updatedCompletedGames = {
        ...prev.completedGames,
        [gameId]: {
          stars: starsEarned,
          bestScore,
          completed: true
        }
      };

      // Check general festival offer (complete 3 mini-games)
      const updatedOffers = prev.activeOffers.map(offer => {
        if (offer.id === 'offer-festival') {
          return { ...offer, progress: Math.min(offer.target, offer.progress + 1) };
        }
        return offer;
      });

      return {
        ...prev,
        score: prev.score + result.score,
        tokens: prev.tokens + result.tokens,
        money: prev.money + (result.moneyEarned || 0),
        stars: prev.stars + starDiff,
        completedGames: updatedCompletedGames,
        activeOffers: updatedOffers
      };
    });
  }, []);

  const advanceDay = useCallback((nextDay: DayNumber) => {
    setState(prev => {
      const completedDaysSet = new Set(prev.completedDays);
      completedDaysSet.add(prev.currentDay);
      return {
        ...prev,
        currentDay: nextDay,
        completedDays: Array.from(completedDaysSet),
        activeScreen: 'festival_map'
      };
    });
  }, []);

  const buyShopItem = useCallback((itemId: string, cost: number): boolean => {
    let success = false;
    setState(prev => {
      if (prev.tokens >= cost && !prev.purchasedDecorations.includes(itemId)) {
        soundManager.playCoin();
        success = true;
        return {
          ...prev,
          tokens: prev.tokens - cost,
          purchasedDecorations: [...prev.purchasedDecorations, itemId]
        };
      }
      soundManager.playError();
      return prev;
    });
    return success;
  }, []);

  const selectIdol = useCallback((idol: 'simple' | 'festival' | 'grand', cost: number): boolean => {
    let success = false;
    setState(prev => {
      if (prev.money >= cost) {
        soundManager.playFanfare();
        success = true;
        return {
          ...prev,
          selectedIdol: idol,
          money: prev.money - cost
        };
      }
      soundManager.playError();
      return prev;
    });
    return success;
  }, []);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    soundManager.playClick();
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings
      }
    }));
  }, []);

  const resetGameProgress = useCallback(() => {
    soundManager.playClick();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
    setState(DEFAULT_STATE);
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        navigateScreen,
        startMiniGame,
        completeMiniGame,
        advanceDay,
        buyShopItem,
        selectIdol,
        updateSettings,
        claimOffer,
        incrementOfferProgress,
        resetGameProgress
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
