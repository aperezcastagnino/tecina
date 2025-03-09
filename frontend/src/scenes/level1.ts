import { AssetKeys } from "assets/asset-keys";
import { SceneKeys } from "scenes/scene-keys";
import { BaseScene } from "scenes/base-scene";
import { TileType, type TileConfig } from "types/map.d";
import { Animations } from "utils/animation-utils";

export const MapLevel1Configuration: TileConfig[] = [
  {
    tile: {
      type: TileType.INTERACTIVE_IMMOVABLE_OBJECT, // I NEED 2 NPC'S
      asset: AssetKeys.CHARACTERS.NPC,
    },
    quantity: 2,
  },
  {
    tile: {
      type: TileType.WALKABLE_SPACE, // 50% OF MY WALKABLE PATH IS GRASS
      asset: AssetKeys.TILES.GRASS,
    },
    frequency: 50,
  },
  {
    tile: {
      type: TileType.WALKABLE_SPACE, // 50% OF MY WALKABLE PATH IS GRASS
      asset: AssetKeys.TILES.FLOWER_GRASS,
    },
    frequency: 50,
  },
  {
    tile: {
      type: TileType.OBSTACLE, // 100% OF THE INTERACTIVE OBJECTS ARE TREES
      asset: AssetKeys.TILES.TREE,
    },
    frequency: 100,
  },
  {
    tile: {
      type: TileType.INTERACTIVE_OBJECT, // 100% OF THE INTERACTIVE OBJECTS ARE ORANGES
      asset: AssetKeys.OBJECTS.FRUITS.ORANGE.ASSET_KEY,
    },
    frequency: 2,
  },
  {
    tile: {
      type: TileType.INTERACTIVE_OBJECT, // 100% OF THE INTERACTIVE OBJECTS ARE ORANGES
      asset: AssetKeys.OBJECTS.FRUITS.STRAWBERRY.ASSET_KEY,
    },
    frequency: 10,
  },
];

export class Level1 extends BaseScene {
  #collected_items = 0;

  constructor() {
    super(SceneKeys.LEVEL_1);
  }

  preload(): void {
    super.preload({
      name: SceneKeys.LEVEL_1,
      tilesConfig: MapLevel1Configuration,
    });
  }

  create(): void {
    super.create();

    this.hideElements(
      this.map.assetGroups.get(AssetKeys.OBJECTS.FRUITS.ORANGE.ASSET_KEY)!,
    );
  }

  defineBehaviors(): void {
    super.defineBehaviors();

    const fruitsGroup = this.map.assetGroups.get(
      AssetKeys.OBJECTS.FRUITS.ORANGE.ASSET_KEY,
    )!;
    this.physics.add.collider(this.player, fruitsGroup, (_player, item) => {
      const itemObject = item as Phaser.GameObjects.Sprite;
      this.#defineBehaviorForItems(itemObject);
    });

    console.log("total items: ", fruitsGroup.getChildren().length);
  }

  defineBehaviorForNPCs(npc: Phaser.GameObjects.Sprite): void {
    if (!this.dialog?.isDialogActive()) {
      this.dialog?.show(npc.name);

      const assetKey = this.dialog?.getAssetKey()!;
      if (!assetKey) return;

      const assetGroup = this.map.assetGroups.get(assetKey)!;
      this.showElements(assetGroup);
      this.awards.setAwardsCount(this.dialog?.getQuantityToCollect() || 0);
      this.#collected_items = this.dialog?.getQuantityToCollect() || 0;
    } else if (this.objectBag) {
      const assetKey = this.dialog?.getAssetKey()!;
      if (
        assetKey === this.objectBag.texture.key &&
        this.dialog?.getQuestGiverNpcId() === npc.name
      ) {
        this.#collected_items -= 1;
        this.awards.setAwardsCount(this.#collected_items);
        this.objectBag.destroy();
        this.objectBag = undefined;

        if (this.#collected_items === 0) {
          this.dialog?.setMessageComplete(npc.name);
          this.dialog?.show(npc.name);
        }
      } else {
        this.dialog?.show(npc.name);
      }
    }
  }

  #defineBehaviorForItems(item: Phaser.GameObjects.Sprite): void {
    if (item.visible && !this.objectBag) {
      this.objectBag = item;
      this.children.bringToTop(this.objectBag);
      if (item.body) {
        const body = item.body as Phaser.Physics.Arcade.Body;
        body.checkCollision.none = true;
      }
    }
  }

  createAnimations(): void {
    Animations.orangeAnimation(this);
    Animations.strawberryAnimation(this);
  }
}
