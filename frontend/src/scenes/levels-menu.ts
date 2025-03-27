import Phaser from "phaser";
import { AssetKeys } from "assets/asset-keys";
import { StorageManager } from "utils/storage-utils";
import type { LevelMetadata } from "types/level-stored";
import { SceneKeys } from "./scene-keys";

export default class LevelsMenu extends Phaser.Scene {
  storageUtils!: StorageManager;

  levelData!: LevelMetadata[];

  constructor() {
    super(SceneKeys.LEVELS_MENU);
  }

  create() {
    this.storageUtils = new StorageManager(this.game);
    const levelData = this.storageUtils.getLevelDateFromCache();
    levelData.forEach((element) => {
      if (element.active) {
        this.startLevel(element.key);
      }
    });

    const background = this.add
      .image(0, 0, AssetKeys.BACKGROUNDS.LEVELS)
      .setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;

    levelData.forEach((pos, index) => {
      const button = this.add
        .image(
          pos.position.x,
          pos.position.y,
          AssetKeys.UI_COMPONENTS.BUTTON_CIRCLE,
        ) // they all have the same image
        .setInteractive({ useHandCursor: true })
        .setScale(0.4)
        .on("pointerdown", () => this.startLevel(pos.key))
        .setName(`levelImageButton${index + 1}`);
      if (!pos.enable) {
        // Apply grey tint to all buttons except the first one
        button.setTint(0x808080);
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

  startLevel(levelKey: string) {
    this.scene.start(levelKey);
  }
}
