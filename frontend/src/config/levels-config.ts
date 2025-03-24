import { SceneKeys } from "scenes/scene-keys";
import type { LevelData } from "types/level-stored";

export const InitialConfig: LevelData[] = [
    {
        key: 1,
        enable: false,
        completed: false,
        active: true,
        nextLevel: [2]
    },
    {
        key: 2,
        enable: false,
        completed: false,
        active: false
    }
];
