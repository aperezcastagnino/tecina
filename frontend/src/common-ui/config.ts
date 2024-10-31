export type AwardConfig = {
  scene: Phaser.Scene;
  width: number;
  padding: number;
  scale?: number;
  frameRate: number;
  assetKey: string;
  spriteConfig: Phaser.Types.Loader.FileTypes.ImageFrameConfig;
};
