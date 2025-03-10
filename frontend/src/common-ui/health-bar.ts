import { AssetKeys } from "assets/asset-keys";
import { GAME_DIMENSIONS } from "config/config";

const HEALTH_BAR_CONFIG = {
  WIDTH: GAME_DIMENSIONS.WIDTH / 5,
  HEIGHT: GAME_DIMENSIONS.HEIGHT / 3.5,
  POSITION_X: 50,
  POSITION_Y: 100,
  TWEEN_DURATION: 300,
};

export class HealthBar {
  #scene: Phaser.Scene;

  #fillBar!: Phaser.GameObjects.Image;

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
    this.#scene.add.container(x, y, [this.#background, this.#fillBar]);
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
      .image(0, 0, AssetKeys.UI_COMPONENTS.HEALTH_BAR.BACKGROUND)
      .setOrigin(0, 0.5)
      .setScrollFactor(0);
      this.#background.displayHeight = HEALTH_BAR_CONFIG.HEIGHT;
    this.#background.displayWidth = this.#originalWidth;
  }

  #createFillBar(): void {
    this.#fillBar = this.#scene.add
      .image(0, 0, AssetKeys.UI_COMPONENTS.HEALTH_BAR.FILL)
      .setOrigin(0, 0.5)
      .setScrollFactor(0);
    this.#fillBar.displayHeight = HEALTH_BAR_CONFIG.HEIGHT;
    this.#fillBar.displayWidth = this.#originalWidth;
  }

  #setFillBarPercentage(percent = 1): void {
    const width = this.#originalWidth * percent;

    this.#scene.tweens.add({
      targets: this.#fillBar,
      displayWidth: width,
      duration: HEALTH_BAR_CONFIG.TWEEN_DURATION,
      ease: Phaser.Math.Easing.Sine.InOut,
    });
  }
}
