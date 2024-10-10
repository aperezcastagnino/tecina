import { DIRECTION, SPECIAL_KEYS } from "./direction";

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

  wasSpaceKeyPressed() {
    if (this.#cursorKeys === undefined) {
      return false;
    }
    return Phaser.Input.Keyboard.JustDown(this.#cursorKeys.space);
  }

  wasShiftPressed() {
    if (this.#cursorKeys === undefined) {
      return false;
    }
    return Phaser.Input.Keyboard.JustDown(this.#cursorKeys.shift);
  }

  getKeyPressed() {
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

  getDirectionKeyJustPressed() {
    if (this.#cursorKeys === undefined) {
      return DIRECTION.NONE;
    }

    let selectedDirection = DIRECTION.NONE;
    if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.left)) {
      selectedDirection = DIRECTION.LEFT;
    } else if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.right)) {
      selectedDirection = DIRECTION.RIGHT;
    } else if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.up)) {
      selectedDirection = DIRECTION.UP;
    } else if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.down)) {
      selectedDirection = DIRECTION.DOWN;
    }

    return selectedDirection;
  }

  getDirectionKeyPressedDown() {
    if (this.#cursorKeys === undefined) {
      return DIRECTION.NONE;
    }

    let selectedDirection = DIRECTION.NONE;
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
