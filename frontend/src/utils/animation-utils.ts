export const animateText = (
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
      if (i > text.length && callback) {
        callback();
      }
    },
    repeat: text.length - 1,
    delay,
  });
};
