import Phaser from "phaser";
import { BackgroundKeys, UIComponentKeys } from "assets/asset-keys";
import { SceneKeys } from "scenes/scene-keys";
import { StorageManager } from "utils/storage-manager";
import type { LevelMetadata } from "types/level-data";
import { levelsConfig } from "config/levels-config";
import { Tooltip } from "../common-ui/tooltip";

export default class LevelsMenu extends Phaser.Scene {
  private tooltip!: Tooltip;

  private levelMetadata!: LevelMetadata[];

  constructor() {
    super(SceneKeys.LEVELS_MENU);
  }

  init(data: { continueGame: boolean }) {
    if (data.continueGame) {
      this.levelMetadata = StorageManager.getLevelsMetadataDataFromStorage();
    } else {
      this.levelMetadata = levelsConfig;
      StorageManager.setLevelsMetadataToStorage(levelsConfig);
    }
  }

  create() {
    this.completeAndUnlockLevels();
    const background = this.add.image(0, 0, BackgroundKeys.LEVELS).setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;

    this.tooltip = new Tooltip(
      this,
      "Completa el nivel anterior para desbloquear",
    );

    this.levelMetadata.forEach((level, index) => {
      const shadow = this.add
        .image(
          level.position.x + 6,
          level.position.y + 6,
          UIComponentKeys.BUTTON_SHADOW,
        )
        .setScale(0.2)
        .setAlpha(0.5);

      const button = this.add
        .image(
          level.position.x,
          level.position.y,
          UIComponentKeys.BUTTON_CIRCLE,
        )
        .setInteractive({ useHandCursor: true })
        .setScale(0.34)
        .setName(`${level.key}`);

      if (!level.enable) {
        button.setTint(0x808080);
        button.setInteractive({ useHandCursor: false });
      }

      if (index !== 0 && !level.enable) {
        // Apply grey tint and tooltip to locked levels
        button.setTint(0x808080);

        button.on("pointerover", (pointer: Phaser.Input.Pointer) => {
          this.input.setDefaultCursor("not-allowed");
          this.tooltip.show(
            "Completa el nivel anterior para desbloquear",
            pointer.worldX,
            pointer.worldY,
          );
        });

        button.on("pointermove", (pointer: Phaser.Input.Pointer) => {
          this.tooltip.move(pointer.worldX, pointer.worldY);
        });

        button.on("pointerout", () => {
          this.input.setDefaultCursor("default");
          this.tooltip.hide();
        });
      } else {
        // Only first level is interactive from the start
        button.on("pointerover", () => {
          this.input.setDefaultCursor("pointer");
          this.tweens.add({
            targets: button,
            scale: 0.4,
            duration: 150,
            ease: "Power2",
          });
        });

        button.on("pointerout", () => {
          this.input.setDefaultCursor("default");
          this.tweens.add({
            targets: button,
            scale: 0.34,
            duration: 150,
            ease: "Power2",
          });
        });

        button.on("pointerdown", () => {
          this.startLevel(level.key);
        });
      }

      this.add.existing(shadow);
      this.add.existing(button);
    });
  }

  enableLevelButton(levelKey: string) {
    const button = this.children.getByName(
      `${levelKey}`,
    ) as Phaser.GameObjects.Image;

    if (button) {
      console.log("Tint before:", button.tintTopLeft);

      console.log("button", button.name);

      button.setInteractive({ useHandCursor: true });
      button.clearTint();

      button.on("pointerover", () => {
        this.input.setDefaultCursor("pointer");
        this.tweens.add({
          targets: button,
          scale: 0.45,
          duration: 150,
          ease: "Power2",
        });
      });

      button.on("pointerout", () => {
        this.input.setDefaultCursor("default");
        this.tweens.add({
          targets: button,
          scale: 0.4,
          duration: 150,
          ease: "Power2",
        });
      });
      button.on("pointerdown", () => {
        this.startLevel(levelKey);
      });
    }
  }

  completeAndUnlockLevels() {
    const levelCompleted = StorageManager.getLevelMetadataFromRegistry(
      this.game,
    );
    if (!levelCompleted) return;

    const oldVersionLevelCompleted = this.levelMetadata.find(
      (level) => level.key === levelCompleted.key,
    );

    if (!oldVersionLevelCompleted) return;

    oldVersionLevelCompleted.completed = true;
    oldVersionLevelCompleted.map = undefined;
    oldVersionLevelCompleted.active = false;

    oldVersionLevelCompleted.nextLevel?.forEach((elem) => {
      const nextLevel = this.levelMetadata.find(
        (element) => element.key === elem,
      );
      if (nextLevel) nextLevel.enable = true;
    });

    StorageManager.removeLevelMetadaDataFromRegistry(this.game);
  }

  startLevel(levelKey: string) {
    this.scene.start(levelKey, this.levelMetadata);
  }
}
