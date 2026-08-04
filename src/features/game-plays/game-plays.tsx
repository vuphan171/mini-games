import { useState } from "react";
import GameConfigs from "../game-configs";
import type { Store } from "@/types/store";
import APIService from "@/services/api-service";
import type { Customer, GameOutcome } from "./types";
import { GameScreen, GAME_SCREENS } from "./configs";
import type { GameConfigs as GameConfigsShape } from "./configs/game";
import CustomerForm from "./components/customer-form";
import PlayGame from "./components/game-screen/game-screen";
import ResultScreen from "./components/result-screen";
import TutorialScreen from "./components/tutorial-screen";

const toGameConfigs = (store: Store): GameConfigsShape => ({
  pointsPerGrain: store.pointsPerGrain,
  pointsPerGrass: store.pointsPerGrass,
  unlimitedTime: store.unlimitedTime,
  timeLimit: store.timeLimit,
  winningScore: store.winningScore ?? 0,
  gameSpeed: store.gameSpeed,
});

const RESULT_LABELS: Record<GameOutcome["result"], string> = {
  win: "Win",
  lose_obstacle: "Lose",
  lose_timeout: "Lose",
};

const MiniGames = () => {
  const [screen, setScreen] = useState<GameScreen>(GAME_SCREENS.form);

  const [customer, setCustomer] = useState<Customer | null>(null);

  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const [outcome, setOutcome] = useState<GameOutcome | null>({
    playedSeconds: 60,
    result: "win",
    score: 100,
  });

  const startTutorial = (customer: Customer, store: Store) => {
    setCustomer(customer);
    setSelectedStore(store);
    setScreen(GAME_SCREENS.tutorial);
  };

  const startGame = () => {
    setScreen(GAME_SCREENS.game);
  };

  const finishGame = (result: GameOutcome) => {
    if (!customer) return;
    setOutcome(result);
    setScreen(GAME_SCREENS.result);

    APIService.updateCustomerResult(customer._rowIndex, {
      result: RESULT_LABELS[result.result],
      score: result.score,
    });
  };

  return (
    <div className="font-sans">
      {screen === GAME_SCREENS.form && (
        <CustomerForm
          onStart={startTutorial}
          onOpenConfig={(store) => {
            setSelectedStore(store);
            setScreen(GAME_SCREENS.config);
          }}
        />
      )}
      {screen === GAME_SCREENS.config && selectedStore && (
        <GameConfigs
          store={selectedStore}
          onDone={(data) => {
            setSelectedStore((prev) =>
              prev
                ? {
                    ...prev,
                    pointsPerGrain: data.pointsPerGrain,
                    pointsPerGrass: data.pointsPerGrass,
                    unlimitedTime: data.unlimitedTime,
                    gameSpeed: data.gameSpeed,
                    timeLimit: data.timeLimit ?? prev.timeLimit,
                    winningScore: data.winningScore ?? prev.winningScore,
                  }
                : prev,
            );
            setScreen(GAME_SCREENS.form);
          }}
        />
      )}
      {screen === GAME_SCREENS.tutorial && selectedStore && (
        <TutorialScreen
          config={toGameConfigs(selectedStore)}
          onStart={startGame}
        />
      )}
      {screen === GAME_SCREENS.game && selectedStore && (
        <PlayGame config={toGameConfigs(selectedStore)} onFinish={finishGame} />
      )}
      {screen === GAME_SCREENS.result && outcome && (
        <ResultScreen
          outcome={outcome}
          onDone={() => {
            setScreen(GAME_SCREENS.form);
          }}
        />
      )}
    </div>
  );
};

export default MiniGames;
