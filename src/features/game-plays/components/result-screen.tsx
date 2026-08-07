import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@/components/ui/button";
import {
  getRewardTier,
  RewardResults,
  type RewardResult,
} from "../configs/reward-tiers";
import { CELEBRATION_LOTTIE_SRC } from "../configs/celebration";
import type { GameOutcome } from "../types";
import CowWin from "@/assets/logos/cow-win.png";
import CowLose from "@/assets/logos/cow-lose.png";
import GiftShirt from "@/assets/logos/gift-shirt.png";
import GiftKeyChain from "@/assets/logos/gift-keychain.png";
import GiftBall from "@/assets/logos/gift-ball.png";
import AppLogo from "@/assets/logos/app-logo.png";
import { cn, formatVietnamesePhone } from "@/lib/utils";

interface Props {
  outcome: GameOutcome;
  onDone: () => void;
}

const getGiftImage = (result: RewardResult): string => {
  switch (result) {
    case RewardResults.keyChain:
      return GiftKeyChain;
    case RewardResults.shirt:
      return GiftShirt;
    case RewardResults.ball:
      return GiftBall;
  }
};

const ResultScreen = ({ outcome, onDone }: Props) => {
  const isWin = outcome.result !== "lose_obstacle";
  const tier = getRewardTier(outcome.score);

  return (
    <div className="relative min-h-dvh flex w-full items-center justify-center overflow-hidden p-6">
      {isWin && (
        <DotLottieReact
          src={CELEBRATION_LOTTIE_SRC}
          loop
          autoplay
          className="pointer-events-none absolute inset-0 h-full w-full"
        />
      )}
      <div className="flex w-full max-w-xl md:max-w-2xl mt-20 md:mt-0 flex-col items-center rounded-3xl p-6 bg-white shadow-card md:p-10 lg:p-14">
        <div className="mb-6 flex items-center">
          <img
            width="auto"
            height={100}
            src={AppLogo}
            className="h-32 w-auto"
            alt="App Logo"
            {...{ fetchpriority: "high" }}
            loading="eager"
            decoding="sync"
          />
          <img
            width={175}
            height={175}
            src={isWin ? CowWin : CowLose}
            alt="Cow Holding Ball"
            {...{ fetchpriority: "high" }}
            loading="eager"
            decoding="sync"
          />
        </div>
        <p
          className={`text-6xl font-extrabold ${isWin ? "text-win" : "text-lose"}`}
        >
          {isWin ? "CHIẾN THẮNG!" : "THUA RỒI!"}
        </p>
        <p className="mt-3 text-4xl font-semibold text-muted-foreground">
          {outcome.fullName} · {formatVietnamesePhone(outcome.phoneNumber)}
        </p>
        <div className="mt-8 rounded-xl border w-full flex border-brand-tertiary divide-x divide-brand-tertiary">
          <div className="flex-1 flex flex-col">
            <div className="bg-brand-tertiary px-3 py-2 rounded-tl-xl">
              <p className="text-xl text-center text-white uppercase font-extrabold tracking-normal">
                Số điểm đạt được
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center p-3">
              <p
                className={cn(
                  "text-8xl text-brand-tertiary font-extrabold tracking-normal",
                  { "text-lose-secondary": !isWin },
                )}
              >
                {outcome.score}
              </p>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="bg-brand-tertiary px-3 py-2 rounded-tr-xl">
              <p className="text-xl text-center text-white uppercase font-extrabold tracking-normal">
                Quà tặng nhận được
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center p-3">
              <img
                width={80}
                height={80}
                src={getGiftImage(tier.result)}
                alt={tier.result}
              />
            </div>
          </div>
        </div>

        {isWin === false && (
          <p className="mt-4 text-2xl font-semibold text-lose-secondary text-center">
            HÃY CỐ GẮNG HƠN Ở LƯỢT SAU NHÉ!
          </p>
        )}

        <Button
          type="submit"
          size="2xl"
          variant="game"
          onClick={onDone}
          className="mt-6 w-fit px-10"
        >
          LƯỢT TIẾP THEO
        </Button>
      </div>
    </div>
  );
};

export default ResultScreen;
