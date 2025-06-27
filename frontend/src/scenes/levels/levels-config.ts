import { SceneKeys } from "scenes/scene-keys";
import type { LevelMetadata } from "types/level";

export const levelsConfig: LevelMetadata[] = [
  {
    key: SceneKeys.LEVEL_1,
    position: { x: 260, y: 420 },
    enable: true,
    nextLevel: [SceneKeys.LEVEL_2],
    previousLevel: [],
  },
  {
    key: SceneKeys.LEVEL_2,
    position: { x: 450, y: 620 },
    nextLevel: [SceneKeys.LEVEL_3, SceneKeys.LEVEL_4],
    previousLevel: [SceneKeys.LEVEL_1],
  },
  {
    key: SceneKeys.LEVEL_3,
    position: { x: 370, y: 880 },
    nextLevel: [SceneKeys.LEVEL_4],
    previousLevel: [SceneKeys.LEVEL_2],
  },
  {
    key: SceneKeys.LEVEL_4,
    position: { x: 820, y: 500 },
    nextLevel: [SceneKeys.LEVEL_5, SceneKeys.LEVEL_6],
    previousLevel: [SceneKeys.LEVEL_3],
  },
  {
    key: SceneKeys.LEVEL_5,
    position: { x: 690, y: 260 },
    nextLevel: [],
    previousLevel: [SceneKeys.LEVEL_4],
  },
  {
    key: SceneKeys.LEVEL_6,
    position: { x: 940, y: 860 },
    nextLevel: [SceneKeys.LEVEL_7],
    previousLevel: [SceneKeys.LEVEL_4],
  },
  {
    key: SceneKeys.LEVEL_7,
    position: { x: 1370, y: 500 },
    nextLevel: [SceneKeys.LEVEL_8],
    previousLevel: [SceneKeys.LEVEL_6],
  },
  {
    key: SceneKeys.LEVEL_8,
    position: { x: 1510, y: 210 },
    nextLevel: [SceneKeys.LEVEL_9],
    previousLevel: [SceneKeys.LEVEL_7],
  },
  {
    key: SceneKeys.LEVEL_9,
    position: { x: 1600, y: 860 },
    nextLevel: [SceneKeys.WIN_SCENE],
    previousLevel: [SceneKeys.LEVEL_8],
  },
];
