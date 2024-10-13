import { type Direction, DIRECTION } from "../common/player-keys";
import { TILE_SIZE } from "../config/config";
import type { Coordinate } from "../types/coordinate";

export const getNextPosition = (
  currentPosition: Coordinate,
  direction: Direction,
) => {
  const nextPosition = { ...currentPosition };

  switch (direction) {
    case DIRECTION.DOWN:
      nextPosition.y += TILE_SIZE;
      break;
    case DIRECTION.UP:
      nextPosition.y -= TILE_SIZE;
      break;
    case DIRECTION.LEFT:
      nextPosition.x -= TILE_SIZE;
      break;
    case DIRECTION.RIGHT:
      nextPosition.x += TILE_SIZE;
      break;
    default:
      break;
  }

  return nextPosition;
};

export const arePositionsNear = (
  position1: Coordinate,
  position2: Coordinate,
  threshold: number = TILE_SIZE / 2,
) => (
    Math.abs(position1.x - position2.x) < threshold &&
    Math.abs(position1.y - position2.y) < threshold
  );
