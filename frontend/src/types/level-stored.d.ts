import type { MapStructure } from "./map"

export type LevelData = {
    key:number,
    map?:MapStructure,
    enable: boolean,
    completed: boolean,
    active: boolean,
    nextLevel?:[number]
}