export type Direction = (typeof DIRECTION)[keyof typeof DIRECTION];
export type SpecialKeys = (typeof SPECIAL_KEYS)[keyof typeof SPECIAL_KEYS];
export type PlayerKeys = Direction | SpecialKeys;

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

export const PLAYER_KEYS = {
  ...DIRECTION,
  ...SPECIAL_KEYS,
};
