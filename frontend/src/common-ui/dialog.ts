import Phaser from "phaser";
import { PRIMARY_FONT_FAMILY, FontSize } from "../assets/fonts";
import { animateText } from "../utils/text-utils";
import { DialogColors } from "../assets/colors";
import { AssetKeys } from "../assets/asset-keys";
import type { UIObject } from "./ui-object";

export type DialogConfig = {
  scene: Phaser.Scene;
  height?: number;
  width?: number;
  padding?: number;
  fontColor?: number;
  borderColor?: number;
  backgroundColor?: number;
};

export class Dialog {
  _scene: Phaser.Scene;

  _height: number;

  _width: number;

  _padding: number;

  _container!: Phaser.GameObjects.Container;

  _userInputCursor!: Phaser.GameObjects.Image;

  _userInputCursorTween!: Phaser.Tweens.Tween;

  _uiText!: Phaser.GameObjects.Text;

  _messagesToShow: string[];

  _backupMessages: string[];

  isVisible: boolean;

  textAnimationPlaying: boolean;

  constructor(config: DialogConfig) {
    this._scene = config.scene;
    this._padding = config.padding || 60;
    this._height = config.height || 200;
    this._width = config.width || this._scene.cameras.main.width - this._padding * 2;
    this._messagesToShow = [];
    this._backupMessages = [];
    this.isVisible = false;
    this.textAnimationPlaying = false;

    this._createUI();
    this.hide();
  }

  _createUI() {
    const panel = this._scene.add
      .rectangle(0, 0, this._width, this._height, 0xffffff, 0.9)
      .setOrigin(0)
      .setStrokeStyle(8, DialogColors.border, 1);
    this._uiText = this._scene.add.text(18, 12, "", {
      ...{
        fontFamily: PRIMARY_FONT_FAMILY,
        color: 'black',
        fontSize: FontSize.EXTRA_LARGE,
        wordWrap: { width: 0 },
      },
      ...{ wordWrap: { width: this._width - 18 } },
    });

    this._container = this._scene.add.container(0, 0, [panel]);
    this._container.add(this._uiText);

    const startX = this._padding;
    const startY =
    this._scene.cameras.main.height - this._height - this._padding / 4;
    this._container.setPosition(startX, startY);
debugger
    this.#createPlayerInputCursor();
  }

  get moreMessagesToShow(): boolean {
    return this._messagesToShow.length > 0;
  }

  setMessages(messages: string[]): void {
    this._backupMessages = [...messages];
  };

  hide(): void {
    this._userInputCursorTween.pause();
    this._container.setAlpha(0);
    this.isVisible = false;
  }

  show(): void {
    debugger
    this._container.setAlpha(1);
    this.isVisible = true;
    this._messagesToShow = [...this._backupMessages];
    this.showNextMessage();
  }

  showNextMessage(): void {
    if (this.isVisible && this._messagesToShow.length === 0 ) {
      debugger
      this.hide();
      return;
    }

    if (this._messagesToShow.length === 0 ) {
      return;
    }

    this._uiText.setText("").setAlpha(1);
    animateText(this._scene, this._uiText, this._messagesToShow.shift() || "", {
      delay: 10,
      callback: () => {
        this.textAnimationPlaying = false;
      },
    });
    this.textAnimationPlaying = true;
  }

  #createPlayerInputCursor(): void {
    const yPosition = this._height - 24;
    this._userInputCursor = this._scene.add.image(
      this._width - 20,
      yPosition,
      AssetKeys.UI.CURSOR,
    );
    this._userInputCursor.setAngle(90).setScale(4.5, 2);
    this._userInputCursorTween = this._scene.add.tween({
      delay: 0,
      duration: 500,
      repeat: -1,
      y: {
        from: yPosition,
        start: yPosition,
        to: yPosition + 6,
      },
      targets: this._userInputCursor,
    });
    // this._userInputCursorTween.pause();
    this._container.add(this._userInputCursor);
  }
}
