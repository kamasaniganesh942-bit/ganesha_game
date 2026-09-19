export type DayNumber = 1 | 2 | 3 | 4;

export type GameCategory =
  | 'reaction'
  | 'memory'
  | 'counting'
  | 'matching'
  | 'puzzles'
  | 'sorting'
  | 'rhythm'
  | 'timing'
  | 'observation'
  | 'drag-drop'
  | 'pattern'
  | 'logic';

export interface MiniGameInstructions {
  doing: string;
  howToPlay: string;
  goal: string;
  reward: string;
}

export interface MiniGameMeta {
  id: string;
  gameNumber: number;
  day: DayNumber;
  title: string;
  category: GameCategory;
  icon: string;
  shortDesc: string;
  instructions: MiniGameInstructions;
}

export interface GameCompletionRecord {
  stars: number;
  bestScore: number;
  completed: boolean;
}

export interface FestivalOffer {
  id: string;
  title: string;
  desc: string;
  icon: string;
  rewardScore: number;
  rewardTokens: number;
  progress: number;
  target: number;
  claimed: boolean;
}

export interface GameSettings {
  music: boolean;
  sfx: boolean;
  reducedMotion: boolean;
}

export interface GameState {
  currentDay: DayNumber;
  activeScreen:
    | 'main_menu'
    | 'story_intro'
    | 'festival_map'
    | 'mini_game'
    | 'day_complete'
    | 'visarjan'
    | 'final_results';
  activeGameId: string | null;
  money: number;
  score: number;
  stars: number;
  tokens: number;
  completedGames: Record<string, GameCompletionRecord>;
  completedDays: number[];
  selectedIdol: 'simple' | 'festival' | 'grand' | null;
  purchasedDecorations: string[];
  activeOffers: FestivalOffer[];
  settings: GameSettings;
}

export interface RewardResult {
  performance: 'GOOD' | 'GREAT' | 'PERFECT';
  stars: 1 | 2 | 3;
  score: number;
  tokens: number;
  moneyEarned?: number;
}
