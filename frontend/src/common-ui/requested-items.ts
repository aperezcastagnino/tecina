import { BoxColors } from "assets/colors";
import { DEPTH_1, MAP_WIDTH, TILE_SIZE } from "config";
import { AnimationManager, FRAME_RATE } from "managers/animation-manager";
import type { AssetConfig } from "types/asset";
import { PRIMARY_FONT_FAMILY } from "assets/fonts";

const INITIAL_CONFIG = {
  POSITION_X: MAP_WIDTH * 75 + 60,
  POSITION_Y: TILE_SIZE / 2 + 0,
  WIDTH: (MAP_WIDTH / 6) * TILE_SIZE,
  HEIGHT: 16,
  // eslint-disable-next-line object-shorthand
  FRAME_RATE: FRAME_RATE,
  SCALE: 3,
  PADDING: 35,
  FADE_OUT_DURATION: 200,
  MAX_ITEMS: 4,
  LABEL: {
    TEXT: "COLLECT:",
    FONT_SIZE: 24,
    COLOR: "#f8de6f",
    PADDING: 10,
  },
};

type RequestedItemConfig = {
  scene: Phaser.Scene;
  asset: AssetConfig;
  quantity: number;
};

export class RequestedItems {
  private scene: Phaser.Scene;

  private asset: AssetConfig;

  private keyAnim: string;

  private positionX: number;

  private positionY: number;

  private scale: number;

  private padding: number;

  private sprites: Phaser.GameObjects.Sprite[] = [];

  private background!: Phaser.GameObjects.Image;

  private container!: Phaser.GameObjects.Container;

  private label!: Phaser.GameObjects.Text;

  get quantity(): number {
    return this.sprites.length;
  }

  constructor(config: RequestedItemConfig) {
    if (!config.scene || !config.asset) {
      throw new Error("Invalid Requested Items configuration");
    }

    this.scene = config.scene;
    this.asset = config.asset;
    this.keyAnim = `RequestedItemsKeyAnim_${config.asset.assetKey}`;
    this.positionX = INITIAL_CONFIG.POSITION_X;
    this.positionY = INITIAL_CONFIG.POSITION_Y;
    this.scale = config.asset.scale || INITIAL_CONFIG.SCALE;
    this.padding = INITIAL_CONFIG.PADDING;

    AnimationManager.createAnimation(this.scene, {
      ...this.asset,
      animationKey: this.keyAnim,
    });

    this.initializeUI(config.quantity);
  }

  removeItem(): number {
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
          duration: INITIAL_CONFIG.FADE_OUT_DURATION,
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
    if (this.label) this.label.destroy();
  }

  private initializeUI(quantity: number): void {
    this.createLabel();
    this.createBackground(quantity);

    this.container = this.scene.add
      .container(
        this.positionX - this.background.displayWidth,
        this.positionY,
        [this.background, this.label],
      )
      .setDepth(DEPTH_1);

    this.addItems(quantity);
  }

  private createLabel(): void {
    this.label = this.scene.add
      .text(
        this.padding / 2,
        (-INITIAL_CONFIG.HEIGHT * this.scale) / 2 +
          INITIAL_CONFIG.LABEL.PADDING / 2,
        INITIAL_CONFIG.LABEL.TEXT,
        {
          fontSize: `${INITIAL_CONFIG.LABEL.FONT_SIZE}px`,
          fontFamily: PRIMARY_FONT_FAMILY,
          color: INITIAL_CONFIG.LABEL.COLOR,
          stroke: INITIAL_CONFIG.LABEL.SHADOW_COLOR,
          strokeThickness: 1,
          shadow: {
            offsetX: INITIAL_CONFIG.LABEL.SHADOW_DISTANCE,
            offsetY: INITIAL_CONFIG.LABEL.SHADOW_DISTANCE,
            color: INITIAL_CONFIG.LABEL.SHADOW_COLOR,
            blur: 3,
            stroke: true,
            fill: true,
          },
        },
      )
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(DEPTH_1);
  }

  private createBackground(countItems: number): void {
    const maxItems =
      countItems > INITIAL_CONFIG.MAX_ITEMS
        ? countItems
        : INITIAL_CONFIG.MAX_ITEMS;
    const totalWidth =
      this.asset.frameWidth! * this.scale * maxItems + this.label.displayWidth;
    const height =
      (INITIAL_CONFIG.HEIGHT * this.scale + this.padding / 2) * 1.4;

    // Draw the background
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(BoxColors.main, 0.9);
    graphics.fillRoundedRect(0, 0, totalWidth, height, 10);
    graphics.lineStyle(6, BoxColors.border, 1);
    graphics.strokeRoundedRect(0, 0, totalWidth, height, 10);

    // Convert to texture and create image
    const key = "requested-items-background";
    if (!this.scene.textures.exists(key)) {
      graphics.generateTexture(key, totalWidth, height);
    }
    graphics.destroy();

    this.background = this.scene.add
      .image(0, 0, key)
      .setOrigin(0, 0.5)
      .setScrollFactor(0);
  }

  private addItems(count: number): void {
    if (count <= 0) return;

    const spacing = this.asset.frameWidth! + this.padding * 0.33;
    const baseX =
      this.background.x + this.label.displayWidth + this.padding * 1.25;
    for (let i = 0; i < count; i += 1) {
      const sprite = this.scene.add
        .sprite(baseX + spacing * i, 0, this.asset.assetKey)
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
