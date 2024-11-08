import Phaser from "phaser";
import { SceneKeys } from "./scene-keys";
import { mapWidth, mapHeight } from "../config/map-config";
import { mapColors } from "../assets/colors";
import { MapLogicalGenerator } from "../common/map/map-logical-generation";
import { TILE_SIZE } from "../config/config";

const mapLogicalGenerator = new MapLogicalGenerator(mapWidth, mapHeight);
const map = mapLogicalGenerator.generate();

export class MapLevel extends Phaser.Scene {
  constructor() {
    super(SceneKeys.MAP_LEVEL);
  }

  create() {
    const rows = map.mapHeight;
    const columns = map.mapTiles[0]?.length || 0;

    // Calculates the start position of the board
    const startX = (this.scale.width - columns * TILE_SIZE) / 2;
    const startY = (this.scale.height - rows * TILE_SIZE) / 2;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const hexa = map.mapTiles[row]![column] ?? 0; // Get the value of the logical map
        const color = mapColors[hexa] || 0xffffff; // Get the color

        // Calculate the position of the cell
        const x = (startX + column * TILE_SIZE) + TILE_SIZE/2;
        const y = (startY + row * TILE_SIZE) +TILE_SIZE /2;

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
