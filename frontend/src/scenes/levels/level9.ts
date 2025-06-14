import { SceneKeys } from "scenes/scene-keys";
import { ItemState, TileType } from "types/map.d";
import { TileKeys, CharacterAssets, ItemAssets } from "assets/assets";
import { Level } from "./level-maker";

export default new Level({
  name: SceneKeys.LEVEL_9,
  dimensions: {
    width: 30,
    height: 30,
  },
  tilesConfig: [
    {
      type: TileType.INTERACTIVE_STATIC_OBJECT,
      assetKey: CharacterAssets.DETECTIVE.ASSET_KEY,
      frame: CharacterAssets.DETECTIVE.FRAME,
      quantity: 1,
    },
    {
      type: TileType.INTERACTIVE_STATIC_OBJECT,
      assetKey: CharacterAssets.BLONDE_GIRL.ASSET_KEY,
      frame: CharacterAssets.BLONDE_GIRL.FRAME,
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
      assetKey: ItemAssets.BOOK.assetKey,
      quantity: 3,
      initialState: ItemState.HIDDEN,
      isAnimated: true,
    },
    {
      type: TileType.INTERACTIVE_OBJECT,
      assetKey: ItemAssets.CANDLE.assetKey,
      quantity: 5,
      initialState: ItemState.VISIBLE,
      isAnimated: true,
    },
    {
      type: TileType.INTERACTIVE_OBJECT,
      assetKey: ItemAssets.FLOWER.assetKey,
      quantity: 7,
      initialState: ItemState.VISIBLE,
      isAnimated: true,
    },

    {
      type: TileType.INTERACTIVE_OBJECT,
      assetKey: ItemAssets.LAMP.assetKey,
      quantity: 1,
      initialState: ItemState.VISIBLE,
      isAnimated: true,
    },
  ],
  defaultFloorAsset: {
    type: TileType.WALKABLE_SPACE,
    assetKey: TileKeys.GRASS,
  },
});
