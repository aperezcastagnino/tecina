export const BackgroundKeys = {
  MAIN_MENU: "MAIN_MENU_BACKGROUND",
  LEVELS: "LEVELS_BACKGROUND",
};

export const CharacterAssets = {
  PLAYER: "PLAYER",
  NPC: "NPC",
  OLD_MAN: {
    ASSET_KEY: "NPC",
    FRAME: 10,
  },
  GUY: {
    ASSET_KEY: "NPC",
    FRAME: 20,
  },
  GIRL: {
    ASSET_KEY: "NPC",
    FRAME: 30,
  },
  GOBLIN: {
    ASSET_KEY: "NPC",
    FRAME: 100,
  },
  WARRIOR: {
    ASSET_KEY: "NPC",
    FRAME: 110,
  },
  VIKING: {
    ASSET_KEY: "NPC",
    FRAME: 130,
  },
  WIZARD: {
    ASSET_KEY: "NPC",
    FRAME: 140,
  },
  DETECTIVE: {
    ASSET_KEY: "NPC",
    FRAME: 150,
  },
};
export const UIComponentKeys = {
  CURSOR: "CURSOR",
  BUTTON_CIRCLE: "BUTTON_CIRCLE",
  BUTTON_SHADOW: "BUTTON_SHADOW",
  BUTTON_YES: "BUTTON_YES",
  BUTTON_NO: "BUTTON_NO",
  HEALTH_BAR: {
    LEFT: {
      ASSET_KEY: "HEALTH_BAR_FILL_LEFT",
      WIDTH: 235,
    },
    RIGHT: {
      ASSET_KEY: "HEALTH_BAR_FILL_RIGHT",
      WIDTH: 690,
    },
    BACKGROUND: {
      ASSET_KEY: "HEALTH_BAR_BACKGROUND",
      WIDTH: 928,
    },
  },
  TITLE: "TITLE",
  START_BUTTON: "START_BUTTON",
  LOAD_BUTTON: "LOAD_BUTTON",
  CROSS: "CROSS",
  INSTRUCTIONS: "INSTRUCTIONS",
  GAME_OVER: "GAME_OVER",
  WIN_TITLE: "WIN_TITLE",
};

export const TileKeys = {
  GRASS: "GRASS",
  TREE: "TREE",
  FLOWER_GRASS: "FLOWER_GRASS",
};

export const FruitAssets = {
  APPLE: {
    assetKey: "APPLE",
    animationKey: "APPLE_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
  },
  BANANAS: {
    assetKey: "BANANAS",
    animationKey: "BANANAS_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
  },
  CHERRIES: {
    assetKey: "CHERRIES",
    animationKey: "CHERRIES_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
  },
  KIWI: {
    assetKey: "KIWI",
    animationKey: "KIWI_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
  },
  MELON: {
    assetKey: "MELON",
    animationKey: "MELON_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
  },
  ORANGE: {
    assetKey: "ORANGE",
    animationKey: "ORANGE_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
  },
  PINEAPPLE: {
    assetKey: "PINEAPPLE",
    animationKey: "PINEAPPLE_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
  },
  STRAWBERRY: {
    assetKey: "STRAWBERRY",
    animationKey: "STRAWBERRY_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
  },
} as const;

export const AnimalAssets = {
  BUNNY: {
    assetKey: "BUNNY",
    animationKey: "BUNNY_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 6,
  },
  CAT: {
    assetKey: "CAT",
    animationKey: "CAT_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
  },
  CHICKEN: {
    assetKey: "CHICKEN",
    animationKey: "CHICKEN_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
  },
  DEER: {
    assetKey: "DEER",
    animationKey: "DEER_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 3,
  },
  FOX: {
    assetKey: "FOX",
    animationKey: "FOX_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 3,
  },
  FROG: {
    assetKey: "FROG",
    animationKey: "FROG_ANIMATION",
    frameWidth: 32,
    frameHeight: 32,
    starFrame: 0,
    endFrame: 17,
  },
  PIGEON: {
    assetKey: "PIGEON",
    animationKey: "PIGEON_ANIMATION",
    frameWidth: 16,
    frameHeight: 16,
    starFrame: 0,
    endFrame: 17,
  },
} as const;

export const ItemAssets = {
  ...FruitAssets,
  ...AnimalAssets,
} as const;

export type AssetKey = keyof typeof ItemAssets;
