export const RewardResults = {
  keyChain: "Móc Khoá",
  shirt: "Áo",
  ball: "Bóng",
} as const;

export type RewardResult = (typeof RewardResults)[keyof typeof RewardResults];

export interface RewardTier {
  min: number;
  max: number;
  label: string;
  result: RewardResult;
}

export const REWARD_TIERS: RewardTier[] = [
  { min: 0, max: 50, label: "0 - 50\nđiểm", result: RewardResults.keyChain },
  { min: 51, max: 80, label: "51 - 80\nđiểm", result: RewardResults.shirt },
  {
    min: 81,
    max: Infinity,
    label: "81 - 100\nđiểm",
    result: RewardResults.ball,
  },
];

export const getRewardTier = (score: number): RewardTier =>
  REWARD_TIERS.find((tier) => score >= tier.min && score <= tier.max) ??
  REWARD_TIERS[0];
