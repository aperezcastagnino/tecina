import { Scene } from "phaser";
import { UIComponentKeys, BackgroundKeys } from "assets/assets";
import { PRIMARY_FONT_FAMILY, FontSize, fontColor } from "assets/fonts";
import { Controls } from "common/controls";
import { SceneKeys } from "./scene-keys";

export default class WinScene extends Scene {
  private controls!: Controls;

  constructor() {
    super(SceneKeys.WIN_SCENE);
  }

  create(): void {
    this.initializeUI();
    this.controls = new Controls(this);
  }

  update(): void {
    if (this.controls.wasSpaceKeyPressed()) {
      this.scene.start(SceneKeys.LEVELS_MENU);
    }
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
        color: fontColor.YELLOW,
      })
      .setOrigin(0.5);
  }
}
