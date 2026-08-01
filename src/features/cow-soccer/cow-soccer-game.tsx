import { useState } from "react";
import { DEFAULT_CONFIG, type GameConfig } from "../../configs";
import CustomerForm from "./components/customer-form";
import GameScreenV2 from "./components/game-screen-v2";
import ResultScreen from "./components/result-screen";
import TutorialScreen from "./components/tutorial-screen";
import type { Customer, GameOutcome } from "./types";

type Screen = "form" | "tutorial" | "game" | "result";

export default function CowSoccerGame() {
  const [screen, setScreen] = useState<Screen>("form");
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [outcome, setOutcome] = useState<GameOutcome | null>(null);

  const startTutorial = (info: Customer) => {
    setCustomer(info);
    setScreen("tutorial");
  };

  const startGame = () => {
    setScreen("game");
  };

  const finishGame = (result: GameOutcome) => {
    if (!customer) return;
    setOutcome(result);
    setScreen("result");
  };

  return (
    <div className="font-sans">
      {screen === "form" && (
        <CustomerForm onStart={startTutorial} onOpenConfig={() => {}} />
      )}
      {screen === "tutorial" && (
        <TutorialScreen config={config} onStart={startGame} />
      )}
      {screen === "game" && <GameScreenV2 onFinish={finishGame} />}
      {screen === "result" && outcome && (
        <ResultScreen outcome={outcome} onDone={() => setScreen("form")} />
      )}
    </div>
  );
}
