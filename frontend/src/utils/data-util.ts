import type { LevelData } from "types/level-data";

export const loadLevelData = (scene: Phaser.Scene, level: string): LevelData =>
  scene.cache.json.get(level);
