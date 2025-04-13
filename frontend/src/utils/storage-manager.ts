import type { LevelMetadata } from "types/level-data";

const StorageKeys = {
  LevelsMetadaData: "LevelsMetadaData",
  LevelMetadaData: "LevelMetadaData",
};

export class StorageManager {
  static setLevelsMetadataToStorage(levelsData: LevelMetadata[]): void {
    localStorage.setItem(
      StorageKeys.LevelsMetadaData,
      JSON.stringify(levelsData),
    );
  }

  static getLevelsMetadataDataFromStorage(): LevelMetadata[] {
    return JSON.parse(
      localStorage.getItem(StorageKeys.LevelsMetadaData)!,
    ) as LevelMetadata[];
  }

  static setLevelMetadaDataInRegistry(
    game: Phaser.Game,
    levelData: LevelMetadata,
  ): void {
    game.registry.set(StorageKeys.LevelMetadaData, levelData);
  }

  static getLevelMetadataFromRegistry(
    game: Phaser.Game,
  ): LevelMetadata | undefined {
    return game.registry.get(StorageKeys.LevelMetadaData);
  }

  static removeLevelMetadaDataFromRegistry(game: Phaser.Game): void {
    game.registry.remove(StorageKeys.LevelMetadaData);
  }

  static hasLevelStoredData(): boolean {
    return localStorage.length > 0;
  }
}
