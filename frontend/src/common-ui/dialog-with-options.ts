import Phaser from "phaser";
import { animateText } from "../utils/text-utils";
import { AssetKeys } from "../assets/asset-keys";
import { Colors, DialogColors } from "../assets/colors";
import { FontSize, PRIMARY_FONT_FAMILY } from "../assets/fonts";
import {
  DIRECTION,
  PLAYER_KEYS,
  type Direction,
  type PlayerKeys,
} from "../common/player-keys";

const MENU_CURSOR_POS = {
  x: 42,
  y: 38,
};

export const TEXT_STYLE = {
  fontFamily: PRIMARY_FONT_FAMILY,
  color: Colors.White,
  fontSize: FontSize.EXTRA_LARGE,
};

export class DialogWithOptions {
  #scene: Phaser.Scene;

  #padding: number;

  #height: number;

  #isVisible: boolean = false;

  #cursor!: Phaser.GameObjects.Image;

  #userInputCursorTween!: Phaser.Tweens.Tween;

  #textAnimationPlaying: boolean;

  #messagesToShow: string[];

  #battleTextGameObjectLine1!: Phaser.GameObjects.Text;

  #container!: Phaser.GameObjects.Container;

  #statementUI!: Phaser.GameObjects.Text;

  #firstOptionUI!: Phaser.GameObjects.Text;

  #secondOptionUI!: Phaser.GameObjects.Text;

  #thirdOptionUI!: Phaser.GameObjects.Text;

  #fourthOptionUI!: Phaser.GameObjects.Text;

  #selectedMenuOptionIndex: number;

  #isUpperMenuOption: number;

  #options: string[];

  #selectedMenuOption: any;

  #isRightMenuOption: number;

  #callback: (index: number, option: string) => void;

  #statement: string;

  #statementTextLength: number;

  constructor(
    scene: Phaser.Scene,
    statement: string,
    options: string[],
    callback: (index: number, option: string) => void
  ) {
    this.#scene = scene;
    this.#padding = 60;
    this.#height = 200;
    this.#statement = statement;
    this.#messagesToShow = [];
    this.#options = options;
    this.#textAnimationPlaying = false;
    this.#statementTextLength = 500;
    this.createUI();
    this.#selectedMenuOptionIndex = 0;
    this.#isUpperMenuOption = 0;
    this.#isRightMenuOption = 0;
    this.#callback = callback;
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

  hide() {
    this.#container.setAlpha(0);
    this.#isVisible = false;
  }

  show() {
    this.#container.setAlpha(1);
    this.#execAnimation();
    this.#isVisible = true;
  }

  createUI() {
    const containerStartX = this.#padding;
    const containerStartY =
      this.#scene.cameras.main.height - this.#height - this.#padding / 4;
    const optionTextLength = 400;
    this.#textAnimationPlaying = true;

    const containerBackground = this.#scene.add
      .rectangle(
        0,
        0,
        this.#scene.cameras.main.width - this.#padding * 2,
        this.#height,
        DialogColors.main,
        1
      )
      .setOrigin(0)
      .setStrokeStyle(8, DialogColors.border, 1);

    this.#statementUI = this.#scene.add.text(this.#padding, 55, "", TEXT_STYLE);

    this.#firstOptionUI = this.#scene.add.text(
      this.#padding + this.#statementTextLength,
      22,
      "",
      TEXT_STYLE
    );
    this.#secondOptionUI = this.#scene.add.text(
      this.#padding + this.#statementTextLength + optionTextLength,
      22,
      "",
      TEXT_STYLE
    );
    this.#thirdOptionUI = this.#scene.add.text(
      this.#padding + this.#statementTextLength,
      80,
      "",
      TEXT_STYLE
    );
    this.#thirdOptionUI = this.#scene.add.text(
      this.#padding + this.#statementTextLength,
      80,
      "",
      TEXT_STYLE
    );
    this.#fourthOptionUI = this.#scene.add.text(
      this.#padding + this.#statementTextLength + optionTextLength,
      80,
      "",
      TEXT_STYLE
    );

    this.#cursor = this.#scene.add
      .image(
        this.#padding + this.#statementTextLength - 25,
        MENU_CURSOR_POS.y,
        AssetKeys.UI.CURSOR,
        0
      )
      .setOrigin(0.5)
      .setScale(2.5);

    this.#container = this.#scene.add
      .container(containerStartX, containerStartY, [
        containerBackground,
        this.#statementUI,
        this.#firstOptionUI,
        this.#secondOptionUI,
        this.#thirdOptionUI,
        this.#fourthOptionUI,
        this.#cursor,
      ])
      .setAlpha(0);
  }

  playInputCursorAnimation() {
    this.#cursor.setPosition(
      this.#battleTextGameObjectLine1.displayWidth +
        this.#cursor.displayWidth * 2.7,
      this.#cursor.y
    );
    this.#cursor.setAlpha(1);
    this.#userInputCursorTween.restart();
  }

  #execAnimation() {
    this.#statementUI.text = "";
    this.#firstOptionUI.text = "";
    this.#secondOptionUI.text = "";
    this.#thirdOptionUI.text = "";
    this.#fourthOptionUI.text = "";
    const delay = 10;

    animateText(this.#scene, this.#statementUI, this.#statement, delay, () => {
      this.#textAnimationPlaying = false;
    });

    animateText(
      this.#scene,
      this.#firstOptionUI,
      this.#options[0] || "",
      delay,
      () => {
        this.#textAnimationPlaying = false;
      }
    );
    animateText(
      this.#scene,
      this.#secondOptionUI,
      this.#options[1] || "",
      delay,
      () => {
        this.#textAnimationPlaying = false;
      }
    );
    animateText(
      this.#scene,
      this.#thirdOptionUI,
      this.#options[2] || "",
      delay,
      () => {
        this.#textAnimationPlaying = false;
      }
    );
    animateText(
      this.#scene,
      this.#fourthOptionUI,
      this.#options[3] || "",
      delay,
      () => {
        this.#textAnimationPlaying = false;
      }
    );
  }

  handlePlayerInput(keyPressed: PlayerKeys) {
    if (keyPressed === PLAYER_KEYS.NONE) return;
    if (keyPressed === PLAYER_KEYS.SPACE) {
      this.#handleSelectedOption();
    } else {
      this.#moveMenuCursor(keyPressed);
    }
  }

  #moveMenuCursor(direction: Direction) {
    switch (direction) {
      case DIRECTION.UP:
        this.#isUpperMenuOption = 0;
        break;
      case DIRECTION.DOWN:
        this.#isUpperMenuOption = 1;
        break;
      case DIRECTION.LEFT:
        this.#isRightMenuOption = 0;
        break;
      case DIRECTION.RIGHT:
        this.#isRightMenuOption = 1;
        break;
      default:
        break;
    }

    if (this.#isUpperMenuOption === 0)
      this.#selectedMenuOptionIndex = this.#isRightMenuOption;
    if (this.#isUpperMenuOption === 1)
      this.#selectedMenuOptionIndex = 2 + this.#isRightMenuOption;
    this.#selectedMenuOption =
      this.#isUpperMenuOption * 2 + this.#isRightMenuOption * 2;

    const x = 70 + this.#statementTextLength + 400 * this.#isRightMenuOption;
    const y = 35 + this.#isUpperMenuOption * 60;
    this.#cursor.setPosition(x, y);
  }

  #handleSelectedOption() {
    this.#selectedMenuOption = this.#options[this.#selectedMenuOptionIndex];
    this.#callback(this.#selectedMenuOptionIndex, this.#selectedMenuOption);
    this.hide();
  }
}
