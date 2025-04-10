import Phaser from "phaser";
import { BackgroundKeys, UIComponentKeys } from "assets/asset-keys";
import { SceneKeys } from "./scene-keys";

export default class LevelsMenu extends Phaser.Scene {
  constructor() {
    super(SceneKeys.LEVELS_MENU);
  }

  create() {
    const background = this.add.image(0, 0, BackgroundKeys.LEVELS).setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;

    const positions = [
      { x: 260, y: 420 },
      { x: 520, y: 620 },
      { x: 870, y: 500 },
      { x: 760, y: 260 },
      { x: 1400, y: 500 },
      { x: 1510, y: 210 },
      { x: 990, y: 860 },
    ];

    positions.forEach((pos, index) => {
      const button = this.add
        .image(pos.x, pos.y, UIComponentKeys.BUTTON_CIRCLE) // they all have the same image
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

  startLevel(levelNumber: number) {
    const level = `LEVEL_${levelNumber}` as keyof typeof SceneKeys;
    this.scene.start(SceneKeys[level]);
  }
}
