export type Animation = {
  key: string;
  assetKey: string;
  frames?: number[];
  frameRate: number;
  repeat: number;
  delay: number;
  yoyo: boolean;
};
