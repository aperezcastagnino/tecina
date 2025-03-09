export enum TileType {
  WALKABLE_SPACE = "WALKABLE_SPACE",
  // THIS IS WHERE THE PLAYER WALKS
  INTERACTIVE_STATIC_OBJECT = "INTERACTIVE_STATIC_OBJECT",
  // THIS IS WHERE NPC'S ARE PLACED
  INTERACTIVE_OBJECT = "INTERACTIVE_OBJECT",
  // THESE ARE ORANGES, APPLES, ETC.
  // WALKABLE_SPACE GUARANTEES IT IS REACHABLE
  // INTERACTIVE_OBJECT IS REACHABLE BUT CAN BE OBSTRUCTED BY ANOTHER OBJECT OF THE SAME TYPE
  OBSTACLE = "OBSTACLE", // THESE ARE TREES OR OTHER OBJECTS THAT THE PLAYER COLLIDES WITH
}

export type Tile = {
  type: TileType;
  asset: string;
};

export type TileConfig = {
  tile: Tile;
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

export type MapStructure = {
  id: string;
  tiles: Tile[][];
  rows: number;
  columns: number;
  startPosition: Coordinate;
  assetGroups: Map<string, Phaser.GameObjects.Group>;
  initialParameters?: MapConfiguration;
};
