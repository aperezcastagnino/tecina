import { AssetKeys } from "../assets/asset-keys";

export const MAP_TILES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
export const FREQUENCY = [10, 20, 50, 1, 7, 5, 0, 0, 0, 0];

export const MAP_WIDTH = 300;
export const MAP_HEIGHT = 300;
export const COUNT_OF_NPC = 1;
export const NPC_ID = 2;

export const MAP_COLORS: { [key: number]: number } = {
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

export const MAP_TILES_ASSETS: { [key: number]: string } = {
  0: AssetKeys.TILES.GRASS,
  1: AssetKeys.TILES.TREE, // Only 1s are collidable
  2: AssetKeys.TILES.GRASS,
  3: AssetKeys.TILES.FLOWER_GRASS,
  4: AssetKeys.TILES.GRASS,
  5: AssetKeys.TILES.GRASS,
  6: AssetKeys.TILES.GRASS,
  7: AssetKeys.TILES.GRASS,
  8: AssetKeys.TILES.GRASS,
  9: AssetKeys.TILES.GRASS,
};
