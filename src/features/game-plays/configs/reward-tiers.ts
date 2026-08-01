export interface RewardTier {
  label: string;
  reward: string;
}

// ---------- HARDCODE: mốc điểm đổi quà (minh họa, PG đối chiếu và phát quà thủ công) ----------
export const REWARD_TIERS: RewardTier[] = [
  { label: "0 – 49 điểm", reward: "Sticker Siêu Bò Úc" },
  { label: "50 – 99 điểm", reward: "Móc khóa bò" },
  { label: "100 – 149 điểm", reward: "Ly sứ Siêu Bò" },
  { label: "150+ điểm", reward: "Gấu bông Bò Úc" },
];
