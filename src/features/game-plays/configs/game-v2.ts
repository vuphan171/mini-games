export interface GameV2Config {
  pointsPerGrain: number;
  pointsPerGrass: number;
  unlimitedTime: boolean;
  timeLimit: number;
  winningScore: number;
  gameSpeed: "Slow" | "Normal" | "Fast" | "Very Fast";
}

export const DEFAULT_GAME_V2_CONFIG: GameV2Config = {
  pointsPerGrain: 10,
  pointsPerGrass: 5,
  unlimitedTime: false,
  timeLimit: 45,
  winningScore: 100,
  gameSpeed: "Normal",
};
