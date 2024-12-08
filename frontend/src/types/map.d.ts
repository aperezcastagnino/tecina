import type { Coordinate } from "./coordinate";

export enum MapTiles {
  FREE_SPACE = 0,
  GRASS = 1,
  TREE = 2,
  FLOWER_GRASS = 3,
  ORANGE = 4,
  NPC = 5,
}

export enum MapTileType {
  PATH = "PATH",
  FREE_SPACE = "FREE_SPACE",
  INTERACTABLE_OBJECT = "INTERACTABLE_OBJECT",
  NON_INTERACTABLE_OBJECT = "NON_INTERACTABLE_OBJECT",
}

export type MapConfig = {
  rows: number;
  columns: number;
  tiles: GridTile[];
};

export type GridTile = {
  type: MapTileType;
  assetTile: MapTiles;
  frequency?: number;
  quantity?: number;
};

export type MapStructure = {
  id: string;
  tiles: number[][];
  rows: number;
  columns: number;
  startPosition: Coordinate;
  finishPosition: Coordinate;
  assetGroups: Map<string, Phaser.GameObjects.Group>;
  initialParameters?: MapConfig;
};
