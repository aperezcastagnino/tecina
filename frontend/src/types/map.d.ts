import type { Coordinate } from "./coordinate";

export type MapStructure = {
  id: string;

  tiles: number[][];

  rows: number;

  columns: number;

  startPosition: Coordinate;

  finishPosition: Coordinate;

  assetGroups: Map<string, Phaser.GameObjects.Group>;
};
