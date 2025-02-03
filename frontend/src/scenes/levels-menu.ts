import Phaser from "phaser";
import { buttonStyles } from "config/menu-styles";
import { SceneKeys } from "./scene-keys";
import { TextButton } from "common-ui/text-button";
import { AssetKeys } from "assets/asset-keys";

export default class LevelsMenu extends Phaser.Scene {
  constructor() {
    super(SceneKeys.LEVELS_MENU);
  }

  preload() {
    // Load any assets here if needed
  }

  create() {
    const background = this.add
      .image(0, 0, AssetKeys.BACKGROUNDS.MAIN_MENU)
      .setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;

    const buttonGrid = {
      rows: 3,
      cols: 3,
      buttonWidth: buttonStyles.startButton.width,
      buttonHeight: buttonStyles.startButton.height,
      spacing: 30,
    };

    const startX =
      (this.sys.canvas.width -
        (buttonGrid.cols * buttonGrid.buttonWidth +
          (buttonGrid.cols - 1) * buttonGrid.spacing)) /
      2;
    const startY =
      (this.sys.canvas.height -
        (buttonGrid.rows * buttonGrid.buttonHeight +
          (buttonGrid.rows - 1) * buttonGrid.spacing)) /
      2;

    for (let row = 0; row < buttonGrid.rows; row++) {
      for (let col = 0; col < buttonGrid.cols; col++) {
        const x = startX + col * (buttonGrid.buttonWidth + buttonGrid.spacing);
        const y = startY + row * (buttonGrid.buttonHeight + buttonGrid.spacing);
        const levelNumber = row * buttonGrid.cols + col + 1;
        const levelButton = new TextButton(
          this,
          x,
          y,
          `Level ${levelNumber}`,
          buttonStyles.startButton,
          () => this.startLevel(levelNumber),
        );
        levelButton.setSize(buttonGrid.buttonWidth, buttonGrid.buttonHeight);
        this.add.existing(levelButton);
      }
    }
  }
  startGame() {
    this.scene.start(SceneKeys.LEVEL_1);
  }

  startLevel(levelNumber: number) {
    const level = `LEVEL_${levelNumber}` as keyof typeof SceneKeys;
    this.scene.start(SceneKeys[level]);
  }
}
