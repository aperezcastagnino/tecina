import { BoxColors } from "assets/colors";
import { MAP_WIDTH, TILE_SIZE } from "config";
import { Animations, FRAME_RATE } from "utils/animation-utils";

const AWARDS_CONFIG = {
  POSITION_X: MAP_WIDTH * 75 + 60,
  POSITION_Y: TILE_SIZE / 2 + 0,
  WIDTH: (MAP_WIDTH / 6) * TILE_SIZE,
  HEIGHT: 16,
  // eslint-disable-next-line object-shorthand
  FRAME_RATE: FRAME_RATE,
  SCALE: 3,
  PADDING: 35,
  FADE_OUT_DURATION: 200,
};

export type AwardConfig = {
  scene: Phaser.Scene;
  frameRate?: number;
  assetKey: string;
  spriteConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig;
  scale?: number;
  quantity: number;
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

  get quantity(): number {
    return this.sprites.length;
  }

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

    this.initializeUI(config.quantity);
  }

  removeAward(): number {
    if (this.sprites.length === 0) return 0;
    const sprite = this.sprites[this.sprites.length - 1];

    // Add a small delay between removals for a cascade effect
    this.scene.time.delayedCall(25, () => {
      if (sprite && sprite.active) {
        // Add a fade-out effect
        this.scene.tweens.add({
          targets: sprite,
          alpha: 0,
          scale: this.scale * 0.8,
          duration: AWARDS_CONFIG.FADE_OUT_DURATION,
          onComplete: () => {
            this.container.remove(sprite);
            this.sprites.pop();
            sprite.destroy();

            this.container.visible = this.sprites.length !== 0;
          },
        });
      }
    });

    return this.sprites.length - 1;
  }

  destroy() {
    this.sprites.forEach((sprite) => sprite.destroy());
    if (this.container) {
      this.container.removeAll(true);
      this.container.destroy();
    }
    if (this.background) this.background.destroy();
  }

  private initializeUI(quantity: number): void {
    this.createBackground();

    this.container = this.scene.add.container(
      this.positionX - this.background.displayWidth,
      this.positionY,
      [this.background],
    );

    this.addAwards(quantity);
  }

  private createBackground(): void {
    const graphics = this.scene.add.graphics();

    const maxAwards = 5; // Default or from config
    const totalWidth = this.spriteConfig.frameWidth * this.scale * maxAwards;
    const height = AWARDS_CONFIG.HEIGHT * this.scale + this.padding / 2;

    // Draw the background
    graphics.fillStyle(BoxColors.main, 0.8);
    graphics.fillRoundedRect(0, 0, totalWidth, height, 10);
    graphics.lineStyle(6, BoxColors.border, 1);
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

  private addAwards(count: number): void {
    if (count <= 0) return;

    const spacing = this.spriteConfig.frameWidth + this.padding;
    for (let i = 0; i < count; i += 1) {
      const sprite = this.scene.add
        .sprite(
          this.background.x + this.padding + spacing * i,
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
}
