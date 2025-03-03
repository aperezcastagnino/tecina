export enum MapTiles {
  FREE_SPACE = 0,
  GRASS = 1,
  TREE = 2,
  FLOWER_GRASS = 3,
  ORANGE = 4,
  NPC = 5,
}

export type GridTile = {
  type: MapTileType;
  assetTile: MapTiles;
  frequency?: number;
  quantity?: number;
};

export enum TileType {
  // THESE ARE PLACED ON WALKABLE PATHS FOR THE NPC
  EMPTY_SPACE = "EMPTY_SPACE", // THIS IS WHERE THE PLAYER WALKS
  FREE_SPACE = "FREE_SPACE", // THIS IS WHERE NPC'S ARE PLACED
  INTERACTIVE_OBJECT = "INTERACTIVE_OBJECT", // THESE ARE ORANGES, APPLES, ETC.
  // FREE_SPACE GUARANTEES IT IS REACHABLE
  // INTERACTIVE_OBJECT IS REACHABLE BUT CAN BE OBSTRUCTED BY ANOTHER OBJECT OF THE SAME TYPE

  // THESE ARE NON-WALKABLE PLACES FOR THE NPC
  OBSTACLE = "OBSTACLE", // THESE ARE TREES OR OTHER OBJECTS THAT THE PLAYER COLLIDES WITH
}

export enum TilesAsset {
  FREE_SPACE = 0,
  GRASS = 1,
  TREE = 2,
  FLOWER_GRASS = 3,
  ORANGE = 4,
  NPC = 5,
}

export type TileConfig = {
  type: TileType;
  asset: TilesAsset;
  frequency?: number;
  quantity?: number;
};

export type MapConfiguration = {
  name: string;
  tilesConfig: TileConfig[];
  mapWidth: number;
  mapHeight: number;
  minPartitionSize: number;
  minRoomSize: number;
};

export type MapMinimalConfiguration = Pick<MapConfiguration, 'name' | 'tilesConfig'> &
Partial<Omit<MapConfiguration, 'name' | 'tilesConfig'>>;

export type MapStructure = {
  id: string;
  tiles: Tiles[][];
  rows: number;
  columns: number;
  startPosition: Coordinate;
  assetGroups: Map<string, Phaser.GameObjects.Group>;
  initialParameters?: MapConfiguration;
};
