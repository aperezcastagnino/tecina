import Phaser from "phaser";
import { PRIMARY_FONT_FAMILY, FontSize } from "../assets/fonts";
import { animateText } from "../utils/text-utils";
import { Colors } from "../assets/colors";
import { AssetKeys } from "../assets/asset-keys";

export class DialogUi {
  #scene: Phaser.Scene;

  #padding: number;

  #width: number;

  #height: number;

  #container: Phaser.GameObjects.Container;

  #isVisible: boolean = false;

  #userInputCursor!: Phaser.GameObjects.Image;

  #userInputCursorTween!: Phaser.Tweens.Tween;

  #uiText: Phaser.GameObjects.Text;

  #textAnimationPlaying: boolean;

  #messagesToShow: string[];

  constructor(scene: Phaser.Scene) {
    this.#scene = scene;
    this.#padding = 90;
    this.#width = this.#scene.cameras.main.width - this.#padding * 2;
    this.#height = 124;
    this.#textAnimationPlaying = false;
    this.#messagesToShow = [];
    const menuColor = {
      main: 0x324c3a,
      border: 0x6da87d,
    };
    const panel = this.#scene.add
      .rectangle(0, 0, this.#width, this.#height, menuColor.main, 0.9)
      .setOrigin(0)
      .setStrokeStyle(8, menuColor.border, 1);
    this.#container = this.#scene.add.container(0, 0, [panel]);
    this.#uiText = this.#scene.add.text(18, 12, "", {
      ...{
        fontFamily: PRIMARY_FONT_FAMILY,
        color: Colors.White,
        fontSize: FontSize.EXTRA_LARGE,
        wordWrap: { width: 0 },
      },
      ...{ wordWrap: { width: this.#width - 18 } },
    });
    this.#container.add(this.#uiText);
    this.#createPlayerInputCursor();
    this.hideDialogModal();
  }

  get isVisible() {
    return this.#isVisible;
  }

  get isAnimationPlaying() {
    return this.#textAnimationPlaying;
  }

  get moreMessagesToShow() {
    return this.#messagesToShow.length > 0;
  }

  showDialogModal(messages: string[]) {
    this.#messagesToShow = [...messages];
    const startX = this.#scene.cameras.main.worldView.width + this.#padding;
    const startY =
      this.#scene.cameras.main.height - this.#height - this.#padding / 4;
    this.#container.setPosition(startX, startY);
    this.#userInputCursorTween.restart();
    this.#container.setAlpha(1);
    this.#isVisible = true;
    this.showNextMessage();
  }

  showNextMessage() {
    if (this.#messagesToShow.length === 0) {
      return;
    }
    this.#uiText.setText("").setAlpha(1);
    animateText(this.#scene, this.#uiText, this.#messagesToShow.shift() || "", {
      delay: 20,
      callback: () => {
        this.#textAnimationPlaying = false;
      },
    });
    this.#textAnimationPlaying = true;
  }

  hideDialogModal() {
    this.#container.setAlpha(0);
    this.#userInputCursorTween.pause();
    this.#isVisible = false;
  }

  #createPlayerInputCursor() {
    const y = this.#height - 24;
    this.#userInputCursor = this.#scene.add.image(
      this.#width - 16,
      y,
      AssetKeys.UI.CURSOR,
    );
    this.#userInputCursor.setAngle(90).setScale(4.5, 2);
    this.#userInputCursorTween = this.#scene.add.tween({
      delay: 0,
      duration: 500,
      repeat: -1,
      y: {
        from: y,
        start: y,
        to: y + 6,
      },
      targets: this.#userInputCursor,
    });
    this.#userInputCursorTween.pause();
    this.#container.add(this.#userInputCursor);
  }
}
