import { Direction, DIRECTION } from "../common/Direction";
import { TILE_SIZE } from "../config/Config";
import { Coordinate } from "../types/Coordinate";

export const getTargetPositionFromPositionAndDirection = (
  currentPosition: Coordinate,
  direction: Direction
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
  }

  return targetPosition;
};
