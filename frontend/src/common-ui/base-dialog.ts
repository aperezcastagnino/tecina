import Phaser from "phaser";
import type { DialogData } from "types/dialog-data";
import { BoxColors } from "assets/colors";
import { FontSize, PRIMARY_FONT_FAMILY } from "assets/fonts";
import { DEPTH_1 } from "config";

export type DialogConfig = {
  scene: Phaser.Scene;
  data: DialogData[];
  height?: number;
  width?: number;
  padding?: number;
  fontColor?: number;
  borderColor?: number;
  backgroundColor?: number;
};

export abstract class BaseDialog {
  private container!: Phaser.GameObjects.Container;

  protected scene: Phaser.Scene;

  protected data: DialogData[];

  protected height: number;

  protected width: number;

  protected padding: number;

  protected statementUI!: Phaser.GameObjects.Text;

  protected textAnimationPlaying: boolean = false;

  protected activeDialog?: DialogData;

  protected questGiverNpcId?: string;

  get isVisible(): boolean {
    return this.container.visible;
  }

  set isVisible(value: boolean) {
    this.container.visible = value;
  }

  abstract show(npcId?: string): void;
  abstract hide(): void;
  abstract setMessageComplete(npcId?: string): void;

  constructor(config: DialogConfig) {
    this.scene = config.scene;
    this.data = config.data;
    this.height = config.height || 200;
    this.padding = config.padding || 60;
    this.width =
      config.width || this.scene.cameras.main.width - this.padding * 2;
  }

  areAllDialogsCompleted(): boolean {
    return this.data.every((dialog) => dialog.completed);
  }

  protected initializeUI(): void {
    this.statementUI = this.createUIText();
    this.createContainer([this.createPanel(), this.statementUI]);
  }

  protected selectRandomText(array: string[][]): string[] {
    if (array.length === 0) return [];
    return array[Math.floor(Math.random() * array.length)]!;
  }

  private createUIText(): Phaser.GameObjects.Text {
    return this.scene.add
      .text(32, 32, "", {
        fontFamily: PRIMARY_FONT_FAMILY,
        color: "#f8de6f",
        fontSize: FontSize.EXTRA_LARGE,
        wordWrap: { width: this.width - 18 },
      })
      .setScrollFactor(0);
  }

  private createContainer(children: Phaser.GameObjects.GameObject[]): void {
    const positionX = this.padding;
    const positionY =
      this.scene.cameras.main.height - this.height - this.padding / 4;

    this.container = this.scene.add
      .container(positionX, positionY, children)
      .setDepth(DEPTH_1);
  }

  private createPanel(): Phaser.GameObjects.Rectangle {
    return this.scene.add
      .rectangle(0, 0, this.width, this.height, BoxColors.main, 0.9)
      .setOrigin(0)
      .setStrokeStyle(8, BoxColors.border, 1)
      .setScrollFactor(0);
  }
}
