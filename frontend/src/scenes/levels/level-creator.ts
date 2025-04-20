import type { LevelConfig } from "types/level";
import { Animations } from "utils/animation-utils";
import type { SpriteAssetConfig } from "types/asset";
import { BaseLevelScene } from "./base-level-scene";

export class Level extends BaseLevelScene {
  private params: LevelConfig;

  constructor(params: LevelConfig) {
    super(params.name);
    this.params = params;
  }

  protected async preload(): Promise<void> {
    await super.preload({
      name: this.scene.key,
      tilesConfig: this.params.tiles,
      dimensions: this.params.dimensions,
    });

    if (this.params.onPreload) {
      await this.params.onPreload();
    }
  }

  async create(): Promise<void> {
    await super.create();

    if (this.params.onCreate) {
      await this.params.onCreate(this);
    }

    this.params.itemsToHide?.forEach((item: SpriteAssetConfig) => {
      this.hideElements(item.ASSET_KEY);
    });
  }

  protected createAnimations(): void {
    this.params.itemsToAnimate?.forEach((item: SpriteAssetConfig) => {
      Animations.animateItem(this, item);
    });
  }

  protected setupCollisions(): void {
    super.setupCollisions();

    this.params.itemsToMakeDraggable?.forEach((item: SpriteAssetConfig) => {
      this.makeItemDraggable(item.ASSET_KEY);
    });
  }
}
