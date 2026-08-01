export const GameSpeeds = {
  slow: "slow",
  normal: "normal",
  fast: "fast",
  veryFast: "veryFast",
} as const;

export const GAME_SPEED_OPTIONS = [
  { value: GameSpeeds.slow, label: "Slow" },
  { value: GameSpeeds.normal, label: "Normal" },
  { value: GameSpeeds.fast, label: "Fast" },
  { value: GameSpeeds.veryFast, label: "Very Fast" },
] as const;

export type GameSpeed = (typeof GameSpeeds)[keyof typeof GameSpeeds];
