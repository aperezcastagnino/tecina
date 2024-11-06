import {
  DIRECTION,
  SPECIAL_KEYS,
  type Direction,
  type PlayerKeys,
} from "./player-keys";

export class Controls {
  #scene: Phaser.Scene;

  #cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

  #lockPlayerInput: boolean;

  constructor(scene: Phaser.Scene) {
    this.#scene = scene;
    this.#cursorKeys = this.#scene.input.keyboard?.createCursorKeys();
    this.#lockPlayerInput = false;
  }

  get isInputLocked() {
    return this.#lockPlayerInput;
  }

  set lockInput(val: boolean) {
    this.#lockPlayerInput = val;
  }

  wasSpaceKeyPressed(): boolean {
    return Boolean(this.#cursorKeys) && Phaser.Input.Keyboard.JustDown(this.#cursorKeys!.space);
  }

  wasShiftPressed(): boolean {
    return Boolean(this.#cursorKeys) && Phaser.Input.Keyboard.JustDown(this.#cursorKeys!.shift);
  }

  getKeyPressed(): PlayerKeys {
    let keyPressed = DIRECTION.NONE;
    if (this.#cursorKeys === undefined) {
      return keyPressed;
    }

    if (this.#cursorKeys.left.isDown) {
      keyPressed = DIRECTION.LEFT;
    } else if (this.#cursorKeys.right.isDown) {
      keyPressed = DIRECTION.RIGHT;
    } else if (this.#cursorKeys.up.isDown) {
      keyPressed = DIRECTION.UP;
    } else if (this.#cursorKeys.down.isDown) {
      keyPressed = DIRECTION.DOWN;
    } else if (this.#cursorKeys.space.isDown) {
      keyPressed = SPECIAL_KEYS.SPACE;
    } else if (this.#cursorKeys.shift.isDown) {
      keyPressed = SPECIAL_KEYS.SHIFT;
    }

    return keyPressed;
  }

  getDirectionKeyPressed(): Direction {
    let selectedDirection = DIRECTION.NONE;
    if (this.#cursorKeys === undefined) {
      return selectedDirection;
    }

    if (this.#cursorKeys.left.isDown) {
      selectedDirection = DIRECTION.LEFT;
    } else if (this.#cursorKeys.right.isDown) {
      selectedDirection = DIRECTION.RIGHT;
    } else if (this.#cursorKeys.up.isDown) {
      selectedDirection = DIRECTION.UP;
    } else if (this.#cursorKeys.down.isDown) {
      selectedDirection = DIRECTION.DOWN;
    }

    return selectedDirection;
  }
}
