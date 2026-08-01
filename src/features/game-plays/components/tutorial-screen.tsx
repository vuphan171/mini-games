import { Fragment, useEffect, useState } from "react";
import { REWARD_TIERS } from "../configs/reward-tiers";
import { Button } from "@/components/ui/button";
import type { GameV2Config } from "../configs/game-v2";

interface TutorialScreenProps {
  config: GameV2Config;
  onStart: () => void;
}

const TUTORIAL_SECONDS = 30;

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

  return (
    <div className="bg-game-gradient relative min-h-dvh flex w-full items-center justify-center overflow-hidden p-6">
      <div className="flex w-full max-w-xl flex-col gap-3.5 py-7">
        <div className="flex items-center justify-between gap-3">
          <h1
            className="text-4xl font-extrabold text-white"
            style={{
              textShadow: "0 3px 0 #1a4d21, 0 6px 14px rgba(0,0,0,.35)",
            }}
          >
            📖 LUẬT CHƠI
          </h1>
          <div
            className="rounded-full border-4 px-5 py-0.5 text-2xl font-extrabold"
            style={{
              borderColor: "#21351f",
              background: "#ffd54f",
              color: "#8a5a00",
              boxShadow: "0 4px 0 #21351f",
            }}
          >
            {Math.max(secondsLeft, 0)}s
          </div>
        </div>

        <div
          className="flex flex-col gap-3.5 rounded-[22px] border-4 p-6"
          style={{
            borderColor: "#21351f",
            background: "#fff8e7",
            boxShadow: "0 8px 0 #21351f, 0 18px 40px rgba(0,0,0,.35)",
          }}
        >
          <div className="flex flex-col gap-3 text-base leading-snug text-[#21351f]">
            <div className="flex items-center gap-3.5">
              <span className="shrink-0 text-3xl">👆</span>
              <span>
                Chạm và kéo <b>trái / phải</b> để điều khiển chú bò. Thả tay —
                bò dừng ngay!
              </span>
            </div>
            <div className="flex items-center gap-3.5">
              <span className="shrink-0 text-3xl">🌾🌿</span>
              <span>
                Ăn <b>lúa</b> +{config.pointsPerGrain} điểm, <b>cỏ</b> +
                {config.pointsPerGrass} điểm.
              </span>
            </div>
            <div className="flex items-center gap-3.5">
              <span className="shrink-0 text-3xl">💉🦠🧑‍⚖️</span>
              <span>
                Né <b>vắc-xin, vi-rút, trọng tài</b> — đụng phải là thua ngay!
              </span>
            </div>
            <div className="flex items-center gap-3.5">
              <span className="shrink-0 text-3xl">⏱️</span>
              <span>
                {config.unlimitedTime ? (
                  <>
                    Đạt <b>{config.winningScore} điểm</b> là THẮNG!
                  </>
                ) : (
                  <>
                    Trụ vững hết <b>{config.timeLimit} giây</b> là THẮNG!
                  </>
                )}
              </span>
            </div>
          </div>

          <div
            className="rounded-2xl border-2 p-4"
            style={{ borderColor: "#2c7a37", background: "#e9f5db" }}
          >
            <p className="mb-1.5 text-lg font-extrabold text-[#2c7a37]">
              🎁 MỐC ĐIỂM ĐỔI QUÀ
            </p>
            <div
              className="grid gap-x-4 gap-y-1.5"
              style={{ gridTemplateColumns: "auto 1fr" }}
            >
              {REWARD_TIERS.map((tier) => (
                <Fragment key={tier.label}>
                  <b className="text-sm text-[#21351f]">{tier.label}</b>
                  <span className="text-sm text-[#21351f]">{tier.reward}</span>
                </Fragment>
              ))}
            </div>
            <p className="mt-1.5 text-xs" style={{ color: "#7a8a72" }}>
              (Bảng quà minh họa — PG đối chiếu điểm và phát quà thủ công)
            </p>
          </div>
        </div>

        <Button variant="game" size="2xl" type="button" onClick={onStart}>
          ⏩ BỎ QUA → CHƠI NGAY
        </Button>
      </div>
    </div>
  );
}
