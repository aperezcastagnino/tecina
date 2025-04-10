import Phaser from "phaser";
import { BackgroundKeys, UIComponentKeys } from "assets/asset-keys";
import { SceneKeys } from "./scene-keys";

export default class LevelsMenu extends Phaser.Scene {
  private tooltip!: Phaser.GameObjects.Text;

  constructor() {
    super(SceneKeys.LEVELS_MENU);
  }

  create() {
    const background = this.add.image(0, 0, BackgroundKeys.LEVELS).setOrigin(0);
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;

    // Tooltip oculto inicialmente
    this.tooltip = this.add
      .text(0, 0, "Completa el nivel anterior para desbloquear", {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#000000aa",
        padding: { x: 10, y: 5 },
        align: "center",
      })
      .setDepth(100)
      .setVisible(false)
      .setName("tooltipText");

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
      const isEnabled = index === 0;

      const shadow = this.add
        .image(pos.x + 6, pos.y + 6, UIComponentKeys.BUTTON_SHADOW)
        .setScale(0.2)
        .setAlpha(0.5);

      const button = this.add
        .image(pos.x, pos.y, UIComponentKeys.BUTTON_CIRCLE)
        .setScale(0.34)
        .setName(`levelImageButton${index + 1}`)
        .setInteractive();

      if (!isEnabled) {
        button.setTint(0x808080);

        // Cursor prohibido + tooltip
        button.on("pointerover", (pointer: Phaser.Input.Pointer) => {
          this.input.setDefaultCursor("not-allowed");

          this.tooltip
            .setPosition(pointer.worldX + 10, pointer.worldY - 10)
            .setVisible(true);
        });

        button.on("pointermove", (pointer: Phaser.Input.Pointer) => {
          this.tooltip.setPosition(pointer.worldX + 10, pointer.worldY - 10);
        });

        button.on("pointerout", () => {
          this.input.setDefaultCursor("default");
          this.tooltip.setVisible(false);
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
