import { StorageKeys } from "scenes/storage-keys";
import type { LevelMetadata } from "types/level-stored";

export class StorageManager {
  static setLevelsMetadata(levelsData: LevelMetadata[]) {
    localStorage.setItem(StorageKeys.LevelsData, JSON.stringify(levelsData));
  }

  static getLevelDateFromCache(game: Phaser.Game): LevelMetadata {
    return game.registry.get(StorageKeys.LevelData);
  }

  static removeLevelDataFromCache(game: Phaser.Game) {
    game.registry.remove(StorageKeys.LevelData);
  }

  static setLevelDateFromCache(game: Phaser.Game, levelData: LevelMetadata) {
    game.registry.set(StorageKeys.LevelData, levelData);
  }

  static getStoredLevelsData(): LevelMetadata[] {
    return JSON.parse(localStorage.getItem(StorageKeys.LevelsData)!) as [
      LevelMetadata,
    ];
  }

  static hasLevelStoredData(): boolean {
    return localStorage.length > 0;
  }
}
