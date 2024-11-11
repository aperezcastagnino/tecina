import Phaser from "phaser";
import { SceneKeys } from "./scene-keys";

export class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.GAME_OVER });
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2, "Felicitaciones, sos un kapo", {
        fontSize: "48px",
        color: "#ff0000",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 100, "Presiona ESPACIO para reiniciar", {
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.input.keyboard?.once("keydown-SPACE", () => {
      this.scene.start("MainScene");
    });
  }
}
