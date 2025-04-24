import { SceneKeys } from "scenes/scene-keys";
import type { LevelMetadata } from "types/level";

export const levelsConfig: LevelMetadata[] = [
  {
    key: SceneKeys.LEVEL_1,
    position: { x: 260, y: 420 },
    enable: true,
    nextLevel: [SceneKeys.LEVEL_2],
  },
  {
    key: SceneKeys.LEVEL_2,
    position: { x: 450, y: 620 },
    nextLevel: [SceneKeys.LEVEL_3],
  },
  {
    key: SceneKeys.LEVEL_3,
    position: { x: 820, y: 500 },
    nextLevel: [SceneKeys.WIN_SCENE],
  },
  /* 

  {
    key: SceneKeys.LEVEL_4,
    position: { x: 690, y: 260 },
    enable: false,
    completed: false,
    active: false,
    nextLevel: [SceneKeys.LEVEL_5],
  },
  {
    key: SceneKeys.LEVEL_5,
    position: { x: 1370, y: 500 },
    enable: false,
    completed: false,
    active: false,
    nextLevel: [SceneKeys.LEVEL_6],
  },
  {
    key: SceneKeys.LEVEL_6,
    position: { x: 1510, y: 210 },
    enable: false,
    completed: false,
    active: false,
    nextLevel: [SceneKeys.LEVEL_7],
  },
  {
    key: SceneKeys.LEVEL_7,
    position: { x: 940, y: 860 },
    enable: false,
    completed: false,
    active: false,
    nextLevel: [],
  },
  */
];
