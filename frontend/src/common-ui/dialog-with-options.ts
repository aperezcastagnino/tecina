import Phaser from "phaser";
import { animateText } from "../utils/text-utils";
import { AssetKeys } from "../assets/asset-keys";
import { Colors, menuColor } from "../assets/colors";
import { FontSize, PRIMARY_FONT_FAMILY } from "../assets/fonts";
import { Dialog } from "./dialog";

const MENU_CURSOR_POS = {
  x: 42,
  y: 38,
};

export const TEXT_STYLE = {
  fontFamily: PRIMARY_FONT_FAMILY,
  color: Colors.White,
  fontSize: FontSize.EXTRA_LARGE,
};

export class OptionDialog extends Dialog {
  #battleTextGameObjectLine1: Phaser.GameObjects.Text;

  #mainMenuPhaserContainerGameObject: Phaser.GameObjects.Container;

  #titleUiText: Phaser.GameObjects.Text;

  #firstOption: Phaser.GameObjects.Text;

  #secondOption: Phaser.GameObjects.Text;

  #thirdOption: Phaser.GameObjects.Text;

  #fourOption: Phaser.GameObjects.Text;

  #selectedMenuOptionIndex: number;

  #isUpperMenuOption: number;

  #availableMenuOptions: string[];

  #selectedMenuOption: any;

  #isRightMenuOption: number;

  #callback: (index: number, option: string) => void;

  #title: string;

  #textTitlePixelLength: number;

  constructor(
    scene: Phaser.Scene,
    title: string,
    options: string[],
    callback: (index: number, option: string) => void
  ) {
    this.#scene = scene;
    this.#padding = 90;
    this.#height = 124;
    this.#textAnimationPlaying = false;
    this.#messagesToShow = [];
    this.#availableMenuOptions = options;
    this.#title = title;
    this.#textTitlePixelLength = 500;
    this.createMainMenu();
    this.#selectedMenuOptionIndex = 0;
    this.#isUpperMenuOption = 0;
    this.#isRightMenuOption = 0;
    this.#callback = callback;
  }

  createMainMenu() {
    const startY =
      this.#scene.cameras.main.height - this.#height - this.#padding / 4;
    const textOptionPixelLength = 400;
    this.#userInputCursor = this.#scene.add
      .image(
        this.#padding + this.#textTitlePixelLength - 25,
        MENU_CURSOR_POS.y,
        AssetKeys.UI.CURSOR,
        0
      )
      .setOrigin(0.5)
      .setScale(2.5)
      .setBlendMode(Phaser.BlendModes.ADD); // Intenta con diferentes modos de mezcla
    this.#textAnimationPlaying = true;
    this.#mainMenuPhaserContainerGameObject = this.#scene.add.container(
      800,
      startY,
      [
        this.#createMainInfoSubPane(),
        (this.#titleUiText = this.#scene.add.text(
          this.#padding,
          55,
          "",
          TEXT_STYLE
        )),
        (this.#firstOption = this.#scene.add.text(
          this.#padding + this.#textTitlePixelLength,
          22,
          "",
          TEXT_STYLE
        )),
        (this.#secondOption = this.#scene.add.text(
          this.#padding + this.#textTitlePixelLength + textOptionPixelLength,
          22,
          "",
          TEXT_STYLE
        )),
        (this.#thirdOption = this.#scene.add.text(
          this.#padding + this.#textTitlePixelLength,
          80,
          "",
          TEXT_STYLE
        )),
        (this.#fourOption = this.#scene.add.text(
          this.#padding + this.#textTitlePixelLength + textOptionPixelLength,
          80,
          "",
          TEXT_STYLE
        )),
        this.#userInputCursor,
      ]
    );
    this.#mainMenuPhaserContainerGameObject.setAlpha(0);
  }

  #createMainInfoSubPane() {
    const rectWidth = this.#scene.cameras.main.width;
    const rectHeight = 214;
    return this.#scene.add
      .rectangle(0, 0, rectWidth, rectHeight, menuColor.main, 1)
      .setOrigin(0)
      .setStrokeStyle(8, menuColor.border, 1);
  }

  playInputCursorAnimation() {
    this.#userInputCursor.setPosition(
      this.#battleTextGameObjectLine1.displayWidth +
        this.#userInputCursor.displayWidth * 2.7,
      this.#userInputCursor.y
    );
    this.#userInputCursor.setAlpha(1);
    this.#userInputCursorTween.restart();
  }

  hideMainMenu() {
    if (this.isVisible) {
      this.#mainMenuPhaserContainerGameObject.setAlpha(0);
      this.#isVisible = false;
    }
  }

  showMainMenu() {
    if (!this.#isVisible) {
      this.#mainMenuPhaserContainerGameObject.setAlpha(1);
      this.#animation();
      this.#isVisible = true;
    }
  }

  #animation() {
    this.#titleUiText.text = "";
    this.#firstOption.text = "";
    this.#secondOption.text = "";
    this.#thirdOption.text = "";
    this.#fourOption.text = "";
    animateText(this.#scene, this.#titleUiText, this.#title, {
      delay: 20,
      callback: () => {
        this.#textAnimationPlaying = false;
      },
    });
    animateText(
      this.#scene,
      this.#firstOption,
      this.#availableMenuOptions[0],
      {
        delay: 20,
        callback: () => {
          this.#textAnimationPlaying = false;
        },
      }
    );
    animateText(
      this.#scene,
      this.#secondOption,
      this.#availableMenuOptions[1],
      {
        delay: 20,
        callback: () => {
          this.#textAnimationPlaying = false;
        },
      }
    );
    animateText(
      this.#scene,
      this.#thirdOption,
      this.#availableMenuOptions[2],
      {
        delay: 20,
        callback: () => {
          this.#textAnimationPlaying = false;
        },
      }
    );
    animateText(
      this.#scene,
      this.#fourOption,
      this.#availableMenuOptions[3],
      {
        delay: 20,
        callback: () => {
          this.#textAnimationPlaying = false;
        },
      }
    );
  }

  // Movements--------------------------------------------------------------------------------------
  handlePlayerInput(input: string) {
    if (input === "OK") {
      this.#handleSelectedMenuOption();
      return;
    }
    this.#moveMenuCursor(input);
  }

  #moveMenuCursor(direction: any) {
    let changeUpperDirection = false;
    let changeRightDirection = false;
    switch (direction) {
      case "UP":
        this.#isUpperMenuOption = 0;
        changeUpperDirection = true;
        break;
      case "DOWN":
        this.#isUpperMenuOption = 1;
        changeUpperDirection = true;
        break;
      case "LEFT":
        this.#isRightMenuOption = 0;
        changeRightDirection = true;
        break;
      case "RIGHT":
        this.#isRightMenuOption = 1;
        changeRightDirection = true;
        break;
      case "NONE":
        break;
    }
    if (this.#isUpperMenuOption == 0)
      this.#selectedMenuOptionIndex = this.#isRightMenuOption;
    if (this.#isUpperMenuOption == 1)
      this.#selectedMenuOptionIndex = 2 + this.#isRightMenuOption;
    this.#selectedMenuOption =
      this.#isUpperMenuOption * 2 + this.#isRightMenuOption * 2;
    let x = 70 + this.#textTitlePixelLength + 400 * this.#isRightMenuOption;
    let y = 35 + this.#isUpperMenuOption * 60;
    this.#userInputCursor.setPosition(x, y);
  }

  #handleSelectedMenuOption() {
    this.#selectedMenuOption =
      this.#availableMenuOptions[this.#selectedMenuOptionIndex];
    this.#callback(this.#selectedMenuOptionIndex, this.#selectedMenuOption);
    this.hideMainMenu();
  }
}
