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

  private levelKeyMap: Map<string, LevelMetadata> = new Map();

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

    this.levelMetadata.forEach((level) => {
      this.levelKeyMap.set(level.key, level);
    });
  }

  create(): void {
    this.unlockLevels();
    this.initializeUI();
    this.setupKeyboardShortcuts();
  }

  private initializeUI(): void {
    this.createBackground();
    this.createLevelButtons();
    this.createTooltip();
  }

  private createBackground(): void {
    const background = this.add.image(0, 0, BackgroundKeys.LEVELS).setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
  }

  private createTooltip(): void {
    this.tooltip = new Tooltip(this, "Complete the previous level to unlock");
  }

  private createLevelButtons(): void {
    this.levelMetadata.forEach((level, index) => {
      this.createButton(level, index);
    });
  }

  private createButton(level: LevelMetadata, index: number): void {
    const shadow = this.add
      .image(
        level.position.x + 6,
        level.position.y + 6,
        UIComponentKeys.SHADOW_BUTTON,
      )
      .setScale(0.2)
      .setAlpha(0.5);

    const levelButton = `LEVEL_${index + 1}_BUTTON`;
    const button = this.add
      .image(level.position.x, level.position.y, levelButton)
      .setScale(0.34)
      .setName(`${level.key}`);

    if (!level.enable) {
      this.setupDisabledButton(button, index);
    } else {
      this.setupEnabledButton(button, level.key);
    }

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
          "Complete the previous level to unlock",
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
      this.scene.start(levelKey, this.levelMetadata);
    });
  }

  private unlockLevels(): void {
    const levelCompleted = StorageManager.getLevelMetadataFromRegistry(
      this.game,
    );
    if (!levelCompleted || !levelCompleted.key) return;

    const oldVersionLevelCompleted = this.levelKeyMap.get(levelCompleted.key);
    if (!oldVersionLevelCompleted) return;

    oldVersionLevelCompleted.completed = true;
    oldVersionLevelCompleted.map = undefined;
    oldVersionLevelCompleted.active = false;

    oldVersionLevelCompleted.nextLevel?.forEach((key) => {
      const nextLevel = this.levelKeyMap.get(key);
      if (
        nextLevel &&
        (!nextLevel.previousLevel ||
          this.areAllPredecessorsCompleted(nextLevel.previousLevel))
      ) {
        nextLevel.enable = true;
      }
    });

    StorageManager.removeLevelMetadaDataFromRegistry(this.game);
  }

  private areAllPredecessorsCompleted(predecessorKeys: string[]): boolean {
    return predecessorKeys.every(
      (key) => this.levelKeyMap.get(key)?.completed === true,
    );
  }

  private setupKeyboardShortcuts(): void {
    const { keyboard } = this.input;
    if (!keyboard) return;

    const validNumberKeys = new Set([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ]);

    keyboard.on("keydown", (event: KeyboardEvent) => {
      const { key } = event;
      if (!validNumberKeys.has(key)) {
        return;
      }

      const levelToUnlock = this.levelKeyMap.get(`LEVEL_${key}`);
      if (!levelToUnlock || levelToUnlock.enable) {
        return;
      }

      levelToUnlock.enable = true;
      StorageManager.setLevelsMetadataToStorage(this.levelMetadata);
      this.scene.restart();
    });
  }
}
