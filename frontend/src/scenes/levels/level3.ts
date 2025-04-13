import { TileType } from "types/map.d";
import { TileKeys, CharacterKeys, ItemKeys } from "assets/asset-keys";
import { SceneKeys } from "scenes/scene-keys";
import { Level } from "./level-creator";

export const Level3 = new Level({
  name: SceneKeys.LEVEL_3,
  dimensions: {
    width: 100,
    height: 100,
  },
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
  ],
});
