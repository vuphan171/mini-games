import { useMemo, useState } from "react";
import { GAME_SPEED_OPTIONS, type GameSpeed } from "../game-configs/configs";
import { getGameConfig } from "../game-configs/helpers";
import type { Customer, GameOutcome } from "./types";
import { GameScreen, GAME_SCREENS } from "./configs";
import { DEFAULT_GAME_V2_CONFIG, type GameV2Config } from "./configs/game";
import CustomerForm from "./components/customer-form";
import PlayGame from "./components/game-screen";
import ResultScreen from "./components/result-screen";
import TutorialScreen from "./components/tutorial-screen";
import { useNavigate } from "react-router-dom";

const GAME_SPEED_LABELS = Object.fromEntries(
  GAME_SPEED_OPTIONS.map(({ value, label }) => [value, label]),
) as unknown as Record<GameSpeed, GameV2Config["gameSpeed"]>;

const MiniGames = () => {
  const navigate = useNavigate();

  const [screen, setScreen] = useState<GameScreen>(GAME_SCREENS.form);

  const [customer, setCustomer] = useState<Customer | null>(null);

  const [outcome, setOutcome] = useState<GameOutcome | null>({
    playedSeconds: 60,
    result: "win",
    score: 100,
  });

  const gameV2Config = useMemo<GameV2Config>(() => {
    const savedConfig = getGameConfig();
    return {
      ...DEFAULT_GAME_V2_CONFIG,
      pointsPerGrain: savedConfig.pointsPerGrain,
      pointsPerGrass: savedConfig.pointsPerGrass,
      unlimitedTime: savedConfig.unlimitedTime,
      gameSpeed: GAME_SPEED_LABELS[savedConfig.gameSpeed],
      ...(savedConfig.timeLimit != null && {
        timeLimit: savedConfig.timeLimit,
      }),
      ...(savedConfig.winningScore != null && {
        winningScore: savedConfig.winningScore,
      }),
    };
  }, []);

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
          onOpenConfig={(storeId) => {
            navigate(`/configs/${storeId}`);
          }}
        />
      )}
      {screen === GAME_SCREENS.tutorial && (
        <TutorialScreen config={gameV2Config} onStart={startGame} />
      )}
      {screen === GAME_SCREENS.game && (
        <PlayGame config={gameV2Config} onFinish={finishGame} />
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
