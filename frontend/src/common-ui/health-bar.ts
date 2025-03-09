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

  #fullWidth!: number;

  #fullHeight!: number;

  #healthPercent: number = 100;

  constructor(scene: Phaser.Scene) {
    this.#scene = scene;
    this.#fullWidth = HEALTH_BAR_CONFIG.WIDTH;
    this.#fullHeight = HEALTH_BAR_CONFIG.HEIGHT;

    this.createUI(HEALTH_BAR_CONFIG.POSITION_X, HEALTH_BAR_CONFIG.POSITION_Y);
  }

  createUI(x: number, y: number): void {
    this.#createBackgroundBar();
    this.#createBarImages();

    this.#scene.add.container(x, y, [this.#background, this.#fillBar]);
  }

  get healthPercent(): number {
    return this.#healthPercent;
  }

  set healthPercent(value: number) {
    this.#healthPercent = Phaser.Math.Clamp(value, 0, 100);
    this.#setMeterPercentage(this.#healthPercent / 100);
  }

  increaseHealth(amount: number): void {
    this.healthPercent += amount;
    this.#setMeterPercentage(this.healthPercent);
  }

  decreaseHealth(amount: number): boolean {
    this.#healthPercent -= amount;
    if (this.#healthPercent <= 0) {
      this.#scene.scene.start("GAME_OVER");
      return true;
    }

    debugger
    this.#setMeterPercentage(this.healthPercent);
    return false;
  }

  #createBackgroundBar(): void {
    this.#background = this.#scene.add
      .image(0, 0, AssetKeys.UI_COMPONENTS.HEALTH_BAR.BACKGROUND)
      .setOrigin(0, 0.5)
      .setScale(1)
      .setScrollFactor(0);
    this.#background.displayWidth = this.#fullWidth;
    this.#background.displayHeight = this.#fullHeight;
  }

  #createBarImages(): void {
    this.#fillBar = this.#scene.add
      .image(0, 0, AssetKeys.UI_COMPONENTS.HEALTH_BAR.FILL)
      .setOrigin(0, 0.5)
      .setScale(1, 0)
      .setScrollFactor(0);
    this.#fillBar.displayHeight = this.#fullHeight;
    this.#fillBar.displayWidth = this.#fullWidth;
  }

  #setMeterPercentage(percent = 1): void {
    const width = this.#fullWidth * percent;

    this.#scene.tweens.add({
      targets: this.#fillBar,
      displayWidth: width,
      duration: HEALTH_BAR_CONFIG.TWEEN_DURATION,
      ease: Phaser.Math.Easing.Sine.InOut,
      onUpdate: () => {
        this.#fillBar.visible = this.#fillBar.displayWidth > 0;
      }
    });
  }
}
