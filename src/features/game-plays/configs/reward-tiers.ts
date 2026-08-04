export interface RewardTier {
  min: number;
  max: number;
  label: string;
  result: string;
}

export const REWARD_TIERS: RewardTier[] = [
  { min: 0, max: 50, label: "0 - 50 điểm", result: "Vớ" },
  { min: 51, max: 80, label: "51 - 80 điểm", result: "Móc Khoá" },
  { min: 81, max: Infinity, label: "81 - 100 điểm", result: "Áo" },
];

export const getRewardTier = (score: number): RewardTier =>
  REWARD_TIERS.find((tier) => score >= tier.min && score <= tier.max) ??
  REWARD_TIERS[0];
