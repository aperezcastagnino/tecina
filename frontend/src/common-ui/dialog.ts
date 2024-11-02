import Phaser from "phaser";
import { PRIMARY_FONT_FAMILY, FontSize } from "../assets/fonts";
import { animateText } from "../utils/text-utils";
import { DialogColors } from "../assets/colors";
import { AssetKeys } from "../assets/asset-keys";
import type { UIDialogInterface } from "./interfaces/ui-dialog-interface";

export type DialogConfig = {
  scene: Phaser.Scene;
  height?: number;
  width?: number;
  padding?: number;
  fontColor?: number;
  borderColor?: number;
  backgroundColor?: number;
};

export class Dialog implements UIDialogInterface {
  #scene: Phaser.Scene;

  #height: number;

  #width: number;

  #padding: number;

  #container!: Phaser.GameObjects.Container;

  #userInputCursor!: Phaser.GameObjects.Image;

  #userInputCursorTween!: Phaser.Tweens.Tween;

  #uiText!: Phaser.GameObjects.Text;

  #messagesToShow: string[];

  #backupMessages: string[];

  isVisible: boolean;

  textAnimationPlaying: boolean;

  constructor(config: DialogConfig) {
    this.#scene = config.scene;
    this.#height = config.height || 200;
    this.#padding = config.padding || 60;
    this.#width =
      config.width || this.#scene.cameras.main.width - this.#padding * 2;
    this.#messagesToShow = [];
    this.#backupMessages = [];
    this.isVisible = false;
    this.textAnimationPlaying = false;

    this._createUI();
    this.hide();
  }

  _createUI() {
    const panel = this.#scene.add
      .rectangle(0, 0, this.#width, this.#height, 0xffffff, 0.9)
      .setOrigin(0)
      .setStrokeStyle(8, DialogColors.border, 1);
    this.#uiText = this.#scene.add.text(18, 12, "", {
      ...{
        fontFamily: PRIMARY_FONT_FAMILY,
        color: "black",
        fontSize: FontSize.EXTRA_LARGE,
        wordWrap: { width: 0 },
      },
      ...{ wordWrap: { width: this.#width - 18 } },
    });

    this.#container = this.#scene.add.container(0, 0, [panel]);
    this.#container.add(this.#uiText);

    const startX = this.#padding;
    const startY =
      this.#scene.cameras.main.height - this.#height - this.#padding / 4;
    this.#container.setPosition(startX, startY);
    this.#createPlayerInputCursor();
  }

  get moreMessagesToShow(): boolean {
    return this.#messagesToShow.length > 0;
  }

  setMessages(messages: string[]): void {
    this.#backupMessages = [...messages];
  }

  show(): void {
    this.#container.setAlpha(1);
    this.isVisible = true;
    this.#messagesToShow = [...this.#backupMessages];
    this.showNextMessage();
  }

  hide(): void {
    this.#userInputCursorTween.pause();
    this.#container.setAlpha(0);
    this.isVisible = false;
  }

  showNextMessage(): void {
    if (this.isVisible && this.#messagesToShow.length === 0) {
      this.hide();
      return;
    }

    if (this.#messagesToShow.length === 0) {
      return;
    }

    this.#uiText.setText("").setAlpha(1);
    animateText(
      this.#scene,
      this.#uiText,
      this.#messagesToShow.shift() || "",
      10,
      () => {
        this.textAnimationPlaying = false;
      },
    );
    this.textAnimationPlaying = true;
  }

  #createPlayerInputCursor(): void {
    const yPosition = this.#height - 24;
    this.#userInputCursor = this.#scene.add.image(
      this.#width - 20,
      yPosition,
      AssetKeys.UI.CURSOR,
    );
    this.#userInputCursor.setAngle(90).setScale(4.5, 2);
    this.#userInputCursorTween = this.#scene.add.tween({
      delay: 0,
      duration: 500,
      repeat: -1,
      y: {
        from: yPosition,
        start: yPosition,
        to: yPosition + 6,
      },
      targets: this.#userInputCursor,
    });
    // this._userInputCursorTween.pause();
    this.#container.add(this.#userInputCursor);
  }
}
