import type { Scene } from "phaser";
import type { AnimationConfig } from "types/animation";
import type { SpriteAssetConfig } from "types/asset";

export const FRAME_RATE = 24;

export class Animations {
  static animateText = (
    scene: Phaser.Scene,
    target: Phaser.GameObjects.Text,
    text: string,
    delay: number = 25,
    callback?: () => void
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
    frames: number[]
  ) {
    this.createAnimations(scene, { key, assetKey, frames });
  }

  static animateItem = (scene: Scene, element: SpriteAssetConfig): void => {
    this.createAnimations(scene, {
      key: element.ANIMATION_KEY,
      assetKey: element.ASSET_KEY,
    });
  };

  static createAnimations = (
    scene: Scene,
    animation: AnimationConfig
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
