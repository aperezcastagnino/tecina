import type { AwardConfig } from "common-ui/config";

export class Awards {
  #scene: Phaser.Scene;
  #scale: number;
  #positionX: number;
  #positionY: number;
  #frameRate: number;
  #padding: number;
  #assetKey: string;
  #spriteConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig;
  #keyAnim: string;
  #sprites: Phaser.GameObjects.Sprite[];

  constructor(config: AwardConfig) {
    this.#scale = config.scale ?? 1;
    this.#positionX = config.width - config.padding;
    this.#positionY = (config.spriteConfig.frameHeight! / 2) * this.#scale;
    this.#spriteConfig = config.spriteConfig;
    this.#scene = config.scene;
    this.#assetKey = config.assetKey;
    this.#frameRate = config.frameRate;
    this.#padding = config.padding;
    this.#keyAnim = "AwardsKeyAnim";

    // Crear la animación
    this.#scene.anims.create({
      key: this.#keyAnim,
      frames: this.#scene.anims.generateFrameNumbers(this.#assetKey),
      frameRate: this.#frameRate,
      repeat: -1,
    });

    this.#sprites = [];
  }

  setAwardsCount(count: number) {
    const countDifference = count - this.#sprites.length;
    if (countDifference > 0) {
      this.addAnims(countDifference);
    } else {
      this.removeAnims(countDifference * -1);
    }
  }

  addAnims(count: number) {
    const initialLength = this.#sprites.length;
    for (let i = 0; i < count; i += 1) {
      const sprite = this.#scene.add
        .sprite(
          this.#positionX -
            this.#spriteConfig.frameWidth * (i + initialLength) * this.#scale,
          this.#positionY,
          this.#assetKey,
        )
        .setScale(this.#scale)
        .setScrollFactor(0); // Hace que el sprite no se mueva con la cámara

      this.#sprites.push(sprite);
    }

    // Reproducir la animación para cada sprite
    this.#sprites.forEach((element) => {
      setTimeout(() => element.play(this.#keyAnim), 0);
    });
  }

  removeAnims(count: number) {
    for (let i = 0; i < count; i += 1) {
      const sprite = this.#sprites.pop();
      if (sprite) {
        sprite.stop();
        sprite.setFrame(0);
        sprite.setVisible(false);
      }
    }
  }
}
