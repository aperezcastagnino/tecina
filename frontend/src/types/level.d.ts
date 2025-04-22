import type { MapStructure } from "./map";

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

export type LevelConfig = MapConfiguration & {
  itemsToHide?: string[];
  itemsToAnimate?: string[];
  itemsToMakeDraggable?: string[];
  onPreload?: (scene: Phaser.Scene) => Promise<void>;
  onCreate?: (scene: Phaser.Scene) => Promise<void>;
};
