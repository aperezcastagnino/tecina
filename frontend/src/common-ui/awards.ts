import { MAP_WIDTH, TILE_SIZE } from "config/config";
import { Animations, FRAME_RATE } from "utils/animation-utils";

const AWARDS_CONFIG = {
  POSITION_X: MAP_WIDTH * 75 + 60,
  POSITION_Y: TILE_SIZE / 2 + 0,
  WIDTH: (MAP_WIDTH / 6) * TILE_SIZE,
  HEIGHT: 16,
  // eslint-disable-next-line object-shorthand
  FRAME_RATE: FRAME_RATE,
  SCALE: 3,
  MAX_AWARDS: 5,
  PADDING: 35,
};

export type AwardConfig = {
  scene: Phaser.Scene;
  frameRate?: number;
  assetKey: string;
  spriteConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig;
  scale?: number;
};

export class Awards {
  private scene: Phaser.Scene;

  private assetKey: string;

  private keyAnim: string;

  private positionX: number;

  private positionY: number;

  private scale: number;

  private padding: number;

  private spriteConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig;

  private sprites: Phaser.GameObjects.Sprite[] = [];

  private background!: Phaser.GameObjects.Image;

  private container!: Phaser.GameObjects.Container;

  constructor(config: AwardConfig) {
    if (!config.scene || !config.assetKey) {
      throw new Error("Invalid Awards configuration");
    }

    this.scene = config.scene;
    this.assetKey = config.assetKey;
    this.keyAnim = `AwardsKeyAnim_${this.assetKey}`;
    this.positionX = AWARDS_CONFIG.POSITION_X;
    this.positionY = AWARDS_CONFIG.POSITION_Y;
    this.scale = AWARDS_CONFIG.SCALE;
    this.padding = AWARDS_CONFIG.PADDING;
    this.spriteConfig = config.spriteConfig;

    Animations.createAnimations(this.scene, {
      key: this.keyAnim,
      assetKey: this.assetKey,
      frameRate: config.frameRate,
    });

    this.initializeUI();
  }

  setAwardsCount(count: number): void {
    if (count < 0) {
      throw new Error("Awards count cannot be negative");
    }

    const countDifference = count - this.sprites.length;
    if (countDifference > 0) {
      this.addAward(countDifference);
    } else {
      this.removeAward(countDifference * -1);
    }

    this.container.visible = countDifference > 0;
  }

  destroy() {
    this.sprites.forEach((sprite) => sprite.destroy());
    if (this.container) {
      this.container.removeAll(true);
      this.container.destroy();
    }
    if (this.background) this.background.destroy();
  }

  private initializeUI(): void {
    this.createBackground();

    this.container = this.scene.add.container(
      this.positionX - this.background.displayWidth,
      this.positionY,
      [this.background],
    );

    this.container.visible = false;
  }

  private createBackground(): void {
    const graphics = this.scene.add.graphics();

    const maxAwards = 5; // Default or from config
    const totalWidth = this.spriteConfig.frameWidth * this.scale * maxAwards;
    const height = AWARDS_CONFIG.HEIGHT * this.scale + this.padding / 2;

    // Draw the background
    graphics.fillStyle(0x333333, 0.8); // Dark gray with some transparency
    graphics.fillRoundedRect(0, 0, totalWidth, height, 10); // Rounded corners
    graphics.lineStyle(2, 0xffffff, 1); // White border
    graphics.strokeRoundedRect(0, 0, totalWidth, height, 10);

    // Convert to texture and create image
    const key = "awards-background";
    if (!this.scene.textures.exists(key)) {
      graphics.generateTexture(key, totalWidth, height);
    }
    graphics.destroy();

    this.background = this.scene.add
      .image(0, 0, key)
      .setOrigin(0, 0.5)
      .setScrollFactor(0);
  }

  private addAward(count: number): void {
    if (count <= 0) return;

    const initialLength = this.sprites.length;
    const spacing = this.spriteConfig.frameWidth + this.padding;
    const actualCount = Math.min(
      count,
      AWARDS_CONFIG.MAX_AWARDS - initialLength,
    );

    for (let i = 0; i < actualCount; i += 1) {
      const sprite = this.scene.add
        .sprite(
          this.background.x + this.padding + spacing * (i + initialLength),
          0,
          this.assetKey,
        )
        .setScrollFactor(0)
        .setScale(this.scale);

      this.container.add(sprite);
      this.sprites.push(sprite);

      // Add a small delay between animations for a cascade effect
      this.scene.time.delayedCall(i * 50, () => {
        if (sprite.active) {
          sprite.play(this.keyAnim);
        }
      });
    }
  }

  private removeAward(count: number): void {
    if (count <= 0 || this.sprites.length === 0) return;

    for (let i = 0; i < count; i += 1) {
      const sprite = this.sprites[this.sprites.length - 1 - i];

      // Add a small delay between removals for a cascade effect
      this.scene.time.delayedCall(i * 50, () => {
        if (sprite && sprite.active) {
          // Add a fade-out effect
          this.scene.tweens.add({
            targets: sprite,
            alpha: 0,
            scale: this.scale * 0.8,
            duration: 200,
            onComplete: () => {
              this.container.remove(sprite);
              this.sprites.splice(this.sprites.indexOf(sprite), 1);
              sprite.destroy();
            },
          });
        }
      });
    }
  }
}
