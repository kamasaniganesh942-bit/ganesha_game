import React from 'react';
import { GameProvider, useGame } from './state/GameContext';
import { MobileFrame } from './components/layout/MobileFrame';
import { MainMenu } from './screens/MainMenu';
import { StoryIntro } from './screens/StoryIntro';
import { FestivalMap } from './screens/FestivalMap';
import { MiniGameContainer } from './games/MiniGameContainer';
import { DayComplete } from './screens/DayComplete';
import { VisarjanScene } from './screens/VisarjanScene';
import { FinalResults } from './screens/FinalResults';

const ScreenRouter: React.FC = () => {
  const { state } = useGame();

  switch (state.activeScreen) {
    case 'main_menu':
      return <MainMenu />;
    case 'story_intro':
      return <StoryIntro />;
    case 'festival_map':
      return <FestivalMap />;
    case 'mini_game':
      return <MiniGameContainer />;
    case 'day_complete':
      return <DayComplete />;
    case 'visarjan':
      return <VisarjanScene />;
    case 'final_results':
      return <FinalResults />;
    default:
      return <MainMenu />;
  }
};

export default function App() {
  return (
    <GameProvider>
      <MobileFrame>
        <ScreenRouter />
      </MobileFrame>
    </GameProvider>
  );
}
