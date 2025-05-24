import { SceneKeys } from "scenes/scene-keys";
import { ItemState, TileType } from "types/map.d";
import { TileKeys, CharacterAssets, ItemAssets } from "assets/assets";
import { Level } from "./level-maker";

export default new Level({
  name: SceneKeys.LEVEL_6,
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
      assetKey: TileKeys.DRY_GRASS,
      frequency: 40,
    },
    {
      type: TileType.WALKABLE_SPACE,
      assetKey: TileKeys.LEAVES_GRASS,
      frequency: 70,
    },
    {
      type: TileType.OBSTACLE,
      assetKey: TileKeys.YELLOW_TREE,
      frequency: 20,
    },
    {
      type: TileType.OBSTACLE,
      assetKey: TileKeys.DRY_TREE,
      frequency: 20,
    },
    {
      type: TileType.INTERACTIVE_OBJECT,
      assetKey: ItemAssets.CHICKEN.assetKey,
      quantity: 5,
      initialState: ItemState.HIDDEN,
      isAnimated: true,
    },
    {
      type: TileType.INTERACTIVE_OBJECT,
      assetKey: ItemAssets.FROG.assetKey,
      quantity: 10,
      initialState: ItemState.VISIBLE,
      isAnimated: true,
    },
    {
      type: TileType.INTERACTIVE_OBJECT,
      assetKey: ItemAssets.CAT.assetKey,
      quantity: 7,
      initialState: ItemState.VISIBLE,
      isAnimated: true,
    },

    {
      type: TileType.INTERACTIVE_OBJECT,
      assetKey: ItemAssets.DEER.assetKey,
      quantity: 1,
      initialState: ItemState.VISIBLE,
      isAnimated: true,
    },
    {
      type: TileType.INTERACTIVE_OBJECT,
      assetKey: ItemAssets.FOX.assetKey,
      quantity: 5,
      initialState: ItemState.VISIBLE,
      isAnimated: true,
    },
    {
      type: TileType.INTERACTIVE_OBJECT,
      assetKey: ItemAssets.PIGEON.assetKey,
      quantity: 7,
      initialState: ItemState.VISIBLE,
      isAnimated: true,
    },
  ],
  defaultFloorAsset: {
    type: TileType.WALKABLE_SPACE,
    assetKey: TileKeys.DRY_GRASS,
  },
});
