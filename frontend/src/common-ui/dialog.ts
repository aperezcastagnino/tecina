import Phaser from "phaser";
import { PRIMARY_FONT_FAMILY, FontSize } from "../assets/fonts";
import { animateText } from "../utils/text-utils";
import { Colors } from "../assets/colors";
import { AssetKeys } from "../assets/asset-keys";

export class Dialog {
  _scene: Phaser.Scene;

  _padding: number;

  _width: number;

  _height: number;

  _container: Phaser.GameObjects.Container;

  _isVisible: boolean = false;

  _userInputCursor!: Phaser.GameObjects.Image;

  _userInputCursorTween!: Phaser.Tweens.Tween;

  _uiText: Phaser.GameObjects.Text;

  _textAnimationPlaying: boolean;

  _messagesToShow: string[];

  _messagesToShowOriginal: string[];

  constructor(scene: Phaser.Scene) {
    this._scene = scene;
    this._padding = 90;
    this._height = 124;
    this._width = this._scene.cameras.main.width - this._padding * 2;
    this._textAnimationPlaying = false;
    this._messagesToShow = [];
    this._messagesToShowOriginal = [];

    const menuColor = {
      main: 0x324c3a,
      border: 0x6da87d,
    };

    const panel = this._scene.add
      .rectangle(0, 0, this._width, this._height, menuColor.main, 0.9)
      .setOrigin(0)
      .setStrokeStyle(8, menuColor.border, 1);
    this._container = this._scene.add.container(0, 0, [panel]);
    this._uiText = this._scene.add.text(18, 12, "", {
      ...{
        fontFamily: PRIMARY_FONT_FAMILY,
        color: Colors.White,
        fontSize: FontSize.EXTRA_LARGE,
        wordWrap: { width: 0 },
      },
      ...{ wordWrap: { width: this._width - 18 } },
    });
    this._container.add(this._uiText);

    const startX = this._height;
    const startY =
    this._scene.cameras.main.height - this._height - this._padding / 4;
    this._container.setPosition(startX, startY);

    this.#createPlayerInputCursor();
    this.hide();
  }

  get isVisible() {
    return this._isVisible;
  }

  get isAnimationPlaying() {
    return this._textAnimationPlaying;
  }

  get moreMessagesToShow() {
    return this._messagesToShow.length > 0;
  }

  setMessages(messages: string[]) {
    this._messagesToShowOriginal = [...messages];
  };

  hide() {
    this._userInputCursorTween.pause();
    this._container.setAlpha(0);
    this._isVisible = false;
  }

  show() {
    this._container.setAlpha(1);
    this._isVisible = true;
    this._messagesToShow = [...this._messagesToShowOriginal];
    this.showNextMessage();
  }

  showNextMessage() {
    if (this._isVisible && this._messagesToShow.length === 0 ) {
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
        this._textAnimationPlaying = false;
      },
    });
    this._textAnimationPlaying = true;
  }

  #createPlayerInputCursor() {
    const y = this._height - 24;
    this._userInputCursor = this._scene.add.image(
      this._width - 16,
      y,
      AssetKeys.UI.CURSOR,
    );
    this._userInputCursor.setAngle(90).setScale(4.5, 2);
    this._userInputCursorTween = this._scene.add.tween({
      delay: 0,
      duration: 500,
      repeat: -1,
      y: {
        from: y,
        start: y,
        to: y + 6,
      },
      targets: this._userInputCursor,
    });
    this._userInputCursorTween.pause();
    this._container.add(this._userInputCursor);
  }
}
