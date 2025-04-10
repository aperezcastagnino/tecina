import Phaser from "phaser";
import { BackgroundKeys, UIComponentKeys } from "assets/asset-keys";
import { SceneKeys } from "scenes/scene-keys";
import { StorageManager } from "utils/storage-manager";
import type { LevelMetadata } from "types/level-stored";
import { levelConfig } from "config/levels-config";

export default class LevelsMenu extends Phaser.Scene {
  private levelMetadata!: LevelMetadata[];

  constructor() {
    super(SceneKeys.LEVELS_MENU);
  }

  init(data: { continueGame: boolean }) {
    if (data.continueGame) {
      this.levelMetadata = StorageManager.getStoredLevelsData();
    } else {
      this.levelMetadata = levelConfig;
      StorageManager.setLevelsMetadata(levelConfig);
    }
  }

  create() {
    this.completeAndUnlockLevels();
    const background = this.add.image(0, 0, BackgroundKeys.LEVELS).setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;

    this.levelMetadata.forEach((level, index) => {
      const button = this.add
        .image(
          level.position.x,
          level.position.y,
          UIComponentKeys.BUTTON_CIRCLE,
        ) // they all have the same image
        .setInteractive({ useHandCursor: true })
        .setScale(0.4)
        .on("pointerdown", () => this.startLevel(level.key))
        .setName(`levelImageButton${index + 1}`);
      if (!level.enable) {
        button.setTint(0x808080);
        button.setInteractive({ useHandCursor: false });
      }
      this.add.existing(button);
    });
  }

  enableLevelButton(levelNumber: number) {
    const button = this.children.getByName(
      `levelImageButton${levelNumber}`,
    ) as Phaser.GameObjects.Image;
    if (button) {
      button.clearTint(); // Adds color to the button
    }
  }

  completeAndUnlockLevels() {
    let previusLevel;
    const levelCompleted = StorageManager.getLevelDateFromCache(this.game);
    if (levelCompleted) {
      previusLevel = this.levelMetadata.find(
        (level) => level.key === levelCompleted.key,
      );
      previusLevel!.completed = true;
      previusLevel!.map = undefined;
      previusLevel!.active = false;
      previusLevel!.nextLevel?.forEach((elem) => {
        const nextLevel = this.levelMetadata.find(
          (element) => element.key === elem,
        );
        nextLevel!.enable = true;
      });
      StorageManager.removeLevelDataFromCache(this.game);
    }
  }

  startLevel(levelKey: string) {
    this.scene.start(levelKey, this.levelMetadata);
  }
}
