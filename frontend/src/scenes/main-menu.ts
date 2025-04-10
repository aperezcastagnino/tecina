import { Scene } from "phaser";
import { TextButton } from "common-ui/text-button";
import { buttonStyles } from "styles/menu-styles";
import { StorageManager } from "utils/storage-manager";
import { levelConfig } from "config/levels-config";
import { BackgroundKeys } from "assets/asset-keys";
import { SceneKeys } from "./scene-keys";

export class MainMenu extends Scene {
  constructor() {
    super(SceneKeys.MAIN_MENU);
  }

  create() {
    const background = this.add
      .image(0, 0, BackgroundKeys.MAIN_MENU)
      .setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;

    const title = this.add.text(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2 - 200,
      "Climb the cina cina",
      {
        fontSize: "80px",
        color: "#D89079",
        stroke: "#D89079",
        strokeThickness: 6,
      },
    );
    title.setOrigin(0.5);

    const startGameButton = new TextButton(
      this,
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2 - 50 + 140,
      "Comenzar a jugar",
      buttonStyles.startButton,
      () => this.startNewGame(),
    );
    startGameButton.setOrigin(0.5);
    startGameButton.setSize(
      buttonStyles.startButton.width,
      buttonStyles.startButton.height,
    ); // Set fixed size

    const loadPreviousGameButton = new TextButton(
      this,
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2 + 50 + 140,
      "Continuar partida",
      buttonStyles.loadButton,
      () => this.continueGame(),
    );
    loadPreviousGameButton.setOrigin(0.5);
    loadPreviousGameButton.setSize(
      buttonStyles.startButton.width,
      buttonStyles.startButton.height,
    ); // Set fixed size

    if (!StorageManager.hasLevelStoredData()) {
      loadPreviousGameButton.setStyle(buttonStyles.loadButtonDisabled);
      loadPreviousGameButton.setInteractive(false); // Desactivar la interactividad
    }

    this.add.existing(startGameButton);
    this.add.existing(loadPreviousGameButton);
  }

  startNewGame() {
    StorageManager.setLevelsMetadata(levelConfig);
    this.scene.start(SceneKeys.LEVELS_MENU, { continueGame: false });
  }

  continueGame() {
    if (StorageManager.hasLevelStoredData()) {
      this.scene.start(SceneKeys.LEVELS_MENU, { continueGame: true });
    }
  }
}
