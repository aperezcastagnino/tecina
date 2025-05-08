import Phaser from "phaser";
import { ItemAssets, UIComponentKeys } from "assets/assets";
import { AnimationManager } from "managers/animation-manager";
import { FontSize, PRIMARY_FONT_FAMILY } from "assets/fonts";
import { StorageManager } from "managers/storage-manager";
import { SceneKeys } from "./scene-keys";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super(SceneKeys.GAME_OVER);
  }

  create(): void {
    this.initializeUI();

    this.input.keyboard?.once("keydown-SPACE", () => {
      const currentLevel = StorageManager.getLevelMetadataFromRegistry(
        this.game,
      );
      if (currentLevel?.key) {
        this.scene.start(currentLevel.key);
      }
    });
  }

  private initializeUI() {
    this.setupBackground();
    this.createGameOverImage();
    this.createRestartText();
    this.createFrogAnimation();
  }

  private setupBackground(): void {
    this.cameras.main.setBackgroundColor("#341c08");
  }

  private createGameOverImage(): void {
    const { width, height } = this.scale;

    this.add
      .image(width / 2, height / 2, UIComponentKeys.GAME_OVER)
      .setOrigin(0.5)
      .setScale(0.7);
  }

  private createRestartText(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2 + 250, "Presiona ESPACIO para reiniciar", {
        fontFamily: PRIMARY_FONT_FAMILY,
        fontSize: FontSize.EXTRA_LARGE,
        color: "#f8de6f",
      })
      .setOrigin(0.5);
  }

  private createFrogAnimation(): void {
    AnimationManager.createAnimation(this, ItemAssets.FROG);

    const { width, height } = this.scale;
    const frog = this.add
      .sprite(width, height, ItemAssets.FROG.assetKey)
      .setOrigin(1.2, 1)
      .setScale(6);

    frog.play(ItemAssets.FROG.animationKey, true);
  }
}
