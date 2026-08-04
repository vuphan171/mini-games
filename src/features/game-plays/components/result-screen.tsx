import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getRewardTier } from "../configs/reward-tiers";
import type { GameOutcome } from "../types";
import CowWin from "@/assets/logos/cow-win.png";
import CowLose from "@/assets/logos/cow-lose.png";
import GiftShirt from "@/assets/logos/gift-shirt.png";
import GiftKeyChain from "@/assets/logos/gift-keychain.png";
import GiftSocks from "@/assets/logos/gift-socks.png";

interface Props {
  outcome: GameOutcome;
  onDone: () => void;
}

const RESULT_COUNTDOWN_SECONDS = 500;

const GIFT_IMAGES: Record<string, string> = {
  Vớ: GiftSocks,
  "Móc Khoá": GiftKeyChain,
  Áo: GiftShirt,
};

const ResultScreen = ({ outcome, onDone }: Props) => {
  const [countdown, setCountdown] = useState(RESULT_COUNTDOWN_SECONDS);

  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (countdown <= 0) onDone();
  }, [countdown, onDone]);

  const isWin = outcome.result !== "lose_obstacle";
  const tier = isWin ? getRewardTier(outcome.score) : null;

  return (
    <div className="relative min-h-dvh flex w-full items-center justify-center overflow-hidden p-6">
      <div className="flex w-full max-w-xl md:max-w-2xl mt-20 md:mt-0 flex-col items-center rounded-3xl p-6 bg-white shadow-card md:p-10 lg:p-14">
        <div className="mb-6">
          <img
            width={175}
            height={175}
            src={isWin ? CowWin : CowLose}
            alt="Cow Holding Ball"
            fetchPriority="high"
            loading="eager"
            decoding="sync"
          />
        </div>
        <p
          className={`text-6xl font-extrabold ${isWin ? "text-win" : "text-danger"}`}
        >
          {isWin ? "CHIẾN THẮNG!" : "THUA RỒI!"}
        </p>
        <div className="rounded-xl border w-full flex border-brand-tertiary divide-x divide-brand-tertiary">
          <div className="flex-1">
            <div className="bg-brand-tertiary px-3 py-2 rounded-tl-xl">
              <p className="text-xl text-center text-white uppercase font-extrabold tracking-normal">
                Số điểm đạt được
              </p>
            </div>
            <div className="flex items-center justify-center p-10">
              <p className="text-7xl text-brand-tertiary font-extrabold tracking-normal">
                {outcome.score}
              </p>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-brand-tertiary px-3 py-2 rounded-tr-xl">
              <p className="text-xl text-center text-white uppercase font-extrabold tracking-normal">
                Quà tặng nhận được
              </p>
            </div>
            <div className="flex items-center justify-center p-10">
              {tier ? (
                <img
                  width={80}
                  height={80}
                  src={GIFT_IMAGES[tier.result]}
                  alt={tier.result}
                />
              ) : (
                <p className="text-2xl text-foreground font-semibold">
                  Không có
                </p>
              )}
            </div>
          </div>
        </div>

        <Button type="submit" size="2xl" variant="game" className="mt-6 w-full">
          LƯỢT TIẾP THEO {countdown}s
        </Button>
      </div>
    </div>
  );
};

export default ResultScreen;
