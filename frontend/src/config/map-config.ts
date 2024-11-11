// Import AssetKeys
import { AssetKeys } from '../assets/asset-keys';

// Map generation
export const MAP_TILES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
export const FREQUENCY = [0, 5, 20, 0, 0, 0, 0, 0, 0, 0];

export const MAP_WIDTH = 11;
export const MAP_HEIGHT = 21;

export const MAP_TILES_ASSETS: { [key: number]: string } = {
  0: AssetKeys.TILES.GRASS.NAME,
  1: AssetKeys.TILES.FLOWER.NAME,
  2: AssetKeys.TILES.GRASS.NAME,
  3: AssetKeys.TILES.GRASS.NAME,
  4: AssetKeys.TILES.GRASS.NAME,
  5: AssetKeys.TILES.GRASS.NAME,
  6: AssetKeys.TILES.GRASS.NAME,
  7: AssetKeys.TILES.GRASS.NAME,
  8: AssetKeys.TILES.GRASS.NAME,
  9: AssetKeys.TILES.GRASS.NAME,
};
