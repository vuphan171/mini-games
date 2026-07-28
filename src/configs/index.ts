// ---------- Cấu hình game Siêu Bò Sút Bóng ----------

export type SpeedLevel = "slow" | "medium" | "fast";

export interface GameConfig {
  winScore: number; // điểm tối thiểu để thắng (mỗi vật phẩm beef = BEEF_POINT điểm)
  duration: number; // giây / lượt
  speed: SpeedLevel;
}

export interface SpeedPreset {
  label: string;
  scroll: number;
  cowSpeed: number;
  spawnEvery: number;
  obstacleProb: number;
}

export type ItemType = "beef" | "ball" | "ref";

// ---------- HARDCODE: danh sách cửa hàng ----------
export const STORES: string[] = [
  "Siêu Bò - Quận 1",
  "Siêu Bò - Quận 3",
  "Siêu Bò - Quận 7",
  "Siêu Bò - Thủ Đức",
  "Siêu Bò - Gò Vấp",
];

// ---------- Config mặc định ----------
export const DEFAULT_CONFIG: GameConfig = {
  winScore: 100,
  duration: 45,
  speed: "medium",
};

// Tốc độ game = tốc độ cuộn sân + tốc độ bò + mật độ chướng ngại vật
export const SPEED_PRESETS: Record<SpeedLevel, SpeedPreset> = {
  slow: { label: "Chậm", scroll: 200, cowSpeed: 420, spawnEvery: 1.0, obstacleProb: 0.45 },
  medium: { label: "Vừa", scroll: 280, cowSpeed: 520, spawnEvery: 0.75, obstacleProb: 0.55 },
  fast: { label: "Nhanh", scroll: 380, cowSpeed: 640, spawnEvery: 0.55, obstacleProb: 0.65 },
};

export const BEEF_POINT = 10;
export const COW_R = 30;
export const RADII: Record<ItemType, number> = { beef: 22, ball: 22, ref: 26 };
export const ICONS: Record<ItemType, string> = { beef: "/coin_plus_one_icon.svg", ball: "⚽", ref: "🧑‍⚖️" };
