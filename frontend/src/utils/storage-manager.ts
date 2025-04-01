import { StorageKeys } from "scenes/storage-keys";
import type { LevelMetadata } from "types/level-stored";

export class StorageManager {
  game!: Phaser.Game;

  constructor(game: Phaser.Game) {
    this.game = game;
  }

  setLevelData(levelData: LevelMetadata[]) {
    this.game.registry.set(StorageKeys.LevelData, levelData);
    localStorage.setItem(StorageKeys.LevelData, JSON.stringify(levelData));
  }

  getLevelDateFromCache(): LevelMetadata[] {
    return this.game.registry.get(StorageKeys.LevelData);
  }

  getStoredLevelData(): LevelMetadata[] {
    return JSON.parse(localStorage.getItem(StorageKeys.LevelData)!) as [
      LevelMetadata,
    ];
  }

  hasLevelStoredData(): boolean {
    return localStorage.length > 0;
  }
}
