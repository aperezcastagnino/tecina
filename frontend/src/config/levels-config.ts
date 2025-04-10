import { SceneKeys } from "scenes/scene-keys";
import type { LevelMetadata } from "types/level-data";

export const levelsConfig: LevelMetadata[] = [
  {
    key: SceneKeys.LEVEL_1,
    position: { x: 360, y: 430 },
    enable: true,
    completed: false,
    active: false,
    nextLevel: [SceneKeys.LEVEL_2],
  },
  {
    key: SceneKeys.LEVEL_2,
    position: { x: 620, y: 650 },
    enable: false,
    completed: false,
    active: false,
    nextLevel: [],
  },
];
