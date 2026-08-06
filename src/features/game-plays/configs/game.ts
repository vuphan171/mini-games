import { GameSpeed } from "@/features/game-configs/configs";

export interface GameConfigs {
  pointsPerGrain: number;
  pointsPerGrass: number;
  unlimitedTime: boolean;
  timeLimit: number;
  winningScore: number;
  gameSpeed: GameSpeed;
  penaltyPoints: number;
}
