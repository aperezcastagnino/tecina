import type { Scene } from "phaser";
import type { AssetConfig } from "types/asset";

export const FRAME_RATE = 24;

export class AnimationManager {
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
    this.createAnimation(scene, {
      assetKey,
      animationKey: key,
      frames,
    });
  }

  static createAnimation = (scene: Scene, sprite: AssetConfig): void => {
    scene.anims.create({
      key: sprite.animationKey || sprite.assetKey,
      frames: sprite.frames
        ? scene.anims.generateFrameNumbers(sprite.assetKey, {
            frames: sprite.frames,
          })
        : scene.anims.generateFrameNumbers(sprite.assetKey),
      frameRate: sprite.frameRate || FRAME_RATE,
      repeat: sprite.repeat || -1,
      delay: sprite.delay || 0,
      yoyo: sprite.yoyo || true,
    });
  };
}
