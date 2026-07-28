import { useState } from "react";
import { DEFAULT_CONFIG, type GameConfig } from "../../configs";
import ConfigPanel from "./components/config-panel";
import CustomerForm from "./components/customer-form";
import GameScreen from "./components/game-screen";
import ResultScreen from "./components/result-screen";
import type { Customer, GameOutcome, PlayRecord } from "./types";

type Screen = "form" | "game" | "result";

export default function CowSoccerGame() {
  const [screen, setScreen] = useState<Screen>("form");
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [records, setRecords] = useState<PlayRecord[]>([]);
  const [lastRecord, setLastRecord] = useState<PlayRecord | null>(null);
  const [showConfig, setShowConfig] = useState(false);

  const startGame = (info: Customer) => {
    setCustomer(info);
    setScreen("game");
  };

  const finishGame = (result: GameOutcome) => {
    if (!customer) return;
    const record: PlayRecord = {
      ...customer,
      score: result.score,
      result: result.result,
      playedSeconds: result.playedSeconds,
      durationConfig: config.duration,
      playedAt: new Date().toLocaleString("vi-VN"),
    };
    // === Điểm nối Drive sau này: thay dòng dưới bằng call API ghi 1 dòng vào file chung ===
    setRecords((rs) => [record, ...rs]);
    setLastRecord(record);
    setScreen("result");
  };

  return (
    <div className="font-sans">
      {screen === "form" && <CustomerForm onStart={startGame} onOpenConfig={() => setShowConfig(true)} />}
      {screen === "game" && <GameScreen config={config} onFinish={finishGame} />}
      {screen === "result" && lastRecord && <ResultScreen record={lastRecord} onDone={() => setScreen("form")} />}
      {showConfig && (
        <ConfigPanel config={config} setConfig={setConfig} records={records} onClose={() => setShowConfig(false)} />
      )}
    </div>
  );
}
