// Import AssetKeys

import { AssetKeys } from "../assets/asset-keys";

// Map generation
export const MAP_TILES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
export const FREQUENCY = [0, 30, 50, 1, 2, 0, 0, 0, 0, 0];

export const MAP_WIDTH = 100;
export const MAP_HEIGHT = 210;

export const MAP_TILES_ASSETS: { [key: number]: string } = {
  0: AssetKeys.TILES.GRASS.NAME,
  1: AssetKeys.TILES.TREE.NAME, // Only 1s are collidable
  2: AssetKeys.TILES.FLOWER.NAME,
  3: AssetKeys.TILES.FLOWER_GRASS.NAME,
  4: AssetKeys.TILES.GRASS.NAME,
  5: AssetKeys.TILES.GRASS.NAME,
  6: AssetKeys.TILES.GRASS.NAME,
  7: AssetKeys.TILES.GRASS.NAME,
  8: AssetKeys.TILES.GRASS.NAME,
  9: AssetKeys.TILES.GRASS.NAME,
};
