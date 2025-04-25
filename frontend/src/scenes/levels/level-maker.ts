import type { LevelConfig } from "types/level";
import { ItemState, TileType, type TileConfig } from "types/map.d";
import { ItemAssets, type AssetKey } from "assets/assets";
import { AnimationManager } from "managers/animation-manager";
import { BaseLevelScene } from "./base-level-scene";

export class Level extends BaseLevelScene {
  private params: LevelConfig;

  private items: TileConfig[];

  constructor(params: LevelConfig) {
    super(params.name);
    this.params = params;
    this.items = this.params.tilesConfig.filter(
      (t) => t.type === TileType.INTERACTIVE_OBJECT,
    );
  }

  protected async preload(): Promise<void> {
    await super.preload({
      name: this.scene.key,
      tilesConfig: this.params.tilesConfig,
      dimensions: this.params.dimensions,
    });

    if (this.params.onPreload) {
      await this.params.onPreload(this);
    }
  }

  async create(): Promise<void> {
    await super.create();

    if (this.params.onCreate) {
      await this.params.onCreate(this);
    }

    this.items
      .filter((i) => i.initialState === ItemState.HIDDEN)
      .forEach((item: TileConfig) => {
        this.hideElements(ItemAssets[item.assetKey as AssetKey]);
      });
  }

  protected createAnimations(): void {
    this.items
      .filter((i) => i.isAnimated)
      .forEach((item: TileConfig) => {
        AnimationManager.createAnimation(
          this,
          ItemAssets[item.assetKey as AssetKey],
        );
      });
  }

  protected setupCollisions(): void {
    super.setupCollisions();

    this.items.forEach((item: TileConfig) => {
      this.makeItemDraggable(ItemAssets[item.assetKey as AssetKey]);
    });
  }
}
