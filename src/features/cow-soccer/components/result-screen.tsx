import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ResultScreenProps {
  win: boolean;
  onDone: () => void;
}

export default function ResultScreen({ win, onDone }: ResultScreenProps) {
  const [left, setLeft] = useState(6);
  useEffect(() => {
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (left <= 0) onDone();
  }, [left, onDone]);

  return (
    <div
      className="flex min-h-dvh w-full items-center justify-center p-6"
      style={{
        background: win
          ? "linear-gradient(160deg,#ffd54f,#ffb300)"
          : "linear-gradient(160deg,#42525c,#7c93a0)",
      }}
    >
      <div
        className="w-full max-w-md rounded-[22px] border-4 p-8 text-center"
        style={{
          borderColor: "#21351f",
          background: "#fff8e7",
          boxShadow: "0 8px 0 #21351f, 0 18px 40px rgba(0,0,0,.35)",
        }}
      >
        <div className="mb-2 text-7xl">{win ? "🏆" : "😢"}</div>
        <h2
          className="text-3xl font-extrabold"
          style={{ color: win ? "#8a5a00" : "#42525c" }}
        >
          {win ? "CHIẾN THẮNG!" : "CHƯA THẮNG RỒI!"}
        </h2>

        {win && (
          <p className="mt-4 font-semibold text-[#2c7a37]">
            🎁 Mời bạn đến quầy nhận quà nhé!
          </p>
        )}
        <p className="mt-5 text-sm text-[#7a8a72]">
          Tự quay về màn hình chính sau {left}s…
        </p>
        <Button
          type="button"
          variant="game"
          size="2xl"
          className="mt-3 w-full"
          onClick={onDone}
        >
          Khách tiếp theo →
        </Button>
      </div>
    </div>
  );
}
