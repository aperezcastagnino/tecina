import Phaser from "phaser";
import { AssetKeys } from "assets/asset-keys";
import { SceneKeys } from "./scene-keys";

export default class LevelsMenu extends Phaser.Scene {
  constructor() {
    super(SceneKeys.LEVELS_MENU);
  }

  preload() {
    // Load any assets here if needed
  }

  create() {
    const background = this.add
      .image(0, 0, AssetKeys.BACKGROUNDS.LEVELS)
      .setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;

    const positions = [
      { x: 360, y: 430 },
      { x: 620, y: 650 },
      { x: 1050, y: 550 },
      { x: 860, y: 180 },
      { x: 1500, y: 550 },
      { x: 1550, y: 240 },
      { x: 1090, y: 900 },
    ];

    positions.forEach((pos, index) => {
      const button = this.add
        .image(pos.x, pos.y, AssetKeys.OBJECTS.BUTTONS.CIRCLE) // they all have the same image
        .setInteractive({ useHandCursor: true })
        .setScale(0.4)
        .on("pointerdown", () => this.startLevel(index + 1))
        .setName(`levelImageButton${index + 1}`);
      if (index >= 1) {
        // Apply grey tint to all buttons except the first one
        button.setTint(0x808080);
      }
      this.add.existing(button);
    });
  }

  enableLevelButton(levelNumber: number) {
    const button = this.children.getByName(
      `levelImageButton${levelNumber}`,
    ) as Phaser.GameObjects.Image;
    if (button) {
      button.clearTint(); // Adds color to the button
    }
  }

  startGame() {
    this.scene.start(SceneKeys.LEVEL_1);
  }

  startLevel(levelNumber: number) {
    const level = `LEVEL_${levelNumber}` as keyof typeof SceneKeys;
    this.scene.start(SceneKeys[level]);
  }
}
