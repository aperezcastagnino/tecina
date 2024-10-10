export type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];

export const DIRECTION = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  UP: "UP",
  DOWN: "DOWN",
  NONE: "NONE",
};

export const SPECIAL_KEYS = {
  SPACE: "SPACE",
  SHIFT: "SHIFT",
};
