import { TilesAsset, TileType, type TileConfig } from "types/map";

export const MAP_WIDTH = 12;
export const MAP_HEIGHT = 12;
export const MIN_PARTITION_SIZE = 5; // MIN_PARTITION_SIZE < MIN(MAP_WIDTH, MAP_HEIGHT) / 2
export const MIN_ROOM_SIZE = 5; // MIN_ROOM_SIZE < MIN(MAP_WIDTH, MAP_HEIGHT) / 2

export const TILE_CONFIGURATION: TileConfig[] = [
  {
    type: TileType.FREE_SPACE, // I NEED 2 NPC'S
    asset: TilesAsset.FREE_SPACE,
    quantity: 2,
  },
  {
    type: TileType.EMPTY_SPACE, // 50% OF MY WALKABLE PATH IS GRASS
    asset: TilesAsset.GRASS,
    frequency: 50,
  },
  {
    type: TileType.EMPTY_SPACE, // 50% OF MY WALKABLE PATH IS GRASS
    asset: TilesAsset.FLOWER_GRASS,
    frequency: 50,
  },
  {
    type: TileType.OBSTACLE, // 100% OF THE INTERACTIVE OBJECTS ARE TREES
    asset: TilesAsset.TREE,
    frequency: 100,
  },
  {
    type: TileType.INTERACTIVE_OBJECT, // 100% OF THE INTERACTIVE OBJECTS ARE TREES
    asset: TilesAsset.GRASS,
    frequency: 50,
  },
  {
    type: TileType.INTERACTIVE_OBJECT, // 100% OF THE INTERACTIVE OBJECTS ARE ORANGES
    asset: TilesAsset.ORANGE,
    frequency: 10,
  },
];
