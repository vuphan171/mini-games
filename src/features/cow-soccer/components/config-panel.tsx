import { useState } from "react";
import { BEEF_POINT, SPEED_PRESETS, type GameConfig, type SpeedLevel } from "../../../configs";
import type { PlayRecord } from "../types";

interface ConfigPanelProps {
  config: GameConfig;
  setConfig: (config: GameConfig) => void;
  records: PlayRecord[];
  onClose: () => void;
}

export default function ConfigPanel({ config, setConfig, records, onClose }: ConfigPanelProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [pass, setPass] = useState("");
  const [draft, setDraft] = useState<GameConfig>(config);

  if (!unlocked) {
    return (
      <div className="fixed flex items-center justify-center p-6" style={{ inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50 }}>
        <div className="bg-white rounded-2xl p-6 w-full max-w-xs text-center">
          <p className="font-bold text-lg mb-3">🔒 Khu vực nhân viên</p>
          <input
            type="password"
            className="w-full border-2 rounded-xl px-4 py-3 text-center text-xl"
            placeholder="Mật khẩu"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <div className="flex gap-2 mt-4">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-gray-200 font-semibold">
              Đóng
            </button>
            <button
              onClick={() => (pass === "1234" ? setUnlocked(true) : setPass(""))}
              className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
            >
              Mở
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">Mật khẩu mặc định: 1234 (hardcode)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed flex items-center justify-center p-4" style={{ inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50 }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-extrabold text-emerald-800">⚙️ Cài đặt game</h3>
          <button onClick={onClose} className="text-2xl">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-semibold text-gray-700 block mb-1">Điểm để thắng</label>
            <input
              type="number"
              min="10"
              step="10"
              className="w-full border-2 rounded-xl px-3 py-2"
              value={draft.winScore}
              onChange={(e) => setDraft({ ...draft, winScore: Math.max(10, +e.target.value || 10) })}
            />
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              Mỗi <img src="/coin_plus_one_icon.svg" alt="beef" width={36} height={23} /> = {BEEF_POINT} điểm
            </p>
          </div>
          <div>
            <label className="font-semibold text-gray-700 block mb-1">Thời gian (giây)</label>
            <input
              type="number"
              min="10"
              step="5"
              className="w-full border-2 rounded-xl px-3 py-2"
              value={draft.duration}
              onChange={(e) => setDraft({ ...draft, duration: Math.max(10, +e.target.value || 10) })}
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700 block mb-1">Tốc độ game</label>
            <select
              className="w-full border-2 rounded-xl px-3 py-2"
              value={draft.speed}
              onChange={(e) => setDraft({ ...draft, speed: e.target.value as SpeedLevel })}
            >
              {Object.entries(SPEED_PRESETS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">Ảnh hưởng tốc độ chạy + mật độ chướng ngại vật</p>
          </div>
        </div>

        <button
          onClick={() => {
            setConfig(draft);
            onClose();
          }}
          className="mt-4 w-full py-3 rounded-xl bg-emerald-600 text-white font-bold"
        >
          Lưu cài đặt
        </button>

        <h4 className="text-lg font-bold mt-6 mb-2 text-gray-700">
          📋 Dữ liệu lượt chơi ({records.length}) —{" "}
          <span className="font-normal text-sm text-gray-400">tạm lưu trong phiên, sẽ nối Drive sau</span>
        </h4>
        <div className="border rounded-xl" style={{ overflowX: "auto" }}>
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-emerald-900">
              <tr>
                {["Thời điểm", "Tên", "SĐT", "Email", "Cửa hàng", "Điểm", "KQ", "Chơi (s)"].map((h) => (
                  <th key={h} className="px-2 py-2 text-left" style={{ whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-4 text-center text-gray-400">
                    Chưa có lượt chơi nào
                  </td>
                </tr>
              )}
              {records.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="px-2 py-1" style={{ whiteSpace: "nowrap" }}>
                    {r.playedAt}
                  </td>
                  <td className="px-2 py-1">{r.name}</td>
                  <td className="px-2 py-1">{r.phone}</td>
                  <td className="px-2 py-1">{r.email}</td>
                  <td className="px-2 py-1" style={{ whiteSpace: "nowrap" }}>
                    {r.store}
                  </td>
                  <td className="px-2 py-1 font-bold">{r.score}</td>
                  <td className="px-2 py-1">{r.result === "win" ? "✅ Thắng" : "❌ Thua"}</td>
                  <td className="px-2 py-1">{r.playedSeconds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
