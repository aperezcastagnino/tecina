import Phaser from "phaser";
import { SceneKeys } from "./scene-keys";
import { mapWidth, mapHeight } from "../assets/constants";
import { mapColors } from "../assets/colors";
import { MapLogicalGenerator } from "../map/map-logical-generation";
import { TILE_SIZE } from "../config/config";


const mapLogicalGenerator = new MapLogicalGenerator(mapWidth, mapHeight);
const map = mapLogicalGenerator.run();

export class MapLevel extends Phaser.Scene {
  constructor() {
    super(SceneKeys.MAP_LEVEL);
  }

  create() {
    const rows = map.length;
    const columns = map[0]?.length || 0;

    // Calculates the start position of the board
    const startX = (this.scale.width - columns * TILE_SIZE) / 2;
    const startY = (this.scale.height - rows * TILE_SIZE) / 2;

    for (let n = 0; n < rows; n += 1) {
      for (let m = 0; m < columns; m += 1) {
        const hexa = map[n]?.[m] ?? 0; // Get the value of the logical map
        const color = mapColors[hexa] || 0xffffff; // Get the color

        // Calculate the position of the cell
        const x = startX + m * TILE_SIZE;
        const y = startY + n * TILE_SIZE;

        // Add a rectangle with the specified color
        this.add.rectangle(
          x + TILE_SIZE / 2, // where to start
          y + TILE_SIZE / 2, // where to start
          TILE_SIZE - 2, // rectangle width
          TILE_SIZE - 2, // rectangle height
          color,
        );
      }
    }
  }
}
