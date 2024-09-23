import { AssetKeys } from "../assets/asset-keys";
import type { Animation } from "../types/animation";

export const getAnimations = (scene: Phaser.Scene): Animation[] => {
  const data: Animation[] = scene.cache.json.get(AssetKeys.DATA.ANIMATIONS);
  return data;
};
