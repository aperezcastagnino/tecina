import Phaser from "phaser";
import type { DialogData } from "types/level-data";
import { DialogColors } from "assets/colors";
import { FontSize, PRIMARY_FONT_FAMILY } from "assets/fonts";
import { UIComponent } from "./ui-component";

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

export abstract class BaseDialog extends UIComponent {
  protected scene: Phaser.Scene;

  protected data: DialogData[];

  protected height: number;

  protected width: number;

  protected padding: number;

  protected statementUI!: Phaser.GameObjects.Text;

  protected textAnimationPlaying: boolean;

  protected activeDialog: DialogData | undefined;

  protected questGiverNpcId: string | undefined;

  container!: Phaser.GameObjects.Container;

  constructor(config: DialogConfig) {
    super();
    this.scene = config.scene;
    this.data = config.data;
    this.height = config.height || 200;
    this.padding = config.padding || 60;
    this.width =
      config.width || this.scene.cameras.main.width - this.padding * 2;
    this.textAnimationPlaying = false;
  }

  createUI(): void {
    const panel = this.createPanel();
    this.statementUI = this.createUIText();
    this.createContainer([panel, this.statementUI]);
  }

  private createUIText(): Phaser.GameObjects.Text {
    return this.scene.add
      .text(18, 12, "", {
        fontFamily: PRIMARY_FONT_FAMILY,
        color: "black",
        fontSize: FontSize.EXTRA_LARGE,
        wordWrap: { width: this.width - 18 },
      })
      .setScrollFactor(0);
  }

  protected createContainer(children: Phaser.GameObjects.GameObject[]): void {
    const positionX = this.padding;
    const positionY =
      this.scene.cameras.main.height - this.height - this.padding / 4;

    this.container = this.scene.add.container(positionX, positionY, children);
  }

  private createPanel(): Phaser.GameObjects.Rectangle {
    return this.scene.add
      .rectangle(0, 0, this.width, this.height, DialogColors.main, 0.9)
      .setOrigin(0)
      .setStrokeStyle(8, DialogColors.border, 1)
      .setScrollFactor(0);
  }

  protected findMessageInCompleted(
    dialogs?: DialogData[],
  ): DialogData | undefined {
    return dialogs?.find((dialog) => !dialog.completed);
  }

  protected setIsVisible(value: boolean): void {
    this.container.visible = value;
  }

  isVisible(): boolean {
    return this.container.visible;
  }

  abstract show(npcId?: string): void;
  abstract hide(): void;
  abstract setMessageComplete(npcId?: string): void;
}
