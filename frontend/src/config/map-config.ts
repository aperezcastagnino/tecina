import { AssetKeys } from "assets/asset-keys";

export type MapParameters = {
  rows: number;
  columns: number;
  tiles: Tiles[];
  frequency: number[];
  number_of_elements: number[];
  number_of_npcs: number;
};

export enum Tiles {
  FREE_SPACE = 0,
  GRASS = 1,
  TREE = 2,
  FLOWER_GRASS = 3,
  ORANGE = 4,
  NPC = 5,
}

export const TILES_TO_USE: Tiles[] = [
  Tiles.GRASS,
  Tiles.TREE,
  Tiles.FLOWER_GRASS,
  Tiles.ORANGE,
  Tiles.FREE_SPACE,
];
export const FREQUENCY = [50, 40, 20, 2, 30];

export const MAP_WIDTH = 20;
export const MAP_HEIGHT = 20;

export const MAP_TILES_ASSETS: { [key: number]: string } = {
  0: AssetKeys.TILES.GRASS,
  1: AssetKeys.TILES.TREE, // Only 1s are collidable
  2: AssetKeys.TILES.GRASS,
};
