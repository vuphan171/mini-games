import { GameSpeed } from "@/features/game-configs/configs";

export interface Store {
  storeID: string;
  storeType: string;
  location: string;
  system: string;
  storeName: string;
  pointsPerGrain: number;
  pointsPerGrass: number;
  unlimitedTime: boolean;
  timeLimit: number;
  winningScore: number | null;
  gameSpeed: GameSpeed;
  lastGamePlay: string | null;
  _rowIndex: number;
}

export interface UpdateStorePayload {
  pointsPerGrain: number;
  pointsPerGrass: number;
  unlimitedTime: boolean;
  timeLimit?: number;
  winningScore?: number;
  gameSpeed: string;
  storeName: string;
}
