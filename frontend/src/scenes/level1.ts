import { AssetKeys } from "assets/asset-keys";
import { SceneKeys } from "scenes/scene-keys";
import { BaseScene } from "scenes/base-scene";
import { TileType, type TileConfig } from "types/map.d";
import { Animations } from "utils/animation-utils";

export const level1Config: TileConfig[] = [
  {
    tile: {
      type: TileType.INTERACTIVE_STATIC_OBJECT,
      asset: AssetKeys.CHARACTERS.GUY.ASSET_KEY,
      frame: AssetKeys.CHARACTERS.GUY.FRAME
    },
    quantity: 1,
  },
  {
    tile: {
      type: TileType.INTERACTIVE_STATIC_OBJECT,
      asset: AssetKeys.CHARACTERS.GIRL.ASSET_KEY,
      frame: AssetKeys.CHARACTERS.GIRL.FRAME
    },
    quantity: 1,
  },
  {
    tile: {
      type: TileType.WALKABLE_SPACE,
      asset: AssetKeys.TILES.GRASS,
    },
    frequency: 50,
  },
  {
    tile: {
      type: TileType.WALKABLE_SPACE,
      asset: AssetKeys.TILES.FLOWER_GRASS,
    },
    frequency: 50,
  },
  {
    tile: {
      type: TileType.OBSTACLE,
      asset: AssetKeys.TILES.TREE,
    },
    frequency: 100,
  },
  {
    tile: {
      type: TileType.INTERACTIVE_OBJECT,
      asset: AssetKeys.ITEMS.FRUITS.ORANGE.ASSET_KEY,
    },
    frequency: 2,
  },
  {
    tile: {
      type: TileType.INTERACTIVE_OBJECT,
      asset: AssetKeys.ITEMS.FRUITS.STRAWBERRY.ASSET_KEY,
    },
    frequency: 5,
  },
];

export class Level1 extends BaseScene {
  constructor() {
    super(SceneKeys.LEVEL_1);
  }

  async preload(): Promise<void> {
    await super.preload({ tilesConfig: level1Config });
  }

  async create(): Promise<void> {
    await super.create();

    this.hideElements(AssetKeys.ITEMS.FRUITS.ORANGE.ASSET_KEY);
  }

  protected createAnimations(): void {
    Animations.useOrangeAnimation(this);
    Animations.useStrawberryAnimation(this);
  }

  protected setupCollisions(): void {
    super.setupCollisions();

    this.makeItemDraggable(AssetKeys.ITEMS.FRUITS.ORANGE.ASSET_KEY);
    this.makeItemDraggable(AssetKeys.ITEMS.FRUITS.STRAWBERRY.ASSET_KEY);
  }
}
