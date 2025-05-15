import { SceneKeys } from "scenes/scene-keys";
import { ItemState, TileType } from "types/map.d";
import { TileKeys, CharacterAssets, ItemAssets } from "assets/assets";
import { Level } from "./level-maker";

export default new Level({
  name: SceneKeys.LEVEL_4,
  dimensions: {
    width: 40,
    height: 40,
  },
  tilesConfig: [
    {
      type: TileType.INTERACTIVE_STATIC_OBJECT,
      assetKey: CharacterAssets.OLD_MAN.ASSET_KEY,
      frame: CharacterAssets.OLD_MAN.FRAME,
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
  ],
  defaultFloorAsset: {
    type: TileType.WALKABLE_SPACE,
    assetKey: TileKeys.DRY_GRASS,
  },
});
