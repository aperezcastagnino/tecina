import type { Scene } from "phaser";
import type { Map } from "types/map";
import { GAME_DIMENSIONS, TILE_SIZE } from "config/config";
import { MAP_HEIGHT, MAP_TILES_ASSETS, MAP_WIDTH } from "config/map-config";

export class MapRenderer {
  static renderer(scene: Scene, map: Map) {
    const staticGroup = scene.physics.add.staticGroup();

    const { rows, columns } = map;

    // Calculate start position for centering the map on screen
    const startX = (GAME_DIMENSIONS.WIDTH - MAP_WIDTH * 164) / 2; // This is forced to be centered
    const startY = (GAME_DIMENSIONS.HEIGHT - MAP_HEIGHT * 42) / 2;

    for (let n = 0; n < rows; n += 1) {
      for (let m = 0; m < columns; m += 1) {
        const hexa = map.mapTiles[n]?.[m] ?? 0; // Get the tile value

        // Calculate the tile position
        const x = startX + m * TILE_SIZE;
        const y = startY + n * TILE_SIZE;

        // Add a image for each tile
        const tile = scene.add
          .image(x, y, MAP_TILES_ASSETS[hexa]!)
          .setDisplaySize(TILE_SIZE, TILE_SIZE);

        // Enable physics on each tile
        scene.physics.add.existing(tile, true); // true makes it static

        if (hexa === 1) {
          // Make tiles with `1` in the matrix collidable
          staticGroup.add(tile); // Add to collision group
        }
      }
    }
  }
}
