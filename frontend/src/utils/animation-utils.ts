import type { Scene } from "phaser";
import type { AnimationConfig } from "types/animation";
import { ItemKeys } from "assets/asset-keys";

export const FRAME_RATE = 19;

export class Animations {
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

  static createPlayerAnimation(
    scene: Scene,
    key: string,
    assetKey: string,
    frames: number[],
  ) {
    this.createAnimations(scene, { key, assetKey, frames, frameRate: 6 });
  }

  static useOrangeAnimation = (scene: Scene): void => {
    this.createAnimations(scene, {
      key: ItemKeys.FRUITS.ORANGE.ANIMATION_KEY,
      assetKey: ItemKeys.FRUITS.ORANGE.ASSET_KEY,
    });
  };

  static useStrawberryAnimation = (scene: Scene): void => {
    this.createAnimations(scene, {
      key: ItemKeys.FRUITS.STRAWBERRY.ANIMATION_KEY,
      assetKey: ItemKeys.FRUITS.STRAWBERRY.ASSET_KEY,
    });
  };

  static createAnimations = (
    scene: Scene,
    animation: AnimationConfig,
  ): void => {
    scene.anims.create({
      key: animation.key || animation.assetKey,
      frames: animation.frames
        ? scene.anims.generateFrameNumbers(animation.assetKey, {
            frames: animation.frames,
          })
        : scene.anims.generateFrameNumbers(animation.assetKey),
      frameRate: animation.frameRate || FRAME_RATE,
      repeat: animation.repeat || -1,
      delay: animation.delay || 0,
      yoyo: animation.yoyo || true,
    });
  };
}
