import { DEFAULT_GAME_CONFIG } from "./configs";
import type { SettingsFormValues } from "./schema";

const GAME_CONFIG_STORAGE_KEY = "game-configs";

export const saveGameConfig = (config: SettingsFormValues) => {
  localStorage.setItem(GAME_CONFIG_STORAGE_KEY, JSON.stringify(config));
};

export const getGameConfig = (): SettingsFormValues => {
  const raw = localStorage.getItem(GAME_CONFIG_STORAGE_KEY);

  if (!raw) return DEFAULT_GAME_CONFIG;

  try {
    return JSON.parse(raw) as SettingsFormValues;
  } catch {
    return DEFAULT_GAME_CONFIG;
  }
};
