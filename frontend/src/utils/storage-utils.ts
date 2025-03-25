import { StorageKeys } from "scenes/storage-keys";
import type { LevelData } from "types/level-stored";

export class StorageManager {

    game!: Phaser.Game
    
    constructor(game: Phaser.Game) {
        this.game = game;
    }

    setLevelData(levelData: LevelData[]){
        this.game.registry.set(StorageKeys.LevelData, levelData); //Setear las keys en un lugar x
        localStorage.setItem(StorageKeys.LevelData, JSON.stringify(levelData));
    }

    getLevelDateFromCache() : LevelData[]{
        return this.game.registry.get(StorageKeys.LevelData);
    }

    getStoredLevelData() : LevelData[]{
        return (JSON.parse(localStorage.getItem(StorageKeys.LevelData)!) as [LevelData])
    }

    hasLevelStoredData(): boolean{
        return localStorage.length > 0;
    }
}
