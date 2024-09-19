import Phaser from 'phaser';

export function animateText(scene : Phaser.Scene, target: Phaser.GameObjects.Text, text: string, config : any) {
  const length = text.length;
  let i = 0;
  scene.time.addEvent({
    callback: () => {
      target.text += text[i];
      ++i;
      if (i === length - 1 && config?.callback) {
        config.callback();
      }
    },
    repeat: length - 1,
    delay: config?.delay || 25,
  });
}