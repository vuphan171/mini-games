import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CowWin from "@/assets/logos/cow-win.png";
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
    <div className="relative min-h-dvh flex w-full items-center justify-center overflow-hidden p-6">
      <div className="flex w-full max-w-xl md:max-w-2xl mt-20 md:mt-0 flex-col items-center rounded-3xl p-6 bg-white shadow-card md:p-10 lg:p-14">
        <div className="mb-6">
          <img
            width={175}
            height={175}
            src={CowWin}
            alt="Cow Holding Ball"
            fetchPriority="high"
            loading="eager"
            decoding="sync"
          />
        </div>

        <p className="text-win text-6xl font-extrabold">CHIẾN THẮNG!</p>

        <p className="text-9xl text-brand-tertiary font-extrabold tracking-normal">
          50
        </p>

        <p className="text-foreground text-3xl font-semibold uppercase">
          ĐIỂM BẠN ĐÃ ĐẠT ĐƯỢC
        </p>
        <Button type="submit" size="2xl" variant="game" className="mt-6 w-full">
          LƯỢT TIẾP THEO 5s
        </Button>
      </div>
    </div>
  );
}
