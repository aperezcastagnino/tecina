import { Scene } from "phaser";
import { StorageManager } from "managers/storage-manager";
import { levelsConfig } from "scenes/levels/levels-config";
import { BackgroundKeys, UIComponentKeys } from "assets/assets";
import { BoxColors, Colors } from "assets/colors";
import { FontSize, PRIMARY_FONT_FAMILY } from "assets/fonts";
import { SceneKeys } from "./scene-keys";
import { Tooltip } from "../common-ui/tooltip";

export default class MainMenu extends Scene {
  private tooltip!: Tooltip;

  constructor() {
    super(SceneKeys.MAIN_MENU);
  }

  create(): void {
    this.initializeUI();
  }

  private initializeUI() {
    this.createBackground();
    this.createTitle();
    this.createButtons();
    this.tooltip = new Tooltip(this, "");
  }

  private createBackground(): void {
    const background = this.add
      .image(0, 0, BackgroundKeys.MAIN_MENU)
      .setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
  }

  private createTitle(): void {
    this.add
      .image(500, 500, UIComponentKeys.TITLE)
      .setScale(0.8)
      .setOrigin(0.5);
  }

  private createButtons(): void {
    const loadGameButton = this.add
      .image(1400, 580, UIComponentKeys.LOAD_BUTTON)
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setScale(0.6);

    const startGameButton = this.add
      .image(1400, 400, UIComponentKeys.START_BUTTON)
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setScale(0.6);

    this.configureLoadGameButton(loadGameButton);
    this.configureStartGameButton(startGameButton);
  }

  private configureLoadGameButton(button: Phaser.GameObjects.Image) {
    if (StorageManager.hasLevelStoredData()) {
      button.setInteractive();

      button.on("pointerover", () => {
        this.input.setDefaultCursor("pointer");
        this.tweens.add({
          targets: button,
          scale: 0.7,
          duration: 150,
          ease: "Power2",
        });
      });

      button.on("pointerout", () => {
        this.input.setDefaultCursor("default");
        this.tweens.add({
          targets: button,
          scale: 0.6,
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

  private configureStartGameButton(button: Phaser.GameObjects.Image) {
    button.on("pointerover", () => {
      this.input.setDefaultCursor("pointer");
      this.tweens.add({
        targets: button,
        scale: 0.7,
        duration: 150,
        ease: "Power2",
      });
    });

    button.on("pointerout", () => {
      this.input.setDefaultCursor("default");
      this.tweens.add({
        targets: button,
        scale: 0.6,
        duration: 150,
        ease: "Power2",
      });
    });

    button.on("pointerdown", () => {
      if (StorageManager.hasLevelStoredData()) {
        this.showConfirmationDialog(
          () => this.startNewGame(),
          () => {},
        );
      } else {
        this.startNewGame();
      }
    });
  }

  private startNewGame(): void {
    StorageManager.setLevelsMetadataToStorage(levelsConfig);
    this.scene.start(SceneKeys.LEVELS_MENU);
  }

  private continueGame(): void {
    if (StorageManager.hasLevelStoredData()) {
      this.scene.start(SceneKeys.LEVELS_MENU, { continueGame: true });
    }
  }

  private showConfirmationDialog(
    onConfirm: () => void,
    onCancel: () => void,
  ): void {
    const overlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5)
      .setOrigin(0)
      .setInteractive()
      .setDepth(999);

    const dialogBg = this.add
      .rectangle(960, 540, 700, 300, BoxColors.main, 0.8)
      .setStrokeStyle(4, BoxColors.border)
      .setDepth(1000);

    const dialogText = this.add
      .text(
        960,
        480,
<<<<<<< HEAD
        "Are you sure you want to start again? Everything you did will be gone!",
=======
        "¿Seguro que quieres empezar de nuevo? ¡Se borrará la partida anterior!",
>>>>>>> 69e8437 (PR fixes)
        {
          fontFamily: PRIMARY_FONT_FAMILY,
          fontSize: FontSize.LARGE,
          color: Colors.White,
          align: "center",
          wordWrap: { width: 600 },
        },
      )
      .setOrigin(0.5)
      .setDepth(1001);

    const yesButton = this.add
      .image(860, 600, UIComponentKeys.YES_BUTTON)
      .setInteractive({ useHandCursor: true })
      .setScale(0.15)
      .setOrigin(0.5)
      .setDepth(1001);

    const noButton = this.add
      .image(1060, 600, UIComponentKeys.NO_BUTTON)
      .setInteractive({ useHandCursor: true })
      .setScale(0.15)
      .setOrigin(0.5)
      .setDepth(1001);
  
    yesButton.on("pointerover", () => yesButton.setScale(0.2));
    yesButton.on("pointerout", () => yesButton.setScale(0.15));
    noButton.on("pointerover", () => noButton.setScale(0.2));
    noButton.on("pointerout", () => noButton.setScale(0.15));
  
    const destroyDialog = () => {
      overlay.destroy();
      dialogBg.destroy();
      dialogText.destroy();
      yesButton.destroy();
      noButton.destroy();
    };

    yesButton.on("pointerdown", () => {
      destroyDialog();
      onConfirm();
    });

    noButton.on("pointerdown", () => {
      destroyDialog();
      onCancel();
    });
  }
}
