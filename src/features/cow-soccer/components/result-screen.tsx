import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { GameOutcome } from "../types";

interface ResultScreenProps {
  outcome: GameOutcome;
  onDone: () => void;
}

const RESULT_COUNTDOWN_SECONDS = 5;

export default function ResultScreen({ outcome, onDone }: ResultScreenProps) {
  const win = outcome.result === "win";
  const [countdown, setCountdown] = useState(RESULT_COUNTDOWN_SECONDS);

  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (countdown <= 0) onDone();
  }, [countdown, onDone]);

  return (
    <div className="bg-game-gradient relative flex min-h-dvh w-full items-center justify-center overflow-hidden p-6">
      <div
        className="flex w-full max-w-md flex-col items-center gap-4 py-7"
        style={{ animation: "pop-in .4s ease" }}
      >
        <div
          className="text-8xl leading-none"
          style={{ animation: "spin-star 1.2s ease" }}
        >
          {win ? "🏆" : "😵"}
        </div>

        <h1
          className="text-6xl leading-none font-extrabold text-white"
          style={{
            textShadow: `0 4px 0 ${win ? "#1a4d21" : "#8b1e1e"}, 0 8px 20px rgba(0,0,0,.35)`,
          }}
        >
          {win ? "THẮNG!" : "THUA RỒI!"}
        </h1>

        {win && (
          <div
            className="flex flex-col items-center gap-1 rounded-[22px] border-4 px-10 py-5"
            style={{
              borderColor: "#21351f",
              background: "#fff8e7",
              boxShadow: "0 8px 0 #21351f, 0 18px 40px rgba(0,0,0,.35)",
            }}
          >
            <p className="text-[15px] font-bold tracking-wide text-[#7a8a72]">
              ĐIỂM ĐẠT ĐƯỢC
            </p>
            <p className="text-8xl leading-none font-extrabold text-[#2c7a37]">
              {outcome.score}
            </p>
            <p className="text-sm text-[#7a8a72]">
              Đưa màn hình này cho PG để nhận quà 🎁
            </p>
          </div>
        )}

        <Button
          type="button"
          variant="game"
          size="2xl"
          className="w-full"
          onClick={onDone}
        >
          LƯỢT TIẾP THEO ({Math.max(countdown, 0)}s)
        </Button>
      </div>
    </div>
  );
}
