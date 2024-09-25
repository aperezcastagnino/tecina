import { type Direction, DIRECTION } from "../common/direction";
import { TILE_SIZE } from "../config/config";
import type { Coordinate } from "../types/coordinate";

export const getTargetPosition = (
  currentPosition: Coordinate,
  direction: Direction,
) => {
  const targetPosition = { ...currentPosition };

  switch (direction) {
    case DIRECTION.DOWN:
      targetPosition.y += TILE_SIZE;
      break;
    case DIRECTION.UP:
      targetPosition.y -= TILE_SIZE;
      break;
    case DIRECTION.LEFT:
      targetPosition.x -= TILE_SIZE;
      break;
    case DIRECTION.RIGHT:
      targetPosition.x += TILE_SIZE;
      break;
    default:
      break;
  }

  return targetPosition;
};
