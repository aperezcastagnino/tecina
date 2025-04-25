import Phaser from "phaser";
import { UIComponentKeys, BackgroundKeys } from "assets/assets";
import { SceneKeys } from "./scene-keys";

export class WinScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.WIN_SCENE);
  }

  create() {
    this.initializeUI();

    this.input.keyboard?.once("keydown-SPACE", () => {
      this.scene.start(SceneKeys.LEVELS_MENU);
    });
  }

  private initializeUI() {
    this.createBackground();
    this.createWinTitle();
  }

  private createBackground() {
    const background = this.add
      .image(0, 0, BackgroundKeys.MAIN_MENU)
      .setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
  }

  private createWinTitle() {
    const { width, height } = this.scale;

    this.add
      .image(width / 2, height / 2, UIComponentKeys.WIN_TITLE)
      .setOrigin(0.5)
      .setScale(0.7);
  }
}
