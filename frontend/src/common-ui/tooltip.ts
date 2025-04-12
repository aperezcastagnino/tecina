// src/ui/Tooltip.ts
import Phaser from "phaser";

export class Tooltip {
  private scene: Phaser.Scene;

  private textObject: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, initialText: string) {
    this.scene = scene;

    this.textObject = this.scene.add
      .text(0, 0, initialText, {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 10, y: 5 },
        align: "center",
      })
      .setDepth(100)
      .setVisible(false)
      .setName("tooltipText");
  }

  show(text: string, x: number, y: number) {
    this.textObject
      .setText(text)
      .setPosition(x + 10, y - 10)
      .setVisible(true);
  }

  move(x: number, y: number) {
    this.textObject.setPosition(x + 10, y - 10);
  }

  hide() {
    this.textObject.setVisible(false);
  }
}
