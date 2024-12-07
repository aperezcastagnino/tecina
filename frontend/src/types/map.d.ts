import type { Coordinate } from "./coordinate";

export type Map = {
  id: string;

  mapTiles: number[][];

  rows: number;

  columns: number;

  startPosition: Coordinate;

  finishPosition: Coordinate;

  assetGroups: Phaser.GameObjects.Group[];
};
