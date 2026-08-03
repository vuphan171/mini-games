import { useState } from "react";
import GameConfigs from "../game-configs";
import type { Store } from "@/types/store";
import type { Customer, GameOutcome } from "./types";
import { GameScreen, GAME_SCREENS } from "./configs";
import CustomerForm from "./components/customer-form";
import PlayGame from "./components/game-screen";
import ResultScreen from "./components/result-screen";
import TutorialScreen from "./components/tutorial-screen";

const MiniGames = () => {
  const [screen, setScreen] = useState<GameScreen>(GAME_SCREENS.form);

  const [customer, setCustomer] = useState<Customer | null>(null);

  const [configStore, setConfigStore] = useState<Store | null>(null);

  const [outcome, setOutcome] = useState<GameOutcome | null>({
    playedSeconds: 60,
    result: "win",
    score: 100,
  });

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
        <CustomerForm
          onStart={startTutorial}
          onOpenConfig={(store) => {
            setConfigStore(store);
            setScreen(GAME_SCREENS.config);
          }}
        />
      )}
      {screen === GAME_SCREENS.config && configStore && (
        <GameConfigs
          store={configStore}
          onDone={() => setScreen(GAME_SCREENS.form)}
        />
      )}
      {screen === GAME_SCREENS.tutorial && (
        <TutorialScreen config={buildGameV2Config()} onStart={startGame} />
      )}
      {screen === GAME_SCREENS.game && (
        <PlayGame config={buildGameV2Config()} onFinish={finishGame} />
      )}
      {screen === GAME_SCREENS.result && outcome && (
        <ResultScreen
          outcome={outcome}
          onDone={() => {
            // setScreen(GAME_SCREENS.form);
          }}
        />
      )}
    </div>
  );
};

export default MiniGames;
