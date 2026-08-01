import type { SettingsFormValues } from "./schema";

const GAME_CONFIG_STORAGE_KEY = "game-configs";

export const saveGameConfig = (config: SettingsFormValues) => {
  localStorage.setItem(GAME_CONFIG_STORAGE_KEY, JSON.stringify(config));
};

export const getGameConfig = (): SettingsFormValues | null => {
  const raw = localStorage.getItem(GAME_CONFIG_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SettingsFormValues;
  } catch {
    return null;
  }
};
