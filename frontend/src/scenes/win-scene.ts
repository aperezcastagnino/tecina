import Phaser from "phaser";
import { UIComponentKeys, BackgroundKeys } from "assets/assets";
import { SceneKeys } from "./scene-keys";
import { PRIMARY_FONT_FAMILY, FontSize } from "assets/fonts";

export default class WinScene extends Phaser.Scene {
  constructor() {
    super(SceneKeys.WIN_SCENE);
  }

  create(): void {
    this.initializeUI();

    this.input.keyboard?.once("keydown-SPACE", () => {
      this.scene.start(SceneKeys.LEVELS_MENU);
    });
  }

  private initializeUI(): void {
    this.createBackground();
    this.createWinTitle();
  }

  private createBackground(): void {
    const background = this.add
      .image(0, 0, BackgroundKeys.MAIN_MENU)
      .setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
  }

  private createWinTitle(): void {
    const { width, height } = this.scale;

    this.add
      .image(width / 2, height / 2, UIComponentKeys.WIN_TITLE)
      .setOrigin(0.5)
      .setScale(0.7);
      this.add
      .text(width / 2, height / 2 + 110, "Presiona ESPACIO para continuar", {
        fontFamily: PRIMARY_FONT_FAMILY,
        fontSize: FontSize.EXTRA_LARGE,
        color: "#f8de6f",
      })
      .setOrigin(0.5);
    }
}
