export class TextButton extends Phaser.GameObjects.Text {
  #buttonHoverStyle: object | undefined;

  #buttonRestStyle: object | undefined;

  #buttonActiveStyle: object | undefined;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle,
    callback: () => void,
    buttonHoverStyle?: object,
    buttonRestStyle?: object,
    buttonActiveStyle?: object,
  ) {
    super(scene, x, y, text, style);
    this.#buttonHoverStyle = buttonHoverStyle;
    this.#buttonRestStyle = buttonRestStyle;
    this.#buttonActiveStyle = buttonActiveStyle;

    this.setInteractive({ useHandCursor: true })
      .on("pointerover", () => this.#enterButtonHoverState())
      .on("pointerout", () => this.#enterButtonRestState())
      .on("pointerdown", () => this.#enterButtonActiveState())
      .on("pointerup", () => {
        this.#enterButtonHoverState();
        callback();
      });
  }

  #enterButtonHoverState() {
    this.setStyle(this.#buttonHoverStyle ?? { fill: "#ffffff" });
  }

  #enterButtonRestState() {
    this.setStyle(this.#buttonRestStyle ?? { fill: "#ffffff" });
  }

  #enterButtonActiveState() {
    this.setStyle(this.#buttonActiveStyle ?? { fill: "#ffffff" });
  }
}
