import Phaser from "phaser";
import { UIComponentKeys, ItemKeys } from "assets/asset-keys";
import { Animations } from "utils/animation-utils";
import { FontSize, PRIMARY_FONT_FAMILY } from "assets/fonts";
import { StorageManager } from "utils/storage-manager";
import { SceneKeys } from "./scene-keys";

export class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.GAME_OVER });
  }

  create() {
    const { width, height } = this.scale;

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

    Animations.useFrogAnimation(this);

    const frog = this.add
      .sprite(width, height, ItemKeys.ANIMALS.FROG.ASSET_KEY)
      .setOrigin(1.2, 1)
      .setScale(6);
    frog.play(ItemKeys.ANIMALS.FROG.ANIMATION_KEY);

    this.input.keyboard?.once("keydown-SPACE", () => {
      const currentLevel = StorageManager.getLevelMetadataFromRegistry(
        this.game,
      );
      if (currentLevel?.key) {
        this.scene.start(currentLevel.key);
      }
    });
  }
}
