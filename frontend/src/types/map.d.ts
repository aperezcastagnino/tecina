export enum ItemState {
  HIDDEN = "HIDDEN",
  VISIBLE = "VISIBLE",
}

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

export type TileConfig = {
  type: TileType;
  assetKey: string;
  frame?: number;
  frequency?: number;
  quantity?: number;
  initialState?: ItemState;
  isAnimated?: boolean;
};

export type MapConfiguration = {
  name: string;
  tilesConfig: TileConfig[];
  dimensions: {
    width: number;
    height: number;
  };
  minPartitionSize: number;
  minRoomSize: number;
};

export type MinimalMapConfiguration = Pick<
  MapConfiguration,
  "name" | "tilesConfig"
> &
  Partial<Omit<MapConfiguration, "name" | "tilesConfig">>;

export type MapStructure = {
  id: string;
  tiles: TileConfig[][];
  rows: number;
  columns: number;
  dimensions: {
    width: number;
    height: number;
  };
  startPosition: {
    x: number;
    y: number;
  };
  assetGroups: Map<string, Phaser.GameObjects.Group>;
  initialParameters?: MapConfiguration;
};
