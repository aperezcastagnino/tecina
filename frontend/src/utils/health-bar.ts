import { AssetKeys } from "assets/asset-keys";
import { WIDTH, HEIGHT, POSITION_X, POSITION_Y } from "common-ui/health-bar";

export class HealthBar {
  #scene: Phaser.Scene;

  #middle_green!: Phaser.GameObjects.Image;

  #middle_shadow!: Phaser.GameObjects.Image;

  #scaleY!: number;

  #container_shadows!: Phaser.GameObjects.Container;

  #container!: Phaser.GameObjects.Container;

  #fullWidth!: number;

  #fullHeight!: number;

  #percent!: number;

  constructor(scene: Phaser.Scene) {
    this.#scene = scene;
    this.#scaleY = 0.7;
    this.#fullWidth = WIDTH;
    this.#fullHeight = HEIGHT;
    this.#percent = 100;

    const x = POSITION_X;
    const y = POSITION_Y;

    this.#container_shadows = this.#scene.add.container(x, y, []);
    this.#container = this.#scene.add.container(x, y, []);

    this._createBarShadowImages(x, y);
    this._createBarImages(x, y);
  }

  _createBarShadowImages(x: number, y: number) {
    this.#middle_shadow = this.#scene.add
      .image(x, y, AssetKeys.HEALTH_BAR.MIDDLE_SHADOW)
      .setOrigin(0, 0.5)
      .setScale(1, this.#scaleY)
      .setScrollFactor(0);
    this.#middle_shadow.displayWidth = this.#fullWidth;
    this.#middle_shadow.displayHeight = this.#fullHeight;
    this.#container_shadows.add([this.#middle_shadow]);
  }

  _createBarImages(x: number, y: number) {
    this.#middle_green = this.#scene.add
      .image(x, y, AssetKeys.HEALTH_BAR.MIDDLE_GREEN)
      .setOrigin(0, 0.5)
      .setScale(1, 0)
      .setScrollFactor(0);
    this.#middle_green.displayHeight = this.#fullHeight;
    this.#middle_green.displayWidth = this.#fullWidth;

    this.#updateBarGameObjects();
    this.#container.add([this.#middle_green]);
  }

  decreaseHealth(number: number) {
    this.#percent -= number;
    if (this.#percent <= 0) {
      this.#scene.scene.start("GAME_OVER");
    } else {
      this.#setMeterPercentage(this.#percent / 100);
    }
  }

  increaseHealth(number: number) {
    this.#percent += number;
    if (this.#percent >= 100) {
      this.#percent = 100;
    }
    this.#setMeterPercentage(this.#percent / 100);
  }

  #setMeterPercentage(percent = 1) {
    const width = this.#fullWidth * percent;
    this.#middle_green.setOrigin(0, 0.5); // Reset origin before tween

    this.#scene.tweens.add({
      targets: this.#middle_green,
      displayWidth: width,
      duration: 300,
      ease: Phaser.Math.Easing.Sine.InOut,
      onUpdate: () => {
        this.#updateBarGameObjects();
      },
      onComplete: () => {
        this.#middle_green.setOrigin(0, 0.5); // This is not working properly
      },
    });
  }

  #updateBarGameObjects() {
    const constrainedWidth = Math.max(
      0,
      Math.min(this.#middle_green.displayWidth, this.#fullWidth),
    );
    this.#middle_green.displayWidth = constrainedWidth;
    this.#middle_green.visible = constrainedWidth > 0;
  }
}
