import Phaser from "phaser";
import { MapLogicalGenerator } from "./map-logical-generation";

const mapLogicalGenerator = new MapLogicalGenerator(50, 50);
const generatedMap = mapLogicalGenerator.run();

const colors: { [key: number]: number } = {
  1: 0x05aec8, // blue for 1
  7: 0x037d50, // Green for 7
  0: 0x6e5c4f, // White for 0
  2: 0x026440, // Darker green for 2
  3: 0x00ff00, // Green for 3
  4: 0x0000ff, // Blue for 4
  5: 0xffcc66, // Yellow for 5
  6: 0xff00ff, // Magenta for 6
  8: 0x0000ff, // Cyan for 8
  9: 0xcc6666, // Red for 9
};

export function createBoard(
  scene: Phaser.Scene,
  map: number[][],
  blockSize: number,
) {
  const rows = map.length;
  const columns = map[0]?.length || 0;

  const startX = scene.scale.width - columns * blockSize;
  const startY = scene.scale.height - rows * blockSize;

  for (let n = 0; n < rows; n += 1) {
    for (let m = 0; m < columns; m += 1) {
      const hexa = map[n]?.[m] ?? 0;
      const color = colors[hexa] || 0xffffff;

      const x = startX + m * blockSize;
      const y = startY + n * blockSize;

      scene.add.rectangle(
        x + blockSize / 2,
        y + blockSize / 2,
        blockSize - 2,
        blockSize - 2,
        color,
      );
    }
  }
}

export class MapLevel extends Phaser.Scene {
  constructor() {
    super({ key: "MyGameScene" });
  }

  preload() {
    this.load.image("blue", "assets/tree.png"); // in progress
  }

  create() {
    createBoard(this, generatedMap, 30);
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1500,
  height: 1500,
  scene: MapLevel,
};

function initializeGame() {
  return new Phaser.Game(config);
}

initializeGame();
