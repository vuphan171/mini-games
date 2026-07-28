import { useEffect, useState } from "react";
import type { PlayRecord } from "../types";

interface ResultScreenProps {
  record: PlayRecord;
  onDone: () => void;
}

export default function ResultScreen({ record, onDone }: ResultScreenProps) {
  const [left, setLeft] = useState(6);
  useEffect(() => {
    const t = setInterval(() => setLeft((l) => l - 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (left <= 0) onDone();
  }, [left, onDone]);

  const win = record.result === "win";
  const reason =
    record.result === "lose_obstacle"
      ? "Ôi không! Bò va phải chướng ngại vật rồi 🧑‍⚖️⚽"
      : record.result === "lose_timeout"
        ? "Hết giờ mất rồi, chưa đủ điểm ⏱"
        : "Bạn đã thu thập đủ thịt bò trong thời gian quy định!";

  return (
    <div
      className="w-full flex items-center justify-center p-6"
      style={{
        minHeight: "100vh",
        background: win ? "linear-gradient(160deg,#f59e0b,#fbbf24)" : "linear-gradient(160deg,#334155,#64748b)",
      }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
        <div className="text-7xl mb-3">{win ? "🏆" : "😢"}</div>
        <h2 className={"text-3xl font-extrabold " + (win ? "text-amber-600" : "text-slate-600")}>
          {win ? "CHIẾN THẮNG!" : "CHƯA THẮNG RỒI!"}
        </h2>
        <p className="text-gray-500 mt-2">{reason}</p>

        <div className="mt-6 bg-gray-50 rounded-2xl p-5 text-left space-y-2 text-gray-700">
          <p>
            <b>Khách:</b> {record.name}
          </p>
          <p>
            <b>Cửa hàng:</b> {record.store}
          </p>
          <p>
            <b>Điểm số:</b> {record.score}
          </p>
          <p>
            <b>Thời gian chơi:</b> {record.playedSeconds}s
          </p>
          <p>
            <b>Thời điểm:</b> {record.playedAt}
          </p>
        </div>

        {win && <p className="mt-4 text-emerald-600 font-semibold">🎁 Mời bạn đến quầy nhận quà nhé!</p>}
        <p className="mt-5 text-sm text-gray-400">Tự quay về màn hình chính sau {left}s…</p>
        <button onClick={onDone} className="mt-3 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold">
          Khách tiếp theo →
        </button>
      </div>
    </div>
  );
}
