import type { MinimalMapConfiguration, MapStructure } from "./map";

export type LevelMetadata = {
  key: string;
  position: {
    x: number;
    y: number;
  };
  map?: MapStructure;
  enable?: boolean;
  completed?: boolean;
  active?: boolean;
  nextLevel?: string[];
};

export type LevelConfig = MinimalMapConfiguration & {
  onPreload?: (scene: Phaser.Scene) => Promise<void>;
  onCreate?: (scene: Phaser.Scene) => Promise<void>;
};
