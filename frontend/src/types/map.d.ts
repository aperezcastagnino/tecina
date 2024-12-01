import type { Coordinate } from "./coordinate";

export type Map = {
  id: string;

  mapTiles: number[][];

  frequency: number[];

  rows: number;

  columns: number;

  startPosition: Coordinate;

  finishPosition: Coordinate;
};
