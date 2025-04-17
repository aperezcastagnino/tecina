import Phaser from "phaser";
import { UIComponentKeys } from "assets/asset-keys";
import { FontSize, PRIMARY_FONT_FAMILY } from "assets/fonts";
import { SceneKeys } from "./scene-keys";

export class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.GAME_OVER });
  }

  create() {
    const { width, height } = this.scale;

    // Set the background color to brown
    this.cameras.main.setBackgroundColor("#341c08");

    this.add
      .image(width / 2, height / 2, UIComponentKeys.GAME_OVER)
      .setOrigin(0.5)
      .setScale(0.7);

    this.add
      .text(width / 2, height / 2 + 250, "Presiona ESPACIO para reiniciar", {
        fontFamily: PRIMARY_FONT_FAMILY,
        fontSize: FontSize.EXTRA_LARGE,
        color: "#f8de6f",
      })
      .setOrigin(0.5);

    this.input.keyboard?.once("keydown-SPACE", () => {
      this.scene.start(SceneKeys.LEVEL_1); // here we need a global variable to track in which level the user is
    });
  }
}
