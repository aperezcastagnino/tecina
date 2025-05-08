import Phaser from "phaser";
import { BackgroundKeys, UIComponentKeys } from "assets/assets";
import { SceneKeys } from "scenes/scene-keys";
import { StorageManager } from "managers/storage-manager";
import type { LevelMetadata } from "types/level";
import { levelsConfig } from "scenes/levels/levels-config";
import { Tooltip } from "../common-ui/tooltip";

export default class LevelsMenu extends Phaser.Scene {
  private tooltip!: Tooltip;

  private levelMetadata: LevelMetadata[] = [];

  constructor() {
    super(SceneKeys.LEVELS_MENU);
  }

  init(data: { continueGame: boolean }): void {
    if (data.continueGame) {
      this.levelMetadata = StorageManager.getLevelsMetadataDataFromStorage();
    } else {
      this.levelMetadata = levelsConfig;
      StorageManager.setLevelsMetadataToStorage(levelsConfig);
    }
  }

  create(): void {
    this.unlockLevels();
    this.initializeUI();
  }

  private startLevel(levelKey: string): void {
    this.scene.start(levelKey, this.levelMetadata);
  }

  private initializeUI(): void {
    this.createBackground();
    this.createTooltip();
    this.createLevelButtons();
  }

  private createBackground(): void {
    const background = this.add.image(0, 0, BackgroundKeys.LEVELS).setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
  }

  private createTooltip(): void {
    this.tooltip = new Tooltip(
      this,
      "Completa el nivel anterior para desbloquear",
    );
  }

  private createLevelButtons(): void {
    this.levelMetadata.forEach((level) => {
      this.createLevelButton(level);
    });
  }

  private createLevelButton(level: LevelMetadata): void {
    const shadow = this.add
      .image(
        level.position.x + 6,
        level.position.y + 6,
        UIComponentKeys.BUTTON_SHADOW,
      )
      .setScale(0.2)
      .setAlpha(0.5);

    const button = this.add
      .image(level.position.x, level.position.y, UIComponentKeys.BUTTON_CIRCLE)
      .setScale(0.34)
      .setName(`${level.key}`);

    this.setupEnabledButton(button, level.key); // remove this

    // if (!level.enable) {
    //   this.setupDisabledButton(button, index);
    // } else {
    //   this.setupEnabledButton(button, level.key);
    // }

    this.add.existing(shadow);
    this.add.existing(button);
  }

  private setupDisabledButton(
    button: Phaser.GameObjects.Image,
    index: number,
  ): void {
    button.setTint(0x808080);
    button.setInteractive({ useHandCursor: false });

    if (index !== 0) {
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
    }
  }

  private setupEnabledButton(
    button: Phaser.GameObjects.Image,
    levelKey: string,
  ): void {
    button.setInteractive({ useHandCursor: true });

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
      this.startLevel(levelKey);
    });
  }

  private unlockLevels(): void {
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

    oldVersionLevelCompleted.nextLevel?.forEach((key) => {
      const nextLevel = this.levelMetadata.find((level) => level.key === key);
      if (nextLevel) nextLevel.enable = true;
    });

    StorageManager.removeLevelMetadaDataFromRegistry(this.game);
  }
}
