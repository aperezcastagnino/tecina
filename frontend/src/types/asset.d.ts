export type AssetConfig = {
  assetKey: string;
  animationKey?: string;
  frameWidth?: number;
  frameHeight?: number;
  starFrame?: number;
  endFrame?: number;
  frames?: number[];
  frameRate?: number;
  repeat?: number;
  delay?: number;
  yoyo?: boolean;
};
