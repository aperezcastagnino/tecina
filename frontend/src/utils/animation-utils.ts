import { AssetKeys } from "assets/asset-keys";
import type { Scene } from "phaser";

type AnimationConfig = {
  ASSET_KEY: string;
  ANIMATION_KEY: string;
  FRAME_WIDTH: number;
  FRAME_HEIGHT: number;
  STAR_FRAME: number;
  END_FRAME: number;
};

const FRAME_RATE = 19;

export class Animations {
  static #createAnimations = (
    scene: Scene,
    animation: AnimationConfig,
  ): void => {
    scene.anims.create({
      key: animation.ANIMATION_KEY,
      frames: scene.anims.generateFrameNumbers(animation.ASSET_KEY),
      frameRate: FRAME_RATE,
      repeat: -1,
    });
  };

  static animateText = (
    scene: Phaser.Scene,
    target: Phaser.GameObjects.Text,
    text: string,
    delay: number = 25,
    callback?: () => void,
  ) => {
    let i = 0;
    scene.time.addEvent({
      callback: () => {
        // eslint-disable-next-line no-param-reassign
        target.text += text[i];

        i += 1;
        if (i >= text.length && callback) {
          callback();
        }
      },
      repeat: text.length - 1,
      delay,
    });
  };

  static useOrangeAnimation = (scene: Scene): void => {
    this.#createAnimations(scene, AssetKeys.ITEMS.FRUITS.ORANGE);
  };

  static useStrawberryAnimation = (scene: Scene): void => {
    this.#createAnimations(scene, AssetKeys.ITEMS.FRUITS.STRAWBERRY);
  };
}
