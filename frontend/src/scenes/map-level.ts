import Phaser from "phaser";
import { SceneKeys } from "./scene-keys";
import { mapWidth, mapHeight, blockSize } from "../assets/constants";
import { mapColors } from "../assets/colors";
import { MapLogicalGenerator } from "../map/map-logical-generation";

const mapLogicalGenerator = new MapLogicalGenerator(mapWidth, mapHeight);
const map = mapLogicalGenerator.run();

export class MapLevel extends Phaser.Scene {
  constructor() {
    super(SceneKeys.MAP_LEVEL);
  }

  preload() {
    this.load.image("blue", "assets/tree.png"); // in progress
  }

  create() {
    const rows = map.length;
    const columns = map[0]?.length || 0;

    // Calculates the start position of the board
    const startX = (this.scale.width - columns * blockSize) / 2;
    const startY = (this.scale.height - rows * blockSize) / 2;

    for (let n = 0; n < rows; n += 1) {
      for (let m = 0; m < columns; m += 1) {
        const hexa = map[n]?.[m] ?? 0; // Get the value of the logical map
        const color = mapColors[hexa] || 0xffffff; // Get the color

        // Calculate the position of the cell
        const x = startX + m * blockSize;
        const y = startY + n * blockSize;

        // Add a rectangle with the specified color
        this.add.rectangle(
          x + blockSize / 2, // where to start
          y + blockSize / 2, // where to start
          blockSize - 2, // rectangle width
          blockSize - 2, // rectangle height
          color,
        );
      }
    }
  }
}
