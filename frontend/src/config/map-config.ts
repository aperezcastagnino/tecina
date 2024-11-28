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

// THIS IS ONLY USED FOT THE MAP LEVEL
export const mapColors: { [key: number]: number } = {
  0: 0x6e5c4f, // White for 0
  1: 0x05aec8, // Blue for 1
  2: 0x026440, // Darker green for 2
  3: 0x00ff00, // Green for 3
  4: 0x0000ff, // Blue for 4
  5: 0xffcc66, // Yellow for 5
  6: 0xff00ff, // Magenta for 6
  7: 0x037d50, // Green for 7
  8: 0x0000ff, // Cyan for 8
  9: 0xcc6666, // Red for 9
};
