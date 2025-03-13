export type AwardConfig = {
  scene: Phaser.Scene;
  width: number;
  padding: number;
  frameRate: number;
  assetKey: string;
  spriteConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig;
};

export class Awards {
  #scene: Phaser.Scene;

  #positionX: number;

  #positionY: number;

  #assetKey: string;

  #spriteConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig;

  #keyAnim: string;

  #sprites: Phaser.GameObjects.Sprite[] = [];

  constructor(config: AwardConfig) {
    this.#positionX = config.width - config.padding;
    this.#positionY = config.spriteConfig.frameHeight! / 2;
    this.#spriteConfig = config.spriteConfig;
    this.#scene = config.scene;
    this.#assetKey = config.assetKey;
    this.#keyAnim = "AwardsKeyAnim";
    this.#scene.anims.create({
      key: this.#keyAnim,
      frames: this.#scene.anims.generateFrameNumbers(this.#assetKey),
      frameRate: config.frameRate,
      repeat: -1,
    });
  }

  #addAnims(count: number): void {
    const initialLength = this.#sprites.length;
    for (let i = 0; i < count; i += 1) {
      const sprite = this.#scene.add
        .sprite(
          this.#positionX - this.#spriteConfig.frameWidth * (i + initialLength),
          this.#positionY,
          this.#assetKey,
        )
        .setScrollFactor(0);

      this.#sprites.push(sprite);
    }
    this.#sprites.forEach((element) => {
      setTimeout(() => element.play(this.#keyAnim), 0);
    });
  }

  #removeAnims(count: number): void {
    for (let i = 0; i < count; i += 1) {
      const sprite = this.#sprites.pop();
      if (sprite) {
        sprite.stop();
        sprite.setFrame(0);
        sprite.setVisible(false);
      }
    }
  }

  setAwardsCount(count: number): void {
    const countDifference = count - this.#sprites.length;
    if (countDifference > 0) {
      this.#addAnims(countDifference);
    } else {
      this.#removeAnims(countDifference * -1);
    }
  }
}
