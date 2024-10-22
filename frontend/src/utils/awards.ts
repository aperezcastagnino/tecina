import type { AwardConfig } from "common/comon-ui-config";

export class Awards {
  private _scene: Phaser.Scene;

  private _scale: number;

  private _positionX: number;

  private _positionY: number;

  private _frameRate: number;

  private _padding: number;

  private _assetKey: string;

  private spriteConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig;

  private keyAnim: string;

  private sprites: Phaser.GameObjects.Sprite[];

  constructor(config: AwardConfig) {
    this._scale = config.scale ?? 1;
    this._positionX = config.width - config.padding;
    this._positionY = (config.spriteConfig.frameHeight! / 2) * this._scale;
    this.spriteConfig = config.spriteConfig;
    this._scene = config.scene;
    this._assetKey = config.assetKey;
    this._frameRate = config.frameRate;
    this._padding = config.padding;
    this.keyAnim = "keyAnim";
    this._scene.anims.create({
      key: this.keyAnim,
      frames: this._scene.anims.generateFrameNumbers(this._assetKey),
      frameRate: this._frameRate,
      repeat: -1,
    });
    this.sprites = [];
  }

  setAwardsCount(count: number) {
    const countDifference = count - this.sprites.length;
    if (countDifference > 0) {
      this.addAnims(countDifference);
    } else {
      this.removeAnims(countDifference * -1);
    }
  }

  addAnims(count: number) {
    for (let i = 0; i < count; i += 1) {
      const sprite = this._scene.add
        .sprite(
          this._positionX - this.spriteConfig.frameWidth * i * this._scale,
          this._positionY,
          this._assetKey,
        )
        .setScale(this._scale);
      this.sprites.push(sprite);
    }
    this.sprites.forEach((element) => {
      setTimeout(() => element.play(this.keyAnim), 0);
    });
  }

  removeAnims(count: number) {
    for (let i = 0; i < count; i += 1) {
      const sprite = this.sprites.pop();
      sprite!.stop();
      sprite!.setFrame(0);
      sprite!.visible = false;
    }
  }
}
