import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import type { GameV2Config } from "../configs/game-v2";
import Grains from "@/assets/logos/grains.png";
import Grass from "@/assets/logos/grass.png";
import Virus from "@/assets/logos/virus.png";
import Referee from "@/assets/logos/referee.png";
import Vaccine from "@/assets/logos/vaccine.png";

interface TutorialScreenProps {
  config: GameV2Config;
  onStart: () => void;
}

const TUTORIAL_SECONDS = 3000;

export default function TutorialScreen({
  config,
  onStart,
}: TutorialScreenProps) {
  const [secondsLeft, setSecondsLeft] = useState(TUTORIAL_SECONDS);

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) onStart();
  }, [secondsLeft, onStart]);

  const renderRight = () => {
    return (
      <div className="flex-1 border border-danger rounded-2xl">
        <div className="bg-danger p-3 rounded-t-2xl">
          <p className="text-xl text-white text-center font-semibold uppercase">
            Chướng ngại Vật nguy hiểm
          </p>
        </div>
        <div className="px-3 py-5">
          <div className="flex items-center gap-x-12 mx-auto justify-center">
            <img
              width={56}
              height={56}
              src={Virus}
              alt="Virus"
              fetchPriority="high"
              loading="eager"
              decoding="sync"
            />
            <img
              width={56}
              height={56}
              src={Referee}
              alt="Referee"
              fetchPriority="high"
              loading="eager"
              decoding="sync"
            />
            <img
              width={56}
              height={56}
              src={Vaccine}
              alt="Vaccine"
              fetchPriority="high"
              loading="eager"
              decoding="sync"
            />
          </div>
          <p className="mt-6 text-lg text-center font-semibold">
            Chú ý:{" "}
            <span className="font-normal">
              Bạn sẽ không thể dành chiến thắng nếu để siêu bò va chạm với các
              chướng ngại nguy hiểm.
            </span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-dvh flex flex-col w-full items-center justify-center overflow-hidden p-6 bg-black/50">
      <p className="text-white text-xl font-bold">Bắt đầu sau</p>
      <p className="text-white text-6xl font-bold">{secondsLeft}s</p>
      <Button
        type="submit"
        size="2xl"
        variant="game"
        className="mt-6 w-fit px-10"
      >
        CHƠI NGAY
      </Button>
      <div className="flex w-full max-w-xl md:max-w-2xl lg:max-w-5xl mt-6 flex-col rounded-3xl p-6 bg-white shadow-card md:px-10">
        <p className="text-2xl text-center font-bold text-foreground mb-6">
          HƯỚNG DẪN CÁCH CHƠI
        </p>

        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1 border border-brand-tertiary rounded-2xl">
            <div className="bg-brand-tertiary p-3 rounded-t-2xl">
              <p className="text-xl text-white text-center font-semibold">
                Vật phẩm tích điểm & Quà Tặng
              </p>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-4">
                <img
                  width={48}
                  height={66}
                  src={Grains}
                  alt="Grains"
                  fetchPriority="high"
                  loading="eager"
                  decoding="sync"
                />
                <p className="text-foreground text-lg leading-snug font-bold">
                  Ăn Ngũ Cốc <br /> +10 Điểm
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <img
                  width={63}
                  height={40}
                  src={Grass}
                  alt="Grass"
                  fetchPriority="high"
                  loading="eager"
                  decoding="sync"
                />
                <p className="text-foreground text-lg leading-snug font-bold">
                  Ăn Cỏ <br /> +10 Điểm
                </p>
              </div>
            </div>
          </div>

          {renderRight()}
        </div>

        <Button type="submit" size="2xl" variant="game" className="mt-10 w-fit">
          CHƠI NGAY
        </Button>
      </div>
    </div>
  );
}
