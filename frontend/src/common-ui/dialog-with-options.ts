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
import type { UIDialogInterface } from "./interfaces/ui-dialog-interface";
import { type DialogConfig } from "./dialog";

const MENU_CURSOR_POS = {
  x: 42,
  y: 38,
};

export const DIALOG_TEXT_STYLE = {
  fontFamily: PRIMARY_FONT_FAMILY,
  color: Colors.White,
  fontSize: FontSize.EXTRA_LARGE,
};

export type DialogWithOptionsConfig = {
  statement: string;
  options: string[];
  callback: (index: number, option: string) => void;
} & DialogConfig;

export class DialogWithOptions implements UIDialogInterface {
  #scene: Phaser.Scene;

  #height: number;

  #width: number;

  #padding: number;

  #cursor!: Phaser.GameObjects.Image;

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

  isVisible: boolean;

  textAnimationPlaying: boolean;

  constructor(config: DialogWithOptionsConfig) {
    this.#scene = config.scene;
    this.#height = config.height || 200;
    this.#padding = config.padding || 60;
    this.#width =
      config.width || this.#scene.cameras.main.width - this.#padding * 2;
    this.#statement = config.statement;
    this.#statementTextLength = 600;
    this.#options = config.options;
    this.#selectedMenuOptionIndex = 0;
    this.#isUpperMenuOption = 0;
    this.#isRightMenuOption = 0;
    this.#callback = config.callback;
    this.isVisible = false;
    this.textAnimationPlaying = false;

    this._createUI();
  }

  _createUI() {
    const containerStartX = this.#padding;
    const containerStartY =
      this.#scene.cameras.main.height - this.#height - this.#padding / 4;
    const optionTextLength = 400;
    this.textAnimationPlaying = true;

    const containerBackground = this.#scene.add
      .rectangle(
        0,
        0,
        this.#scene.cameras.main.width - this.#padding * 2,
        this.#height,
        DialogColors.main,
        1,
      )
      .setOrigin(0)
      .setStrokeStyle(8, DialogColors.border, 1);

    this.#statementUI = this.#scene.add.text(
      this.#padding,
      55,
      "",
      DIALOG_TEXT_STYLE,
    );

    this.#firstOptionUI = this.#scene.add.text(
      this.#padding + this.#statementTextLength,
      22,
      "",
      DIALOG_TEXT_STYLE,
    );
    this.#secondOptionUI = this.#scene.add.text(
      this.#padding + this.#statementTextLength + optionTextLength,
      22,
      "",
      DIALOG_TEXT_STYLE,
    );
    this.#thirdOptionUI = this.#scene.add.text(
      this.#padding + this.#statementTextLength,
      80,
      "",
      DIALOG_TEXT_STYLE,
    );
    this.#thirdOptionUI = this.#scene.add.text(
      this.#padding + this.#statementTextLength,
      80,
      "",
      DIALOG_TEXT_STYLE,
    );
    this.#fourthOptionUI = this.#scene.add.text(
      this.#padding + this.#statementTextLength + optionTextLength,
      80,
      "",
      DIALOG_TEXT_STYLE,
    );

    this.#cursor = this.#scene.add
      .image(
        this.#padding + this.#statementTextLength - 25,
        MENU_CURSOR_POS.y,
        AssetKeys.UI.CURSOR,
        0,
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

  show(): void {
    this.#container.setAlpha(1);
    this.isVisible = true;
    this.#execAnimation();
  }

  hide(): void {
    this.#container.setAlpha(0);
    this.isVisible = false;
  }

  playInputCursorAnimation() {
    this.#cursor.setPosition(this.#cursor.displayWidth * 2.7, this.#cursor.y);
    this.#cursor.setAlpha(1);
  }

  handlePlayerInput(keyPressed: PlayerKeys) {
    if (keyPressed === PLAYER_KEYS.NONE) return;
    if (keyPressed === PLAYER_KEYS.SPACE) {
      this.#handleSelectedOption();
    } else {
      this.#moveMenuCursor(keyPressed);
    }
  }

  #execAnimation() {
    this.#statementUI.text = "";
    this.#firstOptionUI.text = "";
    this.#secondOptionUI.text = "";
    this.#thirdOptionUI.text = "";
    this.#fourthOptionUI.text = "";
    const delay = 10;

    animateText(this.#scene, this.#statementUI, this.#statement, delay, () => {
      this.textAnimationPlaying = false;
    });

    animateText(
      this.#scene,
      this.#firstOptionUI,
      this.#options[0] || "",
      delay,
      () => {
        this.textAnimationPlaying = false;
      },
    );
    animateText(
      this.#scene,
      this.#secondOptionUI,
      this.#options[1] || "",
      delay,
      () => {
        this.textAnimationPlaying = false;
      },
    );
    animateText(
      this.#scene,
      this.#thirdOptionUI,
      this.#options[2] || "",
      delay,
      () => {
        this.textAnimationPlaying = false;
      },
    );
    animateText(
      this.#scene,
      this.#fourthOptionUI,
      this.#options[3] || "",
      delay,
      () => {
        this.textAnimationPlaying = false;
      },
    );
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

    const x = 40 + this.#statementTextLength + 400 * this.#isRightMenuOption;
    const y = 40 + this.#isUpperMenuOption * 60;
    this.#cursor.setPosition(x, y);
  }

  #handleSelectedOption() {
    this.#selectedMenuOption = this.#options[this.#selectedMenuOptionIndex];
    this.#callback(this.#selectedMenuOptionIndex, this.#selectedMenuOption);
    this.hide();
  }
}
