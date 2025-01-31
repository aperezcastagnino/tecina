import type { Tiles } from "config/map-config";
import type { Coordinate } from "./coordinate";

export enum MapTiles {
  FREE_SPACE = 0,
  GRASS = 1,
  TREE = 2,
  FLOWER_GRASS = 3,
  ORANGE = 4,
  NPC = 5,
  STRAWBERRY = 6,
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
  tiles: Tiles[][];
  rows: number;
  columns: number;
  startPosition: Coordinate;
  assetGroups: Map<string, Phaser.GameObjects.Group>;
  initialParameters?: MapConfig;
};
