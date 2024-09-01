export class Control {
  #scene: Phaser.Scene;
  #cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  #lockPlayerInput: boolean;

  constructor(scene: Phaser.Scene) {
    this.#scene = scene;
    this.#cursorKeys = this.#scene.input.keyboard?.createCursorKeys();
    this.#lockPlayerInput = false;
  }



};
