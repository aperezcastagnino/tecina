import { AssetKeys } from "assets/asset-keys";

export type MapParameters = {
  rows: number;
  columns: number;
  tiles: Tiles[];
  frequency: number[];
  number_of_elements: number[];
  number_of_npcs: number;
};

export enum MapTileType {
  // THESE ARE PLACED ON WALKABLE PATHS FOR THE NPC
  EMPTY_SPACE = "EMPTY_SPACE", // THIS IS WHERE THE PLAYER WALKS
  FREE_SPACE = "FREE_SPACE", // THIS IS WHERE NPC'S ARE PLACED
  INTERACTIVE_OBJECT = "INTERACTIVE_OBJECT", // THESE ARE ORANGES, APPLES, ETC.
  // FREE_SPACE GUARANTEES IT IS REACHABLE
  // INTERACTIVE_OBJECT IS REACHABLE BUT CAN BE OBSTRUCTED BY ANOTHER OBJECT OF THE SAME TYPE

  // THESE ARE NON-WALKABLE PLACES FOR THE NPC
  NO_INTERACTIVE_OBJECT = "NO_INTERACTIVE_OBJECT", // THESE ARE TREES OR OTHER OBJECTS THAT THE PLAYER COLLIDES WITH
}

export enum Tiles {
  FREE_SPACE = 0,
  GRASS = 1,
  TREE = 2,
  FLOWER_GRASS = 3,
  ORANGE = 4,
  NPC = 5,
}

export type TilesToUseConfig = {
  Type: MapTileType;
  Asset: Tiles;
  Frequency?: number;
  Quantity?: number;
};

export const TILES_TO_USE: TilesToUseConfig[] = [
  {
    Type: MapTileType.FREE_SPACE, // I NEED 2 NPC'S
    Asset: Tiles.FREE_SPACE,
    Quantity: 2,
  },
  {
    Type: MapTileType.EMPTY_SPACE, // 50% OF MY WALKABLE PATH IS GRASS
    Asset: Tiles.GRASS,
    Frequency: 50,
  },
  {
    Type: MapTileType.EMPTY_SPACE, // 50% OF MY WALKABLE PATH IS GRASS
    Asset: Tiles.FLOWER_GRASS,
    Frequency: 50,
  },
  {
    Type: MapTileType.NO_INTERACTIVE_OBJECT, // 100% OF THE INTERACTIVE OBJECTS ARE TREES
    Asset: Tiles.TREE,
    Frequency: 100,
  },
  {
    Type: MapTileType.INTERACTIVE_OBJECT, // 100% OF THE INTERACTIVE OBJECTS ARE TREES
    Asset: Tiles.GRASS,
    Frequency: 50,
  },
  {
    Type: MapTileType.INTERACTIVE_OBJECT, // 100% OF THE INTERACTIVE OBJECTS ARE ORANGES
    Asset: Tiles.ORANGE,
    Frequency: 10,
  },
];

export const MAP_WIDTH = 120;
export const MAP_HEIGHT = 120;
export const MIN_PARTITION_SIZE = 5; // MIN_PARTITION_SIZE < MIN(MAP_WIDTH, MAP_HEIGHT) / 2
export const MIN_ROOM_SIZE = 5; // MIN_ROOM_SIZE < MIN(MAP_WIDTH, MAP_HEIGHT) / 2

export const MAP_TILES_ASSETS: { [key: number]: string } = {
  0: AssetKeys.TILES.GRASS,
  1: AssetKeys.TILES.TREE, // Only 1s are collidable
  2: AssetKeys.TILES.GRASS,
};
