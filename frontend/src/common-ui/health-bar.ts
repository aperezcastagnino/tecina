import { AssetKeys } from "assets/asset-keys";
import { GAME_DIMENSIONS } from "config/config";

const HEALTH_BAR_CONFIG = {
  WIDTH: GAME_DIMENSIONS.WIDTH / 7,
  HEIGHT: GAME_DIMENSIONS.HEIGHT / 4,
  POSITION_X: 50,
  POSITION_Y: 100,
  TWEEN_DURATION: 300,
};

export class HealthBar {
  #scene: Phaser.Scene;

  #fillBarLeft!: Phaser.GameObjects.Image;

  #fillBarRight!: Phaser.GameObjects.Image;

  #background!: Phaser.GameObjects.Image;

  #originalWidth: number;

  #healthPercent: number = 100;

  get healthPercent(): number {
    return this.#healthPercent;
  }

  set healthPercent(value: number) {
    this.#healthPercent = Phaser.Math.Clamp(value, 0, 100);
    this.#setFillBarPercentage(this.#healthPercent / 100);
  }

  constructor(scene: Phaser.Scene) {
    this.#scene = scene;
    this.#originalWidth = HEALTH_BAR_CONFIG.WIDTH;

    this.createUI(HEALTH_BAR_CONFIG.POSITION_X, HEALTH_BAR_CONFIG.POSITION_Y);
  }

  createUI(x: number, y: number): void {
    this.#createBackgroundBar();
    this.#createFillBar();

    this.#scene.add.container(x, y, [
      this.#background,
      this.#fillBarLeft,
      this.#fillBarRight,
    ]);
  }

  increaseHealth(amount: number): void {
    this.healthPercent += amount;
  }

  decreaseHealth(amount: number): boolean {
    this.healthPercent -= amount;
    return this.healthPercent <= 0;
  }

  #createBackgroundBar(): void {
    this.#background = this.#scene.add
      .image(0, 0, AssetKeys.UI_COMPONENTS.HEALTH_BAR.BACKGROUND.ASSET_KEY)
      .setOrigin(0, 0.5)
      .setScrollFactor(0);
    this.#background.displayHeight = HEALTH_BAR_CONFIG.HEIGHT;
    this.#background.displayWidth = this.#originalWidth;
  }

  #createFillBar(): void {
    this.#fillBarLeft = this.#scene.add
      .image(0, 0, AssetKeys.UI_COMPONENTS.HEALTH_BAR.LEFT.ASSET_KEY)
      .setOrigin(0, 0.5)
      .setScrollFactor(0);
    this.#fillBarLeft.displayHeight = HEALTH_BAR_CONFIG.HEIGHT;
    this.#fillBarLeft.displayWidth =
      (AssetKeys.UI_COMPONENTS.HEALTH_BAR.LEFT.WIDTH * this.#originalWidth) /
      AssetKeys.UI_COMPONENTS.HEALTH_BAR.BACKGROUND.WIDTH;

    this.#fillBarRight = this.#scene.add
      .image(
        this.#originalWidth * 0.25,
        0,
        AssetKeys.UI_COMPONENTS.HEALTH_BAR.RIGHT.ASSET_KEY,
      )
      .setOrigin(0, 0.5)
      .setScrollFactor(0);
    this.#fillBarRight.displayHeight = HEALTH_BAR_CONFIG.HEIGHT;
    this.#fillBarRight.displayWidth = this.#originalWidth * 0.75;
  }

  #setFillBarPercentage(percent = 1): void {
    const width = this.#originalWidth * percent;
    if (percent < 0.01) {
      this.#scene.tweens.add({
        targets: this.#fillBarRight,
        displayWidth: 0,
        duration: HEALTH_BAR_CONFIG.TWEEN_DURATION,
        ease: Phaser.Math.Easing.Sine.InOut,
      });
      this.#scene.tweens.add({
        targets: this.#fillBarLeft,
        displayWidth: 0,
        duration: HEALTH_BAR_CONFIG.TWEEN_DURATION,
        ease: Phaser.Math.Easing.Sine.InOut,
      });
    } else
      this.#scene.tweens.add({
        targets: this.#fillBarRight,
        displayWidth: width,
        duration: HEALTH_BAR_CONFIG.TWEEN_DURATION,
        ease: Phaser.Math.Easing.Sine.InOut,
      });
  }
}
