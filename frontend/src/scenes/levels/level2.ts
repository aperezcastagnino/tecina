import { SceneKeys } from "scenes/scene-keys";
import { TileType } from "types/map.d";
import { TileKeys, CharacterKeys, ItemAssets } from "assets/assets";
import { Level } from "./level-maker";

export const Level2 = new Level({
  name: SceneKeys.LEVEL_2,
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
      frequency: 10,
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
      quantity: 1,
    },
    {
      tile: {
        type: TileType.INTERACTIVE_OBJECT,
        asset: ItemAssets.ORANGE.assetKey,
      },
      quantity: 2,
    },
  ],
  itemsToHide: [ItemAssets.APPLE, ItemAssets.ORANGE],
  itemsToAnimate: [ItemAssets.APPLE, ItemAssets.ORANGE, ItemAssets.STRAWBERRY],
  itemsToMakeDraggable: [
    ItemAssets.APPLE,
    ItemAssets.ORANGE,
    ItemAssets.STRAWBERRY,
  ],
});
