import { useState } from "react";
import { DEFAULT_CONFIG, type GameConfig } from "../../configs";
import type { Customer, GameOutcome } from "./types";
import { GameScreen, GAME_SCREENS } from "./configs";
import CustomerForm from "./components/customer-form";
import PlayGame from "./components/game-screen-v2";
import ResultScreen from "./components/result-screen";
import TutorialScreen from "./components/tutorial-screen";

const MiniGames = () => {
  const [screen, setScreen] = useState<GameScreen>(GAME_SCREENS.form);
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [outcome, setOutcome] = useState<GameOutcome | null>(null);

  const startTutorial = (info: Customer) => {
    setCustomer(info);
    setScreen(GAME_SCREENS.tutorial);
  };

  const startGame = () => {
    setScreen(GAME_SCREENS.game);
  };

  const finishGame = (result: GameOutcome) => {
    if (!customer) return;
    setOutcome(result);
    setScreen(GAME_SCREENS.result);
  };

  return (
    <div className="font-sans">
      {screen === GAME_SCREENS.form && (
        <CustomerForm onStart={startTutorial} onOpenConfig={() => {}} />
      )}
      {screen === GAME_SCREENS.tutorial && (
        <TutorialScreen config={config} onStart={startGame} />
      )}
      {screen === GAME_SCREENS.game && <PlayGame onFinish={finishGame} />}
      {screen === GAME_SCREENS.result && outcome && (
        <ResultScreen
          outcome={outcome}
          onDone={() => setScreen(GAME_SCREENS.form)}
        />
      )}
    </div>
  );
};

export default MiniGames;
