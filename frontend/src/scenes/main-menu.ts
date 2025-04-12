import { Scene } from "phaser";
import { StorageManager } from "utils/storage-manager";
import { levelsConfig } from "config/levels-config";
import { BackgroundKeys, UIComponentKeys } from "assets/asset-keys";
import { SceneKeys } from "./scene-keys";

export class MainMenu extends Scene {
  private tooltip!: Phaser.GameObjects.Text;

  constructor() {
    super(SceneKeys.MAIN_MENU);
  }

  create() {
    this.createBackground();
    this.createTitle();
    this.createTooltip();
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

  createTooltip() {
    this.tooltip = this.add.text(0, 0, "", {
      font: "20px Arial",
      color: "#ffffff",
      backgroundColor: "#000000aa",
      padding: { x: 10, y: 5 },
    });
    this.tooltip.setDepth(1000).setVisible(false);
  }

  showTooltip(message: string, x: number, y: number) {
    this.tooltip.setText(message);
    this.tooltip.setPosition(x + 10, y - 10);
    this.tooltip.setVisible(true);
  }

  hideTooltip() {
    this.tooltip.setVisible(false);
  }

  createButtons() {
    // START GAME BUTTON
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

    const hasSavedGame = StorageManager.hasLevelStoredData();
    this.configureLoadGameButton(loadGameButton, hasSavedGame);
  }

  private configureLoadGameButton(
    button: Phaser.GameObjects.Image,
    enabled: boolean,
  ) {
    if (enabled) {
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
      // No saved game
      button.setTint(0x808080);
      button.setInteractive({ useHandCursor: true, pixelPerfect: true });

      button.on("pointerover", (pointer: Phaser.Input.Pointer) => {
        this.input.setDefaultCursor("not-allowed");
        this.showTooltip("No hay partida guardada ", pointer.x, pointer.y);
      });

      button.on("pointermove", (pointer: Phaser.Input.Pointer) => {
        this.tooltip.setPosition(pointer.x + 20, pointer.y - 10);
      });

      button.on("pointerout", () => {
        this.tooltip.setVisible(false);
        this.input.setDefaultCursor("default");
        this.hideTooltip();
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
