import Phaser from "phaser";
import { FontSize, PRIMARY_FONT_FAMILY } from "assets/fonts";
import { UIComponentKeys, BackgroundKeys } from "assets/asset-keys";
import { SceneKeys } from "./scene-keys";

export class WinScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.WIN_SCENE });
  }

  create() {
    const { width, height } = this.scale;

    const background = this.add
      .image(0, 0, BackgroundKeys.MAIN_MENU)
      .setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;

    this.add
      .image(width / 2, height / 2, UIComponentKeys.WIN_TITLE)
      .setOrigin(0.5)
      .setScale(0.7);

    this.add
      .text(width / 2, height / 2 + 150, "Desbloqueaste el siguiente nivel!", {
        fontFamily: PRIMARY_FONT_FAMILY,
        fontSize: FontSize.EXTRA_LARGE,
        color: "#f8de6f",
      })
      .setOrigin(0.5);

    this.input.keyboard?.once("keydown-SPACE", () => {
      this.scene.start(SceneKeys.LEVELS_MENU);
    });
  }
}
