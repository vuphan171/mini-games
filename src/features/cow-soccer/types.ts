export interface Customer {
  name: string;
  email: string;
  phone: string;
  store: string;
}

export type GameResultKind = "win" | "lose_obstacle" | "lose_timeout";

export interface GameOutcome {
  score: number;
  result: GameResultKind;
  playedSeconds: number;
}

export interface PlayRecord extends Customer, GameOutcome {
  durationConfig: number;
  playedAt: string;
}
