import type { MapStructure } from "./map";

export type LevelMetadata = {
  key: string;
  position: {
    x: number;
    y: number;
  };
  map?: MapStructure;
  enable: boolean;
  completed: boolean;
  active: boolean;
  nextLevel?: string[];
};
