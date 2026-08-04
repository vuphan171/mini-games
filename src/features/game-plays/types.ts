export interface Customer {
  name: string;
  email: string;
  phone: string;
  store: string;
  storeID: string;
  storeType: string;
  location: string;
  storeName: string;
  customerName: string;
  score: number;
  result: string;
  playDuration: number;
  _rowIndex: number;
}

export type GameResultKind = "win" | "lose_obstacle" | "lose_timeout";

export interface GameOutcome {
  score: number;
  result: GameResultKind;
  playedSeconds: number;
}
