import Phaser from "phaser";
import { AssetKeys } from "assets/asset-keys";
import { Colors, DialogColors } from "assets/colors";
import { FontSize, PRIMARY_FONT_FAMILY } from "assets/fonts";
import {
  DIRECTION,
  PLAYER_KEYS,
  type Direction,
  type PlayerKeys,
} from "common/player-keys";
import type { DialogData } from "types/level-data";
import { Animations } from "utils/animation-utils";
import type { DialogConfig } from "./base-dialog";

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
  callback: (option: string) => void;
} & DialogConfig;

export class DialogWithOptions {
  scene: Phaser.Scene;

  data: DialogData[];

  #height: number;

  #width: number;

  #padding: number;

  #cursor!: Phaser.GameObjects.Image;

  #container!: Phaser.GameObjects.Container;

  protected statementUI!: Phaser.GameObjects.Text;

  #firstOptionUI!: Phaser.GameObjects.Text;

  #secondOptionUI!: Phaser.GameObjects.Text;

  #thirdOptionUI!: Phaser.GameObjects.Text;

  #fourthOptionUI!: Phaser.GameObjects.Text;

  #selectedMenuOptionIndex: number;

  #isUpperMenuOption: number;

  #options: string[];

  #selectedMenuOption: any;

  #isRightMenuOption: number;

  #callback: (optionSelected: string) => void;

  #statement: string;

  #statementTextLength: number;

  textAnimationPlaying: boolean;

  private messagesToShow: string[] = [];

  protected activeDialog: DialogData | undefined;

  protected questGiverNpcId: string | undefined;

  container!: Phaser.GameObjects.Container;

  constructor(config: DialogWithOptionsConfig) {
    this.scene = config.scene;
    this.data = config.data;
    this.#height = config.height || 200;
    this.#padding = config.padding || 60;
    this.#width =
      config.width || this.scene.cameras.main.width - this.#padding * 2;
    this.#statement = "";
    this.#statementTextLength = 600;
    this.#options = [];
    this.#selectedMenuOptionIndex = 0;
    this.#isUpperMenuOption = 0;
    this.#isRightMenuOption = 0;
    this.#callback = config.callback;
    this.textAnimationPlaying = false;

    this._createUI();
  }

  _createUI(): void {
    const containerStartX = this.#padding;
    const containerStartY =
      this.scene.cameras.main.height - this.#height - this.#padding / 4;
    const optionTextLength = 400;
    this.textAnimationPlaying = true;

    const containerBackground = this.scene.add
      .rectangle(
        0,
        0,
        this.scene.cameras.main.width - this.#padding * 2,
        this.#height,
        DialogColors.main,
        1,
      )
      .setOrigin(0)
      .setStrokeStyle(8, DialogColors.border, 1);

    this.statementUI = this.scene.add.text(
      this.#padding,
      55,
      "",
      DIALOG_TEXT_STYLE,
    );

    this.#firstOptionUI = this.scene.add.text(
      this.#padding + this.#statementTextLength,
      22,
      "",
      DIALOG_TEXT_STYLE,
    );
    this.#secondOptionUI = this.scene.add.text(
      this.#padding + this.#statementTextLength + optionTextLength,
      22,
      "",
      DIALOG_TEXT_STYLE,
    );
    this.#thirdOptionUI = this.scene.add.text(
      this.#padding + this.#statementTextLength,
      80,
      "",
      DIALOG_TEXT_STYLE,
    );
    this.#thirdOptionUI = this.scene.add.text(
      this.#padding + this.#statementTextLength,
      80,
      "",
      DIALOG_TEXT_STYLE,
    );
    this.#fourthOptionUI = this.scene.add.text(
      this.#padding + this.#statementTextLength + optionTextLength,
      80,
      "",
      DIALOG_TEXT_STYLE,
    );

    this.#cursor = this.scene.add
      .image(
        this.#padding + this.#statementTextLength - 25,
        MENU_CURSOR_POS.y,
        AssetKeys.UI_COMPONENTS.CURSOR,
        0,
      )
      .setOrigin(0.5)
      .setScale(2.5);

    this.#container = this.scene.add
      .container(containerStartX, containerStartY, [
        containerBackground,
        this.statementUI,
        this.#firstOptionUI,
        this.#secondOptionUI,
        this.#thirdOptionUI,
        this.#fourthOptionUI,
        this.#cursor,
      ])
      .setAlpha(0);
  }

  protected setIsVisible(value: boolean): void {
    this.container.visible = value;
  }

  isVisible(): boolean {
    return this.container.visible;
  }

  showNextMessage(): void {
    if (this.textAnimationPlaying) return;

    if (this.messagesToShow.length === 0 && this.isVisible()) {
      this.hide();
      return;
    }

    if (this.messagesToShow.length === 0) return;

    this.setIsVisible(true);
    this.statementUI.setText("").setAlpha(1);
    this.textAnimationPlaying = true;
    Animations.animateText(
      this.scene,
      this.statementUI,
      this.messagesToShow.shift() || "",
      10,
      () => {
        this.textAnimationPlaying = false;
      },
    );
  }

  #getDialogData(npcId?: string): void {
    const dialog = this.activeDialog || this.#findMessageInCompleted(this.data);

    if (!dialog) {
      console.error("No dialogs not shown were found.");
      this.hide();
      return;
    }

    if (!this.activeDialog) {
      this.activeDialog = dialog;
      this.questGiverNpcId = npcId;
    }

    const textsToShow = this.#resolveDialogsToShow(dialog, npcId);
    this.messagesToShow = [...textsToShow];
    this.showNextMessage();
  }

  #resolveDialogsToShow(dialog: DialogData, npcId?: string): string[] {
    if (this.questGiverNpcId === npcId) return this.selectRandomText(dialog.questInProgress);
    if (this.questGiverNpcId) return this.selectRandomText(dialog.hints);

    // eslint-disable-next-line no-param-reassign
    this.questGiverNpcId = npcId || "";
    return this.selectRandomText(dialog.questStart);
  }

  #findMessageInCompleted(dialogs?: DialogData[]): DialogData | undefined {
    return dialogs?.find(
      (dialog) =>
        !dialog.completed && (!dialog.options || dialog.options.length === 0),
    );
  }

  show(npcId?: string): void {
    this.#getDialogData(npcId);
  }

  hide(): void {
    this.setIsVisible(false);
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
    this.statementUI.text = "";
    this.#firstOptionUI.text = "";
    this.#secondOptionUI.text = "";
    this.#thirdOptionUI.text = "";
    this.#fourthOptionUI.text = "";
    const delay = 10;

    Animations.animateText(
      this.scene,
      this.statementUI,
      this.#statement,
      delay,
      () => {
        this.textAnimationPlaying = false;
      },
    );

    Animations.animateText(
      this.scene,
      this.#firstOptionUI,
      this.#options[0] || "",
      delay,
      () => {
        this.textAnimationPlaying = false;
      },
    );
    Animations.animateText(
      this.scene,
      this.#secondOptionUI,
      this.#options[1] || "",
      delay,
      () => {
        this.textAnimationPlaying = false;
      },
    );
    Animations.animateText(
      this.scene,
      this.#thirdOptionUI,
      this.#options[2] || "",
      delay,
      () => {
        this.textAnimationPlaying = false;
      },
    );
    Animations.animateText(
      this.scene,
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
    this.#callback(this.#selectedMenuOption);
    this.hide();
  }

  setMessageComplete(npcId?: string): void {
    if (!this.activeDialog) return;

    if (this.questGiverNpcId === npcId) {
      this.activeDialog!.completed = true;
      this.activeDialog = undefined;
      this.questGiverNpcId = undefined;
    }
  }

  protected selectRandomText(array: string[][]): string[] {
    return array[Math.floor(Math.random() * array.length)]!;
  }

}
