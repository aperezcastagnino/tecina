import { DataAssetKeys } from "../assets/asset-keys";
import type { Animation } from "../types/animation";

export const getAnimations = (scene: Phaser.Scene): Animation[] => {
  const data: Animation[] = scene.cache.json.get(DataAssetKeys.ANIMATIONS);
  return data;
};
