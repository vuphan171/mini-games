const GAME_SCREENS = {
  form: "form",
  config: "config",
  tutorial: "tutorial",
  game: "game",
  result: "result",
} as const;

type GameScreen = (typeof GAME_SCREENS)[keyof typeof GAME_SCREENS];

export { GAME_SCREENS };

export type { GameScreen };
