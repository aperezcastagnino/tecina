// src/scenes/LevelsMenu.ts
import Phaser from "phaser";
import { BackgroundKeys, UIComponentKeys } from "assets/asset-keys";
import { SceneKeys } from "./scene-keys";
import { Tooltip } from "../common-ui/tooltip";

export default class LevelsMenu extends Phaser.Scene {
  private tooltip!: Tooltip;

  constructor() {
    super(SceneKeys.LEVELS_MENU);
  }

  create() {
    const background = this.add.image(0, 0, BackgroundKeys.LEVELS).setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;

    this.tooltip = new Tooltip(
      this,
      "Completa el nivel anterior para desbloquear",
    );

    const positions = [
      { x: 260, y: 420 },
      { x: 450, y: 620 },
      { x: 820, y: 500 },
      { x: 690, y: 260 },
      { x: 1370, y: 500 },
      { x: 1510, y: 210 },
      { x: 940, y: 860 },
    ];

    positions.forEach((pos, index) => {
      const shadow = this.add
        .image(pos.x + 6, pos.y + 6, UIComponentKeys.BUTTON_SHADOW)
        .setScale(0.2)
        .setAlpha(0.5);

      const button = this.add
        .image(pos.x, pos.y, UIComponentKeys.BUTTON_CIRCLE)
        .setScale(0.34)
        .setName(`levelImageButton${index + 1}`)
        .setInteractive();

      if (index !== 0) {
        button.setTint(0x808080);

        button.on("pointerover", (pointer: Phaser.Input.Pointer) => {
          this.input.setDefaultCursor("not-allowed");
          this.tooltip.show(
            "Completa el nivel anterior para desbloquear",
            pointer.worldX,
            pointer.worldY,
          );
        });

        button.on("pointermove", (pointer: Phaser.Input.Pointer) => {
          this.tooltip.move(pointer.worldX, pointer.worldY);
        });

        button.on("pointerout", () => {
          this.input.setDefaultCursor("default");
          this.tooltip.hide();
        });
      } else {
        button.on("pointerover", () => {
          this.input.setDefaultCursor("pointer");
          this.tweens.add({
            targets: button,
            scale: 0.4,
            duration: 150,
            ease: "Power2",
          });
        });

        button.on("pointerout", () => {
          this.input.setDefaultCursor("default");
          this.tweens.add({
            targets: button,
            scale: 0.34,
            duration: 150,
            ease: "Power2",
          });
        });

        button.on("pointerdown", () => {
          this.startLevel(index + 1);
        });
      }

      this.add.existing(shadow);
      this.add.existing(button);
    });
  }

  enableLevelButton(levelNumber: number) {
    const button = this.children.getByName(
      `levelImageButton${levelNumber}`,
    ) as Phaser.GameObjects.Image;

    if (button) {
      button.clearTint();
      button.setInteractive({ useHandCursor: true });

      button.on("pointerover", () => {
        this.input.setDefaultCursor("pointer");
        this.tweens.add({
          targets: button,
          scale: 0.45,
          duration: 150,
          ease: "Power2",
        });
      });

      button.on("pointerout", () => {
        this.input.setDefaultCursor("default");
        this.tweens.add({
          targets: button,
          scale: 0.4,
          duration: 150,
          ease: "Power2",
        });
      });

      button.on("pointerdown", () => {
        this.startLevel(levelNumber);
      });
    }
  }

  startLevel(levelNumber: number) {
    const level = `LEVEL_${levelNumber}` as keyof typeof SceneKeys;
    this.scene.start(SceneKeys[level]);
  }
}
