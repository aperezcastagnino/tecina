import { DataAssetKeys } from "../assets/AssetKeys";
import { Animation } from '../types/Animation';

export const getAnimations = (scene: Phaser.Scene): Animation[] => {
  const data: Animation[] = scene.cache.json.get(DataAssetKeys.ANIMATIONS);
  return data;
};
