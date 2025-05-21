import { SceneKeys } from "scenes/scene-keys";

// GENERAL
export const GAME_DIMENSIONS = {
  WIDTH: 1920,
  HEIGHT: 1040,
};
export const TILE_SIZE = 90;
export const DEBUG_MODE_ACTIVE = 0;
export const FIRST_SCENE_TO_PLAY = SceneKeys.LEVEL_1; // this is not working
export const PLAYER_VELOCITY = 500;

// MAP
export const MAP_WIDTH = 24;
export const MAP_HEIGHT = 24;
export const MIN_PARTITION_SIZE = 5; // MIN_PARTITION_SIZE < MIN(MAP_WIDTH, MAP_HEIGHT) / 2
export const MIN_ROOM_SIZE = 5; // MIN_ROOM_SIZE < MIN(MAP_WIDTH, MAP_HEIGHT) / 2

// DEPTH VALUES
export const DEPTH_1 = 100;
