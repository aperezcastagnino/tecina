import { Scene } from "phaser";
import { StorageManager } from "utils/storage-manager";
import { levelsConfig } from "config/levels-config";
import { BackgroundKeys, UIComponentKeys } from "assets/asset-keys";
import { SceneKeys } from "./scene-keys";
import { Tooltip } from "../common-ui/tooltip";

export class MainMenu extends Scene {
  private tooltip!: Tooltip;

  constructor() {
    super(SceneKeys.MAIN_MENU);
  }

  create() {
    this.initializeUI();
  }

  private initializeUI() {
    this.createBackground();
    this.createTitle();
    this.tooltip = new Tooltip(this, ""); 
    this.createButtons();
  }

  createBackground() {
    const background = this.add
      .image(0, 0, BackgroundKeys.MAIN_MENU)
      .setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
  }

  createTitle() {
    const title = this.add.image(500, 500, UIComponentKeys.TITLE).setScale(0.8);
    title.setOrigin(0.5);
  }

  createButtons() {
    const startGameButton = this.add
      .image(1400, 400, UIComponentKeys.START_BUTTON)
      .setInteractive()
      .setOrigin(0.5)
      .setScale(0.35);

    startGameButton.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
      this.tweens.add({
        targets: startGameButton,
        scale: 0.4,
        duration: 150,
        ease: "Power2",
      });
    });

    startGameButton.on("pointerout", () => {
      this.input.setDefaultCursor("default");
      this.tweens.add({
        targets: startGameButton,
        scale: 0.35,
        duration: 150,
        ease: "Power2",
      });
    });

    startGameButton.on("pointerdown", () => {
      this.startNewGame();
    });

    // LOAD GAME BUTTON
    const loadGameButton = this.add
      .image(1400, 580, UIComponentKeys.LOAD_BUTTON)
      .setOrigin(0.5)
      .setScale(0.35);

    this.configureLoadGameButton(loadGameButton);
  }

  private configureLoadGameButton(button: Phaser.GameObjects.Image) {
    if (StorageManager.hasLevelStoredData()) {
      button.setInteractive();

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
          scale: 0.35,
          duration: 150,
          ease: "Power2",
        });
      });

      button.on("pointerdown", () => {
        this.continueGame();
      });
    } else {
      button.setTint(0x808080);
      button.setInteractive({ useHandCursor: true, pixelPerfect: true });

      button.on("pointerover", (pointer: Phaser.Input.Pointer) => {
        this.input.setDefaultCursor("not-allowed");
        this.tooltip.show("No hay partida guardada", pointer.x, pointer.y);
      });

      button.on("pointermove", (pointer: Phaser.Input.Pointer) => {
        this.tooltip.move(pointer.x, pointer.y);
      });

      button.on("pointerout", () => {
        this.tooltip.hide();
        this.input.setDefaultCursor("default");
      });
    }
  }

  startNewGame() {
    StorageManager.setLevelsMetadataToStorage(levelsConfig);
    this.scene.start(SceneKeys.LEVELS_MENU);
  }

  continueGame() {
    if (StorageManager.hasLevelStoredData()) {
      this.scene.start(SceneKeys.LEVELS_MENU, { continueGame: true });
    }
  }
}
