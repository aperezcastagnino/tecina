import { SceneKeys } from "scenes/scene-keys";
import { BaseScene } from "scenes/base-scene";
import { TileType, type TileConfig } from "types/map.d";
import { Animations } from "utils/animation-utils";
import { TileKeys, CharacterKeys, ItemKeys } from "assets/asset-keys";

export const level1Config: TileConfig[] = [
  {
    tile: {
      type: TileType.INTERACTIVE_STATIC_OBJECT,
      asset: CharacterKeys.GUY.ASSET_KEY,
      frame: CharacterKeys.GUY.FRAME,
    },
    quantity: 1,
  },
  {
    tile: {
      type: TileType.INTERACTIVE_STATIC_OBJECT,
      asset: CharacterKeys.GIRL.ASSET_KEY,
      frame: CharacterKeys.GIRL.FRAME,
    },
    quantity: 1,
  },
  {
    tile: {
      type: TileType.WALKABLE_SPACE,
      asset: TileKeys.GRASS,
    },
    frequency: 50,
  },
  {
    tile: {
      type: TileType.WALKABLE_SPACE,
      asset: TileKeys.FLOWER_GRASS,
    },
    frequency: 50,
  },
  {
    tile: {
      type: TileType.OBSTACLE,
      asset: TileKeys.TREE,
    },
    frequency: 100,
  },
  {
    tile: {
      type: TileType.INTERACTIVE_OBJECT,
      asset: ItemKeys.FRUITS.ORANGE.ASSET_KEY,
    },
    frequency: 2,
  },
  {
    tile: {
      type: TileType.INTERACTIVE_OBJECT,
      asset: ItemKeys.FRUITS.STRAWBERRY.ASSET_KEY,
    },
    frequency: 5,
  },
  {
    tile: {
      type: TileType.INTERACTIVE_OBJECT,
      asset: ItemKeys.FRUITS.BANANAS.ASSET_KEY,
    },
    frequency: 10,
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

    this.hideElements(ItemKeys.FRUITS.ORANGE.ASSET_KEY);
    this.hideElements(ItemKeys.FRUITS.BANANAS.ASSET_KEY);
  }

  protected createAnimations(): void {
    Animations.useOrangeAnimation(this);
    Animations.useStrawberryAnimation(this);
    Animations.useBananasAnimation(this);
  }

  protected setupCollisions(): void {
    super.setupCollisions();

    this.makeItemDraggable(ItemKeys.FRUITS.ORANGE.ASSET_KEY);
    this.makeItemDraggable(ItemKeys.FRUITS.STRAWBERRY.ASSET_KEY);
    this.makeItemDraggable(ItemKeys.FRUITS.BANANAS.ASSET_KEY);
  }
}
