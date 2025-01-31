import { AssetKeys } from "assets/asset-keys";
import { MapTiles, type GridTile } from "types/map";
import { MapTileType } from "./map-config";

export const TILES_TO_USE: GridTile[] = [
  { type: MapTileType.FREE_SPACE, assetTile: MapTiles.GRASS, frequency: 50 },
  {
    type: MapTileType.NO_INTERACTIVE_OBJECT,
    assetTile: MapTiles.TREE,
    frequency: 40,
  },
  {
    type: MapTileType.INTERACTIVE_OBJECT,
    assetTile: MapTiles.FLOWER_GRASS,
    frequency: 20,
  },
  {
    type: MapTileType.INTERACTIVE_OBJECT,
    assetTile: MapTiles.ORANGE,
    frequency: 2,
  },
  {
    type: MapTileType.INTERACTIVE_OBJECT,
    assetTile: MapTiles.NPC,
    quantity: 2,
  },
  {
    type: MapTileType.INTERACTIVE_OBJECT,
    assetTile: MapTiles.STRAWBERRY,
    frequency: 18,
  },
];

export const DEFAULT_MAP_DIMENSIONS = {
  MAP_WIDTH: 20,
  MAP_HEIGHT: 20,
};

export const MapTileToAssetKey: Record<MapTiles, string> = {
  [MapTiles.FREE_SPACE]: "",
  [MapTiles.GRASS]: AssetKeys.TILES.GRASS,
  [MapTiles.TREE]: AssetKeys.TILES.TREE,
  [MapTiles.FLOWER_GRASS]: AssetKeys.TILES.FLOWER_GRASS,
  [MapTiles.ORANGE]: AssetKeys.ITEMS.FRUITS.ORANGE.NAME,
  [MapTiles.NPC]: AssetKeys.CHARACTERS.NPC,
  [MapTiles.STRAWBERRY]: AssetKeys.ITEMS.FRUITS.STRAWBERRY.NAME,
};
