import { AssetKeys } from "assets/asset-keys";
import { SceneKeys } from "scenes/scene-keys";
import { BaseScene } from "scenes/base-scene";
import { TileType, type TileConfig } from "types/map.d";
import { Animations } from "utils/animation-utils";

export const level1Config: TileConfig[] = [
  {
    tile: {
      type: TileType.INTERACTIVE_STATIC_OBJECT,
      asset: AssetKeys.CHARACTERS.NPC,
    },
    quantity: 2,
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
      asset: AssetKeys.OBJECTS.FRUITS.ORANGE.ASSET_KEY,
    },
    frequency: 2,
  },
  {
    tile: {
      type: TileType.INTERACTIVE_OBJECT,
      asset: AssetKeys.OBJECTS.FRUITS.STRAWBERRY.ASSET_KEY,
    },
    frequency: 10,
  },
];

export class Level1 extends BaseScene {
  constructor() {
    super(SceneKeys.LEVEL_1);
  }

  preload(): void {
    super.preload({ tilesConfig: level1Config });
  }

  async create(): Promise<void> {
    await super.create();

    this.hideElements(
      this.map.assetGroups.get(AssetKeys.OBJECTS.FRUITS.ORANGE.ASSET_KEY)!,
    );
  }

  createAnimations(): void {
    Animations.orangeAnimation(this);
    Animations.strawberryAnimation(this);
  }

  defineInteractions(): void {
    super.defineInteractions();

    this.physics.add.collider(
      this.player,
      this.map.assetGroups.get(AssetKeys.OBJECTS.FRUITS.ORANGE.ASSET_KEY)!,
      (_player, element) => {
        this.defineInteractionWithItems(element as Phaser.GameObjects.Sprite);
      },
    );
  }
}
