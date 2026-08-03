import { useEffect } from "react";
import { useCountdown } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import type { GameV2Config } from "../configs/game-v2";
import Grains from "@/assets/logos/grains.png";
import CowRun from "@/assets/logos/cow-run.png";
import Grass from "@/assets/logos/grass.png";
import Virus from "@/assets/logos/virus.png";
import Referee from "@/assets/logos/referee.png";
import Vaccine from "@/assets/logos/vaccine.png";
import GiftShirt from "@/assets/logos/gift-shirt.png";
import GiftKeyChain from "@/assets/logos/gift-keychain.png";
import GiftSocks from "@/assets/logos/gift-socks.png";
import IcHand from "@/assets/logos/ic-hand.png";
import IcArrow from "@/assets/logos/ic-arrow.png";

const COUNTDOWN_SECONDS = 30;

const IMG_PROPS = {
  fetchPriority: "high",
  loading: "eager",
  decoding: "sync",
} as const;

const SCORING_ITEMS = [
  {
    src: Grains,
    alt: "Ngũ cốc",
    width: 48,
    height: 66,
    label: "Ăn Ngũ Cốc\n+10 Điểm",
  },
  {
    src: Grass,
    alt: "Cỏ",
    width: 63,
    height: 40,
    label: "Ăn Cỏ\n+10 Điểm",
  },
];

const GIFTS = [
  { src: GiftSocks, alt: "Quà tặng vớ", label: "0 - 50 điểm" },
  { src: GiftKeyChain, alt: "Quà tặng móc khóa", label: "51 - 80 điểm" },
  { src: GiftShirt, alt: "Quà tặng áo", label: "81 - 100 điểm" },
];

const HAZARDS = [
  { src: Virus, alt: "Virus" },
  { src: Referee, alt: "Trọng tài" },
  { src: Vaccine, alt: "Vắc-xin" },
];

interface Props {
  config: GameV2Config;
  onStart: () => void;
}

export default function TutorialScreen({ onStart }: Props) {
  const [count, { startCountdown }] = useCountdown({
    countStart: COUNTDOWN_SECONDS,
    intervalMs: 1000,
  });

  useEffect(() => {
    startCountdown();
  }, [startCountdown]);

  useEffect(() => {
    if (count === 0) onStart();
  }, [count, onStart]);

  const renderLeft = () => (
    <section className="flex-1 rounded-2xl border border-brand-tertiary">
      <header className="rounded-t-2xl bg-brand-tertiary p-3">
        <h3 className="text-center text-xl font-semibold uppercase text-white">
          Vật phẩm tích điểm &amp; Quà Tặng
        </h3>
      </header>

      <div className="flex items-start gap-2 px-3 py-5">
        <ul className="space-y-4">
          {SCORING_ITEMS.map(({ src, alt, width, height, label }) => (
            <li key={alt} className="flex items-center gap-4">
              <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                {...IMG_PROPS}
              />
              <p className="whitespace-pre-line text-base font-bold leading-snug text-foreground">
                {label}
              </p>
            </li>
          ))}
        </ul>

        <ul className="flex items-center">
          {GIFTS.map(({ src, alt, label }) => (
            <li key={alt} className="flex flex-col items-center">
              <img src={src} alt={alt} className="h-20 w-auto" {...IMG_PROPS} />
              <p className="text-center text-lg font-bold leading-snug text-foreground">
                {label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );

  const renderRight = () => (
    <section className="flex-1 rounded-2xl border border-danger">
      <header className="rounded-t-2xl bg-danger p-3">
        <h3 className="text-center text-xl font-semibold uppercase text-white">
          Chướng ngại vật nguy hiểm
        </h3>
      </header>

      <div className="px-3 py-5">
        <ul className="mx-auto flex items-center justify-center gap-x-12">
          {HAZARDS.map(({ src, alt }) => (
            <li key={alt}>
              <img src={src} alt={alt} width={56} height={56} {...IMG_PROPS} />
            </li>
          ))}
        </ul>

        <p className="mt-6 text-center text-lg font-semibold">
          Chú ý:{" "}
          <span className="font-normal">
            Bạn sẽ không thể giành chiến thắng nếu để siêu bò va chạm với các
            chướng ngại nguy hiểm.
          </span>
        </p>
      </div>
    </section>
  );

  const renderInstructions = () => {
    return (
      <section className="mt-8 flex justify-center flex-col items-center">
        <div className="flex items-center justify-center gap-10">
          <img
            src={IcArrow}
            alt="Kéo trái"
            width={56}
            height={35}
            {...IMG_PROPS}
          />

          <div className="relative" style={{ width: 180, height: 126 }}>
            <img
              src={CowRun}
              alt="Siêu bò"
              width={180}
              height={126}
              {...IMG_PROPS}
            />
            <img
              src={IcHand}
              alt="IcHand"
              width={57}
              height={100}
              className="absolute left-14 top-20"
              {...IMG_PROPS}
            />
          </div>

          <img
            src={IcArrow}
            alt="Kéo phải"
            width={56}
            height={35}
            className="scale-x-[-1]"
            {...IMG_PROPS}
          />
        </div>
        <p className="mt-16 text-lg font-normal max-w-xl text-center">
          Trong thời gian <span className="font-semibold">30 giây</span> hãy
          nhấn giữ kéo siêu bò qua PHẢI/ TRÁI để nhận vật phẩm, nhớ né các chứng
          ngại nguy hiểm nhé!
        </p>
      </section>
    );
  };

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-black/50 p-6">
      <p className="text-xl font-bold text-white">Bắt đầu sau</p>
      <p className="text-6xl font-bold text-white">{count}s</p>
      <Button
        type="button"
        size="2xl"
        variant="game"
        className="mt-4 w-fit self-center px-10"
        onClick={onStart}
      >
        CHƠI NGAY
      </Button>
      <div className="mt-10 flex w-full max-w-xl flex-col rounded-3xl bg-white p-6 shadow-card md:max-w-2xl lg:max-w-5xl">
        <h2 className="mb-6 text-center text-2xl font-bold text-foreground">
          HƯỚNG DẪN CÁCH CHƠI
        </h2>
        <div className="flex flex-col gap-5 lg:flex-row">
          {renderLeft()}
          {renderRight()}
        </div>
        {renderInstructions()}
      </div>
    </div>
  );
}
