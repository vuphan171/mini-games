import { SettingsFormValues } from "../schema";

export const GameSpeeds = {
  slow: "Slow",
  normal: "Normal",
  fast: "Fast",
  veryFast: "veryFast",
} as const;

export const GAME_SPEED_OPTIONS = [
  { value: GameSpeeds.slow, label: "Chậm" },
  { value: GameSpeeds.normal, label: "Bình thường" },
  { value: GameSpeeds.fast, label: "Nhanh" },
  { value: GameSpeeds.veryFast, label: "Rất nhanh" },
] as const;

const DEFAULT_GAME_CONFIG: SettingsFormValues = {
  pointsPerGrain: 10,
  pointsPerGrass: 10,
  unlimitedTime: false,
  timeLimit: 45,
  gameSpeed: GameSpeeds.normal,
};

export type GameSpeed = (typeof GameSpeeds)[keyof typeof GameSpeeds];

export { DEFAULT_GAME_CONFIG };
