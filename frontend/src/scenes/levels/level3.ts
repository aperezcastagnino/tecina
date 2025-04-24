import { SceneKeys } from "scenes/scene-keys";
import { TileType } from "types/map.d";
import { TileKeys, CharacterKeys, ItemAssets } from "assets/assets";
import { Level } from "./level-maker";

export const Level3 = new Level({
  name: SceneKeys.LEVEL_3,
  tiles: [
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
      frequency: 1,
    },
    {
      tile: {
        type: TileType.INTERACTIVE_OBJECT,
        asset: ItemAssets.STRAWBERRY.assetKey,
      },
      frequency: 5,
    },
    {
      tile: {
        type: TileType.INTERACTIVE_OBJECT,
        asset: ItemAssets.APPLE.assetKey,
      },
      quantity: 2,
    },
    {
      tile: {
        type: TileType.INTERACTIVE_OBJECT,
        asset: ItemAssets.BANANAS.assetKey,
      },
      quantity: 3,
    },
    {
      tile: {
        type: TileType.INTERACTIVE_OBJECT,
        asset: ItemAssets.ORANGE.assetKey,
      },
      quantity: 1,
    },
  ],
  itemsToHide: [ItemAssets.APPLE, ItemAssets.BANANAS, ItemAssets.ORANGE],
  itemsToAnimate: [
    ItemAssets.APPLE,
    ItemAssets.BANANAS,
    ItemAssets.ORANGE,
    ItemAssets.STRAWBERRY,
  ],
  itemsToMakeDraggable: [
    ItemAssets.APPLE,
    ItemAssets.ORANGE,
    ItemAssets.BANANAS,
    ItemAssets.STRAWBERRY,
  ],
});
