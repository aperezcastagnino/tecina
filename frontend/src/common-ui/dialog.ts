import Phaser from "phaser";
import type { DialogData } from "types/level-data";
import { animateText } from "utils/animation-utils";
import { PRIMARY_FONT_FAMILY, FontSize } from "assets/fonts";
import { DialogColors } from "assets/colors";

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

export class Dialog {
  #scene: Phaser.Scene;

  #data: DialogData[];

  #height: number;

  #width: number;

  #padding: number;

  container!: Phaser.GameObjects.Container;

  #uiText!: Phaser.GameObjects.Text;

  #messagesToShow: string[];

  #textAnimationPlaying: boolean;

  #activeDialog: DialogData | undefined;

  constructor(config: DialogConfig) {
    this.#scene = config.scene;
    this.#data = config.data;
    this.#height = config.height || 200;
    this.#padding = config.padding || 60;
    this.#width =
      config.width || this.#scene.cameras.main.width - this.#padding * 2;
    this.#messagesToShow = [];
    this.#textAnimationPlaying = false;

    this.#createUI();
    this.hide();
  }

  #createUI(): void {
    const panel = this.#createPanel();
    this.#uiText = this.#createUIText();
    this.container = this.#createContainer();
    this.container.add([panel, this.#uiText]);
  }

  #createPanel(): Phaser.GameObjects.Rectangle {
    return this.#scene.add
      .rectangle(0, 0, this.#width, this.#height, 0xffffff, 0.9)
      .setOrigin(0)
      .setStrokeStyle(8, DialogColors.border, 1)
      .setScrollFactor(0);
  }

  #createUIText(): Phaser.GameObjects.Text {
    return this.#scene.add
      .text(18, 12, "", {
        fontFamily: PRIMARY_FONT_FAMILY,
        color: "black",
        fontSize: FontSize.EXTRA_LARGE,
        wordWrap: { width: this.#width - 18 },
      })
      .setScrollFactor(0);
  }

  #createContainer(): Phaser.GameObjects.Container {
    const positionX = this.#padding;
    const positionY =
    this.#scene.cameras.main.height - this.#height - this.#padding / 4;

    return this.#scene.add.container(positionX, positionY);
  }

  #setIsVisible(value: boolean): void {
    this.container.visible = value;
  }

  isVisible(): boolean {
    return this.container.visible;
  }

  show(npcId?: string): void {
    this.#getDialogData(npcId);
  }

  hide(): void {
    this.#setIsVisible(false);
  }

  showNextMessage(): void {
    if (this.#textAnimationPlaying) return;

    if (this.isVisible() && this.#messagesToShow.length === 0) {
      this.hide();
      return;
    }

    if (this.#messagesToShow.length === 0) return;

    this.#uiText.setText("").setAlpha(1);
    this.#textAnimationPlaying = true;
    animateText(
      this.#scene,
      this.#uiText,
      this.#messagesToShow.shift() || "",
      10,
      () => {
        this.#textAnimationPlaying = false;
      },
    );
  }

  setMessageComplete(npcId?: string): void {
    if (!this.#activeDialog) return;

    if (this.#activeDialog.showed_by === npcId) {
      this.#activeDialog!.completed = true;
      this.#activeDialog = undefined;
      this.hide();
    }
  }

  #getDialogData(npcId?: string): void {
    const dialog = this.#activeDialog || this.#findMessageInCompleted(this.#data);

    if (!dialog) {
      console.error("No dialogs not shown were found.");
      this.hide();
      return;
    }

    if (!this.#activeDialog) {
      this.#activeDialog = dialog;
    }

    const textsToShow = this.#resolveDialogsToShow(dialog, npcId);
    this.#messagesToShow = [...textsToShow];

    this.#setIsVisible(true);
    this.showNextMessage();
  }

  #resolveDialogsToShow(dialog: DialogData, npcId?: string): string[] {
    if (dialog.showed_by === npcId) return dialog.questInProgress;
    if (dialog.showed_by) return dialog.hints;

    // eslint-disable-next-line no-param-reassign
    dialog.showed_by = npcId || "";
    return dialog.questStart;
  }


  #findMessageInCompleted(dialogs?: DialogData[]): DialogData | undefined {
    return dialogs?.find(
      (dialog) =>
        !dialog.completed && (!dialog.options || dialog.options.length === 0),
    );
  }
}
