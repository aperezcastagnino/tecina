import Phaser from "phaser";

type AnimateTextConfig = {
  delay?: number;
  callback?: Function;
};

export const animateText = (
  scene: Phaser.Scene,
  target: Phaser.GameObjects.Text,
  text: string,
  config: AnimateTextConfig,
) => {
  const { delay = 25, callback } = config || {};
  let i = 0;
  scene.time.addEvent({
    callback: () => {
      // eslint-disable-next-line no-param-reassign
      target.text += text[i];

      i += 1;
      if (i > text.length && callback) {
        callback();
      }
    },
    repeat: text.length - 1,
    delay,
  });
};
