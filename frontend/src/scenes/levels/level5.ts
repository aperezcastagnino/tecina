import { SceneKeys } from "scenes/scene-keys";
import { ItemState, TileType } from "types/map.d";
import { TileKeys, CharacterAssets, ItemAssets } from "assets/assets";
import { Level } from "./level-maker";

export default new Level({
  name: SceneKeys.LEVEL_5,
  dimensions: {
    width: 40,
    height: 40,
  },
  tilesConfig: [
    {
      type: TileType.INTERACTIVE_STATIC_OBJECT,
      assetKey: CharacterAssets.GUY.ASSET_KEY,
      frame: CharacterAssets.GUY.FRAME,
      quantity: 1,
    },
    {
      type: TileType.INTERACTIVE_STATIC_OBJECT,
      assetKey: CharacterAssets.GIRL.ASSET_KEY,
      frame: CharacterAssets.GIRL.FRAME,
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
      assetKey: ItemAssets.BUNNY.assetKey,
      frequency: 5,
      initialState: ItemState.VISIBLE,
      isAnimated: true,
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
      quantity: 5,
      initialState: ItemState.VISIBLE,
      isAnimated: true,
    },
    {
      type: TileType.INTERACTIVE_OBJECT,
      assetKey: ItemAssets.CAT.assetKey,
      quantity: 5,
      initialState: ItemState.VISIBLE,
      isAnimated: true,
    },

    {
      type: TileType.INTERACTIVE_OBJECT,
      assetKey: ItemAssets.DEER.assetKey,
      quantity: 5,
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
      quantity: 5,
      initialState: ItemState.VISIBLE,
      isAnimated: true,
    },
  ],
});
