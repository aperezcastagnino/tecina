import { SceneKeys } from "scenes/scene-keys";
import { ItemState, TileType } from "types/map.d";
import { TileKeys, CharacterAssets, ItemAssets } from "assets/assets";
import { Level } from "./level-maker";

export default new Level({
  name: SceneKeys.LEVEL_7,
  dimensions: {
    width: 30,
    height: 30,
  },
  tilesConfig: [
    {
      type: TileType.INTERACTIVE_STATIC_OBJECT,
      assetKey: CharacterAssets.VIKING.ASSET_KEY,
      frame: CharacterAssets.VIKING.FRAME,
      quantity: 1,
    },
    {
      type: TileType.INTERACTIVE_STATIC_OBJECT,
      assetKey: CharacterAssets.PINK_GIRL.ASSET_KEY,
      frame: CharacterAssets.PINK_GIRL.FRAME,
      quantity: 1,
    },
    {
      type: TileType.WALKABLE_SPACE,
      assetKey: TileKeys.GRASS,
      frequency: 40,
    },
    {
      type: TileType.WALKABLE_SPACE,
      assetKey: TileKeys.FLOWER_GRASS,
      frequency: 70,
    },
    {
      type: TileType.OBSTACLE,
      assetKey: TileKeys.TREE,
      frequency: 20,
    },
    {
      type: TileType.INTERACTIVE_OBJECT,
      assetKey: ItemAssets.LAMP.assetKey,
      quantity: 5,
      initialState: ItemState.HIDDEN,
      isAnimated: true,
    },
    {
      type: TileType.INTERACTIVE_OBJECT,
      assetKey: ItemAssets.MUG.assetKey,
      quantity: 10,
      initialState: ItemState.VISIBLE,
      isAnimated: true,
    },
  ],
  defaultFloorAsset: {
    type: TileType.WALKABLE_SPACE,
    assetKey: TileKeys.GRASS,
  },
});
