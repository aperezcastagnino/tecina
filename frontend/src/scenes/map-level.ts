import Phaser from "phaser";
import type { Map } from "types/map";
import { MapGenerator } from "common/map/map-generator";
import { MAP_COLORS, MAP_HEIGHT, MAP_WIDTH } from "config/map-config";
import { TILE_SIZE } from "config/config";

export class MapLevel extends Phaser.Scene {
  #map: Map;

  constructor() {
    super('MAP_LEVEL');

    this.#map = MapGenerator.newMap('MAP_LEVEL', MAP_WIDTH, MAP_HEIGHT);
  }

  create() {
    const { rows, columns } = this.#map;

    // Calculates the start position of the board
    const startX = (this.scale.width - columns * TILE_SIZE) / 2;
    const startY = (this.scale.height - rows * TILE_SIZE) / 2;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const hexa = this.#map.mapTiles[row]![column] ?? 0; // Get the value of the logical map
        const color = MAP_COLORS[hexa] || 0xffffff; // Get the color

        // Calculate the position of the cell
        const x = startX + column * TILE_SIZE + TILE_SIZE / 2;
        const y = startY + row * TILE_SIZE + TILE_SIZE / 2;

        // Add a rectangle with the specified color
        this.add.rectangle(
          x, // where to start
          y, // where to start
          TILE_SIZE - 2, // rectangle width
          TILE_SIZE - 2, // rectangle height
          color,
        );
      }
    }
  }
}
